import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import { FAQ_ITEMS } from '../../data/homeContent';

export default function FaqSection() {
  return (
    <ScrollReveal className="py-10 sm:py-stack-lg bg-surface">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop max-w-3xl">
        <h2 className="text-2xl sm:text-headline-lg font-bold text-center mb-6 sm:mb-12">
          Common Inquiries
        </h2>

        <div className="space-y-3 sm:space-y-4">
          {FAQ_ITEMS.map((item) => (
            <details
              key={item.question}
              className="group bg-surface-container border border-on-surface/10 rounded-xl overflow-hidden"
              open={item.defaultOpen}
            >
              <summary className="flex justify-between items-center gap-4 p-4 sm:p-6 cursor-pointer list-none touch-manipulation min-h-[56px]">
                <span className="text-base sm:text-lg font-bold text-left leading-snug">
                  {item.question}
                </span>
                <MaterialIcon
                  name="expand_more"
                  className="shrink-0 transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 text-sm sm:text-base text-on-surface-variant border-t border-on-surface/5 leading-relaxed">
                {item.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
