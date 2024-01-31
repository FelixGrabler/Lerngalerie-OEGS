import csv
import json


def csv_to_json(csv_file_path, json_file_path):
    data = {}
    current_category = ""

    with open(csv_file_path, mode="r", encoding="utf-8") as csvfile:
        csvreader = csv.DictReader(csvfile)
        for row in csvreader:
            # Determine the current category
            if row["Category"].strip():
                current_category = row["Category"].strip()
                data[current_category] = []

            # Extract the SignID and create the filename
            sign_id = row["URL"].split("/")[-1]
            filename = f"{sign_id}.mp4"

            # Add the entry to the current category
            data[current_category].append(
                {
                    "title": row["Title"],
                    "url": row["URL"],
                    "signID": sign_id,
                    "filename": filename,
                }
            )

    # Reverse the order of categories
    data = {k: data[k] for k in reversed(data)}

    # Save as JSON
    with open(json_file_path, "w", encoding="utf-8") as jsonfile:
        json.dump(data, jsonfile, indent=4)

    print("Done.")


# Path to your CSV file and destination JSON
csv_file_path = "public/data.csv"
json_file_path = "public/signs.json"

# Execute the conversion function
csv_to_json(csv_file_path, json_file_path)
