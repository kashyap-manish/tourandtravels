import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/destination', label: 'Destination' },
  { to: '/hotel', label: 'Hotel' },
  { to: '/blog', label: 'Blog' },
  { to: '/flight', label: 'Flight' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-gray-950/95 backdrop-blur-md shadow-lg shadow-black/20' : 'bg-gray-950'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-18">

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
          <Link
            to="/login"
            className="hidden md:inline-flex items-center gap-2 border border-white/20 hover:border-orange-500 text-gray-300 hover:text-orange-400 text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            <i className="fa fa-user text-xs" />
            Login
          </Link>
          <Link
            to="/contact"
            className="hidden md:inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors duration-200"
          >
            <i className="fa fa-paper-plane text-xs" />
            Book Now
          </Link>
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
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? 'max-h-96 border-t border-white/10' : 'max-h-0'}`}>
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
            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 border border-white/20 hover:border-orange-500 text-gray-300 hover:text-orange-400 text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
            >
              <i className="fa fa-user text-xs" />
              Login
            </Link>
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
