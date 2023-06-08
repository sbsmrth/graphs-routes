import csv
class FileCSV:
    @staticmethod
    def append_to_csv(file_name, rows):
        with open(f"./src/data/{file_name}", 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(rows)

    @staticmethod
    def read_csv(file_name, delimit):
        rows = []

        with open(f"./src/data/{file_name}") as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=delimit)
            line_count = 0

            for row in csv_reader:
                if line_count != 0:
                    rows.append(row)
                
                line_count += 1

        return rows
