import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';
import { fetchBlogs } from '../services/blogApi';
import '../styles/TreesCard.css';

const categories = ['All', 'Travel Tips', 'Destinations', 'Adventure', 'Budget Travel'];

const catIcons = {
  'All': 'fa-th-large',
  'Travel Tips': 'fa-lightbulb-o',
  'Destinations': 'fa-map-marker',
  'Adventure': 'fa-bolt',
  'Budget Travel': 'fa-tag',
};

const popularTags = ['Travel', 'Adventure', 'Beach', 'Mountains', 'Budget', 'Luxury', 'Food', 'Culture', 'Solo Travel', 'Family'];

function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 animate-pulse">
      <div className="h-52 bg-gray-200" />
      <div className="p-5 space-y-3">
        <div className="h-3 bg-gray-200 rounded w-1/3" />
        <div className="h-4 bg-gray-200 rounded w-full" />
        <div className="h-4 bg-gray-200 rounded w-4/5" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    </div>
  );
}

function FeaturedPost({ post }) {
  return (
    <a
      href={post.url}
      target="_blank"
      rel="noreferrer"
      className="group relative flex flex-col md:flex-row overflow-hidden rounded-2xl bg-gray-950 shadow-xl mb-10 min-h-[320px]"
    >
      {/* Image */}
      <div className="relative md:w-1/2 h-64 md:h-auto overflow-hidden shrink-0">
        <div
          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url('${post.img}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-gray-950/60 hidden md:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950/80 to-transparent md:hidden" />
        {/* Editor's Pick badge */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
          <i className="fa fa-star" /> Editor's Pick
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center p-8 md:p-10 flex-1">
        <span className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-3">{post.category}</span>
        <h2 className="text-white font-extrabold text-xl md:text-2xl leading-snug mb-3 group-hover:text-orange-400 transition-colors line-clamp-3">
          {post.title}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {post.author?.[0] || 'A'}
            </div>
            <div>
              <p className="text-white text-xs font-semibold">{post.author}</p>
              <p className="text-gray-500 text-xs">{post.date} · {post.readTime}</p>
            </div>
          </div>
          <span className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors">
            Read Article <i className="fa fa-arrow-right" />
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Blog() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError('');
    fetchBlogs(activeCategory, search)
      .then(setBlogs)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [activeCategory]);

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

  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <>
      {/* ── Hero ── */}
      <section
        className="relative flex flex-col justify-end bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_4.jpg')", minHeight: '56vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/10" />

        <div className="relative z-10 text-center text-white pb-12 px-4">
          <p className="text-xs mb-4 flex items-center justify-center gap-2 text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-[10px] text-orange-500" />
            <span className="text-white">Blog</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Travel <span className="text-orange-500">Stories</span>
          </h1>
          <p className="mt-3 text-gray-300 text-base max-w-lg mx-auto">
            Expert guides, destination deep-dives and real traveller stories
          </p>

          {/* Category pills in hero */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
                  ${activeCategory === cat
                    ? 'bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
              >
                <i className={`fa ${catIcons[cat]}`} />
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom wave divider */}
        <div className="relative z-10 h-10 bg-gradient-to-b from-transparent to-gray-50" />
      </section>

      {/* ── Content ── */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row gap-10">

          {/* ── Main ── */}
          <div className="flex-1 min-w-0">

            {/* Results bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-gray-500">
                {loading ? 'Loading…' : <><span className="font-bold text-gray-900">{blogs.length}</span> articles found</>}
              </p>
              {/* Inline search */}
              <div className="relative hidden sm:block">
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="border border-gray-200 bg-white rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-orange-400 transition-colors w-52 shadow-sm"
                />
                <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              </div>
            </div>

            {/* Loading */}
            {loading && (
              <div className="row">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="col-12 col-md-6"><SkeletonCard /></div>
                ))}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="text-center py-20 text-red-400">
                <i className="fa fa-exclamation-circle text-4xl mb-3 block" />
                <p>{error}</p>
              </div>
            )}

            {/* Posts */}
            {!loading && !error && blogs.length > 0 && (
              <>
                {/* Featured spotlight */}
                <FeaturedPost post={featured} />

                {/* Grid */}
                <div className="row">
                  {rest.map((b, i) => (
                    <div key={i} className="col-12 col-md-6"><BlogCard {...b} /></div>
                  ))}
                </div>
              </>
            )}

            {/* Empty */}
            {!loading && !error && blogs.length === 0 && (
              <div className="text-center py-24 text-gray-400">
                <i className="fa fa-search text-5xl mb-4 block" />
                <p className="text-lg font-semibold text-gray-500">No articles found</p>
                <p className="text-sm mt-1">Try a different category or keyword</p>
              </div>
            )}
          </div>

          {/* ── Sidebar ── */}
          <aside className="w-full lg:w-72 shrink-0 space-y-6">

            {/* Mobile search */}
            <div className="sm:hidden bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search articles…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 pr-10 text-sm outline-none focus:border-orange-400 transition-colors"
                />
                <i className="fa fa-search absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
              </div>
            </div>

            {/* Newsletter */}
            <div className="relative overflow-hidden bg-gray-950 rounded-2xl p-6 shadow-lg">
              <div className="absolute -top-6 -right-6 w-28 h-28 bg-orange-500/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center mb-4">
                  <i className="fa fa-envelope text-orange-400" />
                </div>
                <h4 className="text-white font-bold text-base mb-1">Travel Newsletter</h4>
                <p className="text-gray-400 text-xs mb-4 leading-relaxed">Get weekly travel inspiration, tips and exclusive deals straight to your inbox.</p>
                {subscribed ? (
                  <div className="flex items-center gap-2 text-green-400 text-sm font-semibold">
                    <i className="fa fa-check-circle" /> You're subscribed!
                  </div>
                ) : (
                  <form onSubmit={e => { e.preventDefault(); if (email) setSubscribed(true); }} className="space-y-2">
                    <input
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full bg-white/10 border border-white/10 text-white placeholder-gray-500 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors"
                    />
                    <button
                      type="submit"
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold py-2.5 rounded-xl transition-colors"
                    >
                      Subscribe Free
                    </button>
                  </form>
                )}
              </div>
            </div>

            {/* Categories */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fa fa-th-large text-orange-500 text-sm" /> Categories
              </h4>
              <ul className="space-y-1">
                {categories.filter(c => c !== 'All').map(cat => (
                  <li key={cat}>
                    <button
                      onClick={() => setActiveCategory(cat)}
                      className={`w-full flex items-center justify-between text-sm px-3 py-2.5 rounded-xl transition-all duration-200
                        ${activeCategory === cat
                          ? 'bg-orange-50 text-orange-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-orange-500'
                        }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <i className={`fa ${catIcons[cat]} text-orange-400 w-4 text-center`} />
                        {cat}
                      </span>
                      <i className="fa fa-chevron-right text-[10px] text-gray-300" />
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recent Posts */}
            {blogs.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <i className="fa fa-clock-o text-orange-500 text-sm" /> Recent Posts
                </h4>
                <ul className="space-y-4">
                  {blogs.slice(0, 4).map((p, i) => (
                    <li key={i}>
                      <a href={p.url} target="_blank" rel="noreferrer" className="flex gap-3 items-start group">
                        <div
                          className="w-16 h-14 shrink-0 rounded-xl bg-cover bg-center"
                          style={{ backgroundImage: `url('${p.img}')` }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-gray-800 group-hover:text-orange-500 transition-colors leading-snug line-clamp-2">{p.title}</p>
                          <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1">
                            <i className="fa fa-calendar-o" /> {p.date}
                          </p>
                        </div>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tags */}
            <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fa fa-tags text-orange-500 text-sm" /> Popular Tags
              </h4>
              <div className="flex flex-wrap gap-2">
                {popularTags.map(tag => (
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
