# 🛡️ 꿈모닝 (Dream Morning) — /prototype 엔지니어링 기술기획서 (Technical Specification)

> **Document Version**: v1.0.0-PROTOTYPE-SPEC  
> **Target Path**: `/prototype/TECHNICAL_SPEC.md`  
> **Canonical PRD SoT**: [`/prototype/PRD_SOT.md`](file:///c:/안티그래비티/prototype/PRD_SOT.md)  
> **Live Local Environment**: `http://localhost:8080/prototype/`  

---

## 1. 시스템 아키텍처 및 미션 크리티컬 제어 구조

### 1.1 시스템 구성도
```
+-----------------------------------------------------------------------------------+
|                           /prototype SINGLE SOURCE OF TRUTH                       |
|  +-----------------------------------------------------------------------------+  |
|  |                             HTML5 / CSS3 / Vanilla JS                       |  |
|  |  [/prototype/index.html (PlayBoard Hub)]   [/prototype/PRD_SOT.md (SoT)]     |  |
|  |  [/prototype/pages-list.html]              [/prototype/ux-flow.html]          |  |
|  |  [step1-mindfulness] [step2-values] [step3-feedback] [step4-dashboard] [auth]  |  |
|  +-----------------------------------------------------------------------------+  |
|                                        |                                          |
|                                        v                                          |
|  +-----------------------------------------------------------------------------+  |
|  |                   CORE APP ENGINE (app.js & config.js)                      |  |
|  |  - State Machine  - Web Audio API  - LocalStorage Engine  - Toast System      |  |
|  +-----------------------------------------------------------------------------+  |
+----------------------------------------|------------------------------------------+
                                         | REST / Realtime HTTPS
                                         v
+-----------------------------------------------------------------------------------+
|                               SUPABASE CLOUD INFRA                                |
|  +-----------------------------------+   +-------------------------------------+  |
|  |         Supabase Auth             |   |        PostgreSQL Database          |  |
|  |  - JWT Session Auth               |   |  - public.user_profiles             |  |
|  |  - Auto-Login Fallback            |   |  - public.daily_logs                |  |
|  +-----------------------------------+   +-------------------------------------+  |
|                                          | Row Level Security (RLS)               |
|                                          v                                        |
|                                [ auth.uid() == user_id ]                          |
+-----------------------------------------------------------------------------------+
```

---

## 2. PostgreSQL DB Schema & Row Level Security (RLS) SQL

### 2.1 `public.user_profiles` 스키마
```sql
CREATE TABLE public.user_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name text NOT NULL,
  email text NOT NULL,
  oneword text DEFAULT '경청',
  oneword_quote text,
  goal_self text,
  goal_family text,
  goal_society text,
  goal_soul text,
  sound_type text DEFAULT 'rain',
  volume float4 DEFAULT 0.4,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "user_profiles_select_own" ON public.user_profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "user_profiles_update_own" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);
```

### 2.2 `public.daily_logs` 스키마
```sql
CREATE TABLE public.daily_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  day int4 NOT NULL CHECK (day >= 1 AND day <= 21),
  date date NOT NULL,
  self_feedback text,
  family_feedback text,
  society_feedback text,
  soul_feedback text,
  one_sentence_summary text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "daily_logs_select_own" ON public.daily_logs FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "daily_logs_insert_own" ON public.daily_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "daily_logs_update_own" ON public.daily_logs FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "daily_logs_delete_own" ON public.daily_logs FOR DELETE USING (auth.uid() = user_id);
```

---

## 3. 미션 크리티컬 예외 복구 매트릭스 (Resilience Matrix)

| 예외 Case | 발생 조건 | 복구 알고리즘 및 사용자 가이드 |
| :--- | :--- | :--- |
| `User already registered` | 기존 생성된 계정으로 재가입 | `handleSignUp()` 내에서 자동으로 `signInWithPassword()`를 호출하여 1초 만에 로그인 승계 |
| `email rate limit exceeded` | 60초 내 과도한 요청 | `"보안 정책에 따라 1분 후 시도하시거나 [로그인] 탭을 이용해 주세요"` 정제된 한글 알림 출력 |
| Raw UUID 노출 | 닉네임 로딩 지연 시 UUID 노출 | `isUUID()` 정규식 검사로 UUID 감지 시 닉네임 또는 이메일 아이디로 대체 출력 |
| Modal Toast Overlay | 팝업이 토스트 알림을 가림 | `#toast-container` `z-index: 4000`, `.modal-overlay` `z-index: 2500` 보장 |
