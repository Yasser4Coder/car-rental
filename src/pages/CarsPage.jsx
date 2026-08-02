import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import CarCard from '../components/cars/CarCard';
import CarsFilterBar from '../components/cars/CarsFilterBar';
import MaterialIcon from '../components/common/MaterialIcon';
import ScrollReveal from '../components/common/ScrollReveal';
import {
  filterCars,
  getLocationLabel,
  getTypeLabel,
} from '../data/cars';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function updateParams(searchParams, updates) {
  const next = new URLSearchParams(searchParams);
  Object.entries(updates).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === 'any') {
      next.delete(key);
    } else {
      next.set(key, value);
    }
  });
  return next;
}

export default function CarsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const location = searchParams.get('location') || '';
  const type = searchParams.get('type') || 'any';
  const sort = searchParams.get('sort') || 'featured';
  const query = searchParams.get('q') || '';
  const pickupDate = searchParams.get('date') || '';

  const cars = useMemo(
    () => filterCars({ location, type, sort, query }),
    [location, type, sort, query],
  );

  const locationLabel = getLocationLabel(location);
  const typeLabel = type && type !== 'any' ? getTypeLabel(type) : null;
  const dateLabel = formatDate(pickupDate);

  const setFilter = (updates) => {
    setSearchParams(updateParams(searchParams, updates), { replace: true });
  };

  const clearFilters = () => {
    const next = new URLSearchParams();
    if (pickupDate) next.set('date', pickupDate);
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="bg-surface min-h-[70vh]">
      <section className="border-b border-on-surface/8 bg-surface-container-low">
        <div className="container mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-8 sm:pt-28 sm:pb-10">
          <nav className="mb-4 flex items-center gap-2 text-sm text-on-surface-variant" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-secondary transition-colors">
              Home
            </Link>
            <MaterialIcon name="chevron_right" className="text-base" />
            <span className="font-semibold text-on-surface">Fleet</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-headline-lg">Available Fleet</h1>
              <p className="text-on-surface-variant">
                Browse our Dubai fleet. Filter by pickup area and type to find the right drive.
              </p>
            </div>

            {(locationLabel || typeLabel || dateLabel) && (
              <div className="flex flex-wrap gap-2">
                {locationLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm text-on-surface-variant border border-on-surface/8">
                    <MaterialIcon name="location_on" className="text-base text-secondary" />
                    {locationLabel}
                  </span>
                )}
                {dateLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm text-on-surface-variant border border-on-surface/8">
                    <MaterialIcon name="calendar_month" className="text-base text-secondary" />
                    {dateLabel}
                  </span>
                )}
                {typeLabel && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 text-sm text-on-surface-variant border border-on-surface/8">
                    <MaterialIcon name="directions_car" className="text-base text-secondary" />
                    {typeLabel}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-10">
        <CarsFilterBar
          location={location}
          type={type}
          sort={sort}
          query={query}
          resultCount={cars.length}
          onLocationChange={(value) => setFilter({ location: value })}
          onTypeChange={(value) => setFilter({ type: value })}
          onSortChange={(value) => setFilter({ sort: value === 'featured' ? '' : value })}
          onQueryChange={(value) => setFilter({ q: value })}
          onClear={clearFilters}
        />

        {cars.length > 0 ? (
          <ScrollReveal className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3 sm:gap-x-6 sm:gap-y-10">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} pickupDate={pickupDate} />
            ))}
          </ScrollReveal>
        ) : (
          <div className="mt-10 rounded-2xl border border-dashed border-on-surface/15 bg-surface-container-low px-6 py-14 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/40">
              <MaterialIcon name="search_off" className="text-2xl text-primary" />
            </div>
            <h2 className="text-xl font-bold">No vehicles match</h2>
            <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
              Try another city, clear the car type, or search a different brand.
            </p>
            <button type="button" onClick={clearFilters} className="mt-6 inline-flex min-h-[44px] items-center justify-center rounded-lg bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors">
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
