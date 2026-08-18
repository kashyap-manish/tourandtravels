import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/destination', label: 'Destination' },
  { to: '/hotel', label: 'Hotel' },
  { to: '/blog', label: 'Blog' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/flight', label: 'Flight' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token } = useSelector(s => s.auth);
  const wishlistCount = useSelector(s => s.wishlist.ids.length);
  const dropRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = () => { dispatch(logout()); navigate('/login'); setDropOpen(false); };

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gray-950'}`}>
      <div className="container-grid flex items-center justify-between h-18">

        {/* Logo */}
        <Link to="/" className="flex flex-col leading-none group">
          <span className="text-white text-xl font-extrabold tracking-tight group-hover:text-orange-400 transition-colors">
            Pacific
          </span>
          <span className="text-orange-500 text-[0.55rem] font-semibold tracking-[4px] uppercase">
            Travel Agency
          </span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded
                  ${pathname === to
                    ? 'text-orange-400'
                    : 'text-gray-400 hover:text-white'
                  }`}
              >
                {label}
                {pathname === to && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-orange-500 rounded-full" />
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA + Hamburger */}
        <div className="flex items-center gap-3">
          {/* Wishlist icon */}
          {token && (
            <Link to="/wishlist" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors">
              <i className="fa fa-heart-o text-gray-300 hover:text-red-400 transition-colors text-base" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>
          )}
          {token ? (
            <div className="relative hidden md:block" ref={dropRef}>
              <button onClick={() => setDropOpen(o => !o)}
                className="flex items-center gap-2 border border-white/20 hover:border-orange-500 text-gray-300 hover:text-orange-400 text-sm font-semibold px-4 py-2 rounded-full transition-colors duration-200">
                <i className="fa fa-user-circle text-sm" />
                {user?.name?.split(' ')[0] || 'Account'}
                <i className={`fa fa-chevron-down text-xs transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
              </button>
              {dropOpen && (
                <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                  <Link to="/profile" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <i className="fa fa-user text-xs" /> My Profile
                  </Link>
                  <Link to="/bookings" onClick={() => setDropOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                    <i className="fa fa-calendar text-xs" /> My Bookings
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin/bookings" onClick={() => setDropOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500 transition-colors">
                      <i className="fa fa-cog text-xs" /> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100" />
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    <i className="fa fa-sign-out text-xs" /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"
              className="hidden md:inline-flex items-center gap-2 border border-white/20 hover:border-orange-500 text-gray-300 hover:text-orange-400 text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200">
              <i className="fa fa-user text-xs" /> Login
            </Link>
          )}
          {/* <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            <i className="fa fa-paper-plane text-xs" />
            Book Now
          </Link> */} 
          <button
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-0.5 bg-white transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-[600px] border-t border-white/10' : 'max-h-0'}`}>
        <ul className="px-6 py-4 flex flex-col gap-1 bg-gray-950">
          {links.map(({ to, label }) => (
            <li key={to}>
              <Link
                to={to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                  ${pathname === to
                    ? 'text-orange-400 bg-orange-500/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {pathname === to && <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
                {label}
              </Link>
            </li>
          ))}
          <li className="pt-2 flex flex-col gap-2">
            {token ? (
              <>
                <Link to="/profile" onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 border border-white/20 text-gray-300 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors hover:border-orange-500 hover:text-orange-400">
                  <i className="fa fa-user text-xs" /> {user?.name?.split(' ')[0] || 'Profile'}
                </Link>
                <button onClick={() => { handleLogout(); setOpen(false); }}
                  className="flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                  <i className="fa fa-sign-out text-xs" /> Logout
                </button>
              </>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-2 border border-white/20 hover:border-orange-500 text-gray-300 hover:text-orange-400 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors">
                <i className="fa fa-user text-xs" /> Login
              </Link>
            )}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <i className="fa fa-paper-plane text-xs" />
              Book Now
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
