import ScrollReveal from '../common/ScrollReveal';
import { PROOF_STATS } from '../../data/homeContent';

/** Compact proof strip — replaces the brand-name row. */
export default function TrustedBySection() {
  return (
    <ScrollReveal className="py-8 sm:py-10 border-y border-on-surface/8 bg-surface-container-low">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 text-center">
          {PROOF_STATS.map((stat) => (
            <div key={stat.label} className="space-y-1">
              <p className="text-2xl sm:text-3xl font-bold text-primary tracking-tight">{stat.value}</p>
              <p className="text-xs sm:text-sm text-on-surface-variant">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
