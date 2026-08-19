import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import TourCard from '../components/TourCard';
import ToursMap from '../components/ToursMap';
import CallToAction from '../components/CallToAction';
import api from '../services/api';
import { mergeRatings } from '../utils/mergeRatings';
import { tours as localTours } from '../data/tours';

const cityHotels = {
  'new-delhi': [
    { name: 'Radisson Blu Marina Hotel, Delhi Connaught Place', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', stars: 4, reviews: 3908, distance: '1.47 miles/2.37 km from central New Delhi', tags: ['Sustainable Stays', 'Central location'], badge: 'BLU', badgeBg: '#1a56db', price: '₹8,075' },
    { name: 'Park Inn by Radisson New Delhi Lajpat Nagar', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', stars: 4, reviews: 850, distance: '3.8 miles/6.12 km from central New Delhi', tags: ['Sustainable Stays', 'Ideal for business travel'], badge: 'P', badgeBg: '#374151', price: '₹4,674' },
    { name: 'Svelte Delhi, a member of Radisson Individuals', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', stars: 4, reviews: 826, distance: '5.94 miles/9.56 km from central New Delhi', tags: ['Sustainable Stays', 'Central location'], badge: 'RI', badgeBg: '#6b7280', price: '₹4,851' },
    { name: 'Park Plaza Delhi CBD Shahdara', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', stars: 3, reviews: 3000, distance: '6.24 miles/10.04 km from central New Delhi', tags: ['Family-friendly', 'Ideal for business travel'], badge: '₱', badgeBg: '#111827', price: '₹4,950' },
    { name: 'The Leela Palace New Delhi', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', stars: 5, reviews: 2100, distance: '2.1 miles/3.38 km from central New Delhi', tags: ['Luxury', 'Central location'], badge: 'LP', badgeBg: '#b45309', price: '₹22,000' },
    { name: 'ITC Maurya, New Delhi', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', stars: 5, reviews: 1850, distance: '3.2 miles/5.15 km from central New Delhi', tags: ['Luxury', 'Sustainable Stays'], badge: 'ITC', badgeBg: '#065f46', price: '₹18,500' },
  ],
  goa: [
    { name: 'Taj Exotica Resort & Spa, Goa', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', stars: 5, reviews: 2340, distance: '0.8 miles/1.29 km from Calangute Beach', tags: ['Luxury', 'Near Beach'], badge: 'TAJ', badgeBg: '#92400e', price: '₹18,000' },
    { name: 'Novotel Goa Candolim', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', stars: 4, reviews: 1120, distance: '1.2 miles/1.93 km from Candolim Beach', tags: ['Sustainable Stays', 'Near Beach'], badge: 'N', badgeBg: '#1d4ed8', price: '₹7,200' },
    { name: 'Alila Diwa Goa', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', stars: 5, reviews: 980, distance: '2.4 miles/3.86 km from Majorda Beach', tags: ['Luxury', 'Sustainable Stays'], badge: 'AD', badgeBg: '#065f46', price: '₹14,500' },
    { name: 'Lemon Tree Amarante Beach Resort', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80', stars: 4, reviews: 760, distance: '0.3 miles/0.48 km from Varca Beach', tags: ['Near Beach', 'Family-friendly'], badge: 'LT', badgeBg: '#15803d', price: '₹5,800' },
  ],
  mumbai: [
    { name: 'The Taj Mahal Palace, Mumbai', img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80', stars: 5, reviews: 4200, distance: '0.2 miles/0.32 km from Gateway of India', tags: ['Luxury', 'Central location'], badge: 'TAJ', badgeBg: '#92400e', price: '₹25,000' },
    { name: 'ITC Grand Central Mumbai', img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80', stars: 5, reviews: 1650, distance: '3.1 miles/4.99 km from central Mumbai', tags: ['Luxury', 'Ideal for business travel'], badge: 'ITC', badgeBg: '#065f46', price: '₹16,000' },
    { name: 'Trident Nariman Point', img: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=600&q=80', stars: 5, reviews: 2100, distance: '1.5 miles/2.41 km from Marine Drive', tags: ['Luxury', 'Central location'], badge: 'TR', badgeBg: '#1e40af', price: '₹14,200' },
    { name: 'Novotel Mumbai Juhu Beach', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', stars: 4, reviews: 890, distance: '0.5 miles/0.80 km from Juhu Beach', tags: ['Near Beach', 'Family-friendly'], badge: 'N', badgeBg: '#1d4ed8', price: '₹8,500' },
  ],
  jaipur: [
    { name: 'Rambagh Palace, Jaipur', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', stars: 5, reviews: 3100, distance: '2.3 miles/3.70 km from City Palace', tags: ['Luxury', 'Heritage'], badge: 'RP', badgeBg: '#92400e', price: '₹32,000' },
    { name: 'ITC Rajputana Jaipur', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', stars: 5, reviews: 1420, distance: '1.8 miles/2.90 km from Hawa Mahal', tags: ['Luxury', 'Sustainable Stays'], badge: 'ITC', badgeBg: '#065f46', price: '₹12,000' },
    { name: 'Fairmont Jaipur', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', stars: 5, reviews: 1890, distance: '4.2 miles/6.76 km from Amber Fort', tags: ['Luxury', 'Family-friendly'], badge: 'FM', badgeBg: '#1e3a5f', price: '₹15,500' },
    { name: 'Radisson Hotel Jaipur City Center', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', stars: 4, reviews: 760, distance: '1.1 miles/1.77 km from central Jaipur', tags: ['Central location', 'Ideal for business travel'], badge: 'R', badgeBg: '#1a56db', price: '₹6,200' },
  ],
  kerala: [
    { name: 'Kumarakom Lake Resort', img: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=600&q=80', stars: 5, reviews: 1780, distance: '0.5 miles/0.80 km from Vembanad Lake', tags: ['Luxury', 'Near Backwaters'], badge: 'KL', badgeBg: '#065f46', price: '₹20,000' },
    { name: 'Taj Malabar Resort & Spa', img: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=600&q=80', stars: 5, reviews: 2200, distance: '0.3 miles/0.48 km from Cochin Harbour', tags: ['Luxury', 'Sustainable Stays'], badge: 'TAJ', badgeBg: '#92400e', price: '₹17,500' },
    { name: 'Spice Village, Thekkady', img: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=600&q=80', stars: 4, reviews: 940, distance: '1.2 miles/1.93 km from Periyar Wildlife Sanctuary', tags: ['Eco-friendly', 'Nature'], badge: 'SV', badgeBg: '#15803d', price: '₹9,800' },
    { name: 'Leela Kovalam Beach Resort', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', stars: 5, reviews: 1560, distance: '0.1 miles/0.16 km from Kovalam Beach', tags: ['Near Beach', 'Luxury'], badge: 'LK', badgeBg: '#b45309', price: '₹16,000' },
  ],
  ladakh: [
    { name: 'The Grand Dragon Ladakh', img: 'https://images.unsplash.com/photo-1506059612708-99d6c258160e?w=600&q=80', stars: 4, reviews: 620, distance: '1.5 miles/2.41 km from Leh Market', tags: ['Mountain View', 'Central location'], badge: 'GD', badgeBg: '#374151', price: '₹8,500' },
    { name: 'Nimmu House, Ladakh', img: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&q=80', stars: 4, reviews: 480, distance: '22 miles/35.4 km from Leh', tags: ['Heritage', 'Eco-friendly'], badge: 'NH', badgeBg: '#92400e', price: '₹6,200' },
    { name: 'Chamba Camp, Thiksey', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', stars: 5, reviews: 390, distance: '11 miles/17.7 km from Leh', tags: ['Luxury', 'Mountain View'], badge: 'CC', badgeBg: '#1e3a5f', price: '₹22,000' },
    { name: 'Ladakh Sarai Resort', img: 'https://images.unsplash.com/photo-1455587734955-081b22074882?w=600&q=80', stars: 3, reviews: 310, distance: '2.8 miles/4.51 km from Leh Market', tags: ['Budget-friendly', 'Mountain View'], badge: 'LS', badgeBg: '#065f46', price: '₹3,800' },
  ],
  hyderabad: [
    { name: 'Taj Falaknuma Palace', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&q=80', stars: 5, reviews: 2800, distance: '3.1 miles/4.99 km from Charminar', tags: ['Luxury', 'Heritage'], badge: 'TAJ', badgeBg: '#92400e', price: '₹28,000' },
    { name: 'ITC Kohenur Hyderabad', img: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80', stars: 5, reviews: 1340, distance: '5.2 miles/8.37 km from Hussain Sagar', tags: ['Luxury', 'Ideal for business travel'], badge: 'ITC', badgeBg: '#065f46', price: '₹14,000' },
    { name: 'Novotel Hyderabad Convention Centre', img: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&q=80', stars: 5, reviews: 1120, distance: '6.8 miles/10.94 km from central Hyderabad', tags: ['Sustainable Stays', 'Ideal for business travel'], badge: 'N', badgeBg: '#1d4ed8', price: '₹9,500' },
    { name: 'Radisson Blu Plaza Hotel Hyderabad', img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&q=80', stars: 4, reviews: 980, distance: '2.4 miles/3.86 km from Hussain Sagar', tags: ['Central location', 'Sustainable Stays'], badge: 'BLU', badgeBg: '#1a56db', price: '₹7,800' },
  ],
  bengaluru: [
    { name: 'The Leela Palace Bengaluru', img: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&q=80', stars: 5, reviews: 2450, distance: '1.8 miles/2.90 km from MG Road', tags: ['Luxury', 'Central location'], badge: 'LP', badgeBg: '#b45309', price: '₹20,000' },
    { name: 'ITC Windsor Bengaluru', img: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=600&q=80', stars: 5, reviews: 1680, distance: '2.2 miles/3.54 km from Cubbon Park', tags: ['Luxury', 'Heritage'], badge: 'ITC', badgeBg: '#065f46', price: '₹16,500' },
    { name: 'Taj MG Road Bengaluru', img: 'https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=600&q=80', stars: 5, reviews: 1920, distance: '0.5 miles/0.80 km from MG Road', tags: ['Luxury', 'Central location'], badge: 'TAJ', badgeBg: '#92400e', price: '₹14,000' },
    { name: 'Novotel Bengaluru Outer Ring Road', img: 'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=600&q=80', stars: 4, reviews: 870, distance: '8.4 miles/13.52 km from central Bengaluru', tags: ['Ideal for business travel', 'Sustainable Stays'], badge: 'N', badgeBg: '#1d4ed8', price: '₹7,200' },
  ],
};

const cityCoords = {
  hyderabad:  [17.3850, 78.4867],
  'new-delhi': [28.6139, 77.2090],
  goa:        [15.2993, 74.1240],
  bengaluru:  [12.9716, 77.5946],
  mumbai:     [19.0760, 72.8777],
  jaipur:     [26.9124, 75.7873],
  kerala:     [10.8505, 76.2711],
  ladakh:     [34.1526, 77.5771],
};

const cityData = {
  hyderabad: {
    name: 'Hyderabad',
    img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=1200&q=80',
    desc: 'The City of Pearls blends Mughal grandeur with modern tech culture. Explore the iconic Charminar, savour world-famous biryani, and wander through the bazaars of the old city.',
    search: 'Hyderabad',
  },
  'new-delhi': {
    name: 'New Delhi',
    img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=1200&q=80',
    desc: 'Delhi, where every street tells a story. Explore a vibrant blend of history and modernity, from grand monuments and bustling bazaars to dynamic cultural experiences.',
    search: 'Delhi',
  },
  goa: {
    name: 'Goa',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=1200&q=80',
    desc: 'Sun-kissed beaches, Portuguese heritage, and vibrant nightlife make Goa India\'s most beloved coastal escape. Relax, explore, and soak in the laid-back island vibe.',
    search: 'Goa',
  },
  bengaluru: {
    name: 'Bengaluru',
    img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=1200&q=80',
    desc: 'India\'s Silicon Valley is also a city of gardens, craft breweries, and rich heritage. Discover a perfect mix of cosmopolitan energy and old-world charm.',
    search: 'Bengaluru',
  },
  mumbai: {
    name: 'Mumbai',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=1200&q=80',
    desc: 'The city that never sleeps — Mumbai pulses with Bollywood glamour, colonial architecture, street food, and the iconic Marine Drive waterfront.',
    search: 'Mumbai',
  },
  jaipur: {
    name: 'Jaipur',
    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=1200&q=80',
    desc: 'The Pink City dazzles with majestic forts, ornate palaces, and vibrant bazaars. Jaipur is the jewel of Rajasthan and a gateway to royal India.',
    search: 'Jaipur',
  },
  kerala: {
    name: 'Kerala',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=1200&q=80',
    desc: "God's Own Country enchants with serene backwaters, lush tea gardens, Ayurvedic retreats, and pristine beaches along the Malabar Coast.",
    search: 'Kerala',
  },
  ladakh: {
    name: 'Ladakh',
    img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=1200&q=80',
    desc: 'The Land of High Passes offers dramatic mountain landscapes, ancient Buddhist monasteries, and the surreal beauty of Pangong Lake under endless skies.',
    search: 'Ladakh',
  },
};

export default function CityDestination() {
  const { slug } = useParams();
  const city = cityData[slug];
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('list');
  const [sortBy, setSortBy] = useState('Distance');
  const [showFilters, setShowFilters] = useState(false);
  const [filterStars, setFilterStars] = useState([]);
  const [filterPrice, setFilterPrice] = useState('');
  const [filterTags, setFilterTags] = useState([]);
  const [showTourFilters, setShowTourFilters] = useState(false);
  const [tourCategory, setTourCategory] = useState('All');
  const [tourSort, setTourSort] = useState('default');
  const allHotels = cityHotels[slug] || [];

  const priceRanges = { Budget: [0, 7000], 'Mid-range': [7001, 15000], Luxury: [15001, Infinity] };

  const hotels = allHotels
    .filter(h => {
      const priceNum = parseInt(h.price.replace(/[₹,]/g, ''));
      const starOk  = filterStars.length === 0 || filterStars.includes(h.stars);
      const priceOk = !filterPrice || (priceNum >= priceRanges[filterPrice][0] && priceNum <= priceRanges[filterPrice][1]);
      const tagOk   = filterTags.length === 0 || filterTags.every(t => h.tags.includes(t));
      return starOk && priceOk && tagOk;
    })
    .sort((a, b) => {
      const pa = parseInt(a.price.replace(/[₹,]/g, ''));
      const pb = parseInt(b.price.replace(/[₹,]/g, ''));
      if (sortBy === 'Price: Low to High') return pa - pb;
      if (sortBy === 'Price: High to Low') return pb - pa;
      if (sortBy === 'Top Rated') return b.reviews - a.reviews;
      return 0;
    });

  const tourCategories = ['All', 'Beach', 'Adventure', 'Nature', 'Culture'];
  const filteredTours = tours
    .filter(t => tourCategory === 'All' || t.category === tourCategory)
    .sort((a, b) => {
      const pa = parseInt((a.price || '').replace(/\D/g, ''));
      const pb = parseInt((b.price || '').replace(/\D/g, ''));
      if (tourSort === 'price-asc') return pa - pb;
      if (tourSort === 'price-desc') return pb - pa;
      return 0;
    });

  const allTags = [...new Set((cityHotels[slug] || []).flatMap(h => h.tags))];
  function toggleStar(s) { setFilterStars(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); }
  function toggleTag(t)  { setFilterTags(p => p.includes(t) ? p.filter(x => x !== t) : [...p, t]); }
  const activeFilterCount = filterStars.length + (filterPrice ? 1 : 0) + filterTags.length;

  useEffect(() => {
    if (!city) { setLoading(false); return; }
    api.get('/tours')
      .then(r => {
        const merged = mergeRatings(r.data);
        const filtered = merged.filter(t =>
          t.location?.toLowerCase().includes(city.search.toLowerCase()) ||
          t.title?.toLowerCase().includes(city.search.toLowerCase())
        );
        setTours(filtered);
      })
      .catch(() => {
        const filtered = localTours.filter(t =>
          t.location?.toLowerCase().includes(city.search.toLowerCase()) ||
          t.title?.toLowerCase().includes(city.search.toLowerCase())
        );
        setTours(filtered);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (!city) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 24px' }}>
        <i className="fa fa-map-o" style={{ fontSize: 48, color: '#d1d5db', marginBottom: 16, display: 'block' }} />
        <h2 style={{ fontSize: 22, fontWeight: 700, color: '#111827' }}>Destination not found</h2>
        <Link to="/" style={{ color: '#f97316', marginTop: 12, display: 'inline-block' }}>← Back to Home</Link>
      </div>
    );
  }

  return (
    <>
      {/* Cinematic Hero */}
      <section className="relative flex flex-col justify-end bg-cover bg-center" style={{ backgroundImage: `url('${city.img}')`, minHeight: '70vh' }}>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />

        {/* Breadcrumb */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-2">
          <p className="text-xs flex items-center gap-2 text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-[9px] text-orange-500" />
            <Link to="/destination" className="hover:text-orange-400 transition-colors">Destinations</Link>
            <i className="fa fa-chevron-right text-[9px] text-orange-500" />
            <span className="text-white font-semibold">{city.name}</span>
          </p>
        </div>

        {/* Main content */}
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 pb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-500/40 text-orange-400 text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-widest">
                <i className="fa fa-map-marker" /> India
              </span>
              <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-4">
                {city.name}
              </h1>
              <p className="text-gray-300 text-base leading-relaxed max-w-xl">{city.desc}</p>
            </div>

            {/* Stats card */}
            <div className="flex gap-px bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl overflow-hidden shrink-0">
              {[
                { icon: 'fa-building', val: `${(cityHotels[slug] || []).length}+`, label: 'Hotels' },
                { icon: 'fa-map-marker', val: `${tours.length || '10'}+`, label: 'Tours' },
                { icon: 'fa-star', val: '4.8★', label: 'Rating' },
              ].map(({ icon, val, label }) => (
                <div key={label} className="flex flex-col items-center justify-center px-6 py-4 gap-1">
                  <i className={`fa ${icon} text-orange-400 text-lg`} />
                  <span className="text-white font-extrabold text-xl leading-none">{val}</span>
                  <span className="text-gray-400 text-xs">{label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40 C360 0 1080 0 1440 40 L1440 40 L0 40Z" fill="#f9fafb" />
          </svg>
        </div>
      </section>



      {/* Hotels Section */}
      <section style={{ padding: '0 0 80px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: '#111827' }}>
              Hotels in {city.name}
              <span style={{ fontSize: 14, fontWeight: 500, color: '#6b7280', marginLeft: 10 }}>Showing {hotels.length} results</span>
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              {/* Filters toggle */}
              <button
                onClick={() => setShowFilters(f => !f)}
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 18px', borderRadius: 999, border: `1.5px solid ${showFilters ? '#f97316' : '#e5e7eb'}`, background: showFilters ? '#fff7ed' : '#fff', fontSize: 12, fontWeight: 700, cursor: 'pointer', color: showFilters ? '#f97316' : '#374151', position: 'relative' }}
              >
                <i className="fa fa-sliders" /> FILTERS
                {activeFilterCount > 0 && (
                  <span style={{ position: 'absolute', top: -6, right: -6, width: 18, height: 18, borderRadius: '50%', background: '#f97316', color: '#fff', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{activeFilterCount}</span>
                )}
              </button>
              {/* Sort */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 14, color: '#374151' }}>
                <span style={{ fontWeight: 500 }}>Sort by</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  style={{ border: '1.5px solid #e5e7eb', borderRadius: 8, padding: '6px 12px', fontSize: 14, color: '#111827', outline: 'none', cursor: 'pointer', background: '#fff' }}
                >
                  {['Distance', 'Price: Low to High', 'Price: High to Low', 'Top Rated'].map(o => (
                    <option key={o}>{o}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div style={{ background: '#f9fafb', border: '1.5px solid #e5e7eb', borderRadius: 16, padding: '24px 28px', marginBottom: 28, display: 'flex', flexWrap: 'wrap', gap: 32 }}>

              {/* Price Range */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Price Range</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {['Budget', 'Mid-range', 'Luxury'].map(p => (
                    <button
                      key={p}
                      onClick={() => setFilterPrice(fp => fp === p ? '' : p)}
                      style={{ padding: '7px 16px', borderRadius: 999, border: `1.5px solid ${filterPrice === p ? '#f97316' : '#e5e7eb'}`, background: filterPrice === p ? '#fff7ed' : '#fff', color: filterPrice === p ? '#f97316' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 6 }}>Budget ₹7k · Mid ₹7k–15k · Luxury ₹15k+</p>
              </div>

              {/* Star Rating */}
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Star Rating</p>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[3, 4, 5].map(s => (
                    <button
                      key={s}
                      onClick={() => toggleStar(s)}
                      style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 14px', borderRadius: 999, border: `1.5px solid ${filterStars.includes(s) ? '#f97316' : '#e5e7eb'}`, background: filterStars.includes(s) ? '#fff7ed' : '#fff', color: filterStars.includes(s) ? '#f97316' : '#374151', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {s}<i className="fa fa-star" style={{ fontSize: 11, color: filterStars.includes(s) ? '#f97316' : '#f59e0b' }} />
                    </button>
                  ))}
                </div>
              </div>

              {/* Tags */}
              <div style={{ flex: 1, minWidth: 200 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Amenities & Type</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      style={{ padding: '6px 14px', borderRadius: 999, border: `1.5px solid ${filterTags.includes(tag) ? '#f97316' : '#e5e7eb'}`, background: filterTags.includes(tag) ? '#fff7ed' : '#fff', color: filterTags.includes(tag) ? '#f97316' : '#374151', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Clear */}
              {activeFilterCount > 0 && (
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={() => { setFilterStars([]); setFilterPrice(''); setFilterTags([]); }}
                    style={{ padding: '7px 16px', borderRadius: 999, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: 12, fontWeight: 700, cursor: 'pointer' }}
                  >
                    <i className="fa fa-times" style={{ marginRight: 6 }} />Clear All
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Hotel cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hotels.map((h, i) => (
              <div key={i} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 flex flex-col transition-all duration-300 hover:-translate-y-1">

                {/* Image */}
                <div className="relative h-52 overflow-hidden shrink-0">
                  <img
                    src={h.img} alt={h.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />

                  {/* Star rating overlay */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <i className="fa fa-star text-yellow-400 text-xs" />
                    <span className="text-white text-xs font-bold">{h.stars}.0</span>
                  </div>

                  {/* Brand badge */}
                  <div
                    className="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
                    style={{ background: h.badgeBg }}
                  >
                    <span className="text-white font-black text-[9px] text-center leading-tight">{h.badge}</span>
                  </div>

                  {/* Price on image bottom */}
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {h.price}<span className="font-normal opacity-80">/night</span>
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-bold text-gray-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-orange-500 transition-colors">
                    {h.name}
                  </h3>

                  {/* Stars row */}
                  <div className="flex items-center gap-1.5 mb-2">
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <i key={j} className={`fa fa-star text-[10px] ${j < h.stars ? 'text-yellow-400' : 'text-gray-200'}`} />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">({h.reviews.toLocaleString()})</span>
                  </div>

                  {/* Distance */}
                  <p className="text-xs text-gray-400 flex items-start gap-1 mb-3">
                    <i className="fa fa-map-marker text-orange-400 mt-0.5 shrink-0" />
                    <span className="line-clamp-2">{h.distance}</span>
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {h.tags.map(tag => (
                      <span key={tag} className="text-[10px] bg-orange-50 text-orange-600 border border-orange-100 px-2.5 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Book Now */}
                  <a
                    href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + ' ' + city.name)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-auto w-full flex items-center justify-center gap-2 bg-gray-950 hover:bg-orange-500 text-white text-xs font-bold py-2.5 rounded-xl transition-colors duration-200"
                  >
                    <i className="fa fa-calendar-check-o" /> Book Now
                  </a>
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
