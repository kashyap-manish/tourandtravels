import { useState } from 'react';
import { Link } from 'react-router-dom';
import useInView from '../hooks/useInView';
import { sendContact } from '../services/api';

export default function CallToAction({
  title = 'We Are Pacific A Travel Agency',
  description = 'We can manage your dream building A small river named Duden flows by their place',
  primaryText = 'Ask For A Quote',
  secondaryText = 'Learn More',
  secondaryHref = '/about',
  bgImage = '/images/bg_2.jpg',
  variant = 'dark',
}) {
  const [ref, inView] = useInView();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const isDark = variant === 'dark';

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await sendContact({ name: form.name, email: form.email, message: form.message, subject: 'Quote Request' });
    } catch (_) {}
    setSubmitted(true);
    setForm({ name: '', email: '', message: '' });
  }

  return (
    <>
      <section className="py-10 md:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div
            ref={ref}
            className={`intro-bg rounded-2xl text-center relative overflow-hidden ${isDark ? 'text-white' : 'text-gray-900'} anim-hidden ${inView ? 'anim-visible animate-fade-up' : ''}`}
            style={{ backgroundImage: `url('${bgImage}')` }}
          >

            <div className="relative z-10 py-12 md:py-16 px-6">
              <h2 className="text-2xl md:text-3xl font-bold mb-3">{title}</h2>
              <p className={`mb-6 text-sm md:text-base ${isDark ? 'text-gray-200' : 'text-gray-600'}`}>{description}</p>
              <div className="flex items-center justify-center gap-4 flex-wrap">
                <button
                  onClick={() => { setOpen(true); setSubmitted(false); }}
                  className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-500/40"
                >
                  {primaryText}
                </button>
                <Link
                  to={secondaryHref}
                  className={`border-2 px-8 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 ${isDark ? 'border-white text-white hover:bg-white hover:text-gray-900' : 'border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white'}`}
                >
                  {secondaryText}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote Modal */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 text-xl">
              <i className="fa fa-times" />
            </button>
            {submitted ? (
              <div className="text-center py-6">
                <i className="fa fa-check-circle text-orange-500 text-5xl mb-4" />
                <h3 className="text-xl font-bold mb-2">Quote Sent!</h3>
                <p className="text-gray-500 text-sm">We'll get back to you shortly.</p>
                <button onClick={() => setOpen(false)} className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-full font-semibold transition-colors">
                  Close
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl font-bold mb-1">Ask For A Quote</h3>
                <p className="text-gray-500 text-sm mb-6">Fill in the form and we'll be in touch.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <input
                    required
                    placeholder="Your Name"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <input
                    required
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
                  />
                  <textarea
                    required
                    rows={4}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                    className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
                  />
                  <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-full font-semibold transition-colors">
                    Send Quote Request
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

