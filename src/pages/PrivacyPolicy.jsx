import PageHero from '../components/PageHero';

const sections = [
  {
    icon: 'fa-database',
    title: 'Information We Collect',
    items: [
      'Personal identification information (name, email address, phone number)',
      'Travel preferences and booking history',
      'Payment information (processed securely — we do not store card details)',
      'Device and usage data when you visit our website',
    ],
  },
  {
    icon: 'fa-cogs',
    title: 'How We Use Your Information',
    items: [
      'To process and manage your bookings and enquiries',
      'To send booking confirmations, itineraries, and travel updates',
      'To personalize your experience and recommend relevant destinations',
      'To improve our website and services based on usage patterns',
      'To comply with legal obligations',
    ],
  },
  {
    icon: 'fa-share-alt',
    title: 'Sharing Your Information',
    items: [
      'We do not sell or rent your personal data to third parties',
      'We share data with trusted service providers solely to fulfill your booking',
      'We may disclose information if required by law or to protect our legal rights',
    ],
  },
  {
    icon: 'fa-lock',
    title: 'Data Security',
    items: [
      'We use industry-standard SSL encryption to protect data in transit',
      'Access to personal data is restricted to authorized staff only',
      'We regularly review and update our security practices',
    ],
  },
  {
    icon: 'fa-user',
    title: 'Your Rights',
    items: [
      'Access the personal data we hold about you',
      'Request correction of inaccurate data',
      'Request deletion of your data (subject to legal obligations)',
      'Opt out of marketing communications at any time',
    ],
  },
  {
    icon: 'fa-chrome',
    title: 'Cookies',
    items: [
      'We use cookies to improve your browsing experience',
      'Analytics cookies help us understand how visitors use our site',
      'You can control cookie settings through your browser preferences',
    ],
  },
];

const highlights = [
  { icon: 'fa-shield', title: 'Data Protected', desc: 'SSL encrypted at all times' },
  { icon: 'fa-eye-slash', title: 'Never Sold', desc: 'Your data stays with us' },
  { icon: 'fa-user-circle', title: 'Your Control', desc: 'Request changes anytime' },
];

export default function PrivacyPolicy() {
  return (
    <>
      <PageHero title="Privacy & Policy" breadcrumb="Privacy & Policy" bgImage="/images/bg_3.jpg" />

      <section style={{ padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 56, alignItems: 'start' }}>

          {/* Left panel */}
          <div style={{ position: 'sticky', top: 100 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 10 }}>Legal</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#111827', lineHeight: 1.25, marginBottom: 16 }}>Privacy<br />Policy</h2>
            <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.8, marginBottom: 36 }}>
              At Pacific Travel Agency, your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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

            <div style={{ background: '#f9fafb', borderRadius: 16, padding: '22px 20px', border: '1.5px solid #f0f0f0' }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#111827', marginBottom: 6 }}>Contact Our Privacy Team</p>
              <p style={{ fontSize: 13, color: '#6b7280', lineHeight: 1.7, marginBottom: 4 }}>
                Questions about how we handle your data?
              </p>
              <a href="mailto:privacy@yourdomain.com" style={{ fontSize: 13, color: '#f97316', fontWeight: 600 }}>privacy@yourdomain.com</a>
              <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 12 }}>Last updated: January 2024</p>
            </div>
          </div>

          {/* Right — policy card */}
          <div style={{ background: '#fff', borderRadius: 24, border: '1.5px solid #f0f0f0', boxShadow: '0 8px 40px rgba(0,0,0,0.07)', padding: '44px 40px' }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 6 }}>Policy Details</p>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: '#111827', marginBottom: 28 }}>How we handle your data</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {sections.map((s, i) => (
                <div key={i} style={{ paddingBottom: 28, marginBottom: 28, borderBottom: i < sections.length - 1 ? '1px solid #f3f4f6' : 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <i className={`fa ${s.icon}`} style={{ color: '#f97316', fontSize: 14 }} />
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: '#f97316', color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                      <p style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>{s.title}</p>
                    </div>
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 50 }}>
                    {s.items.map((item, j) => (
                      <li key={j} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: '#6b7280', lineHeight: 1.6 }}>
                        <i className="fa fa-check" style={{ color: '#f97316', fontSize: 11, marginTop: 3, flexShrink: 0 }} />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
