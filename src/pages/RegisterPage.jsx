import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const update = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await register(form);
      navigate('/bookings');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-md px-margin-mobile pt-28 pb-16">
      <h1 className="text-3xl font-bold">Create account</h1>
      <p className="mt-2 text-on-surface-variant">Book faster and track your rentals in Dubai.</p>

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        {[
          ['fullName', 'FULL NAME', 'text'],
          ['email', 'EMAIL', 'email'],
          ['phone', 'PHONE', 'tel'],
          ['password', 'PASSWORD', 'password'],
        ].map(([key, label, type]) => (
          <label key={key} className="block text-label-sm text-on-surface-variant">
            {label}
            <input
              type={type}
              required={key !== 'phone'}
              value={form[key]}
              onChange={update(key)}
              minLength={key === 'password' ? 8 : undefined}
              className="mt-1.5 w-full min-h-[48px] rounded-xl border border-on-surface/15 bg-surface-container-low px-3 outline-none focus:border-secondary"
            />
          </label>
        ))}
        {error && <p className="text-sm text-error">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full min-h-[48px] rounded-xl bg-primary text-on-primary text-label-sm uppercase tracking-widest disabled:opacity-60"
        >
          {loading ? 'Creating…' : 'Create account'}
        </button>
      </form>

      <p className="mt-6 text-sm text-on-surface-variant">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-secondary hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
