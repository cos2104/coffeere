/* ===========================================================
   Coffeere — 앱 로직
   =========================================================== */
'use strict';

/* ── 유틸 ───────────────────────────────────────────── */
const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const esc = s => String(s == null ? '' : s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const num = (v, d) => { const n = parseFloat(v); return isFinite(n) ? n : d; };

function mmss(sec){
  sec = Math.max(0, Math.round(sec));
  if (sec >= 3600){
    const h = Math.floor(sec/3600);
    return h + '시간' + (sec % 3600 ? ' ' + Math.round((sec % 3600)/60) + '분' : '');
  }
  return Math.floor(sec/60) + ':' + String(sec % 60).padStart(2,'0');
}
function fmtG(n){ return Math.round(n*10)/10 % 1 === 0 ? String(Math.round(n)) : (Math.round(n*10)/10).toFixed(1); }
function ratioText(dose, water){
  if (!dose || !water) return '';
  return '1:' + (Math.round(water/dose*10)/10).toFixed(1).replace(/\.0$/,'');
}
function daysAgo(iso){
  if (!iso) return '';
  const d = Math.floor((Date.now() - new Date(iso).getTime())/86400000);
  if (isNaN(d)) return '';
  return d <= 0 ? '오늘' : d === 1 ? '어제' : d < 30 ? d + '일 전' : Math.floor(d/30) + '개월 전';
}
function todayISO(){
  const d = new Date(), p = n => String(n).padStart(2,'0');
  return d.getFullYear() + '-' + p(d.getMonth()+1) + '-' + p(d.getDate());
}

let toastTimer;
function toast(msg){
  const t = $('#toast');
  t.textContent = msg; t.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('on'), 1900);
}

/* ── 저장소 ─────────────────────────────────────────── */
const KEY = 'coffeere.v3';
const DEFAULT_DB = {
  v: 3,
  recipes: [],
  beans: [],
  settings: { grinders: [], drippers: [], defaultGrinder: null }
};
let DB = load();

function load(){
  try{
    const raw = localStorage.getItem(KEY);
    if (!raw) return JSON.parse(JSON.stringify(DEFAULT_DB));
    const d = JSON.parse(raw);
    d.recipes = d.recipes || []; d.beans = d.beans || [];
    d.settings = Object.assign({}, DEFAULT_DB.settings, d.settings || {});
    d.settings.grinders = d.settings.grinders || [];
    d.settings.drippers = d.settings.drippers || [];
    return d;
  }catch(e){ return JSON.parse(JSON.stringify(DEFAULT_DB)); }
}
function save(){
  try{ localStorage.setItem(KEY, JSON.stringify(DB)); }
  catch(e){ toast('저장 공간이 부족합니다'); }
}
const ownedGrinders = () => GRINDERS.filter(g => DB.settings.grinders.indexOf(g.id) >= 0);
function primaryGrinder(){
  const owned = ownedGrinders();
  if (DB.settings.defaultGrinder){
    const g = owned.find(x => x.id === DB.settings.defaultGrinder);
    if (g) return g;
  }
  return owned[0] || GRINDERS[0];
}
const beanById = id => DB.beans.find(b => b.id === id) || null;

/* ── 화면 상태 ──────────────────────────────────────── */
const UI = {
  tab: 'recipes',
  rMode: 'mine',
  rQuery: '', rMethod: 'all', rFav: false, rSort: 'recent',
  lQuery: '', lMethod: 'all', lRoast: 'all', lSort: 'basic',
  bQuery: '', bRoast: 'all', bFav: false, bFinished: false, bSort: 'recent',
  cFrom: null, cVal: null, cOwnedOnly: false, cQuery: ''
};

const TABS = [
  { id:'recipes',  label:'레시피', icon:'cup'   },
  { id:'beans',    label:'원두',   icon:'leaf'  },
  { id:'convert',  label:'변환',   icon:'gears' },
  { id:'settings', label:'설정',   icon:'gear'  }
];

function renderTabbar(){
  $('#tabbar').innerHTML = TABS.map(t =>
    `<button class="tabbtn${UI.tab === t.id ? ' on' : ''}" data-tab="${t.id}" role="tab">
       ${ICON(t.icon, 25)}<span>${t.label}</span></button>`).join('');
  $$('#tabbar .tabbtn').forEach(b => b.onclick = () => go(b.dataset.tab));
}
function go(tab){
  if (UI.tab === tab) { $('#view').scrollTo({ top:0, behavior:'smooth' }); return; }
  UI.tab = tab; render(); $('#view').scrollTop = 0;
}
function render(){
  renderTabbar();
  const v = $('#view');
  if (UI.tab === 'recipes')       v.innerHTML = viewRecipes();
  else if (UI.tab === 'beans')    v.innerHTML = viewBeans();
  else if (UI.tab === 'convert')  v.innerHTML = viewConvert();
  else                            v.innerHTML = viewSettings();

  if (UI.tab === 'recipes')       bindRecipes();
  else if (UI.tab === 'beans')    bindBeans();
  else if (UI.tab === 'convert')  bindConvert();
  else                            bindSettings();

  const fab = $('#fab');
  const show = (UI.tab === 'recipes' && UI.rMode !== 'lib') || UI.tab === 'beans';
  fab.hidden = !show;
  fab.onclick = () => UI.tab === 'recipes' ? openRecipeEditor(null) : openBeanEditor(null);
}

/* ── 검색창 / 칩 공통 ───────────────────────────────── */
function searchBox(id, ph, val){
  return `<div class="search${val ? ' has' : ''}">
    ${ICON('search', 19)}
    <input id="${id}" type="search" inputmode="search" placeholder="${esc(ph)}" value="${esc(val)}" autocomplete="off">
    <button class="clear" type="button" data-clear="${id}" aria-label="지우기">${ICON('closeC',19)}</button>
  </div>`;
}
function chip(on, label, data, icon, amber){
  return `<button class="chip${amber ? ' amber' : ''}${on ? ' on' : ''}" type="button" ${data}>
    ${icon ? ICON(icon, 15) : ''}<span>${esc(label)}</span></button>`;
}
/* 검색은 목록 영역만 다시 그립니다 (입력 포커스·키보드 유지) */
function bindSearch(id, key, repaint){
  const inp = $('#' + id);
  if (!inp) return;
  const run = () => {
    UI[key] = inp.value;
    if (inp.parentNode) inp.parentNode.classList.toggle('has', !!inp.value);
    repaint ? repaint() : render();
  };
  inp.addEventListener('input', run);
  const c = $('[data-clear="' + id + '"]');
  if (c) c.onclick = () => { inp.value = ''; run(); inp.focus(); };
}

/* ═══════════════════════════════════════════════════════
   탭 1 — 레시피
   ═══════════════════════════════════════════════════════ */
function filteredRecipes(){
  const q = UI.rQuery.trim().toLowerCase();
  let list = DB.recipes.slice();
  if (UI.rMethod !== 'all') list = list.filter(r => (DEVICES[r.device] || {}).method === UI.rMethod);
  if (UI.rFav) list = list.filter(r => r.favorite);
  if (q) list = list.filter(r => {
    const b = beanById(r.beanId);
    const hay = [r.name, (DEVICES[r.device]||{}).label, b && b.name, b && b.roastery, r.notes]
      .filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  });
  const sorters = {
    recent: (a,b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt),
    name:   (a,b) => (a.name||'').localeCompare(b.name||'', 'ko'),
    rating: (a,b) => (b.rating||0) - (a.rating||0),
    dose:   (a,b) => (b.dose||0) - (a.dose||0)
  };
  return list.sort(sorters[UI.rSort] || sorters.recent);
}
const SORT_LABEL = { recent:'최신순', name:'이름순', rating:'평점순', dose:'원두량순' };

function viewRecipes(){
  const lib = UI.rMode === 'lib';
  const activeFilter = lib ? (UI.lMethod !== 'all' || UI.lRoast !== 'all')
                           : (UI.rMethod !== 'all' || UI.rFav);
  const sortLabel = lib ? LSORT_LABEL[UI.lSort] : SORT_LABEL[UI.rSort];
  return `<div class="topbar">
      <button class="iconbtn${activeFilter ? ' on' : ''}" type="button" id="rFilter" aria-label="필터">${ICON('filter',21)}</button>
      <div class="spacer"></div>
      <button class="iconbtn labeled" type="button" id="rSort">${ICON('sort',18)}<span>${sortLabel}</span></button>
    </div>
    <h1 class="page">레시피</h1>
    <div class="seg">
      <button type="button" data-rmode="mine"${!lib ? ' class="on"' : ''}>내 레시피</button>
      <button type="button" data-rmode="lib"${lib ? ' class="on"' : ''}>유명 레시피</button>
    </div>
    ${lib
      ? searchBox('rq','레시피, 바리스타, 기구 검색', UI.lQuery) +
        `<div class="chips">
          ${chip(UI.lMethod === 'all', '전체', 'data-lm="all"')}
          ${METHODS.map(m => chip(UI.lMethod === m.id, m.label, `data-lm="${m.id}"`)).join('')}
        </div>`
      : searchBox('rq','이름, 원두, 추출 방식 검색', UI.rQuery) +
        `<div class="chips">
          ${chip(UI.rFav, '즐겨찾기', 'data-rfav="1"', 'heart')}
          ${chip(UI.rMethod === 'all', '전체', 'data-rm="all"')}
          ${METHODS.map(m => chip(UI.rMethod === m.id, m.label, `data-rm="${m.id}"`)).join('')}
        </div>`}
    <div id="listArea">${lib ? libListHTML() : recipeListHTML()}</div>`;
}

/* ── 유명 레시피 목록 ───────────────────────────────── */
const LSORT_LABEL = { basic:'기본순', name:'이름순', by:'바리스타순', time:'추출시간순' };

function filteredLibrary(){
  const q = UI.lQuery.trim().toLowerCase();
  let list = LIBRARY.slice();
  if (UI.lMethod !== 'all')
    list = list.filter(r => (DEVICES[LIB_DEVICE[r.dripper]] || {}).method === UI.lMethod);
  if (UI.lRoast !== 'all') list = list.filter(r => r.fit === UI.lRoast);
  if (q) list = list.filter(r => {
    const dev = DEVICES[LIB_DEVICE[r.dripper]] || {};
    return [r.name, r.by, r.role, dev.label, r.blurb].filter(Boolean).join(' ').toLowerCase().indexOf(q) >= 0;
  });
  const sorters = {
    name: (a,b) => a.name.localeCompare(b.name, 'ko'),
    by:   (a,b) => (a.by||'').localeCompare(b.by||'', 'ko'),
    time: (a,b) => (a.total||0) - (b.total||0)
  };
  return sorters[UI.lSort] ? list.sort(sorters[UI.lSort]) : list;
}

function libListHTML(){
  const list = filteredLibrary();
  if (!list.length){
    return `<div class="empty">
      <div class="ill">${ICON('search', 70, 'stroke-width="1.1"')}</div>
      <h2>검색 결과가 없습니다</h2>
      <p>다른 이름이나 추출 방식으로 찾아보세요</p>
    </div>`;
  }
  const g = primaryGrinder();
  return `<div class="hint">${list.length}개의 레시피 · 분쇄도는 ${esc(g.name)} 기준</div>` +
    list.map(r => libCard(r, g)).join('');
}

function libCard(r, g){
  const d = DEVICES[LIB_DEVICE[r.dripper]] || DEVICES.v60;
  const fit = ROASTS.find(x => x.id === r.fit) || ROASTS[2];
  const dial = micronToDial(g, r.um);
  return `<button class="rcard" type="button" data-lib="${r.id}">
    <div class="top">
      <div class="tile">${ICON(d.icon, 23)}</div>
      <div style="min-width:0">
        <h3>${esc(r.name)}</h3>
        <div class="meta">${esc(r.by || d.label)}${r.role ? ' · ' + esc(r.role) : ''}</div>
      </div>
      <div class="right"><span class="dotcol" style="background:${fit.color}"></span></div>
    </div>
    <div class="specs">
      <span class="spec"><b>${fmtG(r.dose)}</b>g</span>
      <span class="spec">비율 <b>1:${(Math.round(r.ratio*10)/10).toFixed(1).replace(/\.0$/,'')}</b></span>
      <span class="spec"><b>${mmss(r.total || 0)}</b></span>
      <span class="spec">${esc(r.temp || '')}</span>
      <span class="spec">${esc(g.brand)} <b>${fmtDial(g, dial.v)}</b> ${esc(g.unit)}</span>
      <span class="spec" style="color:${fit.color}">${fit.label} 기준</span>
    </div>
  </button>`;
}

function recipeListHTML(){
  const list = filteredRecipes();
  if (!DB.recipes.length){
    return `<div class="empty">
      <div class="ill">${ICON('cup', 86, 'stroke-width="1.1"')}</div>
      <h2>레시피가 없습니다</h2>
      <p>첫 번째 커피 레시피를 만들거나\n유명 레시피에서 가져와 보세요</p>
      <button class="btn" type="button" id="rAdd">레시피 추가</button>
      <button class="btn ghost" type="button" id="rBrowse" style="margin-top:10px">유명 레시피 둘러보기</button>
    </div>`;
  }
  if (!list.length){
    return `<div class="empty">
      <div class="ill">${ICON('search', 70, 'stroke-width="1.1"')}</div>
      <h2>검색 결과가 없습니다</h2>
      <p>다른 이름이나 추출 방식으로 찾아보세요</p>
    </div>`;
  }
  return `<div class="hint">${list.length}개의 레시피</div>` + list.map(recipeCard).join('');
}

function recipeCard(r){
  const d = DEVICES[r.device] || DEVICES.v60;
  const b = beanById(r.beanId);
  const g = grinderById(r.grinderId);
  const specs = [
    `<span class="spec"><b>${fmtG(r.dose)}</b>g</span>`,
    `<span class="spec"><b>${fmtG(r.water)}</b>${d.method === 'espresso' ? 'ml' : 'g'}</span>`,
    ratioText(r.dose, r.water) ? `<span class="spec">비율 <b>${ratioText(r.dose, r.water)}</b></span>` : '',
    `<span class="spec"><b>${mmss(r.time)}</b></span>`,
    `<span class="spec"><b>${r.temp}</b>℃</span>`,
    r.grind != null ? `<span class="spec">${esc(g.brand)} <b>${fmtDial(g, r.grind)}</b> ${esc(g.unit)}</span>` : ''
  ].join('');
  return `<button class="rcard" type="button" data-recipe="${r.id}">
    <div class="top">
      <div class="tile">${ICON(d.icon, 23)}</div>
      <div style="min-width:0">
        <h3>${esc(r.name || d.label + ' 레시피')}</h3>
        <div class="meta">${esc(d.label)}${b ? ' · ' + esc(b.name) : ''} · ${daysAgo(r.updatedAt || r.createdAt)}</div>
      </div>
      <div class="right">
        ${r.favorite ? `<span style="color:var(--gold)">${ICON('heart',16)}</span>` : ''}
        ${r.rating ? `<div class="score">★ ${r.rating.toFixed(1)}</div>` : ''}
      </div>
    </div>
    <div class="specs">${specs}</div>
  </button>`;
}

function repaintRecipeList(){
  const a = $('#listArea');
  if (!a) return render();
  a.innerHTML = UI.rMode === 'lib' ? libListHTML() : recipeListHTML();
  bindRecipeList();
}
function bindRecipeList(){
  const add = $('#rAdd'); if (add) add.onclick = () => openRecipeEditor(null);
  $$('[data-recipe]').forEach(b => b.onclick = () => openRecipeDetail(b.dataset.recipe));
  $$('[data-lib]').forEach(b => b.onclick = () => openLibDetail(b.dataset.lib));
  const br = $('#rBrowse'); if (br) br.onclick = () => { UI.rMode = 'lib'; render(); };
}
function bindRecipes(){
  const lib = UI.rMode === 'lib';
  $$('[data-rmode]').forEach(b => b.onclick = () => { UI.rMode = b.dataset.rmode; render(); });
  bindSearch('rq', lib ? 'lQuery' : 'rQuery', repaintRecipeList);
  $$('[data-rm]').forEach(b => b.onclick = () => { UI.rMethod = b.dataset.rm; render(); });
  $$('[data-lm]').forEach(b => b.onclick = () => { UI.lMethod = b.dataset.lm; render(); });
  const f = $('[data-rfav]'); if (f) f.onclick = () => { UI.rFav = !UI.rFav; render(); };
  bindRecipeList();
  $('#rSort').onclick = () => lib
    ? openOptionSheet('정렬', LSORT_LABEL, UI.lSort, v => { UI.lSort = v; render(); })
    : openOptionSheet('정렬', SORT_LABEL, UI.rSort, v => { UI.rSort = v; render(); });
  $('#rFilter').onclick = () => lib ? openLibFilter() : openRecipeFilter();
}

/* 유명 레시피 필터 — 추출 방식 · 기준 배전도 */
function openLibFilter(){
  openSheet({
    title:'필터', right:'완료',
    body: () => `
      <div class="sect">추출 방식</div>
      <div class="group">
        ${['all'].concat(METHODS.map(m => m.id)).map(id => {
          const label = id === 'all' ? '전체' : METHODS.find(m => m.id === id).label;
          return `<button class="listbtn" type="button" data-lfm="${id}">
            <span class="nm">${label}</span>
            <span class="check${UI.lMethod === id ? ' on' : ''}">${ICON('check',14)}</span></button>`;
        }).join('')}
      </div>
      <div class="sect">기준 배전도 <span class="sub">레시피가 설계된 배전도</span></div>
      <div class="group">
        ${['all'].concat(ROASTS.map(r => r.id)).map(id => {
          const r = ROASTS.find(x => x.id === id);
          return `<button class="listbtn" type="button" data-lfr="${id}">
            ${r ? `<span class="dotcol" style="background:${r.color}"></span>` : ''}
            <span class="nm">${r ? r.label : '전체'}</span>
            <span class="check${UI.lRoast === id ? ' on' : ''}">${ICON('check',14)}</span></button>`;
        }).join('')}
      </div>
      <div class="sect"></div>
      <button class="btn wide ghost" type="button" data-lfreset="1">필터 초기화</button>`,
    bind: (root, close, refresh) => {
      $$('[data-lfm]', root).forEach(b => b.onclick = () => { UI.lMethod = b.dataset.lfm; refresh(); });
      $$('[data-lfr]', root).forEach(b => b.onclick = () => { UI.lRoast = b.dataset.lfr; refresh(); });
      $('[data-lfreset]', root).onclick = () => { UI.lMethod = 'all'; UI.lRoast = 'all'; refresh(); };
    },
    onRight: close => { close(); render(); }
  });
}

function openRecipeFilter(){
  openSheet({
    title:'필터', right:'완료',
    body: () => `
      <div class="sect">추출 방식</div>
      <div class="group">
        ${['all'].concat(METHODS.map(m => m.id)).map(id => {
          const label = id === 'all' ? '전체' : METHODS.find(m => m.id === id).label;
          return `<button class="listbtn" type="button" data-fm="${id}">
            <span class="nm">${label}</span>
            <span class="check${UI.rMethod === id ? ' on' : ''}">${ICON('check',14)}</span></button>`;
        }).join('')}
      </div>
      <div class="sect">표시</div>
      <div class="group">
        <div class="row"><span class="lbl">즐겨찾기만 보기</span><div style="flex:1"></div>
          <div class="sw-toggle${UI.rFav ? ' on' : ''}" data-ffav="1"></div></div>
      </div>
      <div class="sect"></div>
      <button class="btn wide ghost" type="button" data-freset="1">필터 초기화</button>`,
    bind: (root, close, refresh) => {
      $$('[data-fm]', root).forEach(b => b.onclick = () => { UI.rMethod = b.dataset.fm; refresh(); });
      $('[data-ffav]', root).onclick = () => { UI.rFav = !UI.rFav; refresh(); };
      $('[data-freset]', root).onclick = () => { UI.rMethod = 'all'; UI.rFav = false; refresh(); };
    },
    onRight: close => { close(); render(); }
  });
}

/* ═══════════════════════════════════════════════════════
   탭 2 — 원두
   ═══════════════════════════════════════════════════════ */
function filteredBeans(){
  const q = UI.bQuery.trim().toLowerCase();
  let list = DB.beans.slice();
  if (!UI.bFinished) list = list.filter(b => !b.finished);
  if (UI.bFav) list = list.filter(b => b.favorite);
  if (UI.bRoast !== 'all') list = list.filter(b => b.roastLevel === UI.bRoast);
  if (q) list = list.filter(b => {
    const hay = [b.name, b.roastery, b.country, b.region, b.farm, b.variety,
      (b.flavors||[]).join(' ')].filter(Boolean).join(' ').toLowerCase();
    return hay.indexOf(q) >= 0;
  });
  const sorters = {
    recent: (a,b) => new Date(b.createdAt) - new Date(a.createdAt),
    name:   (a,b) => (a.name||'').localeCompare(b.name||'', 'ko'),
    rating: (a,b) => (b.rating||0) - (a.rating||0),
    roastDate: (a,b) => (b.roastDate||'').localeCompare(a.roastDate||'')
  };
  return list.sort(sorters[UI.bSort] || sorters.recent);
}
const BSORT_LABEL = { recent:'최신순', name:'이름순', rating:'평점순', roastDate:'로스팅일순' };

function viewBeans(){
  let out = `<div class="topbar">
      <div class="spacer"></div>
      <button class="iconbtn labeled" type="button" id="bSort">${ICON('sort',18)}<span>${BSORT_LABEL[UI.bSort]}</span></button>
    </div>
    <h1 class="page">원두</h1>
    ${searchBox('bq','이름, 로스터리 검색', UI.bQuery)}
    <div class="chips">
      ${chip(UI.bFav, '즐겨찾기', 'data-bfav="1"', 'heart')}
      ${chip(UI.bFinished, '소진 포함', 'data-bfin="1"', 'checkC')}
      ${chip(UI.bRoast === 'all', '전체', 'data-br="all"')}
      ${ROASTS.map(r => chip(UI.bRoast === r.id, r.label, `data-br="${r.id}"`)).join('')}
    </div>
    <div id="listArea">${beanListHTML()}</div>`;
  return out;
}

function beanListHTML(){
  const list = filteredBeans();
  if (!DB.beans.length){
    return `<div class="empty">
      <div class="ill">${ICON('leaf', 86, 'stroke-width="1.1"')}</div>
      <h2>원두를 기록해보세요</h2>
      <p>먹어본 원두의 맛과 정보를\n기록하고 관리할 수 있어요</p>
      <button class="btn" type="button" id="bAdd">원두 추가</button>
    </div>`;
  }
  if (!list.length){
    return `<div class="empty">
      <div class="ill">${ICON('search', 70, 'stroke-width="1.1"')}</div>
      <h2>검색 결과가 없습니다</h2>
      <p>다른 이름이나 조건으로 찾아보세요</p>
    </div>`;
  }
  return `<div class="hint">${list.length}개의 원두</div>` + list.map(beanCard).join('');
}

function beanCard(b){
  const roast = ROASTS.find(r => r.id === b.roastLevel) || ROASTS[2];
  const proc = PROCESSES.find(p => p.id === b.process);
  const origin = [b.country, b.region].filter(Boolean).join(' · ');
  const col = noteHex(b.noteColor);
  const flavors = (b.flavors || []).slice(0, 4).map(f =>
    `<span class="notechip" style="background:${col}22;color:${col}">${esc(f)}</span>`).join(' ');
  return `<button class="rcard" type="button" data-bean="${b.id}">
    <div class="top">
      <div class="tile" style="background:${roast.color}22;color:${roast.color}">${ICON('bean',23)}</div>
      <div style="min-width:0">
        <h3>${esc(b.name || '이름 없는 원두')}${b.finished ? ' <span style="font-size:12px;color:var(--text-3);font-weight:500">· 소진</span>' : ''}</h3>
        <div class="meta">${esc(b.roastery || '로스터리 미기재')}${origin ? ' · ' + esc(origin) : ''}</div>
      </div>
      <div class="right">
        ${b.favorite ? `<span style="color:var(--gold)">${ICON('heart',16)}</span>` : ''}
        ${b.rating ? `<div class="score">★ ${b.rating.toFixed(1)}</div>` : ''}
      </div>
    </div>
    <div class="specs">
      <span class="spec"><span class="dotcol" style="background:${roast.color};display:inline-block;margin-right:5px;vertical-align:-1px"></span>${roast.label}</span>
      ${proc ? `<span class="spec">${proc.label}</span>` : ''}
      ${b.roastDate ? `<span class="spec">로스팅 <b>${esc(b.roastDate.slice(5))}</b></span>` : ''}
      ${b.altitude ? `<span class="spec"><b>${esc(b.altitude)}</b></span>` : ''}
    </div>
    ${flavors ? `<div class="specs">${flavors}</div>` : ''}
  </button>`;
}

function repaintBeanList(){
  const a = $('#listArea');
  if (!a) return render();
  a.innerHTML = beanListHTML();
  bindBeanList();
}
function bindBeanList(){
  const add = $('#bAdd'); if (add) add.onclick = () => openBeanEditor(null);
  $$('[data-bean]').forEach(b => b.onclick = () => openBeanDetail(b.dataset.bean));
}
function bindBeans(){
  bindSearch('bq', 'bQuery', repaintBeanList);
  $$('[data-br]').forEach(b => b.onclick = () => { UI.bRoast = b.dataset.br; render(); });
  const f = $('[data-bfav]'); if (f) f.onclick = () => { UI.bFav = !UI.bFav; render(); };
  const fin = $('[data-bfin]'); if (fin) fin.onclick = () => { UI.bFinished = !UI.bFinished; render(); };
  bindBeanList();
  $('#bSort').onclick = () => openOptionSheet('정렬', BSORT_LABEL, UI.bSort, v => { UI.bSort = v; render(); });
}

/* ═══════════════════════════════════════════════════════
   탭 3 — 변환 (그라인더 ↔ 그라인더)
   ═══════════════════════════════════════════════════════ */
function convFrom(){ return grinderById(UI.cFrom || primaryGrinder().id); }
function convVal(){
  const g = convFrom();
  if (UI.cVal == null) return Math.round(micronToDial(g, 850).v * 10) / 10;
  return UI.cVal;
}
function convTargets(){
  const from = convFrom();
  const q = UI.cQuery.trim().toLowerCase();
  const owned = ownedGrinders();
  let targets = GRINDERS.filter(g => g.id !== from.id);
  if (UI.cOwnedOnly && owned.length) targets = targets.filter(g => owned.some(o => o.id === g.id));
  if (q) targets = targets.filter(g => (g.name + ' ' + g.brand).toLowerCase().indexOf(q) >= 0);
  return targets;
}
function convResultHTML(){
  const from = convFrom(), um = dialToMicron(from, convVal());
  const targets = convTargets();
  return `<div class="sect">환산 결과 <span class="sub">${targets.length}개</span></div>
    <div class="group">
      ${targets.length ? targets.map(g => {
        const r = micronToDial(g, um);
        const sub = r.flag === 'under' ? '이 그라인더의 최소 범위 밖' :
                    r.flag === 'over'  ? '이 그라인더의 최대 범위 밖' :
                    (rotText(g, r.v) || g.hint);
        return `<div class="conv-res${r.flag ? ' warn' : ''}">
          <div class="nm">${esc(g.name)}<small>${esc(sub)}</small></div>
          <div class="vv">${fmtDial(g, r.v)}<span style="font-size:12px;color:var(--text-3);margin-left:3px">${esc(g.unit)}</span></div>
        </div>`;
      }).join('') : `<div class="row"><span class="lbl">조건에 맞는 그라인더가 없습니다</span></div>`}
    </div>`;
}

function viewConvert(){
  const from = convFrom(), v = convVal();
  const um = dialToMicron(from, v);
  const owned = ownedGrinders();
  const step = from.dec === 0 ? 1 : 0.1;
  return `<h1 class="page">변환</h1>
    ${searchBox('cq','그라인더 검색', UI.cQuery)}
    <div class="chips">
      ${chip(!UI.cOwnedOnly, '전체 그라인더', 'data-co="0"')}
      ${chip(UI.cOwnedOnly, '보유만' + (owned.length ? ' (' + owned.length + ')' : ''), 'data-co="1"', 'checkC')}
    </div>

    <div class="convbox">
      <span class="cap">기준 그라인더</span>
      <button class="gpick" type="button" id="cPick">
        ${ICON('grinder',21)}<span class="nm">${esc(from.name)}</span>
        <span class="un">${esc(from.unit)}</span>${ICON('chevR',17)}
      </button>
      <div class="bigval">
        <button class="stepbtn" type="button" data-cv="-1">${ICON('minus',18)}</button>
        <div class="n">${fmtDial(from, v)}<span class="u">${esc(from.unit)}</span></div>
        <button class="stepbtn" type="button" data-cv="1">${ICON('plus',18)}</button>
      </div>
      <input class="slider" type="range" id="cSlider" min="0" max="${from.max}" step="${step}" value="${clamp(v,0,from.max)}"
        style="--track:linear-gradient(90deg,var(--gold) ${clamp(v/from.max*100,0,100)}%,#3A3A3E ${clamp(v/from.max*100,0,100)}%)">
      <div class="micron">입자 크기 약 <b>${Math.round(um)}</b> μm${rotText(from, v) ? ' · ' + rotText(from, v) : ''}</div>
    </div>

    <div class="swapbtn" aria-hidden="true">${ICON('down',20)}</div>

    <div id="listArea">${convResultHTML()}</div>

    <div class="note"><span>${ICON('info',17)}</span>
      <span>입자 크기(μm)를 중간값으로 두고 양쪽 그라인더의 환산 곡선을 보간합니다.
      버·개체차·원두 상태에 따라 실제 값은 1–2클릭 달라질 수 있어요. 표시값은 출발점으로 쓰고 맛으로 마무리하세요.</span></div>`;
}

function bindConvert(){
  bindSearch('cq', 'cQuery', () => {
    const a = $('#listArea');
    if (a) a.innerHTML = convResultHTML(); else render();
  });
  $$('[data-co]').forEach(b => b.onclick = () => { UI.cOwnedOnly = b.dataset.co === '1'; render(); });
  $('#cPick').onclick = () => openGrinderPicker(convFrom().id, id => {
    const old = convFrom(), um = dialToMicron(old, convVal());
    UI.cFrom = id;
    const g = grinderById(id);
    UI.cVal = Math.round(micronToDial(g, um).v * 10) / 10;
    render();
  });
  $$('[data-cv]').forEach(b => b.onclick = () => {
    const g = convFrom(), d = g.dec === 0 ? 1 : 0.1;
    UI.cVal = Math.round(clamp(convVal() + d * Number(b.dataset.cv), 0, g.max) * 10) / 10;
    render();
  });
  const sl = $('#cSlider');
  sl.oninput = () => {
    UI.cVal = Math.round(num(sl.value, 0) * 10) / 10;
    const g = convFrom(), p = clamp(UI.cVal / g.max * 100, 0, 100);
    sl.style.setProperty('--track', `linear-gradient(90deg,var(--gold) ${p}%,#3A3A3E ${p}%)`);
    const n = $('.bigval .n');
    if (n) n.innerHTML = fmtDial(g, UI.cVal) + `<span class="u">${esc(g.unit)}</span>`;
  };
  sl.onchange = () => render();
}

/* ═══════════════════════════════════════════════════════
   탭 4 — 설정
   ═══════════════════════════════════════════════════════ */
function viewSettings(){
  const gs = DB.settings.grinders, ds = DB.settings.drippers;
  const drippers = DEVICE_LIST.filter(d => d.dripper);
  const pg = primaryGrinder();
  return `<h1 class="page">설정</h1>

    <div class="sect">보유 그라인더 <span class="sub">${gs.length}개 선택</span></div>
    <div class="group">
      ${GRINDERS.map(g => `<button class="listbtn" type="button" data-og="${g.id}">
        <span style="color:${gs.indexOf(g.id)>=0 ? 'var(--gold)' : 'var(--text-3)'}">${ICON('grinder',20)}</span>
        <span class="nm">${esc(g.name)}<small>${esc(g.brand)} · ${esc(g.unit)} · ${esc(g.hint)}</small></span>
        <span class="check${gs.indexOf(g.id)>=0 ? ' on' : ''}">${ICON('check',14)}</span>
      </button>`).join('')}
    </div>
    ${gs.length > 1 ? `<div class="sect">기본 그라인더</div>
    <div class="group">
      ${ownedGrinders().map(g => `<button class="listbtn" type="button" data-dg="${g.id}">
        <span class="nm">${esc(g.name)}</span>
        <span class="check${pg.id === g.id ? ' on' : ''}">${ICON('check',14)}</span></button>`).join('')}
    </div>
    <div class="hint">새 레시피를 만들 때 기본으로 선택되는 그라인더입니다.</div>` : ''}

    <div class="sect">보유 드리퍼 <span class="sub">${ds.length}개 선택</span></div>
    <div class="group">
      ${drippers.map(d => `<button class="listbtn" type="button" data-od="${d.id}">
        <span style="color:${ds.indexOf(d.id)>=0 ? 'var(--gold)' : 'var(--text-3)'}">${ICON(d.icon,20)}</span>
        <span class="nm">${esc(d.label)}<small>${esc((METHODS.find(m=>m.id===d.method)||{}).label || '')}</small></span>
        <span class="check${ds.indexOf(d.id)>=0 ? ' on' : ''}">${ICON('check',14)}</span>
      </button>`).join('')}
    </div>
    <div class="hint">보유한 드리퍼는 새 레시피의 추출 방식에서 초록 점으로 표시됩니다.</div>

    <div class="sect">데이터</div>
    <div class="group">
      <div class="row"><span class="lbl">레시피</span><span class="val">${DB.recipes.length}개</span></div>
      <div class="row"><span class="lbl">원두</span><span class="val">${DB.beans.length}개</span></div>
      <button class="listbtn" type="button" id="sExport">${ICON('down',19)}<span class="nm">백업 파일 내보내기<small>JSON 파일로 저장</small></span>${ICON('chevR',17)}</button>
      <button class="listbtn" type="button" id="sImport">${ICON('up',19)}<span class="nm">백업 파일 가져오기<small>기존 데이터에 합칩니다</small></span>${ICON('chevR',17)}</button>
      <button class="listbtn" type="button" id="sReset"><span style="color:var(--red)">${ICON('trash',19)}</span><span class="nm" style="color:var(--red)">전체 초기화</span></button>
    </div>

    <div class="sect">정보</div>
    <div class="group">
      <div class="row"><span class="lbl">앱</span><span class="val">Coffeere v3.0</span></div>
      <div class="row"><span class="lbl">저장 위치</span><span class="val">이 기기 (브라우저)</span></div>
    </div>
    <div class="hint">모든 기록은 이 브라우저에만 저장됩니다. 기기를 옮기거나 캐시를 지우기 전에 백업 파일을 내보내세요.</div>
    <input type="file" id="sFile" accept="application/json,.json" hidden>`;
}

function bindSettings(){
  $$('[data-og]').forEach(b => b.onclick = () => {
    const id = b.dataset.og, a = DB.settings.grinders, i = a.indexOf(id);
    if (i >= 0){ a.splice(i,1); if (DB.settings.defaultGrinder === id) DB.settings.defaultGrinder = a[0] || null; }
    else a.push(id);
    save(); render();
  });
  $$('[data-dg]').forEach(b => b.onclick = () => { DB.settings.defaultGrinder = b.dataset.dg; save(); render(); });
  $$('[data-od]').forEach(b => b.onclick = () => {
    const id = b.dataset.od, a = DB.settings.drippers, i = a.indexOf(id);
    if (i >= 0) a.splice(i,1); else a.push(id);
    save(); render();
  });
  $('#sExport').onclick = exportData;
  $('#sImport').onclick = () => $('#sFile').click();
  $('#sFile').onchange = importData;
  $('#sReset').onclick = () => confirmSheet('전체 초기화',
    '레시피 ' + DB.recipes.length + '개, 원두 ' + DB.beans.length + '개가 모두 삭제됩니다. 되돌릴 수 없어요.',
    '초기화', () => { DB = JSON.parse(JSON.stringify(DEFAULT_DB)); save(); render(); toast('초기화했습니다'); });
}

function exportData(){
  const blob = new Blob([JSON.stringify(DB, null, 2)], { type:'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'coffeere-' + todayISO() + '.json';
  document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  toast('백업 파일을 내보냈습니다');
}
function importData(e){
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  const fr = new FileReader();
  fr.onload = () => {
    try{
      const d = JSON.parse(fr.result);
      const rc = (d.recipes || []).filter(r => !DB.recipes.some(x => x.id === r.id));
      const bc = (d.beans || []).filter(b => !DB.beans.some(x => x.id === b.id));
      DB.recipes = DB.recipes.concat(rc);
      DB.beans = DB.beans.concat(bc);
      if (d.settings){
        DB.settings.grinders = Array.from(new Set(DB.settings.grinders.concat(d.settings.grinders || [])));
        DB.settings.drippers = Array.from(new Set(DB.settings.drippers.concat(d.settings.drippers || [])));
      }
      save(); render();
      toast('레시피 ' + rc.length + '개, 원두 ' + bc.length + '개를 가져왔습니다');
    }catch(err){ toast('파일을 읽을 수 없습니다'); }
  };
  fr.readAsText(f);
  e.target.value = '';
}
