# Verwenden Sie das offizielle Node.js-Bild als Basis
FROM node:14

# Erstellen Sie ein Verzeichnis für die App-Dateien
WORKDIR /usr/src/app

# Kopieren Sie die package.json (und package-lock.json, falls vorhanden)
COPY package*.json ./

# Installieren Sie die Node.js-Abhängigkeiten
RUN npm install

# Kopieren Sie den App-Code in das Container-Verzeichnis
COPY . .

# Öffnen Sie den Port, auf dem der Server läuft
EXPOSE 3000

# Starten Sie die App
CMD ["node", "src/app.js"]
