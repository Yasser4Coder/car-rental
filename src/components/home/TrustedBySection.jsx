import ScrollReveal from '../common/ScrollReveal';
import { BRANDS } from '../../data/homeContent';

export default function TrustedBySection() {
  return (
    <ScrollReveal className="py-8 sm:py-stack-lg border-y border-on-surface/5">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="flex flex-wrap justify-center sm:justify-between items-center gap-6 sm:gap-12 opacity-40 grayscale sm:hover:grayscale-0 transition-all duration-500">
          {BRANDS.map((brand) => (
            <span key={brand} className="text-sm sm:text-lg tracking-widest italic opacity-60 font-bold">
              {brand}
            </span>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
