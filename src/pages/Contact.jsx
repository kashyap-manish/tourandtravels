import { useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

const contactInfo = [
  { icon: 'fa-map-marker', title: 'Our Office', text: '198 West 21st Street, Suite 721, New York NY 10016', bg: 'bg-orange-50', color: 'text-orange-500' },
  { icon: 'fa-phone', title: 'Phone Number', text: '+1 (235) 2355 98', bg: 'bg-blue-50', color: 'text-blue-500' },
  { icon: 'fa-envelope', title: 'Email Address', text: 'info@pacifictours.com', bg: 'bg-green-50', color: 'text-green-500' },
  { icon: 'fa-clock-o', title: 'Working Hours', text: 'Mon – Sat: 9:00 AM – 6:00 PM', bg: 'bg-purple-50', color: 'text-purple-500' },
];

// const socials = [
//   { icon: 'fa-facebook', href: '#', label: 'Facebook' },
//   { icon: 'fa-instagram', href: '#', label: 'Instagram' },
//   { icon: 'fa-twitter', href: '#', label: 'Twitter' },
//   { icon: 'fa-youtube', href: '#', label: 'YouTube' },
//   { icon: 'fa-linkedin', href: '#', label: 'LinkedIn' },
// ];

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

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_5.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Contact Us</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Get In Touch</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Have a question or ready to plan your next adventure? We'd love to hear from you.</p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 md:-mt-10 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-5">
          {contactInfo.map(c => (
            <div key={c.title} className="bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-start gap-4 hover:shadow-lg transition-shadow">
              <div className={`w-12 h-12 shrink-0 rounded-xl ${c.bg} flex items-center justify-center`}>
                <i className={`fa ${c.icon} ${c.color} text-lg`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-0.5">{c.title}</p>
                <p className="text-sm font-semibold text-gray-800">{c.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">

          {/* Form */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
            <p className="text-sm text-gray-400 mb-6">Fill out the form below and we'll get back to you within 24 hours.</p>

            {submitted && (
              <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 mb-6 text-sm font-semibold">
                <i className="fa fa-check-circle text-green-500 text-base" />
                Message sent! We'll get back to you soon.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your Name</label>
                  <input
                    type="text" required placeholder="John Doe"
                    value={form.name}
                    onChange={e => setForm({ ...form, name: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email Address</label>
                  <input
                    type="email" required placeholder="john@example.com"
                    value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Subject</label>
                <input
                  type="text" required placeholder="How can we help?"
                  value={form.subject}
                  onChange={e => setForm({ ...form, subject: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Message</label>
                <textarea
                  rows={5} required placeholder="Tell us about your travel plans..."
                  value={form.message}
                  onChange={e => setForm({ ...form, message: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <i className="fa fa-paper-plane" /> Send Message
              </button>
            </form>
          </div>

          {/* Map + Socials */}
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex-1 min-h-72">
              <iframe
                title="map"
                className="w-full h-full min-h-72"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076684379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew+York%2C+NY+10001!5e0!3m2!1sen!2sus!4v1555341793820!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Social + CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="font-bold text-gray-900 mb-1">Follow Us</p>
              <p className="text-sm text-gray-400 mb-4">Stay updated with our latest tours and travel stories.</p>
              <div className="flex gap-3">
                {socials.map(s => (
                  <a
                    key={s.label} href={s.href}
                    className="w-10 h-10 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200"
                    aria-label={s.label}
                  >
                    <i className={`fa ${s.icon}`} />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
