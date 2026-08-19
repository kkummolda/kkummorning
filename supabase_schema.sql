-- ====================================================================
-- 🌙 꿈모닝 5분 피드백 (Dream Morning) - Supabase Database Schema
-- ====================================================================

-- 1. 사용자 프로필 테이블 (One Word & 4영역 다짐 & 작성자 정보)
CREATE TABLE IF NOT EXISTS public.user_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL UNIQUE DEFAULT 'guest@dream.com',
    user_name TEXT DEFAULT 'Dreamer',
    email TEXT DEFAULT 'guest@dream.com',
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

-- 2. 21일 피드백 일지 테이블 (Daily Logs)
CREATE TABLE IF NOT EXISTS public.daily_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL DEFAULT 'guest@dream.com',
    user_name TEXT DEFAULT 'Dreamer',
    day INT NOT NULL,
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

-- RLS (Row Level Security) 정책
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select for user_profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update for user_profiles" ON public.user_profiles FOR ALL USING (true);

CREATE POLICY "Allow public select for daily_logs" ON public.daily_logs FOR SELECT USING (true);
CREATE POLICY "Allow public insert/update/delete for daily_logs" ON public.daily_logs FOR ALL USING (true);
