import { Link } from 'react-router-dom';
import ScrollReveal from '../common/ScrollReveal';

export default function CtaSection() {
  return (
    <ScrollReveal className="py-10 sm:py-stack-lg px-margin-mobile md:px-margin-desktop bg-primary text-on-primary text-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute -top-24 -left-24 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/30 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -right-24 w-64 sm:w-96 h-64 sm:h-96 bg-secondary/20 blur-3xl rounded-full" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto space-y-5 sm:space-y-8">
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold leading-tight px-2">
          Ready to Hit the Road?
        </h2>
        <p className="text-base sm:text-body-lg opacity-70 px-2 leading-relaxed">
          Don&apos;t just travel. Make every mile a statement of your success and taste.
        </p>
        <Link
          to="/cars"
          className="inline-flex w-full sm:w-auto items-center justify-center bg-secondary-fixed text-primary px-8 sm:px-12 py-4 sm:py-5 text-base sm:text-lg font-bold rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 min-h-[52px] touch-manipulation"
        >
          Book Your Car Today
        </Link>
      </div>
    </ScrollReveal>
  );
}
