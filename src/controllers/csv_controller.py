import csv

class FileCSV:
    @staticmethod
    def append_to_csv(path, rows):
        with open(path, 'a', newline='') as f:
            writer = csv.writer(f)
            writer.writerows(rows)

    def read_csv(path, delimit):
        rows = []

        with open(path) as csv_file:
            csv_reader = csv.reader(csv_file, delimiter=delimit)
            line_count = 0

            for row in csv_reader:
                if line_count != 0:
                    rows.append(row)
                
                line_count += 1

        return rows
