/* ==========================================================================
   꿈모닝 5분 피드백 (Dream Morning 5-Min Feedback)
   Supabase Configuration & Client Factory
   ========================================================================== */

(function (window) {
  // 프로젝트 기본 Supabase 환경 변수 설정 (공개 가능한 Client API Key만 사용)
  const defaultConfig = {
    url: window.VITE_SUPABASE_URL || window.SUPABASE_URL || 'https://mftamdfgyhtkwqceqmxi.supabase.co',
    anonKey: window.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || ''
  };

  // 로컬 스토리지에 저장된 사용자 정의 API Key 우선 적용 (복구용)
  const savedKey = localStorage.getItem('dream_morning_supabase_anon_key');
  if (savedKey) {
    defaultConfig.anonKey = savedKey;
  }

  window.DREAM_MORNING_CONFIG = defaultConfig;
})(window);
