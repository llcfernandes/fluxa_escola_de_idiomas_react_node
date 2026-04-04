import React, { useState, useCallback, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Trophy, RotateCcw, Home } from 'lucide-react';
import { theme } from '@/styles/theme';
import ExerciseEngine, { Exercise } from '@/components/exercises/ExerciseEngine';
import Mascot, { MascotMood } from '@/components/mascot/Mascot';
import PageLoader from '@/components/layout/PageLoader';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api.service';

const Wrap = styled.div`
  min-height: 100vh;
  background: ${theme.colors.bg.subtle};
  padding-top: 90px;
  padding-bottom: ${theme.spacing[20]};
`;

const Header = styled.div`
  max-width: 760px; margin: 0 auto;
  padding: 0 ${theme.spacing[6]} ${theme.spacing[8]};
  display: flex; align-items: center; gap: ${theme.spacing[4]};
  flex-wrap: wrap;
`;

const BackBtn = styled(Link)`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.secondary};
  text-decoration: none;
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  transition: ${theme.transitions.fast};
  &:hover { background: ${theme.colors.neutral[200]}; color: ${theme.colors.text.primary}; }
`;

const CourseTag = styled.div`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.radius.full};
  background: white;
  border: 1px solid ${theme.colors.border.light};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${theme.colors.text.primary};
  box-shadow: ${theme.shadows.xs};
`;

const Content = styled.div`
  max-width: 760px; margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  display: flex; flex-direction: column; align-items: center;
  gap: ${theme.spacing[8]};
`;

const MascotRow = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: ${theme.spacing[3]};
`;

const SpeechBubble = styled(motion.div)`
  background: white;
  border-radius: ${theme.radius.xl};
  border-radius: ${theme.radius.xl} ${theme.radius.xl} ${theme.radius.xl} ${theme.radius.sm};
  padding: ${theme.spacing[3]} ${theme.spacing[5]};
  box-shadow: ${theme.shadows.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  max-width: 300px;
  text-align: center;
  border: 1px solid ${theme.colors.border.light};
`;

const ResultCard = styled(motion.div)`
  background: white;
  border-radius: ${theme.radius['2xl']};
  padding: ${theme.spacing[10]};
  box-shadow: ${theme.shadows.xl};
  border: 1px solid ${theme.colors.border.light};
  text-align: center;
  max-width: 560px;
  width: 100%;
`;

const ScoreBig = styled.div<{ $pct: number }>`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['8xl']};
  font-weight: ${theme.typography.fontWeight.black};
  line-height: 1;
  background: ${p => p.$pct >= 80
    ? theme.gradients.phaseAply
    : p.$pct >= 50
    ? theme.gradients.phaseP
    : theme.gradients.brand};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: ${theme.spacing[4]} 0;
`;

const ScoreLabel = styled.p`
  font-size: ${theme.typography.fontSize.md};
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing[6]};
`;

const ResultActions = styled.div`
  display: flex; gap: ${theme.spacing[3]}; justify-content: center; flex-wrap: wrap;
  margin-top: ${theme.spacing[8]};
`;

const BtnAction = styled.button<{ $variant?: 'primary'|'ghost' }>`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[3]} ${theme.spacing[6]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  cursor: pointer;
  transition: ${theme.transitions.fast};
  background: ${p => p.$variant === 'primary' ? theme.gradients.brand : 'transparent'};
  color: ${p => p.$variant === 'primary' ? 'white' : theme.colors.text.secondary};
  border: ${p => p.$variant === 'primary' ? 'none' : `1.5px solid ${theme.colors.border.medium}`};
  box-shadow: ${p => p.$variant === 'primary' ? theme.shadows.brand : 'none'};
  &:hover { transform: translateY(-1px); }
`;

// ─── MASCOT MESSAGES ──────────────────────────────────────────────
const messages = {
  start:   '🚀 Vamos começar! Lembre-se: errar faz parte do Método APA.',
  correct: ['Perfeito! 🎉 Continue assim!','Excelente! Seu cérebro está absorvendo!','Isso! Você está no ritmo certo.'],
  wrong:   ['Não desta vez... mas cada erro é um Ajuste!','O erro te ensina mais que o acerto. Confere a explicação!','Ótima tentativa! Revise e tente novamente.'],
  done:    '🏆 Sessão concluída! Seu progresso foi salvo.',
};

const getRandMsg = (arr: string[]) => arr[Math.floor(Math.random()*arr.length)];

// ─── COMPONENT ────────────────────────────────────────────────────
const LearnPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const { isAuthenticated } = useAuth();

  const [exercises, setExercises]   = useState<Exercise[]>([]);
  const [loading,   setLoading]     = useState(true);
  const [error,     setError]       = useState('');
  const [current,   setCurrent]     = useState(0);
  const [score,     setScore]       = useState(0);
  const [done,      setDone]        = useState(false);
  const [mood,      setMood]        = useState<MascotMood>('happy');
  const [bubble,    setBubble]      = useState(messages.start);
  const [courseName,setCourseName]  = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get(`/courses/${slug}`);
        setCourseName(res.data.data?.course?.language || '');
        const exRes = await api.get(`/learn/${slug}/exercises`);
        setExercises(Array.isArray(exRes.data.data?.exercises) ? exRes.data.data.exercises : []);
      } catch { setError('Exercícios não encontrados.'); }
      finally { setLoading(false); }
    };
    if (slug) load();
  }, [slug]);

  const handleSubmit = useCallback(async (answer: string|number) => {
    const ex = exercises[current];
    try {
      const res = await api.post(`/learn/${slug}/exercises/${ex.id}/answer`, { answer });
      const result = res.data.data;
      if (result.correct) {
        setScore(s => s+1);
        setMood('correct');
        setBubble(getRandMsg(messages.correct));
      } else {
        setMood('wrong');
        setBubble(getRandMsg(messages.wrong));
      }
      return result;
    } catch {
      return { correct:false, feedback:'Erro ao verificar. Tente novamente.', nextStep:'' };
    }
  }, [exercises, current, slug]);

  const handleNext = useCallback(() => {
    if (current + 1 >= exercises.length) {
      setDone(true);
      setMood('excited');
      setBubble(messages.done);
    } else {
      setCurrent(c => c+1);
      setMood('happy');
      setBubble('');
    }
  }, [current, exercises.length]);

  const handleRestart = () => {
    setCurrent(0); setScore(0); setDone(false);
    setMood('happy'); setBubble(messages.start);
  };

  if (loading) return <PageLoader minimal/>;
  if (error)   return (
    <Wrap>
      <Content style={{ paddingTop: theme.spacing[16], textAlign:'center' }}>
        <Mascot size={100} mood="thinking"/>
        <p style={{ color: theme.colors.text.muted, marginTop: theme.spacing[4] }}>{error}</p>
        <Link to="/cursos" style={{ color: theme.colors.primary[600], fontWeight:'600', marginTop: theme.spacing[4], display:'block' }}>
          ← Voltar aos cursos
        </Link>
      </Content>
    </Wrap>
  );

  const pct = exercises.length ? Math.round((score/exercises.length)*100) : 0;

  return (
    <Wrap>
      <Header>
        <BackBtn to={`/cursos/${slug}`}><ArrowLeft size={16}/> Voltar ao curso</BackBtn>
        {courseName && <CourseTag>📚 Praticando: {courseName}</CourseTag>}
        {!isAuthenticated && (
          <div style={{ fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted, background: 'rgba(255,149,0,0.1)', border:'1px solid rgba(255,149,0,0.2)', borderRadius: theme.radius.md, padding:`${theme.spacing[2]} ${theme.spacing[3]}` }}>
            ⚠️ Faça login para salvar seu progresso.
          </div>
        )}
      </Header>

      <Content>
        {/* Mascot + speech bubble */}
        <MascotRow>
          <Mascot size={100} mood={mood} animate={mood==='idle'||mood==='happy'}/>
          <AnimatePresence mode="wait">
            {bubble && (
              <SpeechBubble
                key={bubble}
                initial={{ opacity:0, y:8, scale:0.95 }}
                animate={{ opacity:1, y:0, scale:1 }}
                exit={{ opacity:0, y:-8 }}
                transition={{ duration:0.3 }}
              >
                {bubble}
              </SpeechBubble>
            )}
          </AnimatePresence>
        </MascotRow>

        {/* Exercise or Result */}
        <AnimatePresence mode="wait">
          {!done ? (
            exercises[current] && (
              <motion.div
                key={current}
                initial={{ opacity:0, x:30 }}
                animate={{ opacity:1, x:0 }}
                exit={{ opacity:0, x:-30 }}
                transition={{ duration:0.3 }}
                style={{ width:'100%', display:'flex', justifyContent:'center' }}
              >
                <ExerciseEngine
                  exercise={exercises[current]}
                  onSubmit={handleSubmit}
                  onNext={handleNext}
                  exerciseNumber={current+1}
                  total={exercises.length}
                />
              </motion.div>
            )
          ) : (
            <ResultCard
              initial={{ opacity:0, scale:0.9 }}
              animate={{ opacity:1, scale:1 }}
              transition={{ type:'spring', stiffness:260, damping:20 }}
            >
              <Trophy size={48} color={theme.colors.accent[500]} style={{ margin:'0 auto' }}/>
              <h2 style={{ fontFamily:`'Clash Display', ${theme.typography.fontFamily.display}`, fontSize: theme.typography.fontSize['3xl'], marginTop: theme.spacing[4], letterSpacing:'-0.02em' }}>
                Sessão concluída!
              </h2>
              <ScoreBig $pct={pct}>{pct}%</ScoreBig>
              <ScoreLabel>
                {score} de {exercises.length} corretas · {pct >= 80 ? '🏆 Excelente' : pct >= 50 ? '👍 Bom progresso' : '💪 Continue praticando'}
              </ScoreLabel>

              {/* APA feedback */}
              <div style={{ background: theme.colors.bg.subtle, borderRadius: theme.radius.xl, padding: theme.spacing[5], textAlign:'left' }}>
                <p style={{ fontSize: theme.typography.fontSize.sm, fontWeight:'700', marginBottom: theme.spacing[2] }}>
                  🔄 Ciclo APA — o que fazer agora:
                </p>
                <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, lineHeight: theme.typography.lineHeight.relaxed }}>
                  {pct >= 80
                    ? 'Ótimo! Fase "Aplicar": tente usar essas estruturas em conversação real hoje.'
                    : pct >= 50
                    ? 'Fase "Ajustar": revise os exercícios que errou e repita a sessão amanhã.'
                    : 'Fase "Adquirir": volte ao conteúdo do módulo antes de praticar novamente.'}
                </p>
              </div>

              <ResultActions>
                <BtnAction onClick={handleRestart}>
                  <RotateCcw size={16}/> Repetir sessão
                </BtnAction>
                <BtnAction $variant="primary" onClick={() => navigate(`/cursos/${slug}`)}>
                  <Home size={16}/> Voltar ao curso
                </BtnAction>
              </ResultActions>
            </ResultCard>
          )}
        </AnimatePresence>
      </Content>
    </Wrap>
  );
};

export default LearnPage;
