# [구현 계획서] 최초 1회 작성자 프로필 등록 & Supabase 작성자 식별 시스템

앱을 처음 켜거나 작성자가 설정되지 않은 경우 **[최초 1회 작성자 등록 모달]**을 통해 이름과 이메일(식별자)을 받아, 고객과 관리자 모두가 작성자를 명확히 식별할 수 있는 시스템을 구축합니다.

---

## Proposed Changes

### [HTML User Registration Modal & Header Badge]
#### [MODIFY] [index.html](file:///c:/안티그래비티/index.html)
- `#user-welcome-modal` (최초 1회 환영 및 작성자 등록 모달) 추가:
  - 작성자 이름 (예: `홍길동`)
  - 식별 이메일 / 연락처 (예: `hong@example.com`)
- 상단 헤더 및 2단계 엽서에 작성자 프로필 뱃지(`👤 홍길동 (hong@example.com)`) 탑재

### [JS Profile Engine & Supabase Tagging]
#### [MODIFY] [app.js](file:///c:/안티그래비티/app.js)
- `createDefaultState()`에 `user_name` 및 `user_email` 프로필 필드 추가
- 앱 로드 시 작성자 미등록 상태면 `#user-welcome-modal` 자동 팝업
- 등록 후 `saveState()` 및 `syncToSupabase()` 자동 호출로 Supabase DB `user_profiles` 및 `daily_logs`에 작성자 이름/이메일 태그 Upsert

### [Supabase SQL Schema Update]
#### [MODIFY] [supabase_schema.sql](file:///c:/안티그래비티/supabase_schema.sql)
- `user_profiles` 및 `daily_logs`에 `email` 및 `user_name` 칼럼 추가 반영

---

## Verification Plan

### Manual Verification
1. **첫 방문 모달 검증**: 브라우저 로컬스토리지 초기화 후 앱 열기 시 `[작성자 등록 모달]` 팝업 동작 확인.
2. **프로필 저장 및 헤더 반영**: 이름(`홍길동`) 및 이메일 입력 후 저장 시 상단 헤더 및 2단계 엽서에 작성자명이 정상 표시되는지 확인.
3. **Supabase 작성자 태깅 검증**: 일지 저장 시 Supabase DB에 `user_name`과 `user_id(email)`가 작성자 정보로 자동 기입되는지 확인.
