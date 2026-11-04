/* ===========================================================
   Coffeere — 유명 레시피 상세 화면
   =========================================================== */
'use strict';

function openLibDetail(id){
  const r = libById(id);
  if (!r) return;
  let dose = r.dose;
  let gid = primaryGrinder().id;

  const api = openSheet({
    title: '', left: '닫기',
    body: function(){ return libDetailHTML(r, dose, gid); },
    foot: function(){
      return '<button class="btn wide solid" type="button" data-take="1">' +
        ICON('down', 19) + ' 내 레시피로 담기</button>';
    },
    bind: function(root){ bindLibDetail(root); }
  });

  function repaint(){
    $('.sheet-body', api.root).innerHTML = libDetailHTML(r, dose, gid);
    bindLibDetail(api.root);
  }

  function bindLibDetail(root){
    $$('[data-ld]', root).forEach(function(b){
      b.onclick = function(){
        const step = r.dose >= 30 ? 5 : 1;
        dose = Math.round(clamp(dose + step * Number(b.dataset.ld), 5, 200) * 10) / 10;
        repaint();
      };
    });
    const gp = $('[data-lgrinder]', root);
    if (gp) gp.onclick = function(){
      openGrinderPicker(gid, function(v){ gid = v; repaint(); });
    };
    const reset = $('[data-lreset]', root);
    if (reset) reset.onclick = function(){ dose = r.dose; repaint(); };

    /* 담기 버튼은 sheet-foot 에 있어 root 안에서 찾습니다 (api 는 아직 초기화 전) */
    const take = $('[data-take]', root);
    if (take) take.onclick = function(){
      const rec = libToRecipe(r, dose, gid);
      DB.recipes.unshift(rec);
      save();
      api.close();
      setTimeout(function(){
        UI.rMode = 'mine';
        render();
        toast('내 레시피로 담았습니다');
      }, 90);
    };
  }
}

function libDetailHTML(r, dose, gid){
  const e = libExpand(r, dose);
  const d = DEVICES[e.device] || DEVICES.v60;
  const g = grinderById(gid);
  const dial = micronToDial(g, r.um);
  const fit = ROASTS.find(function(x){ return x.id === r.fit; }) || ROASTS[2];
  const owned = ownedGrinders().filter(function(x){ return x.id !== g.id; });
  const scaled = Math.abs(dose - r.dose) > 0.05;
  const ratio = (Math.round(r.ratio * 10) / 10).toFixed(1).replace(/\.0$/, '');
  let cum = 0;

  return '<div class="detail-hero">' +
      '<div class="tile">' + ICON(d.icon, 38) + '</div>' +
      '<h2>' + esc(r.name) + '</h2>' +
      '<p>' + esc(r.by || '') + (r.role ? ' · ' + esc(r.role) : '') + '</p>' +
      '<div style="display:flex;gap:9px;justify-content:center;margin-top:13px;flex-wrap:wrap">' +
        '<span class="chip">' + esc(d.label) + (r.waveSize ? ' ' + esc(String(r.waveSize)) : '') + '</span>' +
        '<span class="chip" style="color:' + fit.color + '">' + fit.label + ' 기준</span>' +
        '<span class="chip">비율 1:' + ratio + '</span>' +
      '</div>' +
    '</div>' +

    (r.blurb ? '<div class="card" style="color:var(--text-2);font-size:15px;line-height:1.62">' +
      esc(r.blurb) + '</div>' : '') +

    '<div class="sect">내 기준으로 환산 <span class="sub">원두량을 바꾸면 전부 따라옵니다</span></div>' +
    '<div class="card">' +
      '<div class="params" style="grid-template-columns:1fr">' +
        '<div class="param"><span class="cap">원두량</span><div class="ctl">' +
          '<button class="stepbtn" type="button" data-ld="-1">' + ICON('minus', 17) + '</button>' +
          '<div class="num"><input value="' + fmtG(dose) + '" readonly tabindex="-1" ' +
            'size="' + String(fmtG(dose)).length + '"><span class="u">g</span></div>' +
          '<button class="stepbtn" type="button" data-ld="1">' + ICON('plus', 17) + '</button>' +
        '</div></div>' +
      '</div>' +
      '<div class="kpis" style="margin:12px 0 0">' +
        '<div class="kpi"><div class="n">' + fmtG(e.water) + '<small>g</small></div><div class="c">물</div></div>' +
        '<div class="kpi"><div class="n">' + mmss(e.time) + '</div><div class="c">시간</div></div>' +
        '<div class="kpi"><div class="n" style="font-size:14.5px">' + esc(r.temp || '') + '</div><div class="c">수온</div></div>' +
        '<div class="kpi"><div class="n">' + fmtDial(g, dial.v) + '</div><div class="c">' + esc(g.unit) + '</div></div>' +
      '</div>' +
      '<div class="grindhead" style="margin-top:15px"><span class="t">분쇄도 ·</span>' +
        '<button class="g" type="button" data-lgrinder="1" style="color:var(--gold)">' + esc(g.name) + '</button>' +
        '<span class="v" style="color:var(--gold)">' + fmtDial(g, dial.v) + ' ' + esc(g.unit) + '</span></div>' +
      '<div class="note amber"><span>' + ICON('info', 17) + '</span><span>원 레시피 기준 ' + r.um + ' μm' +
        (r.tol ? ' ±' + r.tol : '') +
        (rotText(g, dial.v) ? ' · ' + rotText(g, dial.v) : '') +
        (dial.flag ? ' · 이 그라인더의 조절 범위 밖입니다' : '') +
        (owned.length ? '<br>' + owned.map(function(o){
          return esc(o.name) + ' ' + fmtDial(o, micronToDial(o, r.um).v) + ' ' + o.unit;
        }).join(' · ') : '') + '</span></div>' +
      (scaled ? '<div style="margin-top:12px"><button class="btn wide ghost" type="button" data-lreset="1">' +
        '원 레시피 ' + fmtG(r.dose) + 'g 로 되돌리기</button></div>' : '') +
    '</div>' +

    '<div class="sect">푸어링 <span class="sub">' + e.steps.length + '단계 · 총 ' + fmtG(e.water) + 'g</span></div>' +
    '<div class="card"><div class="tl">' + e.steps.map(function(s){
      cum += s.g;
      return '<div class="ti act"><span class="d"></span>' +
        '<span class="tt">' + mmss(s.t) + '</span>' +
        '<span class="gg">' + (s.g > 0 ? fmtG(s.g) + 'g' : '–') + '</span>' +
        '<span class="nn">' + esc(s.label || '') + (s.note ? ' · ' + esc(s.note) : '') +
        (s.g > 0 ? '<small>누적 ' + fmtG(cum) + 'g</small>' : '') +
        '</span></div>';
    }).join('') + '</div></div>' +

    (r.tips && r.tips.length
      ? '<div class="sect">팁</div><div class="card tips">' +
        r.tips.map(function(t){ return '<p>' + t + '</p>'; }).join('') + '</div>'
      : '') +

    (r.source
      ? '<div class="sect">출처</div><div class="card" style="color:var(--text-3);font-size:13.5px;line-height:1.6">' +
        esc(r.source) +
        (r.sourceUrl ? '<br><a href="' + esc(r.sourceUrl) + '" target="_blank" rel="noopener noreferrer">원문 보기</a>' : '') +
        '</div>'
      : '') +

    '<div class="hint">수치는 공개 자료를 정리한 것입니다. 표시값은 출발점으로 쓰고 맛으로 마무리하세요.</div>';
}
