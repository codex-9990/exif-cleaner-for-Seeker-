# Exif Cleaner for Seeker

A lightweight photo metadata cleaner designed for users who care about OpSec and privacy.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

This app removes identifying metadata from photos **locally on your device**, before sharing them on platforms like X or Discord.

**No tracking. No uploads. Fully offline.**

---

## ✨ Features

- **Remove location data (GPS)**
- **Remove device and camera identifiers**
- **Remove software tags** such as "Taken on Seeker"
- **Offline processing** (no network uploads)
- **No analytics, no trackers**
- **Multi-language Support:** English, Japanese, French, German, Italian, Spanish, Chinese (Traditional/Simplified), Korean, Arabic.
- **Dark Mode:** Fully supported.

---

## 🔐 Why this exists

Photos often contain hidden metadata that can reveal:
- where they were taken
- when they were taken
- which device or camera was used

For users of **Solana Mobile Seeker**, this can include metadata like:
- device model
- camera software
- strings such as `"Taken on Seeker"`

This app helps reduce accidental metadata leaks before sharing images publicly.

---

## 🛡 Privacy & Security

- All processing is done **locally on-device**
- The app does **not** upload photos anywhere
- No accounts, no wallets, no blockchain interaction
- Minimal Android permissions, only what is required for media access

---

## 📱 Permissions

The app only requests permissions necessary to access and clean photo metadata:
- **Media access (images/videos):** To read and save photos.
- **No microphone**
- **No camera**
- **No overlay permissions**

---

## ⚠️ Important Notes

- This app removes **metadata**, not visual characteristics of photos.
- It cannot guarantee full anonymity or prevent all forms of device fingerprinting.
- Intended as an **OpSec hygiene tool**, not a privacy silver bullet.

---

## 🧪 Built With

- Expo (React Native)
- Android (APK distribution)

---

## Development

This project is built with [Expo](https://expo.dev) and React Native.

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

## Build

### Android

```bash
# Preview build (APK for testing)
npx eas-cli build -p android --profile preview

# Production build (AAB for Google Play)
npx eas-cli build -p android --profile production
```

> **Note for Windows Users:**
> If you encounter a PowerShell security error, prepend `cmd /c` to the command:
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```

---

## 📄 License

MIT License
