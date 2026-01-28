# Exif Cleaner for Seeker

一款注重隱私的移動工具，旨在您於網上分享照片之前，刪除照片中的元數據（Exif 數據）。

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## 為什麼選擇開源？

**您的隱私是我們的首要任務。**
我們相信處理敏感數據的工具應該是透明的。通過開源這個項目，我們允許任何人檢查代碼並驗證：
- **沒有數據上傳：** 所有處理均在您的設備上 100% 本地進行。
- **沒有隱藏追蹤：** 我們只是刪除元數據並將乾淨的圖像保存回您的圖庫。

## 功能

- **刪除 Exif 數據：** 刪除 GPS 位置、相機設置和其他元數據。
- **離線處理：** 無需互聯網連接。您的照片永遠不會離開您的手機。
- **批量處理：** 一次選擇並清理多張圖像。
- **多語言支持：** 英語、日語、法語、德語、義大利語、西班牙語、中文（繁體/簡體）、韓語、阿拉伯語。
- **深色模式：** 完全支持。
- **支持開發者：** 捐贈 SOL 以支持項目的選項。

## 運作方式

1. 從您的圖庫中選擇照片。
2. 應用程序創建一個沒有元數據的干淨副本。
3. 將乾淨的副本保存到您的圖庫或直接分享。

## 開發

本項目使用 [Expo](https://expo.dev) 和 React Native 構建。

```bash
# 安裝依賴項
npm install

# 啟動應用程序
npx expo start
```

## 構建 (Build)

### Android

```bash
# Preview build (測試用 APK)
npx eas-cli build -p android --profile preview

# Production build (Google Play 用 AAB)
npx eas-cli build -p android --profile production
```

> **Windows 用戶注意事項：**
> 如果遇到 PowerShell 安全錯誤，請在命令前加上 `cmd /c`：
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
