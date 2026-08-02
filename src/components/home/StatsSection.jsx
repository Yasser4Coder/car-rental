import ScrollReveal from '../common/ScrollReveal';
import { STATS } from '../../data/homeContent';

export default function StatsSection() {
  return (
    <ScrollReveal className="py-10 sm:py-stack-lg bg-primary text-on-primary">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-gutter text-center">
        {STATS.map((stat) => (
          <div key={stat.label} className="space-y-1 sm:space-y-2 px-2">
            <p className="text-2xl sm:text-4xl font-bold text-secondary-fixed">{stat.value}</p>
            <p className="text-[10px] sm:text-label-sm uppercase tracking-widest opacity-60 leading-snug">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
