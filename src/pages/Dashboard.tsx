import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Flame, CheckCircle2, Target, Code2 } from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../config';
import { CHALLENGES } from '../data/challenges';
import { getLanguageLabel, stripMarkdown } from '../lib/format';
import { getDailyChallengeId, getRankForXp } from '../lib/xp';
import { useAppStore } from '../store/useAppStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { XpBar } from '../components/features/XpBar';
import { ChallengeCard } from '../components/features/ChallengeCard';
import { XpChart } from '../components/features/XpChart';
import type { Difficulty, Language } from '../types';

export default function Dashboard() {
  const navigate = useNavigate();
  const profile = useAppStore((s) => s.profile);
  const xp = useAppStore((s) => s.xp);
  const streakDays = useAppStore((s) => s.streakDays);
  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const setLanguage = useAppStore((s) => s.setLanguage);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);
  const submissions = useAppStore((s) => s.submissions);
  const activityMap = useAppStore((s) => s.activityMap);

  const currentRank = getRankForXp(xp);

  const accuracy = useMemo(() => {
    if (submissions.length === 0) return 0;
    const passed = submissions.filter((s) => s.passed).length;
    return Math.round((passed / submissions.length) * 100);
  }, [submissions]);

  const topLanguage = useMemo(() => {
    if (submissions.length === 0) return selectedLanguage;
    const counts = new Map<Language, number>();
    for (const sub of submissions) {
      counts.set(sub.language, (counts.get(sub.language) ?? 0) + 1);
    }
    let best: Language = selectedLanguage;
    let bestCount = -1;
    counts.forEach((count, lang) => {
      if (count > bestCount) {
        bestCount = count;
        best = lang;
      }
    });
    return best;
  }, [submissions, selectedLanguage]);

  const dailyChallenge = useMemo(() => {
    const dailyId = getDailyChallengeId(CHALLENGES.map((c) => c.id));
    return CHALLENGES.find((c) => c.id === dailyId) ?? CHALLENGES[0];
  }, []);

  const recommendedChallenges = useMemo(() => {
    const preferredOrder: Record<string, Difficulty[]> = {
      rookie: ['easy', 'medium', 'hard', 'expert'],
      bronze: ['easy', 'medium', 'hard', 'expert'],
      silver: ['medium', 'easy', 'hard', 'expert'],
      gold: ['medium', 'hard', 'easy', 'expert'],
      platinum: ['hard', 'medium', 'expert', 'easy'],
      diamond: ['hard', 'expert', 'medium', 'easy'],
      master: ['expert', 'hard', 'medium', 'easy'],
      legend: ['expert', 'hard', 'medium', 'easy'],
    };
    const order = preferredOrder[currentRank.id] ?? ['easy', 'medium', 'hard', 'expert'];

    return CHALLENGES.filter(
      (c) =>
        c.languages.includes(selectedLanguage) &&
        c.id !== dailyChallenge.id &&
        !solvedChallengeIds.includes(c.id)
    )
      .sort((a, b) => order.indexOf(a.difficulty) - order.indexOf(b.difficulty))
      .slice(0, 6);
  }, [currentRank.id, selectedLanguage, dailyChallenge.id, solvedChallengeIds]);

  const dailySolved = solvedChallengeIds.includes(dailyChallenge.id);
  const dailyDiff = DIFFICULTY_META[dailyChallenge.difficulty];
  const dailyCat = CATEGORY_META[dailyChallenge.category];

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">
            Hola, {profile.username}
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">
            Tu progreso competitivo y recomendaciones para hoy.
          </p>
        </div>

        <div className="flex items-center gap-1 rounded-md border border-[#27272A] bg-[#111113] p-1 self-start">
          <span className="sr-only">Lenguaje activo</span>
          {SUPPORTED_LANGUAGES.map((lang) => {
            const active = selectedLanguage === lang.id;
            return (
              <button
                key={lang.id}
                type="button"
                onClick={() => setLanguage(lang.id)}
                aria-pressed={active}
                className={`rounded px-2.5 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
                  active
                    ? 'bg-[#8B5CF6] text-[#FAFAFA]'
                    : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
                }`}
              >
                {lang.label}
              </button>
            );
          })}
        </div>
      </header>

      <Card padding="lg">
        <XpBar xp={xp} />
      </Card>

      <section aria-label="Estadísticas generales" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Desafíos resueltos</span>
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 text-[#71717A]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#FAFAFA]">
            {solvedChallengeIds.length}
            <span className="text-sm font-normal text-[#71717A]"> / {CHALLENGES.length}</span>
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Tasa de acierto</span>
            <Target aria-hidden="true" className="h-4 w-4 text-[#71717A]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#FAFAFA]">
            {accuracy}%
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Racha actual</span>
            <Flame aria-hidden="true" className="h-4 w-4 text-[#71717A]" />
          </div>
          <p className="mt-2 font-mono text-2xl font-semibold tabular-nums text-[#FAFAFA]">
            {streakDays} {streakDays === 1 ? 'día' : 'días'}
          </p>
        </Card>

        <Card padding="md">
          <div className="flex items-center justify-between text-xs text-[#A1A1AA]">
            <span>Lenguaje más usado</span>
            <Code2 aria-hidden="true" className="h-4 w-4 text-[#71717A]" />
          </div>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-[#FAFAFA]">
            {getLanguageLabel(topLanguage)}
          </p>
        </Card>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 items-stretch">
        <Card padding="lg" className="lg:col-span-7 flex flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-xs font-medium text-[#8B5CF6]">
                Desafío diario · Bonus XP x1.5
              </span>
              {dailySolved && (
                <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                  <CheckCircle2 aria-hidden="true" className="h-3.5 w-3.5" />
                  Completado hoy
                </span>
              )}
            </div>

            <h2 className="mt-2.5 text-lg font-semibold text-[#FAFAFA]">
              {dailyChallenge.title}
            </h2>

            <div className="mt-1.5 flex items-center gap-2 text-xs text-[#A1A1AA]">
              <span>{dailyCat.label}</span>
              <span aria-hidden="true">·</span>
              <span className={dailyDiff.colorClass}>{dailyDiff.label}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-[#FAFAFA]">
                +{Math.round(dailyChallenge.xp * 1.5)} XP máx. base
              </span>
            </div>

            <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">
              {stripMarkdown(dailyChallenge.description)}
            </p>
          </div>

          <div className="mt-5 flex items-center justify-between border-t border-[#27272A] pt-4">
            <span className="text-xs text-[#71717A]">
              Lenguaje seleccionado: <strong className="text-[#FAFAFA]">{getLanguageLabel(selectedLanguage)}</strong>
            </span>
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/challenges/${dailyChallenge.id}`)}
            >
              <span>{dailySolved ? 'Revisar solución' : 'Resolver desafío'}</span>
              <ArrowRight aria-hidden="true" className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        <Card padding="lg" className="lg:col-span-5">
          <XpChart activityMap={activityMap} />
        </Card>
      </div>

      <section aria-labelledby="recommended-heading" className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 id="recommended-heading" className="text-base font-semibold text-[#FAFAFA]">
              Continuar practicando
            </h2>
            <p className="text-xs text-[#A1A1AA]">
              Recomendados para rango {currentRank.name} en {getLanguageLabel(selectedLanguage)}
            </p>
          </div>
          <Link
            to="/challenges"
            className="inline-flex items-center gap-1 text-xs font-medium text-[#8B5CF6] hover:text-[#A78BFA] whitespace-nowrap"
          >
            <span>Ver todos</span>
            <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>

        {recommendedChallenges.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recommendedChallenges.map((ch) => (
              <ChallengeCard
                key={ch.id}
                challenge={ch}
                solved={solvedChallengeIds.includes(ch.id)}
              />
            ))}
          </div>
        ) : (
          <Card padding="lg" className="text-center">
            <p className="text-sm font-medium text-[#FAFAFA]">
              Has completado todos los desafíos recomendados disponibles.
            </p>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              Explora el catálogo completo para repasar soluciones o probar otro lenguaje.
            </p>
            <div className="mt-4">
              <Button variant="secondary" size="sm" onClick={() => navigate('/challenges')}>
                Explorar catálogo
              </Button>
            </div>
          </Card>
        )}
      </section>
    </div>
  );
}
