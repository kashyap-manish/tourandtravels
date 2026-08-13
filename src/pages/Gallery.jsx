import { useState, useEffect, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import { fetchGalleryImages, fetchHeroSlides } from '../services/pexelsApi';

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Culture', 'Adventure', 'Wildlife', 'Cities'];

const STATS = [
  { value: '2,400+', label: 'Photos', icon: 'fa-camera' },
  { value: '80+',    label: 'Destinations', icon: 'fa-map-marker' },
  { value: '120+',   label: 'Photographers', icon: 'fa-user' },
  { value: '50K+',   label: 'Downloads', icon: 'fa-download' },
];

function HeroSlider({ slides }) {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (!slides.length) return;
    const t = setInterval(() => setCurrent(i => (i + 1) % slides.length), 4000);
    return () => clearInterval(t);
  }, [slides.length]);
  return (
    <div className="absolute inset-0 overflow-hidden bg-gray-900">
      {slides.map((src, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{ backgroundImage: `url('${src}')`, opacity: i === current ? 1 : 0 }}
        />
      ))}
    </div>
  );
}

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [heroSlides, setHeroSlides] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef(null);

  // Fetch hero slides once
  useEffect(() => {
    fetchHeroSlides().then(setHeroSlides).catch(() => {});
  }, []);

  // Fetch images on category/page/search change
  useEffect(() => {
    setLoading(true);
    fetchGalleryImages(activeCategory, page, 12, searchQuery)
      .then(({ images: imgs, nextPage }) => {
        setImages(prev => page === 1 ? imgs : [...prev, ...imgs]);
        setHasMore(!!nextPage);
      })
      .catch(() => setHasMore(false))
      .finally(() => setLoading(false));
  }, [activeCategory, page, searchQuery]);

  // Reset on category change
  useEffect(() => { setImages([]); setPage(1); setHasMore(true); }, [activeCategory, searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = searchInput.trim();
    if (q === searchQuery) return;
    setSearchQuery(q);
    if (q) setActiveCategory('All');
  };

  const clearSearch = () => {
    setSearchInput('');
    setSearchQuery('');
    inputRef.current?.focus();
  };

  // keyboard nav for lightbox
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowRight') setLightbox(i => Math.min(i + 1, images.length - 1));
    if (e.key === 'ArrowLeft')  setLightbox(i => Math.max(i - 1, 0));
    if (e.key === 'Escape')     setLightbox(null);
  }, [lightbox, images.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  const current = lightbox !== null ? images[lightbox] : null;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative h-screen">

        {/* CSS Slideshow */}
        <HeroSlider slides={heroSlides} />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-black/30 to-black/20" />

        {/* Centered text */}
        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center gap-4 px-4">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
            <i className="fa fa-camera" /> Visual Stories
          </div>
          <p className="text-xs flex items-center gap-2 text-gray-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-orange-400 transition-colors pointer-events-auto">Home</Link>
            <i className="fa fa-chevron-right text-[10px] text-orange-500" />
            <span className="text-white">Gallery</span>
          </p>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-white drop-shadow-2xl text-center">
            Travel <span className="text-orange-500">Gallery</span>
          </h1>
          <p className="text-gray-300 text-base max-w-xl mx-auto text-center leading-relaxed">
            A curated collection of breathtaking moments from around the world
          </p>
        </div>

        {/* Stats bar pinned to bottom of hero */}
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-black/50 backdrop-blur-md border-t border-white/10">
          <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-3 text-white">
                <i className={`fa ${s.icon} text-orange-400 text-base mb-1`} />
                <span className="text-xl font-extrabold">{s.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Category Filter + Search ── */}
      <section className="bg-gray-950 sticky top-[72px] z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center gap-3">

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setSearchInput(''); setSearchQuery(''); }}
                className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200
                  ${activeCategory === cat && !searchQuery
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <form onSubmit={handleSearch} className="flex items-center gap-2 ml-auto w-full sm:w-72">
            <div className="relative flex-1">
              <i className="fa fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs" />
              <input
                ref={inputRef}
                type="text"
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Search photos..."
                className="w-full bg-white/10 border border-white/10 text-white text-sm placeholder-gray-500 rounded-full pl-8 pr-8 py-2 outline-none focus:border-orange-500 transition-colors"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white">
                  <i className="fa fa-times text-xs" />
                </button>
              )}
            </div>
            <button
              type="submit"
              className="shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2 rounded-full transition-colors"
            >
              Search
            </button>
          </form>

          <span className="shrink-0 text-xs text-gray-500 whitespace-nowrap hidden sm:block">
            <span className="text-white font-bold">{images.length}</span> photos
          </span>
        </div>

        {/* Active search tag */}
        {searchQuery && (
          <div className="max-w-7xl mx-auto px-6 pb-3 flex items-center gap-2">
            <span className="text-xs text-gray-400">Results for:</span>
            <span className="flex items-center gap-1.5 bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-semibold px-3 py-1 rounded-full">
              "{searchQuery}"
              <button onClick={clearSearch} className="hover:text-white ml-1">
                <i className="fa fa-times text-[10px]" />
              </button>
            </span>
          </div>
        )}
      </section>

      {/* ── Masonry Grid ── */}
      <section className="bg-gray-950 py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {loading && images.length === 0 && (
              [...Array(12)].map((_, i) => (
                <div key={i} className={`break-inside-avoid w-full bg-gray-800 animate-pulse rounded-2xl mb-4 ${i % 3 === 0 ? 'h-80' : i % 3 === 1 ? 'h-48' : 'h-60'}`} />
              ))
            )}
            {images.map((img, idx) => (
              <div
                key={img.id}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-zoom-in bg-gray-900 mb-4"
                onClick={() => setLightbox(idx)}
              >
                <img
                  src={img.thumb}
                  alt={img.title}
                  loading="lazy"
                  className="w-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105"
                />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                {/* Category pill */}
                <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide">
                    {img.cat}
                  </span>
                </div>

                {/* Expand icon */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                  <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <i className="fa fa-expand text-white text-xs" />
                  </div>
                </div>

                {/* Bottom info */}
                <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
                  <p className="text-white font-bold text-sm leading-tight">{img.title}</p>
                  <p className="text-gray-300 text-xs flex items-center gap-1 mt-0.5">
                    <i className="fa fa-map-marker text-orange-400 text-[10px]" /> {img.location}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          {hasMore && !loading && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setPage(p => p + 1)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-orange-500/30"
              >
                <i className="fa fa-plus" /> Load More
              </button>
            </div>
          )}
          {loading && images.length > 0 && (
            <div className="flex justify-center mt-8">
              <i className="fa fa-spinner fa-spin text-orange-400 text-2xl" />
            </div>
          )}

          {!loading && images.length === 0 && (
            <div className="flex flex-col items-center py-32 text-center">
              <i className="fa fa-image text-5xl text-gray-700 mb-4" />
              <p className="text-gray-500 font-semibold">No photos in this category</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Lightbox ── */}
      {current && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center"
          onClick={() => setLightbox(null)}
        >
          {/* Close */}
          <button
            className="absolute top-5 right-5 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
            onClick={() => setLightbox(null)}
          >
            <i className="fa fa-times" />
          </button>

          {/* Counter */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white text-xs font-semibold px-4 py-2 rounded-full">
            {lightbox + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            className="absolute left-4 md:left-8 w-12 h-12 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center text-white transition-all duration-200 disabled:opacity-20 z-10"
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.max(i - 1, 0)); }}
            disabled={lightbox === 0}

          >
            <i className="fa fa-chevron-left" />
          </button>

          {/* Image */}
          <div className="relative max-w-5xl w-full mx-16 md:mx-24" onClick={e => e.stopPropagation()}>
            <img
              src={current.src}
              alt={current.title}
              className="w-full max-h-[80vh] object-contain rounded-2xl shadow-2xl"
            />
            {/* Caption bar */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent rounded-b-2xl p-6">
              <div className="flex items-end justify-between">
                <div>
                  <span className="bg-orange-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide mb-2 inline-block">
                    {current.cat}
                  </span>
                  <p className="text-white font-bold text-lg">{current.title}</p>
                  <p className="text-gray-300 text-sm flex items-center gap-1.5 mt-0.5">
                    <i className="fa fa-map-marker text-orange-400" /> {current.location}
                  </p>
                </div>
                <a
                  href={current.src}
                  download
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 bg-white/10 hover:bg-orange-500 border border-white/20 hover:border-orange-500 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200"
                  onClick={e => e.stopPropagation()}
                >
                  <i className="fa fa-download" /> Download
                </a>
              </div>
            </div>
          </div>

          {/* Next */}
          <button
            className="absolute right-4 md:right-8 w-12 h-12 bg-white/10 hover:bg-orange-500 rounded-full flex items-center justify-center text-white transition-all duration-200 disabled:opacity-20 z-10"
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.min(i + 1, images.length - 1)); }}
            disabled={lightbox === images.length - 1}
          >
            <i className="fa fa-chevron-right" />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg px-4 scrollbar-hide">
            {images.map((img, i) => (
              <button
                key={img.id}
                onClick={e => { e.stopPropagation(); setLightbox(i); }}
                className={`shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all duration-200 ${i === lightbox ? 'border-orange-500 scale-110' : 'border-transparent opacity-50 hover:opacity-100'}`}
              >
                <img src={img.thumb} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}

      <CallToAction />
    </>
  );
}

