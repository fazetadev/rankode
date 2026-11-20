import React, { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
} from 'lucide-react';
import { CATEGORY_META, DIFFICULTY_META, SUPPORTED_LANGUAGES } from '../config';
import { CHALLENGES } from '../data/challenges';
import { formatDateTime, formatDurationMs, getLanguageLabel } from '../lib/format';
import { judgeRunner } from '../lib/judge';
import { getDailyChallengeId } from '../lib/xp';
import { getDraftKey, useAppStore, type SubmissionOutcome } from '../store/useAppStore';
import type { ExecutionResult, Language } from '../types';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Tabs } from '../components/ui/Tabs';
import { Select } from '../components/ui/Select';
import { Modal } from '../components/ui/Modal';
import { CodeEditor } from '../components/features/CodeEditor';
import { TestResults } from '../components/features/TestResults';
import { RankBadge } from '../components/features/RankBadge';

type LeftTab = 'statement' | 'hints' | 'history';
type MobilePane = 'statement' | 'editor';

function renderSimpleMarkdown(text: string) {
  return text.split('\n\n').map((paragraph, pIdx) => {
    if (paragraph.startsWith('- ')) {
      const items = paragraph.split('\n').filter((line) => line.startsWith('- '));
      return (
        <ul key={pIdx} className="list-disc space-y-1.5 pl-5 text-sm text-[#D4D4D8]">
          {items.map((item, iIdx) => (
            <li key={iIdx}>{renderInlineFormatting(item.slice(2))}</li>
          ))}
        </ul>
      );
    }
    return (
      <p key={pIdx} className="text-sm leading-relaxed text-[#D4D4D8]">
        {renderInlineFormatting(paragraph)}
      </p>
    );
  });
}

function renderInlineFormatting(line: string): React.ReactNode[] {
  const parts = line.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={idx} className="font-semibold text-[#FAFAFA]">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={idx}
          className="rounded border border-[#27272A] bg-[#18181B] px-1.5 py-0.5 font-mono text-xs text-[#FAFAFA]"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

export default function ChallengeDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
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

  const [language, setLanguage] = useState<Language>(selectedLanguage);
  const [leftTab, setLeftTab] = useState<LeftTab>('statement');
  const [mobilePane, setMobilePane] = useState<MobilePane>('statement');
  const [isRunning, setIsRunning] = useState(false);
  const [execResult, setExecResult] = useState<ExecutionResult | null>(null);
  const [pendingHintIndex, setPendingHintIndex] = useState<number | null>(null);
  const [rewardModal, setRewardModal] = useState<SubmissionOutcome | null>(null);

  const dailyId = useMemo(() => getDailyChallengeId(CHALLENGES.map((c) => c.id)), []);

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

  const draftKey = getDraftKey(challenge.id, language);
  const code = drafts[draftKey] ?? challenge.starterCode[language];
  const unlockedHints = unlockedHintsMap[challenge.id] ?? [];
  const isSolved = solvedChallengeIds.includes(challenge.id);
  const isDaily = challenge.id === dailyId;
  const challengeSubmissions = submissions.filter((s) => s.challengeId === challenge.id);

  const handleLanguageChange = (nextLang: Language) => {
    setLanguage(nextLang);
    setGlobalLanguage(nextLang);
    setExecResult(null);
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

  const handleRunVisible = useCallback(async () => {
    if (isRunning) return;
    setIsRunning(true);
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
    if (isRunning) return;
    setIsRunning(true);
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
      };

      setExecResult(combined);
      const outcome = recordSubmission({
        challenge,
        language,
        result: combined,
        isDailyChallenge: isDaily,
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
  }, [isRunning, code, language, challenge, recordSubmission, isDaily, addToast]);

  const diffMeta = DIFFICULTY_META[challenge.difficulty];
  const catMeta = CATEGORY_META[challenge.category];

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
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#A1A1AA]">
            <span>{catMeta.label}</span>
            <span aria-hidden="true">·</span>
            <span className={diffMeta.colorClass}>{diffMeta.label}</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono tabular-nums text-[#FAFAFA]">+{challenge.xp} XP base</span>
          </div>
        </div>

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
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 items-start">
        {/* Panel Izquierdo: Enunciado / Pistas / Historial */}
        <section
          className={`lg:col-span-5 rounded-lg border border-[#27272A] bg-[#111113] p-5 ${
            mobilePane === 'statement' ? 'block' : 'hidden lg:block'
          }`}
        >
          <Tabs<LeftTab>
            ariaLabel="Secciones del desafío"
            activeId={leftTab}
            onChange={setLeftTab}
            className="mb-5"
            items={[
              { id: 'statement', label: 'Enunciado' },
              { id: 'hints', label: 'Pistas', badge: `${unlockedHints.length}/${challenge.hints.length}` },
              { id: 'history', label: 'Historial', badge: challengeSubmissions.length },
            ]}
          />

          {leftTab === 'statement' && (
            <div className="space-y-5">
              <div className="space-y-3">{renderSimpleMarkdown(challenge.description)}</div>

              <div className="space-y-3 border-t border-[#27272A] pt-4">
                <h2 className="text-xs font-semibold text-[#A1A1AA]">
                  Ejemplos
                </h2>
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
                <h2 className="text-xs font-semibold text-[#A1A1AA]">
                  Restricciones
                </h2>
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

          {leftTab === 'history' && (
            <div className="space-y-2.5">
              {challengeSubmissions.length === 0 ? (
                <p className="py-6 text-center text-xs text-[#A1A1AA]">
                  Aún no has realizado envíos en este desafío.
                </p>
              ) : (
                challengeSubmissions.map((sub) => (
                  <div
                    key={sub.id}
                    className="flex items-center justify-between gap-3 rounded-md border border-[#27272A] bg-[#09090B] p-3 text-xs"
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
                      </p>
                    </div>
                    {sub.xpEarned > 0 && (
                      <span className="font-mono font-semibold text-[#8B5CF6] tabular-nums">
                        +{sub.xpEarned} XP
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </section>

        {/* Panel Derecho: Editor CodeMirror + Controles + Resultados */}
        <section
          className={`lg:col-span-7 space-y-4 ${
            mobilePane === 'editor' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#27272A] bg-[#111113] p-3">
            <div className="flex items-center gap-2.5">
              <Select
                aria-label="Seleccionar lenguaje del editor"
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value as Language)}
                className="w-36"
                options={SUPPORTED_LANGUAGES.map((l) => ({ value: l.id, label: l.label }))}
              />
              {language !== 'javascript' && (
                <Badge variant="warning">Ejecución simulada</Badge>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
            onChange={(val) => setDraft(challenge.id, language, val)}
            onRunShortcut={handleRunVisible}
            onSubmitShortcut={handleSubmitAll}
          />

          <TestResults result={execResult} isRunning={isRunning} />
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
              {rewardModal.xpBreakdown.alreadySolved ? (
                <p className="text-[#A1A1AA]">
                  Repetir un desafío ya resuelto no otorga XP adicional (+0 XP).
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
