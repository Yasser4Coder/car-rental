import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import MobileNav from './MobileNav';
import MaterialIcon from '../common/MaterialIcon';
import { NAV_LINKS } from '../../data/homeContent';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 bg-surface/95 backdrop-blur-xl border-b border-on-surface/10 transition-shadow duration-300 pt-[env(safe-area-inset-top)] ${
          scrolled ? 'shadow-md' : 'shadow-sm'
        }`}
      >
        <div
          className={`container mx-auto flex items-center justify-between gap-3 px-margin-mobile md:px-margin-desktop transition-all duration-300 ${
            scrolled ? 'h-14 md:h-16' : 'h-16 md:h-[4.5rem]'
          }`}
        >
          <BrandLogo compact />

          <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={
                  link.active
                    ? 'text-sm font-semibold text-secondary border-b-2 border-secondary pb-0.5'
                    : 'text-sm font-medium text-on-surface-variant hover:text-primary transition-colors'
                }
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <Link
              to="/cars"
              className="hidden sm:inline-flex bg-primary text-on-primary px-5 lg:px-7 py-2.5 text-label-sm uppercase tracking-widest rounded-xl hover:bg-tertiary active:scale-95 transition-all duration-200 shadow-sm"
            >
              Book Now
            </Link>

            <Link
              to="/cars"
              className="sm:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary active:scale-95 transition-transform shadow-sm"
              aria-label="Book now"
            >
              <MaterialIcon name="directions_car" className="text-xl" />
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl border border-on-surface/15 text-primary hover:bg-surface-container-low active:scale-95 transition-all"
              aria-label="Open menu"
            >
              <MaterialIcon name="menu" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
