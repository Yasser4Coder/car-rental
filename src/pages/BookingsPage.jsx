import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import BookingCard from '../components/bookings/BookingCard';
import BookingRequestForm from '../components/bookings/BookingRequestForm';
import MaterialIcon from '../components/common/MaterialIcon';
import { bookingApi, carApi, paymentApi } from '../api';
import { useAuthContext } from '../context/AuthContext';
import { COMPANY } from '../data/cars';
import { getCarPath } from '../utils/carPath';

const TABS = [
  { id: 'request', label: 'New request', icon: 'edit_calendar' },
  { id: 'history', label: 'My bookings', icon: 'receipt_long' },
];

function normalizeBooking(booking) {
  return {
    id: booking.id,
    code: booking.code,
    carId: booking.carId,
    carName: booking.car?.name || booking.carName || 'Vehicle',
    carSlug: booking.car?.slug || booking.carSlug || '',
    carImage: booking.car?.image || booking.carImage || '',
    status: booking.status,
    paymentStatus: booking.paymentStatus || 'unpaid',
    days: booking.days,
    total: booking.total,
    dailyRate: booking.dailyRate,
    deposit: booking.deposit,
    location: booking.location,
    pickupDate: booking.pickupDate,
    returnDate: booking.returnDate,
    delivery: booking.delivery,
    fullName: booking.fullName,
    email: booking.email,
    phone: booking.phone,
    notes: booking.notes,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

export default function BookingsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const carId = searchParams.get('car') || '';
  const initialDate = searchParams.get('date') || '';
  const initialReturnDate = searchParams.get('returnDate') || '';
  const { isAuthenticated, loading: authLoading } = useAuthContext();

  const [tab, setTab] = useState(carId ? 'request' : 'history');
  const [bookings, setBookings] = useState([]);
  const [selectedCarName, setSelectedCarName] = useState('');
  const [selectedCarSlug, setSelectedCarSlug] = useState('');
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState('');
  const [successCode, setSuccessCode] = useState(null);
  const [pendingPay, setPendingPay] = useState(null);
  const [payingId, setPayingId] = useState(null);
  const [paymentsEnabled, setPaymentsEnabled] = useState(false);

  useEffect(() => {
    paymentApi
      .getConfig()
      .then((res) => setPaymentsEnabled(Boolean(res.configured)))
      .catch(() => setPaymentsEnabled(false));
  }, []);

  useEffect(() => {
    if (carId) setTab('request');
  }, [carId]);

  useEffect(() => {
    if (!carId) {
      setSelectedCarName('');
      setSelectedCarSlug('');
      return;
    }
    carApi
      .getById(carId)
      .then((res) => {
        setSelectedCarName(res.data?.name || '');
        setSelectedCarSlug(res.data?.slug || '');
      })
      .catch(() => {
        setSelectedCarName('');
        setSelectedCarSlug('');
      });
  }, [carId]);

  const loadMine = useCallback(() => {
    if (!isAuthenticated) {
      setBookings([]);
      setListError('');
      return;
    }
    setListLoading(true);
    setListError('');
    bookingApi
      .getMine()
      .then((res) => setBookings((res.data || []).map(normalizeBooking)))
      .catch((err) => setListError(err.message || 'Could not load bookings'))
      .finally(() => setListLoading(false));
  }, [isAuthenticated]);

  useEffect(() => {
    if (tab === 'history' && !authLoading) loadMine();
  }, [tab, authLoading, loadMine]);

  const activeBookings = useMemo(
    () =>
      bookings.filter((item) =>
        ['pending', 'confirmed', 'active'].includes(item.status),
      ),
    [bookings],
  );
  const pastBookings = useMemo(
    () =>
      bookings.filter((item) =>
        ['completed', 'cancelled', 'rejected'].includes(item.status),
      ),
    [bookings],
  );

  const handleSubmit = async ({ car, form }) => {
    const res = await bookingApi.create({
      carId: car.id,
      fullName: form.fullName,
      email: form.email,
      phone: form.phone,
      location: form.location,
      pickupDate: form.pickupDate,
      returnDate: form.returnDate,
      delivery: form.delivery,
      notes: form.notes || undefined,
      payNow: paymentsEnabled,
    });

    const created = normalizeBooking(res.data);

    if (res.checkoutUrl) {
      window.location.href = res.checkoutUrl;
      return;
    }

    setSuccessCode(created.code);
    setPendingPay(
      paymentsEnabled
        ? res.checkoutError
          ? { booking: created, error: res.checkoutError }
          : { booking: created, error: '' }
        : null,
    );
    setTab('history');
    setSearchParams({}, { replace: true });

    if (isAuthenticated) {
      setBookings((prev) => [created, ...prev.filter((b) => b.id !== created.id)]);
    }
  };

  const startCheckout = async (booking) => {
    if (!paymentsEnabled) {
      window.alert(
        'Online payments are not configured yet. Add STRIPE_SECRET_KEY (sk_test_…) to the API .env and restart the server.',
      );
      return;
    }
    setPayingId(booking.id);
    try {
      const body = { bookingId: booking.id };
      if (!isAuthenticated) body.email = booking.email;
      const res = await paymentApi.createCheckoutSession(body);
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      window.alert('Could not start payment.');
    } catch (err) {
      window.alert(err.message || 'Could not start payment.');
    } finally {
      setPayingId(null);
    }
  };

  const handleCancel = async (id) => {
    const booking = bookings.find((item) => item.id === id);
    if (!booking) return;
    const confirmed = window.confirm(
      `Cancel request ${booking.code} for ${booking.carName}? Our Dubai concierge will be notified.`,
    );
    if (!confirmed) return;
    try {
      const res = await bookingApi.cancel(id);
      const updated = normalizeBooking(res.data);
      setBookings((prev) => prev.map((item) => (item.id === id ? updated : item)));
      if (successCode === booking.code) setSuccessCode(null);
    } catch (err) {
      window.alert(err.message || 'Could not cancel booking');
    }
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
            <span className="font-semibold text-on-surface">Bookings</span>
          </nav>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <h1 className="text-3xl font-bold tracking-tight sm:text-headline-lg">Bookings</h1>
              <p className="text-on-surface-variant">
                Request a Dubai rental in minutes — or track requests you’ve already sent to our concierge.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-sm text-on-surface-variant">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 border border-on-surface/8">
                <MaterialIcon name="location_on" className="text-base text-secondary" />
                {COMPANY.city}, UAE
              </span>
              <a
                href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1.5 border border-on-surface/8 hover:border-secondary transition-colors"
              >
                <MaterialIcon name="call" className="text-base text-secondary" />
                {COMPANY.phone}
              </a>
            </div>
          </div>

          <div className="mt-6 flex gap-2 p-1 rounded-xl bg-surface border border-on-surface/8 w-full sm:w-auto sm:inline-flex" role="tablist" aria-label="Bookings sections">
            {TABS.map((item) => {
              const active = tab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setTab(item.id)}
                  className={`flex flex-1 sm:flex-none items-center justify-center gap-2 min-h-[44px] rounded-lg px-4 text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-primary text-on-primary shadow-sm'
                      : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low'
                  }`}
                >
                  <MaterialIcon name={item.icon} className="text-lg" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <div className="container mx-auto px-margin-mobile md:px-margin-desktop py-8 sm:py-10">
        {successCode && tab === 'history' && (
          <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-secondary/25 bg-secondary-container/25 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-secondary text-on-secondary">
                <MaterialIcon name="check" />
              </div>
              <div>
                <p className="font-bold text-on-surface">Request sent</p>
                <p className="text-sm text-on-surface-variant">
                  Reference <span className="font-semibold text-on-surface">{successCode}</span>.
                  {pendingPay?.error
                    ? ` Online payment could not start (${pendingPay.error}). Use Pay now below to retry.`
                    : paymentsEnabled
                      ? ' Complete card payment to confirm your rental.'
                      : ' Our Dubai team will confirm shortly.'}
                  {!isAuthenticated && (
                    <>
                      {' '}
                      <Link to="/login" className="font-semibold text-secondary hover:underline">
                        Log in
                      </Link>{' '}
                      to track this booking later.
                    </>
                  )}
                </p>
                {pendingPay?.booking && paymentsEnabled && (
                  <button
                    type="button"
                    disabled={payingId === pendingPay.booking.id}
                    onClick={() => startCheckout(pendingPay.booking)}
                    className="mt-3 inline-flex min-h-[40px] items-center gap-1 rounded-lg bg-primary px-3 text-sm font-semibold text-on-primary disabled:opacity-60"
                  >
                    <MaterialIcon name="credit_card" className="text-base" />
                    {payingId === pendingPay.booking.id ? 'Redirecting…' : 'Pay now'}
                  </button>
                )}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                setSuccessCode(null);
                setPendingPay(null);
              }}
              className="self-start sm:self-auto text-sm font-semibold text-primary hover:underline"
            >
              Dismiss
            </button>
          </div>
        )}

        {tab === 'request' && (
          <div className="space-y-4">
            {selectedCarName && (
              <p className="text-sm text-on-surface-variant">
                Booking{' '}
                <Link
                  to={getCarPath({ slug: selectedCarSlug, id: carId })}
                  className="font-semibold text-secondary hover:underline"
                >
                  {selectedCarName}
                </Link>
                . Need a different car?{' '}
                <Link to="/cars" className="font-semibold text-secondary hover:underline">
                  Browse the fleet
                </Link>
                .
              </p>
            )}
            <BookingRequestForm
              carId={carId}
              initialDate={initialDate}
              initialReturnDate={initialReturnDate}
              onSubmit={handleSubmit}
              paymentsEnabled={paymentsEnabled}
            />
          </div>
        )}

        {tab === 'history' && (
          <div className="space-y-8">
            {authLoading || listLoading ? (
              <p className="text-on-surface-variant">Loading your bookings…</p>
            ) : !isAuthenticated ? (
              <div className="rounded-2xl border border-dashed border-on-surface/15 bg-surface-container-low px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/40">
                  <MaterialIcon name="lock" className="text-2xl text-primary" />
                </div>
                <h2 className="text-xl font-bold">Log in to view bookings</h2>
                <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
                  You can submit a rental request without an account. Sign in to see status updates and cancel
                  pending requests.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/login"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    to="/register"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-primary px-6 text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    Create account
                  </Link>
                </div>
              </div>
            ) : listError ? (
              <div className="rounded-2xl border border-error/20 bg-error-container/30 px-6 py-8 text-center">
                <p className="text-on-error-container">{listError}</p>
                <button
                  type="button"
                  onClick={loadMine}
                  className="mt-4 text-sm font-semibold text-primary hover:underline"
                >
                  Try again
                </button>
              </div>
            ) : bookings.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-on-surface/15 bg-surface-container-low px-6 py-14 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-fixed/40">
                  <MaterialIcon name="event_busy" className="text-2xl text-primary" />
                </div>
                <h2 className="text-xl font-bold">No bookings yet</h2>
                <p className="mx-auto mt-2 max-w-md text-on-surface-variant">
                  When you request a vehicle, it will show up here with status updates from our concierge.
                </p>
                <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                  <Link
                    to="/cars"
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary hover:bg-tertiary transition-colors"
                  >
                    Browse fleet
                  </Link>
                  <button
                    type="button"
                    onClick={() => setTab('request')}
                    className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-primary px-6 text-label-sm uppercase tracking-widest hover:bg-primary hover:text-on-primary transition-colors"
                  >
                    Start a request
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeBookings.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <h2 className="text-xl font-bold">Active</h2>
                      <p className="text-sm text-on-surface-variant">{activeBookings.length} open</p>
                    </div>
                    <div className="space-y-4">
                      {activeBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          onCancel={handleCancel}
                          onPay={paymentsEnabled ? startCheckout : undefined}
                          payingId={payingId}
                        />
                      ))}
                    </div>
                  </section>
                )}

                {pastBookings.length > 0 && (
                  <section>
                    <div className="mb-4 flex items-end justify-between gap-3">
                      <h2 className="text-xl font-bold">Past</h2>
                      <p className="text-sm text-on-surface-variant">{pastBookings.length} closed</p>
                    </div>
                    <div className="space-y-4">
                      {pastBookings.map((booking) => (
                        <BookingCard
                          key={booking.id}
                          booking={booking}
                          onCancel={handleCancel}
                          onPay={paymentsEnabled ? startCheckout : undefined}
                          payingId={payingId}
                        />
                      ))}
                    </div>
                  </section>
                )}
              </>
            )}

            <aside className="rounded-2xl bg-primary text-on-primary p-5 sm:p-6 relative overflow-hidden">
              <div className="absolute right-0 top-0 w-40 h-40 rounded-full bg-secondary/20 blur-3xl pointer-events-none" />
              <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-bold">Need help with a booking?</h3>
                  <p className="mt-1 text-sm text-on-primary/75 max-w-lg">
                    Our Dubai Marina concierge is available daily for changes, delivery, and document checks.
                  </p>
                </div>
                <div className="flex flex-col gap-2 sm:items-end shrink-0">
                  <a
                    href={`tel:${COMPANY.phone.replace(/\s/g, '')}`}
                    className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-secondary-fixed px-5 text-sm font-bold text-primary"
                  >
                    <MaterialIcon name="call" className="text-base" />
                    {COMPANY.phone}
                  </a>
                  <p className="text-xs text-on-primary/60">{COMPANY.hours}</p>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
