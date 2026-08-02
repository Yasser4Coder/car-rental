import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { HERO_IMAGE } from '../../data/homeContent';

export default function HeroSection() {
  return (
    <ScrollReveal className="relative flex flex-col pt-20 pb-10 sm:pt-24 sm:pb-16 lg:min-h-screen lg:items-center lg:pt-24 overflow-x-hidden">
      <div className="absolute right-0 top-1/3 w-full max-w-lg h-64 z-0 opacity-10 blur-3xl rounded-full bg-secondary/30 pointer-events-none" />

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-gutter relative z-10 w-full">
        {/* Image first on mobile for visual impact */}
        <div className="lg:col-span-5 relative order-1 lg:order-2">
          <div className="relative w-full aspect-[4/3] sm:aspect-[5/4] lg:aspect-4/5 rounded-xl overflow-hidden group mx-auto max-w-md lg:max-w-none">
            <img
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              src={HERO_IMAGE}
              alt="High-performance black Porsche 911 on a minimalist concrete platform"
            />
          </div>

          <div className="hidden sm:flex absolute left-2 md:-left-8 bottom-6 lg:bottom-1/4 glass-card p-3 sm:p-4 items-center gap-3 shadow-lg rounded-lg max-w-[160px]">
            <div className="bg-secondary-fixed p-2 rounded-full flex items-center justify-center shrink-0">
              <MaterialIcon name="star" filled className="text-primary text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-none">4.9 Rating</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold truncate">
                TRUSTED SERVICE
              </p>
            </div>
          </div>

          <div className="hidden sm:flex absolute right-2 md:-right-6 top-6 lg:top-1/4 glass-card p-3 sm:p-4 items-center gap-3 shadow-lg rounded-lg max-w-[160px]">
            <div className="bg-primary p-2 rounded-full flex items-center justify-center shrink-0">
              <MaterialIcon name="group" filled className="text-white text-sm" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-none">10K+ Users</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-widest font-bold truncate">
                ACTIVE CUSTOMERS
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 flex flex-col justify-center space-y-5 sm:space-y-stack-md order-2 lg:order-1">
          <span className="text-label-sm text-secondary uppercase tracking-widest">Elite Motion</span>
          <h1 className="text-[1.75rem] leading-[1.15] sm:text-4xl md:text-5xl lg:text-display-lg font-bold tracking-tighter">
            Drive Your Journey with <span className="text-secondary">Confidence</span>
          </h1>
          <p className="text-base sm:text-body-lg text-on-surface-variant max-w-xl leading-relaxed">
            Experience the pinnacle of automotive luxury. From the roar of a V12 to the silent surge of
            electric power, we bring you the world&apos;s most exclusive fleet with a verdant touch.
          </p>

          {/* Mobile stats row */}
          <div className="flex sm:hidden gap-3">
            <div className="flex-1 glass-card rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-secondary">4.9</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Rating</p>
            </div>
            <div className="flex-1 glass-card rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-secondary">10K+</p>
              <p className="text-[10px] text-on-surface-variant uppercase tracking-wide">Users</p>
            </div>
          </div>

          <div className="glass-card p-4 sm:p-6 mt-2 sm:mt-stack-lg shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-4 items-end rounded-xl">
            <div className="space-y-1.5">
              <label className="text-label-sm text-on-surface-variant">LOCATION</label>
              <select className="w-full bg-transparent border-b-2 border-on-surface/10 focus:border-secondary outline-none py-3 sm:py-2 text-body-md min-h-[44px]">
                <option>Los Angeles, CA</option>
                <option>Miami, FL</option>
                <option>New York, NY</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-label-sm text-on-surface-variant">PICKUP DATE</label>
              <input
                className="w-full bg-transparent border-b-2 border-on-surface/10 focus:border-secondary outline-none py-3 sm:py-2 text-body-md min-h-[44px]"
                type="date"
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <label className="text-label-sm text-on-surface-variant">CAR TYPE</label>
              <select className="w-full bg-transparent border-b-2 border-on-surface/10 focus:border-secondary outline-none py-3 sm:py-2 text-body-md min-h-[44px]">
                <option>Supercar</option>
                <option>Luxury SUV</option>
                <option>EV Premium</option>
              </select>
            </div>
            <Link
              to="/cars"
              className="bg-primary text-on-primary w-full py-3.5 sm:py-4 text-label-sm rounded-lg hover:bg-tertiary transition-all active:scale-95 text-center min-h-[44px] flex items-center justify-center sm:col-span-2 lg:col-span-1"
            >
              FIND VEHICLE
            </Link>
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
