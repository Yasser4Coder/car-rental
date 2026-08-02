const themes = {
  default: {
    title: 'text-primary',
    subtitle: 'text-secondary',
  },
  inverse: {
    title: 'text-secondary-fixed',
    subtitle: 'text-inverse-on-surface/80',
  },
};

export default function BrandWordmark({ variant = 'default', showTagline = false, compact = false }) {
  const t = themes[variant];

  return (
    <div className="flex flex-col leading-none min-w-0">
      <span
        className={`font-bold tracking-wide truncate ${t.title} ${
          compact ? 'text-base sm:text-lg' : 'text-lg'
        }`}
      >
        Green Rental
      </span>
      <span
        className={`uppercase mt-0.5 truncate ${t.subtitle} ${
          compact ? 'text-[10px] sm:text-xs tracking-[0.12em]' : 'text-xs tracking-[0.15em]'
        }`}
      >
        Expérience
      </span>
      {showTagline && (
        <span className="font-['Great_Vibes'] text-sm text-inverse-on-surface/50 mt-1">
          By Najam Alibtekar
        </span>
      )}
    </div>
  );
}
