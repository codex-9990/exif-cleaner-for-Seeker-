# Exif Cleaner for Seeker

Un outil mobile axé sur la confidentialité conçu pour supprimer les métadonnées (données Exif) de vos photos avant de les partager en ligne.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## Pourquoi l'Open Source ?

**Votre confidentialité est notre priorité.**
Nous croyons que les outils manipulant des données sensibles doivent être transparents. En rendant ce projet open source, nous permettons à quiconque d'inspecter le code et de vérifier que :
- **Aucune donnée n'est téléchargée :** Tout le traitement se fait à 100 % localement sur votre appareil.
- **Pas de suivi caché :** Nous supprimons simplement les métadonnées et enregistrons l'image propre dans votre bibliothèque.

## Fonctionnalités

- **Supprimer les données Exif :** Supprime la localisation GPS, les paramètres de l'appareil photo et autres métadonnées.
- **Traitement hors ligne :** Aucune connexion Internet requise. Vos photos ne quittent jamais votre téléphone.
- **Traitement par lot :** Sélectionnez et nettoyez plusieurs images à la fois.
- **Support multilingue :** Anglais, Japonais, Français, Allemand, Italien, Espagnol, Chinois (Traditionnel/Simplifié), Coréen, Arabe.
- **Mode sombre :** Entièrement pris en charge.
- **Soutenir le développeur :** Option de faire un don en SOL pour soutenir le projet.

## Comment ça marche

1. Sélectionnez des photos dans votre galerie.
2. L'application crée une copie propre sans métadonnées.
3. Enregistrez la copie propre dans votre galerie ou partagez-la directement.

## Développement

Ce projet est construit avec [Expo](https://expo.dev) et React Native.

```bash
# Installer les dépendances
npm install

# Lancer l'application
npx expo start
```

## Construction (Build)

### Android

```bash
# Preview build (APK pour test)
npx eas-cli build -p android --profile preview

# Production build (AAB pour Google Play)
npx eas-cli build -p android --profile production
```

> **Note pour les utilisateurs Windows :**
> Si vous rencontrez une erreur de sécurité PowerShell, ajoutez `cmd /c` au début de la commande :
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
