import { useState } from 'react';
import TourCard from '../components/TourCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';
import { Link } from 'react-router-dom';

const tours = [
  { img: '/images/destination-1.jpg', price: '₹12,500/person', days: '5 Days Tour', title: 'Golden Triangle', location: 'Delhi, Agra & Jaipur, India', features: ['🚿 2', '🛏 3', '🏛 Heritage'], category: 'Culture' },
  { img: '/images/destination-2.jpg', price: '₹8,999/person', days: '4 Days Tour', title: 'Goa Beach Getaway', location: 'Goa, India', features: ['🚿 2', '🛏 2', '🏖 Near Beach'], category: 'Beach' },
  { img: '/images/destination-3.jpg', price: '₹15,000/person', days: '7 Days Tour', title: 'Kerala Backwaters', location: 'Alleppey, Kerala, India', features: ['🚿 2', '🛏 3', '🌿 Nature'], category: 'Nature' },
  { img: '/images/destination-4.jpg', price: '₹18,500/person', days: '8 Days Tour', title: 'Ladakh Adventure', location: 'Leh-Ladakh, India', features: ['🚿 1', '🛏 2', '⛰ Near Mountain'], category: 'Adventure' },
  { img: '/images/destination-5.jpg', price: '₹9,500/person', days: '5 Days Tour', title: 'Varanasi Spiritual Tour', location: 'Varanasi, Uttar Pradesh, India', features: ['🚿 2', '🛏 2', '🏛 Heritage'], category: 'Culture' },
  { img: '/images/destination-6.jpg', price: '₹11,000/person', days: '6 Days Tour', title: 'Manali Snow Escape', location: 'Manali, Himachal Pradesh, India', features: ['🚿 2', '🛏 3', '⛰ Near Mountain'], category: 'Adventure' },
  { img: '/images/destination-7.jpg', price: '₹7,500/person', days: '4 Days Tour', title: 'Andaman Islands', location: 'Port Blair, Andaman, India', features: ['🚿 2', '🛏 2', '🏖 Near Beach'], category: 'Beach' },
  { img: '/images/destination-8.jpg', price: '₹13,000/person', days: '6 Days Tour', title: 'Rajasthan Desert Safari', location: 'Jaisalmer, Rajasthan, India', features: ['🚿 1', '🛏 2', '🌅 Desert'], category: 'Adventure' },
  { img: '/images/destination-9.jpg', price: '₹10,500/person', days: '5 Days Tour', title: 'Coorg Coffee Trails', location: 'Coorg, Karnataka, India', features: ['🚿 2', '🛏 3', '🌿 Nature'], category: 'Nature' },
  { img: '/images/destination-10.jpg', price: '₹14,000/person', days: '7 Days Tour', title: 'Darjeeling & Sikkim', location: 'Darjeeling, West Bengal, India', features: ['🚿 2', '🛏 2', '⛰ Near Mountain'], category: 'Nature' },
  { img: '/images/destination-11.jpg', price: '₹16,500/person', days: '8 Days Tour', title: 'Spiti Valley Expedition', location: 'Spiti, Himachal Pradesh, India', features: ['🚿 1', '🛏 2', '⛰ Near Mountain'], category: 'Adventure' },
  { img: '/images/destination-12.jpg', price: '₹8,000/person', days: '4 Days Tour', title: 'Pondicherry Coastal Tour', location: 'Pondicherry, India', features: ['🚿 2', '🛏 2', '🏖 Near Beach'], category: 'Beach' },
];

const categories = ['All', 'Beach', 'Adventure', 'Nature', 'Culture'];
const ITEMS_PER_PAGE = 9;

export default function Destination() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = tours.filter(t => activeCategory === 'All' || t.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    const priceA = parseInt(a.price.replace(/\D/g, ''));
    const priceB = parseInt(b.price.replace(/\D/g, ''));
    if (sortBy === 'price-asc') return priceA - priceB;
    if (sortBy === 'price-desc') return priceB - priceA;
    return 0;
  });

  const totalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
  const paginated = sorted.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategory = (cat) => { setActiveCategory(cat); setCurrentPage(1); };

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_2.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Destinations</span>
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight">Tour Destinations</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Explore our handpicked tours across the world's most breathtaking destinations</p>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
        <SearchForm />
      </section>

      {/* Filters & Results */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">

          {/* Filter bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 border
                    ${activeCategory === cat
                      ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-orange-300 hover:text-orange-500'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-400">{sorted.length} tours found</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors bg-white"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((t, i) => <TourCard key={i} {...t} />)}
          </div>

          {/* Pagination */}
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
        </div>
      </section>

      <CallToAction />
    </>
  );
}
