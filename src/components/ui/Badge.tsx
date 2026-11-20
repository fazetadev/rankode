import React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'neutral' | 'accent' | 'success' | 'error' | 'warning';
  dotColor?: string;
}

const VARIANT_CLASSES: Record<NonNullable<BadgeProps['variant']>, string> = {
  neutral: 'bg-[#18181B] text-[#A1A1AA] border-[#27272A]',
  accent: 'bg-[#8B5CF6]/10 text-[#C4B5FD] border-[#8B5CF6]/30',
  success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  error: 'bg-red-500/10 text-red-400 border-red-500/25',
  warning: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
};

export function Badge({
  variant = 'neutral',
  dotColor,
  className = '',
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap shrink-0 ${VARIANT_CLASSES[variant]} ${className}`}
      {...rest}
    >
      {dotColor && (
        <span
          aria-hidden="true"
          className="h-1.5 w-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </span>
  );
}
