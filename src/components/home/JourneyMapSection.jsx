import ScrollReveal from '../common/ScrollReveal';
import { JOURNEY_STEPS } from '../../data/homeContent';

export default function JourneyMapSection() {
  return (
    <ScrollReveal id="experience" className="py-10 sm:py-stack-lg bg-surface relative overflow-hidden">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <h2 className="text-2xl sm:text-headline-lg font-bold text-center mb-8 sm:mb-stack-lg">
          Journey Map
        </h2>

        <div className="relative max-w-5xl mx-auto">
          <div
            className="hidden md:block absolute top-6 left-[12.5%] right-[12.5%] h-0.5 bg-secondary/40"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-10 md:gap-gutter">
            {JOURNEY_STEPS.map((step, index) => (
              <div
                key={step.step}
                className="relative flex items-start md:flex-col md:items-center md:text-center gap-4 pl-1"
              >
                {index < JOURNEY_STEPS.length - 1 && (
                  <div
                    className="md:hidden absolute left-[1.44rem] top-12 w-0.5 h-[calc(100%+0.5rem)] bg-secondary/30"
                    aria-hidden="true"
                  />
                )}

                <div className="relative z-10 w-11 h-11 sm:w-12 sm:h-12 shrink-0 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-sm">
                  <span className="text-base sm:text-lg font-bold">{step.step}</span>
                </div>

                <div className="md:mt-6 pt-0.5 flex-1 min-w-0">
                  <h4 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">{step.title}</h4>
                  <p className="text-on-surface-variant text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ScrollReveal>
  );
}
