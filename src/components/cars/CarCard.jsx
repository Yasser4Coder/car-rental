import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { asArray, formatPrice, getCarSpecs, getTypeLabel } from '../../data/cars';
import { getCarPath } from '../../utils/carPath';
import { resolveMediaUrl } from '../../utils/media';
import { loadWishlist, toggleWishlist } from '../../utils/wishlist';

export default function CarCard({ car, pickupDate = '', returnDate = '' }) {
  const specs = getCarSpecs(car);
  const badges = asArray(car.badges);
  const image = resolveMediaUrl(car.image);
  const detailPath = getCarPath(car, {
    ...(pickupDate ? { date: pickupDate } : {}),
    ...(returnDate ? { returnDate } : {}),
  });
  const rating = Number(car.rating) || 4.9;
  const popular = Boolean(car.featured) || rating >= 4.8;
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(loadWishlist().includes(String(car.id)));
  }, [car.id]);

  const onWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setSaved(toggleWishlist(car.id));
  };

  return (
    <article className="group gre-car-card flex h-full flex-col">
      <div className="relative mb-5 aspect-16/10 overflow-hidden rounded-xl">
        <Link to={detailPath} className="block h-full w-full">
          <img
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            src={image}
            alt={car.alt}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/35 via-transparent to-transparent opacity-80" />
        </Link>

        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {popular && (
            <span className="rounded bg-[#c45c26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Popular
            </span>
          )}
          {badges.slice(0, 1).map((badge) => (
            <span
              key={badge.label}
              className={`${badge.className || 'bg-primary/80 text-on-primary'} rounded px-2.5 py-1 text-[10px] uppercase tracking-widest`}
            >
              {badge.label}
            </span>
          ))}
        </div>

        <button
          type="button"
          className={`absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full backdrop-blur transition ${
            saved ? 'bg-secondary text-primary' : 'bg-surface/90 text-primary'
          }`}
          aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
          onClick={onWishlist}
        >
          <MaterialIcon name={saved ? 'favorite' : 'favorite_border'} className="text-lg" />
        </button>

        <span className="absolute bottom-3 left-3 rounded bg-surface/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant backdrop-blur">
          {getTypeLabel(car.type)}
        </span>

        <div className="gre-car-card__hover">
          <Link to={detailPath} className="gre-car-card__hover-btn">
            View details
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold sm:text-xl">
            <Link to={detailPath} className="hover:text-secondary transition-colors">
              {car.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
            <MaterialIcon name="star" filled className="text-secondary text-sm" />
            <span className="font-semibold text-on-surface">{rating.toFixed(1)}</span>
            <span>
              · {car.year} · {car.brand}
            </span>
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-on-surface-variant text-label-sm">
            {specs.map((spec) => (
              <span key={spec.label} className="inline-flex items-center gap-1">
                <MaterialIcon name={spec.icon} className="text-sm" />
                {spec.label}
              </span>
            ))}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-lg font-bold text-secondary">{formatPrice(car.price)}</p>
          <p className="text-[10px] uppercase tracking-widest text-on-surface-variant">Per day</p>
        </div>
      </div>

      <Link
        to={detailPath}
        className="mt-auto flex min-h-[44px] items-center justify-center rounded-lg border border-primary py-3 text-label-sm uppercase tracking-widest transition-all duration-300 touch-manipulation group-hover:bg-primary group-hover:text-on-primary active:scale-[0.98]"
      >
        View details
      </Link>
    </article>
  );
}
