export type Language = 'javascript' | 'python' | 'java' | 'cpp';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Category = 'logic' | 'debugging' | 'problem-solving' | 'optimization';

export type Locale = 'es' | 'en';

export type RankId =
  | 'rookie'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'master'
  | 'legend';

export interface RankDefinition {
  id: RankId;
  name: string;
  minXp: number;
  color: string;
  description: string;
}

export interface ChallengeExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface TestCase {
  id: string;
  input: unknown[];
  expected: unknown;
  inputDisplay: string;
  expectedDisplay: string;
}

export interface ChallengeApproach {
  name: string;
  note: string;
}

export interface ChallengeEditorial {
  explanation: string;
  timeComplexity: string;
  spaceComplexity: string;
  approaches: ChallengeApproach[];
}

export interface PerfSpec {
  sizeLabel: string;
  build: () => unknown[];
  maxMs: number;
}

export type ComplexityBigO = 'O(1)' | 'O(log n)' | 'O(n)' | 'O(n log n)' | 'O(n²)' | 'O(n³)' | 'O(2ⁿ)';

export interface ComplexityEstimate {
  bigO: ComplexityBigO;
  rank: number;
  reason: string;
}

export interface Challenge {
  id: string;
  title: string;
  category: Category;
  difficulty: Difficulty;
  xp: number;
  tags: string[];
  entryPoint: string;
  description: string;
  examples: ChallengeExample[];
  constraints: string[];
  hints: string[];
  languages: Language[];
  starterCode: Record<Language, string>;
  referenceSolution: Record<Language, string>;
  tests: {
    visible: TestCase[];
    hidden: TestCase[];
  };
  editorial?: ChallengeEditorial;
  targetComplexity?: ComplexityBigO;
  perf?: PerfSpec;
  acceptanceRate?: number;
  validationHints?: {
    requiredTokens?: Partial<Record<Language, string[]>>;
    forbiddenSubstrings?: Partial<Record<Language, string[]>>;
    /**
     * Enfoques alternativos correctos y habituales que el juez simulado debe aceptar aunque
     * se parezcan poco a la solución de referencia (se comparan ignorando espacios).
     */
    acceptedIdioms?: Partial<Record<Language, string[]>>;
  };
}

export interface TestCaseResult {
  id: string;
  passed: boolean;
  inputDisplay: string;
  expectedDisplay: string;
  actualDisplay: string;
  durationMs: number;
  error?: string;
  hidden?: boolean;
}

export interface ExecutionResult {
  passed: boolean;
  totalCount: number;
  passedCount: number;
  results: TestCaseResult[];
  logs: string[];
  runtimeMs: number;
  error?: string;
  simulated: boolean;
  perfPassed?: boolean;
  perfDurationMs?: number;
}

export interface Runner {
  run(
    code: string,
    language: Language,
    tests: TestCase[],
    challenge: Challenge,
    markHidden?: boolean
  ): Promise<ExecutionResult>;
}

export interface XpBreakdown {
  baseXp: number;
  dailyBonus: number;
  firstTryBonus: number;
  streakBonus: number;
  complexityBonus?: number;
  hintPenalty: number;
  total: number;
  alreadySolved: boolean;
}

export interface Submission {
  id: string;
  challengeId: string;
  challengeTitle: string;
  language: Language;
  passed: boolean;
  passedCount: number;
  totalCount: number;
  xpEarned: number;
  runtimeMs: number;
  simulated: boolean;
  createdAt: string;
  code?: string;
  durationSec?: number;
}

export interface Player {
  id: string;
  username: string;
  country: string;
  xp: number;
  solvedCount: number;
  accuracy: number;
  favoriteLanguage: Language;
  streakDays: number;
  joinedAt: string;
  isCurrentUser?: boolean;
}

export interface ActivityDay {
  date: string;
  count: number;
  xp: number;
}

export interface UserProfile {
  username: string;
  email?: string;
  country: string;
  joinedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}

export interface CustomTestCase {
  id: string;
  argsJson: string;
  expectedJson?: string;
  createdAt: string;
}

export interface EditorSettings {
  fontSize: number;
  tabSize: 2 | 4;
  lineWrapping: boolean;
  autocompletion: boolean;
  closeBrackets: boolean;
  lineNumbers: boolean;
}

export interface AppSettings {
  locale: Locale;
  editor: EditorSettings;
}

export interface LocalAccount {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  country: string;
  createdAt: string;
  isGuest?: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  read: boolean;
}

export type QuizType = 'output' | 'bug' | 'complexity';

export interface QuizQuestion {
  id: string;
  type: QuizType;
  language: Language;
  difficulty: Difficulty;
  xp: number;
  prompt: string;
  code: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
