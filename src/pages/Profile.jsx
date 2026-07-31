import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProfile, updateProfile } from '../services/api';
import { updateUser } from '../store/authSlice';

export default function Profile() {
  const { user } = useSelector(s => s.auth);
  const dispatch = useDispatch();

  const [form, setForm] = useState({ name: '', phone: '', avatar: '' });
  const [preview, setPreview] = useState(null);
  const fileRef = useRef();
  const [pwForm, setPwForm] = useState({ password: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [msg, setMsg] = useState(null);
  const [pwMsg, setPwMsg] = useState(null);

  useEffect(() => {
    getProfile().then(res => {
      const { name, phone, avatar } = res.data;
      setForm({ name: name || '', phone: phone || '', avatar: avatar || '' });
      setPreview(avatar || null);
    });
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) return flash(setMsg, { type: 'error', text: 'Image must be under 2MB.' });
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreview(ev.target.result);
      setForm(f => ({ ...f, avatar: ev.target.result }));
    };
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
    } finally {
      setLoading(false);
    }
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
    } finally {
      setPwLoading(false);
    }
  };

  const Alert = ({ m }) => m ? (
    <div className={`flex items-center gap-2 rounded-xl px-4 py-3 mb-5 text-sm font-medium ${m.type === 'success' ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'}`}>
      <i className={`fa ${m.type === 'success' ? 'fa-check-circle text-green-500' : 'fa-exclamation-circle text-red-500'}`} />
      {m.text}
    </div>
  ) : null;

  return (
    <>
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_1.jpg')", minHeight: '40vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-14 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span>My Profile</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Profile</h1>
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Profile Info */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          {/* Avatar upload */}
          <div className="flex flex-col items-center mb-7">
            <div
              className="relative w-24 h-24 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-3xl font-bold overflow-hidden cursor-pointer group border-4 border-white shadow-md"
              onClick={() => fileRef.current.click()}
            >
              {preview
                ? <img src={preview} alt="avatar" className="w-full h-full object-cover" />
                : <span>{user?.name?.[0]?.toUpperCase() || 'U'}</span>}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                <i className="fa fa-camera text-white text-lg" />
              </div>
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            <button
              type="button"
              onClick={() => fileRef.current.click()}
              className="mt-3 text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Upload Photo
            </button>
            <p className="text-xs text-gray-400 mt-0.5">JPG, PNG or GIF · Max 2MB</p>
            <div className="mt-2 text-center">
              <p className="font-bold text-gray-900">{user?.name}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
            </div>
          </div>

          <h2 className="text-base font-bold text-gray-800 mb-4">Personal Information</h2>
          <Alert m={msg} />

          <form onSubmit={handleProfile} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full Name</label>
              <input
                type="text" required value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Phone Number</label>
              <input
                type="text" value={form.phone} placeholder="+1 234 567 8900"
                onChange={e => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {loading ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-save" />}
              Save Changes
            </button>
          </form>
        </div>

        {/* Change Password */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
          <h2 className="text-base font-bold text-gray-800 mb-4">Change Password</h2>
          <Alert m={pwMsg} />

          <form onSubmit={handlePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">New Password</label>
              <input
                type="password" required value={pwForm.password} placeholder="Min. 6 characters"
                onChange={e => setPwForm({ ...pwForm, password: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Confirm Password</label>
              <input
                type="password" required value={pwForm.confirm} placeholder="Repeat new password"
                onChange={e => setPwForm({ ...pwForm, confirm: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
              />
            </div>
            <button
              type="submit" disabled={pwLoading}
              className="w-full bg-gray-800 hover:bg-gray-900 disabled:opacity-60 text-white font-semibold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              {pwLoading ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-lock" />}
              Update Password
            </button>
          </form>

          {/* Quick links */}
          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Quick Links</p>
            <Link to="/bookings" className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <i className="fa fa-calendar-check-o text-orange-500" />
              </span>
              My Bookings
            </Link>
            <Link to="/destination" className="flex items-center gap-3 text-sm text-gray-700 hover:text-orange-500 transition-colors">
              <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <i className="fa fa-map-marker text-blue-500" />
              </span>
              Explore Tours
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
