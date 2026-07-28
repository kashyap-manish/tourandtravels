import { useState } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';

const blogs = [
  {
    img: '/images/image_1.jpg',
    title: 'Top 10 Hidden Beaches You Must Visit in 2025',
    excerpt: 'From the turquoise coves of Palawan to the untouched shores of Andaman, discover the world\'s most secluded beaches before the crowds arrive.',
    category: 'Travel Tips', date: 'Jan 15, 2025', author: 'Priya Sharma', readTime: '5 min read',
  },
  {
    img: '/images/image_2.jpg',
    title: 'How to Plan a Budget Trip to Southeast Asia',
    excerpt: 'Travelling Southeast Asia on a shoestring is easier than you think. Here\'s our complete guide to flights, stays, food, and transport on a budget.',
    category: 'Budget Travel', date: 'Feb 3, 2025', author: 'Rahul Mehta', readTime: '7 min read',
  },
  {
    img: '/images/image_3.jpg',
    title: 'A Complete Guide to the Golden Triangle, India',
    excerpt: 'Delhi, Agra, and Jaipur form India\'s most iconic travel circuit. Here\'s everything you need to know to make the most of your Golden Triangle trip.',
    category: 'Destinations', date: 'Feb 18, 2025', author: 'Ananya Iyer', readTime: '6 min read',
  },
  {
    img: '/images/image_4.jpg',
    title: 'Ladakh in Summer vs Winter: Which Season to Visit?',
    excerpt: 'Both seasons offer a completely different Ladakh experience. We break down the pros and cons so you can pick the perfect time for your adventure.',
    category: 'Adventure', date: 'Mar 5, 2025', author: 'Vikram Singh', readTime: '4 min read',
  },
  {
    img: '/images/image_5.jpg',
    title: 'The Ultimate Kerala Backwaters Houseboat Experience',
    excerpt: 'Floating through the serene canals of Alleppey on a traditional kettuvallam is a bucket-list experience. Here\'s how to plan it perfectly.',
    category: 'Destinations', date: 'Mar 22, 2025', author: 'Meera Nair', readTime: '5 min read',
  },
  {
    img: '/images/image_6.jpg',
    title: '10 Essential Packing Tips for Long-Haul Flights',
    excerpt: 'Avoid overpacking and under-preparing with our tried-and-tested packing checklist for international travel. Your future self will thank you.',
    category: 'Travel Tips', date: 'Apr 10, 2025', author: 'Arjun Kapoor', readTime: '3 min read',
  },
];

const categories = ['All', 'Travel Tips', 'Destinations', 'Adventure', 'Budget Travel'];

const recentPosts = blogs.slice(0, 3);

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = blogs.filter(b => {
    const matchCat = activeCategory === 'All' || b.category === activeCategory;
    const matchSearch = b.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_4.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Blog</span>
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight">Travel Blog</h1>
          <p className="mt-3 text-gray-300 text-lg max-w-xl mx-auto">Stories, tips, and guides from our travel experts to inspire your next adventure</p>
        </div>
      </section>

      <section className="py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-8 md:gap-10">

          {/* Main Content */}
          <div className="flex-1 min-w-0">

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
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

            {/* Grid */}
            {filtered.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filtered.map((b, i) => <BlogCard key={i} {...b} />)}
              </div>
            ) : (
              <div className="text-center py-20 text-gray-400">
                <i className="fa fa-search text-4xl mb-3 block" />
                <p className="text-lg">No posts found.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 space-y-8">

            {/* Search */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-3">Search</h4>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 transition-colors"
                />
                <i className="fa fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Categories</h4>
              <ul className="space-y-2">
                {categories.filter(c => c !== 'All').map(cat => {
                  const count = blogs.filter(b => b.category === cat).length;
                  return (
                    <li key={cat}>
                      <button
                        onClick={() => setActiveCategory(cat)}
                        className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-orange-500 transition-colors py-1"
                      >
                        <span className="flex items-center gap-2">
                          <i className="fa fa-chevron-right text-xs text-orange-400" />{cat}
                        </span>
                        <span className="bg-orange-50 text-orange-500 text-xs font-semibold px-2 py-0.5 rounded-full">{count}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Recent Posts */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Recent Posts</h4>
              <ul className="space-y-4">
                {recentPosts.map((p, i) => (
                  <li key={i} className="flex gap-3 items-start">
                    <div
                      className="w-14 h-14 shrink-0 rounded-xl bg-cover bg-center"
                      style={{ backgroundImage: `url('${p.img}')` }}
                    />
                    <div>
                      <p className="text-sm font-semibold text-gray-800 hover:text-orange-500 cursor-pointer leading-snug line-clamp-2">{p.title}</p>
                      <p className="text-xs text-gray-400 mt-1">{p.date}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['Travel', 'Adventure', 'Beach', 'Mountains', 'Budget', 'Luxury', 'Food', 'Culture', 'Solo Travel', 'Family'].map(tag => (
                  <span key={tag} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500 px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
