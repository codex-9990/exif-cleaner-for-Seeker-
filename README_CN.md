# Exif Cleaner for Seeker

一款注重隐私的移动工具，旨在您于网上分享照片之前，删除照片中的元数据（Exif 数据）。

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## 为什么选择开源？

**您的隐私是我们的首要任务。**
我们相信处理敏感数据的工具应该是透明的。通过开源这个项目，我们允许任何人检查代码并验证：
- **没有数据上传：** 所有处理均在您的设备上 100% 本地进行。
- **没有隐藏追踪：** 我们只是删除元数据并将干净的图像保存回您的图库。

## 功能

- **删除 Exif 数据：** 删除 GPS 位置、相机设置和其他元数据。
- **离线处理：** 无需互联网连接。您的照片永远不会离开您的手机。
- **批量处理：** 一次选择并清理多张图像。
- **多语言支持：** 英语、日语、法语、德语、意大利语、西班牙语、中文（繁体/简体）、韩语、阿拉伯语。
- **深色模式：** 完全支持。
- **支持开发者：** 捐赠 SOL 以支持项目的选项。

## 运作方式

1. 从您的图库中选择照片。
2. 应用程序创建一个没有元数据的干净副本。
3. 将干净的副本保存到您的图库或直接分享。

## 开发

本项目使用 [Expo](https://expo.dev) 和 React Native 构建。

```bash
# 安装依赖项
npm install

# 启动应用程序
npx expo start
```

## 构建 (Build)

### Android

```bash
# Preview build (测试用 APK)
npx eas-cli build -p android --profile preview

# Production build (Google Play 用 AAB)
npx eas-cli build -p android --profile production
```

> **Windows 用户注意事项：**
> 如果遇到 PowerShell 安全错误，请在命令前加上 `cmd /c`：
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
