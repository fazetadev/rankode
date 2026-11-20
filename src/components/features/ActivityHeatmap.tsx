import { useMemo } from 'react';
import type { ActivityDay } from '../../types';

interface ActivityHeatmapProps {
  activityMap: Record<string, ActivityDay>;
}

function getIntensityClass(count: number): string {
  if (count <= 0) return 'bg-[#18181B] border-[#27272A]';
  if (count === 1) return 'bg-[#8B5CF6]/30 border-[#8B5CF6]/40';
  if (count === 2) return 'bg-[#8B5CF6]/55 border-[#8B5CF6]/60';
  if (count === 3) return 'bg-[#8B5CF6]/80 border-[#8B5CF6]/85';
  return 'bg-[#8B5CF6] border-[#A78BFA]';
}

export function ActivityHeatmap({ activityMap }: ActivityHeatmapProps) {
  const { weeks, totalEvents } = useMemo(() => {
    const totalDays = 12 * 7; // 12 semanas = 84 días
    const cells: { date: string; count: number; xp: number }[] = [];
    let sum = 0;

    for (let i = totalDays - 1; i >= 0; i -= 1) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const entry = activityMap[iso];
      const count = entry?.count ?? 0;
      sum += count;
      cells.push({
        date: iso,
        count,
        xp: entry?.xp ?? 0,
      });
    }

    const grouped: { date: string; count: number; xp: number }[][] = [];
    for (let w = 0; w < 12; w += 1) {
      grouped.push(cells.slice(w * 7, w * 7 + 7));
    }

    return { weeks: grouped, totalEvents: sum };
  }, [activityMap]);

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#FAFAFA]">Actividad (últimas 12 semanas)</h3>
          <p className="text-xs text-[#A1A1AA] tabular-nums">
            {totalEvents} envíos registrados en el periodo
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-[11px] text-[#71717A]">
          <span>Menos</span>
          <span className="h-3 w-3 rounded-[3px] border border-[#27272A] bg-[#18181B]" />
          <span className="h-3 w-3 rounded-[3px] border border-[#8B5CF6]/40 bg-[#8B5CF6]/30" />
          <span className="h-3 w-3 rounded-[3px] border border-[#8B5CF6]/60 bg-[#8B5CF6]/55" />
          <span className="h-3 w-3 rounded-[3px] border border-[#8B5CF6] bg-[#8B5CF6]" />
          <span>Más</span>
        </div>
      </div>

      <div className="overflow-x-auto pb-1">
        <div
          role="img"
          aria-label="Mapa de actividad de las últimas 12 semanas"
          className="inline-grid grid-flow-col gap-1.5"
        >
          {weeks.map((week, wIdx) => (
            <div key={wIdx} className="grid grid-rows-7 gap-1.5">
              {week.map((day) => (
                <div
                  key={day.date}
                  title={`${day.date}: ${day.count} envío(s), +${day.xp} XP`}
                  className={`h-3.5 w-3.5 rounded-[3px] border transition-colors ${getIntensityClass(
                    day.count
                  )}`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
