/* Kensington Hotels & Resorts — 모바일 체크인 / 모바일 키 목업 데모
 * 모든 "기능"은 버튼 인터랙션 시뮬레이션이며 실제 NFC·BLE·결제 연동은 없습니다. */
(() => {
  'use strict';

  /* ---------------- icons (line style) ---------------- */
  const P = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const I = {
    menu: P('<path d="M3 8h18M3 15h18"/>'),
    back: P('<path d="M15 5l-7 7 7 7"/>'),
    close: P('<path d="M5 5l14 14M19 5L5 19"/>'),
    right: P('<path d="M9 5l7 7-7 7"/>'),
    plus: P('<path d="M12 5v14M5 12h14"/>'),
    pin: P('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    cal: P('<rect x="3.5" y="5" width="17" height="15.5" rx="1.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>'),
    user: P('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6"/>'),
    users: P('<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c1-3.6 3.6-5.5 6.5-5.5s5.5 1.9 6.5 5.5"/><path d="M15.5 4.8a3.5 3.5 0 0 1 0 6.4M18 14.8c1.8.7 3 2.4 3.5 5.2"/>'),
    userPlus: P('<circle cx="10" cy="8" r="4"/><path d="M2.5 21c1.2-4 4.2-6 7.5-6 1.6 0 3.1.4 4.3 1.3M19 14v6M16 17h6"/>'),
    check: P('<path d="M5 12.5l4.5 4.5L19 7.5"/>'),
    lock: P('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/>'),
    unlock: P('<rect x="5" y="10.5" width="14" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 7.7-1.5"/>'),
    nfc: P('<path d="M6 8.5a5 5 0 0 1 0 7M9.5 6a8.5 8.5 0 0 1 0 12M13 3.5a12 12 0 0 1 0 17"/><circle cx="3.5" cy="12" r="1" fill="currentColor"/>'),
    ble: P('<path d="M7 7.5l10 9-5 4.5V3l5 4.5-10 9"/>'),
    key: P('<circle cx="8" cy="15" r="4"/><path d="M11 12l8.5-8.5M16 7l2.5 2.5M14 9l2 2"/>'),
    bell: P('<path d="M6 16V11a6 6 0 0 1 12 0v5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>'),
    card: P('<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="M3 10h18M7 15h3"/>'),
    home: P('<path d="M4 10.5L12 4l8 6.5V20H4z"/><path d="M10 20v-5h4v5"/>'),
    list: P('<rect x="4" y="3.5" width="16" height="17" rx="1.5"/><path d="M8 8.5h8M8 12.5h8M8 16.5h5"/>'),
    sliders: P('<path d="M4 7h10M18 7h2M4 17h4M12 17h8"/><circle cx="16" cy="7" r="2"/><circle cx="10" cy="17" r="2"/>'),
    phone: P('<path d="M5 4h3.5l1.5 4-2 1.3a10 10 0 0 0 6.7 6.7L16 14l4 1.5V19a1.5 1.5 0 0 1-1.6 1.5C10.5 20 4 13.5 3.5 5.6A1.5 1.5 0 0 1 5 4z"/>'),
    door: P('<path d="M5 21V4.5A1.5 1.5 0 0 1 6.5 3h11A1.5 1.5 0 0 1 19 4.5V21M3 21h18"/><circle cx="15" cy="12.5" r="1" fill="currentColor"/>'),
    info: P('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5M12 7.5v.5"/>'),
    clock: P('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>'),
    gift: P('<rect x="3.5" y="9" width="17" height="11.5" rx="1"/><path d="M2.5 9h19M12 9v11.5M12 9S10.5 4 8 4.5 7 9 12 9zm0 0s1.5-5 4-4.5S17 9 12 9z"/>'),
    crown: P('<path d="M4 18l-1-10 5 4 4-7 4 7 5-4-1 10z"/><path d="M4 21h16"/>'),
    chat: P('<path d="M4 5.5h16v10.5H10l-4.5 3.5V16H4z"/><path d="M8 9.5h8M8 12.5h5"/>'),
    send: P('<path d="M4 12l16-7.5-6 15.5-2.6-6.4z"/><path d="M11.4 13.6L20 4.5"/>'),
    refresh: P('<path d="M19.5 11a7.5 7.5 0 1 0-2.2 5.3"/><path d="M19.5 5v6h-6"/>'),
    bag: P('<path d="M5 8h14l-1 12.5H6z"/><path d="M9 10V7a3 3 0 0 1 6 0v3"/>'),
    spark: P('<path d="M11 3l1.9 5.1L18 10l-5.1 1.9L11 17l-1.9-5.1L4 10l5.1-1.9z"/><path d="M18.5 14.5l.8 1.9 1.9.8-1.9.8-.8 1.9-.8-1.9-1.9-.8 1.9-.8z"/>'),
    swap: P('<path d="M4 8h14l-4-4M20 16H6l4 4"/>'),
    coffee: P('<path d="M4 10h12v5a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 11.5h1.5a2.5 2.5 0 0 1 0 5H16M8 4.5c0 1.5 1 1.5 1 3M12 4.5c0 1.5 1 1.5 1 3M3 22h14"/>'),
    tube: P('<rect x="7" y="3" width="10" height="18" rx="1.5"/><path d="M7 7h10M19.5 6v12"/>'),
    bath: P('<path d="M3 12h18v2a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5zM6 12V6a2.5 2.5 0 0 1 5 0M7 19l-1 2M17 19l1 2"/><circle cx="13.5" cy="7.5" r=".6" fill="currentColor"/><circle cx="15" cy="9.5" r=".6" fill="currentColor"/>'),
    bed: P('<rect x="4" y="4" width="16" height="16" rx="1.5"/><rect x="7" y="7" width="4" height="3" rx=".8"/><rect x="13" y="7" width="4" height="3" rx=".8"/><path d="M4 13h16"/>'),
    trash: P('<path d="M5 7h14M10 7V4.5h4V7M7 7l1 13h8l1-13"/>')
  };

  const WORDMARK = `<svg class="wordmark" viewBox="0 0 120 23" aria-label="KENSINGTON HOTELS &amp; RESORTS" role="img"><text x="60" y="13" text-anchor="middle" textLength="119" lengthAdjust="spacingAndGlyphs" font-family="'Helvetica Neue',Arial,sans-serif" font-size="15" font-weight="600" fill="currentColor">KENSINGTON</text><text x="60" y="21.5" text-anchor="middle" textLength="117" lengthAdjust="spacing" font-family="'Helvetica Neue',Arial,sans-serif" font-size="5" fill="currentColor">HOTELS &amp; RESORTS</text></svg>`;
  const EMBLEM = `<svg viewBox="0 0 100 120" aria-hidden="true"><path d="M30 34 L33 18 L41 27 L50 13 L59 27 L67 18 L70 34 Z" fill="currentColor"/><rect x="29" y="36" width="42" height="4" rx="1" fill="currentColor"/><circle cx="50" cy="78" r="34" fill="none" stroke="currentColor" stroke-width="3.5"/><circle cx="50" cy="78" r="28.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-dasharray=".5 3.6" stroke-linecap="round"/><text x="50" y="92" text-anchor="middle" font-family="Georgia,'Times New Roman',serif" font-size="40" font-weight="700" fill="currentColor">K</text></svg>`;

  /* ---------------- illustrated scenes (self-contained, no external images) ---------------- */
  let uid = 0;
  const rnd = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);
  function windows(x, y, cols, rows, w, h, gx, gy, seed, lit = 0.62) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < rows; i++) for (let j = 0; j < cols; j++) {
      const on = r() < lit;
      s += `<rect x="${x + j * gx}" y="${y + i * gy}" width="${w}" height="${h}" fill="${on ? (r() < .5 ? '#ffd9a0' : '#f6c27a') : '#1c2a48'}" opacity="${on ? (0.75 + r() * .25).toFixed(2) : 1}"/>`;
    }
    return s;
  }
  function stars(n, seed, h = 120) {
    const r = rnd(seed); let s = '';
    for (let i = 0; i < n; i++) s += `<circle cx="${(r() * 400).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(r() * 1.1 + .3).toFixed(2)}" fill="#fff" opacity="${(r() * .6 + .2).toFixed(2)}"/>`;
    return s;
  }
  function scene(theme) {
    const id = 'g' + (++uid);
    if (theme === 'hero') return `<svg class="scene" viewBox="0 0 400 640" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122b"/><stop offset=".55" stop-color="#1b3566"/><stop offset="1" stop-color="#2b4a7d"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f6f8f"/><stop offset="1" stop-color="#0a2c45"/></linearGradient>
      <radialGradient id="${id}c" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffe3b0" stop-opacity=".9"/><stop offset="1" stop-color="#ffe3b0" stop-opacity="0"/></radialGradient></defs>
      <rect width="400" height="640" fill="url(#${id}a)"/>${stars(70, 7, 260)}
      <path d="M0 420 L60 380 L120 400 L190 360 L260 395 L330 370 L400 400 V470 H0Z" fill="#0f2142" opacity=".9"/>
      <rect x="-10" y="250" width="200" height="230" fill="#14254a"/><rect x="-10" y="240" width="210" height="14" fill="#1d3363"/>
      ${windows(4, 266, 12, 10, 9, 11, 15.5, 20, 11, .7)}
      <rect x="190" y="320" width="120" height="160" fill="#172a52"/>${windows(198, 334, 7, 7, 8, 10, 15.5, 19, 23, .55)}
      <g fill="#0a1630"><path d="M330 470 q8-60 6-110 q-14 6-30 0 q16-8 30-6 q-10-18-28-20 q20-2 34 14 q4-20 22-26 q-8 16-14 32 q22-4 34 8 q-20-2-30 2 q4 50-4 106z"/><path d="M362 470 q6-40 4-80 q-10 4-22 0 q12-6 22-4 q-6-12-20-14 q14-2 24 10 q4-14 16-18 q-6 12-10 22 q14-2 24 6 q-14-2-22 2 q2 36-4 76z" opacity=".8"/></g>
      <rect x="0" y="470" width="400" height="170" fill="url(#${id}b)"/>
      <ellipse cx="110" cy="520" rx="120" ry="18" fill="url(#${id}c)" opacity=".5"/><ellipse cx="260" cy="560" rx="110" ry="14" fill="url(#${id}c)" opacity=".35"/>
      <g stroke="#9fd6ee" stroke-opacity=".35" stroke-width="1.2" fill="none"><path d="M20 500 q20 -6 40 0 t40 0 t40 0"/><path d="M200 590 q20 -6 40 0 t40 0 t40 0"/><path d="M90 615 q20 -6 40 0 t40 0"/></g>
      <g transform="translate(250 525) scale(1 .35)" opacity=".35" fill="none" stroke="#e8d3b5"><circle r="70" stroke-width="3"/><circle r="58" stroke-dasharray="2 6"/></g>
      <rect x="0" y="466" width="400" height="6" fill="#e9d9c0" opacity=".55"/></svg>`;
    if (theme === 'city') return `<svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a1736"/><stop offset="1" stop-color="#3b4f84"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22355e"/><stop offset="1" stop-color="#0b1530"/></linearGradient></defs>
      <rect width="400" height="240" fill="url(#${id}a)"/>${stars(40, 3, 90)}<circle cx="330" cy="46" r="16" fill="#f4e6c8" opacity=".9"/>
      <g fill="#122347"><rect x="10" y="90" width="46" height="90"/><rect x="62" y="60" width="38" height="120"/><rect x="260" y="80" width="40" height="100"/><rect x="306" y="104" width="34" height="76"/><rect x="346" y="70" width="50" height="110"/></g>
      ${windows(16, 98, 4, 6, 6, 7, 10, 13, 5, .5)}${windows(68, 68, 3, 8, 6, 8, 11, 13, 9, .55)}${windows(352, 78, 4, 7, 6, 8, 11, 14, 17, .5)}
      <rect x="130" y="34" width="104" height="146" fill="#16294f"/><rect x="126" y="28" width="112" height="8" fill="#22396a"/>
      ${windows(138, 44, 7, 9, 8, 9, 13.5, 14.5, 31, .68)}
      <rect x="0" y="180" width="400" height="60" fill="url(#${id}b)"/>
      <g opacity=".35">${windows(138, 186, 7, 3, 8, 3, 13.5, 8, 31, .68)}</g>
      <g stroke="#f6c27a" stroke-opacity=".3"><path d="M30 200h60M150 212h80M260 204h70M60 226h50"/></g></svg>`;
    if (theme === 'mountain') return `<svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3c62"/><stop offset=".6" stop-color="#b98a7a"/><stop offset="1" stop-color="#f0c39a"/></linearGradient></defs>
      <rect width="400" height="240" fill="url(#${id}a)"/>${stars(18, 13, 60)}
      <path d="M0 150 L70 70 L110 110 L170 40 L230 120 L270 90 L330 140 L400 80 V240 H0Z" fill="#4b4f6e"/>
      <path d="M150 62 L170 40 L190 68 L176 62 L166 72Z" fill="#e8e2dc" opacity=".8"/>
      <path d="M0 180 L60 130 L130 170 L200 120 L280 175 L350 140 L400 165 V240 H0Z" fill="#2f344f"/>
      <rect x="210" y="160" width="120" height="44" fill="#1d2138"/><path d="M204 162 L270 138 L336 162Z" fill="#262b47"/>
      ${windows(218, 168, 8, 2, 8, 8, 13.5, 15, 41, .75)}
      <path d="M0 205 H400 V240 H0Z" fill="#191c30"/>
      <g fill="#14172a">${[20, 48, 80, 350, 378].map((x, i) => `<path d="M${x} 212 l10 -${30 + i * 4} l10 ${30 + i * 4}z"/>`).join('')}</g></svg>`;
    if (theme === 'sea') return `<svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#f6d3a8"/><stop offset=".55" stop-color="#f4b38a"/><stop offset="1" stop-color="#e99a7c"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4f8db1"/><stop offset="1" stop-color="#1f4f74"/></linearGradient></defs>
      <rect width="400" height="240" fill="url(#${id}a)"/><circle cx="270" cy="128" r="30" fill="#fff4dd" opacity=".95"/>
      <path d="M0 132 Q60 110 120 128 T240 124 L240 140 H0Z" fill="#7a8fa6" opacity=".6"/>
      <rect x="0" y="136" width="400" height="104" fill="url(#${id}b)"/>
      <g stroke="#fff" stroke-opacity=".45" stroke-width="1.5" fill="none"><path d="M230 152h80M244 166h52M256 180h28"/><path d="M20 190 q15 -5 30 0 t30 0M300 210 q15 -5 30 0 t30 0M120 220 q15 -5 30 0"/></g>
      <path d="M0 200 Q40 176 90 186 L120 240 H0Z" fill="#2c3a2c"/><g fill="#1f2b20"><path d="M40 186 q4 -40 2 -60 q-10 2 -20 -4 q14 -2 22 0 q-4 -10 -16 -14 q14 2 20 10 q4 -12 14 -14 q-6 10 -8 18 q14 0 20 8 q-12 -2 -20 0 q2 30 -2 56z"/></g></svg>`;
    if (theme === 'autumn') return `<svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#b9dcf0"/><stop offset="1" stop-color="#eaf4f6"/></linearGradient></defs>
      <rect width="400" height="240" fill="url(#${id}a)"/><rect y="190" width="400" height="50" fill="#9cc25a"/>
      ${[[60, 120, 70, '#e07a2a'], [140, 110, 60, '#f0a83a'], [210, 125, 66, '#d4572a'], [300, 115, 72, '#e9b546'], [360, 130, 52, '#c8642c']].map(([x, y, r, c]) => `<rect x="${x - 4}" y="${y + 30}" width="8" height="${190 - y - 30}" fill="#6b4a2f"/><circle cx="${x}" cy="${y}" r="${r / 2}" fill="${c}"/><circle cx="${x - r / 4}" cy="${y + 12}" r="${r / 3}" fill="${c}" opacity=".85"/>`).join('')}
      <path d="M250 190 l18 -90 l18 90z" fill="#2f6b3a"/></svg>`;
    if (theme === 'gold') return `<svg class="scene" viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#242424"/><stop offset="1" stop-color="#0d0d0d"/></linearGradient></defs>
      <rect width="400" height="240" fill="url(#${id}a)"/><path d="M0 170 Q120 120 400 190 V240 H0Z" fill="#1a1a1a"/><path d="M0 60 Q200 160 400 40" stroke="#b09479" stroke-opacity=".35" fill="none" stroke-width="2"/>
      <g transform="translate(160 50) scale(.8)" color="#b09479">${EMBLEM.replace('<svg viewBox="0 0 100 120" aria-hidden="true">', '').replace('</svg>', '')}</g></svg>`;
    return '';
  }
  /* ---------------- helpers ---------------- */
  const DAY = ['일', '월', '화', '수', '목', '금', '토'];
  const pad = (n) => String(n).padStart(2, '0');
  const iso = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const fmtD = (s) => { const d = parse(s); return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DAY[d.getDay()]})`; };
  const fmtS = (s) => { const d = parse(s); return `${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DAY[d.getDay()]})`; };
  const nights = (r) => Math.round((parse(r.checkOut) - parse(r.checkIn)) / 86400000);
  const won = (n) => n.toLocaleString('ko-KR') + '원';
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normPhone = (s) => s.replace(/\D/g, '');
  const fmtPhone = (s) => { const d = normPhone(s); return d.length === 11 ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}` : s; };
  const maskPhone = (s) => s.replace(/(\d{3})-(\d{2})\d{2}-(\d{4})/, '$1-$2**-$3');
  const $ = (sel, root = document) => root.querySelector(sel);

  /* ---------------- state ---------------- */
  const STORE = 'kh-demo-state-v3';
  function initialState() {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return {
      persona: 'primary',
      users: {
        primary: { name: '홍길동', phone: '010-1234-5678', grade: 'K MEMBERSHIP GOLD', no: 'N 0120191234567', point: 12400 },
        companion: { name: '김민지', phone: '010-9876-5432', grade: 'K MEMBERSHIP SILVER', no: 'N 0120207654321', point: 3200 }
      },
      reservations: [
        {
          id: 'KH2610-118820', hotel: '켄싱턴리조트 가평', area: '경기 가평군', room: '디럭스 패밀리 트윈', view: '북한강 리버뷰', theme: 'sea',
          checkIn: iso(t), checkOut: iso(addDays(t, 2)), inTime: '15:00', outTime: '11:00', adults: 3, children: 0,
          status: 'waiting', ble: true, lock: 'K-Lock Pro · NFC / BLE', roomNo: '1207', floor: '12F', bleOn: false,
          guests: [{ id: 'g1', name: '김민지', phone: '010-9876-5432', state: 'accepted' }],
          pay: { brand: 'SHINHAN CARD', label: '신한카드', last4: '4821', amount: 428000 }
        },
        {
          id: 'KH2611-204551', hotel: '켄싱턴리조트 가평', area: '경기 가평군', room: '패밀리 스위트 (취사형)', view: '칼봉산 마운틴뷰', theme: 'mountain', kitchen: true,
          checkIn: iso(addDays(t, 2)), checkOut: iso(addDays(t, 4)), inTime: '15:00', outTime: '11:00', adults: 2, children: 2,
          status: 'waiting', ble: false, lock: 'K-Lock Classic · NFC 전용', roomNo: 'B-305', floor: 'B동 3F', bleOn: false,
          guests: [],
          pay: { brand: 'HYUNDAI CARD', label: '현대카드', last4: '1093', amount: 612000 }
        },
        {
          id: 'KH2610-305517', hotel: '켄싱턴리조트 가평', area: '경기 가평군', room: '스탠다드 더블', view: '북한강 리버뷰', theme: 'gold',
          checkIn: iso(addDays(t, 9)), checkOut: iso(addDays(t, 10)), inTime: '15:00', outTime: '11:00', adults: 2, children: 0,
          status: 'waiting', ble: true, lock: 'K-Lock Pro · NFC / BLE', roomNo: '903', floor: '9F', bleOn: false,
          guests: [],
          pay: { brand: 'KB KOOKMIN CARD', label: 'KB국민카드', last4: '7710', amount: 214000 }
        },
        {
          id: 'KH2607-073102', hotel: '켄싱턴리조트 가평', area: '경기 가평군', room: '리버 디럭스', view: '북한강 리버뷰', theme: 'autumn',
          checkIn: iso(addDays(t, -82)), checkOut: iso(addDays(t, -79)), inTime: '15:00', outTime: '11:00', adults: 2, children: 0,
          status: 'completed', ble: true, lock: 'K-Lock Pro · NFC / BLE', roomNo: '815', floor: '8F', bleOn: false,
          guests: [{ id: 'g0', name: '이서준', phone: '010-5555-1212', state: 'accepted' }],
          pay: { brand: 'SHINHAN CARD', label: '신한카드', last4: '4821', amount: 735000 }
        }
      ]
    };
  }
  let S;
  try { S = JSON.parse(localStorage.getItem(STORE)) || initialState(); } catch (e) { S = initialState(); }
  const save = () => localStorage.setItem(STORE, JSON.stringify(S));

  const me = () => S.users[S.persona];
  const isPrimary = () => S.persona === 'primary';
  const getRes = (id) => S.reservations.find((r) => r.id === id);
  const myGuestEntry = (r) => r.guests.find((g) => normPhone(g.phone) === normPhone(S.users.companion.phone));
  const visibleRes = () => S.reservations
    .filter((r) => isPrimary() || (myGuestEntry(r) && myGuestEntry(r).state === 'accepted'))
    .sort((a, b) => a.checkIn.localeCompare(b.checkIn));
  const canUseKey = (r) => r.status === 'checkedIn' && (isPrimary() || (myGuestEntry(r) && myGuestEntry(r).state === 'accepted'));
  const capacity = (r) => r.adults + r.children - 1;

  const STATUS = {
    waiting: { label: '체크인 대기', chip: 'chip-gray' },
    available: { label: '체크인 가능', chip: 'chip-warn' },
    checkedIn: { label: '체크인 완료', chip: 'chip-dark' },
    completed: { label: '이용 완료', chip: 'chip-gray' }
  };
  /* ---------------- AI 주변 관광지 추천 (목업: 실제 AI 대신 룰 + 랜덤값) ----------------
   * 예약 인원 구성(어린이 동반/성인 일행/2인), 등록 동숙자 수, 투숙 시기로 태그 가중치를 매기고
   * 앱 실행마다 바뀌는 시드 랜덤값을 더해 적합도(%)를 만든다. 같은 실행 중에는 값이 고정된다. */
  const SPOTS = [
    { name: '남이섬', desc: '메타세쿼이아길 · 선착장 배편', km: 6.2, base: 30, tags: ['couple', 'family', 'nature'] },
    { name: '아침고요수목원', desc: '사계절 정원 · 오색별빛정원전', km: 21.5, base: 24, tags: ['couple', 'nature', 'photo'] },
    { name: '쁘띠프랑스', desc: '프랑스 테마 마을 · 어린왕자', km: 12.8, base: 18, tags: ['family', 'kids', 'photo'] },
    { name: '피노키오와 다빈치', desc: '이탈리아 마을 · 마리오네트 공연', km: 13.1, base: 14, tags: ['family', 'kids'] },
    { name: '가평 레일바이크', desc: '북한강 철교 위 레일바이크', km: 4.7, base: 20, tags: ['group', 'family', 'couple', 'activity'] },
    { name: '자라섬', desc: '캠핑 · 계절 꽃 축제', km: 3.9, base: 16, tags: ['group', 'nature', 'activity'] },
    { name: '청평호 수상레저', desc: '웨이크보드 · 바나나보트', km: 15.4, base: 15, tags: ['group', 'activity'] },
    { name: '에델바이스 스위스테마파크', desc: '스위스 테마 마을 · 치즈 체험', km: 24.0, base: 12, tags: ['family', 'kids', 'photo'] },
    { name: '가평 잣향기푸른숲', desc: '잣나무 숲 치유 산책로', km: 17.6, base: 10, tags: ['couple', 'nature'] },
    { name: '용추계곡', desc: '옥빛 계곡 트레킹', km: 9.3, base: 10, tags: ['group', 'nature', 'activity'] }
  ];
  const SALT = Math.floor(Math.random() * 1e9);
  function seeded(str) {
    let h = (2166136261 ^ SALT) >>> 0;
    for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return () => { h = Math.imul(h ^ (h >>> 15), 2246822507); h = Math.imul(h ^ (h >>> 13), 3266489909); h ^= h >>> 16; return (h >>> 0) / 4294967296; };
  }
  function recommend(r) {
    const party = r.adults + r.children;
    const companions = r.guests.filter((g) => g.state === 'accepted').length;
    const month = parse(r.checkIn).getMonth() + 1;
    const w = {};
    const add = (tag, v) => { w[tag] = (w[tag] || 0) + v; };
    let label;
    if (r.children > 0) { add('family', 20); add('kids', 16); label = `어린이 동반 ${party}인 가족`; }
    else if (r.adults >= 3) { add('group', 22); add('activity', 10); label = `성인 ${r.adults}인 일행`; }
    else { add('couple', 22); add('photo', 8); label = '2인 커플'; }
    if (companions >= 2) add('group', 6);
    if ([3, 4, 5, 9, 10, 11].includes(month)) add('nature', 8);
    else if ([6, 7, 8].includes(month)) add('activity', 8);
    else add('photo', 6);
    const rnd = seeded(`${r.id}|${party}|${companions}`);
    const ranked = SPOTS.map((s) => ({ ...s, raw: s.base * 0.8 + s.tags.reduce((sum, t) => sum + (w[t] || 0), 0) + rnd() * 8 }))
      .sort((a, b) => b.raw - a.raw).slice(0, 4);
    // 1위는 90~99%, 이하 순위는 1위와의 점수 차를 2배로 벌려 적합도 차이가 잘 보이게 한다.
    const top = 90 + rnd() * 9;
    const items = ranked.map((s) => ({ ...s, score: Math.max(38, Math.round(top - (ranked[0].raw - s.raw) * 2)) }));
    return { label, items };
  }
  function recoSection(r) {
    const { label, items } = recommend(r);
    return `<section class="sec reco" aria-label="AI 추천 주변 관광지">
      <div class="reco-card">
        <div class="reco-hd"><span class="chip chip-ai">${I.spark}AI 추천</span><small>${label} · ${fmtS(r.checkIn)} 예약 기준</small></div>
        <p class="reco-msg"><b>${esc(me().name)}님</b>과 비슷한 예약을 하신 분들은<br/>이런 곳들도 예약하셨어요.</p>
        <ol class="reco-list">${items.map((s, i) => `<li><span class="rk">${i + 1}</span>
          <div class="ri"><b>${s.name}</b><span>${s.desc} · ${s.km}km</span><div class="bar"><i style="width:${s.score}%"></i></div></div>
          <strong class="pct">${s.score}%</strong></li>`).join('')}</ol>
        <p class="reco-ft">${I.info}AI가 예약 인원 · 동숙자 구성 · 투숙 시기가 비슷한 고객의 예약 데이터를 분석한 적합도입니다.</p>
      </div></section>`;
  }

  /* ---------------- E·LAND 사전 주문 (체크인 72시간 전 오픈 → 체크인 시 마감, 객실 비치) ----------------
   * 예약 구성(어린이 동반 가족/커플/일행)과 객실 타입(취사형)으로 이랜드 브랜드 상품을 룰 기반 추천한다.
   * 엑스트라 인컴(투숙객 전용가 판매) + 브랜드 로열티(E.POINT 적립, 크로스 브랜드 쿠폰) 시연용. */
  const PRE_H = 72;
  const POINT_RATE = 0.05;
  const ELAND = {
    spaokids: { name: 'SPAO KIDS', ko: '스파오키즈', c: '#f2b632', fg: '#1f1f1f', soft: '#fff4d6' },
    spao: { name: 'SPAO', ko: '스파오', c: '#1f1f1f', fg: '#fff', soft: '#eceff4' },
    ashley: { name: 'ASHLEY', ko: '애슐리퀸즈', c: '#8c2333', fg: '#fff', soft: '#f8e6e8' },
    pizzamall: { name: 'PIZZA MALL', ko: '피자몰', c: '#d4492c', fg: '#fff', soft: '#fdeadf' },
    butter: { name: 'BUTTER', ko: '버터', c: '#f3d35f', fg: '#1f1f1f', soft: '#fff6cf' },
    cafe: { name: 'THE CAFE', ko: '더카페', c: '#5a4030', fg: '#fff', soft: '#efe4da' }
  };
  const GOODS = [
    { sku: 'spk-swim', brand: 'spaokids', name: '아동 래시가드 수영복 세트', opt: '상·하의 + 수모 · 110~150', price: 39900, sale: 29900, art: 'swim', tags: ['kids'] },
    { sku: 'spk-tube', brand: 'spaokids', name: '키즈 튜브 & 물놀이 세트', opt: '튜브 · 아쿠아슈즈 · 방수팩', price: 24900, sale: 18900, art: 'tube', tags: ['kids'] },
    { sku: 'ash-cake', brand: 'ashley', name: '시그니처 뉴욕 치즈케이크', opt: '1호 홀케이크 · 레터링 무료', price: 32000, sale: 25600, art: 'cake', tags: ['couple'] },
    { sku: 'ash-kit', brand: 'ashley', name: '스테이크 & 투움바 파스타 밀키트', opt: '2~3인분 · 객실 냉장고 비치', price: 34900, sale: 27900, art: 'kit', tags: ['kitchen'] },
    { sku: 'ash-bbq', brand: 'ashley', name: '바비큐 폭립 패밀리 밀키트', opt: '4인분 · 소스 · 가니시 포함', price: 45900, sale: 36700, art: 'bbq', tags: ['kitchen', 'family'] },
    { sku: 'spao-pj', brand: 'spao', name: '커플 · 패밀리 파자마', opt: '2벌 세트 · S~XL', price: 59800, sale: 47800, art: 'pajama', tags: ['couple', 'family'] },
    { sku: 'pm-party', brand: 'pizzamall', name: '객실 파티 세트', opt: '라지 피자 + 치킨 + 콜라 1.25L', price: 39900, sale: 31900, art: 'pizza', tags: ['group'] },
    { sku: 'bt-deco', brand: 'butter', name: '기념일 데코 키트', opt: '풍선 · 가랜드 · LED 캔들', price: 25000, sale: 19900, art: 'deco', tags: ['couple', 'group'] },
    { sku: 'cafe-drip', brand: 'cafe', name: '드립백 & 쿠키 모닝 세트', opt: '드립백 4입 + 쿠키 2입', price: 15000, sale: 12000, art: 'coffee', tags: [] }
  ];
  const ART = {
    swim: '<path d="M24 22l10-4h12l10 4 8 11-7 5-5-5v25H28V33l-5 5-7-5z" fill="#3aa0d8"/><path d="M28 44h24" stroke="#fff" stroke-width="3"/><path d="M28 50h24" stroke="#ffd34d" stroke-width="3"/>',
    tube: '<circle cx="40" cy="42" r="21" fill="#ff7a59"/><circle cx="40" cy="42" r="9" fill="#fff4d6"/><path d="M40 21v12M40 51v12M19 42h12M49 42h12" stroke="#fff" stroke-width="6"/>',
    cake: '<rect x="17" y="36" width="46" height="22" rx="3" fill="#f5d48a"/><ellipse cx="40" cy="36" rx="23" ry="7" fill="#fbe6b4"/><rect x="17" y="54" width="46" height="6" rx="3" fill="#b9773f"/><circle cx="40" cy="33" r="3.5" fill="#c0392b"/>',
    kit: '<rect x="15" y="26" width="50" height="34" rx="4" fill="#fff"/><rect x="15" y="26" width="50" height="10" rx="4" fill="#8c2333"/><ellipse cx="33" cy="48" rx="9" ry="6" fill="#9a4b2c"/><path d="M45 52c3-6 10-6 13-1" stroke="#e7b54b" stroke-width="3" fill="none"/><path d="M47 46c3-4 8-4 10 0" stroke="#e7b54b" stroke-width="3" fill="none"/>',
    bbq: '<rect x="15" y="32" width="50" height="24" rx="11" fill="#a2452a"/><path d="M26 33v22M36 33v22M46 33v22M56 33v22" stroke="#7a2f1b" stroke-width="2.5"/><path d="M20 30c6-4 34-4 40 0" stroke="#e08a3a" stroke-width="3" fill="none"/>',
    pajama: '<path d="M24 22l10-4h12l10 4 8 12-7 4-5-6v28H28V32l-5 6-7-4z" fill="#c9d6ea"/><path d="M28 38h24M28 46h24M28 54h24" stroke="#8aa1c6" stroke-width="2.5"/>',
    pizza: '<path d="M40 16L64 60H16z" fill="#f3b544"/><path d="M16 60h48l-2 4H18z" fill="#c97a2b"/><circle cx="40" cy="36" r="4" fill="#c0392b"/><circle cx="32" cy="50" r="4" fill="#c0392b"/><circle cx="48" cy="50" r="4" fill="#c0392b"/>',
    deco: '<ellipse cx="31" cy="31" rx="11" ry="13" fill="#f28da5"/><ellipse cx="49" cy="29" rx="11" ry="13" fill="#f6c14b"/><path d="M31 44l5 20M49 42l-5 22" stroke="#8a8a8a" stroke-width="1.4"/>',
    coffee: '<path d="M22 32h32l-3 26H25z" fill="#c7a27c"/><path d="M54 37h4a5 5 0 0 1 0 10h-5" stroke="#c7a27c" stroke-width="3.5" fill="none"/><path d="M31 26c0-4 4-4 4-8M41 26c0-4 4-4 4-8" stroke="#8c7259" stroke-width="2" fill="none"/>'
  };
  // 주문 감사 쿠폰은 주문한 브랜드가 아닌 다른 이랜드 브랜드로 발급해 매장 방문(크로스 셀)을 유도한다.
  const CROSS = {
    spaokids: { title: '애슐리퀸즈 매장 식사 15% 할인', pct: '15%' },
    spao: { title: '애슐리퀸즈 매장 식사 15% 할인', pct: '15%' },
    butter: { title: '애슐리퀸즈 매장 식사 15% 할인', pct: '15%' },
    ashley: { title: '스파오 · 스파오키즈 10% 할인', pct: '10%' },
    pizzamall: { title: '스파오 · 스파오키즈 10% 할인', pct: '10%' },
    cafe: { title: '스파오키즈 10% 할인', pct: '10%' }
  };
  const goodArt = (g) => `<svg viewBox="0 0 80 80" aria-hidden="true"><rect width="80" height="80" fill="${ELAND[g.brand].soft}"/>${ART[g.art]}</svg>`;
  const brandTag = (b) => `<span class="brand-tag" style="background:${ELAND[b].c};color:${ELAND[b].fg}">${ELAND[b].name}</span>`;
  const offPct = (g) => Math.round((1 - g.sale / g.price) * 100);
  const goodBy = (sku) => GOODS.find((g) => g.sku === sku);
  const checkInAt = (r) => { const d = parse(r.checkIn); const [h, m] = r.inTime.split(':').map(Number); d.setHours(h, m); return d; };
  const preStart = (r) => new Date(checkInAt(r).getTime() - PRE_H * 3600000);
  const preState = (r) => (r.status === 'checkedIn' || r.status === 'completed') ? 'closed' : (r.preOpen || Date.now() >= preStart(r).getTime()) ? 'open' : 'soon';
  const fmtDT = (d) => `${pad(d.getMonth() + 1)}.${pad(d.getDate())} (${DAY[d.getDay()]}) ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  function guestProfile(r) {
    const t = [];
    if (r.children > 0) t.push(['kids', '어린이 동반 가족'], ['family', '가족 단위']);
    else if (r.adults >= 3) t.push(['group', `성인 ${r.adults}인 일행`]);
    else t.push(['couple', '커플']);
    if (r.kitchen) t.push(['kitchen', '취사 가능 객실']);
    return t;
  }
  function picks(r) {
    const prof = guestProfile(r);
    return GOODS.map((g) => ({ g, hit: prof.filter(([k]) => g.tags.includes(k)) }))
      .filter((x) => x.hit.length).sort((a, b) => b.hit.length - a.hit.length);
  }
  const cartCount = () => Object.values(ui.cart.items).reduce((a, b) => a + b, 0);
  const cartSum = () => GOODS.reduce((s, g) => s + (ui.cart.items[g.sku] || 0) * g.sale, 0);
  const orderTitle = (o) => `${goodBy(o.items[0].sku).name}${o.items.length > 1 ? ` 외 ${o.items.length - 1}건` : ''}`;
  function preBanner(r) {
    const st = preState(r); const n = (r.orders || []).length;
    if (r.status === 'completed') return '';
    if (st === 'soon') return `<div class="pre-banner soon">${I.bag}<span><b>E·LAND 사전 주문</b><small>${fmtDT(preStart(r))} 오픈 · 체크인 ${PRE_H}시간 전부터</small></span></div>`;
    if (st === 'closed') return n ? `<a class="pre-banner" href="#/shop/${r.id}">${I.bag}<span><b>사전 주문 ${n}건</b><small>객실 ${r.roomNo}호에 준비 완료</small></span>${I.right}</a>` : '';
    return `<a class="pre-banner open" href="#/shop/${r.id}">${I.bag}<span><b>${n ? `사전 주문 ${n}건 · 추가 주문하기` : 'E·LAND 사전 주문 오픈'}</b><small>체크인 전에 주문하면 객실에 미리 준비해 드려요</small></span>${I.right}</a>`;
  }
  function preSection(r) {
    const orders = r.orders || [];
    const banner = preBanner(r);
    if (!banner && !orders.length) return '';
    return `<section class="sec pre-sec"><div class="sec-hd"><h2>사전 주문</h2>${brandTag('spao').replace('SPAO', 'E·LAND')}</div>
      ${banner}
      ${orders.map((o) => `<div class="order-row"><div><b>${orderTitle(o)}</b><span>${o.no} · ${o.delivery} · ${esc(o.by)}</span></div><strong>${won(o.total)}</strong></div>`).join('')}
    </section>`;
  }

  /* ---------------- ui primitives ---------------- */
  const app = $('#app');
  const overlay = $('#overlay-root');
  const ui = { tab: 'upcoming', ci: null, key: null, fab: '', cart: null };
  let timers = [];
  let after = null;
  const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
  const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };
  const go = (h) => { if (location.hash === h) render(); else location.hash = h; };
  const vibrate = (p) => { if (navigator.vibrate) navigator.vibrate(p); };

  function header({ mode = '', back = false, title = '', right = WORDMARK } = {}) {
    const left = back
      ? `<button class="icon-btn" data-act="back" aria-label="뒤로">${I.back}</button>`
      : `<button class="icon-btn" data-act="drawer" aria-label="메뉴 열기">${I.menu}</button>`;
    return `<header class="hdr ${mode}">${left}${title ? `<div class="ttl">${title}</div>` : ''}<div>${right}</div></header>`;
  }

  function toast(msg) {
    const el = document.createElement('div');
    el.className = $('.key-page') ? 'toast top' : 'toast'; el.setAttribute('role', 'status'); el.textContent = msg;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 300); }, 2300);
  }

  function push(title, body, href) {
    document.querySelectorAll('.push').forEach((p) => p.remove());
    const el = document.createElement('button');
    el.className = 'push';
    el.innerHTML = `<div class="pi">${EMBLEM}</div><div class="pt"><div><span>켄싱턴호텔앤리조트</span><span>지금</span></div><b>${esc(title)}</b><p>${esc(body)}</p></div>`;
    el.addEventListener('click', () => { el.remove(); if (href) go(href); });
    document.body.appendChild(el);
    vibrate([60, 40, 60]);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 350); }, 5200);
  }

  function openOverlay(html) { overlay.innerHTML = `<div class="dim" data-act="closeOverlay"></div>${html}`; document.body.style.overflow = 'hidden'; }
  function closeOverlay() { overlay.innerHTML = ''; document.body.style.overflow = ''; }

  function sheet(title, inner, desc = '') {
    openOverlay(`<section class="sheet" role="dialog" aria-modal="true" aria-label="${esc(title)}"><div class="grab"></div>
      <div class="sheet-hd"><h3>${title}</h3><button data-act="closeOverlay" aria-label="닫기">${I.close}</button></div>
      ${desc ? `<p class="desc">${desc}</p>` : ''}${inner}</section>`);
  }

  function drawer() {
    const u = me();
    const keyRes = visibleRes().filter(canUseKey);
    openOverlay(`<nav class="drawer" aria-label="전체 메뉴">
      <div class="drawer-hd">${WORDMARK}<button class="icon-btn" data-act="closeOverlay" aria-label="메뉴 닫기" style="color:var(--ink)">${I.close}</button></div>
      <div class="profile">${EMBLEM}<small>${u.grade}</small><b>${u.name} 님</b><span>${isPrimary() ? '주 예약자 계정' : '동숙자 계정'} · ${maskPhone(u.phone)}</span></div>
      <div class="menu">
        <a href="#/" data-act="closeOverlay">${I.home}홈</a>
        <a href="#/reservations" data-act="closeOverlay">${I.list}나의 예약</a>
        <button data-act="openKey">${I.key}모바일 키${keyRes.length ? `<span class="chip chip-gold badge">${keyRes.length}</span>` : ''}</button>
        <button data-act="openShop">${I.bag}이랜드 사전 주문</button>
        <button data-act="chatOpen">${I.chat}AI 컨시어지</button>
        <button data-act="soon">${I.gift}프로모션</button>
        <button data-act="soon">${I.crown}멤버십</button>
        <hr/>
        <button data-act="demo">${I.sliders}데모 컨트롤</button>
      </div>
      <div class="drawer-ft">고객센터 1588-0000 (데모)<br/>본 앱은 기능 시연용 목업입니다.</div></nav>`);
  }

  function demoPanel() {
    const resRows = S.reservations.filter((r) => r.status !== 'completed').map((r) => `
      <div class="demo-res"><div class="nm"><span>${r.hotel}</span><span class="chip ${r.ble ? 'chip-gold' : 'chip-gray'}">${r.ble ? 'NFC·BLE' : 'NFC 전용'}</span></div>
      <div class="seg">${['waiting', 'available', 'checkedIn'].map((s) => `<button class="${r.status === s ? 'on' : ''}" data-act="setStatus" data-id="${r.id}" data-v="${s}">${STATUS[s].label}</button>`).join('')}</div>
      ${r.status === 'waiting' ? `<button class="demo-pre" data-act="preOpen" data-id="${r.id}">${I.bag}사전 주문 오픈 시뮬레이션 (체크인 ${PRE_H}시간 전)</button>` : ''}</div>`).join('');
    sheet('데모 컨트롤', `
      <div class="demo-group"><label>사용자 시점</label><div class="seg">
        <button class="${isPrimary() ? 'on' : ''}" data-act="persona" data-v="primary">주 예약자 · ${S.users.primary.name}</button>
        <button class="${!isPrimary() ? 'on' : ''}" data-act="persona" data-v="companion">동숙자 · ${S.users.companion.name}</button></div></div>
      <div class="demo-group"><label>시스템 예약 상태 (PMS 시뮬레이션)</label>${resRows}</div>
      <div class="act"><button class="btn btn-line btn-block" data-act="reset">데모 데이터 초기화</button></div>`,
    '실제 서버 대신 호텔 시스템의 상태 변경을 흉내냅니다. ‘체크인 가능’으로 바꾸면 투숙객에게 푸시 알림이 발송됩니다.');
  }

  function renderFab() {
    let el = $('.demo-fab');
    if (!el) {
      el = document.createElement('button');
      el.className = 'demo-fab'; el.dataset.act = 'demo';
      el.innerHTML = `${I.sliders}DEMO`;
      el.setAttribute('aria-label', '데모 컨트롤 열기');
      document.body.appendChild(el);
    }
    el.className = `demo-fab ${ui.fab}`;
    let cf = $('.chat-fab');
    if (!cf) {
      cf = document.createElement('button');
      cf.dataset.act = 'chatOpen';
      cf.setAttribute('aria-label', 'AI 컨시어지 채팅 열기');
      cf.innerHTML = `${I.chat}<span class="cf-dot"></span>`;
      document.body.appendChild(cf);
      if (!sessionStorage.getItem('kh-chat-tip')) {
        sessionStorage.setItem('kh-chat-tip', '1');
        setTimeout(() => {
          if (chat.open || !$('.chat-fab') || $('.chat-fab').offsetParent === null) return;
          const tip = document.createElement('div');
          tip.className = 'chat-tip'; tip.textContent = 'AI 컨시어지에게 무엇이든 물어보세요';
          document.body.appendChild(tip);
          setTimeout(() => { tip.classList.add('out'); setTimeout(() => tip.remove(), 300); }, 4200);
        }, 2000);
      }
    }
    cf.className = `chat-fab ${ui.fab}`;
  }
  /* ---------------- shared reservation pieces ---------------- */
  function strip(r) {
    if (r.status === 'waiting') return `<div class="status-strip">${I.bell}<span>${fmtS(r.checkIn)} ${r.inTime}부터 모바일 체크인 가능 · 시작 시 알림</span></div>`;
    if (r.status === 'available') return isPrimary()
      ? `<div class="status-strip on">${I.check}<span>지금 모바일 체크인이 가능합니다</span></div>`
      : `<div class="status-strip">${I.clock}<span>주 예약자(${S.users.primary.name} 님)의 체크인을 기다리고 있어요</span></div>`;
    if (r.status === 'checkedIn') return `<div class="status-strip keyon">${I.key}<span>객실 ${r.roomNo} · 모바일 키 사용 가능</span></div>`;
    return '';
  }
  function mainAction(r, cls = '') {
    if (r.status === 'checkedIn' && canUseKey(r)) return `<a class="btn btn-dark ${cls}" href="#/key/${r.id}">${I.key}모바일 키</a>`;
    if (r.status === 'available' && isPrimary()) return `<a class="btn btn-gold ${cls}" href="#/checkin/${r.id}">${I.door}모바일 체크인</a>`;
    if (r.status === 'available') return `<button class="btn ${cls}" disabled>${I.lock}주 예약자 체크인 전용</button>`;
    return `<button class="btn ${cls}" disabled>${I.clock}체크인 대기</button>`;
  }
  const roleChip = (r) => isPrimary() ? `<span class="chip chip-line role">${I.crown}주 예약자</span>` : `<span class="chip chip-gold role">${I.users}동숙자</span>`;
  const stayLine = (r) => `${fmtD(r.checkIn)} ~ ${fmtS(r.checkOut)} · ${nights(r)}박`;
  const paxLine = (r) => `성인 ${r.adults}${r.children ? ` · 어린이 ${r.children}` : ''} · 투숙객 ${1 + r.guests.filter((g) => g.state === 'accepted').length}/${r.adults + r.children}명 등록`;

  function resCard(r) {
    const done = r.status === 'completed';
    const second = done
      ? ''
      : !isPrimary()
        ? `<a class="btn btn-line btn-sm" href="#/reservation/${r.id}">예약 상세</a>`
        : capacity(r) - r.guests.length > 0
          ? `<button class="btn btn-line btn-sm" data-act="addGuest" data-id="${r.id}">${I.userPlus}동숙자 추가</button>`
          : `<a class="btn btn-line btn-sm" href="#/reservation/${r.id}">${I.users}동숙자 관리</a>`;
    return `<article class="res-card">
      <a href="#/reservation/${r.id}" class="art" style="display:block;height:150px" aria-label="${r.hotel} 예약 상세">${scene(r.theme)}<span class="chip ${STATUS[r.status].chip}">${STATUS[r.status].label}</span>${roleChip(r)}</a>
      <div class="res-body"><h3>${r.hotel}</h3><div class="room">${r.room} · ${r.view}</div>
        <div class="meta"><div>${I.cal}${stayLine(r)}</div><div>${I.users}${paxLine(r)}</div><div>${r.ble ? I.ble : I.nfc}${r.lock}</div></div></div>
      ${strip(r)}
      ${preBanner(r)}
      ${done
        ? `<div class="res-actions one"><a class="btn btn-line btn-sm" href="#/reservation/${r.id}">예약 상세</a></div>`
        : `<div class="res-actions">${second}${mainAction(r, 'btn-sm')}</div>`}
      ${r.status === 'available' && !isPrimary() ? `<div class="res-note">${I.info}체크인은 결제정보를 등록한 주 예약자만 진행할 수 있습니다.</div>` : ''}
    </article>`;
  }

  /* ---------------- views ---------------- */
  function viewHome() {
    ui.fab = '';
    const t = new Date();
    const next = visibleRes().find((r) => r.status !== 'completed');
    const myRes = next ? `<div class="my-res">
        <a class="my-res-top" href="#/reservation/${next.id}"><div class="art">${scene(next.theme)}</div>
          <div style="flex:1;min-width:0"><span class="chip ${STATUS[next.status].chip}">${STATUS[next.status].label}</span><h3>${next.hotel}</h3><p>${fmtS(next.checkIn)} ~ ${fmtS(next.checkOut)} · ${next.room}</p></div>
          <span style="width:20px;color:var(--mute-2)">${I.right}</span></a>
        ${strip(next)}
        ${next.status === 'waiting' ? '' : mainAction(next, 'btn-block')}
      </div>`
      : `<div class="my-res"><div class="empty" style="padding:36px 20px">${I.list}이용 예정인 예약이 없습니다.</div></div>`;
    return `<div class="page">
      ${header({ mode: 'clear' })}
      <section class="hero"><div class="art">${scene('hero')}</div>
        <div class="hero-in">
          <h1><b>켄싱턴 호텔&amp;리조트</b><br/><span>방문을 환영합니다.</span></h1>
          <div class="promo-code">${I.plus}프로모션 코드 입력 <i>?</i></div>
          <div class="book-card">
            <button class="book-where" data-act="soon" style="width:100%">${I.pin}호텔 또는 리조트 선택</button>
            <div class="book-dates"><div><small>체크인</small><strong>${pad(t.getDate())}</strong><em>${t.getFullYear()}. ${pad(t.getMonth() + 1)}</em></div>
              <div class="nights">1박</div>
              <div><small>체크아웃</small><strong>${pad(addDays(t, 1).getDate())}</strong><em>${addDays(t, 1).getFullYear()}. ${pad(addDays(t, 1).getMonth() + 1)}</em></div></div>
            <div class="book-opts"><span>객실수<b>1</b>⌄</span><span>성인<b>2</b>⌄</span><span>어린이<b>0</b>⌄</span></div>
            <button class="btn btn-gold btn-block" data-act="soon">예약</button>
          </div>
        </div>
      </section>
      <section class="sec"><div class="sec-hd"><h2>나의 예약</h2><a class="more" href="#/reservations">전체보기${I.right}</a></div>${myRes}</section>
      <nav class="quick" aria-label="바로가기">
        <a href="#/reservations"><span class="qi">${I.list}</span>예약 조회</a>
        <button data-act="quickCheckin"><span class="qi">${I.door}</span>모바일 체크인</button>
        ${next && next.status === 'checkedIn'
          ? `<button data-act="openKey"><span class="qi">${I.key}</span>모바일 키</button>`
          : `<button data-act="openShop"><span class="qi">${I.bag}</span>사전 주문</button>`}
        <button data-act="quickGuest"><span class="qi">${I.userPlus}</span>동숙자 추가</button>
      </nav>
      ${next ? recoSection(next) : ''}
      <div class="section-gap"></div>
      <section class="sec"><div class="sec-hd"><h2>테마기획전</h2><button class="more" data-act="soon" aria-label="테마기획전 더보기" style="color:var(--ink)">${I.plus}</button></div>
        <div class="hscroll">
          <div class="promo"><div class="art">${scene('autumn')}<span class="badge">추가할인<br/>10%</span></div><h3>Autumn Festa</h3><p>쾌청한 가을날씨를 온몸으로 느낄 수 있는 켄싱턴 가을 패키지</p><div class="period">${I.cal}${t.getFullYear()}. 10. 01 ~ ${t.getFullYear()}. 11. 30</div></div>
          <div class="promo"><div class="art">${scene('mountain')}</div><h3>가평 단풍 스테이</h3><p>켄싱턴리조트 가평에서 즐기는 북한강 단풍 트레킹과 조식 패키지</p><div class="period">${I.cal}${t.getFullYear()}. 10. 15 ~ ${t.getFullYear()}. 11. 15</div></div>
          <div class="promo"><div class="art">${scene('gold')}</div><h3>K 멤버십 위크</h3><p>멤버십 회원만을 위한 객실 업그레이드와 라운지 혜택</p><div class="period">${I.cal}상시 진행</div></div>
        </div></section>
      <footer class="footer">${WORDMARK}<br/>본 앱은 모바일 체크인 · 모바일 키(NFC/BLE) 기능 시연을 위한 목업 데모입니다.<br/>실제 예약·결제·도어락 연동은 이루어지지 않습니다.</footer>
    </div>`;
  }

  function viewList() {
    ui.fab = '';
    const list = visibleRes();
    const up = list.filter((r) => r.status !== 'completed');
    const past = list.filter((r) => r.status === 'completed').reverse();
    const cur = ui.tab === 'upcoming' ? up : past;
    const u = me();
    return `<div class="page">
      ${header()}
      <h1 class="page-title">나의 예약</h1>
      <div class="pills" role="tablist">
        <button class="pill ${ui.tab === 'upcoming' ? 'on' : ''}" role="tab" aria-selected="${ui.tab === 'upcoming'}" data-act="tab" data-v="upcoming">이용 예정 ${up.length}</button>
        <button class="pill ${ui.tab === 'past' ? 'on' : ''}" role="tab" aria-selected="${ui.tab === 'past'}" data-act="tab" data-v="past">이용 완료 ${past.length}</button>
      </div>
      <div class="persona-bar"><span><b>${u.name}</b> 님 · ${isPrimary() ? '주 예약자' : '동숙자'} 시점</span><button data-act="persona" data-v="${isPrimary() ? 'companion' : 'primary'}">${I.swap}시점 전환</button></div>
      <div class="res-list">${cur.length ? cur.map(resCard).join('') : `<div class="empty">${I.cal}${ui.tab === 'upcoming' ? (isPrimary() ? '이용 예정인 예약이 없습니다.' : '동숙자로 초대된 예약이 없습니다.<br/>주 예약자에게 동숙자 추가를 요청해 주세요.') : '이용 완료된 예약이 없습니다.'}</div>`}</div>
      ${ui.tab === 'upcoming' && up[0] ? recoSection(up[0]) : ''}
    </div>`;
  }
  function viewDetail(id) {
    const r = getRes(id);
    if (!r || !visibleRes().includes(r)) return notFound();
    const done = r.status === 'completed';
    ui.fab = done ? '' : 'up2';
    const p = S.users.primary;
    const guests = r.guests.map((g) => `<div class="guest"><span class="avatar">${esc(g.name.slice(0, 1))}</span>
        <div class="g-info"><b>${esc(g.name)}${g.state === 'accepted' ? `<span class="chip chip-ok">${I.key}모바일 키 공유</span>` : '<span class="chip chip-gray">초대 수락 대기</span>'}</b><span>동숙자 · ${maskPhone(esc(g.phone))}</span></div>
        ${isPrimary() && !done ? `<button class="rm" data-act="rmGuest" data-id="${r.id}" data-g="${g.id}" aria-label="${esc(g.name)} 동숙자 삭제">${I.trash}</button>` : ''}</div>`).join('');
    const left = capacity(r) - r.guests.length;
    return `<div class="page">
      ${header({ back: true, title: '예약 상세', right: '<span style="width:40px;display:block"></span>' })}
      <div class="art detail-hero">${scene(r.theme)}</div>
      <div class="detail-head"><div class="chips"><span class="chip ${STATUS[r.status].chip}">${STATUS[r.status].label}</span>${roleChip(r).replace(' role', '')}</div>
        <h2>${r.hotel}</h2><p>${r.room} · ${r.view}</p></div>
      <div class="stay"><div><small>체크인</small><strong>${fmtS(r.checkIn)}</strong><span>${r.inTime} 이후</span></div><div class="nights">${nights(r)}박</div>
        <div><small>체크아웃</small><strong>${fmtS(r.checkOut)}</strong><span>${r.outTime} 이전</span></div></div>
      ${done ? '' : `<div style="margin:0 18px 6px;border-radius:10px;overflow:hidden">${strip(r)}</div>`}
      <dl class="kv">
        <div><dt>예약번호</dt><dd>${r.id}</dd></div>
        <div><dt>객실</dt><dd>${r.status === 'checkedIn' || done ? `${r.roomNo}호 (${r.floor})` : '체크인 시 배정'}</dd></div>
        <div><dt>인원</dt><dd>성인 ${r.adults}${r.children ? ` · 어린이 ${r.children}` : ''}</dd></div>
        <div><dt>객실 잠금장치</dt><dd>${r.lock}</dd></div>
        <div><dt>결제 정보</dt><dd>${isPrimary() ? `${r.pay.label} ****${r.pay.last4} · ${won(r.pay.amount)}` : `주 예약자(${p.name}) 결제`}</dd></div>
      </dl>
      <section class="sec"><div class="sec-hd"><h2>투숙객 <span class="muted" style="font-size:15px">${1 + r.guests.length}/${r.adults + r.children}</span></h2></div>
        <div class="guest-list">
          <div class="guest"><span class="avatar main">${p.name.slice(0, 1)}</span><div class="g-info"><b>${p.name}<span class="chip chip-line">${I.crown}주 예약자</span></b><span>결제정보 등록 · 체크인 권한 · ${maskPhone(p.phone)}</span></div></div>
          ${guests}
        </div>
        ${isPrimary() && !done ? (left > 0
          ? `<button class="add-guest" data-act="addGuest" data-id="${r.id}">${I.userPlus}동숙자 추가 (${left}명 추가 가능)</button>`
          : `<p class="hint">${I.info}예약 인원만큼 동숙자가 모두 등록되었습니다.</p>`) : ''}
        <p class="hint">${I.info}동숙자는 체크인 완료 후 모바일 키로 객실 문을 열 수 있습니다. 모바일 체크인은 결제정보를 등록한 주 예약자만 가능합니다.</p>
      </section>
      ${done ? '' : preSection(r)}
      ${done ? '' : recoSection(r)}
      ${done ? '' : `<div class="sticky-cta">${r.status === 'waiting' ? `<div class="note">${fmtS(r.checkIn)} ${r.inTime}부터 체크인 가능 시 알림을 보내드려요</div>` : ''}${mainAction(r, 'btn-block')}</div>`}
    </div>`;
  }

  function addGuestSheet(id) {
    const r = getRes(id);
    if (capacity(r) - r.guests.length <= 0) { toast('예약 인원만큼 동숙자가 모두 등록되었습니다.'); return; }
    sheet('동숙자 추가', `
      <form id="guestForm" data-id="${r.id}" novalidate>
        <div class="field"><label for="gName">이름</label><input class="input" id="gName" name="name" autocomplete="off" placeholder="동숙자 이름" maxlength="20"/></div>
        <div class="field"><label for="gPhone">휴대폰 번호</label><input class="input" id="gPhone" name="phone" inputmode="numeric" autocomplete="off" placeholder="010-0000-0000" maxlength="13"/></div>
        <div class="field"><p class="hint" style="margin:0">${I.info}데모 팁: ${S.users.companion.name} / ${S.users.companion.phone} 로 추가하면 ‘동숙자 시점’에서 이 예약과 모바일 키를 확인할 수 있어요.</p></div>
        <div class="act"><button class="btn btn-gold btn-block" type="submit">초대 보내기</button></div>
      </form>`,
    `<b style="color:var(--ink)">${r.hotel}</b> · ${fmtS(r.checkIn)} ~ ${fmtS(r.checkOut)}<br/>초대된 동숙자는 앱에서 예약을 확인하고 모바일 키로 객실 문을 열 수 있습니다. (${capacity(r) - r.guests.length}명 추가 가능)`);
  }

  function submitGuest(form) {
    const r = getRes(form.dataset.id);
    const name = form.name.value.trim();
    const phone = fmtPhone(form.phone.value.trim());
    if (!name) { toast('동숙자 이름을 입력해 주세요.'); form.name.focus(); return; }
    if (!/^01\d{8,9}$/.test(normPhone(phone))) { toast('휴대폰 번호를 정확히 입력해 주세요.'); form.phone.focus(); return; }
    if (normPhone(phone) === normPhone(S.users.primary.phone) || r.guests.some((g) => normPhone(g.phone) === normPhone(phone))) { toast('이미 등록된 투숙객입니다.'); return; }
    const g = { id: 'g' + Date.now(), name, phone, state: 'invited' };
    r.guests.push(g); save(); closeOverlay(); refresh();
    toast(`${name} 님에게 동숙 초대 메시지를 보냈습니다.`);
    setTimeout(() => {
      const cur = getRes(r.id) && getRes(r.id).guests.find((x) => x.id === g.id);
      if (!cur) return;
      cur.state = 'accepted'; save(); refresh();
      toast(`${name} 님이 동숙 초대를 수락했습니다.`);
    }, 3000);
  }
  function blocked(icon, title, body, cta, hd = '모바일 체크인') {
    ui.fab = '';
    return `<div class="page">${header({ back: true, title: hd, right: '<span style="width:40px;display:block"></span>' })}
      <div class="blocked"><div class="bi">${icon}</div><h2>${title}</h2><p>${body}</p>${cta}</div></div>`;
  }

  function viewCheckin(id) {
    const r = getRes(id);
    if (!r || !visibleRes().includes(r)) return notFound();
    if (!isPrimary()) return blocked(I.lock, '체크인은 주 예약자만 가능합니다',
      `모바일 체크인은 결제정보를 등록한 주 예약자(${S.users.primary.name} 님)만 진행할 수 있습니다.<br/>주 예약자가 체크인을 완료하면 동숙자도 모바일 키를 사용할 수 있어요.`,
      `<a class="btn btn-line btn-block" href="#/reservation/${r.id}">예약 상세로 돌아가기</a>`);
    if (ui.ci && ui.ci.id === r.id && ui.ci.done && r.status === 'checkedIn') return checkinDone(r);
    if (r.status === 'checkedIn') return blocked(I.check, '이미 체크인이 완료되었습니다', `객실 ${r.roomNo}호 모바일 키를 사용할 수 있습니다.`, `<a class="btn btn-dark btn-block" href="#/key/${r.id}">${I.key}모바일 키 열기</a>`);
    if (r.status !== 'available') return blocked(I.clock, '아직 체크인 가능 시간이 아닙니다',
      `${fmtD(r.checkIn)} ${r.inTime}부터 모바일 체크인이 가능합니다.<br/>체크인이 가능해지면 푸시 알림으로 알려드릴게요.`,
      `<a class="btn btn-line btn-block" href="#/reservation/${r.id}">예약 상세로 돌아가기</a>`);

    if (!ui.ci || ui.ci.id !== r.id || ui.ci.done) ui.ci = { id: r.id, step: 1, arrival: '15:00', req: '', agree: { terms: false, privacy: false, pay: false } };
    const c = ui.ci;
    ui.fab = 'up2';
    const p = S.users.primary;
    const allAgreed = c.agree.terms && c.agree.privacy && c.agree.pay;
    const ck = (key, label, req = '필수') => `<button class="check ${c.agree[key] ? 'on' : ''}" data-act="agree" data-v="${key}" role="checkbox" aria-checked="${c.agree[key]}"><span class="cb">${I.check}</span>${label}<span class="req">${req}</span></button>`;
    const steps = [
      () => `<div class="step-hd"><small>STEP 1</small><h2>예약 정보를<br/>확인해 주세요</h2><p>체크인 대상 예약이 맞는지 확인 후 다음 단계로 진행해 주세요.</p></div>
        <div class="box"><h4>${I.cal}${r.hotel}</h4><dl class="kv">
          <div><dt>예약번호</dt><dd>${r.id}</dd></div><div><dt>객실 타입</dt><dd>${r.room} · ${r.view}</dd></div>
          <div><dt>일정</dt><dd>${fmtS(r.checkIn)} ~ ${fmtS(r.checkOut)} · ${nights(r)}박</dd></div>
          <div><dt>인원</dt><dd>성인 ${r.adults}${r.children ? ` · 어린이 ${r.children}` : ''}</dd></div></dl></div>
        <div class="box"><h4>${I.users}투숙객 ${1 + r.guests.length}명</h4><dl class="kv">
          <div><dt>주 예약자</dt><dd>${p.name}</dd></div>
          ${r.guests.map((g) => `<div><dt>동숙자</dt><dd>${esc(g.name)} ${g.state === 'accepted' ? '· 모바일 키 공유' : '· 초대 수락 대기'}</dd></div>`).join('')}</dl>
          ${capacity(r) - r.guests.length > 0 ? `<button class="add-guest" style="height:44px;margin-top:10px;background:#fff" data-act="addGuest" data-id="${r.id}">${I.userPlus}동숙자 추가</button>` : ''}</div>`,
      () => `<div class="step-hd"><small>STEP 2</small><h2>투숙 정보를<br/>입력해 주세요</h2><p>주 예약자 본인 정보로 체크인이 진행됩니다.</p></div>
        <div class="field"><label>주 예약자</label><input class="input" value="${p.name}" readonly/></div>
        <div class="field"><label>휴대폰 번호</label><input class="input" value="${p.phone}" readonly/></div>
        <div class="field"><label>도착 예정 시간</label><div class="opts">${['15:00', '16:00', '17:00', '18:00~'].map((t) => `<button class="opt ${c.arrival === t ? 'on' : ''}" data-act="arrival" data-v="${t}">${t}</button>`).join('')}</div></div>
        <div class="field"><label for="ciReq">요청사항 (선택)</label><textarea class="input" id="ciReq" data-bind="req" placeholder="예) 고층 객실 희망, 엑스트라 베드 요청">${esc(c.req)}</textarea></div>`,
      () => `<div class="step-hd"><small>STEP 3</small><h2>등록된 결제수단을<br/>확인해 주세요</h2><p>예약 시 주 예약자가 등록한 결제정보로 객실료 및 부대시설 이용료가 정산됩니다.</p></div>
        <div class="paycard"><div class="brand">${r.pay.brand}</div><span class="chip chip-gold tag">주 예약자 결제</span><div class="chipimg"></div><div class="num">**** **** **** ${r.pay.last4}</div><div class="owner">HONG GIL DONG · 주 예약자</div></div>
        <div class="box"><dl class="kv"><div><dt>객실 요금 (${nights(r)}박)</dt><dd>${won(r.pay.amount)}</dd></div><div><dt>보증금 (체크아웃 시 해제)</dt><dd>${won(100000)}</dd></div><div><dt>결제 상태</dt><dd style="color:var(--ok)">사전 결제 완료</dd></div></dl></div>`,
      () => `<div class="step-hd"><small>STEP 4</small><h2>약관에 동의하고<br/>체크인을 완료하세요</h2><p>동의 후 객실이 배정되고 모바일 키가 발급됩니다.</p></div>
        <div class="agree">
          <button class="check all ${allAgreed ? 'on' : ''}" data-act="agree" data-v="all" role="checkbox" aria-checked="${allAgreed}"><span class="cb">${I.check}</span>전체 동의</button>
          ${ck('terms', '모바일 체크인 이용약관')}${ck('privacy', '개인정보 수집 및 이용 동의')}${ck('pay', '보증금 사전 승인 동의')}
        </div>`
    ];
    const last = c.step === 4;
    return `<div class="page">
      ${header({ back: true, title: '모바일 체크인', right: `<span style="font-size:13px;color:var(--mute);width:40px;text-align:right;display:block">${c.step}/4</span>` })}
      <div class="steps">${[1, 2, 3, 4].map((n) => `<i class="${n <= c.step ? 'on' : ''}"></i>`).join('')}</div>
      ${steps[c.step - 1]()}
      <div class="sticky-cta"><button class="btn btn-gold btn-block" data-act="${last ? 'doCheckin' : 'ciNext'}" ${last && !allAgreed ? 'disabled' : ''}>${last ? '체크인 완료하기' : '다음'}</button></div>
    </div>`;
  }

  function checkinDone(r) {
    ui.fab = '';
    const shared = r.guests.filter((g) => g.state === 'accepted').length;
    return `<div class="page">
      <header class="hdr"><span></span><a class="icon-btn" href="#/reservations" aria-label="닫기" style="margin:0 -8px 0 0">${I.close}</a></header>
      <div class="done" style="padding-top:30px">
        <div class="done-mark">${I.check}</div>
        <h2>체크인이 완료되었습니다</h2>
        <p>${r.hotel}에 오신 것을 환영합니다.<br/>모바일 키가 발급되었습니다${shared ? `. 동숙자 ${shared}명에게도 공유되었어요.` : '.'}</p>
        <div class="roomno"><small>배정 객실</small><strong>${r.roomNo}</strong><span>${r.floor} · ${r.room} · 체크아웃 ${fmtS(r.checkOut)} ${r.outTime}</span></div>
        <a class="btn btn-dark btn-block" href="#/key/${r.id}" style="margin-bottom:10px">${I.key}모바일 키 열기</a>
        <a class="btn btn-line btn-block" href="#/reservations">예약 목록으로</a>
      </div></div>`;
  }
  /* ---------------- mobile key ---------------- */
  function viewKey(id) {
    const r = getRes(id);
    if (!r || !visibleRes().includes(r)) return notFound();
    if (!canUseKey(r)) {
      const why = r.status === 'completed' ? '이용이 완료된 예약입니다. 모바일 키는 체크아웃 시 자동으로 만료됩니다.'
        : isPrimary() ? '모바일 체크인을 완료하면 모바일 키가 발급됩니다.'
          : `주 예약자(${S.users.primary.name} 님)가 모바일 체크인을 완료하면 모바일 키가 자동으로 공유됩니다.`;
      return blocked(I.key, '아직 모바일 키를 사용할 수 없습니다', why,
        r.status === 'available' && isPrimary() ? `<a class="btn btn-gold btn-block" href="#/checkin/${r.id}">모바일 체크인 하기</a>` : `<a class="btn btn-line btn-block" href="#/reservation/${r.id}">예약 상세로 돌아가기</a>`);
    }
    ui.key = { id: r.id, lock: 'locked', via: '', dist: 14, approaching: false };
    ui.fab = 'up';
    return `<div class="page key-page">
      ${header({ mode: 'dark', back: true, title: '모바일 키', right: '<span style="width:40px;display:block"></span>' })}
      <div class="key-card"><span class="emb">${EMBLEM}</span><small>MOBILE KEY</small><h3>${r.hotel}</h3>
        <div class="rn">ROOM ${r.roomNo} · ${r.floor} · ${esc(me().name)} 님${isPrimary() ? '' : ' (동숙자)'}</div>
        <div class="valid">유효기간 ~ ${fmtS(r.checkOut)} ${r.outTime}</div></div>
      <div id="keyStage" class="key-stage">${keyStage(r)}</div>
      <section id="blePanel" class="ble-panel ${r.ble ? '' : 'off'}" aria-label="근접 자동 문 열림 설정">${blePanel(r)}</section>
    </div>`;
  }

  function keyStage(r) {
    const k = ui.key;
    const st = k.lock === 'open' ? 'open' : k.lock === 'scanning' ? 'scan' : 'idle';
    const copy = {
      idle: ['휴대폰을 도어락에 가까이 대세요', '휴대폰 뒷면을 객실 도어락의 NFC 리더에<br/>1~2초간 대면 문이 열립니다.'],
      scan: [k.via === 'ble' ? '객실 비컨 인식 중...' : '도어락과 통신 중...', k.via === 'ble' ? '근접 인증(BLE)으로 잠금장치를 해제하고 있습니다.' : '휴대폰을 움직이지 말고 잠시 기다려 주세요.'],
      open: ['문이 열렸습니다', `${k.via === 'ble' ? '근접 자동 문 열림(BLE)' : 'NFC 태그'}로 ${r.roomNo}호 문이 열렸습니다.<br/>5초 후 자동으로 잠깁니다.`]
    }[st];
    return `<span class="lock-state ${st === 'open' ? 'open' : ''}">${st === 'open' ? I.unlock : I.lock}${st === 'open' ? '열림' : st === 'scan' ? '인증 중' : '잠김'}</span>
      <button class="nfc ${st}" data-act="nfc" aria-label="NFC로 문 열기">
        <span class="ring"></span><span class="ring"></span><span class="ring"></span>
        <span class="core">${st === 'open' ? I.unlock : I.nfc}</span></button>
      <p class="key-msg">${copy[0]}</p><p class="key-sub">${copy[1]}</p>
      <button class="btn btn-gold" data-act="nfc" ${st !== 'idle' ? 'disabled' : ''}>${I.nfc}NFC로 문 열기</button>`;
  }

  function blePanel(r) {
    const k = ui.key;
    const on = r.ble && r.bleOn;
    const level = k.dist > 10 ? 1 : k.dist > 5 ? 2 : k.dist > 2 ? 3 : 4;
    let info;
    if (!r.ble) info = `<div class="ble-info warn">${I.info}<span>이 숙소의 잠금장치(${r.lock})는 BLE 비컨을 지원하지 않아 근접 자동 문 열림을 사용할 수 없습니다. NFC로 문을 열어 주세요.</span></div>`;
    else if (!on) info = `<div class="ble-info">OFF 상태입니다. NFC로만 문을 열 수 있습니다. 켜면 객실 BLE 비컨을 탐색해 문 앞에 도착하면 자동으로 문을 엽니다.</div>`;
    else info = `<div class="ble-info prox"><span class="scanning-dot"></span><span class="bars">${[1, 2, 3, 4].map((n) => `<i class="${n <= level ? 'on' : ''}"></i>`).join('')}</span>
      <span class="d">${r.roomNo}호 비컨 ${k.dist <= 1 ? '<b>문 앞</b>' : `<b>${k.dist}m</b>`}</span>
      <button data-act="approach" ${k.approaching || k.lock !== 'locked' ? 'disabled' : ''}>문 앞으로 이동</button></div>`;
    return `<div class="ble-row"><span class="ble-ico">${I.ble}</span>
        <div class="t"><b>근접 시 자동 문 열림 <span class="chip ${r.ble ? 'chip-gold' : 'chip-gray'}">BLE</span></b>
        <span>${!r.ble ? 'BLE 미지원 잠금장치 · 비활성화됨' : on ? '켜짐 · 객실에 다가가면 자동으로 열립니다' : '꺼짐 · 비컨 근접 시 자동으로 문을 엽니다'}</span></div>
        <button class="switch ${on ? 'on' : ''}" role="switch" aria-checked="${on}" aria-label="근접 시 자동 문 열림" data-act="ble" ${r.ble ? '' : 'disabled'}></button></div>
      ${info}`;
  }

  function updateKey() {
    const r = getRes(ui.key.id);
    const st = $('#keyStage'); const bp = $('#blePanel');
    if (st) st.innerHTML = keyStage(r);
    if (bp) bp.innerHTML = blePanel(r);
  }

  function unlock(via) {
    const k = ui.key;
    if (!k || k.lock !== 'locked') return;
    k.lock = 'scanning'; k.via = via; updateKey();
    later(() => {
      k.lock = 'open'; vibrate([30, 60, 120]); updateKey();
      later(() => {
        k.lock = 'locked'; updateKey(); toast('객실 문이 다시 잠겼습니다.');
        if (via === 'ble') later(() => { k.dist = 14; updateKey(); }, 1500);
      }, 5000);
    }, via === 'ble' ? 900 : 1600);
  }

  function approach() {
    const k = ui.key;
    if (k.approaching || k.lock !== 'locked') return;
    k.approaching = true; updateKey();
    const step = () => {
      const r = getRes(k.id);
      if (!r.bleOn) { k.approaching = false; return; }
      k.dist = Math.max(1, +(k.dist - 1.6).toFixed(1));
      if (k.dist <= 1) { k.approaching = false; k.dist = 1; unlock('ble'); return; }
      updateKey(); later(step, 260);
    };
    later(step, 260);
  }

  /* ---------------- E·LAND 사전 주문 화면 ---------------- */
  function stepper(g) {
    const q = ui.cart.items[g.sku] || 0;
    return q
      ? `<div class="stepper"><button data-act="qty" data-sku="${g.sku}" data-d="-1" aria-label="${g.name} 빼기">−</button><b>${q}</b><button data-act="qty" data-sku="${g.sku}" data-d="1" aria-label="${g.name} 더하기">+</button></div>`
      : `<button class="add-btn" data-act="qty" data-sku="${g.sku}" data-d="1">${I.plus}담기</button>`;
  }

  function viewShop(id) {
    const r = getRes(id);
    if (!r || !visibleRes().includes(r) || r.status === 'completed') return notFound();
    const T = 'E·LAND 사전 주문';
    const back = `<a class="btn btn-line btn-block" href="#/reservation/${r.id}">예약 상세로 돌아가기</a>`;
    const st = preState(r);
    if (st === 'soon') return blocked(I.clock, '아직 사전 주문 오픈 전이에요',
      `${fmtDT(preStart(r))}부터 주문할 수 있어요.<br/>체크인 ${PRE_H}시간 전 오픈되면 푸시 알림으로 알려드릴게요.`, back, T);
    if (st === 'closed') return blocked(I.bag, '사전 주문이 마감되었습니다',
      (r.orders || []).length ? `주문하신 상품 ${r.orders.length}건은 ${r.roomNo}호에 준비되어 있어요.<br/>사전 주문은 체크인 전까지 가능합니다.` : '사전 주문은 체크인 전까지 가능합니다.', back, T);
    if (!ui.cart || ui.cart.id !== r.id) ui.cart = { id: r.id, items: {} };
    ui.fab = 'up2';
    const prof = guestProfile(r);
    const hrs = Math.floor((checkInAt(r).getTime() - Date.now()) / 3600000);
    const cnt = cartCount(); const sum = cartSum();
    return `<div class="page shop">
      ${header({ back: true, title: T, right: '<span style="width:40px;display:block"></span>' })}
      <section class="shop-hero">
        <div class="sh-top"><span class="chip chip-ai">${I.bag}체크인 전 사전 주문</span><span class="sh-time">${I.clock}${hrs >= 48 ? `체크인 D-${Math.ceil(hrs / 24)}` : hrs > 0 ? `체크인까지 ${hrs}시간` : '체크인 전까지 주문 가능'}</span></div>
        <h2>${esc(me().name)}님의 가평 여행,<br/>이랜드가 미리 준비해 둘게요</h2>
        <p>${r.hotel} · ${fmtS(r.checkIn)} · ${r.room}</p>
        <div class="sh-perks"><div><b>최대 ${Math.max(...GOODS.map(offPct))}%</b><span>투숙객 전용가</span></div><div><b>${POINT_RATE * 100}%</b><span>E.POINT 적립</span></div><div><b>객실 비치</b><span>체크인 시 준비</span></div></div>
      </section>
      <section class="sec"><div class="sec-hd"><h2>${esc(me().name)}님 예약 맞춤 추천</h2></div>
        <p class="shop-why">${I.spark}<span>${prof.map(([, l]) => l).join(' · ')} 예약을 분석해 골랐어요</span></p>
        <div class="hscroll pick-row">${picks(r).map(({ g, hit }) => `<div class="pick"><div class="pk-art">${goodArt(g)}<em>-${offPct(g)}%</em></div>
          ${brandTag(g.brand)}<b>${g.name}</b><small class="why">${hit.map(([, l]) => l).join(' · ')} 추천</small>
          <div class="price"><strong>${won(g.sale)}</strong><del>${won(g.price)}</del></div>${stepper(g)}</div>`).join('')}</div>
      </section>
      <div class="section-gap"></div>
      <section class="sec"><div class="sec-hd"><h2>전체 상품 <span class="muted" style="font-size:15px">${GOODS.length}</span></h2></div>
        <div class="goods">${GOODS.map((g) => `<div class="good"><div class="g-art">${goodArt(g)}</div>
          <div class="g-info">${brandTag(g.brand)}<b>${g.name}</b><small>${g.opt}</small>
          <div class="price"><em>${offPct(g)}%</em><strong>${won(g.sale)}</strong><del>${won(g.price)}</del></div></div>${stepper(g)}</div>`).join('')}</div>
        <p class="hint">${I.info}주문 상품은 체크인 시 객실에 비치되며(냉장 상품은 객실 냉장고), 체크인 전까지 무료로 취소할 수 있습니다.</p>
      </section>
      <div class="sticky-cta">${cnt ? `<div class="note">E.POINT <b style="color:var(--gold-d)">${Math.floor(sum * POINT_RATE).toLocaleString()}P</b> 적립 예정 · 체크인 전까지 무료 취소</div>` : ''}
        <button class="btn btn-gold btn-block" data-act="preCheckout" ${cnt ? '' : 'disabled'}>${cnt ? `${cnt}개 · ${won(sum)} 주문하기` : '상품을 담아 주세요'}</button></div>
    </div>`;
  }

  function coBody() {
    const c = ui.cart; const r = getRes(c.id); const u = me();
    const sum = cartSum(); const use = c.usePoint ? Math.min(u.point, sum) : 0; const pay = sum - use;
    const opt = (k, v, label) => `<button class="${c[k] === v ? 'on' : ''}" data-act="coOpt" data-k="${k}" data-v="${v}">${label}</button>`;
    return `<div class="co-lines">${GOODS.filter((g) => c.items[g.sku]).map((g) => `<div><span>${ELAND[g.brand].ko} · ${g.name} × ${c.items[g.sku]}</span><b>${won(g.sale * c.items[g.sku])}</b></div>`).join('')}</div>
      <div class="demo-group"><label>받는 방법</label><div class="seg">${opt('delivery', 'room', '체크인 시 객실 비치')}${opt('delivery', 'front', '프런트 수령')}</div></div>
      <div class="demo-group"><label>결제 수단</label><div class="seg">${isPrimary() ? opt('pay', 'card', `${r.pay.label} ****${r.pay.last4}`) : ''}${opt('pay', 'epay', 'E.PAY 간편결제')}</div></div>
      <button class="check co-point ${c.usePoint ? 'on' : ''}" data-act="coPoint" role="checkbox" aria-checked="${!!c.usePoint}"><span class="cb">${I.check}</span>E.POINT 사용<span class="req">보유 ${u.point.toLocaleString()}P</span></button>
      <dl class="kv co-sum"><div><dt>상품 금액</dt><dd>${won(sum)}</dd></div>${use ? `<div><dt>E.POINT 사용</dt><dd>-${won(use)}</dd></div>` : ''}
        <div><dt>결제 금액</dt><dd><b>${won(pay)}</b></dd></div>
        <div><dt>E.POINT 적립 예정 (${POINT_RATE * 100}%)</dt><dd class="gold">+${Math.floor(pay * POINT_RATE).toLocaleString()}P</dd></div></dl>
      <div class="act"><button class="btn btn-gold btn-block" data-act="placeOrder">${won(pay)} 결제하기</button></div>`;
  }

  function checkoutSheet() {
    const c = ui.cart; const r = getRes(c.id);
    c.delivery = c.delivery || 'room';
    c.pay = c.pay || (isPrimary() ? 'card' : 'epay');
    sheet('주문 확인', `<div id="coBody">${coBody()}</div>`, `<b style="color:var(--ink)">${r.hotel}</b> · ${fmtS(r.checkIn)} 체크인 · 체크인 전까지 무료 취소`);
  }

  function placeOrder() {
    const c = ui.cart; const r = getRes(c.id); const u = me();
    const items = GOODS.filter((g) => c.items[g.sku]).map((g) => ({ sku: g.sku, qty: c.items[g.sku] }));
    const sum = cartSum(); const use = c.usePoint ? Math.min(u.point, sum) : 0; const pay = sum - use;
    const o = {
      no: 'EL' + String(Date.now()).slice(-8), items, sum, use, total: pay, earn: Math.floor(pay * POINT_RATE),
      delivery: c.delivery === 'room' ? '체크인 시 객실 비치' : '프런트 수령',
      payBy: c.pay === 'card' ? `${r.pay.label} ****${r.pay.last4}` : 'E.PAY 간편결제',
      by: u.name, coupon: CROSS[goodBy(items[0].sku).brand]
    };
    closeOverlay();
    const ld = document.createElement('div');
    ld.className = 'loading';
    ld.innerHTML = '<div><div class="spinner"></div><p>이랜드 주문을 접수하고 있습니다</p></div>';
    document.body.appendChild(ld);
    setTimeout(() => {
      ld.remove(); u.point -= use; (r.orders = r.orders || []).push(o); save(); ui.cart = null;
      go(`#/shop/${r.id}/done`); vibrate(60);
    }, 1400);
  }

  function viewShopDone(id) {
    const r = getRes(id);
    const o = r && (r.orders || []).slice(-1)[0];
    if (!o || !visibleRes().includes(r)) return notFound();
    ui.fab = '';
    return `<div class="page">
      <header class="hdr"><span></span><a class="icon-btn" href="#/reservation/${r.id}" aria-label="닫기" style="margin:0 -8px 0 0">${I.close}</a></header>
      <div class="done shop-done">
        <div class="done-mark">${I.bag}</div>
        <h2>사전 주문이 완료되었습니다</h2>
        <p>${o.delivery === '프런트 수령' ? '체크인 시 프런트에서 받아 가세요.' : '체크인하시면 객실에 미리 준비해 둘게요.'}<br/>${r.hotel} · ${fmtS(r.checkIn)} 체크인</p>
        <div class="box receipt"><dl class="kv">
          <div><dt>주문번호</dt><dd>${o.no}</dd></div>
          ${o.items.map((it) => { const g = goodBy(it.sku); return `<div><dt>${ELAND[g.brand].ko} · ${g.name} × ${it.qty}</dt><dd>${won(g.sale * it.qty)}</dd></div>`; }).join('')}
          ${o.use ? `<div><dt>E.POINT 사용</dt><dd>-${won(o.use)}</dd></div>` : ''}
          <div><dt>결제 금액 · ${o.payBy}</dt><dd><b>${won(o.total)}</b></dd></div>
        </dl></div>
        <div class="earn">${I.crown}<span>E.POINT <b>+${o.earn.toLocaleString()}P</b> 적립 예정<br/><small>체크아웃 후 적립 · 이랜드 전 브랜드에서 사용</small></span></div>
        <div class="coupon"><div class="cp-l"><small>E·LAND CROSS BRAND COUPON</small><b>${o.coupon.title}</b><span>주문 감사 쿠폰 · 발급일로부터 30일 · 전국 매장</span></div><div class="cp-r">${o.coupon.pct}</div></div>
        <a class="btn btn-dark btn-block" href="#/reservation/${r.id}" style="margin-bottom:10px">예약 상세로</a>
        <a class="btn btn-line btn-block" href="#/shop/${r.id}">상품 더 둘러보기</a>
      </div></div>`;
  }

  function notFound() {
    return blocked(I.list, '예약을 찾을 수 없습니다', '현재 사용자 시점에서 확인할 수 없는 예약입니다.', `<a class="btn btn-line btn-block" href="#/reservations">나의 예약으로</a>`);
  }
  /* ---------------- AI 컨시어지 챗봇 (목업: 정해진 데모 플로우를 선택지로 전개) ----------------
   * 실제 LLM 없이 노드(flow) + 선택지(opts)로 대화를 진행한다. 자유 입력은 키워드로 노드에 매칭한다.
   * 예약 상태·사용자 시점(주 예약자/동숙자)에 따라 답변과 선택지가 달라진다. */
  const chat = { open: false, msgs: [], opts: [], busy: false, typing: false, timers: [] };
  const chatLater = (fn, ms) => chat.timers.push(setTimeout(fn, ms));
  const chatRes = () => visibleRes().find((x) => x.status !== 'completed');
  const nowT = () => { const d = new Date(); const h = d.getHours(); return `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}:${pad(d.getMinutes())}`; };
  const reqNo = () => 'RQ' + String(Date.now()).slice(-6);
  const ccard = (icon, title, rows, cta) => ({ icon, title, rows, cta });
  const MENU = [['체크인 · 체크아웃', 'checkin'], ['객실 서비스 요청', 'room'], ['다이닝 · 조식 예약', 'dining'], ['주변 관광 추천', 'tour'], ['이랜드 사전 주문', 'shop'], ['객실 문이 안 열려요', 'door'], ['상담원 연결', 'human']];
  const menuOpts = () => MENU.map(([label, to]) => ({ label, to }));
  const endOpts = () => [{ label: '다른 도움이 필요해요', to: 'menu' }, { label: '대화 종료', to: 'bye' }];
  const NO_RES = ['start', 'menu', 'human', 'bye', 'rate', 'fallback'];
  const KEYWORDS = [[/얼리/, 'early'], [/레이트|늦게/, 'late'], [/체크인|체크아웃/, 'checkin'], [/수건|어메니티/, 'towel'], [/베드|침대/, 'bed'],
    [/청소|하우스키핑/, 'hk'], [/조식|아침/, 'bf'], [/애슐리|저녁|식당|레스토랑|다이닝|룸서비스/, 'dining'], [/셔틀|버스/, 'shuttle'],
    [/관광|추천|여행|가볼|남이섬/, 'tour'], [/주문|이랜드|스파오|쇼핑/, 'shop'], [/문|도어|키|안 열/, 'door'], [/직원|호출/, 'staff'],
    [/상담|사람|연결/, 'human'], [/고마|감사|종료|끝/, 'bye']];

  function flow(id, arg) {
    const r = chatRes(); const u = me();
    if (!r && !NO_RES.includes(id)) return { say: ['이용 예정인 예약이 없어 해당 안내를 드리기 어려워요. 다른 도움이 필요하신가요?'], opts: menuOpts() };
    const roomTxt = r && r.status === 'checkedIn' ? `${r.roomNo}호` : '배정 예정 객실';
    switch (id) {
      case 'start': return {
        say: [`안녕하세요, <b>${esc(u.name)}님</b>.<br/>켄싱턴리조트 가평 AI 컨시어지 <b>K</b>입니다.`,
          r ? `${fmtS(r.checkIn)} 체크인 · ${r.room} 예약을 확인했어요. (${STATUS[r.status].label})<br/>무엇을 도와드릴까요?` : '현재 이용 예정인 예약이 없어요. 무엇을 도와드릴까요?'],
        opts: menuOpts() };
      case 'menu': return { say: ['네, 어떤 도움이 필요하세요?'], opts: menuOpts() };
      case 'checkin': {
        const say = [`체크인은 <b>${r.inTime}</b>, 체크아웃은 <b>${r.outTime}</b>입니다.`];
        const opts = [];
        if (r.status === 'available' && isPrimary()) {
          say.push('지금 바로 모바일 체크인이 가능해요. 프런트 방문 없이 객실 배정부터 모바일 키 발급까지 앱에서 끝낼 수 있어요.');
          opts.push({ label: '모바일 체크인 하기', go: `#/checkin/${r.id}` });
        } else if (r.status === 'available') say.push(`모바일 체크인은 결제정보를 등록한 주 예약자(${S.users.primary.name}님)만 진행할 수 있어요. 체크인이 끝나면 모바일 키가 자동으로 공유됩니다.`);
        else if (r.status === 'waiting') say.push(`${fmtS(r.checkIn)} ${r.inTime}부터 모바일 체크인이 열려요. 열리면 푸시 알림으로 알려드릴게요.`);
        else say.push(`이미 체크인이 완료되었어요. 객실은 <b>${r.roomNo}호</b>(${r.floor})입니다.`);
        if (r.status !== 'checkedIn') opts.push({ label: '얼리 체크인 요청', to: 'early' });
        opts.push({ label: '레이트 체크아웃 요청', to: 'late' }, { label: '처음으로', to: 'menu' });
        return { say, opts };
      }
      case 'early': return { say: ['해당 날짜의 객실 현황을 확인했어요.', '<b>13:00 얼리 체크인</b>이 가능합니다. 이용료 30,000원은 객실 요금과 함께 정산돼요. 신청할까요?'],
        opts: [{ label: '신청할게요', to: 'earlyOk' }, { label: '괜찮아요', to: 'menu' }] };
      case 'earlyOk': return { say: ['얼리 체크인 신청이 완료되었어요.', ccard(I.clock, '얼리 체크인 확정', [['요청번호', reqNo()], ['체크인 시간', `${fmtS(r.checkIn)} 13:00`], ['추가 요금', won(30000)]])], opts: endOpts() };
      case 'late': return { say: [`${u.grade} 회원 혜택으로 <b>13:00 레이트 체크아웃</b>을 무료로 이용하실 수 있어요. 신청할까요?`],
        opts: [{ label: '무료로 신청', to: 'lateOk' }, { label: '괜찮아요', to: 'menu' }] };
      case 'lateOk': return { say: ['레이트 체크아웃이 적용되었어요.', ccard(I.clock, '레이트 체크아웃 확정', [['요청번호', reqNo()], ['체크아웃 시간', `${fmtS(r.checkOut)} 13:00`], ['추가 요금', '무료 · 멤버십 혜택']])], opts: endOpts() };
      case 'room': return { say: ['어떤 객실 서비스가 필요하세요?'],
        opts: [{ label: '수건 · 어메니티 추가', to: 'towel' }, { label: '엑스트라 베드', to: 'bed' }, { label: '하우스키핑 시간 지정', to: 'hk' }, { label: '처음으로', to: 'menu' }] };
      case 'towel': return { say: ['수건을 몇 장 가져다 드릴까요? 어메니티 키트도 함께 준비해 드려요.'],
        opts: [2, 4, 6].map((n) => ({ label: `수건 ${n}장`, to: 'towelOk', arg: n })) };
      case 'towelOk': return {
        say: [r.status === 'checkedIn' ? `요청을 접수했어요. 약 <b>15분</b> 안에 ${roomTxt}로 전달됩니다.` : '요청을 접수했어요. 체크인하시면 객실에 미리 비치해 둘게요.',
          ccard(I.bath, '객실 서비스 요청', [['요청번호', reqNo()], ['요청 내용', `수건 ${arg}장 + 어메니티 키트`], ['전달 위치', roomTxt], ['진행 상태', '접수 완료']])],
        follow: r.status === 'checkedIn' ? '하우스키핑 직원이 객실로 출발했어요. 도착하면 노크 후 문 앞에 두고 갈게요.' : '',
        opts: endOpts() };
      case 'bed': return { say: [`엑스트라 베드는 1박 40,000원이며, ${nights(r)}박 기준 <b>${won(40000 * nights(r))}</b>입니다. 침구와 함께 준비해 드릴까요?`],
        opts: [{ label: '신청할게요', to: 'bedOk' }, { label: '괜찮아요', to: 'room' }] };
      case 'bedOk': return { say: ['엑스트라 베드를 준비해 둘게요.', ccard(I.bed, '엑스트라 베드', [['요청번호', reqNo()], ['기간', `${fmtS(r.checkIn)} ~ ${fmtS(r.checkOut)}`], ['요금', won(40000 * nights(r))]])], opts: endOpts() };
      case 'hk': return { say: ['하우스키핑 희망 시간을 선택해 주세요.'],
        opts: ['10:00 – 11:00', '13:00 – 14:00', '15:00 – 16:00'].map((t) => ({ label: t, to: 'hkOk', arg: t })).concat({ label: '방해 금지 (DND)', to: 'hkOk', arg: 'DND' }) };
      case 'hkOk': return { say: [arg === 'DND' ? '방해 금지를 설정했어요. 체류 기간 동안 하우스키핑을 진행하지 않습니다.' : `체류 기간 동안 매일 <b>${arg}</b>에 하우스키핑을 진행할게요.`,
        ccard(I.bath, '하우스키핑 설정', [['요청번호', reqNo()], ['설정', arg === 'DND' ? '방해 금지' : arg]])], opts: endOpts() };
      case 'dining': return { say: ['켄싱턴리조트 가평의 다이닝을 안내해 드릴게요.',
        ccard(I.coffee, '리조트 다이닝', [['더 테라스 · 조식 뷔페', '07:00 – 10:00 · 1F'], ['애슐리퀸즈 가평점', '11:00 – 21:00 · B1'], ['라운지 바', '17:00 – 24:00 · 2F'], ['룸서비스', '24시간']])],
        opts: [{ label: '조식 예약', to: 'bf' }, { label: '애슐리퀸즈 저녁 예약', to: 'ashley' }, { label: '처음으로', to: 'menu' }] };
      case 'bf': return { say: [`${fmtS(iso(addDays(parse(r.checkIn), 1)))} 조식, 몇 시로 예약할까요? (${r.adults + r.children}명 기준)`],
        opts: ['07:30', '08:30', '09:30'].map((t) => ({ label: t, to: 'bfOk', arg: t })) };
      case 'bfOk': return { say: ['조식 예약을 완료했어요. 입장 시 객실 번호만 말씀해 주세요.',
        ccard(I.coffee, '조식 예약 확정', [['예약번호', reqNo()], ['장소', '더 테라스 · 1F'], ['일시', `${fmtS(iso(addDays(parse(r.checkIn), 1)))} ${arg}`], ['인원', `${r.adults + r.children}명`]])], opts: endOpts() };
      case 'ashley': return { say: ['애슐리퀸즈 가평점 저녁 예약 시간을 골라 주세요. 투숙객은 <b>10% 할인</b>이 적용돼요.'],
        opts: ['18:00', '19:00', '20:00'].map((t) => ({ label: t, to: 'ashleyOk', arg: t })) };
      case 'ashleyOk': return { say: ['애슐리퀸즈 가평점 예약을 완료했어요.',
        ccard(I.coffee, '애슐리퀸즈 예약 확정', [['예약번호', reqNo()], ['일시', `${fmtS(r.checkIn)} ${arg}`], ['인원', `${r.adults + r.children}명`], ['혜택', '투숙객 10% 할인']])], opts: endOpts() };
      case 'tour': {
        const { label, items } = recommend(r);
        return { say: [`<b>${esc(u.name)}님</b>과 비슷한 예약(${label})을 하신 분들은 이런 곳들도 예약하셨어요.`,
          ccard(I.spark, 'AI 추천 · 적합도', items.slice(0, 3).map((s) => [`${s.name} · ${s.km}km`, `${s.score}%`]))],
        opts: [{ label: `${items[0].name} 가는 길`, to: 'route' }, { label: '리조트 셔틀 시간표', to: 'shuttle' }, { label: '처음으로', to: 'menu' }] };
      }
      case 'route': {
        const s = recommend(r).items[0];
        return { say: [`${s.name}까지 리조트에서 <b>${s.km}km</b>, 차로 약 ${Math.round(s.km * 2 + 3)}분 거리예요. 무료 리조트 셔틀을 이용하시면 주차 걱정이 없어요.`],
          opts: [{ label: '리조트 셔틀 시간표', to: 'shuttle' }, { label: '처음으로', to: 'menu' }] };
      }
      case 'shuttle': return { say: ['리조트 무료 셔틀 시간표예요. 탑승은 로비 정문 앞입니다.',
        ccard(I.pin, '리조트 무료 셔틀', [['가평역 ↔ 리조트', '매시 정각 · 09–21시'], ['남이섬 선착장', '10:00 · 13:00 · 16:00'], ['아침고요수목원', '10:30 · 14:30']])], opts: endOpts() };
      case 'shop': {
        const st = preState(r);
        if (st === 'soon') return { say: [`이 예약의 이랜드 사전 주문은 <b>${fmtDT(preStart(r))}</b>에 열려요. 오픈되면 알림으로 알려드릴게요.`], opts: endOpts() };
        if (st === 'closed') return { say: ['체크인 이후에는 사전 주문이 마감돼요. 객실에서 필요한 건 룸서비스로 주문하실 수 있어요.'], opts: [{ label: '다이닝 안내', to: 'dining' }, { label: '처음으로', to: 'menu' }] };
        return { say: ['체크인 전에 주문하시면 객실에 미리 준비해 드려요. 예약에 맞춰 이런 상품을 추천해요.',
          ccard(I.bag, `${esc(u.name)}님 예약 맞춤 추천`, picks(r).slice(0, 3).map(({ g }) => [`${ELAND[g.brand].ko} ${g.name}`, won(g.sale)]), { label: '사전 주문 바로가기', href: `#/shop/${r.id}` })],
        opts: [{ label: '사전 주문 바로가기', go: `#/shop/${r.id}` }, { label: '처음으로', to: 'menu' }] };
      }
      case 'door': {
        const say = ['불편을 드려 죄송해요. 아래 순서로 확인해 주세요.',
          ccard(I.nfc, '문 열림 체크리스트', [['1', '휴대폰 NFC 설정 켜기'], ['2', '휴대폰 뒷면을 도어락에 1~2초 대기'], ['3', r.ble ? 'BLE 자동 열림은 블루투스 켜기' : '이 객실은 NFC 전용 잠금장치']])];
        if (!canUseKey(r)) say.push('아직 모바일 키가 발급되지 않았어요. 체크인이 완료되면 사용할 수 있어요.');
        return { say, opts: (canUseKey(r) ? [{ label: '모바일 키 열기', go: `#/key/${r.id}` }] : []).concat({ label: '직원 호출', to: 'staff' }, { label: '처음으로', to: 'menu' }) };
      }
      case 'staff': return { say: [`프런트에 요청을 전달했어요. 직원이 <b>5분 안에</b> ${roomTxt} 앞으로 찾아갈게요.`,
        ccard(I.users, '직원 호출', [['요청번호', reqNo()], ['위치', roomTxt], ['예상 도착', '5분 이내']])], opts: endOpts() };
      case 'human': return { say: ['상담원 연결을 요청했어요. 현재 대기 고객은 <b>0명</b>이에요.', '연결되는 동안 대부분의 요청은 AI 컨시어지가 바로 처리해 드릴 수 있어요.'], opts: menuOpts() };
      case 'bye': return { say: ['이용해 주셔서 감사합니다. 오늘 상담은 어떠셨나요?'],
        opts: [['만족해요', 'good'], ['보통이에요', 'soso'], ['아쉬워요', 'bad']].map(([label, v]) => ({ label, to: 'rate', arg: v })) };
      case 'rate': return { say: ['소중한 의견 감사합니다. 필요하실 때 언제든 불러 주세요.'], opts: [{ label: '처음으로', to: 'menu' }] };
      default: return { say: ['죄송해요, 아직 이해하지 못한 요청이에요. 아래 메뉴에서 골라 주시면 바로 도와드릴게요.'], opts: menuOpts() };
    }
  }

  const cardHTML = (c) => `<div class="ccard"><div class="cc-hd">${c.icon}${c.title}</div><dl>${c.rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>
    ${c.cta ? `<button class="cc-cta" data-act="chatGo" data-href="${c.cta.href}">${c.cta.label}${I.right}</button>` : ''}</div>`;
  function msgHTML(x, prev) {
    const body = typeof x.m === 'string' ? `<div class="bubble">${x.m}</div>` : cardHTML(x.m);
    if (x.from === 'me') return `<div class="msg me"><time>${x.at}</time>${body}</div>`;
    const cont = prev && prev.from === 'bot';
    return `<div class="msg bot ${cont ? 'cont' : ''}"><span class="bot-av sm">${EMBLEM}</span><div class="mb">${cont ? '' : '<small class="who">AI 컨시어지 K</small>'}${body}</div><time>${x.at}</time></div>`;
  }
  function renderChatBody() {
    const b = $('#chatBody'); if (!b) return;
    b.innerHTML = `<div class="chat-day">오늘</div><div class="chat-notice">${I.spark}AI 컨시어지가 24시간 답변해 드려요</div>`
      + chat.msgs.map((x, i) => msgHTML(x, chat.msgs[i - 1])).join('')
      + (chat.typing ? `<div class="msg bot ${chat.msgs.length && chat.msgs[chat.msgs.length - 1].from === 'bot' ? 'cont' : ''}"><span class="bot-av sm">${EMBLEM}</span><div class="bubble typing" aria-label="입력 중"><i></i><i></i><i></i></div></div>` : '');
    b.scrollTop = b.scrollHeight;
  }
  function renderChatOpts() {
    const o = $('#chatOpts'); if (!o) return;
    o.innerHTML = chat.opts.map((x, i) => `<button class="qr ${x.go ? 'go' : ''}" data-act="chatPick" data-i="${i}">${x.label}${x.go ? I.right : ''}</button>`).join('');
    const b = $('#chatBody'); if (b) b.scrollTop = b.scrollHeight;
  }
  function chatRun(id, arg) {
    const n = flow(id, arg);
    chat.opts = []; chat.busy = true; chat.typing = true;
    renderChatOpts(); renderChatBody();
    let t = 0;
    n.say.forEach((m, i) => {
      t += i === 0 ? 700 : 950;
      chatLater(() => {
        chat.msgs.push({ from: 'bot', m, at: nowT() });
        chat.typing = i < n.say.length - 1;
        renderChatBody();
      }, t);
    });
    chatLater(() => {
      chat.busy = false; chat.opts = n.opts; renderChatOpts();
      if (n.follow) chatLater(() => { chat.msgs.push({ from: 'bot', m: n.follow, at: nowT() }); renderChatBody(); }, 2600);
    }, t + 150);
  }
  function chatClear() { chat.timers.forEach(clearTimeout); chat.timers = []; chat.msgs = []; chat.opts = []; chat.busy = false; chat.typing = false; }
  function openChat() {
    closeOverlay();
    let root = $('#chat-root');
    if (!root) { root = document.createElement('div'); root.id = 'chat-root'; document.body.appendChild(root); }
    root.innerHTML = `<div class="chat" role="dialog" aria-modal="true" aria-label="AI 컨시어지 채팅">
      <header class="chat-hd"><button class="icon-btn" data-act="chatClose" aria-label="채팅 닫기">${I.back}</button>
        <span class="bot-av">${EMBLEM}</span>
        <div class="t"><b>AI 컨시어지 K <span class="ai-badge">AI</span></b><span><i></i>켄싱턴리조트 가평 · 24시간 응답</span></div>
        <button class="icon-btn" data-act="chatReset" aria-label="대화 새로 시작">${I.refresh}</button></header>
      <div class="chat-body" id="chatBody" aria-live="polite"></div>
      <div class="chat-opts" id="chatOpts"></div>
      <form class="chat-input" id="chatForm" autocomplete="off"><input id="chatText" placeholder="메시지를 입력하세요" maxlength="100" aria-label="메시지 입력"/><button type="submit" aria-label="보내기">${I.send}</button></form>
    </div>`;
    chat.open = true; document.body.classList.add('chat-on'); document.body.style.overflow = 'hidden';
    renderChatBody(); renderChatOpts();
    if (!chat.msgs.length && !chat.busy) chatRun('start');
  }
  function closeChat() {
    const root = $('#chat-root'); if (root) root.innerHTML = '';
    chat.open = false; document.body.classList.remove('chat-on'); document.body.style.overflow = '';
  }
  function chatPick(o) {
    chat.msgs.push({ from: 'me', m: esc(o.label), at: nowT() });
    chat.opts = []; renderChatOpts(); renderChatBody();
    if (o.go) { chat.busy = true; chatLater(() => { chat.busy = false; closeChat(); go(o.go); }, 450); return; }
    chatRun(o.to, o.arg);
  }
  function chatSend() {
    const input = $('#chatText'); const text = input.value.trim();
    if (!text || chat.busy) return;
    input.value = '';
    chat.msgs.push({ from: 'me', m: esc(text), at: nowT() });
    renderChatBody();
    const hit = KEYWORDS.find(([re]) => re.test(text));
    chatRun(hit ? hit[1] : 'fallback');
  }

  /* ---------------- router ---------------- */
  const routes = [
    [/^\/$/, viewHome],
    [/^\/reservations$/, viewList],
    [/^\/reservation\/([\w-]+)$/, viewDetail],
    [/^\/checkin\/([\w-]+)$/, viewCheckin],
    [/^\/key\/([\w-]+)$/, viewKey],
    [/^\/shop\/([\w-]+)$/, viewShop],
    [/^\/shop\/([\w-]+)\/done$/, viewShopDone]
  ];
  let navs = 0;
  function render(keepScroll = false) {
    clearTimers();
    const y = window.scrollY;
    const path = location.hash.replace(/^#/, '') || '/';
    const hit = routes.find(([re]) => re.test(path));
    if (!hit) { location.replace('#/'); return; }
    app.innerHTML = hit[1](...path.match(hit[0]).slice(1));
    const isKey = !!$('.key-page');
    document.querySelector('meta[name="theme-color"]').setAttribute('content', isKey ? '#161616' : '#ffffff');
    renderFab();
    window.scrollTo(0, keepScroll ? y : 0);
  }
  const refresh = () => render(true);

  function parentOf(path) {
    const m = path.match(/^\/(checkin|key|shop)\/([\w-]+)(\/done)?$/);
    if (m) return `#/reservation/${m[2]}`;
    if (/^\/reservation\//.test(path)) return '#/reservations';
    return '#/';
  }

  /* ---------------- actions ---------------- */
  const A = {
    drawer: () => drawer(),
    closeOverlay: () => closeOverlay(),
    demo: () => demoPanel(),
    soon: () => toast('데모에서는 지원하지 않는 메뉴입니다.'),
    back: () => {
      const path = location.hash.replace(/^#/, '');
      if (/^\/checkin\//.test(path) && ui.ci && !ui.ci.done && ui.ci.step > 1) { ui.ci.step--; render(); return; }
      if (navs > 0) history.back(); else location.replace(parentOf(path));
    },
    tab: (el) => { ui.tab = el.dataset.v; refresh(); },
    persona: (el) => {
      S.persona = el.dataset.v; save(); closeOverlay(); ui.tab = 'upcoming'; chatClear();
      toast(`${me().name} 님(${isPrimary() ? '주 예약자' : '동숙자'}) 시점으로 전환했습니다.`);
      const h = location.hash || '#/';
      if (h === '#/' || h === '#/reservations') refresh(); else go('#/reservations');
    },
    setStatus: (el) => {
      const r = getRes(el.dataset.id); const v = el.dataset.v; const prev = r.status;
      if (prev === v) return;
      r.status = v; save(); closeOverlay(); refresh();
      const visible = visibleRes().includes(r);
      if (!visible) { toast(`${r.hotel} 예약 상태를 ‘${STATUS[v].label}’(으)로 변경했습니다.`); return; }
      if (v === 'available') setTimeout(() => push('모바일 체크인이 시작되었습니다',
        isPrimary() ? `${r.hotel} ${fmtS(r.checkIn)} 예약 · 지금 앱에서 체크인하고 모바일 키를 받으세요.` : `${r.hotel} · 주 예약자가 체크인하면 모바일 키가 공유됩니다.`,
        `#/reservation/${r.id}`), 700);
      else if (v === 'checkedIn') setTimeout(() => push('모바일 키가 발급되었습니다', `${r.hotel} ${r.roomNo}호 · 휴대폰으로 객실 문을 열 수 있어요.`, `#/key/${r.id}`), 700);
      else toast(`예약 상태를 ‘${STATUS[v].label}’(으)로 변경했습니다.`);
    },
    reset: () => {
      localStorage.removeItem(STORE); S = initialState(); ui.ci = null; ui.key = null; ui.tab = 'upcoming'; chatClear();
      closeOverlay(); go('#/'); toast('데모 데이터를 초기화했습니다.');
    },
    addGuest: (el) => addGuestSheet(el.dataset.id),
    rmGuest: (el) => {
      const r = getRes(el.dataset.id); const g = r.guests.find((x) => x.id === el.dataset.g);
      sheet('동숙자 삭제', `<div class="act" style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <button class="btn btn-line" data-act="closeOverlay">취소</button><button class="btn btn-dark" data-act="rmGuestOk" data-id="${r.id}" data-g="${g.id}">삭제</button></div>`,
      `${esc(g.name)} 님을 동숙자에서 삭제할까요?<br/>삭제하면 해당 동숙자의 모바일 키 권한도 즉시 회수됩니다.`);
    },
    rmGuestOk: (el) => {
      const r = getRes(el.dataset.id); const g = r.guests.find((x) => x.id === el.dataset.g);
      r.guests = r.guests.filter((x) => x.id !== g.id); save(); closeOverlay(); refresh();
      toast(`${g.name} 님을 동숙자에서 삭제했습니다.`);
    },
    openKey: () => {
      const keys = visibleRes().filter(canUseKey);
      if (keys.length === 1) { closeOverlay(); go(`#/key/${keys[0].id}`); return; }
      if (keys.length > 1) {
        sheet('모바일 키 선택', `<div class="act">${keys.map((r) => `<a class="btn btn-line btn-block" style="margin-bottom:8px;justify-content:space-between" href="#/key/${r.id}" data-act="closeOverlay"><span>${r.hotel}</span><span class="muted">${r.roomNo}호</span></a>`).join('')}</div>`);
        return;
      }
      closeOverlay();
      toast(isPrimary() ? '모바일 체크인을 완료하면 모바일 키가 발급됩니다.' : '주 예약자가 체크인을 완료하면 모바일 키가 공유됩니다.');
    },
    quickCheckin: () => {
      const r = visibleRes().find((x) => x.status === 'available');
      if (!r) { toast('체크인 가능한 예약이 없습니다. DEMO 버튼으로 상태를 바꿔 보세요.'); return; }
      if (!isPrimary()) { toast('모바일 체크인은 주 예약자만 가능합니다.'); return; }
      go(`#/checkin/${r.id}`);
    },
    quickGuest: () => {
      if (!isPrimary()) { toast('동숙자 추가는 주 예약자만 가능합니다.'); return; }
      const r = visibleRes().find((x) => x.status !== 'completed' && capacity(x) - x.guests.length > 0);
      if (!r) { toast('동숙자를 추가할 수 있는 예약이 없습니다.'); return; }
      addGuestSheet(r.id);
    },
    arrival: (el) => { ui.ci.arrival = el.dataset.v; refresh(); },
    agree: (el) => {
      const a = ui.ci.agree; const k = el.dataset.v;
      if (k === 'all') { const v = !(a.terms && a.privacy && a.pay); a.terms = a.privacy = a.pay = v; } else a[k] = !a[k];
      refresh();
    },
    ciNext: () => { ui.ci.step++; render(); },
    doCheckin: () => {
      const r = getRes(ui.ci.id);
      const ld = document.createElement('div');
      ld.className = 'loading';
      ld.innerHTML = '<div><div class="spinner"></div><p>객실을 배정하고 모바일 키를 발급하고 있습니다</p></div>';
      document.body.appendChild(ld);
      setTimeout(() => {
        ld.remove(); r.status = 'checkedIn'; save(); ui.ci.done = true; render(); vibrate(80);
      }, 1800);
    },
    nfc: () => unlock('nfc'),
    ble: (el) => {
      const r = getRes(ui.key.id);
      if (!r.ble) return;
      r.bleOn = !r.bleOn; save();
      el.classList.toggle('on', r.bleOn); el.setAttribute('aria-checked', r.bleOn);
      if (!r.bleOn) { ui.key.approaching = false; ui.key.dist = 14; }
      setTimeout(updateKey, 260);
      toast(r.bleOn ? '근접 시 자동 문 열림을 켰습니다.' : '근접 시 자동 문 열림을 껐습니다.');
    },
    approach: () => approach(),
    chatOpen: () => openChat(),
    chatClose: () => closeChat(),
    chatReset: () => { chatClear(); chatRun('start'); },
    chatPick: (el) => { const o = chat.opts[Number(el.dataset.i)]; if (o && !chat.busy) chatPick(o); },
    chatGo: (el) => { closeChat(); go(el.dataset.href); },
    qty: (el) => {
      const c = ui.cart; const k = el.dataset.sku;
      const q = Math.max(0, Math.min(9, (c.items[k] || 0) + Number(el.dataset.d)));
      if (q) c.items[k] = q; else delete c.items[k];
      const row = $('.pick-row'); const x = row ? row.scrollLeft : 0;
      refresh();
      const row2 = $('.pick-row'); if (row2) row2.scrollLeft = x;
    },
    preCheckout: () => checkoutSheet(),
    coOpt: (el) => { ui.cart[el.dataset.k] = el.dataset.v; $('#coBody').innerHTML = coBody(); },
    coPoint: () => { ui.cart.usePoint = !ui.cart.usePoint; $('#coBody').innerHTML = coBody(); },
    placeOrder: () => placeOrder(),
    preOpen: (el) => {
      const r = getRes(el.dataset.id);
      r.preOpen = true; save(); closeOverlay(); refresh();
      if (!visibleRes().includes(r)) { toast(`${r.hotel} 사전 주문을 오픈했습니다.`); return; }
      const names = picks(r).slice(0, 2).map(({ g }) => `${ELAND[g.brand].ko} ${g.name}`).join(', ');
      setTimeout(() => push(`체크인 ${PRE_H / 24}일 전, 이랜드 사전 주문이 열렸어요`,
        `${me().name}님 예약 맞춤 추천: ${names} · 객실에 미리 준비해 드려요.`, `#/shop/${r.id}`), 700);
    },
    openShop: () => {
      const r = visibleRes().find((x) => preState(x) === 'open') || visibleRes().find((x) => preState(x) === 'soon');
      closeOverlay();
      if (!r) { toast('사전 주문할 수 있는 예약이 없습니다.'); return; }
      go(`#/shop/${r.id}`);
    }
  };

  document.addEventListener('click', (e) => {
    const el = e.target.closest('[data-act]');
    if (!el || !A[el.dataset.act]) return;
    if (el.tagName === 'BUTTON') e.preventDefault();
    A[el.dataset.act](el);
  });
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.dataset.bind && ui.ci) ui.ci[t.dataset.bind] = t.value;
    if (t.id === 'gPhone') {
      const d = normPhone(t.value).slice(0, 11);
      t.value = d.length > 7 ? `${d.slice(0, 3)}-${d.slice(3, 7)}-${d.slice(7)}` : d.length > 3 ? `${d.slice(0, 3)}-${d.slice(3)}` : d;
    }
  });
  document.addEventListener('submit', (e) => {
    if (e.target.id === 'guestForm') { e.preventDefault(); submitGuest(e.target); }
    if (e.target.id === 'chatForm') { e.preventDefault(); chatSend(); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (overlay.innerHTML) closeOverlay(); else if (chat.open) closeChat();
  });
  window.addEventListener('hashchange', () => { navs++; closeOverlay(); closeChat(); render(); });

  /* ---------------- boot ---------------- */
  function splash() {
    if (sessionStorage.getItem('kh-splash')) return;
    sessionStorage.setItem('kh-splash', '1');
    const el = document.createElement('div');
    el.className = 'splash';
    el.innerHTML = `<div class="splash-in">${WORDMARK}<div class="splash-icons">${I.coffee}${I.tube}${I.bath}${I.bed}</div></div>`;
    document.body.appendChild(el);
    setTimeout(() => { el.classList.add('out'); setTimeout(() => el.remove(), 500); }, 1500);
  }
  splash();
  render();
  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost' || location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js'));
  }

})();
