import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import ScrollReveal from '../common/ScrollReveal';
import api from '../../api/client';
import { formatPrice } from '../../data/cars';
import { resolveMediaUrl } from '../../utils/media';

export default function VehicleCategoriesSection() {
  const [items, setItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/content/vehicle-categories')
      .then((res) => setItems(Array.isArray(res.data) ? res.data : []))
      .catch((err) => setError(err.message || 'Could not load categories'));
  }, []);

  if (!items.length && !error) return null;

  return (
    <ScrollReveal id="categories" className="py-10 sm:py-stack-lg">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop">
        <div className="mb-8 sm:mb-12 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-secondary mb-1">
              Browse by type
            </p>
            <h2 className="text-2xl sm:text-headline-lg font-bold">Vehicle categories</h2>
            <p className="mt-1 text-sm sm:text-base text-on-surface-variant max-w-xl">
              Explore our Dubai fleet by category — from essential daily cars to exotic supercars.
            </p>
          </div>
          <Link
            to="/cars"
            className="text-label-sm border-b-2 border-primary pb-1 self-start hover:text-secondary hover:border-secondary"
          >
            View full fleet
          </Link>
        </div>

        {error && <p className="mb-4 text-sm text-error">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {items.map((item) => (
            <Link
              key={item.type}
              to={item.href || `/cars?type=${item.type}`}
              className="group relative block overflow-hidden rounded-2xl aspect-[4/5] sm:aspect-[3/4] bg-surface-container-high"
            >
              {item.image ? (
                <img
                  src={resolveMediaUrl(item.image)}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-surface-container-highest to-primary/20" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6 text-white space-y-2">
                <MaterialIcon
                  name={item.icon || 'directions_car'}
                  className="text-2xl text-secondary-fixed-dim"
                />
                <h3 className="text-xl sm:text-2xl font-bold">{item.title}</h3>
                <p className="text-sm text-white/80 line-clamp-2">{item.description}</p>
                <p className="text-xs font-bold uppercase tracking-widest text-white/70 pt-1">
                  {item.carCount} car{item.carCount === 1 ? '' : 's'}
                  {item.startingFrom != null ? ` · from ${formatPrice(item.startingFrom)}` : ''}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ScrollReveal>
  );
}
