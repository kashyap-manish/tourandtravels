import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (token) navigate('/');
    return () => dispatch(clearError());
  }, [token]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setLocalError('Passwords do not match.');
    setLocalError('');
    dispatch(register({ name: form.name, email: form.email, password: form.password }))
      .unwrap()
      .then(() => navigate('/login'))
      .catch(() => {});
  };

  const err = localError || error;

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-16 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/55" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col leading-none mb-4">
            <span className="text-gray-900 text-2xl font-extrabold tracking-tight">Pacific</span>
            <span className="text-orange-500 text-[0.55rem] font-semibold tracking-[4px] uppercase">Travel Agency</span>
          </Link>
          <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
          <p className="text-gray-400 text-sm mt-1">Join us and start exploring</p>
        </div>

        {err && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
            <i className="fa fa-exclamation-circle" /> {err}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'John Doe' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'john@example.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: '••••••••' },
            { label: 'Confirm Password', key: 'confirm', type: 'password', placeholder: '••••••••' },
          ].map(({ label, key, type, placeholder }) => (
            <div key={key}>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{label}</label>
              <input
                type={type} required placeholder={placeholder}
                value={form[key]}
                onChange={e => setForm({ ...form, [key]: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
          ))}
          <button
            type="submit" disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><i className="fa fa-spinner fa-spin" /> Creating account...</> : 'Create Account'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">Sign In</Link>
        </p>
      </div>
    </section>
  );
}
