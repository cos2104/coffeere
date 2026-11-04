/* ===========================================================
   Coffeere — 기준 데이터
   그라인더 환산 곡선은 기존 brew-dial 데이터를 이어받았습니다.
   =========================================================== */

/* ── 그라인더 ────────────────────────────────────────────
   curve: [입자크기(μm), 다이얼값] 쌍. 사이 값은 선형 보간합니다.
   max  : 슬라이더/입력 상한,  dial: 한 바퀴 클릭수,  base: 숫자 한 칸 클릭수  */
const GRINDERS = [
  { id:'c40', name:'코만단테 C40 (MK4)', brand:'Comandante', unit:'클릭', dec:0, max:50,
    hint:'니트로 블레이드 기준',
    curve:[[550,12],[600,14],[700,16],[800,20],[900,24],[1000,27.5],[1050,29],[1200,36],[1300,40]] },
  { id:'kultra', name:'1Zpresso K-Ultra', brand:'1Zpresso', unit:'다이얼', dec:0, max:120, base:10,
    hint:'다이얼 숫자 그대로 · 숫자 한 칸 10클릭',
    curve:[[600,37],[700,45],[800,55],[850,60],[900,70],[1000,82],[1050,84],[1200,100]] },
  { id:'a2', name:'페모북 A2', brand:'Fellow·호환', unit:'클릭', dec:0, max:90, dial:40,
    hint:'한 바퀴 40클릭 · 610–830μm 구간은 실측 통일표',
    curve:[[500,0],[610,8],[640,9],[660,11],[675,12],[700,14],[710,16],[720,17],[730,18],[740,19],[750,20],[770,21],[810,24],[830,25],[875,30],[950,40],[1000,45],[1100,55],[1200,63],[1300,72]] },
  { id:'m01', name:'밀랩 M01', brand:'Mill-Lab', unit:'눈금', dec:1, max:10,
    hint:'0–10 눈금 · 한 칸 125μm',
    curve:[[450,3.0],[550,3.85],[600,4.2],[700,5.0],[800,5.8],[850,6.2],[900,6.6],[1000,7.4],[1050,7.8],[1200,9.0],[1300,9.8],[1450,9.9]] },
  { id:'c3', name:'타임모어 C3', brand:'Timemore', unit:'클릭', dec:0, max:30, dial:12,
    hint:'공식 매뉴얼 근사 · 한 바퀴 12클릭',
    curve:[[450,8],[600,10],[700,12],[800,13],[900,15],[1000,16],[1100,18],[1200,19],[1300,21]] },
  { id:'encore', name:'바라짜 엔코어', brand:'Baratza', unit:'눈금', dec:0, max:40,
    hint:'공식 권장 기준 근사 · 0–40',
    curve:[[300,0],[480,8],[700,12],[780,15],[860,18],[920,20],[1200,28],[1700,40]] },
  { id:'ek43s', name:'EK43s', brand:'Mahlkönig', unit:'다이얼', dec:1, max:16,
    hint:'커뮤니티 실측 근사 · 개체차 큼',
    curve:[[600,4],[700,6],[800,7.5],[900,10],[1000,12],[1100,14.5],[1200,16]] }
];

/* ── 추출 방식 ───────────────────────────────────────── */
const METHODS = [
  { id:'brew', label:'브루잉', devices:[
    { id:'v60',     label:'V60',        icon:'v60',     dripper:true,  def:{dose:15, water:250, time:180, temp:92} },
    { id:'kalita',  label:'칼리타',      icon:'kalita',  dripper:true,  def:{dose:20, water:300, time:195, temp:92} },
    { id:'chemex',  label:'케멕스',      icon:'chemex',  dripper:true,  def:{dose:30, water:500, time:270, temp:93} },
    { id:'clever',  label:'클레버',      icon:'clever',  dripper:true,  def:{dose:18, water:300, time:240, temp:92} },
    { id:'switch',  label:'하리오 스위치', icon:'hswitch', dripper:true,  def:{dose:15, water:250, time:210, temp:93} },
    { id:'origami', label:'오리가미',    icon:'origami', dripper:true,  def:{dose:15, water:250, time:180, temp:92} }
  ]},
  { id:'espresso', label:'에스프레소', devices:[
    { id:'espresso', label:'에스프레소', icon:'espresso', def:{dose:18, water:36,  time:28, temp:93} },
    { id:'ristretto',label:'리스트레토', icon:'ristretto',def:{dose:18, water:25,  time:24, temp:93} },
    { id:'lungo',    label:'룽고',      icon:'lungo',    def:{dose:18, water:60,  time:36, temp:92} },
    { id:'moka',     label:'모카포트',   icon:'moka',     def:{dose:16, water:120, time:240, temp:95} }
  ]},
  { id:'immersion', label:'침출식', devices:[
    { id:'french',   label:'프렌치프레스', icon:'french',   def:{dose:30, water:500, time:240, temp:93} },
    { id:'aeropress',label:'에어로프레스', icon:'aeropress',def:{dose:15, water:220, time:120, temp:85} },
    { id:'siphon',   label:'사이폰',      icon:'siphon',   def:{dose:24, water:360, time:150, temp:94} },
    { id:'coldbrew', label:'콜드브루',    icon:'cold',     def:{dose:80, water:1000,time:43200,temp:20} }
  ]},
  { id:'other', label:'기타', devices:[
    { id:'kono',  label:'코노',    icon:'kono',  dripper:true, def:{dose:20, water:300, time:210, temp:88} },
    { id:'nel',   label:'융드립',  icon:'nel',   dripper:true, def:{dose:20, water:240, time:210, temp:88} },
    { id:'phin',  label:'핀 드립', icon:'phin',  dripper:true, def:{dose:20, water:120, time:300, temp:95} },
    { id:'ibrik', label:'이브릭',  icon:'ibrik', def:{dose:10, water:120, time:180, temp:95} },
    { id:'etc',   label:'직접 입력', icon:'dots', def:{dose:15, water:250, time:180, temp:92} }
  ]}
];

/* 조회용 평면 맵 */
const DEVICES = {};
METHODS.forEach(function(m){ m.devices.forEach(function(d){ DEVICES[d.id] = Object.assign({ method:m.id }, d); }); });
const DEVICE_LIST = Object.keys(DEVICES).map(function(k){ return DEVICES[k]; });

/* ── 로스팅 / 가공 ──────────────────────────────────── */
const ROASTS = [
  { id:'light',  label:'라이트',       color:'#E3C07A' },
  { id:'mlight', label:'미디엄 라이트', color:'#D19E5C' },
  { id:'medium', label:'미디엄',       color:'#BE7C43' },
  { id:'mdark',  label:'미디엄 다크',   color:'#A05C33' },
  { id:'dark',   label:'다크',         color:'#7E4527' }
];
const PROCESSES = [
  { id:'washed',    label:'워시드' },
  { id:'honey',     label:'허니' },
  { id:'natural',   label:'내추럴' },
  { id:'anaerobic', label:'무산소' },
  { id:'carbonic',  label:'카보닉 매서레이션' },
  { id:'wethulled', label:'웻훌' },
  { id:'decaf',     label:'디카페인' },
  { id:'etc',       label:'기타' }
];

/* ── 향미 노트 색상 ─────────────────────────────────── */
const NOTE_COLORS = [
  { id:'red',    hex:'#E35C5C' }, { id:'orange', hex:'#E59240' },
  { id:'yellow', hex:'#E3BA54' }, { id:'green',  hex:'#5BC47F' },
  { id:'teal',   hex:'#3FB8B0' }, { id:'blue',   hex:'#4C9BE3' },
  { id:'purple', hex:'#9B7BE0' }, { id:'pink',   hex:'#E072A8' },
  { id:'brown',  hex:'#A9794F' }, { id:'gray',   hex:'#8E8E96' }
];
const noteHex = function(id){
  var c = NOTE_COLORS.find(function(x){ return x.id === id; });
  return c ? c.hex : NOTE_COLORS[2].hex;
};

/* 자주 쓰는 향미 추천 */
const FLAVOR_SUGGEST = ['자스민','베르가못','블루베리','딸기','청포도','복숭아','자두','오렌지','레몬',
  '사과','열대과일','망고','리치','장미','홍차','캐모마일','꿀','흑설탕','카라멜','초콜릿','다크초콜릿',
  '헤이즐넛','아몬드','바닐라','계피','토피','메이플','와인','위스키','발효','크리미','버터'];

/* ── 푸어링 기본값 ──────────────────────────────────── */
function defaultSteps(device, dose, water){
  var d = DEVICES[device] || DEVICES.v60;
  if (d.method === 'espresso') {
    return [{ t:0, g:water, label:'추출', note:'' }];
  }
  if (d.method === 'immersion') {
    return [{ t:0, g:Math.round(water*0.2), label:'블루밍', note:'' },
            { t:30, g:water - Math.round(water*0.2), label:'본 추출', note:'' }];
  }
  var bloom = Math.min(Math.max(Math.round(water*0.2/5)*5, 30), water);
  var rest = water - bloom;
  var a = Math.round(rest/2/5)*5;
  return [{ t:0,  g:bloom,    label:'블루밍', note:'' },
          { t:30, g:a,        label:'', note:'' },
          { t:60, g:rest - a, label:'', note:'' }];
}

/* ── 환산 ───────────────────────────────────────────── */
function dialToMicron(g, v){
  var c = g.curve, i;
  if (v <= c[0][1]) return c[0][0];
  for (i = 1; i < c.length; i++){
    if (v <= c[i][1]){
      var u0 = c[i-1][0], v0 = c[i-1][1], u1 = c[i][0], v1 = c[i][1];
      return u0 + (u1 - u0) * ((v - v0) / Math.max(1e-6, v1 - v0));
    }
  }
  return c[c.length-1][0];
}
function micronToDial(g, um){
  var c = g.curve, first = c[0], last = c[c.length-1], i;
  if (um <= first[0]) return { v:first[1], flag:'under' };
  if (um >= last[0])  return { v:last[1],  flag:'over'  };
  for (i = 0; i < c.length-1; i++){
    var x1 = c[i][0], y1 = c[i][1], x2 = c[i+1][0], y2 = c[i+1][1];
    if (um >= x1 && um <= x2) return { v: y1 + (y2-y1)*(um-x1)/(x2-x1), flag:null };
  }
  return { v:last[1], flag:'over' };
}
function fmtDial(g, v){
  if (g.base){ var t = Math.max(0, Math.round(v)); return Math.floor(t/g.base) + '.' + (t % g.base); }
  var n = Math.max(0, v);
  return g.dec === 0 ? String(Math.round(n)) : n.toFixed(1);
}
/* '2바퀴 + 6클릭' 같은 보조 표기 */
function rotText(g, v){
  if (!g.dial) return '';
  var n = Math.max(0, Math.round(v)), t = Math.floor(n/g.dial), c = n % g.dial;
  return t ? t + '바퀴 + ' + c + '클릭' : '';
}
function grinderById(id){ return GRINDERS.find(function(g){ return g.id === id; }) || GRINDERS[0]; }
