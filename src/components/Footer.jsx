import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../services/api';

const information = [
  { label: 'Online Enquiry', to: '/online-enquiry', icon: 'fa-paper-plane', desc: 'Send us a message online' },
  { label: 'General Enquiries', to: '/general-enquiries', icon: 'fa-question-circle', desc: 'Got a question? Ask away' },
  { label: 'Booking Conditions', to: '/booking-conditions', icon: 'fa-file-text-o', desc: 'Terms for your booking' },
  { label: 'Privacy and Policy', to: '/privacy-policy', icon: 'fa-shield', desc: 'How we protect your data' },
  { label: 'Refund Policy', to: '/refund-policy', icon: 'fa-rotate-left', desc: 'Cancellation & refunds' },
  { label: 'Call Us', to: '/call-us', icon: 'fa-phone', desc: 'Speak to our team' },
];
const experiences = [
  { label: 'Adventure', to: '/experience/adventure', icon: 'fa-bolt', desc: 'Thrilling outdoor activities' },
  { label: 'Hotel and Restaurant', to: '/experience/hotel-restaurant', icon: 'fa-cutlery', desc: 'Stay & dine in style' },
  { label: 'Beach', to: '/experience/beach', icon: 'fa-umbrella', desc: 'Sun, sand & sea escapes' },
  { label: 'Nature', to: '/experience/nature', icon: 'fa-leaf', desc: 'Explore the great outdoors' },
  { label: 'Camping', to: '/experience/camping', icon: 'fa-fire', desc: 'Sleep under the stars' },
  { label: 'Party', to: '/experience/party', icon: 'fa-music', desc: 'Celebrate & have fun' },
];

const socials = [
  {
    label: 'Facebook',
    href: '#',
    bg: '#1877F2',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
      </svg>
    ),
  },
  {
    label: 'Twitter / X',
    href: '#',
    bg: '#000000',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    ),
  },
  {
    label: 'Instagram',
    href: '#',
    bg: '#E1306C',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    ),
  },
  {
    label: 'YouTube',
    href: '#',
    bg: '#FF0000',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
        <path d="M23 7s-.3-2-1.2-2.8c-1.1-1.2-2.4-1.2-3-1.3C16.6 2.8 12 2.8 12 2.8s-4.6 0-6.8.1c-.6.1-1.9.1-3 1.3C1.3 5 1 7 1 7S.7 9.3.7 11.5v2.1C.7 15.8 1 18 1 18s.3 2 1.2 2.8c1.1 1.2 2.6 1.1 3.3 1.2C7.6 22.2 12 22.2 12 22.2s4.6 0 6.8-.2c.6-.1 1.9-.1 3-1.3.9-.8 1.2-2.8 1.2-2.8s.3-2.2.3-4.4v-2.1C23.3 9.3 23 7 23 7zM9.7 15.5V8.4l8.1 3.6-8.1 3.5z" />
      </svg>
    ),
  },
];

function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus('loading');
    try {
      await subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
    }
  }

  return (
    <form className="flex w-full md:w-auto gap-0 max-w-md flex-col sm:flex-row" onSubmit={handleSubmit}>
      <input
        type="email"
        required
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className="flex-1 bg-white/10 border border-white/10 sm:rounded-l-full rounded-t-full sm:rounded-tr-none px-5 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white text-sm font-semibold px-6 py-3 sm:rounded-r-full rounded-b-full sm:rounded-bl-none transition-colors whitespace-nowrap"
      >
        {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
      </button>
      {status === 'success' && <p className="w-full text-green-400 text-xs mt-2 sm:mt-1 sm:ml-3 self-center">✓ Subscribed successfully!</p>}
      {status === 'error' && <p className="w-full text-red-400 text-xs mt-2 sm:mt-1 sm:ml-3 self-center">Something went wrong, try again.</p>}
    </form>
  );
}

function SocialIcon({ label, href, bg, icon }) {
  return (
    <a
      href={href}
      aria-label={label}
      className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-200"
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = bg;
        e.currentTarget.style.borderColor = bg;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = '';
        e.currentTarget.style.borderColor = '';
      }}
    >
      {icon}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-white">

      {/* Newsletter Banner */}
      <div className="border-b border-white/10">
        <div className="container-grid py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-1">Stay Updated</p>
            <h3 className="text-xl font-bold text-white">Subscribe to our newsletter</h3>
          </div>
<NewsletterForm />
        </div>
      </div>

      {/* Main Grid */}
      <div className="container-grid py-16 row">

        {/* Brand */}
        <div className="col-12 col-md-3">
          <Link to="/" className="flex flex-col leading-none mb-5">
            <span className="text-white text-2xl font-extrabold tracking-tight">Pacific</span>
            <span className="text-orange-500 text-[0.55rem] font-semibold tracking-[4px] uppercase">Travel Agency</span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-6">
            Crafting extraordinary journeys since 2012. We turn your travel dreams into unforgettable memories.
          </p>
          <div className="flex gap-2">
            {socials.map(s => <SocialIcon key={s.label} {...s} />)}
          </div>
        </div>

        {/* Information */}
        <div className="col-12 col-md-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Information</h4>
          <ul className="space-y-2">
            {information.map(item => (
              <li key={item.label}>
                <Link
                  to={item.to}
                  className="group flex items-center gap-3 px-3 py-2.5 rounded-xl border border-white/5 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
                  style={{ borderLeft: '3px solid #f9731620' }}
                  onMouseEnter={e => e.currentTarget.style.borderLeftColor = '#f97316'}
                  onMouseLeave={e => e.currentTarget.style.borderLeftColor = '#f9731620'}
                >
                  <div className="w-7 h-7 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <i className={`fa ${item.icon} text-orange-400`} style={{ fontSize: 11 }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-gray-300 group-hover:text-orange-400 transition-colors leading-tight truncate">{item.label}</p>
                    <p className="text-xs text-gray-600 mt-0.5 truncate">{item.desc}</p>
                  </div>
                  <i className="fa fa-chevron-right text-gray-700 group-hover:text-orange-500 transition-colors ml-auto flex-shrink-0" style={{ fontSize: 9 }} />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience */}
        <div className="col-12 col-md-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Experience</h4>
          <ul className="space-y-3">
            {experiences.map(item => (
              <li key={item.label}>
                <Link to={item.to} className="group flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/20 transition-colors">
                    <i className={`fa ${item.icon} text-orange-400 text-xs`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-300 group-hover:text-orange-400 transition-colors leading-tight">{item.label}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="col-12 col-md-3">
          <h4 className="text-sm font-bold uppercase tracking-widest text-white mb-5">Contact Us</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 items-start">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <i className="fa fa-map-marker text-orange-400 text-sm" />
              </div>
              <a href= "https://maps.google.com/?q=198+West+21st+Street+New+York+NY+10016" className="text-gray-400 text-sm leading-relaxed">203 Fake St. Mountain View, San Francisco, California, USA</a>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <i className="fa fa-phone text-orange-400 text-sm" />
              </div>
              <a href="tel:+23923929210" className="text-gray-400 text-sm hover:text-orange-400 transition-colors">+2 392 3929 210</a>
            </li>
            <li className="flex gap-3 items-center">
              <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                <i className="fa fa-envelope text-orange-400 text-sm" />
              </div>
              <a href="mailto:info@yourdomain.com" className="text-gray-400 text-sm hover:text-orange-400 transition-colors">info@yourdomain.com</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="container-grid py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500 text-center">
          <p>© {new Date().getFullYear()} Pacific Travel Agency. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <a href="/privacy-policy" className="hover:text-orange-400 transition-colors">Privacy Policy</a>
            <span className="text-gray-700">·</span>
            <Link to="/terms-of-service" className="hover:text-orange-400 transition-colors">Terms of Service</Link>
            <span className="text-gray-700">·</span>
            <Link to="/sitemap" className="hover:text-orange-400 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}
