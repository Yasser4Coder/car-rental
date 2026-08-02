import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { TESTIMONIALS } from '../../data/homeContent';

export default function TestimonialsSection() {
  return (
    <ScrollReveal id="locations" className="py-10 sm:py-stack-lg bg-surface-container-low">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="text-2xl sm:text-headline-lg font-bold text-center mb-8 sm:mb-16">
          The Driver&apos;s Voice
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-gutter">
          {TESTIMONIALS.map((testimonial) => (
            <div key={testimonial.name} className="bg-surface p-5 sm:p-8 shadow-sm rounded-xl">
              <div className="flex gap-1 text-secondary mb-3 sm:mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <MaterialIcon key={i} name="star" filled className="text-sm" />
                ))}
              </div>
              <p className="italic text-sm sm:text-base text-on-surface-variant mb-5 sm:mb-6 leading-relaxed">
                &ldquo;{testimonial.quote}&rdquo;
              </p>
              <div className="flex items-center gap-3 sm:gap-4">
                <img
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover shrink-0"
                  src={testimonial.avatar}
                  alt={testimonial.name}
                />
                <div className="min-w-0">
                  <p className="font-bold text-sm sm:text-base truncate">{testimonial.name}</p>
                  <p className="text-xs text-on-surface-variant truncate">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
