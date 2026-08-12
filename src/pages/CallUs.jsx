import PageHero from '../components/PageHero';

const offices = [
  {
    city: 'San Francisco',
    address: '203 Fake St. Mountain View, San Francisco, California, USA',
    phone: '+1 392 3929 210',
    email: 'sf@yourdomain.com',
    hours: 'Mon – Fri: 9:00am – 6:00pm',
    img: '/images/bg_5.jpg',
  },
  {
    city: 'Manila',
    address: '45 Ayala Ave, Makati City, Metro Manila, Philippines',
    phone: '+63 2 8123 4567',
    email: 'manila@yourdomain.com',
    hours: 'Mon – Sat: 8:00am – 7:00pm',
    img: '/images/destination-1.jpg',
  },
];

const contacts = [
  { icon: 'fa-phone', label: 'Call Us Anytime', value: '+1 392 3929 210', sub: 'Available Mon–Fri, 9am–6pm', href: 'tel:+13923929210', accent: '#f97316' },
  { icon: 'fa-envelope', label: 'Send an Email', value: 'info@yourdomain.com', sub: 'We reply within 24 hours', href: 'mailto:info@yourdomain.com', accent: '#3b82f6' },
  { icon: 'fa-whatsapp', label: 'WhatsApp Us', value: '+1 392 3929 210', sub: 'Chat with us instantly', href: 'https://wa.me/13923929210', accent: '#22c55e' },
];

export default function CallUs() {
  return (
    <>
      <PageHero title="Get In Touch" breadcrumb="Call Us" bgImage="/images/bg_3.jpg" />

      <section style={{ padding: '80px 0 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px' }}>

          {/* Contact cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24, marginBottom: 72 }}>
            {contacts.map(c => (
              <a
                key={c.label}
                href={c.href}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 20, padding: '28px 28px', background: '#fff', borderRadius: 16, border: '1px solid #f0f0f0', borderLeft: `4px solid ${c.accent}`, boxShadow: '0 2px 12px rgba(0,0,0,0.05)', textDecoration: 'none', transition: 'box-shadow 0.2s, transform 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.10)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; e.currentTarget.style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: 48, height: 48, borderRadius: 12, background: c.accent + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <i className={`fa ${c.icon}`} style={{ fontSize: 20, color: c.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>{c.label}</p>
                  <p style={{ fontSize: 15, fontWeight: 700, color: '#111827', marginBottom: 3 }}>{c.value}</p>
                  <p style={{ fontSize: 12, color: '#9ca3af' }}>{c.sub}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Offices */}
          <div style={{ marginBottom: 72 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 8 }}>Find Us</p>
            <h2 style={{ fontSize: 28, fontWeight: 800, color: '#111827', marginBottom: 32 }}>Our Offices</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 28 }}>
              {offices.map(o => (
                <div key={o.city} style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ position: 'relative', height: 200 }}>
                    <img src={o.img} alt={o.city} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)' }} />
                    <h4 style={{ position: 'absolute', bottom: 18, left: 22, color: '#fff', fontSize: 20, fontWeight: 800, margin: 0 }}>{o.city}</h4>
                  </div>
                  <div style={{ padding: '24px 24px', background: '#fff', flexGrow: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
                      {[
                        { icon: 'fa-map-marker', text: o.address },
                        { icon: 'fa-phone', text: <a href={`tel:${o.phone.replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{o.phone}</a> },
                        { icon: 'fa-envelope', text: <a href={`mailto:${o.email}`} style={{ color: 'inherit', textDecoration: 'none' }}>{o.email}</a> },
                        { icon: 'fa-clock-o', text: o.hours },
                      ].map((item, i) => (
                        <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 13, color: '#6b7280' }}>
                          <span style={{ width: 28, height: 28, borderRadius: 8, background: '#fff7ed', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <i className={`fa ${item.icon}`} style={{ color: '#f97316', fontSize: 12 }} />
                          </span>
                          <span style={{ paddingTop: 5 }}>{item.text}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* Full-width dark CTA + form */}
      <section style={{ background: '#0a0a0a', padding: '80px 0' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 64, alignItems: 'center' }}>

          {/* Left pitch */}
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: 12 }}>Request a Callback</p>
            <h2 style={{ fontSize: 32, fontWeight: 800, color: '#fff', lineHeight: 1.25, marginBottom: 16 }}>Prefer to write?<br />We'll call you back.</h2>
            <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.8, marginBottom: 36 }}>
              Fill in the form and one of our travel experts will reach out to you within one business day to discuss your trip.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { icon: 'fa-check-circle', text: 'No commitment required' },
                { icon: 'fa-check-circle', text: 'Personalised travel advice' },
                { icon: 'fa-check-circle', text: 'Best price guarantee' },
              ].map(item => (
                <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <i className={`fa ${item.icon}`} style={{ color: '#f97316', fontSize: 16 }} />
                  <span style={{ fontSize: 14, color: '#d1d5db' }}>{item.text}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, marginTop: 40 }}>
              {[
                { icon: 'fa-facebook', href: '#' },
                { icon: 'fa-instagram', href: '#' },
                { icon: 'fa-twitter', href: '#' },
              ].map(s => (
                <a key={s.icon} href={s.href} style={{ width: 40, height: 40, borderRadius: 10, border: '1px solid #ffffff18', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', textDecoration: 'none', transition: 'border-color 0.2s, color 0.2s' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = '#f97316'; e.currentTarget.style.color = '#f97316'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#ffffff18'; e.currentTarget.style.color = '#9ca3af'; }}>
                  <i className={`fa ${s.icon}`} />
                </a>
              ))}
            </div>
          </div>

          {/* Right form */}
          <form onSubmit={e => e.preventDefault()} style={{ background: '#161616', borderRadius: 20, padding: '40px 36px', border: '1px solid #ffffff0d' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              {[
                { label: 'Your Name', type: 'text', placeholder: 'John Doe', span: 1 },
                { label: 'Phone Number', type: 'tel', placeholder: '+1 234 567 890', span: 1 },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{f.label}</label>
                  <input type={f.type} placeholder={f.placeholder} style={{ width: '100%', background: '#0a0a0a', border: '1px solid #ffffff12', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                    onFocus={e => e.target.style.borderColor = '#f97316'}
                    onBlur={e => e.target.style.borderColor = '#ffffff12'} />
                </div>
              ))}
            </div>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Email Address</label>
              <input type="email" placeholder="john@example.com" style={{ width: '100%', background: '#0a0a0a', border: '1px solid #ffffff12', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#fff', outline: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#ffffff12'} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Message</label>
              <textarea rows={4} placeholder="What can we help you with?" style={{ width: '100%', background: '#0a0a0a', border: '1px solid #ffffff12', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#fff', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
                onFocus={e => e.target.style.borderColor = '#f97316'}
                onBlur={e => e.target.style.borderColor = '#ffffff12'} />
            </div>
            <button type="submit" style={{ width: '100%', background: '#f97316', color: '#fff', fontWeight: 700, fontSize: 14, padding: '14px', borderRadius: 12, border: 'none', cursor: 'pointer', letterSpacing: '0.03em', boxShadow: '0 4px 24px rgba(249,115,22,0.3)', transition: 'background 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#ea6c0a'}
              onMouseLeave={e => e.currentTarget.style.background = '#f97316'}>
              Request a Callback →
            </button>
          </form>

        </div>
      </section>
    </>
  );
}
