import { Link } from 'react-router-dom';

const sitemapSections = [
  {
    title: 'Main Pages',
    icon: 'fa-home',
    links: [
      { label: 'Home', to: '/' },
      { label: 'About Us', to: '/about' },
      { label: 'Destinations', to: '/destination' },
      { label: 'Hotels', to: '/hotel' },
      { label: 'Flights', to: '/flight' },
      { label: 'Blog', to: '/blog' },
      { label: 'Contact Us', to: '/contact' },
    ],
  },
  {
    title: 'Experiences',
    icon: 'fa-compass',
    links: [
      { label: 'Adventure', to: '/experience/adventure' },
      { label: 'Hotel & Restaurant', to: '/experience/hotel-restaurant' },
      { label: 'Beach', to: '/experience/beach' },
      { label: 'Nature', to: '/experience/nature' },
      { label: 'Camping', to: '/experience/camping' },
      { label: 'Party', to: '/experience/party' },
    ],
  },
  {
    title: 'Destinations',
    icon: 'fa-map-marker',
    links: [
      { label: 'Philippines', to: '/destination?country=philippines' },
      { label: 'Canada', to: '/destination?country=canada' },
      { label: 'Thailand', to: '/destination?country=thailand' },
      { label: 'Australia', to: '/destination?country=australia' },
      { label: 'Greece', to: '/destination?country=greece' },
      { label: 'India', to: '/destination?country=india' },
    ],
  },
  {
    title: 'Account',
    icon: 'fa-user',
    links: [
      { label: 'Login', to: '/login' },
      { label: 'Register', to: '/register' },
      { label: 'My Profile', to: '/profile' },
      { label: 'My Bookings', to: '/bookings' },
    ],
  },
  {
    title: 'Support & Information',
    icon: 'fa-info-circle',
    links: [
      { label: 'Online Enquiry', to: '/online-enquiry' },
      { label: 'General Enquiries', to: '/general-enquiries' },
      { label: 'Call Us', to: '/call-us' },
      { label: 'Booking Conditions', to: '/booking-conditions' },
    ],
  },
  {
    title: 'Legal',
    icon: 'fa-shield',
    links: [
      { label: 'Privacy Policy', to: '/privacy-policy' },
      { label: 'Refund Policy', to: '/refund-policy' },
      { label: 'Terms of Service', to: '/terms-of-service' },
      { label: 'Sitemap', to: '/sitemap' },
    ],
  },
];

export default function Sitemap() {
  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '45vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-14 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Sitemap</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Sitemap</h1>
          <p className="mt-3 text-gray-300 max-w-xl mx-auto">A complete overview of all pages on the Pacific Travel Agency website</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sitemapSections.map((section) => (
            <div key={section.title} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center shrink-0">
                  <i className={`fa ${section.icon} text-white`} />
                </div>
                <h2 className="font-bold text-gray-900">{section.title}</h2>
              </div>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="group flex items-center gap-2 text-sm text-gray-500 hover:text-orange-500 transition-colors"
                    >
                      <i className="fa fa-chevron-right text-[10px] text-orange-400/50 group-hover:text-orange-500 transition-colors" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

