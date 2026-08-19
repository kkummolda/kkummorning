# 📜 꿈모닝 (Dream Morning) — PRD & Issue Backlog Single Source of Truth (SoT)

> **Document Status**: Active Canonical Single Source of Truth (SoT)  
> **Target Path**: `/prototype/PRD_SOT.md`  
> **Last Revision**: 2026-08-19 (v1.0.0-SoT)  
> **Governance Policy**: 본 문서는 꿈모닝 프로젝트의 모든 기능 요구사항, PRD 변경 이력, 이슈/작업 트래킹의 단일 진실의 원천(Single Source of Truth)으로 사용되며, 후속 추가 요구사항 및 PRD 업데이트는 본 문서를 기준으로 통합 수렴합니다.

---

## 1. 제품 비전 & 핵심 목적 (Product Vision & Core Purpose)

### 1.1 제품 개요
**꿈모닝 (Dream Morning)**은 매일 밤 자기 전 5분 동안 백색소음/명상 음원과 함께 **자아(Self), 가정(Family), 사회(Society), 영혼(Soul)** 4가지 영역을 성찰하고, 21일간 온전한 나다운 삶을 가꾸는 클라우드 동기화 챌린지 웹 애플리케이션입니다.

### 1.2 핵심 문제 정의 & 해결 방안
- **문제점**: 바쁜 일상 속에서 자기 성찰의 시간이 부족하고, 단발성 결심으로 끝나 회고 습관이 쉽게 무너짐.
- **해결책**:
  1. **5분 마음 보기 명상**: 4가지 힐링 백색소음 및 SVG 시각 타이머로 차분한 몰입 환경 제공.
  2. **나만의 One Word & 4대 영역 다짐 카드**: 나다움의 기준이 되는 핵심 키워드 설정.
  3. **4대 영역 피드백 작성**: 하루 5분, 자아·가정·사회·영혼 피드백 기록 및 Supabase DB 저장.
  4. **21일 초록 잔디밭 히트맵**: 연속 달성 스트릭 카운팅과 회고 타임라인으로 성장의 성취감 제공.

---

## 2. PRD 요구사항 명세 (Product Requirements)

| 요구사항 ID | 기능 분류 | 세부 요구사항 정의 | 구현 경로 | 상태 |
| :--- | :--- | :--- | :--- | :--- |
| **PRD-01** | 마음 보기 (Mindfulness) | 5분 SVG 원형 명상 타이머 (Start/Pause/Reset) 및 4종 힐링 사운드 (빗소리, 바람, 오르골, 모닥불) 컨트롤 | `/prototype/step1-mindfulness.html` | `[COMPLETED]` |
| **PRD-02** | 가치 생각 (Values) | 방향 키워드(One Word) 선언 엽서 및 자아·가정·사회·영혼 4대 영역 다짐 카드 편집/저장 | `/prototype/step2-values.html` | `[COMPLETED]` |
| **PRD-03** | 일일 피드백 (Daily Review) | 날짜 선택, 4대 영역 일기 작성, 한 줄 요약 작성 및 Supabase Postgres DB(`daily_logs`) 실시간 전송 저장 | `/prototype/step3-feedback.html` | `[COMPLETED]` |
| **PRD-04** | 21일 잔디 & 회고 (Dashboard) | 21일 달성 히트맵 잔디밭 시각화, 연속 달성 스트릭 계산, 과거 일기 타임라인 조회/삭제 | `/prototype/step4-dashboard.html` | `[COMPLETED]` |
| **PRD-05** | 인증 & 클라우드 (Auth & Sync) | Supabase Auth 회원가입/로그인, Anon Key 설정, RLS 보안 정책 및 사용자 닉네임 프로필 관리 | `/prototype/auth.html` | `[COMPLETED]` |
| **PRD-06** | 화면 카탈로그 (Catalog) | 프로젝트 전체 프로토타입 화면에 원클릭 직접 접근하는 디렉토리 카탈로그 페이지 | `/prototype/pages-list.html` | `[COMPLETED]` |
| **PRD-07** | UX Flow 오버뷰 (Overview) | 신규 챌린저, 매일 밤 회고 작성자, 성장 분석가 등 3대 페르소나별 핵심 이동 경로 시각 카드 오버뷰 | `/prototype/ux-flow.html` | `[COMPLETED]` |
| **PRD-08** | PlayBoard 메인 (PlayBoard) | 프로젝트 라이브 시스템 상태(서버, DB, PWA, RLS), PRD 이슈 모니터링 및 통합 메인 상황판 | `/prototype/index.html` | `[COMPLETED]` |

---

## 3. PRD 개정 & 이슈 트래킹 레지스트리 (Issue Backlog Registry)

### 3.1 최근 PRD 업데이트 및 이슈 해결 이력
```
+--------------+---------------+-------------------------------------------------------------+--------------+
| 이슈 ID      | 등록 일시     | 이슈/요구사항 내용                                          | 처리 상태    |
+--------------+---------------+-------------------------------------------------------------+--------------+
| ISS-2026-01  | 2026-08-19    | LocalStorage -> Supabase Real DB (user_profiles, daily_logs)| [COMPLETED]  |
| ISS-2026-02  | 2026-08-19    | 스마트폰 모바일 UX 최적화 (iOS Safari auto-zoom 방지)        | [COMPLETED]  |
| ISS-2026-03  | 2026-08-19    | SyntaxError duplicate const 변수 제거 및 boot crash 복구    | [COMPLETED]  |
| ISS-2026-04  | 2026-08-19    | Toast container z-index 4000 상향으로 모달 팝업 가림 방지   | [COMPLETED]  |
| ISS-2026-05  | 2026-08-19    | 이미 등록된 이메일 회원가입 시 자동 로그인(Auto-Login) 연결 | [COMPLETED]  |
| ISS-2026-06  | 2026-08-19    | 상단 뱃지 복잡한 UUID 문자열 자동 필터링 및 닉네임 최우선   | [COMPLETED]  |
| ISS-2026-07  | 2026-08-19    | /prototype 경로 기반 AI Native PlayBoard & SoT 구축          | [COMPLETED]  |
+--------------+---------------+-------------------------------------------------------------+--------------+
```

### 3.2 후속 PRD 요구사항 및 백로그 관리 지침
1. **신규 이슈 추가 방법**:
   - 후속 요구사항 발생 시 본 `PRD_SOT.md` 파일의 `3.1 이슈 트래킹 레지스트리`에 이슈 ID(e.g., `ISS-2026-08`)를 부여하고 등록합니다.
2. **상태 관리**:
   - `[BACKLOG]` -> `[IN_PROGRESS]` -> `[COMPLETED]` 단계를 거쳐 관리하며, `prototype/index.html` PlayBoard 상에서 실시간 지표로 수치화됩니다.

---

## 4. 데이터베이스 및 엔지니어링 제어 명세 수렴 (Engine Spec Convergence)

- **PostgreSQL Database Schema**: `public.user_profiles`, `public.daily_logs`
- **Security**: Row Level Security (RLS) Enable (`auth.uid() = user_id`)
- **Technical Specification Path**: [`/prototype/TECHNICAL_SPEC.md`](file:///c:/안티그래비티/prototype/TECHNICAL_SPEC.md)
- **Live PlayBoard Dashboard Path**: [`/prototype/index.html`](file:///c:/안티그래비티/prototype/index.html)
