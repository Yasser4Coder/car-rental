import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { GOOGLE_RATING, TESTIMONIALS } from '../../data/homeContent';

export default function TestimonialsSection() {
  return (
    <ScrollReveal id="reviews" className="py-10 sm:py-stack-lg">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-8 sm:mb-12 flex flex-col items-center gap-4 text-center">
          <h2 className="text-2xl sm:text-headline-lg font-bold">What drivers say</h2>
          <div className="inline-flex flex-wrap items-center justify-center gap-3 rounded-full border border-on-surface/10 bg-surface-container-low px-4 py-2.5">
            <MaterialIcon name="star" filled className="text-secondary text-xl" />
            <p className="text-sm sm:text-base">
              <strong className="text-on-surface">Google reviews {GOOGLE_RATING.score}</strong>
              <span className="text-on-surface-variant"> · Based on {GOOGLE_RATING.count} reviews</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {TESTIMONIALS.map((testimonial) => (
            <article key={testimonial.name} className="overflow-hidden rounded-2xl border border-on-surface/8 bg-surface">
              <div className="aspect-[16/9] overflow-hidden bg-surface-container">
                <img
                  src={testimonial.carImage}
                  alt={testimonial.vehicle}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-5 sm:p-6">
                <div className="mb-3 flex gap-0.5 text-secondary">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <MaterialIcon key={i} name="star" filled className="text-sm" />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed mb-5">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <img
                    className="h-11 w-11 rounded-full object-cover shrink-0"
                    src={testimonial.avatar}
                    alt=""
                  />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{testimonial.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">
                      {testimonial.vehicle} · {testimonial.duration}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
