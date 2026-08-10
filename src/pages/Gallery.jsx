import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import SlideShow from '../components/SlideShow';

const CATEGORIES = ['All', 'Beaches', 'Mountains', 'Culture', 'Adventure', 'Wildlife', 'Cities'];

const IMAGES = [
  // Beaches
  { id: 1,  src: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=70', cat: 'Beaches',   title: 'Boracay White Beach',    location: 'Philippines', span: 'tall' },
  { id: 2,  src: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&q=70', cat: 'Beaches',   title: 'Maldives Overwater',     location: 'Maldives',    span: 'wide' },
  { id: 3,  src: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?w=400&q=70', cat: 'Beaches',   title: 'Tropical Shoreline',     location: 'Bali',        span: 'normal' },
  { id: 4,  src: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&q=70', cat: 'Beaches',   title: 'Crystal Cove',           location: 'Thailand',    span: 'normal' },
  // Mountains
  { id: 5,  src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=70', cat: 'Mountains', title: 'Himalayan Peaks',        location: 'Nepal',       span: 'wide' },
  { id: 6,  src: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=400&q=70', cat: 'Mountains', title: 'Snow Capped Summit',     location: 'Switzerland', span: 'tall' },
  { id: 7,  src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=70', cat: 'Mountains', title: 'Alpine Valley',          location: 'Austria',     span: 'normal' },
  { id: 8,  src: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400&q=70', cat: 'Mountains', title: 'Starry Mountain Night',  location: 'Norway',      span: 'normal' },
  // Culture
  { id: 9,  src: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400&q=70', cat: 'Culture',   title: 'Taj Mahal at Dawn',      location: 'India',       span: 'wide' },
  { id: 10, src: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=70', cat: 'Culture',   title: 'Ancient Temples',        location: 'Cambodia',    span: 'tall' },
  { id: 11, src: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1548013146-72479768bada?w=400&q=70', cat: 'Culture',   title: 'Rajasthan Forts',        location: 'India',       span: 'normal' },
  { id: 12, src: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&q=70', cat: 'Culture',   title: 'Kyoto Shrine',           location: 'Japan',       span: 'normal' },
  // Adventure
  { id: 13, src: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=400&q=70', cat: 'Adventure', title: 'Mountain Hiking Trail',  location: 'Patagonia',   span: 'tall' },
  { id: 14, src: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1530866495561-507c9faab2ed?w=400&q=70', cat: 'Adventure', title: 'River Rafting',          location: 'Colorado',    span: 'wide' },
  { id: 15, src: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&q=70', cat: 'Adventure', title: 'Camping Under Stars',    location: 'Iceland',     span: 'normal' },
  { id: 16, src: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=400&q=70', cat: 'Adventure', title: 'Rock Climbing',          location: 'Yosemite',    span: 'normal' },
  // Wildlife
  { id: 17, src: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?w=400&q=70', cat: 'Wildlife',  title: 'African Safari',         location: 'Kenya',       span: 'wide' },
  { id: 18, src: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=400&q=70', cat: 'Wildlife',  title: 'Arctic Fox',             location: 'Finland',     span: 'tall' },
  { id: 19, src: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1557050543-4d5f4e07ef46?w=400&q=70', cat: 'Wildlife',  title: 'Elephant Herd',          location: 'Botswana',    span: 'normal' },
  { id: 20, src: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=400&q=70', cat: 'Wildlife',  title: 'Lion at Sunset',         location: 'Tanzania',    span: 'normal' },
  // Cities
  { id: 21, src: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=400&q=70', cat: 'Cities',    title: 'City Skyline at Night',  location: 'New York',    span: 'wide' },
  { id: 22, src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&q=70', cat: 'Cities',    title: 'London Bridge',          location: 'UK',          span: 'tall' },
  { id: 23, src: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&q=70', cat: 'Cities',    title: 'Tokyo Neon Streets',     location: 'Japan',       span: 'normal' },
  { id: 24, src: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', thumb: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&q=70', cat: 'Cities',    title: 'Paris at Dusk',          location: 'France',      span: 'normal' },
];

const STATS = [
  { value: '2,400+', label: 'Photos', icon: 'fa-camera' },
  { value: '80+',    label: 'Destinations', icon: 'fa-map-marker' },
  { value: '120+',   label: 'Photographers', icon: 'fa-user' },
  { value: '50K+',   label: 'Downloads', icon: 'fa-download' },
];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [lightbox, setLightbox] = useState(null); // index in filtered
  const [visible, setVisible] = useState(12);
  const [loaded, setLoaded] = useState({});

  const filtered = activeCategory === 'All' ? IMAGES : IMAGES.filter(i => i.cat === activeCategory);
  const shown = filtered.slice(0, visible);

  // keyboard nav for lightbox
  const handleKey = useCallback((e) => {
    if (lightbox === null) return;
    if (e.key === 'ArrowRight') setLightbox(i => Math.min(i + 1, filtered.length - 1));
    if (e.key === 'ArrowLeft')  setLightbox(i => Math.max(i - 1, 0));
    if (e.key === 'Escape')     setLightbox(null);
  }, [lightbox, filtered.length]);

  useEffect(() => {
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [handleKey]);

  // reset visible on category change
  useEffect(() => { setVisible(12); }, [activeCategory]);

  const current = lightbox !== null ? filtered[lightbox] : null;

  return (
    <>
      {/* ── Hero: Full Screen SlideShow ── */}
      <section className="relative" style={{ height: '100vh' }}>

        {/* SlideShow fills entire hero */}
        <div className="absolute inset-0">
          <SlideShow />
        </div>

        {/* Dark gradient overlay for text readability */}
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

      {/* ── Category Filter ── */}
      <section className="bg-gray-950 sticky top-[72px] z-30 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-200
                ${activeCategory === cat
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
            >
              {cat}
            </button>
          ))}
          <span className="ml-auto shrink-0 text-xs text-gray-500 whitespace-nowrap">
            <span className="text-white font-bold">{filtered.length}</span> photos
          </span>
        </div>
      </section>

      {/* ── Masonry Grid ── */}
      <section className="bg-gray-950 py-10 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
            {shown.map((img, idx) => (
              <div
                key={img.id}
                className="break-inside-avoid group relative overflow-hidden rounded-2xl cursor-zoom-in bg-gray-900"
                style={{ animationDelay: `${(idx % 12) * 0.05}s` }}
                onClick={() => setLightbox(idx)}
              >
                {/* skeleton shimmer */}
                {!loaded[img.id] && (
                  <div className={`w-full bg-gray-800 animate-pulse rounded-2xl ${img.span === 'tall' ? 'h-80' : img.span === 'wide' ? 'h-48' : 'h-60'}`} />
                )}
                <img
                  src={img.thumb}
                  alt={img.title}
                  loading="lazy"
                  onLoad={() => setLoaded(p => ({ ...p, [img.id]: true }))}
                  className={`w-full object-cover rounded-2xl transition-transform duration-700 group-hover:scale-105 ${loaded[img.id] ? 'block' : 'hidden'} ${img.span === 'tall' ? 'h-80' : img.span === 'wide' ? 'h-48' : 'h-60'}`}
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
          {visible < filtered.length && (
            <div className="flex justify-center mt-12">
              <button
                onClick={() => setVisible(v => v + 8)}
                className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-8 py-3 rounded-full transition-colors shadow-lg shadow-orange-500/30"
              >
                <i className="fa fa-plus" /> Load More
                <span className="text-orange-200 text-xs font-normal">({filtered.length - visible} remaining)</span>
              </button>
            </div>
          )}

          {shown.length === 0 && (
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
            {lightbox + 1} / {filtered.length}
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
            onClick={e => { e.stopPropagation(); setLightbox(i => Math.min(i + 1, filtered.length - 1)); }}
            disabled={lightbox === filtered.length - 1}
          >
            <i className="fa fa-chevron-right" />
          </button>

          {/* Thumbnail strip */}
          <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-lg px-4 scrollbar-hide">
            {filtered.map((img, i) => (
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
