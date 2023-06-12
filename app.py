import eel
from src.controllers.csv_controller import FileCSV
from src.controllers.utils_controller import Utils
from src.graphs.graph import GraphClass

def set_routes():
    routes_csv = FileCSV.read_csv('routes.csv', ',')
    routes = Utils.load_routes(routes_csv)

    return [routes_csv, routes]

def set_airports():
    airports_csv = FileCSV.read_csv('airports.csv', ',')
    airports = Utils.load_airports(airports_csv)

    return [airports_csv, airports]

win_width = None
win_height = None

all_routes = set_routes()
routes_csv = all_routes[0]
routes = all_routes[1]

all_airports = set_airports()
airports_csv = all_airports[0]
airports = all_airports[1]

eel.init("web")

@eel.expose
def set_win_size(w, h):
    global win_width
    global win_height

    win_width = w
    win_height = h

@eel.expose
def add_route(file_name, rows):
    global routes
    row = rows[0]

    for r in routes:
        if r['origin'] == row[0] and r['destination'] == row[1]:
            return
        
    FileCSV.append_to_csv(file_name, rows)
    routes.append({
        'origin': row[0],
        'destination': row[1],
        'time': int(row[2]),
        'distance': int(row[3])
    })

    return routes

@eel.expose
def add_airport(file_name, rows):
    global airports
    row = rows[0]

    for a in airports:
        if a['iata'] == row[1]:
            return
        
    FileCSV.append_to_csv(file_name, rows)
    airports.append({
        'name': row[0],
        'iata': row[1],
        'location': row[2]
    })

    return airports

@eel.expose
def edit_route(row):
    Utils.edit_route(row)
    return set_routes()[1]

@eel.expose
def get_airports():

    return airports

@eel.expose
def get_routes():

    return routes

@eel.expose
def shortes_path_gph(routes, origin, destination, option):  

    graph = GraphClass()

    for r in routes:
        graph.add_edge(r["origin"], r["destination"], r[option])

    shortest_path = graph.dijkstra(origin, destination)
    graph.short_path_network(shortest_path)

@eel.expose
def full_graph(option):
    global routes
    graph = GraphClass()

    for r in routes:
        graph.add_edge(r["origin"], r["destination"], r[option])
    
    graph.complete_graph()

eel.start("index.html", size=(1366, 768))