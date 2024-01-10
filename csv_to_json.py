import csv
import json

def csv_to_json(csv_file_path, json_file_path):
    data = {}
    current_category = ""
    
    with open(csv_file_path, mode='r', encoding='utf-8') as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            # Bestimmen der aktuellen Kategorie
            if row['Category'].strip():
                current_category = row['Category'].strip()
                data[current_category] = []

            # Extrahieren der SignID und Erstellen des Dateinamens
            sign_id = row['URL'].split('/')[-1]
            filename = f"{sign_id}.mp4"

            # Hinzufügen des Eintrags zur aktuellen Kategorie
            data[current_category].append({
                'title': row['Title'],
                'url': row['URL'],
                'signID': sign_id,
                'filename': filename
            })

    # Speichern als JSON
    with open(json_file_path, 'w', encoding='utf-8') as jsonfile:
        json.dump(data, jsonfile, indent=4)
    
    print("Done.")

# Pfad zu Ihrer CSV-Datei und zum Ziel-JSON
csv_file_path = 'data.csv'
json_file_path = 'signs.json'

# Konvertierungsfunktion ausführen
csv_to_json(csv_file_path, json_file_path)

