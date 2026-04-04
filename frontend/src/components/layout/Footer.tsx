import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { Instagram, Linkedin, Youtube, Mail, Phone, MapPin, Heart } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { theme } from '@/styles/theme';

const Foot = styled.footer`
  background: ${theme.colors.bg.dark};
  color: white;
  padding: ${theme.spacing[20]} 0 ${theme.spacing[8]};
  position: relative;
  overflow: hidden;
  &::before {
    content:'';
    position:absolute; top:0; left:0; right:0;
    height:1px;
    background:linear-gradient(90deg, transparent, rgba(0,102,255,0.5) 30%, rgba(0,229,160,0.5) 70%, transparent);
  }
  &::after {
    content:'';
    position:absolute; inset:0;
    background-image:
      linear-gradient(rgba(0,102,255,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,102,255,0.04) 1px, transparent 1px);
    background-size:64px 64px;
    pointer-events:none;
  }
`;

const Inner = styled.div`
  max-width:1280px; margin:0 auto; padding:0 ${theme.spacing[6]};
  position:relative; z-index:1;
  @media(max-width:${theme.breakpoints.sm}){padding:0 ${theme.spacing[4]};}
`;

const Grid = styled.div`
  display:grid;
  grid-template-columns:2.2fr 1fr 1fr 1.4fr;
  gap:${theme.spacing[12]};
  @media(max-width:${theme.breakpoints.lg}){grid-template-columns:1fr 1fr;gap:${theme.spacing[8]};}
  @media(max-width:${theme.breakpoints.sm}){grid-template-columns:1fr;gap:${theme.spacing[8]};}
`;

const BrandCol = styled.div``;

const LogoRow = styled.div`
  display:flex; align-items:center; gap:${theme.spacing[3]};
  margin-bottom:${theme.spacing[4]};
`;

const LogoMark = styled.div`
  width:38px; height:38px;
  border-radius:${theme.radius.sm};
  background:${theme.gradients.brand};
  display:flex; align-items:center; justify-content:center;
  box-shadow:${theme.shadows.brand};
`;

const BrandName = styled.span`
  font-family:'Clash Display',${theme.typography.fontFamily.display};
  font-size:${theme.typography.fontSize.xl};
  font-weight:${theme.typography.fontWeight.bold};
  color:white;
  letter-spacing:-0.5px;
`;

const Tagline = styled.p`
  font-size:${theme.typography.fontSize.sm};
  color:rgba(255,255,255,0.38);
  line-height:${theme.typography.lineHeight.relaxed};
  max-width:260px;
  margin-bottom:${theme.spacing[6]};
`;

const Socials = styled.div`display:flex; gap:${theme.spacing[2]};`;

const SocialBtn = styled.a`
  width:38px; height:38px;
  border-radius:${theme.radius.md};
  background:rgba(255,255,255,0.06);
  border:1px solid rgba(255,255,255,0.09);
  display:flex; align-items:center; justify-content:center;
  color:rgba(255,255,255,0.45);
  transition:${theme.transitions.fast};
  &:hover{
    background:${theme.gradients.brand};
    border-color:transparent;
    color:white;
    transform:translateY(-3px);
    box-shadow:${theme.shadows.brand};
  }
`;

const ColTitle = styled.div`
  font-size:${theme.typography.fontSize.xs};
  font-weight:${theme.typography.fontWeight.bold};
  letter-spacing:${theme.typography.letterSpacing.widest};
  text-transform:uppercase;
  color:${theme.colors.primary[400]};
  margin-bottom:${theme.spacing[5]};
  display:flex; align-items:center; gap:${theme.spacing[2]};
  &::before{content:'';width:14px;height:2px;background:${theme.gradients.brand};border-radius:1px;}
`;

const ColLinks = styled.div`display:flex; flex-direction:column; gap:${theme.spacing[3]};`;

const FootLink = styled(Link)`
  font-size:${theme.typography.fontSize.sm};
  color:rgba(255,255,255,0.42);
  text-decoration:none;
  transition:${theme.transitions.fast};
  display:flex; align-items:center; gap:0;
  &:hover{color:white; padding-left:${theme.spacing[2]};}
`;

const ContactRow = styled.div`
  display:flex; gap:${theme.spacing[3]}; align-items:flex-start;
  margin-bottom:${theme.spacing[4]};
  transition:${theme.transitions.fast};
  &:hover{transform:translateX(4px);}
`;

const ContactIcon = styled.div`
  width:34px; height:34px; flex-shrink:0;
  border-radius:${theme.radius.md};
  background:rgba(0,102,255,0.12);
  border:1px solid rgba(0,102,255,0.18);
  display:flex; align-items:center; justify-content:center;
  color:${theme.colors.primary[400]};
`;

const ContactInfo = styled.div``;
const CLabel = styled.div`font-size:${theme.typography.fontSize['2xs']};font-weight:700;letter-spacing:${theme.typography.letterSpacing.wider};text-transform:uppercase;color:rgba(255,255,255,0.25);margin-bottom:2px;`;
const CVal   = styled.div`font-size:${theme.typography.fontSize.sm};color:rgba(255,255,255,0.65);`;

const Divider = styled.div`
  height:1px;
  background:rgba(255,255,255,0.06);
  margin:${theme.spacing[10]} 0 ${theme.spacing[6]};
`;

const Bottom = styled.div`
  display:flex; align-items:center; justify-content:space-between;
  flex-wrap:wrap; gap:${theme.spacing[3]};
  font-size:${theme.typography.fontSize.xs};
  color:rgba(255,255,255,0.22);
`;

const DevLine = styled.div`
  display:flex; align-items:center; gap:${theme.spacing[1]};
  strong{color:rgba(0,102,255,0.7);}
  svg{color:${theme.colors.accent[500]};}
`;

const Footer: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Foot>
      <Inner>
        <Grid>
          <BrandCol>
            <LogoRow>
              <LogoMark>
                <svg viewBox="0 0 24 24" fill="none" width="20">
                  <rect x="2" y="3" width="3.5" height="18" rx="1.5" fill="white"/>
                  <rect x="5.5" y="3" width="8" height="3.5" rx="1.5" fill="white"/>
                  <rect x="5.5" y="10.5" width="5.5" height="3" rx="1.5" fill="#00E5A0"/>
                </svg>
              </LogoMark>
              <BrandName>fluxa</BrandName>
            </LogoRow>
            <Tagline>{t('footer.tagline')}</Tagline>
            <Socials>
              <SocialBtn href="#" aria-label="Instagram"><Instagram size={16}/></SocialBtn>
              <SocialBtn href="#" aria-label="LinkedIn"><Linkedin size={16}/></SocialBtn>
              <SocialBtn href="#" aria-label="YouTube"><Youtube size={16}/></SocialBtn>
            </Socials>
          </BrandCol>

          <div>
            <ColTitle>Navegação</ColTitle>
            <ColLinks>
              {[['/','/','Início'],['/cursos','/cursos','Cursos'],['/metodo','/metodo','Método APA'],['/sobre','/sobre','Sobre'],['/contato','/contato','Contato']].map(([to,,lbl])=>(
                <FootLink key={to} to={to}>{lbl}</FootLink>
              ))}
            </ColLinks>
          </div>

          <div>
            <ColTitle>Idiomas</ColTitle>
            <ColLinks>
              {[['Inglês','ingles'],['Espanhol','espanhol'],['Francês','frances'],['Alemão','alemao'],['Italiano','italiano'],['Mandarim','mandarin']].map(([lbl,slug])=>(
                <FootLink key={slug} to={`/cursos/${slug}`}>{lbl}</FootLink>
              ))}
            </ColLinks>
          </div>

          <div>
            <ColTitle>Contato</ColTitle>
            {[
              {icon:<Mail size={15}/>,   label:'E-mail',    val:'contato@fluxa.com.br'},
              {icon:<Phone size={15}/>,  label:'WhatsApp',  val:'(11) 9 9999-9999'},
              {icon:<MapPin size={15}/>, label:'Localização',val:'São Paulo, SP'},
            ].map(item=>(
              <ContactRow key={item.label}>
                <ContactIcon>{item.icon}</ContactIcon>
                <ContactInfo>
                  <CLabel>{item.label}</CLabel>
                  <CVal>{item.val}</CVal>
                </ContactInfo>
              </ContactRow>
            ))}
          </div>
        </Grid>

        <Divider/>

        <Bottom>
          <div>{t('footer.rights')}</div>
          <DevLine>
            Desenvolvido com <Heart size={11} fill="currentColor"/> por{' '}
            <strong>Lucas Fernandes</strong> — Fernandes Web Studio
          </DevLine>
        </Bottom>
      </Inner>
    </Foot>
  );
};

export default Footer;
