window.addEventListener('DOMContentLoaded', () => {

  const SAVE_KEY = "delmaClickerSave";

  // ============================
  // ZMIENNE GRY
  // ============================

  let points = 0;
  let perClick = 1;
  let autoRate = 0;

  let upgradeClickCost = 10;
  let autoClickCost = 25;
  let boosterCost = 200;

  let boosterActive = false;
  let boosterTime = 0;

  let rebirths = 0;
  let rebirthMultiplier = 1;
  let rebirthCost = 5000;

  // ============================
  // ELEMENTY HTML
  // ============================

  const el = {
    points: document.getElementById('points'),
    perClick: document.getElementById('perClick'),
    autoRate: document.getElementById('autoRate'),

    upgradeClickCost: document.getElementById('upgradeClickCost'),
    autoClickCost: document.getElementById('autoClickCost'),
    boosterCost: document.getElementById('boosterCost'),

    rebirths: document.getElementById('rebirths'),
    rebirthMultiplier: document.getElementById('rebirthMultiplier'),
    rebirthCost: document.getElementById('rebirthCost'),

    bigButton: document.getElementById('bigButton'),
    upgradeClickBtn: document.getElementById('upgradeClickBtn'),
    autoClickBtn: document.getElementById('autoClickBtn'),
    boosterBtn: document.getElementById('boosterBtn'),
    rebirthBtn: document.getElementById('rebirthBtn'),

    saveBtn: document.getElementById('saveBtn'),
    loadBtn: document.getElementById('loadBtn'),
    softResetBtn: document.getElementById('softResetBtn'),
  };

  // ============================
  // RENDER
  // ============================

  function render() {
    el.points.textContent = Math.floor(points);
    el.perClick.textContent = perClick;
    el.autoRate.textContent = autoRate;

    el.upgradeClickCost.textContent = upgradeClickCost;
    el.autoClickCost.textContent = autoClickCost;
    el.boosterCost.textContent = boosterCost;

    el.rebirths.textContent = rebirths;
    el.rebirthMultiplier.textContent = rebirthMultiplier;
    el.rebirthCost.textContent = rebirthCost;
  }

  // ============================
  // KLIKANIE
  // ============================

  function handleClick() {
    let gain = perClick * rebirthMultiplier;
    if (boosterActive) gain *= 2;
    points += gain;
    render();
  }

  // ============================
  // SKLEP
  // ============================

  function buyClickUpgrade() {
    if (points < upgradeClickCost) return;
    points -= upgradeClickCost;
    perClick += 1;
    upgradeClickCost = Math.ceil(upgradeClickCost * 1.4);
    render();
  }

  function buyAutoClick() {
    if (points < autoClickCost) return;
    points -= autoClickCost;
    autoRate += 1;
    autoClickCost = Math.ceil(autoClickCost * 1.5);
    render();
  }

  function buyBooster() {
    if (points < boosterCost) return;
    points -= boosterCost;
    boosterActive = true;
    boosterTime = 100; // 10 sekund
    boosterCost = Math.ceil(boosterCost * 1.8);
    render();
  }

  // ============================
  // REBIRTH
  // ============================

  function doRebirth() {
    if (points < rebirthCost) return;

    points = 0;
    perClick = 1;
    autoRate = 0;

    upgradeClickCost = 10;
    autoClickCost = 25;
    boosterCost = 200;

    rebirths += 1;
    rebirthMultiplier = 1 + rebirths;
    rebirthCost = Math.ceil(rebirthCost * 2.5);

    render();
  }

  // ============================
  // ZAPIS
  // ============================

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
      rebirthCost
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(data));
  }

  function loadGame() {
    const data = localStorage.getItem(SAVE_KEY);
    if (!data) return;
    const loaded = JSON.parse(data);

    points = loaded.points;
    perClick = loaded.perClick;
    autoRate = loaded.autoRate;
    upgradeClickCost = loaded.upgradeClickCost;
    autoClickCost = loaded.autoClickCost;
    boosterCost = loaded.boosterCost;
    boosterActive = loaded.boosterActive;
    boosterTime = loaded.boosterTime;
    rebirths = loaded.rebirths;
    rebirthMultiplier = loaded.rebirthMultiplier;
    rebirthCost = loaded.rebirthCost;

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

  // ============================
  // PĘTLA GRY
  // ============================

  setInterval(() => {
    points += (autoRate * rebirthMultiplier) / 10;
    if (boosterActive) {
      points += (autoRate * rebirthMultiplier) / 10;
    }

    if (boosterActive) {
      boosterTime--;
      if (boosterTime <= 0) boosterActive = false;
    }

    render();
    saveGame();
  }, 100);

  // ============================
  // EVENTY
  // ============================

  el.bigButton.addEventListener("click", handleClick);
  el.upgradeClickBtn.addEventListener("click", buyClickUpgrade);
  el.autoClickBtn.addEventListener("click", buyAutoClick);
  el.boosterBtn.addEventListener("click", buyBooster);
  el.rebirthBtn.addEventListener("click", doRebirth);

  el.saveBtn.addEventListener("click", saveGame);
  el.loadBtn.addEventListener("click", loadGame);
  el.softResetBtn.addEventListener("click", softResetGame);

  // START
  loadGame();
  render();

});
