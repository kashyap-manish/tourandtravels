import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

const highlights = [
  { icon: 'fa-bed', title: 'Luxury Hotels', desc: 'Stay in world-class hotels with exceptional service and amenities.' },
  { icon: 'fa-cutlery', title: 'Fine Dining', desc: 'Savor exquisite cuisine crafted by award-winning chefs.' },
  { icon: 'fa-coffee', title: 'Boutique Stays', desc: 'Discover charming boutique properties with unique local character.' },
  { icon: 'fa-glass', title: 'Rooftop Bars', desc: 'Enjoy cocktails with breathtaking city and skyline views.' },
  { icon: 'fa-star', title: 'Spa & Wellness', desc: 'Rejuvenate with world-class spa treatments and wellness programs.' },
  { icon: 'fa-users', title: 'Private Dining', desc: 'Exclusive private dining experiences in stunning settings.' },
];

const featured = [
  { img: '/images/hotel-resto-1.jpg', title: 'The Grand Palace Hotel', location: 'Paris, France', price: '₹29,000/night' },
  { img: '/images/hotel-resto-2.jpg', title: 'Ocean View Resort', location: 'Maldives', price: '₹43,000/night' },
  { img: '/images/hotel-resto-3.jpg', title: 'Mountain Lodge', location: 'Swiss Alps', price: '₹23,000/night' },
];

export default function HotelRestaurant() {
  return (
    <>
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Hotel & Restaurant</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Hotel & Restaurant</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Luxury stays and unforgettable dining experiences</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">What Awaits You</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Hotel & Dining Experiences</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {highlights.map(h => (
              <div key={h.title} className="bg-gray-50 rounded-2xl p-6 hover:shadow-lg transition-shadow group">
                <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <i className={`fa ${h.icon} text-white text-lg`} />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{h.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Featured Properties</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Top Hotels</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featured.map(t => (
              <div key={t.title} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                <div
                  className="h-56 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${t.img}')` }}
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{t.title}</h3>
                  <p className="text-sm text-gray-500 mt-1"><i className="fa fa-map-marker mr-1 text-orange-500" />{t.location}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-orange-500 font-bold">{t.price}</span>
                  </div>
                  <Link to="/hotel" className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-full text-sm font-semibold transition-colors">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
