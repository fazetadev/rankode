export interface TabItem<T extends string> {
  id: T;
  label: string;
  badge?: string | number;
}

interface TabsProps<T extends string> {
  items: TabItem<T>[];
  activeId: T;
  onChange: (id: T) => void;
  ariaLabel: string;
  className?: string;
}

export function Tabs<T extends string>({
  items,
  activeId,
  onChange,
  ariaLabel,
  className = '',
}: TabsProps<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 rounded-md border border-[#27272A] bg-[#09090B] p-1 ${className}`}
    >
      {items.map((item) => {
        const active = item.id === activeId;
        return (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(item.id)}
            className={`inline-flex items-center gap-1.5 rounded px-3 py-1.5 text-xs font-medium whitespace-nowrap shrink-0 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8B5CF6] ${
              active
                ? 'bg-[#18181B] text-[#FAFAFA]'
                : 'text-[#A1A1AA] hover:text-[#FAFAFA]'
            }`}
          >
            <span>{item.label}</span>
            {item.badge !== undefined && (
              <span className="font-mono text-[11px] tabular-nums text-[#71717A]">
                {item.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
