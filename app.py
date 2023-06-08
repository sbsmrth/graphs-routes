import eel
from src.controllers.csv_controller import FileCSV
from src.controllers.utils_controller import Utils

# routes
routes_csv = FileCSV.read_csv('./src/data/routes.csv', ',')
routes = Utils.load_routes(routes_csv)

# airports
airports_csv = FileCSV.read_csv('./src/data/airports.csv', ',')
airports = Utils.load_airports(airports_csv)

eel.init("web")


eel.start("index.html")