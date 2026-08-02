import { Link } from 'react-router-dom';
import BrandWordmark from './BrandWordmark';

export default function BrandLogo({
  asLink = true,
  variant = 'default',
  showTagline = false,
  compact = false,
  className = '',
}) {
  const content = (
    <div className={`flex items-center gap-2.5 sm:gap-3 min-w-0 ${className}`}>
      <img
        src="/images/logo.png"
        alt=""
        aria-hidden="true"
        className={`object-contain shrink-0 ${compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10'}`}
      />
      <div className={compact ? 'hidden sm:block min-w-0' : 'min-w-0'}>
        <BrandWordmark variant={variant} showTagline={showTagline} compact={compact} />
      </div>
    </div>
  );

  if (!asLink) {
    return content;
  }

  return (
    <Link
      to="/"
      className="shrink-0 min-w-0 hover:opacity-80 transition-opacity"
      aria-label="Green Rental Experience — Home"
    >
      {content}
    </Link>
  );
}
