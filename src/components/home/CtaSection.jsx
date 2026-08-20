import { Link } from 'react-router-dom';
import ScrollReveal from '../common/ScrollReveal';

export default function CtaSection() {
  return (
    <ScrollReveal
      id="cta"
      className="py-12 sm:py-stack-lg px-margin-mobile md:px-margin-desktop bg-primary text-on-primary text-center relative overflow-hidden"
    >
      <div className="absolute inset-0 opacity-25 pointer-events-none" aria-hidden>
        <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-7">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight px-2">
          Your Dubai journey starts here
        </h2>
        <p className="text-base sm:text-lg opacity-80 px-2 leading-relaxed">
          Reserve your dream car in less than 60 seconds — delivery across Dubai.
        </p>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/bookings"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full bg-secondary-fixed px-8 text-base font-bold text-primary shadow-lg transition hover:scale-[1.02] active:scale-95 touch-manipulation"
          >
            Book your vehicle
          </Link>
          <Link
            to="/cars"
            className="inline-flex min-h-[52px] items-center justify-center rounded-full border border-on-primary/35 px-8 text-base font-semibold text-on-primary transition hover:bg-on-primary/10 active:scale-95 touch-manipulation"
          >
            Browse fleet
          </Link>
        </div>
      </div>
    </ScrollReveal>
  );
}
