/**
 * Class 10 Personal Study Planner - Application Logic
 * Specially created for Abhishek | Board Exam Mission 2026
 */

(function () {
  'use strict';

  // State Management
  let soundEnabled = true;
  let activeTab = 'schedule';
  let activeFilter = 'all';
  let searchQuery = '';
  let selectedCalendarDay = 1;

  // Audio Context (Web Audio API for zero-dependency high quality sound FX)
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        audioCtx = new AudioContext();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Sound Synthesizers
  function playCoinSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc1 = audioCtx.createOscillator();
      const gain1 = audioCtx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain1.gain.setValueAtTime(0.3, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(audioCtx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio play error', e);
    }
  }

  function playCheckSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.12); // G5

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn('Audio error', e);
    }
  }

  function playFanfareSound() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + i * 0.09);

        gain.gain.setValueAtTime(0.25, now + i * 0.09);
        gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.09 + 0.4);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(now + i * 0.09);
        osc.stop(now + i * 0.09 + 0.4);
      });
    } catch (e) {
      console.warn('Fanfare error', e);
    }
  }

  function playBellChime() {
    if (!soundEnabled) return;
    try {
      initAudio();
      if (!audioCtx) return;

      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now); // A5

      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      osc.start(now);
      osc.stop(now + 1.2);
    } catch (e) {}
  }

  // ==========================================================================
  // CONFETTI ENGINE (Canvas-based lightweight, zero dependencies)
  // ==========================================================================
  const confettiCanvas = document.getElementById('confettiCanvas');
  let confettiCtx = null;
  let confettiParticles = [];
  let confettiAnimId = null;

  if (confettiCanvas) {
    confettiCtx = confettiCanvas.getContext('2d');
    function resizeCanvas() {
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
  }

  function triggerConfetti(originX, originY) {
    if (!confettiCtx) return;
    const colors = ['#6366f1', '#ec4899', '#10b981', '#f59e0b', '#06b6d4', '#fbbf24', '#a855f7'];
    const count = 70;
    const x = originX || window.innerWidth / 2;
    const y = originY || window.innerHeight / 2;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      confettiParticles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: Math.random() * 8 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        opacity: 1,
        life: 0,
        maxLife: Math.random() * 50 + 60
      });
    }

    if (!confettiAnimId) {
      animateConfetti();
    }
  }

  function animateConfetti() {
    if (!confettiCtx) return;
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    for (let i = confettiParticles.length - 1; i >= 0; i--) {
      const p = confettiParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2; // gravity
      p.vx *= 0.98; // friction
      p.rotation += p.rotationSpeed;
      p.life++;
      p.opacity = 1 - p.life / p.maxLife;

      confettiCtx.save();
      confettiCtx.translate(p.x, p.y);
      confettiCtx.rotate((p.rotation * Math.PI) / 180);
      confettiCtx.globalAlpha = Math.max(0, p.opacity);
      confettiCtx.fillStyle = p.color;
      confettiCtx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      confettiCtx.restore();

      if (p.life >= p.maxLife || p.y > confettiCanvas.height) {
        confettiParticles.splice(i, 1);
      }
    }

    if (confettiParticles.length > 0) {
      confettiAnimId = requestAnimationFrame(animateConfetti);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiAnimId = null;
    }
  }

  // Floating Coin Visual Animation
  function spawnFloatingCoin(x, y) {
    const el = document.createElement('div');
    el.className = 'floating-coin-effect';
    el.innerHTML = '🪙 +10';
    el.style.left = `${x}px`;
    el.style.top = `${y}px`;
    document.body.appendChild(el);

    setTimeout(() => {
      if (el.parentNode) el.parentNode.removeChild(el);
    }, 850);
  }

  // ==========================================================================
  // PROGRESS & GAMIFICATION
  // ==========================================================================
  const inMemoryStorage = {};

  function getTaskState(taskId) {
    try {
      return localStorage.getItem(`abhishek_task_${taskId}`) === 'true';
    } catch (e) {
      return inMemoryStorage[`abhishek_task_${taskId}`] === 'true';
    }
  }

  function setTaskState(taskId, state) {
    try {
      localStorage.setItem(`abhishek_task_${taskId}`, state);
    } catch (e) {
      inMemoryStorage[`abhishek_task_${taskId}`] = String(state);
    }
  }

  function calculateProgress() {
    const totalDays = window.PLAN_DATA.length;
    let totalTasks = 0;
    let completedTasks = 0;
    let completedDays = 0;

    window.PLAN_DATA.forEach((day) => {
      let dayCompleted = 0;
      day.tasks.forEach((task) => {
        totalTasks++;
        if (getTaskState(task.id)) {
          completedTasks++;
          dayCompleted++;
        }
      });
      if (dayCompleted === day.tasks.length && day.tasks.length > 0) {
        completedDays++;
      }
    });

    const percent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    const coins = completedTasks * 10;

    // Calculate streak: consecutive completed days starting from day 1
    let streak = 0;
    for (let i = 0; i < window.PLAN_DATA.length; i++) {
      const day = window.PLAN_DATA[i];
      const allDone = day.tasks.every((t) => getTaskState(t.id));
      if (allDone) {
        streak++;
      } else {
        break;
      }
    }

    // Determine Rank
    let rank = 'Novice Scholar 🥉';
    if (coins >= 500) rank = 'Super Topper 🏆';
    else if (coins >= 250) rank = 'Board Champion 🥇';
    else if (coins >= 100) rank = 'Focused Learner 🥈';

    return {
      totalTasks,
      completedTasks,
      percent,
      coins,
      streak,
      rank,
      completedDays,
      totalDays
    };
  }

  function updateProgressUI() {
    const stats = calculateProgress();

    // Top Bar Stats
    const coinEl = document.getElementById('coinCount');
    if (coinEl) {
      if (coinEl.textContent !== String(stats.coins)) {
        coinEl.classList.add('pulse');
        setTimeout(() => coinEl.classList.remove('pulse'), 300);
      }
      coinEl.textContent = stats.coins;
    }

    const streakEl = document.getElementById('streakCount');
    if (streakEl) streakEl.textContent = stats.streak;

    const rankEl = document.getElementById('rankBadge');
    if (rankEl) rankEl.textContent = stats.rank;

    // Hero Progress
    const heroPercent = document.getElementById('heroProgressPercent');
    if (heroPercent) heroPercent.textContent = `${stats.percent}%`;

    const heroDetails = document.getElementById('heroProgressDetails');
    if (heroDetails) {
      heroDetails.textContent = `${stats.completedTasks} / ${stats.totalTasks} Tasks Done`;
    }

    const circleFg = document.getElementById('heroProgressCircleFg');
    if (circleFg) {
      const circumference = 283; // 2 * PI * 45
      const offset = circumference - (stats.percent / 100) * circumference;
      circleFg.style.strokeDashoffset = offset;
    }

    // Refresh Day Badges in Schedule and Calendar
    updateDayStatusBadges();
  }

  function updateDayStatusBadges() {
    window.PLAN_DATA.forEach((day, index) => {
      const dayCard = document.getElementById(`dayCard_${day.dayNum}`);
      const calCell = document.getElementById(`calCell_${day.dayNum}`);

      const total = day.tasks.length;
      const done = day.tasks.filter((t) => getTaskState(t.id)).length;
      const isAllDone = done === total && total > 0;
      const isPartial = done > 0 && done < total;

      if (dayCard) {
        dayCard.classList.toggle('day-completed', isAllDone);
        const statusPill = dayCard.querySelector('.day-status-pill');
        if (statusPill) {
          if (isAllDone) {
            statusPill.className = 'day-status-pill status-done';
            statusPill.innerHTML = '✓ All Done 🎉';
          } else if (isPartial) {
            statusPill.className = 'day-status-pill status-partial';
            statusPill.innerHTML = `⚡ ${done}/${total} In Progress`;
          } else {
            statusPill.className = 'day-status-pill';
            statusPill.innerHTML = `⏳ 0/${total} Pending`;
          }
        }
      }

      if (calCell) {
        calCell.classList.toggle('status-all-done', isAllDone);
        calCell.classList.toggle('status-partial-done', isPartial);

        let badge = calCell.querySelector('.cal-day-pill-badge');
        if (!badge) {
          badge = document.createElement('span');
          badge.className = 'cal-day-pill-badge';
          calCell.appendChild(badge);
        }

        if (isAllDone) {
          badge.textContent = '100%';
          badge.style.display = 'block';
        } else if (isPartial) {
          badge.textContent = `${done}/${total}`;
          badge.style.display = 'block';
        } else {
          badge.style.display = 'none';
        }
      }
    });
  }

  // ==========================================================================
  // RENDER SCHEDULE VIEW
  // ==========================================================================
  function renderSchedule() {
    const container = document.getElementById('scheduleGrid');
    if (!container) return;

    container.innerHTML = '';

    const filteredDays = window.PLAN_DATA.filter((day) => {
      // Check subject filter
      let matchesFilter = true;
      if (activeFilter !== 'all') {
        if (activeFilter === 'catchup') {
          matchesFilter = day.type === 'catchup';
        } else {
          matchesFilter = day.tasks.some((t) => t.category === activeFilter);
        }
      }

      // Check search query
      let matchesSearch = true;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const dateMatch = day.date.toLowerCase().includes(q);
        const taskMatch = day.tasks.some(
          (t) =>
            t.subject.toLowerCase().includes(q) ||
            t.title.toLowerCase().includes(q) ||
            t.desc.toLowerCase().includes(q)
        );
        matchesSearch = dateMatch || taskMatch;
      }

      return matchesFilter && matchesSearch;
    });

    if (filteredDays.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 48px 20px; background: var(--bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--border-glass);">
          <div style="font-size: 40px; margin-bottom: 12px;">🔍</div>
          <h3 style="font-size: 18px; margin-bottom: 6px;">कोई टास्क नहीं मिला</h3>
          <p style="color: var(--text-secondary); font-size: 14px;">"${searchQuery}" या चुने हुए फ़िल्टर के लिए कोई दिन मैच नहीं हुआ। फ़िल्टर रीसेट करें।</p>
        </div>`;
      return;
    }

    filteredDays.forEach((day) => {
      const card = document.createElement('div');
      card.id = `dayCard_${day.dayNum}`;
      card.className = `day-card ${day.type === 'catchup' ? 'day-catchup' : ''} ${
        day.type === 'review' ? 'day-review' : ''
      }`;

      // Day Header
      let html = `
        <div class="day-header">
          <div class="day-info">
            <span class="day-number-badge">Day ${day.dayNum}</span>
            <div>
              <div class="day-date-text">${day.date}</div>
              <div class="day-weekday-text">${day.weekday} · ${day.badge}</div>
            </div>
          </div>
          <span class="day-status-pill">⏳ Loading...</span>
        </div>
        <div class="day-tasks-list">
      `;

      // Task Items
      day.tasks.forEach((task) => {
        const isChecked = getTaskState(task.id);
        const catClass = `cat-${task.category}`;

        html += `
          <div class="task-item ${isChecked ? 'checked' : ''}" data-task-id="${task.id}" data-day-num="${day.dayNum}">
            <label class="custom-checkbox-wrap" onclick="event.stopPropagation()">
              <input type="checkbox" id="chk_${task.id}" data-task-id="${task.id}" ${isChecked ? 'checked' : ''}>
              <span class="checkmark"></span>
            </label>
            <div class="task-details">
              <div class="task-top-meta">
                <span class="subject-badge ${catClass}">
                  <span>${task.icon}</span> ${task.subject}
                </span>
                <span class="task-coin-reward">🪙 +10</span>
              </div>
              <div class="task-title">${task.title}</div>
              <div class="task-desc">${task.desc}</div>
            </div>
          </div>
        `;
      });

      html += `</div>`;
      card.innerHTML = html;

      // Event listeners for task check toggles
      card.querySelectorAll('.task-item').forEach((item) => {
        const chk = item.querySelector('input[type="checkbox"]');
        const taskId = item.dataset.taskId;
        const dayNum = parseInt(item.dataset.dayNum, 10);

        function handleToggle(e) {
          const newState = !chk.checked;
          chk.checked = newState;
          setTaskState(taskId, newState);
          item.classList.toggle('checked', newState);

          if (newState) {
            playCoinSound();
            const rect = item.getBoundingClientRect();
            spawnFloatingCoin(rect.left + 30, rect.top + 10);

            // Check if day complete
            const dayObj = window.PLAN_DATA.find((d) => d.dayNum === dayNum);
            if (dayObj && dayObj.tasks.every((t) => getTaskState(t.id))) {
              playFanfareSound();
              triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }
          } else {
            playCheckSound();
          }

          updateProgressUI();
        }

        // Clicking on row
        item.addEventListener('click', (e) => {
          if (e.target.tagName !== 'INPUT') {
            handleToggle(e);
          }
        });

        // Checkbox change directly
        chk.addEventListener('change', (e) => {
          const newState = chk.checked;
          setTaskState(taskId, newState);
          item.classList.toggle('checked', newState);
          if (newState) {
            playCoinSound();
            const rect = item.getBoundingClientRect();
            spawnFloatingCoin(rect.left + 30, rect.top + 10);
            const dayObj = window.PLAN_DATA.find((d) => d.dayNum === dayNum);
            if (dayObj && dayObj.tasks.every((t) => getTaskState(t.id))) {
              playFanfareSound();
              triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
            }
          } else {
            playCheckSound();
          }
          updateProgressUI();
        });
      });

      container.appendChild(card);
    });

    updateDayStatusBadges();
  }

  // ==========================================================================
  // RENDER INTERACTIVE CALENDAR
  // ==========================================================================
  function renderCalendar() {
    const octContainer = document.getElementById('octoberCalendarGrid');
    const novContainer = document.getElementById('novemberCalendarGrid');
    if (!octContainer || !novContainer) return;

    octContainer.innerHTML = '';
    novContainer.innerHTML = '';

    // October 2026: 1 Oct 2026 is Thursday (day index 3: Mon=0, Tue=1, Wed=2, Thu=3)
    // 31 days in October. Active study plan starts Oct 20 (Day 1) to Oct 31 (Day 12).
    const octFirstDay = 3; // Thursday
    const octDays = 31;

    for (let i = 0; i < octFirstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day-cell empty';
      octContainer.appendChild(empty);
    }

    for (let d = 1; d <= octDays; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';

      // Check if this date has a study plan
      const planDay = window.PLAN_DATA.find((item) => {
        return item.isoDate === `2026-10-${d < 10 ? '0' + d : d}`;
      });

      if (planDay) {
        cell.id = `calCell_${planDay.dayNum}`;
        cell.classList.add('active-plan');
        if (planDay.type === 'catchup') cell.classList.add('is-catchup');
        cell.innerHTML = `<span>${d}</span>`;

        cell.addEventListener('click', () => {
          showCalendarDayPreview(planDay.dayNum);
        });
      } else {
        cell.style.opacity = '0.35';
        cell.innerHTML = `<span>${d}</span>`;
      }

      octContainer.appendChild(cell);
    }

    // November 2026: 1 Nov 2026 is Sunday (day index 6: Mon=0 ... Sun=6)
    // 30 days in November. Active study plan: Nov 1 (Day 13) to Nov 25 (Day 37).
    const novFirstDay = 6; // Sunday
    const novDays = 30;

    for (let i = 0; i < novFirstDay; i++) {
      const empty = document.createElement('div');
      empty.className = 'cal-day-cell empty';
      novContainer.appendChild(empty);
    }

    for (let d = 1; d <= novDays; d++) {
      const cell = document.createElement('div');
      cell.className = 'cal-day-cell';

      const planDay = window.PLAN_DATA.find((item) => {
        return item.isoDate === `2026-11-${d < 10 ? '0' + d : d}`;
      });

      if (planDay) {
        cell.id = `calCell_${planDay.dayNum}`;
        cell.classList.add('active-plan');
        if (planDay.type === 'catchup') cell.classList.add('is-catchup');
        cell.innerHTML = `<span>${d}</span>`;

        cell.addEventListener('click', () => {
          showCalendarDayPreview(planDay.dayNum);
        });
      } else {
        cell.style.opacity = '0.35';
        cell.innerHTML = `<span>${d}</span>`;
      }

      novContainer.appendChild(cell);
    }

    updateDayStatusBadges();
    showCalendarDayPreview(1); // default select day 1
  }

  function showCalendarDayPreview(dayNum) {
    selectedCalendarDay = dayNum;

    // Highlight selected cell
    document.querySelectorAll('.cal-day-cell').forEach((c) => {
      c.style.outline = '';
    });
    const activeCell = document.getElementById(`calCell_${dayNum}`);
    if (activeCell) {
      activeCell.style.outline = '2px solid #6366f1';
    }

    const previewWrap = document.getElementById('calendarPreviewWrap');
    if (!previewWrap) return;

    const day = window.PLAN_DATA.find((d) => d.dayNum === dayNum);
    if (!day) return;

    let tasksHtml = '';
    day.tasks.forEach((t) => {
      const isDone = getTaskState(t.id);
      tasksHtml += `
        <div class="task-item ${isDone ? 'checked' : ''}" data-cal-task-id="${t.id}" data-day-num="${day.dayNum}" style="margin-bottom: 8px;">
          <label class="custom-checkbox-wrap" onclick="event.stopPropagation()">
            <input type="checkbox" id="cal_chk_${t.id}" data-task-id="${t.id}" ${isDone ? 'checked' : ''}>
            <span class="checkmark"></span>
          </label>
          <div class="task-details">
            <div class="task-top-meta">
              <span class="subject-badge cat-${t.category}">
                <span>${t.icon}</span> ${t.subject}
              </span>
              <span class="task-coin-reward">🪙 +10</span>
            </div>
            <div class="task-title">${t.title}</div>
            <div class="task-desc">${t.desc}</div>
          </div>
        </div>
      `;
    });

    previewWrap.innerHTML = `
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; flex-wrap: wrap; gap: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <span class="day-number-badge">Day ${day.dayNum}</span>
          <div>
            <div style="font-size: 17px; font-weight: 800; color: var(--text-primary);">${day.date} (${day.weekday})</div>
            <div style="font-size: 13px; color: var(--text-secondary);">${day.badge}</div>
          </div>
        </div>
        <button class="splash-btn" style="padding: 8px 18px; font-size: 13px;" onclick="window.jumpToDayInTimeline(${day.dayNum})">
          🎯 View in 37-Day Roadmap
        </button>
      </div>
      <div>${tasksHtml}</div>
    `;

    // Bind interaction for preview tasks
    previewWrap.querySelectorAll('.task-item').forEach((item) => {
      const chk = item.querySelector('input[type="checkbox"]');
      const taskId = item.dataset.calTaskId;

      function togglePreviewTask() {
        const newState = !chk.checked;
        chk.checked = newState;
        setTaskState(taskId, newState);
        item.classList.toggle('checked', newState);

        // Also sync corresponding timeline checkbox
        const timelineChk = document.getElementById(`chk_${taskId}`);
        if (timelineChk) {
          timelineChk.checked = newState;
          const timelineItem = timelineChk.closest('.task-item');
          if (timelineItem) timelineItem.classList.toggle('checked', newState);
        }

        if (newState) {
          playCoinSound();
          const rect = item.getBoundingClientRect();
          spawnFloatingCoin(rect.left + 30, rect.top + 10);
          if (day.tasks.every((t) => getTaskState(t.id))) {
            playFanfareSound();
            triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
          }
        } else {
          playCheckSound();
        }

        updateProgressUI();
      }

      item.addEventListener('click', (e) => {
        if (e.target.tagName !== 'INPUT') {
          togglePreviewTask();
        }
      });

      chk.addEventListener('change', () => {
        const newState = chk.checked;
        setTaskState(taskId, newState);
        item.classList.toggle('checked', newState);
        const timelineChk = document.getElementById(`chk_${taskId}`);
        if (timelineChk) {
          timelineChk.checked = newState;
          const timelineItem = timelineChk.closest('.task-item');
          if (timelineItem) timelineItem.classList.toggle('checked', newState);
        }
        if (newState) {
          playCoinSound();
          const rect = item.getBoundingClientRect();
          spawnFloatingCoin(rect.left + 30, rect.top + 10);
          if (day.tasks.every((t) => getTaskState(t.id))) {
            playFanfareSound();
            triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
          }
        } else {
          playCheckSound();
        }
        updateProgressUI();
      });
    });
  }

  window.jumpToDayInTimeline = function (dayNum) {
    switchTab('schedule');
    setTimeout(() => {
      const el = document.getElementById(`dayCard_${dayNum}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.style.transform = 'scale(1.02)';
        el.style.boxShadow = '0 0 25px rgba(99, 102, 241, 0.8)';
        setTimeout(() => {
          el.style.transform = '';
          el.style.boxShadow = '';
        }, 1200);
      }
    }, 150);
  };

  // ==========================================================================
  // RENDER DAILY TIMETABLE & HIGHLIGHT LIVE TIME
  // ==========================================================================
  function renderTimetable() {
    const tableBody = document.getElementById('timetableBody');
    if (!tableBody) return;

    tableBody.innerHTML = '';

    window.TIMETABLE_DATA.forEach((item, index) => {
      const tr = document.createElement('tr');
      tr.id = `timeSlot_${index}`;
      tr.innerHTML = `
        <td><span class="time-badge">${item.icon} ${item.time}</span></td>
        <td><strong>${item.task}</strong></td>
      `;
      tableBody.appendChild(tr);
    });

    highlightCurrentTimeSlot();
  }

  function highlightCurrentTimeSlot() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMins = hours * 60 + minutes;

    // Define timetable slot time ranges in minutes from midnight
    const slots = [
      { start: 4 * 60 + 30, end: 5 * 60 }, // 4:30 - 5:00
      { start: 5 * 60, end: 6 * 60 }, // 5:00 - 6:00
      { start: 6 * 60, end: 7 * 60 + 30 }, // 6:00 - 7:30
      { start: 7 * 60 + 30, end: 14 * 60 + 30 }, // 7:30 - 14:30
      { start: 14 * 60 + 30, end: 15 * 60 + 15 }, // 14:30 - 15:15
      { start: 15 * 60 + 15, end: 16 * 60 }, // 15:15 - 16:00
      { start: 16 * 60, end: 16 * 60 + 45 }, // 16:00 - 16:45
      { start: 17 * 60, end: 20 * 60 + 30 }, // 17:00 - 20:30
      { start: 20 * 60 + 30, end: 21 * 60 }, // 20:30 - 21:00
      { start: 21 * 60, end: 21 * 60 + 15 }, // 21:00 - 21:15
      { start: 21 * 60 + 30, end: 24 * 60 } // 21:30+
    ];

    slots.forEach((slot, idx) => {
      const row = document.getElementById(`timeSlot_${idx}`);
      if (row) {
        if (currentMins >= slot.start && currentMins < slot.end) {
          row.classList.add('current-time-slot');
          const td = row.querySelector('td:last-child');
          if (td && !td.querySelector('.live-badge')) {
            const liveBadge = document.createElement('span');
            liveBadge.className = 'live-badge';
            liveBadge.style.cssText =
              'background: #ef4444; color: white; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 4px; margin-left: 8px; vertical-align: middle; animation: coinBounce 1s infinite;';
            liveBadge.textContent = '🔴 NOW';
            td.appendChild(liveBadge);
          }
        } else {
          row.classList.remove('current-time-slot');
          const badge = row.querySelector('.live-badge');
          if (badge) badge.remove();
        }
      }
    });
  }

  // ==========================================================================
  // RENDER STUDY RULES
  // ==========================================================================
  function renderRules() {
    const grid = document.getElementById('rulesGrid');
    if (!grid) return;

    grid.innerHTML = '';
    window.STUDY_RULES.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'rule-card';
      card.innerHTML = `
        <div class="rule-card-header">
          <div class="rule-num-badge">${r.num}</div>
          <span class="rule-tag">${r.icon} ${r.tag}</span>
        </div>
        <div class="rule-title">${r.title}</div>
        <div class="rule-text">${r.rule}</div>
      `;
      grid.appendChild(card);
    });
  }

  // ==========================================================================
  // POMODORO FOCUS TIMER
  // ==========================================================================
  let pomoTimeRemaining = 25 * 60;
  let pomoTotalTime = 25 * 60;
  let pomoTimerInterval = null;
  let pomoRunning = false;

  function initPomodoro() {
    const display = document.getElementById('pomoDigits');
    const startBtn = document.getElementById('pomoStartBtn');
    const resetBtn = document.getElementById('pomoResetBtn');
    const circleFg = document.getElementById('pomoCircleFg');
    const modeBtns = document.querySelectorAll('.pomo-mode-btn');

    function updatePomoDisplay() {
      const m = Math.floor(pomoTimeRemaining / 60);
      const s = pomoTimeRemaining % 60;
      if (display) {
        display.textContent = `${m < 10 ? '0' + m : m}:${s < 10 ? '0' + s : s}`;
      }

      if (circleFg) {
        const circumference = 565;
        const progress = pomoTimeRemaining / pomoTotalTime;
        const offset = circumference * (1 - progress);
        circleFg.style.strokeDashoffset = offset;
      }
    }

    if (startBtn) {
      startBtn.addEventListener('click', () => {
        if (!pomoRunning) {
          initAudio();
          pomoRunning = true;
          startBtn.innerHTML = '⏸️ Pause';
          startBtn.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';

          pomoTimerInterval = setInterval(() => {
            if (pomoTimeRemaining > 0) {
              pomoTimeRemaining--;
              updatePomoDisplay();
            } else {
              clearInterval(pomoTimerInterval);
              pomoRunning = false;
              startBtn.innerHTML = '▶️ Start Focus';
              startBtn.style.background = '';
              playBellChime();
              triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
              alert('🎉 बहुत बढ़िया अभिषेक! आपका Focus Session पूरा हुआ! 5 मिनट का ब्रेक लें।');
            }
          }, 1000);
        } else {
          clearInterval(pomoTimerInterval);
          pomoRunning = false;
          startBtn.innerHTML = '▶️ Resume';
          startBtn.style.background = '';
        }
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        clearInterval(pomoTimerInterval);
        pomoRunning = false;
        pomoTimeRemaining = pomoTotalTime;
        if (startBtn) {
          startBtn.innerHTML = '▶️ Start Focus';
          startBtn.style.background = '';
        }
        updatePomoDisplay();
      });
    }

    modeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        modeBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');

        const mins = parseInt(btn.dataset.mins, 10);
        clearInterval(pomoTimerInterval);
        pomoRunning = false;
        pomoTotalTime = mins * 60;
        pomoTimeRemaining = pomoTotalTime;
        if (startBtn) {
          startBtn.innerHTML = '▶️ Start Focus';
          startBtn.style.background = '';
        }
        updatePomoDisplay();
      });
    });

    updatePomoDisplay();
  }

  // ==========================================================================
  // NAVIGATION & TAB SWITCHING
  // ==========================================================================
  function switchTab(targetTab) {
    activeTab = targetTab;

    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.tab === targetTab);
    });

    document.querySelectorAll('.view-section').forEach((sec) => {
      sec.classList.toggle('active', sec.id === `view_${targetTab}`);
    });

    // Control search bar visibility (only on schedule tab)
    const filterContainer = document.getElementById('filterContainer');
    if (filterContainer) {
      filterContainer.style.display = targetTab === 'schedule' ? 'block' : 'none';
    }

    if (targetTab === 'calendar') {
      renderCalendar();
    } else if (targetTab === 'timetable') {
      highlightCurrentTimeSlot();
    }
  }

  // ==========================================================================
  // MOTIVATIONAL QUOTES ROTATION
  // ==========================================================================
  function setupQuoteCarousel() {
    const quoteEl = document.getElementById('motivationalQuoteText');
    if (!quoteEl || !window.MOTIVATIONAL_QUOTES) return;

    let quoteIdx = 0;
    quoteEl.textContent = window.MOTIVATIONAL_QUOTES[0];

    setInterval(() => {
      quoteIdx = (quoteIdx + 1) % window.MOTIVATIONAL_QUOTES.length;
      quoteEl.style.opacity = '0';
      setTimeout(() => {
        quoteEl.textContent = window.MOTIVATIONAL_QUOTES[quoteIdx];
        quoteEl.style.opacity = '1';
      }, 300);
    }, 9000);
  }

  // ==========================================================================
  // RESET PLAN MODAL
  // ==========================================================================
  function setupResetModal() {
    const modal = document.getElementById('resetModal');
    const openBtn = document.getElementById('openResetModalBtn');
    const cancelBtn = document.getElementById('cancelResetBtn');
    const confirmBtn = document.getElementById('confirmResetBtn');

    if (openBtn && modal) {
      openBtn.addEventListener('click', () => modal.classList.add('active'));
    }
    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }

    if (confirmBtn && modal) {
      confirmBtn.addEventListener('click', () => {
        // Clear all tasks
        window.PLAN_DATA.forEach((d) => {
          d.tasks.forEach((t) => {
            localStorage.removeItem(`abhishek_task_${t.id}`);
          });
        });

        renderSchedule();
        updateProgressUI();
        modal.classList.remove('active');
        alert('सारे Checkboxes reset हो गए हैं। नए सिरे से शुरुआत करो!');
      });
    }
  }

  // ==========================================================================
  // INITIALIZATION ON DOM READY
  // ==========================================================================
  document.addEventListener('DOMContentLoaded', () => {
    // Splash Loader sequence
    const splash = document.getElementById('welcomeSplash');
    const splashBar = document.getElementById('splashBar');
    const enterBtn = document.getElementById('splashEnterBtn');

    if (splashBar) {
      setTimeout(() => {
        splashBar.style.width = '100%';
      }, 100);
    }

    function dismissSplash() {
      if (splash && !splash.classList.contains('splash-hidden')) {
        initAudio();
        playFanfareSound();
        triggerConfetti(window.innerWidth / 2, window.innerHeight / 2);
        splash.classList.add('splash-hidden');
      }
    }

    if (enterBtn) {
      enterBtn.addEventListener('click', dismissSplash);
    }

    // Auto dismiss after 2.6s
    setTimeout(dismissSplash, 2600);

    // Profile Avatar Click to reopen splash
    const navAvatar = document.getElementById('navAvatarBtn');
    if (navAvatar && splash) {
      navAvatar.addEventListener('click', () => {
        splash.classList.remove('splash-hidden');
        if (splashBar) splashBar.style.width = '100%';
      });
    }

    // Audio Mute/Unmute Toggle
    const soundToggle = document.getElementById('soundToggleBtn');
    if (soundToggle) {
      soundToggle.addEventListener('click', () => {
        initAudio();
        soundEnabled = !soundEnabled;
        soundToggle.textContent = soundEnabled ? '🔊' : '🔇';
        soundToggle.title = soundEnabled ? 'Mute Sounds' : 'Unmute Sounds';
      });
    }

    // Theme Toggle (Dark / Light)
    const themeToggle = document.getElementById('themeToggleBtn');
    const savedTheme = localStorage.getItem('abhishek_theme') || 'dark';
    if (savedTheme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggle) themeToggle.textContent = '☀️';
    }

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        const isLight = document.body.classList.contains('light-theme');
        themeToggle.textContent = isLight ? '☀️' : '🌙';
        localStorage.setItem('abhishek_theme', isLight ? 'light' : 'dark');
      });
    }

    // Tab Buttons
    document.querySelectorAll('.tab-btn').forEach((btn) => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Subject Filter Tags
    document.querySelectorAll('.tag-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.tag-btn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        activeFilter = btn.dataset.filter;
        renderSchedule();
      });
    });

    // Search Input
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        renderSchedule();
      });
    }

    // Setup Components
    renderSchedule();
    renderCalendar();
    renderTimetable();
    renderRules();
    initPomodoro();
    setupQuoteCarousel();
    setupResetModal();
    updateProgressUI();

    // Periodic time check for timetable slot highlight
    setInterval(highlightCurrentTimeSlot, 60000);
  });
})();
