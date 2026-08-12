import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';
import { fetchHotels } from '../services/geoapifyHotelApi';
import useInView from '../hooks/useInView';

const ITEMS_PER_PAGE = 8;

function starCount(raw) {
  const n = parseInt(raw);
  if (!n || n < 1) return 3;
  if (n > 5) return 5;
  return n;
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded-full w-3/4" />
        <div className="h-3 bg-gray-100 rounded-full w-1/2" />
        <div className="flex gap-2 pt-1">
          <div className="h-6 w-20 bg-orange-50 rounded-full" />
          <div className="h-6 w-24 bg-orange-50 rounded-full" />
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div className="h-3 w-20 bg-gray-100 rounded-full" />
          <div className="h-8 w-20 bg-gray-200 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

const STAR_FILTERS = [
  { label: 'All', value: 0 },
  { label: '5 ★', value: 5 },
  { label: '4 ★', value: 4 },
  { label: '3 ★', value: 3 },
];

const STATS = [
  { icon: 'fa-building', value: '500+', label: 'Hotels Listed' },
  { icon: 'fa-map-marker', value: '80+', label: 'Destinations' },
  { icon: 'fa-star', value: '4.8', label: 'Avg. Rating' },
  { icon: 'fa-users', value: '50K+', label: 'Happy Guests' },
];

export default function Hotel() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('default');
  const [starFilter, setStarFilter] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [city, setCity] = useState('Philippines');

  const [gridRef, gridInView] = useInView();
  const gridSectionRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchHotels(city)
      .then(data => setHotels(data))
      .catch(() => setError('Failed to load hotels. Please try again.'))
      .finally(() => setLoading(false));
  }, [city]);

  const filtered = hotels.filter(h => starFilter === 0 || starCount(h.stars) === starFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'stars') return starCount(b.stars) - starCount(a.stars);
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (newCity) => { setCity(newCity); setCurrentPage(1); setStarFilter(0); };

  const DESTINATIONS = [
    { city: 'Manila', img: 'https://images.unsplash.com/photo-1555990793-da11153b2473?w=400&h=300&fit=crop', badge: '🏙️', highlight: 'City of Dreams' },
    { city: 'Cebu', img: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=400&h=300&fit=crop', badge: '🌊', highlight: 'Queen City' },
    { city: 'Boracay', img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop', badge: '🏖️', highlight: 'White Beach' },
    { city: 'Palawan', img: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=400&h=300&fit=crop', badge: '🌴', highlight: 'Island Paradise' },
    { city: 'Davao', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop', badge: '🦅', highlight: 'Eagle Country' },
    { city: 'Baguio', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop', badge: '🌿', highlight: 'Summer Capital' },
  ];

  const cityCount = (c) => hotels.filter(h => h.location?.toLowerCase().includes(c.toLowerCase())).length;
  const handleStarFilter = (v) => { setStarFilter(v); setCurrentPage(1); };

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/bg_3.jpg')", minHeight: '60vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-orange-950/40" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />

        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <i className="fa fa-building" /> Handpicked Stays
          </div>
          <p className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Hotels</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Find Your <span className="text-orange-400">Perfect Stay</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
            From luxury resorts to cozy boutique hotels — discover handpicked accommodations across the Philippines.
          </p>
        </div>

      </section>

      {/* Stats bar */}
      <div className="bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-3 text-white">
                <i className={`fa ${s.icon} text-orange-400 text-lg mb-1`} />
                <span className="text-xl font-extrabold">{s.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Search ── */}
      <section className="max-w-7xl mx-auto px-6 py-8 relative z-20">
        <SearchForm hotelOnly onHotelSearch={handleSearch} />
      </section>

            {/* ── Filters & Grid ── */}
      <section className="py-14" ref={gridSectionRef}>
        <div className="max-w-7xl mx-auto px-6">

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs text-gray-400 font-medium mr-1">Filter by stars:</span>
              {STAR_FILTERS.map(f => (
                <button
                  key={f.value}
                  onClick={() => handleStarFilter(f.value)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full border transition-all duration-200 ${
                    starFilter === f.value
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500'
                  }`}
                >
                  {f.label}
                </button>
              ))}
              {!loading && (
                <span className="text-xs text-gray-400 ml-2">
                  <span className="font-semibold text-gray-700">{sorted.length}</span> hotels found
                </span>
              )}
            </div>

            <select
              value={sortBy}
              onChange={e => { setSortBy(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors bg-white cursor-pointer"
            >
              <option value="default">Sort: Default</option>
              <option value="stars">Top Rated</option>
              <option value="name">Name A–Z</option>
            </select>
          </div>

          {/* Skeleton */}
          {loading && (
            <div className="row">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3"><SkeletonCard /></div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <i className="fa fa-exclamation-triangle text-red-400 text-2xl" />
              </div>
              <p className="text-gray-700 font-semibold mb-1">Something went wrong</p>
              <p className="text-sm text-gray-400">{error}</p>
            </div>
          )}

          {!loading && !error && (
            <>
              {/* Empty state */}
              {sorted.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                    <i className="fa fa-building text-orange-300 text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No hotels found</h3>
                  <p className="text-sm text-gray-400 max-w-xs">Try adjusting your filters or searching a different city.</p>
                  <button onClick={() => { setStarFilter(0); setSortBy('default'); }} className="mt-5 text-sm text-orange-500 font-semibold hover:underline">
                    Clear filters
                  </button>
                </div>
              ) : (
                <div
                  ref={gridRef}
                  className={`row ${gridInView ? 'animate-fade-up' : ''}`}
                >
                  {paginated.map((h, i) => (
                    <div key={i} className="col-12 col-sm-6 col-lg-4 col-xl-3" style={{ animationDelay: `${(i % 8) * 0.07}s` }}>
                      <HotelCard
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
                    </div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-14">
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

      {/* ── Why Choose Us ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Why Book With Us</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">The Pacific Advantage</h2>
          </div>
          <div className="row">
            {[
              { icon: 'fa-ban', color: 'bg-blue-50 text-blue-500', title: 'Free Cancellation', desc: 'Cancel up to 48 hours before check-in at no charge.' },
              { icon: 'fa-tag', color: 'bg-green-50 text-green-500', title: 'Best Price Guarantee', desc: "Find a lower price? We'll match it, no questions asked." },
              { icon: 'fa-headphones', color: 'bg-orange-50 text-orange-500', title: '24/7 Support', desc: 'Our travel experts are available around the clock for you.' },
              { icon: 'fa-shield', color: 'bg-purple-50 text-purple-500', title: 'Verified Hotels', desc: 'Every property is personally vetted for quality and comfort.' },
            ].map((f, i) => (
              <div key={i} className="col-12 col-sm-6 col-lg-3 bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${f.color}`}>
                  <i className={`fa ${f.icon}`} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Top Destinations ── */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Popular Picks</span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Top Hotel Destinations</h2>
            </div>
            <span className="text-xs text-gray-400 hidden sm:block">Click to explore hotels →</span>
          </div>

          {/* Mobile: horizontal scroll | Desktop: grid */}
          <div className="flex gap-4 overflow-x-auto pb-4 sm:overflow-visible sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:pb-0" style={{ scrollSnapType: 'x mandatory' }}>
            {DESTINATIONS.map((d, i) => {
              const count = cityCount(d.city);
              const isActive = city === d.city;
              return (
                <button
                  key={i}
                  onClick={() => {
                    handleSearch(d.city);
                    setTimeout(() => gridSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                  }}
                  className={`group relative shrink-0 w-44 sm:w-auto h-56 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-2 ${
                    isActive ? 'border-orange-500 shadow-orange-500/30 shadow-lg -translate-y-1' : 'border-transparent'
                  }`}
                  style={{ scrollSnapAlign: 'start' }}
                >
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500" style={{ backgroundImage: `url('${d.img}')` }} />
                  <div className={`absolute inset-0 transition-all duration-300 ${
                    isActive ? 'bg-gradient-to-t from-orange-900/80 via-orange-800/20 to-transparent' : 'bg-gradient-to-t from-black/80 via-black/20 to-transparent'
                  }`} />

                  {/* Active checkmark */}
                  {isActive && (
                    <div className="absolute top-3 left-3 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                      <i className="fa fa-check text-white text-[10px]" />
                    </div>
                  )}

                  {/* Hover tooltip */}
                  <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white text-[9px] font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {d.highlight}
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white text-left">
                    <div className="text-xl mb-1">{d.badge}</div>
                    <div className="font-bold text-sm">{d.city}</div>
                    <div className="text-[10px] text-gray-300">
                      {!loading && count > 0 ? `${count} Hotels` : loading ? '...' : `${d.city} Hotels`}
                    </div>
                  </div>

                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-14 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-10">
            <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Guest Reviews</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">What Our Guests Say</h2>
          </div>
          <div className="row">
            {[
              { name: 'Sarah M.', location: 'Manila', avatar: 'https://i.pravatar.cc/80?img=47', rating: 5, text: 'Absolutely stunning hotel! The views were breathtaking and the staff went above and beyond. Will definitely book again through Pacific.' },
              { name: 'James R.', location: 'Cebu', avatar: 'https://i.pravatar.cc/80?img=12', rating: 5, text: "Best booking experience I've had. Found a 5-star resort at an unbeatable price. The free cancellation policy gave me total peace of mind." },
              { name: 'Anika L.', location: 'Boracay', avatar: 'https://i.pravatar.cc/80?img=32', rating: 4, text: "The beachfront hotel was exactly as described. Pacific's 24/7 support helped me sort a last-minute room change instantly. Highly recommend!" },
            ].map((r, i) => (
              <div key={i} className="col-12 col-md-4 bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors duration-300">
                <div className="flex items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <i key={j} className={`fa fa-star text-xs ${j < r.rating ? 'text-yellow-400' : 'text-white/20'}`} />
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40" />
                  <div>
                    <div className="text-white font-semibold text-sm">{r.name}</div>
                    <div className="text-gray-500 text-xs flex items-center gap-1">
                      <i className="fa fa-map-marker text-orange-400 text-[10px]" />{r.location}
                    </div>
                  </div>
                  <div className="ml-auto">
                    <i className="fa fa-quote-right text-orange-500/30 text-3xl" />
                  </div>
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
