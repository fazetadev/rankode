import { useEffect, useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Zap, Clock, RotateCcw, Flame } from 'lucide-react';
import { DIFFICULTY_META } from '../config';
import { QUIZ_QUESTIONS } from '../data/quizzes';
import { getLanguageLabel } from '../lib/format';
import { useAppStore } from '../store/useAppStore';
import { useT } from '../i18n/useT';
import type { QuizQuestion, QuizType } from '../types';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { CodeBlock } from '../components/ui/CodeBlock';
import { ProgressBar } from '../components/ui/ProgressBar';

type FilterType = QuizType | 'all';

const SESSION_SIZE = 10;
const TIMER_SECONDS = 30;

function pickSessionQuestions(type: FilterType): QuizQuestion[] {
  const pool = type === 'all' ? QUIZ_QUESTIONS : QUIZ_QUESTIONS.filter((q) => q.type === type);
  const copy = [...pool];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, Math.min(SESSION_SIZE, copy.length));
}

export default function Practice() {
  const t = useT();
  const recordQuizXp = useAppStore((s) => s.recordQuizXp);
  const addToast = useAppStore((s) => s.addToast);

  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [useTimer, setUseTimer] = useState(false);
  const [phase, setPhase] = useState<'setup' | 'active' | 'summary'>('setup');
  const [sessionQuestions, setSessionQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [correctCount, setCorrectCount] = useState(0);
  const [answerStreak, setAnswerStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [sessionXp, setSessionXp] = useState(0);

  const currentQuestion = sessionQuestions[currentIndex];
  const answered = selectedOption !== null || (useTimer && timeLeft === 0 && phase === 'active');

  useEffect(() => {
    if (phase !== 'active' || !useTimer || answered) return;
    if (timeLeft <= 0) return;

    const timer = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setAnswerStreak(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [phase, useTimer, answered, timeLeft]);

  const startSession = () => {
    const picked = pickSessionQuestions(typeFilter);
    setSessionQuestions(picked);
    setCurrentIndex(0);
    setSelectedOption(null);
    setTimeLeft(TIMER_SECONDS);
    setCorrectCount(0);
    setAnswerStreak(0);
    setBestStreak(0);
    setSessionXp(0);
    setPhase('active');
  };

  const handleSelectOption = (idx: number) => {
    if (answered || !currentQuestion) return;
    setSelectedOption(idx);
    if (idx === currentQuestion.correctIndex) {
      setCorrectCount((c) => c + 1);
      setSessionXp((x) => x + currentQuestion.xp);
      setAnswerStreak((s) => {
        const next = s + 1;
        setBestStreak((b) => Math.max(b, next));
        return next;
      });
    } else {
      setAnswerStreak(0);
    }
  };

  const handleNext = () => {
    if (currentIndex + 1 >= sessionQuestions.length) {
      if (sessionXp > 0) {
        recordQuizXp(sessionXp);
        addToast({
          title: `+${sessionXp} XP en práctica rápida`,
          description: `Acertaste ${correctCount} de ${sessionQuestions.length} preguntas.`,
          variant: 'success',
        });
      }
      setPhase('summary');
      return;
    }
    setCurrentIndex((i) => i + 1);
    setSelectedOption(null);
    setTimeLeft(TIMER_SECONDS);
  };

  const countsByType = useMemo(
    () => ({
      all: QUIZ_QUESTIONS.length,
      output: QUIZ_QUESTIONS.filter((q) => q.type === 'output').length,
      bug: QUIZ_QUESTIONS.filter((q) => q.type === 'bug').length,
      complexity: QUIZ_QUESTIONS.filter((q) => q.type === 'complexity').length,
    }),
    []
  );

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-[#FAFAFA]">
            {t('practice.title')}
          </h1>
          <p className="mt-1 text-sm text-[#A1A1AA]">{t('practice.subtitle')}</p>
        </div>
        {phase === 'active' && (
          <div className="flex items-center gap-3 text-xs">
            <span className="inline-flex items-center gap-1.5 rounded-md border border-[#27272A] bg-[#111113] px-2.5 py-1 font-mono text-[#FAFAFA]">
              <Flame aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
              {answerStreak}
            </span>
            <span className="font-mono font-semibold text-[#8B5CF6]">+{sessionXp} XP</span>
          </div>
        )}
      </header>

      {phase === 'setup' && (
        <Card padding="lg" className="space-y-5">
          <div>
            <h2 className="text-sm font-semibold text-[#FAFAFA]">Configura tu sesión</h2>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              Elige un enfoque o practica de forma mixta. Cada respuesta correcta suma entre 5 y 15 XP.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                { id: 'all', label: t('practice.allTypes'), count: countsByType.all },
                { id: 'output', label: t('practice.typeOutput'), count: countsByType.output },
                { id: 'bug', label: t('practice.typeBug'), count: countsByType.bug },
                { id: 'complexity', label: t('practice.typeComplexity'), count: countsByType.complexity },
              ] as const
            ).map((opt) => {
              const active = typeFilter === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTypeFilter(opt.id)}
                  aria-pressed={active}
                  className={`flex items-center justify-between rounded-md border p-3 text-left text-xs transition-colors ${
                    active
                      ? 'border-[#8B5CF6] bg-[#8B5CF6]/10 text-[#FAFAFA]'
                      : 'border-[#27272A] bg-[#09090B] text-[#A1A1AA] hover:border-[#3F3F46] hover:text-[#FAFAFA]'
                  }`}
                >
                  <span className="font-medium">{opt.label}</span>
                  <span className="font-mono text-[#71717A]">{opt.count}</span>
                </button>
              );
            })}
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 text-xs text-[#D4D4D8]">
            <input
              type="checkbox"
              checked={useTimer}
              onChange={(e) => setUseTimer(e.target.checked)}
              className="h-4 w-4 rounded border-[#27272A] bg-[#09090B] accent-[#8B5CF6]"
            />
            <Clock aria-hidden="true" className="h-3.5 w-3.5 text-[#A1A1AA]" />
            <span>{t('practice.timerToggle')}</span>
          </label>

          <div className="border-t border-[#27272A] pt-4">
            <Button variant="primary" size="md" onClick={startSession}>
              <Zap aria-hidden="true" className="h-4 w-4" />
              <span>{t('practice.startSession')}</span>
            </Button>
          </div>
        </Card>
      )}

      {phase === 'active' && currentQuestion && (
        <Card padding="lg" className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono text-[#A1A1AA]">
                {t('practice.questionOf', {
                  current: currentIndex + 1,
                  total: sessionQuestions.length,
                })}
              </span>
              <div className="flex items-center gap-2">
                <Badge variant="neutral">{getLanguageLabel(currentQuestion.language)}</Badge>
                <span className={DIFFICULTY_META[currentQuestion.difficulty].colorClass}>
                  {DIFFICULTY_META[currentQuestion.difficulty].label}
                </span>
                <span className="font-mono text-[#8B5CF6]">+{currentQuestion.xp} XP</span>
                {useTimer && (
                  <span
                    className={`inline-flex items-center gap-1 font-mono font-semibold tabular-nums ${
                      timeLeft <= 7 ? 'text-red-400' : 'text-[#FAFAFA]'
                    }`}
                  >
                    <Clock aria-hidden="true" className="h-3.5 w-3.5" />
                    {timeLeft}s
                  </span>
                )}
              </div>
            </div>
            <ProgressBar
              value={currentIndex + (answered ? 1 : 0)}
              max={sessionQuestions.length}
              heightClass="h-1.5"
              ariaLabel="Progreso de sesión"
            />
          </div>

          <div className="space-y-3">
            <h2 className="text-base font-semibold text-[#FAFAFA]">{currentQuestion.prompt}</h2>
            <CodeBlock
              code={currentQuestion.code}
              language={currentQuestion.language}
              showCopy={false}
            />
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {currentQuestion.options.map((opt, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQuestion.correctIndex;
              let style =
                'border-[#27272A] bg-[#09090B] text-[#E4E4E7] hover:border-[#3F3F46] hover:bg-[#18181B]';
              if (answered) {
                if (isCorrect) {
                  style = 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300';
                } else if (isSelected) {
                  style = 'border-red-500/50 bg-red-500/10 text-red-300';
                } else {
                  style = 'border-[#27272A] bg-[#09090B] text-[#71717A]';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={answered}
                  onClick={() => handleSelectOption(idx)}
                  className={`flex items-center justify-between gap-3 rounded-md border px-4 py-3 text-left text-xs transition-colors ${style}`}
                >
                  <span className="font-mono">{opt}</span>
                  {answered && isCorrect && (
                    <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0 text-emerald-400" />
                  )}
                  {answered && isSelected && !isCorrect && (
                    <XCircle aria-hidden="true" className="h-4 w-4 shrink-0 text-red-400" />
                  )}
                </button>
              );
            })}
          </div>

          {answered && (
            <div className="space-y-3 rounded-md border border-[#27272A] bg-[#09090B] p-4">
              <div className="flex items-center gap-2 text-xs font-semibold">
                {selectedOption === currentQuestion.correctIndex ? (
                  <span className="text-emerald-400">{t('practice.correctLabel')}</span>
                ) : (
                  <span className="text-red-400">{t('practice.wrongLabel')}</span>
                )}
              </div>
              <p className="text-xs leading-relaxed text-[#D4D4D8]">
                {currentQuestion.explanation}
              </p>
              <div className="flex justify-end">
                <Button variant="primary" size="sm" onClick={handleNext}>
                  {currentIndex + 1 >= sessionQuestions.length
                    ? t('practice.finishSession')
                    : t('practice.nextQuestion')}
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {phase === 'summary' && (
        <Card padding="lg" className="space-y-5 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-[#8B5CF6]">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[#FAFAFA]">{t('practice.sessionComplete')}</h2>
            <p className="mt-1 text-xs text-[#A1A1AA]">
              Has terminado la ronda de {sessionQuestions.length} microejercicios.
            </p>
          </div>

          <div className="mx-auto grid max-w-md grid-cols-3 gap-3">
            <div className="rounded-md border border-[#27272A] bg-[#09090B] p-3">
              <span className="text-[11px] text-[#71717A]">Aciertos</span>
              <p className="mt-1 font-mono text-lg font-semibold text-[#FAFAFA]">
                {correctCount}/{sessionQuestions.length}
              </p>
            </div>
            <div className="rounded-md border border-[#27272A] bg-[#09090B] p-3">
              <span className="text-[11px] text-[#71717A]">Mejor racha</span>
              <p className="mt-1 font-mono text-lg font-semibold text-amber-400">{bestStreak}</p>
            </div>
            <div className="rounded-md border border-[#27272A] bg-[#09090B] p-3">
              <span className="text-[11px] text-[#71717A]">XP ganado</span>
              <p className="mt-1 font-mono text-lg font-semibold text-[#8B5CF6]">+{sessionXp}</p>
            </div>
          </div>

          <div className="flex justify-center gap-2 pt-2">
            <Button variant="secondary" size="sm" onClick={() => setPhase('setup')}>
              Cambiar filtros
            </Button>
            <Button variant="primary" size="sm" onClick={startSession}>
              <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
              <span>{t('practice.restartSession')}</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
