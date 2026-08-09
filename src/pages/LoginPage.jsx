import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function LoginPage() {
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await login({ email, password });
      navigate('/bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-margin-mobile pt-28 pb-16">
      <h1 className="text-3xl font-bold">Login</h1>
      <p className="mt-2 text-on-surface-variant">Access your Dubai bookings and profile.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-label-sm text-on-surface-variant">
          EMAIL
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full min-h-[48px] rounded-xl border border-on-surface/15 bg-surface-container-low px-3 outline-none focus:border-secondary"
          />
        </label>
        <label className="block text-label-sm text-on-surface-variant">
          PASSWORD
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full min-h-[48px] rounded-xl border border-on-surface/15 bg-surface-container-low px-3 outline-none focus:border-secondary"
          />
        </label>
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary text-label-sm uppercase tracking-widest disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <p className="mt-6 text-sm text-on-surface-variant">
        New here?{' '}
        <Link to="/register" className="font-semibold text-secondary hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  );
}
