import { useState } from 'react';
import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const faqs = [
  { q: 'How do I book a tour?', a: 'You can book a tour by filling out our Online Enquiry form or by contacting us directly via phone or email. Our team will confirm availability and send you a booking confirmation within 24 hours.' },
  { q: 'Can I customize my travel itinerary?', a: 'Absolutely. All our tours can be fully customized to suit your preferences, budget, and travel dates. Just let us know your requirements and we will craft a personalized itinerary for you.' },
  { q: 'What is included in the tour package?', a: 'Our packages typically include accommodation, guided tours, airport transfers, and select meals. Specific inclusions vary per package and are clearly listed on each tour page.' },
  { q: 'Do you offer group discounts?', a: 'Yes, we offer special rates for groups of 6 or more travelers. Contact us directly to discuss group pricing and availability.' },
  { q: 'Is travel insurance included?', a: 'Travel insurance is not included by default but we strongly recommend it. We can connect you with our trusted insurance partners to find the right coverage for your trip.' },
  { q: 'What languages do your guides speak?', a: 'Our guides are fluent in English and the local language of each destination. For other language requirements, please contact us in advance and we will do our best to accommodate.' },
];

const highlights = [
  { icon: 'fa-comments', title: 'Quick Answers', desc: 'Most questions answered instantly' },
  { icon: 'fa-users', title: 'Expert Team', desc: 'Specialists ready to assist you' },
  { icon: 'fa-clock-o', title: 'Fast Support', desc: 'Response within one business day' },
];

function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ border: `1.5px solid ${open ? '#f97316' : '#e5e7eb'}`, borderRadius: 14, overflow: 'hidden', transition: 'border-color 0.2s', background: '#fff' }}
    >
      <button
        onClick={() => setOpen(o => !o)}
        style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', gap: 16 }}
      >
        <span style={{ fontSize: 14, fontWeight: 700, color: open ? '#f97316' : '#111827' }}>{q}</span>
        <i className={`fa fa-chevron-${open ? 'up' : 'down'}`} style={{ color: '#f97316', fontSize: 11, flexShrink: 0 }} />
      </button>
      {open && (
        <div style={{ padding: '0 22px 18px', fontSize: 14, color: '#6b7280', lineHeight: 1.8, borderTop: '1px solid #f3f4f6' }}>
          <div style={{ paddingTop: 14 }}>{a}</div>
        </div>
      )}
    </div>
  );
}

export default function GeneralEnquiries() {
  return (
    <>
      <PageHero title="General Enquiries" breadcrumb="General Enquiries" bgImage="/images/bg_2.jpg" />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'start' }}>

          {/* Left panel */}
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>FAQ</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16 }}>Frequently Asked<br />Questions</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 36 }}>
              Can't find what you're looking for? Reach out and our team will be happy to help.
            </p>

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

            <div style={{ background: '#fff7ed', border: '1.5px solid #fed7aa', borderRadius: 16, padding: '24px 22px', textAlign: 'center' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <i className="fa fa-envelope" style={{ color: '#fff', fontSize: 18 }} />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Still have questions?</p>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 16 }}>Our team is available Mon–Fri, 9am–6pm.</p>
              <a href="mailto:info@yourdomain.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 10, textDecoration: 'none' }}>
                <i className="fa fa-paper-plane" style={{ fontSize: 11 }} /> Email Us
              </a>
            </div>
          </div>

          {/* Right — FAQ card */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f0f0f0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '44px 40px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Help Centre</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 28 }}>Common Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {faqs.map((f, i) => <FAQItem key={i} {...f} />)}
            </div>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <p style={{ fontSize: 13, color: '#6b7280' }}>Need more help?</p>
              <Link to="/online-enquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '10px 22px', borderRadius: 10, textDecoration: 'none' }}>
                Send an Enquiry →
              </Link>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}

