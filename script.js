/* ─── Utilidades Compartidas ─────────────────────────────────────── */

/**
 * Convierte milisegundos totales a partes de display formateadas.
 * Usa centisegundos (precisión 10ms) para el campo .ms de dos dígitos.
 * Compartida por stopwatch y timer para evitar duplicar la lógica de formateo.
 */
function formatTime(ms) {
  if (ms < 0) ms = 0;
  const totalCentis = Math.floor(ms / 10);
  const centis    = totalCentis % 100;
  const totalSecs = Math.floor(ms / 1000);
  const secs  = totalSecs % 60;
  const mins  = Math.floor(totalSecs / 60) % 60;
  const hrs   = Math.floor(totalSecs / 3600);

  const pad = n => String(n).padStart(2, '0');
  return {
    hours:   pad(hrs),
    minutes: pad(mins),
    seconds: pad(secs),
    ms:      pad(centis),
    main:    `${pad(hrs)}:${pad(mins)}:${pad(secs)}`
  };
}

// Centraliza el show/hide de botones al cambiar entre estado inicial y corriendo
function toggleControlVisuals(toRunning, btnStart, btnPause, btnExtra = null) {
  btnStart.classList.toggle('hidden', toRunning);
  btnPause.classList.toggle('hidden', !toRunning);
  if (btnExtra) btnExtra.classList.toggle('hidden', !toRunning);
}

/* ─── Lógica de Tabs ─────────────────────────────────────────────── */

const tabBtns     = document.querySelectorAll('.tab-btn');
const tabSections = document.querySelectorAll('.tab-content');

// CSS ya oculta .tab-content por defecto; solo se gestiona .active aquí
function switchTab(targetId) {
  tabBtns.forEach(btn =>
    btn.classList.toggle('active', btn.dataset.tab === targetId)
  );
  tabSections.forEach(section =>
    section.classList.toggle('active', section.id === targetId)
  );
}

tabBtns.forEach(btn =>
  btn.addEventListener('click', () => switchTab(btn.dataset.tab))
);

/* ─── Lógica del Stopwatch ───────────────────────────────────────── */

// Offset acumulado antes de la última reanudación — evita desfases al pausar
let swElapsed   = 0;
let swStartTime = 0;  // Date.now() del último start/resume
let swRunning   = false;
let swFrame     = null;
let lapCount    = 0;

const swDisplayEl   = document.getElementById('sw-display');
const swTimeMain    = document.getElementById('sw-time-main');
const swTimeMs      = document.getElementById('sw-time-ms');
const swBtnStart    = document.getElementById('sw-start');
const swBtnPause    = document.getElementById('sw-pause');
const swBtnLap      = document.getElementById('sw-lap');
const swBtnReset    = document.getElementById('sw-reset');
const lapsContainer = document.getElementById('laps-container');
const lapsList      = document.getElementById('laps-list');

function swRender(ms) {
  const t = formatTime(ms);
  swTimeMain.textContent = t.main;
  swTimeMs.textContent   = '.' + t.ms;
}

// rAF loop: recalcula cada frame con timestamp real para no acumular error
function swLoop() {
  swRender(swElapsed + (Date.now() - swStartTime));
  swFrame = requestAnimationFrame(swLoop);
}

swBtnStart.addEventListener('click', () => {
  cancelAnimationFrame(swFrame); // guard: evita loops duplicados si se dispara dos veces
  swStartTime = Date.now();
  swRunning   = true;
  swFrame     = requestAnimationFrame(swLoop);

  swDisplayEl.classList.add('running');
  toggleControlVisuals(true, swBtnStart, swBtnPause, swBtnLap);
  swBtnPause.textContent = 'Pausa';
  swBtnReset.disabled = false;
});

swBtnPause.addEventListener('click', () => {
  if (swRunning) {
    // Guardar cuánto corrió este segmento antes de pausar
    swElapsed += Date.now() - swStartTime;
    cancelAnimationFrame(swFrame);
    swRunning = false;
    swDisplayEl.classList.remove('running');
    swBtnPause.textContent = 'Reanudar';
  } else {
    // Nuevo segmento desde aquí — el offset ya está en swElapsed
    swStartTime = Date.now();
    swRunning   = true;
    swFrame     = requestAnimationFrame(swLoop);
    swDisplayEl.classList.add('running');
    swBtnPause.textContent = 'Pausa';
  }
});

swBtnLap.addEventListener('click', () => {
  // Funciona tanto en running como en pausado
  const currentMs = swElapsed + (swRunning ? Date.now() - swStartTime : 0);
  lapCount++;

  const t  = formatTime(currentMs);
  const li = document.createElement('li');
  li.className = 'lap-item';
  li.innerHTML =
    `<span class="lap-num">Lap ${lapCount}</span>` +
    `<span class="lap-time">${t.main}<span class="lap-ms">.${t.ms}</span></span>`;

  lapsList.prepend(li); // más reciente arriba
  lapsContainer.classList.remove('hidden');
});

swBtnReset.addEventListener('click', () => {
  cancelAnimationFrame(swFrame);
  swRunning   = false;
  swElapsed   = 0;
  swStartTime = 0;
  lapCount    = 0;

  swRender(0);
  swDisplayEl.classList.remove('running');
  toggleControlVisuals(false, swBtnStart, swBtnPause, swBtnLap);
  swBtnReset.disabled = true;

  lapsList.innerHTML = '';
  lapsContainer.classList.add('hidden');
});

/* ─── Lógica del Timer ───────────────────────────────────────────── */

// endTime permite pausar/reanudar sin perder precisión aunque el navegador throttlee
let tEndTime   = 0;
let tRemaining = 0;  // ms conservados al pausar
let tRunning   = false;
let tFrame     = null;

const tDisplayEl = document.getElementById('timer-display');
const tHours     = document.getElementById('t-hours');
const tMinutes   = document.getElementById('t-minutes');
const tSeconds   = document.getElementById('t-seconds');
const tMs        = document.getElementById('t-ms');
const tBtnStart  = document.getElementById('t-start');
const tBtnPause  = document.getElementById('t-pause');
const tBtnReset  = document.getElementById('t-reset');

const tInputs = [tHours, tMinutes, tSeconds, tMs];
const tMaxes  = [99, 59, 59, 99]; // rangos válidos por campo

// Lee los inputs y devuelve el total en ms (centisegundos × 10)
function tParseTotalMs() {
  const h  = +tHours.value   || 0;
  const m  = +tMinutes.value || 0;
  const s  = +tSeconds.value || 0;
  const cs = +tMs.value      || 0;
  return ((h * 3600) + (m * 60) + s) * 1000 + cs * 10;
}

// Clamp + padding al rango válido — previene valores imposibles (ej: 72 minutos)
function tNormalizeInputs() {
  tInputs.forEach((inp, i) => {
    const val = Math.max(0, Math.min(tMaxes[i], +inp.value || 0));
    inp.value = String(val).padStart(2, '0');
  });
}

function tRender(ms) {
  const t = formatTime(ms);
  tHours.value   = t.hours;
  tMinutes.value = t.minutes;
  tSeconds.value = t.seconds;
  tMs.value      = t.ms;

  // toggle en una sola línea — seguro porque tRender solo se llama mientras el timer corre
  tDisplayEl.classList.toggle('alert', ms <= 15000);
}

function tLoop() {
  const remaining = tEndTime - Date.now();
  if (remaining <= 0) {
    tRender(0);                         // classList.toggle activa la alerta en ms=0
    tRunning            = false;
    tRemaining          = 0;
    tBtnPause.disabled  = true;         // no hay tiempo que reanudar: indicarlo visualmente
    tBtnPause.textContent = 'Pausa';    // texto neutro; el disabled comunica el estado
    return;
  }
  tRender(remaining);
  tFrame = requestAnimationFrame(tLoop);
}

// Formatear al perder el foco — UX: muestra siempre 2 dígitos
tInputs.forEach((inp, i) => {
  inp.addEventListener('blur', () => {
    if (!inp.readOnly) {
      const val = Math.max(0, Math.min(tMaxes[i], +inp.value || 0));
      inp.value = String(val).padStart(2, '0');
    }
  });
  // Seleccionar todo al hacer foco para facilitar la sobreescritura
  inp.addEventListener('focus', () => { if (!inp.readOnly) inp.select(); });
});

tBtnStart.addEventListener('click', () => {
  tNormalizeInputs();
  const total = tParseTotalMs();
  if (total <= 0) return; // nada que contar

  cancelAnimationFrame(tFrame); // guard: evita loops duplicados si se dispara dos veces
  tRemaining = total;
  tEndTime   = Date.now() + tRemaining;
  tRunning   = true;
  tFrame     = requestAnimationFrame(tLoop);

  tInputs.forEach(inp => { inp.readOnly = true; });
  toggleControlVisuals(true, tBtnStart, tBtnPause);
  tBtnPause.textContent = 'Pausa';
  tBtnReset.disabled = false;
});

tBtnPause.addEventListener('click', () => {
  if (tRunning) {
    // Congelar: guardar exactamente cuánto falta
    tRemaining = Math.max(0, tEndTime - Date.now());
    cancelAnimationFrame(tFrame);
    tRunning = false;
    tBtnPause.textContent = 'Reanudar';
  } else if (tRemaining > 0) {
    // Reanudar solo si queda tiempo (no al llegar a cero)
    tEndTime = Date.now() + tRemaining;
    tRunning = true;
    tFrame   = requestAnimationFrame(tLoop);
    tBtnPause.textContent = 'Pausa';
  }
});

tBtnReset.addEventListener('click', () => {
  cancelAnimationFrame(tFrame);
  tRunning   = false;
  tRemaining = 0;
  tEndTime   = 0;

  tInputs.forEach(inp => {
    inp.value    = '00';
    inp.readOnly = false;
  });

  tDisplayEl.classList.remove('alert');
  toggleControlVisuals(false, tBtnStart, tBtnPause);
  tBtnPause.disabled    = false;    // restaurar para el próximo uso
  tBtnPause.textContent = 'Pausa';
  tBtnReset.disabled = true;
});
