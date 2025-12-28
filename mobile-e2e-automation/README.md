# Mobile E2E UI Automation Framework

Laixi(오케스트레이션) + Autox.js(Android 액션) + Appium(크로스플랫폼 드라이버) 기반 모바일 E2E UI 자동화 프레임워크

## 아키텍처

### 컴포넌트 역할

- **Laixi** (오케스트레이터)
  - 잡 스케줄링, 환경 선택, 디바이스 할당, 병렬화
  - 아티팩트 수집, 리포트 집계, 플레이키 격리 정책

- **Autox.js** (Android-first 스크립팅 레이어)
  - 안드로이드 전용 빠른 액션 (시스템 다이얼로그, 권한 처리, 복구 루틴)
  - Laixi가 호출하는 "사이드카" 액션 러너

- **Appium** (크로스플랫폼 드라이버)
  - iOS/Android UI 자동화 (WebDriver 프로토콜)
  - 모든 테스트의 기본 드라이버, Android 엣지 케이스는 Autox로 보강

## 프로젝트 구조

```
mobile-e2e-automation/
├── laixi/                 # 오케스트레이터 설정
│   ├── profiles/          # 환경 프로파일 (dev/stage/prod)
│   ├── devicePools/       # 디바이스 풀 설정
│   ├── reporters/         # 리포트 생성기 (JUnit, HTML)
│   └── hooks/             # 테스트 훅
├── appium/                # Appium 설정
│   ├── capabilities/      # 플랫폼별 Capabilities
│   └── server/            # Appium 서버 관리
├── autox/                 # Autox.js 통합
│   ├── scripts/           # Autox 스크립트
│   └── runner/            # Autox 실행기
└── src/
    ├── config/            # 환경 설정
    ├── core/              # 핵심 라이브러리
    ├── pages/             # 페이지 오브젝트 (POM)
    ├── workflows/         # 사용자 워크플로우
    ├── tests/             # 테스트 파일
    └── fixtures/          # 테스트 데이터
```

## 설치

```bash
npm install
```

## 환경 설정

`.env.example`을 참고하여 `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요:

```bash
PLATFORM=android
APPIUM_URL=http://127.0.0.1:4723
APP_PATH=artifacts/app-stage.apk
E2E_USERNAME=your_username
E2E_PASSWORD=your_password
ANDROID_SERIAL=emulator-5554
ENV_PROFILE=stage
```

**중요**: 시크릿 값은 절대 git에 커밋하지 마세요.

## 실행

### 로컬 실행

```bash
# Appium 서버 시작
npm run appium:start

# Android 에뮬레이터 부팅 (예시)
npm run device:android:boot

# Smoke 테스트 실행
npm run test:smoke

# Regression 테스트 실행
npm run test:regression

# 전체 테스트 실행
npm run test:all
```

### 플랫폼 선택

환경 변수로 플랫폼 선택:

```bash
PLATFORM=android npm run test:smoke
PLATFORM=ios npm run test:smoke
```

## 표준 및 규칙

### 재시도 & 플레이키 격리

- 기본 재시도: smoke 1회, regression 2회
- 격리 규칙: 동일 빌드에서 7일 내 비결정적 실패가 2회 이상이면 `@quarantine` 자동 태그
- PR 게이트: `@quarantine` 태그 테스트 제외
- 야간 실행: quarantine 포함하되 비차단

### 타임아웃 & 대기

- **Implicit wait 금지**: Appium implicit wait 0 고정
- 표준 타임아웃:
  - 엘리먼트 등장: smoke 10s / regression 20s
  - 액션: 5s
  - 앱 런치/세션: 60~90s
- 대기 전략: 상태 기반 explicit wait (표시됨 + 활성 + 안정)
- `sleep()` 금지 (예외: OS 애니메이션 등 300ms 이하만 허용)

### 셀렉터 전략

우선순위:
1. Accessibility ID / content-desc / resource-id
2. iOS -ios predicate string / Android UiSelector (ID 없을 때)
3. XPath는 최후 수단이며 격리/개선 대상

### 태깅

필수 태그:
- `@smoke` 또는 `@regression`
- `@android` 또는 `@ios`
- `@native` 또는 `@hybrid` 또는 `@webview`

실행 필터:
- PR 게이트: `@smoke AND NOT @quarantine`
- Nightly: `@smoke OR @regression` (quarantine 포함, 비차단)
- Release: `@critical AND NOT @quarantine`

### 아티팩트

모든 테스트 실행 시:
- 디바이스/OS/앱 빌드 메타데이터 로그

실패 시 자동 캡처:
- 스크린샷 (.png)
- 페이지 소스 덤프 (.xml/.json)
- Appium 서버 로그
- Autox 로그 (호출된 경우)

## CI/CD

GitHub Actions 파이프라인:
- PR마다 smoke 테스트 자동 실행
- JUnit XML + HTML 요약 자동 생성
- 아티팩트 자동 업로드

## 리포팅

- **JUnit XML**: `laixi/artifacts/junit/results.xml`
- **HTML 요약**: `laixi/artifacts/summary/index.html`
- **테스트별 아티팩트**: `laixi/artifacts/tests/<testId>/`

## 네이밍 컨벤션

- 페이지: `XxxPage.ts` (POM), 메서드는 Promise 기반만
- 워크플로우: `xxx.workflow.ts` (여러 페이지를 잇는 사용자 여정)
- 테스트: `feature.scope.test.ts` (예: `login.smoke.test.ts`)
- 셀렉터: `src/core/selectors.ts`에 중앙집중 (안정 ID 우선)
- 픽스처: `fixtures/*.ts` (테스트 데이터, 비밀값 금지)

## Definition of Done

✅ 로컬에서 Android/iOS를 한 커맨드로 실행 (플랫폼 플래그)
✅ PR마다 smoke가 CI에서 안정적으로 실행
✅ 매 실행마다 JUnit + HTML 요약 생성
✅ 실패 시 자동 아티팩트 캡처
✅ 태깅 강제 + quarantine 정책이 게이트에 반영
✅ 셀렉터 전략 준수 (XPath는 격리/개선 대상)
✅ 타임아웃/대기 표준화, implicit wait 0
✅ 시크릿은 env로만 주입, git 미포함

## 라이선스

MIT

