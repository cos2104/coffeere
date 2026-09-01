# 칼리타 웨이브 레시피 추가 준비 자료

조사 기준일: 2026-08-29  
대상 파일: `brew-dial.html`  
목적: 아직 HTML에 레시피를 추가하지 않고, 나중에 바로 구현할 수 있도록 155/185, 배전도, 분쇄도, 주수 궤적, 물줄기, 수위, 유량, 교반과 출처 근거를 분리해 보관한다.

## 1. 기록 원칙

- **출처 명시**: 원문에 직접 적힌 값이다.
- **계산**: 원문의 물량과 시간으로 계산할 수 있는 값이다.
- **구현 제안**: 현재 HTML의 어휘에 맞춘 변환이며 원문 표현은 아니다.
- **미확인**: 출처가 말하지 않은 값이다. 나중에 임의의 사실처럼 표시하지 않는다.
- 레시피의 배전도와 로스터 전체의 로스팅 성향을 구분한다.
- 분쇄도 원문이 `medium`, `medium-fine`처럼 정성 표현뿐이면, 앱용 μm는 반드시 `구현 제안`으로 표시한다.
- `155/185`가 원문에 없으면 원두량만 보고 확정하지 않고 `권장`으로 둔다.
- 이번에 검토한 자료에는 실제 주전자 높이(cm)나 시계/반시계 회전 방향을 명시한 레시피가 없었다. 따라서 둘 다 기본값 또는 미확인으로 둔다.

## 2. 현재 HTML에서 그대로 쓸 수 있는 필드

현재 `RECIPES` 객체의 기본 구조는 다음과 같다.

```js
{
  id, name, by, role,
  dripper, method, fit,
  dose, ratio, temp, um, tol, total,
  blurb,
  steps: c => [],
  tips: [],
  source
}
```

단계에서 현재 처리되는 필드는 다음과 같다.

```js
{
  at,       // 시작 시각(초)
  kind,     // bloom | pour | act | end
  label,
  to,       // 이번 주수량이 아닌 누적 물량
  dur,      // 주수 시간
  pat,      // PATTERNS 키
  stream,   // 물줄기 override
  height    // 커피층 위 물높이 override
}
```

현재 지원하는 물줄기는 `한 방울씩 / 가늘게 / 보통 / 굵게`이며 자동 계산 유량은 각각 1.5 / 4 / 6 / 9g/s이다.

현재 `height`는 **주전자를 드는 높이**가 아니라 커피층 위 **슬러리 수위**다. 값은 `낮게 / 보통 / 높게`다. 실제 붓는 높이는 레시피 전체의 `dropCm`로만 저장하지만, 현재의 2–3cm/5–8cm는 출처값이 아니라 방식별 UI 기본값이다. 원문이 높이를 밝히지 않았다면 `dropCm`를 출처 사실로 표시하지 않는다.

## 3. 나중에 추가할 메타데이터

아래 필드는 조사 자료에는 필요하지만 현재 HTML은 아직 표시하거나 계산하지 않는다.

```js
{
  waveSize: "155" | "185" | "both",
  waveSizeBasis: "explicit" | "recommended" | "unspecified",
  roastBasis: "explicit" | "roasterStyle" | "inferred" | "unspecified",
  sourceUrl: "https://...",
  sourceKind: "official" | "secondary" | "adapted",
  grindText: "원문 분쇄도 표현",
  pourEnd: 105,
  totalRange: [150, 240],
  flowRateGps: 5,
  flowDescriptor: "gentle | steady | slow | quick | heavy | aggressive",
  pourDurationSec: 20,
  spoutHeightCm: null,
  slurryLevel: "low | medium | high | cueText",
  triggerText: "수위가 커피층 위 약 2.5cm까지 내려오면",
  repeatRule: "30초마다 또는 수위가 1cm 내려갈 때",
  agitation: ["stir", "swirl", "tap", "none"],
  basis: "explicit | calculated | inferred | appDefault | unspecified",
  sourceVersion: "페이지 제목 또는 확인 날짜"
}
```

특히 `flowRateGps`는 `stream:"5g/s"`처럼 넣지 않는다. 현재 엔진은 그런 문자열을 유량으로 인식하지 못한다. 화면용 굵기는 기존 `stream`을 쓰고, 정확한 재현은 `dur` 또는 향후 `flowRateGps`로 처리한다.

## 4. 현재 주수 패턴과 변환 원칙

현재 9개 패턴은 다음처럼 사용한다.

- `bloom`: 뜸 나선. 베드 전체를 적시는 첫 주수.
- `drop`: 점드립. 연속 물줄기 없이 방울로 떨어뜨림.
- `coin`: 동전 서클. 중심 주위의 아주 작은 원.
- `smallCir`: 작은 나선. 반지름 절반 정도.
- `spiral`: 일반 나선. 중심에서 바깥 약 70%까지.
- `wide`: 넓은 나선. 바깥 약 85%까지, 보통 굵은 물줄기.
- `back`: 왕복 나선. 중심 → 바깥 → 중심.
- `ring`: 중심을 비운 원형 주수.
- `flood`: 굵은 물줄기로 한 번에 붓기.

원문의 `heavy spiral`은 반경이 넓다는 뜻이 아니라 **나선 경로에 강한 물줄기**를 결합한다는 뜻이다.

```js
{ pat:"spiral", stream:"굵게", height:"보통" }
```

원문의 `center to spiral`은 기존 `spiral`이 이미 중심에서 시작하므로 별도 패턴이 없어도 된다.

원문의 `spiral to center` 또는 `center → outside → center`는 `back`으로 매핑한다.

## 5. 추가가 필요한 주수 패턴

### 5.1 중앙 고정 주수 `center`

Onyx Southern Weather, Passenger 후반, Kurasu 마지막 주수에 필요하다. `coin`은 작은 원을 그리므로 중앙의 한 점에 계속 붓는 동작과 다르다.

```js
center: {
  label:"중앙 고정",
  stream:"가늘게",
  height:"낮게",
  rate:4,
  desc:"원을 그리지 않고 베드 중앙 한 점에 연속해서 붓습니다. 수위를 크게 올리지 않고 배출량과 주수량을 맞출 때 사용합니다."
}
```

`patternPath("center")`는 반지름 0–2px의 짧은 고정 궤적으로 그린다.

### 5.2 역나선 `inward`

Passenger의 “바깥에서 시작해 중앙으로 이동”하는 주수에 필요하다.

```js
inward: {
  label:"역나선",
  stream:"보통",
  height:"보통",
  rate:6,
  desc:"베드 바깥쪽에서 시작해 나선을 그리며 중앙으로 들어옵니다. 큰 용량에서 가장자리의 마른 가루를 먼저 적실 때 사용합니다."
}
```

`patternPath("inward")`는 `spiralD(30, 2, ...)` 형태로 그린다.

### 5.3 지점 선택 주수 `spot`

Stumptown의 “밝게 젖은 곳은 피하고 어둡고 마른 곳만 겨냥”하는 펄스에 필요하다. 고정된 나선 궤적이 아니라 상태를 보고 움직이는 주수다.

```js
spot: {
  label:"마른 지점 주수",
  stream:"가늘게",
  height:"낮게",
  rate:4,
  desc:"베드의 어둡고 마른 부분만 짧게 골라 붓고 이미 밝게 젖은 곳은 피합니다. 고정 궤적보다 베드 상태 관찰이 우선입니다."
}
```

시각화는 3–4개의 짧은 점선 이동으로 표현한다. 고정 궤적이 아니라는 설명도 함께 표시한다.

### 5.4 가장자리 훑기 `edgeRinse`

Madcap의 특정 250→300g 단계와 Passenger의 3차 주수처럼 필터와 베드 경계를 짧게 훑는 동작이다. 평소 나선과 구별하되, 필터 벽에 장시간 직접 붓는 동작으로 오해되지 않게 설명한다.

```js
edgeRinse: {
  label:"가장자리 훑기",
  stream:"가늘게",
  height:"보통",
  rate:4,
  desc:"필터와 커피층 경계를 한 바퀴만 짧게 훑은 뒤 즉시 원래 주수로 돌아옵니다. 가장자리에 계속 붓는 패턴이 아닙니다."
}
```

### 5.5 지그재그 `zigzag`

Vibrant의 첫 주수처럼 빠르게 전 베드를 적실 때 원문이 나선과 함께 허용하는 별도 선택지다. 좌우 왕복선으로 표시하고, `back`의 원형 왕복 나선과 구분한다.

### 5.6 가장자리 후 중앙 `edgeCenter` — 복합 동작

Passenger 3차처럼 `edgeRinse` 직후 `center`로 전환하는 복합 동작이다. 정확한 가장자리 물량이 출처에 없으므로 별도 단일 패턴보다 단계 설명과 애니메이션용 복합 궤적으로 두는 편이 안전하다.

## 6. 기존 칼리타 레시피의 물줄기·출처 점검

- **전주연** ([2차 정리](https://coffee4m.com/%EC%B9%BC%EB%A6%AC%ED%83%80-%EC%9B%A8%EC%9D%B4%EB%B8%8C-%EB%93%9C%EB%A6%AC%ED%8D%BC-%EB%A0%88%EC%8B%9C%ED%94%BC/)): 중강배전은 출처 명시. 20g/200g/90℃이며 0:00, 0:45, 1:10, 1:35, 1:53에 각 40g을 붓는다. 유량은 4/4/4/5/8g/s로 명시 또는 시간에서 계산된다. 처음 두 원형 주수의 반경 차이와 후반 물줄기 강화는 근거가 있지만, 현재 HTML의 마지막 `wide`는 근거가 없다. 사이즈·주전자 높이는 미지정이다.
- **라이트업** ([공식 가이드](https://lightupcoffee.com/blogs/brew-guide/drip-kalitawave)): 공식 최신판은 15g/240g/90℃, 누적 35/90/140/190/240g을 0:00/0:30/1:00/1:30/1:50에 붓는다. 본 주수는 원형으로 각 약 10초, 마지막에 드리퍼를 부드럽게 흔들고 2:30–3:00에 마친다. 현재 HTML의 4회 주수와 누적량은 수정 대상이다. 155와 약배전은 각각 용량·로스터 성향에 따른 추정이다.
- **2·5·5**: 공개 원출처를 찾지 못해 `local/adapted`로 둔다. 기본 20g은 로컬 설명상 155, 30–50g 스케일은 185다. 뜸은 원두×2, 이후 낮은 슬러리 수위를 유지하며 동전 크기 원으로 누적 100g까지 60초간 연속 주수한다. 현재 엔진이 계산하는 뜸 시간과 2–3cm는 출처값이 아니다.
- **쿠라스 2023** ([공식 가이드](https://jp.kurasu.kyoto/blogs/kurasu-journal/how-to-brew-with-kalita-wave-by-kurasu-kyoto-2023)): 공식 문맥은 14g/200g의 155이며, 두 배 레시피에는 185를 권장한다. 약배전 원두를 명시한다. 0:00→30g 전 베드, 0:40→60g 전 베드에 강하게, 1:10→200g은 가는 `center` 고정 연속 주수다. 마지막 `coin`과 8/8/35초는 출처 사실이 아니다. 교반 없이 2:05–2:15 종료한다.
- **매드캡 185** ([공식 가이드](https://www.madcapcoffee.com/blogs/news/how-we-brew-kalita-185-recipe)): 21g/355g, 배전 미지정. 0:00→50g, 0:15→100g 후 수위가 커피층 아래로 내려가기 시작할 때마다 약 50g씩 붓는다. 일반 주수는 중앙에서 바깥으로 느린 원, 250→300g에서만 필터 주름을 한 바퀴 훑고 마지막 +55g이다. 현재 HTML의 고정 시각과 8–9초는 구현 근사치다.
- **약배전 웨이브 185/피에르**: 신뢰할 만한 원출처를 찾지 못해 전체를 `secondaryUnverified`로 둔다. 25g/400g, 40초마다 100g, 3:45라는 로컬 요약 외에 96℃·각 15초·나선 반경은 검증되지 않았다.
- **라오 웨이브** ([영상 기반 2차 정리](https://www.timer.coffee/recipes/kalita-wave/scott-rao-kalita-wave-recipe/)): 검증 가능한 정리본은 20g/340g/95℃, 0:00→60g, 0:10 작은 스핀, 0:45→204g, 반쯤 배수 후 1:55→340g, 2:05 부드러운 스핀, 4:20 종료다. 경로·유량·높이·배전은 미지정이다. 현재 HTML의 22g/360g/연속 동전 서클/3:30은 변형이므로 `라오 스타일 웨이브`로 이름을 바꾸거나 검증본으로 교체한다.

## 7. 추가 후보 레시피별 준비 정보

### 7.1 Vibrant Coffee Kalita Wave 155

- 상태: 구현 가능. 단, 마지막 주수 시작 시각과 총 완료 시간은 조건부다.
- 사이즈: `155` — 출처 명시.
- 배전도: `light` 권장 — 로스터 성향 기반이며 레시피 본문에는 배전도 미명시.
- 원두/물: 15g / 250g, 1:16.67.
- 온도: 210–211°F, 약 99–99.4℃.
- 분쇄 원문: table salt, medium-fine.
- 앱 시작 입도 제안: `um:850, tol:70`. 출처 수치가 아닌 구현 제안.
- 총 시간: 미지정. 출처는 미분량에 따라 크게 달라지며 총 시간을 좇지 말라고 안내한다.

주수 준비:

1. `0:00`, 누적 45g: 전체 베드를 빠른 나선 또는 지그재그로 강하게 적신다.
   - 매핑: `pat:"wide"`, `stream:"굵게"`, `height:"보통"`.
   - 교반: 마른 덩어리가 남을 때만 스푼으로 뒤집거나 잘게 푼다.
   - 정확한 유량: 미지정.
2. `0:40–1:01`, 누적 150g: 원형/나선 주수.
   - 매핑: `pat:"spiral"`, `stream:"보통"`, `height:"보통"`, `dur:21`.
   - 출처 명시 유량: 5g/s.
3. 시작 조건: 수위가 커피층 위 약 1인치(2.5cm)까지 내려오면 누적 250g.
   - 매핑: `pat:"spiral"`, `stream:"보통"`, `height:"보통"`.
   - 출처 명시 유량: 4–5g/s.
4. 마지막: 드리퍼를 부드럽게 스월한다.

HTML 누적량 식 제안: `c.dose*3`, `c.water*0.6`, `c.water`.

출처: https://www.vibrantcoffeeroasters.com/kalitawave155

### 7.2 Coffee Collective Small Kalita

- 상태: 주수 종료 시각까지 구현 가능. 최종 배수 완료 시각은 미지정.
- 사이즈: `155` — 공식 가이드 명시.
- 배전도: 공식 레시피에는 미명시. 로스터 성향상 `light`, 현재 앱 분류에는 `mlight` 시작점 제안.
- 원두/물: 16g / 250g, 1:15.625.
- 온도: 92–95℃.
- 분쇄 원문: medium/filter.
- 앱 시작 입도 제안: `um:900, tol:80`.
- 본 주수 종료: 1:45.

주수 준비:

1. `0:00`, 누적 30g: 전체를 적시고 30초 뜸.
   - 매핑: `pat:"bloom"`, `stream:"가늘게"`, `height:"낮게"`.
2. `0:30–1:45`, 누적 250g: 중앙에서 바깥으로, 다시 중앙으로 반복하며 느리고 일정하게 붓는다.
   - 매핑: `pat:"back"`, `stream:"가늘게"`, `height:"보통"`, `dur:75`.
   - 계산 유량: 약 2.93g/s.
3. 마지막 quick stir는 드리퍼의 커피층이 아니라 서버/컵의 추출된 음료를 섞는 동작이다.

HTML 누적량 식 제안: `c.dose*1.875`, `c.water`.

출처: https://coffeecollective.dk/pages/brew-guide/kalita-wave

### 7.3 Coffee Collective Large Kalita

- 상태: Small과 별도 레시피 객체로 등록해야 한다. 같은 객체를 2배 용량으로 바꾸면 현재 엔진이 `dur`도 2배로 늘려 원문의 동일한 1:45 주수 시간을 깨뜨린다.
- 사이즈: `185` — 공식 가이드 명시.
- 배전도: 공식 레시피에는 미명시. 로스터 성향상 `light`, 현재 앱 분류에는 `mlight` 시작점 제안.
- 원두/물: 32g / 500g, 1:15.625.
- 온도: 92–95℃.
- 분쇄 원문: medium/filter.
- 앱 시작 입도 제안: `um:950, tol:80`.
- 본 주수 종료: 1:45.

주수 준비:

1. `0:00`, 누적 60g: 30초 뜸.
   - 매핑: `pat:"bloom"`, `stream:"보통"`, `height:"낮게"`.
2. `0:30–1:45`, 누적 500g: 왕복 나선을 일정하게 유지한다.
   - 매핑: `pat:"back"`, `stream:"보통"`, `height:"보통"`, `dur:75`.
   - 계산 유량: 약 5.87g/s.
3. 마지막 quick stir는 드리퍼의 커피층이 아니라 서버/컵의 추출된 음료를 섞는 동작이다.

출처: https://coffeecollective.dk/pages/brew-guide/kalita-wave

### 7.4 Passenger Two-Cup Kalita

- 상태: 구현 가능. `inward`, `center`가 필요하고 3차는 복합 동작이다.
- 사이즈: `185` 권장 — 30g/470g의 공식 2컵 레시피.
- 배전도: `light` — Passenger가 자사 커피를 주로 약배전이라고 공식 설명.
- 원두/물: 30g / 470g, 1:15.67.
- 온도: 210°F, 약 99℃.
- 분쇄: 공식 가이드에서 미확인.
- 앱 시작 입도 제안: `um:950, tol:90`. 반드시 미확인/테스트 필요 표시.
- 총 시간: 2:30–4:00.

주수 준비:

1. `0:00`, 누적 80g: 빠른 나선으로 전체를 적신다.
   - 매핑: `pat:"wide"`, `stream:"굵게"`, `height:"보통"`.
2. `0:40`, 누적 270g: 바깥에서 중앙으로 들어오는 나선을 반복한다.
   - 매핑: 새 `pat:"inward"`, `stream:"굵게"`, `height:"보통"`.
3. `1:20`, 누적 370g: 필터와 베드의 경계를 잠깐 적셔 높은 가루를 내린 뒤 멈추지 않고 중앙 고정으로 전환한다.
   - 매핑: `edgeCenter` 또는 `wide` 동작 설명 후 `center`.
   - 후반 유량은 느리게 유지한다.
4. `1:50`, 누적 470g: 중앙에 일정하게 붓는다.
   - 매핑: 새 `pat:"center"`, `stream:"가늘게"`, `height:"낮게"`.
5. 스월·저어주기·탭은 초보자에게 권하지 않는다.

HTML 누적량 식 제안: `c.dose*(8/3)`, `c.water*(270/470)`, `c.water*(370/470)`, `c.water`.

출처: https://drinkpassenger.com/guides/kalita-wave

### 7.5 Stumptown Kalita Wave

- 상태: 첫 두 주수는 정확히 구현 가능. 후반 펄스의 횟수·개별 물량은 출처가 범위만 제시한다.
- 사이즈: `both`, 185 권장.
- 배전도: `medium`을 중립 시작점으로 사용하되 원문은 배전도 미지정.
- 원두/물: 21g / 345g, 1:16.43.
- 온도: 205°F, 약 96℃.
- 분쇄 원문: medium-fine, sea salt.
- 앱 시작 입도 제안: `um:850, tol:70`.
- 총 시간: 2:45–3:00.

주수 준비:

1. `0:00–0:10`, 누적 60g: 전체를 적신 뒤 부드럽게 저어 마른 가루를 없앤다.
   - 매핑: `pat:"bloom"`, `stream:"보통"`, `height:"낮게"`, `dur:10`.
2. `0:45–1:00`, 누적 200g: 느린 나선.
   - 매핑: `pat:"spiral"`, `stream:"굵게"`, `height:"보통"`, `dur:15`.
   - 계산 유량: 약 9.33g/s. 원문 표현은 “slow spiral”이므로 속도는 이동 속도가 느리다는 의미로 해석해야 한다.
3. `1:00–2:00`, 누적 345g: 25–50g씩 작은 펄스를 반복한다.
   - 매핑: 새 `pat:"spot"`, `stream:"가늘게"`, `height:"낮게"`.
   - 베드의 어둡고 마른 곳을 겨냥하고 밝게 젖은 곳은 피한다.
   - 정확한 펄스 분할은 미확인. 임의의 동일 분할을 공식값처럼 저장하지 않는다.

출처: https://www.stumptowncoffee.com/pages/brew-guide-kalita-wave

### 7.6 Counter Culture Quick + Easy Kalita

- 상태: 구현 가능. 후반은 시간 또는 수위 조건 중 먼저 충족하는 방식이다.
- 사이즈: `185` 권장.
- 배전도: `medium` 중립 시작점. 공식 레시피에는 배전도 미지정.
- 원두/물: 30g / 500g, 공식 표기는 약 1:17.
- 온도: 200°F, 약 93℃.
- 분쇄 원문: medium, kosher salt보다 조금 가늘게.
- 앱 시작 입도 제안: `um:900, tol:80`.
- 총 시간: 3:30–4:00.

주수 준비:

1. `0:00`, 누적 60g: 뜸.
   - 매핑: `pat:"bloom"`, `stream:"보통"`, `height:"낮게"`.
2. `0:30`, 누적 200g: 원형 주수.
   - 매핑: `pat:"spiral"`, `stream:"보통"`, `height:"보통"`.
3. `1:00`, 누적 300g: 수위가 약 1cm 내려오면 원형 주수.
   - 매핑: `pat:"spiral"`, `stream:"보통"`, `height:"보통"`.
4. 이후 30초마다 또는 수위가 1cm 내려올 때 같은 원형 펄스를 반복해 500g에 도달한다.
   - 개별 후반 누적량은 원문이 특정하지 않는다.

출처: https://counterculturecoffee.com/pages/quick-easy-pour-over

### 7.7 Onyx Monarch Kalita Wave 185

- 상태: 가장 구조화가 잘 되어 있어 바로 구현 가능.
- 사이즈: `185` — 출처 명시.
- 배전도: `dark` — 공식 분류 `Expressive Dark`.
- 원두/물: 25g / 400g, 1:16.
- 온도: 200°F, 약 93℃.
- 분쇄: 600μm — 출처 명시.
- 앱 값: `um:600, tol:50` 제안. 중심값만 공식이고 허용폭은 구현 제안.
- 총 시간: 3:30.

주수 준비:

1. `0:00`, 누적 50g: `bloom`, 보통, 낮게.
2. `0:30`, 누적 160g: `wide`, 굵게, 보통. 원문 `Heavy Spiral Pour`.
3. `0:45`, 누적 220g: `spiral`, 보통, 보통.
4. `1:05`, 누적 280g: `spiral`, 보통, 보통.
5. `1:30`, 누적 340g: `spiral`, 보통, 보통.
6. `2:00`, 누적 400g: `spiral`, 보통, 보통.
7. `3:30`: 배수 완료.

HTML 누적량 식 제안: `c.dose*2`, `c.water*0.4`, `c.water*0.55`, `c.water*0.7`, `c.water*0.85`, `c.water`.

출처: https://onyxcoffeelab.com/products/monarch

### 7.8 Onyx Southern Weather Kalita Wave 185

- 상태: `center` 패턴을 추가하면 바로 구현 가능.
- 사이즈: `185` — 출처 명시.
- 배전도: `medium` — 공식 분류 `Moderate`.
- 원두/물: 25g / 300g, 1:12.
- 온도: 200°F, 약 93℃.
- 분쇄: 650μm — 출처 명시.
- 앱 값: `um:650, tol:50` 제안.
- 총 시간: 2:30.

주수 준비:

1. `0:00`, 누적 40g: `bloom`, 보통, 낮게.
2. `0:30`, 누적 120g: 새 `center`, 가늘게, 낮게.
3. `0:50`, 누적 180g: `spiral`, 보통, 보통.
4. `1:10`, 누적 240g: `spiral`, 보통, 보통.
5. `1:30`, 누적 300g: `spiral`, 보통, 보통.
6. `2:30`: 배수 완료.

HTML 누적량 식 제안: `c.dose*1.6`, `c.water*0.4`, `c.water*0.6`, `c.water*0.8`, `c.water`.

출처: https://onyxcoffeelab.com/products/southern-weather

### 7.9 George Howell Six Timed Pulses

- 상태: 바로 구현 가능. 출처는 Prima Coffee의 비교·재현 자료로 2차 출처다.
- 사이즈: `185` 권장.
- 배전도: `medium` 중립 시작점. 원문 미지정.
- 원두/물: 25–28g / 390g. 앱 기준은 25g / 390g, 1:15.6을 권장하고 28g은 강한 버전으로 팁에 둔다.
- 온도: 201–205°F, 약 94–96℃.
- 분쇄 원문: Baratza Encore 14/40, medium-fine.
- 앱 환산 시작점 제안: `um:670, tol:60`. Encore 14를 현재 앱 곡선으로 역환산한 값.
- 총 시간: 3:30.

주수 준비:

- 65g씩 6회, 각 15초 주수 후 15초 대기.
- 시작 시각: `0:00 / 0:30 / 1:00 / 1:30 / 2:00 / 2:30`.
- 누적량: `65 / 130 / 195 / 260 / 325 / 390g`.
- 모든 주수는 중앙 → 바깥 → 중앙.
- 매핑: 전 단계 `pat:"back"`, `stream:"가늘게"`, `height:"보통"`, `dur:15`.
- 출처 명시/계산 유량: 65g ÷ 15초 = 약 4.33g/s.
- 첫 65g은 별도 뜸 단계라고 명시되지는 않지만 첫 30초가 사실상 프리인퓨전 역할을 한다.

HTML에서는 `const u = c.water/6`으로 생성한다.

출처: https://prima-coffee.com/learn/article/brewing-guides/comparing-kalita-wave-recipes/33005

### 7.10 Sprudge Big Batch Kalita 185

- 상태: 원문만으로는 정확한 타이머 단계 분할이 불가능하다. 일반 가이드 카드로는 가능하지만 자동 타이머용으로 넣으려면 편집 가정이 필요하다.
- 사이즈: `185` — 출처 명시.
- 배전도: `medium` 중립 시작점. 원문 미지정.
- 원두/물: 40g / 640g, 1:16.
- 온도: 205°F, 약 96℃.
- 분쇄 원문: medium.
- 앱 시작 입도 제안: `um:900, tol:80`.
- 주수 종료: 약 3:30.
- 배수 완료: 추가 약 1분, 총 약 4:30.

주수 준비:

1. `0:00`, 누적 80g: 전체를 적신 후 젓가락 등으로 부드럽게 교반.
   - 매핑: `pat:"bloom"`, `stream:"보통"`, `height:"낮게"`.
2. `0:30–3:30`, 남은 560g: 중앙에서 시작해 바깥으로 나선을 그리며 간헐적으로 붓고 수위를 일정하게 유지.
   - 매핑: `pat:"spiral"`, `stream:"보통"`, `height:"보통"`.
   - 펄스별 물량과 시작 시각은 미지정.
3. 마지막 배수 때 드리퍼를 서버에 가볍게 탭한다.

출처: https://sprudge.com/how-to-brew-with-a-kalita-wave-coffee-maker-162968.html

### 7.11 Counter Culture Flash Brew — 현재판과 구형판 분리

두 공식 버전은 얼음 투입 시점·뜨거운 물량·세부 단계가 다르므로 한 레시피로 합치지 않는다.

#### A. 현재 독립 가이드 — Wave 적용 후보

- 상태: 공식 세부 단계는 충분하지만 드리퍼가 `brewer of choice`이므로 칼리타 전용으로 넣을 때 `sourceKind:"adapted"`로 표시한다.
- 사이즈: `both/unspecified`. 155나 185를 원문이 지정하지 않는다.
- 배전도: 원문 미지정.
- 원두: 30g.
- 최종 물량: 500g, 약 1:16.67.
- 뜨거운 물: 335g. `ratio = 11.1667`.
- 서버에 먼저 넣는 얼음: 165g. `iceMul = 5.5`.
- 온도: 200°F, 약 93℃.
- 분쇄 원문: medium-fine, table salt.
- 앱 시작 입도 제안: `um:850, tol:70` — 구현 제안.

주수 준비:

1. `0:00`, 누적 30g: 전체 적심.
2. `0:30`, 누적 100g: 원형 주수.
3. `1:00`, 누적 200g: 원형 주수.
4. 이후 30초마다 또는 수위가 약 1cm 내려갈 때마다 원형 주수하여 누적 335g.
5. 정확한 마지막 주수 시각과 총 완료 시간은 원문 미지정이다. 페이지 일부의 `Time 1:00` 표시는 이 단계들과 양립하지 않으므로 총 시간으로 사용하지 않는다.

출처: https://counterculturecoffee.com/pages/flash-brew

#### B. 구형 Kalita 185 블로그 버전 — 보존용

- 185 명시, 원두 30g, 뜨거운 물 365g + **추출 후** 얼음 135g, 약 3:30.
- 물이 적으므로 평소 칼리타 단계대로 더 천천히 붓는다고만 하며, 세부 누적량과 경로는 없다.
- 현재판과 다른 별도 버전으로 보존하고, 세부 원형 펄스를 현재판에서 가져와 합치지 않는다.

출처: https://counterculturecoffee.com/blogs/counter-culture-coffee/guide-to-flash-brew-coffee

## 8. 구현 우선순위

### 1차 — 사실값이 충분한 레시피

- Onyx Monarch 185
- Onyx Southern Weather 185
- George Howell Six Timed Pulses 185
- Coffee Collective Small 155
- Coffee Collective Large 185

### 2차 — 조건부 시작이나 새 패턴이 필요한 레시피

- Vibrant 155
- Passenger Two-Cup 185
- Stumptown
- Counter Culture Quick + Easy

### 3차 — 타이머 분할에 편집 가정이 필요한 레시피

- Sprudge Big Batch 185
- Counter Culture Flash Brew (현재판 Wave 적용)

## 9. 구현 전 확인할 사항

- `waveSize` 배지를 목록과 상세 화면 중 어디에 표시할지 결정한다.
- `155 / 185 / 공용` 필터를 칼리타 내부 보조 필터로 넣을지 결정한다.
- 새 `center / inward / spot / edgeRinse / zigzag` 패턴을 `PATTERNS`와 `patternPath()` 양쪽에 추가한다.
- 단계별 실제 붓는 높이가 필요하면 `step.spoutHeightCm`를 별도로 추가한다. 출처가 없을 때는 기존 `dropCm` UI 기본값을 사실값으로 승격하지 않는다.
- 고정 시각이 아닌 조건부 주수를 위해 `triggerText`를 타임라인에 함께 표시한다.
- 완료 시간 범위를 위해 `totalRange` 또는 `totalMin/totalMax` 표시를 추가한다.
- 출처의 정확한 유량을 보존하려면 `flowRateGps`를 추가하고 `dur = add / flowRateGps` 계산을 지원한다.
- `Coffee Collective Large`처럼 원두량을 늘려도 동일한 주수 시간을 쓰는 레시피를 위해 `durFixed:true` 지원을 검토한다.
- 앱용 μm가 출처 실측인지 내부 환산인지 UI에서 구분한다.

## 10. 출처 신뢰도 메모

- 공식: Vibrant, Coffee Collective, Passenger, Stumptown, Counter Culture, Onyx, Sprudge 자체 가이드.
- 2차 재현: George Howell은 Prima Coffee가 원 레시피를 비교·재현한 자료.
- 버전 분리: Counter Culture Flash Brew는 현재 독립 가이드와 구형 Kalita 185 블로그판을 합치지 않는다.
- 기존 `2·5·5`, `약배전 웨이브 185/피에르`는 원출처가 부족하고, `라오 웨이브`는 현재 값이 검증본과 달라 명칭 또는 내용 보강이 필요하다.
- 검토한 레시피 모두 실제 주전자 높이(cm)와 회전 방향은 미기재였다. 이 값은 `unspecified`로 보존한다.
