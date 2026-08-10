import { Link } from 'react-router-dom';
import MaterialIcon from '../common/MaterialIcon';
import { formatPrice, getLocationLabel } from '../../data/cars';
import { getCarPath } from '../../utils/carPath';
import { resolveMediaUrl } from '../../utils/media';

const STATUS = {
  pending: {
    label: 'Pending',
    className: 'bg-secondary-container/40 text-on-secondary-fixed-variant',
    icon: 'schedule',
  },
  confirmed: {
    label: 'Confirmed',
    className: 'bg-primary/10 text-primary',
    icon: 'verified',
  },
  active: {
    label: 'Active',
    className: 'bg-primary/10 text-primary',
    icon: 'directions_car',
  },
  completed: {
    label: 'Completed',
    className: 'bg-surface-container text-on-surface-variant',
    icon: 'check_circle',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-error-container text-on-error-container',
    icon: 'cancel',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-error-container text-on-error-container',
    icon: 'block',
  },
};

function formatDate(value) {
  if (!value) return '—';
  return new Date(`${value}T00:00:00`).toLocaleDateString('en-AE', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function BookingCard({ booking, onCancel, onPay, payingId }) {
  const status = STATUS[booking.status] || STATUS.pending;
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const canPay =
    booking.status === 'pending' &&
    (booking.paymentStatus === 'unpaid' || !booking.paymentStatus);
  const isPaying = payingId === booking.id;

  return (
    <article className="booking-card">
      <div className="booking-card__media">
        <img src={resolveMediaUrl(booking.carImage)} alt={booking.carName} loading="lazy" />
      </div>

      <div className="booking-card__body">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
              {booking.code || booking.id}
            </p>
            <h3 className="mt-1 text-lg font-bold truncate">
              <Link
                to={getCarPath({ slug: booking.carSlug, id: booking.carId })}
                className="hover:text-secondary transition-colors"
              >
                {booking.carName}
              </Link>
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            {booking.paymentStatus === 'paid' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                <MaterialIcon name="payments" className="text-sm" />
                Paid
              </span>
            )}
            <span
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${status.className}`}
            >
              <MaterialIcon name={status.icon} className="text-sm" />
              {status.label}
            </span>
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
          <div>
            <dt className="text-[11px] uppercase tracking-widest text-on-surface-variant">Pickup</dt>
            <dd className="mt-0.5 font-semibold">{formatDate(booking.pickupDate)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-widest text-on-surface-variant">Return</dt>
            <dd className="mt-0.5 font-semibold">{formatDate(booking.returnDate)}</dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-widest text-on-surface-variant">Location</dt>
            <dd className="mt-0.5 font-semibold">
              {getLocationLabel(booking.location) || booking.location}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] uppercase tracking-widest text-on-surface-variant">Total</dt>
            <dd className="mt-0.5 font-semibold text-secondary">{formatPrice(booking.total)}</dd>
          </div>
        </dl>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {canPay && onPay && (
            <button
              type="button"
              disabled={isPaying}
              onClick={() => onPay(booking)}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary hover:bg-tertiary transition-colors disabled:opacity-60"
            >
              <MaterialIcon name="credit_card" className="text-base" />
              {isPaying ? 'Redirecting…' : 'Pay now'}
            </button>
          )}
          <Link
            to={getCarPath({ slug: booking.carSlug, id: booking.carId })}
            className="inline-flex min-h-[40px] items-center gap-1 rounded-lg border border-on-surface/15 px-3 text-sm font-semibold hover:border-primary hover:text-primary transition-colors"
          >
            View car
          </Link>
          {canCancel && (
            <button
              type="button"
              onClick={() => onCancel(booking.id)}
              className="inline-flex min-h-[40px] items-center gap-1 rounded-lg px-3 text-sm font-semibold text-error hover:bg-error-container/50 transition-colors"
            >
              <MaterialIcon name="close" className="text-base" />
              Cancel request
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
