import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import BrandLogo from './BrandLogo';
import { FOOTER_COMPANY_LINKS, FOOTER_FLEET_LINKS } from '../../data/homeContent';

export default function Footer() {
  return (
    <footer className="w-full bg-inverse-surface text-inverse-on-surface pb-[env(safe-area-inset-bottom)]">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-10 sm:py-stack-lg">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-gutter">
          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <BrandLogo variant="inverse" asLink={false} showTagline />
            <p className="text-sm sm:text-body-md text-inverse-on-surface/70 max-w-xs leading-relaxed">
              The world&apos;s premier exotic and luxury car rental network.
            </p>
            <div className="flex gap-3 sm:gap-4">
              <a
                href="#"
                className="w-10 h-10 border border-inverse-on-surface/20 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all touch-manipulation"
                aria-label="Website"
              >
                <MaterialIcon name="public" className="text-sm" />
              </a>
              <a
                href="#"
                className="w-10 h-10 border border-inverse-on-surface/20 rounded-full flex items-center justify-center hover:bg-secondary hover:text-primary transition-all touch-manipulation"
                aria-label="Share"
              >
                <MaterialIcon name="share" className="text-sm" />
              </a>
            </div>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">The Fleet</h5>
            <nav className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_FLEET_LINKS.map((link) => (
                <Link
                  key={link}
                  to="/cars"
                  className="text-sm sm:text-body-md text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors py-0.5"
                >
                  {link}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">Company</h5>
            <nav className="flex flex-col gap-2.5 sm:gap-3">
              {FOOTER_COMPANY_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm sm:text-body-md text-inverse-on-surface/70 hover:text-inverse-on-surface transition-colors py-0.5"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          <div className="space-y-4 sm:space-y-6 sm:col-span-2 lg:col-span-1">
            <h5 className="text-label-sm uppercase tracking-widest text-secondary">Newsletter</h5>
            <p className="text-sm sm:text-body-md text-inverse-on-surface/70 leading-relaxed">
              Join the inner circle for exclusive offers.
            </p>
            <form className="flex w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
              <input
                className="bg-inverse-on-surface/10 border border-inverse-on-surface/10 p-3 w-full min-w-0 outline-none text-inverse-on-surface placeholder:text-inverse-on-surface/40 rounded-l-lg focus:border-secondary/50 text-base min-h-[44px]"
                placeholder="Email"
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
