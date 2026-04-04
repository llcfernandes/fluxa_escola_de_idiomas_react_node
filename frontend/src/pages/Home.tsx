import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Users, Target, CheckCircle2, Star, TrendingUp, Play } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { theme } from '@/styles/theme';
import Mascot from '@/components/mascot/Mascot';
import CoursePlaceholder from '@/components/ui/CoursePlaceholder';
import PageLoader from '@/components/layout/PageLoader';
import { useCourses, useFeaturedTestimonials } from '@/hooks/useCourses';

// ─── ANIMATIONS ───────────────────────────────────────────────────
const gradMove = keyframes`0%,100%{background-position:0% 50%}50%{background-position:100% 50%}`;
const scanline = keyframes`0%{transform:translateY(-100%)}100%{transform:translateY(100vh)}`;

// ─── HERO ─────────────────────────────────────────────────────────
const HeroSection = styled.section`
  min-height: 100vh;
  background: ${theme.colors.bg.dark};
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  padding: 100px 0 80px;

  /* Grid texture */
  &::before {
    content: '';
    position: absolute; inset: 0;
    background-image:
      linear-gradient(rgba(0,102,255,0.06) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,102,255,0.06) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Ambient glows */
  &::after {
    content: '';
    position: absolute;
    top: 20%; left: -10%;
    width: 60vw; height: 60vh;
    background: radial-gradient(ellipse, rgba(0,102,255,0.14) 0%, transparent 65%);
    pointer-events: none;
  }
`;

const HeroGlow = styled.div`
  position: absolute;
  top: 10%; right: -5%;
  width: 50vw; height: 60vh;
  background: radial-gradient(ellipse, rgba(0,229,160,0.08) 0%, transparent 65%);
  pointer-events: none;
`;

const HeroInner = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 ${theme.spacing[6]};
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${theme.spacing[12]};
  align-items: center;
  position: relative; z-index: 1;

  @media (max-width: ${theme.breakpoints.lg}) {
    grid-template-columns: 1fr;
    text-align: center;
  }
`;

const HeroEyebrow = styled(motion.div)`
  display: inline-flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]} ${theme.spacing[1]} ${theme.spacing[2]};
  border-radius: ${theme.radius.full};
  background: rgba(0,102,255,0.15);
  border: 1px solid rgba(0,102,255,0.3);
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: ${theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  color: ${theme.colors.primary[300]};
  margin-bottom: ${theme.spacing[6]};
`;

const GreenDot = styled.span`
  width: 8px; height: 8px;
  border-radius: 50%;
  background: ${theme.colors.accent[400]};
  box-shadow: 0 0 8px ${theme.colors.accent[400]};
  flex-shrink: 0;
`;

const HeroH1 = styled(motion.h1)`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: clamp(2.6rem, 5.5vw, 5rem);
  font-weight: ${theme.typography.fontWeight.black};
  color: white;
  line-height: 1.08;
  letter-spacing: -0.03em;
  margin-bottom: ${theme.spacing[6]};
`;

const GradSpan = styled.span`
  background: linear-gradient(135deg, ${theme.colors.primary[400]} 0%, ${theme.colors.accent[400]} 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const HeroDesc = styled(motion.p)`
  font-size: ${theme.typography.fontSize.lg};
  color: rgba(255,255,255,0.6);
  line-height: ${theme.typography.lineHeight.relaxed};
  margin-bottom: ${theme.spacing[8]};
  max-width: 500px;
  @media (max-width: ${theme.breakpoints.lg}) { margin-inline: auto; }
`;

const HeroBtns = styled(motion.div)`
  display: flex; gap: ${theme.spacing[3]}; flex-wrap: wrap;
  @media (max-width: ${theme.breakpoints.lg}) { justify-content: center; }
`;

const BtnPrimary = styled(Link)`
  display: inline-flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[7]};
  border-radius: ${theme.radius.lg};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${theme.gradients.brand};
  color: white;
  text-decoration: none;
  box-shadow: ${theme.shadows.brand};
  transition: ${theme.transitions.spring};
  &:hover { transform: translateY(-2px); box-shadow: 0 14px 36px rgba(0,102,255,0.42); }
`;

const BtnSecondary = styled(Link)`
  display: inline-flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[4]} ${theme.spacing[6]};
  border-radius: ${theme.radius.lg};
  font-size: ${theme.typography.fontSize.md};
  font-weight: ${theme.typography.fontWeight.semibold};
  border: 1.5px solid rgba(255,255,255,0.18);
  color: rgba(255,255,255,0.8);
  text-decoration: none;
  transition: ${theme.transitions.fast};
  &:hover { border-color: rgba(255,255,255,0.45); color: white; background: rgba(255,255,255,0.06); }
`;

const HeroStats = styled(motion.div)`
  display: grid; grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[4]};
  margin-top: ${theme.spacing[10]};
  padding-top: ${theme.spacing[8]};
  border-top: 1px solid rgba(255,255,255,0.08);
  @media (max-width: ${theme.breakpoints.lg}) { max-width: 400px; margin-inline: auto; }
`;

const StatBlock = styled.div`
  text-align: center;
`;
const StatVal = styled.div`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['3xl']};
  font-weight: ${theme.typography.fontWeight.black};
  background: linear-gradient(135deg, #fff 0%, rgba(255,255,255,0.65) 100%);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  line-height: 1;
`;
const StatLbl = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: rgba(255,255,255,0.4);
  margin-top: ${theme.spacing[1]};
  font-weight: ${theme.typography.fontWeight.medium};
`;

const HeroVisual = styled(motion.div)`
  position: relative;
  display: flex; align-items: center; justify-content: center;
  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

// ─── SECTION PRIMITIVES ───────────────────────────────────────────
const Sec = styled.section<{ $bg?: string }>`
  padding: ${theme.spacing[24]} 0;
  background: ${p => p.$bg || 'transparent'};
  @media (max-width: ${theme.breakpoints.md}) { padding: ${theme.spacing[16]} 0; }
`;

const Wrap = styled.div`
  max-width: 1280px; margin: 0 auto; padding: 0 ${theme.spacing[6]};
  @media (max-width: ${theme.breakpoints.sm}) { padding: 0 ${theme.spacing[4]}; }
`;

const SLabel = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: ${theme.typography.letterSpacing.widest};
  text-transform: uppercase;
  color: ${theme.colors.primary[500]};
  margin-bottom: ${theme.spacing[3]};
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  &::before { content:''; width:20px; height:2px; background:${theme.gradients.brand}; border-radius:1px; }
`;

const SHeading = styled.h2<{ $light?: boolean }>`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: clamp(2rem, 4vw, 3.5rem);
  font-weight: ${theme.typography.fontWeight.black};
  line-height: 1.1;
  letter-spacing: -0.025em;
  color: ${p => p.$light ? 'white' : theme.colors.text.primary};
  margin-bottom: ${theme.spacing[4]};
`;

const SSubtitle = styled.p<{ $light?: boolean }>`
  font-size: ${theme.typography.fontSize.lg};
  color: ${p => p.$light ? 'rgba(255,255,255,0.6)' : theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
  max-width: 560px;
`;

// ─── APA METHOD CARDS ─────────────────────────────────────────────
const MethodGrid = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: ${theme.spacing[6]};
  @media (max-width: ${theme.breakpoints.md}) { grid-template-columns: 1fr; }
`;

const MethodCard = styled(motion.div)<{ $gradient: string }>`
  background: white;
  border-radius: ${theme.radius['2xl']};
  padding: ${theme.spacing[8]};
  box-shadow: ${theme.shadows.lg};
  border: 1px solid ${theme.colors.border.subtle};
  position: relative; overflow: hidden;
  transition: ${theme.transitions.normal};
  &:hover { transform: translateY(-6px); box-shadow: ${theme.shadows['2xl']}; }
  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 4px;
    background: ${p => p.$gradient};
  }
`;

const MethodNum = styled.div`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['7xl']};
  font-weight: ${theme.typography.fontWeight.black};
  color: ${theme.colors.neutral[100]};
  line-height: 1;
  position: absolute;
  bottom: -${theme.spacing[4]};
  right: ${theme.spacing[6]};
  pointer-events: none;
  user-select: none;
`;

const MethodIcon = styled.div<{ $gradient: string }>`
  width: 52px; height: 52px;
  border-radius: ${theme.radius.xl};
  background: ${p => p.$gradient};
  display: flex; align-items: center; justify-content: center;
  margin-bottom: ${theme.spacing[5]};
  color: white;
`;

// ─── COURSE CARDS ─────────────────────────────────────────────────
const CourseGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${theme.spacing[6]};
  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; }
`;

const CourseCard = styled(motion.article)`
  background: white;
  border-radius: ${theme.radius['2xl']};
  overflow: hidden;
  box-shadow: ${theme.shadows.md};
  border: 1px solid ${theme.colors.border.light};
  transition: ${theme.transitions.normal};
  display: flex; flex-direction: column;
  &:hover { transform: translateY(-6px); box-shadow: ${theme.shadows.xl}; border-color: ${theme.colors.border.brand}; }
`;

const CourseThumb = styled.div`
  height: 180px; overflow: hidden; position: relative;
`;

const CourseBadge = styled.div<{ $color: string }>`
  position: absolute; top:12px; right:12px;
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.radius.full};
  font-size: ${theme.typography.fontSize['2xs']};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: ${theme.typography.letterSpacing.wide};
  text-transform: uppercase;
  background: ${p => p.$color};
  color: white;
`;

const CourseBody = styled.div`
  padding: ${theme.spacing[5]};
  flex: 1; display: flex; flex-direction: column;
`;

const CourseTitle = styled.h3`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize['2xl']};
  color: ${theme.colors.text.primary};
  margin-bottom: ${theme.spacing[2]};
  letter-spacing: -0.02em;
`;

const CourseDesc = styled.p`
  font-size: ${theme.typography.fontSize.sm};
  color: ${theme.colors.text.secondary};
  line-height: ${theme.typography.lineHeight.relaxed};
  flex: 1;
`;

const CourseMeta = styled.div`
  display: flex; justify-content: space-between; align-items: center;
  margin-top: ${theme.spacing[4]};
  padding-top: ${theme.spacing[4]};
  border-top: 1px solid ${theme.colors.border.subtle};
`;

const CoursePrice = styled.div`
  font-size: ${theme.typography.fontSize.xs};
  color: ${theme.colors.text.muted};
  span {
    display: block;
    font-family: 'Clash Display', ${theme.typography.fontFamily.display};
    font-size: ${theme.typography.fontSize.xl};
    font-weight: ${theme.typography.fontWeight.bold};
    color: ${theme.colors.primary[600]};
    letter-spacing: -0.02em;
    line-height: 1;
  }
`;

const CourseCta = styled(Link)`
  display: inline-flex; align-items: center; gap: ${theme.spacing[1]};
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  background: ${theme.gradients.brand};
  color: white;
  text-decoration: none;
  transition: ${theme.transitions.fast};
  svg { transition: ${theme.transitions.fast}; }
  &:hover { box-shadow: ${theme.shadows.brand}; svg { transform: translateX(3px); } }
`;

// ─── TESTIMONIALS ─────────────────────────────────────────────────
const TestiGrid = styled.div`
  display: grid; grid-template-columns: repeat(3,1fr);
  gap: ${theme.spacing[6]};
  @media (max-width: ${theme.breakpoints.lg}) { grid-template-columns: repeat(2,1fr); }
  @media (max-width: ${theme.breakpoints.sm}) { grid-template-columns: 1fr; }
`;

const TestiCard = styled(motion.div)`
  background: ${theme.colors.bg.darkSurf};
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: ${theme.radius['2xl']};
  padding: ${theme.spacing[6]};
  transition: ${theme.transitions.normal};
  &:hover { transform: translateY(-4px); border-color: rgba(0,102,255,0.25); }
`;

const TestiResult = styled.div`
  display: inline-flex; align-items: center; gap: ${theme.spacing[1]};
  padding: ${theme.spacing[1]} ${theme.spacing[3]};
  border-radius: ${theme.radius.full};
  background: rgba(0,229,160,0.12);
  color: ${theme.colors.accent[400]};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  margin-bottom: ${theme.spacing[4]};
`;

// ─── CTA ──────────────────────────────────────────────────────────
const CtaSec = styled.section`
  padding: ${theme.spacing[24]} 0;
  background: ${theme.colors.bg.dark};
  position: relative; overflow: hidden;
  text-align: center;
  &::before { content:''; position:absolute; inset:0; background:${theme.gradients.mesh}; opacity:0.5; }
`;

// ─── STAGGER VARIANTS ─────────────────────────────────────────────
const stagger = { animate: { transition: { staggerChildren: 0.1 } } };
const fadeUp  = { initial:{opacity:0,y:24}, animate:{opacity:1,y:0,transition:{duration:0.55}} };

// ─── COMPONENT ────────────────────────────────────────────────────
const Home: React.FC = () => {
  const { t } = useTranslation();
  const { courses, loading } = useCourses();
  const { testimonials }     = useFeaturedTestimonials();
  const featured = (courses || []).filter(c => c.featured).slice(0,3);

  return (
    <>
      {/* ── HERO ── */}
      <HeroSection>
        <HeroGlow/>
        <HeroInner>
          <motion.div variants={stagger} initial="initial" animate="animate">
            <HeroEyebrow variants={fadeUp}>
              <GreenDot/> Método APA — 2026
            </HeroEyebrow>
            <HeroH1 variants={fadeUp}>
              Aprenda idiomas do jeito que seu<br/>
              <GradSpan>cérebro foi feito</GradSpan> para aprender
            </HeroH1>
            <HeroDesc variants={fadeUp}>
              O Ciclo APA — Adquirir, Praticar, Ajustar — não é mais um curso de idiomas.
              É o processo natural que seu cérebro usa desde que você era criança.
              Só que agora, acelerado.
            </HeroDesc>
            <HeroBtns variants={fadeUp}>
              <BtnPrimary to="/cadastro">
                Começar de graça <ArrowRight size={18}/>
              </BtnPrimary>
              <BtnSecondary to="/metodo">
                <Play size={16}/> Ver o Método
              </BtnSecondary>
            </HeroBtns>
            <HeroStats variants={fadeUp}>
              {[
                { val:'5.200+', lbl:'Alunos ativos' },
                { val:'4.9★',   lbl:'Avaliação média' },
                { val:'6',      lbl:'Idiomas' },
              ].map((s,i)=>(
                <StatBlock key={i}>
                  <StatVal>{s.val}</StatVal>
                  <StatLbl>{s.lbl}</StatLbl>
                </StatBlock>
              ))}
            </HeroStats>
          </motion.div>

          <HeroVisual
            initial={{ opacity:0, scale:0.9 }}
            animate={{ opacity:1, scale:1 }}
            transition={{ duration:0.8, delay:0.3 }}
          >
            {/* Central mascot with floating cards */}
            <div style={{ position:'relative', width:'380px', height:'420px', display:'flex', alignItems:'center', justifyContent:'center' }}>
              <Mascot size={200} mood="excited"/>

              {/* Float card 1 */}
              <motion.div
                animate={{ y:[0,-8,0] }}
                transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
                style={{
                  position:'absolute', top:'10%', left:'-5%',
                  background:'white', borderRadius: theme.radius.xl,
                  padding:`${theme.spacing[3]} ${theme.spacing[4]}`,
                  boxShadow: theme.shadows.xl,
                  display:'flex', alignItems:'center', gap: theme.spacing[2],
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight:'600', color: theme.colors.text.primary,
                  whiteSpace:'nowrap',
                }}
              >
                <CheckCircle2 size={16} color={theme.colors.success}/> 98% de aprovação
              </motion.div>

              {/* Float card 2 */}
              <motion.div
                animate={{ y:[0,8,0] }}
                transition={{ duration:3.5, delay:0.5, repeat:Infinity, ease:'easeInOut' }}
                style={{
                  position:'absolute', bottom:'18%', right:'-8%',
                  background:'white', borderRadius: theme.radius.xl,
                  padding:`${theme.spacing[3]} ${theme.spacing[4]}`,
                  boxShadow: theme.shadows.xl,
                  display:'flex', alignItems:'center', gap: theme.spacing[2],
                  fontSize: theme.typography.fontSize.sm,
                  fontWeight:'600', color: theme.colors.text.primary,
                  whiteSpace:'nowrap',
                }}
              >
                <TrendingUp size={16} color={theme.colors.primary[500]}/> Fluência em 18 meses
              </motion.div>

              {/* APA cycle badge */}
              <motion.div
                animate={{ rotate:[0,360] }}
                transition={{ duration:20, repeat:Infinity, ease:'linear' }}
                style={{
                  position:'absolute', bottom:'5%', left:'5%',
                  width:70, height:70,
                  borderRadius:'50%',
                  border:`2px solid ${theme.colors.primary[200]}`,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  background: theme.colors.primary[50],
                  fontSize:'10px', fontWeight:'800',
                  color: theme.colors.primary[600],
                  letterSpacing:'1px',
                  flexDirection:'column',
                }}
              >
                <div>APA</div>
                <div style={{ fontSize:'7px', opacity:0.6 }}>CYCLE</div>
              </motion.div>
            </div>
          </HeroVisual>
        </HeroInner>
      </HeroSection>

      {/* ── APA METHOD ── */}
      <Sec>
        <Wrap>
          <div style={{ textAlign:'center', marginBottom: theme.spacing[12] }}>
            <SLabel style={{ justifyContent:'center' }}>Metodologia</SLabel>
            <SHeading>Como o Ciclo APA funciona</SHeading>
            <SSubtitle style={{ margin:`0 auto` }}>
              Três fases interligadas que respeitam como o cérebro humano realmente adquire uma língua.
              Sem decoreba, sem atalhos falsos.
            </SSubtitle>
          </div>

          <MethodGrid>
            {[
              {
                phase:'A', label:'Adquirir', num:'01',
                gradient: theme.gradients.phaseA,
                icon: <Zap size={24}/>,
                title:'Você absorve, não memoriza',
                desc:'Conteúdo autêntico e contextualizado — podcasts, vídeos, textos reais do seu interesse. Seu cérebro aprende padrões sem saber que está "estudando". A gramática aparece no uso, não em listas.',
              },
              {
                phase:'P', label:'Praticar', num:'02',
                gradient: theme.gradients.phaseP,
                icon: <Users size={24}/>,
                title:'Você ativa o que aprendeu',
                desc:'Exercícios interativos com correção imediata, shadowing, conversação. A prática deliberada transforma conhecimento passivo em habilidade automática — você para de traduzir mentalmente.',
              },
              {
                phase:'A', label:'Ajustar', num:'03',
                gradient: theme.gradients.phaseAply,
                icon: <Target size={24}/>,
                title:'Você identifica e fecha lacunas',
                desc:'O diferencial real: feedback preciso sobre onde você errou e por quê. Cada erro revela uma lacuna específica. Você volta ao Adquirir com intenção cirúrgica. O ciclo se reinicia, mais inteligente.',
              },
            ].map((m,i) => (
              <MethodCard
                key={i} $gradient={m.gradient}
                initial={{ opacity:0, y:32 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ duration:0.55, delay:i*0.15 }}
              >
                <MethodIcon $gradient={m.gradient}>{m.icon}</MethodIcon>
                <h3 style={{ fontFamily:`'Clash Display', ${theme.typography.fontFamily.display}`, fontSize: theme.typography.fontSize['2xl'], fontWeight:'700', marginBottom: theme.spacing[2], letterSpacing:'-0.02em' }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: theme.typography.fontSize.sm, color: theme.colors.text.secondary, lineHeight: theme.typography.lineHeight.relaxed }}>
                  {m.desc}
                </p>
                <MethodNum aria-hidden>{m.num}</MethodNum>
              </MethodCard>
            ))}
          </MethodGrid>
        </Wrap>
      </Sec>

      {/* ── COURSES ── */}
      <Sec $bg={theme.colors.bg.subtle}>
        <Wrap>
          <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', flexWrap:'wrap', gap: theme.spacing[6], marginBottom: theme.spacing[10] }}>
            <div>
              <SLabel>6 idiomas disponíveis</SLabel>
              <SHeading>Escolha seu idioma</SHeading>
              <SSubtitle>Uma metodologia. Seis destinos. Resultados reais.</SSubtitle>
            </div>
            <Link to="/cursos" style={{ display:'flex', alignItems:'center', gap: theme.spacing[1], fontSize: theme.typography.fontSize.sm, fontWeight:'700', color: theme.colors.primary[600], textDecoration:'none' }}>
              Ver todos os 6 idiomas <ArrowRight size={16}/>
            </Link>
          </div>

          {loading ? <PageLoader minimal/> : (
            <CourseGrid>
              {featured.map((c,i) => (
                <CourseCard
                  key={c.id}
                  initial={{ opacity:0, y:24 }}
                  whileInView={{ opacity:1, y:0 }}
                  viewport={{ once:true, margin:'-60px' }}
                  transition={{ duration:0.5, delay:i*0.12 }}
                >
                  <CourseThumb>
                    <CoursePlaceholder
                      language={c.language}
                      color={c.color}
                      flag={c.flag}
                      nativeName={c.nativeName}
                      style={{ width:'100%', height:'180px' }}
                    />
                    {c.badge && <CourseBadge $color={c.color}>{c.badge}</CourseBadge>}
                  </CourseThumb>
                  <CourseBody>
                    <CourseTitle>{c.flag} {c.language}</CourseTitle>
                    <CourseDesc>{c.shortDesc}</CourseDesc>
                    <div style={{ display:'flex', gap: theme.spacing[1], margin:`${theme.spacing[3]} 0`, fontSize: theme.typography.fontSize.xs, color: theme.colors.text.muted }}>
                      <Star size={12} fill="#FF9500" color="#FF9500"/> {c.rating} · {(c.totalStudents ?? 0).toLocaleString()} alunos · {c.duration}
                    </div>
                    <CourseMeta>
                      <CoursePrice>
                        A partir de<span>{c.priceLabel}</span>
                      </CoursePrice>
                      <CourseCta to={`/cursos/${c.slug}`}>
                        Ver curso <ArrowRight size={14}/>
                      </CourseCta>
                    </CourseMeta>
                  </CourseBody>
                </CourseCard>
              ))}
            </CourseGrid>
          )}
        </Wrap>
      </Sec>

      {/* ── TESTIMONIALS ── */}
      <Sec $bg={theme.colors.bg.dark}>
        <Wrap>
          <div style={{ textAlign:'center', marginBottom: theme.spacing[12] }}>
            <SLabel style={{ justifyContent:'center', color: theme.colors.accent[400] }}>
              <span style={{ background: theme.gradients.accent, width:'20px', height:'2px', borderRadius:'1px', display:'inline-block' }}></span>
              Resultados reais
            </SLabel>
            <SHeading $light>Histórias de transformação</SHeading>
            <SSubtitle $light style={{ margin:'0 auto' }}>
              Mais de 5.200 alunos que pararam de estudar idiomas e começaram a vivê-los.
            </SSubtitle>
          </div>

          <TestiGrid>
            {(testimonials || []).map((t,i) => (
              <TestiCard
                key={t.id}
                initial={{ opacity:0, y:24 }}
                whileInView={{ opacity:1, y:0 }}
                viewport={{ once:true, margin:'-60px' }}
                transition={{ duration:0.5, delay:i*0.12 }}
              >
                <TestiResult>
                  <CheckCircle2 size={11}/> {t.result}
                </TestiResult>
                <p style={{ fontSize: theme.typography.fontSize.md, color:'rgba(255,255,255,0.7)', lineHeight: theme.typography.lineHeight.relaxed, fontStyle:'italic', marginBottom: theme.spacing[5] }}>
                  "{t.text}"
                </p>
                <div style={{ display:'flex', gap: theme.spacing[1], marginBottom: theme.spacing[4] }}>
                  {Array.from({length: t.rating ?? 0}).map((_,j)=><Star key={j} size={13} fill="#FF9500" color="#FF9500"/>)}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap: theme.spacing[3] }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background: theme.gradients.brand, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:`'Clash Display', sans-serif`, fontWeight:'700', color:'white', fontSize: theme.typography.fontSize.lg }}>
                    {(t.name || '?')[0]}
                  </div>
                  <div>
                    <div style={{ fontWeight:'700', fontSize: theme.typography.fontSize.sm, color:'white' }}>{t.name}</div>
                    <div style={{ fontSize: theme.typography.fontSize.xs, color:'rgba(255,255,255,0.4)' }}>{t.role} · {t.courseName}</div>
                  </div>
                </div>
              </TestiCard>
            ))}
          </TestiGrid>
        </Wrap>
      </Sec>

      {/* ── CTA ── */}
      <CtaSec>
        <Wrap style={{ position:'relative', zIndex:1 }}>
          <motion.div
            style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: theme.spacing[5] }}
            initial={{ opacity:0, y:24 }}
            whileInView={{ opacity:1, y:0 }}
            viewport={{ once:true }}
            transition={{ duration:0.6 }}
          >
            <Mascot size={110} mood="happy" animate/>
            <div style={{ fontSize: theme.typography.fontSize.xs, fontWeight:'700', letterSpacing: theme.typography.letterSpacing.widest, textTransform:'uppercase', color: theme.colors.accent[400] }}>
              COMECE HOJE
            </div>
            <h2 style={{ fontFamily:`'Clash Display', ${theme.typography.fontFamily.display}`, fontSize:'clamp(2rem,5vw,4rem)', fontWeight:'900', color:'white', lineHeight:'1.08', letterSpacing:'-0.03em', textAlign:'center' }}>
              Sua primeira semana<br/>
              <GradSpan>é completamente grátis</GradSpan>
            </h2>
            <p style={{ fontSize: theme.typography.fontSize.lg, color:'rgba(255,255,255,0.55)', maxWidth:480, textAlign:'center', lineHeight: theme.typography.lineHeight.relaxed }}>
              Sem cartão de crédito. Sem compromisso.<br/>Cancele quando quiser.
            </p>
            <div style={{ display:'flex', gap: theme.spacing[3], flexWrap:'wrap', justifyContent:'center' }}>
              <BtnPrimary to="/cadastro" style={{ fontSize: theme.typography.fontSize.md, padding:`${theme.spacing[4]} ${theme.spacing[8]}` }}>
                Criar conta grátis <ArrowRight size={18}/>
              </BtnPrimary>
              <BtnSecondary to="/contato">
                Falar com consultor
              </BtnSecondary>
            </div>
          </motion.div>
        </Wrap>
      </CtaSec>
    </>
  );
};

export default Home;
