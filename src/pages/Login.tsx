import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogIn, UserPlus, UserCheck, ArrowRight } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/useT';
import { BrandLogo } from '../components/ui/BrandLogo';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { getInitials } from '../lib/format';

const COUNTRIES = [
  { value: 'ES', label: 'España (ES)' },
  { value: 'MX', label: 'México (MX)' },
  { value: 'AR', label: 'Argentina (AR)' },
  { value: 'CO', label: 'Colombia (CO)' },
  { value: 'CL', label: 'Chile (CL)' },
  { value: 'PE', label: 'Perú (PE)' },
  { value: 'US', label: 'Estados Unidos (US)' },
];

export default function Login() {
  const t = useT();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo =
    (location.state as { from?: string } | null)?.from || '/';

  const accounts = useAppStore((s) => s.accounts);
  const activeAccountId = useAppStore((s) => s.activeAccountId);
  const loginAccount = useAppStore((s) => s.loginAccount);
  const registerAccount = useAppStore((s) => s.registerAccount);
  const switchAccount = useAppStore((s) => s.switchAccount);
  const continueAsGuest = useAppStore((s) => s.continueAsGuest);

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [identifier, setIdentifier] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('ES');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (mode === 'login') {
      const res = loginAccount(identifier, password);
      if (!res.ok) {
        setError(res.error ?? t('auth.invalidCredentials'));
        return;
      }
      navigate(redirectTo, { replace: true });
    } else {
      const res = registerAccount({ username, email, password, country });
      if (!res.ok) {
        setError(res.error ?? t('auth.validationRequired'));
        return;
      }
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#09090B] px-4 py-10">
      <div className="w-full max-w-md space-y-6">
        <div className="flex flex-col items-center text-center">
          <BrandLogo size="lg" />
          <div className="mt-2 flex items-center gap-2">
            <Badge variant="accent">{t('common.demoLocal')}</Badge>
          </div>
          <h1 className="mt-4 text-xl font-semibold tracking-tight text-[#FAFAFA]">
            {t('auth.title')}
          </h1>
          <p className="mt-1 text-xs leading-relaxed text-[#A1A1AA]">
            {t('auth.subtitle')}
          </p>
        </div>

        <Card padding="lg" className="space-y-5">
          <div
            role="tablist"
            aria-label="Modo de acceso"
            className="grid grid-cols-2 rounded-md border border-[#27272A] bg-[#09090B] p-1"
          >
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'login'}
              onClick={() => {
                setMode('login');
                setError(null);
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === 'login'
                  ? 'bg-[#18181B] text-[#FAFAFA]'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              <LogIn aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{t('auth.loginTab')}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={mode === 'register'}
              onClick={() => {
                setMode('register');
                setError(null);
              }}
              className={`inline-flex items-center justify-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium transition-colors ${
                mode === 'register'
                  ? 'bg-[#18181B] text-[#FAFAFA]'
                  : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
              }`}
            >
              <UserPlus aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{t('auth.registerTab')}</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'login' ? (
              <div>
                <label
                  htmlFor="login-identifier"
                  className="mb-1.5 block text-xs font-medium text-[#D4D4D8]"
                >
                  {t('auth.identifierLabel')}
                </label>
                <Input
                  id="login-identifier"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={t('auth.identifierPlaceholder')}
                  autoComplete="username"
                />
              </div>
            ) : (
              <>
                <div>
                  <label
                    htmlFor="reg-username"
                    className="mb-1.5 block text-xs font-medium text-[#D4D4D8]"
                  >
                    {t('auth.usernameLabel')}
                  </label>
                  <Input
                    id="reg-username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder={t('auth.usernamePlaceholder')}
                    maxLength={28}
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-email"
                    className="mb-1.5 block text-xs font-medium text-[#D4D4D8]"
                  >
                    {t('auth.emailLabel')}
                  </label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                  />
                </div>
                <div>
                  <label
                    htmlFor="reg-country"
                    className="mb-1.5 block text-xs font-medium text-[#D4D4D8]"
                  >
                    {t('auth.countryLabel')}
                  </label>
                  <Select
                    id="reg-country"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    options={COUNTRIES}
                  />
                </div>
              </>
            )}

            <div>
              <label
                htmlFor="auth-password"
                className="mb-1.5 block text-xs font-medium text-[#D4D4D8]"
              >
                {t('auth.passwordLabel')}
              </label>
              <Input
                id="auth-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t('auth.passwordPlaceholder')}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                {error}
              </p>
            )}

            <Button type="submit" variant="primary" size="md" className="w-full">
              <span>{mode === 'login' ? t('auth.submitLogin') : t('auth.submitRegister')}</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </form>

          <div className="relative flex items-center py-1">
            <div className="flex-grow border-t border-[#27272A]" />
            <span className="mx-3 shrink text-[11px] text-[#71717A]">o</span>
            <div className="flex-grow border-t border-[#27272A]" />
          </div>

          <Button
            type="button"
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => {
              continueAsGuest();
              navigate(redirectTo, { replace: true });
            }}
          >
            <span>{t('auth.guestAction')}</span>
          </Button>
        </Card>

        {accounts.length > 0 && (
          <Card padding="md" className="space-y-2.5">
            <p className="text-xs font-medium text-[#A1A1AA]">{t('auth.savedAccounts')}</p>
            <div className="space-y-1.5">
              {accounts.map((acc) => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => {
                    switchAccount(acc.id);
                    navigate(redirectTo, { replace: true });
                  }}
                  className="flex w-full items-center justify-between rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2 text-left text-xs transition-colors hover:border-[#3F3F46] hover:bg-[#18181B]"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="flex h-7 w-7 items-center justify-center rounded bg-[#18181B] font-semibold text-[#FAFAFA]">
                      {getInitials(acc.username)}
                    </span>
                    <div>
                      <p className="font-medium text-[#FAFAFA]">{acc.username}</p>
                      <p className="text-[11px] text-[#71717A]">{acc.email}</p>
                    </div>
                  </div>
                  {acc.id === activeAccountId && (
                    <UserCheck aria-hidden="true" className="h-4 w-4 text-[#8B5CF6]" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}

        <p className="text-center text-[11px] text-[#71717A]">
          {t('auth.demoSeedHint')}
        </p>
      </div>
    </div>
  );
}
