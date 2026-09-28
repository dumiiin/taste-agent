# Taste Agent — 작업 인수인계

최종 갱신: 2026-09-27  
프로젝트 형태: 390 × 844 모바일 웹 프로토타입  
기술: 순수 HTML / CSS / JavaScript, 별도 빌드 및 패키지 설치 없음

## 1. 다른 컴퓨터에서 바로 시작하기

1. `2026-09-22_Taste-Agent` 폴더 전체를 복사한다. `.git`과 `assets`도 빠뜨리지 않는다.
2. 새 컴퓨터의 Codex에서 이 폴더를 작업 폴더로 연다.
3. 아래 **새 Codex 작업에 보낼 프롬프트**를 첫 메시지로 보낸다.
4. `index.html`을 브라우저로 열거나 아래 명령으로 실행한다.

```bash
python3 -m http.server 4173
```

브라우저 주소: `http://127.0.0.1:4173/`

## 2. 새 Codex 작업에 보낼 프롬프트

```text
이 폴더는 이전 컴퓨터에서 작업하던 Taste Agent 모바일 웹 프로토타입입니다. 기존 구현을 유지한 채 이어서 작업해 주세요.

작업 전에 HANDOFF_PROMPT.md를 끝까지 읽고 index.html, styles.css, script.js 및 assets 구조를 확인해 주세요. 우선 코드를 수정하지 말고 현재 화면 구조, 전환 방식, 중요한 상태와 다음 요청에서 주의할 부분을 짧게 요약해 주세요. 이후 제가 전달하는 수정 요청부터 진행해 주세요.

중요 원칙:
- 기존 화면과 인터랙션을 임의로 초기화하거나 전면 재작성하지 마세요.
- Figma 링크가 주어지면 해당 node의 design context와 screenshot, 원본 asset을 확인해 정확히 반영하세요. 임시 이미지를 다른 asset으로 대체하지 마세요.
- 기준 프레임은 390 × 844입니다.
- 외부 프레임워크나 빌드 도구를 새로 도입하지 마세요.
- 수정 후 node --check script.js 및 git diff --check를 실행하고 실제 브라우저에서 해당 흐름을 확인하세요.
- 사용자의 기존 변경사항과 assets를 보존하세요.
- 외부 업로드, 공유, 메시지 전송은 사용자 승인 없이 하지 마세요. Slack은 사용하지 마세요.
```

## 3. 파일 구조

- `index.html` — 모든 화면의 마크업. 온보딩, Home, Archive, My, Chat, 상세 화면, 사이드 메뉴, Report가 한 문서에 있다.
- `styles.css` — 전체 비주얼, 화면 전환, 고정/스크롤 레이어, 블러와 제스처 상태 스타일.
- `script.js` — 해시 기반 화면 전환, 온보딩 상태, 취향 카드 pan/pinch/select, Home 스와이프, 상세 진입, 메뉴/Report 흐름, Archive/Chat 인터랙션.
- `assets/PretendardVariable.woff2` — 기본 폰트.
- `assets/figma/` — 화면별 Figma 원본 이미지와 SVG.
- `assets/figma/report/` — Report의 정확한 월별 원본 이미지: `march.png`, `april.png`, `may.png`.
- `assets/icons/` — GNB와 공통 UI 아이콘 및 제작 시안.
- `figma-reference.png` — 초기 참고 이미지.
- `.git/` — 로컬 이력. 원격 저장소 업로드를 전제로 하지 않는다.

## 4. 주요 화면과 현재 동작

### 온보딩

- 첫 접근 안내 → 취향 선택 화면 → 완료 흐름.
- 취향 카드는 선택/해제 가능하며 선택 상태에 체크 표현이 있다.
- 한 손가락 drag로 캔버스를 이동하고 두 손가락 pinch로 확대·축소한다.
- 관련 코드: `showOnboardingStage`, `toggleTasteCard`, `zoomTasteAt`, pointer event 블록.

### Home

- 전체 배경 이미지 위에 중앙 로고/타이틀과 카드 캐러셀이 있다.
- 좌우 drag/swipe로 Home 카드를 탐색한다.
- Dieter Rams 상세는 위로 스와이프하거나 카드 선택으로 진입한다.
- Dieter Rams 상세에는 스크롤에 반응하는 상·하단 progressive blur가 있다.
- 첫 콘텐츠 카드에서 Article 상세로 한 단계 더 진입한다.
- Home 상단 메뉴 버튼은 사이드 메뉴를 연다.

### Home 사이드 메뉴

- 흰색 300px drawer이며 오른쪽 Home 영역은 dim + blur 처리된다.
- 항목은 `report`, `timeline`, `setting`이다.
- 현재 `report`만 실제 화면으로 연결되어 있다.
- `timeline`, `setting`은 준비 중 toast만 노출한다.
- 배경 선택, 닫기 버튼, Escape로 닫을 수 있다.
- 관련 함수: `openSideMenu`, `closeSideMenu`.

### Annual Report

- 사이드 메뉴의 `report` 선택으로 열린다.
- 검은 배경, 상단 back 버튼, 중앙 `2025` 헤더, 세로 스크롤 월별 카드 구성이다.
- Figma와 동일한 세 카드만 구현되어 있다: March, April, May. 임의의 June 카드는 제거했다.
- 월별 카드는 Figma 원본 이미지를 사용하며 카드별 crop 값이 다르다.
- back은 Report를 닫고 사이드 메뉴로 돌아간다.
- Escape는 Report와 메뉴를 모두 닫는다.
- 월 카드와 연도 선택은 아직 상세 연결 없이 toast만 표시한다.
- 관련 함수: `openReport`, `closeReport`.

### Archive

- Board / Collection 콘텐츠가 구현되어 있다.
- Board의 필터/정렬 레이어는 스크롤 시 상단에 고정된다.
- Collection의 리스트/카드 뷰 전환과 필터 sheet가 있다.
- Archive의 정렬 텍스트와 화살표는 중앙 정렬 기준으로 수정되어 있다.

### Chat / Search

- 첫 화면에 `find your taste` 타이틀, 원형 gradient glow, 추천 질문 카드, 하단 입력창이 있다.
- 추천 질문 카드가 입력창과 겹치지 않도록 상향 배치되어 있다.
- 추천 질문 및 입력 submit은 프로토타입 응답 흐름을 실행한다.

### My

- My 화면과 스크롤 상태가 구현되어 있다.
- 과거 요청의 My report와 새 Home 사이드 메뉴의 Annual Report는 별도 구조이므로 수정 시 혼동하지 않는다.

### GNB

- Home / Archive / Search(Chat) 화면을 연결한다.
- 화면 전환은 `data-target`과 URL hash를 사용한다.
- 메뉴 또는 Annual Report가 열리면 GNB를 숨긴다.

## 5. 상태와 화면 전환 방식

- 기본 화면 전환 함수: `openView(target, { updateHash })`.
- URL hash 예시: `#home`, `#archive`, `#chat`.
- 일부 온보딩/사용 상태는 `localStorage`에 기록된다. 테스트 시 화면이 건너뛰어 보이면 해당 사이트의 localStorage를 지운다.
- Home 상세: `.home-view.is-detail`; 상세 스크롤: `.detail-scrolled`.
- 사이드 메뉴: `.side-menu.is-open`, `body.menu-active`.
- Report: `.report-screen.is-open`, `body.report-active`.

## 6. 최근 작업과 정확한 Figma 기준

메인 Figma 파일:

- https://www.figma.com/design/NWaPEFXBo5btAJHyKXOVfy/%F0%9F%8E%A8-AI-Agent

최근 반영한 핵심 node:

- Home 사이드 메뉴: `408:34299`
- Annual Report: `408:33063`
- Chat 추천 카드: `408:34097`
- Archive 최신 화면: `408:31621`

Annual Report `408:33063` 구현 기준:

- 프레임 390 × 844, 배경 `#000`.
- 월 카드 리스트 시작 y 135px, 좌우 여백 8px.
- 카드 374 × 275px, radius 32px, 간격 8px.
- 월 텍스트: Pretendard Black, 90px, `rgba(255,255,255,.6)`, 중앙 하단.
- March crop: 440 × 544px, top -269px.
- April crop: 419 × 523px, top -192px.
- May crop: 381 × 456px, bottom -10px.
- 원본은 `assets/figma/report/`에 저장되어 있다. Figma 임시 URL을 코드에 남기지 않는다.

기존 주요 node:

- 취향 선택: `417:2319`
- Home: `426:3570`, `426:3838`, `426:4345`
- Dieter Rams 카드/블러: `426:4519`, `426:4648`, `426:4757`
- Board: `426:3902`, `426:3924`
- Collection: `426:4018`, `426:4047`, `426:4157`, `426:4183`
- 검색 초기 화면: `426:4790`

별도 상세 콘텐츠 Figma:

- https://www.figma.com/design/koKY0ahfGowNOWijWSv0Tr/AI-agent_share
- node: `1:1616`, `1:1857`, `1:1761`, `1:2178`

## 7. 미완성 또는 다음 작업 시 확인할 부분

- Annual Report 연도 dropdown은 UI만 있으며 목록은 미구현.
- Annual Report 월 카드의 상세 화면은 미구현.
- 사이드 메뉴의 timeline, setting은 미구현.
- 단일 HTML 구조이므로 전역 class나 넓은 CSS selector를 추가하면 다른 화면이 깨질 수 있다. 화면 class로 scope한다.
- `styles.css`는 압축된 한 줄 규칙이 많다. 관련 selector만 최소 범위로 수정한다.
- Report/Home 이미지를 임시 Archive 이미지로 대체하지 않는다.
- progressive blur는 여러 단계의 backdrop-filter와 mask를 사용한다. 단순 단색 gradient로 대체하지 않는다.

## 8. 수정 후 필수 검증

```bash
node --check script.js
git diff --check
```

브라우저에서 최소한 아래를 직접 확인한다.

1. 온보딩 카드 선택, drag, pinch.
2. GNB Home / Archive / Search 전환과 hash.
3. Home 카드 swipe와 Dieter Rams 상세 진입/복귀.
4. 메뉴 열기/닫기, Report 진입, Report back → 메뉴 복귀.
5. Report의 March/April/May 이미지와 crop, 세로 스크롤.
6. Archive sticky layer와 뷰 전환.
7. Chat 추천 카드와 입력창이 겹치지 않는지.

## 9. 보안 및 작업 범위

- 대화, 이미지, 코드, 산출물을 사용자 승인 없이 업로드하거나 외부 서비스에 공유하지 않는다.
- Slack 플러그인 또는 Slack 앱은 사용하거나 연결하지 않는다.
- 사용자 승인 없이 원격 저장소 생성, push, 배포, 메시지 전송을 하지 않는다.
- Figma는 제공된 node를 읽고 로컬 구현에 필요한 원본 asset을 받는 범위로만 사용한다.
