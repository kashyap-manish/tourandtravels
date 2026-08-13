import PageHero from '../components/PageHero';
import { Link } from 'react-router-dom';

const sections = [
  { icon: 'fa-check-square', title: 'Booking & Confirmation', content: 'A booking is confirmed once we receive a completed booking form and the required deposit. You will receive a written confirmation within 48 hours. Pacific Travel Agency acts as an agent for the various travel service providers and is not liable for their acts or omissions.' },
  { icon: 'fa-credit-card', title: 'Payment Terms', content: 'A deposit of 25% of the total tour cost is required at the time of booking. The remaining balance is due no later than 30 days before the departure date. For bookings made within 30 days of departure, full payment is required at the time of booking.' },
  { icon: 'fa-ban', title: 'Cancellation by the Client', content: 'Cancellations must be submitted in writing. The following charges apply: more than 60 days before departure — deposit forfeited; 30–60 days — 50% of total cost; less than 30 days — 100% of total cost. We strongly recommend purchasing travel insurance.' },
  { icon: 'fa-refresh', title: 'Cancellation by Pacific', content: 'Pacific Travel Agency reserves the right to cancel any tour due to insufficient bookings or circumstances beyond our control. In such cases, a full refund will be issued or an alternative tour of equal value will be offered.' },
  { icon: 'fa-exchange', title: 'Changes & Amendments', content: 'Requests to change travel dates, destinations, or other booking details must be made in writing. An amendment fee of $50 per person applies. Changes are subject to availability and may result in a price difference.' },
  { icon: 'fa-shield', title: 'Travel Insurance', content: 'We strongly recommend that all travelers obtain comprehensive travel insurance covering cancellation, medical expenses, personal accident, and loss of baggage. Pacific Travel Agency is not responsible for any costs incurred due to lack of insurance.' },
  { icon: 'fa-globe', title: 'Passports & Visas', content: "It is the traveler's responsibility to ensure they hold a valid passport and any required visas for their destination. Pacific Travel Agency can provide general guidance but is not responsible for any issues arising from invalid travel documents." },
];

const highlights = [
  { icon: 'fa-file-text-o', title: 'Clear Terms', desc: 'Transparent booking conditions' },
  { icon: 'fa-lock', title: 'Secure Booking', desc: 'Your payment is fully protected' },
  { icon: 'fa-headphones', title: '24h Support', desc: 'We\'re here if you need us' },
];

export default function BookingConditions() {
  return (
    <>
      <PageHero title="Booking Conditions" breadcrumb="Booking Conditions" bgImage="/images/bg_5.jpg" />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'start' }}>

          {/* Left panel */}
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Legal</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16 }}>Terms &<br />Booking Conditions</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 36 }}>
              Please read these conditions carefully before making a booking. By confirming your booking, you agree to be bound by these terms.
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

            <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
              <p style={{ fontSize: 12, color: '#9ca3af', marginBottom: 14 }}>Last updated: January 2024</p>
              <Link to="/online-enquiry" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 13, padding: '11px 22px', borderRadius: 10, textDecoration: 'none' }}>
                <i className="fa fa-paper-plane" style={{ fontSize: 11 }} /> Have a Question?
              </Link>
            </div>
          </div>

          {/* Right — conditions card */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f0f0f0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '44px 40px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Conditions</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 28 }}>What you need to know</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {sections.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 18, padding: '20px 22px', borderRadius: 14, border: '1.5px solid #f0f0f0', transition: 'border-color 0.2s, box-shadow 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#fed7aa'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(249,115,22,0.08)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#f0f0f0'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <i className={`fa ${s.icon}`} style={{ color: '#f97316', fontSize: 16 }} />
                  </div>
                  <div>
                    <p style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 6 }}>{s.title}</p>
                    <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.75 }}>{s.content}</p>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ marginTop: 28, fontSize: 12, color: '#9ca3af', textAlign: 'center' }}>
              Questions? Email <a href="mailto:info@yourdomain.com" style={{ color: '#f97316' }}>info@yourdomain.com</a>
            </p>
          </div>

        </div>
      </section>
    </>
  );
}

