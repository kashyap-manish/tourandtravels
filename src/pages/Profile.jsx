import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile, getMyBookings } from '../services/api';
import { updateUser } from '../store/authSlice';

const QUICK_LINKS = [
  { to: '/bookings', icon: 'fa-calendar-check-o', label: 'My Bookings', color: '#f97316', bg: 'rgba(249,115,22,0.1)' },
  { to: '/destination', icon: 'fa-map-marker', label: 'Explore Tours', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
  { to: '/contact', icon: 'fa-headphones', label: 'Support', color: '#10b981', bg: 'rgba(16,185,129,0.1)' },
  { to: '/blog', icon: 'fa-newspaper-o', label: 'Travel Blog', color: '#a855f7', bg: 'rgba(168,85,247,0.1)' },
];

function Alert({ m }) {
  if (!m) return null;
  const isSuccess = m.type === 'success';
  return (
    <div className={`flex items-center gap-3 rounded-2xl px-4 py-3 mb-5 text-sm font-medium ${isSuccess ? 'bg-emerald-50 border border-emerald-200 text-emerald-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${isSuccess ? 'bg-emerald-500' : 'bg-red-500'}`}>
        <i className={`fa ${isSuccess ? 'fa-check' : 'fa-times'} text-white text-xs`} />
      </div>
      {m.text}
    </div>
  );
}

function StatCard({ icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <i className={`fa ${icon} text-lg`} style={{ color }} />
      </div>
      <div>
        <p className="text-xl font-extrabold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);
  const [bookingCount, setBookingCount] = useState('—');
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    getProfile().then(res => {
      const { name, phone, avatar } = res.data;
      setForm({ name: name || '', phone: phone || '', avatar: avatar || '' });
      setPreview(avatar || null);
    });
    getMyBookings().then(res => setBookingCount(res.data.length)).catch(() => {});
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return flash(setMsg, { type: 'error', text: 'Image must be under 2MB.' });
    const reader = new FileReader();
    reader.onload = (ev) => { setPreview(ev.target.result); setForm(f => ({ ...f, avatar: ev.target.result })); };
    reader.readAsDataURL(file);
  };

  const flash = (setter, m) => { setter(m); setTimeout(() => setter(null), 4000); };

  const handleProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await updateProfile({ name: form.name, phone: form.phone, avatar: form.avatar });
      const updated = { ...user, ...res.data };
      localStorage.setItem('user', JSON.stringify(updated));
      dispatch(updateUser(updated));
      flash(setMsg, { type: 'success', text: 'Profile updated successfully.' });
    } catch {
      flash(setMsg, { type: 'error', text: 'Failed to update profile.' });
    } finally { setLoading(false); }
  };

  const handlePassword = async (e) => {
    e.preventDefault();
    if (pwForm.password !== pwForm.confirm) return flash(setPwMsg, { type: 'error', text: 'Passwords do not match.' });
    if (pwForm.password.length < 6) return flash(setPwMsg, { type: 'error', text: 'Password must be at least 6 characters.' });
    setPwLoading(true);
    try {
      await updateProfile({ password: pwForm.password });
      setPwForm({ password: '', confirm: '' });
      flash(setPwMsg, { type: 'success', text: 'Password changed successfully.' });
    } catch {
      flash(setPwMsg, { type: 'error', text: 'Failed to change password.' });
    } finally { setPwLoading(false); }
  };

  const initials = user?.name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || 'U';
  const memberSince = user?.createdAt ? new Date(user.createdAt).getFullYear() : new Date().getFullYear();

  return (
    <>
      {/* Hero Banner */}
      <section
        className="relative bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_1.jpg')", minHeight: '32vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-orange-900/40" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 pt-10 pb-20">
          <p className="text-sm flex items-center gap-2 text-gray-400 mb-2">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">My Profile</span>
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">Account Settings</h1>
          <p className="text-gray-400 text-sm mt-1">Manage your profile, security and preferences</p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 -mt-12 pb-16 relative z-10">

        {/* Profile Card — pulls up over hero */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 md:p-8 mb-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">

            {/* Avatar */}
            <div className="relative shrink-0">
              <div
                className="w-24 h-24 md:w-28 md:h-28 rounded-3xl overflow-hidden cursor-pointer group ring-4 ring-orange-100 shadow-xl"
                onClick={() => fileRef.current.click()}
              >
                {preview
                  ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                  : (
                    <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-3xl font-extrabold">
                      {initials}
                    </div>
                  )
                }
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl">
                  <i className="fa fa-camera text-white text-xl" />
                </div>
              </div>
              <button
                onClick={() => fileRef.current.click()}
                className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transition-colors"
              >
                <i className="fa fa-pencil text-white text-xs" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>

            {/* Info */}
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                <h2 className="text-2xl font-extrabold text-gray-900">{user?.name || 'Traveler'}</h2>
                <span className="inline-flex items-center gap-1 bg-orange-50 text-orange-600 text-xs font-bold px-3 py-1 rounded-full border border-orange-100">
                  <i className="fa fa-check-circle text-orange-500" /> Verified Member
                </span>
              </div>
              <p className="text-gray-400 text-sm mb-3">{user?.email}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><i className="fa fa-calendar text-orange-400" /> Member since {memberSince}</span>
                {form.phone && <span className="flex items-center gap-1.5"><i className="fa fa-phone text-orange-400" /> {form.phone}</span>}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3 shrink-0 w-full sm:w-auto">
              <StatCard icon="fa-calendar-check-o" label="Bookings" value={bookingCount} color="#f97316" bg="rgba(249,115,22,0.1)" />
              <StatCard icon="fa-map-marker" label="Destinations" value="12+" color="#3b82f6" bg="rgba(59,130,246,0.1)" />
            </div>
          </div>
        </div>

        {/* Tabs + Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left: Tabs nav */}
          <div className="lg:col-span-1 flex flex-col gap-3">
            {/* Tab switcher */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-3 flex flex-col gap-1">
              {[
                { id: 'profile', icon: 'fa-user', label: 'Personal Info' },
                { id: 'security', icon: 'fa-lock', label: 'Security' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-200 text-left ${activeTab === t.id ? 'bg-orange-500 text-white shadow-md shadow-orange-500/30' : 'text-gray-500 hover:bg-gray-50'}`}
                >
                  <i className={`fa ${t.icon} w-4 text-center`} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Quick Links */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Quick Links</p>
              <div className="space-y-2">
                {QUICK_LINKS.map(l => (
                  <Link
                    key={l.to} to={l.to}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110" style={{ background: l.bg }}>
                      <i className={`fa ${l.icon} text-sm`} style={{ color: l.color }} />
                    </div>
                    <span className="text-sm font-semibold text-gray-600 group-hover:text-gray-900 transition-colors">{l.label}</span>
                    <i className="fa fa-chevron-right text-xs text-gray-300 ml-auto group-hover:text-orange-400 transition-colors" />
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Tab content */}
          <div className="lg:col-span-2">

            {/* Personal Info Tab */}
            {activeTab === 'profile' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 md:p-9">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">Personal Information</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Update your name, phone and profile photo</p>
                  </div>
                  <div className="w-11 h-11 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <i className="fa fa-user text-orange-500" />
                  </div>
                </div>

                <Alert m={msg} />

                <form onSubmit={handleProfile} className="space-y-5">
                  <div>
                    <label htmlFor="p-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name</label>
                    <div className="relative">
                      <i className="fa fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="p-name" required type="text" value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="p-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
                    <div className="relative">
                      <i className="fa fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="p-email" type="email" value={user?.email || ''} disabled
                        className="w-full border border-gray-100 bg-gray-50 rounded-2xl pl-10 pr-4 py-3 text-sm text-gray-400 cursor-not-allowed"
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1.5 ml-1">Email cannot be changed</p>
                  </div>

                  <div>
                    <label htmlFor="p-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                    <div className="relative">
                      <i className="fa fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="p-phone" type="tel" value={form.phone} placeholder="+1 234 567 8900"
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit" disabled={loading}
                      className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      {loading ? <><i className="fa fa-spinner fa-spin" /> Saving...</> : <><i className="fa fa-save" /> Save Changes</>}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-7 md:p-9">
                <div className="flex items-center justify-between mb-7">
                  <div>
                    <h3 className="text-xl font-extrabold text-gray-900">Change Password</h3>
                    <p className="text-sm text-gray-400 mt-0.5">Keep your account secure with a strong password</p>
                  </div>
                  <div className="w-11 h-11 bg-gray-950 rounded-2xl flex items-center justify-center">
                    <i className="fa fa-shield text-orange-400" />
                  </div>
                </div>

                {/* Security tips */}
                <div className="bg-gray-50 rounded-2xl p-4 mb-6 flex gap-3">
                  <i className="fa fa-info-circle text-orange-400 mt-0.5 shrink-0" />
                  <div className="text-xs text-gray-500 space-y-1">
                    <p className="font-semibold text-gray-700">Password requirements:</p>
                    <p>• Minimum 6 characters</p>
                    <p>• Mix of letters, numbers & symbols recommended</p>
                  </div>
                </div>

                <Alert m={pwMsg} />

                <form onSubmit={handlePassword} className="space-y-5">
                  <div>
                    <label htmlFor="p-pw" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">New Password</label>
                    <div className="relative">
                      <i className="fa fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="p-pw" type={showPw ? 'text' : 'password'} required
                        value={pwForm.password} placeholder="Min. 6 characters"
                        onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                        className="w-full border border-gray-200 rounded-2xl pl-10 pr-12 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                      <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <i className={`fa ${showPw ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="p-confirm" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Confirm Password</label>
                    <div className="relative">
                      <i className="fa fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="p-confirm" type={showConfirm ? 'text' : 'password'} required
                        value={pwForm.confirm} placeholder="Repeat new password"
                        onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                        className={`w-full border rounded-2xl pl-10 pr-12 py-3 text-sm outline-none focus:ring-2 transition-all ${
                          pwForm.confirm && pwForm.password !== pwForm.confirm
                            ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                            : 'border-gray-200 focus:border-orange-400 focus:ring-orange-100'
                        }`}
                      />
                      <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                        <i className={`fa ${showConfirm ? 'fa-eye-slash' : 'fa-eye'} text-sm`} />
                      </button>
                    </div>
                    {pwForm.confirm && pwForm.password !== pwForm.confirm && (
                      <p className="text-xs text-red-500 mt-1.5 ml-1">Passwords do not match</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit" disabled={pwLoading}
                      className="w-full bg-gray-950 hover:bg-gray-800 disabled:opacity-60 text-white font-bold py-3.5 rounded-2xl transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2"
                    >
                      {pwLoading ? <><i className="fa fa-spinner fa-spin" /> Updating...</> : <><i className="fa fa-shield" /> Update Password</>}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

