import { useEffect, useId, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
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

export default function BookingRequestForm({ carId, initialDate = '', onSubmit }) {
  const baseId = useId();
  const { user } = useAuthContext();
  const minDate = useMemo(() => todayISO(), []);

  const [car, setCar] = useState(null);
  const [carLoading, setCarLoading] = useState(Boolean(carId));
  const [carError, setCarError] = useState('');
  const [form, setForm] = useState(() => {
    const pickup = initialDate && initialDate >= todayISO() ? initialDate : todayISO();
    return {
      ...emptyForm,
      pickupDate: pickup,
      returnDate: addDaysISO(pickup, 2),
    };
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

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

  const days = rentalDays(form.pickupDate, form.returnDate);
  const subtotal = car ? Number(car.price) * days : 0;
  const availableLocations = LOCATIONS.filter((item) =>
    car ? (car.locations || []).includes(item.value) : true,
  );

  const update = (field) => (event) => {
    const value = event.target.value;
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'pickupDate' && next.returnDate && next.returnDate < value) {
        next.returnDate = addDaysISO(value, 1);
      }
      return next;
    });
    setErrors((prev) => ({ ...prev, [field]: '' }));
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
          <p className="rounded-xl border border-error/30 bg-error-container/40 px-4 py-3 text-sm text-on-error-container">
            {errors.form}
          </p>
        )}

        <section className="booking-panel">
          <h2 className="text-lg font-bold">Your details</h2>
          <p className="mt-1 text-sm text-on-surface-variant">We’ll confirm by phone or WhatsApp within Dubai business hours.</p>

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
          <p className="mt-1 text-sm text-on-surface-variant">Pickup across selected Dubai areas, with optional hotel delivery.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field id={`${baseId}-location`} label="Pickup area" error={errors.location} className="sm:col-span-2">
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

            <Field id={`${baseId}-pickup`} label="Pickup date" error={errors.pickupDate}>
              <input
                id={`${baseId}-pickup`}
                type="date"
                min={minDate}
                value={form.pickupDate}
                onChange={update('pickupDate')}
                className="booking-input"
              />
            </Field>

            <Field id={`${baseId}-return`} label="Return date" error={errors.returnDate}>
              <input
                id={`${baseId}-return`}
                type="date"
                min={form.pickupDate || minDate}
                value={form.returnDate}
                onChange={update('returnDate')}
                className="booking-input"
              />
            </Field>

            <fieldset className="sm:col-span-2">
              <legend className="booking-label">Handover</legend>
              <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {[
                  { value: 'self', label: 'Collect from desk', hint: COMPANY.address },
                  { value: 'delivery', label: 'Hotel / residence delivery', hint: 'Within selected areas' },
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
            <img src={car.image} alt={car.alt} className="h-full w-full object-cover" />
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
            Final amount confirmed by concierge. Deposit held on a credit card in the renter’s name.
          </p>

          <button
            type="submit"
            disabled={submitting}
            className="mt-5 inline-flex w-full min-h-[52px] items-center justify-center gap-2 rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary disabled:opacity-60 transition-colors"
          >
            <MaterialIcon name="send" />
            {submitting ? 'Sending…' : 'Submit request'}
          </button>

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
