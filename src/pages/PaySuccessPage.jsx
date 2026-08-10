import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MaterialIcon from '../components/common/MaterialIcon';
import { paymentApi } from '../api';
import { formatPrice } from '../data/cars';

export default function PaySuccessPage() {
  const [params] = useSearchParams();
  const sessionId = params.get('session_id') || '';
  const [state, setState] = useState({ loading: true, error: '', data: null });

  useEffect(() => {
    if (!sessionId) {
      setState({ loading: false, error: 'Missing payment session.', data: null });
      return;
    }

    let attempts = 0;
    let cancelled = false;
    let timer;

    const poll = async () => {
      attempts += 1;
      try {
        const data = await paymentApi.checkoutStatus(sessionId);
        if (cancelled) return;
        const paid =
          data.stripePaymentStatus === 'paid' ||
          data.paymentStatus === 'paid' ||
          data.bookingStatus === 'confirmed';
        setState({ loading: !paid && attempts < 8, error: '', data });
        if (!paid && attempts < 8) {
          timer = setTimeout(poll, 1500);
        } else if (!paid) {
          setState({
            loading: false,
            error: '',
            data,
          });
        }
      } catch (err) {
        if (cancelled) return;
        setState({
          loading: false,
          error: err.message || 'Could not verify payment.',
          data: null,
        });
      }
    };

    poll();
    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [sessionId]);

  const paid =
    state.data &&
    (state.data.stripePaymentStatus === 'paid' ||
      state.data.paymentStatus === 'paid' ||
      state.data.bookingStatus === 'confirmed');

  return (
    <div className="bg-surface min-h-[70vh]">
      <div className="container mx-auto max-w-lg px-margin-mobile md:px-margin-desktop pt-24 pb-16 sm:pt-28">
        <div className="rounded-2xl border border-on-surface/8 bg-surface-container-lowest px-6 py-10 text-center shadow-sm">
          {state.loading ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container/40">
                <MaterialIcon name="hourglass_top" className="text-2xl text-primary" />
              </div>
              <h1 className="text-2xl font-bold">Confirming payment…</h1>
              <p className="mt-2 text-on-surface-variant">
                Please wait while we verify your Stripe payment with our servers.
              </p>
            </>
          ) : state.error ? (
            <>
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-error-container/50">
                <MaterialIcon name="error" className="text-2xl text-error" />
              </div>
              <h1 className="text-2xl font-bold">Payment check failed</h1>
              <p className="mt-2 text-on-surface-variant">{state.error}</p>
              <Link
                to="/bookings"
                className="mt-6 inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary"
              >
                Back to bookings
              </Link>
            </>
          ) : (
            <>
              <div
                className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full ${
                  paid ? 'bg-secondary text-on-secondary' : 'bg-secondary-container/40 text-primary'
                }`}
              >
                <MaterialIcon name={paid ? 'verified' : 'schedule'} className="text-2xl" />
              </div>
              <h1 className="text-2xl font-bold">
                {paid ? 'Payment successful' : 'Payment received — confirming'}
              </h1>
              <p className="mt-2 text-on-surface-variant">
                {paid
                  ? 'Your rental is confirmed. Keep your booking reference for pickup.'
                  : 'Stripe reported the charge. Confirmation may take a few seconds — check My bookings shortly.'}
              </p>

              {state.data?.booking && (
                <dl className="mt-6 grid gap-3 rounded-xl bg-surface-container-low px-4 py-4 text-left text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-on-surface-variant">Reference</dt>
                    <dd className="font-bold">{state.data.booking.code}</dd>
                  </div>
                  {state.data.booking.carName && (
                    <div className="flex justify-between gap-3">
                      <dt className="text-on-surface-variant">Vehicle</dt>
                      <dd className="font-semibold text-right">{state.data.booking.carName}</dd>
                    </div>
                  )}
                  <div className="flex justify-between gap-3">
                    <dt className="text-on-surface-variant">Dates</dt>
                    <dd className="font-semibold">
                      {state.data.booking.pickupDate} → {state.data.booking.returnDate}
                    </dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-on-surface-variant">Total paid</dt>
                    <dd className="font-bold text-secondary">
                      {formatPrice(state.data.booking.total)}
                    </dd>
                  </div>
                </dl>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
                <Link
                  to="/bookings"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary"
                >
                  My bookings
                </Link>
                <Link
                  to="/cars"
                  className="inline-flex min-h-[48px] items-center justify-center rounded-xl border border-primary px-6 text-label-sm uppercase tracking-widest"
                >
                  Browse fleet
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
