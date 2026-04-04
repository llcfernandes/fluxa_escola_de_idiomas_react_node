import { createGlobalStyle } from 'styled-components';
import { theme } from './theme';

export const GlobalStyles = createGlobalStyle`
  /* ── Clash Display via CDN (geometric, unique display font) ── */
  @import url('https://api.fontshare.com/v2/css?f[]=clash-display@400,500,600,700&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=DM+Mono:wght@400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --font-display: ${theme.typography.fontFamily.display};
    --font-body:    ${theme.typography.fontFamily.body};
    --font-mono:    ${theme.typography.fontFamily.mono};
    /* Phase colors as CSS vars for exercise components */
    --phase-a:    ${theme.colors.phaseA};
    --phase-p:    ${theme.colors.phaseP};
    --phase-aply: ${theme.colors.phaseAply};
  }

  html {
    font-size: 16px;
    scroll-behavior: smooth;
    -webkit-text-size-adjust: 100%;
  }

  body {
    font-family: var(--font-body);
    font-size: ${theme.typography.fontSize.md};
    line-height: ${theme.typography.lineHeight.normal};
    color: ${theme.colors.text.primary};
    background: ${theme.colors.bg.base};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  #root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }

  img, video { max-width: 100%; height: auto; display: block; }
  a { text-decoration: none; color: inherit; }
  button { cursor: pointer; border: none; background: none; font-family: inherit; }
  input, textarea, select { font-family: inherit; font-size: inherit; }
  ul, ol { list-style: none; }
  h1,h2,h3,h4,h5,h6 {
    font-family: var(--font-display);
    line-height: ${theme.typography.lineHeight.tight};
    font-weight: ${theme.typography.fontWeight.bold};
    letter-spacing: ${theme.typography.letterSpacing.tight};
  }

  /* ── Selection ── */
  ::selection {
    background: rgba(0,102,255,0.15);
    color: ${theme.colors.primary[700]};
  }

  /* ── Scrollbar ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: ${theme.colors.neutral[100]}; }
  ::-webkit-scrollbar-thumb {
    background: ${theme.colors.primary[300]};
    border-radius: 999px;
  }
  ::-webkit-scrollbar-thumb:hover { background: ${theme.colors.primary[500]}; }

  /* ── Focus visible ── */
  :focus-visible {
    outline: 2px solid ${theme.colors.primary[500]};
    outline-offset: 2px;
    border-radius: ${theme.radius.xs};
  }

  /* ── Code elements ── */
  code, kbd, pre {
    font-family: var(--font-mono);
    font-size: 0.9em;
  }

  @media (prefers-reduced-motion: reduce) {
    *, *::before, *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`;
