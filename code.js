// ═══════════════════════════════════════════════════════════════════════════
// MERIDIAN DESIGN SYSTEM — Figma Plugin v1.0
// Products: SparkRamp · StreamOps · ClarityMap  by Vlad
// Icons: Lucide (MIT License) | Fonts: Inter → swap to General Sans
// ═══════════════════════════════════════════════════════════════════════════

figma.showUI(__html__, { width: 440, height: 340, title: 'Meridian Design System' });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'start') {
    try {
      await run();
    } catch (e) {
      figma.ui.postMessage({ type: 'error', message: e.message });
      console.error(e);
    }
  }
  if (msg.type === 'cancel') figma.closePlugin();
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function toRgb(hex) {
  return {
    r: parseInt(hex.slice(1,3),16)/255,
    g: parseInt(hex.slice(3,5),16)/255,
    b: parseInt(hex.slice(5,7),16)/255,
  };
}

function solidPaint(hex, alpha = 1) {
  return [{ type: 'SOLID', color: toRgb(hex), opacity: alpha }];
}

function noPaint() { return []; }

function applyStroke(node, hex, weight = 1.5) {
  node.strokes = solidPaint(hex);
  node.strokeWeight = weight;
  node.strokeAlign = 'INSIDE';
}

function autoLayout(node, dir, gap, pTop, pBottom, pLeft, pRight) {
  node.layoutMode = dir || 'HORIZONTAL';
  node.itemSpacing = gap || 0;
  node.paddingTop    = pTop    || 0;
  node.paddingBottom = pBottom || 0;
  node.paddingLeft   = pLeft   || 0;
  node.paddingRight  = pRight  || 0;
  node.primaryAxisSizingMode  = 'AUTO';
  node.counterAxisSizingMode  = 'AUTO';
  node.primaryAxisAlignItems  = 'CENTER';
  node.counterAxisAlignItems  = 'CENTER';
}

function autoLayoutH(node, gap, pv, ph) {
  autoLayout(node, 'HORIZONTAL', gap, pv, pv, ph, ph);
}

function autoLayoutV(node, gap, pv, ph) {
  autoLayout(node, 'VERTICAL', gap, pv, pv, ph, ph);
}

function makeFrame(name, fills) {
  const f = figma.createFrame();
  f.name = name;
  f.fills = fills !== undefined ? fills : noPaint();
  return f;
}

function makeRect(name, w, h, hex, radius, alpha) {
  const r = figma.createRectangle();
  r.name = name;
  r.resize(w, h);
  r.fills = hex ? solidPaint(hex, alpha || 1) : noPaint();
  if (radius) r.cornerRadius = radius;
  return r;
}

function makeEllipse(name, size, hex, alpha) {
  const e = figma.createEllipse();
  e.name = name;
  e.resize(size, size);
  e.fills = hex ? solidPaint(hex, alpha || 1) : noPaint();
  return e;
}

async function makeText(chars, family, style, size, hex, alpha) {
  let resolvedStyle = style;
  try {
    await figma.loadFontAsync({ family, style });
  } catch(_) {
    // Try fallback style names (e.g. 'Semi Bold' vs 'SemiBold')
    const fallbacks = ['Regular', 'Medium', 'Bold'];
    let loaded = false;
    for (const fb of fallbacks) {
      try {
        await figma.loadFontAsync({ family, style: fb });
        resolvedStyle = fb;
        loaded = true;
        break;
      } catch(_) {}
    }
  }
  const t = figma.createText();
  t.fontName = { family, style: resolvedStyle };
  t.fontSize = size;
  t.characters = chars;
  t.fills = solidPaint(hex, alpha || 1);
  return t;
}

function makeLine(name, w, hex) {
  const l = figma.createLine();
  l.name = name;
  l.resize(w, 0);
  l.strokes = solidPaint(hex);
  l.strokeWeight = 1;
  return l;
}

// SVG vector from path data
function makeVector(name, pathData, w, h, hex) {
  const v = figma.createVector();
  v.name = name;
  v.vectorPaths = [{ windingRule: 'EVENODD', data: pathData }];
  v.resize(w, h);
  v.fills = solidPaint(hex);
  v.strokes = noPaint();
  return v;
}

// ═══════════════════════════════════════════════════════════════════════════
// DESIGN TOKENS
// ═══════════════════════════════════════════════════════════════════════════

const SHARED = {
  white:   '#FFFFFF',
  black:   '#000000',
  gray50:  '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  success: '#22C55E',
  warning: '#F59E0B',
  error:   '#EF4444',
  info:    '#3B82F6',
};

const THEMES = {
  spark: {
    key:       'spark',
    label:     'SparkRamp',
    emoji:     '🔥',
    primary:   '#E8572A',
    secondary: '#1A1A2E',
    accent:    '#F5A623',
    surface:   '#FAF7F4',
    muted:     '#8B8B9E',
  },
  stream: {
    key:       'stream',
    label:     'StreamOps',
    emoji:     '🌊',
    primary:   '#2A6BE8',
    secondary: '#0F1B2D',
    accent:    '#00D4AA',
    surface:   '#F4F7FA',
    muted:     '#7B8FA3',
  },
  clarity: {
    key:       'clarity',
    label:     'ClarityMap',
    emoji:     '🔮',
    primary:   '#7B2FD4',
    secondary: '#121218',
    accent:    '#00E5FF',
    surface:   '#F6F4FA',
    muted:     '#9490A8',
  },
};

// Font constants — swap these once you install the proper fonts:
// BASE_FONT → 'General Sans'   (Fontshare, free)
// BODY_FONT → 'Instrument Sans' (Google Fonts, free)
// MONO_FONT → 'JetBrains Mono' (JetBrains, free)
const BASE_FONT = 'Inter';
const BODY_FONT = 'Inter';
const MONO_FONT = 'Roboto Mono';

const RADIUS = { sm: 4, md: 6, lg: 8, xl: 12, xxl: 16, full: 9999 };

// ═══════════════════════════════════════════════════════════════════════════
// LOAD ALL FONTS
// ═══════════════════════════════════════════════════════════════════════════

async function loadFonts() {
  const combos = [
    [BASE_FONT, 'Regular'],
    [BASE_FONT, 'Medium'],
    [BASE_FONT, 'SemiBold'],
    [BASE_FONT, 'Bold'],
    [BODY_FONT, 'Regular'],
    [MONO_FONT, 'Regular'],
  ];
  for (const [family, style] of combos) {
    try { await figma.loadFontAsync({ family, style }); } catch(_) {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// CREATE FIGMA STYLES
// ═══════════════════════════════════════════════════════════════════════════

async function createColorStyles() {
  const entries = [
    ...Object.entries(SHARED).map(([k,v]) => [`Shared/${k}`, v]),
    ...Object.entries(THEMES.spark)
      .filter(([k]) => !['key','label','emoji'].includes(k))
      .map(([k,v]) => [`SparkRamp/${k}`, v]),
    ...Object.entries(THEMES.stream)
      .filter(([k]) => !['key','label','emoji'].includes(k))
      .map(([k,v]) => [`StreamOps/${k}`, v]),
    ...Object.entries(THEMES.clarity)
      .filter(([k]) => !['key','label','emoji'].includes(k))
      .map(([k,v]) => [`ClarityMap/${k}`, v]),
  ];
  for (const [name, hex] of entries) {
    const s = figma.createPaintStyle();
    s.name = name;
    s.paints = [{ type: 'SOLID', color: toRgb(hex) }];
  }
}

async function createTextStyles() {
  const scale = [
    ['Display/Large',  BASE_FONT, 'Bold',     72, 80],
    ['Display/Medium', BASE_FONT, 'Bold',     56, 64],
    ['Heading/H1',     BASE_FONT, 'Bold',     48, 56],
    ['Heading/H2',     BASE_FONT, 'Bold',     40, 48],
    ['Heading/H3',     BASE_FONT, 'SemiBold', 32, 40],
    ['Heading/H4',     BASE_FONT, 'SemiBold', 24, 32],
    ['Heading/H5',     BASE_FONT, 'Medium',   20, 28],
    ['Heading/H6',     BASE_FONT, 'Medium',   16, 24],
    ['Body/Large',     BODY_FONT, 'Regular',  20, 30],
    ['Body/Medium',    BODY_FONT, 'Regular',  16, 24],
    ['Body/Small',     BODY_FONT, 'Regular',  14, 20],
    ['Label/Large',    BASE_FONT, 'Medium',   16, 24],
    ['Label/Medium',   BASE_FONT, 'Medium',   14, 20],
    ['Label/Small',    BASE_FONT, 'Medium',   12, 16],
    ['Caption',        BODY_FONT, 'Regular',  12, 16],
    ['Code/Regular',   MONO_FONT, 'Regular',  14, 20],
  ];
  for (const [name, family, style, sz, lh] of scale) {
    let resolvedStyle = style;
    try {
      await figma.loadFontAsync({ family, style });
    } catch(_) {
      const fallbacks = ['Regular', 'Medium', 'Bold'];
      for (const fb of fallbacks) {
        try { await figma.loadFontAsync({ family, style: fb }); resolvedStyle = fb; break; } catch(_) {}
      }
    }
    try {
      const ts = figma.createTextStyle();
      ts.name = name;
      ts.fontName = { family, style: resolvedStyle };
      ts.fontSize = sz;
      ts.lineHeight = { value: lh, unit: 'PIXELS' };
    } catch(_) {}
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

// Shared helper: wrap variants in a component set
async function makeSet(setName, page, variantBuilders) {
  const comps = [];
  for (const [vName, buildFn] of variantBuilders) {
    const c = figma.createComponent();
    c.name = vName;
    page.appendChild(c);
    await buildFn(c);
    comps.push(c);
  }
  const set = figma.combineAsVariants(comps, page);
  set.name = setName;
  set.fills = solidPaint(SHARED.gray100);
  return set;
}

// ── BUTTON ────────────────────────────────────────────────────────────────
async function buildButton(theme, page) {
  const types  = ['Primary', 'Secondary', 'Ghost', 'Destructive'];
  const states = ['Default', 'Hover', 'Disabled'];
  const variants = [];

  for (const type of types) {
    for (const state of states) {
      variants.push([`Type=${type}, State=${state}`, async (comp) => {
        autoLayoutH(comp, 8, 10, 20);
        comp.cornerRadius = RADIUS.md;
        comp.fills = noPaint();

        let bgHex, textHex, strokeHex;

        if (type === 'Primary') {
          bgHex   = state === 'Disabled' ? SHARED.gray300 : theme.primary;
          textHex = SHARED.white;
        } else if (type === 'Secondary') {
          bgHex    = SHARED.white;
          textHex  = state === 'Disabled' ? SHARED.gray400 : theme.primary;
          strokeHex = state === 'Disabled' ? SHARED.gray300 : theme.primary;
        } else if (type === 'Ghost') {
          bgHex   = state === 'Hover' ? theme.primary : null;
          textHex = state === 'Disabled' ? SHARED.gray400 : state === 'Hover' ? SHARED.white : theme.primary;
        } else if (type === 'Destructive') {
          bgHex   = state === 'Disabled' ? SHARED.gray300 : SHARED.error;
          textHex = SHARED.white;
        }

        if (bgHex) comp.fills = solidPaint(bgHex, type === 'Ghost' && state === 'Hover' ? 1 : 1);
        if (strokeHex) applyStroke(comp, strokeHex, 1.5);
        if (state === 'Disabled') comp.opacity = 0.55;

        const label = await makeText('Button', BASE_FONT, 'Medium', 14, textHex || SHARED.white);
        comp.appendChild(label);
      }]);
    }
  }

  // HasIcon variants — Primary, Secondary, Ghost with Default state
  const iconTypes = ['Primary', 'Secondary', 'Ghost'];
  for (const type of iconTypes) {
    variants.push([`HasIcon=True, Type=${type}, State=Default`, async (comp) => {
      autoLayoutH(comp, 8, 10, 20);
      comp.cornerRadius = RADIUS.md;
      comp.fills = noPaint();

      let bgHex, textHex, strokeHex;
      if (type === 'Primary') {
        bgHex   = theme.primary;
        textHex = SHARED.white;
      } else if (type === 'Secondary') {
        bgHex     = SHARED.white;
        textHex   = theme.primary;
        strokeHex = theme.primary;
      } else if (type === 'Ghost') {
        bgHex   = null;
        textHex = theme.primary;
      }

      if (bgHex) comp.fills = solidPaint(bgHex);
      if (strokeHex) applyStroke(comp, strokeHex, 1.5);

      const icon = makeSvgIcon('ArrowRight', LUCIDE.ArrowRight, textHex || SHARED.white);
      icon.resize(14, 14);
      comp.appendChild(icon);

      const label = await makeText('Button', BASE_FONT, 'Medium', 14, textHex || SHARED.white);
      comp.appendChild(label);
    }]);
  }

  const set = await makeSet('Button', page, variants);
  return set;
}

// ── INPUT ─────────────────────────────────────────────────────────────────
async function buildInput(theme, page) {
  const states = ['Default', 'Focus', 'Error', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutV(comp, 6, 0, 0);
      comp.fills = noPaint();

      // Label
      const label = await makeText('Label', BASE_FONT, 'Medium', 13, SHARED.gray700);
      comp.appendChild(label);

      // Input box
      const box = makeFrame('InputBox');
      autoLayoutH(box, 8, 10, 12);
      box.fills = solidPaint(state === 'Disabled' ? SHARED.gray100 : SHARED.white);
      box.cornerRadius = RADIUS.md;

      const borderHex = state === 'Focus'    ? theme.primary
                      : state === 'Error'    ? SHARED.error
                      : state === 'Disabled' ? SHARED.gray200
                      : SHARED.gray300;
      applyStroke(box, borderHex, state === 'Focus' ? 2 : 1.5);

      const placeholder = await makeText(
        state === 'Disabled' ? 'Disabled' : 'Placeholder text...',
        BODY_FONT, 'Regular', 14,
        state === 'Disabled' ? SHARED.gray400 : SHARED.gray400
      );
      box.appendChild(placeholder);

      // Force fixed width
      box.layoutMode = 'HORIZONTAL';
      box.primaryAxisSizingMode = 'FIXED';
      box.counterAxisSizingMode = 'AUTO';
      box.resize(240, box.height || 42);

      comp.appendChild(box);

      // Helper text
      const helperHex = state === 'Error' ? SHARED.error : SHARED.gray500;
      const helperTxt = state === 'Error' ? 'This field is required.' : 'Helper text goes here.';
      const helper = await makeText(helperTxt, BODY_FONT, 'Regular', 12, helperHex);
      comp.appendChild(helper);
    }]);
  }

  return makeSet('Input', page, variants);
}

// ── TEXTAREA ──────────────────────────────────────────────────────────────
async function buildTextarea(theme, page) {
  const states = ['Default', 'Focus', 'Error', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutV(comp, 6, 0, 0);
      comp.fills = noPaint();

      const label = await makeText('Label', BASE_FONT, 'Medium', 13, SHARED.gray700);
      comp.appendChild(label);

      const box = makeRect('TextareaBox', 240, 96,
        state === 'Disabled' ? SHARED.gray100 : SHARED.white, RADIUS.md);
      const borderHex = state === 'Focus'    ? theme.primary
                      : state === 'Error'    ? SHARED.error
                      : state === 'Disabled' ? SHARED.gray200
                      : SHARED.gray300;
      applyStroke(box, borderHex, state === 'Focus' ? 2 : 1.5);
      if (state === 'Disabled') box.opacity = 0.6;
      comp.appendChild(box);

      const helperHex = state === 'Error' ? SHARED.error : SHARED.gray500;
      const helper = await makeText(
        state === 'Error' ? 'This field is required.' : 'Max 500 characters.',
        BODY_FONT, 'Regular', 12, helperHex
      );
      comp.appendChild(helper);
    }]);
  }

  return makeSet('Textarea', page, variants);
}

// ── SELECT / DROPDOWN ─────────────────────────────────────────────────────
async function buildSelect(theme, page) {
  const states = ['Default', 'Open', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutV(comp, 6, 0, 0);
      comp.fills = noPaint();

      const label = await makeText('Label', BASE_FONT, 'Medium', 13, SHARED.gray700);
      comp.appendChild(label);

      const box = makeFrame('SelectBox');
      autoLayoutH(box, 8, 10, 12);
      box.fills = solidPaint(state === 'Disabled' ? SHARED.gray100 : SHARED.white);
      box.cornerRadius = RADIUS.md;

      const borderHex = state === 'Open' ? theme.primary : state === 'Disabled' ? SHARED.gray200 : SHARED.gray300;
      applyStroke(box, borderHex, state === 'Open' ? 2 : 1.5);

      box.layoutMode = 'HORIZONTAL';
      box.primaryAxisSizingMode = 'FIXED';
      box.counterAxisSizingMode = 'AUTO';
      box.resize(240, 42);
      box.primaryAxisAlignItems = 'SPACE_BETWEEN';

      const val = await makeText(
        state === 'Disabled' ? 'Disabled' : 'Select an option',
        BODY_FONT, 'Regular', 14,
        state === 'Disabled' ? SHARED.gray400 : SHARED.gray400
      );
      box.appendChild(val);

      // Chevron indicator
      const arrow = makeSvgIcon('ChevronDown', LUCIDE.ChevronDown, SHARED.gray400);
      arrow.resize(16, 16);
      box.appendChild(arrow);

      comp.appendChild(box);

      if (state === 'Open') {
        const menu = makeFrame('DropdownMenu');
        autoLayoutV(menu, 0, 0, 0);
        menu.fills = solidPaint(SHARED.white);
        menu.cornerRadius = RADIUS.md;
        applyStroke(menu, SHARED.gray200, 1);
        menu.resize(240, 0);

        const options = ['Option One', 'Option Two', 'Option Three'];
        for (let i = 0; i < options.length; i++) {
          const item = makeFrame(`Item_${i}`);
          autoLayoutH(item, 0, 10, 12);
          item.fills = i === 0 ? solidPaint(theme.primary, 0.08) : noPaint();
          item.primaryAxisSizingMode = 'FIXED';
          item.counterAxisSizingMode = 'AUTO';
          item.resize(240, 40);
          item.primaryAxisAlignItems = 'MIN';
          const optTxt = await makeText(options[i], BODY_FONT, 'Regular', 14,
            i === 0 ? theme.primary : SHARED.gray700);
          item.appendChild(optTxt);
          menu.appendChild(item);
        }
        comp.appendChild(menu);
      }
    }]);
  }

  return makeSet('Select', page, variants);
}

// ── CHECKBOX ──────────────────────────────────────────────────────────────
async function buildCheckbox(theme, page) {
  const states = ['Unchecked', 'Checked', 'Indeterminate', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutH(comp, 10, 0, 0);
      comp.fills = noPaint();

      const box = makeFrame('Box');
      box.resize(18, 18);
      box.cornerRadius = RADIUS.sm;
      box.fills = solidPaint(
        state === 'Checked' || state === 'Indeterminate' ? theme.primary :
        state === 'Disabled' ? SHARED.gray200 : SHARED.white
      );
      if (state === 'Unchecked') applyStroke(box, SHARED.gray300, 1.5);
      if (state === 'Disabled')  applyStroke(box, SHARED.gray200, 1.5);
      comp.appendChild(box);

      // Check mark / dash indicator
      if (state === 'Checked') {
        const mark = makeSvgIcon('Check', LUCIDE.Check, SHARED.white);
        mark.resize(14, 14);
        mark.x = 2; mark.y = 2;
        box.appendChild(mark);
      } else if (state === 'Indeterminate') {
        const dash = makeSvgIcon('Minus', 'M5 12h14', SHARED.white);
        dash.resize(14, 14);
        dash.x = 2; dash.y = 2;
        box.appendChild(dash);
      }

      const lbl = await makeText('Checkbox label', BODY_FONT, 'Regular', 14,
        state === 'Disabled' ? SHARED.gray400 : SHARED.gray700);
      comp.appendChild(lbl);
    }]);
  }

  return makeSet('Checkbox', page, variants);
}

// ── RADIO ─────────────────────────────────────────────────────────────────
async function buildRadio(theme, page) {
  const states = ['Unchecked', 'Checked', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutH(comp, 10, 0, 0);
      comp.fills = noPaint();

      const outer = makeFrame('Outer');
      outer.resize(18, 18);
      outer.cornerRadius = RADIUS.full;
      outer.fills = solidPaint(
        state === 'Checked' ? SHARED.white : state === 'Disabled' ? SHARED.gray100 : SHARED.white
      );
      applyStroke(outer,
        state === 'Checked'  ? theme.primary :
        state === 'Disabled' ? SHARED.gray300 : SHARED.gray300, 2
      );
      comp.appendChild(outer);

      if (state === 'Checked') {
        const inner = makeEllipse('Inner', 8, theme.primary);
        inner.x = 5; inner.y = 5;
        outer.appendChild(inner);
      }

      const lbl = await makeText('Radio label', BODY_FONT, 'Regular', 14,
        state === 'Disabled' ? SHARED.gray400 : SHARED.gray700);
      comp.appendChild(lbl);
    }]);
  }

  return makeSet('Radio Button', page, variants);
}

// ── TOGGLE / SWITCH ───────────────────────────────────────────────────────
async function buildToggle(theme, page) {
  const states = ['Off', 'On', 'Disabled'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutH(comp, 10, 0, 0);
      comp.fills = noPaint();

      const track = makeFrame('Track');
      track.resize(44, 24);
      track.cornerRadius = RADIUS.full;
      track.fills = solidPaint(
        state === 'On'       ? theme.primary :
        state === 'Disabled' ? SHARED.gray200 : SHARED.gray300
      );
      comp.appendChild(track);

      const thumb = makeEllipse('Thumb', 18, SHARED.white);
      thumb.x = state === 'On' ? 22 : 3;
      thumb.y = 3;
      track.appendChild(thumb);

      const lbl = await makeText(state === 'On' ? 'Enabled' : 'Disabled',
        BODY_FONT, 'Regular', 14,
        state === 'Disabled' ? SHARED.gray400 : SHARED.gray700
      );
      comp.appendChild(lbl);
    }]);
  }

  return makeSet('Toggle', page, variants);
}

// ── BADGE / TAG ───────────────────────────────────────────────────────────
async function buildBadge(theme, page) {
  const types = ['Default', 'Success', 'Warning', 'Error', 'Info'];
  const variants = [];

  const badgeColors = {
    Default: { bg: theme.primary, text: SHARED.white },
    Success: { bg: '#DCFCE7', text: '#166534' },
    Warning: { bg: '#FEF9C3', text: '#854D0E' },
    Error:   { bg: '#FEE2E2', text: '#991B1B' },
    Info:    { bg: '#DBEAFE', text: '#1E40AF' },
  };

  for (const type of types) {
    variants.push([`Type=${type}`, async (comp) => {
      autoLayoutH(comp, 4, 4, 10);
      comp.cornerRadius = RADIUS.full;
      comp.fills = solidPaint(badgeColors[type].bg);

      const dot = makeEllipse('Dot', 6, badgeColors[type].text);
      comp.appendChild(dot);

      const label = await makeText(type, BASE_FONT, 'Medium', 12, badgeColors[type].text);
      comp.appendChild(label);
    }]);
  }

  return makeSet('Badge', page, variants);
}

// ── AVATAR ────────────────────────────────────────────────────────────────
async function buildAvatar(theme, page) {
  const sizes = [
    ['XS', 24, 10],
    ['SM', 32, 12],
    ['MD', 40, 14],
    ['LG', 48, 16],
    ['XL', 64, 20],
  ];
  const variants = [];

  for (const [size, px, fontSize] of sizes) {
    variants.push([`Size=${size}`, async (comp) => {
      comp.fills = solidPaint(theme.primary, 0.15);
      comp.resize(px, px);
      comp.cornerRadius = RADIUS.full;

      const initials = await makeText('MR', BASE_FONT, 'SemiBold', fontSize, theme.primary);
      initials.x = Math.round((px - initials.width) / 2);
      initials.y = Math.round((px - initials.height) / 2);
      comp.appendChild(initials);
    }]);
  }

  return makeSet('Avatar', page, variants);
}

// ── CARD ──────────────────────────────────────────────────────────────────
async function buildCard(theme, page) {
  const types = ['Default', 'Bordered', 'Elevated'];
  const variants = [];

  for (const type of types) {
    variants.push([`Type=${type}`, async (comp) => {
      autoLayoutV(comp, 12, 24, 24);
      comp.fills = solidPaint(SHARED.white);
      comp.cornerRadius = RADIUS.xl;

      if (type === 'Bordered') applyStroke(comp, SHARED.gray200, 1.5);
      if (type === 'Elevated') {
        comp.effects = [{
          type: 'DROP_SHADOW',
          color: { r: 0, g: 0, b: 0, a: 0.08 },
          offset: { x: 0, y: 4 },
          radius: 16,
          spread: 0,
          visible: true,
          blendMode: 'NORMAL',
        }];
      }

      // Card header bar
      const header = makeRect('CardBadge', 40, 4, theme.primary, RADIUS.full);
      comp.appendChild(header);

      const title = await makeText('Card Title', BASE_FONT, 'SemiBold', 18, SHARED.gray900);
      comp.appendChild(title);

      const body = await makeText(
        'Card description text goes here. Keep it concise and relevant.',
        BODY_FONT, 'Regular', 14, SHARED.gray500
      );
      body.resize(280, body.height);
      body.textAutoResize = 'HEIGHT';
      comp.appendChild(body);

      // Footer row
      const footer = makeFrame('CardFooter');
      autoLayoutH(footer, 8, 0, 0);
      footer.primaryAxisAlignItems = 'SPACE_BETWEEN';
      footer.fills = noPaint();
      footer.primaryAxisSizingMode = 'FIXED';
      footer.resize(280, 36);

      const actionBtn = makeFrame('ActionBtn');
      autoLayoutH(actionBtn, 0, 8, 16);
      actionBtn.fills = solidPaint(theme.primary);
      actionBtn.cornerRadius = RADIUS.md;
      const actionLbl = await makeText('View More', BASE_FONT, 'Medium', 13, SHARED.white);
      actionBtn.appendChild(actionLbl);
      footer.appendChild(actionBtn);

      comp.appendChild(footer);
    }]);
  }

  return makeSet('Card', page, variants);
}

// ── MODAL ─────────────────────────────────────────────────────────────────
async function buildModal(theme, page) {
  const sizes = ['SM', 'MD', 'LG'];
  const variants = [];
  const widths = { SM: 360, MD: 480, LG: 640 };

  for (const size of sizes) {
    variants.push([`Size=${size}`, async (comp) => {
      const w = widths[size];
      autoLayoutV(comp, 0, 0, 0);
      comp.fills = noPaint();

      // Modal panel (no overlay — just the white panel with shadow)
      const panel = makeFrame('ModalPanel');
      autoLayoutV(panel, 0, 0, 0);
      panel.fills = solidPaint(SHARED.white);
      panel.cornerRadius = RADIUS.xl;
      panel.resize(w, 0);
      panel.primaryAxisSizingMode = 'AUTO';
      panel.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.18 },
        offset: { x: 0, y: 8 },
        radius: 32,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];

      // Header
      const header = makeFrame('Header');
      autoLayoutH(header, 0, 20, 24);
      header.primaryAxisSizingMode = 'FIXED';
      header.primaryAxisAlignItems = 'SPACE_BETWEEN';
      header.fills = noPaint();
      header.resize(w, 0);
      const titleTxt = await makeText('Modal Title', BASE_FONT, 'SemiBold', 18, SHARED.gray900);
      header.appendChild(titleTxt);
      const closeBtn = makeRect('Close', 24, 24, SHARED.gray200, RADIUS.full);
      header.appendChild(closeBtn);
      panel.appendChild(header);

      // Divider
      panel.appendChild(makeRect('Divider', w, 1, SHARED.gray100));

      // Body
      const body = makeFrame('Body');
      autoLayoutV(body, 12, 20, 24);
      body.fills = noPaint();
      body.primaryAxisSizingMode = 'FIXED';
      body.resize(w, 0);
      const bodyTxt = await makeText(
        'Modal body content goes here. Provide clear context for the user action.',
        BODY_FONT, 'Regular', 14, SHARED.gray600
      );
      bodyTxt.resize(w - 48, bodyTxt.height);
      bodyTxt.textAutoResize = 'HEIGHT';
      body.appendChild(bodyTxt);
      panel.appendChild(body);

      // Divider
      panel.appendChild(makeRect('Divider2', w, 1, SHARED.gray100));

      // Footer
      const footer = makeFrame('Footer');
      autoLayoutH(footer, 12, 16, 24);
      footer.fills = noPaint();
      footer.primaryAxisAlignItems = 'MAX';
      footer.primaryAxisSizingMode = 'FIXED';
      footer.resize(w, 0);

      const cancelTxt = await makeText('Cancel', BASE_FONT, 'Medium', 14, SHARED.gray600);
      const confirmBtn = makeRect('ConfirmBtn', 100, 36, theme.primary, RADIUS.md);
      footer.appendChild(cancelTxt);
      footer.appendChild(confirmBtn);
      panel.appendChild(footer);

      comp.appendChild(panel);
    }]);
  }

  return makeSet('Modal', page, variants);
}

// ── TOAST / NOTIFICATION ──────────────────────────────────────────────────
async function buildToast(theme, page) {
  const types = ['Default', 'Success', 'Warning', 'Error'];
  const variants = [];

  const toastColors = {
    Default: { bg: SHARED.gray900, icon: SHARED.white,    text: SHARED.white },
    Success: { bg: '#F0FDF4',      icon: SHARED.success,  text: SHARED.gray800 },
    Warning: { bg: '#FFFBEB',      icon: SHARED.warning,  text: SHARED.gray800 },
    Error:   { bg: '#FEF2F2',      icon: SHARED.error,    text: SHARED.gray800 },
  };

  for (const type of types) {
    variants.push([`Type=${type}`, async (comp) => {
      autoLayoutH(comp, 12, 14, 16);
      comp.cornerRadius = RADIUS.lg;
      comp.fills = solidPaint(toastColors[type].bg);
      comp.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 4 },
        radius: 12,
        spread: 0,
        visible: true,
        blendMode: 'NORMAL',
      }];

      const iconDot = makeEllipse('Icon', 8, toastColors[type].icon);
      comp.appendChild(iconDot);

      const msgFrame = makeFrame('MsgFrame');
      autoLayoutV(msgFrame, 2, 0, 0);
      msgFrame.fills = noPaint();

      const title = await makeText(type + ' message', BASE_FONT, 'SemiBold', 14, toastColors[type].text);
      msgFrame.appendChild(title);

      const sub = await makeText('Description of what just happened.', BODY_FONT, 'Regular', 13, toastColors[type].text, 0.7);
      msgFrame.appendChild(sub);

      comp.appendChild(msgFrame);

      const dismiss = makeRect('Dismiss', 20, 20, null, RADIUS.full);
      comp.appendChild(dismiss);
    }]);
  }

  return makeSet('Toast', page, variants);
}

// ── TOOLTIP ───────────────────────────────────────────────────────────────
async function buildTooltip(theme, page) {
  const positions = ['Top', 'Bottom', 'Left', 'Right'];
  const variants = [];

  // SVG triangles for each direction (fill = #111827 = SHARED.gray900)
  function makeTriangleSvg(direction) {
    let svgStr;
    if (direction === 'down') {
      // Triangle pointing down (used for Top tooltip — arrow below bubble)
      svgStr = `<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M6 8L0 0H12L6 8Z" fill="#111827"/></svg>`;
    } else if (direction === 'up') {
      // Triangle pointing up (used for Bottom tooltip — arrow above bubble)
      svgStr = `<svg width="12" height="8" viewBox="0 0 12 8" xmlns="http://www.w3.org/2000/svg"><path d="M6 0L12 8H0L6 0Z" fill="#111827"/></svg>`;
    } else if (direction === 'right') {
      // Triangle pointing right (used for Left tooltip — arrow to the right of bubble)
      svgStr = `<svg width="8" height="12" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg"><path d="M8 6L0 0V12L8 6Z" fill="#111827"/></svg>`;
    } else {
      // Triangle pointing left (used for Right tooltip — arrow to the left of bubble)
      svgStr = `<svg width="8" height="12" viewBox="0 0 8 12" xmlns="http://www.w3.org/2000/svg"><path d="M0 6L8 0V12L0 6Z" fill="#111827"/></svg>`;
    }
    try {
      const node = figma.createNodeFromSvg(svgStr);
      node.name = 'Arrow';
      return node;
    } catch(e) {
      return makeRect('Arrow', 8, 6, SHARED.gray900, 2);
    }
  }

  for (const pos of positions) {
    variants.push([`Position=${pos}`, async (comp) => {
      comp.fills = noPaint();
      comp.primaryAxisAlignItems = 'CENTER';

      const bubble = makeFrame('Bubble');
      autoLayoutH(bubble, 0, 6, 10);
      bubble.fills = solidPaint(SHARED.gray900);
      bubble.cornerRadius = RADIUS.sm;
      const tip = await makeText('Tooltip text', BASE_FONT, 'Medium', 12, SHARED.white);
      bubble.appendChild(tip);

      if (pos === 'Top') {
        // Bubble on top, arrow pointing down below (no gap)
        autoLayoutV(comp, 0, 0, 0);
        comp.appendChild(bubble);
        comp.appendChild(makeTriangleSvg('down'));
      } else if (pos === 'Bottom') {
        // Arrow pointing up above, bubble below
        autoLayoutV(comp, 0, 0, 0);
        comp.appendChild(makeTriangleSvg('up'));
        comp.appendChild(bubble);
      } else if (pos === 'Left') {
        // Bubble on left, arrow pointing right (to the right of bubble)
        autoLayoutH(comp, 0, 0, 0);
        comp.appendChild(bubble);
        comp.appendChild(makeTriangleSvg('right'));
      } else if (pos === 'Right') {
        // Arrow pointing left (to the left of bubble), bubble on right
        autoLayoutH(comp, 0, 0, 0);
        comp.appendChild(makeTriangleSvg('left'));
        comp.appendChild(bubble);
      }
    }]);
  }

  return makeSet('Tooltip', page, variants);
}

// ── NAVIGATION BAR ────────────────────────────────────────────────────────
async function buildNavbar(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Navigation Bar';
  page.appendChild(comp);

  comp.layoutMode = 'HORIZONTAL';
  comp.itemSpacing = 0;
  comp.paddingTop = comp.paddingBottom = 0;
  comp.paddingLeft = comp.paddingRight = 40;
  comp.primaryAxisSizingMode = 'FIXED';
  comp.counterAxisSizingMode = 'AUTO';
  comp.primaryAxisAlignItems = 'SPACE_BETWEEN';
  comp.counterAxisAlignItems = 'CENTER';
  comp.fills = solidPaint(SHARED.white);
  comp.resize(1280, 0);
  applyStroke(comp, SHARED.gray200, 1);

  // Logo area
  const logoArea = makeFrame('Logo');
  autoLayoutH(logoArea, 8, 16, 0);
  logoArea.fills = noPaint();

  const logoMark = makeRect('Mark', 32, 32, theme.primary, RADIUS.md);
  logoArea.appendChild(logoMark);

  const logoTxt = await makeText(theme.label, BASE_FONT, 'Bold', 18, SHARED.gray900);
  logoArea.appendChild(logoTxt);

  const byTxt = await makeText('by Vlad', BASE_FONT, 'Regular', 11, SHARED.gray400);
  logoArea.appendChild(byTxt);

  comp.appendChild(logoArea);

  // Nav links
  const navLinks = makeFrame('NavLinks');
  autoLayoutH(navLinks, 4, 12, 0);
  navLinks.fills = noPaint();

  const links = ['Product', 'Pricing', 'Docs', 'Blog'];
  for (const link of links) {
    const item = makeFrame(`Nav_${link}`);
    autoLayoutH(item, 0, 10, 16);
    item.fills = noPaint();
    item.cornerRadius = RADIUS.md;
    const t = await makeText(link, BASE_FONT, 'Medium', 14, SHARED.gray600);
    item.appendChild(t);
    navLinks.appendChild(item);
  }

  comp.appendChild(navLinks);

  // CTA area
  const ctaArea = makeFrame('CTAArea');
  autoLayoutH(ctaArea, 12, 12, 0);
  ctaArea.fills = noPaint();

  const signIn = await makeText('Sign in', BASE_FONT, 'Medium', 14, SHARED.gray600);
  ctaArea.appendChild(signIn);

  const ctaBtn = makeFrame('CTA');
  autoLayoutH(ctaBtn, 0, 10, 20);
  ctaBtn.fills = solidPaint(theme.primary);
  ctaBtn.cornerRadius = RADIUS.md;
  const ctaTxt = await makeText('Get started', BASE_FONT, 'Medium', 14, SHARED.white);
  ctaBtn.appendChild(ctaTxt);
  ctaArea.appendChild(ctaBtn);

  comp.appendChild(ctaArea);
  return comp;
}

// ── SIDEBAR ───────────────────────────────────────────────────────────────
async function buildSidebar(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Sidebar';
  page.appendChild(comp);

  autoLayoutV(comp, 0, 0, 0);
  comp.primaryAxisSizingMode = 'AUTO';
  comp.counterAxisSizingMode = 'FIXED';
  comp.resize(240, 1);
  comp.fills = solidPaint(theme.secondary);

  // Logo
  const logoSection = makeFrame('LogoSection');
  autoLayoutH(logoSection, 10, 20, 20);
  logoSection.fills = noPaint();
  logoSection.primaryAxisSizingMode = 'FIXED';
  logoSection.counterAxisSizingMode = 'AUTO';
  logoSection.resize(240, 1);

  const mark = makeRect('LogoMark', 28, 28, theme.primary, RADIUS.md);
  logoSection.appendChild(mark);

  const logoTxt = await makeText(theme.label, BASE_FONT, 'Bold', 15, SHARED.white);
  logoSection.appendChild(logoTxt);
  comp.appendChild(logoSection);

  comp.appendChild(makeRect('Divider', 240, 1, SHARED.white, 0, 0.1));

  // Nav section
  const navSection = makeFrame('NavSection');
  autoLayoutV(navSection, 2, 12, 12);
  navSection.fills = noPaint();
  navSection.primaryAxisSizingMode = 'AUTO';
  navSection.counterAxisSizingMode = 'FIXED';
  navSection.resize(240, 1);

  const navLabel = await makeText('MAIN', BASE_FONT, 'Medium', 10, SHARED.white, 0.4);
  navSection.appendChild(navLabel);

  const navItems = ['Dashboard', 'Analytics', 'Projects', 'Team', 'Settings'];
  for (let i = 0; i < navItems.length; i++) {
    const item = makeFrame(`NavItem_${navItems[i]}`);
    autoLayoutH(item, 10, 10, 14);
    item.fills = i === 0 ? solidPaint(theme.primary, 0.2) : noPaint();
    item.cornerRadius = RADIUS.md;
    item.primaryAxisSizingMode = 'FIXED';
    item.counterAxisSizingMode = 'AUTO';
    item.resize(216, 1);
    item.primaryAxisAlignItems = 'MIN';

    const dot = makeEllipse('Icon', 16, i === 0 ? theme.accent : SHARED.white, i === 0 ? 1 : 0.4);
    item.appendChild(dot);

    const t = await makeText(navItems[i], BASE_FONT, 'Medium', 14,
      i === 0 ? SHARED.white : SHARED.white, i === 0 ? 1 : 0.6);
    item.appendChild(t);
    navSection.appendChild(item);
  }

  comp.appendChild(navSection);

  // User footer
  const userArea = makeFrame('UserArea');
  autoLayoutH(userArea, 10, 16, 16);
  userArea.fills = solidPaint(SHARED.black, 0.2);
  userArea.primaryAxisSizingMode = 'FIXED';
  userArea.counterAxisSizingMode = 'AUTO';
  userArea.resize(240, 1);

  const avatar = makeEllipse('Avatar', 32, theme.accent);
  userArea.appendChild(avatar);

  const userInfo = makeFrame('UserInfo');
  autoLayoutV(userInfo, 2, 0, 0);
  userInfo.fills = noPaint();

  const uname = await makeText('Jane Doe', BASE_FONT, 'Medium', 13, SHARED.white);
  const uemail = await makeText('jane@meridian.ai', BODY_FONT, 'Regular', 11, SHARED.white, 0.5);
  userInfo.appendChild(uname);
  userInfo.appendChild(uemail);
  userArea.appendChild(userInfo);

  comp.appendChild(userArea);
  return comp;
}

// ── BREADCRUMB ────────────────────────────────────────────────────────────
async function buildBreadcrumb(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Breadcrumb';
  page.appendChild(comp);

  autoLayoutH(comp, 6, 0, 0);
  comp.fills = noPaint();

  const crumbs = ['Home', 'Dashboard', 'Current Page'];
  for (let i = 0; i < crumbs.length; i++) {
    const isLast = i === crumbs.length - 1;
    const t = await makeText(crumbs[i], BASE_FONT, isLast ? 'Medium' : 'Regular', 14,
      isLast ? SHARED.gray900 : SHARED.gray500);
    comp.appendChild(t);

    if (!isLast) {
      const sep = await makeText('/', BASE_FONT, 'Regular', 14, SHARED.gray300);
      comp.appendChild(sep);
    }
  }

  return comp;
}

// ── TABS ──────────────────────────────────────────────────────────────────
async function buildTabs(theme, page) {
  const states = ['Default', 'Active'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutH(comp, 0, 0, 0);
      comp.fills = noPaint();

      const tabLabels = ['Overview', 'Analytics', 'Settings', 'Reports'];
      const activeIdx = state === 'Active' ? 0 : -1;

      // Container border bottom
      const bar = makeFrame('TabBar');
      bar.layoutMode = 'HORIZONTAL';
      bar.itemSpacing = 0;
      bar.primaryAxisSizingMode = 'AUTO';
      bar.counterAxisSizingMode = 'AUTO';
      bar.fills = noPaint();
      applyStroke(bar, SHARED.gray200, 1);
      bar.strokeAlign = 'OUTSIDE';

      for (let i = 0; i < tabLabels.length; i++) {
        const tab = makeFrame(`Tab_${tabLabels[i]}`);
        autoLayoutH(tab, 0, 12, 16);
        tab.fills = noPaint();

        if (i === activeIdx) {
          tab.strokes = solidPaint(theme.primary);
          tab.strokeWeight = 2;
          tab.strokeAlign = 'OUTSIDE';
          tab.strokeTopWeight = 0;
          tab.strokeRightWeight = 0;
          tab.strokeLeftWeight = 0;
          tab.strokeBottomWeight = 2;
        }

        const t = await makeText(tabLabels[i], BASE_FONT, i === activeIdx ? 'SemiBold' : 'Regular', 14,
          i === activeIdx ? theme.primary : SHARED.gray500);
        tab.appendChild(t);
        bar.appendChild(tab);
      }

      comp.appendChild(bar);
    }]);
  }

  return makeSet('Tabs', page, variants);
}

// ── ACCORDION ─────────────────────────────────────────────────────────────
async function buildAccordion(theme, page) {
  const states = ['Collapsed', 'Expanded'];
  const variants = [];

  for (const state of states) {
    variants.push([`State=${state}`, async (comp) => {
      autoLayoutV(comp, 0, 0, 0);
      comp.fills = solidPaint(SHARED.white);
      comp.cornerRadius = RADIUS.lg;
      applyStroke(comp, SHARED.gray200, 1);
      comp.primaryAxisSizingMode = 'AUTO';
      comp.counterAxisSizingMode = 'AUTO';

      const items = ['What is Meridian?', 'How does pricing work?', 'Can I cancel anytime?'];
      for (let i = 0; i < items.length; i++) {
        const isOpen = state === 'Expanded' && i === 0;

        const header = makeFrame(`AccordionHeader_${i}`);
        header.layoutMode = 'HORIZONTAL';
        header.paddingTop = header.paddingBottom = 16;
        header.paddingLeft = header.paddingRight = 20;
        header.itemSpacing = 0;
        header.primaryAxisSizingMode = 'FIXED';
        header.counterAxisSizingMode = 'AUTO';
        header.primaryAxisAlignItems = 'SPACE_BETWEEN';
        header.counterAxisAlignItems = 'CENTER';
        header.fills = isOpen ? solidPaint(theme.primary, 0.04) : noPaint();
        header.resize(400, 1);

        const q = await makeText(items[i], BASE_FONT, isOpen ? 'SemiBold' : 'Regular', 15,
          isOpen ? theme.primary : SHARED.gray800);
        header.appendChild(q);

        // Chevron: ChevronDown when open, ChevronRight when collapsed
        const chevronPath = isOpen ? LUCIDE.ChevronDown : LUCIDE.ChevronRight;
        const chevron = makeSvgIcon('Chevron', chevronPath, isOpen ? theme.primary : SHARED.gray400);
        chevron.resize(16, 16);
        header.appendChild(chevron);
        comp.appendChild(header);

        if (isOpen) {
          const body = makeFrame('AccordionBody');
          body.layoutMode = 'VERTICAL';
          body.paddingTop = 0;
          body.paddingBottom = 20;
          body.paddingLeft = body.paddingRight = 20;
          body.itemSpacing = 0;
          body.primaryAxisSizingMode = 'AUTO';
          body.counterAxisSizingMode = 'FIXED';
          body.fills = solidPaint(theme.primary, 0.04);
          body.resize(400, 1);

          const ans = await makeText(
            'This is the expanded answer content. It provides detailed information to address the question above.',
            BODY_FONT, 'Regular', 14, SHARED.gray600
          );
          ans.resize(360, ans.height);
          ans.textAutoResize = 'HEIGHT';
          body.appendChild(ans);
          comp.appendChild(body);
        }

        if (i < items.length - 1) {
          comp.appendChild(makeRect(`Divider_${i}`, 400, 1, SHARED.gray100));
        }
      }
    }]);
  }

  return makeSet('Accordion', page, variants);
}

// ── CAROUSEL ──────────────────────────────────────────────────────────────
async function buildCarousel(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Carousel';
  page.appendChild(comp);

  autoLayoutV(comp, 16, 0, 0);
  comp.fills = noPaint();
  comp.primaryAxisAlignItems = 'CENTER';

  // Slide area
  const slideArea = makeFrame('SlideArea');
  autoLayoutH(slideArea, 8, 0, 0);
  slideArea.fills = noPaint();

  // Prev button — circle with ChevronLeft icon
  const prevBtn = makeFrame('PrevBtn');
  prevBtn.resize(40, 40);
  prevBtn.cornerRadius = RADIUS.full;
  prevBtn.fills = solidPaint(SHARED.white);
  applyStroke(prevBtn, SHARED.gray200, 1.5);
  prevBtn.layoutMode = 'HORIZONTAL';
  prevBtn.primaryAxisAlignItems = 'CENTER';
  prevBtn.counterAxisAlignItems = 'CENTER';
  prevBtn.primaryAxisSizingMode = 'FIXED';
  prevBtn.counterAxisSizingMode = 'FIXED';
  const prevIcon = makeSvgIcon('ChevronLeft', LUCIDE.ChevronLeft, SHARED.gray600);
  prevBtn.appendChild(prevIcon);
  slideArea.appendChild(prevBtn);

  // Slides
  const slides = makeFrame('Slides');
  autoLayoutH(slides, 16, 0, 0);
  slides.fills = noPaint();
  slides.clipsContent = true;

  const slideColors = [theme.primary, theme.accent, theme.secondary];
  const slideLabels = ['Slide One', 'Slide Two', 'Slide Three'];
  for (let i = 0; i < 3; i++) {
    const slide = makeFrame(`Slide_${i + 1}`);
    autoLayoutV(slide, 12, 32, 32);
    slide.fills = solidPaint(slideColors[i], i === 0 ? 1 : 0.2);
    slide.cornerRadius = RADIUS.xl;
    slide.resize(420, 240);

    const slideTxt = await makeText(slideLabels[i], BASE_FONT, 'Bold', 24,
      i === 1 ? theme.primary : SHARED.white);
    slide.appendChild(slideTxt);

    const slideSub = await makeText('Slide description content goes here.',
      BODY_FONT, 'Regular', 14,
      i === 1 ? SHARED.gray600 : SHARED.white, 0.85);
    slide.appendChild(slideSub);
    slides.appendChild(slide);
  }
  slideArea.appendChild(slides);

  // Next button — circle with ChevronRight icon
  const nextBtn = makeFrame('NextBtn');
  nextBtn.resize(40, 40);
  nextBtn.cornerRadius = RADIUS.full;
  nextBtn.fills = solidPaint(theme.primary);
  nextBtn.layoutMode = 'HORIZONTAL';
  nextBtn.primaryAxisAlignItems = 'CENTER';
  nextBtn.counterAxisAlignItems = 'CENTER';
  nextBtn.primaryAxisSizingMode = 'FIXED';
  nextBtn.counterAxisSizingMode = 'FIXED';
  const nextIcon = makeSvgIcon('ChevronRight', LUCIDE.ChevronRight, SHARED.white);
  nextBtn.appendChild(nextIcon);
  slideArea.appendChild(nextBtn);

  comp.appendChild(slideArea);

  // Dot indicators
  const dots = makeFrame('Dots');
  autoLayoutH(dots, 8, 0, 0);
  dots.fills = noPaint();

  for (let i = 0; i < 3; i++) {
    const dot = makeEllipse(`Dot_${i+1}`, i === 0 ? 10 : 8,
      i === 0 ? theme.primary : SHARED.gray300);
    dots.appendChild(dot);
  }
  comp.appendChild(dots);

  return comp;
}

// ── IMAGE SLIDER ──────────────────────────────────────────────────────────
async function buildImageSlider(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Image Slider';
  page.appendChild(comp);

  autoLayoutV(comp, 12, 0, 0);
  comp.fills = noPaint();

  const label = await makeText('Image Slider', BASE_FONT, 'Medium', 13, SHARED.gray700);
  comp.appendChild(label);

  // Slider track — no auto layout, children positioned absolutely
  const track = makeFrame('Track');
  track.layoutMode = 'NONE';
  track.fills = noPaint();
  track.resize(320, 24);

  const trackBg = makeRect('TrackBg', 320, 4, SHARED.gray200, RADIUS.full);
  trackBg.x = 0;
  trackBg.y = 10;
  track.appendChild(trackBg);

  const trackFill = makeRect('TrackFill', 180, 4, theme.primary, RADIUS.full);
  trackFill.x = 0;
  trackFill.y = 10;
  track.appendChild(trackFill);

  const thumb = makeEllipse('Thumb', 20, SHARED.white);
  thumb.x = 170;
  thumb.y = 2;
  applyStroke(thumb, theme.primary, 2);
  thumb.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.15 },
    offset: { x: 0, y: 2 },
    radius: 6,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];
  track.appendChild(thumb);
  comp.appendChild(track);

  // Value display
  const valRow = makeFrame('ValueRow');
  autoLayoutH(valRow, 0, 0, 0);
  valRow.fills = noPaint();
  valRow.primaryAxisSizingMode = 'FIXED';
  valRow.primaryAxisAlignItems = 'SPACE_BETWEEN';
  valRow.resize(320, 0);

  const minVal = await makeText('0', BASE_FONT, 'Regular', 12, SHARED.gray500);
  const curVal = await makeText('56%', BASE_FONT, 'SemiBold', 14, theme.primary);
  const maxVal = await makeText('100', BASE_FONT, 'Regular', 12, SHARED.gray500);
  valRow.appendChild(minVal);
  valRow.appendChild(curVal);
  valRow.appendChild(maxVal);
  comp.appendChild(valRow);

  return comp;
}

// ── PROGRESS BAR ──────────────────────────────────────────────────────────
async function buildProgressBar(theme, page) {
  const sizes = ['SM', 'MD', 'LG'];
  const variants = [];
  const heights = { SM: 4, MD: 8, LG: 12 };

  for (const size of sizes) {
    variants.push([`Size=${size}`, async (comp) => {
      autoLayoutV(comp, 8, 0, 0);
      comp.fills = noPaint();

      const header = makeFrame('ProgressHeader');
      autoLayoutH(header, 0, 0, 0);
      header.fills = noPaint();
      header.primaryAxisSizingMode = 'FIXED';
      header.primaryAxisAlignItems = 'SPACE_BETWEEN';
      header.resize(280, 0);

      const lbl = await makeText('Progress', BASE_FONT, 'Medium', 13, SHARED.gray700);
      const val = await makeText('72%', BASE_FONT, 'SemiBold', 13, theme.primary);
      header.appendChild(lbl);
      header.appendChild(val);
      comp.appendChild(header);

      const h = heights[size];
      const trackBg = makeFrame('TrackBg');
      trackBg.resize(280, h);
      trackBg.cornerRadius = RADIUS.full;
      trackBg.fills = solidPaint(SHARED.gray200);
      trackBg.clipsContent = true;
      comp.appendChild(trackBg);

      const fill = makeFrame('Fill');
      fill.resize(202, h);
      fill.fills = solidPaint(theme.primary);
      fill.cornerRadius = RADIUS.full;
      trackBg.appendChild(fill);
    }]);
  }

  return makeSet('Progress Bar', page, variants);
}

// ── SPINNER / LOADER ──────────────────────────────────────────────────────
async function buildSpinner(theme, page) {
  const sizes = ['SM', 'MD', 'LG'];
  const variants = [];
  const dims = { SM: 24, MD: 36, LG: 52 };

  for (const size of sizes) {
    variants.push([`Size=${size}`, async (comp) => {
      const d = dims[size];
      const sw = size === 'SM' ? 2 : size === 'MD' ? 3 : 4;
      const r = (d / 2) - sw;
      const cx = d / 2;
      const cy = d / 2;

      comp.fills = noPaint();
      comp.resize(d, d);

      // Use SVG to render a proper arc spinner
      const svgStr = `<svg width="${d}" height="${d}" viewBox="0 0 ${d} ${d}" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="${cx}" cy="${cy}" r="${r}" stroke="${SHARED.gray200}" stroke-width="${sw}"/>
        <path d="M${cx} ${sw} A${r} ${r} 0 0 1 ${d - sw} ${cy}" stroke="${theme.primary}" stroke-width="${sw}" stroke-linecap="round"/>
      </svg>`;

      try {
        const svgNode = figma.createNodeFromSvg(svgStr);
        svgNode.name = 'SpinnerArc';
        svgNode.resize(d, d);
        comp.appendChild(svgNode);
      } catch(e) {
        // Fallback: two ellipses with proper positioning
        const ring = makeEllipse('Ring', d, SHARED.gray200);
        comp.appendChild(ring);
        const dot = makeEllipse('Dot', sw * 3, theme.primary);
        dot.x = cx - sw; dot.y = 0;
        comp.appendChild(dot);
      }
    }]);
  }

  return makeSet('Spinner', page, variants);
}

// ── TABLE ─────────────────────────────────────────────────────────────────
async function buildTable(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Table';
  page.appendChild(comp);

  autoLayoutV(comp, 0, 0, 0);
  comp.fills = solidPaint(SHARED.white);
  comp.cornerRadius = RADIUS.xl;
  applyStroke(comp, SHARED.gray200, 1);
  comp.clipsContent = true;

  const cols = ['Name', 'Status', 'Role', 'Last Active'];
  const rows = [
    ['Alice Johnson', 'Active',   'Admin',  '2 mins ago'],
    ['Bob Smith',     'Inactive', 'Member', '3 days ago'],
    ['Carol White',   'Active',   'Editor', '1 hour ago'],
  ];
  const colWidths = [200, 100, 120, 140];
  const totalW = colWidths.reduce((a,b) => a+b, 0);

  // Header
  const headerRow = makeFrame('HeaderRow');
  autoLayoutH(headerRow, 0, 0, 0);
  headerRow.fills = solidPaint(SHARED.gray50);
  headerRow.primaryAxisSizingMode = 'FIXED';
  headerRow.counterAxisSizingMode = 'FIXED';
  headerRow.resize(totalW, 44);
  headerRow.primaryAxisAlignItems = 'MIN';

  for (let i = 0; i < cols.length; i++) {
    const cell = makeFrame(`TH_${cols[i]}`);
    autoLayoutH(cell, 0, 12, 16);
    cell.fills = noPaint();
    cell.primaryAxisSizingMode = 'FIXED';
    cell.counterAxisSizingMode = 'FIXED';
    cell.resize(colWidths[i], 44);
    cell.primaryAxisAlignItems = 'MIN';
    const t = await makeText(cols[i], BASE_FONT, 'SemiBold', 13, SHARED.gray600);
    cell.appendChild(t);
    headerRow.appendChild(cell);
  }
  comp.appendChild(headerRow);

  // Data rows
  for (let r = 0; r < rows.length; r++) {
    comp.appendChild(makeRect(`RowDivider_${r}`, totalW, 1, SHARED.gray100));

    const row = makeFrame(`Row_${r}`);
    autoLayoutH(row, 0, 0, 0);
    row.fills = r % 2 === 0 ? noPaint() : solidPaint(SHARED.gray50, 0.5);
    row.primaryAxisSizingMode = 'FIXED';
    row.counterAxisSizingMode = 'FIXED';
    row.resize(totalW, 48);
    row.primaryAxisAlignItems = 'MIN';
    row.counterAxisAlignItems = 'CENTER';

    for (let c = 0; c < cols.length; c++) {
      const cell = makeFrame(`TD_${r}_${c}`);
      autoLayoutH(cell, 0, 14, 16);
      cell.fills = noPaint();
      cell.primaryAxisSizingMode = 'FIXED';
      cell.counterAxisSizingMode = 'FIXED';
      cell.resize(colWidths[c], 48);
      cell.primaryAxisAlignItems = 'MIN';

      if (c === 1) {
        // Status badge
        const statusBadge = makeFrame('StatusBadge');
        autoLayoutH(statusBadge, 4, 4, 8);
        statusBadge.cornerRadius = RADIUS.full;
        const isActive = rows[r][1] === 'Active';
        statusBadge.fills = solidPaint(isActive ? '#DCFCE7' : SHARED.gray100);
        const dot = makeEllipse('Dot', 6, isActive ? SHARED.success : SHARED.gray400);
        const t = await makeText(rows[r][c], BASE_FONT, 'Medium', 12,
          isActive ? '#166534' : SHARED.gray500);
        statusBadge.appendChild(dot);
        statusBadge.appendChild(t);
        cell.appendChild(statusBadge);
      } else {
        const t = await makeText(rows[r][c], BODY_FONT, 'Regular', 14, SHARED.gray700);
        cell.appendChild(t);
      }
      row.appendChild(cell);
    }
    comp.appendChild(row);
  }

  return comp;
}

// ── PAGINATION ────────────────────────────────────────────────────────────
async function buildPagination(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Pagination';
  page.appendChild(comp);

  autoLayoutH(comp, 4, 0, 0);
  comp.fills = noPaint();

  const items = ['‹ Prev', '1', '2', '3', '...', '8', 'Next ›'];
  const activeIdx = 2;

  for (let i = 0; i < items.length; i++) {
    const btn = makeFrame(`Page_${items[i]}`);
    autoLayoutH(btn, 0, 8, 12);
    btn.cornerRadius = RADIUS.md;

    const isActive = i === activeIdx;
    const isEdge   = i === 0 || i === items.length - 1;

    btn.fills = isActive ? solidPaint(theme.primary) : noPaint();
    if (!isActive && !isEdge && items[i] !== '...') applyStroke(btn, SHARED.gray200, 1.5);

    const t = await makeText(items[i], BASE_FONT, isActive ? 'SemiBold' : 'Regular', 14,
      isActive ? SHARED.white : items[i] === '...' ? SHARED.gray400 : SHARED.gray600);
    btn.appendChild(t);
    comp.appendChild(btn);
  }

  return comp;
}

// ── DROPDOWN MENU ─────────────────────────────────────────────────────────
async function buildDropdown(theme, page) {
  const comp = figma.createComponent();
  comp.name = 'Dropdown Menu';
  page.appendChild(comp);

  autoLayoutV(comp, 4, 8, 8);
  comp.fills = solidPaint(SHARED.white);
  comp.cornerRadius = RADIUS.lg;
  applyStroke(comp, SHARED.gray200, 1);
  comp.effects = [{
    type: 'DROP_SHADOW',
    color: { r: 0, g: 0, b: 0, a: 0.08 },
    offset: { x: 0, y: 8 },
    radius: 24,
    spread: 0,
    visible: true,
    blendMode: 'NORMAL',
  }];

  const menuItems = [
    { label: 'View profile',    divider: false },
    { label: 'Account settings', divider: false },
    { label: 'Billing',         divider: true  },
    { label: 'Invite team',     divider: false },
    { label: 'Sign out',        divider: false, danger: true },
  ];

  for (const item of menuItems) {
    if (item.divider) {
      comp.appendChild(makeRect(`Divider`, 200, 1, SHARED.gray100));
    }
    const row = makeFrame(`MenuItem_${item.label}`);
    autoLayoutH(row, 10, 8, 12);
    row.fills = noPaint();
    row.cornerRadius = RADIUS.md;
    row.primaryAxisSizingMode = 'FIXED';
    row.counterAxisSizingMode = 'AUTO';
    row.resize(200, 1);
    row.primaryAxisAlignItems = 'MIN';

    const dot = makeEllipse('Icon', 16, item.danger ? SHARED.error : SHARED.gray400, 0.5);
    row.appendChild(dot);

    const t = await makeText(item.label, BASE_FONT, 'Regular', 14,
      item.danger ? SHARED.error : SHARED.gray700);
    row.appendChild(t);
    comp.appendChild(row);
  }

  return comp;
}

// ═══════════════════════════════════════════════════════════════════════════
// PAGE BUILDERS
// ═══════════════════════════════════════════════════════════════════════════

async function buildFoundationsPage(foundationsPage) {
  foundationsPage.name = '🏠 Foundations';

  let xOffset = 0;

  // ── Color Palette ──────────────────────────────────────────────────────
  const colorSection = makeFrame('Color Palette');
  autoLayoutV(colorSection, 24, 32, 32);
  colorSection.fills = solidPaint(SHARED.white);
  colorSection.cornerRadius = RADIUS.xl;

  const colorTitle = await makeText('Color Palette', BASE_FONT, 'Bold', 24, SHARED.gray900);
  colorSection.appendChild(colorTitle);

  // Shared neutrals row
  const neutralsRow = makeFrame('Neutrals');
  autoLayoutH(neutralsRow, 8, 0, 0);
  neutralsRow.fills = noPaint();

  const neutralColors = [
    ['White',   SHARED.white,   SHARED.gray900],
    ['Gray 50', SHARED.gray50,  SHARED.gray700],
    ['Gray 200',SHARED.gray200, SHARED.gray700],
    ['Gray 400',SHARED.gray400, SHARED.white  ],
    ['Gray 600',SHARED.gray600, SHARED.white  ],
    ['Gray 800',SHARED.gray800, SHARED.white  ],
    ['Black',   SHARED.black,   SHARED.white  ],
  ];
  for (const [name, hex, txtHex] of neutralColors) {
    const swatch = makeFrame(`Swatch_${name}`);
    autoLayoutV(swatch, 6, 0, 0);
    swatch.fills = noPaint();
    const block = makeRect('Block', 72, 48, hex, RADIUS.md);
    if (name === 'White') applyStroke(block, SHARED.gray200, 1);
    const lbl = await makeText(name, BASE_FONT, 'Regular', 11, SHARED.gray600);
    swatch.appendChild(block);
    swatch.appendChild(lbl);
    neutralsRow.appendChild(swatch);
  }
  colorSection.appendChild(neutralsRow);

  // Semantic colors
  const semanticRow = makeFrame('Semantic');
  autoLayoutH(semanticRow, 8, 0, 0);
  semanticRow.fills = noPaint();

  const semanticColors = [
    ['Success', SHARED.success, SHARED.white],
    ['Warning', SHARED.warning, SHARED.white],
    ['Error',   SHARED.error,   SHARED.white],
    ['Info',    SHARED.info,    SHARED.white],
  ];
  for (const [name, hex, txtHex] of semanticColors) {
    const swatch = makeFrame(`Semantic_${name}`);
    autoLayoutV(swatch, 6, 0, 0);
    swatch.fills = noPaint();
    const block = makeRect('Block', 72, 48, hex, RADIUS.md);
    const lbl = await makeText(name, BASE_FONT, 'Regular', 11, SHARED.gray600);
    swatch.appendChild(block);
    swatch.appendChild(lbl);
    semanticRow.appendChild(swatch);
  }
  colorSection.appendChild(semanticRow);

  // Product palettes
  for (const theme of Object.values(THEMES)) {
    const themeRow = makeFrame(`${theme.label} Palette`);
    autoLayoutH(themeRow, 8, 0, 0);
    themeRow.fills = noPaint();

    const paletteLabel = await makeText(`${theme.emoji} ${theme.label}`, BASE_FONT, 'SemiBold', 14, SHARED.gray800);
    colorSection.appendChild(paletteLabel);

    const keys = ['primary','secondary','accent','surface','muted'];
    for (const k of keys) {
      const swatch = makeFrame(`${theme.label}_${k}`);
      autoLayoutV(swatch, 6, 0, 0);
      swatch.fills = noPaint();
      const block = makeRect('Block', 72, 48, theme[k], RADIUS.md);
      if (k === 'surface') applyStroke(block, SHARED.gray200, 1);
      const lbl = await makeText(k, BASE_FONT, 'Regular', 11, SHARED.gray600);
      swatch.appendChild(block);
      swatch.appendChild(lbl);
      themeRow.appendChild(swatch);
    }
    colorSection.appendChild(themeRow);
  }

  colorSection.x = xOffset;
  colorSection.y = 0;
  foundationsPage.appendChild(colorSection);
  xOffset += colorSection.width + 40;

  // ── Typography Scale ────────────────────────────────────────────────────
  const typoSection = makeFrame('Typography');
  autoLayoutV(typoSection, 16, 32, 32);
  typoSection.fills = solidPaint(SHARED.white);
  typoSection.cornerRadius = RADIUS.xl;

  const typoTitle = await makeText('Typography Scale', BASE_FONT, 'Bold', 24, SHARED.gray900);
  typoSection.appendChild(typoTitle);

  const typeRows = [
    ['Display/Large',  BASE_FONT, 'Bold',     56, 'Display Large'],
    ['Heading/H1',     BASE_FONT, 'Bold',     40, 'Heading 1'],
    ['Heading/H2',     BASE_FONT, 'Bold',     32, 'Heading 2'],
    ['Heading/H3',     BASE_FONT, 'SemiBold', 24, 'Heading 3'],
    ['Heading/H4',     BASE_FONT, 'SemiBold', 18, 'Heading 4'],
    ['Body/Large',     BODY_FONT, 'Regular',  18, 'Body Large — The quick brown fox'],
    ['Body/Medium',    BODY_FONT, 'Regular',  14, 'Body Medium — The quick brown fox'],
    ['Label/Medium',   BASE_FONT, 'Medium',   13, 'Label Medium'],
    ['Caption',        BODY_FONT, 'Regular',  11, 'Caption text'],
    ['Code/Regular',   MONO_FONT, 'Regular',  13, 'const meridian = "ai";'],
  ];

  for (const [styleName, family, style, size, sample] of typeRows) {
    const row = makeFrame(`Type_${styleName}`);
    autoLayoutH(row, 16, 8, 0);
    row.fills = noPaint();
    row.primaryAxisSizingMode = 'FIXED';
    row.counterAxisSizingMode = 'AUTO';
    row.primaryAxisAlignItems = 'MIN';
    row.counterAxisAlignItems = 'CENTER';
    row.resize(560, 0);

    const meta = await makeText(styleName, BASE_FONT, 'Regular', 11, SHARED.gray400);
    meta.resize(140, meta.height);
    row.appendChild(meta);

    const sample_txt = await makeText(sample, family, style, size, SHARED.gray900);
    row.appendChild(sample_txt);
    typoSection.appendChild(row);
  }

  typoSection.x = xOffset;
  typoSection.y = 0;
  foundationsPage.appendChild(typoSection);
  xOffset += typoSection.width + 40;

  // ── Spacing Scale ────────────────────────────────────────────────────────
  const spacingSection = makeFrame('Spacing & Grid');
  autoLayoutV(spacingSection, 20, 32, 32);
  spacingSection.fills = solidPaint(SHARED.white);
  spacingSection.cornerRadius = RADIUS.xl;

  const spacingTitle = await makeText('Spacing Scale (8px base)', BASE_FONT, 'Bold', 24, SHARED.gray900);
  spacingSection.appendChild(spacingTitle);

  const spacingValues = [4, 8, 12, 16, 24, 32, 48, 64, 80, 96];
  for (const sp of spacingValues) {
    const row = makeFrame(`Spacing_${sp}`);
    autoLayoutH(row, 16, 0, 0);
    row.fills = noPaint();
    row.counterAxisAlignItems = 'CENTER';

    const spBlock = makeRect('Block', sp, 24, THEMES.stream.primary, RADIUS.sm, 0.6);
    const spLabel = await makeText(`${sp}px`, MONO_FONT, 'Regular', 12, SHARED.gray500);
    row.appendChild(spBlock);
    row.appendChild(spLabel);
    spacingSection.appendChild(row);
  }

  const gridNote = await makeText(
    'Grid: 8px base unit\nBreakpoints: 640 / 1024 / 1440px\nColumns: 4 / 8 / 12\nGutter: 16 / 24 / 32px',
    BODY_FONT, 'Regular', 13, SHARED.gray500
  );
  spacingSection.appendChild(gridNote);

  spacingSection.x = xOffset;
  spacingSection.y = 0;
  foundationsPage.appendChild(spacingSection);

  // ── Motion Tokens ────────────────────────────────────────────────────────
  const motionSection = makeFrame('Motion Tokens');
  autoLayoutV(motionSection, 16, 32, 32);
  motionSection.fills = solidPaint(SHARED.white);
  motionSection.cornerRadius = RADIUS.xl;
  motionSection.x = xOffset + spacingSection.width + 40;
  motionSection.y = 0;

  const motionTitle = await makeText('Motion System', BASE_FONT, 'Bold', 24, SHARED.gray900);
  motionSection.appendChild(motionTitle);

  const motionNote = await makeText(
    'Shared easing: cubic-bezier(.73,.27,.31,.94)\n\nDurations:\n• Micro-interactions: 300ms\n• Transitions: 400ms\n• Page-level: 800ms\n\nSignature motions:\n🔥 SparkRamp — Rise (bottom-up entry)\n🌊 StreamOps — Glide (horizontal entry)\n🔮 ClarityMap — Reveal (center-out scale)',
    BODY_FONT, 'Regular', 14, SHARED.gray600
  );
  motionNote.resize(280, motionNote.height);
  motionNote.textAutoResize = 'HEIGHT';
  motionSection.appendChild(motionNote);

  const endorsementTitle = await makeText('Endorsement Lockup', BASE_FONT, 'SemiBold', 16, SHARED.gray800);
  motionSection.appendChild(endorsementTitle);

  for (const theme of Object.values(THEMES)) {
    const lockup = makeFrame(`Lockup_${theme.label}`);
    autoLayoutV(lockup, 4, 16, 20);
    lockup.fills = solidPaint(theme.secondary);
    lockup.cornerRadius = RADIUS.lg;

    const productName = await makeText(theme.label, BASE_FONT, 'Bold', 18, SHARED.white);
    lockup.appendChild(productName);
    lockup.appendChild(makeRect('Rule', 120, 1, SHARED.white, 0, 0.3));
    const byMeridian = await makeText('by Vlad', BASE_FONT, 'Regular', 12, SHARED.white, 0.6);
    lockup.appendChild(byMeridian);
    motionSection.appendChild(lockup);
  }

  foundationsPage.appendChild(motionSection);
}

async function buildComponentsPage(compPage, theme) {
  compPage.name = `${theme.emoji} ${theme.label}`;

  // ── Main wrapper: vertical auto-layout, everything flows top-to-bottom ──
  const main = makeFrame('Components');
  main.layoutMode = 'VERTICAL';
  main.itemSpacing = 56;
  main.paddingTop = main.paddingBottom = 64;
  main.paddingLeft = main.paddingRight = 64;
  main.primaryAxisSizingMode = 'AUTO';
  main.counterAxisSizingMode = 'AUTO';
  main.primaryAxisAlignItems = 'MIN';
  main.counterAxisAlignItems = 'MIN';
  main.fills = solidPaint(theme.surface);
  compPage.appendChild(main);

  // ── Helper: labelled section with horizontal component row ──
  async function addSection(title, buildFns) {
    const sec = makeFrame(`Sec_${title}`);
    sec.layoutMode = 'VERTICAL';
    sec.itemSpacing = 16;
    sec.primaryAxisSizingMode = 'AUTO';
    sec.counterAxisSizingMode = 'AUTO';
    sec.primaryAxisAlignItems = 'MIN';
    sec.counterAxisAlignItems = 'MIN';
    sec.fills = noPaint();

    const lbl = await makeText(title, BASE_FONT, 'SemiBold', 11, SHARED.gray500);
    sec.appendChild(lbl);

    const row = makeFrame('Row');
    row.layoutMode = 'HORIZONTAL';
    row.itemSpacing = 24;
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.primaryAxisAlignItems = 'MIN';
    row.counterAxisAlignItems = 'MIN';
    row.fills = noPaint();

    for (const fn of buildFns) {
      await fn(theme, row);
    }

    sec.appendChild(row);
    main.appendChild(sec);
  }

  // ── Helper: labelled section for single full-width components ──
  async function addSingleSection(title, buildFn) {
    const sec = makeFrame(`Sec_${title}`);
    sec.layoutMode = 'VERTICAL';
    sec.itemSpacing = 16;
    sec.primaryAxisSizingMode = 'AUTO';
    sec.counterAxisSizingMode = 'AUTO';
    sec.primaryAxisAlignItems = 'MIN';
    sec.counterAxisAlignItems = 'MIN';
    sec.fills = noPaint();

    const lbl = await makeText(title, BASE_FONT, 'SemiBold', 11, SHARED.gray500);
    sec.appendChild(lbl);

    await buildFn(theme, sec);
    main.appendChild(sec);
  }

  figma.ui.postMessage({ type: 'progress', text: `Building ${theme.label} inputs...` });

  await addSection('BUTTONS',            [buildButton]);
  await addSection('INPUTS & FORMS',     [buildInput, buildTextarea, buildSelect]);
  await addSection('SELECTION CONTROLS', [buildCheckbox, buildRadio, buildToggle]);
  await addSection('BADGES',             [buildBadge]);
  await addSection('AVATARS',            [buildAvatar]);
  await addSection('FEEDBACK',           [buildToast, buildTooltip, buildSpinner]);
  await addSection('CARDS',              [buildCard]);
  await addSection('PROGRESS',           [buildProgressBar]);

  figma.ui.postMessage({ type: 'progress', text: `Building ${theme.label} layout components...` });

  await addSingleSection('MODAL',        buildModal);
  await addSingleSection('NAVIGATION BAR', buildNavbar);
  await addSingleSection('BREADCRUMB',   buildBreadcrumb);
  await addSection('TABS',               [buildTabs]);
  await addSection('PAGINATION',         [buildPagination]);
  await addSection('ACCORDION',          [buildAccordion]);
  await addSection('CAROUSEL',           [buildCarousel]);
  await addSingleSection('IMAGE SLIDER', buildImageSlider);
  await addSingleSection('TABLE',        buildTable);
  await addSection('DROPDOWN MENU',      [buildDropdown]);
  await addSingleSection('SIDEBAR',      buildSidebar);
}

// ═══════════════════════════════════════════════════════════════════════════
// ICON SHEET (Lucide — MIT License)
// ═══════════════════════════════════════════════════════════════════════════

// ── Lucide SVG paths (MIT License) ────────────────────────────────────────
const LUCIDE = {
  // Navigation
  Home:     'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z M9 22V12h6v10',
  Menu:     'M3 12h18 M3 6h18 M3 18h18',
  Search:   'M21 21l-6-6m2-5a7 7 0 1 1-14 0 7 7 0 0 1 14 0z',
  ChevronDown:  'M6 9l6 6 6-6',
  ChevronRight: 'M9 18l6-6-6-6',
  ChevronLeft:  'M15 18l-6-6 6-6',
  ArrowRight:   'M5 12h14 M12 5l7 7-7 7',
  // Actions
  Plus:     'M12 5v14 M5 12h14',
  Edit:     'M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7 M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z',
  Trash:    'M3 6h18 M8 6V4h8v2 M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z',
  Save:     'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8',
  Send:     'M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z',
  Upload:   'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M17 8l-5-5-5 5 M12 3v12',
  // Status
  Check:    'M20 6L9 17l-5-5',
  X:        'M18 6L6 18 M6 6l12 12',
  AlertTriangle: 'M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z M12 9v4 M12 17h.01',
  Info:     'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z M12 16v-4 M12 8h.01',
  Star:     'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z',
  Heart:    'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z',
  // Data
  BarChart: 'M18 20V10 M12 20V4 M6 20v-6',
  PieChart: 'M21.21 15.89A10 10 0 1 1 8 2.83 M22 12A10 10 0 0 0 12 2v10z',
  Table:    'M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18',
  Filter:   'M22 3H2l8 9.46V19l4 2v-8.54L22 3z',
  SortAsc:  'M3 6h18 M3 12h9 M3 18h3 M15 12l3-3 3 3 M18 9v9',
  Download: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4 M7 10l5 5 5-5 M12 15V3',
  // UI
  Settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z',
  User:     'M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z',
  Bell:     'M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9 M13.73 21a2 2 0 0 1-3.46 0',
  Lock:     'M19 11H5a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z M17 11V7a5 5 0 0 0-10 0v4',
  Eye:      'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  Link:     'M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71 M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71',
};

function makeSvgIcon(name, pathData, strokeHex) {
  const svgStr = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${pathData}" stroke="${strokeHex}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  try {
    const node = figma.createNodeFromSvg(svgStr);
    node.name = name;
    node.resize(20, 20);
    return node;
  } catch(e) {
    return makeRect(name, 20, 20, null, 3);
  }
}

async function buildIconPage(iconPage) {
  iconPage.name = '🎨 Icon Library';

  // Main wrapper — vertical auto layout
  const main = makeFrame('IconLibrary');
  main.layoutMode = 'VERTICAL';
  main.itemSpacing = 40;
  main.paddingTop = main.paddingBottom = 64;
  main.paddingLeft = main.paddingRight = 64;
  main.primaryAxisSizingMode = 'AUTO';
  main.counterAxisSizingMode = 'AUTO';
  main.primaryAxisAlignItems = 'MIN';
  main.counterAxisAlignItems = 'MIN';
  main.fills = solidPaint(SHARED.gray900);
  iconPage.appendChild(main);

  // Header
  const header = makeFrame('Header');
  header.layoutMode = 'VERTICAL';
  header.itemSpacing = 8;
  header.primaryAxisSizingMode = 'AUTO';
  header.counterAxisSizingMode = 'AUTO';
  header.fills = noPaint();

  const title = await makeText('Icon Library', BASE_FONT, 'Bold', 32, SHARED.white);
  const subtitle = await makeText(
    'Lucide Icons — MIT License — Free for commercial use\nInstall "Lucide Icons" from Figma Community for the full 1,400+ icon set',
    BODY_FONT, 'Regular', 14, SHARED.gray400
  );
  subtitle.textAutoResize = 'HEIGHT';
  header.appendChild(title);
  header.appendChild(subtitle);
  main.appendChild(header);

  const categories = [
    { name: 'Navigation',  color: THEMES.stream.primary,  icons: [['Home','Home'],['Menu','Menu'],['Search','Search'],['ChevronRight','Forward'],['ChevronLeft','Back'],['ArrowRight','Arrow']] },
    { name: 'Actions',     color: THEMES.spark.primary,   icons: [['Plus','Add'],['Edit','Edit'],['Trash','Delete'],['Save','Save'],['Send','Send'],['Upload','Upload']] },
    { name: 'Status',      color: SHARED.success,         icons: [['Check','Check'],['X','Close'],['AlertTriangle','Warning'],['Info','Info'],['Star','Star'],['Heart','Heart']] },
    { name: 'Data',        color: THEMES.clarity.primary, icons: [['BarChart','Chart'],['PieChart','Graph'],['Table','Table'],['Filter','Filter'],['SortAsc','Sort'],['Download','Export']] },
    { name: 'UI',          color: SHARED.gray400,         icons: [['Settings','Settings'],['User','User'],['Bell','Bell'],['Lock','Lock'],['Eye','Eye'],['Link','Link']] },
  ];

  for (const cat of categories) {
    const catSection = makeFrame(`Cat_${cat.name}`);
    catSection.layoutMode = 'VERTICAL';
    catSection.itemSpacing = 16;
    catSection.primaryAxisSizingMode = 'AUTO';
    catSection.counterAxisSizingMode = 'AUTO';
    catSection.fills = noPaint();

    const catLabel = await makeText(cat.name, BASE_FONT, 'SemiBold', 13, SHARED.gray400);
    catSection.appendChild(catLabel);

    const row = makeFrame(`Icons_${cat.name}`);
    row.layoutMode = 'HORIZONTAL';
    row.itemSpacing = 12;
    row.primaryAxisSizingMode = 'AUTO';
    row.counterAxisSizingMode = 'AUTO';
    row.primaryAxisAlignItems = 'MIN';
    row.fills = noPaint();

    for (const [key, label] of cat.icons) {
      const iconContainer = makeFrame(`Icon_${label}`);
      iconContainer.layoutMode = 'VERTICAL';
      iconContainer.itemSpacing = 8;
      iconContainer.paddingTop = iconContainer.paddingBottom = 0;
      iconContainer.primaryAxisSizingMode = 'AUTO';
      iconContainer.counterAxisSizingMode = 'AUTO';
      iconContainer.primaryAxisAlignItems = 'CENTER';
      iconContainer.counterAxisAlignItems = 'CENTER';
      iconContainer.fills = noPaint();

      // Icon box with colored background
      const iconBox = makeFrame('Box');
      iconBox.layoutMode = 'HORIZONTAL';
      iconBox.primaryAxisAlignItems = 'CENTER';
      iconBox.counterAxisAlignItems = 'CENTER';
      iconBox.primaryAxisSizingMode = 'FIXED';
      iconBox.counterAxisSizingMode = 'FIXED';
      iconBox.resize(56, 56);
      iconBox.cornerRadius = RADIUS.xl;
      iconBox.fills = solidPaint(cat.color, 0.12);

      // Real SVG icon
      const iconNode = makeSvgIcon(key, LUCIDE[key] || LUCIDE.Check, cat.color);
      iconBox.appendChild(iconNode);

      const iconLbl = await makeText(label, BASE_FONT, 'Regular', 11, SHARED.gray500);
      iconContainer.appendChild(iconBox);
      iconContainer.appendChild(iconLbl);
      row.appendChild(iconContainer);
    }

    catSection.appendChild(row);
    main.appendChild(catSection);
  }
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ENTRY POINT
// ═══════════════════════════════════════════════════════════════════════════

async function run() {
  figma.ui.postMessage({ type: 'progress', text: 'Loading fonts...' });
  await loadFonts();

  figma.ui.postMessage({ type: 'progress', text: 'Creating color & text styles...' });
  await createColorStyles();
  await createTextStyles();

  // ── Set up pages ────────────────────────────────────────────────────────
  // Rename Page 1 → Foundations
  const existingPages = figma.root.children;
  let foundationsPage = existingPages[0];
  foundationsPage.name = '🏠 Foundations';

  function getOrCreatePage(name) {
    let p = figma.root.children.find(pg => pg.name === name);
    if (!p) {
      p = figma.createPage();
      p.name = name;
    }
    return p;
  }

  const sparkPage   = getOrCreatePage(`🔥 SparkRamp`);
  const streamPage  = getOrCreatePage(`🌊 StreamOps`);
  const clarityPage = getOrCreatePage(`🔮 ClarityMap`);
  const iconPage    = getOrCreatePage(`🎨 Icon Library`);

  // ── Build Foundations ────────────────────────────────────────────────────
  figma.ui.postMessage({ type: 'progress', text: 'Building foundations page...' });
  await figma.setCurrentPageAsync(foundationsPage);
  await buildFoundationsPage(foundationsPage);

  // ── Build product pages ──────────────────────────────────────────────────
  figma.ui.postMessage({ type: 'progress', text: 'Building SparkRamp components...' });
  await figma.setCurrentPageAsync(sparkPage);
  await buildComponentsPage(sparkPage, THEMES.spark);

  figma.ui.postMessage({ type: 'progress', text: 'Building StreamOps components...' });
  await figma.setCurrentPageAsync(streamPage);
  await buildComponentsPage(streamPage, THEMES.stream);

  figma.ui.postMessage({ type: 'progress', text: 'Building ClarityMap components...' });
  await figma.setCurrentPageAsync(clarityPage);
  await buildComponentsPage(clarityPage, THEMES.clarity);

  // ── Build icon library ────────────────────────────────────────────────────
  figma.ui.postMessage({ type: 'progress', text: 'Building icon library...' });
  await figma.setCurrentPageAsync(iconPage);
  await buildIconPage(iconPage);

  // ── Final: go back to Foundations ────────────────────────────────────────
  await figma.setCurrentPageAsync(foundationsPage);
  figma.viewport.scrollAndZoomIntoView(foundationsPage.children);

  figma.ui.postMessage({ type: 'done' });
  figma.closePlugin('✅ Meridian Design System built!');
}
