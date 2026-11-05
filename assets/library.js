/* ===========================================================
   Coffeere — 유명 레시피 라이브러리
   brew-dial(v2)에서 정리해 둔 38종을 그대로 이어받았습니다.
   steps 는 { dose, water, ice } 를 받아 누적 목표량(to)을 돌려줍니다.
   =========================================================== */
const LIBRARY = [
  {
    id:"hario-switch-dark", name:"스위치 강배전 침지", by:"하리오 스위치 가이드", role:"강배전 전용 · 2차 정리본",
    dripper:"switch", method:"immersion", fit:"dark", dose:15, ratio:250/15, temp:"85℃",
    um:1050, tol:100, total:150,
    blurb:"강배전은 성분이 빨리 녹아 나온다. 온도를 85℃로 낮추고 굵게 갈아, 스위치를 닫은 채 물을 다 붓고 담가 둔 뒤 1:35 전후에 열어 흘려보내는 완전 침지 방식.",
    steps: c => [
      { at:0,   kind:"pour", label:"스위치 닫고 전량 붓기", to:c.water, pat:"circle" },
      { at:95,  kind:"wait", label:"스위치 열기 — 배출 시작" },
      { at:150, kind:"end",  label:"추출 완료 (약 2:30)" }],
    tips:[
      "<b>강배전은 잘 녹습니다</b> — 라이트용 93–96℃를 그대로 쓰면 탄맛과 떫은맛이 먼저 나옵니다. 85℃에서 시작하세요.",
      "<b>쓰면 온도보다 시간을 먼저 줄이세요</b> — 1:35보다 일찍 여는 쪽이, 온도를 더 떨어뜨리는 것보다 낫습니다. 온도를 과하게 낮추면 단맛까지 빠집니다.",
      "분쇄도 <b>1,050μm</b>은 원 가이드의 '라이트보다 눈에 띄게 굵게'를 이 앱의 환산 기준으로 옮긴 값입니다. 미크론 수치가 명시된 레시피가 아니니, 내 그라인더에서 한두 클릭 조절해 쓰세요.",
      "완전 침지라 붓는 기술이 거의 필요 없습니다. 강배전을 처음 내려본다면 V60보다 이쪽이 실패가 적습니다.",
      "2차 크랙까지 간 아주 진한 배전이면 80℃까지 내려도 됩니다. 그 아래로는 잘 안 쓰입니다."],
    source:"하리오 스위치 강배전 가이드 · 15g / 250g / 85℃ · 2차 정리본 (분쇄도는 '굵게'를 미크론으로 환산한 값)",
    sourceUrl:"https://gota.cafe/en/recipes/hario-switch-02/switch-dark-roast"
  },
  {
    id:"jaafar-wbrc2026", name:"UFO V3 · 2단 스위치", by:"나스 자파르", role:"2026 월드 브루어스컵 챔피언",
    dripper:"switch", method:"hybrid", fit:"light", dose:15, ratio:200/15, temp:"92℃",
    um:700, tol:50, total:130,
    blurb:"UFO V3 드리퍼를 하리오 스위치 위에 올려 쓴다. 앞 100g은 스위치를 열어 투과로 받고, 닫아서 뒤 100g을 침지로 뽑은 뒤 마지막에 다시 열어 흘려보내는 2단 구조.",
    steps: c => { const h = c.water / 2; return [
      { at:0,   kind:"pour", label:"1차 붓기 · 스위치 열림 (투과)", to:h, pat:"circle" },
      { at:58,  kind:"wait", label:"스위치 닫기 — 물 빠짐 정지" },
      { at:60,  kind:"pour", label:"2차 붓기 · 침지", to:c.water, pat:"center" },
      { at:120, kind:"wait", label:"스위치 열기 — 최종 투과" },
      { at:130, kind:"end",  label:"추출 완료" }]; },
    tips:[
      "<b>앞 절반은 투과, 뒤 절반은 침지</b> — 스위치를 연 채 100g을 원을 그리며 부어 향을 끌어내고, 닫은 뒤 남은 100g으로 단맛과 바디를 채웁니다.",
      "<b>타이밍이 전부입니다</b> — 0:58 닫기 · 1:00 2차 붓기 · 2:00 열기. 총 2:10 전후에 끝납니다.",
      "비율이 <b>1:13.3</b>으로 진한 편입니다. 대회에서는 파나마 핀카 누고 게이샤(내추럴 무산소, 1,700m)를 썼습니다.",
      "분쇄도는 약 700μm에 <b>저속(≈580rpm)</b>으로 갈았고, 물은 50ppm에 마그네슘·칼슘을 맞춘 것으로 정리돼 있습니다.",
      "UFO V3가 없으면 스위치만으로도 같은 순서를 따라갈 수 있습니다. 다만 드리퍼 모양이 달라 물 빠지는 속도가 바뀌니, 2:10에 맞지 않으면 분쇄도로 조절하세요."],
    source:"2026 월드 브루어스컵(브뤼셀) 우승 레시피 · 15g / 200g / 92℃ · 커뮤니티 정리본 다수 교차 확인 (공식 발표 자료 아님)",
    sourceUrl:"https://gota.cafe/en/recipes/ufo/ufo-jaafar-wbrc"
  },
  {
    id:"kasuya46", name:"4:6 메소드", by:"테츠 카스야", role:"2016 월드 브루어스컵 챔피언",
    dripper:"v60", method:"pourover", fit:"light", dose:20, ratio:15, temp:"93℃",
    um:1100, tol:80, total:210,
    blurb:"물을 5번에 나눠 붓되 앞 40%로 맛의 방향을, 뒤 60%로 농도를 잡는다. 굵게 갈아 물줄기로 조율하는 방식.",
    steps: c => { const u = c.water/5; return [
      { at:0,   kind:"bloom", label:"1차 붓기 · 뜸", to:u,   pat:"spiral" },
      { at:45,  kind:"pour",  label:"2차 붓기", to:u*2, pat:"back" },
      { at:90,  kind:"pour",  label:"3차 붓기", to:u*3, pat:"back" },
      { at:130, kind:"pour",  label:"4차 붓기", to:u*4, pat:"back" },
      { at:160, kind:"pour",  label:"5차 붓기", to:u*5, pat:"back" },
      { at:210, kind:"end",   label:"추출 완료 · 드리퍼 분리" }]; },
    tips:[
      "<b>앞 2회(40%)가 맛의 방향</b> — 1차를 적게 부으면 산미가, 많이 부으면 단맛이 올라옵니다.",
      "<b>뒤 3회(60%)가 농도</b> — 나누는 횟수를 늘리면 진해지고, 2회로 줄이면 가벼워집니다.",
      "프렌치프레스에 가까울 만큼 굵게 가는 것이 전제입니다. 가늘게 갈면 과추출로 무너집니다.",
      "각 단계는 드리퍼 물이 거의 빠진 뒤 시작합니다.",
      "붓는 움직임은 <b>중심에서 바깥으로 나갔다가 다시 중심으로</b> 돌아오는 왕복 나선입니다. 필터 벽은 때리지 않습니다.",
      "다만 카스야 본인은 <b>“붓는 기술이랄 게 없다”</b>고 말합니다 — 굵게 갈고 시간과 물량만 지키면 된다는 것이 4:6의 장점이라는 것. 움직임보다 <b>다음 붓기 타이밍</b>이 훨씬 중요합니다.",
      "물 온도는 배전도에 따라 바꿉니다 — <b>약배전 93℃ · 중배전 88℃ · 강배전 83℃</b>. 위 온도 표시는 선택한 배전도에 맞춰 바뀝니다."],
    source:"원 레시피 20g / 300g · 공개 강연·영상 자료 정리"
  },
  {
    id:"onyx-osmotic", name:"오스모틱 플로우", by:"오닉스 커피랩", role:"Onyx Coffee Lab · 미국",
    dripper:"v60", method:"pourover", fit:"light", dose:15, ratio:16.7, temp:"94℃", um:720, tol:60, total:150,
    gap:16, dropCm:"2–3cm",
    blurb:"주전자를 커피층 바로 위까지 낮추고, 물이 빠지는 속도와 같은 속도로 붓는다. 베드를 거의 흔들지 않는 미국식 저(低)저어주기 방식.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×3.3", to:c.dose*3.3, dur:10, pat:"bloom", stream:"보통" },
      { at:45,  kind:"pour",  label:"절반까지 · 중앙에 천천히", to:c.water*0.5, dur:35, pat:"smallCir", stream:"가늘게", height:"낮게" },
      { at:85,  kind:"pour",  label:"전량까지 · 중간 크기 원", to:c.water, dur:35, pat:"spiral", stream:"가늘게", height:"낮게" },
      { at:150, kind:"end",   label:"추출 완료 (2:30 목표)" }],
    tips:[
      "<b>주전자 끝을 커피층 가까이</b> 내려 붓습니다. 높이를 없애 베드가 흔들리지 않게 하는 것이 이 방식의 전부입니다.",
      "붓는 속도를 <b>물이 빠지는 속도와 같게</b> 맞춥니다. 수위가 오르지도 내리지도 않는 상태를 유지하세요.",
      "저어주기가 거의 없으므로 분쇄는 <b>보통보다 살짝 가늘게</b> 갑니다.",
      "오닉스의 일반 푸어오버는 1:15–1:16 · 18–20g · 뜸 45초 · 총 2:45–3:15입니다. 이 레시피는 그 변형입니다."],
    source:"Onyx Coffee Lab 오스모틱 플로우 · 15g / 250g / 2:30 · 공개 브루 가이드"
  },
  {
    id:"hoffmann-v60", name:"얼티밋 V60", by:"제임스 호프만", role:"2007 월드 바리스타 챔피언",
    dripper:"v60", method:"pourover", fit:"light", dose:30, ratio:16.7, temp:"95–100℃", um:750, tol:60, total:210,
    blurb:"뜸을 넉넉히 주고 스월로 베드를 정리한 뒤, 두 번 부어 끝낸다. 재현성이 높은 표준형.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×2", to:c.dose*2, pat:"spiral" },
      { at:10,  kind:"act",   label:"드리퍼를 흔들어 스월 (가루 전부 적시기)" },
      { at:45,  kind:"pour",  label:"전체의 60%까지 붓기", to:c.water*0.6, dur:30, pat:"wide" },
      { at:75,  kind:"pour",  label:"100%까지 붓기", to:c.water, dur:30, pat:"smallCir" },
      { at:105, kind:"act",   label:"가볍게 스월해 베드 평탄화" },
      { at:210, kind:"end",   label:"추출 완료 (3:30 목표)" }],
    tips:[
      "물은 <b>끓기 직전까지 뜨겁게</b> — 약배전일수록 온도를 낮추지 않습니다.",
      "뜸 직후 스월은 필수. 마른 가루가 남으면 추출이 어긋납니다.",
      "총 추출이 3:30을 크게 넘으면 한 단계 굵게, 2:45 이하로 빠지면 가늘게 조정하세요.",
      "마지막 스월은 <b>가볍게</b> — 과하면 미분이 벽에 붙어 배출이 느려집니다."],
    source:"원 레시피 30g / 500g · 공개 영상 자료 정리"
  },
  {
    id:"rao-v60", name:"라오 스핀", by:"스콧 라오", role:"커피 컨설턴트 · 저술가",
    dripper:"v60", method:"pourover", fit:"mlight", dose:22, ratio:17, temp:"96℃", um:700, tol:50, total:200,
    blurb:"뜸에서 스푼으로 완전히 적시고, 한 번에 이어서 부어 끝낸 뒤 드리퍼를 돌려 베드를 평평하게 만든다.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×3", to:c.dose*3, pat:"spiral" },
      { at:12,  kind:"act",   label:"스푼으로 저어 전체 적시기" },
      { at:45,  kind:"pour",  label:"끊김 없이 이어서 붓기", to:c.water, dur:45, pat:"spiral" },
      { at:95,  kind:"act",   label:"드리퍼 회전 — 라오 스핀" },
      { at:200, kind:"end",   label:"추출 완료 (3:00–3:30)" }],
    tips:[
      "핵심은 <b>균일한 추출</b> — 뜸에서 마른 가루를 남기지 않는 것이 절반입니다.",
      "붓기는 끊지 말고 일정한 유량으로. 벽면을 직접 때리지 않습니다.",
      "마지막 스핀으로 벽에 붙은 가루를 내려 베드를 수평으로 만듭니다.",
      "베드가 기울거나 한쪽만 파였다면 스핀 타이밍·유량을 먼저 의심하세요."],
    source:"원 레시피 22g / 375g · 공개 자료 정리"
  },
  {
    id:"hedrick", name:"하이 익스트랙션", by:"랜스 헤드릭", role:"바리스타 · 브루잉 에듀케이터",
    dripper:"v60", method:"pourover", fit:"light", dose:15, ratio:16.7, temp:"100℃", um:600, tol:50, total:225,
    blurb:"아주 가늘게 갈고 저어주기를 최대로 밀어붙여 수율을 끌어올린다. 약배전 스페셜티에 특히 잘 맞는다.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×3", to:c.dose*3, pat:"spiral" },
      { at:10,  kind:"act",   label:"스푼으로 위·아래 충분히 저어주기" },
      { at:45,  kind:"pour",  label:"전체의 60%까지 붓기", to:c.water*0.6, dur:20, pat:"wide" },
      { at:75,  kind:"pour",  label:"100%까지 붓기", to:c.water, dur:20, pat:"smallCir" },
      { at:100, kind:"act",   label:"스핀으로 베드 평탄화" },
      { at:225, kind:"end",   label:"추출 완료 (3:30–4:00)" }],
    tips:[
      "<b>가늘게 + 강하게 저어주기</b>가 전제입니다. 굵게 갈면 이 레시피는 밍밍해집니다.",
      "미분이 많아 배출이 느려지므로 4분을 넘겨도 당황할 필요 없습니다.",
      "떫거나 마르는 느낌이 나면 저어주기를 줄이지 말고 <b>물 온도를 먼저</b> 낮춰보세요.",
      "필터는 미리 충분히 린싱하고 드리퍼·서버를 예열합니다."],
    source:"원 레시피 15g / 250g · 공개 영상 자료 정리"
  },
  {
    id:"winton8", name:"8회 붓기", by:"맷 윈튼", role:"2021 월드 브루어스컵 챔피언",
    dripper:"v60", method:"pourover", fit:"mlight", dose:20, ratio:16, temp:"92℃", um:800, tol:60, total:270,
    blurb:"같은 양을 30초마다 여덟 번. 베드 수위를 낮게 유지해 균일하고 투명한 잔을 만든다.",
    steps: c => { const u = c.water/8, out = [];
      for (let i = 0; i < 8; i++) out.push({ at:i*30, kind:i?"pour":"bloom",
        label:i ? (i+1)+"차 붓기" : "1차 붓기 · 뜸", to:u*(i+1), pat:i?"smallCir":"spiral", height:"낮게" });
      out.push({ at:270, kind:"end", label:"추출 완료 (4:30 목표)" }); return out; },
    tips:[
      "매 붓기는 <b>정확히 30초 간격</b>으로. 물이 다 빠지기 전에 다음 붓기가 시작됩니다.",
      "물높이를 낮게 유지하면 채널링이 줄고 클린컵이 살아납니다.",
      "총 시간이 길어 온도 손실이 큽니다. 드리퍼·서버 예열을 반드시 하세요.",
      "붓는 횟수를 6회로 줄이면 바디가, 10회로 늘리면 투명도가 올라갑니다."],
    source:"공개된 8회 붓기 버전 기준 · 20g / 320g"
  },
  {
    id:"kasuya-ice", name:"아이스 4:6", by:"테츠 카스야", role:"2016 월드 브루어스컵 챔피언",
    dripper:"v60", method:"pourover", fit:"light", dose:20, ratio:9, iceMul:6, temp:"93℃", um:1050, tol:80, total:165,
    blurb:"서버에 얼음을 먼저 깔고 물의 60%만 뜨겁게 붓는다. 급랭으로 향이 날아가지 않게 잡아두는 방식.",
    steps: c => { const u = c.water/5; return [
      { at:0,   kind:"act",   label:"서버에 얼음 " + Math.round(c.ice) + "g 먼저 담기" },
      { at:0,   kind:"bloom", label:"1차 붓기 · 뜸", to:u,   pat:"spiral" },
      { at:40,  kind:"pour",  label:"2차 붓기", to:u*2, pat:"back" },
      { at:75,  kind:"pour",  label:"3차 붓기", to:u*3, pat:"back" },
      { at:105, kind:"pour",  label:"4차 붓기", to:u*4, pat:"back" },
      { at:130, kind:"pour",  label:"5차 붓기", to:u*5, pat:"back" },
      { at:165, kind:"end",   label:"추출 완료 · 얼음이 남았으면 저어 녹이기" }]; },
    tips:[
      "얼음이 <b>총 물량의 40%</b>를 대신합니다. 뜨거운 물은 60%만 붓습니다.",
      "핫보다 한두 클릭 가늘게 가는 편이 농도가 맞습니다 — 얼음이 녹으며 희석되기 때문입니다.",
      "추출이 끝났는데 얼음이 다 녹았다면 얼음을 늘리거나 서버를 미리 칠링하세요.",
      "산미가 살아나는 방식이라 워시드 약배전과 특히 잘 맞습니다."],
    source:"4:6 메소드의 아이스 변형 · 20g / 온수 180g + 얼음 120g"
  },
  {
    id:"hoffmann-ice", name:"아이스 V60", by:"제임스 호프만", role:"2007 월드 바리스타 챔피언",
    dripper:"v60", method:"pourover", fit:"light", dose:30, ratio:10, iceMul:6.7, temp:"95–100℃", um:700, tol:60, total:150,
    blurb:"얼음을 물의 일부로 계산해 넣는다. 뜨겁게 뽑아 곧바로 식히니 향은 남고 잡미는 줄어든다.",
    steps: c => [
      { at:0,   kind:"act",   label:"서버에 얼음 " + Math.round(c.ice) + "g 계량해 담기" },
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×2", to:c.dose*2, pat:"spiral" },
      { at:10,  kind:"act",   label:"스월로 전체 적시기" },
      { at:45,  kind:"pour",  label:"전체의 60%까지 붓기", to:c.water*0.6, dur:25, pat:"wide" },
      { at:75,  kind:"pour",  label:"100%까지 붓기", to:c.water, dur:25, pat:"smallCir" },
      { at:150, kind:"end",   label:"배출 완료 · 얼음 저어 녹이기" }],
    tips:[
      "얼음은 <b>반드시 저울로 계량</b>합니다. 눈대중으로 넣으면 농도가 매번 달라집니다.",
      "추출액이 뜨거운 채로 얼음에 떨어져야 급랭 효과가 납니다. 서버를 미리 얼리지는 마세요.",
      "핫 레시피와 분쇄도는 같게 두고, 물량만 60%로 줄이는 것이 기본입니다.",
      "다 녹지 않은 얼음은 그대로 잔에 옮겨 담아도 좋습니다."],
    source:"원 레시피 30g / 온수 300g + 얼음 200g · 공개 영상 자료 정리"
  },
  {
    id:"tcs-dark", name:"深煎り V60", by:"THE COFFEESHOP", role:"일본 · 강배전 전용 레시피",
    dripper:"v60", method:"pourover", fit:"dark", dose:20, ratio:15, temp:"86℃", um:700, tol:60, total:160,
    blurb:"강배전에 맞춘 86℃ 저온 추출. 흥미롭게도 약배전보다 오히려 살짝 가늘게 갈아, 원뿔 드리퍼의 추출 편차를 맛의 입체감으로 쓴다.",
    steps: c => [
      { at:0,   kind:"bloom", label:"1차 붓기 · 10초에 걸쳐", to:c.water*0.2, dur:10, pat:"bloom" },
      { at:40,  kind:"pour",  label:"2차 붓기 · 15초에 걸쳐", to:c.water*(140/300), dur:15, pat:"spiral" },
      { at:65,  kind:"pour",  label:"3차 붓기 · 15초에 걸쳐", to:c.water*(230/300), dur:15, pat:"spiral" },
      { at:90,  kind:"pour",  label:"4차 붓기 · 10초에 걸쳐", to:c.water, dur:10, pat:"smallCir" },
      { at:160, kind:"end",   label:"추출 완료 (약 2:40)" }],
    tips:[
      "강배전은 물이 뜨거우면 잡미와 아린맛이 먼저 나옵니다. <b>86℃로 낮추는 것</b>이 이 레시피의 핵심입니다.",
      "<b>약배전보다 오히려 살짝 가늘게</b> 갑니다 — 원뿔 드리퍼의 추출 편차를 일부러 살려 맛에 입체감을 주는 방식으로, 「강배전은 굵게」라는 통념과 반대입니다. 그대로 한번 따라해 보세요.",
      "로스팅한 지 얼마 안 된 원두는 가스가 많으니 1차 붓기 뒤 대기를 5–10초 늘립니다.",
      "총 2분 40초로 짧게 끝냅니다. 길어지면 강배전 특유의 탄맛이 올라옵니다."],
    source:"THE COFFEESHOP 深煎り V60 레시피 · 20g / 300ml / 86℃ / 2:40"
  },
  {
    id:"sarutahiko-dark", name:"深煎り 4단 붓기", by:"사루타히코 커피", role:"일본 · 중강~강배전",
    dripper:"v60", method:"handdrip", fit:"mdark", dose:17, ratio:11.8, temp:"85℃", um:800, tol:70, total:200,
    blurb:"뜸 → 점적 → 가는 선 → 굵은 선. 한 잔 안에서 붓는 기법을 네 번 바꿔가며 강배전의 쓴맛을 깨끗하게 뽑아낸다.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원을 그리며 4바퀴", to:c.water*0.15, dur:12, pat:"bloom", stream:"가늘게" },
      { at:30,  kind:"pour",  label:"점적 · 5g씩 5–6회 중심에", to:c.water*0.3, dur:55, pat:"drop" },
      { at:90,  kind:"pour",  label:"가는 선 · 가루가 부풀 정도로", to:c.water*0.62, dur:50, pat:"coin", stream:"가늘게" },
      { at:150, kind:"pour",  label:"굵은 선 · 수위가 조금 오를 정도", to:c.water, dur:45, pat:"spiral", stream:"굵게" },
      { at:200, kind:"end",   label:"추출 완료 (3:20)" }],
    tips:[
      "한 잔 안에서 붓는 기법이 <b>네 번</b> 바뀝니다 — 원 → 점적 → 가는 선 → 굵은 선. 단계를 눌러 모양을 확인해 보세요.",
      "점적 구간이 농도를 만듭니다. 5g씩 <b>중심에만</b> 떨어뜨리고 가장자리는 건드리지 않습니다.",
      "마지막 굵은 선은 수위가 <b>살짝</b> 오를 정도까지만. 넘치면 잡미가 함께 내려옵니다.",
      "원문에 물 온도 표기가 없어 일본 강배전 통용값인 85℃를 기준으로 잡았습니다."],
    source:"사루타히코 커피 深煎り/中深煎り 가이드 · 17g / 200ml / 3:20 · 온도는 추정치"
  },
  {
    id:"daibo-nel", name:"융드립 점적", by:"大坊珈琲店 스타일", role:"일본 · 강배전 농축 (재현 레시피)",
    dripper:"nel", method:"handdrip", fit:"dark", dose:20, ratio:6, temp:"80℃", um:750, tol:70, total:165,
    blurb:"80℃ 저온에 점적으로만 내려 보통 커피의 3~5배 농도를 뽑는다. 뜸을 거의 주지 않는 것이 이 방식의 특징.",
    steps: c => [
      { at:0,   kind:"bloom", label:"20초에 걸쳐 물을 가루 위에 얹기", to:c.dose*1.5, dur:20, pat:"drop" },
      { at:20,  kind:"act",   label:"25초 대기 — 뜸은 최소로" },
      { at:45,  kind:"pour",  label:"점적 · 중심에서 の자를 그리며", to:c.water, dur:80, pat:"coin", stream:"한 방울씩" },
      { at:165, kind:"end",   label:"추출 완료 · 120cc 농축액" }],
    tips:[
      "<b>80℃</b>는 오타가 아닙니다. 강배전을 아주 낮은 온도로 오래 내려 쓴맛 대신 단맛과 농도를 얻는 방식입니다.",
      "<b>뜸을 거의 주지 않습니다</b> — 물을 얹고 25초만 기다린 뒤 바로 점적으로 들어갑니다.",
      "보통 커피의 3~5배 농도로 나옵니다. 작은 잔에 그대로 마시거나 뜨거운 물로 희석해 드세요.",
      "융(플란넬)은 종이보다 오일을 통과시켜 질감이 훨씬 두껍습니다. 사용 후 물에 담가 냉장 보관합니다.",
      "大坊珈琲店의 정확한 원 레시피가 아니라 공개된 재현 자료를 정리한 것입니다."],
    source:"大坊珈琲店 스타일 재현 레시피 · 20g / 120cc / 80℃ · 공개 자료 정리"
  },
  {
    id:"jeon-wave", name:"칼리타 웨이브 핸드드립", by:"전주연", role:"2019 월드 바리스타 챔피언",
    dripper:"wave", method:"handdrip", fit:"mdark", dose:20, ratio:10, temp:"90℃", um:1050, tol:70, total:130,
    waveSize:"unspecified", waveSizeBasis:"unspecified", roastBasis:"explicit", sourceKind:"secondary",
    sourceUrl:"https://coffee4m.com/%EC%B9%BC%EB%A6%AC%ED%83%80-%EC%9B%A8%EC%9D%B4%EB%B8%8C-%EB%93%9C%EB%A6%AC%ED%8D%BC-%EB%A0%88%EC%8B%9C%ED%94%BC/", dropCm:"출처 미지정",
    refDials:{ c40:{ light:29, mlight:29, medium:29, mdark:29, dark:29 } },
    blurb:"40g씩 다섯 번. 물량은 같게 두고 유량을 4 → 4 → 4 → 5 → 8g/s로 높인다.",
    steps: c => { const u = c.water/5; return [
      { at:0,   kind:"bloom", label:"1차 · 40g · 4g/s · 45초까지 뜸", to:u, dur:10, pat:"bloom", stream:"가늘게", flowRateGps:4 },
      { at:45,  kind:"pour", label:"2차 · 중앙의 작은 원 · 4g/s", to:u*2, dur:10, pat:"smallCir", stream:"가늘게", flowRateGps:4 },
      { at:70,  kind:"pour", label:"3차 · 앞보다 큰 원 · 4g/s", to:u*3, dur:10, pat:"spiral", stream:"가늘게", flowRateGps:4 },
      { at:95,  kind:"pour", label:"4차 · 같은 원형 경로 · 5g/s", to:u*4, dur:8, pat:"spiral", stream:"보통", flowRateGps:5 },
      { at:113, kind:"pour", label:"5차 · 같은 원형 경로 · 8g/s", to:u*5, dur:5, pat:"spiral", stream:"굵게", flowRateGps:8 },
      { at:130, kind:"end",   label:"물이 다 빠질 때까지 · 추출액 160–180g" }]; },
    tips:[
      "분쇄도는 <b>코만단테 29클릭 · 펠로우 오드 3.75</b>, 물 온도는 미디엄 다크 기준 90℃입니다.",
      "붓는 속도를 <b>4 → 4 → 4 → 5 → 8g/s</b>로 올리는 것이 뼈대입니다.",
      "후반에 커지는 것은 <b>물줄기 세기</b>입니다. 원의 크기를 키우라는 언급은 원문에 없습니다.",
      "웨이브 155/185와 실제 주전자 높이는 출처 미지정입니다."],
    source:"전주연 칼리타 웨이브 레시피 · coffee4m 2차 정리 · 20g / 200g"
  },
  {
    id:"lightup-wave", name:"라이트업 웨이브", by:"카와노 유마", role:"LIGHT UP COFFEE · 일본",
    dripper:"wave", method:"handdrip", fit:"light", dose:15, ratio:16, temp:"90℃", um:900, tol:70, total:165,
    totalRange:[150,180], waveSize:"155", waveSizeBasis:"recommended", roastBasis:"roasterStyle", sourceKind:"official",
    sourceUrl:"https://lightupcoffee.com/blogs/brew-guide/drip-kalitawave", dropCm:"출처 미지정",
    blurb:"35g으로 뜸을 들인 뒤 55g, 50g, 50g, 50g을 약 10초씩 원형으로 붓고 부드럽게 흔들어 마친다.",
    steps: c => [
      { at:0, kind:"bloom", label:"35g까지 붓고 0:30까지 뜸", to:c.water*(35/240), dur:10, pat:"bloom", stream:"가늘게" },
      { at:30, kind:"pour", label:"90g까지 · 원형 · 약 10초", to:c.water*(90/240), dur:10, pat:"spiral", stream:"보통" },
      { at:60, kind:"pour", label:"140g까지 · 원형 · 약 10초", to:c.water*(140/240), dur:10, pat:"spiral", stream:"보통" },
      { at:90, kind:"pour", label:"190g까지 · 원형 · 약 10초", to:c.water*(190/240), dur:10, pat:"spiral", stream:"보통" },
      { at:110, kind:"pour", label:"240g까지 · 원형 · 약 10초", to:c.water, dur:10, pat:"spiral", stream:"보통" },
      { at:120, kind:"act", label:"드리퍼를 부드럽게 흔들어 베드 평탄화" },
      { at:165, kind:"end", label:"배출 완료 · 2:30–3:00 범위" }],
    tips:[
      "공식 최신 가이드는 누적 <b>35 / 90 / 140 / 190 / 240g</b>, 시작 <b>0:00 / 0:30 / 1:00 / 1:30 / 1:50</b>입니다.",
      "155와 약배전 적합은 각각 용량과 로스터 성향에 따른 권장값이며 레시피 본문 명시는 아닙니다.",
      "이 단계 구성은 LIGHT UP COFFEE의 최신 공식 가이드를 그대로 따른 것입니다."],
    source:"LIGHT UP COFFEE 공식 Kalita Wave 가이드 · 15g / 240g / 90℃"
  },
  {
    id:"kurasu-wave", name:"쿠라스 웨이브 2023", by:"쿠라스 교토", role:"Kurasu Kyoto · 일본",
    dripper:"wave", method:"handdrip", fit:"light", dose:14, ratio:200/14, temp:"92℃", um:1050, tol:80, total:130,
    totalRange:[125,135], waveSize:"155", waveSizeBasis:"explicit", roastBasis:"explicit", sourceKind:"official",
    sourceUrl:"https://jp.kurasu.kyoto/blogs/kurasu-journal/how-to-brew-with-kalita-wave-by-kurasu-kyoto-2023", dropCm:"출처 미지정",
    blurb:"30g으로 전 베드를 적시고, 0:40에 강하게 30g을 더한 뒤 1:10부터 중앙 한 점에 가늘게 이어서 붓기한다.",
    steps: c => [
      { at:0, kind:"bloom", label:"30g · 전 베드 고르게 적시기", to:c.water*0.15, pat:"bloom", stream:"보통" },
      { at:40, kind:"pour", label:"60g까지 · 전 베드에 빠르고 강하게", to:c.water*0.30, pat:"wide", stream:"굵게" },
      { at:70, kind:"pour", label:"200g까지 · 센터 고정 · 유입량과 배출량 맞추기", to:c.water, pat:"center", stream:"가늘게", height:"낮게", triggerText:"2차 때 생긴 최고 수위선을 넘기지 않는다" },
      { at:130, kind:"end",   label:"추출 완료 (2:05–2:15)" }],
    tips:[
      "마지막은 작은 원이 아니라 <b>원을 그리지 않는 중앙 고정 이어서 붓기</b>입니다.",
      "공식 문맥은 14g/200g의 <b>Wave 155</b>이며, 2배 용량에는 185를 권장합니다.",
      "약배전은 공식 명시지만 세 붓기의 정확한 붓기 시간과 μm는 미기재입니다.",
      "스월·저어주기 없이 마칩니다."],
    source:"Kurasu Kyoto 공식 Kalita Wave 2023 · 14g / 200g / 92℃ / 2:05–2:15"
  },
  {
    id:"madcap-wave", name:"매드캡 웨이브 185", by:"매드캡 커피", role:"Madcap Coffee · 미국",
    dripper:"wave", method:"pourover", fit:"medium", dose:21, ratio:355/21, temp:"97℃", um:880, tol:70, total:210,
    totalRange:[195,225], waveSize:"185", waveSizeBasis:"explicit", roastBasis:"unspecified", sourceKind:"official",
    sourceUrl:"https://www.madcapcoffee.com/blogs/news/how-we-brew-kalita-185-recipe", dropCm:"출처 미지정",
    blurb:"처음 50g, 15초에 100g. 이후 수위가 베드 아래로 내려가기 시작할 때마다 약 50g씩 보충한다.",
    steps: c => { const q = g => c.water*(g/355), cue = "수위가 커피층 아래로 내려가기 시작할 때"; return [
      { at:0, kind:"bloom", label:"50g까지 · 중앙에서 바깥으로 느린 원", to:q(50), pat:"bloom" },
      { at:15, kind:"pour", label:"100g까지 · 중앙에서 바깥으로 느린 원", to:q(100), pat:"spiral" },
      { at:40, kind:"pour", label:"150g까지 · 수위 조건", to:q(150), pat:"spiral", triggerText:cue },
      { at:65, kind:"pour", label:"200g까지 · 수위 조건", to:q(200), pat:"spiral", triggerText:cue },
      { at:90, kind:"pour", label:"250g까지 · 수위 조건", to:q(250), pat:"spiral", triggerText:cue },
      { at:115, kind:"pour", label:"300g까지 · 필터 주름을 딱 한 바퀴 훑기", to:q(300), pat:"edgeRinse", stream:"가늘게", triggerText:cue },
      { at:140, kind:"pour", label:"355g까지 · 마지막 55g", to:c.water, pat:"spiral", triggerText:cue },
      { at:210, kind:"end",   label:"배출 완료 (3:15–3:45)" }]; },
    tips:[
      "0:15 이후의 <b>25초 간격은 앱 대표 시각</b>입니다. 원문 트리거는 시계가 아니라 수위입니다.",
      "250→300g에서만 필터 주름을 짧게 한 바퀴 훑고, 가장자리에 계속 붓지 않습니다.",
      "일반 붓기는 중앙에서 시작해 천천히 바깥으로 원을 그립니다.",
      "배전도는 원문 미지정이라 중배전은 앱의 중립 시작점입니다."],
    source:"Madcap Coffee 공식 Kalita 185 · 21g / 355g / 207°F / 3:15–3:45"
  },
  {
    id:"rao-wave", name:"스콧 라오 웨이브 · 영상 정리본", by:"스콧 라오", role:"영상 기반 2차 정리",
    dripper:"wave", method:"pourover", fit:"medium", dose:20, ratio:17, temp:"95℃", um:800, tol:60, total:260,
    waveSize:"185", waveSizeBasis:"recommended", roastBasis:"unspecified", sourceKind:"secondary",
    sourceUrl:"https://www.timer.coffee/recipes/kalita-wave/scott-rao-kalita-wave-recipe/", dropCm:"출처 미지정",
    blurb:"60g 뜸, 0:45에 204g까지, 약 절반 배출되면 1:55에 340g까지. 필요할 때만 작게 저어주기하고 4:20에 마친다.",
    steps: c => [
      { at:0, kind:"bloom", label:"60g까지", to:c.water*(60/340), pat:"bloom" },
      { at:10, kind:"act", label:"필요할 때만 작은 스핀 또는 스푼으로 마른 가루 적시기" },
      { at:45, kind:"pour", label:"204g까지 · 이후 약 절반 내려갈 때까지 대기", to:c.water*0.6, pat:"spiral", triggerText:"다음 붓기는 슬러리가 약 절반 빠졌을 때" },
      { at:115, kind:"pour", label:"340g까지 이어서 붓기", to:c.water, pat:"spiral", flowRateGps:5.7 },
      { at:155, kind:"act", label:"붓기를 마치고 10초 뒤, 드리퍼를 부드럽게 한 번 스핀" },
      { at:260, kind:"end", label:"배출 완료 · 4:20" }],
    tips:[
      "검증 가능한 2차 정리본은 <b>20g / 340g / 95℃ / 4:20</b>입니다.",
      "원문 정리에는 동전 서클·연속 60초 붓기·배전도·주전자 높이가 없습니다. 화면의 나선과 자동 붓기 시간은 시각화 기본값입니다.",
      "수치는 스콧 라오의 공개 영상을 정리한 것입니다."],
    source:"Scott Rao Kalita Wave 영상 기반 Timer.Coffee 2차 정리 · 20g / 340g / 95℃ / 4:20"
  },
  {
    id:"vibrant-wave155", name:"Vibrant Kalita Wave 155", by:"Vibrant Coffee Roasters", role:"공식 Wave 155 가이드",
    dripper:"wave", method:"pourover", fit:"medium", dose:15, ratio:250/15, temp:"99℃", um:850, tol:70, total:120,
    timerMode:"conditional", totalLabel:"조건부", waveSize:"155", waveSizeBasis:"explicit", roastBasis:"unspecified", sourceKind:"official",
    sourceUrl:"https://www.vibrantcoffeeroasters.com/kalitawave155", dropCm:"출처 미지정",
    blurb:"빠르고 강한 전 베드 뜸, 0:40–1:01의 5g/s 나선, 수위가 베드 위 약 1인치로 내려오면 4–5g/s 마지막 붓기.",
    steps:c=>[
      { at:0, kind:"bloom", label:"45g까지 · 빠르고 강하게 전 베드 · 나선 또는 지그재그", to:c.water*(45/250), pat:"zigzag", stream:"굵게" },
      { at:6, kind:"act", label:"마른 덩어리가 남을 때만 스푼으로 뒤집어 적시기" },
      { at:40, kind:"pour", label:"150g까지 · 0:40–1:01 · 5g/s 나선", to:c.water*0.60, dur:21, pat:"spiral", stream:"보통", flowRateGps:5 },
      { at:80, kind:"pour", label:"250g까지 · 수위 조건 · 4–5g/s", to:c.water, dur:23, pat:"spiral", stream:"보통", flowRateRangeGps:[4,5], triggerText:"수위가 커피층 위 약 1인치(2.5cm)까지 내려오면", approx:true },
      { at:103, kind:"act", label:"드리퍼를 부드럽게 스월" },
      { at:120, kind:"end", label:"다 내려오면 드리퍼 분리" }],
    tips:[
      "마지막 시작의 원문 트리거는 <b>1:20이 아니라 수위</b>입니다. 1:20은 타이머용 대표값입니다.",
      "원문은 미분량에 따라 시간이 크게 달라지므로 총 시간을 좇지 말라고 합니다. 화면의 2:00은 시퀀스 표시용입니다.",
      "레시피 본문은 배전도를 지정하지 않습니다. 850μm와 실제 붓는 높이는 앱 시작점/미기재 값입니다."],
    source:"Vibrant 공식 Kalita Wave 155 · 15g / 250g / 210–211°F"
  },
  {
    id:"coffee-collective-wave155", name:"Coffee Collective Small 155", by:"Coffee Collective", role:"덴마크 · 공식 브루 가이드",
    dripper:"wave", method:"pourover", fit:"light", dose:16, ratio:250/16, temp:"92–95℃", um:900, tol:80, total:155,
    timerMode:"pourEnd", waveSize:"155", waveSizeBasis:"explicit", roastBasis:"roasterStyle", sourceKind:"official",
    sourceUrl:"https://coffeecollective.dk/pages/brew-guide/kalita-wave", dropCm:"출처 미지정",
    blurb:"30g 뜸 뒤 0:30–1:45 동안 중앙→바깥→중앙 왕복을 반복하며 250g까지 끊김 없이 붓는다.",
    steps:c=>[
      { at:0, kind:"bloom", label:"30g까지 · 0:30까지 뜸", to:c.water*(30/250), pat:"bloom", stream:"가늘게" },
      { at:30, kind:"pour", label:"250g까지 · 중앙→바깥→중앙 반복 · 1:45 붓기 종료", to:c.water, dur:75, durFixed:true, pat:"back", stream:"가늘게", flowRateGps:(250-30)/75 },
      { at:155, kind:"end", label:"다 내려온 뒤 드리퍼 분리" }],
    tips:[
      "공식 사이즈는 <b>Wave 155</b>입니다.",
      "약배전 적합은 Coffee Collective의 로스터 성향 근거이며 레시피 본문 배전 명시는 아닙니다.",
      "1:45는 다 내려온 시각이 아니라 <b>붓기 종료</b>입니다. 마지막 quick stir는 서버/컵의 추출 음료를 섞는 동작입니다."],
    source:"Coffee Collective 공식 Small Kalita · Wave 155 · 16g / 250g / 붓기 종료 1:45"
  },
  {
    id:"coffee-collective-wave185", name:"Coffee Collective Large 185", by:"Coffee Collective", role:"덴마크 · 공식 브루 가이드",
    dripper:"wave", method:"pourover", fit:"light", dose:32, ratio:500/32, temp:"92–95℃", um:950, tol:80, total:155,
    timerMode:"pourEnd", waveSize:"185", waveSizeBasis:"explicit", roastBasis:"roasterStyle", sourceKind:"official",
    sourceUrl:"https://coffeecollective.dk/pages/brew-guide/kalita-wave", dropCm:"출처 미지정",
    blurb:"60g 뜸 뒤 0:30–1:45 동안 중앙→바깥→중앙 왕복을 반복하며 500g까지 끊김 없이 붓는다.",
    steps:c=>[
      { at:0, kind:"bloom", label:"60g까지 · 0:30까지 뜸", to:c.water*(60/500), pat:"bloom", stream:"보통" },
      { at:30, kind:"pour", label:"500g까지 · 중앙→바깥→중앙 반복 · 1:45 붓기 종료", to:c.water, dur:75, durFixed:true, pat:"back", stream:"보통", flowRateGps:(500-60)/75 },
      { at:155, kind:"end", label:"다 내려온 뒤 드리퍼 분리" }],
    tips:[
      "공식 사이즈는 <b>Wave 185</b>입니다.",
      "Small을 단순 확대하면 안 됩니다. 두 버전 모두 본 붓기 시간은 같은 <b>75초</b>입니다.",
      "최종 다 내려옴 시각은 미지정이며, quick stir는 서버/컵의 음료를 섞는 동작입니다."],
    source:"Coffee Collective 공식 Large Kalita · Wave 185 · 32g / 500g / 붓기 종료 1:45"
  },
  {
    id:"passenger-two-cup-wave", name:"Passenger Two-Cup Kalita", by:"Passenger Coffee", role:"공식 2컵 가이드",
    dripper:"wave", method:"pourover", fit:"light", dose:30, ratio:470/30, temp:"99℃", um:950, tol:90, total:195,
    totalRange:[150,240], waveSize:"185", waveSizeBasis:"recommended", roastBasis:"roasterStyle", sourceKind:"official",
    sourceUrl:"https://drinkpassenger.com/guides/kalita-wave", dropCm:"출처 미지정",
    blurb:"80g 빠른 전 베드 붓기, 270g까지 바깥→중앙 역나선, 가장자리를 잠깐 훑은 뒤 중앙 고정으로 470g까지 마친다.",
    steps:c=>[
      { at:0, kind:"bloom", label:"80g까지 · 빠른 전 베드 나선", to:c.water*(80/470), pat:"wide", stream:"굵게" },
      { at:40, kind:"pour", label:"270g까지 · 바깥에서 중앙으로 들어오는 역나선 반복", to:c.water*(270/470), pat:"inward", stream:"보통" },
      { at:80, kind:"pour", label:"370g까지 · 가장자리 안쪽을 훑고 멈춤 없이 중앙 고정", to:c.water*(370/470), pat:"edgeCenter", stream:"가늘게" },
      { at:110, kind:"pour", label:"470g까지 · 중앙 한 점에 천천히 고정", to:c.water, pat:"center", stream:"가늘게", height:"낮게" },
      { at:195, kind:"end", label:"배출 완료 · 2:30–4:00 범위의 중간값" }],
    tips:[
      "공식 30g/470g 2컵 레시피라 Wave 185를 권장하지만 페이지에서 모델 번호를 직접 명시한 것은 아닙니다.",
      "후반은 동전 서클이 아니라 <b>중앙 고정 이어서 붓기</b>입니다. 종이 벽을 계속 때리지 않습니다.",
      "초보자에게 스월·저어주기·탭을 하지 말라고 명시합니다.",
      "약배전은 Passenger의 로스터 성향 근거이고, 950μm는 테스트가 필요한 앱 제안입니다."],
    source:"Passenger 공식 Two-Cup Kalita · 30g / 470g / 210°F / 2:30–4:00"
  },
  {
    id:"stumptown-wave", name:"Stumptown Kalita Wave", by:"Stumptown Coffee", role:"공식 브루 가이드",
    dripper:"wave", method:"pourover", fit:"medium", dose:21, ratio:345/21, temp:"96℃", um:850, tol:70, total:173,
    totalRange:[165,180], waveSize:"185", waveSizeBasis:"officialContext", roastBasis:"unspecified", sourceKind:"official",
    sourceUrl:"https://www.stumptowncoffee.com/pages/brew-guide-kalita-wave", dropCm:"출처 미지정",
    blurb:"60g을 10초에 적시고 저은 뒤 0:45–1:00에 200g. 이후 밝게 젖은 곳을 피하고 어둡고 마른 지점만 25–50g씩 보충한다.",
    steps:c=>{ const p=c.water*(200/345), u=(c.water-p)/4; return [
      { at:0, kind:"bloom", label:"60g까지 · 10초 · 전 베드 적시기", to:c.water*(60/345), dur:10, pat:"bloom", stream:"보통", flowRateGps:6 },
      { at:10, kind:"act", label:"부드럽게 저어 마른 가루 없애기" },
      { at:45, kind:"pour", label:"200g까지 · 15초 · 천천히 이동하는 나선", to:p, dur:15, pat:"spiral", stream:"굵게", flowRateGps:(200-60)/15 },
      { at:75, kind:"pour", label:"후반 타깃 펄스 1/4", to:p+u, pat:"spot", stream:"가늘게", height:"낮게", approx:true },
      { at:95, kind:"pour", label:"후반 타깃 펄스 2/4", to:p+u*2, pat:"spot", stream:"가늘게", height:"낮게", approx:true },
      { at:115, kind:"pour", label:"후반 타깃 펄스 3/4", to:p+u*3, pat:"spot", stream:"가늘게", height:"낮게", approx:true },
      { at:135, kind:"pour", label:"345g까지 · 타깃 펄스 4/4", to:c.water, pat:"spot", stream:"가늘게", height:"낮게", approx:true },
      { at:173, kind:"end", label:"배출 완료 · 2:45–3:00" }]; },
    tips:[
      "원문은 후반을 <b>25–50g 펄스</b>라고만 하며 횟수·각 누적량·정확 시각은 고정하지 않습니다. 4회 균등 분할은 타이머용 가정입니다.",
      "마른 지점 타깃은 고정된 작은 나선이 아니라 베드 상태를 보며 이동합니다.",
      "0:45의 slow spiral은 주전자 이동이 느리다는 표현입니다. 140g/15초는 계산상 9.33g/s라 물줄기는 굵게 표시합니다."],
    source:"Stumptown 공식 Kalita Wave · 21g / 345g / 205°F / 2:45–3:00"
  },
  {
    id:"counterculture-quick-wave", name:"Quick + Easy Kalita", by:"Counter Culture Coffee", role:"공식 푸어오버의 Wave 적용",
    dripper:"wave", method:"pourover", fit:"medium", dose:30, ratio:500/30, temp:"93℃", um:900, tol:80, total:225,
    totalRange:[210,240], waveSize:"185", waveSizeBasis:"recommended", roastBasis:"unspecified", sourceKind:"official",
    sourceUrl:"https://counterculturecoffee.com/pages/quick-easy-pour-over", dropCm:"출처 미지정",
    blurb:"60g 뜸, 0:30에 200g, 1:00에 300g. 이후 30초 또는 수위 1cm 하강 중 먼저 오는 조건에 원형 펄스를 반복해 500g.",
    steps:c=>[
      { at:0, kind:"bloom", label:"60g까지 · 0:30까지 뜸", to:c.water*(60/500), pat:"bloom" },
      { at:30, kind:"pour", label:"200g까지 · 원형 붓기", to:c.water*0.40, pat:"spiral" },
      { at:60, kind:"pour", label:"300g까지 · 시간/수위 조건", to:c.water*0.60, pat:"spiral", triggerText:"30초 경과 또는 수위 약 1cm 하강 중 먼저" },
      { at:90, kind:"pour", label:"후반 반복 1/2 · 400g까지", to:c.water*0.80, pat:"spiral", triggerText:"30초 경과 또는 수위 약 1cm 하강 중 먼저", approx:true },
      { at:120, kind:"pour", label:"후반 반복 2/2 · 500g까지", to:c.water, pat:"spiral", triggerText:"30초 경과 또는 수위 약 1cm 하강 중 먼저", approx:true },
      { at:225, kind:"end", label:"배출 완료 · 3:30–4:00" }],
    tips:[
      "원문이 확정하는 후반 정보는 <b>30초마다 또는 수위 1cm 하강 시 반복해 500g</b>뿐입니다. 400/500g 분할은 앱 가정입니다.",
      "Wave 185는 30g/500g에 따른 권장이고 공식 페이지가 모델 번호를 명시한 것은 아닙니다.",
      "배전 미지정이라 중배전은 앱 중립값, 900μm는 구현 제안입니다."],
    source:"Counter Culture 공식 Quick + Easy Pour Over · Wave 적용 · 30g / 500g / 200°F / 3:30–4:00"
  },
  {
    id:"onyx-monarch-wave185", name:"Monarch Kalita 185", by:"Onyx Coffee Lab", role:"Expressive Dark · 공식 레시피",
    dripper:"wave", method:"pourover", fit:"dark", dose:25, ratio:16, temp:"93℃", um:600, tol:50, total:210,
    waveSize:"185", waveSizeBasis:"explicit", roastBasis:"explicit", sourceKind:"official",
    sourceUrl:"https://onyxcoffeelab.com/products/monarch", dropCm:"출처 미지정",
    blurb:"50g 뜸 뒤 0:30의 Heavy Spiral로 160g, 이어 220/280/340/400g까지 단계적으로 붓는 강배전용 공식 카드.",
    steps:c=>[
      { at:0, kind:"bloom", label:"50g까지 · 뜸", to:c.water*(50/400), pat:"bloom" },
      { at:30, kind:"pour", label:"160g까지 · Heavy Spiral", to:c.water*0.40, pat:"spiral", stream:"굵게", flowDescriptor:"강하게" },
      { at:45, kind:"pour", label:"220g까지 · 나선", to:c.water*0.55, pat:"spiral" },
      { at:65, kind:"pour", label:"280g까지 · 나선", to:c.water*0.70, pat:"spiral" },
      { at:90, kind:"pour", label:"340g까지 · 나선", to:c.water*0.85, pat:"spiral" },
      { at:120, kind:"pour", label:"400g까지 · 나선", to:c.water, pat:"spiral" },
      { at:210, kind:"end", label:"배출 완료 · 3:30" }],
    tips:[
      "<b>Heavy Spiral</b>은 반경이 넓다는 뜻이 아니라 <b>나선 경로 + 강한 물줄기</b>입니다.",
      "Wave 185, Expressive Dark, 600μm, 누적량과 시각은 공식 명시입니다. 허용폭과 자동 붓기 시간은 앱 제안입니다."],
    source:"Onyx 공식 Monarch Kalita Wave 185 · 25g / 400g / 200°F / 600μm / 3:30"
  },
  {
    id:"onyx-southern-wave185", name:"Southern Weather Kalita 185", by:"Onyx Coffee Lab", role:"Moderate · 공식 레시피",
    dripper:"wave", method:"pourover", fit:"medium", dose:25, ratio:12, temp:"93℃", um:650, tol:50, total:150,
    waveSize:"185", waveSizeBasis:"explicit", roastBasis:"explicit", sourceKind:"official",
    sourceUrl:"https://onyxcoffeelab.com/products/southern-weather", dropCm:"출처 미지정",
    blurb:"40g 뜸, 0:30에 중앙 고정으로 120g, 이후 180/240/300g까지 나선으로 붓고 2:30에 마친다.",
    steps:c=>[
      { at:0, kind:"bloom", label:"40g까지 · 뜸", to:c.water*(40/300), pat:"bloom" },
      { at:30, kind:"pour", label:"120g까지 · 센터 고정 · 원을 그리지 않음", to:c.water*0.40, pat:"center", stream:"가늘게", height:"낮게" },
      { at:50, kind:"pour", label:"180g까지 · 나선", to:c.water*0.60, pat:"spiral" },
      { at:70, kind:"pour", label:"240g까지 · 나선", to:c.water*0.80, pat:"spiral" },
      { at:90, kind:"pour", label:"300g까지 · 나선", to:c.water, pat:"spiral" },
      { at:150, kind:"end", label:"배출 완료 · 2:30" }],
    tips:[
      "0:30은 점드립이나 동전 서클이 아니라 <b>연속 중앙 고정 붓기</b>입니다.",
      "공식 페이지의 다른 중복 블록은 마지막을 Spiral-to-Center·3:00으로 적어 충돌합니다. 기본 카드는 대표 블록/인덱스의 나선·2:30을 따릅니다.",
      "Wave 185, Moderate, 650μm는 공식 명시이고 허용폭과 자동 붓기 시간은 앱 제안입니다."],
    source:"Onyx 공식 Southern Weather Kalita 185 · 대표 블록 25g / 300g / 200°F / 650μm / 2:30"
  },
  {
    id:"george-howell-six-wave185", name:"6×65g Timed Pulses", by:"George Howell 방식", role:"Prima Coffee 보존·재현 자료",
    dripper:"wave", method:"pourover", fit:"mlight", dose:25, ratio:15.6, temp:"94–96℃", um:670, tol:60, total:210,
    waveSize:"185", waveSizeBasis:"preserved", roastBasis:"roasterStyle", sourceKind:"preserved",
    sourceUrl:"https://prima-coffee.com/learn/article/brewing-guides/comparing-kalita-wave-recipes/33005", dropCm:"출처 미지정",
    blurb:"65g씩 여섯 번. 매회 15초 동안 중앙→바깥→중앙으로 붓고 15초 쉬는 반복형.",
    steps:c=>{ const u=c.water/6; return [
      { at:0, kind:"bloom", label:"1차 65g · 15초 · 별도 뜸 표기는 없음", to:u, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:30, kind:"pour", label:"2차 65g · 15초", to:u*2, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:60, kind:"pour", label:"3차 65g · 15초", to:u*3, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:90, kind:"pour", label:"4차 65g · 15초", to:u*4, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:120, kind:"pour", label:"5차 65g · 15초", to:u*5, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:150, kind:"pour", label:"6차 65g · 15초", to:u*6, dur:15, pat:"back", stream:"가늘게", flowRateGps:65/15 },
      { at:210, kind:"end", label:"배출 완료 · 약 3:30" }]; },
    tips:[
      "원문 범위는 25–28g / 390g입니다. 앱 기본은 25g입니다.",
      "첫 65g은 프리인퓨전 역할을 하지만 출처가 별도 bloom이라고 부르지는 않습니다.",
      "현재 공식 원문은 내려가 Prima Coffee가 비교·보존한 자료를 사용합니다. Encore 14→670μm는 앱 환산 제안입니다."],
    source:"Prima Coffee의 George Howell Wave 보존·재현 · 25–28g / 390g / 6×65g / 3:30"
  },
  {
    id:"sprudge-big-batch-wave185", name:"Sprudge Big Batch 185", by:"Sprudge", role:"대용량 Wave 가이드",
    dripper:"wave", method:"pourover", fit:"medium", dose:40, ratio:16, temp:"96℃", um:900, tol:80, total:270,
    pourEnd:210, waveSize:"185", waveSizeBasis:"explicit", roastBasis:"unspecified", sourceKind:"official",
    sourceUrl:"https://sprudge.com/how-to-brew-with-a-kalita-wave-coffee-maker-162968.html", dropCm:"출처 미지정",
    blurb:"80g을 적시고 부드럽게 저어주기한 뒤 0:30–3:30 동안 중앙→바깥 나선을 간헐적으로 반복해 수위를 유지하는 640g 배치.",
    steps:c=>[
      { at:0, kind:"bloom", label:"80g까지 · 전 베드 적시기", to:c.water*(80/640), pat:"bloom" },
      { at:10, kind:"act", label:"젓가락 등으로 부드럽게 저어주기" },
      { at:30, kind:"pour", label:"640g까지 · 3:30까지 간헐적 나선 · 수위 유지", to:c.water, dur:180, durFixed:true, pat:"spiral", stream:"보통", height:"보통", flowDescriptor:"간헐적으로", approx:true },
      { at:210, kind:"act", label:"붓기 종료 · 마지막 배출 때 드리퍼를 가볍게 탭" },
      { at:270, kind:"end", label:"배출 완료 · 약 4:30" }],
    tips:[
      "원문은 0:30–3:30을 <b>간헐적 붓기</b>라고 하며 펄스별 시각·물량은 주지 않습니다. 연속 애니메이션은 근사입니다.",
      "수위를 유지하고 커피층을 노출하지 않는 것이 물량 분할보다 우선입니다.",
      "배전도는 미지정, 900μm와 첫 붓기의 세부 시간은 앱 제안입니다."],
    source:"Sprudge Kalita Wave 185 Big Batch · 40g / 640g / 205°F / 붓기 3:30 · 총 약 4:30"
  },
  {
    id:"du-origami", name:"오리가미 챔피언 레시피", by:"두 지아닝", role:"2019 월드 브루어스컵 챔피언",
    dripper:"origami", method:"pourover", fit:"light", dose:16, ratio:15, temp:"94℃", um:850, tol:70, total:106,
    blurb:"웨이브 페이퍼를 끼운 오리가미로 1분 46초 만에 끝낸다. 짧고 빠른 세 번의 붓기.",
    steps: c => [
      { at:0,  kind:"bloom", label:"1차 붓기 · 원두량 ×3.75", to:c.water*0.25, dur:10, pat:"spiral" },
      { at:18, kind:"pour",  label:"2차 붓기", to:c.water*(140/240), dur:14, pat:"wide" },
      { at:38, kind:"pour",  label:"3차 붓기 · 전량까지", to:c.water, dur:18, pat:"spiral" },
      { at:106, kind:"end",  label:"추출 완료 · 추출액 약 190g" }],
    tips:[
      "<b>웨이브 페이퍼</b>를 씁니다. 콘 페이퍼를 쓰면 배출이 달라져 시간이 늘어납니다.",
      "대회에서는 굵게 한 번 갈아 채프를 걷어낸 뒤 다시 갈아 클래리티를 올렸습니다.",
      "총 1:46으로 매우 빠릅니다. 4분을 넘긴다면 두세 클릭 굵게 잡으세요.",
      "16g / 240g으로 추출액 약 190g — 작고 진한 한 잔에 맞춘 설계입니다."],
    source:"두 지아닝 2019 WBrC 우승 레시피 · 16g / 240g / 94℃ · timer.coffee 정리"
  },
  {
    id:"kasuya-origami", name:"4:6 오리가미", by:"테츠 카스야", role:"오리가미 드리퍼 공동 개발",
    dripper:"origami", method:"pourover", fit:"medium", dose:20, ratio:15, temp:"92℃", um:1000, tol:80, total:200,
    blurb:"4:6을 오리가미에 얹은 응용. 골이 깊어 배출이 빨라지는 만큼 V60보다 한두 클릭 가늘게 잡는다.",
    steps: c => { const u = c.water/5; return [
      { at:0,   kind:"bloom", label:"1차 붓기 · 뜸", to:u,   pat:"spiral" },
      { at:45,  kind:"pour",  label:"2차 붓기", to:u*2, pat:"back" },
      { at:85,  kind:"pour",  label:"3차 붓기", to:u*3, pat:"back" },
      { at:120, kind:"pour",  label:"4차 붓기", to:u*4, pat:"back" },
      { at:150, kind:"pour",  label:"5차 붓기", to:u*5, pat:"back" },
      { at:200, kind:"end",   label:"추출 완료 · 드리퍼 분리" }]; },
    tips:[
      "<b>콘 페이퍼</b> 기준입니다. 웨이브 페이퍼를 쓰면 배출이 더 느려지니 한 클릭 굵게 잡으세요.",
      "골(리브)이 깊어 공기 배출이 빨라 전체 추출이 V60보다 짧게 끝납니다.",
      "세라믹 홀더는 예열 효과가 크고, 우드·레진 홀더는 온도 유지가 약합니다.",
      "4:6의 조절 원리(앞 40% 맛 · 뒤 60% 농도)는 그대로 적용됩니다."],
    source:"4:6 메소드의 오리가미 응용 버전 · 20g / 300g"
  },
  {
    id:"kono-drip", name:"코노 점드립", by:"코노 정통 방식", role:"KONO 명인 드리퍼",
    dripper:"kono", method:"handdrip", fit:"medium", dose:20, ratio:9, temp:"90℃", um:750, tol:70, total:240,
    blurb:"물방울을 한 방울씩 떨어뜨려 시작한다. 가장 느리고 가장 진한, 융드립 계보의 정통 핸드드립.",
    steps: c => [
      { at:0,   kind:"bloom", label:"점드립 뜸 · 중심에 한 방울씩", to:c.water/6, dur:50, pat:"drop" },
      { at:60,  kind:"pour",  label:"본 붓기 · 아주 가는 물줄기로 작은 원", to:c.water, dur:150, pat:"coin", stream:"가늘게" },
      { at:240, kind:"end",   label:"추출 완료 · 원액 90–100ml" }],
    tips:[
      "코노는 <b>배출구가 크고 리브가 짧아</b> 물이 빨리 빠집니다. 분쇄를 가늘게 잡아 속도를 늦춥니다.",
      "점드립은 물줄기를 만들지 않고 <b>물방울로</b> 떨어뜨립니다. 중심만 적시며 천천히 부풀립니다.",
      "원액 90–100ml를 뽑고 뜨거운 물 100ml를 더해 밸런스를 맞추는 것이 정통 방식입니다.",
      "서두르면 이 레시피의 의미가 없습니다. 4분 이상 걸려도 정상입니다."],
    source:"코노 드리퍼 점드립 방식 · 20g / 180ml / 90℃ · 공개 자료 정리"
  },
  {
    id:"switch-hybrid", name:"스위치 하이브리드", by:"웬델린 반 부닉", role:"바리스타 · 브루잉 컨설턴트",
    dripper:"switch", method:"hybrid", fit:"mlight", dose:20, ratio:15, temp:"96℃", um:850, tol:70, total:165,
    blurb:"밸브를 닫아 침지로 성분을 뽑고, 열어서 투과로 마무리한다. 침지의 단맛과 드립의 투명도를 함께 가져간다.",
    steps: c => [
      { at:0,   kind:"act",   label:"밸브 닫기 (침지 모드)" },
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×3", to:c.dose*3, pat:"spiral" },
      { at:10,  kind:"act",   label:"스월로 전체 적시기" },
      { at:45,  kind:"pour",  label:"전량까지 붓기 · 밸브 닫힌 상태", to:c.water, dur:30, pat:"wide" },
      { at:105, kind:"act",   label:"밸브 열기 (투과 시작)", drain:true },
      { at:165, kind:"end",   label:"배출 완료" }],
    tips:[
      "침지 구간이 길수록 바디가 올라갑니다. 밸브 여는 시점을 ±20초로 조절해보세요.",
      "밸브를 열기 직전 <b>스월은 금물</b> — 미분이 떠 배출이 막힙니다.",
      "배출이 2분 넘게 걸리면 한 단계 굵게 갈아야 합니다.",
      "약배전에는 침지를 길게, 강배전에는 짧게 가져가는 편이 안전합니다."],
    source:"공개된 하이브리드 버전 기준 · 20g / 300g"
  },
  {
    id:"switch-immersion", name:"스위치 풀 이머전", by:"하리오 공식", role:"HARIO Switch 권장 방식",
    dripper:"switch", method:"immersion", fit:"medium", dose:20, ratio:15, temp:"93℃", um:950, tol:80, total:210,
    blurb:"밸브를 닫고 전량을 한 번에 부어 완전 침지로 뽑는다. 손이 거의 가지 않아 재현성이 가장 높다.",
    steps: c => [
      { at:0,   kind:"act",  label:"밸브 닫기 · 필터 린싱 후 원두 담기" },
      { at:0,   kind:"pour", label:"전량 한 번에 붓기", to:c.water, dur:20, pat:"flood" },
      { at:25,  kind:"act",  label:"스푼으로 3회 저어 전체 적시기" },
      { at:180, kind:"act",  label:"밸브 열기 (배출 시작)", drain:true },
      { at:210, kind:"end",  label:"배출 완료" }],
    tips:[
      "침지식이라 <b>붓는 기술이 거의 필요 없습니다</b>. 굵은 물줄기로 한 번에 부어도 됩니다.",
      "침지 시간(기본 3분)이 농도를 결정합니다. 연하면 30초씩 늘려보세요.",
      "투과식보다 굵게 갈아야 합니다. V60 기준보다 두세 클릭 굵게.",
      "밸브를 연 뒤 배출이 1분을 넘기면 다음엔 더 굵게 가세요."],
    source:"하리오 스위치 권장 침지 방식 기준 · 20g / 300g"
  },
  {
    id:"hoffmann-clever", name:"클레버 침지", by:"제임스 호프만", role:"2007 월드 바리스타 챔피언",
    dripper:"clever", method:"immersion", fit:"medium", dose:30, ratio:16.6, temp:"95℃", um:1050, tol:80, total:330,
    blurb:"침지의 관대함과 종이 필터의 깨끗함을 한 번에. 실패할 구석이 거의 없는 방식.",
    steps: c => [
      { at:0,   kind:"act",  label:"필터 린싱 · 드리퍼 예열 후 원두 담기" },
      { at:0,   kind:"pour", label:"전량 한 번에 붓기", to:c.water, dur:25, pat:"flood" },
      { at:30,  kind:"act",  label:"스푼으로 저어 전체 적시기 · 뚜껑 덮기" },
      { at:240, kind:"act",  label:"컵 위에 올려 배출 시작", drain:true },
      { at:330, kind:"end",  label:"배출 완료 (마지막 방울까지 기다리지 않기)" }],
    tips:[
      "물을 붓고 <b>한 번만 젓고 그대로 둡니다</b>. 중간에 건드릴수록 미분이 떠 배출이 막힙니다.",
      "침지 4분이 기본. 강배전은 3분, 약배전은 4분 30초까지 늘려도 좋습니다.",
      "굵게 갈아야 배출이 막히지 않습니다. 프렌치프레스보다 살짝 가는 정도.",
      "마지막 몇 방울은 잡미가 강하니 완전히 떨어지기 전에 내려놓으세요."],
    source:"클레버 드리퍼 침지 방식 · 30g / 500g · 공개 영상 자료 정리"
  },
  {
    id:"bluebottle-chemex", name:"블루보틀 케멕스", by:"블루보틀", role:"Blue Bottle 브루 가이드",
    dripper:"chemex", method:"pourover", fit:"medium", dose:50, ratio:14, temp:"93℃", um:900, tol:70, total:240,
    blurb:"1 : 14의 진한 비율에 네 번에 나눠 붓는다. 뜸을 55초까지 길게 가져가는 것이 이 가이드의 특징.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×2 (10g/s 나선)", to:c.dose*2, dur:10, pat:"spiral" },
      { at:55,  kind:"pour",  label:"2차 붓기 · 전체의 43%까지", to:c.water*0.43, dur:20, pat:"wide" },
      { at:105, kind:"pour",  label:"3차 붓기 · 71%까지", to:c.water*0.71, dur:20, pat:"spiral" },
      { at:155, kind:"pour",  label:"4차 붓기 · 100%까지", to:c.water, dur:20, pat:"smallCir" },
      { at:240, kind:"end",   label:"추출 완료 (약 4:00)" }],
    tips:[
      "분쇄는 <b>바닷소금 굵기</b> — 프렌치프레스보다 조금 가늘게.",
      "뜸을 최대 55초까지 길게 잡아 가스를 충분히 빼는 것이 이 가이드의 핵심입니다.",
      "붓는 속도는 초당 약 10g. 중심에서 시작해 느린 나선으로 퍼집니다.",
      "필터는 세 겹인 쪽을 주둥이 방향으로 놓고, 공기 통로를 막지 않도록 주의하세요."],
    source:"블루보틀 케멕스 브루 가이드 · 1 : 14 · 원 레시피 50g / 700g"
  },
  {
    id:"chemex", name:"케멕스 클래식", by:"케멕스 공식", role:"Chemex Corporation",
    dripper:"chemex", method:"pourover", fit:"medium", dose:30, ratio:16.6, temp:"94℃", um:950, tol:80, total:270,
    blurb:"두꺼운 전용 필터가 오일을 걸러 극도로 맑은 잔을 만든다. 여러 번 나눠 부어 수위를 유지하는 것이 요령.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 · 원두량 ×2", to:c.dose*2, pat:"spiral" },
      { at:45,  kind:"pour",  label:"전체의 50%까지 붓기", to:c.water*0.5, dur:30, pat:"wide" },
      { at:105, kind:"pour",  label:"75%까지 붓기", to:c.water*0.75, dur:25, pat:"spiral" },
      { at:150, kind:"pour",  label:"100%까지 붓기", to:c.water, dur:25, pat:"smallCir" },
      { at:270, kind:"end",   label:"추출 완료 (4:30 목표)" }],
    tips:[
      "필터는 <b>세 겹인 쪽을 주둥이 방향</b>으로 놓고 뜨거운 물로 충분히 린싱합니다.",
      "두꺼운 필터 때문에 배출이 느립니다. V60보다 굵게 시작하세요.",
      "붓기할 때 필터와 유리 사이 공기 통로를 막지 않도록 주의합니다.",
      "총 시간이 5분을 넘어가면 굵기를 올리고, 3분대로 끝나면 낮추세요."],
    source:"케멕스 공식 권장 비율(1:16–17) 기준 · 30g / 500g"
  },
  {
    id:"hoffmann-fp", name:"프렌치프레스 테크닉", by:"제임스 호프만", role:"2007 월드 바리스타 챔피언",
    dripper:"frenchpress", method:"immersion", fit:"medium", dose:30, ratio:16.6, temp:"100℃", tempFixed:true, um:1200, tol:100, total:540,
    blurb:"누르지 않는 프렌치프레스. 4분에 크러스트를 깨고 미분을 걷어낸 뒤, 오래 기다렸다 가만히 따른다.",
    steps: c => [
      { at:0,   kind:"pour", label:"전량 한 번에 붓기", to:c.water, dur:20, pat:"flood" },
      { at:240, kind:"act",  label:"크러스트 깨기 — 스푼으로 3회 저음" },
      { at:270, kind:"act",  label:"떠 있는 거품·미분을 스푼 2개로 걷어내기" },
      { at:300, kind:"act",  label:"뚜껑 덮고 5–8분 그대로 대기" },
      { at:540, kind:"end",  label:"플런저는 표면까지만 · 천천히 따르기", drain:true }],
    tips:[
      "플런저를 <b>끝까지 누르지 않습니다</b>. 표면에 살짝 걸치는 정도로만 두세요.",
      "미분을 걷어내는 단계가 이 방식의 핵심입니다. 잔의 탁함이 확연히 줄어듭니다.",
      "굵게 갈수록 컵이 깨끗해집니다. 가장 굵은 쪽에서 시작하세요.",
      "마지막 잔은 따르지 말고 남기면 침전물이 따라 나오지 않습니다."],
    source:"원 레시피 1L당 66g 기준 환산 · 공개 영상 자료 정리"
  },
  {
    id:"wac2023", name:"WAC 우승 레시피", by:"테이 윕바수트", role:"2023 월드 에어로프레스 챔피언",
    dripper:"aeropress", method:"immersion", fit:"light", dose:18, ratio:5.6, dilute:4.4, temp:"95℃", um:700, tol:80, total:125,
    blurb:"18g을 갈아 16g만 먼저 넣고, 브루잉 중간에 남은 2g을 더 넣는다. 향을 되살리는 반칙 같은 한 수.",
    steps: c => [
      { at:0,   kind:"act",  label:"원두 " + Math.round(c.dose) + "g 분쇄 · " + Math.round(c.dose*16/18) + "g만 챔버에 담기" },
      { at:0,   kind:"pour", label:"물 전량 붓기", to:c.water, dur:12, pat:"flood" },
      { at:30,  kind:"act",  label:"원을 그리며 5초간 저어주기" },
      { at:45,  kind:"act",  label:"남겨둔 원두 " + Math.round(c.dose*2/18) + "g 추가 투입" },
      { at:55,  kind:"act",  label:"다시 5초간 저어주기" },
      { at:95,  kind:"act",  label:"플런저 삽입 · 약 30초에 걸쳐 프레스", drain:true },
      { at:125, kind:"end",  label:"추출 완료 · 추출액 약 " + Math.round(c.dose*75/18) + "g" }],
    tips:[
      "<b>원두를 두 번에 나눠 넣는 것</b>이 이 레시피의 정체성입니다. 뒤에 넣은 2g이 향을 되살립니다.",
      "바이패스가 필수입니다 — 추출액에 <b>상온수</b>를 더해 115g, 다시 <b>온수</b>를 더해 155g까지 (18g 기준).",
      "저어주기는 정확히 5초씩 두 번. 더 오래 저으면 잡미가 올라옵니다.",
      "프레스는 30초에 걸쳐 천천히. 힘이 아니라 시간입니다.",
      "원문에 물 온도가 명시되지 않아 95℃를 기준값으로 잡았습니다."],
    source:"2023 월드 에어로프레스 챔피언십 우승 레시피 · 18g / 100g · aeropress.com"
  },
  {
    id:"hoffmann-ap", name:"에어로프레스 정석", by:"제임스 호프만", role:"2007 월드 바리스타 챔피언",
    dripper:"aeropress", method:"immersion", fit:"medium", dose:11, ratio:18, temp:"100℃", tempFixed:true, um:700, tol:70, total:180,
    blurb:"거의 손대지 않는 방식. 물을 붓고 2분 두었다가 스월 한 번, 그리고 아주 천천히 누른다.",
    steps: c => [
      { at:0,   kind:"pour", label:"전량 붓기 · 저어주지 않음", to:c.water, dur:15, pat:"flood" },
      { at:120, kind:"act",  label:"에어로프레스를 부드럽게 스월" },
      { at:150, kind:"act",  label:"플런저 삽입 후 30초에 걸쳐 천천히 프레스", drain:true },
      { at:180, kind:"end",  label:"추출 완료 · 기호에 따라 가수" }],
    tips:[
      "표준(비역방향) 세팅이며, 필터는 한 장으로 충분합니다.",
      "프레스는 <b>힘이 아니라 시간</b>입니다. 30초를 목표로 균일하게 미세요.",
      "쓴맛이 앞서면 물 온도를 낮추기보다 <b>프레스 속도를 더 늦춰</b> 보세요.",
      "농도가 진하면 뜨거운 물 30–60g을 가수해 마십니다."],
    source:"원 레시피 11g / 200g · 공개 영상 자료 정리"
  },
  {
    id:"kbc-v60-ice", name:"V60 1인 아이스 (급랭)", by:"KBC 챔피언", role:"커디터 채널 시연 · 한국 브루어스컵",
    dripper:"v60", method:"pourover", fit:"medium", roastBasis:"unspecified", dose:20, ratio:10, iceMul:6.5,
    temp:"92℃", um:760, tol:25, totalRange:[130,150], total:150,
    blurb:"20g/200g 농축을 92℃로 짧게 내려 얼음에 급랭하는 1인 아이스. 각 붓기는 이전 물이 거의 빠진 뒤에.",
    steps: c => [
      { at:0,   kind:"bloom", label:"뜸 — 30~40초", to:c.water*0.15, pat:"bloom" },
      { at:40,  kind:"pour",  label:"1차 · 120g까지", to:c.water*0.6, pat:"spiral", triggerText:"물이 거의 다 빠졌을 때 (영상 실측 0:37)" },
      { at:81,  kind:"pour",  label:"2차 · 160g까지", to:c.water*0.8, pat:"spiral", triggerText:"물이 거의 다 빠졌을 때 (실측 1:21)" },
      { at:107, kind:"pour",  label:"3차 · 200g까지", to:c.water,     pat:"spiral", triggerText:"물이 거의 다 빠졌을 때 (실측 1:47)" },
      { at:150, kind:"end",   label:"다 내려오면 완료 (2:10~2:30) · 잔의 얼음 위로" }],
    tips:[
      "분쇄 <b>760μm</b>은 영상이 디플루이드 옴니 실측으로 명시한 값 — 내 환산표 기준 <b>K-Ultra 5.1 · 페모북 A2 20~21클릭</b>.",
      "각 붓기는 <b>이전 물이 거의 다 빠진 뒤</b>에 — 위 시각(0:40 · 1:21 · 1:47)은 영상 실측값입니다.",
      "서버에 얼음을 넣고 내려 잔의 얼음 위에 붓는 급랭. <b>얼음량은 자막에 없어</b> 최종 음료 기준 약 130g로 추정해 표시합니다.",
      "배전도는 영상에 적혀 있지 않아 <b>중배전 기준으로 등록</b>했습니다 — 내려보고 맞춰 가세요."],
    source:"커디터 쇼츠 자막 정리 · 20g / 200g / 92℃ / 760μm · KBC 챔피언 시연",
    sourceKind:"secondary", sourceUrl:"https://youtube.com/shorts/QxC5oXxRJKM"
  },
];

/* ── 옛 드리퍼 id → 새 기구 id ─────────────────────────── */
const LIB_DEVICE = {
  v60:'v60', wave:'kalita', switch:'switch', origami:'origami',
  chemex:'chemex', clever:'clever', kono:'kono', nel:'nel',
  frenchpress:'french', aeropress:'aeropress'
};

/* 붓는 방식(pat) → 한국어 메모 */
const LIB_PAT = {
  spiral:'중심에서 바깥으로 나선', bloom:'중심부터 넓게 적시기',
  back:'나갔다 돌아오는 왕복 나선', center:'중앙에 고정',
  pulse:'짧게 끊어 붓기', circle:'원을 그리며',
  wall:'벽면을 따라', edge:'가장자리 위주',
  drip:'물줄기 가늘게', fast:'굵은 물줄기로 빠르게',
  stir:'젓기', swirl:'스월링'
};

const libById = id => LIBRARY.find(function(x){ return x.id === id; }) || null;

/* 온도 문자열("92–94℃") → 숫자 */
function libTemp(r){
  var m = String(r.temp || '').match(/\d+(?:\.\d+)?/g);
  return m ? Math.round(Number(m[0])) : 92;
}

/* 라이브러리 레시피를 내 원두량 기준으로 펼칩니다 */
function libExpand(r, dose){
  var d = dose || r.dose;
  var water = d * r.ratio;
  var ctx = { dose: d, water: water, ice: r.iceMul ? d * r.iceMul : 0, roast: null };
  var raw = [];
  try { raw = r.steps(ctx) || []; } catch (e) { raw = []; }

  var cum = 0, steps = [];
  raw.forEach(function(s){
    if (typeof s.to !== 'number'){
      /* 'end' 같은 마무리 표시는 메모로만 남깁니다 */
      if (s.label) steps.push({ t: s.at || 0, g: 0, label: s.label, note: '', mark: true });
      return;
    }
    var add = Math.round((s.to - cum) * 10) / 10;
    cum = s.to;
    steps.push({
      t: s.at || 0,
      g: Math.max(0, add),
      label: s.label || '',
      note: (s.pat && LIB_PAT[s.pat]) || ''
    });
  });

  return {
    device: LIB_DEVICE[r.dripper] || 'v60',
    dose: Math.round(d * 10) / 10,
    water: Math.round(cum || water),
    time: r.total || (steps.length ? steps[steps.length - 1].t + 30 : 180),
    temp: libTemp(r),
    steps: steps
  };
}

/* 내 레시피 형식으로 변환 */
function libToRecipe(r, dose, grinderId){
  var e = libExpand(r, dose);
  var g = grinderById(grinderId || primaryGrinder().id);
  var fit = ROASTS.find(function(x){ return x.id === r.fit; });
  return {
    id: uid(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    name: r.name + (r.by ? ' · ' + r.by : ''),
    category: (DEVICES[e.device] || DEVICES.v60).method,
    device: e.device, beanId: null,
    dose: e.dose, water: e.water, time: e.time, temp: e.temp,
    grinderId: g.id,
    grind: Math.round(micronToDial(g, r.um).v * 10) / 10,
    steps: e.steps.map(function(s){ return { t:s.t, g:s.g, label:s.label, note:s.note }; }),
    rating: null,
    notes: [r.blurb, fit ? '기준 배전도: ' + fit.label : '', r.source ? '출처: ' + r.source : '']
      .filter(Boolean).join('\n\n'),
    favorite: false, fromLibrary: r.id
  };
}
