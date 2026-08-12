import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import TourCard from '../components/TourCard';
import api from '../services/api';

const highlights = [
  { icon: 'fa-umbrella', title: 'Beach Relaxation', desc: 'Unwind on pristine white sand beaches with crystal clear waters.' },
  { icon: 'fa-ship', title: 'Snorkeling & Diving', desc: 'Discover vibrant coral reefs and marine life beneath the surface.' },
  { icon: 'fa-sun-o', title: 'Sunset Cruises', desc: 'Sail into golden sunsets on romantic evening boat tours.' },
  { icon: 'fa-life-ring', title: 'Surfing Lessons', desc: 'Catch your first wave with certified surf instructors.' },
  { icon: 'fa-anchor', title: 'Island Hopping', desc: 'Explore multiple islands in a single unforgettable day trip.' },
  { icon: 'fa-cutlery', title: 'Beach Dining', desc: 'Savor fresh seafood with your feet in the sand.' },
];

export default function Beach() {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/tours', { params: { category: 'Beach' } })
      .then(r => setTours(r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_3.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Beach</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Beach</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Sun, sand, and endless ocean horizons</p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-xs">What Awaits You</span>
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Beach Experiences</h2>
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
            <h2 className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900">Beach Tours</h2>
          </div>
          {loading ? (
            <div className="row">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="col-12 col-md-4">
                  <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/2" />
                      <div className="h-9 bg-gray-200 rounded-xl mt-4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : tours.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <i className="fa fa-umbrella text-4xl mb-3 block" />
              <p>No beach tours available right now.</p>
            </div>
          ) : (
            <div className="row">
              {tours.map((t, i) => (
                <div key={t._id || i} className="col-12 col-md-4">
                  <TourCard {...t} rank={i} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <CallToAction />
    </>
  );
}
