# Exif Cleaner for Seeker

A privacy-focused mobile tool designed to remove metadata (Exif data) from your photos before sharing them online. 

## Why Open Source?

**Your Privacy is Our Priority.**
We believe that tools handling sensitive data should be transparent. By making this project open source, we allow anyone to inspect the code and verify that:
- **No data is uploaded:** All processing happens 100% locally on your device.
- **No hidden tracking:** We simply remove the metadata and save the clean image back to your library.

## Features

- **Remove Exif Data:** Strips GPS location, camera settings, and other metadata.
- **Offline Processing:** No internet connection required. Your photos never leave your phone.
- **Batch Processing:** Select and clean multiple images at once.
- **Multi-language Support:** English, Japanese, French, German, Italian, Spanish, Chinese (Traditional/Simplified), Korean, Arabic.
- **Dark Mode:** Fully supported.

## How it works

1. Select photos from your gallery.
2. The app creates a clean copy without metadata.
3. Save the clean copy to your gallery or share it directly.

## Development

This project is built with [Expo](https://expo.dev) and React Native.

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```
