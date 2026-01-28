# Exif Cleaner for Seeker

写真をオンラインで共有する前に、メタデータ（Exifデータ）を削除するためのプライバシー重視のモバイルツールです。

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## なぜオープンソースなのか？

**あなたのプライバシーが最優先です。**
機密データを扱うツールは透明であるべきだと私たちは信じています。このプロジェクトをオープンソースにすることで、誰でもコードを検査し、以下の点を確認できるようにしています：
- **データはアップロードされません:** すべての処理はデバイス上で100%ローカルに行われます。
- **追跡はありません:** メタデータを削除し、クリーンな画像をライブラリに保存するだけです。

## 機能

- **Exifデータの削除:** GPS位置情報、カメラ設定、その他のメタデータを削除します。
- **オフライン処理:** インターネット接続は不要です。写真はスマホから外に出ることはありません。
- **バッチ処理:** 複数の画像を選択して一度にクリーニングできます。
- **多言語サポート:** 英語、日本語、フランス語、ドイツ語、イタリア語、スペイン語、中国語（繁体字/簡体字）、韓国語、アラビア語。
- **ダークモード:** 完全対応。
- **開発者への支援:** プロジェクトを支援するためのSOL寄付オプション。

## 使い方

1. ギャラリーから写真を選択します。
2. アプリがメタデータのないクリーンなコピーを作成します。
3. クリーンなコピーをギャラリーに保存するか、直接共有します。

## 開発

このプロジェクトは [Expo](https://expo.dev) と React Native で構築されています。

```bash
# 依存関係のインストール
npm install

# アプリの起動
npx expo start
```

## ビルド

### Android

```bash
# プレビュービルド（テスト用APK）
npx eas-cli build -p android --profile preview

# 本番ビルド（Google Play用AAB）
npx eas-cli build -p android --profile production
```

> **Windowsユーザーへの注意:**
> PowerShellのセキュリティエラーが発生する場合は、コマンドの先頭に `cmd /c` を付けてください：
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
