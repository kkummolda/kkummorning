/* ==========================================================================
   꿈모닝 5분 피드백 (Dream Morning 5-Min Feedback)
   Supabase Configuration & Client Factory
   ========================================================================== */

(function (window) {
  // 프로젝트 기본 Supabase 환경 변수 설정
  const defaultConfig = {
    url: window.VITE_SUPABASE_URL || window.SUPABASE_URL || 'https://mftamdfgyhtkwqceqmxi.supabase.co',
    anonKey: window.VITE_SUPABASE_ANON_KEY || window.SUPABASE_ANON_KEY || 'sb_publishable_K4xUxMTg6UbMVOsDyr2Rxw_3TdDTvMB'
  };

  // 저장된 Key가 있을 경우 우선 적용
  const savedKey = localStorage.getItem('dream_morning_supabase_anon_key');
  if (savedKey) {
    defaultConfig.anonKey = savedKey;
  }

  window.DREAM_MORNING_CONFIG = defaultConfig;
})(window);
