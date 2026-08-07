import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCategory, setSortBy, setPage, loadDestinations } from '../store/toursSlice';
import TourCard from '../components/TourCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';
import { Link, useSearchParams } from 'react-router-dom';

const featured = [
  { img: '/images/destination-1.jpg', name: 'Goa',       country: 'India', tours: 14, tag: 'Trending',  desc: 'Sun-soaked beaches, vibrant nightlife and Portuguese heritage.' },
  { img: '/images/destination-2.jpg', name: 'Manali',    country: 'India', tours: 9,  tag: 'Adventure', desc: 'Snow-capped peaks, river rafting and mountain serenity.' },
  { img: '/images/destination-3.jpg', name: 'Kerala',    country: 'India', tours: 11, tag: 'Nature',    desc: 'Backwaters, spice gardens and tranquil houseboat stays.' },
  { img: '/images/destination-4.jpg', name: 'Rajasthan', country: 'India', tours: 16, tag: 'Culture',   desc: 'Royal palaces, desert safaris and timeless Rajput heritage.' },
  { img: '/images/destination-5.jpg', name: 'Andaman',   country: 'India', tours: 7,  tag: 'Beach',     desc: 'Crystal-clear waters, coral reefs and untouched island life.' },
];

const tagColors = {
  Trending:  'bg-orange-500',
  Adventure: 'bg-red-500',
  Nature:    'bg-green-600',
  Culture:   'bg-purple-600',
  Beach:     'bg-sky-500',
};

const moods = [
  { icon: 'fa-sun-o',      label: 'Sun & Beach',   color: 'bg-amber-50   text-amber-600   border-amber-200'   },
  { icon: 'fa-bolt',       label: 'Adventure',     color: 'bg-red-50     text-red-600     border-red-200'     },
  { icon: 'fa-leaf',       label: 'Nature Escape', color: 'bg-green-50   text-green-600   border-green-200'   },
  { icon: 'fa-camera',     label: 'Photography',   color: 'bg-purple-50  text-purple-600  border-purple-200'  },
  { icon: 'fa-heart',      label: 'Honeymoon',     color: 'bg-pink-50    text-pink-600    border-pink-200'    },
  { icon: 'fa-users',      label: 'Family Fun',    color: 'bg-blue-50    text-blue-600    border-blue-200'    },
  { icon: 'fa-university', label: 'Culture',       color: 'bg-orange-50  text-orange-600  border-orange-200'  },
  { icon: 'fa-snowflake-o',label: 'Winter Trips',  color: 'bg-sky-50     text-sky-600     border-sky-200'     },
];

function FeaturedCard({ img, name, country, tours, tag, desc, className = '' }) {
  return (
    <div className={`relative overflow-hidden rounded-2xl cursor-pointer group ${className}`}>
      {/* Image */}
      <div
        className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-700"
        style={{ backgroundImage: `url('${img}')` }}
      />
      {/* Base gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      {/* Hover reveal panel */}
      <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out bg-black/70 backdrop-blur-sm p-4">
        <p className="text-white text-xs leading-relaxed mb-3">{desc}</p>
        <button className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
          Explore <i className="fa fa-arrow-right" />
        </button>
      </div>
      {/* Static bottom info */}
      <div className="absolute bottom-0 left-0 p-4 group-hover:opacity-0 transition-opacity duration-300">
        <p className="text-white font-bold text-lg leading-tight">{name}</p>
        <p className="text-gray-300 text-xs">{country}</p>
      </div>
      {/* Tag badge */}
      <div className="absolute top-3 left-3">
        <span className={`${tagColors[tag]} text-white text-[10px] font-bold px-2.5 py-1 rounded-full`}>{tag}</span>
      </div>
      {/* Tour count */}
      <div className="absolute top-3 right-3">
        <span className="bg-black/50 backdrop-blur-sm text-white text-[10px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
          <i className="fa fa-map-marker text-orange-400" />
          {tours} Tours
        </span>
      </div>
      {/* Hover ring */}
      <div className="absolute inset-0 ring-2 ring-white/0 group-hover:ring-orange-500/70 rounded-2xl transition-all duration-300" />
    </div>
  );
}

const categories = [
  { label: 'All', icon: 'fa-globe' },
  { label: 'Beach', icon: 'fa-umbrella' },
  { label: 'Adventure', icon: 'fa-bolt' },
  { label: 'Nature', icon: 'fa-leaf' },
  { label: 'Culture', icon: 'fa-university' },
];

const ITEMS_PER_PAGE = 9;

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-56 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="h-3 bg-gray-100 rounded w-1/3" />
        <div className="h-9 bg-gray-200 rounded-xl mt-4" />
      </div>
    </div>
  );
}

function StatBadge({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3 px-6 py-4 border-r border-white/10 last:border-0">
      <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center shrink-0">
        <i className={`fa ${icon} text-orange-400`} />
      </div>
      <div>
        <p className="text-white font-bold text-lg leading-none">{value}</p>
        <p className="text-gray-400 text-xs mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function Destination() {
  const dispatch = useDispatch();
  const { activeCategory, sortBy, currentPage, destinations, loading, error } = useSelector(s => s.tours);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchParams] = useSearchParams();
  const country = searchParams.get('country');

  useEffect(() => { dispatch(loadDestinations(country || 'India')); }, [dispatch, country]);

  const filtered = destinations.filter(t => activeCategory === 'All' || t.category === activeCategory);
  const sorted = [...filtered].sort((a, b) => {
    const pA = parseInt(a.price.replace(/\D/g, ''));
    const pB = parseInt(b.price.replace(/\D/g, ''));
    if (sortBy === 'price-asc') return pA - pB;
    if (sortBy === 'price-desc') return pB - pA;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategory = (cat) => {
    dispatch(setCategory(cat));
    setFiltersOpen(false);
  };

  // Pagination with ellipsis
  const getPages = () => {
    if (totalPages <= 7) return [...Array(totalPages)].map((_, i) => i + 1);
    if (currentPage <= 4) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 3) return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
  };

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col justify-end bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '58vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/20" />

        <div className="relative z-10 text-center text-white pb-10 px-4">
          <p className="text-xs mb-4 flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-[10px] text-orange-500" />
            <span className="text-white">Destinations</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Explore <span className="text-orange-500">Destinations</span>
          </h1>
          <p className="mt-3 text-gray-300 text-base max-w-lg mx-auto">
            Handpicked tours across the world's most breathtaking places
          </p>
        </div>

        {/* Stats bar */}
        <div className="relative z-10 bg-white/5 backdrop-blur-md border-t border-white/10">
          <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            <StatBadge icon="fa-map-marker" value="120+" label="Destinations" />
            <StatBadge icon="fa-users" value="50K+" label="Happy Travelers" />
            <StatBadge icon="fa-star" value="4.9★" label="Avg. Rating" />
            <StatBadge icon="fa-shield" value="100%" label="Safe & Secure" />
          </div>
        </div>
      </section>

      {/* ── Search ── */}
      <section className="bg-white py-8 shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <SearchForm tourOnly />
        </div>
      </section>

      {/* ── Featured Destinations Mosaic ── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold text-orange-500 uppercase tracking-widest mb-1">Top Picks</p>
              <h2 className="text-3xl font-extrabold text-gray-900">Featured <span className="text-orange-500">Destinations</span></h2>
            </div>
            <Link to="#tours" className="hidden sm:flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-orange-500 transition-colors">
              View all <i className="fa fa-arrow-right text-xs" />
            </Link>
          </div>

          {/* Bento grid — asymmetric 3-col layout */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {/* Row 1: tall hero left + 2 stacked right */}
            <div className="row-span-2 h-[480px] md:h-auto">
              <FeaturedCard {...featured[0]} className="h-full min-h-[480px]" />
            </div>
            <FeaturedCard {...featured[1]} className="h-[230px]" />
            <FeaturedCard {...featured[2]} className="h-[230px]" />
            {/* Row 2: 2 wide cards */}
            <FeaturedCard {...featured[3]} className="h-[230px]" />
            <FeaturedCard {...featured[4]} className="h-[230px]" />
          </div>
        </div>
      </section>

      {/* ── Travel Moods Strip ── */}
      <section className="py-8 bg-gray-50 border-y border-gray-100" id="tours">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Browse by Mood</p>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {moods.map(({ icon, label, color }) => (
              <button
                key={label}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full border text-sm font-semibold whitespace-nowrap transition-all duration-200 hover:scale-105 hover:shadow-md ${color}`}
              >
                <i className={`fa ${icon}`} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-14 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">

          {/* Top bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {activeCategory === 'All' ? 'All Tours' : `${activeCategory} Tours`}
              </h2>
              <p className="text-sm text-gray-400 mt-0.5">
                {loading ? 'Loading…' : `${sorted.length} tours available`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setFiltersOpen(v => !v)}
                className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600 hover:border-orange-400 transition-colors"
              >
                <i className="fa fa-sliders" />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={e => dispatch(setSortBy(e.target.value))}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors bg-white shadow-sm"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
              </select>
            </div>
          </div>

          <div className="flex gap-8">
            {/* ── Sidebar Filters ── */}
            <aside className={`
              ${filtersOpen ? 'block' : 'hidden'} sm:block
              w-full sm:w-56 shrink-0
            `}>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-24">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Category</p>
                <div className="flex flex-col gap-1">
                  {categories.map(({ label, icon }) => (
                    <button
                      key={label}
                      onClick={() => handleCategory(label)}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${activeCategory === label
                          ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20'
                          : 'text-gray-500 hover:bg-orange-50 hover:text-orange-500'
                        }`}
                    >
                      <i className={`fa ${icon} w-4 text-center`} />
                      {label}
                    </button>
                  ))}
                </div>

                <hr className="my-5 border-gray-100" />

                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Why Book With Us</p>
                {[
                  { icon: 'fa-check-circle', text: 'Best Price Guarantee' },
                  { icon: 'fa-headphones', text: '24/7 Support' },
                  { icon: 'fa-lock', text: 'Secure Payments' },
                  { icon: 'fa-undo', text: 'Free Cancellation' },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2.5 text-sm text-gray-500 mb-2.5">
                    <i className={`fa ${icon} text-orange-400`} />
                    {text}
                  </div>
                ))}
              </div>
            </aside>

            {/* ── Grid ── */}
            <div className="flex-1 min-w-0">
              {error && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <i className="fa fa-exclamation-circle text-4xl text-red-400 mb-3" />
                  <p className="text-gray-500">{error}</p>
                </div>
              )}

              {loading && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
                </div>
              )}

              {!loading && !error && paginated.length === 0 && (
                <div className="flex flex-col items-center justify-center py-24 text-center">
                  <i className="fa fa-search text-4xl text-gray-300 mb-3" />
                  <p className="text-gray-500 font-semibold">No tours found</p>
                  <p className="text-gray-400 text-sm mt-1">Try a different category or search term</p>
                </div>
              )}

              {!loading && !error && paginated.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginated.map((t, i) => <TourCard key={t._id || i} {...t} rank={i} />)}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-1.5 mt-12">
                  <button
                    onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <i className="fa fa-chevron-left text-xs" />
                  </button>

                  {getPages().map((p, i) =>
                    p === '...'
                      ? <span key={`e${i}`} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>
                      : (
                        <button
                          key={p}
                          onClick={() => dispatch(setPage(p))}
                          className={`w-10 h-10 flex items-center justify-center rounded-xl text-sm font-semibold border transition-all shadow-sm
                            ${currentPage === p
                              ? 'bg-orange-500 text-white border-orange-500 shadow-orange-500/20'
                              : 'bg-white border-gray-200 text-gray-600 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                            }`}
                        >
                          {p}
                        </button>
                      )
                  )}

                  <button
                    onClick={() => dispatch(setPage(Math.min(totalPages, currentPage + 1)))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 flex items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-sm"
                  >
                    <i className="fa fa-chevron-right text-xs" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
