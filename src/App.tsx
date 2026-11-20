import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { TopBar } from './components/layout/TopBar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/ui/Toast';
import { useAppStore } from './store/useAppStore';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Ranks from './pages/Ranks';
import Login from './pages/Login';
import NotFound from './pages/NotFound';

const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));
const Practice = lazy(() => import('./pages/Practice'));

function EditorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-14 rounded-lg border border-[#27272A] bg-[#111113] animate-pulse" />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="h-96 rounded-lg border border-[#27272A] bg-[#111113] lg:col-span-5 animate-pulse" />
        <div className="h-96 rounded-lg border border-[#27272A] bg-[#111113] lg:col-span-7 animate-pulse" />
      </div>
    </div>
  );
}

function AppShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthenticated = useAppStore((s) => s.isAuthenticated);
  const continueAsGuest = useAppStore((s) => s.continueAsGuest);

  const searchParams = new URLSearchParams(location.search);
  const autostart = searchParams.get('autostart') === '1';
  const isLoginRoute = location.pathname === '/login';
  const isFocusMode =
    location.pathname.startsWith('/challenges/') && searchParams.get('focus') === '1';

  useEffect(() => {
    if (autostart && !isAuthenticated) {
      continueAsGuest();
    }
  }, [autostart, isAuthenticated, continueAsGuest]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== '/' || e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.isContentEditable ||
          target.closest('.cm-editor'))
      ) {
        return;
      }
      e.preventDefault();
      navigate('/challenges?focusSearch=1');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [navigate]);

  if (!isAuthenticated && !isLoginRoute && !autostart) {
    return (
      <>
        <Navigate
          to="/login"
          state={{ from: `${location.pathname}${location.search}` }}
          replace
        />
        <ToastContainer />
      </>
    );
  }

  if (isLoginRoute) {
    return (
      <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
      {!isFocusMode && <Sidebar />}
      <div className={isFocusMode ? '' : 'md:pl-60'}>
        {!isFocusMode && <TopBar />}
        <main className="pb-20 md:pb-8">
          <div className={`${isFocusMode ? 'max-w-7xl' : 'max-w-6xl'} mx-auto px-4 py-6 sm:px-6 lg:px-8`}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/challenges" element={<Challenges />} />
              <Route
                path="/challenges/:id"
                element={
                  <Suspense fallback={<EditorSkeleton />}>
                    <ChallengeDetail />
                  </Suspense>
                }
              />
              <Route
                path="/practice"
                element={
                  <Suspense fallback={<EditorSkeleton />}>
                    <Practice />
                  </Suspense>
                }
              />
              <Route path="/ranking" element={<Ranking />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/ranks" element={<Ranks />} />
              <Route path="/login" element={<Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </main>
      </div>
      {!isFocusMode && <MobileNav />}
      <ToastContainer />
    </div>
  );
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </MotionConfig>
  );
}
