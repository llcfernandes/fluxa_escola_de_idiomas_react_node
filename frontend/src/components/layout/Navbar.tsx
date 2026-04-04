import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import styled, { css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Globe, ChevronDown, LogOut, User, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/contexts/AuthContext';
import { theme } from '@/styles/theme';

// ─── TYPES ────────────────────────────────────────────────────────
type NavTheme = 'light' | 'dark' | 'glass';

// ─── STYLED ───────────────────────────────────────────────────────
const Nav = styled.nav<{ $navTheme: NavTheme; $scrolled: boolean }>`
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: ${theme.zIndex.sticky};
  height: 68px;
  transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
  border-bottom: 1px solid transparent;

  ${({ $navTheme, $scrolled }) => {
    if ($scrolled) return css`
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(24px) saturate(160%);
      -webkit-backdrop-filter: blur(24px) saturate(160%);
      box-shadow: ${theme.shadows.md};
      border-bottom-color: ${theme.colors.border.light};
    `;
    if ($navTheme === 'dark') return css`
      background: transparent;
    `;
    return css`
      background: rgba(255,255,255,0.9);
      backdrop-filter: blur(12px);
      border-bottom-color: ${theme.colors.border.subtle};
    `;
  }}
`;

const Inner = styled.div`
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 ${theme.spacing[6]};
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.spacing[4]};
  @media (max-width: ${theme.breakpoints.sm}) { padding: 0 ${theme.spacing[4]}; }
`;

const LogoLink = styled(Link)<{ $dark: boolean }>`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  text-decoration: none;
  transition: opacity 0.2s;
  &:hover { opacity: 0.82; }
`;

const LogoSym = styled.div`
  width: 34px; height: 34px;
  border-radius: ${theme.radius.sm};
  background: ${theme.gradients.brand};
  display: flex; align-items: center; justify-content: center;
  box-shadow: ${theme.shadows.brand};
  flex-shrink: 0;
`;

const LogoText = styled.span<{ $dark: boolean }>`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: ${theme.typography.fontSize.lg};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: -0.5px;
  color: ${p => p.$dark ? '#fff' : theme.colors.text.primary};
  transition: color 0.3s;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[1]};
  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

const NavItem = styled(Link)<{ $active: boolean; $dark: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-decoration: none;
  transition: ${theme.transitions.fast};
  color: ${p => p.$active
    ? (p.$dark ? '#fff' : theme.colors.primary[500])
    : p.$dark ? 'rgba(255,255,255,0.78)' : theme.colors.text.secondary};
  background: ${p => p.$active
    ? (p.$dark ? 'rgba(255,255,255,0.15)' : theme.colors.primary[50])
    : 'transparent'};

  &:hover {
    color: ${p => p.$dark ? '#fff' : theme.colors.primary[600]};
    background: ${p => p.$dark ? 'rgba(255,255,255,0.1)' : theme.colors.primary[50]};
  }
`;

const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: ${theme.spacing[2]};
  @media (max-width: ${theme.breakpoints.lg}) { display: none; }
`;

const LangToggle = styled.button<{ $dark: boolean }>`
  display: flex; align-items: center; gap: ${theme.spacing[1]};
  padding: ${theme.spacing[2]} ${theme.spacing[2]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  letter-spacing: ${theme.typography.letterSpacing.wide};
  color: ${p => p.$dark ? 'rgba(255,255,255,0.6)' : theme.colors.text.muted};
  transition: ${theme.transitions.fast};
  &:hover { color: ${p => p.$dark ? '#fff' : theme.colors.text.primary}; background: ${p => p.$dark ? 'rgba(255,255,255,0.08)' : theme.colors.neutral[100]}; }
`;

const BtnLogin = styled(Link)<{ $dark: boolean }>`
  padding: ${theme.spacing[2]} ${theme.spacing[4]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  text-decoration: none;
  border: 1.5px solid ${p => p.$dark ? 'rgba(255,255,255,0.25)' : theme.colors.border.medium};
  color: ${p => p.$dark ? 'rgba(255,255,255,0.85)' : theme.colors.text.primary};
  transition: ${theme.transitions.fast};
  &:hover {
    border-color: ${p => p.$dark ? 'rgba(255,255,255,0.5)' : theme.colors.primary[400]};
    color: ${p => p.$dark ? '#fff' : theme.colors.primary[600]};
    background: ${p => p.$dark ? 'rgba(255,255,255,0.06)' : theme.colors.primary[50]};
  }
`;

const BtnCta = styled(Link)`
  padding: ${theme.spacing[2]} ${theme.spacing[5]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.bold};
  text-decoration: none;
  background: ${theme.gradients.brand};
  color: #fff;
  box-shadow: ${theme.shadows.brand};
  transition: ${theme.transitions.fast};
  &:hover { transform: translateY(-1px); box-shadow: 0 10px 28px rgba(0,102,255,0.38); }
  &:active { transform: none; }
`;

const UserWrap  = styled.div`  position: relative; `;
const UserBtn   = styled.button<{ $dark: boolean }>`
  display: flex; align-items: center; gap: ${theme.spacing[2]};
  padding: ${theme.spacing[2]} ${theme.spacing[3]};
  border-radius: ${theme.radius.md};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.semibold};
  color: ${p => p.$dark ? 'rgba(255,255,255,0.9)' : theme.colors.text.primary};
  background: ${p => p.$dark ? 'rgba(255,255,255,0.1)' : theme.colors.neutral[100]};
  transition: ${theme.transitions.fast};
  &:hover { background: ${p => p.$dark ? 'rgba(255,255,255,0.18)' : theme.colors.neutral[200]}; }
`;
const UserAvatar= styled.div`
  width: 28px; height: 28px;
  border-radius: 50%;
  background: ${theme.gradients.brand};
  display: flex; align-items: center; justify-content: center;
  font-size: ${theme.typography.fontSize.xs};
  font-weight: ${theme.typography.fontWeight.bold};
  color: #fff;
  flex-shrink: 0;
`;
const DropMenu  = styled(motion.div)`
  position: absolute; top:calc(100% + 8px); right:0;
  min-width: 200px;
  background: white;
  border-radius: ${theme.radius.lg};
  box-shadow: ${theme.shadows.xl};
  border: 1px solid ${theme.colors.border.light};
  overflow: hidden;
  z-index: ${theme.zIndex.dropdown};
`;
const DropItem  = styled.button`
  width: 100%;
  display: flex; align-items: center; gap: ${theme.spacing[3]};
  padding: ${theme.spacing[3]} ${theme.spacing[4]};
  font-size: ${theme.typography.fontSize.sm};
  font-weight: ${theme.typography.fontWeight.medium};
  color: ${theme.colors.text.primary};
  text-align: left; transition: ${theme.transitions.fast};
  &:hover { background: ${theme.colors.neutral[50]}; color: ${theme.colors.primary[600]}; }
  &.danger { color: ${theme.colors.error}; }
  &.danger:hover { background: rgba(255,59,48,0.06); }
`;

const HamBtn = styled.button`
  display: none; padding: ${theme.spacing[2]};
  @media (max-width: ${theme.breakpoints.lg}) { display: flex; align-items: center; justify-content: center; }
`;

const Drawer = styled(motion.div)`
  position: fixed; inset: 0; z-index: ${theme.zIndex.overlay};
  background: ${theme.colors.bg.dark};
  display: flex; flex-direction: column;
  padding: ${theme.spacing[6]};
`;
const DrawerClose = styled.button`
  align-self: flex-end;
  padding: ${theme.spacing[2]};
  background: rgba(255,255,255,0.1);
  border-radius: ${theme.radius.md};
  color: white;
  margin-bottom: ${theme.spacing[8]};
`;
const DrawerLink = styled(Link)`
  font-family: 'Clash Display', ${theme.typography.fontFamily.display};
  font-size: clamp(2rem,7vw,3.5rem);
  font-weight: ${theme.typography.fontWeight.bold};
  color: rgba(255,255,255,0.75);
  text-decoration: none;
  padding: ${theme.spacing[3]} 0;
  border-bottom: 1px solid rgba(255,255,255,0.07);
  transition: ${theme.transitions.fast};
  letter-spacing: -1px;
  &:hover { color: #fff; padding-left: ${theme.spacing[3]}; color: ${theme.colors.accent[400]}; }
`;

// ─── ROUTE → THEME MAP ────────────────────────────────────────────
// Define which routes have a dark background immediately below the navbar.
// Scroll-based glass override happens at runtime regardless.
//
// Rules:
//  'dark'  → route starts with a dark hero (transparent nav, white text)
//  'light' → route starts with a light/white background (opaque white nav)
//
// The `elementFromPoint` approach was unreliable: the <Page> wrapper adds
// padding-top:68px, so by the time React paints, the sampled element is
// the nav itself or the white page body — never the DarkHero below it.
// A route-based map is instant, zero-flicker, and 100% accurate.

const DARK_ROUTES: string[] = [
  '/',          // Home — full-viewport dark hero
  '/cursos',    // Courses — DarkHero
  '/sobre',     // About — DarkHero
  '/metodo',    // Method (same page as About) — DarkHero
  '/contato',   // Contact — DarkHero
];

// Routes that start with these prefixes are also dark
const DARK_PREFIXES: string[] = [
  '/cursos/',   // CourseDetail — dark header section
];

const getInitialNavTheme = (pathname: string): NavTheme => {
  if (DARK_ROUTES.includes(pathname)) return 'dark';
  if (DARK_PREFIXES.some(p => pathname.startsWith(p))) return 'dark';
  return 'light';
};

// ─── NAV LINKS ────────────────────────────────────────────────────
const LINKS = [
  { to:'/',        label:'nav.home'    },
  { to:'/cursos',  label:'nav.courses' },
  { to:'/metodo',  label:'nav.method'  },
  { to:'/sobre',   label:'nav.about'   },
  { to:'/contato', label:'nav.contact' },
];

// ─── COMPONENT ────────────────────────────────────────────────────
const Navbar: React.FC = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [userMenuOpen,setUserMenuOpen]= useState(false);
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const navigate  = useNavigate();
  const menuRef   = useRef<HTMLDivElement>(null);

  // ── Derive nav theme from route (instant, no DOM sampling) ──────
  const baseTheme   = getInitialNavTheme(location.pathname);
  const navTheme: NavTheme = scrolled ? 'glass' : baseTheme;
  const isDark      = navTheme === 'dark'; // white text mode

  // ── Scroll detection ────────────────────────────────────────────
  useEffect(() => {
    // Reset scroll on route change so new page starts unscrolled
    setScrolled(window.scrollY > 36);
    const fn = () => setScrolled(window.scrollY > 36);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [location.pathname]);

  useEffect(() => { setDrawerOpen(false); setUserMenuOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [drawerOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const fn = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const toggleLang = () => {
    const next = i18n.language === 'pt' ? 'en' : 'pt';
    i18n.changeLanguage(next);
    localStorage.setItem('fluxa_lang', next);
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const isActive = (to: string) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);

  return (
    <>
      <Nav $navTheme={navTheme} $scrolled={scrolled} role="navigation" aria-label="Navegação principal">
        <Inner>
          {/* Logo */}
          <LogoLink to="/" $dark={isDark} aria-label="Fluxa — Início">
            <LogoSym aria-hidden>
              <svg viewBox="0 0 24 24" fill="none" width="20" height="20">
                <rect x="2" y="3" width="3.5" height="18" rx="1.5" fill="white"/>
                <rect x="5.5" y="3" width="8"   height="3.5" rx="1.5" fill="white"/>
                <rect x="5.5" y="10.5" width="5.5" height="3" rx="1.5" fill="#00E5A0"/>
                <path d="M16 7 C18 7 19 10 21 10 C23 10 24 7 26 7" stroke="white" strokeWidth="2.2" strokeLinecap="round" opacity="0.6"/>
                <path d="M16 13 C17.5 13 18.5 16 20 16 C21.5 16 22.5 13 24 13" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" opacity="0.7"/>
              </svg>
            </LogoSym>
            <LogoText $dark={isDark}>fluxa</LogoText>
          </LogoLink>

          {/* Desktop links */}
          <NavLinks>
            {LINKS.map(l => (
              <NavItem key={l.to} to={l.to} $active={isActive(l.to)} $dark={isDark}>
                {t(l.label)}
              </NavItem>
            ))}
          </NavLinks>

          {/* Actions */}
          <Actions>
            <LangToggle $dark={isDark} onClick={toggleLang} aria-label="Trocar idioma">
              <Globe size={14}/>
              {i18n.language === 'pt' ? 'EN' : 'PT'}
            </LangToggle>

            {isAuthenticated && user ? (
              <UserWrap ref={menuRef}>
                <UserBtn $dark={isDark} onClick={() => setUserMenuOpen(v=>!v)}>
                  <UserAvatar>{(user.name || '?')[0].toUpperCase()}</UserAvatar>
                  {(user.name || '').split(' ')[0]}
                  <ChevronDown size={14}/>
                </UserBtn>
                <AnimatePresence>
                  {userMenuOpen && (
                    <DropMenu initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}} transition={{duration:0.18}}>
                      <DropItem onClick={() => navigate('/dashboard')}>
                        <User size={15}/> {t('nav.dashboard')}
                      </DropItem>
                      <DropItem onClick={() => navigate('/cursos')}>
                        <BookOpen size={15}/> Meus cursos
                      </DropItem>
                      <DropItem className="danger" onClick={handleLogout}>
                        <LogOut size={15}/> {t('nav.logout')}
                      </DropItem>
                    </DropMenu>
                  )}
                </AnimatePresence>
              </UserWrap>
            ) : (
              <>
                <BtnLogin to="/login" $dark={isDark}>{t('nav.login')}</BtnLogin>
                <BtnCta   to="/cadastro">{t('nav.register')}</BtnCta>
              </>
            )}
          </Actions>

          <HamBtn onClick={() => setDrawerOpen(true)} aria-label="Abrir menu" aria-expanded={drawerOpen}>
            <Menu size={22} color={isDark ? 'white' : theme.colors.text.primary}/>
          </HamBtn>
        </Inner>
      </Nav>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {drawerOpen && (
          <Drawer
            initial={{ x:'100%' }}
            animate={{ x:0 }}
            exit={{ x:'100%' }}
            transition={{ type:'spring', stiffness:300, damping:30 }}
          >
            <DrawerClose onClick={() => setDrawerOpen(false)} aria-label="Fechar menu">
              <X size={22}/>
            </DrawerClose>

            {LINKS.map(l => (
              <DrawerLink key={l.to} to={l.to} onClick={() => setDrawerOpen(false)}>
                {t(l.label)}
              </DrawerLink>
            ))}

            <div style={{ marginTop: theme.spacing[10], display:'flex', flexDirection:'column', gap: theme.spacing[3] }}>
              {isAuthenticated ? (
                <button onClick={() => { handleLogout(); setDrawerOpen(false); }}
                  style={{ padding:'14px', background:'rgba(255,59,48,0.12)', border:'1px solid rgba(255,59,48,0.3)', borderRadius: theme.radius.md, color:'#FF6B6B', fontWeight:'600', cursor:'pointer', fontSize: theme.typography.fontSize.md }}>
                  {t('nav.logout')}
                </button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setDrawerOpen(false)}
                    style={{ padding:'14px', textAlign:'center', border:'1.5px solid rgba(255,255,255,0.25)', borderRadius: theme.radius.md, color:'white', fontWeight:'600', fontSize: theme.typography.fontSize.md, textDecoration:'none' }}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/cadastro" onClick={() => setDrawerOpen(false)}
                    style={{ padding:'14px', textAlign:'center', background: theme.gradients.brand, borderRadius: theme.radius.md, color:'white', fontWeight:'700', fontSize: theme.typography.fontSize.md, textDecoration:'none' }}>
                    {t('nav.register')}
                  </Link>
                </>
              )}
              <LangToggle $dark={true} onClick={toggleLang} style={{ justifyContent:'center', marginTop: theme.spacing[2] }}>
                <Globe size={15}/> {i18n.language === 'pt' ? 'Switch to English' : 'Trocar para Português'}
              </LangToggle>
            </div>
          </Drawer>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
