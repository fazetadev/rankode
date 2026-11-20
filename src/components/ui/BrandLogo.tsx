interface BrandLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

export function BrandLogo({ size = 'md' }: BrandLogoProps) {
  const sizeClass =
    size === 'lg' ? 'text-2xl' : size === 'sm' ? 'text-sm' : 'text-base';

  return (
    <span className={`inline-flex items-baseline font-sans font-semibold tracking-tight text-[#FAFAFA] ${sizeClass}`}>
      <span>rankode</span>
      <span
        aria-hidden="true"
        className="ml-0.5 inline-block h-[0.16em] w-[0.55em] translate-y-[0.04em] rounded-[1px] bg-[#8B5CF6]"
      />
    </span>
  );
}
