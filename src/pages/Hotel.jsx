import { useState } from 'react';
import { Link } from 'react-router-dom';
import HotelCard from '../components/HotelCard';
import SearchForm from '../components/SearchForm';
import CallToAction from '../components/CallToAction';

const hotels = [
  {
    img: '/images/hotel-resto-1.jpg',
    name: 'The Grand Palazzo', location: 'Manila, Philippines',
    stars: 5, price: '$320', tag: 'Luxury',
    amenities: ['🏊 Pool', '🍽 Restaurant', '💆 Spa', '🅿 Parking'],
    category: 'Luxury',
  },
  {
    img: '/images/hotel-resto-2.jpg',
    name: 'Azure Beachfront Resort', location: 'Boracay, Philippines',
    stars: 5, price: '$280', tag: 'Beachfront',
    amenities: ['🏖 Beach Access', '🍹 Bar', '🏊 Pool', '🤿 Water Sports'],
    category: 'Resort',
  },
  {
    img: '/images/hotel-resto-3.jpg',
    name: 'Cebu Heritage Inn', location: 'Cebu City, Philippines',
    stars: 4, price: '$150', tag: 'Best Value',
    amenities: ['🍽 Restaurant', '📶 Free WiFi', '🅿 Parking', '🏋 Gym'],
    category: 'Business',
  },
  {
    img: '/images/hotel-resto-4.jpg',
    name: 'Palawan Eco Lodge', location: 'El Nido, Palawan',
    stars: 4, price: '$195', tag: 'Eco-Friendly',
    amenities: ['🌿 Nature View', '🚣 Kayaking', '🍽 Restaurant', '📶 Free WiFi'],
    category: 'Resort',
  },
  {
    img: '/images/hotel-resto-5.jpg',
    name: 'Skyline Business Hotel', location: 'Makati, Philippines',
    stars: 4, price: '$175', tag: 'Business',
    amenities: ['🏋 Gym', '📶 Free WiFi', '🍽 Restaurant', '🅿 Parking'],
    category: 'Business',
  },
  {
    img: '/images/hotel-resto-6.jpg',
    name: 'Siargao Surf & Stay', location: 'Siargao Island, Philippines',
    stars: 3, price: '$110', tag: 'Popular',
    amenities: ['🏄 Surf Lessons', '🍹 Bar', '📶 Free WiFi', '🚲 Bike Rental'],
    category: 'Budget',
  },
  {
    img: '/images/hotel-resto-7.jpg',
    name: 'Bohol Tranquil Villas', location: 'Bohol, Philippines',
    stars: 4, price: '$210', tag: 'Scenic View',
    amenities: ['🌅 Sea View', '🏊 Pool', '🍽 Restaurant', '💆 Spa'],
    category: 'Resort',
  },
  {
    img: '/images/hotel-resto-8.jpg',
    name: 'Metro Boutique Hotel', location: 'Quezon City, Philippines',
    stars: 3, price: '$95', tag: 'Budget Pick',
    amenities: ['📶 Free WiFi', '🍽 Breakfast', '🅿 Parking', '🏋 Gym'],
    category: 'Budget',
  },
  {
    img: '/images/hotel-resto-9.jpg',
    name: 'Davao Garden Suites', location: 'Davao City, Philippines',
    stars: 5, price: '$260', tag: 'Top Rated',
    amenities: ['🌿 Garden View', '🏊 Pool', '💆 Spa', '🍽 Restaurant'],
    category: 'Luxury',
  },
];

const categories = ['All', 'Luxury', 'Resort', 'Business', 'Budget'];
const ITEMS_PER_PAGE = 6;

export default function Hotel() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);

  const filtered = hotels.filter(h => activeCategory === 'All' || h.category === activeCategory);

  const sorted = [...filtered].sort((a, b) => {
    const pa = parseInt(a.price.replace(/\D/g, ''));
    const pb = parseInt(b.price.replace(/\D/g, ''));
    if (sortBy === 'price-asc') return pa - pb;
    if (sortBy === 'price-desc') return pb - pa;
    if (sortBy === 'stars') return b.stars - a.stars;
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
        <SearchForm />
      </section>

      {/* Filters & Grid */}
      <section className="py-14">
        <div className="max-w-7xl mx-auto px-6">

          {/* Stats bar */}
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
              <span className="text-sm text-gray-400">{sorted.length} hotels found</span>
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm text-gray-600 outline-none focus:border-orange-400 transition-colors bg-white"
              >
                <option value="default">Sort: Default</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="stars">Top Rated</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((h, i) => <HotelCard key={i} {...h} />)}
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
