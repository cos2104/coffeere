/* ===========================================================
   Coffeere — 레시피 / 원두 편집 시트
   =========================================================== */
'use strict';

/* ── 공용 위젯 ─────────────────────────────────────── */

/* 값이 길면 글자 크기를 한 단계씩 줄입니다 */
function paramFont(v){
  const n = String(v).length;
  return n <= 4 ? '' : n === 5 ? 'd5' : 'd6';
}

/* 숫자 파라미터 (− 값 +) */
function paramBox(key, cap, value, unit, dec){
  return '<div class="param">' +
    '<span class="cap">' + esc(cap) + '</span>' +
    '<div class="ctl">' +
      '<button class="stepbtn" type="button" data-pm="' + key + '" data-dir="-1">' + ICON('minus', 17) + '</button>' +
      '<div class="num"><input data-pi="' + key + '" type="text" inputmode="decimal" value="' + esc(value) + '" ' +
        'size="' + String(value).length + '" class="' + paramFont(value) + '"><span class="u">' + esc(unit) + '</span></div>' +
      '<button class="stepbtn" type="button" data-pm="' + key + '" data-dir="1">' + ICON('plus', 17) + '</button>' +
    '</div></div>';
}

/* 별점 */
function starsHTML(value){
  let out = '';
  for (let i = 0; i < 5; i++){
    const pct = clamp((value - i) * 100, 0, 100);
    out += '<span class="s"><svg viewBox="0 0 24 24" width="50" height="50" aria-hidden="true">' +
      ICON_RAW.star + '</svg>' +
      '<span class="half" style="width:' + pct + '%">' +
      '<svg viewBox="0 0 24 24" width="50" height="50" aria-hidden="true">' + ICON_RAW.star + '</svg></span></span>';
  }
  return out;
}
function rateBoxHTML(label, value){
  const has = value != null;
  return '<div class="ratebox" id="rateBox">' +
    '<div class="ratehead"><span class="t">' + esc(label) + '</span>' +
      '<span class="v"' + (has ? '' : ' style="color:var(--text-3)"') + '>' + (has ? value.toFixed(1) : '–') + '</span>' +
      (has ? '<button class="clr" type="button" data-rclear="1" aria-label="평점 지우기">' + ICON('closeC', 22) + '</button>' : '') +
    '</div>' +
    '<div class="stars" data-stars="1">' + starsHTML(has ? value : 0) + '</div></div>';
}
/* 별점 영역에 포인터 핸들러 연결. set(v) 는 모델 갱신 + 다시 그리기 */
function bindStars(root, label, getValue, set){
  const box = $('#rateBox', root);
  if (!box) return;
  const strip = $('[data-stars]', box);
  function fromEvent(e){
    const r = strip.getBoundingClientRect();
    const x = (e.touches ? e.touches[0].clientX : e.clientX) - r.left;
    const raw = clamp(x / r.width * 5, 0, 5);
    return Math.max(0.1, Math.round(raw * 10) / 10);
  }
  function paint(v){
    const vEl = $('.v', box);
    vEl.textContent = v == null ? '–' : v.toFixed(1);
    vEl.style.color = v == null ? 'var(--text-3)' : '';
    strip.innerHTML = starsHTML(v == null ? 0 : v);
    if (v != null && !$('[data-rclear]', box)){
      $('.ratehead', box).insertAdjacentHTML('beforeend',
        '<button class="clr" type="button" data-rclear="1" aria-label="평점 지우기">' + ICON('closeC', 22) + '</button>');
      bindClear();
    }
  }
  function bindClear(){
    const c = $('[data-rclear]', box);
    if (c) c.onclick = function(){ set(null); c.remove(); paint(null); };
  }
  let dragging = false;
  function move(e){ if (!dragging) return; e.preventDefault(); const v = fromEvent(e); set(v); paint(v); }
  strip.addEventListener('pointerdown', function(e){
    dragging = true; strip.setPointerCapture && strip.setPointerCapture(e.pointerId);
    const v = fromEvent(e); set(v); paint(v);
  });
  strip.addEventListener('pointermove', move);
  strip.addEventListener('pointerup', function(){ dragging = false; });
  strip.addEventListener('pointercancel', function(){ dragging = false; });
  bindClear();
}

/* 텍스트 필드 */
function fieldHTML(key, placeholder, value, type){
  return '<div class="field"><input data-f="' + key + '" type="' + (type || 'text') + '" ' +
    'placeholder="' + esc(placeholder) + '" value="' + esc(value || '') + '" autocomplete="off"></div>';
}
function bindFields(root, obj){
  $$('[data-f]', root).forEach(function(i){
    i.oninput = function(){ obj[i.dataset.f] = i.value; };
  });
}

/* ═══════════════════════════════════════════════════════
   레시피 편집
   ═══════════════════════════════════════════════════════ */
function newRecipe(){
  const g = primaryGrinder();
  const owned = DB.settings.drippers;
  let dev = DEVICES.v60;
  if (owned.length){
    const first = DEVICE_LIST.find(function(d){ return owned.indexOf(d.id) >= 0; });
    if (first) dev = first;
  }
  const d = dev.def;
  return {
    id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    name: '', category: dev.method, device: dev.id, beanId: null,
    dose: d.dose, water: d.water, time: d.time, temp: d.temp,
    grinderId: g.id, grind: Math.round(micronToDial(g, 850).v * 10) / 10,
    steps: defaultSteps(dev.id, d.dose, d.water),
    rating: null, notes: '', favorite: false, touched: false
  };
}

function openRecipeEditor(id, preset){
  const src = id ? DB.recipes.find(function(x){ return x.id === id; }) : null;
  const r = src ? JSON.parse(JSON.stringify(src)) : Object.assign(newRecipe(), preset || {});
  if (!r.steps) r.steps = [];
  if (src) r.touched = true;   /* 편집 중에는 기구를 바꿔도 입력값을 유지 */

  const api = openSheet({
    title: src ? '레시피 편집' : '새 레시피',
    left: '취소',
    right: src ? '저장' : '추가',
    body: function(){ return recipeFormHTML(r, !!src); },
    foot: function(){
      return '<button class="btn wide solid" type="button" data-save="1">' +
        (src ? '저장' : ICON('plus', 20) + ' 레시피 추가') + '</button>';
    },
    bind: function(root, close, refresh){ bindRecipeForm(root, r, refresh, function(){ commit(close); }); },
    onRight: function(close){ commit(close); }
  });

  function commit(close){
    const total = r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0);
    if (!r.name.trim()) r.name = (DEVICES[r.device] || DEVICES.v60).label + ' 레시피';
    if (total > 0) r.water = Math.round(total * 10) / 10;
    r.updatedAt = new Date().toISOString();
    delete r.touched;
    if (src){
      const i = DB.recipes.findIndex(function(x){ return x.id === r.id; });
      DB.recipes[i] = r;
    } else {
      DB.recipes.unshift(r);
    }
    save();
    close();
    setTimeout(function(){ render(); toast(src ? '수정했습니다' : '레시피를 추가했습니다'); }, 60);
  }
}

function recipeFormHTML(r, isEdit){
  return '<div id="secMethod">' + methodSectionHTML(r) + '</div>' +
    '<div class="sect">기본 정보</div>' +
    '<div class="group">' +
      '<div class="field"><input data-f="name" type="text" placeholder="레시피 이름" value="' + esc(r.name) + '" autocomplete="off"></div>' +
      beanRowHTML(r) +
    '</div>' +
    '<div class="sect">추출 파라미터</div>' +
    '<div class="card" id="secParams">' + paramsHTML(r) + '</div>' +
    '<div class="sect">푸어링 스텝 <span class="sub" id="stepSum">' + stepSummary(r) + '</span></div>' +
    '<div id="secSteps">' + stepsHTML(r) + '</div>' +
    '<div class="sect">평점 <span class="sub">(선택)</span></div>' +
    rateBoxHTML('맛 평가', r.rating) +
    '<div class="sect">메모 <span class="sub">(선택)</span></div>' +
    '<div class="group"><div class="field">' +
      '<textarea data-f="notes" placeholder="메모">' + esc(r.notes) + '</textarea></div></div>' +
    '<div class="sect">기타</div>' +
    '<div class="group"><div class="row"><span class="lbl">즐겨찾기</span><div style="flex:1"></div>' +
      '<div class="sw-toggle' + (r.favorite ? ' on' : '') + '" data-fav="1"></div></div></div>' +
    (isEdit ? '<div style="margin-top:18px"><button class="btn wide danger" type="button" data-del="1">' +
      ICON('trash', 18) + ' 이 레시피 삭제</button></div>' : '');
}

function methodSectionHTML(r){
  const cat = METHODS.find(function(m){ return m.id === r.category; }) || METHODS[0];
  const owned = DB.settings.drippers;
  return '<div class="sect">추출 방식</div>' +
    '<div class="chips">' + METHODS.map(function(m){
      return chip(m.id === r.category, m.label, 'data-cat="' + m.id + '"', null, true);
    }).join('') + '</div>' +
    '<div class="devgrid">' + cat.devices.map(function(d){
      return '<button class="dev' + (d.id === r.device ? ' on' : '') + '" type="button" data-dev="' + d.id + '">' +
        '<span class="ic">' + ICON(d.icon, 30) + (owned.indexOf(d.id) >= 0 ? '<i class="own"></i>' : '') + '</span>' +
        '<span>' + esc(d.label) + '</span></button>';
    }).join('') + '</div>';
}

function beanRowHTML(r){
  const b = beanById(r.beanId);
  return '<button class="row tap" type="button" data-bean-pick="1" style="width:100%">' +
    '<span class="lbl">원두</span>' +
    '<span class="val" style="' + (b ? '' : 'color:var(--text-3)') + '">' + esc(b ? b.name : '선택 안 함') + '</span>' +
    '<span class="chev">' + ICON('chevR', 17) + '</span></button>';
}

function paramsHTML(r){
  const dev = DEVICES[r.device] || DEVICES.v60;
  const g = grinderById(r.grinderId);
  const pct = clamp(r.grind / g.max * 100, 0, 100);
  const owned = ownedGrinders();
  const um = dialToMicron(g, r.grind);
  const others = owned.filter(function(x){ return x.id !== g.id; });

  let note;
  if (!owned.length){
    note = '<div class="note"><span>' + ICON('info', 17) + '</span><span>보유 그라인더가 없습니다. ' +
      '설정 탭에서 보유 그라인더를 추가하면 해당 그라인더의 분쇄도 참고값을 확인할 수 있어요.</span></div>';
  } else {
    const conv = others.length ? ' · ' + others.map(function(o){
      return esc(o.brand) + ' ' + fmtDial(o, micronToDial(o, um).v) + ' ' + esc(o.unit);
    }).join(' · ') : '';
    note = '<div class="note amber"><span>' + ICON('info', 17) + '</span><span>입자 크기 약 ' +
      Math.round(um) + ' μm' + (rotText(g, r.grind) ? ' · ' + rotText(g, r.grind) : '') + conv + '</span></div>';
  }

  return '<div class="params">' +
      paramBox('dose', '원두량', (Math.round(r.dose * 10) / 10).toFixed(1), 'g') +
      paramBox('water', dev.method === 'espresso' ? '추출량' : '물', fmtG(r.water), dev.method === 'espresso' ? 'ml' : 'ml') +
      paramBox('time', '추출 시간', r.time, '초') +
      paramBox('temp', '수온', r.temp, '℃') +
    '</div>' +
    '<div class="grindbox">' +
      '<div class="grindhead"><span class="t">분쇄도 ·</span>' +
        '<button class="g" type="button" data-grinder="1" style="color:var(--gold)">' + esc(g.name) + '</button>' +
        '<span class="v" id="grindVal">' + fmtDial(g, r.grind) + ' ' + esc(g.unit) + '</span></div>' +
      '<input class="slider" id="grindSlider" type="range" min="0" max="' + g.max + '" step="' + (g.dec === 0 ? 1 : 0.1) + '" ' +
        'value="' + clamp(r.grind, 0, g.max) + '" style="--track:linear-gradient(90deg,var(--gold) ' + pct + '%,#3A3A3E ' + pct + '%)">' +
      note +
    '</div>' +
    '<div class="note" style="margin-top:10px"><span style="color:var(--text-3)">' + ICON('water', 17) + '</span>' +
      '<span>비율 ' + (ratioText(r.dose, r.water) || '–') + '</span></div>';
}

function stepSummary(r){
  const total = r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0);
  return r.steps.length + '단계 · 총 ' + fmtG(total) + 'g';
}

function stepsHTML(r){
  let cum = 0;
  return r.steps.map(function(s, i){
    cum += num(s.g, 0);
    return '<div class="step' + (s.open ? ' open' : '') + '" data-si="' + i + '">' +
      '<div class="shead" data-toggle="' + i + '">' +
        '<span class="idx">' + (i + 1) + '</span>' +
        '<span class="time">' + mmss(s.t) + '</span>' +
        '<span class="dot">·</span>' +
        '<span class="amt">' + fmtG(s.g) + 'g</span>' +
        '<span class="cum">(' + fmtG(cum) + 'g)</span>' +
        (s.label ? '<span class="tag">' + esc(s.label) + '</span>' : '') +
        '<span class="exp">' + ICON('chevD', 19) + '</span>' +
      '</div>' +
      '<div class="sbody">' +
        '<div class="params">' +
          paramBox('st' + i, '시작 시간', s.t, '초') +
          paramBox('sg' + i, '물의 양', fmtG(s.g), 'g') +
        '</div>' +
        '<div class="srow"><input data-sl="' + i + '" type="text" placeholder="단계 이름 (예: 블루밍)" value="' + esc(s.label || '') + '"></div>' +
        '<div class="srow"><input data-sn="' + i + '" type="text" placeholder="메모 (예: 중앙부터 나선으로)" value="' + esc(s.note || '') + '">' +
          '<button class="del" type="button" data-sd="' + i + '" aria-label="단계 삭제">' + ICON('trash', 19) + '</button></div>' +
      '</div></div>';
  }).join('') +
  '<button class="addstep" type="button" data-sadd="1">' + ICON('plus', 18) + ' 스텝 추가</button>';
}

/* 파라미터 증감 폭 */
function stepOf(key, v){
  if (key === 'dose') return 0.5;
  if (key === 'water') return 5;
  if (key === 'time') return v >= 600 ? 60 : 5;
  if (key === 'temp') return 1;
  if (key.indexOf('st') === 0) return 5;
  if (key.indexOf('sg') === 0) return 5;
  return 1;
}
function limitOf(key){
  if (key === 'dose') return [0.5, 500];
  if (key === 'water') return [1, 5000];
  if (key === 'time') return [1, 86400];
  if (key === 'temp') return [1, 100];
  if (key.indexOf('st') === 0) return [0, 86400];
  return [0, 5000];
}

function bindRecipeForm(root, r, refresh, saveNow){
  const dev = DEVICES[r.device] || DEVICES.v60;

  /* 추출 방식 */
  $$('[data-cat]', root).forEach(function(b){
    b.onclick = function(){
      r.category = b.dataset.cat;
      const m = METHODS.find(function(x){ return x.id === r.category; });
      applyDevice(r, m.devices[0].id);
      refresh();
    };
  });
  $$('[data-dev]', root).forEach(function(b){
    b.onclick = function(){ applyDevice(r, b.dataset.dev); refresh(); };
  });

  /* 텍스트 */
  bindFields(root, r);

  /* 원두 */
  const bp = $('[data-bean-pick]', root);
  if (bp) bp.onclick = function(){
    openBeanPicker(r.beanId, function(id){ r.beanId = id; refresh(); });
  };

  /* 파라미터 */
  function repaintParams(){
    $('#secParams', root).innerHTML = paramsHTML(r);
    bindParamBlock();
  }
  function repaintSteps(){
    $('#secSteps', root).innerHTML = stepsHTML(r);
    $('#stepSum', root).textContent = stepSummary(r);
    bindSteps();
  }
  function setParam(key, v){
    const lim = limitOf(key);
    v = clamp(v, lim[0], lim[1]);
    if (key === 'dose'){ r.dose = Math.round(v * 10) / 10; r.touched = true; }
    else if (key === 'water'){
      const old = r.water;
      r.water = Math.round(v);
      r.touched = true;
      scaleSteps(r, old, r.water);
      repaintSteps();
    }
    else if (key === 'time'){ r.time = Math.round(v); r.touched = true; }
    else if (key === 'temp'){ r.temp = Math.round(v); r.touched = true; }
    else if (key.indexOf('st') === 0){ r.steps[Number(key.slice(2))].t = Math.round(v); }
    else if (key.indexOf('sg') === 0){
      r.steps[Number(key.slice(2))].g = Math.round(v * 10) / 10;
      r.water = Math.round(r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0));
    }
  }
  function bindParamBlock(){
    const box = $('#secParams', root);
    $$('[data-pm]', box).forEach(function(b){
      b.onclick = function(){
        const key = b.dataset.pm, dir = Number(b.dataset.dir);
        const cur = key === 'dose' ? r.dose : key === 'water' ? r.water : key === 'time' ? r.time : r.temp;
        setParam(key, cur + stepOf(key, cur) * dir);
        repaintParams();
      };
    });
    $$('[data-pi]', box).forEach(function(i){
      i.onchange = function(){
        setParam(i.dataset.pi, num(i.value, 0));
        repaintParams();
      };
      i.oninput = function(){ i.size = Math.max(1, i.value.length); i.className = paramFont(i.value); };
    });
    const gb = $('[data-grinder]', box);
    if (gb) gb.onclick = function(){
      openGrinderPicker(r.grinderId, function(id){
        const old = grinderById(r.grinderId), um = dialToMicron(old, r.grind);
        r.grinderId = id;
        const g = grinderById(id);
        r.grind = Math.round(micronToDial(g, um).v * 10) / 10;
        repaintParams();
      });
    };
    const sl = $('#grindSlider', box);
    if (sl){
      sl.oninput = function(){
        const g = grinderById(r.grinderId);
        r.grind = Math.round(num(sl.value, 0) * 10) / 10;
        const p = clamp(r.grind / g.max * 100, 0, 100);
        sl.style.setProperty('--track', 'linear-gradient(90deg,var(--gold) ' + p + '%,#3A3A3E ' + p + '%)');
        $('#grindVal', box).textContent = fmtDial(g, r.grind) + ' ' + g.unit;
      };
      sl.onchange = repaintParams;
    }
  }

  /* 푸어링 스텝 */
  function bindSteps(){
    const box = $('#secSteps', root);
    $$('[data-toggle]', box).forEach(function(h){
      h.onclick = function(e){
        if (e.target.closest('button') && e.target.closest('button') !== h) return;
        const i = Number(h.dataset.toggle);
        r.steps[i].open = !r.steps[i].open;
        h.parentNode.classList.toggle('open', r.steps[i].open);
      };
    });
    $$('[data-pm]', box).forEach(function(b){
      b.onclick = function(e){
        e.stopPropagation();
        const key = b.dataset.pm, dir = Number(b.dataset.dir);
        const i = Number(key.slice(2));
        const cur = key.indexOf('st') === 0 ? r.steps[i].t : r.steps[i].g;
        setParam(key, cur + stepOf(key, cur) * dir);
        repaintSteps(); repaintParams();
      };
    });
    $$('[data-pi]', box).forEach(function(inp){
      inp.onchange = function(){ setParam(inp.dataset.pi, num(inp.value, 0)); repaintSteps(); repaintParams(); };
      inp.oninput = function(){ inp.size = Math.max(1, inp.value.length); inp.className = paramFont(inp.value); };
      inp.onclick = function(e){ e.stopPropagation(); };
    });
    $$('[data-sl]', box).forEach(function(inp){
      inp.oninput = function(){ r.steps[Number(inp.dataset.sl)].label = inp.value; };
      inp.onclick = function(e){ e.stopPropagation(); };
    });
    $$('[data-sn]', box).forEach(function(inp){
      inp.oninput = function(){ r.steps[Number(inp.dataset.sn)].note = inp.value; };
      inp.onclick = function(e){ e.stopPropagation(); };
    });
    $$('[data-sd]', box).forEach(function(b){
      b.onclick = function(e){
        e.stopPropagation();
        r.steps.splice(Number(b.dataset.sd), 1);
        r.water = Math.round(r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0)) || r.water;
        repaintSteps(); repaintParams();
      };
    });
    const add = $('[data-sadd]', box);
    if (add) add.onclick = function(){
      const last = r.steps[r.steps.length - 1];
      r.steps.push({ t: last ? last.t + 30 : 0, g: last ? last.g : 50, label: '', note: '', open: true });
      r.water = Math.round(r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0));
      repaintSteps(); repaintParams();
    };
  }

  bindParamBlock();
  bindSteps();
  bindStars(root, '맛 평가', function(){ return r.rating; }, function(v){ r.rating = v; });

  const fav = $('[data-fav]', root);
  if (fav) fav.onclick = function(){ r.favorite = !r.favorite; fav.classList.toggle('on', r.favorite); };

  const del = $('[data-del]', root);
  if (del) del.onclick = function(){
    confirmSheet('레시피 삭제', '"' + (r.name || '이 레시피') + '" 을(를) 삭제합니다. 되돌릴 수 없어요.', '삭제', function(){
      DB.recipes = DB.recipes.filter(function(x){ return x.id !== r.id; });
      save(); closeAllSheets(); setTimeout(function(){ render(); toast('삭제했습니다'); }, 220);
    });
  };

  const sv = $('[data-save]', root);
  if (sv) sv.onclick = saveNow;
}

function applyDevice(r, devId){
  const d = DEVICES[devId];
  if (!d) return;
  r.device = devId;
  r.category = d.method;
  if (!r.touched){
    r.dose = d.def.dose; r.water = d.def.water; r.time = d.def.time; r.temp = d.def.temp;
    r.steps = defaultSteps(devId, d.def.dose, d.def.water);
  }
}
function scaleSteps(r, oldWater, newWater){
  const total = r.steps.reduce(function(s, x){ return s + num(x.g, 0); }, 0);
  if (!r.steps.length || !total || !oldWater) return;
  if (Math.abs(total - oldWater) > 0.6) return;   /* 이미 따로 조정한 경우엔 건드리지 않음 */
  const k = newWater / total;
  let acc = 0;
  r.steps.forEach(function(s, i){
    if (i === r.steps.length - 1) s.g = Math.round((newWater - acc) * 10) / 10;
    else { s.g = Math.max(5, Math.round(num(s.g, 0) * k / 5) * 5); acc += s.g; }
  });
}

/* ═══════════════════════════════════════════════════════
   원두 편집
   ═══════════════════════════════════════════════════════ */
function newBean(){
  return {
    id: uid(), createdAt: new Date().toISOString(),
    name: '', roastery: '',
    country: '', region: '', farm: '', variety: '', altitude: '',
    roastLevel: 'medium', process: 'washed', roastDate: '',
    flavors: [], noteColor: 'yellow',
    rating: null, notes: '', favorite: false, finished: false
  };
}

function openBeanEditor(id){
  const src = id ? DB.beans.find(function(x){ return x.id === id; }) : null;
  const b = src ? JSON.parse(JSON.stringify(src)) : newBean();
  if (!b.flavors) b.flavors = [];

  const api = openSheet({
    title: src ? '원두 편집' : '새 원두',
    left: '취소',
    right: src ? '저장' : '추가',
    body: function(){ return beanFormHTML(b, !!src); },
    foot: function(){
      return '<button class="btn wide solid" type="button" data-save="1">' +
        (src ? '저장' : ICON('plus', 20) + ' 원두 추가') + '</button>';
    },
    bind: function(root, close, refresh){ bindBeanForm(root, b, refresh, function(){ commit(close); }); },
    onRight: function(close){ commit(close); }
  });

  function commit(close){
    if (!b.name.trim()) b.name = '이름 없는 원두';
    if (src){
      const i = DB.beans.findIndex(function(x){ return x.id === b.id; });
      DB.beans[i] = b;
    } else {
      DB.beans.unshift(b);
    }
    save();
    close();
    setTimeout(function(){ render(); toast(src ? '수정했습니다' : '원두를 추가했습니다'); }, 60);
  }
}

function beanFormHTML(b, isEdit){
  const col = noteHex(b.noteColor);
  return '<div class="sect">기본 정보</div>' +
    '<div class="group">' + fieldHTML('name', '원두명', b.name) + fieldHTML('roastery', '로스터리', b.roastery) + '</div>' +

    '<div class="sect">원산지 <span class="sub">(선택)</span></div>' +
    '<div class="group">' +
      fieldHTML('country', '국가', b.country) +
      fieldHTML('region', '지역', b.region) +
      fieldHTML('farm', '농장', b.farm) +
      fieldHTML('variety', '품종', b.variety) +
      fieldHTML('altitude', '재배 고도', b.altitude) +
    '</div>' +

    '<div class="sect">로스팅 / 가공</div>' +
    '<div class="card">' +
      '<span class="cap" style="font-size:13px;color:var(--text-2);display:block;margin-bottom:8px">로스팅 레벨</span>' +
      '<div class="chips" style="margin-bottom:14px">' + ROASTS.map(function(r){
        return chip(b.roastLevel === r.id, r.label, 'data-rl="' + r.id + '"');
      }).join('') + '</div>' +
      '<span class="cap" style="font-size:13px;color:var(--text-2);display:block;margin-bottom:8px">가공 방식</span>' +
      '<div class="chips" style="margin-bottom:6px">' + PROCESSES.map(function(p){
        return chip(b.process === p.id, p.label, 'data-pr="' + p.id + '"');
      }).join('') + '</div>' +
    '</div>' +
    '<div class="group"><div class="row"><span class="lbl">로스팅 날짜</span>' +
      '<input class="val" data-f="roastDate" type="date" value="' + esc(b.roastDate) + '" style="text-align:right"></div></div>' +

    '<div class="sect">향미 노트</div>' +
    '<div class="group" id="secFlavor">' + flavorHTML(b) + '</div>' +

    '<div class="sect">노트 색상</div>' +
    '<div class="group"><div class="palette">' + NOTE_COLORS.map(function(c){
      return '<button class="sw' + (b.noteColor === c.id ? ' on' : '') + '" type="button" data-nc="' + c.id + '" ' +
        'style="background:' + c.hex + '" aria-label="' + c.id + '"></button>';
    }).join('') + '</div></div>' +
    '<div class="hint">향미 노트 칩과 목록의 색 표시에 쓰입니다. ' +
      '<span class="notechip" style="background:' + col + '22;color:' + col + '">미리보기</span></div>' +

    '<div class="sect">평점 <span class="sub">(선택)</span></div>' +
    rateBoxHTML('맛 평가', b.rating) +

    '<div class="sect">메모 <span class="sub">(선택)</span></div>' +
    '<div class="group"><div class="field"><textarea data-f="notes" placeholder="메모">' + esc(b.notes) + '</textarea></div></div>' +

    '<div class="sect">기타</div>' +
    '<div class="group">' +
      '<div class="row"><span class="lbl">즐겨찾기</span><div style="flex:1"></div>' +
        '<div class="sw-toggle' + (b.favorite ? ' on' : '') + '" data-fav="1"></div></div>' +
      '<div class="row"><span class="lbl">소진함</span><div style="flex:1"></div>' +
        '<div class="sw-toggle' + (b.finished ? ' on' : '') + '" data-fin="1"></div></div>' +
    '</div>' +
    (isEdit ? '<div style="margin-top:18px"><button class="btn wide danger" type="button" data-del="1">' +
      ICON('trash', 18) + ' 이 원두 삭제</button></div>' : '');
}

function flavorHTML(b){
  const col = noteHex(b.noteColor);
  const sug = FLAVOR_SUGGEST.filter(function(f){ return b.flavors.indexOf(f) < 0; }).slice(0, 14);
  return '<div class="inline-add">' +
      '<input id="flavIn" type="text" placeholder="향미를 입력하고 추가 (예: 블루베리)" autocomplete="off">' +
      '<button class="btn" type="button" data-fadd="1">추가</button>' +
    '</div>' +
    (b.flavors.length ? '<div class="tagwrap">' + b.flavors.map(function(f, i){
      return '<span class="tag" style="background:' + col + '26;color:' + col + '">' + esc(f) +
        '<button type="button" data-frm="' + i + '" aria-label="삭제">' + ICON('close', 13) + '</button></span>';
    }).join('') + '</div>' : '') +
    '<div class="tagwrap" style="padding-top:0">' + sug.map(function(f){
      return '<button class="tag" type="button" data-fsug="' + esc(f) + '" ' +
        'style="background:var(--surface-2);color:var(--text-2);font-weight:500">+ ' + esc(f) + '</button>';
    }).join('') + '</div>';
}

function bindBeanForm(root, b, refresh, saveNow){
  bindFields(root, b);
  $$('[data-rl]', root).forEach(function(x){ x.onclick = function(){ b.roastLevel = x.dataset.rl; refresh(); }; });
  $$('[data-pr]', root).forEach(function(x){ x.onclick = function(){ b.process = x.dataset.pr; refresh(); }; });
  $$('[data-nc]', root).forEach(function(x){ x.onclick = function(){ b.noteColor = x.dataset.nc; refresh(); }; });

  function repaintFlavor(){
    $('#secFlavor', root).innerHTML = flavorHTML(b);
    bindFlavor();
  }
  function addFlavor(v){
    v = (v || '').trim();
    if (!v) return;
    if (b.flavors.indexOf(v) < 0) b.flavors.push(v);
    repaintFlavor();
  }
  function bindFlavor(){
    const box = $('#secFlavor', root);
    const inp = $('#flavIn', box);
    const btn = $('[data-fadd]', box);
    if (btn) btn.onclick = function(){ addFlavor(inp.value); inp.value = ''; $('#flavIn', root).focus(); };
    if (inp) inp.onkeydown = function(e){
      if (e.key === 'Enter'){ e.preventDefault(); addFlavor(inp.value); inp.value = ''; $('#flavIn', root).focus(); }
    };
    $$('[data-frm]', box).forEach(function(x){
      x.onclick = function(){ b.flavors.splice(Number(x.dataset.frm), 1); repaintFlavor(); };
    });
    $$('[data-fsug]', box).forEach(function(x){
      x.onclick = function(){ addFlavor(x.dataset.fsug); };
    });
  }
  bindFlavor();

  bindStars(root, '맛 평가', function(){ return b.rating; }, function(v){ b.rating = v; });

  const fav = $('[data-fav]', root);
  if (fav) fav.onclick = function(){ b.favorite = !b.favorite; fav.classList.toggle('on', b.favorite); };
  const fin = $('[data-fin]', root);
  if (fin) fin.onclick = function(){ b.finished = !b.finished; fin.classList.toggle('on', b.finished); };

  const del = $('[data-del]', root);
  if (del) del.onclick = function(){
    confirmSheet('원두 삭제', '"' + (b.name || '이 원두') + '" 을(를) 삭제합니다. 되돌릴 수 없어요.', '삭제', function(){
      DB.beans = DB.beans.filter(function(x){ return x.id !== b.id; });
      DB.recipes.forEach(function(r){ if (r.beanId === b.id) r.beanId = null; });
      save(); closeAllSheets(); setTimeout(function(){ render(); toast('삭제했습니다'); }, 220);
    });
  };

  const sv = $('[data-save]', root);
  if (sv) sv.onclick = saveNow;
}
