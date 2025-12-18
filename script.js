window.addEventListener('DOMContentLoaded', () => {
  const SAVE_KEY = "delmaClickerUltimateSave";

  // ZMIENNE GRY
  let points = 0;
  let perClick = 1;
  let autoRate = 0;

  let upgradeClickCost = 10;
  let autoClickCost = 25;
  let boosterCost = 200;

  let boosterActive = false;
  let boosterTime = 0; // w tickach (co 0.1s)

  let rebirths = 0;
  let rebirthMultiplier = 1;
  let rebirthCost = 5000;

  // STATYSTYKI
  let totalClicks = 0;
  let playTime = 0; // sekundy
  let maxPoints = 0;

  // MISJE
  let mission1Completed = false;
  let mission2Completed = false;
  let mission3Completed = false;

  // USTAWIENIA
  let soundEnabled = true;
  let animEnabled = true;
  let musicPlaying = false;

  // ELEMENTY HTML
  const el = {
    points: document.getElementById('points'),
    perClick: document.getElementById('perClick'),
    autoRate: document.getElementById('autoRate'),
    perClickShop: document.getElementById('perClickShop'),
    autoRateShop: document.getElementById('autoRateShop'),
    upgradeClickCost: document.getElementById('upgradeClickCost'),
    autoClickCost: document.getElementById('autoClickCost'),
    boosterCost: document.getElementById('boosterCost'),
    boosterStatus: document.getElementById('boosterStatus'),
    rebirths: document.getElementById('rebirths'),
    rebirthMultiplier: document.getElementById('rebirthMultiplier'),
    rebirthCost: document.getElementById('rebirthCost'),
    rebirths2: document.getElementById('rebirths2'),
    rebirthMultiplier2: document.getElementById('rebirthMultiplier2'),
    totalClicks: document.getElementById('totalClicks'),
    totalClicks2: document.getElementById('totalClicks2'),
    playTime: document.getElementById('playTime'),
    maxPoints: document.getElementById('maxPoints'),
    completedMissions: document.getElementById('completedMissions'),
    mission1Status: document.getElementById('mission1Status'),
    mission2Status: document.getElementById('mission2Status'),
    mission3Status: document.getElementById('mission3Status'),
    bigButton: document.getElementById('bigButton'),
    upgradeClickBtn: document.getElementById('upgradeClickBtn'),
    autoClickBtn: document.getElementById('autoClickBtn'),
    boosterBtn: document.getElementById('boosterBtn'),
    rebirthBtn: document.getElementById('rebirthBtn'),
    saveBtn: document.getElementById('saveBtn'),
    loadBtn: document.getElementById('loadBtn'),
    softResetBtn: document.getElementById('softResetBtn'),
    hardResetBtn: document.getElementById('hardResetBtn'),
    soundToggle: document.getElementById('soundToggle'),
    animToggle: document.getElementById('animToggle'),
    bgMusic: document.getElementById('bgMusic'),
    musicToggleBtn: document.getElementById('musicToggleBtn'),
  };

  // DŹWIĘKI (podstaw swoje pliki jak chcesz)
  const sounds = {
    click: new Audio('click.mp3'),     // wrzuć plik click.mp3
    buy: new Audio('buy.mp3'),         // wrzuć plik buy.mp3
    rebirth: new Audio('rebirth.mp3')  // wrzuć plik rebirth.mp3
  };

  function playSound(audio) {
    if (!soundEnabled) return;
    if (!audio) return;
    audio.currentTime = 0;
    audio.play().catch(() => {});
  }

  // RENDER
  function render() {
    el.points.textContent = Math.floor(points);
    el.perClick.textContent = perClick;
    el.autoRate.textContent = autoRate;
    el.perClickShop.textContent = perClick;
    el.autoRateShop.textContent = autoRate;

    el.upgradeClickCost.textContent = upgradeClickCost;
    el.autoClickCost.textContent = autoClickCost;
    el.boosterCost.textContent = boosterCost;

    el.boosterStatus.textContent = boosterActive ? `tak (${Math.ceil(boosterTime / 10)}s)` : 'nie';

    el.rebirths.textContent = rebirths;
    el.rebirthMultiplier.textContent = rebirthMultiplier;
    el.rebirthCost.textContent = rebirthCost;
    el.rebirths2.textContent = rebirths;
    el.rebirthMultiplier2.textContent = rebirthMultiplier;

    el.totalClicks.textContent = totalClicks;
    el.totalClicks2.textContent = totalClicks;
    el.playTime.textContent = playTime;
    el.maxPoints.textContent = maxPoints;

    const completed = (mission1Completed ? 1 : 0) +
                      (mission2Completed ? 1 : 0) +
                      (mission3Completed ? 1 : 0);
    el.completedMissions.textContent = completed;

    el.mission1Status.textContent = mission1Completed ? 'Ukończona' : 'Nieukończona';
    el.mission2Status.textContent = mission2Completed ? 'Ukończona' : 'Nieukończona';
    el.mission3Status.textContent = mission3Completed ? 'Ukończona' : 'Nieukończona';
  }

  // EFEKT +1
  function spawnFloatText(value) {
    if (!animEnabled) return;
    const elButton = el.bigButton;
    const rect = elButton.getBoundingClientRect();
    const span = document.createElement('span');
    span.className = 'float-text';
    span.textContent = `+${value}`;

    span.style.left = rect.left + rect.width / 2 + 'px';
    span.style.top = rect.top + rect.height / 2 + 'px';

    document.body.appendChild(span);
    setTimeout(() => {
      span.remove();
    }, 600);
  }

  // KLIK
  function handleClick() {
    let gain = perClick * rebirthMultiplier;
    if (boosterActive) gain *= 2;

    points += gain;
    totalClicks += 1;
    if (points > maxPoints) maxPoints = Math.floor(points);

    spawnFloatText(gain);
    playSound(sounds.click);
    render();
    checkMissions();
  }

  // SKLEP
  function buyClickUpgrade() {
    if (points < upgradeClickCost) return;
    points -= upgradeClickCost;
    perClick += 1;
    upgradeClickCost = Math.ceil(upgradeClickCost * 1.4);
    playSound(sounds.buy);
    render();
  }

  function buyAutoClick() {
    if (points < autoClickCost) return;
    points -= autoClickCost;
    autoRate += 1;
    autoClickCost = Math.ceil(autoClickCost * 1.5);
    playSound(sounds.buy);
    render();
  }

  function buyBooster() {
    if (points < boosterCost) return;
    points -= boosterCost;
    boosterActive = true;
    boosterTime = 150; // 15 sekund (150 ticków po 0.1s)
    boosterCost = Math.ceil(boosterCost * 1.8);
    playSound(sounds.buy);
    render();
  }

  // REBIRTH
  function doRebirth() {
    if (points < rebirthCost) return;

    playSound(sounds.rebirth);

    points = 0;
    perClick = 1;
    autoRate = 0;
    upgradeClickCost = 10;
    autoClickCost = 25;
    boosterCost = 200;
    boosterActive = false;
    boosterTime = 0;

    rebirths += 1;
    rebirthMultiplier = 1 + rebirths;
    rebirthCost = Math.ceil(rebirthCost * 2.5);

    render();
    checkMissions();
  }

  // MISJE
  function checkMissions() {
    // Misja 1: 1000 punktów
    if (!mission1Completed && points >= 1000) {
      mission1Completed = true;
      boosterActive = true;
      boosterTime = Math.max(boosterTime, 150);
    }

    // Misja 2: 100 kliknięć
    if (!mission2Completed && totalClicks >= 100) {
      mission2Completed = true;
      perClick += 5;
    }

    // Misja 3: 1 rebirth
    if (!mission3Completed && rebirths >= 1) {
      mission3Completed = true;
      rebirthMultiplier = Math.round(rebirthMultiplier * 1.1 * 10) / 10;
    }

    render();
  }

  // ZAPIS
  function saveGame() {
    const data = {
      points,
      perClick,
      autoRate,
      upgradeClickCost,
      autoClickCost,
      boosterCost,
      boosterActive,
      boosterTime,
      rebirths,
      rebirthMultiplier,
      rebirthCost,
      totalClicks,
      playTime,
      maxPoints,
      mission1Completed,
      mission2Completed,
      mission3Completed,
      soundEnabled,
      animEnabled
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  function loadGame() {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return;
    const loaded = JSON.parse(data);

    points = loaded.points ?? 0;
    perClick = loaded.perClick ?? 1;
    autoRate = loaded.autoRate ?? 0;

    upgradeClickCost = loaded.upgradeClickCost ?? 10;
    autoClickCost = loaded.autoClickCost ?? 25;
    boosterCost = loaded.boosterCost ?? 200;
    boosterActive = loaded.boosterActive ?? false;
    boosterTime = loaded.boosterTime ?? 0;

    rebirths = loaded.rebirths ?? 0;
    rebirthMultiplier = loaded.rebirthMultiplier ?? 1;
    rebirthCost = loaded.rebirthCost ?? 5000;

    totalClicks = loaded.totalClicks ?? 0;
    playTime = loaded.playTime ?? 0;
    maxPoints = loaded.maxPoints ?? 0;

    mission1Completed = loaded.mission1Completed ?? false;
    mission2Completed = loaded.mission2Completed ?? false;
    mission3Completed = loaded.mission3Completed ?? false;

    soundEnabled = loaded.soundEnabled ?? true;
    animEnabled = loaded.animEnabled ?? true;

    el.soundToggle.checked = soundEnabled;
    el.animToggle.checked = animEnabled;

    render();
  }

  function softResetGame() {
    points = 0;
    perClick = 1;
    autoRate = 0;
    upgradeClickCost = 10;
    autoClickCost = 25;
    boosterCost = 200;
    boosterActive = false;
    boosterTime = 0;
    render();
  }

  function hardResetGame() {
    if (!confirm("Na pewno chcesz skasować cały zapis Delma Clicker?")) return;
    localStorage.removeItem(SAVE_KEY);

    points = 0;
    perClick = 1;
    autoRate = 0;
    upgradeClickCost = 10;
    autoClickCost = 25;
    boosterCost = 200;
    boosterActive = false;
    boosterTime = 0;
    rebirths = 0;
    rebirthMultiplier = 1;
    rebirthCost = 5000;
    totalClicks = 0;
    playTime = 0;
    maxPoints = 0;
    mission1Completed = false;
    mission2Completed = false;
    mission3Completed = false;
    soundEnabled = true;
    animEnabled = true;
    el.soundToggle.checked = true;
    el.animToggle.checked = true;

    render();
  }

  // PĘTLA GRY
  setInterval(() => {
    // Auto klik
    const baseGain = (autoRate * rebirthMultiplier) / 10;
    points += baseGain;
    if (boosterActive) points += baseGain;

    // Booster czas
    if (boosterActive) {
      boosterTime--;
      if (boosterTime <= 0) {
        boosterActive = false;
      }
    }

    // Czas gry
    playTime += 0.1;
    if (points > maxPoints) maxPoints = Math.floor(points);

    render();
    checkMissions();
    saveGame();
  }, 100);

  // MUZYKA
  function toggleMusic() {
    if (!el.bgMusic) return;
    if (musicPlaying) {
      el.bgMusic.pause();
      musicPlaying = false;
    } else {
      el.bgMusic.play().catch(() => {});
      musicPlaying = true;
    }
  }

  // EVENTY
  el.bigButton.addEventListener('click', handleClick);
  el.upgradeClickBtn.addEventListener('click', buyClickUpgrade);
  el.autoClickBtn.addEventListener('click', buyAutoClick);
  el.boosterBtn.addEventListener('click', buyBooster);
  el.rebirthBtn.addEventListener('click', doRebirth);

  el.saveBtn.addEventListener('click', saveGame);
  el.loadBtn.addEventListener('click', () => {
    loadGame();
    render();
  });
  el.softResetBtn.addEventListener('click', softResetGame);
  el.hardResetBtn.addEventListener('click', hardResetGame);

  el.soundToggle.addEventListener('change', (e) => {
    soundEnabled = e.target.checked;
    saveGame();
  });

  el.animToggle.addEventListener('change', (e) => {
    animEnabled = e.target.checked;
    saveGame();
  });

  el.musicToggleBtn.addEventListener('click', toggleMusic);

  // START
  loadGame();
  render();
});
