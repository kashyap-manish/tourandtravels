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

export default function CallUs() {
  return (
    <>
      <PageHero title="Call Us" breadcrumb="Call Us" />

      <section className="py-20">
        <div className="max-w-5xl mx-auto px-6">

          {/* Top contact strip */}
          <div className="grid sm:grid-cols-3 gap-6 mb-16">
            {[
              { icon: 'fa-phone', label: 'Phone', value: '+1 392 3929 210', href: 'tel:+13923929210', color: 'bg-blue-500/10 text-blue-500' },
              { icon: 'fa-envelope', label: 'Email', value: 'info@yourdomain.com', href: 'mailto:info@yourdomain.com', color: 'bg-orange-500/10 text-orange-500' },
              { icon: 'fa-whatsapp', label: 'WhatsApp', value: '+1 392 3929 210', href: 'https://wa.me/13923929210', color: 'bg-green-500/10 text-green-500' },
            ].map(c => (
              <a key={c.label} href={c.href} className="flex flex-col items-center text-center p-7 border border-gray-100 rounded-2xl hover:border-orange-200 hover:shadow-md transition-all group">
                <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center mb-4`}>
                  <i className={`fa ${c.icon} text-lg`} />
                </div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">{c.label}</p>
                <p className="font-semibold text-gray-800 text-sm group-hover:text-orange-500 transition-colors">{c.value}</p>
              </a>
            ))}
          </div>

          {/* Offices */}
          <h3 className="font-extrabold text-gray-900 text-2xl mb-6">Our Offices</h3>
          <div className="grid md:grid-cols-2 gap-6 mb-16">
            {offices.map(o => (
              <div key={o.city} className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-44 bg-cover bg-center" style={{ backgroundImage: `url('${o.img}')` }} />
                <div className="p-6">
                  <h4 className="font-bold text-gray-900 text-lg mb-4">{o.city} Office</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-sm text-gray-500">
                      <i className="fa fa-map-marker text-orange-400 mt-0.5 w-4 text-center" />
                      {o.address}
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-500">
                      <i className="fa fa-phone text-orange-400 w-4 text-center" />
                      <a href={`tel:${o.phone.replace(/\s/g, '')}`} className="hover:text-orange-500 transition-colors">{o.phone}</a>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-500">
                      <i className="fa fa-envelope text-orange-400 w-4 text-center" />
                      <a href={`mailto:${o.email}`} className="hover:text-orange-500 transition-colors">{o.email}</a>
                    </li>
                    <li className="flex items-center gap-3 text-sm text-gray-500">
                      <i className="fa fa-clock-o text-orange-400 w-4 text-center" />
                      {o.hours}
                    </li>
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Quick message form */}
          <div className="bg-gray-950 rounded-2xl p-10 text-white">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-xs">Quick Message</span>
            <h3 className="text-2xl font-extrabold mt-2 mb-8">Prefer to write? We'll call you back.</h3>
            <form className="grid sm:grid-cols-2 gap-5" onSubmit={e => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Your Name</label>
                <input type="text" placeholder="John Doe" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
                <input type="tel" placeholder="+1 234 567 890" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Message</label>
                <textarea rows="4" placeholder="What can we help you with?" className="w-full bg-white/10 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 outline-none focus:border-orange-500 transition-colors resize-none" />
              </div>
              <div className="sm:col-span-2">
                <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3.5 rounded-xl transition-colors shadow-lg shadow-orange-500/20">
                  Request a Callback
                </button>
              </div>
            </form>
          </div>

        </div>
      </section>
    </>
  );
}
