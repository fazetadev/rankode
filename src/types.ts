export type Language = 'javascript' | 'python' | 'java' | 'cpp';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type Category = 'logic' | 'debugging' | 'problem-solving' | 'optimization';

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
  country: string;
  joinedAt: string;
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  variant: 'success' | 'error' | 'info';
}
