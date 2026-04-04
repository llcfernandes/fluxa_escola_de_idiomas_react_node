import React from 'react';

interface Props {
  language: string;
  color: string;
  flag: string;
  nativeName: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Placeholder profissional de imagem para cards de curso.
 * SVG generativo baseado na cor e idioma — sem dependência externa.
 */
const CoursePlaceholder: React.FC<Props> = ({ language, color, flag, nativeName, className, style }) => {
  // Gera padrão geométrico único por cor (hash simples)
  const safeColor = color && /^#[0-9A-Fa-f]{6}$/.test(color) ? color : '#0066FF';
  const h = safeColor.replace('#','');
  const r = parseInt(h.slice(0,2),16);
  const g = parseInt(h.slice(2,4),16);
  const b = parseInt(h.slice(4,6),16);

  const dark = `rgba(${Math.max(r-40,0)},${Math.max(g-40,0)},${Math.max(b-40,0)},1)`;
  const light= `rgba(${Math.min(r+60,255)},${Math.min(g+60,255)},${Math.min(b+60,255)},0.4)`;

  return (
    <svg
      viewBox="0 0 400 240"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ width:'100%', height:'100%', display:'block', ...style }}
    >
      {/* Background */}
      <rect width="400" height="240" fill={dark}/>

      {/* Geometric patterns */}
      <circle cx="320" cy="40"  r="80" fill={safeColor} opacity="0.3"/>
      <circle cx="80"  cy="200" r="60" fill={light} opacity="0.25"/>
      <circle cx="360" cy="200" r="40" fill={safeColor} opacity="0.15"/>

      {/* Grid lines (subtle) */}
      <g stroke="rgba(255,255,255,0.06)" strokeWidth="1">
        {[0,1,2,3,4,5].map(i => (
          <line key={`v${i}`} x1={i*80} y1="0" x2={i*80} y2="240"/>
        ))}
        {[0,1,2,3].map(i => (
          <line key={`h${i}`} x1="0" y1={i*80} x2="400" y2={i*80}/>
        ))}
      </g>

      {/* Diagonal accent line */}
      <line x1="0" y1="240" x2="400" y2="0" stroke={safeColor} strokeWidth="1" opacity="0.2"/>

      {/* Flag (large, centered-left) */}
      <text x="40" y="140" fontSize="72" dominantBaseline="middle">{flag}</text>

      {/* Native name (right side, large) */}
      <text
        x="380" y="100"
        fontSize="42"
        fontFamily="'Clash Display', 'DM Sans', sans-serif"
        fontWeight="700"
        fill="rgba(255,255,255,0.12)"
        textAnchor="end"
        dominantBaseline="middle"
        letterSpacing="-1"
      >{nativeName}</text>

      {/* Language name (bottom) */}
      <text
        x="380" y="200"
        fontSize="18"
        fontFamily="'DM Sans', sans-serif"
        fontWeight="600"
        fill="rgba(255,255,255,0.7)"
        textAnchor="end"
        letterSpacing="2"
        textTransform="uppercase"
      >{language.toUpperCase()}</text>

      {/* Color accent bar at bottom */}
      <rect x="0" y="228" width="400" height="12" fill={safeColor} opacity="0.6"/>
    </svg>
  );
};

export default CoursePlaceholder;
