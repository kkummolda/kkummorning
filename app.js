/* ==========================================================================
   꿈모닝 5분 피드백 웹 (Dream Morning 5-Min Feedback)
   Core Application Engine & Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. STATE & STORAGE MANAGEMENT
  // ------------------------------------------------------------------------
  const STORAGE_KEY = 'dream_morning_5min_data_v1';

  // Global Loading Overlay Helpers
  function showGlobalLoading(text = '처리 중입니다...') {
    const overlay = document.getElementById('global-loading-overlay');
    const label = document.getElementById('global-loading-text');
    if (label) label.textContent = text;
    if (overlay) overlay.style.display = 'flex';
  }

  function hideGlobalLoading() {
    const overlay = document.getElementById('global-loading-overlay');
    if (overlay) overlay.style.display = 'none';
  }

  // Helper: Get local date string YYYY-MM-DD (KST/Local Timezone Safe)
  function getLocalDateString(d = new Date()) {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function createDefaultState() {
    return {
      user_profile: {
        user_id: '',
        user_name: '',
        user_email: '',
        one_word: '경청',
        one_word_quote: '타인의 소리와 내 영혼의 소리에 귀 기울이는 삶',
        challenge_start_date: getLocalDateString(),
        four_area_goals: {
          self: '매일 30분 독서 및 온전한 생각 정리',
          family: '가족과 따뜻한 저녁 식사와 깊은 경청',
          society: '동료의 이야기를 먼저 끝까지 경청하기',
          soul: '하루 5분 호흡과 명상으로 평온 지키기'
        }
      },
      sound_settings: {
        sound_type: 'rain',
        volume: 0.4
      },
      supabase_config: {
        url: 'https://mftamdfgyhtkwqceqmxi.supabase.co',
        anon_key: ''
      },
      daily_logs: []
    };
  }

  function getSampleState() {
    const today = new Date();
    const logs = [];
    for (let i = 1; i <= 7; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - (7 - i));
      const dateStr = getLocalDateString(d);
      logs.push({
        day: i,
        date: dateStr,
        created_at: d.toISOString(),
        self_feedback: `${i}일차: 내 감정에 휘둘리지 않고 나만의 중심을 지켰다.`,
        family_feedback: `${i}일차: 가족의 마음에 귀 기울이며 이야기를 경청해주었다.`,
        society_feedback: `${i}일차: 회의 시간에 다른 사람의 말을 먼저 듣는 태도를 가졌다.`,
        soul_feedback: `${i}일차: 잠시 숨을 고르고 내면의 호흡에 집중하여 평온을 얻었다.`,
        one_sentence_summary: `${i}일차: 나의 소리를 조용히 찾아가는 하루`
      });
    }
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 6);
    return {
      user_profile: {
        user_id: 'Dreamer (가상)',
        one_word: '경청',
        one_word_quote: '타인의 소리와 내 영혼의 소리에 귀 기울이는 삶',
        challenge_start_date: getLocalDateString(startDate),
        four_area_goals: {
          self: '매일 30분 독서 및 온전한 생각 정리',
          family: '가족과 따뜻한 저녁 식사와 깊은 경청',
          society: '동료의 이야기를 먼저 끝까지 경청하기',
          soul: '하루 5분 호흡과 명상으로 평온 지키기'
        }
      },
      sound_settings: { sound_type: 'rain', volume: 0.4 },
      daily_logs: logs
    };
  }

  let state = loadState();

  function loadState() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load state from localStorage:', e);
    }
    return createDefaultState();
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      updateUI();
    } catch (e) {
      showToast('데이터 저장 중 오류가 발생했습니다.', 'error');
    }
  }

  // ------------------------------------------------------------------------
  // 2. BACKGROUND AMBIENT PARTICLES CANVAS
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas.getContext('2d');
  let particles = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2.5 + 0.5;
      this.speedX = Math.random() * 0.4 - 0.2;
      this.speedY = Math.random() * -0.4 - 0.1;
      this.opacity = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      if (this.y < 0 || this.x < 0 || this.x > canvas.width) {
        this.reset();
        this.y = canvas.height;
      }
    }
    draw() {
      ctx.fillStyle = `rgba(192, 132, 252, ${this.opacity})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  for (let i = 0; i < 45; i++) {
    particles.push(new Particle());
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ------------------------------------------------------------------------
  // 3. WEB AUDIO SYNTHESIZER ENGINE (No External Files Required)
  // ------------------------------------------------------------------------
  let audioCtx = null;
  let isAudioPlaying = false;
  let masterGain = null;
  let currentSoundNodes = [];

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();
      masterGain = audioCtx.createGain();
      masterGain.gain.value = state.sound_settings.volume;
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function startAmbientSound(type) {
    initAudioContext();
    stopAmbientSound();

    if (type === 'rain') {
      // 1. Continuous Rain Noise Layer (Pink Noise)
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        output[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        output[i] *= 0.1;
        b6 = white * 0.115926;
      }

      const rainSource = audioCtx.createBufferSource();
      rainSource.buffer = noiseBuffer;
      rainSource.loop = true;

      const rainFilter = audioCtx.createBiquadFilter();
      rainFilter.type = 'lowpass';
      rainFilter.frequency.value = 1400;

      rainSource.connect(rainFilter);
      rainFilter.connect(masterGain);
      rainSource.start();

      // 2. Random Raindrop Clicks Generator
      const dropInterval = setInterval(() => {
        if (!isAudioPlaying) return;
        const dropOsc = audioCtx.createOscillator();
        const dropGain = audioCtx.createGain();
        dropOsc.type = 'sine';
        const dropFreq = 2000 + Math.random() * 3000;
        dropOsc.frequency.setValueAtTime(dropFreq, audioCtx.currentTime);
        dropGain.gain.setValueAtTime(0.015 + Math.random() * 0.02, audioCtx.currentTime);
        dropGain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.03);

        dropOsc.connect(dropGain);
        dropGain.connect(masterGain);
        dropOsc.start();
        dropOsc.stop(audioCtx.currentTime + 0.035);
      }, 100);

      currentSoundNodes.push(rainSource, { stop: () => clearInterval(dropInterval) });

    } else if (type === 'forest') {
      // 1. Modulated Forest Wind Sweep
      const bufferSize = audioCtx.sampleRate * 2;
      const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * 0.08;
      }

      const windNoise = audioCtx.createBufferSource();
      windNoise.buffer = noiseBuffer;
      windNoise.loop = true;

      const windFilter = audioCtx.createBiquadFilter();
      windFilter.type = 'bandpass';
      windFilter.Q.value = 2.0;
      windFilter.frequency.setValueAtTime(450, audioCtx.currentTime);

      // LFO for natural wind frequency swells
      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.15; // Slow breeze pulse
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 250;
      lfo.connect(windFilter.frequency);

      windNoise.connect(windFilter);
      windFilter.connect(masterGain);

      windNoise.start();
      lfo.start();

      // 2. Warm Ambient Synth Pad (A2 / E3 / A3)
      const padFreqs = [110, 164.81, 220];
      const padGain = audioCtx.createGain();
      padGain.gain.value = 0.04;
      const padOscs = padFreqs.map(f => {
        const osc = audioCtx.createOscillator();
        osc.type = 'sine';
        osc.frequency.value = f;
        osc.connect(padGain);
        osc.start();
        return osc;
      });
      padGain.connect(masterGain);

      currentSoundNodes.push(windNoise, lfo, padGain, ...padOscs);

    } else if (type === 'musicbox') {
      // 432Hz Sacred Frequency Meditation Music Box with Delay Echo
      const delay = audioCtx.createDelay();
      delay.delayTime.value = 0.38;
      const feedback = audioCtx.createGain();
      feedback.gain.value = 0.35;
      delay.connect(feedback);
      feedback.connect(delay);
      delay.connect(masterGain);

      const scale = [216, 270, 324, 432, 540, 648, 864]; // 432Hz A-major pentatonic scale
      let step = 0;

      const musicInterval = setInterval(() => {
        if (!isAudioPlaying) {
          clearInterval(musicInterval);
          return;
        }
        const freq = scale[step % scale.length];
        step = (step + Math.floor(Math.random() * 3) + 1) % scale.length;

        // Dual Oscillator: Sine (fundamental) + Triangle (bell overtone)
        const osc1 = audioCtx.createOscillator();
        const osc2 = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(freq, audioCtx.currentTime);
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(freq * 2, audioCtx.currentTime);

        const now = audioCtx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.12, now + 0.015); // Fast attack
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 3.0); // Long music box ring

        osc1.connect(noteGain);
        osc2.connect(noteGain);
        noteGain.connect(masterGain);
        noteGain.connect(delay);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 3.1);
        osc2.stop(now + 3.1);
      }, 1000);

      currentSoundNodes.push({ stop: () => clearInterval(musicInterval) }, delay, feedback);

    } else if (type === 'fire') {
      // 1. Warm Fire Deep Ember Rumble
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = 75; // Low warmth D2
      oscGain.gain.value = 0.08;
      osc.connect(oscGain);
      oscGain.connect(masterGain);
      osc.start();

      // 2. Wood Crackle & Pop Impulses
      const crackleInterval = setInterval(() => {
        if (!isAudioPlaying) return;

        // Random chance for crackle pop
        if (Math.random() < 0.65) {
          const bufferSize = audioCtx.sampleRate * 0.02; // 20ms burst
          const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
          const data = buffer.getChannelData(0);
          for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
          }

          const noise = audioCtx.createBufferSource();
          noise.buffer = buffer;

          const filter = audioCtx.createBiquadFilter();
          filter.type = 'highpass';
          filter.frequency.value = 1200 + Math.random() * 2500;

          const crackleGain = audioCtx.createGain();
          crackleGain.gain.value = 0.03 + Math.random() * 0.08;

          noise.connect(filter);
          filter.connect(crackleGain);
          crackleGain.connect(masterGain);

          noise.start();
        }
      }, 120);

      currentSoundNodes.push(osc, oscGain, { stop: () => clearInterval(crackleInterval) });
    }

    isAudioPlaying = true;
    updateAudioBtnState();
  }

  function stopAmbientSound() {
    currentSoundNodes.forEach(node => {
      try {
        if (node.stop) node.stop();
        if (node.disconnect) node.disconnect();
      } catch (e) {}
    });
    currentSoundNodes = [];
    isAudioPlaying = false;
    updateAudioBtnState();
  }

  function updateAudioBtnState() {
    const quickBtn = document.getElementById('quick-audio-btn');
    if (isAudioPlaying) {
      quickBtn.classList.add('playing');
      quickBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
    } else {
      quickBtn.classList.remove('playing');
      quickBtn.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
  }

  // Quick Sound Toggle & Volume Slider
  document.getElementById('quick-audio-btn').addEventListener('click', () => {
    if (isAudioPlaying) {
      stopAmbientSound();
      showToast('사운드가 켜짐 해제되었습니다.', 'info');
    } else {
      startAmbientSound(state.sound_settings.sound_type);
      showToast(`${getSoundTypeName(state.sound_settings.sound_type)} 사운드가 재생됩니다.`, 'success');
    }
  });

  document.getElementById('volume-slider').addEventListener('input', (e) => {
    const val = parseFloat(e.target.value);
    state.sound_settings.volume = val;
    if (masterGain) {
      masterGain.gain.value = val;
    }
    saveState();
  });

  document.querySelectorAll('.sound-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('.sound-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const soundType = chip.getAttribute('data-sound');
      state.sound_settings.sound_type = soundType;
      saveState();
      startAmbientSound(soundType);
    });
  });

  function getSoundTypeName(type) {
    const map = {
      rain: '차분한 밤 빗소리',
      forest: '숲속의 아늑한 바람',
      musicbox: '432Hz 명상 오르골',
      fire: '따뜻한 모닥불 장작'
    };
    return map[type] || '명상음';
  }

  // ------------------------------------------------------------------------
  // 4. 5-MINUTE TIMER (ST STEP 1)
  // ------------------------------------------------------------------------
  let timerInterval = null;
  let remainingSeconds = 300; // 5 minutes
  let isTimerRunning = false;
  const timerRing = document.getElementById('timer-ring');
  const timerDigits = document.getElementById('timer-digits');
  const timerStatus = document.getElementById('timer-status');
  const totalDash = 553; // 2 * PI * 88

  function updateTimerDisplay() {
    const mins = Math.floor(remainingSeconds / 60);
    const secs = remainingSeconds % 60;
    timerDigits.textContent = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

    const progressRatio = remainingSeconds / 300;
    const offset = totalDash * (1 - progressRatio);
    timerRing.style.strokeDashoffset = offset;
  }

  document.getElementById('start-timer-btn').addEventListener('click', () => {
    if (!isTimerRunning) {
      initAudioContext();
      if (!isAudioPlaying) {
        startAmbientSound(state.sound_settings.sound_type);
      }
      isTimerRunning = true;
      timerStatus.textContent = '마음보기 5분 진행 중...';
      document.getElementById('start-timer-btn').disabled = true;
      document.getElementById('pause-timer-btn').disabled = false;

      timerInterval = setInterval(() => {
        remainingSeconds--;
        updateTimerDisplay();

        if (remainingSeconds <= 0) {
          clearInterval(timerInterval);
          isTimerRunning = false;
          timerStatus.textContent = '5분 마음보기 완료!';
          document.getElementById('start-timer-btn').disabled = false;
          document.getElementById('pause-timer-btn').disabled = true;
          showToast('🎉 5분 마음 보기가 완료되었습니다! 2단계로 이동하세요.', 'success');
        }
      }, 1000);
    }
  });

  document.getElementById('pause-timer-btn').addEventListener('click', () => {
    if (isTimerRunning) {
      clearInterval(timerInterval);
      isTimerRunning = false;
      timerStatus.textContent = '일시정지됨';
      document.getElementById('start-timer-btn').disabled = false;
      document.getElementById('pause-timer-btn').disabled = true;
    }
  });

  document.getElementById('reset-timer-btn').addEventListener('click', () => {
    clearInterval(timerInterval);
    isTimerRunning = false;
    remainingSeconds = 300;
    timerStatus.textContent = '마음 보기 준비';
    updateTimerDisplay();
    document.getElementById('start-timer-btn').disabled = false;
    document.getElementById('pause-timer-btn').disabled = true;
  });

  // ------------------------------------------------------------------------
  // 5. STEPPER NAVIGATION & VIEW SWITCHING
  // ------------------------------------------------------------------------
  function switchStep(stepNum) {
    document.querySelectorAll('.step-tab-btn, .nav-link-btn, .bottom-nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-step') == stepNum);
    });

    document.querySelectorAll('.step-view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById(`view-step-${stepNum}`).classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.step-tab-btn, .nav-link-btn, .bottom-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const step = btn.getAttribute('data-step');
      switchStep(step);
    });
  });

  document.querySelectorAll('[data-goto]').forEach(btn => {
    btn.addEventListener('click', () => {
      const targetStep = btn.getAttribute('data-goto');
      switchStep(targetStep);
    });
  });

  // ------------------------------------------------------------------------
  // 6. ST STEP 3: DAILY FEEDBACK FORM (CORE FEATURE)
  // ------------------------------------------------------------------------
  const feedbackDateInput = document.getElementById('feedback-date');
  const selectedDayBadge = document.getElementById('selected-day-badge');
  const selfInput = document.getElementById('self-feedback');
  const familyInput = document.getElementById('family-feedback');
  const societyInput = document.getElementById('society-feedback');
  const soulInput = document.getElementById('soul-feedback');
  const summaryInput = document.getElementById('one-sentence-summary');
  const sentencePreview = document.getElementById('sentence-preview-text');

  // Set default date to today (Local Timezone)
  const todayStr = getLocalDateString();
  feedbackDateInput.value = todayStr;

  function getLogForDate(dateStr) {
    return state.daily_logs.find(log => log.date === dateStr);
  }

  function populateFeedbackForm(dateStr) {
    const existingLog = getLogForDate(dateStr);
    const deleteBtn = document.getElementById('delete-daily-btn');
    if (deleteBtn) {
      deleteBtn.style.display = existingLog ? 'inline-flex' : 'none';
    }
    
    // Calculate Day N relative to challenge start
    const startDate = new Date(state.user_profile.challenge_start_date);
    const currentDate = new Date(dateStr);
    const diffTime = currentDate - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1;
    const dayNum = Math.max(1, Math.min(21, diffDays));

    selectedDayBadge.textContent = `Day ${dayNum}`;

    if (existingLog) {
      selfInput.value = existingLog.self_feedback || '';
      familyInput.value = existingLog.family_feedback || '';
      societyInput.value = existingLog.society_feedback || '';
      soulInput.value = existingLog.soul_feedback || '';
      summaryInput.value = existingLog.one_sentence_summary || '';
    } else {
      selfInput.value = '';
      familyInput.value = '';
      societyInput.value = '';
      soulInput.value = '';
      summaryInput.value = '';
    }

    updateCharCounters();
    updateSentencePreview();
  }

  feedbackDateInput.addEventListener('change', (e) => {
    populateFeedbackForm(e.target.value);
  });

  function updateCharCounters() {
    document.getElementById('counter-self').textContent = `${selfInput.value.length}자`;
    document.getElementById('counter-family').textContent = `${familyInput.value.length}자`;
    document.getElementById('counter-society').textContent = `${societyInput.value.length}자`;
    document.getElementById('counter-soul').textContent = `${soulInput.value.length}자`;
  }

  [selfInput, familyInput, societyInput, soulInput].forEach(el => {
    el.addEventListener('input', () => {
      updateCharCounters();
      triggerAutosaveIndicator();
    });
  });

  summaryInput.addEventListener('input', () => {
    updateSentencePreview();
    triggerAutosaveIndicator();
  });

  function updateSentencePreview() {
    const val = summaryInput.value.trim() || '나의 소리를 조용히 찾아가는 하루';
    sentencePreview.innerHTML = `" 오늘 나의 하루는 <u>${escapeHTML(val)}</u> 이었다. "`;
  }

  // Quick Prompt Chips Interactivity
  document.querySelectorAll('.quick-chips .chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      const container = chip.closest('.quick-chips');
      const targetId = container.getAttribute('data-target');
      const targetInput = document.getElementById(targetId);
      const chipText = chip.textContent.replace(/^\+\s*/, '');

      if (targetInput.value.trim() === '') {
        targetInput.value = chipText + '.';
      } else {
        targetInput.value += ' ' + chipText + '.';
      }

      updateCharCounters();
      triggerAutosaveIndicator();
    });
  });

  let autosaveTimer = null;
  function triggerAutosaveIndicator() {
    const indicator = document.getElementById('autosave-indicator');
    indicator.style.color = '#c084fc';
    indicator.innerHTML = '<i class="fa-solid fa-cloud-arrow-up"></i> 입력 중...';

    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      indicator.style.color = '#10b981';
      indicator.innerHTML = '<i class="fa-solid fa-check"></i> 자동 임시 저장됨';
    }, 800);
  }

  // Save Daily Feedback Function
  async function saveDailyFeedback() {
    const dateStr = feedbackDateInput.value;
    const existingIndex = state.daily_logs.findIndex(l => l.date === dateStr);

    const startDate = new Date(state.user_profile.challenge_start_date);
    const currentDate = new Date(dateStr);
    const diffTime = currentDate - startDate;
    const dayNum = Math.max(1, Math.min(21, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1));

    const newLog = {
      day: dayNum,
      date: dateStr,
      created_at: new Date().toISOString(),
      self_feedback: selfInput.value.trim(),
      family_feedback: familyInput.value.trim(),
      society_feedback: societyInput.value.trim(),
      soul_feedback: soulInput.value.trim(),
      one_sentence_summary: summaryInput.value.trim() || '온전히 나답게 살았던 하루'
    };

    if (existingIndex >= 0) {
      state.daily_logs[existingIndex] = newLog;
    } else {
      state.daily_logs.push(newLog);
    }

    saveStateToLocalStorage();
    await saveDailyFeedbackToSupabase(newLog);
    updateUI();
    showToast(`Day ${dayNum} 피드백이 저장되었습니다! 💾`, 'success');

    // Check if 21 days completed
    if (state.daily_logs.length >= 21) {
      triggerConfetti();
      openComprehensiveReflectionModal();
    }
  }

  // Delete Daily Feedback Function
  async function deleteDailyFeedback() {
    const dateStr = feedbackDateInput.value;
    const logIndex = state.daily_logs.findIndex(l => l.date === dateStr);

    if (logIndex >= 0) {
      if (confirm(`${dateStr} 피드백 기록을 정말 삭제하시겠습니까?`)) {
        state.daily_logs.splice(logIndex, 1);
        saveStateToLocalStorage();
        await deleteDailyFeedbackFromSupabase(dateStr);
        updateUI();
        showToast(`${dateStr} 피드백이 삭제되었습니다.`, 'info');
      }
    }
  }

  const deleteBtn = document.getElementById('delete-daily-btn');
  if (deleteBtn) deleteBtn.addEventListener('click', deleteDailyFeedback);

  const saveBtn1 = document.getElementById('save-daily-btn');
  const saveBtn2 = document.getElementById('save-daily-btn-bottom');
  const saveBtn3 = document.getElementById('save-daily-log-btn');
  if (saveBtn1) saveBtn1.addEventListener('click', saveDailyFeedback);
  if (saveBtn2) saveBtn2.addEventListener('click', saveDailyFeedback);
  if (saveBtn3) saveBtn3.addEventListener('click', saveDailyFeedback);

  // ------------------------------------------------------------------------
  // 7. DASHBOARD & 21-DAY HABIT TRACKER
  // ------------------------------------------------------------------------
  function renderGrassGrid() {
    const container = document.getElementById('grass-grid-container') || document.getElementById('grass-grid');
    if (!container) return;
    container.innerHTML = '';

    const logsMap = {};
    state.daily_logs.forEach(log => {
      logsMap[log.day] = log;
    });

    for (let day = 1; day <= 21; day++) {
      const tile = document.createElement('div');
      const log = logsMap[day];

      tile.className = 'grass-tile';
      if (log) {
        tile.classList.add('completed');
      }

      tile.innerHTML = `
        <div class="grass-tile-day">Day ${day}</div>
        <div class="grass-tile-status">${log ? '✨' : '⚪'}</div>
        <div class="grass-tile-date">${log ? log.date.slice(5) : ''}</div>
      `;

      tile.title = log ? `Day ${day}: "${log.one_sentence_summary}"` : `Day ${day} 피드백 미작성`;

      tile.addEventListener('click', () => {
        if (log) {
          feedbackDateInput.value = log.date;
        } else {
          // Calculate date for Day N
          const start = new Date(state.user_profile.challenge_start_date);
          start.setDate(start.getDate() + (day - 1));
          feedbackDateInput.value = start.toISOString().split('T')[0];
        }
        populateFeedbackForm(feedbackDateInput.value);
        switchStep(3);
      });

      container.appendChild(tile);
    }
  }

  function renderEntriesLogList() {
    const container = document.getElementById('entries-log-list') || document.getElementById('timeline-log-list');
    if (!container) return;
    container.innerHTML = '';

    const sortedLogs = [...state.daily_logs].sort((a, b) => b.day - a.day);

    if (sortedLogs.length === 0) {
      container.innerHTML = '<p class="text-muted" style="text-align:center; padding: 20px;">아직 작성된 피드백 기록이 없습니다.</p>';
      return;
    }

    sortedLogs.forEach(log => {
      const card = document.createElement('div');
      card.className = 'entry-row-card';
      card.innerHTML = `
        <div class="entry-main-info">
          <span class="entry-day-tag">Day ${log.day}</span>
          <div class="entry-sentence">" ${escapeHTML(log.one_sentence_summary)} "</div>
        </div>
        <div class="entry-date">${log.date}</div>
      `;

      card.addEventListener('click', () => {
        feedbackDateInput.value = log.date;
        populateFeedbackForm(log.date);
        switchStep(3);
      });

      container.appendChild(card);
    });
  }

  // ------------------------------------------------------------------------
  // 8. PROFILE & GOALS EDIT MODAL (ST STEP 2)
  // ------------------------------------------------------------------------
  const editGoalsModal = document.getElementById('edit-goals-modal');

  function openGoalsModal(focusTarget = null) {
    document.getElementById('input-user-name').value = state.user_profile.user_id;
    document.getElementById('input-oneword').value = state.user_profile.one_word;
    document.getElementById('input-oneword-quote').value = state.user_profile.one_word_quote;
    document.getElementById('input-goal-self').value = state.user_profile.four_area_goals.self;
    document.getElementById('input-goal-family').value = state.user_profile.four_area_goals.family;
    document.getElementById('input-goal-society').value = state.user_profile.four_area_goals.society;
    document.getElementById('input-goal-soul').value = state.user_profile.four_area_goals.soul;

    editGoalsModal.classList.add('active');

    if (focusTarget) {
      const targetInput = document.getElementById(`input-goal-${focusTarget}`) || 
                          document.getElementById(`input-${focusTarget}`);
      if (targetInput) {
        setTimeout(() => {
          targetInput.focus();
          targetInput.select();
        }, 100);
      }
    }
  }

  document.getElementById('open-edit-goals-btn').addEventListener('click', (e) => {
    e.stopPropagation();
    openGoalsModal('oneword');
  });

  // Allow clicking any Step 2 Card or Edit Button to open modal directly
  document.querySelectorAll('[data-edit-target]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      const target = el.getAttribute('data-edit-target');
      openGoalsModal(target);
    });
  });

  const postcardElement = document.getElementById('oneword-card-element');
  if (postcardElement) {
    postcardElement.style.cursor = 'pointer';
    postcardElement.addEventListener('click', (e) => {
      if (!e.target.closest('#open-edit-goals-btn')) {
        openGoalsModal('oneword');
      }
    });
  }

  document.getElementById('close-goals-modal').addEventListener('click', () => {
    editGoalsModal.classList.remove('active');
  });
  document.getElementById('cancel-goals-modal').addEventListener('click', () => {
    editGoalsModal.classList.remove('active');
  });

  async function saveGoalsHandler() {
    const inputName = document.getElementById('input-user-name');
    if (inputName && inputName.value.trim()) {
      state.user_profile.user_name = inputName.value.trim();
    }
    state.user_profile.one_word = document.getElementById('input-oneword')?.value.trim() || '경청';
    state.user_profile.one_word_quote = document.getElementById('input-oneword-quote')?.value.trim() || '나다움을 찾아가는 삶';
    state.user_profile.four_area_goals.self = document.getElementById('input-goal-self')?.value.trim() || '';
    state.user_profile.four_area_goals.family = document.getElementById('input-goal-family')?.value.trim() || '';
    state.user_profile.four_area_goals.society = document.getElementById('input-goal-society')?.value.trim() || '';
    state.user_profile.four_area_goals.soul = document.getElementById('input-goal-soul')?.value.trim() || '';

    saveStateToLocalStorage();
    await saveProfileToSupabase();
    updateUI();
    if (editGoalsModal) {
      editGoalsModal.classList.remove('active');
      editGoalsModal.style.display = 'none';
    }
    showToast('원워드 및 4영역 다짐이 Supabase 클라우드에 저장되었습니다! ☁️', 'success');
  }

  const saveGoalsBtn1 = document.getElementById('save-goals-modal-btn');
  const saveGoalsBtn2 = document.getElementById('save-goals-btn');
  if (saveGoalsBtn1) saveGoalsBtn1.addEventListener('click', saveGoalsHandler);
  if (saveGoalsBtn2) saveGoalsBtn2.addEventListener('click', saveGoalsHandler);

  // ------------------------------------------------------------------------
  // 9. 21-DAY COMPREHENSIVE REFLECTION MODAL
  // ------------------------------------------------------------------------
  const reflectionModal = document.getElementById('comprehensive-reflection-modal');

  document.getElementById('view-comprehensive-reflection-btn').addEventListener('click', () => {
    openComprehensiveReflectionModal();
  });

  function openComprehensiveReflectionModal() {
    document.getElementById('reflection-user-title').textContent = `${state.user_profile.user_id} 님의 21일 성찰 종합 리포트`;

    // Aggregate feedback text per area
    const selfTexts = state.daily_logs.map(l => l.self_feedback).filter(Boolean);
    const familyTexts = state.daily_logs.map(l => l.family_feedback).filter(Boolean);
    const societyTexts = state.daily_logs.map(l => l.society_feedback).filter(Boolean);
    const soulTexts = state.daily_logs.map(l => l.soul_feedback).filter(Boolean);
    const sentences = state.daily_logs.map(l => l.one_sentence_summary).filter(Boolean);

    document.getElementById('reflection-summary-self').textContent = selfTexts.length > 0 
      ? `• 총 ${selfTexts.length}회 성찰 기록\n" ${selfTexts[selfTexts.length - 1]} "` 
      : '아직 기록이 부족합니다.';

    document.getElementById('reflection-summary-family').textContent = familyTexts.length > 0 
      ? `• 총 ${familyTexts.length}회 성찰 기록\n" ${familyTexts[familyTexts.length - 1]} "` 
      : '아직 기록이 부족합니다.';

    document.getElementById('reflection-summary-society').textContent = societyTexts.length > 0 
      ? `• 총 ${societyTexts.length}회 성찰 기록\n" ${societyTexts[societyTexts.length - 1]} "` 
      : '아직 기록이 부족합니다.';

    document.getElementById('reflection-summary-soul').textContent = soulTexts.length > 0 
      ? `• 총 ${soulTexts.length}회 성찰 기록\n" ${soulTexts[soulTexts.length - 1]} "` 
      : '아직 기록이 부족합니다.';

    const bestSentence = sentences.length > 0 ? sentences[sentences.length - 1] : '나의 소리를 조용히 찾아가는 하루';
    document.getElementById('reflection-best-sentence').textContent = `" ${bestSentence} "`;

    reflectionModal.classList.add('active');
  }

  document.getElementById('close-reflection-modal').addEventListener('click', () => {
    reflectionModal.classList.remove('active');
  });
  document.getElementById('close-reflection-modal-btn').addEventListener('click', () => {
    reflectionModal.classList.remove('active');
  });

  document.getElementById('print-reflection-btn').addEventListener('click', () => {
    window.print();
  });

  // ------------------------------------------------------------------------
  // 10. BACKUP & RESTORE MODAL
  // ------------------------------------------------------------------------
  const backupModal = document.getElementById('backup-modal');

  document.getElementById('open-backup-btn').addEventListener('click', () => {
    backupModal.classList.add('active');
  });
  document.getElementById('close-backup-modal').addEventListener('click', () => {
    backupModal.classList.remove('active');
  });

  // JSON Export
  document.getElementById('export-json-btn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `dream_morning_backup_${state.user_profile.user_id}_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('JSON 데이터 백업 파일이 다운로드되었습니다.', 'success');
  });

  // JSON Import
  const fileInput = document.getElementById('import-json-file');
  document.getElementById('import-json-btn').addEventListener('click', () => {
    fileInput.click();
  });

  fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.user_profile && imported.daily_logs) {
          state = imported;
          saveState();
          backupModal.classList.remove('active');
          showToast('데이터 복원이 성공적으로 완료되었습니다!', 'success');
        } else {
          showToast('올바르지 않은 데이터 형식입니다.', 'error');
        }
      } catch (err) {
        showToast('JSON 파일 파싱 실패', 'error');
      }
    };
    reader.readAsText(file);
  });

  // Start New 21-Day Challenge
  document.getElementById('start-new-challenge-btn').addEventListener('click', () => {
    if (confirm('새로운 21일 챌린지를 시작하시겠습니까? (기존 기록이 초기화됩니다)')) {
      state = createDefaultState();
      saveState();
      backupModal.classList.remove('active');
      showToast('새 21일 챌린지가 시작되었습니다! 🎯 2단계에서 목표를 설정해 보세요.', 'success');
    }
  });

  // Load Sample (Virtual) Data
  document.getElementById('load-sample-data-btn').addEventListener('click', () => {
    if (confirm('샘플(가상) 데이터를 불러오시겠습니까? 체험용 일지와 프로필이 생성됩니다.')) {
      state = getSampleState();
      saveState();
      backupModal.classList.remove('active');
      showToast('샘플 데이터가 로드되었습니다! ✨', 'info');
    }
  });

  // Reset All Data
  document.getElementById('reset-all-data-btn').addEventListener('click', () => {
    if (confirm('정말로 모든 피드백 기록 및 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem(STORAGE_KEY);
      state = createDefaultState();
      saveStateToLocalStorage();
      backupModal.classList.remove('active');
      showToast('모든 데이터가 초기화되었습니다.', 'info');
    }
  });

  // Handle First-Time User Welcome Modal
  const welcomeModal = document.getElementById('user-welcome-modal');
  const saveWelcomeBtn = document.getElementById('save-user-welcome-btn');

  if (saveWelcomeBtn) {
    saveWelcomeBtn.addEventListener('click', () => {
      const name = document.getElementById('welcome-user-name-input').value.trim();
      const email = document.getElementById('welcome-user-email-input').value.trim();

      if (!name) {
        showToast('성함 또는 닉네임을 입력해 주세요.', 'error');
        return;
      }

      state.user_profile.user_name = name;
      if (email) state.user_profile.user_email = email;
      saveStateToLocalStorage();
      updateUI();

      if (welcomeModal) welcomeModal.classList.remove('active');
      showToast(`${name} 님 반갑습니다! 21일 회고 피드백을 시작합니다. 🚀`, 'success');

      // Pre-fill Auth Modal if email was provided
      if (email) {
        const authEmailInput = document.getElementById('auth-email-input');
        const authNameInput = document.getElementById('auth-name-input');
        if (authEmailInput) authEmailInput.value = email;
        if (authNameInput) authNameInput.value = name;
      }
    });
  }

  // ------------------------------------------------------------------------
  // 11. SUPABASE AUTHENTICATION & POSTGRES REAL DATABASE ENGINE
  // ------------------------------------------------------------------------
  let supabaseClient = null;
  let currentSession = null;
  let currentUser = null;
  let activeAuthTab = 'signup'; // Default to 'signup'

  window.submitAuthForm = function() {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-password-input').value.trim();
    const name = document.getElementById('auth-name-input')?.value.trim();

    if (!email || !password) {
      showToast('이메일과 비밀번호(6자 이상)를 입력해 주세요.', 'error');
      return;
    }

    const nameGroup = document.getElementById('signup-name-group');
    const isSignupVisible = nameGroup && (nameGroup.style.display === 'block' || nameGroup.style.display === '');

    if (activeAuthTab === 'signup' || isSignupVisible) {
      handleSignUp(email, password, name);
    } else {
      handleSignIn(email, password);
    }
  };

  function updateSupabaseUI(isConnected) {
    const badge = document.getElementById('supabase-status-badge');
    const syncBtn = document.getElementById('manual-sync-supabase-btn');
    const urlInput = document.getElementById('supabase-url-input');
    const keyInput = document.getElementById('supabase-key-input');

    if (urlInput && state.supabase_config?.url) {
      urlInput.value = state.supabase_config.url;
    }
    if (keyInput && state.supabase_config?.anon_key) {
      keyInput.value = state.supabase_config.anon_key;
    }

    if (badge) {
      if (isConnected) {
        badge.className = 'chronos-badge badge-mint';
        badge.innerHTML = '<i class="fa-solid fa-cloud"></i> DB 연결됨';
        if (syncBtn) syncBtn.style.display = 'inline-flex';
      } else {
        badge.className = 'chronos-badge badge-coral';
        badge.textContent = 'API Key 미설정';
        if (syncBtn) syncBtn.style.display = 'none';
      }
    }
  }

  function initSupabaseClient() {
    const config = window.DREAM_MORNING_CONFIG || {};
    const url = config.url || (state.supabase_config && state.supabase_config.url) || 'https://mftamdfgyhtkwqceqmxi.supabase.co';
    const anonKey = config.anonKey || (state.supabase_config && state.supabase_config.anon_key) || '';

    if (window.supabase && window.supabase.createClient && url && anonKey) {
      try {
        supabaseClient = window.supabase.createClient(url, anonKey, {
          auth: {
            persistSession: true,
            autoRefreshToken: true,
            detectSessionInUrl: true
          }
        });
        updateSupabaseUI(true);
        return true;
      } catch (e) {
        console.error('Supabase initialization failed:', e);
        supabaseClient = null;
        updateSupabaseUI(false);
        return false;
      }
    } else {
      supabaseClient = null;
      updateSupabaseUI(false);
      return false;
    }
  }

  async function setupSupabaseAuth() {
    if (!initSupabaseClient()) {
      console.warn('Supabase Client not ready yet. Please configure Anon Key.');
      return;
    }

    // Supabase Auth State Listener
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
      console.log('Supabase Auth Event:', event, session);
      currentSession = session;
      currentUser = session ? session.user : null;

      updateAuthUI(currentUser);

      if (event === 'SIGNED_IN' && currentUser) {
        showGlobalLoading('Supabase 클라우드 데이터 불러오는 중...');
        await loadDataFromSupabase(currentUser.id);
        await checkAndMigrateLocalStorage(currentUser);
        hideGlobalLoading();
      } else if (event === 'SIGNED_OUT') {
        state = createDefaultState();
        updateUI();
      }
    });

    // Check Existing Session
    try {
      const { data: { session }, error } = await supabaseClient.auth.getSession();
      if (session) {
        currentSession = session;
        currentUser = session.user;
        updateAuthUI(currentUser);
        showGlobalLoading('Supabase 클라우드 데이터 불러오는 중...');
        await loadDataFromSupabase(currentUser.id);
        await checkAndMigrateLocalStorage(currentUser);
        hideGlobalLoading();
      } else {
        updateAuthUI(null);
      }
    } catch (e) {
      console.error('Session restore error:', e);
      hideGlobalLoading();
    }
  }

  function isUUID(str) {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(String(str).trim());
  }

  function updateAuthUI(user) {
    const authBtn = document.getElementById('open-auth-modal-btn');
    const profilePill = document.getElementById('header-user-profile');
    const headerUserName = document.getElementById('header-user-name');

    if (user) {
      if (authBtn) authBtn.style.display = 'none';
      if (profilePill) profilePill.style.display = 'inline-flex';

      let displayName = state.user_profile.user_name;
      if (!displayName || isUUID(displayName)) {
        displayName = user.user_metadata?.user_name;
      }
      if (!displayName || isUUID(displayName)) {
        displayName = user.email?.split('@')[0] || '꿈모닝 회원';
      }

      if (headerUserName) headerUserName.textContent = displayName;
      const displayUserId = document.getElementById('display-user-id');
      if (displayUserId) displayUserId.textContent = displayName;
    } else {
      if (authBtn) authBtn.style.display = 'inline-flex';
      if (profilePill) profilePill.style.display = 'none';
      const displayUserId = document.getElementById('display-user-id');
      if (displayUserId) displayUserId.textContent = 'Guest (로그인 필요)';
    }
  }

  // Auth Operations: Sign In, Sign Up, Sign Out
  async function handleSignIn(email, password) {
    if (!supabaseClient) {
      showToast('🔑 Supabase API Key가 설정되지 않았습니다. ⚙️ 설정 창에서 Key를 붙여넣고 [연동 및 저장]을 누른 뒤 다시 시도해 주세요.', 'error');
      const authModal = document.getElementById('auth-modal');
      if (authModal) authModal.classList.remove('active');
      const backupModal = document.getElementById('backup-modal');
      if (backupModal) backupModal.classList.add('active');
      return;
    }

    showGlobalLoading('로그인 중입니다...');
    try {
      const { data, error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      currentSession = data.session;
      currentUser = data.user;
      state.user_profile.user_id = data.user.id;
      state.user_profile.user_email = data.user.email;
      
      updateAuthUI(data.user);
      showToast(`${data.user.email} 님 환영합니다! 🎉`, 'success');
      window.closeAuthModal();
      await loadDataFromSupabase(data.user.id);
      
      // Auto transition to Mindfulness & Writing Section
      const tab1Btn = document.querySelector('[data-step="1"]');
      if (tab1Btn) tab1Btn.click();
    } catch (err) {
      console.error('Sign in error:', err);
      showToast(`로그인 안내: ${err.message || '이메일 또는 비밀번호를 확인해주세요.'}`, 'error');
    } finally {
      hideGlobalLoading();
    }
  }

  async function handleSignUp(email, password, userName) {
    if (!supabaseClient) {
      showToast('🔑 Supabase API Key가 설정되지 않았습니다. ⚙️ 설정 창에서 Key를 붙여넣고 [연동 및 저장]을 누른 뒤 다시 시도해 주세요.', 'error');
      window.closeAuthModal();
      const backupModal = document.getElementById('backup-modal');
      if (backupModal) {
        backupModal.classList.add('active');
        backupModal.style.display = 'flex';
      }
      return;
    }

    showGlobalLoading('회원가입 처리 중입니다...');
    try {
      const { data, error } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: {
            user_name: userName || email.split('@')[0]
          }
        }
      });

      // If user is already registered in Supabase, automatically sign in with same password!
      if (error && (error.message?.toLowerCase().includes('already registered') || error.status === 400)) {
        showGlobalLoading('이미 생성된 계정입니다. 로그인 진행 중...');
        const { data: signInData, error: signInErr } = await supabaseClient.auth.signInWithPassword({
          email,
          password
        });
        if (signInErr) {
          throw new Error('이미 회원가입된 이메일입니다. 비밀번호를 확인하시고 [로그인] 탭에서 로그인해 주세요.');
        } else {
          currentSession = signInData.session;
          currentUser = signInData.user;
          updateAuthUI(signInData.user);
          showToast(`${userName || email} 님 로그인되었습니다! 🎉`, 'success');
          window.closeAuthModal();
          await loadDataFromSupabase(signInData.user.id);
          
          const tab1Btn = document.querySelector('[data-step="1"]');
          if (tab1Btn) tab1Btn.click();
          return;
        }
      } else if (error) {
        throw error;
      }

      if (data.user) {
        // Auto sign-in if session is not automatically established by Supabase
        if (!data.session) {
          const { data: signInData, error: signInErr } = await supabaseClient.auth.signInWithPassword({
            email,
            password
          });
          if (!signInErr && signInData.user) {
            data.user = signInData.user;
            data.session = signInData.session;
            currentSession = signInData.session;
            currentUser = signInData.user;
          }
        } else {
          currentSession = data.session;
          currentUser = data.user;
        }

        state.user_profile.user_id = data.user.id;
        state.user_profile.user_name = userName || email.split('@')[0];
        state.user_profile.user_email = email;

        // Upsert Initial Profile directly to public.user_profiles
        const profilePayload = {
          user_id: data.user.id,
          user_name: userName || email.split('@')[0],
          email: email,
          oneword: state.user_profile.one_word || '경청',
          oneword_quote: state.user_profile.one_word_quote || '',
          goal_self: state.user_profile.four_area_goals?.self || '',
          goal_family: state.user_profile.four_area_goals?.family || '',
          goal_society: state.user_profile.four_area_goals?.society || '',
          goal_soul: state.user_profile.four_area_goals?.soul || '',
          sound_type: state.sound_settings?.sound_type || 'rain',
          volume: state.sound_settings?.volume || 0.4,
          updated_at: new Date().toISOString()
        };

        const { error: pErr } = await supabaseClient
          .from('user_profiles')
          .upsert(profilePayload, { onConflict: 'user_id' });

        if (pErr) console.error('Initial profile upsert error:', pErr);

        saveStateToLocalStorage();
        updateAuthUI(data.user);
        updateUI();

        showToast(`${userName || email} 님 회원가입이 완료되었습니다! 🚀`, 'success');
        window.closeAuthModal();
        await loadDataFromSupabase(data.user.id);

        const tab1Btn = document.querySelector('[data-step="1"]');
        if (tab1Btn) tab1Btn.click();
      }
    } catch (err) {
      console.error('Sign up error:', err);
      showToast(`가입/로그인 안내: ${formatAuthErrorMessage(err.message)}`, 'error');
    } finally {
      hideGlobalLoading();
    }
  }

  async function handleSignOut() {
    if (!supabaseClient) return;
    if (confirm('정말 로그아웃 하시겠습니까?')) {
      showGlobalLoading('로그아웃 중...');
      try {
        await supabaseClient.auth.signOut();
        showToast('성공적으로 로그아웃되었습니다.', 'info');
      } catch (err) {
        console.error('Sign out error:', err);
      } finally {
        hideGlobalLoading();
      }
    }
  }

  // Load User Data from Supabase Postgres Database (Source of Truth)
  async function loadDataFromSupabase(userId) {
    if (!supabaseClient || !userId) return;

    try {
      // 1. Fetch user_profiles
      const { data: profile, error: pErr } = await supabaseClient
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (pErr) {
        console.error('Fetch profile error:', pErr);
      } else if (profile) {
        state.user_profile.user_id = profile.user_id;
        state.user_profile.user_name = profile.user_name || currentUser.user_metadata?.user_name || currentUser.email?.split('@')[0];
        state.user_profile.user_email = profile.email || currentUser.email;
        state.user_profile.one_word = profile.oneword || state.user_profile.one_word;
        state.user_profile.one_word_quote = profile.oneword_quote || state.user_profile.one_word_quote;
        state.user_profile.four_area_goals.self = profile.goal_self || state.user_profile.four_area_goals.self;
        state.user_profile.four_area_goals.family = profile.goal_family || state.user_profile.four_area_goals.family;
        state.user_profile.four_area_goals.society = profile.goal_society || state.user_profile.four_area_goals.society;
        state.user_profile.four_area_goals.soul = profile.goal_soul || state.user_profile.four_area_goals.soul;
        if (profile.sound_type) state.sound_settings.sound_type = profile.sound_type;
        if (profile.volume !== null && profile.volume !== undefined) state.sound_settings.volume = profile.volume;
        
        updateAuthUI(currentUser);
        updateUI();
      }

      // 2. Fetch daily_logs
      const { data: logs, error: lErr } = await supabaseClient
        .from('daily_logs')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true });

      if (lErr) {
        console.error('Fetch daily logs error:', lErr);
      } else if (logs) {
        state.daily_logs = logs.map(l => ({
          day: l.day,
          date: l.date,
          created_at: l.created_at,
          self_feedback: l.self_feedback || '',
          family_feedback: l.family_feedback || '',
          society_feedback: l.society_feedback || '',
          soul_feedback: l.soul_feedback || '',
          one_sentence_summary: l.one_sentence_summary || ''
        }));
      }

      updateUI();
    } catch (e) {
      console.error('Load data from Supabase error:', e);
    }
  }

  // Upsert Profile to public.user_profiles Table
  async function saveProfileToSupabase() {
    if (!supabaseClient || !currentUser) {
      saveStateToLocalStorage();
      return;
    }

    try {
      const payload = {
        user_id: currentUser.id,
        user_name: state.user_profile.user_name || currentUser.user_metadata?.user_name || currentUser.email.split('@')[0],
        email: currentUser.email,
        oneword: state.user_profile.one_word,
        oneword_quote: state.user_profile.one_word_quote,
        goal_self: state.user_profile.four_area_goals.self,
        goal_family: state.user_profile.four_area_goals.family,
        goal_society: state.user_profile.four_area_goals.society,
        goal_soul: state.user_profile.four_area_goals.soul,
        sound_type: state.sound_settings.sound_type,
        volume: state.sound_settings.volume,
        updated_at: new Date().toISOString()
      };

      const { error } = await supabaseClient
        .from('user_profiles')
        .upsert(payload, { onConflict: 'user_id' });

      if (error) throw error;
      saveStateToLocalStorage();
    } catch (err) {
      console.error('Save profile to Supabase error:', err);
      showToast('저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
  }

  // Upsert Daily Log to public.daily_logs Table
  async function saveDailyFeedbackToSupabase(log) {
    if (!supabaseClient || !currentUser) {
      showToast('로그인이 필요합니다. 로그인 후 저장해 주세요.', 'error');
      openAuthModal();
      return;
    }

    try {
      const payload = {
        user_id: currentUser.id,
        user_name: state.user_profile.user_name || currentUser.user_metadata?.user_name || currentUser.email.split('@')[0],
        day: log.day,
        date: log.date,
        self_feedback: log.self_feedback || '',
        family_feedback: log.family_feedback || '',
        society_feedback: log.society_feedback || '',
        soul_feedback: log.soul_feedback || '',
        one_sentence_summary: log.one_sentence_summary || '',
        updated_at: new Date().toISOString()
      };

      const { error } = await supabaseClient
        .from('daily_logs')
        .upsert(payload, { onConflict: 'user_id,date' });

      if (error) throw error;
      saveStateToLocalStorage();
    } catch (err) {
      console.error('Save daily log to Supabase error:', err);
      showToast('일기 저장 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.', 'error');
    }
  }

  // Delete Daily Log from public.daily_logs Table
  async function deleteDailyFeedbackFromSupabase(dateStr) {
    if (!supabaseClient || !currentUser) return;

    try {
      const { error } = await supabaseClient
        .from('daily_logs')
        .delete()
        .eq('user_id', currentUser.id)
        .eq('date', dateStr);

      if (error) throw error;
    } catch (err) {
      console.error('Delete daily log error:', err);
      showToast('삭제 중 문제가 발생했습니다.', 'error');
    }
  }

  // 1-Time Migration from LocalStorage to Supabase Real DB
  async function checkAndMigrateLocalStorage(user) {
    const MIGRATION_FLAG = `dream_morning_supabase_migrated_${user.id}`;
    if (localStorage.getItem(MIGRATION_FLAG) === 'true') return;

    const localDataRaw = localStorage.getItem(STORAGE_KEY);
    if (!localDataRaw) return;

    try {
      const localData = JSON.parse(localDataRaw);
      if (!localData || !localData.daily_logs || localData.daily_logs.length === 0) {
        localStorage.setItem(MIGRATION_FLAG, 'true');
        return;
      }

      // Check if user already has logs in Supabase
      const { count, error: countErr } = await supabaseClient
        .from('daily_logs')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (countErr) {
        console.error('Migration count check error:', countErr);
        return;
      }

      if (count === 0 && localData.daily_logs.length > 0) {
        showToast('기존 로컬 일지를 Supabase 클라우드로 이전 중입니다... 📦', 'info');

        // Migrate Profile
        if (localData.user_profile) {
          const profilePayload = {
            user_id: user.id,
            user_name: localData.user_profile.user_name || user.email.split('@')[0],
            email: user.email,
            oneword: localData.user_profile.one_word || '경청',
            oneword_quote: localData.user_profile.one_word_quote || '',
            goal_self: localData.user_profile.four_area_goals?.self || '',
            goal_family: localData.user_profile.four_area_goals?.family || '',
            goal_society: localData.user_profile.four_area_goals?.society || '',
            goal_soul: localData.user_profile.four_area_goals?.soul || '',
            sound_type: localData.sound_settings?.sound_type || 'rain',
            volume: localData.sound_settings?.volume || 0.4,
            updated_at: new Date().toISOString()
          };
          await supabaseClient.from('user_profiles').upsert(profilePayload, { onConflict: 'user_id' });
        }

        // Migrate Logs
        const logsPayload = localData.daily_logs.map(log => ({
          user_id: user.id,
          user_name: localData.user_profile?.user_name || user.email.split('@')[0],
          day: log.day,
          date: log.date,
          self_feedback: log.self_feedback || '',
          family_feedback: log.family_feedback || '',
          society_feedback: log.society_feedback || '',
          soul_feedback: log.soul_feedback || '',
          one_sentence_summary: log.one_sentence_summary || '',
          updated_at: new Date().toISOString()
        }));

        const { error: batchErr } = await supabaseClient
          .from('daily_logs')
          .upsert(logsPayload, { onConflict: 'user_id,date' });

        if (batchErr) throw batchErr;

        localStorage.setItem(MIGRATION_FLAG, 'true');
        showToast('기존 로컬 기록이 Supabase 클라우드로 안전하게 마이그레이션되었습니다! ☁️✨', 'success');
        await loadDataFromSupabase(user.id);
      } else {
        localStorage.setItem(MIGRATION_FLAG, 'true');
      }
    } catch (err) {
      console.error('Migration error:', err);
    }
  }

  // Auth Modal Controls (Exposed globally)
  window.openAuthModal = function() {
    console.log('openAuthModal triggered');
    document.querySelectorAll('.modal-overlay').forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.add('active');
      modal.style.display = 'flex';
    }
  };

  window.closeAuthModal = function() {
    const modal = document.getElementById('auth-modal');
    if (modal) {
      modal.classList.remove('active');
      modal.style.display = 'none';
    }
  };

  const openAuthBtn = document.getElementById('open-auth-modal-btn');
  if (openAuthBtn) openAuthBtn.addEventListener('click', window.openAuthModal);

  const closeAuthBtn = document.getElementById('close-auth-modal');
  if (closeAuthBtn) closeAuthBtn.addEventListener('click', window.closeAuthModal);

  const closeWelcomeBtn = document.getElementById('close-welcome-modal');
  if (closeWelcomeBtn) {
    closeWelcomeBtn.addEventListener('click', () => {
      const welcomeModal = document.getElementById('user-welcome-modal');
      if (welcomeModal) {
        welcomeModal.classList.remove('active');
        welcomeModal.style.display = 'none';
      }
    });
  }

  const welcomeToAuthBtn = document.getElementById('welcome-to-auth-btn');
  if (welcomeToAuthBtn) {
    welcomeToAuthBtn.addEventListener('click', () => {
      const welcomeModal = document.getElementById('user-welcome-modal');
      if (welcomeModal) {
        welcomeModal.classList.remove('active');
        welcomeModal.style.display = 'none';
      }
      window.openAuthModal();
    });
  }

  const tabSignin = document.getElementById('tab-signin');
  const tabSignup = document.getElementById('tab-signup');
  const nameGroup = document.getElementById('signup-name-group');
  const submitBtn = document.getElementById('auth-submit-btn');

  if (tabSignin && tabSignup) {
    tabSignin.addEventListener('click', () => {
      activeAuthTab = 'signin';
      tabSignin.classList.add('active');
      tabSignup.classList.remove('active');
      if (nameGroup) nameGroup.style.display = 'none';
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> 로그인';
    });

    tabSignup.addEventListener('click', () => {
      activeAuthTab = 'signup';
      tabSignup.classList.add('active');
      tabSignin.classList.remove('active');
      if (nameGroup) nameGroup.style.display = 'block';
      if (submitBtn) submitBtn.innerHTML = '<i class="fa-solid fa-user-plus"></i> 회원가입';
    });
  }

  window.submitAuthForm = function() {
    const email = document.getElementById('auth-email-input').value.trim();
    const password = document.getElementById('auth-password-input').value.trim();
    const name = document.getElementById('auth-name-input')?.value.trim();

    if (!email || !password) {
      showToast('이메일과 비밀번호(6자 이상)를 입력해 주세요.', 'error');
      return;
    }

    if (activeAuthTab === 'signin') {
      handleSignIn(email, password);
    } else {
      handleSignUp(email, password, name);
    }
  };

  if (submitBtn) {
    submitBtn.addEventListener('click', window.submitAuthForm);
  }

  const logoutIcon = document.getElementById('header-logout-icon');
  if (logoutIcon) logoutIcon.addEventListener('click', (e) => {
    e.stopPropagation();
    handleSignOut();
  });

  const saveSupabaseConfigBtn = document.getElementById('save-supabase-config-btn');
  if (saveSupabaseConfigBtn) {
    saveSupabaseConfigBtn.addEventListener('click', async () => {
      const key = document.getElementById('supabase-key-input').value.trim();
      if (!key) {
        showToast('Anon Public Key를 입력해 주세요.', 'error');
        return;
      }
      localStorage.setItem('dream_morning_supabase_anon_key', key);
      state.supabase_config.anon_key = key;
      showToast('Supabase API Key가 저장되었습니다. 세션을 연동합니다.', 'info');
      await setupSupabaseAuth();
    });
  }

  // Initialize Supabase Auth Engine
  setupSupabaseAuth();

  // ------------------------------------------------------------------------
  // 11. CONFETTI EFFECT FOR CELEBRATION
  // ------------------------------------------------------------------------
  function triggerConfetti() {
    for (let i = 0; i < 50; i++) {
      const p = document.createElement('div');
      p.style.position = 'fixed';
      p.style.left = Math.random() * 100 + 'vw';
      p.style.top = '-10px';
      p.style.width = '10px';
      p.style.height = '10px';
      p.style.backgroundColor = ['#10b981', '#6366f1', '#ec4899', '#fbbf24'][Math.floor(Math.random() * 4)];
      p.style.zIndex = '9999';
      p.style.borderRadius = '50%';
      p.style.pointerEvents = 'none';
      document.body.appendChild(p);

      const animation = p.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 1 },
        { transform: `translateY(100vh) rotate(${Math.random() * 720}deg)`, opacity: 0 }
      ], {
        duration: 2000 + Math.random() * 2000,
        easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
      });

      animation.onfinish = () => p.remove();
    }
  }

  // ------------------------------------------------------------------------
  // 12. UI SYNCHRONIZATION & TOAST ENGINE
  // ------------------------------------------------------------------------
  function calculateRealStreak() {
    if (!state.daily_logs || state.daily_logs.length === 0) return 0;
    const datesSet = new Set(state.daily_logs.map(l => l.date));
    let streak = 0;
    let checkDate = new Date();
    let checkStr = getLocalDateString(checkDate);

    // If today is not logged yet, check starting from yesterday
    if (!datesSet.has(checkStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      checkStr = getLocalDateString(checkDate);
      if (!datesSet.has(checkStr)) {
        return 0;
      }
    }

    while (datesSet.has(checkStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
      checkStr = getLocalDateString(checkDate);
    }
    return streak;
  }

  function updateUI() {
    // 1. Profile & Postcard
    const displayName = state.user_profile.user_name || state.user_profile.user_id || 'Dreamer';
    document.getElementById('display-user-id').textContent = displayName;
    const headerUserName = document.getElementById('header-user-name');
    if (headerUserName) {
      headerUserName.textContent = displayName;
    }
    document.getElementById('display-oneword').textContent = `" ${state.user_profile.one_word} "`;
    document.getElementById('display-oneword-quote').textContent = state.user_profile.one_word_quote;
    document.getElementById('display-goal-self').textContent = state.user_profile.four_area_goals.self;
    document.getElementById('display-goal-family').textContent = state.user_profile.four_area_goals.family;
    document.getElementById('display-goal-society').textContent = state.user_profile.four_area_goals.society;
    document.getElementById('display-goal-soul').textContent = state.user_profile.four_area_goals.soul;

    // 2. Stats & Progress
    const completedCount = state.daily_logs.length;
    const progressPercent = Math.round((completedCount / 21) * 100);
    const realStreak = calculateRealStreak();

    document.getElementById('header-streak').querySelector('#streak-count').textContent = realStreak;
    document.getElementById('current-day-label').textContent = `Day ${Math.min(21, completedCount + 1)} / 21`;
    document.getElementById('progress-percent-text').textContent = `${progressPercent}% (${completedCount} / 21일 완료)`;
    document.getElementById('challenge-progress-fill').style.width = `${progressPercent}%`;

    document.getElementById('stat-completed-days').textContent = `${completedCount} / 21일`;
    document.getElementById('stat-streak-count').textContent = `${realStreak}일`;
    document.getElementById('stat-completion-rate').textContent = `${progressPercent}%`;

    const totalWords = state.daily_logs.reduce((acc, log) => {
      return acc + (log.self_feedback?.length || 0) + (log.family_feedback?.length || 0) + 
                   (log.society_feedback?.length || 0) + (log.soul_feedback?.length || 0);
    }, 0);
    document.getElementById('stat-total-words').textContent = `${totalWords.toLocaleString()}자`;

    const lockBadge = document.getElementById('reflection-lock-badge');
    if (lockBadge) {
      if (completedCount >= 21) {
        lockBadge.textContent = '🎉 (완성)';
        lockBadge.style.color = '#34d399';
      } else {
        lockBadge.textContent = `(${completedCount}/21일)`;
        lockBadge.style.color = 'var(--text-muted)';
      }
    }

    // 3. Render Dashboard Grid & Entry Log
    renderGrassGrid();
    renderEntriesLogList();

    // 4. Form Synchronization
    populateFeedbackForm(feedbackDateInput.value);
  }

  // ------------------------------------------------------------------------
  // TOAST NOTIFICATIONS
  // ------------------------------------------------------------------------

  function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;

    let icon = 'fa-circle-info';
    if (type === 'success') icon = 'fa-circle-check';
    if (type === 'error') icon = 'fa-circle-exclamation';

    toast.innerHTML = `<i class="fa-solid ${icon}"></i> <span>${escapeHTML(message)}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.animation = 'slideInRight 0.3s reverse forwards';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }

  // Initialize UI & Check Welcome Modal
  updateTimerDisplay();
  updateUI();
});
