import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { asArray, formatPrice, getCarSpecs, getTypeLabel } from '../../data/cars';
import { getCarPath } from '../../utils/carPath';
import { resolveMediaUrl } from '../../utils/media';
import { loadWishlist, toggleWishlist } from '../../utils/wishlist';

export default function FeaturedCarCard({ car }) {
  const badges = asArray(car.badges);
  const specs = asArray(car.specs?.length ? car.specs : getCarSpecs(car));
  const image = resolveMediaUrl(car.image);
  const detailPath = getCarPath(car);
  const rating = Number(car.rating) || 4.9;
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
    <article className="group gre-car-card h-full">
      <div className="relative aspect-16/10 overflow-hidden mb-4 rounded-xl">
        <Link to={detailPath} className="block h-full w-full">
          <img
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            src={image}
            alt={car.alt || car.name}
          />
        </Link>

        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          {car.popular && (
            <span className="rounded bg-[#c45c26] px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white">
              Popular
            </span>
          )}
          {badges.slice(0, 1).map((badge) => (
            <span
              key={badge.label}
              className={`${badge.className || 'bg-primary/80 text-on-primary'} px-2.5 py-1 text-[10px] uppercase tracking-widest rounded`}
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

        <div className="gre-car-card__hover">
          <Link to={detailPath} className="gre-car-card__hover-btn">
            View details
          </Link>
        </div>
      </div>

      <div className="flex justify-between items-start gap-3 mb-2">
        <div className="min-w-0">
          <h3 className="text-lg sm:text-xl font-bold truncate">
            <Link to={detailPath} className="hover:text-secondary transition-colors">
              {car.name}
            </Link>
          </h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-on-surface-variant">
            <MaterialIcon name="star" filled className="text-secondary text-sm" />
            <span className="font-semibold text-on-surface">{rating.toFixed(1)}</span>
            <span>· {getTypeLabel(car.type) || 'Premium'}</span>
          </p>
        </div>
        <div className="text-right shrink-0">
          <p className="text-secondary font-bold">{formatPrice(car.price)}</p>
          <p className="text-[10px] text-on-surface-variant uppercase tracking-widest">Per day</p>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-x-3 gap-y-1 text-on-surface-variant text-label-sm">
        {specs.map((spec) => (
          <span key={spec.label} className="inline-flex items-center gap-1">
            <MaterialIcon name={spec.icon} className="text-sm" />
            {spec.label}
          </span>
        ))}
      </div>

      <Link
        to={detailPath}
        className="block w-full border border-primary py-3.5 text-label-sm rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation"
      >
        Rent now
      </Link>
    </article>
  );
}
