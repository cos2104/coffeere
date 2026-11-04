/* ===========================================================
   Coffeere — 상세 화면 · 추출 타이머 · 부팅
   =========================================================== */
'use strict';

/* ── 작은 알림음 ───────────────────────────────────── */
let audioCtx = null;
function beep(freq, ms){
  try{
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const o = audioCtx.createOscillator(), g = audioCtx.createGain();
    o.type = 'sine'; o.frequency.value = freq;
    g.gain.setValueAtTime(0.0001, audioCtx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.18, audioCtx.currentTime + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + ms / 1000);
    o.connect(g); g.connect(audioCtx.destination);
    o.start(); o.stop(audioCtx.currentTime + ms / 1000 + 0.02);
  }catch(e){}
}

/* ═══════════════════════════════════════════════════════
   레시피 상세
   ═══════════════════════════════════════════════════════ */
function openRecipeDetail(id){
  const r = DB.recipes.find(function(x){ return x.id === id; });
  if (!r) return;

  let t0 = 0, elapsed = 0, running = false, tick = null, lastStep = -1, doneBeep = false;
  let rootEl = null;

  const api = openSheet({
    title: '', left: '닫기', rightIcon: 'dots',
    body: function(){ return recipeDetailHTML(r); },
    bind: function(root, close, refresh){ bindDetail(root, refresh); },
    onRight: function(close){ detailMenu(r, close); },
    onClose: function(){ if (tick) clearInterval(tick); }
  });

  function totalTime(){
    const last = r.steps.length ? r.steps[r.steps.length - 1].t : 0;
    return Math.max(r.time, last);
  }
  function curIndex(){
    let idx = -1;
    r.steps.forEach(function(s, i){ if (elapsed >= s.t) idx = i; });
    return idx;
  }
  function paint(){
    const root = rootEl;
    if (!root) return;
    const c = $('#tClock', root); if (!c) return;
    const tt = totalTime();
    c.textContent = mmss(elapsed);
    $('#tBar > i', root).style.width = clamp(elapsed / tt * 100, 0, 100) + '%';
    const i = curIndex();
    const s = r.steps[i];
    let cum = 0;
    for (let k = 0; k <= i; k++) cum += num(r.steps[k].g, 0);
    const nxt = r.steps[i + 1];
    $('#tNow', root).innerHTML = s
      ? '<b>' + (i + 1) + '단계</b> ' + esc(s.label || '푸어링') + ' · ' + fmtG(s.g) + 'g 붓기 <span style="color:var(--text-3)">(누적 ' + fmtG(cum) + 'g)</span>'
      : '<span style="color:var(--text-2)">시작을 누르면 1단계부터 안내합니다</span>';
    $('#tNext', root).textContent = nxt ? '다음 ' + mmss(nxt.t) + ' · ' + fmtG(nxt.g) + 'g'
      : (elapsed >= tt ? '추출 완료' : '목표 ' + mmss(tt));
    $$('#tList .ti', root).forEach(function(el, k){
      el.classList.toggle('act', k === i);
      el.classList.toggle('done', k < i);
    });
    if (i !== lastStep && i >= 0 && running){ beep(880, 160); lastStep = i; }
    if (!doneBeep && running && elapsed >= tt){ beep(660, 420); doneBeep = true; }
  }
  function loop(){
    elapsed = (Date.now() - t0) / 1000;
    paint();
  }
  function start(){
    if (running) return;
    running = true; doneBeep = elapsed >= totalTime();
    t0 = Date.now() - elapsed * 1000;
    tick = setInterval(loop, 200);
    beep(1040, 120);
    syncBtns();
  }
  function pause(){ running = false; if (tick) clearInterval(tick); tick = null; syncBtns(); }
  function reset(){ pause(); elapsed = 0; lastStep = -1; doneBeep = false; paint(); }
  function syncBtns(){
    if (!rootEl) return;
    const b = $('#tPlay', rootEl);
    if (b) b.innerHTML = (running ? ICON('pause', 19) + ' 일시정지' : ICON('play', 19) + (elapsed ? ' 이어서' : ' 시작'));
  }

  function bindDetail(root, refresh){
    rootEl = root;
    const p = $('#tPlay', root);
    if (p) p.onclick = function(){ running ? pause() : start(); };
    const rs = $('#tReset', root);
    if (rs) rs.onclick = reset;
    const bl = $('[data-openbean]', root);
    if (bl) bl.onclick = function(){ openBeanDetail(bl.dataset.openbean); };
    const fv = $('[data-tfav]', root);
    if (fv) fv.onclick = function(){
      r.favorite = !r.favorite; r.updatedAt = new Date().toISOString(); save();
      fv.classList.toggle('on', r.favorite); render();
    };
    syncBtns(); paint();
  }

  function detailMenu(rec, close){
    openActions(rec.name, [
      { label:'편집', icon:'edit', run: function(){ openRecipeEditor(rec.id); } },
      { label: rec.favorite ? '즐겨찾기 해제' : '즐겨찾기', icon:'heart', run: function(){
          rec.favorite = !rec.favorite; rec.updatedAt = new Date().toISOString();
          save(); render(); api.refresh(); } },
      { label:'복제', icon:'copy', run: function(){
          const c = JSON.parse(JSON.stringify(rec));
          c.id = uid(); c.name = rec.name + ' 복사본';
          c.createdAt = c.updatedAt = new Date().toISOString();
          DB.recipes.unshift(c); save(); render(); toast('복제했습니다'); } },
      { label:'삭제', icon:'trash', danger:true, run: function(){
          confirmSheet('레시피 삭제', '"' + rec.name + '" 을(를) 삭제합니다. 되돌릴 수 없어요.', '삭제', function(){
            DB.recipes = DB.recipes.filter(function(x){ return x.id !== rec.id; });
            save(); closeAllSheets(); setTimeout(function(){ render(); toast('삭제했습니다'); }, 220);
          }); } }
    ]);
  }
}

function recipeDetailHTML(r){
  const d = DEVICES[r.device] || DEVICES.v60;
  const g = grinderById(r.grinderId);
  const b = beanById(r.beanId);
  const um = dialToMicron(g, r.grind);
  const owned = ownedGrinders().filter(function(x){ return x.id !== g.id; });
  const tt = Math.max(r.time, r.steps.length ? r.steps[r.steps.length - 1].t : 0);
  let cum = 0;

  return '<div class="detail-hero">' +
      '<div class="tile">' + ICON(d.icon, 38) + '</div>' +
      '<h2>' + esc(r.name) + '</h2>' +
      '<p>' + esc(d.label) + (b ? ' · ' + esc(b.name) : '') + ' · ' + daysAgo(r.updatedAt || r.createdAt) + '</p>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:14px">' +
        '<button class="chip' + (r.favorite ? ' on' : '') + '" type="button" data-tfav="1">' +
          ICON('heart', 15) + '<span>즐겨찾기</span></button>' +
        (r.rating ? '<span class="chip amber">★ ' + r.rating.toFixed(1) + '</span>' : '') +
        '<span class="chip">' + (ratioText(r.dose, r.water) || '–') + '</span>' +
      '</div>' +
    '</div>' +

    '<div class="kpis">' +
      '<div class="kpi"><div class="n">' + fmtG(r.dose) + '<small>g</small></div><div class="c">원두량</div></div>' +
      '<div class="kpi"><div class="n">' + fmtG(r.water) + '<small>ml</small></div><div class="c">' + (d.method === 'espresso' ? '추출량' : '물') + '</div></div>' +
      '<div class="kpi"><div class="n">' + mmss(r.time) + '</div><div class="c">시간</div></div>' +
      '<div class="kpi"><div class="n">' + r.temp + '<small>℃</small></div><div class="c">수온</div></div>' +
    '</div>' +

    '<div class="card">' +
      '<div class="grindhead"><span class="t">분쇄도 ·</span><span class="g">' + esc(g.name) + '</span>' +
        '<span class="v" style="color:var(--gold)">' + fmtDial(g, r.grind) + ' ' + g.unit + '</span></div>' +
      '<div class="note amber" style="margin-top:9px"><span>' + ICON('info', 17) + '</span><span>약 ' + Math.round(um) + ' μm' +
        (rotText(g, r.grind) ? ' · ' + rotText(g, r.grind) : '') +
        (owned.length ? '<br>' + owned.map(function(o){
          return esc(o.name) + ' ' + fmtDial(o, micronToDial(o, um).v) + ' ' + o.unit;
        }).join(' · ') : '') + '</span></div>' +
    '</div>' +

    '<div class="sect">추출 타이머</div>' +
    '<div class="timer">' +
      '<div class="clock" id="tClock">0:00</div>' +
      '<div class="target" id="tNext">목표 ' + mmss(tt) + '</div>' +
      '<div class="bar" id="tBar"><i style="width:0%"></i></div>' +
      '<div class="now" id="tNow"></div>' +
      '<div class="ctrls">' +
        '<button class="btn solid" type="button" id="tPlay">' + ICON('play', 19) + ' 시작</button>' +
        '<button class="btn ghost" type="button" id="tReset">' + ICON('reset', 19) + ' 리셋</button>' +
      '</div>' +
      '<div class="tl" id="tList">' + r.steps.map(function(s, i){
        cum += num(s.g, 0);
        return '<div class="ti"><span class="d"></span>' +
          '<span class="tt">' + mmss(s.t) + '</span>' +
          '<span class="gg">' + fmtG(s.g) + 'g</span>' +
          '<span class="nn">' + esc(s.label || '') + (s.note ? ' · ' + esc(s.note) : '') +
          ' <span style="color:var(--text-3)">누적 ' + fmtG(cum) + 'g</span></span></div>';
      }).join('') + '</div>' +
    '</div>' +

    (b ? '<div class="sect">원두</div><button class="rcard" type="button" data-openbean="' + b.id + '" style="margin-bottom:12px">' +
      '<div class="top"><div class="tile" style="background:' +
        ((ROASTS.find(function(x){ return x.id === b.roastLevel; }) || ROASTS[2]).color) + '22;color:' +
        ((ROASTS.find(function(x){ return x.id === b.roastLevel; }) || ROASTS[2]).color) + '">' + ICON('bean', 23) + '</div>' +
      '<div style="min-width:0"><h3>' + esc(b.name) + '</h3><div class="meta">' + esc(b.roastery || '') + '</div></div>' +
      '<div class="right">' + ICON('chevR', 18) + '</div></div></button>' : '') +

    (r.notes ? '<div class="sect">메모</div><div class="card" style="white-space:pre-wrap;color:var(--text-2);font-size:15px;line-height:1.6">' +
      esc(r.notes) + '</div>' : '');
}

/* ═══════════════════════════════════════════════════════
   원두 상세
   ═══════════════════════════════════════════════════════ */
function openBeanDetail(id){
  const b = DB.beans.find(function(x){ return x.id === id; });
  if (!b) return;

  const api = openSheet({
    title: '', left: '닫기', rightIcon: 'dots',
    body: function(){ return beanDetailHTML(b); },
    bind: function(root){ bindBeanDetail(root); },
    onRight: function(){ menu(); }
  });

  function bindBeanDetail(root){
    const fv = $('[data-tfav]', root);
    if (fv) fv.onclick = function(){ b.favorite = !b.favorite; save(); fv.classList.toggle('on', b.favorite); render(); };
    const fn = $('[data-tfin]', root);
    if (fn) fn.onclick = function(){ b.finished = !b.finished; save(); fn.classList.toggle('on', b.finished); render(); };
    $$('[data-recipe]', root).forEach(function(x){
      x.onclick = function(){ openRecipeDetail(x.dataset.recipe); };
    });
    const nr = $('[data-newrecipe]', root);
    if (nr) nr.onclick = function(){ openRecipeEditor(null, { beanId: b.id }); };
  }
  function menu(){
    openActions(b.name, [
      { label:'편집', icon:'edit', run: function(){ openBeanEditor(b.id); } },
      { label: b.finished ? '소진 해제' : '소진 표시', icon:'checkC', run: function(){
          b.finished = !b.finished; save(); render(); api.refresh(); } },
      { label:'삭제', icon:'trash', danger:true, run: function(){
          confirmSheet('원두 삭제', '"' + b.name + '" 을(를) 삭제합니다. 되돌릴 수 없어요.', '삭제', function(){
            DB.beans = DB.beans.filter(function(x){ return x.id !== b.id; });
            DB.recipes.forEach(function(r){ if (r.beanId === b.id) r.beanId = null; });
            save(); closeAllSheets(); setTimeout(function(){ render(); toast('삭제했습니다'); }, 220);
          }); } }
    ]);
  }
}

function beanDetailHTML(b){
  const roast = ROASTS.find(function(x){ return x.id === b.roastLevel; }) || ROASTS[2];
  const proc = PROCESSES.find(function(x){ return x.id === b.process; });
  const col = noteHex(b.noteColor);
  const rows = [
    ['국가', b.country], ['지역', b.region], ['농장', b.farm],
    ['품종', b.variety], ['재배 고도', b.altitude],
    ['가공 방식', proc ? proc.label : ''],
    ['로스팅 날짜', b.roastDate ? b.roastDate + ' (' + daysAgo(b.roastDate) + ')' : '']
  ].filter(function(x){ return x[1]; });
  const linked = DB.recipes.filter(function(r){ return r.beanId === b.id; });

  return '<div class="detail-hero">' +
      '<div class="tile" style="background:' + roast.color + '22;color:' + roast.color + '">' + ICON('bean', 38) + '</div>' +
      '<h2>' + esc(b.name) + '</h2>' +
      '<p>' + esc(b.roastery || '로스터리 미기재') + '</p>' +
      '<div style="display:flex;gap:10px;justify-content:center;margin-top:14px;flex-wrap:wrap">' +
        '<button class="chip' + (b.favorite ? ' on' : '') + '" type="button" data-tfav="1">' + ICON('heart', 15) + '<span>즐겨찾기</span></button>' +
        '<button class="chip' + (b.finished ? ' on' : '') + '" type="button" data-tfin="1">' + ICON('checkC', 15) + '<span>소진</span></button>' +
        (b.rating ? '<span class="chip amber">★ ' + b.rating.toFixed(1) + '</span>' : '') +
      '</div>' +
    '</div>' +

    '<div class="group">' +
      '<div class="row"><span class="lbl">로스팅 레벨</span><span class="val">' +
        '<span class="dotcol" style="background:' + roast.color + ';display:inline-block;margin-right:7px;vertical-align:-1px"></span>' +
        roast.label + '</span></div>' +
      rows.map(function(x){
        return '<div class="row"><span class="lbl">' + x[0] + '</span><span class="val">' + esc(x[1]) + '</span></div>';
      }).join('') +
    '</div>' +

    (b.flavors && b.flavors.length ? '<div class="sect">향미 노트</div><div class="card"><div style="display:flex;flex-wrap:wrap;gap:8px">' +
      b.flavors.map(function(f){
        return '<span class="notechip" style="background:' + col + '26;color:' + col + ';height:30px;padding:0 13px;font-size:13.5px">' + esc(f) + '</span>';
      }).join('') + '</div></div>' : '') +

    (b.notes ? '<div class="sect">메모</div><div class="card" style="white-space:pre-wrap;color:var(--text-2);font-size:15px;line-height:1.6">' +
      esc(b.notes) + '</div>' : '') +

    '<div class="sect">이 원두의 레시피 <span class="sub">' + linked.length + '개</span></div>' +
    (linked.length ? linked.map(recipeCard).join('') : '<div class="hint">아직 이 원두로 만든 레시피가 없습니다.</div>') +
    '<button class="addstep" type="button" data-newrecipe="1" style="margin-top:4px">' + ICON('plus', 18) + ' 이 원두로 레시피 만들기</button>';
}

/* ═══════════════════════════════════════════════════════
   부팅
   ═══════════════════════════════════════════════════════ */
let booted = false;
function boot(){
  if (booted) return;
  booted = true;
  render();
}
document.addEventListener('DOMContentLoaded', boot);
if (document.readyState !== 'loading') boot();
