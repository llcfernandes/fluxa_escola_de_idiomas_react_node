import React, { Suspense, lazy, useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PageLoader from '@/components/layout/PageLoader';
import { ProtectedRoute } from '@/components/layout/ProtectedRoute';

const Home        = lazy(() => import('@/pages/Home'));
const Courses     = lazy(() => import('@/pages/Courses'));
const CourseDetail= lazy(() => import('@/pages/CourseDetail'));
const About       = lazy(() => import('@/pages/About'));
const Contact     = lazy(() => import('@/pages/Contact'));
const Login       = lazy(() => import('@/pages/Login'));
const Register    = lazy(() => import('@/pages/Register'));
const Dashboard   = lazy(() => import('@/pages/Dashboard'));
const LearnPage   = lazy(() => import('@/pages/LearnPage'));
const NotFound    = lazy(() => import('@/pages/NotFound'));

const NO_CHROME = ['/login', '/cadastro'];

const App: React.FC = () => {
  const location = useLocation();
  const [ready, setReady] = useState(false);
  const noChrome = NO_CHROME.includes(location.pathname);

  // Initial branded loader
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 2300);
    return () => clearTimeout(t);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  if (!ready) return <PageLoader />;

  return (
    <>
      {!noChrome && <Navbar />}
      <AnimatePresence mode="wait">
        <Suspense fallback={<PageLoader minimal />}>
          <Routes location={location} key={location.pathname}>
            <Route path="/"              element={<Home />} />
            <Route path="/cursos"        element={<Courses />} />
            <Route path="/cursos/:slug"  element={<CourseDetail />} />
            <Route path="/sobre"         element={<About />} />
            <Route path="/metodo"        element={<About />} />
            <Route path="/contato"       element={<Contact />} />
            <Route path="/login"         element={<Login />} />
            <Route path="/cadastro"      element={<Register />} />
            <Route path="/aprender/:slug" element={<LearnPage />} />
            <Route path="/dashboard"     element={
              <ProtectedRoute><Dashboard /></ProtectedRoute>
            } />
            <Route path="*"              element={<NotFound />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
      {!noChrome && <Footer />}
    </>
  );
};

export default App;
