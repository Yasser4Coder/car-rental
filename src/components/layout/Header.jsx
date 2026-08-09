import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import MobileNav from './MobileNav';
import NavLinkItem from './NavLinkItem';
import MaterialIcon from '../common/MaterialIcon';
import { useAuthContext } from '../../context/AuthContext';
import { MAIN_NAV } from '../../data/homeContent';
import { COMPANY } from '../../data/cars';

export default function Header() {
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuthContext();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.replace('#', '');
    const timer = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
    return () => window.clearTimeout(timer);
  }, [location.pathname, location.hash]);

  return (
    <>
      <header className={`site-header ${scrolled ? 'site-header--scrolled' : ''}`}>
        <div className="site-header__bar">
          <BrandLogo compact className="site-header__brand" />

          <nav className="site-header__nav" aria-label="Main navigation">
            {MAIN_NAV.map((link) => (
              <NavLinkItem
                key={link.to}
                to={link.to}
                className="site-header__link"
                activeClassName="site-header__link--active"
              >
                {link.label}
              </NavLinkItem>
            ))}
          </nav>

          <div className="site-header__actions">
            <a
              href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
              className="site-header__phone"
              aria-label={`Call ${COMPANY.phone}`}
            >
              <MaterialIcon name="call" className="text-lg" />
              <span className="site-header__phone-text">{COMPANY.phone}</span>
            </a>

            <NavLinkItem to="/bookings" className="site-header__icon-btn" aria-label="My bookings">
              <MaterialIcon name="receipt_long" className="text-[1.35rem]" />
            </NavLinkItem>

            {isAuthenticated ? (
              <button
                type="button"
                onClick={() => logout()}
                className="site-header__icon-btn hidden sm:inline-flex"
                aria-label={`Log out ${user?.fullName || ''}`}
                title="Log out"
              >
                <MaterialIcon name="logout" className="text-[1.35rem]" />
              </button>
            ) : (
              <NavLinkItem to="/login" className="site-header__icon-btn hidden sm:inline-flex" aria-label="Log in">
                <MaterialIcon name="person" className="text-[1.35rem]" />
              </NavLinkItem>
            )}

            <NavLinkItem to="/cars" className="site-header__cta">
              <span className="site-header__cta-full">Book now</span>
              <span className="site-header__cta-short">Book</span>
            </NavLinkItem>

            <button
              type="button"
              className="site-header__menu-btn"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={menuOpen}
              aria-controls="mobile-navigation"
              onClick={() => setMenuOpen((open) => !open)}
            >
              <MaterialIcon name={menuOpen ? 'close' : 'menu'} className="text-[1.4rem]" />
            </button>
          </div>
        </div>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
