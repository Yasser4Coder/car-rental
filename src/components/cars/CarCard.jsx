import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { formatPrice, getCarSpecs, getTypeLabel } from '../../data/cars';

export default function CarCard({ car, pickupDate = '' }) {
  const specs = getCarSpecs(car);
  const detailPath = pickupDate
    ? `/cars/${car.id}?date=${encodeURIComponent(pickupDate)}`
    : `/cars/${car.id}`;

  return (
    <article className="group flex h-full flex-col">
      <Link to={detailPath} className="relative mb-5 block aspect-16/10 overflow-hidden rounded-xl">
        <img
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          src={car.image}
          alt={car.alt}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-linear-to-t from-primary/35 via-transparent to-transparent opacity-80" />
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {car.badges.slice(0, 2).map((badge) => (
            <span
              key={badge.label}
              className={`${badge.className} rounded px-2.5 py-1 text-[10px] uppercase tracking-widest`}
            >
              {badge.label}
            </span>
          ))}
        </div>
        <span className="absolute bottom-3 left-3 rounded bg-surface/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant backdrop-blur">
          {getTypeLabel(car.type)}
        </span>
      </Link>

      <div className="mb-4 flex flex-1 items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-lg font-bold sm:text-xl">
            <Link to={detailPath} className="hover:text-secondary transition-colors">
              {car.name}
            </Link>
          </h3>
          <p className="mt-1 text-sm text-on-surface-variant">
            {car.year} · {car.brand}
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
