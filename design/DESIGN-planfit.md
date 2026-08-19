---
name: planfit-inspired-mobile-ui
description: >-
  플랜핏(Planfit) 앱 사례에서 관찰되는 다크모드 기반의 집중형 모바일 UI/UX 언어를
  재사용 가능한 디자인 규칙으로 변환한 스킬. 개인화 온보딩, 대시보드, 실행형 루틴,
  데이터 분석, 커뮤니티, 기록/프로필 화면을 설계할 때 사용한다.
version: 1.0
language: ko-KR
reference_snapshot: "WWIT Planfit case, 2023-07-24"
---

# Planfit-inspired Mobile App Design Skill

## 0. 이 스킬의 목적

이 스킬은 플랜핏 앱 사례에서 관찰되는 **어두운 배경, 민트/터콰이즈 포인트, 큰 실행 버튼, 카드 기반 정보 구조, 개인화된 단계형 UX, 데이터 시각화, 운동 실행에 집중시키는 인터랙션**을 하나의 재사용 가능한 디자인 시스템으로 정리한 것이다.

다른 서비스에 적용할 때 플랜핏의 로고, 고유 일러스트, 캐릭터, 실제 문구, 화면을 그대로 복제하지 않는다. 대신 아래의 **시각적 원리와 UX 패턴**을 대상 서비스의 브랜드와 기능에 맞게 재해석한다.

> 이 문서의 색상값과 수치는 공개 화면을 바탕으로 재구성한 **reference-derived approximate tokens**이며, 플랜핏의 공식 디자인 시스템 값이 아니다.

---

# 1. Core Design DNA

디자인의 핵심은 다음 7가지다.

1. **Dark-first**  
   메인 경험은 짙은 차콜 배경 위에서 전개한다. 화면이 어두워도 정보 위계는 명확해야 한다.

2. **One strong accent**  
   핵심 행동, 선택 상태, 진행 상태에는 선명한 민트/터콰이즈 계열을 집중적으로 사용한다.

3. **Action before decoration**  
   장식보다 “지금 무엇을 해야 하는가”가 먼저 보이게 한다. 주요 CTA는 화면에서 즉시 식별되어야 한다.

4. **Cardized information**  
   일정, 루틴, 운동, 기록, 회복도, 데이터 등 복합 정보를 카드 단위로 분리한다.

5. **Progressive personalization**  
   한 화면에서 많은 정보를 묻지 않고, 사용자 선택을 단계적으로 수집한다.

6. **Data as motivation**  
   차트와 기록은 분석 보고서처럼 복잡하게 보여주기보다 “변화와 다음 행동”을 쉽게 읽게 한다.

7. **Focused execution mode**  
   실제 행동을 수행하는 화면에서는 정보량을 줄이고, 숫자·상태·다음 행동을 크게 보여준다.

---

# 2. Overall Visual Direction

## 2.1 무드

- Modern
- Athletic
- Focused
- Confident
- Functional
- Data-driven
- Energetic but not noisy

피해야 할 방향:

- 지나치게 화려한 네온 효과
- 여러 강조색을 동시에 사용하는 게임형 UI
- 그림자와 글로우가 과도한 사이버펑크 스타일
- 카드마다 다른 장식 언어
- 정보보다 그래픽이 먼저 보이는 구성

---

# 3. Color System

## 3.1 Reference-derived Palette

```css
:root {
  --bg-base: #232428;
  --bg-deep: #1D1E22;
  --surface-1: #2B2D31;
  --surface-2: #35373C;
  --surface-3: #3C3D42;

  --primary: #1BEFCA;
  --primary-strong: #20D5B4;
  --primary-muted: #19413D;

  --text-primary: #F6F6F7;
  --text-secondary: #A4A5A6;
  --text-tertiary: #7C7D81;
  --text-disabled: #5C5D61;

  --border-subtle: #3C3D42;
  --divider: #505157;

  --success: #1BEFCA;
  --warning: #F5C451;
  --danger: #FF6B6B;
}
```

## 3.2 색상 사용 규칙

### Primary Accent
사용:
- 핵심 CTA
- 선택된 탭
- 활성 필터
- 진행률
- 핵심 수치
- 현재 선택 상태
- 데이터 그래프의 대표 라인

사용 금지:
- 모든 제목
- 모든 아이콘
- 모든 카드 배경
- 단순 장식 요소

### Background
기본 화면은 `--bg-base` 또는 `--bg-deep`을 사용한다.

### Surface
카드끼리 위계를 구분해야 할 때만 2~3단계 surface를 사용한다.

### Text
본문은 완전한 흰색보다 약간 부드러운 오프화이트를 사용하고, 보조 정보는 회색 단계로 명확히 분리한다.

---

# 4. Typography System

## 4.1 폰트 방향

한국어 모바일 UI에서는 다음 계열을 우선한다.

```text
Pretendard
SUIT
Apple SD Gothic Neo
Noto Sans KR
system-ui
```

영문/숫자는 시스템 산세리프와 자연스럽게 혼용한다.

## 4.2 Type Scale

```text
Display        32–36px / 700–800 / 1.20
Screen Title   24–28px / 700 / 1.25
Section Title  18–20px / 700 / 1.35
Card Title     16–18px / 600–700 / 1.40
Body           14–16px / 400–500 / 1.55
Caption        12–13px / 400–500 / 1.45
Metric Large   32–48px / 700–800
Button         15–17px / 600–700
```

## 4.3 타이포그래피 규칙

- 한 화면에서 굵기 종류는 가급적 3개 이하로 제한한다.
- 숫자 데이터는 본문보다 한 단계 크게 설계한다.
- 화면 타이틀은 짧고 단정하게 만든다.
- 설명문은 2~3줄을 넘기지 않는다.
- 숫자 + 단위는 시각적으로 하나의 덩어리로 보이게 한다.
- CTA 라벨은 명사보다 행동형 문구를 우선한다.

예:

```text
추천 루틴 시작하기
오늘 기록 완료하기
내 플랜 확인하기
다음 단계로
```

---

# 5. Spacing & Grid

## 5.1 기본 Grid

```text
Mobile reference width: 360–430px
Horizontal page padding: 20px
Compact padding: 16px
Section gap: 28–32px
Card gap: 12–16px
Inline gap: 8–12px
```

## 5.2 4pt 기반 간격 시스템

```text
4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48
```

특별한 이유가 없다면 임의의 13px, 19px, 27px 같은 값을 만들지 않는다.

---

# 6. Radius, Border, Elevation

## 6.1 Radius

```text
Small control: 8–10px
Input / chip: 10–12px
Card: 12–16px
Primary CTA: 10–14px
Media card: 14–18px
```

## 6.2 Shadow

다크 UI에서는 강한 drop shadow보다 **surface contrast + subtle border**를 사용한다.

```css
box-shadow: 0 4px 16px rgba(0,0,0,.12);
border: 1px solid rgba(255,255,255,.04);
```

카드가 배경과 충분히 구분된다면 그림자는 생략한다.

---

# 7. Iconography

## 스타일

- 단순한 line icon
- 20–24px 기본
- stroke 1.75–2px
- 둥근 line cap
- 흰색/회색 기본, 활성 상태만 primary

권장:
- Lucide
- Material Symbols Rounded
- SF Symbols 계열의 간결한 아이콘 언어

피해야 할 것:
- 3D 아이콘과 line icon 혼용
- 컬러 아이콘 난립
- 동일한 의미에 서로 다른 스타일의 아이콘 사용

---

# 8. Navigation

## 8.1 Bottom Navigation

4~5개 핵심 메뉴까지만 배치한다.

예:

```text
홈 / 분석 / 커뮤니티 / 기록 / 마이
```

규칙:
- inactive: 회색 아이콘 + 회색 라벨
- active: primary 아이콘 + primary 또는 white 라벨
- 아이콘과 라벨을 함께 제공
- 안전 영역 포함 최소 높이 72–84px

## 8.2 Top App Bar

구성:

```text
[Back]  Screen title                       [Action]
```

또는 홈에서는:

```text
Context selector                           Premium / Menu / Settings
```

화면 상단을 버튼으로 과밀하게 만들지 않는다.

---

# 9. Component Library

## 9.1 Primary CTA

```text
Height: 52–56px
Radius: 10–14px
Background: primary
Text: #121315
Weight: 700
Width: full or near-full
```

사용 목적:
- 시작
- 완료
- 다음
- 저장
- 추천 실행

한 화면에 강한 Primary CTA는 원칙적으로 하나만 둔다.

## 9.2 Secondary Button

```text
Background: surface-2
Text: text-primary
Border: optional subtle border
```

## 9.3 Ghost Button

텍스트 + 아이콘으로 제공하고 보조 행동에만 사용한다.

예:

```text
루틴 수정
가이드 보기
더보기
```

## 9.4 Selection Card

개인화 질문에 사용한다.

구조:

```text
┌────────────────────────────┐
│ 선택 항목명                 │
│ 짧은 설명                   │
└────────────────────────────┘
```

선택 전:
- surface 배경
- 흰색 제목

선택 후:
- primary background 또는 primary border
- 명확한 체크/상태 표시

하나의 카드에 설명을 2줄 이상 길게 넣지 않는다.

## 9.5 Metric Card

```text
label
42 min
+8% vs last week
```

정보 위계:
1. 수치
2. 의미
3. 비교/상태

## 9.6 Exercise / Task Card

```text
[thumbnail/icon]  항목명
                  세트 · 횟수 · 부가정보
                                    [more]
```

실행 가능한 카드라면 눌렀을 때 무엇이 일어나는지 명확해야 한다.

## 9.7 Filter Chip

```text
[60분⌄] [컨디션 100%⌄] [모든 운동⌄]
```

- 32–40px height
- pill 또는 rounded rectangle
- 선택 상태를 과하게 강조하지 않는다.

## 9.8 Progress Bar

온보딩과 단계형 작업에 사용한다.

```text
──────────── active ━━━━━ remaining ───────
```

- 매우 얇게 3–4px
- active는 primary
- 화면 최상단에서 진행 감각을 제공

---

# 10. Screen Pattern 01 — Onboarding

## 목적

사용자로부터 개인화에 필요한 정보를 **빠르고 부담 없이** 수집한다.

## 기본 구조

```text
[Progress]

Screen label
질문 제목
보조 설명

[선택 카드]
[선택 카드]
[선택 카드]

               또는

[입력/선택 컨트롤]

[다음]
```

## 핵심 규칙

- 질문 하나 = 화면 하나를 기본으로 한다.
- 선택지가 적으면 카드형, 많으면 목록/검색형으로 변형한다.
- 문항 성격에 따라 UI 레이아웃을 유연하게 바꾼다.
- 사용자가 “왜 이 정보를 묻는지” 이해할 수 있는 짧은 보조 설명을 제공한다.
- 현재 선택 상태는 즉시 시각적으로 확인되어야 한다.
- 다음 버튼은 선택 전 disabled, 선택 후 primary 활성화 패턴을 사용할 수 있다.

## AI 설계 지시문

```text
Design a progressive onboarding screen in a dark athletic mobile UI.
Show one question per screen, use large readable option cards,
a thin teal progress indicator at the top, and one dominant CTA at the bottom.
Keep copy concise and make the selected state unmistakable.
```

---

# 11. Screen Pattern 02 — Home Dashboard

## 목적

앱을 연 사용자가 3초 안에 다음 세 가지를 이해하게 한다.

1. 오늘 해야 할 일
2. 현재 상태
3. 바로 실행할 행동

## 구조 예시

```text
[상단 컨텍스트 / 상태]

[오늘의 메인 카드]
오늘의 계획
짧은 설명
[설정/필터]

[추천 콘텐츠/루틴]
card | card

[PRIMARY CTA]

[보조 행동]
```

## 설계 원칙

- 홈은 콘텐츠 포털이 아니라 **다음 행동 결정 화면**으로 설계한다.
- 첫 화면 상단 60% 안에 핵심 CTA가 보이게 한다.
- 추천 이유가 있다면 한 문장으로 설명한다.
- 사용자가 자주 바꾸는 조건은 chip/filter로 노출한다.

---

# 12. Screen Pattern 03 — Execution / Workout Mode

## 목적

사용자가 실제 행동을 수행하는 동안 판단 부담을 최소화한다.

## 구조

```text
[Back]                       [More]

현재 항목명
시각 가이드 / 미디어

현재 세트 또는 단계
[무게]   [횟수]

다음 휴식 시간
00:59

[완료]
```

## UX 규칙

- 현재 단계만 크게 보여준다.
- 타이머, 세트, 횟수, 다음 행동은 숫자를 크게 표시한다.
- 주요 행동은 하단 고정 CTA로 제공할 수 있다.
- 중단, 교체, 삭제는 secondary action에 둔다.
- 실수 방지를 위해 위험 행동은 `More` 또는 confirmation 패턴을 사용한다.

## 디자인 원칙

Execution Mode에서는 홈보다 정보 밀도를 낮춘다.

```text
Dashboard density > Execution density
```

---

# 13. Screen Pattern 04 — Analysis

## 목적

복잡한 데이터를 보여주는 것이 아니라 사용자가 **변화와 의미를 읽게 하는 것**이다.

## 구조

```text
분석

최근 7일
[무게 | 칼로리 | 시간]

[Line chart]

핵심 요약
이번 주 +12%

[회복/상태 카드]
[부위별 상태]
```

## Chart Rules

- 한 차트에 핵심 라인은 1개를 기본으로 한다.
- primary color는 가장 중요한 data series에만 사용한다.
- grid line은 매우 약하게 처리한다.
- x/y축 정보는 최소화한다.
- 차트 위 또는 아래에 자연어 요약을 반드시 제공한다.

예:

```text
이번 주 운동량이 지난주보다 12% 늘었습니다.
가장 꾸준한 요일은 화요일입니다.
```

차트는 설명이 아니라 **결론을 뒷받침하는 시각 자료**로 취급한다.

---

# 14. Screen Pattern 05 — Community

## 목적

사용자 참여와 동기부여를 만들되 운동/행동 서비스의 본질을 해치지 않는다.

## Feed Card

```text
[avatar] 사용자명      시간

[photo / media]

짧은 기록
운동 시간 · 칼로리 · 세트

[reaction] [comment]
```

## 규칙

- 미디어 비중이 높은 카드에서는 UI chrome을 줄인다.
- 지표는 본문보다 작게 배치한다.
- 리액션은 가볍고 빠르게 수행 가능해야 한다.
- 커뮤니티 상단 탭은 최대 3개 정도로 단순화한다.

---

# 15. Screen Pattern 06 — Records

## 목적

과거 활동을 “쌓이고 있는 자산”처럼 느끼게 한다.

## 추천 구조

```text
기록

[Calendar / streak]

이번 달 요약
12회 · 420분 · 6,800 kcal

[기록 목록]
날짜
활동명
핵심 수치
```

## 원칙

- 캘린더는 활동 여부를 빠르게 확인하는 용도
- 상세 기록은 리스트에서 확인
- streak, 누적 시간, 반복 횟수 등 습관 지표를 활용
- 빈 상태에서는 비어 있다는 사실보다 “첫 기록을 시작하는 행동”을 보여준다.

---

# 16. Screen Pattern 07 — Profile / My Page

## 구조

```text
[Avatar] 이름
상태/짧은 설명

[핵심 개인 지표]

Account
- 내 정보
- 목표 / 설정
- 연동

Service
- 구독
- 알림
- 도움말
- 설정
```

## 원칙

- Profile과 Settings를 뒤섞지 않는다.
- 자주 쓰는 개인화 설정은 상단, 계정성 메뉴는 하단.
- 메뉴는 card section 또는 grouped list를 사용한다.

---

# 17. Data Visualization Language

## 17.1 Line Chart

```text
Background: transparent or surface-1
Primary line: primary
Point: primary or white center
Grid: low-contrast gray
Labels: secondary text
```

## 17.2 Progress / Recovery

신체 상태, 진척도, 회복도 같은 정보는 다음 중 하나를 사용한다.

- horizontal bar
- segmented indicator
- simple body map
- ring progress

한 화면에서 여러 차트 스타일을 경쟁시키지 않는다.

---

# 18. Image & Illustration Direction

## 운동/행동 가이드 이미지

- 어두운 배경에서 인체/행동 형태가 명확히 구분되어야 한다.
- 복잡한 배경 사진보다 동작 자체가 읽히는 이미지가 우선이다.
- thumbnail은 카드 안에서 보조 역할을 해야 하며 텍스트를 압도하지 않는다.

## 캐릭터/마스코트가 필요한 경우

- 긴 온보딩의 긴장 완화
- 사용자의 진행 칭찬
- 빈 상태 설명
- 작은 코칭 메시지

등에 제한적으로 사용한다.

---

# 19. Motion & Interaction

## Motion Principles

```text
Fast: 120–160ms
Default: 180–240ms
Emphasis: 280–360ms
```

권장:
- 선택 카드의 색/테두리 전환
- CTA enable transition
- 차트 등장
- 완료 시 subtle scale/fade
- timer transition

피해야 할 것:
- 버튼을 누를 때마다 큰 spring effect
- 목적 없는 background animation
- 지나치게 긴 page transition

---

# 20. UX Copy Style

## 기본 문체

- 짧다.
- 행동 지향적이다.
- 전문적이지만 어렵지 않다.
- 사용자를 평가하거나 압박하지 않는다.
- 정보와 다음 행동을 같이 준다.

### 좋은 예

```text
오늘은 40분 루틴을 추천해요.
현재 컨디션에 맞춰 강도를 조정했어요.
3세트가 남았어요.
이번 주 운동량이 늘었어요.
```

### 피할 예

```text
당신은 목표 달성에 실패하고 있습니다.
지금 당장 더 열심히 해야 합니다.
```

---

# 21. Information Hierarchy Formula

화면을 설계할 때 다음 순서를 유지한다.

```text
1. Context      지금 어디인가
2. Status       현재 상태는 무엇인가
3. Primary      가장 중요한 정보는 무엇인가
4. Action       다음에 무엇을 해야 하는가
5. Secondary    추가 조정/상세 정보는 무엇인가
```

한 화면에 이 다섯 요소가 모두 필요하지는 않지만 순서가 뒤집히지 않도록 한다.

---

# 22. Responsive / Device Rules

모바일 우선으로 설계한다.

```text
Base: 390 × 844
Minimum target width: 360
Large mobile: 430
```

- 콘텐츠 최대 너비는 모바일에서는 화면 전체를 사용한다.
- 하단 CTA는 safe area를 고려한다.
- 텍스트가 커져도 버튼 label이 잘리지 않게 한다.
- 작은 화면에서는 카드 열을 2열 → 1열로 변경한다.

---

# 23. Accessibility Rules

- body text는 가급적 14px 이상
- touch target 최소 44×44px
- 색만으로 상태를 구분하지 않는다.
- primary와 배경의 명도 대비를 충분히 확보한다.
- disabled 상태도 완전히 읽을 수 없게 만들지 않는다.
- 차트 데이터는 텍스트 요약을 함께 제공한다.
- 아이콘 버튼에는 의미가 분명한 접근성 라벨을 제공한다.

---

# 24. Design QA Checklist

화면을 완성한 뒤 아래를 검토한다.

- [ ] 첫 3초 안에 화면 목적이 이해되는가?
- [ ] 핵심 CTA가 하나로 명확한가?
- [ ] primary color를 과도하게 사용하지 않았는가?
- [ ] 카드가 너무 많아 대시보드가 조각나지 않았는가?
- [ ] 제목 / 수치 / 설명의 위계가 분명한가?
- [ ] 작은 회색 글씨가 과도하지 않은가?
- [ ] 같은 의미의 컴포넌트가 화면마다 다른 형태로 나오지 않는가?
- [ ] 데이터가 행동으로 연결되는가?
- [ ] 온보딩 한 화면에서 너무 많은 것을 묻고 있지 않은가?
- [ ] 실행 화면에서 불필요한 정보가 제거되었는가?
- [ ] 선택/완료/오류 상태가 시각적으로 명확한가?
- [ ] 44px 이상의 터치 영역을 확보했는가?

---

# 25. AI Design Generation Rules

AI가 앱 화면을 디자인하거나 코드를 생성할 때 다음 규칙을 반드시 적용한다.

## MUST

1. Dark charcoal background를 기본으로 한다.
2. 민트/터콰이즈 primary accent는 핵심 행동에 집중한다.
3. 상단에 화면 목적, 중앙에 핵심 콘텐츠, 하단에 주요 CTA 구조를 우선한다.
4. 카드의 시각적 위계를 surface 단계로 구분한다.
5. 데이터는 한눈에 읽히게 만든다.
6. 화면마다 핵심 CTA는 하나를 우선한다.
7. 전체 UI는 모바일에서 엄지손가락 조작을 고려한다.
8. 컴포넌트 간 spacing은 4pt system을 유지한다.
9. 그래프와 지표에는 자연어 설명을 추가한다.
10. 화면이 복잡해지면 장식을 추가하지 말고 정보를 줄인다.

## MUST NOT

1. 모든 카드에 primary border를 사용하지 않는다.
2. 여러 네온 컬러를 섞지 않는다.
3. gradient를 기본 표현으로 남용하지 않는다.
4. 지나치게 둥근 bubble UI로 만들지 않는다.
5. 5개 이상의 font size가 한 화면에서 경쟁하지 않게 한다.
6. 차트를 장식용으로 넣지 않는다.
7. 플랜핏의 고유 로고, 캐릭터, 실제 화면 문구를 복사하지 않는다.

---

# 26. Master Prompt — UI Design

아래 프롬프트를 새로운 앱 화면 제작 시 기본 지시문으로 사용할 수 있다.

```text
Create a premium dark-mode mobile app interface inspired by the interaction principles of modern fitness coaching apps.

VISUAL SYSTEM
- Deep charcoal background (#232428 range)
- Slightly lighter surface cards (#2B2D31 to #3C3D42)
- One vivid mint/teal accent (#1BEFCA range)
- Off-white primary text and restrained neutral gray secondary text
- Clean Korean sans-serif typography such as Pretendard/SUIT
- 4pt spacing system
- 12–16px card radius
- Minimal shadows; prefer surface contrast and subtle borders

UX PRINCIPLES
- Make the primary user action obvious within 3 seconds
- One dominant CTA per screen
- Use card-based information hierarchy
- Use progressive disclosure instead of showing every option at once
- Separate context, current status, core information, and next action
- For analytics, prioritize one insight and one primary data series
- For execution screens, reduce visual density and enlarge the current step/metric

COMPONENTS
- Full-width primary CTA, 52–56px high
- Compact filter chips
- Selection cards with strong selected state
- Simple line icons
- Thin progress indicator for multi-step onboarding
- Clear metric cards and concise charts

STYLE
Athletic, modern, focused, data-driven, confident, uncluttered.
Do not reproduce Planfit logos, proprietary illustrations, exact copy, or pixel-identical screens.
Adapt the system to the target product’s own brand, content, and user goals.
```

---

# 27. Master Prompt — Screen Redesign

기존 화면을 이 스타일로 재설계할 때:

```text
Redesign the attached mobile screen using a dark, focused, action-first design system.

1. Preserve all required functions and information.
2. Rebuild the information hierarchy before styling.
3. Identify one primary action and visually dominate it with the teal accent.
4. Group related information into dark surface cards.
5. Reduce decorative elements and unnecessary borders.
6. Use large typography for the most important status or metric.
7. Use secondary gray text only for supporting information.
8. Keep the bottom navigation simple and consistent.
9. If the screen contains data, show a concise insight before detailed metrics.
10. Maintain strong mobile usability and 44px minimum touch targets.

The result should feel energetic and premium, but not flashy or gamified.
```

---

# 28. Master Prompt — New App Prototype

```text
Design a complete mobile app prototype using the Planfit-inspired design principles in this skill.

First define:
- target user
- primary job-to-be-done
- core daily action
- 4–5 main navigation items
- onboarding data required for personalization
- key progress metrics

Then design these screens:
1. Splash / Sign-in
2. Progressive onboarding
3. Home dashboard
4. Primary task start screen
5. Focused execution screen
6. Completion / result screen
7. Analysis dashboard
8. Record/history
9. Community or social proof screen if relevant
10. Profile/settings

For every screen, specify:
- screen objective
- information hierarchy
- components
- primary CTA
- states
- transition to next screen

Apply the dark charcoal + vivid teal visual system consistently.
```

---

# 29. Implementation Tokens — CSS Example

```css
:root {
  --pf-bg: #232428;
  --pf-bg-deep: #1d1e22;
  --pf-surface: #2b2d31;
  --pf-surface-raised: #35373c;
  --pf-border: rgba(255,255,255,.06);

  --pf-primary: #1befca;
  --pf-primary-pressed: #20d5b4;
  --pf-primary-muted: #19413d;

  --pf-text-1: #f6f6f7;
  --pf-text-2: #a4a5a6;
  --pf-text-3: #7c7d81;

  --pf-radius-sm: 10px;
  --pf-radius-md: 14px;
  --pf-radius-lg: 18px;

  --pf-space-1: 4px;
  --pf-space-2: 8px;
  --pf-space-3: 12px;
  --pf-space-4: 16px;
  --pf-space-5: 20px;
  --pf-space-6: 24px;
  --pf-space-8: 32px;
  --pf-space-10: 40px;
}
```

---

# 30. 적용 우선순위

새 프로젝트에 이 스킬을 적용할 때 다음 순서로 작업한다.

```text
01 기능 목록 정리
02 사용자 핵심 UX Flow 확정
03 화면별 Primary Action 결정
04 정보 위계 설계
05 카드/컴포넌트 배치
06 Design Token 적용
07 상태별 UI 설계
08 데이터 시각화 정리
09 Interaction 적용
10 Accessibility + QA 검수
```

시각 디자인보다 **UX 구조를 먼저 고정**한다.

---

# 31. 참고 화면 범주

WWIT에 정리된 플랜핏 사례는 다음 화면 범주를 포함한다.

```text
- 온보딩
- 홈
- 운동 시작하기
- 분석
- 커뮤니티
- 마이페이지 - 기록
- 마이페이지 - 프로필
```

이 스킬은 이 범주를 기준으로 앱 전체 디자인 언어를 확장할 수 있도록 구성했다.

---

# 32. Reference Sources

Primary reference:
- WWIT, “플랜핏”, 2023-07-24
  https://wwit.design/2023/07/24/planfit/

Supplementary references used to validate the recurring UX patterns:
- Planfit official onboarding
  https://planfit.ai/ko/onboarding
- Planfit App Store listing
  https://apps.apple.com/kr/app/id1511876936

---

# 33. Final Principle

이 디자인 시스템의 핵심은 단순히 **“검은 화면 + 민트색 버튼”**이 아니다.

```text
개인화 → 오늘의 상태 이해 → 명확한 한 가지 행동 → 실행 집중 → 기록 → 변화 확인
```

이라는 사용자의 행동 루프를 시각적으로 명확하게 만드는 것이 핵심이다.

앱을 디자인할 때 항상 다음 질문으로 최종 검수한다.

> “사용자는 지금 이 화면에서 무엇을 보고, 무엇을 결정하고, 무엇을 실행해야 하는가?”

그 답이 3초 안에 명확하지 않다면 화면을 다시 단순화한다.
