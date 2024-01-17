import json
import os
import requests
from bs4 import BeautifulSoup

def download_videos(json_file_path, video_folder):
    with open(json_file_path, 'r', encoding='utf-8') as jsonfile:
        data = json.load(jsonfile)

        for category in data:
            for sign in data[category]:
                sign_url = sign['url']
                sign_id = sign['url'].split('/')[-1]
                video_filename = f"{sign_id}.mp4"
                video_path = os.path.join(video_folder, video_filename)

                if not os.path.exists(video_path):
                    # Herunterladen des HTML-Inhalts der Seite
                    response = requests.get(sign_url)
                    if response.status_code == 200:
                        soup = BeautifulSoup(response.content, 'html.parser')
                        video_tag = soup.find('video', {'class': 'signvideo'})

                        if video_tag and video_tag.get('src'):
                            video_src = video_tag['src']
                            video_url = f"https://suche.machs-auf.at{video_src}"
                            print(f"Downloading video: {video_url}")

                            # Herunterladen des Videos
                            video_response = requests.get(video_url, stream=True)
                            if video_response.status_code == 200:
                                with open(video_path, 'wb') as file:
                                    for chunk in video_response.iter_content(1024):
                                        file.write(chunk)
                            else:
                                print(f"Failed to download video: {video_url}")
                    else:
                        print(f"Failed to retrieve HTML for {sign_url}")
                else:
                    print(f"Video already exists: {video_filename}")

# Pfad zur signs.json und zum Video-Ordner
json_file_path = 'public/signs.json'
video_folder = 'public/mp4'

# Ausführen der Funktion
download_videos(json_file_path, video_folder)
