const views = [...document.querySelectorAll('[data-view]')];
const navButtons = [...document.querySelectorAll('.nav-button')];
const tabTriggers = [...document.querySelectorAll('[data-target]')];
const gnb = document.querySelector('.gnb');
const messageInput = document.querySelector('#message');
const chatView = document.querySelector('.chat-view');
const chatConversation = document.querySelector('.chat-conversation');
const generalSearchScreen = document.querySelector('.general-search-screen');
const toast = document.querySelector('#toast');
const onboarding = document.querySelector('#onboarding');
const onboardingStages = [...document.querySelectorAll('[data-onboarding-stage]')];
const tasteViewport = document.querySelector('#tasteViewport');
const tasteCanvas = document.querySelector('#tasteCanvas');
const guide = document.querySelector('#onboardingGuide');
const completeTasteButton = document.querySelector('#completeTaste');
const statusTime = document.querySelector('.status-bar time');
const homeCarousel = document.querySelector('.feature-card-carousel');
const homeCardTrack = document.querySelector('#featureCardTrack');
const homeTitle = document.querySelector('#home-title');
const homeCovers = [...document.querySelectorAll('[data-home-cover]')];
const homeCards = [...document.querySelectorAll('[data-home-card]')];
const homeView = document.querySelector('.home-view');
const dieterDetail = document.querySelector('#dieterDetail');
const detailScroll = document.querySelector('#detailScroll');
const detailBack = document.querySelector('#detailBack');
const dieterProfileCard = document.querySelector('#dieterProfileCard');
const articleDetail = document.querySelector('#articleDetail');
const articleScroll = document.querySelector('#articleScroll');
const articleBack = document.querySelector('#articleBack');
const sideMenu = document.querySelector('#sideMenu');
const reportScreen = document.querySelector('#reportScreen');
const ticketWebview = document.querySelector('#ticketWebview');
const ticketWebviewFrame = ticketWebview?.querySelector('.ticket-webview-frame');
let currentTab = 'home';
let previousTab = 'home';
let toastTimer;
const stateKey = 'taste-agent-prototype';
function readState() {
  try { return JSON.parse(localStorage.getItem(stateKey)) || {}; } catch { return {}; }
}
function writeState(patch) {
  try { localStorage.setItem(stateKey, JSON.stringify({ ...readState(), ...patch })); } catch { /* file previews can restrict storage */ }
}
const restoredState = readState();
let onboardingActive = Boolean(onboarding) && !restoredState.onboardingComplete;
if (onboarding && !onboardingActive) onboarding.hidden = true;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 1800);
}

function openView(target, { updateHash = true } = {}) {
  if (!views.some(view => view.dataset.view === target)) return;
  if (target !== 'home') closeDieterDetail();
  if (target === 'chat' && currentTab !== 'chat') previousTab = currentTab;
  if (target !== 'chat') currentTab = target;
  views.forEach(view => {
    const active = view.dataset.view === target;
    view.hidden = !active;
    view.classList.toggle('is-active', active);
  });
  navButtons.forEach(button => {
    const active = button.dataset.target === target;
    button.classList.toggle('is-active', active);
    if (active) button.setAttribute('aria-current', 'page'); else button.removeAttribute('aria-current');
  });
  gnb.classList.toggle('is-hidden', target === 'chat' || onboardingActive);
  if (!onboardingActive && statusTime) statusTime.textContent = target === 'chat' ? '9:41' : '10:20';
  document.title = `${target[0].toUpperCase()}${target.slice(1)} — Taste Agent`;
  if (!onboardingActive && target !== 'chat') writeState({ lastView: target });
  if (updateHash) history.replaceState(null, '', `#${target}`);
}

tabTriggers.forEach(button => button.addEventListener('click', () => openView(button.dataset.target)));
document.querySelector('.close-chat').addEventListener('click', () => openView(previousTab));
function activateChatConversation() {
  if (!chatView || chatView.classList.contains('is-searching')) return;
  chatView.classList.add('is-conversation');
  messageInput.placeholder = '메시지를 입력하세요';
  requestAnimationFrame(() => { if (chatConversation) chatConversation.scrollTop = 0; });
}
messageInput?.addEventListener('focus', activateChatConversation);
document.querySelector('#chatForm').addEventListener('submit', event => {
  event.preventDefault();
  const message = messageInput.value.trim();
  if (!chatView.classList.contains('is-conversation')) activateChatConversation();
  if (message) {
    messageInput.value = '';
    showToast('메시지를 보냈어요');
  } else {
    showToast('메시지를 입력해 주세요');
  }
});
document.querySelectorAll('.chat-welcome button').forEach(button => button.addEventListener('click', () => {
  messageInput.value = button.querySelector('span').textContent.trim();
  messageInput.focus();
}));
document.querySelectorAll('.filters button:not(.filter-settings)').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.filters button').forEach(item => item.classList.remove('selected'));
  button.classList.add('selected');
}));

const archiveTabs = [...document.querySelectorAll('[data-archive-tab]')];
const archivePanels = [...document.querySelectorAll('[data-archive-panel]')];
const archiveContent = document.querySelector('.archive-v2-content');
archiveTabs.forEach(button => button.addEventListener('click', () => {
  const target = button.dataset.archiveTab;
  archiveTabs.forEach(item => {
    const active = item === button;
    item.classList.toggle('is-active', active);
    item.setAttribute('aria-selected', String(active));
  });
  archivePanels.forEach(panel => {
    const active = panel.dataset.archivePanel === target;
    panel.hidden = !active;
    panel.classList.toggle('is-active', active);
  });
  if (archiveContent) archiveContent.scrollTop = 0;
}));

const collectionViewToggle = document.querySelector('[data-collection-view-toggle]');
const collectionViewIcon = collectionViewToggle?.querySelector('img');
const collectionListView = document.querySelector('[data-collection-layout="list"]');
const collectionGridView = document.querySelector('[data-collection-layout="grid"]');
collectionViewToggle?.addEventListener('click', () => {
  const showGrid = collectionGridView.hidden;
  collectionGridView.hidden = !showGrid;
  collectionListView.hidden = showGrid;
  collectionViewToggle.classList.toggle('is-grid', showGrid);
  collectionViewToggle.setAttribute('aria-label', showGrid ? '리스트 보기로 전환' : '카드 보기로 전환');
  if (collectionViewIcon) collectionViewIcon.src = showGrid ? 'assets/figma/archive-view-list.svg' : 'assets/figma/archive-view-grid.svg';
});

document.querySelectorAll('.board-filters>div button').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('.board-filters>div button').forEach(item => item.classList.remove('is-selected'));
  button.classList.add('is-selected');
}));

const saveButtons = [...document.querySelectorAll('.feature-bookmark,.detail-save,.article-save')];
const savedItems = new Set(restoredState.savedItems || []);
saveButtons.forEach((button, index) => {
  const id = `${button.getAttribute('aria-label') || 'saved'}-${index}`;
  const render = () => {
    const saved = savedItems.has(id);
    button.classList.toggle('is-saved', saved);
    button.setAttribute('aria-pressed', String(saved));
  };
  render();
  button.addEventListener('click', event => {
    event.stopPropagation();
    if (savedItems.has(id)) savedItems.delete(id); else savedItems.add(id);
    render();
    writeState({ savedItems: [...savedItems] });
    showToast(savedItems.has(id) ? '아카이브에 저장했어요' : '저장을 취소했어요');
  });
});

const sortLabels = ['recent', 'oldest', 'title'];
document.querySelectorAll('.archive-v2-info>button:not(.collection-view-toggle),.collection-info-v2>div>button:not(.collection-view-toggle)').forEach(button => {
  button.addEventListener('click', () => {
    const next = (sortLabels.indexOf(button.textContent.trim()) + 1) % sortLabels.length;
    button.textContent = sortLabels[next];
    button.classList.add('sort-active');
    showToast(`${sortLabels[next]} 순으로 정렬했어요`);
  });
});

const filterSheet = document.querySelector('#filterSheet');
document.querySelector('.board-filter-settings')?.addEventListener('click', () => filterSheet?.showModal());
document.querySelector('.filter-settings')?.addEventListener('click', () => filterSheet?.showModal());
document.querySelector('#resetFilters')?.addEventListener('click', () => {
  filterSheet.querySelectorAll('input').forEach(input => { input.checked = true; });
});
document.querySelector('#applyFilters')?.addEventListener('click', () => {
  const allowed = new Set([...filterSheet.querySelectorAll('input:checked')].map(input => input.value));
  document.querySelectorAll('.board-grid figure').forEach(figure => {
    const source = figure.querySelector('.source-badge')?.alt;
    figure.classList.toggle('is-filtered-out', Boolean(source) && !allowed.has(source));
  });
  showToast(`${allowed.size}개 출처를 적용했어요`);
});

document.querySelector('.chat-input .attach')?.addEventListener('click', () => showToast('이미지나 링크를 추가할 수 있어요'));
document.querySelector('.chat-header button[aria-label="검색"]')?.addEventListener('click', () => {
  chatView?.classList.add('is-searching');
  generalSearchScreen?.setAttribute('aria-hidden', 'false');
  if (statusTime) statusTime.textContent = '10:20';
  requestAnimationFrame(() => generalSearchScreen?.querySelector('input')?.focus({ preventScroll: true }));
});
document.querySelector('.general-search-close')?.addEventListener('click', () => {
  chatView?.classList.remove('is-searching');
  generalSearchScreen?.setAttribute('aria-hidden', 'true');
  if (statusTime) statusTime.textContent = '9:41';
});
document.querySelector('.chat-header button[aria-label="대화 목록"]')?.addEventListener('click', () => showToast('저장된 대화가 아직 없어요'));
function openSideMenu() {
  sideMenu?.classList.add('is-open');
  sideMenu?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('menu-active');
}
function closeSideMenu() {
  sideMenu?.classList.remove('is-open');
  sideMenu?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('menu-active');
}
function openReport() {
  closeSideMenu();
  reportScreen?.classList.add('is-open');
  reportScreen?.setAttribute('aria-hidden', 'false');
  document.body.classList.add('report-active');
  document.title = 'Report — Taste Agent';
}
function closeReport({ returnToMenu = true } = {}) {
  reportScreen?.classList.remove('is-open');
  reportScreen?.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('report-active');
  document.title = 'Home — Taste Agent';
  if (returnToMenu) openSideMenu();
}
function openTicketWebview(event) {
  event?.preventDefault();
  event?.stopPropagation();
  if (!ticketWebview || !ticketWebviewFrame) return;
  if (!ticketWebviewFrame.getAttribute('src')) ticketWebviewFrame.src = ticketWebviewFrame.dataset.src;
  ticketWebview.classList.add('is-open');
  ticketWebview.setAttribute('aria-hidden', 'false');
  document.body.classList.add('ticket-webview-active');
  gnb.classList.add('is-hidden');
  document.title = '네이버 예약 — Taste Agent';
  ticketWebview.querySelector('.ticket-webview-close')?.focus({ preventScroll: true });
}
function closeTicketWebview() {
  if (!ticketWebview) return;
  ticketWebview.classList.remove('is-open');
  ticketWebview.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('ticket-webview-active');
  const chatOpen = views.some(view => view.dataset.view === 'chat' && !view.hidden);
  gnb.classList.toggle('is-hidden', chatOpen || onboardingActive);
  document.title = 'Home — Taste Agent';
}
document.querySelectorAll('[data-open-ticket-webview]').forEach(link => link.addEventListener('click', openTicketWebview));
ticketWebview?.querySelector('.ticket-webview-close')?.addEventListener('click', closeTicketWebview);
ticketWebviewFrame?.addEventListener('load', () => ticketWebview.classList.add('is-loaded'));
document.querySelector('.home-feature-menu')?.addEventListener('click', openSideMenu);
document.querySelectorAll('.menu-close,.menu-backdrop').forEach(button => button.addEventListener('click', closeSideMenu));
document.querySelector('[data-open-report]')?.addEventListener('click', openReport);
document.querySelector('.report-back')?.addEventListener('click', () => closeReport());
document.querySelector('.report-year')?.addEventListener('click', () => showToast('2025년 리포트를 보고 있어요'));
document.querySelectorAll('[data-menu-placeholder]').forEach(button => button.addEventListener('click', () => showToast(`${button.dataset.menuPlaceholder}은 준비 중이에요`)));
document.querySelectorAll('.report-month').forEach(button => button.addEventListener('click', () => showToast(`${button.textContent.trim()} 리포트 상세는 준비 중이에요`)));
document.addEventListener('keydown', event => {
  if (event.key !== 'Escape') return;
  if (ticketWebview?.classList.contains('is-open')) closeTicketWebview();
  else if (reportScreen?.classList.contains('is-open')) closeReport({ returnToMenu: false });
  else if (sideMenu?.classList.contains('is-open')) closeSideMenu();
});

const homeSlides = [
  { title: '서도호' },
  { title: 'Fritz Hansen' },
  { title: 'Dieter Rams' }
];
const homeCardStep = 286;
let homeSlideIndex = 0;
let homeTrackIndex = 1;
let homeSwipe = null;
let homeSwipeResetTimer;
let homeWheelLocked = false;
let detailActive = false;
let articleActive = false;
let detailGesture = null;

function openDieterDetail() {
  if (homeSlideIndex !== 2 || detailActive || !dieterDetail) return;
  detailActive = true;
  detailScroll.scrollTop = 0;
  updateDetailScrollChrome();
  dieterDetail.classList.add('is-open');
  dieterDetail.setAttribute('aria-hidden', 'false');
  homeView.classList.add('is-detail');
  document.body.classList.add('detail-active');
}

function closeDieterDetail() {
  if (!dieterDetail) return;
  if (articleActive) closeArticleDetail();
  detailActive = false;
  dieterDetail.classList.remove('is-open');
  dieterDetail.classList.remove('is-scrolled');
  dieterDetail.setAttribute('aria-hidden', 'true');
  homeView.classList.remove('is-detail');
  homeView.classList.remove('detail-scrolled');
  document.body.classList.remove('detail-active');
  dieterDetail.style.setProperty('--detail-scroll-progress', 0);
  dieterDetail.style.setProperty('--detail-scroll-blur', '0px');
}

function openArticleDetail() {
  if (!detailActive || articleActive || !articleDetail) return;
  articleActive = true;
  articleScroll.scrollTop = 0;
  document.body.classList.remove('article-scrolled');
  articleDetail.classList.add('is-open');
  articleDetail.setAttribute('aria-hidden', 'false');
  document.body.classList.add('article-active');
}

function closeArticleDetail() {
  if (!articleDetail) return;
  articleActive = false;
  articleDetail.classList.remove('is-open');
  articleDetail.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('article-active');
  document.body.classList.remove('article-scrolled');
  dieterProfileCard?.focus({ preventScroll: true });
}

let detailScrollFrame = 0;
function updateDetailScrollChrome() {
  if (!dieterDetail || !detailScroll) return;
  const linearProgress = Math.min(1, Math.max(0, detailScroll.scrollTop / 160));
  const progress = linearProgress * linearProgress * (3 - 2 * linearProgress);
  dieterDetail.style.setProperty('--detail-scroll-progress', progress.toFixed(3));
  dieterDetail.style.setProperty('--detail-scroll-blur', `${(progress * 50).toFixed(1)}px`);
  dieterDetail.classList.toggle('is-scrolled', linearProgress > .04);
  homeView?.classList.toggle('detail-scrolled', linearProgress > .04);
}

detailScroll?.addEventListener('scroll', () => {
  if (detailScrollFrame) return;
  detailScrollFrame = requestAnimationFrame(() => {
    detailScrollFrame = 0;
    updateDetailScrollChrome();
  });
}, { passive: true });

function positionHomeCards(trackIndex = homeTrackIndex, dragX = 0, animate = true) {
  if (!homeCardTrack) return;
  homeCardTrack.classList.toggle('is-dragging', !animate);
  homeCardTrack.style.transform = `translate3d(${-140 - trackIndex * homeCardStep + dragX}px,0,0)`;
}

function renderHomeSlide(nextIndex) {
  if (detailActive) closeDieterDetail();
  homeSlideIndex = (nextIndex + homeSlides.length) % homeSlides.length;
  homeCovers.forEach((cover, index) => cover.classList.toggle('is-active', index === homeSlideIndex));
  homeCards.forEach(card => card.classList.remove('feature-card-current'));
  homeCards[homeTrackIndex]?.classList.add('feature-card-current');
  if (homeTitle) {
    homeTitle.classList.add('is-changing');
    setTimeout(() => {
      homeTitle.textContent = homeSlides[homeSlideIndex].title;
      homeTitle.classList.remove('is-changing');
    }, 110);
  }
}

function moveHomeSlide(direction) {
  if (!direction || !homeCardTrack) return;
  clearTimeout(homeSwipeResetTimer);
  const nextIndex = (homeSlideIndex + direction + homeSlides.length) % homeSlides.length;
  let resetIndex = null;
  if (homeSlideIndex === 0 && direction < 0) {
    homeTrackIndex = 0;
    resetIndex = 3;
  } else if (homeSlideIndex === homeSlides.length - 1 && direction > 0) {
    homeTrackIndex = 4;
    resetIndex = 1;
  } else {
    homeTrackIndex = nextIndex + 1;
  }
  positionHomeCards(homeTrackIndex, 0, true);
  renderHomeSlide(nextIndex);
  if (resetIndex !== null) {
    homeSwipeResetTimer = setTimeout(() => {
      homeTrackIndex = resetIndex;
      positionHomeCards(homeTrackIndex, 0, false);
      requestAnimationFrame(() => homeCardTrack.classList.remove('is-dragging'));
      homeCards.forEach(card => card.classList.remove('feature-card-current'));
      homeCards[homeTrackIndex]?.classList.add('feature-card-current');
    }, 360);
  }
}

homeCarousel?.addEventListener('pointerdown', event => {
  if (event.button !== undefined && event.button !== 0) return;
  if (event.target.closest('a, button')) return;
  homeCarousel.setPointerCapture(event.pointerId);
  homeSwipe = { id: event.pointerId, startX: event.clientX, startY: event.clientY, x: event.clientX, startedAt: performance.now(), horizontal: false };
  homeCarousel.classList.add('is-dragging');
});
homeCarousel?.addEventListener('pointermove', event => {
  if (!homeSwipe || event.pointerId !== homeSwipe.id) return;
  const dx = event.clientX - homeSwipe.startX;
  const dy = event.clientY - homeSwipe.startY;
  if (!homeSwipe.horizontal && Math.abs(dx) > 5) homeSwipe.horizontal = Math.abs(dx) > Math.abs(dy);
  homeSwipe.x = event.clientX;
  if (homeSwipe.horizontal) positionHomeCards(homeTrackIndex, dx, false);
});
function endHomeSwipe(event) {
  if (!homeSwipe || event.pointerId !== homeSwipe.id) return;
  const dx = homeSwipe.x - homeSwipe.startX;
  const elapsed = Math.max(1, performance.now() - homeSwipe.startedAt);
  const shouldMove = homeSwipe.horizontal && (Math.abs(dx) > 48 || Math.abs(dx / elapsed) > .45);
  homeSwipe = null;
  homeCarousel.classList.remove('is-dragging');
  if (shouldMove) moveHomeSlide(dx < 0 ? 1 : -1); else positionHomeCards(homeTrackIndex, 0, true);
}
homeCarousel?.addEventListener('pointerup', endHomeSwipe);
homeCarousel?.addEventListener('pointercancel', endHomeSwipe);
homeCarousel?.addEventListener('keydown', event => {
  if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
  event.preventDefault();
  moveHomeSlide(event.key === 'ArrowRight' ? 1 : -1);
});
homeCarousel?.addEventListener('wheel', event => {
  if (homeWheelLocked || Math.abs(event.deltaX) < Math.abs(event.deltaY) || Math.abs(event.deltaX) < 12) return;
  event.preventDefault();
  homeWheelLocked = true;
  moveHomeSlide(event.deltaX > 0 ? 1 : -1);
  setTimeout(() => { homeWheelLocked = false; }, 420);
}, { passive: false });

homeView?.addEventListener('wheel', event => {
  if (articleActive) return;
  if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;
  if (!detailActive && homeSlideIndex === 2 && event.deltaY > 22) {
    event.preventDefault();
    openDieterDetail();
  } else if (detailActive && detailScroll.scrollTop <= 0 && event.deltaY < -28) {
    event.preventDefault();
    closeDieterDetail();
  }
}, { passive: false });

homeView?.addEventListener('pointerdown', event => {
  if (articleActive) return;
  if (event.button !== undefined && event.button !== 0) return;
  detailGesture = { id: event.pointerId, x: event.clientX, y: event.clientY };
});
homeView?.addEventListener('pointerup', event => {
  if (!detailGesture || detailGesture.id !== event.pointerId) return;
  const dx = event.clientX - detailGesture.x;
  const dy = event.clientY - detailGesture.y;
  detailGesture = null;
  if (Math.abs(dy) < 54 || Math.abs(dy) <= Math.abs(dx)) return;
  if (!detailActive && homeSlideIndex === 2 && dy < 0) openDieterDetail();
  else if (detailActive && detailScroll.scrollTop <= 0 && dy > 0) closeDieterDetail();
});
homeView?.addEventListener('pointercancel', () => { detailGesture = null; });
detailBack?.addEventListener('pointerdown', event => {
  event.stopPropagation();
  closeDieterDetail();
});
detailBack?.addEventListener('click', closeDieterDetail);
dieterProfileCard?.addEventListener('click', event => {
  if (event.target.closest('.detail-profile-arrow')) {
    openArticleDetail();
    return;
  }
  if (event.target.closest('button')) return;
  openArticleDetail();
});
dieterProfileCard?.addEventListener('keydown', event => {
  if (event.key !== 'Enter' && event.key !== ' ') return;
  event.preventDefault();
  openArticleDetail();
});
articleBack?.addEventListener('pointerdown', event => event.stopPropagation());
articleBack?.addEventListener('click', closeArticleDetail);
articleScroll?.addEventListener('scroll', () => {
  document.body.classList.toggle('article-scrolled', articleScroll.scrollTop > 48);
}, { passive: true });

function showOnboardingStage(stageName) {
  onboardingStages.forEach(stage => { stage.hidden = stage.dataset.onboardingStage !== stageName; });
}

function closeGuide() {
  if (!guide || guide.hidden) return;
  guide.classList.add('is-closing');
  setTimeout(() => {
    guide.hidden = true;
    guide.classList.remove('is-closing');
  }, 220);
}

function finishOnboarding(message = '') {
  if (!onboardingActive) return;
  onboardingActive = false;
  openView('home');
  if (statusTime) statusTime.textContent = '10:20';
  onboarding.classList.add('is-leaving');
  writeState({ onboardingComplete: true, selectedTastes: [...selectedTastes], lastView: 'home' });
  document.body.classList.remove('onboarding-active');
  gnb.classList.toggle('is-hidden', currentTab === 'chat');
  setTimeout(() => { onboarding.hidden = true; }, 320);
  if (message) showToast(message);
}

document.querySelector('#startTaste')?.addEventListener('click', () => {
  showOnboardingStage('taste');
  guide.hidden = false;
  requestAnimationFrame(renderTasteCanvas);
  document.querySelector('#closeGuide')?.focus();
});
document.querySelector('#closeGuide')?.addEventListener('click', closeGuide);
guide?.querySelector('.guide-dim')?.addEventListener('click', closeGuide);
document.querySelectorAll('[data-skip-onboarding]').forEach(button => button.addEventListener('click', () => finishOnboarding()));

const selectedTastes = new Set();
let suppressTasteClicksUntil = 0;
function toggleTasteCard(card) {
  if (!card) return;
  const taste = card.dataset.taste;
  if (selectedTastes.has(taste)) selectedTastes.delete(taste); else selectedTastes.add(taste);
  const selected = selectedTastes.has(taste);
  card.classList.toggle('is-selected', selected);
  card.setAttribute('aria-pressed', String(selected));
  completeTasteButton.disabled = selectedTastes.size === 0;
}
document.querySelectorAll('.taste-card').forEach(card => card.addEventListener('click', event => {
  if (Date.now() < suppressTasteClicksUntil) {
    event.preventDefault();
    return;
  }
  toggleTasteCard(card);
}));
completeTasteButton?.addEventListener('click', () => finishOnboarding('취향 설정을 완료했어요'));

const tasteTransform = { x: -405, y: -26, scale: 1 };
const tastePointers = new Map();
let tasteGesture = null;

function clamp(value, min, max) { return Math.min(max, Math.max(min, value)); }
function clampTastePosition() {
  if (!tasteViewport) return;
  const viewportWidth = tasteViewport.clientWidth;
  const viewportHeight = tasteViewport.clientHeight;
  const canvasWidth = 1200 * tasteTransform.scale;
  const canvasHeight = 960 * tasteTransform.scale;
  const margin = 22;
  tasteTransform.x = clamp(tasteTransform.x, Math.min(margin, viewportWidth - canvasWidth - margin), margin);
  tasteTransform.y = clamp(tasteTransform.y, Math.min(margin, viewportHeight - canvasHeight - margin), margin + 44);
}
function renderTasteCanvas() {
  if (!tasteCanvas) return;
  clampTastePosition();
  tasteCanvas.style.transform = `translate3d(${tasteTransform.x}px,${tasteTransform.y}px,0) scale(${tasteTransform.scale})`;
}
function pointerDistance(a, b) { return Math.hypot(a.x - b.x, a.y - b.y); }
function pointerMidpoint(a, b) { return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 }; }
function zoomTasteAt(clientX, clientY, nextScale) {
  const rect = tasteViewport.getBoundingClientRect();
  const localX = clientX - rect.left;
  const localY = clientY - rect.top;
  const oldScale = tasteTransform.scale;
  const scale = clamp(nextScale, .3, 1.4);
  tasteTransform.x = localX - (localX - tasteTransform.x) * (scale / oldScale);
  tasteTransform.y = localY - (localY - tasteTransform.y) * (scale / oldScale);
  tasteTransform.scale = scale;
  renderTasteCanvas();
}

tasteViewport?.addEventListener('wheel', event => {
  event.preventDefault();
  if (event.ctrlKey || event.metaKey) {
    zoomTasteAt(event.clientX, event.clientY, tasteTransform.scale * Math.exp(-event.deltaY * .012));
  } else {
    tasteTransform.x -= event.deltaX;
    tasteTransform.y -= event.deltaY;
    renderTasteCanvas();
  }
}, { passive: false });

tasteViewport?.addEventListener('pointerdown', event => {
  tasteViewport.setPointerCapture(event.pointerId);
  tastePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  tasteViewport.classList.add('is-dragging');
  const points = [...tastePointers.values()];
  if (points.length === 1) {
    tasteGesture = { kind: 'pan', last: points[0], moved: false, targetCard: event.target.closest('.taste-card') };
  } else if (points.length === 2) {
    const mid = pointerMidpoint(points[0], points[1]);
    tasteGesture = {
      kind: 'pinch', startDistance: pointerDistance(points[0], points[1]), startScale: tasteTransform.scale,
      startMid: mid, startX: tasteTransform.x, startY: tasteTransform.y, moved: true
    };
  }
});
tasteViewport?.addEventListener('pointermove', event => {
  if (!tastePointers.has(event.pointerId)) return;
  tastePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  const points = [...tastePointers.values()];
  if (points.length === 1 && tasteGesture?.kind === 'pan') {
    const point = points[0];
    const dx = point.x - tasteGesture.last.x;
    const dy = point.y - tasteGesture.last.y;
    if (Math.hypot(dx, dy) > 1) tasteGesture.moved = true;
    tasteTransform.x += dx;
    tasteTransform.y += dy;
    tasteGesture.last = point;
    renderTasteCanvas();
  } else if (points.length === 2 && tasteGesture?.kind === 'pinch') {
    const mid = pointerMidpoint(points[0], points[1]);
    const nextScale = clamp(tasteGesture.startScale * (pointerDistance(points[0], points[1]) / tasteGesture.startDistance), .3, 1.4);
    const ratio = nextScale / tasteGesture.startScale;
    tasteTransform.scale = nextScale;
    tasteTransform.x = mid.x - (tasteGesture.startMid.x - tasteGesture.startX) * ratio;
    tasteTransform.y = mid.y - (tasteGesture.startMid.y - tasteGesture.startY) * ratio;
    renderTasteCanvas();
  }
});
function endTastePointer(event) {
  const tappedCard = tastePointers.size === 1 && tasteGesture?.kind === 'pan' && !tasteGesture.moved ? tasteGesture.targetCard : null;
  if (tasteGesture?.moved || tappedCard) suppressTasteClicksUntil = Date.now() + 180;
  if (tappedCard) toggleTasteCard(tappedCard);
  tastePointers.delete(event.pointerId);
  const points = [...tastePointers.values()];
  if (points.length === 1) tasteGesture = { kind: 'pan', last: points[0], moved: false };
  else if (!points.length) {
    tasteGesture = null;
    tasteViewport.classList.remove('is-dragging');
  }
}
tasteViewport?.addEventListener('pointerup', endTastePointer);
tasteViewport?.addEventListener('pointercancel', endTastePointer);
tasteViewport?.addEventListener('dblclick', event => {
  if (event.target.closest('.taste-card')) return;
  zoomTasteAt(event.clientX, event.clientY, tasteTransform.scale < .85 ? .95 : .65);
});
window.addEventListener('resize', renderTasteCanvas);

window.addEventListener('hashchange', () => openView(location.hash.slice(1) || restoredState.lastView || 'home', { updateHash: false }));
document.body.classList.toggle('onboarding-active', onboardingActive);
if (!onboardingActive && statusTime) statusTime.textContent = '10:20';
openView(location.hash.slice(1) || restoredState.lastView || 'home', { updateHash: false });
