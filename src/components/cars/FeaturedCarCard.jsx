import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';

export default function FeaturedCarCard({ car }) {
  return (
    <div className="group h-full">
      <div className="relative aspect-16/10 overflow-hidden mb-6 rounded-xl">
        <img
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          src={car.image}
          alt={car.alt}
        />
        <div className="absolute top-4 left-4 flex gap-2 flex-wrap">
          {car.badges.map((badge) => (
            <span
              key={badge.label}
              className={`${badge.className} px-3 py-1 text-[10px] uppercase text-label-sm tracking-widest rounded`}
            >
              {badge.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-start mb-4 gap-4">
        <div className="min-w-0">
          <h3 className="text-xl font-bold truncate">{car.name}</h3>
          <div className="flex flex-wrap gap-4 mt-2 text-on-surface-variant text-label-sm">
            {car.specs.map((spec) => (
              <span key={spec.label} className="flex items-center gap-1">
                <MaterialIcon name={spec.icon} className="text-sm" />
                {spec.label}
              </span>
            ))}
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-secondary font-bold">${car.price}</p>
          <p className="text-[10px] text-on-surface-variant uppercase">PER DAY</p>
        </div>
      </div>

      <Link
        to={`/cars/${car.id}`}
        className="block w-full border border-primary py-3.5 sm:py-4 text-label-sm rounded-lg group-hover:bg-primary group-hover:text-on-primary transition-all duration-300 active:scale-95 text-center min-h-[44px] flex items-center justify-center touch-manipulation"
      >
        RENT NOW
      </Link>
    </div>
  );
}
