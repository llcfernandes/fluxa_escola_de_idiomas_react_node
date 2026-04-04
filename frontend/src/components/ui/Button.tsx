// Button.tsx
import React from 'react';
import styled, { css } from 'styled-components';
import { Loader2 } from 'lucide-react';
import { theme } from '@/styles/theme';

type Variant = 'primary'|'accent'|'ghost'|'outline'|'danger';
type Size    = 'sm'|'md'|'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const spin = `@keyframes btnSpin{to{transform:rotate(360deg)}}`;

const variantMap: Record<Variant, ReturnType<typeof css>> = {
  primary: css`background:${theme.gradients.brand};color:white;box-shadow:${theme.shadows.brand};
    &:hover:not(:disabled){transform:translateY(-2px);box-shadow:0 12px 32px rgba(0,102,255,0.42);}`,
  accent:  css`background:${theme.gradients.accent};color:#003326;
    &:hover:not(:disabled){transform:translateY(-2px);box-shadow:${theme.shadows.accent};}`,
  ghost:   css`background:transparent;color:${theme.colors.primary[600]};border:1.5px solid ${theme.colors.border.brand};
    &:hover:not(:disabled){background:${theme.colors.primary[50]};border-color:${theme.colors.primary[400]};}`,
  outline: css`background:transparent;color:${theme.colors.text.primary};border:1.5px solid ${theme.colors.border.medium};
    &:hover:not(:disabled){border-color:${theme.colors.primary[400]};color:${theme.colors.primary[600]};}`,
  danger:  css`background:${theme.colors.error};color:white;
    &:hover:not(:disabled){transform:translateY(-1px);}`,
};

const sizeMap: Record<Size, ReturnType<typeof css>> = {
  sm: css`padding:${theme.spacing[2]} ${theme.spacing[4]};font-size:${theme.typography.fontSize.xs};height:34px;`,
  md: css`padding:${theme.spacing[3]} ${theme.spacing[6]};font-size:${theme.typography.fontSize.sm};height:42px;`,
  lg: css`padding:${theme.spacing[4]} ${theme.spacing[8]};font-size:${theme.typography.fontSize.md};height:52px;`,
};

const Btn = styled.button<{$v:Variant;$s:Size;$fw:boolean;$loading:boolean}>`
  display:inline-flex;align-items:center;justify-content:center;
  gap:${theme.spacing[2]};border-radius:${theme.radius.md};
  font-family:${theme.typography.fontFamily.body};
  font-weight:${theme.typography.fontWeight.bold};
  letter-spacing:0.01em;border:none;cursor:pointer;
  transition:${theme.transitions.normal};text-decoration:none;white-space:nowrap;
  width:${({$fw})=>$fw?'100%':'auto'};
  opacity:${({$loading})=>$loading?0.75:1};
  position:relative;overflow:hidden;
  ${({$v})=>variantMap[$v]}
  ${({$s})=>sizeMap[$s]}
  &:disabled{opacity:0.45;cursor:not-allowed;transform:none!important;box-shadow:none!important;}
  &:active:not(:disabled){transform:translateY(0) scale(0.98);}
`;

export const Button: React.FC<ButtonProps> = ({variant='primary',size='md',loading=false,fullWidth=false,children,disabled,...rest})=>(
  <Btn $v={variant} $s={size} $fw={fullWidth} $loading={loading} disabled={disabled||loading} {...rest}>
    {loading&&<Loader2 size={15} style={{animation:'btnSpin 1s linear infinite'}}/>}
    {children}
    <style>{spin}</style>
  </Btn>
);

export default Button;
