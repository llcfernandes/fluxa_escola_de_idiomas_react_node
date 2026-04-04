import React from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion } from 'framer-motion';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'excited' | 'correct' | 'wrong' | 'speaking';

interface Props {
  mood?: MascotMood;
  size?: number;
  className?: string;
  animate?: boolean;
}

// ─── KEYFRAMES ────────────────────────────────────────────────────
const floatY = keyframes`
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
`;
const blink = keyframes`
  0%,94%,100% { scaleY: 1; }
  97%         { transform: scaleY(0.1); }
`;
const headBob = keyframes`
  0%,100% { transform: rotate(-2deg); }
  50%      { transform: rotate(2deg); }
`;
const shrug = keyframes`
  0%,100% { transform: translateY(0); }
  30%,70% { transform: translateY(-4px); }
`;
const wave = keyframes`
  0%,100% { transform: rotate(0deg) translateX(0); }
  25%     { transform: rotate(-15deg) translateX(-2px); }
  75%     { transform: rotate(15deg) translateX(2px); }
`;
const pulse = keyframes`
  0%,100% { opacity:1; transform:scale(1); }
  50%     { opacity:0.6; transform:scale(1.15); }
`;

const Wrap = styled.div<{ $size: number; $animate: boolean }>`
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  ${p => p.$animate && css`animation: ${floatY} 3s ease-in-out infinite;`}
`;

// ─── FIX: keyframes must be used inside styled/css``, never in inline style strings ──
const PulseGroup = styled.g<{ $delay?: string }>`
  animation: ${pulse} 0.9s ${p => p.$delay || '0s'} ease-in-out infinite;
`;

/**
 * Kai — Mascote humano da Fluxa
 * Jovem, gênero neutro, estilo cartoon tech com traços limpos
 * Cabelo curto azulado, pele neutra, roupa tech minimalista
 */
const Mascot: React.FC<Props> = ({ mood = 'idle', size = 120, className, animate = true }) => {
  // Mood-driven colors/expressions
  const moods = {
    idle:     { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#0066FF', eyeExp:'neutral',  cheek:false },
    happy:    { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#0066FF', eyeExp:'happy',    cheek:true  },
    thinking: { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#6366F1', eyeExp:'thinking', cheek:false },
    excited:  { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#00B87F', eyeExp:'excited',  cheek:true  },
    correct:  { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#00B87F', eyeExp:'correct',  cheek:true  },
    wrong:    { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#6366F1', eyeExp:'wrong',    cheek:false },
    speaking: { skinTone:'#F5C9A0', hairColor:'#1A3A6B', shirtColor:'#0066FF', eyeExp:'speaking', cheek:false },
  };

  const m = moods[mood];

  const eyeLeft  = { cx: 38, cy: 52 };
  const eyeRight = { cx: 62, cy: 52 };

  const renderEyes = () => {
    switch (m.eyeExp) {
      case 'happy':
      case 'excited':
      case 'correct':
        // ^_^ happy arc eyes
        return <>
          <path d="M31 52 Q38 46 45 52" stroke={m.hairColor} strokeWidth="3" strokeLinecap="round" fill="none"/>
          <path d="M55 52 Q62 46 69 52" stroke={m.hairColor} strokeWidth="3" strokeLinecap="round" fill="none"/>
        </>;
      case 'thinking':
        // One normal eye, one raised brow squint
        return <>
          <circle cx={eyeLeft.cx} cy={eyeLeft.cy} r="5.5" fill={m.hairColor}/>
          <circle cx={eyeLeft.cx+1} cy={eyeLeft.cy-1} r="2" fill="white"/>
          <path d="M55 52 Q62 49 69 52" stroke={m.hairColor} strokeWidth="3" strokeLinecap="round" fill="none"/>
          {/* Thought bubble */}
          <circle cx="78" cy="28" r="3" fill="#0066FF" opacity="0.5"/>
          <circle cx="84" cy="22" r="4.5" fill="#0066FF" opacity="0.5"/>
          <circle cx="91" cy="16" r="6" fill="#0066FF" opacity="0.5"/>
        </>;
      case 'wrong':
        // >_< compressed eyes
        return <>
          <path d="M31 50 L45 54 M31 54 L45 50" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round"/>
          <path d="M55 50 L69 54 M55 54 L69 50" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round"/>
        </>;
      case 'speaking':
        // Normal eyes + open mouth emphasis
        return <>
          <circle cx={eyeLeft.cx} cy={eyeLeft.cy} r="5.5" fill={m.hairColor}/>
          <circle cx={eyeLeft.cx+1} cy={eyeLeft.cy-1} r="2" fill="white"/>
          <circle cx={eyeRight.cx} cy={eyeRight.cy} r="5.5" fill={m.hairColor}/>
          <circle cx={eyeRight.cx+1} cy={eyeRight.cy-1} r="2" fill="white"/>
        </>;
      default: // neutral
        return <>
          <circle cx={eyeLeft.cx}  cy={eyeLeft.cy}  r="5.5" fill={m.hairColor}/>
          <circle cx={eyeLeft.cx+1} cy={eyeLeft.cy-1} r="2" fill="white"/>
          <circle cx={eyeRight.cx} cy={eyeRight.cy} r="5.5" fill={m.hairColor}/>
          <circle cx={eyeRight.cx+1} cy={eyeRight.cy-1} r="2" fill="white"/>
        </>;
    }
  };

  const renderMouth = () => {
    switch (m.eyeExp) {
      case 'happy':
      case 'correct':
        return <path d="M40 66 Q50 74 60 66" stroke={m.hairColor} strokeWidth="3" strokeLinecap="round" fill="none"/>;
      case 'excited':
        return <path d="M38 65 Q50 78 62 65" stroke={m.hairColor} strokeWidth="3" strokeLinecap="round" fill="none"/>;
      case 'thinking':
        return <path d="M42 68 Q50 65 58 68" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>;
      case 'wrong':
        return <path d="M40 70 Q50 64 60 70" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>;
      case 'speaking':
        return <ellipse cx="50" cy="68" rx="8" ry="5" fill={m.hairColor} opacity="0.9"/>;
      default:
        return <path d="M43 67 Q50 71 57 67" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>;
    }
  };

  return (
    <Wrap $size={size} $animate={animate && mood === 'idle'} className={className}>
      <motion.svg
        viewBox="0 0 100 130"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        whileHover={{ scale: 1.06 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      >
        {/* ── Shadow ── */}
        <ellipse cx="50" cy="126" rx="22" ry="4" fill="rgba(0,0,0,0.08)"/>

        {/* ── Body / Torso ── */}
        <rect x="28" y="86" width="44" height="38" rx="10" fill={m.shirtColor}/>

        {/* ── Shirt collar / neckline ── */}
        <path d="M42 86 L50 96 L58 86" fill="rgba(255,255,255,0.15)"/>

        {/* ── Neck ── */}
        <rect x="43" y="78" width="14" height="12" rx="4" fill={m.skinTone}/>

        {/* ── Head ── */}
        <ellipse cx="50" cy="48" rx="30" ry="32" fill={m.skinTone}/>

        {/* ── Hair (short, tech-side-swept style) ── */}
        <path d="M20 38 C18 20 28 6 50 5 C72 5 82 20 80 38 C78 32 72 26 64 24 C56 22 44 22 36 26 C28 28 22 34 20 38Z" fill={m.hairColor}/>
        {/* Hair side detail */}
        <path d="M20 38 C22 30 28 24 36 26" stroke={m.hairColor} strokeWidth="1.5" fill="none"/>
        {/* Small hair strand/highlight */}
        <path d="M40 8 C42 5 48 4 52 5" stroke="#2A5FAD" strokeWidth="2.5" strokeLinecap="round" fill="none"/>

        {/* ── Ears ── */}
        <ellipse cx="20" cy="50" rx="5" ry="7" fill={m.skinTone}/>
        <ellipse cx="80" cy="50" rx="5" ry="7" fill={m.skinTone}/>
        <ellipse cx="20" cy="50" rx="3" ry="4.5" fill="#E8A880"/>
        <ellipse cx="80" cy="50" rx="3" ry="4.5" fill="#E8A880"/>

        {/* ── Eyebrows ── */}
        {m.eyeExp === 'thinking' ? (
          <>
            <path d="M31 42 Q38 39 45 41" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M55 40 Q62 36 69 40" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </>
        ) : m.eyeExp === 'excited' || m.eyeExp === 'correct' ? (
          <>
            <path d="M31 43 Q38 38 45 42" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
            <path d="M55 42 Q62 38 69 43" stroke={m.hairColor} strokeWidth="2.5" strokeLinecap="round" fill="none"/>
          </>
        ) : (
          <>
            <path d="M31 44 Q38 41 45 43" stroke={m.hairColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
            <path d="M55 43 Q62 41 69 44" stroke={m.hairColor} strokeWidth="2" strokeLinecap="round" fill="none"/>
          </>
        )}

        {/* ── Eyes ── */}
        {renderEyes()}

        {/* ── Cheeks (blush) ── */}
        {m.cheek && <>
          <ellipse cx="29" cy="60" rx="7" ry="5" fill="#FF8C94" opacity="0.35"/>
          <ellipse cx="71" cy="60" rx="7" ry="5" fill="#FF8C94" opacity="0.35"/>
        </>}

        {/* ── Nose ── */}
        <path d="M48 60 Q50 63 52 60" stroke="#D4967A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>

        {/* ── Mouth ── */}
        {renderMouth()}

        {/* ── Arms ── */}
        {/* Left arm */}
        <path d="M28 92 C18 94 14 102 16 110 C17 114 22 114 24 110 C25 106 26 100 28 96Z" fill={m.shirtColor}/>
        {/* Right arm */}
        <path d="M72 92 C82 94 86 102 84 110 C83 114 78 114 76 110 C75 106 74 100 72 96Z" fill={m.shirtColor}/>

        {/* ── Hands ── */}
        <ellipse cx="17" cy="112" rx="6" ry="5" fill={m.skinTone}/>
        <ellipse cx="83" cy="112" rx="6" ry="5" fill={m.skinTone}/>

        {/* ── Shirt logo: tiny Fluxa F ── */}
        <rect x="46" y="100" width="3" height="9" rx="1" fill="rgba(255,255,255,0.4)"/>
        <rect x="49" y="100" width="5" height="2.5" rx="1" fill="rgba(255,255,255,0.4)"/>
        <rect x="49" y="104" width="3.5" height="2" rx="1" fill="rgba(0,229,160,0.7)"/>

        {/* ── Excited: sparkles ── */}
        {/* FIX: keyframes cannot be interpolated into plain JS template strings (style={{}}).
            Use styled-components PulseGroup so the animation is injected via the CSS engine. */}
        {(mood === 'excited' || mood === 'correct') && <>
          <PulseGroup>
            <text x="84" y="18" fontSize="10" fill="#00E5A0">✦</text>
          </PulseGroup>
          <PulseGroup $delay="0.3s">
            <text x="5"  y="30" fontSize="8"  fill="#0066FF">★</text>
          </PulseGroup>
          <PulseGroup $delay="0.15s">
            <text x="82" y="45" fontSize="7"  fill="#FFB800">✦</text>
          </PulseGroup>
        </>}

        {/* ── Wrong: small sweat drop ── */}
        {mood === 'wrong' && (
          <path d="M76 16 C76 12 80 10 80 10 C80 10 84 12 84 16 C84 20 76 20 76 16Z" fill="#7CC8F8" opacity="0.8"/>
        )}
      </motion.svg>
    </Wrap>
  );
};

export default Mascot;
