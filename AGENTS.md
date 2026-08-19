# 🛡️ 꿈모닝 (Dream Morning) — AI 에이전트 & 프로젝트 운영 가이드 (AGENTS.md)

> **Document Status**: Canonical Agent Governance & Operational Rules  
> **Target Path**: `AGENTS.md`  
> **Single Source of Truth (SoT)**: [`/playboard/playboard_data.json`](file:///c:/안티그래비티/playboard/playboard_data.json) & [`/playboard/PRD_SOT.md`](file:///c:/안티그래비티/playboard/PRD_SOT.md)  

---

## 📌 1. Single Source of Truth (SoT) 동기화 대원칙

본 프로젝트의 모든 요구사항 변경, 이슈 발생, 구현 상태 변경은 반드시 **`/playboard` 경로의 PlayBoard 상황판 및 스키마 레지스트리**를 유일한 진실의 원천(Single Source of Truth)으로 삼습니다.

### 🚨 [MANDATORY RULE] PlayBoard 레지스트리 동시 갱신 규칙
> **모든 AI 에이전트 및 개발자는 아래 3가지 사건 발생 시 `/playboard/playboard_data.json` 및 `/playboard/PRD_SOT.md` 레지스트리를 즉시 동시 갱신해야 합니다:**
> 1. **요구사항 변경 (PRD Update)**: 신규 기능이 추가되거나 기존 사양이 변경될 때.
> 2. **이슈 추가 (Issue Backlog)**: 새로운 버그, 기술 부채, 후속 작업 이슈가 발생할 때 (`ISS-xx` 부여).
> 3. **구현 완료 (Implementation Completed)**: 코드 수정 및 빌드/테스트 검증이 완료되었을 때 (`[COMPLETED]` 상태 업데이트).

---

## 📂 2. 프로젝트 디렉토리 아키텍처 & 참조 우선순위

| 경로 | 역할 | 참조 우선순위 |
| :--- | :--- | :--- |
| **`/playboard/index.html`** | 라이브 /playboard 관제 상황판 & Mermaid DAG & 커버리지 매트릭스 | **1순위 (Primary Live Hub)** |
| **`/playboard/playboard_data.json`** | SoT JSON 스키마 데이터베이스 (Nodes, Contracts, Gates, NFR, Coverage) | **1순위 (Data Engine)** |
| **`/playboard/PRD_SOT.md`** | PRD 요구사항 & 이슈 트래킹 Single Source of Truth | **1순위 (PRD SoT)** |
| **`/playboard/TECHNICAL_SPEC.md`** | 베테랑 IT PM 엔지니어링 제어 명세서 | **2순위 (Technical Spec)** |
| **`/playboard/step1~4.html`** | 시각화된 기술기획 패널 병치 5대 개별 프로토타입 | **2순위 (Interactive Prototype)** |
| **`/prototype/index.html`** | 기존 화면 정적 HTML 박제 보존소 | **3순위 (Static Archive Only)** |

---

## 🛡️ 3. 미션 크리티컬 엔지니어링 6대 도메인 제어 가이드

1. **DOM-AUTH (인증·세션)**:
   - Supabase Auth 회원가입 실패 시 `already registered` 400 에러 감지 ➔ 자동으로 `signInWithPassword()`를 시도하여 1초 만에 로그인 승계.
2. **DOM-ACCESS (접근 제어)**:
   - 모든 PostgreSQL 테이블(`user_profiles`, `daily_logs`)은 `auth.uid() = user_id` Row Level Security (RLS) 필수 적용.
3. **DOM-INTEGRITY (데이터 무결성 & 백업)**:
   - 작성 시 LocalStorage 1차 즉시 저장 ➔ Supabase Postgres 2차 Upsert. 네트워크 단절 대처.
4. **DOM-DR (장애 & 복구)**:
   - Z-Index 레이어 구조 보장 (`#toast-container` 4000 > `#global-loading` 3000 > `.modal-overlay` 2500).
5. **DOM-OBSERVABILITY (관측성)**:
   - 상단 프로필 닉네임 로딩 시 raw UUID 감지 시 `isUUID()` 정규식 검사 후 닉네임/이메일 자동 마스킹.
6. **DOM-PERF (성능 & 캐시)**:
   - Web Audio API `AudioContext.close()` 디스포즈로 오디오 메모리 누수 전면 방지.
