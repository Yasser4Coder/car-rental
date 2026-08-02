import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { NAV_LINKS } from '../../data/homeContent';

export default function MobileNav({ open, onClose }) {
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] lg:hidden" role="dialog" aria-modal="true" aria-label="Navigation menu">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-label="Close menu"
      />

      <nav className="absolute top-0 right-0 flex h-full w-[min(100vw,320px)] flex-col bg-surface shadow-2xl">
        <div className="flex items-center justify-between border-b border-on-surface/10 px-5 py-4">
          <span className="text-sm font-semibold text-primary">Menu</span>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-surface-container-low transition-colors"
            aria-label="Close menu"
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-1 overflow-y-auto px-4 py-6">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={onClose}
              className={`rounded-xl px-4 py-3.5 text-base font-medium transition-colors ${
                link.active
                  ? 'bg-primary/5 text-secondary'
                  : 'text-on-surface hover:bg-surface-container-low'
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="border-t border-on-surface/10 p-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
          <Link
            to="/cars"
            onClick={onClose}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-bold uppercase tracking-widest text-on-primary active:scale-[0.98] transition-transform"
          >
            <MaterialIcon name="directions_car" className="text-lg" />
            Book Now
          </Link>
        </div>
      </nav>
    </div>
  );
}
