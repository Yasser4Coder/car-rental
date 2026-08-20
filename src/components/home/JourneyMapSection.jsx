import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { JOURNEY_STEPS } from '../../data/homeContent';

const STEP_ICONS = ['search', 'calendar_month', 'verified', 'local_shipping'];

export default function JourneyMapSection() {
  return (
    <ScrollReveal id="experience" className="py-10 sm:py-stack-lg bg-surface-container-low">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-8 sm:mb-14 space-y-3">
          <h2 className="text-2xl sm:text-headline-lg font-bold">How it works</h2>
          <p className="text-on-surface-variant">From browse to delivery in four clear steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 sm:gap-6">
          {JOURNEY_STEPS.map((step, index) => (
            <div
              key={step.step}
              className="relative rounded-2xl border border-on-surface/8 bg-surface p-5 sm:p-6"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary text-on-primary">
                  <MaterialIcon name={STEP_ICONS[index] || 'check'} className="text-xl" />
                </span>
                <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Step {step.step}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2">{step.title}</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
