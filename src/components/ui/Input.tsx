import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, icon, className = '', id, ...rest }, ref) => {
    const inputId = id ?? (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-medium text-[#A1A1AA]">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#71717A]"
            >
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`h-9 w-full rounded-md border border-[#27272A] bg-[#111113] text-sm text-[#FAFAFA] placeholder:text-[#71717A] transition-colors hover:border-[#3F3F46] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
              icon ? 'pl-9 pr-3' : 'px-3'
            } ${className}`}
            {...rest}
          />
        </div>
      </div>
    );
  }
);

Input.displayName = 'Input';
