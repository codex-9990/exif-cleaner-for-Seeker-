# Exif Cleaner for Seeker

Ein datenschutzorientiertes mobiles Tool, das entwickelt wurde, um Metadaten (Exif-Daten) aus Ihren Fotos zu entfernen, bevor Sie sie online teilen.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## Warum Open Source?

**Ihre Privatsphäre ist unsere Priorität.**
Wir glauben, dass Tools, die sensible Daten verarbeiten, transparent sein sollten. Indem wir dieses Projekt Open Source machen, ermöglichen wir jedem, den Code zu überprüfen und sicherzustellen, dass:
- **Keine Daten hochgeladen werden:** Die gesamte Verarbeitung erfolgt zu 100 % lokal auf Ihrem Gerät.
- **Kein verstecktes Tracking:** Wir entfernen einfach die Metadaten und speichern das bereinigte Bild in Ihrer Bibliothek.

## Funktionen

- **Exif-Daten entfernen:** Entfernt GPS-Standort, Kameraeinstellungen und andere Metadaten.
- **Offline-Verarbeitung:** Keine Internetverbindung erforderlich. Ihre Fotos verlassen niemals Ihr Telefon.
- **Stapelverarbeitung:** Wählen Sie mehrere Bilder aus und bereinigen Sie sie gleichzeitig.
- **Mehrsprachige Unterstützung:** Englisch, Japanisch, Französisch, Deutsch, Italienisch, Spanisch, Chinesisch (Traditionell/Vereinfacht), Koreanisch, Arabisch.
- **Dunkelmodus:** Vollständig unterstützt.
- **Unterstützen Sie den Entwickler:** Option, SOL zu spenden, um das Projekt zu unterstützen.

## Wie es funktioniert

1. Wählen Sie Fotos aus Ihrer Galerie aus.
2. Die App erstellt eine saubere Kopie ohne Metadaten.
3. Speichern Sie die saubere Kopie in Ihrer Galerie oder teilen Sie sie direkt.

## Entwicklung

Dieses Projekt wurde mit [Expo](https://expo.dev) und React Native erstellt.

```bash
# Abhängigkeiten installieren
npm install

# App starten
npx expo start
```

## Build

### Android

```bash
# Preview build (APK zum Testen)
npx eas-cli build -p android --profile preview

# Production build (AAB für Google Play)
npx eas-cli build -p android --profile production
```

> **Hinweis für Windows-Benutzer:**
> Wenn ein PowerShell-Sicherheitsfehler auftritt, stellen Sie `cmd /c` vor den Befehl:
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
