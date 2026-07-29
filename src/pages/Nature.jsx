import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';

const highlights = [
  { icon: 'fa-tree', title: 'Forest Walks', desc: 'Immerse yourself in ancient forests teeming with wildlife and wonder.' },
  { icon: 'fa-binoculars', title: 'Wildlife Safari', desc: 'Spot exotic animals in their natural habitats with expert naturalists.' },
  { icon: 'fa-leaf', title: 'Eco Tours', desc: 'Sustainable travel experiences that protect and celebrate nature.' },
  { icon: 'fa-camera', title: 'Nature Photography', desc: 'Capture stunning landscapes and wildlife with guided photo tours.' },
  { icon: 'fa-star', title: 'Stargazing', desc: 'Marvel at pristine night skies far from city lights.' },
  { icon: 'fa-tint', title: 'Waterfall Treks', desc: 'Hike to hidden waterfalls through lush tropical landscapes.' },
];

const tours = [
  { img: '/images/destination-7.jpg', title: 'Amazon Rainforest', days: '8 Days', price: '₹99,999' },
  { img: '/images/destination-8.jpg', title: 'Serengeti Safari', days: '10 Days', price: '₹2,07,999' },
  { img: '/images/destination-9.jpg', title: 'Borneo Jungle', days: '7 Days', price: '₹91,499' },
];

export default function Nature() {
  return (
    <>
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_4.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Nature</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Nature</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Reconnect with the natural world around you</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">What Awaits You</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Nature Experiences</h2>
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
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">Popular Picks</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Nature Tours</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {tours.map(t => (
              <div key={t.title} className="group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow bg-white">
                <div
                  className="h-56 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                  style={{ backgroundImage: `url('${t.img}')` }}
                />
                <div className="p-5">
                  <h3 className="font-bold text-gray-900 text-lg">{t.title}</h3>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-sm text-gray-500"><i className="fa fa-clock-o mr-1 text-orange-500" />{t.days}</span>
                    <span className="text-orange-500 font-bold">{t.price}</span>
                  </div>
                  <Link to="/destination" className="mt-4 block text-center bg-orange-500 hover:bg-orange-600 text-white py-2.5 rounded-full text-sm font-semibold transition-colors">
                    Book Now
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
