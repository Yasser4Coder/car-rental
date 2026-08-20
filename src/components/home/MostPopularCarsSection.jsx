import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ScrollReveal from '../common/ScrollReveal';
import MaterialIcon from '../common/MaterialIcon';
import { carApi } from '../../api';
import { formatPrice } from '../../data/cars';
import { getCarPath } from '../../utils/carPath';
import { resolveMediaUrl } from '../../utils/media';

const BADGE_STYLES = {
  best_seller: 'bg-primary text-on-primary',
  most_booked: 'bg-[#c45c26] text-white',
  new_arrival: 'bg-secondary text-primary',
  limited_availability: 'bg-error text-on-error',
};

export default function MostPopularCarsSection() {
  const [cars, setCars] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    carApi
      .getPopular(6)
      .then((res) => setCars(res.data || []))
      .catch((err) => setError(err.message || 'Could not load popular cars'));
  }, []);

  if (!cars.length && !error) {
    return null;
  }

  return (
    <ScrollReveal id="popular" className="py-10 sm:py-12 bg-surface-container-low">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
              Trending now
            </p>
            <h2 className="text-2xl sm:text-headline-lg font-bold">Most popular cars</h2>
            <p className="mt-1 text-sm sm:text-base text-on-surface-variant">
              Best sellers and most booked vehicles in Dubai this month.
            </p>
          </div>
          <Link
            to="/cars"
            className="text-label-sm border-b-2 border-primary pb-1 self-start hover:text-secondary hover:border-secondary"
          >
            View all cars
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {cars.map((car) => {
            const badgeKey = car.popularBadge || 'most_booked';
            const badgeLabel = car.popularBadgeLabel || String(badgeKey).replace(/_/g, ' ');
            const monthCount = Number(car.monthBookingCount) || 0;
            const totalCount = Number(car.bookingCount) || 0;
            const path = getCarPath(car);

            return (
              <article
                key={car.id}
                className="overflow-hidden rounded-2xl border border-on-surface/8 bg-surface"
              >
                <Link to={path} className="relative block aspect-[16/10] overflow-hidden">
                  <img
                    src={resolveMediaUrl(car.image)}
                    alt={car.alt || car.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                    loading="lazy"
                  />
                  <span
                    className={`absolute top-3 left-3 rounded px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest ${
                      BADGE_STYLES[badgeKey] || BADGE_STYLES.most_booked
                    }`}
                  >
                    {badgeLabel}
                  </span>
                </Link>
                <div className="p-4 sm:p-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
                    {badgeKey === 'most_booked' ? 'Most booked this week' : badgeLabel}
                  </p>
                  <h3 className="text-lg font-bold truncate">
                    <Link to={path} className="hover:text-secondary">
                      {car.name}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-on-surface-variant">
                    {monthCount > 0
                      ? `${monthCount} booking${monthCount === 1 ? '' : 's'} this month`
                      : totalCount > 0
                        ? `${totalCount} completed booking${totalCount === 1 ? '' : 's'}`
                        : 'In high demand'}
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-bold text-secondary">{formatPrice(car.price)}</p>
                      <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">
                        Per day
                      </p>
                    </div>
                    <Link
                      to={path}
                      className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-primary px-3 text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      Book
                      <MaterialIcon name="arrow_forward" className="text-sm" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </ScrollReveal>
  );
}
