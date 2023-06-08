class Utils:
    @staticmethod
    def load_airports(data):
        airports = []
        
        for airport in data:
            dict_airport = {
                'name': airport[0],
                'id': airport[1],
                'location.': airport[2],
                'iata': airport[3]
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