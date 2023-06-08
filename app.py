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
def append_to_csv(file_name, rows):
    FileCSV.append_to_csv(file_name, rows)

@eel.expose
def get_airports():

    return airports

eel.start("index.html")