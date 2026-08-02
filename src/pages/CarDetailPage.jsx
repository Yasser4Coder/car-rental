import { useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import CarCard from '../components/cars/CarCard';
import MaterialIcon from '../components/common/MaterialIcon';
import {
  COMPANY,
  formatPrice,
  getCarById,
  getDetailSpecs,
  getLocationLabel,
  getRelatedCars,
  getTypeLabel,
} from '../data/cars';

function formatDate(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString('en-AE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function CarDetailPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const car = getCarById(id);
  const pickupDate = searchParams.get('date');
  const [activeImage, setActiveImage] = useState(0);

  const related = useMemo(() => (car ? getRelatedCars(car) : []), [car]);
  const specs = useMemo(() => (car ? getDetailSpecs(car) : []), [car]);
  const gallery = car?.gallery?.length ? car.gallery : car ? [car.image] : [];

  if (!car) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-16">
        <h1 className="text-3xl font-bold">Vehicle not found</h1>
        <p className="mt-2 text-on-surface-variant">This car may no longer be in our Dubai fleet.</p>
        <Link to="/cars" className="mt-6 inline-flex text-secondary font-semibold hover:underline">
          Back to fleet
        </Link>
      </div>
    );
  }

  const bookingHref = pickupDate
    ? `/bookings?car=${car.id}&date=${encodeURIComponent(pickupDate)}`
    : `/bookings?car=${car.id}`;

  return (
    <div className="bg-surface">
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop pt-24 pb-16 sm:pt-28">
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-sm text-on-surface-variant"
          aria-label="Breadcrumb"
        >
          <Link to="/" className="hover:text-secondary transition-colors">
            Home
          </Link>
          <MaterialIcon name="chevron_right" className="text-base" />
          <Link to="/cars" className="hover:text-secondary transition-colors">
            Fleet
          </Link>
          <MaterialIcon name="chevron_right" className="text-base" />
          <span className="font-semibold text-on-surface">{car.name}</span>
        </nav>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7 space-y-3">
            <div className="overflow-hidden rounded-2xl aspect-16/10 bg-surface-container">
              <img
                src={gallery[activeImage]}
                alt={car.alt}
                className="h-full w-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {gallery.map((src, index) => (
                  <button
                    key={src + index}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-xl aspect-16/10 border-2 transition-colors ${
                      activeImage === index
                        ? 'border-secondary'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img src={src} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <aside className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 rounded-2xl border border-on-surface/10 bg-white p-5 sm:p-6 shadow-[0_18px_40px_rgba(0,52,23,0.06)]">
              <div className="flex flex-wrap gap-2 mb-4">
                {car.badges.map((badge) => (
                  <span
                    key={badge.label}
                    className={`${badge.className} rounded px-3 py-1 text-[10px] uppercase tracking-widest`}
                  >
                    {badge.label}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl font-bold tracking-tight sm:text-headline-lg">{car.name}</h1>
              <p className="mt-2 text-on-surface-variant">
                {car.year} · {getTypeLabel(car.type)} · {car.brand}
              </p>

              <div className="mt-3 flex items-center gap-2 text-sm">
                <MaterialIcon name="star" filled className="text-secondary text-base" />
                <span className="font-bold">{car.rating.toFixed(1)}</span>
                <span className="text-on-surface-variant">({car.reviews} Dubai reviews)</span>
              </div>

              <div className="mt-6 flex items-end gap-2">
                <p className="text-3xl sm:text-4xl font-bold text-secondary">{formatPrice(car.price)}</p>
                <p className="mb-1 text-sm uppercase tracking-widest text-on-surface-variant">/ day</p>
              </div>
              <p className="mt-1 text-sm text-on-surface-variant">
                Refundable deposit {formatPrice(car.deposit)} · {car.dailyKm} km/day included
              </p>

              <p className="mt-5 text-on-surface-variant leading-relaxed">{car.description}</p>

              <ul className="mt-4 space-y-2">
                {car.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-on-surface">
                    <MaterialIcon name="check_circle" className="text-secondary text-base mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl bg-surface-container-low px-4 py-3 text-sm">
                <p className="flex items-center gap-2 font-semibold">
                  <MaterialIcon name="location_on" className="text-secondary" />
                  Based in {COMPANY.city}, UAE
                </p>
                <p className="mt-1 text-on-surface-variant pl-7">{COMPANY.fullAddress}</p>
                <p className="mt-2 text-on-surface-variant pl-7">
                  Pickup:{' '}
                  {car.locations.map(getLocationLabel).filter(Boolean).join(' · ')}
                </p>
              </div>

              {pickupDate && (
                <p className="mt-4 inline-flex items-center gap-2 text-sm text-on-surface-variant">
                  <MaterialIcon name="calendar_month" className="text-base text-secondary" />
                  Requested pickup: {formatDate(pickupDate)}
                </p>
              )}

              <div className="mt-6 flex flex-col gap-3">
                <Link
                  to={bookingHref}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
                >
                  <MaterialIcon name="event_available" />
                  Request booking
                </Link>
                <a
                  href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                  className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-primary px-6 text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                >
                  <MaterialIcon name="call" />
                  Call concierge
                </a>
              </div>
            </div>
          </aside>
        </div>

        <section className="mt-12 sm:mt-16">
          <h2 className="text-2xl font-bold">Specifications</h2>
          <p className="mt-1 text-on-surface-variant">Everything you need to know before you drive in Dubai.</p>
          <dl className="mt-6 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
            {specs.map((spec) => (
              <div key={spec.label} className="rounded-xl bg-surface-container-low px-4 py-4">
                <dt className="flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-on-surface-variant">
                  <MaterialIcon name={spec.icon} className="text-sm text-secondary" />
                  {spec.label}
                </dt>
                <dd className="mt-1.5 font-semibold">{spec.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="mt-12 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-on-surface/8 bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <MaterialIcon name="auto_awesome" className="text-secondary" />
              Features
            </h3>
            <ul className="mt-4 space-y-2.5">
              {car.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <MaterialIcon name="check" className="text-secondary text-base mt-0.5 shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-on-surface/8 bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <MaterialIcon name="inventory_2" className="text-secondary" />
              What’s included
            </h3>
            <ul className="mt-4 space-y-2.5">
              {car.included.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <MaterialIcon name="check" className="text-secondary text-base mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-on-surface/8 bg-white p-5 sm:p-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <MaterialIcon name="badge" className="text-secondary" />
              Rental requirements
            </h3>
            <ul className="mt-4 space-y-2.5">
              {car.requirements.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
                  <MaterialIcon name="check" className="text-secondary text-base mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-12 rounded-2xl bg-primary text-on-primary p-6 sm:p-8 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-48 h-48 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div>
              <h2 className="text-2xl font-bold">Dubai pickup & delivery</h2>
              <p className="mt-2 text-on-primary/80 leading-relaxed">
                Collect from our Marina desk or request complimentary delivery to hotels, residences,
                and DXB within selected areas.
              </p>
              <div className="mt-4 space-y-2 text-sm">
                <p className="flex items-center gap-2">
                  <MaterialIcon name="apartment" className="text-secondary-fixed" />
                  {COMPANY.fullAddress}
                </p>
                <p className="flex items-center gap-2">
                  <MaterialIcon name="schedule" className="text-secondary-fixed" />
                  {COMPANY.hours}
                </p>
                <p className="flex items-center gap-2">
                  <MaterialIcon name="call" className="text-secondary-fixed" />
                  {COMPANY.phone}
                </p>
                <p className="flex items-center gap-2">
                  <MaterialIcon name="mail" className="text-secondary-fixed" />
                  {COMPANY.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {car.locations.map((loc) => (
                <div
                  key={loc}
                  className="rounded-xl bg-white/10 border border-white/10 px-4 py-3 backdrop-blur"
                >
                  <MaterialIcon name="location_on" className="text-secondary-fixed" />
                  <p className="mt-1 font-semibold">{getLocationLabel(loc)}</p>
                  <p className="text-xs text-on-primary/70">Available pickup</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold">Similar in Dubai</h2>
                <p className="mt-1 text-on-surface-variant">Other {getTypeLabel(car.type)} options you may like.</p>
              </div>
              <Link to={`/cars?type=${car.type}`} className="text-sm font-semibold text-secondary hover:underline shrink-0">
                View all
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <CarCard key={item.id} car={item} pickupDate={pickupDate || ''} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
