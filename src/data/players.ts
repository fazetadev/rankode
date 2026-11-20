import type { Language, Player } from '../types';

const FIRST_NAMES = [
  'Mateo', 'Lucía', 'Santiago', 'Valeria', 'Daniel', 'Sofía', 'Alejandro', 'Elena',
  'Carlos', 'Paula', 'Diego', 'Marta', 'Javier', 'Carmen', 'Nicolás', 'Clara',
  'Hugo', 'Alba', 'Adrián', 'Nuria', 'Lucas', 'Irene', 'Pablo', 'Claudia',
  'Tomás', 'Julia', 'Bruno', 'Laura', 'Marco', 'Raquel', 'Gabriel', 'Inés',
  'Andrés', 'Beatriz', 'Iván', 'Marina', 'Óscar', 'Andrea', 'Emilio', 'Alicia',
  'Héctor', 'Natalia', 'Sergio', 'Patricia', 'Rodrigo', 'Victoria', 'David', 'Eva',
  'Martín', 'Sara',
];

const LAST_NAMES = [
  'Rojas', 'Navarro', 'Mendoza', 'Vega', 'Castillo', 'Herrera', 'Morales', 'Ortega',
  'Delgado', 'Serrano', 'Ramírez', 'Flores', 'Cruz', 'Reyes', 'Domínguez', 'Torres',
  'Vázquez', 'Gil', 'Suárez', 'Molina', 'Jiménez', 'Ruiz', 'Pérez', 'Gómez', 'Silva',
];

const COUNTRIES = ['ES', 'MX', 'AR', 'CO', 'CL', 'PE', 'UY', 'US', 'DE', 'FR'];
const LANGUAGES: Language[] = ['javascript', 'python', 'java', 'cpp'];

function createRng(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 4294967296;
  };
}

/**
 * Genera de forma determinista 50 jugadores ficticios para el ranking global.
 */
export function generateSeededPlayers(): Player[] {
  const rng = createRng(20261119);
  const players: Player[] = [];

  for (let i = 0; i < 50; i += 1) {
    const first = FIRST_NAMES[i % FIRST_NAMES.length];
    const last = LAST_NAMES[(i * 7 + Math.floor(rng() * 5)) % LAST_NAMES.length];
    const handleSuffix = i % 4 === 0 ? `_${(i + 11) % 99}` : '';
    const username = `${first.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}.${last.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')}${handleSuffix}`;

    // Distribución realista desde Legend (~38k) hasta Rookie (~120)
    const tierRoll = i / 50;
    let xp: number;
    if (tierRoll < 0.06) {
      xp = 35200 + Math.floor(rng() * 6000); // Legend
    } else if (tierRoll < 0.16) {
      xp = 20500 + Math.floor(rng() * 12000); // Master
    } else if (tierRoll < 0.30) {
      xp = 12200 + Math.floor(rng() * 6800); // Diamond
    } else if (tierRoll < 0.48) {
      xp = 7100 + Math.floor(rng() * 4400); // Platinum
    } else if (tierRoll < 0.68) {
      xp = 3600 + Math.floor(rng() * 3100); // Gold
    } else if (tierRoll < 0.84) {
      xp = 1550 + Math.floor(rng() * 1700); // Silver
    } else if (tierRoll < 0.94) {
      xp = 550 + Math.floor(rng() * 850); // Bronze
    } else {
      xp = 120 + Math.floor(rng() * 340); // Rookie
    }

    const solvedCount = Math.max(2, Math.min(24, Math.round((xp / 36000) * 22 + rng() * 4)));
    const accuracy = Math.min(98, Math.max(54, Math.round(62 + (1 - tierRoll) * 28 + (rng() * 8 - 4))));
    const favoriteLanguage = LANGUAGES[Math.floor(rng() * LANGUAGES.length)];
    const country = COUNTRIES[Math.floor(rng() * COUNTRIES.length)];
    const streakDays = Math.max(0, Math.floor(rng() * 21));
    const monthsAgo = 1 + Math.floor(rng() * 11);
    const joinedDate = new Date(Date.UTC(2026, 10 - monthsAgo, 5 + (i % 20)));

    players.push({
      id: `player-${i + 1}`,
      username,
      country,
      xp,
      solvedCount,
      accuracy,
      favoriteLanguage,
      streakDays,
      joinedAt: joinedDate.toISOString(),
    });
  }

  return players.sort((a, b) => b.xp - a.xp);
}

export const SEEDED_PLAYERS: Player[] = generateSeededPlayers();
