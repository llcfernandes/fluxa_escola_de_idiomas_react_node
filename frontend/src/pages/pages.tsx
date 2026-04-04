import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { Search, ArrowLeft, Star, Clock, Users, Award, ChevronDown, ChevronUp, ArrowRight, Play, Mail, Phone, MapPin, Send, LogIn, UserPlus, BookOpen, Target, CheckCircle2, LogOut } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { theme } from '@/styles/theme';
import { useAuth } from '@/contexts/AuthContext';
import { useCourses, useCourse, useFeaturedTestimonials } from '@/hooks/useCourses';
import { courseService, contactService } from '@/services/api.service';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select } from '@/components/ui/Input';
import Mascot from '@/components/mascot/Mascot';
import CoursePlaceholder from '@/components/ui/CoursePlaceholder';
import PageLoader from '@/components/layout/PageLoader';

// ─── Shared primitives ────────────────────────────────────────────
const Page  = styled(motion.main).attrs(()=>({initial:{opacity:0,y:8},animate:{opacity:1,y:0},exit:{opacity:0,y:-8},transition:{duration:0.3}}))`flex:1;padding-top:68px;`;
const Wrap  = styled.div`max-width:1280px;margin:0 auto;padding:0 ${theme.spacing[6]};@media(max-width:${theme.breakpoints.sm}){padding:0 ${theme.spacing[4]};}`;
const Sec   = styled.section<{$bg?:string}>`padding:${theme.spacing[20]} 0;background:${p=>p.$bg||'transparent'};@media(max-width:${theme.breakpoints.md}){padding:${theme.spacing[14]} 0;}`;
const DarkHero=styled.div`background:${theme.colors.bg.dark};margin-top:-68px;padding:calc(68px + ${theme.spacing[20]}) 0 ${theme.spacing[14]};text-align:center;position:relative;overflow:hidden;&::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,102,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,0.05) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}`;
const SLabel=styled.div`font-size:${theme.typography.fontSize.xs};font-weight:700;letter-spacing:${theme.typography.letterSpacing.widest};text-transform:uppercase;color:${theme.colors.primary[500]};margin-bottom:${theme.spacing[3]};display:flex;align-items:center;gap:${theme.spacing[2]};&::before{content:'';width:18px;height:2px;background:${theme.gradients.brand};border-radius:1px;}`;
const SH    =styled.h2<{$light?:boolean}>`font-family:'Clash Display',${theme.typography.fontFamily.display};font-size:clamp(1.8rem,4vw,3rem);font-weight:900;line-height:1.1;letter-spacing:-0.025em;color:${p=>p.$light?'white':theme.colors.text.primary};margin-bottom:${theme.spacing[3]};`;
const SSub  =styled.p<{$light?:boolean}>`font-size:${theme.typography.fontSize.lg};color:${p=>p.$light?'rgba(255,255,255,0.6)':theme.colors.text.secondary};line-height:1.7;max-width:540px;`;
const GSpan =styled.span`background:linear-gradient(135deg,${theme.colors.primary[500]} 0%,${theme.colors.accent[500]} 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;`;
const G3    =styled.div`display:grid;grid-template-columns:repeat(3,1fr);gap:${theme.spacing[6]};@media(max-width:${theme.breakpoints.lg}){grid-template-columns:repeat(2,1fr);}@media(max-width:${theme.breakpoints.sm}){grid-template-columns:1fr;}`;
const G2    =styled.div`display:grid;grid-template-columns:1fr 1fr;gap:${theme.spacing[10]};align-items:center;@media(max-width:${theme.breakpoints.md}){grid-template-columns:1fr;}`;

// ─── COURSES ──────────────────────────────────────────────────────
export const Courses: React.FC = () => {
  const { courses, loading } = useCourses();
  const [q, setQ] = useState('');
  const filtered = (courses || []).filter(c=>c.language.toLowerCase().includes(q.toLowerCase())||c.shortDesc?.toLowerCase().includes(q.toLowerCase()));

  return (
    <Page>
      <DarkHero>
        <Wrap style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <Mascot size={90} mood="happy"/>
            <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,color:'white',lineHeight:1.1,letterSpacing:'-0.03em',marginTop:theme.spacing[4]}}>
              Escolha seu <GSpan>idioma</GSpan>
            </h1>
            <SSub $light style={{margin:`${theme.spacing[4]} auto 0`}}>6 idiomas. 1 metodologia. Resultados reais.</SSub>
          </motion.div>
        </Wrap>
      </DarkHero>

      <Sec $bg={theme.colors.bg.subtle}>
        <Wrap>
          <div style={{position:'relative',maxWidth:480,margin:`0 auto ${theme.spacing[10]}`,}}>
            <Search size={16} style={{position:'absolute',left:14,top:'50%',transform:'translateY(-50%)',color:theme.colors.text.muted,pointerEvents:'none'}}/>
            <input
              value={q} onChange={e=>setQ(e.target.value)}
              placeholder="Buscar idioma..."
              style={{width:'100%',padding:`${theme.spacing[3]} ${theme.spacing[4]} ${theme.spacing[3]} 44px`,borderRadius:theme.radius.full,border:`1.5px solid ${theme.colors.border.light}`,background:'white',fontSize:theme.typography.fontSize.sm,fontFamily:theme.typography.fontFamily.body,outline:'none',boxShadow:theme.shadows.sm}}
            />
          </div>
          {loading ? <PageLoader minimal/> : filtered.length === 0 ? (
            <div style={{textAlign:'center',padding:`${theme.spacing[16]} 0`}}>
              <Mascot size={80} mood="thinking"/>
              <p style={{marginTop:theme.spacing[4],color:theme.colors.text.muted}}>Nenhum idioma encontrado para "{q}"</p>
            </div>
          ) : (
            <G3>
              {filtered.map((c,i)=>(
                <motion.article key={c.id} initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,margin:'-60px'}} transition={{duration:0.5,delay:i*0.08}}
                  style={{background:'white',borderRadius:theme.radius['2xl'],overflow:'hidden',boxShadow:theme.shadows.md,border:`1px solid ${theme.colors.border.light}`,display:'flex',flexDirection:'column',transition:theme.transitions.normal}}
                  onMouseOver={e=>{(e.currentTarget as HTMLElement).style.transform='translateY(-6px)';(e.currentTarget as HTMLElement).style.boxShadow=theme.shadows.xl;}}
                  onMouseOut={e=>{(e.currentTarget as HTMLElement).style.transform='';(e.currentTarget as HTMLElement).style.boxShadow=theme.shadows.md;}}
                >
                  <div style={{height:180,overflow:'hidden',position:'relative'}}>
                    <CoursePlaceholder language={c.language} color={c.color} flag={c.flag} nativeName={c.nativeName} style={{height:180}}/>
                    {c.badge&&<span style={{position:'absolute',top:12,right:12,padding:`${theme.spacing[1]} ${theme.spacing[3]}`,borderRadius:theme.radius.full,background:c.color,color:'white',fontSize:theme.typography.fontSize['2xs'],fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase'}}>{c.badge}</span>}
                  </div>
                  <div style={{padding:theme.spacing[5],flex:1,display:'flex',flexDirection:'column'}}>
                    <h3 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],fontWeight:700,letterSpacing:'-0.02em',marginBottom:theme.spacing[2]}}>{c.flag} {c.language}</h3>
                    <p style={{fontSize:theme.typography.fontSize.sm,color:theme.colors.text.secondary,lineHeight:1.65,flex:1}}>{c.shortDesc}</p>
                    <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:theme.spacing[4],paddingTop:theme.spacing[4],borderTop:`1px solid ${theme.colors.border.subtle}`}}>
                      <div><div style={{fontSize:theme.typography.fontSize['2xs'],color:theme.colors.text.muted}}>A partir de</div><div style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize.xl,fontWeight:700,color:theme.colors.primary[600],letterSpacing:'-0.02em'}}>{c.priceLabel}</div></div>
                      <Link to={`/cursos/${c.slug}`} style={{display:'flex',alignItems:'center',gap:4,padding:`${theme.spacing[2]} ${theme.spacing[4]}`,borderRadius:theme.radius.md,background:theme.gradients.brand,color:'white',fontSize:theme.typography.fontSize.sm,fontWeight:700,textDecoration:'none'}}>Ver curso <ArrowRight size={14}/></Link>
                    </div>
                  </div>
                </motion.article>
              ))}
            </G3>
          )}
        </Wrap>
      </Sec>
    </Page>
  );
};

// ─── COURSE DETAIL ────────────────────────────────────────────────
export const CourseDetail: React.FC = () => {
  const { slug } = useParams<{slug:string}>();
  const { course, testimonials, loading, error } = useCourse(slug||'');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [enrolling,setEnrolling]=useState(false);
  const [enrolled,setEnrolled]  =useState(false);
  const [openMod,setOpenMod]    =useState<number|null>(0);

  const handleEnroll = async () => {
    if (!isAuthenticated){navigate('/login');return;}
    setEnrolling(true);
    try{await courseService.enroll(slug||'');setEnrolled(true);}catch{}finally{setEnrolling(false);}
  };

  if(loading) return <PageLoader minimal/>;
  if(error||!course) return <Page><Wrap style={{padding:`${theme.spacing[20]} 0`,textAlign:'center'}}><Mascot size={100} mood="thinking"/><p style={{marginTop:theme.spacing[4],color:theme.colors.text.muted}}>Curso não encontrado.</p><Link to="/cursos" style={{color:theme.colors.primary[600],fontWeight:600,marginTop:theme.spacing[6],display:'block'}}>← Ver todos os cursos</Link></Wrap></Page>;

  return (
    <Page>
      {/* Hero */}
      <div style={{height:'52vh',minHeight:400,position:'relative',overflow:'hidden'}}>
        <CoursePlaceholder language={course.language} color={course.color||'#0066FF'} flag={course.flag} nativeName={course.nativeName} style={{width:'100%',height:'100%',position:'absolute',inset:0}}/>
        <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(10,10,15,1) 0%,rgba(10,10,15,0.5) 50%,rgba(10,10,15,0.1) 100%)'}}/>
        <div style={{position:'absolute',bottom:0,left:0,right:0,padding:`0 0 ${theme.spacing[10]}`}}>
          <Wrap>
            <Link to="/cursos" style={{display:'inline-flex',alignItems:'center',gap:6,color:'rgba(255,255,255,0.6)',fontSize:theme.typography.fontSize.sm,textDecoration:'none',marginBottom:theme.spacing[4]}}>
              <ArrowLeft size={15}/> Todos os cursos
            </Link>
            <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,color:'white',lineHeight:1.05,letterSpacing:'-0.03em',marginBottom:theme.spacing[4]}}>
              Curso de <GSpan>{course.language}</GSpan>
            </h1>
            <div style={{display:'flex',gap:theme.spacing[5],flexWrap:'wrap',color:'rgba(255,255,255,0.65)',fontSize:theme.typography.fontSize.sm}}>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Star size={13} fill="#FF9500" color="#FF9500"/>{course.rating} ({course.totalStudents?.toLocaleString()} alunos)</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Clock size={13}/>{course.duration}</span>
              <span style={{display:'flex',alignItems:'center',gap:6}}><Users size={13}/>Até {course.maxStudents} alunos</span>
            </div>
          </Wrap>
        </div>
      </div>

      {/* Body */}
      <Sec $bg={theme.colors.bg.subtle}>
        <Wrap>
          <div style={{display:'grid',gridTemplateColumns:'1fr 360px',gap:theme.spacing[12],alignItems:'start'}}>
            {/* Main */}
            <div style={{display:'flex',flexDirection:'column',gap:theme.spacing[10]}}>
              <section>
                <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginBottom:theme.spacing[4]}}>Sobre o curso</h2>
                <p style={{fontSize:theme.typography.fontSize.md,color:theme.colors.text.secondary,lineHeight:1.8}}>{course.longDesc}</p>
              </section>

              {/* Modules */}
              <section>
                <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginBottom:theme.spacing[5]}}>Módulos do curso</h2>
                <div style={{display:'flex',flexDirection:'column',gap:theme.spacing[3]}}>
                  {course.modules?.map((mod:any,i:number)=>(
                    <div key={i} style={{background:'white',borderRadius:theme.radius.xl,border:`1px solid ${theme.colors.border.light}`,overflow:'hidden'}}>
                      <button onClick={()=>setOpenMod(openMod===i?null:i)} style={{width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:theme.spacing[5],background:'none',border:'none',cursor:'pointer',fontFamily:theme.typography.fontFamily.body,fontSize:theme.typography.fontSize.md,fontWeight:600,textAlign:'left',transition:theme.transitions.fast}}>
                        <div style={{display:'flex',alignItems:'center',gap:theme.spacing[3]}}>
                          <div style={{width:28,height:28,borderRadius:'50%',background:mod.phase==='A'?theme.gradients.phaseA:mod.phase==='P'?theme.gradients.phaseP:theme.gradients.phaseAply,display:'flex',alignItems:'center',justifyContent:'center',color:'white',fontSize:'11px',fontWeight:700,flexShrink:0}}>{i+1}</div>
                          {mod.title}
                        </div>
                        <div style={{display:'flex',alignItems:'center',gap:theme.spacing[3],color:theme.colors.text.muted,fontSize:theme.typography.fontSize.xs}}>
                          <span style={{padding:`${theme.spacing[1]} ${theme.spacing[2]}`,borderRadius:theme.radius.sm,background:`rgba(${mod.phase==='A'?'0,102,255':mod.phase==='P'?'124,58,237':'0,184,127'},0.1)`,color:mod.phase==='A'?theme.colors.primary[600]:mod.phase==='P'?'#7C3AED':theme.colors.accent[700],fontWeight:700}}>
                            {mod.phase==='A'?'Adquirir':mod.phase==='P'?'Praticar':'Aplicar'}
                          </span>
                          {mod.weeks}sem
                          {openMod===i?<ChevronUp size={15}/>:<ChevronDown size={15}/>}
                        </div>
                      </button>
                      {openMod===i&&(
                        <div style={{padding:`0 ${theme.spacing[5]} ${theme.spacing[5]}`,paddingLeft:`calc(${theme.spacing[5]} + 40px)`,fontSize:theme.typography.fontSize.sm,color:theme.colors.text.secondary,lineHeight:1.75}}>
                          {mod.desc}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>

              {/* Certifications */}
              <section>
                <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginBottom:theme.spacing[4]}}>Certificações preparatórias</h2>
                <div style={{display:'flex',gap:theme.spacing[3],flexWrap:'wrap'}}>
                  {course.certifications?.map((cert:string)=>(
                    <div key={cert} style={{display:'flex',alignItems:'center',gap:theme.spacing[2],padding:`${theme.spacing[2]} ${theme.spacing[4]}`,borderRadius:theme.radius.md,background:theme.colors.primary[50],border:`1px solid ${theme.colors.primary[100]}`,color:theme.colors.primary[700],fontSize:theme.typography.fontSize.sm,fontWeight:600}}>
                      <Award size={14}/>{cert}
                    </div>
                  ))}
                </div>
              </section>

              {/* Practice CTA */}
              <div style={{background:`linear-gradient(135deg,${theme.colors.primary[50]} 0%,rgba(0,229,160,0.08) 100%)`,borderRadius:theme.radius['2xl'],padding:theme.spacing[8],border:`1px solid ${theme.colors.primary[100]}`,textAlign:'center'}}>
                <Mascot size={80} mood="excited" animate={false}/>
                <h3 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginTop:theme.spacing[3],marginBottom:theme.spacing[2]}}>
                  Pronto para praticar?
                </h3>
                <p style={{fontSize:theme.typography.fontSize.sm,color:theme.colors.text.secondary,marginBottom:theme.spacing[5]}}>
                  Faça os exercícios APA do curso e veja seu progresso em tempo real.
                </p>
                <Link to={`/aprender/${slug}`} style={{display:'inline-flex',alignItems:'center',gap:6,padding:`${theme.spacing[3]} ${theme.spacing[6]}`,borderRadius:theme.radius.md,background:theme.gradients.phaseAply,color:'#003326',fontWeight:700,fontSize:theme.typography.fontSize.sm,textDecoration:'none'}}>
                  <Play size={15}/> Iniciar Exercícios APA
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div style={{background:'white',borderRadius:theme.radius['2xl'],boxShadow:theme.shadows.xl,border:`1px solid ${theme.colors.border.light}`,overflow:'hidden',position:'sticky',top:90}}>
              <div style={{background:theme.colors.bg.dark,padding:theme.spacing[6],position:'relative',overflow:'hidden'}}>
                <div style={{position:'absolute',inset:0,backgroundImage:`linear-gradient(rgba(0,102,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,0.06) 1px,transparent 1px)`,backgroundSize:'32px 32px'}}/>
                <div style={{position:'relative',zIndex:1}}>
                  <div style={{fontSize:theme.typography.fontSize.xs,color:'rgba(255,255,255,0.5)',marginBottom:4}}>A partir de</div>
                  <div style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['4xl'],fontWeight:900,color:'white',letterSpacing:'-0.03em',lineHeight:1}}>{course.priceLabel}</div>
                </div>
              </div>
              <div style={{padding:theme.spacing[6],display:'flex',flexDirection:'column',gap:theme.spacing[4]}}>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:theme.spacing[3]}}>
                  {[{icon:<Clock size={15}/>,l:'Duração',v:course.duration},{icon:<Users size={15}/>,l:'Turma',v:`Até ${course.maxStudents}`},{icon:<Star size={15} fill="#FF9500" color="#FF9500"/>,l:'Avaliação',v:`${course.rating}/5`},{icon:<Award size={15}/>,l:'Certs',v:`${course.certifications?.length||0} disponíveis`}].map(m=>(
                    <div key={m.l} style={{background:theme.colors.bg.subtle,borderRadius:theme.radius.md,padding:theme.spacing[3],textAlign:'center'}}>
                      <div style={{color:theme.colors.primary[500],display:'flex',justifyContent:'center',marginBottom:4}}>{m.icon}</div>
                      <div style={{fontSize:theme.typography.fontSize['2xs'],color:theme.colors.text.muted}}>{m.l}</div>
                      <div style={{fontWeight:700,fontSize:theme.typography.fontSize.sm,marginTop:2}}>{m.v}</div>
                    </div>
                  ))}
                </div>

                {enrolled?(
                  <div style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:theme.spacing[4],background:'rgba(0,196,122,0.08)',borderRadius:theme.radius.md,color:'#00703F',fontWeight:600,fontSize:theme.typography.fontSize.sm,border:`1px solid rgba(0,196,122,0.2)`}}>
                    <CheckCircle2 size={16}/> Interesse registrado! 🎉
                  </div>
                ):(
                  <Button fullWidth variant="primary" size="lg" onClick={handleEnroll} loading={enrolling}>
                    Quero me matricular
                  </Button>
                )}
                <Link to={`/aprender/${slug}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:theme.spacing[3],borderRadius:theme.radius.md,border:`1.5px solid ${theme.colors.border.brand}`,color:theme.colors.primary[600],fontWeight:600,fontSize:theme.typography.fontSize.sm,textDecoration:'none',background:theme.colors.primary[50]}}>
                  <Play size={14}/> Experimentar exercícios
                </Link>
                <div style={{fontSize:theme.typography.fontSize.xs,color:theme.colors.text.muted,textAlign:'center',lineHeight:1.7}}>
                  ✓ 1ª semana grátis · ✓ Sem fidelidade<br/>✓ Professores nativos · ✓ Material incluso
                </div>
              </div>
            </div>
          </div>
        </Wrap>
      </Sec>
    </Page>
  );
};

// ─── ABOUT ────────────────────────────────────────────────────────
export const About: React.FC = () => (
  <Page>
    <DarkHero>
      <Wrap style={{position:'relative',zIndex:1}}>
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
          <Mascot size={90} mood="happy"/>
          <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:'clamp(2.2rem,5vw,4rem)',fontWeight:900,color:'white',lineHeight:1.05,letterSpacing:'-0.03em',marginTop:theme.spacing[4]}}>Sobre a <GSpan>Fluxa</GSpan></h1>
          <SSub $light style={{margin:`${theme.spacing[4]} auto 0`}}>Nascemos para provar que fluência real não precisa de anos de cursinho.</SSub>
        </motion.div>
      </Wrap>
    </DarkHero>
    <Sec>
      <Wrap>
        <G2 style={{marginBottom:theme.spacing[20]}}>
          <motion.div initial={{opacity:0,x:-28}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <SLabel>Nossa missão</SLabel>
            <SH>Fluência que <GSpan>transforma vidas</GSpan></SH>
            <p style={{fontSize:theme.typography.fontSize.md,color:theme.colors.text.secondary,lineHeight:1.8,marginBottom:theme.spacing[5]}}>A Fluxa nasceu de uma frustração real: milhões de brasileiros estudam inglês por anos e ainda travam ao falar. Não é falta de inteligência. É falta do método certo.</p>
            <p style={{fontSize:theme.typography.fontSize.md,color:theme.colors.text.secondary,lineHeight:1.8}}>Desenvolvemos o <strong>Ciclo APA</strong> baseado em como o cérebro humano realmente adquire linguagem: por contexto, por prática com propósito, e por ajuste contínuo — não por memorização de regras.</p>
          </motion.div>
          <motion.div initial={{opacity:0,x:28}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
            <div style={{borderRadius:theme.radius['2xl'],background:`linear-gradient(135deg,${theme.colors.primary[50]} 0%,rgba(0,229,160,0.08) 100%)`,padding:theme.spacing[8],border:`1px solid ${theme.colors.primary[100]}`}}>
              {[{icon:'🧠',t:'Ciência aplicada',d:'Baseado em pesquisas de neurociência e linguística aplicada — não em tradição acadêmica.'},{icon:'👥',t:'Turmas de 8 alunos',d:'Atenção individualizada real. Não somos mais um curso em massa.'},{icon:'🌍',t:'Professores nativos',d:'Você aprende como o idioma realmente funciona, não como os livros dizem que funciona.'},{icon:'🏆',t:'98% de aprovação',d:'Em exames internacionais como TOEFL, IELTS, DELE, Goethe, DELF.'}].map((item,i)=>(
                <div key={i} style={{display:'flex',gap:theme.spacing[4],marginBottom:i<3?theme.spacing[5]:0}}>
                  <div style={{fontSize:'2rem',flexShrink:0,width:48,textAlign:'center'}}>{item.icon}</div>
                  <div><div style={{fontWeight:700,marginBottom:4}}>{item.t}</div><div style={{fontSize:theme.typography.fontSize.sm,color:theme.colors.text.secondary,lineHeight:1.65}}>{item.d}</div></div>
                </div>
              ))}
            </div>
          </motion.div>
        </G2>
      </Wrap>
    </Sec>
  </Page>
);

// ─── CONTACT ──────────────────────────────────────────────────────
export const Contact: React.FC = () => {
  const {t}=useTranslation();
  const [sent,setSent]=useState(false);
  const [loading,setLoading]=useState(false);
  const {register,handleSubmit,formState:{errors},reset}=useForm<any>();
  const onSubmit=async(data:any)=>{setLoading(true);try{await contactService.send(data);setSent(true);reset();}catch{}finally{setLoading(false);};};
  return (
    <Page>
      <DarkHero>
        <Wrap style={{position:'relative',zIndex:1}}>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
            <Mascot size={80} mood="happy"/>
            <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:'clamp(2rem,5vw,3.5rem)',fontWeight:900,color:'white',lineHeight:1.08,letterSpacing:'-0.03em',marginTop:theme.spacing[4]}}>{t('contact.title')}</h1>
            <SSub $light style={{margin:`${theme.spacing[3]} auto 0`}}>{t('contact.subtitle')}</SSub>
          </motion.div>
        </Wrap>
      </DarkHero>
      <Sec $bg={theme.colors.bg.subtle}>
        <Wrap>
          <G2>
            <motion.div initial={{opacity:0,x:-24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <SLabel>Informações</SLabel>
              <SH>Vamos <GSpan>conversar?</GSpan></SH>
              {[{icon:<Mail size={18}/>,l:'E-mail',v:'contato@fluxa.com.br'},{icon:<Phone size={18}/>,l:'WhatsApp',v:'(11) 9 9999-9999'},{icon:<MapPin size={18}/>,l:'Localização',v:'São Paulo — online e presencial'}].map(item=>(
                <div key={item.l} style={{display:'flex',gap:theme.spacing[4],marginBottom:theme.spacing[5]}}>
                  <div style={{width:46,height:46,borderRadius:theme.radius.md,background:theme.colors.primary[50],display:'flex',alignItems:'center',justifyContent:'center',color:theme.colors.primary[500],flexShrink:0}}>{item.icon}</div>
                  <div><div style={{fontSize:theme.typography.fontSize.xs,fontWeight:700,color:theme.colors.text.muted,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:3}}>{item.l}</div><div style={{fontSize:theme.typography.fontSize.md,color:theme.colors.text.primary}}>{item.v}</div></div>
                </div>
              ))}
            </motion.div>
            <motion.div initial={{opacity:0,x:24}} whileInView={{opacity:1,x:0}} viewport={{once:true}}>
              <div style={{background:'white',borderRadius:theme.radius['2xl'],padding:theme.spacing[8],boxShadow:theme.shadows.lg}}>
                {sent?(
                  <div style={{textAlign:'center',padding:`${theme.spacing[8]} 0`}}>
                    <Mascot size={90} mood="excited"/>
                    <h3 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginTop:theme.spacing[4]}}>Mensagem enviada! 🎉</h3>
                    <p style={{color:theme.colors.text.muted,marginTop:theme.spacing[2],marginBottom:theme.spacing[6]}}>Respondemos em até 24h.</p>
                    <Button variant="ghost" onClick={()=>setSent(false)}>Enviar outra mensagem</Button>
                  </div>
                ):(
                  <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:theme.spacing[4]}} noValidate>
                    <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:theme.spacing[3]}}>
                      <Input id="cn" label={t('contact.name')} error={errors.name?.message as string} {...register('name',{required:'Obrigatório'})}/>
                      <Input id="ce" type="email" label={t('contact.email')} error={errors.email?.message as string} {...register('email',{required:'Obrigatório'})}/>
                    </div>
                    <Select id="ci" label={t('contact.courseInterest')} options={[{value:'',label:'Selecione...'},{value:'Inglês',label:'Inglês'},{value:'Espanhol',label:'Espanhol'},{value:'Francês',label:'Francês'},{value:'Alemão',label:'Alemão'},{value:'Italiano',label:'Italiano'},{value:'Mandarim',label:'Mandarim'},{value:'Outro',label:'Outro'}]} {...register('courseInterest')}/>
                    <Input id="cs" label={t('contact.subject')} error={errors.subject?.message as string} {...register('subject',{required:'Obrigatório'})}/>
                    <Textarea id="cm" label={t('contact.message')} rows={4} error={errors.message?.message as string} {...register('message',{required:'Obrigatório',minLength:{value:10,message:'Mínimo 10 caracteres'}})}/>
                    <Button type="submit" fullWidth size="lg" loading={loading}><Send size={16}/>{t('contact.send')}</Button>
                  </form>
                )}
              </div>
            </motion.div>
          </G2>
        </Wrap>
      </Sec>
    </Page>
  );
};

// ─── AUTH layout ──────────────────────────────────────────────────
const AuthWrap=styled.div`min-height:100vh;display:grid;grid-template-columns:1fr 1fr;@media(max-width:${theme.breakpoints.lg}){grid-template-columns:1fr;}`;
const AuthLeft=styled.div`background:${theme.colors.bg.dark};display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${theme.spacing[12]};position:relative;overflow:hidden;&::before{content:'';position:absolute;inset:0;background-image:linear-gradient(rgba(0,102,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,102,255,0.06) 1px,transparent 1px);background-size:48px 48px;pointer-events:none;}@media(max-width:${theme.breakpoints.lg}){display:none;}`;
const AuthRight=styled.div`display:flex;flex-direction:column;align-items:center;justify-content:center;padding:${theme.spacing[10]};background:${theme.colors.bg.subtle};@media(max-width:${theme.breakpoints.sm}){padding:${theme.spacing[6]};}`;
const AuthCard=styled.div`width:100%;max-width:440px;background:white;border-radius:${theme.radius['2xl']};padding:${theme.spacing[8]};box-shadow:${theme.shadows.xl};border:1px solid ${theme.colors.border.light};`;
const AuthErr=styled.div`padding:${theme.spacing[3]} ${theme.spacing[4]};border-radius:${theme.radius.md};background:rgba(255,59,48,0.07);border:1px solid rgba(255,59,48,0.18);color:${theme.colors.error};font-size:${theme.typography.fontSize.sm};text-align:center;margin-bottom:${theme.spacing[4]};`;
const AuthLogoLink=styled(Link)`display:flex;align-items:center;gap:${theme.spacing[2]};text-decoration:none;margin-bottom:${theme.spacing[6]};`;

const AuthLogoMark=()=>(
  <div style={{width:32,height:32,borderRadius:theme.radius.sm,background:theme.gradients.brand,display:'flex',alignItems:'center',justifyContent:'center',boxShadow:theme.shadows.brand}}>
    <svg viewBox="0 0 24 24" fill="none" width="16"><rect x="2" y="3" width="3.5" height="18" rx="1.5" fill="white"/><rect x="5.5" y="3" width="8" height="3.5" rx="1.5" fill="white"/><rect x="5.5" y="10.5" width="5.5" height="3" rx="1.5" fill="#00E5A0"/></svg>
  </div>
);

// ─── LOGIN ────────────────────────────────────────────────────────
export const Login: React.FC = () => {
  const {t}=useTranslation();
  const {login,isLoading}=useAuth();
  const navigate=useNavigate();
  const location=useLocation();
  const [apiErr,setApiErr]=useState('');
  const {register,handleSubmit,formState:{errors}}=useForm<any>();
  const from=(location.state as any)?.from?.pathname||'/dashboard';
  const onSubmit=async(d:any)=>{setApiErr('');try{await login(d);navigate(from,{replace:true});}catch(e:any){setApiErr(e.response?.data?.message||'E-mail ou senha incorretos.');}};
  return (
    <AuthWrap>
      <AuthLeft>
        <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
          <Mascot size={150} mood="happy"/>
          <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['4xl'],color:'white',marginTop:theme.spacing[5],letterSpacing:'-0.03em'}}>Continue sua<br/><GSpan>jornada</GSpan></h2>
          <p style={{color:'rgba(255,255,255,0.5)',marginTop:theme.spacing[3],maxWidth:280}}>Cada sessão de prática te aproxima da fluência real.</p>
          <div style={{marginTop:theme.spacing[8],background:'rgba(255,255,255,0.06)',borderRadius:theme.radius.lg,padding:theme.spacing[4],border:'1px solid rgba(255,255,255,0.1)',textAlign:'left'}}>
            <p style={{color:'rgba(255,255,255,0.4)',fontSize:theme.typography.fontSize.xs,fontWeight:700,letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:theme.spacing[2]}}>Demo</p>
            <p style={{color:'rgba(255,255,255,0.65)',fontSize:theme.typography.fontSize.sm}}>admin@fluxa.com.br<br/><span style={{opacity:0.5}}>Admin@123</span></p>
          </div>
        </div>
      </AuthLeft>
      <AuthRight>
        <AuthCard>
          <AuthLogoLink to="/"><AuthLogoMark/><span style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize.lg,fontWeight:700,color:theme.colors.primary[600],letterSpacing:'-0.5px'}}>fluxa</span></AuthLogoLink>
          <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],letterSpacing:'-0.03em',marginBottom:4}}>{t('auth.loginTitle')}</h1>
          <p style={{fontSize:theme.typography.fontSize.sm,color:theme.colors.text.muted,marginBottom:theme.spacing[6]}}>{t('auth.loginSubtitle')}</p>
          {apiErr&&<AuthErr role="alert">{apiErr}</AuthErr>}
          <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:theme.spacing[4]}} noValidate>
            <Input id="le" type="email" label={t('auth.email')} placeholder="seu@email.com" error={errors.email?.message as string} {...register('email',{required:'Obrigatório',pattern:{value:/\S+@\S+\.\S+/,message:'E-mail inválido'}})}/>
            <Input id="lp" type="password" label={t('auth.password')} placeholder="••••••••" error={errors.password?.message as string} {...register('password',{required:'Obrigatório'})}/>
            <Button type="submit" fullWidth size="lg" loading={isLoading}><LogIn size={15}/>{t('auth.loginBtn')}</Button>
          </form>
          <p style={{textAlign:'center',marginTop:theme.spacing[5],fontSize:theme.typography.fontSize.sm,color:theme.colors.text.muted}}>
            {t('auth.noAccount')}{' '}<Link to="/cadastro" style={{color:theme.colors.primary[600],fontWeight:600,textDecoration:'none'}}>{t('auth.registerBtn')}</Link>
          </p>
        </AuthCard>
      </AuthRight>
    </AuthWrap>
  );
};

// ─── REGISTER ─────────────────────────────────────────────────────
export const Register: React.FC = () => {
  const {t}=useTranslation();
  const {register:authReg,isLoading}=useAuth();
  const navigate=useNavigate();
  const [apiErr,setApiErr]=useState('');
  const {register,handleSubmit,formState:{errors},watch}=useForm<any>();
  const onSubmit=async(d:any)=>{setApiErr('');try{await authReg({name:d.name,email:d.email,password:d.password});navigate('/dashboard');}catch(e:any){setApiErr(e.response?.data?.message||'Erro ao criar conta.');}};
  return (
    <AuthWrap>
      <AuthLeft>
        <div style={{position:'relative',zIndex:1,textAlign:'center'}}>
          <Mascot size={150} mood="excited"/>
          <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['4xl'],color:'white',marginTop:theme.spacing[5],letterSpacing:'-0.03em'}}>Comece sua<br/><GSpan>transformação</GSpan></h2>
          <p style={{color:'rgba(255,255,255,0.5)',marginTop:theme.spacing[3],maxWidth:280}}>1ª semana grátis · Sem cartão · Cancele quando quiser</p>
        </div>
      </AuthLeft>
      <AuthRight>
        <AuthCard>
          <AuthLogoLink to="/"><AuthLogoMark/><span style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize.lg,fontWeight:700,color:theme.colors.primary[600],letterSpacing:'-0.5px'}}>fluxa</span></AuthLogoLink>
          <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],letterSpacing:'-0.03em',marginBottom:4}}>{t('auth.registerTitle')}</h1>
          <p style={{fontSize:theme.typography.fontSize.sm,color:theme.colors.text.muted,marginBottom:theme.spacing[6]}}>{t('auth.registerSubtitle')}</p>
          {apiErr&&<AuthErr role="alert">{apiErr}</AuthErr>}
          <form onSubmit={handleSubmit(onSubmit)} style={{display:'flex',flexDirection:'column',gap:theme.spacing[4]}} noValidate>
            <Input id="rn" label={t('auth.name')} placeholder="Seu nome completo" error={errors.name?.message as string} {...register('name',{required:'Obrigatório',minLength:{value:2,message:'Mín. 2 chars'}})}/>
            <Input id="re" type="email" label={t('auth.email')} placeholder="seu@email.com" error={errors.email?.message as string} {...register('email',{required:'Obrigatório',pattern:{value:/\S+@\S+\.\S+/,message:'E-mail inválido'}})}/>
            <Input id="rp" type="password" label={t('auth.password')} placeholder="Mín. 8 chars" helpText="Maiúscula, minúscula e número" error={errors.password?.message as string} {...register('password',{required:'Obrigatório',minLength:{value:8,message:'Mín. 8 chars'},pattern:{value:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,message:'Inclua maiúscula, minúscula e número'}})}/>
            <Input id="rc" type="password" label="Confirmar senha" placeholder="Repita a senha" error={errors.confirm?.message as string} {...register('confirm',{required:'Obrigatório',validate:(v:string)=>v===watch('password')||'As senhas não coincidem'})}/>
            <Button type="submit" variant="accent" fullWidth size="lg" loading={isLoading}><UserPlus size={15}/>{t('auth.registerBtn')}</Button>
          </form>
          <p style={{textAlign:'center',marginTop:theme.spacing[5],fontSize:theme.typography.fontSize.sm,color:theme.colors.text.muted}}>
            {t('auth.hasAccount')}{' '}<Link to="/login" style={{color:theme.colors.primary[600],fontWeight:600,textDecoration:'none'}}>{t('auth.loginBtn')}</Link>
          </p>
        </AuthCard>
      </AuthRight>
    </AuthWrap>
  );
};

// ─── DASHBOARD ────────────────────────────────────────────────────
export const Dashboard: React.FC = () => {
  const {user,logout}=useAuth();
  const navigate=useNavigate();
  const {courses}=useCourses();
  const enrolled=(courses || []).filter(c=>user?.enrolledCourses?.includes(c.id));

  return (
    <Page>
      <Sec $bg={theme.colors.bg.subtle}>
        <Wrap>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:theme.spacing[4],marginBottom:theme.spacing[10]}}>
            <div>
              <SLabel>Minha área</SLabel>
              <SH>Olá, <GSpan>{user?.name?.split(' ')[0]}!</GSpan></SH>
              <p style={{color:theme.colors.text.muted,marginTop:theme.spacing[1]}}>Sua jornada de fluência começa agora.</p>
            </div>
            <div style={{display:'flex',gap:theme.spacing[3]}}>
              <Button variant="ghost" onClick={()=>{logout();navigate('/');}}><LogOut size={15}/>Sair</Button>
              <Link to="/cursos" style={{display:'inline-flex',alignItems:'center',gap:6,padding:`${theme.spacing[3]} ${theme.spacing[5]}`,borderRadius:theme.radius.md,background:theme.gradients.brand,color:'white',fontWeight:700,fontSize:theme.typography.fontSize.sm,textDecoration:'none'}}>Explorar cursos <ArrowRight size={14}/></Link>
            </div>
          </div>

          {/* Stats */}
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:theme.spacing[5],marginBottom:theme.spacing[10]}}>
            {[{icon:<BookOpen size={22}/>,l:'Cursos matriculados',v:user?.enrolledCourses?.length||0,color:theme.colors.primary[500]},{icon:<Target size={22}/>,l:'Exercícios feitos',v:0,color:theme.colors.accent[600]},{icon:<CheckCircle2 size={22}/>,l:'Nível atual',v:'A1',color:'#7C3AED'}].map(s=>(
              <div key={s.l} style={{background:'white',borderRadius:theme.radius.xl,padding:theme.spacing[6],boxShadow:theme.shadows.md,border:`1px solid ${theme.colors.border.light}`,textAlign:'center'}}>
                <div style={{color:s.color,display:'flex',justifyContent:'center',marginBottom:theme.spacing[2]}}>{s.icon}</div>
                <div style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['3xl'],fontWeight:900,color:s.color}}>{s.v}</div>
                <div style={{fontSize:theme.typography.fontSize.xs,color:theme.colors.text.muted,marginTop:4}}>{s.l}</div>
              </div>
            ))}
          </div>

          {/* Enrolled courses */}
          {enrolled.length > 0 ? (
            <>
              <h2 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginBottom:theme.spacing[5]}}>Meus cursos</h2>
              <G3>
                {enrolled.map(c=>(
                  <div key={c.id} style={{background:'white',borderRadius:theme.radius.xl,overflow:'hidden',boxShadow:theme.shadows.md,border:`1px solid ${theme.colors.border.light}`}}>
                    <div style={{height:120,position:'relative'}}>
                      <CoursePlaceholder language={c.language} color={c.color} flag={c.flag} nativeName={c.nativeName} style={{height:120}}/>
                    </div>
                    <div style={{padding:theme.spacing[4]}}>
                      <h3 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize.xl,marginBottom:theme.spacing[3]}}>{c.flag} {c.language}</h3>
                      <Link to={`/aprender/${c.slug}`} style={{display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:`${theme.spacing[2]} ${theme.spacing[4]}`,borderRadius:theme.radius.md,background:theme.gradients.phaseAply,color:'#003326',fontWeight:700,fontSize:theme.typography.fontSize.sm,textDecoration:'none'}}>
                        <Play size={13}/> Praticar agora
                      </Link>
                    </div>
                  </div>
                ))}
              </G3>
            </>
          ) : (
            <div style={{background:'white',borderRadius:theme.radius['2xl'],padding:theme.spacing[12],boxShadow:theme.shadows.md,border:`1px solid ${theme.colors.border.light}`,textAlign:'center'}}>
              <Mascot size={90} mood="thinking"/>
              <h3 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['2xl'],marginTop:theme.spacing[4],marginBottom:theme.spacing[2]}}>Nenhum curso ativo ainda</h3>
              <p style={{color:theme.colors.text.muted,marginBottom:theme.spacing[6],maxWidth:380,margin:`0 auto ${theme.spacing[6]}`}}>Escolha um idioma e sua primeira semana é completamente grátis.</p>
              <Link to="/cursos" style={{display:'inline-flex',alignItems:'center',gap:6,padding:`${theme.spacing[3]} ${theme.spacing[6]}`,borderRadius:theme.radius.md,background:theme.gradients.brand,color:'white',fontWeight:700,textDecoration:'none'}}>
                Ver cursos <ArrowRight size={14}/>
              </Link>
            </div>
          )}
        </Wrap>
      </Sec>
    </Page>
  );
};

// ─── NOT FOUND ────────────────────────────────────────────────────
export const NotFound: React.FC = () => {
  const navigate=useNavigate();
  return (
    <Page>
      <Sec>
        <Wrap>
          <div style={{textAlign:'center',padding:`${theme.spacing[16]} 0`,display:'flex',flexDirection:'column',alignItems:'center',gap:theme.spacing[4]}}>
            <Mascot size={130} mood="thinking"/>
            <div style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:'7rem',fontWeight:900,lineHeight:1,background:theme.gradients.brand,WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text'}}>404</div>
            <h1 style={{fontFamily:`'Clash Display',${theme.typography.fontFamily.display}`,fontSize:theme.typography.fontSize['3xl'],letterSpacing:'-0.025em'}}>Página não encontrada</h1>
            <p style={{color:theme.colors.text.muted,maxWidth:380,lineHeight:1.75}}>O <strong>Kai</strong> tentou encontrar essa página mas ela não existe. Talvez tenha mudado de endereço.</p>
            <div style={{display:'flex',gap:theme.spacing[3],flexWrap:'wrap',justifyContent:'center',marginTop:theme.spacing[4]}}>
              <Button onClick={()=>navigate(-1)}><ArrowLeft size={15}/>Voltar</Button>
              <Button variant="ghost" as={Link} to="/">Ir para o início</Button>
            </div>
          </div>
        </Wrap>
      </Sec>
    </Page>
  );
};
