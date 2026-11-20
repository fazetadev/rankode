import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { MotionConfig } from 'framer-motion';
import { Sidebar } from './components/layout/Sidebar';
import { MobileNav } from './components/layout/MobileNav';
import { ToastContainer } from './components/ui/Toast';
import Dashboard from './pages/Dashboard';
import Challenges from './pages/Challenges';
import Ranking from './pages/Ranking';
import Profile from './pages/Profile';
import Ranks from './pages/Ranks';
import NotFound from './pages/NotFound';

const ChallengeDetail = lazy(() => import('./pages/ChallengeDetail'));

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

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <BrowserRouter>
        <div className="min-h-screen bg-[#09090B] text-[#FAFAFA]">
          <Sidebar />
          <main className="md:pl-60 pb-20 md:pb-8">
            <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8">
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
                <Route path="/ranking" element={<Ranking />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/ranks" element={<Ranks />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </main>
          <MobileNav />
          <ToastContainer />
        </div>
      </BrowserRouter>
    </MotionConfig>
  );
}
