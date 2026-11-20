import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Play,
  Send,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Lock,
  Award,
  Star,
  Bookmark,
  SlidersHorizontal,
  Maximize2,
  Minimize2,
  Gauge,
  BookOpen,
  FileText,
  FlaskConical,
  Trash2,
} from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../config';
import { CHALLENGES } from '../data/challenges';
import { estimateComplexity, meetsTargetComplexity } from '../lib/complexity';
import { formatDateTime, formatDurationMs, getLanguageLabel } from '../lib/format';
import { judgeRunner, runCustomJavaScriptInWorker } from '../lib/judge';
import { getDailyChallengeId } from '../lib/xp';
import { getDraftKey, useAppStore, type SubmissionOutcome } from '../store/useAppStore';
import { useT } from '../i18n/useT';
import type { ExecutionResult, Language, Submission } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { Markdown } from '../components/ui/Markdown';
import { CodeBlock } from '../components/ui/CodeBlock';
import { CodeEditor } from '../components/features/CodeEditor';
import { TestResults } from '../components/features/TestResults';
import { RankBadge } from '../components/features/RankBadge';

type LeftTab = 'statement' | 'hints' | 'editorial' | 'notes' | 'history';
type RightResultTab = 'results' | 'custom';
type MobilePane = 'statement' | 'editor';

export default function ChallengeDetail() {
  const t = useT();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const challenge = useMemo(() => CHALLENGES.find((c) => c.id === id), [id]);

  const selectedLanguage = useAppStore((s) => s.selectedLanguage);
  const setGlobalLanguage = useAppStore((s) => s.setLanguage);
  const drafts = useAppStore((s) => s.drafts);
  const setDraft = useAppStore((s) => s.setDraft);
  const resetDraft = useAppStore((s) => s.resetDraft);
  const unlockedHintsMap = useAppStore((s) => s.unlockedHints);
  const unlockHint = useAppStore((s) => s.unlockHint);
  const solvedChallengeIds = useAppStore((s) => s.solvedChallengeIds);
  const submissions = useAppStore((s) => s.submissions);
  const recordSubmission = useAppStore((s) => s.recordSubmission);
  const addToast = useAppStore((s) => s.addToast);
  const favorites = useAppStore((s) => s.favorites);
  const reviewLater = useAppStore((s) => s.reviewLater);
  const toggleFavorite = useAppStore((s) => s.toggleFavorite);
  const toggleReviewLater = useAppStore((s) => s.toggleReviewLater);
  const notesMap = useAppStore((s) => s.notes);
  const setNote = useAppStore((s) => s.setNote);
  const revealedSolutions = useAppStore((s) => s.revealedSolutions);
  const revealSolution = useAppStore((s) => s.revealSolution);
  const customTestsMap = useAppStore((s) => s.customTests);
  const saveCustomTest = useAppStore((s) => s.saveCustomTest);
  const deleteCustomTest = useAppStore((s) => s.deleteCustomTest);
  const splitRatio = useAppStore((s) => s.splitRatio);
  const setSplitRatio = useAppStore((s) => s.setSplitRatio);
  const editorSettings = useAppStore((s) => s.settings.editor);
  const updateEditorSettings = useAppStore((s) => s.updateEditorSettings);

  const [language, setLanguage] = useState<Language>(selectedLanguage);
  const [leftTab, setLeftTab] = useState<LeftTab>('statement');
  const [resultTab, setResultTab] = useState<RightResultTab>('results');
  const [mobilePane, setMobilePane] = useState<MobilePane>('statement');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [pendingHintIndex, setPendingHintIndex] = useState<number | null>(null);
  const [revealModalOpen, setRevealModalOpen] = useState(false);
  const [rewardModal, setRewardModal] = useState<SubmissionOutcome | null>(null);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [notesPreview, setNotesPreview] = useState(false);
  const [editorPopoverOpen, setEditorPopoverOpen] = useState(false);

  const [customArgsJson, setCustomArgsJson] = useState('[]');
  const [customExpectedJson, setCustomExpectedJson] = useState('');
  const [customResult, setCustomResult] = useState<ExecutionResult | null>(null);
  const [customError, setCustomError] = useState<string | null>(null);

  const splitContainerRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const sessionStartRef = useRef<number>(Date.now());
  const isResizingRef = useRef(false);

  const focusMode = searchParams.get('focus') === '1';

  const setFocusMode = useCallback(
    (enabled: boolean) => {
      const next = new URLSearchParams(searchParams);
      if (enabled) next.set('focus', '1');
      else next.delete('focus');
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  // Reiniciar temporizador y prueba personalizada al cambiar de desafío
  useEffect(() => {
    sessionStartRef.current = Date.now();
    setExecResult(null);
    setCustomResult(null);
    setCustomError(null);
    setLeftTab('statement');
    if (challenge?.tests.visible[0]) {
      setCustomArgsJson(JSON.stringify(challenge.tests.visible[0].input));
    } else {
      setCustomArgsJson('[]');
    }
    setCustomExpectedJson('');
  }, [challenge?.id]);

  // Esc para salir de Modo Enfoque + cerrar popover de editor al hacer click fuera
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (focusMode) setFocusMode(false);
        setEditorPopoverOpen(false);
      }
    };
    const onMouseDown = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setEditorPopoverOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    document.addEventListener('mousedown', onMouseDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('mousedown', onMouseDown);
    };
  }, [focusMode, setFocusMode]);

  // Arrastre de divisor vertical redimensionable
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      if (rect.width <= 0) return;
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitRatio(pct);
    };
    const onMouseUp = () => {
      isResizingRef.current = false;
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, [setSplitRatio]);

  const dailyId = useMemo(() => getDailyChallengeId(CHALLENGES.map((c) => c.id)), []);

  const code = useMemo(() => {
    if (!challenge) return '';
    const key = getDraftKey(challenge.id, language);
    return drafts[key] ?? challenge.starterCode[language];
  }, [challenge, drafts, language]);

  const complexityEstimate = useMemo(
    () => estimateComplexity(code, language, challenge?.entryPoint),
    [code, language, challenge?.entryPoint]
  );

  const isDaily = challenge ? challenge.id === dailyId : false;

  const handleSaveShortcut = useCallback(() => {
    if (!challenge) return;
    setDraft(challenge.id, language, code);
    addToast({
      title: 'Borrador guardado',
      description: `Guardado localmente en ${getLanguageLabel(language)}.`,
      variant: 'info',
    });
  }, [challenge, language, code, setDraft, addToast]);

  const handleRunVisible = useCallback(async () => {
    if (!challenge || isRunning) return;
    setIsRunning(true);
    setResultTab('results');
    try {
      const res = await judgeRunner.run(
        code,
        language,
        challenge.tests.visible,
        challenge,
        false
      );
      setExecResult(res);
    } catch (err) {
      addToast({
        title: 'No se pudo ejecutar el código',
        description: err instanceof Error ? err.message : String(err),
        variant: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  }, [isRunning, code, language, challenge, addToast]);

  const handleSubmitAll = useCallback(async () => {
    if (!challenge || isRunning) return;
    setIsRunning(true);
    setResultTab('results');
    try {
      const visibleRes = await judgeRunner.run(
        code,
        language,
        challenge.tests.visible,
        challenge,
        false
      );
      const hiddenRes = await judgeRunner.run(
        code,
        language,
        challenge.tests.hidden,
        challenge,
        true
      );

      const combined: ExecutionResult = {
        passed: visibleRes.passed && hiddenRes.passed,
        totalCount: visibleRes.totalCount + hiddenRes.totalCount,
        passedCount: visibleRes.passedCount + hiddenRes.passedCount,
        results: [...visibleRes.results, ...hiddenRes.results],
        logs: [...visibleRes.logs, ...hiddenRes.logs].slice(0, 100),
        runtimeMs: visibleRes.runtimeMs + hiddenRes.runtimeMs,
        error: visibleRes.error ?? hiddenRes.error,
        simulated: visibleRes.simulated,
        perfPassed: hiddenRes.perfPassed,
        perfDurationMs: hiddenRes.perfDurationMs,
      };

      const durationSec = Math.max(1, Math.round((Date.now() - sessionStartRef.current) / 1000));
      const meetsComplexityBonus =
        combined.passed &&
        challenge.category === 'optimization' &&
        Boolean(challenge.targetComplexity) &&
        meetsTargetComplexity(complexityEstimate.bigO, challenge.targetComplexity!) &&
        combined.perfPassed !== false;

      setExecResult(combined);
      const outcome = recordSubmission({
        challenge,
        language,
        result: combined,
        isDailyChallenge: isDaily,
        code,
        durationSec,
        meetsComplexityBonus,
      });

      if (combined.passed) {
        setRewardModal(outcome);
      } else {
        addToast({
          title: 'Envío fallido',
          description: `${combined.passedCount}/${combined.totalCount} casos aprobados.`,
          variant: 'error',
        });
      }
    } catch (err) {
      addToast({
        title: 'No se pudo enviar la solución',
        description: err instanceof Error ? err.message : String(err),
        variant: 'error',
      });
    } finally {
      setIsRunning(false);
    }
  }, [
    isRunning,
    code,
    language,
    challenge,
    recordSubmission,
    isDaily,
    complexityEstimate.bigO,
    addToast,
  ]);

  const handleRunCustomTest = useCallback(
    async (argsInput = customArgsJson, expectedInput = customExpectedJson) => {
      if (!challenge || language !== 'javascript' || isRunning) return;
      setCustomError(null);

      let parsedArgs: unknown;
      try {
        parsedArgs = JSON.parse(argsInput);
      } catch {
        setCustomError('Los argumentos deben ser un JSON válido (ej. [[1, 2, 3], 4]).');
        return;
      }
      if (!Array.isArray(parsedArgs)) {
        setCustomError('Los argumentos deben enviarse como un arreglo JSON (ej. ["hola"]).');
        return;
      }

      const trimmedExpected = expectedInput.trim();
      const hasExpected = trimmedExpected.length > 0;
      let parsedExpected: unknown = undefined;
      if (hasExpected) {
        try {
          parsedExpected = JSON.parse(trimmedExpected);
        } catch {
          setCustomError('El valor esperado debe ser JSON válido o dejarse vacío.');
          return;
        }
      }

      setIsRunning(true);
      try {
        const res = await runCustomJavaScriptInWorker(
          code,
          challenge.entryPoint,
          parsedArgs,
          hasExpected,
          parsedExpected,
          argsInput
        );
        setCustomResult(res);
      } finally {
        setIsRunning(false);
      }
    },
    [challenge, language, isRunning, code, customArgsJson, customExpectedJson]
  );

  // Guard condicional DESPUÉS de todos los hooks (0.4)
  if (!challenge) {
    return (
      <div className="rounded-lg border border-[#27272A] bg-[#111113] p-8 text-center">
        <h1 className="text-lg font-semibold text-[#FAFAFA]">Desafío no encontrado</h1>
        <p className="mt-1 text-sm text-[#A1A1AA]">
          El identificador solicitado no corresponde a ningún desafío disponible.
        </p>
        <div className="mt-4">
          <Button variant="secondary" size="sm" onClick={() => navigate('/challenges')}>
            Volver al catálogo
          </Button>
        </div>
      </div>
    );
  }

  const unlockedHints = unlockedHintsMap[challenge.id] ?? [];
  const isSolved = solvedChallengeIds.includes(challenge.id);
  const isSolutionRevealed = revealedSolutions.includes(challenge.id);
  const isEditorialUnlocked = isSolved || isSolutionRevealed;
  const isFavorite = favorites.includes(challenge.id);
  const isReviewLater = reviewLater.includes(challenge.id);
  const noteContent = notesMap[challenge.id] ?? '';
  const savedCustomTests = customTestsMap[challenge.id] ?? [];
  const challengeSubmissions = submissions.filter((s) => s.challengeId === challenge.id);

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang);
    setGlobalLanguage(nextLang);
    setExecResult(null);
    setCustomResult(null);
  };

  const handleResetCode = () => {
    resetDraft(challenge.id, language);
    setExecResult(null);
    addToast({
      title: 'Código restablecido',
      description: `Se restauró la plantilla inicial de ${getLanguageLabel(language)}.`,
      variant: 'info',
    });
  };

  const diffMeta = DIFFICULTY_META[challenge.difficulty];
  const catMeta = CATEGORY_META[challenge.category];
  const meetsComplexityTarget = challenge.targetComplexity
    ? meetsTargetComplexity(complexityEstimate.bigO, challenge.targetComplexity)
    : false;

  return (
    <div className="space-y-4">
      <header className="flex flex-col gap-3 border-b border-[#27272A] pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Link
            to="/challenges"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#A1A1AA] hover:text-[#FAFAFA]"
          >
            <ArrowLeft aria-hidden="true" className="h-3.5 w-3.5" />
            <span>Volver a desafíos</span>
          </Link>
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-lg font-semibold tracking-tight text-[#FAFAFA]">
              {challenge.title}
            </h1>
            {isSolved && (
              <Badge variant="success">
                <CheckCircle2 aria-hidden="true" className="h-3 w-3" />
                Resuelto
              </Badge>
            )}
            {isDaily && <Badge variant="accent">Diario x1.5</Badge>}
            {challenge.targetComplexity && (
              <Badge variant="neutral">Objetivo {challenge.targetComplexity}</Badge>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1A1AA]">
            <span>{catMeta.label}</span>
            <span aria-hidden="true">·</span>
            <span className={diffMeta.colorClass}>{diffMeta.label}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#FAFAFA]">+{challenge.xp} XP base</span>
            {challenge.acceptanceRate !== undefined && (
              <>
                <span aria-hidden="true">·</span>
                <span className="font-mono tabular-nums text-[#71717A]">
                  {challenge.acceptanceRate}% aceptación
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toggleFavorite(challenge.id)}
            aria-pressed={isFavorite}
            title={isFavorite ? t('challenge.favoriteRemove') : t('challenge.favoriteAdd')}
          >
            <Star
              aria-hidden="true"
              className={`h-3.5 w-3.5 ${isFavorite ? 'fill-amber-400 text-amber-400' : ''}`}
            />
            <span className="hidden sm:inline">Favorito</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => toggleReviewLater(challenge.id)}
            aria-pressed={isReviewLater}
            title={isReviewLater ? t('challenge.reviewRemove') : t('challenge.reviewAdd')}
          >
            <Bookmark
              aria-hidden="true"
              className={`h-3.5 w-3.5 ${isReviewLater ? 'fill-[#8B5CF6] text-[#8B5CF6]' : ''}`}
            />
            <span className="hidden sm:inline">Repasar</span>
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            onClick={() => setFocusMode(!focusMode)}
            aria-pressed={focusMode}
            className="hidden md:inline-flex"
          >
            {focusMode ? (
              <>
                <Minimize2 aria-hidden="true" className="h-3.5 w-3.5 text-[#8B5CF6]" />
                <span>{t('challenge.exitFocus')}</span>
              </>
            ) : (
              <>
                <Maximize2 aria-hidden="true" className="h-3.5 w-3.5" />
                <span>{t('challenge.focusMode')}</span>
              </>
            )}
          </Button>

          <div className="lg:hidden">
            <Tabs<MobilePane>
              ariaLabel="Cambiar entre enunciado y editor"
              activeId={mobilePane}
              onChange={setMobilePane}
              items={[
                { id: 'statement', label: 'Enunciado' },
                { id: 'editor', label: 'Editor y pruebas' },
              ]}
            />
          </div>
        </div>
      </header>

      <div
        ref={splitContainerRef}
        className="flex flex-col gap-5 lg:flex-row lg:items-start lg:gap-0"
      >
        {/* Panel Izquierdo */}
        <section
          style={{ width: undefined }}
          className={`w-full rounded-lg border border-[#27272A] bg-[#111113] p-5 lg:shrink-0 ${
            mobilePane === 'statement' ? 'block' : 'hidden lg:block'
          }`}
          data-split-left
        >
          <style>{`
            @media (min-width: 1024px) {
              [data-split-left] { width: ${splitRatio}% !important; }
            }
          `}</style>
          <Tabs<LeftTab>
            ariaLabel="Secciones del desafío"
            activeId={leftTab}
            onChange={setLeftTab}
            className="mb-5 flex-wrap"
            items={[
              { id: 'statement', label: 'Enunciado' },
              { id: 'hints', label: 'Pistas', badge: `${unlockedHints.length}/${challenge.hints.length}` },
              { id: 'editorial', label: t('challenge.editorialTab') },
              { id: 'notes', label: t('challenge.notesTab') },
              { id: 'history', label: 'Historial', badge: challengeSubmissions.length },
            ]}
          />

          {leftTab === 'statement' && (
            <div className="space-y-5">
              <Markdown content={challenge.description} />

              <div className="space-y-3 border-t border-[#27272A] pt-4">
                <h2 className="text-xs font-semibold text-[#A1A1AA]">Ejemplos</h2>
                {challenge.examples.map((ex, i) => (
                  <div
                    key={i}
                    className="space-y-1.5 rounded-md border border-[#27272A] bg-[#09090B] p-3 font-mono text-xs"
                  >
                    <div>
                      <span className="text-[#71717A]">Entrada: </span>
                      <span className="text-[#FAFAFA]">{ex.input}</span>
                    </div>
                    <div>
                      <span className="text-[#71717A]">Salida: </span>
                      <span className="text-emerald-400">{ex.output}</span>
                    </div>
                    {ex.explanation && (
                      <p className="pt-1 font-sans text-xs text-[#A1A1AA]">{ex.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2 border-t border-[#27272A] pt-4">
                <h2 className="text-xs font-semibold text-[#A1A1AA]">Restricciones</h2>
                <ul className="list-disc space-y-1 pl-5 text-xs text-[#A1A1AA]">
                  {challenge.constraints.map((c, idx) => (
                    <li key={idx} className="font-mono">
                      {c}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="border-t border-[#27272A] pt-3 text-xs text-[#71717A]">
                Etiquetas: {challenge.tags.join(' · ')}
              </div>
            </div>
          )}

          {leftTab === 'hints' && (
            <div className="space-y-3">
              <p className="text-xs text-[#A1A1AA]">
                Cada pista desbloqueada descuenta un <strong className="text-[#FAFAFA]">10%</strong>{' '}
                del XP base al resolver este desafío.
              </p>

              {challenge.hints.map((hint, idx) => {
                const isUnlocked = unlockedHints.includes(idx);
                return (
                  <div
                    key={idx}
                    className="rounded-md border border-[#27272A] bg-[#09090B] p-3.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#FAFAFA]">
                        <Lightbulb aria-hidden="true" className="h-3.5 w-3.5 text-amber-400" />
                        <span>Pista #{idx + 1}</span>
                      </span>
                      {!isUnlocked && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => setPendingHintIndex(idx)}
                        >
                          <Lock aria-hidden="true" className="h-3 w-3" />
                          <span>Desbloquear (-10% XP)</span>
                        </Button>
                      )}
                    </div>
                    {isUnlocked ? (
                      <p className="mt-2 text-xs leading-relaxed text-[#D4D4D8]">{hint}</p>
                    ) : (
                      <p className="mt-2 text-xs text-[#71717A]">
                        Pista oculta. Desbloquéala solo si necesitas orientación.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {leftTab === 'editorial' && (
            <div className="space-y-4">
              {!isEditorialUnlocked ? (
                <div className="rounded-md border border-[#27272A] bg-[#09090B] p-5 text-center space-y-3">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg border border-[#27272A] bg-[#18181B] text-[#A1A1AA]">
                    <Lock className="h-4 w-4" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[#FAFAFA]">Solución bloqueada</p>
                    <p className="text-xs leading-relaxed text-[#A1A1AA]">
                      {t('challenge.solutionLockedDesc')}
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setRevealModalOpen(true)}
                  >
                    <BookOpen aria-hidden="true" className="h-3.5 w-3.5" />
                    <span>{t('challenge.revealSolutionBtn')}</span>
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {challenge.editorial && (
                    <>
                      <Markdown content={challenge.editorial.explanation} />

                      <div className="grid grid-cols-2 gap-3 rounded-md border border-[#27272A] bg-[#09090B] p-3 text-xs">
                        <div>
                          <span className="text-[#71717A]">Complejidad temporal</span>
                          <p className="mt-0.5 font-mono font-semibold text-[#FAFAFA]">
                            {challenge.editorial.timeComplexity}
                          </p>
                        </div>
                        <div>
                          <span className="text-[#71717A]">Complejidad espacial</span>
                          <p className="mt-0.5 font-mono font-semibold text-[#FAFAFA]">
                            {challenge.editorial.spaceComplexity}
                          </p>
                        </div>
                      </div>

                      {challenge.editorial.approaches.length > 0 && (
                        <div className="space-y-2">
                          <h3 className="text-xs font-semibold text-[#A1A1AA]">Enfoques</h3>
                          {challenge.editorial.approaches.map((ap, i) => (
                            <div
                              key={i}
                              className="rounded-md border border-[#27272A] bg-[#09090B] p-3 text-xs"
                            >
                              <p className="font-semibold text-[#FAFAFA]">{ap.name}</p>
                              <p className="mt-0.5 text-[#A1A1AA]">{ap.note}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </>
                  )}

                  <div className="space-y-2">
                    <h3 className="text-xs font-semibold text-[#A1A1AA]">
                      Código de referencia ({getLanguageLabel(language)})
                    </h3>
                    <CodeBlock
                      code={challenge.referenceSolution[language]}
                      language={language}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {leftTab === 'notes' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-[#A1A1AA]">
                  <FileText aria-hidden="true" className="h-3.5 w-3.5" />
                  <span>Apuntes en Markdown (guardado automático)</span>
                </span>
                <div className="flex items-center rounded-md border border-[#27272A] bg-[#09090B] p-0.5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setNotesPreview(false)}
                    className={`rounded px-2 py-1 ${
                      !notesPreview ? 'bg-[#18181B] text-[#FAFAFA]' : 'text-[#71717A]'
                    }`}
                  >
                    {t('challenge.notesEdit')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setNotesPreview(true)}
                    className={`rounded px-2 py-1 ${
                      notesPreview ? 'bg-[#18181B] text-[#FAFAFA]' : 'text-[#71717A]'
                    }`}
                  >
                    {t('challenge.notesPreview')}
                  </button>
                </div>
              </div>

              {notesPreview ? (
                <div className="min-h-48 rounded-md border border-[#27272A] bg-[#09090B] p-4">
                  {noteContent.trim() ? (
                    <Markdown content={noteContent} />
                  ) : (
                    <p className="text-xs text-[#71717A]">
                      No hay apuntes guardados todavía para este desafío.
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  aria-label="Apuntes personales en Markdown"
                  value={noteContent}
                  onChange={(e) => setNote(challenge.id, e.target.value)}
                  placeholder={t('challenge.notesPlaceholder')}
                  rows={10}
                  className="w-full rounded-md border border-[#27272A] bg-[#09090B] p-3 font-mono text-xs text-[#FAFAFA] placeholder-[#52525B] focus:border-[#8B5CF6] focus:outline-none"
                />
              )}
            </div>
          )}

          {leftTab === 'history' && (
            <div className="space-y-2.5">
              {challengeSubmissions.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#A1A1AA]">
                  Aún no has realizado envíos en este desafío.
                </p>
              ) : (
                challengeSubmissions.map((sub) => (
                  <button
                    key={sub.id}
                    type="button"
                    onClick={() => setSelectedSubmission(sub)}
                    className="flex w-full items-center justify-between gap-3 rounded-md border border-[#27272A] bg-[#09090B] p-3 text-left text-xs transition-colors hover:border-[#3F3F46] hover:bg-[#18181B]"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-medium ${
                            sub.passed ? 'text-emerald-400' : 'text-red-400'
                          }`}
                        >
                          {sub.passed ? 'Aprobado' : 'Fallido'}
                        </span>
                        <span className="text-[#71717A]">·</span>
                        <span className="text-[#FAFAFA]">{getLanguageLabel(sub.language)}</span>
                        {sub.simulated && (
                          <span className="text-[#A1A1AA]">(Simulado)</span>
                        )}
                      </div>
                      <p className="mt-1 font-mono text-[11px] text-[#71717A]">
                        {formatDateTime(sub.createdAt)} · {sub.passedCount}/{sub.totalCount} casos ·{' '}
                        {formatDurationMs(sub.runtimeMs)}
                        {sub.durationSec ? ` · ${sub.durationSec}s` : ''}
                      </p>
                    </div>
                    {sub.xpEarned > 0 && (
                      <span className="font-mono font-semibold text-[#8B5CF6] tabular-nums">
                        +{sub.xpEarned} XP
                      </span>
                    )}
                  </button>
                ))
              )}
            </div>
          )}
        </section>

        {/* Divisor vertical redimensionable en escritorio */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Redimensionar paneles"
          aria-valuenow={splitRatio}
          aria-valuemin={28}
          aria-valuemax={68}
          tabIndex={0}
          onMouseDown={() => {
            isResizingRef.current = true;
          }}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') setSplitRatio(splitRatio - 3);
            if (e.key === 'ArrowRight') setSplitRatio(splitRatio + 3);
          }}
          className="hidden lg:flex w-3 self-stretch cursor-col-resize items-center justify-center group focus:outline-none"
        >
          <span className="h-12 w-1 rounded-full bg-[#27272A] transition-colors group-hover:bg-[#8B5CF6]" />
        </div>

        {/* Panel Derecho */}
        <section
          className={`flex-1 min-w-0 space-y-4 ${
            mobilePane === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <Select
                aria-label="Seleccionar lenguaje del editor"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="w-36"
                options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
              />
              {language !== 'javascript' && (
                <Badge variant="warning">{t('common.simulatedExec')}</Badge>
              )}
              <span
                title={complexityEstimate.reason}
                className="inline-flex items-center gap-1.5 rounded border border-[#27272A] bg-[#09090B] px-2 py-1 text-[11px] text-[#A1A1AA]"
              >
                <Gauge
                  aria-hidden="true"
                  className={`h-3 w-3 ${
                    challenge.targetComplexity
                      ? meetsComplexityTarget
                        ? 'text-emerald-400'
                        : 'text-amber-400'
                      : 'text-[#8B5CF6]'
                  }`}
                />
                <span className="font-mono font-semibold text-[#FAFAFA]">
                  {complexityEstimate.bigO}
                </span>
                <span className="hidden sm:inline text-[#71717A]">
                  · {t('challenge.complexityHeuristic')}
                </span>
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {/* Popover de ajustes del editor */}
              <div ref={popoverRef} className="relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setEditorPopoverOpen((o) => !o)}
                  aria-expanded={editorPopoverOpen}
                  title="Ajustes del editor"
                >
                  <SlidersHorizontal aria-hidden="true" className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{t('challenge.editorSettings')}</span>
                </Button>

                {editorPopoverOpen && (
                  <div className="absolute right-0 z-30 mt-2 w-64 space-y-3 rounded-lg border border-[#27272A] bg-[#111113] p-3.5 text-xs shadow-xl">
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4D4D8]">Tamaño de fuente</span>
                      <select
                        aria-label="Tamaño de fuente"
                        value={editorSettings.fontSize}
                        onChange={(e) =>
                          updateEditorSettings({ fontSize: Number(e.target.value) })
                        }
                        className="rounded border border-[#27272A] bg-[#09090B] px-2 py-1 font-mono text-[#FAFAFA]"
                      >
                        {[12, 13, 14, 16, 18].map((sz) => (
                          <option key={sz} value={sz}>
                            {sz}px
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#D4D4D8]">Indentación</span>
                      <select
                        aria-label="Tamaño de tabulación"
                        value={editorSettings.tabSize}
                        onChange={(e) =>
                          updateEditorSettings({
                            tabSize: Number(e.target.value) as 2 | 4,
                          })
                        }
                        className="rounded border border-[#27272A] bg-[#09090B] px-2 py-1 font-mono text-[#FAFAFA]"
                      >
                        <option value={2}>2 espacios</option>
                        <option value={4}>4 espacios</option>
                      </select>
                    </div>
                    {(
                      [
                        { key: 'lineWrapping', label: 'Ajuste de línea' },
                        { key: 'autocompletion', label: 'Autocompletado' },
                        { key: 'closeBrackets', label: 'Cerrar llaves' },
                        { key: 'lineNumbers', label: 'Números de línea' },
                      ] as const
                    ).map((opt) => (
                      <label
                        key={opt.key}
                        className="flex cursor-pointer items-center justify-between text-[#D4D4D8]"
                      >
                        <span>{opt.label}</span>
                        <input
                          type="checkbox"
                          checked={editorSettings[opt.key]}
                          onChange={(e) =>
                            updateEditorSettings({ [opt.key]: e.target.checked })
                          }
                          className="h-4 w-4 accent-[#8B5CF6]"
                        />
                      </label>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleResetCode}
                title="Restablecer plantilla inicial"
              >
                <RotateCcw aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Restablecer</span>
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                loading={isRunning}
                onClick={handleRunVisible}
                title="Atajo: Ctrl/Cmd + Enter"
              >
                <Play aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Ejecutar</span>
              </Button>
              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={isRunning}
                onClick={handleSubmitAll}
                title="Atajo: Ctrl/Cmd + Shift + Enter"
              >
                <Send aria-hidden="true" className="h-3.5 w-3.5" />
                <span>Enviar</span>
              </Button>
            </div>
          </div>

          <CodeEditor
            value={code}
            language={language}
            height={focusMode ? '480px' : '380px'}
            onChange={(val) => setDraft(challenge.id, language, val)}
            onRunShortcut={handleRunVisible}
            onSubmitShortcut={handleSubmitAll}
            onSaveShortcut={handleSaveShortcut}
          />

          <Tabs<RightResultTab>
            ariaLabel="Panel de resultados y pruebas"
            activeId={resultTab}
            onChange={setResultTab}
            items={[
              { id: 'results', label: t('challenge.resultsTab') },
              {
                id: 'custom',
                label: t('challenge.customTestsTab'),
                badge: savedCustomTests.length || undefined,
              },
            ]}
          />

          {resultTab === 'results' ? (
            <TestResults result={execResult} isRunning={isRunning} />
          ) : (
            <div className="space-y-4 rounded-lg border border-[#27272A] bg-[#111113] p-4 text-xs">
              {language !== 'javascript' ? (
                <p className="rounded-md border border-amber-500/30 bg-amber-500/10 p-3 text-amber-300">
                  {t('challenge.customSimWarning')}
                </p>
              ) : (
                <>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label
                        htmlFor="custom-args-input"
                        className="mb-1 block font-medium text-[#D4D4D8]"
                      >
                        {t('challenge.customArgsLabel')}
                      </label>
                      <input
                        id="custom-args-input"
                        type="text"
                        value={customArgsJson}
                        onChange={(e) => setCustomArgsJson(e.target.value)}
                        className="w-full rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2 font-mono text-xs text-[#FAFAFA] focus:border-[#8B5CF6] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="custom-expected-input"
                        className="mb-1 block font-medium text-[#D4D4D8]"
                      >
                        {t('challenge.customExpectedLabel')}
                      </label>
                      <input
                        id="custom-expected-input"
                        type="text"
                        value={customExpectedJson}
                        onChange={(e) => setCustomExpectedJson(e.target.value)}
                        placeholder="Opcional"
                        className="w-full rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2 font-mono text-xs text-[#FAFAFA] placeholder-[#52525B] focus:border-[#8B5CF6] focus:outline-none"
                      />
                    </div>
                  </div>

                  {customError && (
                    <p role="alert" className="text-red-400">
                      {customError}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="primary"
                      size="sm"
                      loading={isRunning}
                      onClick={() => handleRunCustomTest()}
                    >
                      <FlaskConical aria-hidden="true" className="h-3.5 w-3.5" />
                      <span>{t('challenge.runCustomTest')}</span>
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        try {
                          const parsed = JSON.parse(customArgsJson);
                          if (!Array.isArray(parsed)) {
                            setCustomError('Los argumentos deben ser un arreglo JSON.');
                            return;
                          }
                          saveCustomTest(
                            challenge.id,
                            customArgsJson,
                            customExpectedJson.trim() || undefined
                          );
                          setCustomError(null);
                        } catch {
                          setCustomError('JSON inválido en argumentos.');
                        }
                      }}
                    >
                      Guardar prueba
                    </Button>
                  </div>

                  {customResult && <TestResults result={customResult} isRunning={isRunning} />}

                  {savedCustomTests.length > 0 && (
                    <div className="space-y-2 border-t border-[#27272A] pt-3">
                      <h3 className="font-semibold text-[#A1A1AA]">
                        Pruebas guardadas ({savedCustomTests.length}/10)
                      </h3>
                      {savedCustomTests.map((ct) => (
                        <div
                          key={ct.id}
                          className="flex items-center justify-between gap-3 rounded-md border border-[#27272A] bg-[#09090B] px-3 py-2"
                        >
                          <div className="min-w-0 flex-1 font-mono text-[11px]">
                            <p className="truncate text-[#FAFAFA]">args: {ct.argsJson}</p>
                            {ct.expectedJson && (
                              <p className="truncate text-emerald-400">
                                esperado: {ct.expectedJson}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setCustomArgsJson(ct.argsJson);
                                setCustomExpectedJson(ct.expectedJson ?? '');
                                void handleRunCustomTest(ct.argsJson, ct.expectedJson ?? '');
                              }}
                            >
                              <Play aria-hidden="true" className="h-3 w-3" />
                            </Button>
                            <button
                              type="button"
                              aria-label="Eliminar prueba personalizada"
                              onClick={() => deleteCustomTest(challenge.id, ct.id)}
                              className="rounded p-1.5 text-[#71717A] hover:bg-[#18181B] hover:text-red-400"
                            >
                              <Trash2 aria-hidden="true" className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modal de confirmación de pista */}
      <Modal
        open={pendingHintIndex !== null}
        onClose={() => setPendingHintIndex(null)}
        title="Desbloquear pista"
        description="Esta acción descontará un 10% del XP base al resolver el desafío."
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setPendingHintIndex(null)}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              if (pendingHintIndex !== null) {
                unlockHint(challenge.id, pendingHintIndex);
              }
              setPendingHintIndex(null);
            }}
          >
            Confirmar desbloqueo
          </Button>
        </div>
      </Modal>

      {/* Modal de confirmación para revelar solución */}
      <Modal
        open={revealModalOpen}
        onClose={() => setRevealModalOpen(false)}
        title={t('challenge.revealSolutionTitle')}
        description={t('challenge.revealSolutionDesc')}
      >
        <div className="flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={() => setRevealModalOpen(false)}>
            {t('common.cancel')}
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              revealSolution(challenge.id);
              setRevealModalOpen(false);
            }}
          >
            {t('challenge.revealSolutionBtn')}
          </Button>
        </div>
      </Modal>

      {/* Modal de detalle de envío */}
      <Modal
        open={selectedSubmission !== null}
        onClose={() => setSelectedSubmission(null)}
        title={t('challenge.submissionDetail')}
        description={
          selectedSubmission
            ? `${getLanguageLabel(selectedSubmission.language)} · ${formatDateTime(
                selectedSubmission.createdAt
              )} · ${selectedSubmission.passedCount}/${selectedSubmission.totalCount} casos`
            : undefined
        }
      >
        {selectedSubmission && (
          <div className="space-y-4 text-xs">
            <div className="flex flex-wrap items-center gap-3 text-[#A1A1AA]">
              <span className={selectedSubmission.passed ? 'text-emerald-400 font-medium' : 'text-red-400 font-medium'}>
                {selectedSubmission.passed ? 'Aprobado' : 'Fallido'}
              </span>
              <span>·</span>
              <span className="font-mono">{formatDurationMs(selectedSubmission.runtimeMs)}</span>
              {selectedSubmission.durationSec !== undefined && (
                <>
                  <span>·</span>
                  <span>Tiempo en desafío: {selectedSubmission.durationSec}s</span>
                </>
              )}
            </div>

            {selectedSubmission.code ? (
              <CodeBlock code={selectedSubmission.code} language={selectedSubmission.language} />
            ) : (
              <p className="text-[#71717A]">
                Código no archivado para este envío antiguo.
              </p>
            )}

            <div className="flex justify-end gap-2">
              <Button variant="secondary" size="sm" onClick={() => setSelectedSubmission(null)}>
                {t('common.close')}
              </Button>
              {selectedSubmission.code && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setLanguage(selectedSubmission.language);
                    setGlobalLanguage(selectedSubmission.language);
                    setDraft(challenge.id, selectedSubmission.language, selectedSubmission.code!);
                    setSelectedSubmission(null);
                    addToast({
                      title: 'Código restaurado',
                      description: `Se cargó la versión de ${getLanguageLabel(
                        selectedSubmission.language
                      )} en el editor.`,
                      variant: 'info',
                    });
                  }}
                >
                  {t('challenge.restoreCode')}
                </Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Modal de éxito y desglose de XP */}
      <Modal
        open={rewardModal !== null}
        onClose={() => setRewardModal(null)}
        title="Desafío completado"
        description={
          rewardModal?.xpBreakdown.alreadySolved
            ? 'Ya habías resuelto este desafío anteriormente.'
            : 'Todos los casos visibles y ocultos pasaron correctamente.'
        }
      >
        {rewardModal && (
          <div className="space-y-4">
            {rewardModal.rankUpTo && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center justify-between rounded-md border border-[#8B5CF6]/40 bg-[#8B5CF6]/10 p-3"
              >
                <div className="flex items-center gap-2">
                  <Award aria-hidden="true" className="h-4 w-4 text-[#8B5CF6]" />
                  <span className="text-xs font-medium text-[#FAFAFA]">Subiste de rango</span>
                </div>
                <RankBadge rank={rewardModal.rankUpTo} />
              </motion.div>
            )}

            <div className="space-y-2 rounded-md border border-[#27272A] bg-[#09090B] p-4 text-xs">
              {rewardModal.xpBreakdown.alreadySolved || rewardModal.xpBreakdown.total === 0 ? (
                <p className="text-[#A1A1AA]">
                  {rewardModal.xpBreakdown.alreadySolved
                    ? 'Repetir un desafío ya resuelto no otorga XP adicional (+0 XP).'
                    : 'Se reveló la solución oficial antes de resolver (+0 XP).'}
                </p>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-[#A1A1AA]">XP base ({diffMeta.label})</span>
                    <span className="font-mono tabular-nums text-[#FAFAFA]">
                      +{rewardModal.xpBreakdown.baseXp} XP
                    </span>
                  </div>
                  {rewardModal.xpBreakdown.dailyBonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Bonus desafío diario (x1.5)</span>
                      <span className="font-mono tabular-nums text-[#8B5CF6]">
                        +{rewardModal.xpBreakdown.dailyBonus} XP
                      </span>
                    </div>
                  )}
                  {rewardModal.xpBreakdown.firstTryBonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Primer intento sin fallos (+10%)</span>
                      <span className="font-mono tabular-nums text-emerald-400">
                        +{rewardModal.xpBreakdown.firstTryBonus} XP
                      </span>
                    </div>
                  )}
                  {rewardModal.xpBreakdown.streakBonus > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Bonus por racha diaria</span>
                      <span className="font-mono tabular-nums text-emerald-400">
                        +{rewardModal.xpBreakdown.streakBonus} XP
                      </span>
                    </div>
                  )}
                  {(rewardModal.xpBreakdown.complexityBonus ?? 0) > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">{t('challenge.complexityBonus')}</span>
                      <span className="font-mono tabular-nums text-emerald-400">
                        +{rewardModal.xpBreakdown.complexityBonus} XP
                      </span>
                    </div>
                  )}
                  {rewardModal.xpBreakdown.hintPenalty > 0 && (
                    <div className="flex justify-between">
                      <span className="text-[#A1A1AA]">Penalización por pistas</span>
                      <span className="font-mono tabular-nums text-amber-400">
                        -{rewardModal.xpBreakdown.hintPenalty} XP
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between border-t border-[#27272A] pt-2 text-sm font-semibold">
                    <span className="text-[#FAFAFA]">Total ganado</span>
                    <span className="font-mono tabular-nums text-[#8B5CF6]">
                      +{rewardModal.xpBreakdown.total} XP
                    </span>
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setRewardModal(null);
                  navigate('/challenges');
                }}
              >
                Más desafíos
              </Button>
              <Button variant="primary" size="sm" onClick={() => setRewardModal(null)}>
                Continuar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
