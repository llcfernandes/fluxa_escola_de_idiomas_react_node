import React, { forwardRef } from 'react';
import styled, { css } from 'styled-components';
import { theme } from '@/styles/theme';

const base = css`
  width:100%;padding:${theme.spacing[3]} ${theme.spacing[4]};
  border-radius:${theme.radius.md};border:1.5px solid ${theme.colors.border.light};
  background:${theme.colors.bg.subtle};font-family:${theme.typography.fontFamily.body};
  font-size:${theme.typography.fontSize.sm};color:${theme.colors.text.primary};
  outline:none;transition:${theme.transitions.fast};
  &::placeholder{color:${theme.colors.text.muted};}
  &:hover{border-color:${theme.colors.border.strong};}
  &:focus{border-color:${theme.colors.primary[500]};background:white;
    box-shadow:0 0 0 3px rgba(0,102,255,0.1);}
  &:disabled{opacity:0.55;cursor:not-allowed;background:${theme.colors.neutral[100]};}
`;

const err = css`border-color:${theme.colors.error}!important;
  &:focus{box-shadow:0 0 0 3px rgba(255,59,48,0.1)!important;}`;

export const Field = styled.div`display:flex;flex-direction:column;gap:${theme.spacing[1]};`;
export const Label = styled.label`font-size:${theme.typography.fontSize.sm};font-weight:${theme.typography.fontWeight.semibold};color:${theme.colors.text.primary};`;
export const ErrMsg = styled.span`font-size:${theme.typography.fontSize.xs};color:${theme.colors.error};`;
export const Help   = styled.span`font-size:${theme.typography.fontSize.xs};color:${theme.colors.text.muted};`;

const SInput    = styled.input<{$e?:boolean}>`${base}${p=>p.$e&&err}`;
const STextarea = styled.textarea<{$e?:boolean}>`${base}${p=>p.$e&&err}resize:vertical;min-height:110px;line-height:1.65;`;
const SSelect   = styled.select<{$e?:boolean}>`${base}${p=>p.$e&&err}cursor:pointer;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%236B7280' d='M6 8L0 0h12z'/%3E%3C/svg%3E");
  background-repeat:no-repeat;background-position:right 14px center;padding-right:40px;appearance:none;`;

interface IP extends React.InputHTMLAttributes<HTMLInputElement>{label?:string;error?:string;helpText?:string;}
interface TP extends React.TextareaHTMLAttributes<HTMLTextAreaElement>{label?:string;error?:string;}
interface SP extends React.SelectHTMLAttributes<HTMLSelectElement>{label?:string;error?:string;options:{value:string;label:string}[];}

export const Input = forwardRef<HTMLInputElement,IP>(({label,error,helpText,id,...p},ref)=>(
  <Field><>{label&&<Label htmlFor={id}>{label}</Label>}</>
  <SInput id={id} ref={ref} $e={!!error} aria-invalid={!!error} {...p}/>
  <>{error?<ErrMsg role="alert">{error}</ErrMsg>:helpText&&<Help>{helpText}</Help>}</></Field>
));
Input.displayName='Input';

export const Textarea = forwardRef<HTMLTextAreaElement,TP>(({label,error,id,...p},ref)=>(
  <Field><>{label&&<Label htmlFor={id}>{label}</Label>}</>
  <STextarea id={id} ref={ref} $e={!!error} aria-invalid={!!error} {...p}/>
  <>{error&&<ErrMsg role="alert">{error}</ErrMsg>}</></Field>
));
Textarea.displayName='Textarea';

export const Select = forwardRef<HTMLSelectElement,SP>(({label,error,options,id,...p},ref)=>(
  <Field><>{label&&<Label htmlFor={id}>{label}</Label>}</>
  <SSelect id={id} ref={ref} $e={!!error} aria-invalid={!!error} {...p}>
    {options.map(o=><option key={o.value} value={o.value}>{o.label}</option>)}
  </SSelect>
  <>{error&&<ErrMsg role="alert">{error}</ErrMsg>}</></Field>
));
Select.displayName='Select';
