import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Pencil, RotateCcw } from 'lucide-react';
import { CATEGORY_META, SUPPORTED_LANGUAGES } from '../config';
import { CHALLENGES } from '../data/challenges';
import {
  formatDateShort,
  formatDateTime,
  formatDurationMs,
  formatNumber,
  getInitials,
  getLanguageLabel,
} from '../lib/format';
import { useAppStore } from '../store/useAppStore';
import type { Category, Language } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { ProgressBar } from '../components/ui/ProgressBar';
import { Modal } from '../components/ui/Modal';
import { RankBadge } from '../components/features/RankBadge';
import { ActivityHeatmap } from '../components/features/ActivityHeatmap';

export default function Profile() {
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);
  const submissions = useAppStore((s) => s.submissions);
  const activityMap = useAppStore((s) => s.activityMap);
  const updateUsername = useAppStore((s) => s.updateUsername);
  const resetDemoData = useAppStore((s) => s.resetDemoData);
  const addToast = useAppStore((s) => s.addToast);

  const [editingName, setEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(profile.username);
  const [langFilter, setLangFilter] = useState<Language | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'passed' | 'failed'>('all');
  const [resetModalOpen, setResetModalOpen] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = nameInput.trim();
    if (!trimmed) {
      addToast({
        title: 'Nombre inválido',
        description: 'Introduce un nombre de usuario no vacío.',
        variant: 'error',
      });
      return;
    }
    updateUsername(trimmed);
    setEditingName(false);
    addToast({
      title: 'Nombre actualizado',
      description: `Tu perfil ahora muestra "${trimmed}".`,
      variant: 'success',
    });
  };

  const languageStats = useMemo(() => {
    return SUPPORTED_LANGUAGES.map((lang) => {
      const count = submissions.filter((s) => s.language === lang.id && s.passed).length;
      const total = submissions.filter((s) => s.language === lang.id).length;
      return {
        ...lang,
        passedCount: count,
        totalCount: total,
      };
    });
  }, [submissions]);

  const maxLangCount = Math.max(1, ...languageStats.map((l) => l.totalCount));

  const categoryStats = useMemo(() => {
    return (['logic', 'debugging', 'problem-solving', 'optimization'] as Category[]).map((cat) => {
      const catChallenges = CHALLENGES.filter((c) => c.category === cat);
      const solved = catChallenges.filter((c) => solvedChallengeIds.includes(c.id)).length;
      return {
        id: cat,
        label: CATEGORY_META[cat].label,
        solved,
        total: catChallenges.length,
      };
    });
  }, [solvedChallengeIds]);

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((s) => {
      if (langFilter !== 'all' && s.language !== langFilter) return false;
      if (statusFilter === 'passed' && !s.passed) return false;
      if (statusFilter === 'failed' && s.passed) return false;
      return true;
    });
  }, [submissions, langFilter, statusFilter]);

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">Perfil</h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Estadísticas personales, actividad reciente e historial de envíos.
          </p>
        </div>

        <Button variant="danger" size="sm" onClick={() => setResetModalOpen(true)}>
          <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
          <span>Restablecer datos de demo</span>
        </Button>
      </header>

      {/* Cabecera del perfil */}
      <Card padding="lg">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-lg font-semibold text-[#FAFAFA]">
              {getInitials(profile.username)}
            </div>

            <div className="space-y-1">
              {editingName ? (
                <form onSubmit={handleSaveName} className="flex items-center gap-2">
                  <Input
                    aria-label="Nuevo nombre de usuario"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    maxLength={28}
                    className="h-8 w-48"
                    autoFocus
                  />
                  <Button type="submit" variant="primary" size="sm">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>Guardar</span>
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setNameInput(profile.username);
                      setEditingName(false);
                    }}
                  >
                    Cancelar
                  </Button>
                </form>
              ) : (
                <div className="flex items-center gap-2">
                  <h2 className="text-lg font-semibold text-[#FAFAFA]">{profile.username}</h2>
                  <button
                    type="button"
                    onClick={() => {
                      setNameInput(profile.username);
                      setEditingName(true);
                    }}
                    aria-label="Editar nombre de usuario"
                    className="rounded p-1 text-[#A1A1AA] hover:bg-[#18181B] hover:text-[#FAFAFA]"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2 text-xs text-[#A1A1AA]">
                <RankBadge xp={xp} />
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#FAFAFA]">
                  {formatNumber(xp)} XP
                </span>
                <span aria-hidden="true">·</span>
                <span>Miembro desde {formatDateShort(profile.joinedAt)}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-6 border-t border-[#27272A] pt-4 sm:border-t-0 sm:pt-0">
            <div>
              <span className="text-xs text-[#A1A1AA]">Resueltos</span>
              <p className="font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                {solvedChallengeIds.length} / {CHALLENGES.length}
              </p>
            </div>
            <div>
              <span className="text-xs text-[#A1A1AA]">Envíos</span>
              <p className="font-mono text-lg font-semibold tabular-nums text-[#FAFAFA]">
                {submissions.length}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas por lenguaje y categoría */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Actividad por lenguaje</h3>
          <div className="space-y-3">
            {languageStats.map((lang) => (
              <div key={lang.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#FAFAFA]">{lang.label}</span>
                  <span className="font-mono tabular-nums text-[#A1A1AA]">
                    {lang.passedCount} aprobados / {lang.totalCount} envíos
                  </span>
                </div>
                <ProgressBar
                  value={lang.totalCount}
                  max={maxLangCount}
                  heightClass="h-1.5"
                  ariaLabel={`Envíos en ${lang.label}`}
                />
              </div>
            ))}
          </div>
        </Card>

        <Card padding="lg" className="space-y-4">
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Progreso por categoría</h3>
          <div className="space-y-3">
            {categoryStats.map((cat) => (
              <div key={cat.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#FAFAFA]">{cat.label}</span>
                  <span className="font-mono tabular-nums text-[#A1A1AA]">
                    {cat.solved} / {cat.total}
                  </span>
                </div>
                <ProgressBar
                  value={cat.solved}
                  max={cat.total}
                  heightClass="h-1.5"
                  ariaLabel={`Progreso en ${cat.label}`}
                />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Mapa de actividad */}
      <Card padding="lg">
        <ActivityHeatmap activityMap={activityMap} />
      </Card>

      {/* Historial de envíos */}
      <Card padding="none">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#27272A] p-4">
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Historial de envíos</h3>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              aria-label="Filtrar envíos por lenguaje"
              value={langFilter}
              onChange={(e) => setLangFilter(e.target.value as Language | 'all')}
              className="w-36"
              options={[
                { value: 'all', label: 'Todos' },
                ...SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label })),
              ]}
            />
            <Select
              aria-label="Filtrar envíos por resultado"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'passed' | 'failed')}
              className="w-36"
              options={[
                { value: 'all', label: 'Todos' },
                { value: 'passed', label: 'Aprobados' },
                { value: 'failed', label: 'Fallidos' },
              ]}
            />
          </div>
        </div>

        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#A1A1AA]">
            No hay envíos registrados con estos filtros.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-[#27272A] bg-[#09090B] text-[#A1A1AA]">
                  <th className="px-4 py-2.5 font-medium">Desafío</th>
                  <th className="px-4 py-2.5 font-medium">Lenguaje</th>
                  <th className="px-4 py-2.5 font-medium">Resultado</th>
                  <th className="px-4 py-2.5 font-medium text-right">Casos</th>
                  <th className="px-4 py-2.5 font-medium text-right">Tiempo</th>
                  <th className="px-4 py-2.5 font-medium text-right">XP</th>
                  <th className="px-4 py-2.5 font-medium text-right">Fecha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#27272A]">
                {filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-[#18181B]">
                    <td className="px-4 py-3 font-medium text-[#FAFAFA]">
                      <Link
                        to={`/challenges/${sub.challengeId}`}
                        className="hover:text-[#8B5CF6]"
                      >
                        {sub.challengeTitle}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-[#A1A1AA]">
                      {getLanguageLabel(sub.language)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`font-medium ${
                          sub.passed ? 'text-emerald-400' : 'text-red-400'
                        }`}
                      >
                        {sub.passed ? 'Aprobado' : 'Fallido'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#FAFAFA]">
                      {sub.passedCount}/{sub.totalCount}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#A1A1AA]">
                      {formatDurationMs(sub.runtimeMs)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#8B5CF6]">
                      {sub.xpEarned > 0 ? `+${sub.xpEarned}` : '—'}
                    </td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums text-[#71717A]">
                      {formatDateTime(sub.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        title="Restablecer datos de demo"
        description="Se borrarán tus borradores de código, historial de envíos y XP acumulado, volviendo al estado inicial."
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setResetModalOpen(false)}>
            Cancelar
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              resetDemoData();
              setNameInput('tu_usuario');
              setResetModalOpen(false);
            }}
          >
            Confirmar restablecimiento
          </Button>
        </div>
      </Modal>
    </div>
  );
}
