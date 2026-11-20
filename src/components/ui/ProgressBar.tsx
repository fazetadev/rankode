interface ProgressBarProps {
  value: number;
  max?: number;
  ariaLabel?: string;
  color?: string;
  heightClass?: string;
  className?: string;
}

export function ProgressBar({
  value,
  max = 100,
  ariaLabel = 'Progreso',
  color = '#8B5CF6',
  heightClass = 'h-2',
  className = '',
}: ProgressBarProps) {
  const safeMax = max <= 0 ? 100 : max;
  const percent = Math.min(100, Math.max(0, (value / safeMax) * 100));

  return (
    <div
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuemin={0}
      aria-valuemax={safeMax}
      aria-valuenow={Math.round(value)}
      className={`w-full overflow-hidden rounded-full bg-[#18181B] border border-[#27272A] ${heightClass} ${className}`}
    >
      <div
        className="h-full rounded-full transition-[width] duration-200 ease-out"
        style={{
          width: `${percent}%`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
