import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, clearError } from '../store/authSlice';

export default function OtpVerify() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error, token } = useSelector(s => s.auth);

  const identifier = location.state?.identifier || '';
  const from = location.state?.from || '/';

  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendMsg, setResendMsg] = useState('');
  const inputs = useRef([]);

  useEffect(() => {
    if (!identifier) navigate('/login', { replace: true });
    return () => dispatch(clearError());
  }, []);

  useEffect(() => {
    if (token) navigate(from, { replace: true });
  }, [token]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) inputs.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) inputs.current[i - 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setOtp(pasted.split(''));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const code = otp.join('');
    if (code.length < 6) return;
    dispatch(verifyOtp({ identifier, otp: code }));
  };

  const handleResend = async () => {
    setResendMsg('');
    try {
      const { resendLoginOtp } = await import('../services/api');
      await resendLoginOtp({ identifier });
      setResendMsg('OTP resent successfully!');
      setResendTimer(30);
    } catch (err) {
      setResendMsg(err.response?.data?.message || 'Failed to resend OTP');
    }
  };

  return (
    <section
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-16 relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&auto=format&fit=crop')" }}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex flex-col leading-none mb-4">
            <span className="text-gray-900 text-2xl font-extrabold tracking-tight">Pacific</span>
            <span className="text-orange-500 text-[0.55rem] font-semibold tracking-[4px] uppercase">Travel Agency</span>
          </Link>
          <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-3">
            <i className="fa fa-envelope-open-o text-orange-500 text-2xl" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">Verify OTP</h1>
          <p className="text-gray-400 text-sm mt-1">
            Enter the 6-digit code sent to<br />
            <span className="text-gray-700 font-medium">{identifier}</span>
          </p>
        </div>

        {error && (
          <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 mb-5 text-sm">
            <i className="fa fa-exclamation-circle" /> {error}
          </div>
        )}
        {resendMsg && (
          <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-5 text-sm">
            <i className="fa fa-check-circle" /> {resendMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={el => inputs.current[i] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={e => handleChange(i, e.target.value)}
                onKeyDown={e => handleKeyDown(i, e)}
                className="w-11 h-12 text-center text-xl font-bold border-2 border-gray-200 rounded-xl outline-none focus:border-orange-400 transition-colors"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join('').length < 6}
            className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            {loading ? <><i className="fa fa-spinner fa-spin" /> Verifying...</> : 'Verify & Sign In'}
          </button>
        </form>

        <div className="text-center mt-5 text-sm text-gray-400">
          Didn't receive the code?{' '}
          {resendTimer > 0 ? (
            <span className="text-gray-400">Resend in {resendTimer}s</span>
          ) : (
            <button onClick={handleResend} className="text-orange-500 font-semibold hover:underline">
              Resend OTP
            </button>
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-3">
          <Link to="/login" className="text-orange-500 font-semibold hover:underline">← Back to Login</Link>
        </p>
      </div>
    </section>
  );
}
