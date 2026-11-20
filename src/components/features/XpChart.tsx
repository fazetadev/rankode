import { useMemo, useState } from 'react';
import type { ActivityDay } from '../../types';

interface XpChartProps {
  activityMap: Record<string, ActivityDay>;
}

const SHORT_DAYS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function XpChart({ activityMap }: XpChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const series = useMemo(() => {
    const days: { date: string; label: string; xp: number }[] = [];
    for (let i = 6; i >= 0; i -= 1) {
      const d = new Date();
      d.setUTCDate(d.getUTCDate() - i);
      const iso = d.toISOString().slice(0, 10);
      const entry = activityMap[iso];
      days.push({
        date: iso,
        label: SHORT_DAYS[d.getUTCDay()],
        xp: entry?.xp ?? 0,
      });
    }
    return days;
  }, [activityMap]);

  const maxXp = Math.max(100, ...series.map((d) => d.xp));
  const total7Days = series.reduce((acc, d) => acc + d.xp, 0);

  const width = 420;
  const height = 156;
  const padLeft = 36;
  const padRight = 14;
  const padTop = 14;
  const padBottom = 26;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  return (
    <div className="space-y-3">
      <div className="flex items-baseline justify-between gap-2">
        <div>
          <h3 className="text-sm font-semibold text-[#FAFAFA]">XP últimos 7 días</h3>
          <p className="text-xs text-[#A1A1AA]">Progreso diario acumulado</p>
        </div>
        <span className="font-mono text-sm font-semibold tabular-nums text-[#FAFAFA]">
          +{total7Days} XP
        </span>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label="Gráfica de XP de los últimos 7 días"
          className="h-40 w-full overflow-visible"
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = padTop + plotH * (1 - ratio);
            const labelVal = Math.round(maxXp * ratio);
            return (
              <g key={ratio}>
                <line
                  x1={padLeft}
                  x2={width - padRight}
                  y1={y}
                  y2={y}
                  stroke="#27272A"
                  strokeDasharray={ratio === 0 ? undefined : '3 3'}
                />
                <text
                  x={padLeft - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-[#71717A] font-mono text-[10px]"
                >
                  {labelVal}
                </text>
              </g>
            );
          })}

          {series.map((item, idx) => {
            const colW = plotW / series.length;
            const barW = Math.min(26, colW * 0.52);
            const x = padLeft + idx * colW + (colW - barW) / 2;
            const barH = Math.max(item.xp > 0 ? 4 : 2, (item.xp / maxXp) * plotH);
            const y = padTop + plotH - barH;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.date}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                className="cursor-default"
              >
                <rect
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={3}
                  fill={item.xp > 0 ? (isHovered ? '#A78BFA' : '#8B5CF6') : '#27272A'}
                  className="transition-colors duration-150"
                />
                <text
                  x={x + barW / 2}
                  y={height - 6}
                  textAnchor="middle"
                  className={`font-sans text-[10px] ${
                    isHovered ? 'fill-[#FAFAFA]' : 'fill-[#71717A]'
                  }`}
                >
                  {item.label}
                </text>
              </g>
            );
          })}
        </svg>

        {hoveredIdx !== null && series[hoveredIdx] && (
          <div className="pointer-events-none absolute right-2 top-0 rounded border border-[#27272A] bg-[#18181B] px-2 py-1 font-mono text-[11px] tabular-nums text-[#FAFAFA]">
            {series[hoveredIdx].date}: +{series[hoveredIdx].xp} XP
          </div>
        )}
      </div>
    </div>
  );
}
