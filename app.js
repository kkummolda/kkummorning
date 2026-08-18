/* ==========================================================================
   꿈모닝 5분 피드백 웹 (Dream Morning 5-Min Feedback)
   Core Application Engine & Interactivity
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // ------------------------------------------------------------------------
  // 1. STATE & STORAGE MANAGEMENT
  // ------------------------------------------------------------------------
  const STORAGE_KEY = 'dream_morning_5min_data_v1';

  const defaultState = {
    user_profile: {
      user_id: 'Dreamer',
      one_word: '경청',
      one_word_quote: '타인의 소리와 내 영혼의 소리에 귀 기울이는 삶',
      challenge_start_date: new Date().toISOString().split('T')[0],
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
    daily_logs: [
      {
        day: 1,
        date: new Date().toISOString().split('T')[0],
        self_feedback: '감정에 휘둘리지 않고 나만의 중심을 지켰다.',
        family_feedback: '가족의 마음에 귀 기울이며 이야기를 경청해주었다.',
        society_feedback: '회의 시간에 다른 사람의 말을 먼저 듣는 태도를 가졌다.',
        soul_feedback: '잠시 숨을 고르고 내면의 호흡에 집중하여 평온을 얻었다.',
        one_sentence_summary: '나의 소리를 조용히 찾아가는 하루'
      }
    ]
  };

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
    return defaultState;
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
      // Pink Noise Rain Sound Generator
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
        output[i] *= 0.08;
        b6 = white * 0.115926;
      }

      const whiteNoise = audioCtx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;
      whiteNoise.loop = true;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 1000;

      whiteNoise.connect(filter);
      filter.connect(masterGain);
      whiteNoise.start();

      currentSoundNodes.push(whiteNoise);
    } else if (type === 'forest') {
      // Forest Wind & Deep Pad
      const osc = audioCtx.createOscillator();
      const oscGain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, audioCtx.currentTime); // A2

      const lfo = audioCtx.createOscillator();
      lfo.frequency.value = 0.2; // Slow wind modulation
      const lfoGain = audioCtx.createGain();
      lfoGain.gain.value = 10;
      lfo.connect(osc.frequency);

      oscGain.gain.value = 0.12;
      osc.connect(oscGain);
      oscGain.connect(masterGain);

      osc.start();
      lfo.start();
      currentSoundNodes.push(osc, lfo);
    } else if (type === 'musicbox') {
      // 432Hz Meditation Music Box Arpeggiator
      const scale = [216, 270, 324, 432, 540, 648]; // 432Hz harmonic scale
      let noteIndex = 0;

      const musicInterval = setInterval(() => {
        if (!isAudioPlaying) {
          clearInterval(musicInterval);
          return;
        }
        const freq = scale[noteIndex % scale.length];
        noteIndex = Math.floor(Math.random() * scale.length);

        const osc = audioCtx.createOscillator();
        const noteGain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 2.5);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start();
        osc.stop(audioCtx.currentTime + 2.6);
      }, 1200);

      currentSoundNodes.push({ stop: () => clearInterval(musicInterval) });
    } else if (type === 'fire') {
      // Campfire Low Warm Synth
      const osc1 = audioCtx.createOscillator();
      const osc2 = audioCtx.createOscillator();
      const fireGain = audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.value = 73.42; // D2
      osc2.type = 'sine';
      osc2.frequency.value = 110;

      fireGain.gain.value = 0.15;

      osc1.connect(fireGain);
      osc2.connect(fireGain);
      fireGain.connect(masterGain);

      osc1.start();
      osc2.start();
      currentSoundNodes.push(osc1, osc2);
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
    document.querySelectorAll('.step-tab-btn, .nav-link-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-step') == stepNum);
    });

    document.querySelectorAll('.step-view').forEach(view => {
      view.classList.remove('active');
    });
    document.getElementById(`view-step-${stepNum}`).classList.add('active');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  document.querySelectorAll('.step-tab-btn, .nav-link-btn').forEach(btn => {
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

  // Set default date to today
  const todayStr = new Date().toISOString().split('T')[0];
  feedbackDateInput.value = todayStr;

  function getLogForDate(dateStr) {
    return state.daily_logs.find(log => log.date === dateStr);
  }

  function populateFeedbackForm(dateStr) {
    const existingLog = getLogForDate(dateStr);
    
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
  function saveDailyFeedback() {
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

    saveState();
    showToast(`Day ${dayNum} 피드백이 저장되었습니다! 💾`, 'success');

    // Check if 21 days completed
    if (state.daily_logs.length >= 21) {
      triggerConfetti();
      openComprehensiveReflectionModal();
    }
  }

  const saveBtn1 = document.getElementById('save-daily-btn');
  const saveBtn2 = document.getElementById('save-daily-btn-bottom');
  if (saveBtn1) saveBtn1.addEventListener('click', saveDailyFeedback);
  if (saveBtn2) saveBtn2.addEventListener('click', saveDailyFeedback);

  // ------------------------------------------------------------------------
  // 7. DASHBOARD & 21-DAY HABIT TRACKER
  // ------------------------------------------------------------------------
  function renderGrassGrid() {
    const container = document.getElementById('grass-grid-container');
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
    const container = document.getElementById('entries-log-list');
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

  document.getElementById('open-edit-goals-btn').addEventListener('click', () => {
    document.getElementById('input-user-name').value = state.user_profile.user_id;
    document.getElementById('input-oneword').value = state.user_profile.one_word;
    document.getElementById('input-oneword-quote').value = state.user_profile.one_word_quote;
    document.getElementById('input-goal-self').value = state.user_profile.four_area_goals.self;
    document.getElementById('input-goal-family').value = state.user_profile.four_area_goals.family;
    document.getElementById('input-goal-society').value = state.user_profile.four_area_goals.society;
    document.getElementById('input-goal-soul').value = state.user_profile.four_area_goals.soul;

    editGoalsModal.classList.add('active');
  });

  document.getElementById('close-goals-modal').addEventListener('click', () => {
    editGoalsModal.classList.remove('active');
  });
  document.getElementById('cancel-goals-modal').addEventListener('click', () => {
    editGoalsModal.classList.remove('active');
  });

  document.getElementById('save-goals-modal-btn').addEventListener('click', () => {
    state.user_profile.user_id = document.getElementById('input-user-name').value.trim() || 'Dreamer';
    state.user_profile.one_word = document.getElementById('input-oneword').value.trim() || '경청';
    state.user_profile.one_word_quote = document.getElementById('input-oneword-quote').value.trim() || '나다움을 찾아가는 삶';
    state.user_profile.four_area_goals.self = document.getElementById('input-goal-self').value.trim();
    state.user_profile.four_area_goals.family = document.getElementById('input-goal-family').value.trim();
    state.user_profile.four_area_goals.society = document.getElementById('input-goal-society').value.trim();
    state.user_profile.four_area_goals.soul = document.getElementById('input-goal-soul').value.trim();

    saveState();
    editGoalsModal.classList.remove('active');
    showToast('원워드 및 4영역 다짐이 저장되었습니다!', 'success');
  });

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

  // Reset All Data
  document.getElementById('reset-all-data-btn').addEventListener('click', () => {
    if (confirm('정말로 모든 피드백 기록 및 설정을 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      localStorage.removeItem(STORAGE_KEY);
      state = defaultState;
      saveState();
      backupModal.classList.remove('active');
      showToast('모든 데이터가 초기화되었습니다.', 'info');
    }
  });

  // ------------------------------------------------------------------------
  // 11. CONFETTI EFFECT FOR CELEBRATION
  // ------------------------------------------------------------------------
  function triggerConfetti() {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

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
  function updateUI() {
    // 1. Profile & Postcard
    document.getElementById('display-user-id').textContent = state.user_profile.user_id;
    document.getElementById('display-oneword').textContent = `" ${state.user_profile.one_word} "`;
    document.getElementById('display-oneword-quote').textContent = state.user_profile.one_word_quote;
    document.getElementById('display-goal-self').textContent = state.user_profile.four_area_goals.self;
    document.getElementById('display-goal-family').textContent = state.user_profile.four_area_goals.family;
    document.getElementById('display-goal-society').textContent = state.user_profile.four_area_goals.society;
    document.getElementById('display-goal-soul').textContent = state.user_profile.four_area_goals.soul;

    // 2. Stats & Progress
    const completedCount = state.daily_logs.length;
    const progressPercent = Math.round((completedCount / 21) * 100);

    document.getElementById('header-streak').querySelector('#streak-count').textContent = completedCount;
    document.getElementById('current-day-label').textContent = `Day ${Math.min(21, completedCount + 1)} / 21`;
    document.getElementById('progress-percent-text').textContent = `${progressPercent}% (${completedCount} / 21일 완료)`;
    document.getElementById('challenge-progress-fill').style.width = `${progressPercent}%`;

    document.getElementById('stat-completed-days').textContent = `${completedCount} / 21일`;
    document.getElementById('stat-streak-count').textContent = `${completedCount}일`;
    document.getElementById('stat-completion-rate').textContent = `${progressPercent}%`;

    const totalWords = state.daily_logs.reduce((acc, log) => {
      return acc + (log.self_feedback?.length || 0) + (log.family_feedback?.length || 0) + 
                   (log.society_feedback?.length || 0) + (log.soul_feedback?.length || 0);
    }, 0);
    document.getElementById('stat-total-words').textContent = `${totalWords.toLocaleString()}자`;

    const lockBadge = document.getElementById('reflection-lock-badge');
    if (completedCount >= 21) {
      lockBadge.textContent = '🎉 (완성)';
      lockBadge.style.color = '#34d399';
    } else {
      lockBadge.textContent = `(${completedCount}/21일)`;
    }

    // 3. Render Dashboard Grid & Entry Log
    renderGrassGrid();
    renderEntriesLogList();

    // 4. Form Synchronization
    populateFeedbackForm(feedbackDateInput.value);
  }

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

  // Initialize UI
  updateTimerDisplay();
  updateUI();
});
