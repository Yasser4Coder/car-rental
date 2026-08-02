import { useEffect, useRef } from 'react';
import BrandLogo from './BrandLogo';
import NavLinkItem from './NavLinkItem';
import MaterialIcon from '../common/MaterialIcon';
import { MAIN_NAV } from '../../data/homeContent';
import { COMPANY } from '../../data/cars';

export default function MobileNav({ open, onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', onKeyDown);
    closeRef.current?.focus();

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  return (
    <div
      className={`mobile-nav ${open ? 'mobile-nav--open' : ''}`}
      aria-hidden={!open}
    >
      <button
        type="button"
        className="mobile-nav__backdrop"
        onClick={onClose}
        tabIndex={open ? 0 : -1}
        aria-label="Close menu"
      />

      <nav
        id="mobile-navigation"
        className="mobile-nav__panel"
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        <div className="mobile-nav__top">
          <BrandLogo compact onNavigate={onClose} />
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="mobile-nav__close"
            aria-label="Close menu"
            tabIndex={open ? 0 : -1}
          >
            <MaterialIcon name="close" />
          </button>
        </div>

        <div className="mobile-nav__meta">
          <p className="mobile-nav__eyebrow">Dubai · UAE</p>
          <p className="mobile-nav__address">{COMPANY.fullAddress}</p>
        </div>

        <div className="mobile-nav__links">
          {MAIN_NAV.map((link) => (
            <NavLinkItem
              key={link.to}
              to={link.to}
              onNavigate={onClose}
              className="mobile-nav__link"
              activeClassName="mobile-nav__link--active"
              tabIndex={open ? 0 : -1}
            >
              <MaterialIcon name={link.icon} className="text-xl" />
              <span>{link.label}</span>
              <MaterialIcon name="chevron_right" className="mobile-nav__chevron" />
            </NavLinkItem>
          ))}
        </div>

        <div className="mobile-nav__footer">
          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
            className="mobile-nav__call"
            tabIndex={open ? 0 : -1}
          >
            <MaterialIcon name="call" />
            <span>
              <strong>Call concierge</strong>
              <small>{COMPANY.phone}</small>
            </span>
          </a>

          <NavLinkItem
            to="/cars"
            onNavigate={onClose}
            className="mobile-nav__cta"
            tabIndex={open ? 0 : -1}
          >
            <MaterialIcon name="directions_car" />
            Browse fleet
          </NavLinkItem>
        </div>
      </nav>
    </div>
  );
}
