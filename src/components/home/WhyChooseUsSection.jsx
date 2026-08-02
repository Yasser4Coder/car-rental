import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { WHY_CHOOSE_US } from '../../data/homeContent';

export default function WhyChooseUsSection() {
  return (
    <ScrollReveal id="services" className="py-10 sm:py-stack-lg bg-surface-container-low">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-8 sm:mb-16 space-y-3 sm:space-y-4">
          <h2 className="text-2xl sm:text-headline-lg font-bold">The Verdant Standard</h2>
          <div className="w-16 sm:w-24 h-1 bg-secondary-fixed-dim mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-gutter">
          {WHY_CHOOSE_US.map((item) => (
            <div
              key={item.title}
              className="bg-surface p-5 sm:p-8 group active:bg-primary sm:hover:bg-primary transition-all duration-300 shadow-sm border border-on-surface/5 rounded-xl"
            >
              <MaterialIcon name={item.icon} className="text-3xl sm:text-4xl text-secondary mb-4 sm:mb-6 block" />
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 group-active:text-on-primary sm:group-hover:text-on-primary">
                {item.title}
              </h3>
              <p className="text-sm sm:text-base text-on-surface-variant group-active:text-on-primary/70 sm:group-hover:text-on-primary/70 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
