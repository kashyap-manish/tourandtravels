import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';
import { fetchBlogs } from '../services/blogApi';

const categories = ['All', 'Travel Tips', 'Destinations', 'Adventure', 'Budget Travel'];

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchBlogs(activeCategory, search)
      .then(setBlogs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

  // debounced search
  useEffect(() => {
    if (search === '') return;
    const timer = setTimeout(() => {
      setLoading(true);
      setError('');
      fetchBlogs(activeCategory, search)
        .then(setBlogs)
        .catch(e => setError(e.message))
        .finally(() => setLoading(false));
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const filtered = blogs;

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

            {loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
                    <div className="h-52 bg-gray-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-3 bg-gray-200 rounded w-1/3" />
                      <div className="h-4 bg-gray-200 rounded w-full" />
                      <div className="h-4 bg-gray-200 rounded w-4/5" />
                      <div className="h-3 bg-gray-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {error && (
              <div className="text-center py-20 text-red-400">
                <i className="fa fa-exclamation-circle text-4xl mb-3 block" />
                <p>{error}</p>
              </div>
            )}

            {!loading && !error && (
              filtered.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filtered.map((b, i) => <BlogCard key={i} {...b} />)}
                </div>
              ) : (
                <div className="text-center py-20 text-gray-400">
                  <i className="fa fa-search text-4xl mb-3 block" />
                  <p className="text-lg">No posts found.</p>
                </div>
              )
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
                {categories.filter(c => c !== 'All').map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className="w-full flex items-center justify-between text-sm text-gray-600 hover:text-orange-500 transition-colors py-1"
                    >
                      <span className="flex items-center gap-2">
                        <i className="fa fa-chevron-right text-xs text-orange-400" />{cat}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            {blogs.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4">Recent Posts</h4>
                <ul className="space-y-4">
                  {blogs.slice(0, 3).map((p, i) => (
                    <li key={i} className="flex gap-3 items-start">
                      <a href={p.url} target="_blank" rel="noreferrer" className="flex gap-3 items-start group">
                        <div
                          className="w-14 h-14 shrink-0 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url('${p.img}')` }}
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-orange-500 transition-colors leading-snug line-clamp-2">{p.title}</p>
                          <p className="text-xs text-gray-400 mt-1">{p.date}</p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4">Popular Tags</h4>
              <div className="flex flex-wrap gap-2">
                {['Travel', 'Adventure', 'Beach', 'Mountains', 'Budget', 'Luxury', 'Food', 'Culture', 'Solo Travel', 'Family'].map(tag => (
                  <span
                    key={tag}
                    onClick={() => { setSearch(tag); setActiveCategory('All'); }}
                    className={`text-xs border px-3 py-1.5 rounded-full cursor-pointer transition-all duration-200
                      ${search === tag
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/20'
                        : 'bg-gray-50 border-gray-100 text-gray-500 hover:bg-orange-500 hover:text-white hover:border-orange-500'
                      }`}
                  >
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
