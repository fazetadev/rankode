import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Code2,
  Zap,
  Trophy,
  User,
  Award,
  Info,
  LogIn,
} from 'lucide-react';
import { APP_NAME } from '../../config';
import { getInitials } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { BrandLogo } from '../ui/BrandLogo';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { XpBar } from '../features/XpBar';

export function Sidebar() {
  const t = useT();
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const activeAccountId = useAppStore((s) => s.activeAccountId);
  const [infoOpen, setInfoOpen] = useState(false);

  const navItems = [
    { to: '/', label: t('nav.dashboard'), icon: LayoutDashboard, end: true },
    { to: '/challenges', label: t('nav.challenges'), icon: Code2, end: false },
    { to: '/practice', label: t('nav.practice'), icon: Zap, end: true },
    { to: '/ranking', label: t('nav.ranking'), icon: Trophy, end: true },
    { to: '/profile', label: t('nav.profile'), icon: User, end: true },
    { to: '/ranks', label: t('nav.ranks'), icon: Award, end: true },
  ];

  return (
    <>
      <aside className="hidden md:flex md:w-60 md:flex-col md:fixed md:inset-y-0 border-r border-[#27272A] bg-[#09090B]">
        <div className="flex h-14 items-center justify-between border-b border-[#27272A] px-5">
          <NavLink
            to="/"
            className="flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] rounded"
          >
            <BrandLogo />
          </NavLink>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Información sobre ejecución y datos locales"
            className="rounded-md p-1.5 text-[#71717A] transition-colors hover:bg-[#18181B] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <Info className="h-4 w-4" />
          </button>
        </div>

        <nav aria-label="Navegación principal" className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
                    isActive
                      ? 'bg-[#18181B] text-[#FAFAFA]'
                      : 'text-[#A1A1AA] hover:bg-[#111113] hover:text-[#FAFAFA]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      aria-hidden="true"
                      className={`h-4 w-4 shrink-0 ${
                        isActive ? 'text-[#8B5CF6]' : 'text-[#71717A]'
                      }`}
                    />
                    <span className="whitespace-nowrap">{item.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-[#27272A] p-3">
          <NavLink
            to="/profile"
            className="block rounded-lg border border-[#27272A] bg-[#111113] p-3 transition-colors hover:border-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <div className="mb-2.5 flex items-center gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#27272A] bg-[#18181B] text-xs font-semibold text-[#FAFAFA]">
                {getInitials(profile.username)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-[#FAFAFA]">
                  {profile.username}
                </p>
                <p className="text-[11px] text-[#71717A]">
                  {activeAccountId ? t('common.demoLocal') : 'Invitado · 0 XP base'}
                </p>
              </div>
            </div>
            <XpBar xp={xp} compact />
          </NavLink>

          <NavLink
            to="/login"
            className="flex items-center justify-center gap-1.5 rounded-md border border-[#27272A] bg-[#111113] px-3 py-1.5 text-xs font-medium text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#FAFAFA]"
          >
            <LogIn aria-hidden="true" className="h-3.5 w-3.5 text-[#8B5CF6]" />
            <span>{activeAccountId ? t('nav.switchAccount') : t('nav.login')}</span>
          </NavLink>
        </div>
      </aside>

      <Modal
        open={infoOpen}
        onClose={() => setInfoOpen(false)}
        title={`Acerca de ${APP_NAME}`}
        description="Prototipo local de demostración sin servidor."
      >
        <div className="space-y-3 text-sm text-[#A1A1AA]">
          <p>
            <strong className="font-medium text-[#FAFAFA]">JavaScript</strong> se ejecuta en un{' '}
            <span className="text-[#FAFAFA]">Web Worker aislado</span> real con límite de 3 segundos y
            captura de consola.
          </p>
          <p>
            <strong className="font-medium text-[#FAFAFA]">Python, Java y C++</strong> utilizan un{' '}
            <span className="text-[#FAFAFA]">juez simulado</span> en cliente que valida sintaxis
            básica y estructura algorítmica. En la plataforma oficial se utilizará un sandbox
            contenedorizado en servidor.
          </p>
          <p>
            Las cuentas locales, progreso, borradores e historial se guardan únicamente en{' '}
            <code className="rounded bg-[#18181B] px-1.5 py-0.5 font-mono text-xs text-[#FAFAFA]">
              localStorage
            </code>
            .
          </p>
        </div>
        <div className="mt-5 flex justify-end">
          <Button variant="primary" size="sm" onClick={() => setInfoOpen(false)}>
            Entendido
          </Button>
        </div>
      </Modal>
    </>
  );
}
