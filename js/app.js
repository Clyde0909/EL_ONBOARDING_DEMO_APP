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
  const STORE = 'kh-demo-state-v1';
  function initialState() {
    const t = new Date(); t.setHours(0, 0, 0, 0);
    return {
      persona: 'primary',
      users: {
        primary: { name: '홍길동', phone: '010-1234-5678', grade: 'K MEMBERSHIP GOLD', no: 'N 0120191234567' },
        companion: { name: '김민지', phone: '010-9876-5432', grade: 'K MEMBERSHIP SILVER', no: 'N 0120207654321' }
      },
      reservations: [
        {
          id: 'KH2610-118820', hotel: '켄싱턴호텔 여의도', area: '서울 영등포구', room: '디럭스 패밀리 트윈', view: '한강 시티뷰', theme: 'city',
          checkIn: iso(t), checkOut: iso(addDays(t, 2)), inTime: '15:00', outTime: '11:00', adults: 3, children: 0,
          status: 'waiting', ble: true, lock: 'K-Lock Pro · NFC / BLE', roomNo: '1207', floor: '12F', bleOn: false,
          guests: [{ id: 'g1', name: '김민지', phone: '010-9876-5432', state: 'accepted' }],
          pay: { brand: 'SHINHAN CARD', label: '신한카드', last4: '4821', amount: 428000 }
        },
        {
          id: 'KH2611-204551', hotel: '켄싱턴리조트 설악밸리', area: '강원 속초시', room: '패밀리 스위트', view: '설악산 마운틴뷰', theme: 'mountain',
          checkIn: iso(addDays(t, 24)), checkOut: iso(addDays(t, 26)), inTime: '15:00', outTime: '11:00', adults: 2, children: 2,
          status: 'waiting', ble: false, lock: 'K-Lock Classic · NFC 전용', roomNo: 'B-305', floor: 'B동 3F', bleOn: false,
          guests: [],
          pay: { brand: 'HYUNDAI CARD', label: '현대카드', last4: '1093', amount: 612000 }
        },
        {
          id: 'KH2607-073102', hotel: '켄싱턴리조트 제주한림', area: '제주 제주시', room: '오션 디럭스', view: '한림 바다 오션뷰', theme: 'sea',
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
  /* ---------------- ui primitives ---------------- */
  const app = $('#app');
  const overlay = $('#overlay-root');
  const ui = { tab: 'upcoming', ci: null, key: null, fab: '' };
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
      <div class="seg">${['waiting', 'available', 'checkedIn'].map((s) => `<button class="${r.status === s ? 'on' : ''}" data-act="setStatus" data-id="${r.id}" data-v="${s}">${STATUS[s].label}</button>`).join('')}</div></div>`).join('');
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
        <button data-act="openKey"><span class="qi">${I.key}</span>모바일 키</button>
        <button data-act="quickGuest"><span class="qi">${I.userPlus}</span>동숙자 추가</button>
      </nav>
      <div class="section-gap"></div>
      <section class="sec"><div class="sec-hd"><h2>테마기획전</h2><button class="more" data-act="soon" aria-label="테마기획전 더보기" style="color:var(--ink)">${I.plus}</button></div>
        <div class="hscroll">
          <div class="promo"><div class="art">${scene('autumn')}<span class="badge">추가할인<br/>10%</span></div><h3>Autumn Festa</h3><p>쾌청한 가을날씨를 온몸으로 느낄 수 있는 켄싱턴 가을 패키지</p><div class="period">${I.cal}${t.getFullYear()}. 10. 01 ~ ${t.getFullYear()}. 11. 30</div></div>
          <div class="promo"><div class="art">${scene('mountain')}</div><h3>설악산 단풍 스테이</h3><p>설악밸리에서 즐기는 단풍 트레킹과 조식 패키지</p><div class="period">${I.cal}${t.getFullYear()}. 10. 15 ~ ${t.getFullYear()}. 11. 15</div></div>
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
  function blocked(icon, title, body, cta) {
    ui.fab = '';
    return `<div class="page">${header({ back: true, title: '모바일 체크인', right: '<span style="width:40px;display:block"></span>' })}
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

  function notFound() {
    return blocked(I.list, '예약을 찾을 수 없습니다', '현재 사용자 시점에서 확인할 수 없는 예약입니다.', `<a class="btn btn-line btn-block" href="#/reservations">나의 예약으로</a>`);
  }
  /* ---------------- router ---------------- */
  const routes = [
    [/^\/$/, viewHome],
    [/^\/reservations$/, viewList],
    [/^\/reservation\/([\w-]+)$/, viewDetail],
    [/^\/checkin\/([\w-]+)$/, viewCheckin],
    [/^\/key\/([\w-]+)$/, viewKey]
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
    const m = path.match(/^\/(checkin|key)\/([\w-]+)$/);
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
      S.persona = el.dataset.v; save(); closeOverlay(); ui.tab = 'upcoming';
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
      localStorage.removeItem(STORE); S = initialState(); ui.ci = null; ui.key = null; ui.tab = 'upcoming';
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
    approach: () => approach()
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
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.innerHTML) closeOverlay(); });
  window.addEventListener('hashchange', () => { navs++; closeOverlay(); render(); });

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
