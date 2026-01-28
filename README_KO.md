# Exif Cleaner for Seeker

사진을 온라인에 공유하기 전에 메타데이터(Exif 데이터)를 제거하도록 설계된 개인정보 보호 중심의 모바일 도구입니다.

[English](README.md) | [日本語](README_JA.md) | [Français](README_FR.md) | [Deutsch](README_DE.md) | [Italiano](README_IT.md) | [Español](README_ES.md) | [繁體中文](README_TW.md) | [简体中文](README_CN.md) | [한국어](README_KO.md) | [العربية](README_AR.md)

## 왜 오픈 소스인가요?

**여러분의 개인정보는 우리의 최우선 과제입니다.**
민감한 데이터를 다루는 도구는 투명해야 한다고 믿습니다. 이 프로젝트를 오픈 소스로 공개함으로써 누구나 코드를 검사하고 다음을 확인할 수 있습니다:
- **데이터 업로드 없음:** 모든 처리는 기기에서 100% 로컬로 이루어집니다.
- **숨겨진 추적 없음:** 메타데이터만 제거하고 깨끗한 이미지를 라이브러리에 다시 저장합니다.

## 기능

- **Exif 데이터 제거:** GPS 위치, 카메라 설정 및 기타 메타데이터를 제거합니다.
- **오프라인 처리:** 인터넷 연결이 필요 없습니다. 사진은 절대 휴대전화를 떠나지 않습니다.
- **일괄 처리:** 여러 이미지를 선택하고 한 번에 정리할 수 있습니다.
- **다국어 지원:** 영어, 일본어, 프랑스어, 독일어, 이탈리아어, 스페인어, 중국어(번체/간체), 한국어, 아랍어.
- **다크 모드:** 완벽 지원.
- **개발자 후원:** 프로젝트를 후원하기 위한 SOL 기부 옵션.

## 작동 방식

1. 갤러리에서 사진을 선택합니다.
2. 앱이 메타데이터가 없는 깨끗한 사본을 생성합니다.
3. 깨끗한 사본을 갤러리에 저장하거나 직접 공유합니다.

## 개발

이 프로젝트는 [Expo](https://expo.dev) 및 React Native로 구축되었습니다.

```bash
# 의존성 설치
npm install

# 앱 시작
npx expo start
```

## 빌드

### Android

```bash
# Preview build (테스트용 APK)
npx eas-cli build -p android --profile preview

# Production build (Google Play용 AAB)
npx eas-cli build -p android --profile production
```

> **Windows 사용자 주의사항:**
> PowerShell 보안 오류가 발생하면 명령어 앞에 `cmd /c`를 붙이세요:
> ```powershell
> cmd /c npx eas-cli build -p android --profile preview
> ```
