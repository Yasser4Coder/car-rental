import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import BrandLogo from './BrandLogo';
import { COMPANY } from '../../data/cars';
import {
  FOOTER_COMPANY_LINKS,
  FOOTER_FLEET_LINKS,
  FOOTER_SUPPORT_LINKS,
} from '../../data/homeContent';

function whatsappHref() {
  const digits = String(COMPANY.whatsapp || COMPANY.phone).replace(/\D/g, '');
  return `https://wa.me/${digits}`;
}

export default function Footer() {
  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-[env(safe-area-inset-bottom)]">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-10 sm:py-stack-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-gutter">
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <BrandLogo variant="inverse" asLink={false} showTagline />
            <p className="text-sm sm:text-body-md text-inverse-on-surface/70 max-w-xs leading-relaxed">
              {COMPANY.tagline}. Based in Dubai Marina, serving drivers across the UAE.
            </p>
            <p className="text-sm text-inverse-on-surface/60 leading-relaxed">
              {COMPANY.fullAddress}
              <br />
              <a href={`tel:${COMPANY.phone}`} className="hover:text-inverse-on-surface">
                {COMPANY.phone}
              </a>
            </p>
            <a
              href={whatsappHref()}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-sm font-semibold text-secondary hover:opacity-90"
            >
              Chat on WhatsApp
            </a>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">Fleet</h5>
            <nav className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_FLEET_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm sm:text-body-md text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">Company</h5>
            <nav className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm sm:text-body-md text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors py-0.5"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">Support</h5>
            <nav className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_SUPPORT_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.to}
                  className="text-sm sm:text-body-md text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors py-0.5"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <form className="flex w-full max-w-sm pt-2" onSubmit={(e) => e.preventDefault()}>
              <input
                className="bg-inverse-on-surface/10 border border-inverse-on-surface/10 p-3 w-full min-w-0 outline-none text-inverse-on-surface placeholder:text-inverse-on-surface/40 rounded-l-lg focus:border-secondary/50 text-base min-h-[44px]"
                placeholder="Email for offers"
                type="email"
              />
              <button
                type="submit"
                className="bg-secondary text-primary px-4 hover:opacity-80 transition-all rounded-r-lg shrink-0 min-h-[44px] touch-manipulation"
                aria-label="Subscribe"
              >
                <MaterialIcon name="arrow_forward" />
              </button>
            </form>
          </div>
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-inverse-on-surface/10 text-center">
          <p className="text-inverse-on-surface/50 text-label-sm">
            &copy; {new Date().getFullYear()} Green Rental Experience. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
