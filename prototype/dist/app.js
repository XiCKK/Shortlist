import { films, categories, selectFilms, validSavedIds } from './data.js';

const main = document.querySelector('#main');
const dialogs = [...document.querySelectorAll('dialog')];
const bookmark = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 4h12v17l-6-4-6 4z"/></svg>';
const play = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 5 11 7-11 7z" fill="currentColor" stroke="none"/></svg>';
const arrow = '<span aria-hidden="true">↗</span>';
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[character]);
let storageBlocked = false;
function read(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } }
let saved = validSavedIds(read('shortlist.saved.v1', []));
const storedProfile = read('shortlist.profile.v1', {});
let profile = { name: typeof storedProfile?.name === 'string' ? storedProfile.name.slice(0, 80) : '', bio: typeof storedProfile?.bio === 'string' ? storedProfile.bio.slice(0, 240) : '' };
function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); return true; } catch { storageBlocked = true; return false; } }
let toastTimer;
function toast(message) { const item = document.querySelector('#toast'); item.textContent = message; item.classList.add('visible'); clearTimeout(toastTimer); toastTimer = setTimeout(() => item.classList.remove('visible'), 3500); }
const categoryLabel = id => categories.find(item => item.id === id)?.label || 'หนังอิสระ';
const filmMeta = film => [categoryLabel(film.category), film.minutes ? `${film.minutes} นาที` : 'กำลังเตรียมข้อมูล'].join(' · ');
function saveButton(film, compact = false) { const active = saved.includes(film.id); return `<button class="${compact ? 'card-save icon-button' : 'btn btn--secondary save-button'} ${active ? 'is-saved' : ''}" data-save="${film.id}" aria-pressed="${active}" aria-label="${active ? 'นำออกจากรายการ' : 'บันทึก'} ${escape(film.title)}">${bookmark}${compact ? '' : `<span>${active ? 'บันทึกแล้ว' : 'บันทึกรายการของฉัน'}</span>`}</button>`; }
function card(film, index = 0) { return `<article class="film-card card"><div class="poster-frame"><a class="poster-link m-zoom" href="#/film/${film.id}" aria-label="ดูรายละเอียด ${escape(film.title)}"><img src="${film.poster}" alt="โปสเตอร์ ${escape(film.title)}" width="400" height="600" loading="${index < 3 ? 'eager' : 'lazy'}" decoding="async" data-source="user-provided" data-subject="film poster"></a>${saveButton(film, true)}</div><div class="film-card-info"><p class="film-meta">${filmMeta(film)}</p><h3><a href="#/film/${film.id}">${escape(film.title)}</a></h3></div></article>`; }
function grid(items, className = '') { return `<div class="film-grid ${className}">${items.map(card).join('')}</div>`; }
function empty(title, text, canReset = false) { return `<div class="empty-state">${bookmark}<h2>${title}</h2><p>${text}</p>${canReset ? '<button class="btn btn--primary" id="reset-filters">ล้างตัวกรอง</button>' : `<a class="btn btn--primary" href="#/films">เลือกดูภาพยนตร์ ${arrow}</a>`}</div>`; }
function filmSection(title, link, items, subtitle = '') { return `<section class="catalog-section wrap" aria-label="${title}"><div class="section-heading"><div>${subtitle ? `<p class="eyebrow">${subtitle}</p>` : ''}<h2>${title}<span class="section-count">${String(items.length).padStart(2, '0')}</span></h2></div><a class="text-link" href="${link}">ดูทั้งหมด ${arrow}</a></div>${grid(items)}</section>`; }

function homePage() {
  const featured = films[0];
  return `<section class="hero" data-enter aria-labelledby="hero-title"><div class="hero-picture" data-enter-media><img src="assets/capybara.jpg" alt="คาปิบาราท่ามกลางธรรมชาติ" width="1575" height="1050" fetchpriority="high" data-source="user-provided" data-subject="capybara"></div><div class="hero-wash" aria-hidden="true"></div><div class="hero-content wrap"><p class="eyebrow hero-eyebrow"><span class="tiny-line"></span>ภาพยนตร์แนะนำ</p><h1 id="hero-title">Capybara<span class="hero-year">2026</span></h1><div class="hero-meta"><span>สารคดี</span><span>30 นาที</span><span>เรื่องเด่นจากแบบตัวอย่าง</span></div><p class="hero__lead">การเดินทางเล็ก ๆ ในโลกใบใหญ่<br>ออกไปพบเรื่องราวระหว่างทางด้วยกัน</p><div class="btn-row"><a class="btn btn--primary" href="#/film/${featured.id}">${play} ดูรายละเอียดหนัง</a>${saveButton(featured)}</div></div><div class="hero-foot wrap"><span>พื้นที่ของหนังสั้นและหนังอิสระ</span><span>เรื่องเด่น <b>01</b> / 01</span></div></section><section class="browse-strip wrap" aria-label="เลือกประเภทภาพยนตร์"><span class="eyebrow">วันนี้อยากดูแบบไหน</span><div class="category-links">${categories.map(category => `<a class="category-chip ${category.id === 'all' ? 'selected' : ''}" href="${category.id === 'all' ? '#/films' : `#/category/${category.id}`}">${category.label}</a>`).join('')}</div></section>${filmSection('ผลงานเข้าใหม่', '#/films', selectFilms().slice(0, 6), 'เรื่องใหม่ใน Shortlist')}${filmSection('เรื่องของความรัก', '#/category/romance', selectFilms({ category: 'romance' }), 'ความสัมพันธ์ในหลายมุมมอง')}<section class="collection-band wrap"><div><p class="eyebrow">หนังที่คุณเลือกเอง</p><h2>เจอเรื่องที่ใช่<br>เก็บไว้ดูวันต่อไป</h2><a class="text-link" href="#/saved">เปิดรายการของฉัน ${arrow}</a></div><span class="collection-mark" aria-hidden="true">${bookmark}</span></section>`;
}

function catalogPage(params, fixedCategory = null) {
  const category = fixedCategory || params.get('category') || 'all';
  const type = params.get('type') || 'all';
  const title = fixedCategory ? categoryLabel(category) : type === 'short' ? 'ภาพยนตร์สั้น' : type === 'independent' ? 'ภาพยนตร์อิสระ' : 'ภาพยนตร์ทั้งหมด';
  return `<section class="page-heading wrap"><a class="breadcrumb" href="#/">หน้าแรก</a><div class="page-heading-row"><div><p class="eyebrow">เลือกเรื่องที่อยากใช้เวลาด้วย</p><h1>${title}<span class="heading-period">.</span></h1></div><span class="catalog-total">${films.length} เรื่องในต้นแบบ</span></div><p class="page-intro">หนังสั้น หนังอิสระ และเรื่องราวที่รอให้คุณค้นพบ</p></section><section class="catalog-body wrap" aria-label="ค้นหาและกรองภาพยนตร์"><form id="catalog-form" class="catalog-filters"><div class="catalog-search"><label for="catalog-query">ค้นหาภาพยนตร์</label><input id="catalog-query" name="q" type="search" placeholder="ชื่อเรื่อง ผู้กำกับ หรือประเภท" value="${escape(params.get('q') || '')}"></div><div><label for="category-filter">ประเภท</label><select id="category-filter" name="category">${categories.map(item => `<option value="${item.id}" ${category === item.id ? 'selected' : ''}>${item.label}</option>`).join('')}</select></div><div><label for="duration-filter">ความยาว</label><select id="duration-filter" name="duration"><option value="all">ทุกความยาว</option><option value="15" ${params.get('duration') === '15' ? 'selected' : ''}>ไม่เกิน 15 นาที</option><option value="30" ${params.get('duration') === '30' ? 'selected' : ''}>ไม่เกิน 30 นาที</option></select></div><div><label for="sort-filter">เรียงตาม</label><select id="sort-filter" name="sort"><option value="latest">เข้าใหม่</option><option value="title" ${params.get('sort') === 'title' ? 'selected' : ''}>ชื่อเรื่อง</option><option value="duration" ${params.get('sort') === 'duration' ? 'selected' : ''}>สั้นไปยาว</option></select></div><input type="hidden" name="type" value="${escape(type)}"><button class="btn btn--primary filter-submit" type="submit">ค้นหาหนัง</button></form><div class="results-heading"><p id="catalog-summary" role="status"></p><span class="muted">เลือกโปสเตอร์เพื่อดูรายละเอียด</span></div><div id="catalog-results"></div></section>`;
}

function detailPage(film) {
  const related = selectFilms({ category: film.category }).filter(item => item.id !== film.id).slice(0, 4);
  const recommendations = related.length ? related : selectFilms().filter(item => item.id !== film.id).slice(0, 4);
  return `<section class="detail-page wrap"><a class="breadcrumb" href="#/films">← ภาพยนตร์ทั้งหมด</a><div class="detail-layout"><div class="detail-poster"><img src="${film.poster}" alt="โปสเตอร์ ${escape(film.title)}" width="400" height="600" data-source="user-provided" data-subject="film poster"></div><div class="detail-content"><p class="eyebrow">${categoryLabel(film.category)} · Shortlist</p><h1>${escape(film.title)}</h1>${film.subtitle ? `<p class="detail-subtitle">${escape(film.subtitle)}</p>` : ''}<div class="detail-meta">${film.year ? `<span>${film.year}</span>` : ''}${film.minutes ? `<span>${film.minutes} นาที</span>` : ''}<span>${film.type === 'short' ? 'ภาพยนตร์สั้น' : 'ภาพยนตร์อิสระ'}</span></div><div class="btn-row"><button class="btn btn--primary" data-play="${film.id}">${play} ดูวิดีโอสาธิต</button>${saveButton(film)}</div><p class="detail-demo-note">ทดลองการรับชมด้วยตัวอย่าง Sintel · ยังไม่ใช่หนังเต็มเรื่อง</p><div class="synopsis"><h2>เรื่องย่อ</h2><p>${film.synopsis ? escape(film.synopsis) : 'กำลังเตรียมข้อมูลเรื่องย่อสำหรับภาพยนตร์เรื่องนี้'}</p>${film.synopsis ? '<p class="metadata-note">เรื่องย่อและความยาวในหน้านี้เป็นข้อมูลจำลองสำหรับทดลองหน้าจอ</p>' : ''}</div><div class="film-facts"><div><h2>ผู้กำกับ</h2><p>${film.director ? escape(film.director) : 'กำลังเตรียมข้อมูล'}</p></div><div><h2>ปีที่เข้าฉาย</h2><p>${film.year || 'กำลังเตรียมข้อมูล'}</p></div><div><h2>ความเหมาะสม</h2><p>ยังไม่ระบุ</p></div><div><h2>เครดิตทีมงาน</h2><p>กำลังเตรียมข้อมูล</p></div></div>${film.tags.length ? `<div class="tags">${film.tags.map(tag => `<a href="#/films?q=${encodeURIComponent(tag)}">${escape(tag)}</a>`).join('')}</div>` : ''}</div></div></section>${filmSection('เรื่องถัดไปที่น่าจะชอบ', '#/films', recommendations)}`;
}

function savedPage() { const items = selectFilms({ savedIds: saved }); return `<section class="page-heading wrap"><a class="breadcrumb" href="#/">หน้าแรก</a><p class="eyebrow">คอลเลกชันส่วนตัว</p><h1>รายการของฉัน<span class="heading-period">.</span></h1><p class="page-intro">หนังที่คุณอยากเก็บไว้ดู · <span id="saved-total">${items.length}</span> เรื่อง</p><p class="metadata-note">เก็บไว้เฉพาะเบราว์เซอร์นี้</p></section><section class="saved-body wrap" aria-label="ภาพยนตร์ที่บันทึก">${items.length ? grid(items) : empty('ยังไม่มีหนังในรายการ', 'กดสัญลักษณ์บันทึกบนโปสเตอร์ แล้วหนังเรื่องนั้นจะมาอยู่ที่นี่')}</section>`; }
function profilePage() { return `<section class="profile-page wrap"><div class="profile-summary"><span class="profile-avatar" aria-hidden="true">${escape(profile.name ? [...profile.name][0].toUpperCase() : 'S')}</span><p class="eyebrow">โปรไฟล์ของคุณ</p><h1>${escape(profile.name || 'คนรักหนังสั้น')}<span class="heading-period">.</span></h1><span class="profile-badge">บัญชีทดลอง</span><p>พื้นที่เล็ก ๆ สำหรับหนังที่คุณชอบ</p><a class="text-link" href="#/saved">หนังที่บันทึก ${saved.length} เรื่อง ${arrow}</a></div><form id="profile-form" class="profile-form"><h2>แก้ไขโปรไฟล์</h2><p class="muted">ข้อมูลนี้เก็บเฉพาะเบราว์เซอร์ของคุณ</p><label for="profile-name">ชื่อโปรไฟล์</label><input id="profile-name" name="name" type="text" required maxlength="80" autocomplete="nickname" value="${escape(profile.name)}" placeholder="ชื่อที่อยากให้แสดง"><label for="profile-bio">เกี่ยวกับคุณ</label><textarea id="profile-bio" name="bio" rows="4" maxlength="240" placeholder="ชอบหนังแบบไหน หรือมีเรื่องไหนอยากแนะนำ">${escape(profile.bio)}</textarea><p class="metadata-note">ไม่ต้องใช้อีเมลหรือรหัสผ่านในการทดลอง</p><button class="btn btn--primary" type="submit">บันทึกโปรไฟล์ ${arrow}</button><p id="profile-status" role="status"></p></form></section>`; }

function updateSavedUI() {
  const count = document.querySelector('#saved-count'); count.textContent = saved.length; count.hidden = !saved.length;
  document.querySelectorAll('[data-save]').forEach(button => { const film = films.find(item => item.id === button.dataset.save); if (!film) return; const active = saved.includes(film.id); button.classList.toggle('is-saved', active); button.setAttribute('aria-pressed', active); button.setAttribute('aria-label', `${active ? 'นำออกจากรายการ' : 'บันทึก'} ${film.title}`); const label = button.querySelector('span'); if (label) label.textContent = active ? 'บันทึกแล้ว' : 'บันทึกรายการของฉัน'; });
}
function filterCatalog() {
  const form = document.querySelector('#catalog-form'); if (!form) return;
  const values = new FormData(form); const items = selectFilms({ query: values.get('q'), category: values.get('category'), duration: values.get('duration'), sort: values.get('sort'), type: values.get('type') });
  document.querySelector('#catalog-summary').textContent = `พบ ${items.length} เรื่อง`;
  document.querySelector('#catalog-results').innerHTML = items.length ? grid(items) : empty('ยังไม่พบเรื่องที่ค้นหา', 'ลองเปลี่ยนคำค้น หรือเลือกประเภทและความยาวใหม่', true);
  const params = new URLSearchParams(); for (const [key, value] of values) if (value && value !== 'all' && value !== 'latest') params.set(key, value);
  history.replaceState(null, '', `#/films${params.size ? `?${params}` : ''}`);
}
function closeDialogs() { dialogs.forEach(dialog => { if (dialog.open) dialog.close(); }); }
function openDialog(id) { closeDialogs(); const dialog = document.getElementById(id); dialog.showModal(); }
function playDemo(id) { const film = films.find(item => item.id === id); if (!film) return; document.querySelector('#player-title').textContent = `${film.title} · ทดลองรับชม`; document.querySelector('#video-error').hidden = true; openDialog('player-dialog'); const video = document.querySelector('#demo-video'); video.load(); video.play().catch(() => {}); }
let routeReady = false;
function render() {
  closeDialogs();
  let hash; try { hash = decodeURI(location.hash.slice(1) || '/'); } catch { hash = '/not-found'; }
  const [path, query] = hash.split('?'); const params = new URLSearchParams(query || ''); let title = 'พื้นที่ของหนังสั้น';
  if (path === '/' || path === '') main.innerHTML = homePage();
  else if (path === '/films') { main.innerHTML = catalogPage(params); title = 'ภาพยนตร์ทั้งหมด'; filterCatalog(); }
  else if (path.startsWith('/category/') && categories.some(item => item.id === path.slice(10))) { main.innerHTML = catalogPage(params, path.slice(10)); title = categoryLabel(path.slice(10)); filterCatalog(); }
  else if (path.startsWith('/film/') && films.some(item => item.id === path.slice(6))) { const film = films.find(item => item.id === path.slice(6)); main.innerHTML = detailPage(film); title = film.title; }
  else if (path === '/saved') { main.innerHTML = savedPage(); title = 'รายการของฉัน'; }
  else if (path === '/profile') { main.innerHTML = profilePage(); title = 'โปรไฟล์ของคุณ'; }
  else { main.innerHTML = `<section class="page-heading wrap"><h1>ไม่พบหน้านี้</h1>${empty('เลือกหนังเรื่องใหม่', 'กลับไปค้นพบภาพยนตร์ใน Shortlist ได้เสมอ')}</section>`; title = 'ไม่พบหน้าที่ค้นหา'; }
  document.title = `Shortlist — ${title}`; updateSavedUI(); window.scrollTo({ top: 0, behavior: 'instant' }); if (routeReady) main.focus({ preventScroll: true }); routeReady = true;
  document.querySelectorAll('.header-right a').forEach(link => { if (link.hash === location.hash) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current'); });
}

document.addEventListener('click', event => {
  const button = event.target.closest('[data-save]');
  if (button) { const id = button.dataset.save; if (!films.some(film => film.id === id)) return; const active = saved.includes(id); saved = active ? saved.filter(item => item !== id) : [...saved, id]; write('shortlist.saved.v1', saved); updateSavedUI(); if (location.hash === '#/saved') { const position = window.scrollY; main.innerHTML = savedPage(); window.scrollTo(0, position); document.querySelector('.saved-body button, .saved-body a')?.focus({ preventScroll: true }); } toast(storageBlocked ? 'บันทึกในครั้งนี้แล้ว แต่เบราว์เซอร์ไม่อนุญาตให้เก็บหลังปิดหน้า' : active ? 'นำออกจากรายการแล้ว' : 'เก็บหนังไว้ในรายการของคุณแล้ว'); }
  const watch = event.target.closest('[data-play]'); if (watch) playDemo(watch.dataset.play);
  const closer = event.target.closest('[data-close]'); if (closer) closer.closest('dialog').close();
  const link = event.target.closest('a[href^="#/"]'); if (link) closeDialogs();
  if (event.target.closest('#reset-filters')) { const form = document.querySelector('#catalog-form'); form.querySelector('#catalog-query').value = ''; for (const field of ['category', 'duration', 'type']) form.elements[field].value = 'all'; form.elements.sort.value = 'latest'; filterCatalog(); }
});
dialogs.forEach(dialog => {
  dialog.addEventListener('click', event => { if (event.target !== dialog) return; const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.classList.toggle('modal-open', dialogs.some(item => item.open)); if (dialog.id === 'menu-dialog') document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'false'); if (dialog.id === 'player-dialog') document.querySelector('#demo-video').pause(); });
  new MutationObserver(() => document.body.classList.toggle('modal-open', dialogs.some(item => item.open))).observe(dialog, { attributes: true, attributeFilter: ['open'] });
});
document.querySelector('#menu-toggle').addEventListener('click', () => { openDialog('menu-dialog'); document.querySelector('#menu-toggle').setAttribute('aria-expanded', 'true'); });
document.querySelector('#about-toggle').addEventListener('click', () => openDialog('about-dialog'));
function searchPreview() { const value = document.querySelector('#global-search').value; const items = selectFilms({ query: value }); document.querySelector('#search-summary').textContent = value.trim() ? `พบ ${items.length} เรื่อง` : 'ลองเริ่มจากหนังสักเรื่อง'; document.querySelector('#search-results').innerHTML = items.slice(0, 5).map(film => `<a class="search-result" href="#/film/${film.id}"><img src="${film.poster}" alt="" width="44" height="64"><span><strong>${escape(film.title)}</strong><small>${filmMeta(film)}</small></span>${arrow}</a>`).join('') || '<p class="no-search-results">ไม่พบเรื่องที่ค้นหา ลองใช้คำอื่นดูอีกครั้ง</p>'; }
document.querySelector('#search-toggle').addEventListener('click', () => { openDialog('search-dialog'); searchPreview(); document.querySelector('#global-search').focus(); });
document.querySelector('#global-search').addEventListener('input', searchPreview);
document.querySelector('#search-form').addEventListener('submit', event => { event.preventDefault(); const hash = `#/films?q=${encodeURIComponent(document.querySelector('#global-search').value.trim())}`; closeDialogs(); if (location.hash === hash) render(); else location.hash = hash; });
document.querySelector('#demo-video').addEventListener('error', () => { document.querySelector('#video-error').hidden = false; });
document.querySelector('#demo-video source').addEventListener('error', () => { document.querySelector('#video-error').hidden = false; });
main.addEventListener('submit', event => {
  if (event.target.id === 'catalog-form') { event.preventDefault(); filterCatalog(); }
  if (event.target.id === 'profile-form') { event.preventDefault(); const data = new FormData(event.target); const name = String(data.get('name') || '').trim(); if (!name || name.length > 80) { document.querySelector('#profile-name').focus(); document.querySelector('#profile-status').textContent = 'กรุณาใส่ชื่อโปรไฟล์ 1–80 ตัวอักษร'; return; } profile = { name, bio: String(data.get('bio') || '').trim().slice(0, 240) }; const persisted = write('shortlist.profile.v1', profile); render(); const message = persisted ? 'บันทึกโปรไฟล์ในเบราว์เซอร์นี้แล้ว' : 'บันทึกชั่วคราวแล้ว แต่เบราว์เซอร์ไม่อนุญาตให้เก็บหลังปิดหน้า'; document.querySelector('#profile-status').textContent = message; toast(message); }
});
main.addEventListener('change', event => { if (event.target.closest('#catalog-form')) filterCatalog(); });
main.addEventListener('input', event => { if (event.target.id === 'catalog-query') filterCatalog(); });
window.addEventListener('hashchange', render);
window.addEventListener('storage', event => { if (event.key === 'shortlist.saved.v1') { saved = validSavedIds(read('shortlist.saved.v1', [])); if (location.hash === '#/saved' || location.hash === '#/profile') render(); else updateSavedUI(); } });
render();
