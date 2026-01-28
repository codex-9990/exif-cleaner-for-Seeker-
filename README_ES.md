# Exif Cleaner for Seeker

Una herramienta móvil centrada en la privacidad diseñada para eliminar metadatos (datos Exif) de tus fotos antes de compartirlas en línea.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## ¿Por qué Open Source?

**Tu privacidad es nuestra prioridad.**
Creemos que las herramientas que manejan datos sensibles deben ser transparentes. Al hacer este proyecto de código abierto, permitimos que cualquiera inspeccione el código y verifique que:
- **No se suben datos:** Todo el procesamiento ocurre 100% localmente en tu dispositivo.
- **Sin rastreo oculto:** Simplemente eliminamos los metadatos y guardamos la imagen limpia en tu biblioteca.

## Características

- **Eliminar datos Exif:** Elimina la ubicación GPS, la configuración de la cámara y otros metadatos.
- **Procesamiento sin conexión:** No se requiere conexión a Internet. Tus fotos nunca salen de tu teléfono.
- **Procesamiento por lotes:** Selecciona y limpia múltiples imágenes a la vez.
- **Soporte multilingüe:** Inglés, Japonés, Francés, Alemán, Italiano, Español, Chino (Tradicional/Simplificado), Coreano, Árabe.
- **Modo oscuro:** Totalmente compatible.
- **Apoya al desarrollador:** Opción para donar SOL para apoyar el proyecto.

## Cómo funciona

1. Selecciona fotos de tu galería.
2. La aplicación crea una copia limpia sin metadatos.
3. Guarda la copia limpia en tu galería o compártela directamente.

## Desarrollo

Este proyecto está construido con [Expo](https://expo.dev) y React Native.

```bash
# Instalar dependencias
npm install

# Iniciar la aplicación
npx expo start
```

## Build

### Android

```bash
# Preview build (APK para pruebas)
npx eas-cli build -p android --profile preview

# Production build (AAB para Google Play)
npx eas-cli build -p android --profile production
```

> **Nota para usuarios de Windows:**
> Si encuentras un error de seguridad de PowerShell, agrega `cmd /c` al principio del comando:
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
