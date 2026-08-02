import { useState } from 'react';
import { Link } from 'react-router-dom';
import BrandMark from './BrandMark';
import BrandWordmark from './BrandWordmark';

export default function BrandLogo({
  asLink = true,
  variant = 'default',
  showTagline = false,
  compact = false,
  showWordmark = true,
  className = '',
  onNavigate,
}) {
  const [imgFailed, setImgFailed] = useState(false);
  const markClass = compact ? 'h-9 w-9 sm:h-10 sm:w-10' : 'h-10 w-10';

  const content = (
    <div className={`flex items-center gap-2.5 min-w-0 ${className}`}>
      {imgFailed ? (
        <BrandMark className={markClass} />
      ) : (
        <img
          src="/images/logo.png"
          alt=""
          aria-hidden="true"
          className={`object-contain shrink-0 rounded-lg ${markClass}`}
          onError={() => setImgFailed(true)}
        />
      )}
      {showWordmark && (
        <div className="min-w-0">
          <BrandWordmark variant={variant} showTagline={showTagline} compact={compact} />
        </div>
      )}
    </div>
  );

  if (!asLink) return content;

  return (
    <Link
      to="/"
      onClick={() => onNavigate?.()}
      className="site-brand shrink-0 min-w-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary/50"
      aria-label="Green Rental Experience — Home"
    >
      {content}
    </Link>
  );
}
