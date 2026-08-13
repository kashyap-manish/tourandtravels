import { useState } from 'react';
import { Link } from 'react-router-dom';
import { sendContact } from '../services/api';
import CallToAction from '../components/CallToAction';
import useInView from '../hooks/useInView';

const INFO = [
  {
    icon: 'fa-map-marker',
    title: 'Visit Our Office',
    lines: ['198 West 21st Street, Suite 721', 'New York, NY 10016, USA'],
    accent: 'bg-orange-500', light: 'bg-orange-50', text: 'text-orange-500',
    glowFrom: '#f97316', glowTo: '#ea580c33',
    iconBg: 'linear-gradient(135deg,#f97316,#ea580c)',
    href: 'https://maps.google.com/?q=198+West+21st+Street+New+York+NY+10016',
  },
  {
    icon: 'fa-phone',
    title: 'Call Us Anytime',
    lines: ['+1 (235) 2355 98', '+1 (235) 2355 99'],
    accent: 'bg-blue-500', light: 'bg-blue-50', text: 'text-blue-500',
    glowFrom: '#3b82f6', glowTo: '#1d4ed833',
    iconBg: 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    href: 'tel:+12352355098',
  },
  {
    icon: 'fa-envelope',
    title: 'Email Us',
    lines: ['info@pacifictours.com', 'support@pacifictours.com'],
    accent: 'bg-emerald-500', light: 'bg-emerald-50', text: 'text-emerald-500',
    glowFrom: '#10b981', glowTo: '#05966933',
    iconBg: 'linear-gradient(135deg,#10b981,#059669)',
    href: 'mailto:info@pacifictours.com',
  },
  {
    icon: 'fa-clock-o',
    title: 'Working Hours',
    lines: ['Mon – Fri: 9:00 AM – 6:00 PM', 'Sat: 10:00 AM – 4:00 PM'],
    accent: 'bg-purple-500', light: 'bg-purple-50', text: 'text-purple-500',
    glowFrom: '#a855f7', glowTo: '#7e22ce33',
    iconBg: 'linear-gradient(135deg,#a855f7,#7e22ce)',
    href: null,
  },
];

const SUBJECTS = [
  'Tour Booking Inquiry',
  'Custom Tour Package',
  'Group Travel',
  'Payment & Refund',
  'General Question',
  'Other',
];

const SOCIALS = [
  { label: 'Facebook', icon: 'fa-facebook', href: '#', color: '#1877F2' },
  { label: 'Instagram', icon: 'fa-instagram', href: '#', color: '#E1306C' },
  { label: 'Twitter', icon: 'fa-twitter', href: '#', color: '#1DA1F2' },
  { label: 'YouTube', icon: 'fa-youtube', href: '#', color: '#FF0000' },
  { label: 'LinkedIn', icon: 'fa-linkedin', href: '#', color: '#0A66C2' },
];

const FAQS = [
  { q: 'How far in advance should I book?', a: 'We recommend booking at least 2–4 weeks in advance, especially during peak season (Oct–Mar).' },
  { q: 'Can I customize a tour package?', a: 'Absolutely! All our packages are fully customizable. Contact us and we\'ll tailor an itinerary just for you.' },
  { q: 'What is your cancellation policy?', a: 'Free cancellation up to 7 days before departure. 50% refund within 3–7 days. No refund within 72 hours.' },
  { q: 'Do you offer group discounts?', a: 'Yes! Groups of 10+ get up to 15% off. Contact our team for a custom group quote.' },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="font-semibold text-gray-800 text-sm pr-4">{q}</span>
        <i className={`fa ${open ? 'fa-minus' : 'fa-plus'} text-orange-500 text-xs shrink-0 transition-transform`} />
      </button>
      {open && (
        <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
          {a}
        </div>
      )}
    </div>
  );
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [ref1, inView1] = useInView();
  const [ref2, inView2] = useInView();
  const [ref3, inView3] = useInView();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await sendContact(form);
      setStatus('success');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      setStatus('error');
    }
  };

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_5.jpg')", minHeight: '55vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-orange-900/40" />
        {/* Decorative grid overlay */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <i className="fa fa-headphones" /> 24/7 Support Available
          </div>
          <p className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Contact Us</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Let's Plan Your <span className="text-orange-400">Dream Trip</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
            Our travel experts are ready to craft the perfect journey for you. Reach out and we'll respond within 24 hours.
          </p>
        </div>
      </section>

      {/* Info Cards */}
      <section className="container -mt-10 relative z-20">
        <div
          ref={ref1}
          className={`row anim-hidden ${inView1 ? 'anim-visible animate-fade-up' : ''}`}
        >
          {INFO.map((c, i) => {
            const Tag = c.href ? 'a' : 'div';
            const linkProps = c.href ? { href: c.href, target: c.href.startsWith('http') ? '_blank' : undefined, rel: c.href.startsWith('http') ? 'noreferrer' : undefined } : {};
            return (
            <Tag
              key={c.title}
              {...linkProps}
              className={`col-12 col-sm-6 col-lg-3 relative rounded-3xl overflow-hidden transition-all duration-500 group ${c.href ? 'cursor-pointer hover:-translate-y-3' : 'hover:-translate-y-1'}`}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {/* Dark base */}
              <div className="absolute inset-0 bg-gray-950" />

              {/* Animated gradient glow */}
              <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.accent}`}
                style={{ background: `radial-gradient(circle at 30% 107%, ${c.glowFrom} 0%, ${c.glowTo} 60%, transparent 100%)` }}
              />

              {/* Shine sweep on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700"
                style={{ background: 'linear-gradient(135deg, white 0%, transparent 60%)' }}
              />

              {/* Large faded icon bg */}
              <div className={`absolute -bottom-4 -right-4 text-9xl ${c.text} opacity-5 group-hover:opacity-10 transition-opacity duration-500 select-none`}>
                <i className={`fa ${c.icon}`} />
              </div>

              <div className="relative z-10 p-7">
                {/* Icon */}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  style={{ background: c.iconBg }}
                >
                  <i className={`fa ${c.icon} text-white text-xl`} />
                </div>

                {/* Label */}
                <p className="text-xs font-bold uppercase tracking-widest mb-2 text-gray-500 group-hover:text-gray-300 transition-colors duration-300">{c.title}</p>

                {/* Lines */}
                {c.lines.map((l, j) => (
                  <p key={j} className={`font-semibold leading-relaxed transition-colors duration-300 ${
                    j === 0
                      ? 'text-base text-white'
                      : 'text-sm text-gray-500 group-hover:text-gray-300'
                  }`}>{l}</p>
                ))}

                {/* CTA arrow */}
                {c.href && (
                  <div className={`flex items-center gap-2 mt-5 text-xs font-bold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300`}
                    style={{ color: c.glowFrom }}
                  >
                    <span>Open</span>
                    <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: c.glowFrom }}>
                      <i className="fa fa-arrow-right text-white text-[9px]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom border glow */}
              <div className={`absolute bottom-0 left-0 right-0 h-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                style={{ background: `linear-gradient(90deg, transparent, ${c.glowFrom}, transparent)` }}
              />
            </Tag>
            );
          })}
        </div>
      </section>

      {/* Form + Map */}
      <section className="py-16 md:py-24">
        <div className="container row">

          {/* Form — 7 cols */}
          <div
            ref={ref2}
            className={`col-12 col-lg-7 anim-hidden ${inView2 ? 'anim-visible animate-fade-left' : ''}`}
          >
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-8 md:p-10">
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div>
                  <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Contact Form</span>
                  <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Send Us a Message</h2>
                  <p className="text-sm text-gray-400 mt-1">We'll get back to you within 24 hours.</p>
                </div>
                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center shrink-0">
                  <i className="fa fa-paper-plane text-orange-500 text-lg" />
                </div>
              </div>

              {/* Success */}
              {status === 'success' && (
                <div className="flex items-center gap-4 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-6">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center shrink-0">
                    <i className="fa fa-check text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">Message Sent Successfully!</p>
                    <p className="text-emerald-600 text-xs mt-0.5">Our team will reach out to you within 24 hours.</p>
                  </div>
                </div>
              )}

              {/* Error */}
              {status === 'error' && (
                <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 rounded-2xl px-5 py-4 mb-6 text-sm">
                  <i className="fa fa-exclamation-circle text-red-500" />
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="row">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="contact-name" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Full Name *</label>
                    <div className="relative">
                      <i className="fa fa-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="contact-name" required type="text" placeholder="John Doe"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <label htmlFor="contact-email" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Email Address *</label>
                    <div className="relative">
                      <i className="fa fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="contact-email" required type="email" placeholder="john@example.com"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-12 col-sm-6">
                    <label htmlFor="contact-phone" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
                    <div className="relative">
                      <i className="fa fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <input
                        id="contact-phone" type="tel" placeholder="+1 (000) 000-0000"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all"
                      />
                    </div>
                  </div>
                  <div className="col-12 col-sm-6">
                    <label htmlFor="contact-subject" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Subject *</label>
                    <div className="relative">
                      <i className="fa fa-tag absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 text-sm" />
                      <select
                        id="contact-subject" required
                        value={form.subject}
                        onChange={e => setForm({ ...form, subject: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all bg-white appearance-none"
                      >
                        <option value="">Select a subject</option>
                        {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Your Message *</label>
                  <textarea
                    id="contact-message" required rows={5} placeholder="Tell us about your travel plans, preferred dates, group size..."
                    value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3.5 rounded-xl transition-all hover:shadow-lg hover:shadow-orange-500/30 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  {status === 'loading'
                    ? <><i className="fa fa-spinner fa-spin" /> Sending...</>
                    : <><i className="fa fa-paper-plane" /> Send Message</>
                  }
                </button>

                <p className="text-xs text-gray-400 text-center">
                  <i className="fa fa-lock mr-1" />
                  Your information is secure and will never be shared with third parties.
                </p>
              </form>
            </div>
          </div>

          {/* Right side — 5 cols */}
          <div
            ref={ref3}
            className={`col-12 col-lg-5 flex flex-col gap-6 anim-hidden ${inView3 ? 'anim-visible animate-fade-right' : ''}`}
          >
            {/* Map */}
            <div className="rounded-3xl overflow-hidden shadow-xl border border-gray-100 h-64 lg:h-72">
              <iframe
                title="Pacific Travel Office Location"
                className="w-full h-full"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.9663095343008!2d-74.00425878428698!3d40.74076684379132!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259bf5c1654f3%3A0xc80f9cfce5383d5d!2sNew+York%2C+NY+10001!5e0!3m2!1sen!2sus!4v1555341793820!5m2!1sen!2sus"
                allowFullScreen
                loading="lazy"
              />
            </div>

            {/* Why Contact Us */}
            <div className="bg-gray-950 rounded-3xl p-7 text-white">
              <h3 className="font-extrabold text-lg mb-1">Why Choose Pacific?</h3>
              <p className="text-gray-400 text-sm mb-5">We're not just a travel agency — we're your travel partner.</p>
              <div className="space-y-4">
                {[
                  { icon: 'fa-shield', text: '100% Secure Booking & Payments' },
                  { icon: 'fa-headphones', text: '24/7 Dedicated Customer Support' },
                  { icon: 'fa-star', text: '10+ Years of Travel Expertise' },
                  { icon: 'fa-globe', text: '120+ Destinations Worldwide' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/15 rounded-lg flex items-center justify-center shrink-0">
                      <i className={`fa ${item.icon} text-orange-400 text-sm`} />
                    </div>
                    <span className="text-sm text-gray-300">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Socials */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-7">
              <h3 className="font-extrabold text-gray-900 mb-1">Follow Our Journey</h3>
              <p className="text-sm text-gray-400 mb-5">Stay inspired with travel stories, tips & exclusive deals.</p>
              <div className="flex gap-3 flex-wrap">
                {SOCIALS.map(s => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-100 text-gray-500 hover:text-white text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                    onMouseEnter={e => { e.currentTarget.style.backgroundColor = s.color; e.currentTarget.style.borderColor = s.color; }}
                    onMouseLeave={e => { e.currentTarget.style.backgroundColor = ''; e.currentTarget.style.borderColor = ''; }}
                  >
                    <i className={`fa ${s.icon}`} />
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">FAQ</span>
            <h2 className="text-3xl font-extrabold text-gray-900 mt-2">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm mt-2">Quick answers to common questions about our services.</p>
          </div>
          <div className="space-y-3">
            {FAQS.map((f, i) => <FaqItem key={i} {...f} />)}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}


