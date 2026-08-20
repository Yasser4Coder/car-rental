import { useEffect, useState } from 'react';
import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import api from '../../api/client';
import { WHY_CHOOSE_US } from '../../data/homeContent';

export default function WhyChooseUsSection() {
  const [items, setItems] = useState(WHY_CHOOSE_US);

  useEffect(() => {
    api
      .get('/content/why-choose-us')
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          setItems(res.data);
        }
      })
      .catch(() => {
        /* keep static fallback */
      });
  }, []);

  return (
    <ScrollReveal id="services" className="py-10 sm:py-stack-lg">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="text-center mb-8 sm:mb-14 space-y-3">
          <h2 className="text-2xl sm:text-headline-lg font-bold">Why customers choose us</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Real benefits for Dubai drivers — delivery, clear pricing, premium cars, and 24/7 support.
          </p>
          <div className="w-16 sm:w-24 h-1 bg-secondary-fixed-dim mx-auto rounded-full" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {items.map((item) => (
            <div key={item.id || item.title} className="space-y-3">
              <MaterialIcon
                name={item.icon || 'verified'}
                className="text-3xl sm:text-4xl text-secondary block"
              />
              <h3 className="text-lg sm:text-xl font-bold">{item.title}</h3>
              <p className="text-sm sm:text-base text-on-surface-variant leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
