import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';
import { fetchHotels } from '../services/geoapifyHotelApi';

const ITEMS_PER_PAGE = 6;

function starCount(raw) {
  const n = parseInt(raw);
  if (!n || n < 1) return 3;
  if (n > 5) return 5;
  return n;
}

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const [city, setCity] = useState('Philippines');

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchHotels(city)
      .then(data => setHotels(data))
      .catch(() => setError('Failed to load hotels.'))
      .finally(() => setLoading(false));
  }, [city]);

  const sorted = [...hotels].sort((a, b) => {
    if (sortBy === 'stars') return starCount(b.stars) - starCount(a.stars);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_3.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Hotels</span>
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Our Hotels</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Handpicked stays for every traveller — from luxury resorts to cozy boutique hotels</p>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-6 -mt-6 md:-mt-8 relative z-20">
        <SearchForm hotelOnly onHotelSearch={city => { setCity(city); setCurrentPage(1); }} />
      </section>

      {/* Filters & Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <span className="text-sm text-gray-400">{sorted.length} hotels found</span>
            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors bg-white"
            >
              <option value="default">Sort: Default</option>
              <option value="stars">Top Rated</option>
            </select>
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {error && <p className="text-center text-red-500 py-10">{error}</p>}

          {!loading && !error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginated.map((h, i) => (
                  <HotelCard
                    key={i}
                    name={h.name}
                    location={h.location}
                    stars={starCount(h.stars)}
                    price={null}
                    tag="Hotel"
                    amenities={[
                      h.phone ? `📞 ${h.phone}` : null,
                      h.website ? '🌐 Website' : null,
                      h.address ? `📍 ${h.address}` : null,
                    ].filter(Boolean).slice(0, 3)}
                    website={h.website}
                  />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-12">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="fa fa-chevron-left text-xs" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all
                        ${currentPage === i + 1
                          ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                          : 'border-gray-200 text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                        }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <i className="fa fa-chevron-right text-xs" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <CallToAction />
    </>
  );
}
