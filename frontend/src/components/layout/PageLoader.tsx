import React from 'react';
import styled, { keyframes } from 'styled-components';
import { theme } from '@/styles/theme';

const fadeIn   = keyframes`from{opacity:0}to{opacity:1}`;
const barFill  = keyframes`from{width:0}to{width:100%}`;
const logoIn   = keyframes`from{opacity:0;transform:translateY(16px) scale(0.9)}to{opacity:1;transform:none}`;
const spinRing = keyframes`to{transform:rotate(360deg)}`;
const dotAnim  = keyframes`0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}`;

const Overlay = styled.div`
  position: fixed; inset: 0;
  background: ${theme.colors.bg.dark};
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  z-index: ${theme.zIndex.loader};
  animation: ${fadeIn} 0.2s ease;
  &::before {
    content: '';
    position: absolute; inset: 0;
    background: ${theme.gradients.mesh};
    opacity: 0.3;
    pointer-events: none;
  }
`;

const LogoWrap = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: ${theme.spacing[4]};
  animation: ${logoIn} 0.7s cubic-bezier(0.34,1.56,0.64,1) both;
`;

const Mark = styled.div`
  position: relative; width: 72px; height: 72px;
`;

const Ring = styled.div`
  position: absolute; inset: -5px;
  border-radius: 50%;
  border: 2.5px solid transparent;
  border-top-color: ${theme.colors.primary[400]};
  border-right-color: ${theme.colors.accent[400]};
  animation: ${spinRing} 1.2s linear infinite;
`;

const MarkBg = styled.div`
  width: 72px; height: 72px;
  border-radius: ${theme.radius.xl};
  background: ${theme.gradients.brand};
  display: flex; align-items: center; justify-content: center;
  box-shadow: ${theme.shadows.brand};
`;

const Brand = styled.div`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['2xl']};
  font-weight: ${theme.typography.fontWeight.bold};
  color: white;
  letter-spacing: -1px;
`;

const TaglineT = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  letter-spacing: ${theme.typography.letterSpacing.widest};
  text-transform: uppercase;
  color: rgba(255,255,255,0.4);
`;

const BarWrap = styled.div`
  margin-top: ${theme.spacing[10]};
  width: 200px; height: 2px;
  border-radius: 999px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
`;

const BarFill = styled.div`
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, ${theme.colors.primary[500]}, ${theme.colors.accent[500]});
  animation: ${barFill} 1.8s cubic-bezier(0.4,0,0.2,1) both;
`;

// Minimal loader (dots)
const DotsRow = styled.div`
  display: flex; gap: ${theme.spacing[2]};
`;
const Dot = styled.div<{ $d: string }>`
  width: 8px; height: 8px; border-radius: 50%;
  background: ${theme.colors.primary[400]};
  animation: ${dotAnim} 1.2s ${p=>p.$d} ease-in-out infinite;
`;

// ─── COMPONENT ────────────────────────────────────────────────────
const MinimalWrap = styled.div`
  display: flex; align-items: center; justify-content: center;
  min-height: 40vh;
`;

interface Props { minimal?: boolean; }

const PageLoader: React.FC<Props> = ({ minimal }) => {
  if (minimal) return (
    <MinimalWrap>
      <DotsRow>
        <Dot $d="0s"/><Dot $d="0.15s"/><Dot $d="0.3s"/>
      </DotsRow>
    </MinimalWrap>
  );

  return (
    <Overlay>
      <LogoWrap>
        <Mark>
          <Ring/>
          <MarkBg>
            <svg viewBox="0 0 32 32" fill="none" width="38">
              <rect x="3" y="4"  width="5" height="24" rx="2.5" fill="white"/>
              <rect x="8" y="4"  width="13" height="5" rx="2.5" fill="white"/>
              <rect x="8" y="14" width="9"  height="4" rx="2"   fill="#00E5A0"/>
              <path d="M22 22 C24 22 25 26 27 26 C29 26 30 22 32 22" stroke="white" strokeWidth="2.5" strokeLinecap="round" opacity="0.6"/>
            </svg>
          </MarkBg>
        </Mark>
        <Brand>fluxa</Brand>
        <TaglineT>Escola de Idiomas</TaglineT>
      </LogoWrap>
      <BarWrap>
        <BarFill/>
      </BarWrap>
    </Overlay>
  );
};

export default PageLoader;
