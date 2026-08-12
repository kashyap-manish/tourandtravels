import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const timeline = [
  { range: 'More than 60 days', refund: '75% Refund', dot: '#22c55e', border: '#bbf7d0', bg: '#f0fdf4', text: '#16a34a' },
  { range: '30 – 60 days',      refund: '50% Refund', dot: '#eab308', border: '#fef08a', bg: '#fefce8', text: '#ca8a04' },
  { range: '14 – 30 days',      refund: '25% Refund', dot: '#f97316', border: '#fed7aa', bg: '#fff7ed', text: '#ea580c' },
  { range: 'Less than 14 days', refund: 'No Refund',  dot: '#ef4444', border: '#fecaca', bg: '#fef2f2', text: '#dc2626' },
];

const steps = [
  { icon: 'fa-envelope',     title: 'Submit Request', desc: 'Email refunds@yourdomain.com with your booking reference and reason for cancellation.' },
  { icon: 'fa-search',       title: 'Review',         desc: 'Our team reviews your request within 3 business days and confirms the applicable refund amount.' },
  { icon: 'fa-check-circle', title: 'Approval',       desc: 'Once approved, you receive a confirmation email with the refund details and timeline.' },
  { icon: 'fa-bank',         title: 'Refund Issued',  desc: 'Refunds are processed to the original payment method within 7–14 business days after approval.' },
];

const notes = [
  'Deposits are non-refundable in all cases.',
  'Refunds are not applicable for no-shows or early departures.',
  'Force majeure events are handled on a case-by-case basis.',
  'We strongly recommend purchasing travel insurance.',
];

const highlights = [
  { icon: 'fa-rotate-left', title: 'Fair Refunds',    desc: 'Transparent cancellation policy' },
  { icon: 'fa-clock-o',     title: '7–14 Day Return', desc: 'Fast refund processing' },
  { icon: 'fa-shield',      title: 'Secure Payments', desc: 'All transactions protected' },
];

export default function RefundPolicy() {
  return (
    <>
      <PageHero title="Refund Policy" breadcrumb="Refund Policy" bgImage="/images/bg_4.jpg" />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'start' }}>

          {/* Left panel */}
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Legal</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16 }}>Refund<br />Policy</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 36 }}>
              We understand that plans change. Our refund policy is designed to be fair and transparent for every traveler.
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

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24, textAlign: 'center' }}>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>Have questions about your refund?</p>
              <Link to="/call-us" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}>
                <i className="fa fa-phone" style={{ fontSize: 11 }} /> Contact Support
              </Link>
            </div>
          </div>

          {/* Right — policy card */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f0f0f0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '44px 40px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Cancellation Schedule</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 24 }}>Refund by cancellation date</h3>

            {/* Timeline grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36 }}>
              {timeline.map((t, i) => (
                <div key={i} style={{ padding: '18px 20px', borderRadius: 14, border: `1.5px solid ${t.border}`, background: t.bg }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: t.dot, marginBottom: 10 }} />
                  <p style={{ fontSize: 13, fontWeight: 700, color: '#374151', marginBottom: 4 }}>{t.range}</p>
                  <p style={{ fontSize: 20, fontWeight: 800, color: t.text }}>{t.refund}</p>
                  <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>before departure</p>
                </div>
              ))}
            </div>

            {/* Process */}
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 20 }}>How to Request a Refund</p>
            <div style={{ position: 'relative', paddingLeft: 20 }}>
              <div style={{ position: 'absolute', left: 20, top: 20, bottom: 20, width: 2, background: '#f3f4f6' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: 'flex', gap: 18, position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, zIndex: 1, boxShadow: '0 4px 12px rgba(249,115,22,0.25)' }}>
                      <i className={`fa ${s.icon}`} style={{ color: '#fff', fontSize: 14 }} />
                    </div>
                    <div style={{ paddingTop: 8 }}>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 4 }}>{s.title}</p>
                      <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7 }}>{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div style={{ marginTop: 32, padding: '20px 22px', borderRadius: 14, background: '#fff7ed', border: '1.5px solid #fed7aa' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 12 }}>
                <i className="fa fa-exclamation-circle" style={{ color: '#f97316', marginRight: 8 }} />
                Important Notes
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {notes.map((note, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#6b7280' }}>
                    <i className="fa fa-circle" style={{ color: '#f97316', fontSize: 6, marginTop: 6, flexShrink: 0 }} />
                    {note}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
