import type { ActivityDay } from '../types';

function toUtcDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function addUtcDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + delta));
  return toUtcDateKey(dt);
}

/**
 * Calcula los días consecutivos de racha a partir del `activityMap`.
 * Si hoy ya hay actividad (>0), cuenta hacia atrás desde hoy.
 * Si hoy todavía no hay actividad, verifica si ayer hubo actividad para mantener viva la racha actual.
 */
export function computeStreak(
  activityMap: Record<string, ActivityDay>,
  referenceDate: Date = new Date()
): number {
  const todayKey = toUtcDateKey(referenceDate);
  const yesterdayKey = addUtcDays(todayKey, -1);

  const hasToday = (activityMap[todayKey]?.count ?? 0) > 0;
  const hasYesterday = (activityMap[yesterdayKey]?.count ?? 0) > 0;

  if (!hasToday && !hasYesterday) {
    return 0;
  }

  let cursor = hasToday ? todayKey : yesterdayKey;
  let streak = 0;

  while ((activityMap[cursor]?.count ?? 0) > 0) {
    streak += 1;
    cursor = addUtcDays(cursor, -1);
  }

  return streak;
}
