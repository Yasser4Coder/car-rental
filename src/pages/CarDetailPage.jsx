import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams, useSearchParams } from 'react-router-dom';
import CarCard from '../components/cars/CarCard';
import MaterialIcon from '../components/common/MaterialIcon';
import { carApi } from '../api';
import {
  COMPANY,
  asArray,
  formatPrice,
  getDetailSpecs,
  getLocationLabel,
  getTypeLabel,
} from '../data/cars';
import { getCarPath } from '../utils/carPath';
import { resolveMediaList } from '../utils/media';

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
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const pickupDate = searchParams.get('date');
  const returnDate = searchParams.get('returnDate') || '';
  const [car, setCar] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [availability, setAvailability] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError('');
    carApi
      .getBySlug(slug)
      .then((res) => {
        setCar(res.data);
        setRelated(res.related || []);
        setActiveImage(0);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [slug]);

  useEffect(() => {
    if (!car || !pickupDate) {
      setAvailability(null);
      return;
    }
    let cancelled = false;
    const end = returnDate && returnDate >= pickupDate ? returnDate : pickupDate;
    carApi
      .checkAvailability(car.slug || car.id, pickupDate, end)
      .then((res) => {
        if (!cancelled) setAvailability(res);
      })
      .catch(() => {
        if (!cancelled) setAvailability(null);
      });
    return () => {
      cancelled = true;
    };
  }, [car, pickupDate, returnDate]);

  const specs = useMemo(() => (car ? getDetailSpecs(car) : []), [car]);
  const gallery = car
    ? resolveMediaList(asArray(car.gallery).length ? car.gallery : [car.image])
    : [];

  if (loading) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-16">
        <p className="text-on-surface-variant">Loading vehicle…</p>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-margin-mobile md:px-margin-desktop pt-28 pb-16">
        <h1 className="text-3xl font-bold">Vehicle not found</h1>
        <p className="mt-2 text-on-surface-variant">
          {error || 'This car may no longer be in our Dubai fleet.'}
        </p>
        <Link to="/cars" className="mt-6 inline-flex text-secondary font-semibold hover:underline">
          Back to fleet
        </Link>
      </div>
    );
  }

  if (car.slug && /^\d+$/.test(String(slug || '')) && car.slug !== String(slug)) {
    return (
      <Navigate
        to={getCarPath(car, {
          ...(pickupDate ? { date: pickupDate } : {}),
          ...(returnDate ? { returnDate } : {}),
        })}
        replace
      />
    );
  }

  const datesTaken = availability && availability.available === false;
  const bookingParams = new URLSearchParams({ car: String(car.id) });
  if (pickupDate) bookingParams.set('date', pickupDate);
  if (returnDate) bookingParams.set('returnDate', returnDate);
  const bookingHref = `/bookings?${bookingParams}`;
  const fleetAltHref = (() => {
    const p = new URLSearchParams();
    if (pickupDate) p.set('date', pickupDate);
    if (returnDate) p.set('returnDate', returnDate);
    return p.toString() ? `/cars?${p}` : '/cars';
  })();

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
              <img src={gallery[activeImage]} alt={car.alt} className="h-full w-full object-cover" />
            </div>
            {gallery.length > 1 && (
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {gallery.map((src, index) => (
                  <button
                    key={`${src}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(index)}
                    className={`overflow-hidden rounded-xl aspect-16/10 border-2 transition-colors ${
                      activeImage === index
                        ? 'border-secondary'
                        : 'border-transparent opacity-80 hover:opacity-100'
                    }`}
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
                {asArray(car.badges).map((badge) => (
                  <span
                    key={badge.label}
                    className={`${badge.className || 'bg-primary/80 text-on-primary'} rounded px-3 py-1 text-[10px] uppercase tracking-widest`}
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
                <span className="font-bold">{Number(car.rating).toFixed(1)}</span>
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
                {(car.highlights || []).map((item) => (
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
                  Pickup: {(car.locations || []).map(getLocationLabel).filter(Boolean).join(' · ')}
                </p>
              </div>

              {pickupDate && (
                <div
                  className={`mt-4 rounded-xl px-4 py-3 text-sm ${
                    datesTaken
                      ? 'border border-error/25 bg-error-container/30 text-on-error-container'
                      : availability?.available
                        ? 'border border-secondary/20 bg-secondary-container/25 text-primary'
                        : 'text-on-surface-variant'
                  }`}
                >
                  <p className="flex items-center gap-2 font-semibold">
                    <MaterialIcon
                      name={datesTaken ? 'event_busy' : 'calendar_month'}
                      className="text-base"
                    />
                    {datesTaken
                      ? 'Unavailable for your dates'
                      : availability?.available
                        ? 'Available for your dates'
                        : 'Requested pickup'}
                  </p>
                  <p className="mt-1 pl-7">
                    {formatDate(pickupDate)}
                    {returnDate ? ` → ${formatDate(returnDate)}` : ''}
                  </p>
                  {datesTaken && (
                    <p className="mt-2 pl-7 text-on-error-container/90">
                      This car is already reserved then. Pick other dates or choose another vehicle.
                    </p>
                  )}
                </div>
              )}

              <div className="mt-6 flex flex-col gap-3">
                {datesTaken ? (
                  <>
                    <Link
                      to={fleetAltHref}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
                    >
                      <MaterialIcon name="search" />
                      Find available cars
                    </Link>
                    <Link
                      to={`/bookings?car=${car.id}`}
                      className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl border border-primary px-6 text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                    >
                      <MaterialIcon name="edit_calendar" />
                      Try different dates
                    </Link>
                  </>
                ) : (
                  <Link
                    to={bookingHref}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
                  >
                    <MaterialIcon name="event_available" />
                    Request booking
                  </Link>
                )}
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
          {[
            ['Features', car.features],
            ["What's included", car.included],
            ['Rental requirements', car.requirements],
          ].map(([title, items]) => (
            <div key={title} className="rounded-2xl border border-on-surface/8 bg-white p-5 sm:p-6">
              <h3 className="text-lg font-bold">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {(items || []).map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <MaterialIcon name="check" className="text-secondary text-base mt-0.5 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {related.length > 0 && (
          <section className="mt-12 sm:mt-16">
            <h2 className="text-2xl font-bold">Similar in Dubai</h2>
            <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2 xl:grid-cols-3">
              {related.map((item) => (
                <CarCard
                  key={item.id}
                  car={item}
                  pickupDate={pickupDate || ''}
                  returnDate={returnDate || ''}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
