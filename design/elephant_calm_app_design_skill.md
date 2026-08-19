---
name: elephant-calm-app-design
description: >
  코끼리 수면·명상 앱의 2021년 전후 UI 레퍼런스를 바탕으로,
  차분하고 몰입감 있는 마음챙김·수면·웰니스 모바일 앱을 설계하기 위한 디자인 스킬.
  밤의 풍경, 보라·남색 계열의 깊은 배경, 감성 일러스트, 둥근 카드,
  콘텐츠 중심의 홈 구조와 부드러운 인터랙션을 일관되게 적용한다.
version: 1.0
category: mobile-ui
reference_app: "코끼리 - 수면·명상"
reference_snapshot: "WWIT / 2021-05-04"
---

# Elephant Calm App Design Skill

## 0. 이 스킬의 목적

이 스킬은 **코끼리 앱을 그대로 복제하는 것이 아니라**, 해당 앱에서 관찰되는 디자인 언어를 추상화하여  
명상, 수면, 마음관리, 자기돌봄, 루틴, 웰니스 서비스에 재사용하기 위한 UI/UX 설계 규칙이다.

핵심 목표는 다음과 같다.

1. 사용자가 화면을 보는 순간 **차분함과 심리적 안전감**을 느끼게 한다.
2. 콘텐츠 탐색보다 먼저 **오늘 바로 실행할 한 가지 행동**을 제안한다.
3. 이미지·일러스트·음성 콘텐츠를 중심으로 **몰입형 경험**을 만든다.
4. 기능이 많아도 정보 구조는 단순하게 유지한다.
5. 야간 사용과 수면 전 사용을 고려하여 **낮은 시각적 자극과 부드러운 대비**를 사용한다.

---

# 1. Design DNA

## 핵심 키워드

- Calm
- Night
- Healing
- Dreamlike
- Warm
- Soft
- Immersive
- Emotional
- Guided
- Story-driven

## 한 문장 정의

> **깊은 밤의 풍경 속에서 친근한 캐릭터와 감성 콘텐츠가 사용자를 조용히 다음 행동으로 안내하는 몰입형 웰니스 UI**

## 사용자에게 전달해야 할 감정

| 우선순위 | 감정 | 디자인 방식 |
|---|---|---|
| 1 | 안정감 | 어두운 남색 배경, 낮은 채도, 넓은 여백 |
| 2 | 친밀감 | 캐릭터, 부드러운 문장, 둥근 형태 |
| 3 | 몰입감 | 화면 전체를 사용하는 일러스트와 배경 |
| 4 | 기대감 | 은은한 빛, 별, 달, 작은 강조색 |
| 5 | 행동 유도 | 오늘의 콘텐츠를 가장 먼저 제안 |

---

# 2. Visual System

## 2.1 Color System

정확한 원본 컬러 복제가 아니라 **레퍼런스 기반 근사값**으로 사용한다.

```css
--night-950: #111735;
--night-900: #182052;
--night-800: #232C6B;
--night-700: #303886;

--blue-muted: #31518D;
--violet-deep: #46237B;
--violet-primary: #9168E6;
--violet-soft: #B5A0F2;

--text-primary: #F7F7FA;
--text-secondary: #C8CAE0;
--text-muted: #9297B8;

--surface-dark: rgba(255,255,255,0.07);
--surface-light: rgba(255,255,255,0.12);
--border-soft: rgba(255,255,255,0.14);
```

### 컬러 사용 원칙

- 전체 화면의 60~80%는 남색·딥블루 계열로 유지한다.
- 보라색은 **CTA, 현재 상태, 선택 상태, 핵심 카드**에 제한적으로 사용한다.
- 순수 검정 `#000000`은 기본 배경으로 사용하지 않는다.
- 순수 흰색의 넓은 면적 사용을 피하고, 텍스트와 작은 강조에 사용한다.
- 강한 빨강·주황·형광색은 오류나 특별 상태 외에는 사용하지 않는다.
- 카드마다 색을 지나치게 다르게 만들지 않는다.

---

## 2.2 Gradient

배경은 단색보다 **깊이감 있는 야간 그라데이션**을 권장한다.

```css
background:
  linear-gradient(
    180deg,
    #151B45 0%,
    #232C6B 52%,
    #34246F 100%
  );
```

### 권장 사용

- 스플래시
- 온보딩
- 홈 히어로
- 콘텐츠 상세
- 플레이어

### 금지

- 무지개형 다중 그라데이션
- 네온 느낌의 고채도 그라데이션
- 배경 전체에 지나치게 밝은 보라색 사용

---

# 3. Typography

## 기본 방향

타이포그래피는 **읽기보다 안정감을 우선하는 편안한 산세리프**를 사용한다.

한국어 권장:

- Pretendard
- SUIT
- Noto Sans KR
- Apple SD Gothic Neo

## Type Scale

| 역할 | 권장 크기 | Weight | 용도 |
|---|---:|---:|---|
| Hero Title | 28~32px | 700 | 핵심 메시지 |
| Page Title | 24~28px | 700 | 페이지 제목 |
| Section Title | 18~22px | 600~700 | 섹션 제목 |
| Card Title | 16~18px | 600 | 콘텐츠 제목 |
| Body | 14~16px | 400~500 | 설명 |
| Caption | 12~13px | 400~500 | 시간, 메타데이터 |
| Button | 15~17px | 600 | CTA |

## Typography Rules

- 한 화면의 강한 텍스트 위계는 최대 3단계.
- 긴 설명문보다 짧은 문장 중심.
- 화면 상단 카피는 가능하면 2~3줄 이내.
- 줄간격은 본문 기준 145~165%.
- 중앙 정렬은 온보딩·감성 메시지에서 사용.
- 홈·목록·마이 화면은 왼쪽 정렬을 기본으로 한다.

---

# 4. Illustration & Image Style

## 핵심 이미지 언어

코끼리 앱의 차별점은 단순 UI보다 **감성적인 야간 일러스트가 UI 자체의 일부로 작동하는 것**에 있다.

### 권장 요소

- 밤하늘
- 달
- 별
- 숲
- 호수
- 산
- 꽃
- 작은 빛
- 반딧불
- 실루엣
- 잔잔한 자연
- 친근한 동물 또는 브랜드 캐릭터

### 스타일

- 디지털 페인팅
- 부드러운 그라데이션
- 플랫과 페인팅의 중간 정도
- 과도한 디테일보다 실루엣 중심
- 밝은 부분은 작은 면적으로 제한
- 인물보다 풍경 비중을 크게

## Mascot Rule

캐릭터는 장식물보다 **사용자를 안내하는 가이드**로 사용한다.

좋은 사용:

- 온보딩 안내
- 오늘의 상태 확인
- 목표 달성 축하
- 비어 있는 화면
- 수면·명상 시작 전
- 연속 기록 안내

피해야 할 사용:

- 모든 카드에 캐릭터 반복
- 과도한 표정 변화
- 게임 캐릭터처럼 지나치게 활동적인 포즈
- 핵심 콘텐츠보다 캐릭터가 더 강조되는 구성

---

# 5. Shape Language

## Radius

```text
Small control      8~10px
Chip              12~16px
Card              16~20px
Large feature     20~28px
Primary button    18~24px or pill
```

## 형태 원칙

- 직각 사각형보다 둥근 사각형을 기본으로 한다.
- 이미지 카드 역시 동일한 radius를 적용한다.
- 원형은 카테고리, 프로필, 아이콘 버튼에 사용한다.
- 둥근 형태를 사용하되 지나치게 유아적인 느낌은 피한다.

---

# 6. Layout System

## Mobile Base

```text
Reference width: 360~390px
Outer margin: 20px
Compact margin: 16px
Section gap: 28~36px
Card gap: 12~16px
Grid gap: 12px
Bottom safe area: 20~34px
```

## 화면 기본 구조

```text
[Status / Safe Area]

[Header]

[Emotional Hero Area]

[Primary Action]

[Recommended / Daily Content]

[Category or Content Rail]

[Secondary Section]

[Bottom Navigation]
```

## 핵심 원칙

> **한 화면에 모든 것을 보여주지 말고, 첫 화면에서는 “지금 무엇을 하면 되는가”가 가장 먼저 보여야 한다.**

---

# 7. Core Components

## 7.1 Emotional Hero

홈 화면에서 가장 중요한 컴포넌트.

### 구성

- 야간 풍경 일러스트
- 브랜드 캐릭터 또는 상징
- 짧은 메시지
- 오늘의 콘텐츠 제목
- 재생 버튼 또는 CTA
- 필요 시 진행률

### 높이

화면의 약 35~50%.

### 규칙

- 텍스트보다 이미지가 먼저 인식되어야 한다.
- CTA는 하나만 강하게 만든다.
- 재생 아이콘은 원형 또는 rounded capsule 안에 배치한다.

---

## 7.2 Content Card

```text
┌──────────────────┐
│                  │
│   Illustration   │
│                  │
│  Category / New  │
│  Content Title   │
│  10 min          │
└──────────────────┘
```

### 변형

1. Portrait Card
2. Landscape Card
3. Square Card
4. Compact List Card

### 카드 정보량

최대:

- 제목
- 짧은 메타 정보
- 상태 배지 1개

설명문을 카드 내부에 길게 넣지 않는다.

---

## 7.3 Circular Category

빠른 탐색을 위한 원형 메뉴.

예:

- 오늘의 명상
- 마음챙김
- 호흡
- 수면
- 음악

구조:

```text
( Image )
  Label
```

### 원칙

- 4~5개가 한 화면에서 자연스럽게 보이게 한다.
- 아이콘보다 작은 일러스트 썸네일 사용을 우선한다.
- 동일한 그림체를 유지한다.

---

## 7.4 Primary CTA

### 형태

- Full-width rounded button
- 또는 콘텐츠 안의 Play CTA

### 카피

좋은 예:

- 지금 시작하기
- 오늘의 명상 듣기
- 편안하게 잠들기
- 5분 마음 쉬기
- 이어서 듣기

피해야 할 예:

- 확인
- 이동
- 클릭
- 실행

행동의 목적이 드러나는 동사를 사용한다.

---

## 7.5 Bottom Navigation

권장 4~5개 메뉴.

예시:

```text
홈 / 명상 / 탐색 / 보관함 / 마이
```

또는

```text
홈 / 명상 / 수면 / 검색 / 마이
```

### 원칙

- 선택 상태만 보라색 또는 밝은 색으로 강조.
- 비선택 상태는 낮은 명도의 회색·블루.
- 아이콘은 단순한 line 또는 soft-filled style.
- 라벨을 생략하지 않는 것을 기본으로 한다.

---

# 8. Screen Pattern

# 8.1 Splash

## 목적

서비스의 세계관을 즉시 전달.

### 구성

```text
[Deep Night Background]

        [Elephant / Brand Symbol]

             KOKKIRI
      마음을 돌보는 시간
```

### 애니메이션

- 별이 아주 천천히 나타남
- 로고 0.8~1.2초 fade
- 과도한 로딩 애니메이션 금지

---

# 8.2 Onboarding

WWIT 레퍼런스의 핵심 화면 유형 중 하나.

## 권장 3~4 Step

### Step 1 — Welcome

```text
Illustration

오늘도 수고했어요.
이제 잠시 마음을 쉬어가세요.

[다음]
```

### Step 2 — Need

```text
Illustration

요즘 어떤 도움이 필요하세요?

[잠]
[불안]
[집중]
[휴식]
```

### Step 3 — Preference

```text
Illustration

하루에 얼마나 시간을 내고 싶나요?

[5분]
[10분]
[20분]
```

### Step 4 — Start

```text
Illustration

당신에게 맞는 첫 번째
마음챙김을 준비했어요.

[시작하기]
```

## 온보딩 디자인 원칙

- 이미지 45~60%
- 카피 15~20%
- CTA 10~15%
- 페이지 인디케이터는 작게
- 선택지를 너무 많이 제공하지 않는다.
- 가입보다 먼저 서비스의 정서적 가치를 경험하게 한다.

---

# 8.3 Home

WWIT 레퍼런스의 핵심 화면 유형.

## Information Architecture

```text
Header
 ├─ Greeting
 └─ Notification / Profile

Hero
 ├─ Background illustration
 ├─ Today's message
 ├─ Today's content
 └─ Play CTA

Quick Categories
 ├─ Meditation
 ├─ Sleep
 ├─ Breath
 └─ Music

Recommended Rail

Continue Listening

Popular / New

Bottom Navigation
```

## Home Priority

```text
1. 지금 실행할 콘텐츠
2. 빠른 카테고리
3. 개인 추천
4. 이어 듣기
5. 신규 콘텐츠
```

**신규 콘텐츠보다 사용자의 즉시 행동을 우선한다.**

---

# 8.4 Content List

## 구조

```text
[Title]
[Optional filter chips]

[Card] [Card]
[Card] [Card]
[Card] [Card]
```

또는 horizontal rail.

### 필터 예

- 전체
- 불안
- 행복
- 힐링
- 릴렉스
- 수면

### 선택 상태

- 밝은 violet filled chip
- 비선택은 transparent surface

---

# 8.5 Content Detail

```text
[Large Illustration]

[Category]
[Title]
[Teacher / Narrator]
[Duration]

[Primary Play Button]

[Description]

[Episode List]
```

### 특징

상세 화면에서도 텍스트를 길게 늘어놓기보다  
**콘텐츠를 바로 재생할 수 있는 구조**를 우선한다.

---

# 8.6 Audio Player

## 구조

```text
[Background Illustration]

[Close / Back]

[Artwork]

[Title]
[Teacher]

[Progress Bar]

[-15] [Play/Pause] [+15]

[Timer] [Favorite] [More]
```

## Player Rules

- 재생 버튼이 화면에서 가장 강한 컨트롤.
- 컨트롤 간 충분한 터치 영역 확보.
- 수면 환경을 고려해 밝기와 대비를 과도하게 높이지 않는다.
- 배경 아트는 살짝 어둡게 처리하여 컨트롤 가독성을 확보한다.

---

# 8.7 My Page

WWIT 레퍼런스의 핵심 화면 유형.

## 목적

마이페이지는 설정 목록이 아니라  
**“내가 얼마나 나를 돌보고 있는가”를 보여주는 자기관리 화면**으로 설계한다.

## 추천 구조

```text
Profile

This Week
 ├─ Listening days
 ├─ Meditation minutes
 └─ Current streak

My Library
 ├─ Favorites
 ├─ Downloaded
 └─ Recently played

My Routine
 ├─ Reminder
 └─ Challenge

Settings
 ├─ Subscription
 ├─ Notification
 └─ Account
```

### 시각화

- 숫자 1~3개만 강조
- 간단한 주간 그래프
- streak는 작은 불꽃보다 별·달·빛 등 서비스 세계관에 맞는 상징 사용

---

# 9. UX Writing

## Tone

- 차분함
- 따뜻함
- 비판하지 않음
- 명령하지 않음
- 짧음
- 행동 가능함

## Good

```text
오늘은 잠시 쉬어가도 괜찮아요.
5분만 마음을 바라볼까요?
편안한 밤을 준비해볼까요?
어제 듣던 곳에서 이어볼까요?
오늘의 마음은 어떤가요?
```

## Avoid

```text
회원님의 정신건강 개선을 위해 콘텐츠를 실행하세요.
오늘 명상을 완료하지 않았습니다.
목표 달성에 실패했습니다.
콘텐츠를 소비하세요.
```

---

# 10. Motion & Interaction

## Motion Principle

> **움직임은 흥미를 만들기보다 호흡을 느리게 만드는 방향으로 사용한다.**

### 권장

- Fade 200~400ms
- Slow scale 0.98 → 1.0
- Gentle parallax
- Progress transition
- Soft card elevation
- Background particle slow movement

### 피하기

- bounce
- 빠른 spring
- 과도한 confetti
- 강한 haptic 반복
- 카드가 튀어나오는 애니메이션

---

# 11. Accessibility

차분한 UI가 곧 접근성 좋은 UI는 아니다.

반드시 다음을 지킨다.

- 본문 대비 WCAG AA 수준 권장.
- 작은 회색 텍스트를 과도하게 어둡게 만들지 않는다.
- 터치 영역 최소 44×44px.
- 아이콘 단독 버튼에는 접근성 라벨 제공.
- 색상만으로 선택 상태를 구분하지 않는다.
- 자동 재생 오디오는 기본 비활성.
- 애니메이션 감소 설정을 지원한다.
- 수면 전 사용을 고려하여 밝은 흰 화면 전환을 피한다.

---

# 12. Design Token Summary

```yaml
layout:
  mobile_width: 390
  page_padding: 20
  compact_padding: 16
  section_gap: 32
  card_gap: 12

radius:
  small: 10
  medium: 16
  card: 20
  large: 24
  pill: 999

typography:
  hero: 30
  page_title: 26
  section_title: 20
  card_title: 17
  body: 15
  caption: 13

colors:
  background: "#182052"
  background_alt: "#232C6B"
  primary: "#9168E6"
  text_primary: "#F7F7FA"
  text_secondary: "#C8CAE0"

motion:
  fast: 180
  normal: 280
  slow: 420
```

---

# 13. AI Design Instructions

AI가 이 스킬을 적용할 때 다음 순서로 판단한다.

## Step 1. User State First

화면을 만들기 전에 사용자가 현재 어떤 상태인지 정의한다.

예:

- 잠들기 직전
- 불안함
- 집중 필요
- 하루 시작
- 하루 마무리
- 감정 기록
- 마음 안정

## Step 2. One Primary Action

각 화면마다 가장 중요한 행동을 하나 정한다.

예:

```text
Home → 오늘의 명상 재생
Sleep → 수면 콘텐츠 선택
Player → 재생/일시정지
My → 기록 확인
Onboarding → 다음 단계 진행
```

## Step 3. Emotional Scene

기능보다 먼저 감성 장면을 결정한다.

```text
밤하늘
달빛
숲
호수
안개
별
작은 빛
캐릭터
```

## Step 4. Information Hierarchy

한 화면의 정보는 다음 우선순위를 따른다.

```text
Emotion
→ Primary Action
→ Content
→ Navigation
→ Secondary Information
```

## Step 5. Reduce

화면을 완성한 후 반드시 다음을 검토한다.

- 불필요한 버튼 삭제
- 긴 설명 축약
- 색상 수 축소
- 카드 수 축소
- 강조 요소 축소

---

# 14. Component Generation Prompt

```text
Design a mobile wellness app interface inspired by a calm Korean meditation app aesthetic.

Visual direction:
- deep navy and muted purple night palette
- dreamy illustrated landscapes
- moonlight, stars, forest and subtle glowing elements
- friendly mascot used as a gentle guide
- rounded cards and soft surfaces
- minimal white typography
- calm, emotional and immersive atmosphere
- low visual stimulation suitable for nighttime use

UX direction:
- one clear primary action per screen
- daily recommended content is prioritized
- large emotional hero area
- horizontal content rails
- simple category shortcuts
- persistent bottom navigation
- short, warm Korean UX copy
- generous spacing and large touch targets

Avoid:
- generic SaaS dashboard appearance
- white-dominant screens
- neon gradients
- excessive glassmorphism
- dense statistics
- sharp corners
- aggressive gamification
- overly colorful cards
```

---

# 15. Screen Generation Prompt

## Home Prompt

```text
Create a 390px-wide mobile home screen for a Korean mindfulness and sleep app.

The screen should open with a deep navy illustrated night landscape featuring a small friendly mascot.
Show a short greeting and one prominent "오늘의 명상" content item with a circular play button.

Below the hero:
1. four circular quick categories
2. a horizontal recommended-content card rail
3. continue-listening content
4. a compact new-content section
5. a five-item bottom navigation

Use:
- deep navy background
- muted violet accent
- soft illustrated thumbnails
- 20px page margins
- 16~20px card radius
- white primary text and muted blue-gray secondary text
- warm, short Korean UX copy

The result should feel quiet, intimate, dreamlike and premium rather than playful or gamified.
```

## Onboarding Prompt

```text
Create a four-step mobile onboarding flow for a mindfulness app.

Each screen should use:
- full-screen night illustration
- moon, stars, forest or lake imagery
- a friendly mascot as a guide
- one short headline
- maximum two lines of supporting copy
- subtle progress dots
- one large rounded primary button

The onboarding should ask:
1. what the user needs help with
2. when they want to practice
3. preferred session length
4. show a personalized first recommendation

Keep the experience emotionally reassuring and visually quiet.
```

## My Page Prompt

```text
Create a dark-themed "My" page for a mindfulness app.

Show:
- compact profile header
- weekly self-care summary
- total meditation minutes
- current streak
- saved content
- recent listening
- reminder settings
- subscription and account settings

Do not make it look like an analytics dashboard.
Use small, warm visualizations and present the page as a personal self-care record.
```

---

# 16. Do / Don't

| Do | Don't |
|---|---|
| 감정적 장면을 먼저 설계 | 기능 박스를 먼저 나열 |
| 한 화면 한 핵심 행동 | CTA 여러 개 경쟁 |
| 깊은 남색 중심 | 검정·흰색 대비 과다 |
| 보라색을 포인트로 제한 | 모든 요소를 보라색 처리 |
| 자연·밤·빛 일러스트 | 일반 스톡 사진 남용 |
| 짧은 UX 카피 | 긴 설명문 |
| 부드러운 인터랙션 | 빠른 bounce animation |
| 콘텐츠 소비 흐름 단순화 | 복잡한 필터와 메뉴 |
| 마이페이지를 자기돌봄 기록으로 | 관리자 대시보드처럼 구성 |

---

# 17. Quality Checklist

화면 생성 후 아래 항목을 확인한다.

- [ ] 첫 3초 안에 서비스의 감성적 분위기가 느껴지는가?
- [ ] 가장 중요한 행동이 하나만 강하게 보이는가?
- [ ] 화면의 60% 이상이 동일한 컬러 세계관을 유지하는가?
- [ ] 보라색 포인트가 과도하지 않은가?
- [ ] 카드 radius가 일관적인가?
- [ ] 텍스트 위계가 3단계 이내인가?
- [ ] 카피가 짧고 따뜻한가?
- [ ] 야간에 보기에 지나치게 밝지 않은가?
- [ ] 콘텐츠 이미지의 그림체가 통일되어 있는가?
- [ ] 캐릭터가 기능적 안내 역할을 하는가?
- [ ] 주요 터치 영역이 충분히 큰가?
- [ ] 앱 전체가 일반적인 SaaS 대시보드처럼 보이지 않는가?
- [ ] 지나친 게임화 요소가 없는가?
- [ ] 홈에서 오늘 바로 실행할 콘텐츠가 가장 먼저 보이는가?

---

# 18. 적용하기 좋은 서비스

이 디자인 언어는 다음 영역에 특히 적합하다.

- 명상 앱
- 수면 앱
- 감정 기록 앱
- 자기관리 앱
- 마음챙김 서비스
- 스트레스 관리
- 웰니스 콘텐츠
- 오디오 콘텐츠
- 루틴·습관 앱
- 성찰·저널링 앱
- 신앙·묵상 콘텐츠 앱

---

# 19. Reference Notes

주요 참고 레퍼런스:

- WWIT, 「코끼리」, 2021-05-04  
  https://wwit.design/2021/05/04/elephant/
- 코끼리 공식 서비스  
  https://kokkiri.kr/
- Google Play, 「코끼리 – 수면, 명상」  
  https://play.google.com/store/apps/details?id=com.mindclass.android

> 주의: WWIT의 2021년 화면 레퍼런스를 중심으로 디자인 언어를 추상화한 문서이며,
> 실제 원본 앱의 정확한 디자인 토큰이나 내부 디자인 시스템을 역설계한 문서는 아니다.
