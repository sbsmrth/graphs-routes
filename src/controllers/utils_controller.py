from tempfile import NamedTemporaryFile
import shutil
import csv
class Utils:
    @staticmethod
    def load_airports(data):
        airports = []
        
        for airport in data:
            dict_airport = {
                'name': airport[0],
                'iata': airport[1],
                'location.': airport[2]
            }

            airports.append(dict_airport)
        
        return airports

    @staticmethod
    def load_routes(data):
        routes = []
        
        for route in data:
            dict_route = {
                'origin': route[0],
                'destination': route[1],
                'time': int(route[2]),
                'distance': int(route[3])
            }

            routes.append(dict_route)
        
        return routes
    
    @staticmethod
    def edit_route(new_row):
        modified_rows = []
        with open('./src/data/routes.csv', 'r', newline='') as f:
            csv_reader = csv.reader(f)
            for row in csv_reader:
                if row[0] == new_row[0] and row[1] == new_row[1]:
                    modified_rows.append(new_row)
                else:
                    modified_rows.append(row)

        with open('./src/data/routes.csv', 'w', newline='') as f:
            csv_writer = csv.writer(f)
            csv_writer.writerows(modified_rows)
