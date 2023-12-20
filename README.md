# Lerngalerie Project

## Overview

Lerngalerie ist eine Website, die das lernen von Gebärden ermöglicht/erleichtert. Aktuell läuft diese Website öffentlich auf [oegs.duckdns.org](https://oegs.duckdns.org).

Entwickelt wurde diese Website für die TU Graz Lehrveranstaltung ["Österreichische Gebärdensprache für TechnikerInnen A1/1"](https://www.tugraz.at/studium/studieren-an-der-tu-graz/studierende/sprachen-lernen-an-der-tu-graz/sprachangebot) im Wintersemester 2023.

## Technische Details

Die Website an sich ist eine NodeJS Anwendung, bestehend aus:

- **Server**: Der Server-Teil der Anwendung befindet sich im [/src-Verzeichnis](./src/) und ist mit Express, einem Web-Framework für NodeJS, entwickelt. Dieser Teil der Anwendung ist verantwortlich für die Serverseitige Logik und das Handling von Anfragen. Server-Code wird am Server ausgeführt.
- **Client**: Der Client-Teil der Anwendung befindet sich im [/public-Verzeichnis](./public/) und besteht aus einer Kombination von HTML, CSS und JavaScript. Diese Technologien bilden die Grundlage der Benutzeroberfläche und Interaktionen auf der Nutzerseite. Client-Code wird am Benutzergerät ausgeführt.

Die Website ist öffentlich zugänglich, da sie auf einem Server gehostet wird, der über das Internet erreichbar ist. Damit man nicht die (sich verändernde) IP-Addresse vom Server braucht, um die Website zu besuchen, wandelt DuckDNS automatisch (und kostenlos) die Domain oegs.duckdns.org in die aktuelle IP-Adresse des Servers um.

## Gebärden

Die Datei [signs.json](./public/signs.json) beinhaltet alle Gebärden + Kategorien. Aus dieser Datei baut sich der [ContentLoader.js](./public/js/ContentLoader.js) die Website auf.

Die konvertierung von einer Excel-Datei (Liste von Kategorien+Vokabeln+Gebärden-Link) in die signs.json wird aktuell mit einem semi-automatischen Python-Skript durchgeführt.

## Features

- Alle Gebärden mit Begriffen gruppiert nach Kategorie anzeigen.
- Videos (Gebärden) verschwommen anzeigen, bis man mit der Maus über das Video geht. So kann man perfekt durch überlegen -> kontrollieren lernen.
- Begriffe (Vokabeln) verschwommen anzeigen.
- Nach Gebärden suchen.
- Gebärden pro Kategorie in zufälliger Reihenfolge anzeigen.
- Gebärden in zufälliger Reihenfolge anzeigen (ohne Kategorien).

## Lokal aufsetzen

Um die Website lokal auszuführen, muss man das Repository klonen (herunterladen), und dann die Anwendung mit dem Befehl `node src/app.js` im Lerngalerie-Ordner starten. Die Website ist dann unter [localhost:3000](http://localhost:3000) erreichbar.

Fehler beim ausführen weisen darauf hin, welche Technologien noch installiert werden müssen. (NodeJS, npm, express, ...)
