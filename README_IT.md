# Exif Cleaner for Seeker

Uno strumento mobile incentrato sulla privacy progettato per rimuovere i metadati (dati Exif) dalle tue foto prima di condividerle online.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## Perché Open Source?

**La tua privacy è la nostra priorità.**
Crediamo che gli strumenti che gestiscono dati sensibili debbano essere trasparenti. Rendendo questo progetto open source, permettiamo a chiunque di ispezionare il codice e verificare che:
- **Nessun dato viene caricato:** Tutta l'elaborazione avviene al 100% localmente sul tuo dispositivo.
- **Nessun tracciamento nascosto:** Rimuoviamo semplicemente i metadati e salviamo l'immagine pulita nella tua libreria.

## Caratteristiche

- **Rimuovi dati Exif:** Elimina posizione GPS, impostazioni della fotocamera e altri metadati.
- **Elaborazione offline:** Nessuna connessione Internet richiesta. Le tue foto non lasciano mai il tuo telefono.
- **Elaborazione batch:** Seleziona e pulisci più immagini contemporaneamente.
- **Supporto multilingue:** Inglese, Giapponese, Francese, Tedesco, Italiano, Spagnolo, Cinese (Tradizionale/Semplificato), Coreano, Arabo.
- **Modalità scura:** Completamente supportata.
- **Supporta lo sviluppatore:** Opzione per donare SOL per supportare il progetto.

## Come funziona

1. Seleziona le foto dalla tua galleria.
2. L'app crea una copia pulita senza metadati.
3. Salva la copia pulita nella tua galleria o condividila direttamente.

## Sviluppo

Questo progetto è costruito con [Expo](https://expo.dev) e React Native.

```bash
# Installare le dipendenze
npm install

# Avviare l'app
npx expo start
```

## Build

### Android

```bash
# Preview build (APK per test)
npx eas-cli build -p android --profile preview

# Production build (AAB per Google Play)
npx eas-cli build -p android --profile production
```

> **Nota per utenti Windows:**
> Se riscontri un errore di sicurezza PowerShell, aggiungi `cmd /c` all'inizio del comando:
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
