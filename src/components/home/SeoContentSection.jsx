import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../common/ScrollReveal';
import api from '../../api/client';
import { COMPANY } from '../../data/cars';

const FALLBACK = {
  title: 'Luxury Car Rental in Dubai',
  body: `Looking for luxury car rental in Dubai that feels effortless from the first message to the final drop-off? ${COMPANY.name} offers a curated fleet of premium and exotic vehicles for visitors, residents, and corporate travellers who want more than a standard hire car. Whether you need a weekend statement car, a comfortable SUV for family days across the Emirates, or a sports car for an evening on Sheikh Zayed Road, our team helps you choose the right vehicle with clear pricing and concierge support.

Luxury car rental Dubai is about more than a badge on the grille. It is about delivery timing, transparent deposits, insured driving, and cars that are cleaned and maintained to a high standard. Our catalogue spans executive sedans, high-end SUVs, prestige models, and supercars, so you can match the vehicle to your itinerary — business meetings in Downtown, photos at Palm Jumeirah, or a night out in Dubai Marina.

SUV rental Dubai remains one of the most popular choices for guests who want space, presence, and comfort in the city’s heat. Sports car rental Dubai options deliver the skyline experience the city is famous for. Airport car delivery across Dubai to hotels, residences, offices, and DXB means your chosen car can meet you where you stay.

Browse the live fleet, filter by category, and start your booking today.`,
};

function paragraphsFromBody(body) {
  return String(body || '')
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function SeoContentSection() {
  const [content, setContent] = useState(FALLBACK);

  useEffect(() => {
    api
      .get('/content/seo/homepage')
      .then((res) => {
        if (res.data?.title && res.data?.body) {
          setContent(res.data);
        }
      })
      .catch(() => {
        /* keep fallback */
      });
  }, []);

  const paragraphs = useMemo(() => paragraphsFromBody(content.body), [content.body]);

  if (!paragraphs.length) return null;

  return (
    <ScrollReveal
      id="seo"
      className="py-10 sm:py-12 bg-surface-container-low border-t border-on-surface/5"
    >
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <article className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-5 sm:mb-6">
            {content.title}
          </h2>
          <div className="space-y-4 text-sm sm:text-base text-on-surface-variant leading-relaxed">
            {paragraphs.map((para) => (
              <p key={para.slice(0, 48)}>{para}</p>
            ))}
          </div>
          <p className="mt-6 text-sm">
            <Link to="/cars" className="font-semibold text-secondary hover:underline">
              Browse luxury, SUV &amp; sports cars
            </Link>
            <span className="text-on-surface-variant"> · </span>
            <Link to="/cars?type=prestige" className="font-semibold text-secondary hover:underline">
              SUV rental Dubai
            </Link>
            <span className="text-on-surface-variant"> · </span>
            <Link to="/cars?type=supercar" className="font-semibold text-secondary hover:underline">
              Sports car rental
            </Link>
          </p>
        </article>
      </div>
    </ScrollReveal>
  );
}
