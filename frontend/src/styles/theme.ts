/**
 * ─── FLUXA DESIGN SYSTEM v2.0 ────────────────────────────────────
 * Tech-educational. Cobalto + Verde Elétrico + Carbono.
 * 2026 standards: sharp contrasts, micro-grid, motion-ready.
 *
 * Desenvolvido por Lucas Fernandes — Fernandes Web Studio
 */

export const theme = {
  colors: {
    // ── Primary: Cobalto Elétrico ──────────────────────────────────
    primary: {
      50:  '#EBF2FF',
      100: '#CCDEFF',
      200: '#99BDFF',
      300: '#5C95FF',
      400: '#2E72FF',
      500: '#0066FF',  // main
      600: '#0050CC',
      700: '#003C99',
      800: '#002866',
      900: '#001433',
      950: '#000A1A',
    },
    // ── Accent: Verde Elétrico (APA "apply" color) ─────────────────
    accent: {
      50:  '#E6FFF9',
      100: '#B3FFED',
      200: '#66FFD9',
      300: '#1AFFCA',
      400: '#00F0B5',
      500: '#00E5A0',  // main
      600: '#00B87F',
      700: '#008A5F',
      800: '#005C3F',
      900: '#002E1F',
      950: '#001710',
    },
    // ── Neutral: Carbono ───────────────────────────────────────────
    neutral: {
      0:   '#FFFFFF',
      50:  '#F5F5F7',
      100: '#EBEBED',
      200: '#D6D6DB',
      300: '#ADADB8',
      400: '#84848F',
      500: '#5C5C66',
      600: '#3D3D42',
      700: '#2A2A2E',
      800: '#1A1A1E',
      900: '#0F0F12',
      950: '#0A0A0F',  // near-black
    },
    // ── Semantic ───────────────────────────────────────────────────
    success: '#00C47A',
    warning: '#FF9500',
    error:   '#FF3B30',
    info:    '#0066FF',
    // ── APA Phases ─────────────────────────────────────────────────
    phaseA: '#0066FF',   // Adquirir – blue
    phaseP: '#A855F7',   // Praticar – purple
    phaseAply: '#00E5A0',// Aplicar  – green
    // ── Surfaces ───────────────────────────────────────────────────
    bg: {
      base:      '#FFFFFF',
      subtle:    '#F5F5F7',
      surface:   '#FFFFFF',
      elevated:  '#FFFFFF',
      dark:      '#0A0A0F',
      darkMid:   '#111116',
      darkSurf:  '#18181E',
      overlay:   'rgba(10,10,15,0.85)',
    },
    text: {
      primary:   '#0A0A0F',
      secondary: '#5C5C66',
      muted:     '#84848F',
      inverse:   '#FFFFFF',
      brand:     '#0066FF',
      accent:    '#00C47A',
    },
    border: {
      subtle: 'rgba(10,10,15,0.06)',
      light:  'rgba(10,10,15,0.10)',
      medium: 'rgba(10,10,15,0.18)',
      strong: 'rgba(10,10,15,0.35)',
      brand:  'rgba(0,102,255,0.25)',
      accent: 'rgba(0,229,160,0.30)',
    },
  },

  typography: {
    fontFamily: {
      display: "'Clash Display', 'DM Sans', sans-serif",
      body:    "'DM Sans', system-ui, sans-serif",
      mono:    "'DM Mono', 'Fira Code', monospace",
    },
    fontSize: {
      '2xs': '0.625rem',  // 10px
      xs:    '0.75rem',   // 12px
      sm:    '0.875rem',  // 14px
      md:    '1rem',      // 16px
      lg:    '1.125rem',  // 18px
      xl:    '1.25rem',   // 20px
      '2xl': '1.5rem',    // 24px
      '3xl': '1.875rem',  // 30px
      '4xl': '2.25rem',   // 36px
      '5xl': '3rem',      // 48px
      '6xl': '3.75rem',   // 60px
      '7xl': '4.5rem',    // 72px
      '8xl': '6rem',      // 96px
    },
    fontWeight: {
      light:     '300',
      regular:   '400',
      medium:    '500',
      semibold:  '600',
      bold:      '700',
      extrabold: '800',
      black:     '900',
    },
    lineHeight: {
      none:    '1',
      tight:   '1.15',
      snug:    '1.3',
      normal:  '1.5',
      relaxed: '1.7',
      loose:   '2',
    },
    letterSpacing: {
      tighter: '-0.04em',
      tight:   '-0.02em',
      normal:  '0',
      wide:    '0.04em',
      wider:   '0.08em',
      widest:  '0.16em',
    },
  },

  spacing: {
    px:  '1px',
    0:   '0',
    0.5: '0.125rem',
    1:   '0.25rem',
    1.5: '0.375rem',
    2:   '0.5rem',
    2.5: '0.625rem',
    3:   '0.75rem',
    3.5: '0.875rem',
    4:   '1rem',
    5:   '1.25rem',
    6:   '1.5rem',
    7:   '1.75rem',
    8:   '2rem',
    10:  '2.5rem',
    12:  '3rem',
    14:  '3.5rem',
    16:  '4rem',
    20:  '5rem',
    24:  '6rem',
    28:  '7rem',
    32:  '8rem',
    40:  '10rem',
  },

  radius: {
    none: '0',
    xs:   '0.25rem',
    sm:   '0.5rem',
    md:   '0.75rem',
    lg:   '1rem',
    xl:   '1.25rem',
    '2xl':'1.5rem',
    '3xl':'2rem',
    full: '9999px',
  },

  shadows: {
    xs:    '0 1px 2px rgba(0,0,0,0.05)',
    sm:    '0 2px 8px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    md:    '0 4px 16px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
    lg:    '0 8px 32px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.04)',
    xl:    '0 16px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.04)',
    '2xl': '0 32px 80px rgba(0,0,0,0.16)',
    brand: '0 8px 32px rgba(0,102,255,0.28)',
    accent:'0 8px 32px rgba(0,229,160,0.28)',
    inner: 'inset 0 2px 6px rgba(0,0,0,0.06)',
    // Dark mode cards
    dark:  '0 8px 32px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)',
  },

  transitions: {
    instant: 'all 0.08s ease',
    fast:    'all 0.18s cubic-bezier(0.4, 0, 0.2, 1)',
    normal:  'all 0.28s cubic-bezier(0.4, 0, 0.2, 1)',
    slow:    'all 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
    spring:  'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)',
    bounce:  'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  breakpoints: {
    xs:  '480px',
    sm:  '640px',
    md:  '768px',
    lg:  '1024px',
    xl:  '1280px',
    '2xl':'1536px',
  },

  zIndex: {
    hide:     -1,
    base:      0,
    raised:   10,
    dropdown: 100,
    sticky:   200,
    overlay:  300,
    modal:    400,
    toast:    500,
    loader:  1000,
  },

  // ── Gradients ──────────────────────────────────────────────────
  gradients: {
    brand:      'linear-gradient(135deg, #0066FF 0%, #003C99 100%)',
    brandLight: 'linear-gradient(135deg, #2E72FF 0%, #0066FF 100%)',
    accent:     'linear-gradient(135deg, #00E5A0 0%, #00B87F 100%)',
    // Hero: dark with cobalt glow
    hero:       'linear-gradient(135deg, #0A0A0F 0%, #0F1628 50%, #071030 100%)',
    heroOverlay:'linear-gradient(to bottom, rgba(10,10,15,0.2) 0%, rgba(10,10,15,0.7) 100%)',
    // APA phases
    phaseA:     'linear-gradient(135deg, #0066FF 0%, #2E72FF 100%)',
    phaseP:     'linear-gradient(135deg, #7C3AED 0%, #A855F7 100%)',
    phaseAply:  'linear-gradient(135deg, #00B87F 0%, #00E5A0 100%)',
    // Mesh (subtle background texture)
    mesh:       'radial-gradient(at 20% 30%, rgba(0,102,255,0.12) 0px, transparent 50%), radial-gradient(at 80% 10%, rgba(0,229,160,0.08) 0px, transparent 50%), radial-gradient(at 60% 80%, rgba(0,102,255,0.06) 0px, transparent 50%)',
    // Card surfaces
    cardHover:  'linear-gradient(135deg, rgba(0,102,255,0.04) 0%, rgba(0,229,160,0.02) 100%)',
    // Text gradient
    textBrand:  'linear-gradient(135deg, #0066FF 30%, #00E5A0 100%)',
  },
} as const;

export type Theme = typeof theme;
