import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import DateRangePicker from '../common/DateRangePicker';
import MaterialIcon from '../common/MaterialIcon';
import { carApi } from '../../api';
import { useAuthContext } from '../../context/AuthContext';
import {
  COMPANY,
  LOCATIONS,
  formatPrice,
  getTypeLabel,
} from '../../data/cars';
import { addDaysISO, rentalDays, todayISO } from '../../utils/bookingsStorage';
import { resolveMediaUrl } from '../../utils/media';

const emptyForm = {
  fullName: '',
  email: '',
  phone: '',
  location: 'dubai-marina',
  pickupDate: '',
  returnDate: '',
  delivery: 'self',
  notes: '',
};

function formatShortDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
  });
}

export default function BookingRequestForm({
  carId,
  initialDate = '',
  initialReturnDate = '',
  onSubmit,
  paymentsEnabled = false,
}) {
  const baseId = useId();
  const { user } = useAuthContext();
  const minDate = useMemo(() => todayISO(), []);

  const [car, setCar] = useState(null);
  const [carLoading, setCarLoading] = useState(Boolean(carId));
  const [carError, setCarError] = useState('');
  const [form, setForm] = useState(() => {
    const pickup = initialDate && initialDate >= todayISO() ? initialDate : todayISO();
    const ret =
      initialReturnDate && initialReturnDate >= pickup
        ? initialReturnDate
        : addDaysISO(pickup, 2);
    return {
      ...emptyForm,
      pickupDate: pickup,
      returnDate: ret,
    };
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [availability, setAvailability] = useState({
    loading: false,
    available: true,
    conflicts: [],
  });

  useEffect(() => {
    if (!carId) {
      setCar(null);
      setCarLoading(false);
      return;
    }
    setCarLoading(true);
    setCarError('');
    carApi
      .getById(carId)
      .then((res) => {
        const data = res.data;
        setCar(data);
        setForm((prev) => ({
          ...prev,
          location: data.locations?.includes(prev.location)
            ? prev.location
            : data.locations?.[0] || 'dubai-marina',
        }));
      })
      .catch((err) => {
        setCar(null);
        setCarError(err.message || 'Vehicle not found');
      })
      .finally(() => setCarLoading(false));
  }, [carId]);

  useEffect(() => {
    if (!user) return;
    setForm((prev) => ({
      ...prev,
      fullName: prev.fullName || user.fullName || '',
      email: prev.email || user.email || '',
      phone: prev.phone || user.phone || '',
    }));
  }, [user]);

  useEffect(() => {
    if (!carId || !form.pickupDate || !form.returnDate || form.returnDate < form.pickupDate) {
      setAvailability({ loading: false, available: true, conflicts: [] });
      return;
    }

    let cancelled = false;
    setAvailability((prev) => ({ ...prev, loading: true }));
    const timer = setTimeout(() => {
      carApi
        .checkAvailability(carId, form.pickupDate, form.returnDate)
        .then((res) => {
          if (cancelled) return;
          setAvailability({
            loading: false,
            available: Boolean(res.available),
            conflicts: res.conflicts || [],
          });
        })
        .catch(() => {
          if (cancelled) return;
          setAvailability({ loading: false, available: true, conflicts: [] });
        });
    }, 280);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [carId, form.pickupDate, form.returnDate]);

  const days = rentalDays(form.pickupDate, form.returnDate);
  const subtotal = car ? Number(car.price) * days : 0;
  const availableLocations = LOCATIONS.filter((item) =>
    car ? (car.locations || []).includes(item.value) : true,
  );
  const datesBlocked = !availability.loading && !availability.available;
  const fleetLink = (() => {
    const params = new URLSearchParams();
    if (form.pickupDate) params.set('date', form.pickupDate);
    if (form.returnDate) params.set('returnDate', form.returnDate);
    if (form.location) params.set('location', form.location);
    const q = params.toString();
    return q ? `/cars?${q}` : '/cars';
  })();

  const update = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'pickupDate' && next.returnDate && next.returnDate < value) {
        next.returnDate = addDaysISO(value, 1);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '', form: '' }));
  };

  const updateDates = ({ startDate, endDate }) => {
    setForm((prev) => ({
      ...prev,
      pickupDate: startDate || '',
      returnDate: endDate || (startDate ? addDaysISO(startDate, 2) : ''),
    }));
    setErrors((prev) => ({ ...prev, pickupDate: '', returnDate: '', form: '' }));
  };

  const validate = () => {
    const next = {};
    if (!form.fullName.trim()) next.fullName = 'Enter your full name';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Enter a valid email';
    if (form.phone.trim().length < 8) next.phone = 'Enter a valid UAE phone number';
    if (!form.location) next.location = 'Choose a pickup area';
    if (!form.pickupDate) next.pickupDate = 'Choose a pickup date';
    if (!form.returnDate) next.returnDate = 'Choose a return date';
    if (form.pickupDate && form.returnDate && form.returnDate < form.pickupDate) {
      next.returnDate = 'Return must be after pickup';
    }
    if (datesBlocked) {
      next.form = 'This car is already booked for those dates. Pick different dates or another vehicle.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!car || !validate()) return;
    setSubmitting(true);
    setErrors((prev) => ({ ...prev, form: '' }));
    try {
      await onSubmit({
        car,
        days,
        total: subtotal,
        form: {
          ...form,
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          notes: form.notes.trim(),
        },
      });
    } catch (err) {
      const conflicts = err.details?.conflicts || [];
      setAvailability((prev) =>
        conflicts.length
          ? { loading: false, available: false, conflicts }
          : prev,
      );
      setErrors((prev) => ({ ...prev, form: err.message || 'Could not submit request' }));
    } finally {
      setSubmitting(false);
    }
  };

  if (carLoading) {
    return (
      <div className="rounded-2xl border border-on-surface/10 bg-surface-container-low px-6 py-12 text-center">
        <p className="text-on-surface-variant">Loading vehicle…</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="rounded-2xl border border-dashed border-on-surface/15 bg-surface-container-low px-6 py-12 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/40">
          <MaterialIcon name="directions_car" className="text-2xl text-primary" />
        </div>
        <h2 className="text-xl font-bold">{carError || 'Choose a vehicle first'}</h2>
        <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
          Browse the Dubai fleet, open a car you like, then tap Request booking.
        </p>
        <Link
          to="/cars"
          className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
        >
          Browse fleet
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8" noValidate>
      <div className="lg:col-span-7 space-y-5">
        {errors.form && (
          <div className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
            <p className="font-semibold">{errors.form}</p>
            {datesBlocked && (
              <Link to={fleetLink} className="mt-2 inline-flex font-semibold underline">
                See cars available for these dates
              </Link>
            )}
          </div>
        )}

        {datesBlocked && !errors.form && (
          <div className="rounded-xl border border-error/25 bg-error-container/30 px-4 py-4">
            <div className="flex items-start gap-3">
              <MaterialIcon name="event_busy" className="text-error mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="font-bold text-on-error-container">Those dates are taken</p>
                <p className="mt-1 text-sm text-on-error-container/90">
                  {car.name} is already reserved for part of{' '}
                  <span className="font-semibold">
                    {formatShortDate(form.pickupDate)} – {formatShortDate(form.returnDate)}
                  </span>
                  . Choose other dates or another vehicle.
                </p>
                {availability.conflicts.length > 0 && (
                  <ul className="mt-3 space-y-1 text-sm text-on-error-container">
                    {availability.conflicts.slice(0, 3).map((c) => (
                      <li key={`${c.pickupDate}-${c.returnDate}`} className="flex items-center gap-2">
                        <MaterialIcon name="calendar_month" className="text-base" />
                        Booked {formatShortDate(c.pickupDate)} – {formatShortDate(c.returnDate)}
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-3 flex flex-wrap gap-2">
                  <Link
                    to={fleetLink}
                    className="inline-flex min-h-[40px] items-center rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary"
                  >
                    Find available cars
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {!datesBlocked && !availability.loading && form.pickupDate && form.returnDate && (
          <div className="rounded-xl border border-secondary/20 bg-secondary-container/20 px-4 py-3 text-sm">
            <p className="flex items-center gap-2 font-semibold text-primary">
              <MaterialIcon name="event_available" className="text-secondary" />
              Available for your dates
            </p>
            <p className="mt-1 text-on-surface-variant pl-7">
              {formatShortDate(form.pickupDate)} – {formatShortDate(form.returnDate)} · {days}{' '}
              {days === 1 ? 'day' : 'days'}
            </p>
          </div>
        )}

        <section className="booking-panel">
          <h2 className="text-lg font-bold">Your details</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            We’ll confirm by phone or WhatsApp within Dubai business hours.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${baseId}-name`}
              label="Full name"
              error={errors.fullName}
              className="sm:col-span-2"
            >
              <input
                id={`${baseId}-name`}
                value={form.fullName}
                onChange={update('fullName')}
                autoComplete="name"
                placeholder="As on your licence"
                className="booking-input"
              />
            </Field>

            <Field id={`${baseId}-email`} label="Email" error={errors.email}>
              <input
                id={`${baseId}-email`}
                type="email"
                value={form.email}
                onChange={update('email')}
                autoComplete="email"
                placeholder="name@email.com"
                className="booking-input"
              />
            </Field>

            <Field id={`${baseId}-phone`} label="Phone (UAE)" error={errors.phone}>
              <input
                id={`${baseId}-phone`}
                type="tel"
                value={form.phone}
                onChange={update('phone')}
                autoComplete="tel"
                placeholder="+971 50 000 0000"
                className="booking-input"
              />
            </Field>
          </div>
        </section>

        <section className="booking-panel">
          <h2 className="text-lg font-bold">Trip details</h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Pickup across selected Dubai areas, with optional hotel delivery.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              id={`${baseId}-location`}
              label="Pickup area"
              error={errors.location}
              className="sm:col-span-2"
            >
              <select
                id={`${baseId}-location`}
                value={form.location}
                onChange={update('location')}
                className="booking-input booking-select"
              >
                {availableLocations.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </Field>

            <div className="sm:col-span-2">
              <DateRangePicker
                label="Rental dates"
                startDate={form.pickupDate}
                endDate={form.returnDate}
                minDate={minDate}
                conflicts={availability.conflicts}
                error={datesBlocked || Boolean(errors.pickupDate || errors.returnDate)}
                onChange={updateDates}
              />
              {(errors.pickupDate || errors.returnDate) && (
                <p className="mt-1 text-sm text-error">
                  {errors.pickupDate || errors.returnDate}
                </p>
              )}
            </div>

            {availability.loading && (
              <p className="sm:col-span-2 text-sm text-on-surface-variant flex items-center gap-2">
                <MaterialIcon name="hourglass_top" className="text-base" />
                Checking availability…
              </p>
            )}

            <fieldset className="sm:col-span-2">
              <legend className="booking-label">Handover</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { value: 'self', label: 'Collect from desk', hint: COMPANY.address },
                  {
                    value: 'delivery',
                    label: 'Hotel / residence delivery',
                    hint: 'Within selected areas',
                  },
                ].map((option) => (
                  <label
                    key={option.value}
                    className={`booking-choice ${form.delivery === option.value ? 'booking-choice--active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="delivery"
                      value={option.value}
                      checked={form.delivery === option.value}
                      onChange={update('delivery')}
                      className="sr-only"
                    />
                    <span className="font-semibold">{option.label}</span>
                    <span className="text-sm text-on-surface-variant">{option.hint}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <Field id={`${baseId}-notes`} label="Notes (optional)" className="sm:col-span-2">
              <textarea
                id={`${baseId}-notes`}
                value={form.notes}
                onChange={update('notes')}
                rows={3}
                placeholder="Flight number, hotel name, special requests…"
                className="booking-input resize-y min-h-[96px]"
              />
            </Field>
          </div>
        </section>
      </div>

      <aside className="lg:col-span-5">
        <div className="booking-summary lg:sticky lg:top-24">
          <div className="overflow-hidden rounded-xl aspect-16/10 bg-surface-container">
            <img src={resolveMediaUrl(car.image)} alt={car.alt} className="h-full w-full object-cover" />
          </div>

          <div className="mt-4">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              {getTypeLabel(car.type)}
            </p>
            <h3 className="mt-1 text-xl font-bold">{car.name}</h3>
            <p className="text-sm text-on-surface-variant">
              {formatPrice(car.price)} / day · Deposit {formatPrice(car.deposit)}
            </p>
          </div>

          <dl className="mt-5 space-y-3 border-t border-on-surface/8 pt-5 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-on-surface-variant">Duration</dt>
              <dd className="font-semibold">
                {days} {days === 1 ? 'day' : 'days'}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-on-surface-variant">Daily rate × {days}</dt>
              <dd className="font-semibold">{formatPrice(subtotal)}</dd>
            </div>
            <div className="flex justify-between gap-4 text-base">
              <dt className="font-bold">Estimated total</dt>
              <dd className="font-bold text-secondary">{formatPrice(subtotal)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-xs text-on-surface-variant leading-relaxed">
            {paymentsEnabled
              ? 'You’ll be redirected to secure Stripe Checkout to pay the rental total in AED. Security deposit is handled at pickup.'
              : 'Final amount confirmed by concierge. Deposit held on a credit card in the renter’s name.'}
          </p>

          <button
            type="submit"
            disabled={submitting || datesBlocked || availability.loading}
            className="mt-5 inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary disabled:opacity-60 transition-colors"
          >
            <MaterialIcon
              name={datesBlocked ? 'event_busy' : paymentsEnabled ? 'credit_card' : 'send'}
            />
            {datesBlocked
              ? 'Dates unavailable'
              : submitting
                ? paymentsEnabled
                  ? 'Opening payment…'
                  : 'Sending…'
                : paymentsEnabled
                  ? 'Pay & confirm'
                  : 'Submit request'}
          </button>

          {datesBlocked && (
            <Link
              to={fleetLink}
              className="mt-3 inline-flex w-full min-h-[44px] items-center justify-center gap-2 rounded-xl border border-primary px-4 text-sm font-semibold hover:bg-primary hover:text-on-primary transition-colors"
            >
              Browse available cars
            </Link>
          )}

          <a
            href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
            className="mt-3 inline-flex w-full min-h-[44px] items-center justify-center gap-2 text-sm font-semibold text-secondary hover:underline"
          >
            <MaterialIcon name="call" className="text-base" />
            Or call {COMPANY.phone}
          </a>
        </div>
      </aside>
    </form>
  );
}

function Field({ id, label, error, className = '', children }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="booking-label">
        {label}
      </label>
      <div className="mt-1.5">{children}</div>
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
