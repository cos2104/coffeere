/* ===========================================================
   Coffeere — 시트(모달) 시스템 · 선택기
   =========================================================== */
'use strict';

const sheetStack = [];

function openSheet(opts){
  const root = document.createElement('div');
  root.className = 'sheet';
  const left = opts.left === null ? '<div style="min-width:74px"></div>'
    : '<button class="hbtn" type="button" data-sh-left>' + esc(opts.left || '취소') + '</button>';
  const right = opts.right
    ? '<button class="hbtn prim" type="button" data-sh-right>' + esc(opts.right) + '</button>'
    : (opts.rightIcon
        ? '<button class="hbtn prim icon" type="button" data-sh-right aria-label="더보기">' + ICON(opts.rightIcon, 20) + '</button>'
        : '<div style="min-width:74px"></div>');
  root.innerHTML =
    '<div class="sheet-head">' + left + '<div class="title">' + esc(opts.title || '') + '</div>' + right + '</div>' +
    '<div class="sheet-body"></div>' + (opts.foot ? '<div class="sheet-foot"></div>' : '');
  $('#sheets').appendChild(root);

  const api = { root: root, opts: opts, close: close, refresh: refresh, destroy: destroy };

  function refresh(){
    const sb = $('.sheet-body', root);
    const top = sb.scrollTop;
    sb.innerHTML = opts.body ? opts.body(api) : '';
    if (opts.foot) $('.sheet-foot', root).innerHTML = opts.foot(api);
    if (opts.bind) opts.bind(root, close, refresh);
    sb.scrollTop = top;
  }
  function destroy(){
    root.classList.remove('in');
    root.classList.add('out');
    setTimeout(function(){ if (root.parentNode) root.parentNode.removeChild(root); }, 320);
    const i = sheetStack.indexOf(api);
    if (i >= 0) sheetStack.splice(i, 1);
    if (typeof opts.onClose === 'function') opts.onClose();
  }
  function close(){
    if (sheetStack.indexOf(api) < 0) return;
    history.back();
  }

  const lb = $('[data-sh-left]', root);
  if (lb) lb.onclick = function(){ opts.onLeft ? opts.onLeft(close, api) : close(); };
  const rb = $('[data-sh-right]', root);
  if (rb) rb.onclick = function(){ if (opts.onRight) opts.onRight(close, api); };

  refresh();
  sheetStack.push(api);
  history.pushState({ sheet: sheetStack.length }, '');
  requestAnimationFrame(function(){ root.classList.add('in'); });
  return api;
}

window.addEventListener('popstate', function(){
  const top = sheetStack[sheetStack.length - 1];
  if (top) top.destroy();
});

function closeAllSheets(){
  const n = sheetStack.length;
  if (n) history.go(-n);
}

/* 단일 선택 목록 시트 */
function openOptionSheet(title, labels, current, onPick){
  const keys = Object.keys(labels);
  openSheet({
    title: title, left: '닫기',
    body: function(){
      return '<div class="group" style="margin-top:8px">' + keys.map(function(k){
        return '<button class="listbtn" type="button" data-opt="' + esc(k) + '">' +
          '<span class="nm">' + esc(labels[k]) + '</span>' +
          '<span class="check' + (current === k ? ' on' : '') + '">' + ICON('check', 14) + '</span></button>';
      }).join('') + '</div>';
    },
    bind: function(root, close){
      $$('[data-opt]', root).forEach(function(b){
        b.onclick = function(){ onPick(b.dataset.opt); close(); };
      });
    }
  });
}

/* 확인 시트 */
function confirmSheet(title, msg, okLabel, onOk){
  openSheet({
    title: title, left: '취소',
    body: function(){
      return '<div style="padding:26px 6px 10px;text-align:center">' +
        '<div style="color:var(--red);margin-bottom:14px">' + ICON('trash', 46, 'stroke-width="1.2"') + '</div>' +
        '<p style="color:var(--text-2);font-size:15.5px;line-height:1.6;margin:0">' + esc(msg) + '</p></div>';
    },
    foot: function(){ return '<button class="btn wide danger" type="button" data-ok="1">' + esc(okLabel) + '</button>'; },
    bind: function(root, close){
      $('[data-ok]', root).onclick = function(){ close(); setTimeout(onOk, 80); };
    }
  });
}

/* 그라인더 선택 */
function openGrinderPicker(current, onPick){
  const owned = ownedGrinders();
  openSheet({
    title: '그라인더', left: '닫기',
    body: function(){
      function sec(title, arr){
        if (!arr.length) return '';
        return '<div class="sect">' + title + '</div><div class="group">' + arr.map(function(g){
          return '<button class="listbtn" type="button" data-gp="' + g.id + '">' +
            '<span style="color:var(--gold)">' + ICON('grinder', 20) + '</span>' +
            '<span class="nm">' + esc(g.name) + '<small>' + esc(g.brand) + ' · ' + esc(g.unit) + '</small></span>' +
            '<span class="check' + (current === g.id ? ' on' : '') + '">' + ICON('check', 14) + '</span></button>';
        }).join('') + '</div>';
      }
      const rest = GRINDERS.filter(function(g){ return !owned.some(function(o){ return o.id === g.id; }); });
      return sec('보유 그라인더', owned) + sec(owned.length ? '그 외' : '전체 그라인더', rest) +
        (owned.length ? '' : '<div class="hint">설정 탭에서 보유 그라인더를 등록하면 여기 맨 위에 모아서 보여드려요.</div>');
    },
    bind: function(root, close){
      $$('[data-gp]', root).forEach(function(b){
        b.onclick = function(){ onPick(b.dataset.gp); close(); };
      });
    }
  });
}

/* 원두 선택 */
function openBeanPicker(current, onPick){
  let q = '';
  const api = openSheet({
    title: '원두 선택', left: '닫기',
    body: function(){
      const list = DB.beans.filter(function(b){
        return !q || (b.name + ' ' + (b.roastery || '')).toLowerCase().indexOf(q.toLowerCase()) >= 0;
      });
      return searchBox('bpq', '이름, 로스터리 검색', q) +
        '<div class="group"><button class="listbtn" type="button" data-bp="">' +
          '<span class="nm" style="color:var(--text-2)">원두 선택 안 함</span>' +
          '<span class="check' + (!current ? ' on' : '') + '">' + ICON('check', 14) + '</span></button>' +
        list.map(function(b){
          const r = ROASTS.find(function(x){ return x.id === b.roastLevel; }) || ROASTS[2];
          return '<button class="listbtn" type="button" data-bp="' + b.id + '">' +
            '<span class="dotcol" style="background:' + r.color + '"></span>' +
            '<span class="nm">' + esc(b.name) + '<small>' + esc(b.roastery || '') + (b.finished ? ' · 소진' : '') + '</small></span>' +
            '<span class="check' + (current === b.id ? ' on' : '') + '">' + ICON('check', 14) + '</span></button>';
        }).join('') + '</div>' +
        (DB.beans.length ? '' : '<div class="hint">아직 등록한 원두가 없습니다. 원두 탭에서 먼저 추가해 보세요.</div>');
    },
    bind: function(root, close){
      $$('[data-bp]', root).forEach(function(b){
        b.onclick = function(){ onPick(b.dataset.bp || null); close(); };
      });
      const inp = $('#bpq', root);
      if (inp) inp.addEventListener('input', function(){
        q = inp.value;
        api.refresh();
        const n = $('#bpq', root);
        if (n){ n.focus(); n.setSelectionRange(n.value.length, n.value.length); }
      });
      const c = $('[data-clear="bpq"]', root);
      if (c) c.onclick = function(){ q = ''; api.refresh(); };
    }
  });
}

/* 액션 시트 */
function openActions(title, actions){
  openSheet({
    title: title, left: '닫기',
    body: function(){
      return '<div class="group" style="margin-top:8px">' + actions.map(function(a, i){
        return '<button class="listbtn" type="button" data-ac="' + i + '">' +
          '<span style="color:' + (a.danger ? 'var(--red)' : 'var(--gold)') + '">' + ICON(a.icon || 'dots', 20) + '</span>' +
          '<span class="nm"' + (a.danger ? ' style="color:var(--red)"' : '') + '>' + esc(a.label) + '</span></button>';
      }).join('') + '</div>';
    },
    bind: function(root, close){
      $$('[data-ac]', root).forEach(function(b){
        b.onclick = function(){ close(); setTimeout(function(){ actions[Number(b.dataset.ac)].run(); }, 90); };
      });
    }
  });
}

/* 텍스트 한 줄 입력 시트 */
function promptSheet(title, placeholder, value, onOk){
  const api = openSheet({
    title: title, left: '취소', right: '완료',
    body: function(){
      return '<div class="group" style="margin-top:10px"><div class="field">' +
        '<input id="pmt" type="text" placeholder="' + esc(placeholder) + '" value="' + esc(value || '') + '" autocomplete="off"></div></div>';
    },
    bind: function(root){ setTimeout(function(){ const i = $('#pmt', root); if (i) i.focus(); }, 320); },
    onRight: function(close){
      const v = $('#pmt', api.root).value.trim();
      close(); setTimeout(function(){ onOk(v); }, 60);
    }
  });
}
