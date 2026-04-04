import React, { useState, useCallback } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, Lightbulb, ChevronRight, RotateCcw } from 'lucide-react';
import { theme } from '@/styles/theme';

// ─── TYPES ────────────────────────────────────────────────────────
export interface Exercise {
  id: string;
  type: 'multiple_choice' | 'fill_blank' | 'reorder' | 'translation' | 'tone_match';
  phase: 'A' | 'P';
  question?: string;
  instruction?: string;
  sentence?: string;
  prompt?: string;
  source?: string;
  options?: string[];
  words?: string[];
  correct?: number;
  explanation?: string;
  hint?: string;
  tip?: string;
  acceptedAnswers?: string[];
}

interface SubmitResult {
  correct: boolean;
  feedback: string;
  correctAnswer?: string;
  nextStep: string;
}

interface Props {
  exercise: Exercise;
  onSubmit: (answer: string | number) => Promise<SubmitResult>;
  onNext: () => void;
  exerciseNumber: number;
  total: number;
}

// ─── ANIMATIONS ───────────────────────────────────────────────────
const shake = keyframes`
  0%,100%{transform:translateX(0)}
  20%{transform:translateX(-8px)}
  40%{transform:translateX(8px)}
  60%{transform:translateX(-6px)}
  80%{transform:translateX(6px)}
`;
const pop = keyframes`
  0%{transform:scale(1)}50%{transform:scale(1.04)}100%{transform:scale(1)}
`;
const slideUp = keyframes`
  from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}
`;

// ─── STYLED ───────────────────────────────────────────────────────
const Card = styled.div`
  background: white;
  border-radius: ${theme.radius['2xl']};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.border.light};
  max-width: 680px;
  width: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${theme.spacing[6]};
`;

const PhaseTag = styled.div<{ $phase: 'A' | 'P' }>`
  display: inline-flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.radius.full};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: ${theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  ${p => p.$phase === 'A' ? css`
    background: rgba(0,102,255,0.1);
    color: ${theme.colors.primary[600]};
    border: 1px solid rgba(0,102,255,0.2);
  ` : css`
    background: rgba(168,85,247,0.1);
    color: #7C3AED;
    border: 1px solid rgba(168,85,247,0.2);
  `}
`;

const Progress = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const ProgressBar = styled.div`
  width: 80px;
  height: 4px;
  background: ${theme.colors.neutral[200]};
  border-radius: 999px;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $pct: number }>`
  height: 100%;
  width: ${p => p.$pct}%;
  background: ${theme.gradients.brand};
  border-radius: 999px;
  transition: width 0.4s ease;
`;

const QuestionText = styled.p`
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  line-height: ${theme.typography.lineHeight.snug};
  margin-bottom: ${theme.spacing[6]};
`;

const SourceText = styled.div`
  background: ${theme.colors.neutral[50]};
  border-left: 3px solid ${theme.colors.primary[400]};
  padding: ${theme.spacing[4]};
  border-radius: 0 ${theme.radius.md} ${theme.radius.md} 0;
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[5]};
  font-style: italic;
`;

const OptionsGrid = styled.div<{ $shake: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing[3]};
  ${p => p.$shake && css`animation: ${shake} 0.4s ease;`}
`;

const OptionBtn = styled.button<{ $state: 'idle'|'selected'|'correct'|'wrong' }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: ${theme.spacing[3]};
  padding: ${theme.spacing[4]} ${theme.spacing[5]};
  border-radius: ${theme.radius.lg};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.medium};
  text-align: left;
  transition: ${theme.transitions.fast};
  cursor: pointer;
  position: relative;
  overflow: hidden;

  ${p => {
    switch(p.$state) {
      case 'selected': return css`
        background: ${theme.colors.primary[50]};
        border: 2px solid ${theme.colors.primary[500]};
        color: ${theme.colors.primary[700]};
      `;
      case 'correct': return css`
        background: rgba(0,196,122,0.08);
        border: 2px solid ${theme.colors.success};
        color: #005A38;
        animation: ${pop} 0.3s ease;
      `;
      case 'wrong': return css`
        background: rgba(255,59,48,0.06);
        border: 2px solid ${theme.colors.error};
        color: #A30000;
      `;
      default: return css`
        background: ${theme.colors.neutral[50]};
        border: 2px solid ${theme.colors.border.light};
        color: ${theme.colors.text.primary};
        &:hover { border-color: ${theme.colors.primary[300]}; background: ${theme.colors.primary[50]}; }
      `;
    }
  }}
`;

const OptionLetter = styled.span`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: rgba(0,0,0,0.06);
  display: flex; align-items: center; justify-content: center;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  flex-shrink: 0;
  text-transform: uppercase;
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 80px;
  padding: ${theme.spacing[4]};
  border: 2px solid ${theme.colors.border.light};
  border-radius: ${theme.radius.lg};
  font-family: ${theme.typography.fontFamily.body};
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.primary};
  resize: vertical;
  outline: none;
  transition: ${theme.transitions.fast};
  &:focus { border-color: ${theme.colors.primary[500]}; box-shadow: 0 0 0 3px rgba(0,102,255,0.1); }
  &::placeholder { color: ${theme.colors.text.muted}; }
`;

const WordBank = styled.div`
  display: flex; flex-wrap: wrap; gap: ${theme.spacing[2]};
  margin-bottom: ${theme.spacing[4]};
`;

const Word = styled.button<{ $used: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  font-family: ${theme.typography.fontFamily.mono};
  border: 1.5px solid ${p => p.$used ? theme.colors.border.light : theme.colors.primary[200]};
  background: ${p => p.$used ? theme.colors.neutral[100] : theme.colors.primary[50]};
  color: ${p => p.$used ? theme.colors.text.muted : theme.colors.primary[700]};
  cursor: ${p => p.$used ? 'default' : 'pointer'};
  transition: ${theme.transitions.fast};
  text-decoration: ${p => p.$used ? 'line-through' : 'none'};
  &:hover:not(:disabled) { background: ${theme.colors.primary[100]}; }
`;

const SentenceArea = styled.div`
  min-height: 52px;
  border: 2px dashed ${theme.colors.border.medium};
  border-radius: ${theme.radius.lg};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  display: flex; flex-wrap: wrap; gap: ${theme.spacing[2]};
  align-items: center;
  background: ${theme.colors.neutral[50]};
  cursor: text;
  font-family: ${theme.typography.fontFamily.mono};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
`;

const FeedbackBox = styled(motion.div)<{ $correct: boolean }>`
  margin-top: ${theme.spacing[5]};
  padding: ${theme.spacing[5]};
  border-radius: ${theme.radius.xl};
  background: ${p => p.$correct ? 'rgba(0,196,122,0.07)' : 'rgba(255,59,48,0.06)'};
  border: 1.5px solid ${p => p.$correct ? theme.colors.success : theme.colors.error};
  animation: ${slideUp} 0.35s ease;
`;

const FeedbackTitle = styled.div<{ $correct: boolean }>`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  font-weight: ${theme.typography.fontWeight.bold};
  font-size: ${theme.typography.fontSize.md};
  color: ${p => p.$correct ? '#00703F' : '#B00000'};
  margin-bottom: ${theme.spacing[3]};
`;

const FeedbackText = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
`;

const APABadge = styled.div`
  display: inline-flex; align-items: center; gap: ${theme.spacing[1]};
  margin-top: ${theme.spacing[3]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.radius.full};
  background: ${theme.colors.neutral[100]};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.muted};
  font-style: italic;
`;

const ActionRow = styled.div`
  display: flex; align-items: center; justify-content: space-between;
  margin-top: ${theme.spacing[6]};
  flex-wrap: wrap;
  gap: ${theme.spacing[3]};
`;

const HintBtn = styled.button`
  display: flex; align-items: center; gap: ${theme.spacing[1]};
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.muted};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  transition: ${theme.transitions.fast};
  &:hover { color: ${theme.colors.primary[600]}; background: ${theme.colors.primary[50]}; }
`;

const SubmitBtn = styled.button<{ $disabled: boolean }>`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${p => p.$disabled ? theme.colors.neutral[200] : theme.gradients.brand};
  color: ${p => p.$disabled ? theme.colors.text.muted : 'white'};
  cursor: ${p => p.$disabled ? 'not-allowed' : 'pointer'};
  transition: ${theme.transitions.fast};
  box-shadow: ${p => p.$disabled ? 'none' : theme.shadows.brand};
  &:hover:not(:disabled) { transform: translateY(-1px); }
`;

const NextBtn = styled.button`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${theme.gradients.accent};
  color: #003326;
  cursor: pointer;
  transition: ${theme.transitions.fast};
  &:hover { transform: translateY(-1px); box-shadow: ${theme.shadows.accent}; }
`;

// ─── COMPONENT ────────────────────────────────────────────────────
const LETTERS = ['A','B','C','D','E','F'];

const ExerciseEngine: React.FC<Props> = ({ exercise, onSubmit, onNext, exerciseNumber, total }) => {
  const [selected,   setSelected]   = useState<number | null>(null);
  const [textAnswer, setTextAnswer] = useState('');
  const [orderedWords,setOrderedWords]=useState<string[]>([]);
  const [usedIndices,setUsedIndices] = useState<number[]>([]);
  const [result,     setResult]     = useState<SubmitResult | null>(null);
  const [loading,    setLoading]    = useState(false);
  const [showHint,   setShowHint]   = useState(false);
  const [shaking,    setShaking]    = useState(false);

  const isMulti = ['multiple_choice','fill_blank','tone_match'].includes(exercise.type);
  const isText  = exercise.type === 'translation';
  const isOrder = exercise.type === 'reorder';

  const canSubmit = result === null && (
    isMulti  ? selected !== null :
    isText   ? textAnswer.trim().length > 3 :
    isOrder  ? orderedWords.length > 0 : false
  );

  const handleSubmit = useCallback(async () => {
    if (!canSubmit || loading) return;
    setLoading(true);
    try {
      const answer = isMulti  ? selected! :
                     isText   ? textAnswer.trim() :
                     orderedWords.join(' ');
      const res = await onSubmit(answer);
      setResult(res);
      if (!res.correct) { setShaking(true); setTimeout(() => setShaking(false), 400); }
    } catch { /* handle silently */ }
    finally { setLoading(false); }
  }, [canSubmit, loading, isMulti, isText, selected, textAnswer, orderedWords, onSubmit]);

  const handleWordClick = (word: string, idx: number) => {
    if (usedIndices.includes(idx)) return;
    setOrderedWords(p => [...p, word]);
    setUsedIndices(p => [...p, idx]);
  };

  const handleRemoveWord = (pos: number) => {
    const wordToRemove = orderedWords[pos];
    const originalIdx  = (exercise.words || []).findIndex((w, i) => w === wordToRemove && !usedIndices.slice(0, usedIndices.indexOf(i)).includes(i));
    setOrderedWords(p => p.filter((_,i) => i !== pos));
    setUsedIndices(p  => { const c=[...p]; c.splice(c.indexOf(originalIdx),1); return c; });
  };

  const handleReset = () => {
    setSelected(null); setTextAnswer(''); setOrderedWords([]); setUsedIndices([]);
    setResult(null); setShowHint(false);
  };

  const pct = (exerciseNumber / total) * 100;
  const hint = exercise.hint || exercise.tip;

  return (
    <Card>
      <Header>
        <PhaseTag $phase={exercise.phase}>
          {exercise.phase === 'A' ? '⚡ Adquirir' : '🎯 Praticar'}
        </PhaseTag>
        <Progress>
          <ProgressBar><ProgressFill $pct={pct}/></ProgressBar>
          {exerciseNumber}/{total}
        </Progress>
      </Header>

      {/* Question */}
      <QuestionText>
        {exercise.question || exercise.instruction || exercise.prompt}
      </QuestionText>

      {/* Source text for translation */}
      {isText && exercise.source && <SourceText>"{exercise.source}"</SourceText>}

      {/* Sentence with blank */}
      {exercise.sentence && (
        <SourceText style={{ fontStyle:'normal', borderLeftColor: theme.colors.accent[500] }}>
          {exercise.sentence}
        </SourceText>
      )}

      {/* ── Multiple choice options ── */}
      {isMulti && exercise.options && (
        <OptionsGrid $shake={shaking}>
          {exercise.options.map((opt, i) => {
            let state: 'idle'|'selected'|'correct'|'wrong' = 'idle';
            if (result) {
              if (i === exercise.correct) state = 'correct';
              else if (i === selected)    state = 'wrong';
            } else if (i === selected)   state = 'selected';

            return (
              <OptionBtn key={i} $state={state} onClick={() => !result && setSelected(i)} disabled={!!result}>
                <OptionLetter>{LETTERS[i]}</OptionLetter>
                {opt}
                {result && i === exercise.correct && <CheckCircle2 size={18} color={theme.colors.success} style={{ marginLeft:'auto' }}/>}
                {result && i === selected && i !== exercise.correct && <XCircle size={18} color={theme.colors.error} style={{ marginLeft:'auto' }}/>}
              </OptionBtn>
            );
          })}
        </OptionsGrid>
      )}

      {/* ── Reorder ── */}
      {isOrder && exercise.words && (
        <>
          <SentenceArea onClick={() => {}}>
            {orderedWords.length === 0 && <span style={{ opacity:.5 }}>Clique nas palavras abaixo para montar a frase...</span>}
            {orderedWords.map((w,i) => (
              <Word key={i} $used={false} onClick={() => !result && handleRemoveWord(i)} title="Remover">
                {w}
              </Word>
            ))}
          </SentenceArea>
          <p style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, marginBottom: theme.spacing[4], marginTop: theme.spacing[2] }}>
            Clique numa palavra abaixo para adicioná-la, ou na palavra acima para removê-la.
          </p>
          <WordBank>
            {exercise.words.map((w,i) => (
              <Word key={i} $used={usedIndices.includes(i)} onClick={() => !result && handleWordClick(w,i)}>
                {w}
              </Word>
            ))}
          </WordBank>
        </>
      )}

      {/* ── Translation ── */}
      {isText && (
        <TextInput
          placeholder="Escreva sua tradução em inglês..."
          value={textAnswer}
          onChange={e => setTextAnswer(e.target.value)}
          disabled={!!result}
        />
      )}

      {/* ── Feedback ── */}
      <AnimatePresence>
        {result && (
          <FeedbackBox
            $correct={result.correct}
            initial={{ opacity:0, y:10 }}
            animate={{ opacity:1, y:0 }}
            exit={{ opacity:0 }}
            transition={{ duration:0.3 }}
          >
            <FeedbackTitle $correct={result.correct}>
              {result.correct
                ? <><CheckCircle2 size={20}/> Correto! 🎉</>
                : <><XCircle size={20}/> Não desta vez</>}
            </FeedbackTitle>
            <FeedbackText>{result.feedback}</FeedbackText>
            {!result.correct && result.correctAnswer && (
              <FeedbackText style={{ marginTop: theme.spacing[2], fontWeight:'600' }}>
                ✅ Resposta: <em>{result.correctAnswer}</em>
              </FeedbackText>
            )}
            <APABadge>🔄 {result.nextStep}</APABadge>
          </FeedbackBox>
        )}
      </AnimatePresence>

      {/* ── Actions ── */}
      <ActionRow>
        <div style={{ display:'flex', gap: theme.spacing[2] }}>
          {hint && !result && (
            <HintBtn onClick={() => setShowHint(v=>!v)}>
              <Lightbulb size={14}/> {showHint ? 'Esconder dica' : 'Ver dica'}
            </HintBtn>
          )}
          {result && (
            <HintBtn onClick={handleReset}>
              <RotateCcw size={14}/> Tentar novamente
            </HintBtn>
          )}
        </div>

        {!result ? (
          <SubmitBtn $disabled={!canSubmit || loading} onClick={handleSubmit} disabled={!canSubmit || loading}>
            {loading ? 'Verificando...' : 'Verificar resposta'}
            <ChevronRight size={16}/>
          </SubmitBtn>
        ) : (
          <NextBtn onClick={onNext}>
            Próximo exercício <ChevronRight size={16}/>
          </NextBtn>
        )}
      </ActionRow>

      {/* Hint */}
      <AnimatePresence>
        {showHint && hint && (
          <motion.div
            initial={{ opacity:0, height:0 }}
            animate={{ opacity:1, height:'auto' }}
            exit={{ opacity:0, height:0 }}
            style={{ overflow:'hidden', marginTop: theme.spacing[3] }}
          >
            <div style={{ padding: theme.spacing[3], background: 'rgba(255,149,0,0.08)', borderRadius: theme.radius.md, border:'1px solid rgba(255,149,0,0.2)', fontSize: theme.typography.fontSize.sm, color: '#7A4000', display:'flex', gap: theme.spacing[2] }}>
              <Lightbulb size={15} color="#FF9500"/> {hint}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ExerciseEngine;
