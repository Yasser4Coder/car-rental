import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import MaterialIcon from '../components/common/MaterialIcon';
import { paymentApi } from '../api';
import { useAuthContext } from '../context/AuthContext';

export default function PayCancelledPage() {
  const [params] = useSearchParams();
  const code = params.get('code') || '';
  const { isAuthenticated } = useAuthContext();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const retryPay = async (e) => {
    e.preventDefault();
    if (!code) {
      setError('Missing booking reference.');
      return;
    }
    setBusy(true);
    setError('');
    try {
      const body = { code };
      if (!isAuthenticated) {
        if (!email.trim()) {
          setError('Enter the email used on the booking.');
          setBusy(false);
          return;
        }
        body.email = email.trim();
      }
      const res = await paymentApi.createCheckoutSession(body);
      if (res.url) {
        window.location.href = res.url;
        return;
      }
      setError('Could not start checkout.');
    } catch (err) {
      setError(err.message || 'Could not start checkout.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-surface min-h-[70vh]">
      <div className="container mx-auto max-w-lg px-margin-mobile md:px-margin-desktop pt-24 pb-16 sm:pt-28">
        <div className="rounded-2xl border border-on-surface/8 bg-surface-container-lowest px-6 py-10 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary-container/40">
            <MaterialIcon name="payments" className="text-2xl text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Payment cancelled</h1>
          <p className="mt-2 text-on-surface-variant">
            No charge was made. Your booking reference
            {code ? (
              <>
                {' '}
                <span className="font-semibold text-on-surface">{code}</span>
              </>
            ) : null}{' '}
            is still unpaid — you can try again when ready.
          </p>

          {code ? (
            <form onSubmit={retryPay} className="mt-6 space-y-3 text-left">
              {!isAuthenticated && (
                <label className="block">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Booking email
                  </span>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 min-h-11 w-full rounded-xl border border-on-surface/15 bg-surface px-3 outline-none focus:border-secondary"
                    placeholder="Email used on the request"
                  />
                </label>
              )}
              {error && <p className="text-sm text-error">{error}</p>}
              <button
                type="submit"
                disabled={busy}
                className="inline-flex min-h-[48px] w-full items-center justify-center rounded-xl bg-primary px-6 text-label-sm uppercase tracking-widest text-on-primary disabled:opacity-60"
              >
                {busy ? 'Redirecting…' : 'Retry payment'}
              </button>
            </form>
          ) : null}

          <Link
            to="/bookings"
            className="mt-4 inline-flex min-h-[44px] items-center justify-center text-sm font-semibold text-secondary hover:underline"
          >
            Back to bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
