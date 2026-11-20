import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Flame, Search, User, LogIn, LogOut, RotateCcw } from 'lucide-react';
import { formatNumber, getInitials } from '../../lib/format';
import { useAppStore } from '../../store/useAppStore';
import { useT } from '../../i18n/useT';
import { RankBadge } from '../features/RankBadge';
import { Button } from '../ui/Button';

export function TopBar() {
  const t = useT();
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const streakDays = useAppStore((s) => s.streakDays);
  const notifications = useAppStore((s) => s.notifications);
  const activeAccountId = useAppStore((s) => s.activeAccountId);
  const markAllNotificationsRead = useAppStore((s) => s.markAllNotificationsRead);
  const logoutAccount = useAppStore((s) => s.logoutAccount);

  const [notifOpen, setNotifOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleQuickSearch = () => {
    navigate('/challenges?focusSearch=1');
  };

  return (
    <header className="hidden md:flex sticky top-0 z-30 h-14 items-center justify-between border-b border-[#27272A] bg-[#09090B]/95 px-6 backdrop-blur-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleQuickSearch}
          className="flex w-64 items-center justify-between rounded-md border border-[#27272A] bg-[#111113] px-3 py-1.5 text-xs text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
        >
          <span className="inline-flex items-center gap-2">
            <Search aria-hidden="true" className="h-3.5 w-3.5 text-[#71717A]" />
            <span>{t('nav.searchChallenges')}</span>
          </span>
          <kbd className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 font-mono text-[10px] text-[#71717A]">
            /
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div
          className="flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#111113] px-2.5 py-1 text-xs"
          title="Racha diaria actual"
        >
          <Flame
            aria-hidden="true"
            className={`h-3.5 w-3.5 ${streakDays > 0 ? 'text-amber-400' : 'text-[#71717A]'}`}
          />
          <span className="font-mono font-medium tabular-nums text-[#FAFAFA]">{streakDays}d</span>
        </div>

        <div className="flex items-center gap-2 rounded-md border border-[#27272A] bg-[#111113] px-2.5 py-1">
          <RankBadge xp={xp} />
          <span className="font-mono text-xs tabular-nums text-[#FAFAFA]">
            {formatNumber(xp)} XP
          </span>
        </div>

        {/* Notificaciones */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((o) => !o);
              setMenuOpen(false);
            }}
            aria-label={t('nav.notifications')}
            aria-expanded={notifOpen}
            className="relative flex h-8 w-8 items-center justify-center rounded-md border border-[#27272A] bg-[#111113] text-[#A1A1AA] transition-colors hover:border-[#3F3F46] hover:text-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <Bell aria-hidden="true" className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#8B5CF6] px-1 font-mono text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-lg border border-[#27272A] bg-[#111113] p-3 shadow-xl">
              <div className="mb-2 flex items-center justify-between border-b border-[#27272A] pb-2">
                <span className="text-xs font-semibold text-[#FAFAFA]">
                  {t('nav.notifications')}
                </span>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-[#8B5CF6] hover:text-[#A78BFA]"
                  >
                    {t('nav.markAllRead')}
                  </button>
                )}
              </div>
              {notifications.length === 0 ? (
                <p className="py-4 text-center text-xs text-[#71717A]">
                  {t('nav.noNotifications')}
                </p>
              ) : (
                <div className="max-h-64 space-y-2 overflow-y-auto">
                  {notifications.slice(0, 8).map((n) => (
                    <div
                      key={n.id}
                      className={`rounded-md border p-2.5 text-xs ${
                        n.read
                          ? 'border-[#27272A] bg-[#09090B] text-[#A1A1AA]'
                          : 'border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#FAFAFA]'
                      }`}
                    >
                      <p className="font-medium">{n.title}</p>
                      <p className="mt-0.5 text-[11px] text-[#A1A1AA]">{n.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú de avatar */}
        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((o) => !o);
              setNotifOpen(false);
            }}
            aria-label="Menú de usuario"
            aria-expanded={menuOpen}
            className="flex items-center gap-2 rounded-md border border-[#27272A] bg-[#111113] px-2 py-1 text-xs text-[#FAFAFA] transition-colors hover:border-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6]"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded bg-[#18181B] font-semibold text-[#FAFAFA]">
              {getInitials(profile.username)}
            </span>
            <span className="max-w-28 truncate font-medium">{profile.username}</span>
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-lg border border-[#27272A] bg-[#111113] p-1.5 shadow-xl">
              <div className="border-b border-[#27272A] px-2.5 py-2">
                <p className="truncate text-xs font-semibold text-[#FAFAFA]">{profile.username}</p>
                <p className="text-[11px] text-[#71717A]">
                  {activeAccountId ? t('common.demoLocal') : 'Modo invitado (0 XP inicial)'}
                </p>
              </div>
              <div className="mt-1 space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-[#D4D4D8] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                >
                  <User aria-hidden="true" className="h-3.5 w-3.5 text-[#71717A]" />
                  <span>{t('nav.profile')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/login');
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-[#D4D4D8] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                >
                  <LogIn aria-hidden="true" className="h-3.5 w-3.5 text-[#71717A]" />
                  <span>{activeAccountId ? t('nav.switchAccount') : t('nav.login')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    navigate('/profile');
                  }}
                  className="flex w-full items-center gap-2 rounded px-2.5 py-1.5 text-left text-xs text-[#D4D4D8] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                >
                  <RotateCcw aria-hidden="true" className="h-3.5 w-3.5 text-[#71717A]" />
                  <span>{t('errorBoundary.resetLocal')}</span>
                </button>
              </div>
              <div className="mt-1 border-t border-[#27272A] pt-1">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start text-red-400 hover:text-red-300"
                  onClick={() => {
                    setMenuOpen(false);
                    logoutAccount();
                    navigate('/login');
                  }}
                >
                  <LogOut aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>{t('nav.logout')}</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
