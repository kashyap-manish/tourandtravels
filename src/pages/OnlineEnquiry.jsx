import { useState } from 'react';
import PageHero from '../components/PageHero';

const highlights = [
  { icon: 'fa-clock-o', title: '24h Response', desc: 'We reply within one business day' },
  { icon: 'fa-lock', title: 'Secure & Private', desc: 'Your data is never shared' },
  { icon: 'fa-star', title: 'Expert Advice', desc: 'Personalised by travel specialists' },
];

const inputStyle = {
  width: '100%',
  background: '#f9fafb',
  border: '1.5px solid #e5e7eb',
  borderRadius: 12,
  padding: '12px 16px',
  fontSize: 14,
  color: '#111827',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.2s, background 0.2s',
};

function Field({ label, children }) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({ type = 'text', placeholder, ...rest }) {
  const [focused, setFocused] = useState(false);
  return (
    <input
      type={type}
      placeholder={placeholder}
      style={{ ...inputStyle, borderColor: focused ? '#f97316' : '#e5e7eb', background: focused ? '#fff' : '#f9fafb' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      {...rest}
    />
  );
}

function Textarea({ placeholder, rows = 5 }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      rows={rows}
      placeholder={placeholder}
      style={{ ...inputStyle, borderColor: focused ? '#f97316' : '#e5e7eb', background: focused ? '#fff' : '#f9fafb', resize: 'none' }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}

export default function OnlineEnquiry() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHero title="Online Enquiry" breadcrumb="Online Enquiry" bgImage="/images/bg_4.jpg" />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'start' }}>

          {/* Left — info panel */}
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Get In Touch</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16 }}>Send Us an<br />Enquiry</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 36 }}>
              Have a trip in mind? Fill out the form and one of our travel specialists will get back to you with a tailored plan.
            </p>

            {/* Highlight cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 40 }}>
              {highlights.map(h => (
                <div key={h.title} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px', borderRadius: 14, border: '1.5px solid #f0f0f0', background: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa ${h.icon}`} style={{ color: '#f97316', fontSize: 18 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 2 }}>{h.title}</p>
                    <p style={{ fontSize: 12, color: '#9ca3af' }}>{h.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Contact strip */}
            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 28, display: 'flex', flexDirection: 'column', gap: 14 }}>
              {[
                { icon: 'fa-phone', text: '+1 392 3929 210', href: 'tel:+13923929210' },
                { icon: 'fa-envelope', text: 'info@yourdomain.com', href: 'mailto:info@yourdomain.com' },
                { icon: 'fa-whatsapp', text: 'Chat on WhatsApp', href: 'https://wa.me/13923929210' },
              ].map(c => (
                <a key={c.text} href={c.href} style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa ${c.icon}`} style={{ color: '#f97316', fontSize: 14 }} />
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280', fontWeight: 500 }}>{c.text}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Right — form card */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f0f0f0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '44px 40px' }}>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: 64, height: 64, borderRadius: '50%', background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <i className="fa fa-check" style={{ color: '#f97316', fontSize: 28 }} />
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#111827', marginBottom: 10 }}>Enquiry Sent!</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.7 }}>Thank you for reaching out. Our team will contact you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} style={{ marginTop: 28, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '12px 28px', borderRadius: 12, border: 'none', cursor: 'pointer' }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={e => { e.preventDefault(); setSubmitted(true); }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Enquiry Form</p>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 28 }}>Tell us about your trip</h3>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="First Name"><Input placeholder="John" /></Field>
                  <Field label="Last Name"><Input placeholder="Doe" /></Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="Email Address"><Input type="email" placeholder="you@example.com" /></Field>
                  <Field label="Phone Number"><Input type="tel" placeholder="+1 234 567 890" /></Field>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <Field label="Destination"><Input placeholder="e.g. Philippines, Greece…" /></Field>
                  <Field label="Travel Date"><Input type="date" /></Field>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <Field label="Number of Travellers">
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <Input type="number" placeholder="Adults" />
                      <Input type="number" placeholder="Children" />
                    </div>
                  </Field>
                </div>

                <div style={{ marginBottom: 28 }}>
                  <Field label="Message"><Textarea placeholder="Tell us about your travel plans, budget, preferences…" /></Field>
                </div>

                <button
                  type="submit"
                  style={{ width: '100%', background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 15, padding: '15px', borderRadius: 14, border: 'none', cursor: 'pointer', letterSpacing: '0.02em', boxShadow: '0 4px 24px rgba(249,115,22,0.25)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#ea6c0a'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f97316'}
                >
                  Submit Enquiry →
                </button>
                <p style={{ textAlign: 'center', fontSize: 12, color: '#9ca3af', marginTop: 14 }}>
                  <i className="fa fa-lock" style={{ marginRight: 5 }} />
                  Your information is secure and never shared.
                </p>
              </form>
            )}
          </div>

        </div>
      </section>
    </>
  );
}
