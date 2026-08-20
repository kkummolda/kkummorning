-- ====================================================================
-- 🌙 꿈모닝 5분 피드백 (Dream Morning) - Supabase Complete Real DB Schema
-- Supabase Dashboard -> SQL Editor에서 이 스크립트를 전체 복사하여 Run 하세요.
-- ====================================================================

-- 1. 기존 테이블 정리 (필요시 안전하게 호환성 재구축)
-- 주의: 기존 임시 테이블이 있는 경우 auth.users 참조 및 RLS를 완벽히 구축하기 위해 구조를 재정의합니다.

CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT DEFAULT 'Dreamer',
    email TEXT DEFAULT '',
    oneword TEXT DEFAULT '경청',
    oneword_quote TEXT DEFAULT '타인의 소리와 내 영혼의 소리에 귀 기울이는 삶',
    goal_self TEXT DEFAULT '매일 30분 독서 및 온전한 생각 정리',
    goal_family TEXT DEFAULT '가족과 따뜻한 저녁 식사와 깊은 경청',
    goal_society TEXT DEFAULT '동료의 이야기를 먼저 끝까지 경청하기',
    goal_soul TEXT DEFAULT '하루 5분 호흡과 명상으로 평온 지키기',
    sound_type TEXT DEFAULT 'rain',
    volume FLOAT DEFAULT 0.4,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    user_name TEXT DEFAULT 'Dreamer',
    day INT4 NOT NULL,
    date DATE NOT NULL,
    self_feedback TEXT DEFAULT '',
    family_feedback TEXT DEFAULT '',
    society_feedback TEXT DEFAULT '',
    soul_feedback TEXT DEFAULT '',
    one_sentence_summary TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- 1-1. 기존 테이블에 누락된 컬럼 보정 (CREATE TABLE IF NOT EXISTS는 이미
--      존재하는 테이블의 컬럼을 추가/변경하지 않으므로 별도로 필요)
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE public.daily_logs ADD COLUMN IF NOT EXISTS user_name TEXT DEFAULT 'Dreamer';

-- 2. 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_logs_user_date ON public.daily_logs(user_id, date);

-- 3. RLS (Row Level Security) 활성화 & 엄격한 사용자별 보완 정책 적용
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

-- 기존 정책 삭제 (중복 방지)
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can delete own profile" ON public.user_profiles;

DROP POLICY IF EXISTS "Users can view own daily logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can insert own daily logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can update own daily logs" ON public.daily_logs;
DROP POLICY IF EXISTS "Users can delete own daily logs" ON public.daily_logs;

-- user_profiles 보안 정책 (자신의 auth.uid() 데이터만 접근 가능)
CREATE POLICY "Users can view own profile" 
    ON public.user_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own profile" 
    ON public.user_profiles FOR DELETE 
    USING (auth.uid() = user_id);

-- daily_logs 보안 정책 (자신의 auth.uid() 데이터만 접근 가능)
CREATE POLICY "Users can view own daily logs" 
    ON public.daily_logs FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily logs" 
    ON public.daily_logs FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily logs" 
    ON public.daily_logs FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own daily logs"
    ON public.daily_logs FOR DELETE
    USING (auth.uid() = user_id);

-- 4. 테이블 기본 권한 부여 (SQL Editor로 테이블을 만들면 Table Editor와 달리
--    anon/authenticated 롤에 대한 기본 GRANT가 자동으로 붙지 않아 별도로 필요)
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
