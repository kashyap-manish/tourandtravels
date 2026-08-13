import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, clearError } from '../store/authSlice';
import { verifyEmail, resendOtp } from '../services/api';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector(s => s.auth);

  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [localError, setLocalError] = useState('');
  const [step, setStep] = useState(1); // 1=register, 2=verify
  const [pendingEmail, setPendingEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [verifyError, setVerifyError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (token) navigate('/');
    return () => dispatch(clearError());
  }, [token]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirm) return setLocalError('Passwords do not match.');
    setLocalError('');
    dispatch(register({ name: form.name, email: form.email, password: form.password }))
      .unwrap()
      .then(() => { setPendingEmail(form.email); setStep(2); setResendCooldown(60); })
      .catch(() => {});
  };

  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputRefs.current[i - 1]?.focus();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return setVerifyError('Enter the 6-digit OTP.');
    setVerifying(true);
    setVerifyError('');
    try {
      await verifyEmail({ email: pendingEmail, otp: code });
      navigate('/login', { state: { verified: true } });
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Verification failed.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setVerifyError('');
    try {
      await resendOtp({ email: pendingEmail });
      setResendCooldown(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      setVerifyError(err.response?.data?.message || 'Failed to resend OTP.');
    } finally {
      setResending(false);
    }
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
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900">Create Account</h1>
              <p className="text-gray-400 text-sm mt-1">Join us and start exploring</p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-extrabold text-gray-900">Verify Your Email</h1>
              <p className="text-gray-400 text-sm mt-1">We sent a 6-digit OTP to</p>
              <p className="text-orange-500 font-semibold text-sm">{pendingEmail}</p>
            </>
          )}
        </div>

        {/* Step 1: Register */}
        {step === 1 && (
          <>
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
          </>
        )}

        {/* Step 2: OTP Verify */}
        {step === 2 && (
          <>
            {verifyError && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
                <i className="fa fa-exclamation-circle" /> {verifyError}
              </div>
            )}
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={el => inputRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1}
                    value={digit}
                    onChange={e => handleOtpChange(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    className="w-11 h-12 text-center text-xl font-bold border-2 rounded-xl outline-none transition-colors focus:border-orange-400 border-gray-200"
                  />
                ))}
              </div>

              <button
                type="submit" disabled={verifying}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {verifying ? <><i className="fa fa-spinner fa-spin" /> Verifying...</> : 'Verify Email'}
              </button>
            </form>

            <div className="text-center mt-5">
              {resendCooldown > 0 ? (
                <p className="text-sm text-gray-400">Resend OTP in <span className="font-semibold text-gray-600">{resendCooldown}s</span></p>
              ) : (
                <button onClick={handleResend} disabled={resending}
                  className="text-sm text-orange-500 font-semibold hover:underline disabled:opacity-60">
                  {resending ? 'Resending...' : 'Resend OTP'}
                </button>
              )}
            </div>

            <button onClick={() => setStep(1)} className="mt-3 w-full text-center text-xs text-gray-400 hover:text-gray-600">
              ← Back to registration
            </button>
          </>
        )}
      </div>
    </section>
  );
}

