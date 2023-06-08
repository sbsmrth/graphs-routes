import eel
from src.controllers.csv_controller import FileCSV
from src.controllers.utils_controller import Utils

# routes
routes_csv = FileCSV.read_csv('routes.csv', ',')
routes = Utils.load_routes(routes_csv)

# airports
airports_csv = FileCSV.read_csv('airports.csv', ',')
airports = Utils.load_airports(airports_csv)

eel.init("web")

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
        'location.': row[2]
    })

@eel.expose
def get_airports():

    return airports

eel.start("index.html")