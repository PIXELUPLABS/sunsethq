/* ────────────────────────────────────────────────────────────────────────────
   Replay — de-identification pass
   Raw business records drift down a tilted plane, pass beneath the
   de-identification layer, and come out redacted in the register below.

   Framework-free on purpose: this is one imperative scene driven by a single
   requestAnimationFrame loop, so React never re-renders any of it. Mount it
   once, keep the returned teardown.

   Every tunable lives in CONFIG at the top.
   ──────────────────────────────────────────────────────────────────────────── */

type Slot = {
  slot: HTMLElement; bar: HTMLElement; strip: HTMLElement;
  x0: number; w: number;
};

type Row = {
  el: HTMLElement; slots: Slot[]; yPlane: number;
  sig: string | null; key: string; jit: number[];
};

type FragType = {
  id: string; f: string; ar: number;
  src: string; kind: string; g: string; sig: string; col: string;
  ws?: number;
  /* filled in at mount, once the label has been measured */
  html?: string; tw?: number; th?: number; sh?: number;
};

type Dom = { el: HTMLElement; elB: HTMLElement; tag: HTMLElement; path: SVGPathElement };

type Frag = Dom & {
  type: FragType; w: number; h: number; x: number; t0: number;
  side: number; life: number; rot: number; phase: number; seed: number;
  froze: { tagX: number; tagY: number; curY: number; rx: number; ry: number; t: number } | null;
  noTag: boolean; tagOp: number; tagLive: boolean; lastOp: number; lastCut: number;
  cy?: number;
};

/** Loose material in the stream: pattern swatches, stray redactions, marks. */
type Mote = {
  el: HTMLElement; kind: string; w: number; h: number; x: number;
  t0: number; life: number; rot: number; phase: number; peak: number;
  lastOp: number; lastBlur: number;
};

export type DeidPassOptions = {
  /** Public path holding the fragment webp files. No trailing slash. */
  assetBase?: string;
};

/**
 * Builds the scene inside `root` and starts it.
 * @returns teardown — stops the loop, drops observers and empties the scene.
 */
export function mountDeidPass(root: HTMLElement, opts: DeidPassOptions = {}): () => void {
  const BASE = opts.assetBase ?? '/replay/deid';
  let io: IntersectionObserver | null = null;
  let onVis: (() => void) | null = null;
  let onMove: ((e: PointerEvent) => void) | null = null;
  let onLeave: (() => void) | null = null;

  /* ============================================================
     CONFIG - every tunable in one place
     ============================================================ */
  const CONFIG = {
    /* camera: ground plane, far edge at the TOP, near edge at the bottom */
    persp: 900,
    tilt: 58,
    originY: 445,          // scene y where plane-local y = 0 (the sheet's near edge)
    sceneW: 1440,
    sceneH: 520,
    minScale: 0.5,

    /* sheet, in plane units */
    sheetFarY: -900,
    sheetNearY: 0,
    sheetW: 1220,
    sheetPadX: 62,
    rowCount: 26,
    rowBase: 14,           // bar height at the near edge
    compensate: 0.3,       // 0 = pure perspective, 1 = even bar heights on screen

    /* fragments: screen-offset units from originY */
    startS: -362,          // fades in on the paper, behind the sheet's far edge
    dipS:  -256,           // passes under the de-identification layer's far edge
    endS:    60,           // the redaction pass retires at the near edge
    life: 16.0,
    spawnEvery: 1.5,
    moteEvery: 1.05,       // loose material arrives a little faster than the records
    cardW: [620, 900],      // plane px, before each asset's text-size normalisation
    cardFlatten: [0.46, 0.72], // extra vertical squash range, to match the artboard's slabs
    passBand: 200,         // plane px of register a pass redacts at once
    fadeIn: 0.05,
    dipFade: 172,           // screen px over which a fragment is absorbed
    frost: 17,             // blur applied to the part of a fragment under the sheet

    /* flourishes */
    tagHold: 2.3,          // s a callout stays up once placed
    scanEvery: 12.0, scanDur: 3.6,
    parallax: 7, parallaxTilt: 0.9,
    float: 3.0,
    easeIn: 0.62,          // <1 = slower entry, quicker absorption
    seed: 20260918
  };

  /* ============================================================
     FRAGMENT TYPES
     ============================================================ */
  const COL = { blue:'#499DF8', sky:'#13A8FF', yellow:'#EAE058', olive:'#54702F' };
  const SIG: Record<string, number[]> = {
    chat:   [.06,.20,.04,.11,.15,.09],
    table:  [.09,.09,.09,.09,.09,.09,.09,.09],
    doc:    [.26,.19,.12,.22,.09],
    code:   [.05,.16,.10,.20,.07,.13],
    form:   [.13,.08,.19,.10,.16,.07],
    ledger: [.06,.23,.05,.15,.10,.18]
  };
  /* Remix Icon glyphs (Apache-2.0), path data verbatim from the package - the
     artifact CSP blocks remixicon's own stylesheet, so they are inlined. Filled
     variants throughout, as in the Figma labels, except git-repository,
     qr-scan and bar-chart-box, whose fills collapse at 14px. */
  const INK = '#3d3d3d';
  const G = (v: string) => `<svg viewBox="0 0 24 24" fill="${INK}">${v}</svg>`;
  const GLYPH: Record<string, string> = {
    doc:    G(`<path d="M3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.5 7.5H12.5C12.5 9.98994 14.6436 12.6604 17.3162 13.5513L16.8586 15.49C13.7234 15.0421 10.4821 16.3804 7.5547 18.3321L6.3753 16.7191C7.46149 15.8502 8.50293 14.3757 9.27499 12.6534C10.0443 10.9373 10.5 9.07749 10.5 7.5ZM11.1 13.4716C11.3673 12.8752 11.6043 12.2563 11.8037 11.6285C12.2754 12.3531 12.8553 13.0182 13.5102 13.5953C12.5284 13.7711 11.5666 14.0596 10.6353 14.4276C10.8 14.1143 10.9551 13.7948 11.1 13.4716Z"/>`),
    mail:   G(`<path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM12.0606 11.6829L5.64722 6.2377L4.35278 7.7623L12.0731 14.3171L19.6544 7.75616L18.3456 6.24384L12.0606 11.6829Z"/>`),
    table:  G(`<path d="M15 21H9V10H15V21ZM17 21V10H22V20C22 20.5523 21.5523 21 21 21H17ZM7 21H3C2.44772 21 2 20.5523 2 20V10H7V21ZM22 8H2V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V8Z"/>`),
    sheet:  G(`<path d="M2.85858 2.87732L15.4293 1.0815C15.7027 1.04245 15.9559 1.2324 15.995 1.50577C15.9983 1.52919 16 1.55282 16 1.57648V22.4235C16 22.6996 15.7761 22.9235 15.5 22.9235C15.4763 22.9235 15.4527 22.9218 15.4293 22.9184L2.85858 21.1226C2.36593 21.0522 2 20.6303 2 20.1327V3.86727C2 3.36962 2.36593 2.9477 2.85858 2.87732ZM17 2.99997H21C21.5523 2.99997 22 3.44769 22 3.99997V20C22 20.5523 21.5523 21 21 21H17V2.99997ZM10.2 12L13 7.99997H10.6L9 10.2857L7.39999 7.99997H5L7.8 12L5 16H7.39999L9 13.7143L10.6 16H13L10.2 12Z"/>`),
    code:   G(`<path d="M13 21V23.5L10 21.5L7 23.5V21H6.5C4.567 21 3 19.433 3 17.5V5C3 3.34315 4.34315 2 6 2H20C20.5523 2 21 2.44772 21 3V20C21 20.5523 20.5523 21 20 21H13ZM13 19H19V16H6.5C5.67157 16 5 16.6716 5 17.5C5 18.3284 5.67157 19 6.5 19H7V17H13V19ZM19 14V4H6V14.0354C6.1633 14.0121 6.33024 14 6.5 14H19ZM7 5H9V7H7V5ZM7 8H9V10H7V8ZM7 11H9V13H7V11Z"/>`),
    scan:   G(`<path d="M15 3H21V8H19V5H15V3ZM9 3V5H5V8H3V3H9ZM15 21V19H19V16H21V21H15ZM9 21H3V16H5V19H9V21ZM3 11H21V13H3V11Z"/>`),
    video:  G(`<path d="M6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM14 10.25V8H7V14H14V11.75L17 14V8L14 10.25Z"/>`),
    chat:   G(`<path d="M6.52739 14.5136C6.52739 15.5966 5.64264 16.4814 4.55959 16.4814C3.47654 16.4814 2.5918 15.5966 2.5918 14.5136C2.5918 13.4305 3.47654 12.5458 4.55959 12.5458H6.52739V14.5136ZM7.51892 14.5136C7.51892 13.4305 8.40366 12.5458 9.48671 12.5458C10.5698 12.5458 11.4545 13.4305 11.4545 14.5136V19.4407C11.4545 20.5238 10.5698 21.4085 9.48671 21.4085C8.40366 21.4085 7.51892 20.5238 7.51892 19.4407V14.5136ZM9.48671 6.52715C8.40366 6.52715 7.51892 5.6424 7.51892 4.55935C7.51892 3.4763 8.40366 2.59155 9.48671 2.59155C10.5698 2.59155 11.4545 3.4763 11.4545 4.55935V6.52715H9.48671ZM9.48671 7.51867C10.5698 7.51867 11.4545 8.40342 11.4545 9.48647C11.4545 10.5695 10.5698 11.4543 9.48671 11.4543H4.55959C3.47654 11.4543 2.5918 10.5695 2.5918 9.48647C2.5918 8.40342 3.47654 7.51867 4.55959 7.51867H9.48671ZM17.4732 9.48647C17.4732 8.40342 18.3579 7.51867 19.4409 7.51867C20.524 7.51867 21.4087 8.40342 21.4087 9.48647C21.4087 10.5695 20.524 11.4543 19.4409 11.4543H17.4732V9.48647ZM16.4816 9.48647C16.4816 10.5695 15.5969 11.4543 14.5138 11.4543C13.4308 11.4543 12.546 10.5695 12.546 9.48647V4.55935C12.546 3.4763 13.4308 2.59155 14.5138 2.59155C15.5969 2.59155 16.4816 3.4763 16.4816 4.55935V9.48647ZM14.5138 17.4729C15.5969 17.4729 16.4816 18.3577 16.4816 19.4407C16.4816 20.5238 15.5969 21.4085 14.5138 21.4085C13.4308 21.4085 12.546 20.5238 12.546 19.4407V17.4729H14.5138ZM14.5138 16.4814C13.4308 16.4814 12.546 15.5966 12.546 14.5136C12.546 13.4305 13.4308 12.5458 14.5138 12.5458H19.4409C20.524 12.5458 21.4087 13.4305 21.4087 14.5136C21.4087 15.5966 20.524 16.4814 19.4409 16.4814H14.5138Z"/>`),
    task:   G(`<path d="M21 3V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H20C20.5523 2 21 2.44772 21 3ZM11.2929 13.1213L8.81802 10.6464L7.40381 12.0607L11.2929 15.9497L16.9497 10.2929L15.5355 8.87868L11.2929 13.1213Z"/>`),
    chart:  G(`<path d="M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM4 5V19H20V5H4ZM7 13H9V17H7V13ZM11 7H13V17H11V7ZM15 10H17V17H15V10Z"/>`)
  };
  const TYPES: FragType[] = [
    { id:'r13', f:`${BASE}/r13.webp`, ar:505/880, src:'SLACK', kind:'Thread', g:'chat', sig:'chat', col:COL.sky, ws:1.06 },
    { id:'d5', f:`${BASE}/d5.webp`, ar:228/880, src:'SLACK', kind:'Message', g:'chat', sig:'chat', col:COL.sky, ws:0.65 },
    { id:'r11', f:`${BASE}/r11.webp`, ar:505/880, src:'EMAIL', kind:'Thread', g:'mail', sig:'doc', col:COL.blue, ws:1.06 },
    { id:'r5', f:`${BASE}/r5.webp`, ar:412/880, src:'EMAIL', kind:'Planning thread', g:'mail', sig:'doc', col:COL.yellow, ws:1.00 },
    { id:'d6', f:`${BASE}/d6.webp`, ar:304/880, src:'EMAIL', kind:'Inbox', g:'mail', sig:'table', col:COL.blue, ws:0.77 },
    { id:'r6', f:`${BASE}/r6.webp`, ar:412/880, src:'MEETING', kind:'Transcript', g:'video', sig:'chat', col:COL.olive, ws:1.31 },
    { id:'d1', f:`${BASE}/d1.webp`, ar:315/880, src:'JIRA', kind:'Issue list', g:'task', sig:'table', col:COL.sky, ws:0.82 },
    { id:'d3', f:`${BASE}/d3.webp`, ar:480/880, src:'PDF', kind:'Data agreement', g:'doc', sig:'doc', col:COL.olive, ws:0.85 },
    { id:'r3', f:`${BASE}/r3.webp`, ar:499/880, src:'CSV', kind:'Customer orders', g:'table', sig:'table', col:COL.yellow, ws:1.16 },
    { id:'r10', f:`${BASE}/r10.webp`, ar:437/880, src:'XLSX', kind:'Orders report', g:'sheet', sig:'table', col:COL.yellow, ws:1.20 },
    { id:'d2', f:`${BASE}/d2.webp`, ar:842/880, src:'DASHBOARD', kind:'Product usage', g:'chart', sig:'form', col:COL.blue, ws:0.65 },
    { id:'d4', f:`${BASE}/d4.webp`, ar:831/880, src:'DASHBOARD', kind:'Usage report', g:'chart', sig:'form', col:COL.olive, ws:0.65 },
    { id:'r4', f:`${BASE}/r4.webp`, ar:248/880, src:'REPO', kind:'Source file', g:'code', sig:'code', col:COL.olive, ws:0.55 }
  ];

  /* ============================================================
     camera maths. plane-local (x,y) -> screen offset, and scale f.
     tilt is positive, so y > 0 comes toward the viewer and magnifies.
     ============================================================ */
  const RAD = CONFIG.tilt*Math.PI/180, COS = Math.cos(RAD), SIN = Math.sin(RAD), D = CONFIG.persp;
  const INV_COS = (1/COS).toFixed(4);   // undo the plane's foreshortening on flat type
  const fOf = (y: number) => D / (D - y*SIN);
  const sOf = (y: number) => y*COS*fOf(y);
  const yOf = (s: number) => (D*s) / (COS*D + s*SIN);

  function mulberry32(a: number){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
  const rnd = mulberry32(CONFIG.seed);
  const lerp = (a: number, b: number, t: number) => a+(b-a)*t;
  const clamp = (v: number, a: number, b: number) => (v<a?a:v>b?b:v);

  /* ============================================================
     DOM
     ============================================================ */
  const q = (sel: string) => root.querySelector(sel) as HTMLElement;
  const frame      = root;
  const scene      = q('.scene');
  const planeMotes = q('.plane-motes');
  const planeUnder = q('.plane-cards');
  const planeSheet = q('.plane-sheet');
  const callouts   = q('.callouts');
  const leaders    = root.querySelector('.leaders') as unknown as SVGSVGElement;
  const planes = [planeMotes, planeUnder, planeSheet];

  planes.forEach(p => { p.style.left='50%'; p.style.top = CONFIG.originY+'px'; });
  root.querySelectorAll<HTMLElement>('.layer').forEach(l => {
    l.style.perspective = CONFIG.persp+'px';
    l.style.perspectiveOrigin = `50% ${CONFIG.originY}px`;
  });
  leaders.setAttribute('viewBox', `0 0 ${CONFIG.sceneW} ${CONFIG.sceneH}`);
  function setTilt(adj: number){ const t = `rotateX(${CONFIG.tilt + adj}deg)`; planes.forEach(p => p.style.transform = t); }
  setTilt(0);

  /* ---------- sheet ---------- */
  const SY0 = CONFIG.sheetFarY, SY1 = CONFIG.sheetNearY, SH = SY1 - SY0;
  const SHEET_HALF = CONFIG.sheetW/2;
  const contentW = CONFIG.sheetW - CONFIG.sheetPadX*2;
  const sheet = document.createElement('div');
  sheet.className = 'sheet';
  sheet.style.cssText = `left:${-CONFIG.sheetW/2}px;top:${SY0}px;width:${CONFIG.sheetW}px;height:${SH}px;`;
  sheet.innerHTML = '<div class="glass"></div>';
  planeSheet.appendChild(sheet);

  [[0.46,.055,42],[0.68,.1,64]].forEach(([w,op,top]) => {
    const b=document.createElement('div'); b.className='hdr';
    b.style.cssText=`left:${CONFIG.sheetPadX}px;top:${top}px;width:${contentW*w}px;height:13px;background:rgba(0,0,0,${op});`;
    sheet.appendChild(b);
  });

  /* rows */
  const rows: Row[] = [];
  const R_TOP = 104, R_BOT = SH - 40;
  for (let i=0;i<CONFIG.rowCount;i++){
    const u = i/(CONFIG.rowCount-1);
    const yFlat = lerp(R_TOP, R_BOT, u);
    const yEven = yOf(lerp(sOf(SY0+R_TOP), sOf(SY0+R_BOT), u)) - SY0;
    const yLocal = lerp(yFlat, yEven, CONFIG.compensate);
    const f = fOf(SY0 + yLocal);
    const h = CONFIG.rowBase * (1 + CONFIG.compensate*(1/f - 1));

    const el = document.createElement('div');
    el.className = 'row';
    el.style.cssText = `top:${yLocal}px;height:${h}px;width:${CONFIG.sheetW}px;--r:${(h*0.3).toFixed(1)}px;`;
    const slots: Slot[] = [];
    for (let k=0;k<8;k++){
      const slot=document.createElement('div'); slot.className='slot';
      const bar=document.createElement('div'); bar.className='bar';
      const strip=document.createElement('div'); strip.className='strip';
      slot.append(bar,strip); el.appendChild(slot);
      slots.push({slot,bar,strip,x0:0,w:0});
    }
    sheet.appendChild(el);
    rows.push({ el, slots, yPlane: SY0 + yLocal + h/2, sig:null, key:'',
                jit:[rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd(),rnd()] });
  }

  function applySig(row: Row, sigName: string){
    const sig = SIG[sigName], j = row.jit, gap = 14;
    /* normalise so every row spans the full content width */
    let raw = 0;
    for (let k=0;k<sig.length;k++) raw += sig[k]*(0.84 + 0.32*j[k]);
    const norm = (1 - (sig.length-1)*gap/contentW) / raw;
    let x = CONFIG.sheetPadX;
    row.slots.forEach((s: Slot, k: number) => {
      if (k >= sig.length){ s.slot.style.width='0px'; s.bar.style.opacity='0'; s.strip.classList.remove('on'); s.w=0; return; }
      const w = contentW * sig[k] * (0.84 + 0.32*j[k]) * norm;
      s.x0 = x; s.w = w;
      s.slot.style.left = x+'px';
      s.slot.style.width = w+'px';
      s.bar.style.opacity = '1';
      s.bar.style.background = `rgba(0,0,0,${[0.13,0.2,0.27,0.26,0.18,0.23,0.15,0.24][k]})`;
      /* a redaction covers its whole pill; only the lining's phase varies */
      s.strip.style.setProperty('--hx', (-j[(k+1)%8]*500).toFixed(0)+'px');
      s.strip.style.setProperty('--d', (0.26 + w/contentW*0.55).toFixed(2)+'s');
      x += w + gap;
    });
    row.sig = sigName;
  }
  rows.forEach((row,i) => applySig(row, ['table','doc','chat','ledger','table','form'][i%6]));

  const scan = document.createElement('div'); scan.className='scan'; sheet.appendChild(scan);
  const veil = document.createElement('div'); veil.className='veil';
  veil.style.height = (SH*0.24)+'px'; sheet.appendChild(veil);
  const stroke = document.createElement('div'); stroke.className='stroke'; sheet.appendChild(stroke);


  /* ============================================================
     fragments
     ============================================================ */
  const cards: Frag[] = [];
  let bag: number[] = [];
  function nextType(){
    if (!bag.length){ bag = TYPES.map((t,i)=>i); for(let i=bag.length-1;i>0;i--){const j=(rnd()*(i+1))|0;[bag[i],bag[j]]=[bag[j],bag[i]];} }
    return TYPES[bag.pop() as number];
  }

  /* Measure each label once, up front, and decode every fragment up front too.
     Both used to happen on spawn, which meant a forced reflow and an image decode
     every couple of seconds - the hitch that showed up mid-run. */
  TYPES.forEach((t: FragType) => {
    t.html = `<span class="src">${GLYPH[t.g]}${t.src}</span><span class="kind">${t.kind}</span>`;
    const im = new Image(); im.src = t.f;
  });
  const probe = document.createElement('div');
  probe.className = 'tag';
  probe.style.cssText = 'visibility:hidden;position:absolute;left:-9999px;top:0';
  callouts.appendChild(probe);
  function measureLabels(){
    TYPES.forEach((t: FragType) => { probe.innerHTML = t.html ?? '';
      t.tw = probe.offsetWidth; t.th = probe.offsetHeight;
      t.sh = (probe.querySelector('.src') as HTMLElement).offsetHeight; });
  }
  measureLabels();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureLabels);

  /* element pool - fragments are recycled rather than created and destroyed */
  const pool: Dom[] = [];
  function takeDom(){
    if (pool.length) return pool.pop() as Dom;
    const el = document.createElement('div'); el.className = 'card'; planeUnder.appendChild(el);
    const elB = document.createElement('div'); elB.className = 'card'; planeUnder.appendChild(elB);
    const tag = document.createElement('div'); tag.className = 'tag'; callouts.appendChild(tag);
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('pathLength','1'); leaders.appendChild(path);
    return { el, elB, tag, path };
  }
  function releaseDom(c: Frag){
    c.el.style.opacity = '0'; c.el.style.filter = 'none';
    c.elB.style.opacity = '0';
    c.tag.style.opacity = '0'; c.tag.classList.remove('in');
    c.path.style.opacity = '0'; c.path.classList.remove('in');
    c.path.removeAttribute('transform'); c.path.removeAttribute('d');
    pool.push({ el:c.el, elB:c.elB, tag:c.tag, path:c.path });
  }

  let lastX = 0;
  function spawn(t0: number){
    const type = nextType();
    const w = lerp(CONFIG.cardW[0], CONFIG.cardW[1], rnd()) * (type.ws || 1);
    const h = w * type.ar * lerp(CONFIG.cardFlatten[0], CONFIG.cardFlatten[1], rnd());
    /* a tight spread so the fragments overlap into a stack rather than spreading out;
       only near-identical positions get nudged apart */
    let x = lerp(-325, 325, rnd());
    if (Math.abs(x - lastX) < 85) x = -x*0.92;
    lastX = x;

    const dom = takeDom();
    for (const e of [dom.el, dom.elB]){
      e.style.width = w+'px'; e.style.height = h+'px';
      e.style.backgroundImage = `url(${type.f})`;
    }
    dom.elB.style.filter = `blur(${CONFIG.frost}px) saturate(.9) brightness(1.05)`;
    dom.tag.innerHTML = type.html ?? '';

    cards.push({
      el:dom.el, elB:dom.elB, tag:dom.tag, path:dom.path, type, w, h, x, t0,
      side: x > 0 ? 1 : -1,
      life: CONFIG.life*(0.94+0.12*rnd()),
      rot: (rnd()-0.5)*2.6,
      phase: rnd()*Math.PI*2,
      seed: (rnd()*97)|0,
      froze: null, noTag: false, tagOp: 0, tagLive: false, lastOp:-1, lastCut:-9
    });
  }

  /* A callout is positioned and drawn once, then simply travels with its fragment:
     the elbow never rescales, and the side can never flip mid-life. */
  function freezeCallout(c: Frag, tx: number, ty: number){
    /* LS counter-scales the callout, so its type stays at the size it was set in.
       Its footprint in scene units therefore changes with the scale. */
    const tw = c.type.tw! * LS, th = c.type.th! * LS, sh = c.type.sh! * LS, GAP = 190, DROP = 30;
    const tagY = clamp(ty - DROP - th, 20, CONFIG.sceneH - 96);
    /* one callout at a time per side: if this side is busy, wait rather than stack.
       By the time the other clears, this fragment has moved on and the two never
       land on top of each other. */
    for (const o of cards){
      if (o !== c && o.froze && o.side === c.side && o.tagOp > 0.06
          && Math.abs(o.froze.curY - tagY) < 74) return false;
    }
    const tagX = c.side < 0
      ? clamp(tx - GAP - tw, 28, CONFIG.sceneW*0.5)
      : clamp(tx + GAP, CONFIG.sceneW*0.5, CONFIG.sceneW - 28 - tw);
    const ax = c.side < 0 ? tagX - 2 : tagX + tw + 2;
    const ay = tagY + sh + 6;   // the rule sits between the two lines
    /* a run under the label, then a 45 degree leg down to the fragment's corner */
    const v = Math.max(6, ty - ay);
    const bx = tx + c.side*v;
    c.path.setAttribute('d', `M${ax.toFixed(1)} ${ay.toFixed(1)} H${bx.toFixed(1)} L${tx.toFixed(1)} ${ty.toFixed(1)}`);
    const len = Math.abs(bx - ax) + Math.abs(v)*1.42;
    c.path.style.setProperty('--dl', (0.34 + len/900).toFixed(2)+'s');
    c.froze = { tagX, tagY, curY: tagY, rx: tx, ry: ty, t: T };
    c.tag.classList.add('in'); c.path.classList.add('in');
    return true;
  }


  /* ============================================================
     Loose material in the stream - pattern swatches, stray redactions,
     register marks and stamped words. Same flow as the fragments, painted
     behind them, no callouts. One element each, so they blur as a whole
     once under the sheet; at this size the edge bleed is invisible.
     ============================================================ */
  const WEAVE = `${BASE}/weave.webp`;
  const MOTE_WORDS = ['PROPRIETARY','LICENSING','CLASSIFICATION','OPERATIONAL','RETAINED','SOURCE RECORD'];
  const MOTE_KINDS: [string, number][] = [['weave',30],['pills',20],['strip',18],['mono',16],['dot',12]];
  const MOTE_TOTAL = MOTE_KINDS.reduce((a,k)=>a+k[1],0);
  function pickMote(){
    let r = rnd()*MOTE_TOTAL;
    for (const [k,wt] of MOTE_KINDS){ if ((r -= wt) <= 0) return k; }
    return 'weave';
  }

  const motes: Mote[] = [];
  const motePool: HTMLElement[] = [];
  function spawnMote(t0: number){
    const kind = pickMote();
    const el = motePool.pop() || (() => {
      const e = document.createElement('div'); e.className = 'mote'; planeMotes.appendChild(e); return e;
    })();
    el.style.cssText = ''; el.className = 'mote'; el.replaceChildren();

    let w, h;
    if (kind === 'weave'){
      w = lerp(170, 360, rnd()); h = w * lerp(0.7, 1.7, rnd());
      el.classList.add('mote-weave');
      el.style.backgroundImage = `url(${WEAVE})`;
      el.style.backgroundPosition = `${(rnd()*420).toFixed(0)}px ${(rnd()*315).toFixed(0)}px`;
      el.style.opacity = '0';
      el.dataset.op = (0.26 + 0.2*rnd()).toFixed(2);   // barely there; it is texture, not content
    } else if (kind === 'strip'){
      w = lerp(70, 230, rnd()); h = lerp(13, 19, rnd());
      const cols = [COL.blue, COL.sky, COL.yellow, COL.olive];
      el.classList.add('mote-strip');
      el.style.background = cols[(rnd()*cols.length)|0];
      el.style.setProperty('--hx', (-rnd()*500).toFixed(0)+'px');
      el.dataset.op = '0.85';
    } else if (kind === 'dot'){
      w = h = lerp(14, 30, rnd());
      el.classList.add('mote-dot');
      el.dataset.op = '1';
    } else if (kind === 'pills'){
      const n = 2 + ((rnd()*3)|0), ph = 9, gap = 13;
      w = lerp(80, 190, rnd()); h = n*ph + (n-1)*(gap-ph);
      el.style.setProperty('--r', (ph*0.3).toFixed(1)+'px');
      for (let i=0;i<n;i++){
        const b = document.createElement('div'); b.className = 'mote-pill';
        b.style.cssText = `top:${i*gap}px;width:${(w*(0.45+0.55*rnd())).toFixed(0)}px;height:${ph}px;`;
        el.appendChild(b);
      }
      el.dataset.op = '1';
    } else {
      const n = 3 + ((rnd()*5)|0);
      const inner = document.createElement('div');
      inner.className = 'mote-mono';
      inner.style.transform = `scaleY(${INV_COS})`;
      inner.style.transformOrigin = '0 0';
      inner.textContent = Array.from({length:n}, () => MOTE_WORDS[(rnd()*MOTE_WORDS.length)|0]).join('\n');
      el.appendChild(inner);
      w = 300; h = n*19*1.3*1.886;
      el.dataset.op = '1';
    }
    el.style.width = w+'px'; el.style.height = h+'px';

    motes.push({
      el, kind, w, h,
      x: lerp(-430, 430, rnd()),
      t0, life: CONFIG.life*(0.94+0.12*rnd()),
      rot: (rnd()-0.5)*3,
      phase: rnd()*Math.PI*2,
      peak: parseFloat(el.dataset.op),
      lastOp: -1, lastBlur: -1
    });
  }

  function updateMotes(){
    for (let i=motes.length-1;i>=0;i--){
      const m = motes[i];
      const p = (T - m.t0)/m.life;
      if (p >= 1){
        m.el.style.opacity = '0'; m.el.style.filter = 'none';
        motePool.push(m.el); motes.splice(i,1); continue;
      }
      const g = CONFIG.easeIn*p + (1-CONFIG.easeIn)*Math.pow(p,1.5);
      const sOff = lerp(CONFIG.startS, CONFIG.endS, g);
      const y = yOf(sOff) + Math.sin(T*0.4 + m.phase)*CONFIG.float;
      m.el.style.transform = `translate3d(${m.x}px,${y}px,0) rotate(${m.rot}deg) translate(-50%,-50%)`;

      /* loose material never goes under the sheet: it fades out at the far edge,
         so none of it needs the frost split and nothing spills past the trapezoid */
      const gone = clamp((sOff - (CONFIG.dipS - 46))/64, 0, 1);
      const inRaw = clamp(p/CONFIG.fadeIn, 0, 1);
      const op = (1 - Math.pow(1 - inRaw, 3)) * (1 - gone) * m.peak;
      if (Math.abs(op - m.lastOp) > 0.01){ m.el.style.opacity = op.toFixed(3); m.lastOp = op; }
      const blur = (1-inRaw)*5;
      if (Math.abs(blur - m.lastBlur) > 0.4){
        m.el.style.filter = blur > 0.4 ? `blur(${blur.toFixed(1)}px)` : 'none';
        m.lastBlur = blur;
      }
    }
  }

  /* ============================================================
     loop
     ============================================================ */
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let T=0, nextSpawnAt=0, nextMoteAt=0, last=0, running=false, raf=0, SCALE=1, LS=1;
  let px=0, py=0, tx=0, ty=0;

  function updateCards(){
    for (let i=cards.length-1;i>=0;i--){
      const c = cards[i];
      const p = (T - c.t0)/c.life;
      if (p >= 1){ releaseDom(c); cards.splice(i,1); continue; }

      const g = CONFIG.easeIn*p + (1-CONFIG.easeIn)*Math.pow(p,1.5);
      const sOff = lerp(CONFIG.startS, CONFIG.endS, g);
      const y = yOf(sOff) + Math.sin(T*0.4 + c.phase)*CONFIG.float;
      c.cy = y;

      const tf = `translate3d(${c.x}px,${y}px,0) rotate(${c.rot}deg) translate(-50%,-50%)`;
      c.el.style.transform = tf;
      c.elB.style.transform = tf;

      const absorbed = clamp((sOff - CONFIG.dipS)/CONFIG.dipFade, 0, 1);
      const inRaw = clamp(p/CONFIG.fadeIn, 0, 1);
      const inFade = 1 - Math.pow(1 - inRaw, 3);
      const op = inFade * Math.pow(1 - absorbed, 1.2);
      if (Math.abs(op - c.lastOp) > 0.008){
        c.el.style.opacity = op.toFixed(3);
        c.elB.style.opacity = op.toFixed(3);
        c.lastOp = op;
      }

      /* The frosted copy is clipped to the sheet's own rectangle - in plane space
         that is just x within +/- sheetW/2 and y between its two edges - so blurred
         material never spills past the trapezoid onto bare paper. The sharp copy
         gets the complement: the card with that rectangle punched out of it. */
      const t = clamp((CONFIG.sheetFarY - (y - c.h/2)) / c.h, 0, 1);
      const b = clamp(((y + c.h/2) - CONFIG.sheetNearY) / c.h, 0, 1);
      const l = clamp((-SHEET_HALF - (c.x - c.w/2)) / c.w, 0, 1);
      const r = clamp(((c.x + c.w/2) - SHEET_HALF) / c.w, 0, 1);
      const key = t + b*2 + l*4 + r*8;
      if (Math.abs(key - c.lastCut) > 0.004){
        const T = (t*100).toFixed(2), B = ((1-b)*100).toFixed(2),
              L = (l*100).toFixed(2), R = ((1-r)*100).toFixed(2);
        const covered = t + b >= 1 || l + r >= 1;          // no overlap with the sheet
        const buried  = t <= 0.001 && b <= 0.001 && l <= 0.001 && r <= 0.001;
        c.elB.style.clipPath = covered ? 'none'
          : `inset(${T}% ${(r*100).toFixed(2)}% ${(b*100).toFixed(2)}% ${L}%)`;
        c.el.style.clipPath = (covered || buried) ? 'none'
          /* outer ring clockwise, inner ring counter-clockwise: a hole */
          : `polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%,` +
            ` ${L}% ${T}%, ${L}% ${B}%, ${R}% ${B}%, ${R}% ${T}%, ${L}% ${T}%, 0% 0%)`;
        c.el.style.visibility  = buried ? 'hidden' : 'visible';
        c.elB.style.visibility = covered ? 'hidden' : 'visible';
        c.lastCut = key;
      }

      /* callout anchors on the fragment's outer top corner. Project that corner
         directly - a linear guess from the centre lands well short, because the far
         half of a fragment is foreshortened harder than the near half. */
      const yTop = y - c.h/2, fTop = fOf(yTop);
      const tx = CONFIG.sceneW/2 + (c.x + c.side*c.w*0.5)*fTop;
      const ty = CONFIG.originY + sOf(yTop);
      /* a callout holds for a fixed beat after it is placed, so it only ever travels
         a short way with its fragment - and always retires before the fragment dips */
      const tagOp = (c.froze ? 1 - clamp((T - c.froze.t - CONFIG.tagHold)/0.38, 0, 1) : inFade)
                  * (1 - clamp((sOff - CONFIG.dipS + 14)/40, 0, 1));
      c.tagOp = tagOp;

      if (!c.froze && !c.noTag && tagOp > 0.4 && ty > 92){
        if (ty > 152) c.noTag = true;          // too late to place one cleanly
        else freezeCallout(c, tx, ty);         // may decline; retried next frame
      }
      if (c.froze && (tagOp > 0.015 || c.tagLive)){
        const live = tagOp > 0.015;
        const dx = tx - c.froze.rx, dy = ty - c.froze.ry;
        c.froze.curY = c.froze.tagY + dy;
        if (live){
          c.tag.style.transform = `translate3d(${(c.froze.tagX+dx).toFixed(1)}px,${(c.froze.tagY+dy).toFixed(1)}px,0) scale(${LS})`;
          c.path.setAttribute('transform', `translate(${dx.toFixed(1)} ${dy.toFixed(1)})`);
        }
        c.tag.style.opacity = tagOp.toFixed(3);
        c.path.style.opacity = (tagOp*0.9).toFixed(3);
        c.tagLive = live;   // one last write at zero, then leave them alone
      }
    }
  }

  /* the register reacts to whatever is passing beneath it - including a pass
     whose fragment has already been absorbed, so the redaction keeps travelling */
  function updateRegister(){
    let budget = 2;   // rows allowed to recompose this frame, so a new pass ripples
    for (let r=0;r<rows.length;r++){
      const row = rows[r];
      let best=null, bestW=0;
      for (let i=0;i<cards.length;i++){
        const c = cards[i];
        if (c.cy === undefined) continue;
        const half = Math.min(c.h, CONFIG.passBand)*0.5;
        if (row.yPlane < c.cy - half || row.yPlane > c.cy + half) continue;
        const weight = 1 - Math.abs(row.yPlane - c.cy)/half;
        if (weight > bestW){ bestW = weight; best = c; }
      }

      let key = '';
      if (best){
        const jx = (((r*37 + best.seed) % 100) - 50)/100 * best.w * 0.45;
        const cl = best.x + jx - best.w*0.34 + CONFIG.sheetW/2;
        const cr = best.x + jx + best.w*0.34 + CONFIG.sheetW/2;
        const cap = ((r*7 + best.seed) % 5) < 2 ? 1 + (((r + best.seed) % 3) === 0 ? 1 : 0) : 0;
        let lit = 0;
        key = best.type.id + '|';
        for (let k=0;k<row.slots.length;k++){
          const s = row.slots[k];
          const on = s.w > 0 && lit < cap && s.x0 + s.w > cl - 10 && s.x0 < cr + 10;
          if (on) lit++;
          key += on ? '1' : '0';
        }
      }
      if (key === row.key) continue;
      row.key = key;

      if (best){
        if (row.sig !== best.type.sig){
          if (budget <= 0){ row.key = ''; continue; }   // retry next frame
          budget--;
          applySig(row, best.type.sig);
        }
        let n = 0;
        for (let k=0;k<row.slots.length;k++){
          const s = row.slots[k];
          if (key[best.type.id.length+1+k] === '1'){
            s.strip.style.background = best.type.col;
            s.strip.style.transitionDelay = (n*55)+'ms';
            s.strip.classList.add('on'); n++;
          } else {
            s.strip.style.transitionDelay = '0ms';
            s.strip.classList.remove('on');
          }
        }
      } else {
        row.slots.forEach(s => { s.strip.style.transitionDelay='0ms'; s.strip.classList.remove('on'); });
      }
    }
  }

  function updateFlourish(){
    const a = (T % CONFIG.scanEvery)/CONFIG.scanDur;
    if (a <= 1){
      const e = a<.5 ? 2*a*a : 1-Math.pow(-2*a+2,2)/2;
      scan.style.top = lerp(90, SH-60, e)+'px';
      scan.style.opacity = (Math.sin(a*Math.PI)*0.45).toFixed(3);
    } else scan.style.opacity = '0';
  }

  function tick(now: number){
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.1,(now-last)/1000); last = now; T += dt;
    while (T > nextSpawnAt){ spawn(nextSpawnAt); nextSpawnAt += CONFIG.spawnEvery; }
    while (T > nextMoteAt){ spawnMote(nextMoteAt); nextMoteAt += CONFIG.moteEvery; }
    updateCards(); updateMotes(); updateRegister(); updateFlourish();
    px += (tx-px)*Math.min(1,dt*4); py += (ty-py)*Math.min(1,dt*4);
    scene.style.transform = `translate(${px*CONFIG.parallax}px,${py*CONFIG.parallax*0.5}px) scale(${SCALE})`;
    setTilt(-py*CONFIG.parallaxTilt);
  }

  function staticFrame(){
    [0.10,0.30,0.52,0.74].forEach(v => spawn(-v*CONFIG.life));
    [0.06,0.22,0.40,0.58,0.80].forEach(v => spawnMote(-v*CONFIG.life));
    T = 0.0001;
    updateCards(); updateMotes(); updateRegister();
  }

  function resize(){
    const w = frame.clientWidth;
    SCALE = Math.max(w/CONFIG.sceneW, CONFIG.minScale);
    /* never magnify the callout type past its authored size; let it shrink with
       the scene on narrow screens, where a fixed-size label would dominate */
    LS = 1/Math.max(SCALE, 1);
    scene.style.setProperty('--lw', clamp(1/SCALE, 0.5, 2).toFixed(3));
    frame.style.height = (CONFIG.sceneH*SCALE)+'px';
    scene.style.left = ((w - CONFIG.sceneW*SCALE)/2)+'px';
    scene.style.transform = `translate(${px*CONFIG.parallax}px,${py*CONFIG.parallax*0.5}px) scale(${SCALE})`;
  }
  const ro = new ResizeObserver(resize); ro.observe(frame);
  resize();

  function start(){ if (running||reduce) return; running=true; last=performance.now(); raf=requestAnimationFrame(tick); }
  function stop(){ if (!running) return; running=false; cancelAnimationFrame(raf); }

  if (reduce) staticFrame();
  else {
    io = new IntersectionObserver(es => (es[0].isIntersecting ? start() : stop()), {threshold:0.01});
    io.observe(frame);
    onVis = () => (document.hidden ? stop() : start());
    document.addEventListener('visibilitychange', onVis);
    onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const r = frame.getBoundingClientRect();
      tx = ((e.clientX-r.left)/r.width - .5)*2;
      ty = ((e.clientY-r.top)/r.height - .5)*2;
    };
    onLeave = () => { tx = 0; ty = 0; };
    frame.addEventListener('pointermove', onMove);
    frame.addEventListener('pointerleave', onLeave);
  }

  /* teardown: React calls this on unmount, and on every HMR edit in dev */
  return () => {
    stop();
    ro.disconnect();
    io?.disconnect();
    if (onVis) document.removeEventListener('visibilitychange', onVis);
    if (onMove) frame.removeEventListener('pointermove', onMove);
    if (onLeave) frame.removeEventListener('pointerleave', onLeave);
    planeMotes.replaceChildren();
    planeUnder.replaceChildren();
    planeSheet.replaceChildren();
    leaders.replaceChildren();
    callouts.querySelectorAll('.tag').forEach(n => n.remove());
    cards.length = 0; rows.length = 0; pool.length = 0;
    motes.length = 0; motePool.length = 0;
  };
}
