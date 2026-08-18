import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Lottie from 'lottie-react';
import SearchForm from '../components/SearchForm';
import TourCard from '../components/TourCard';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';
import useInView from '../hooks/useInView';
import { tours as allTours } from '../data/tours';
import { fetchBlogs } from '../services/blogApi';
import '../styles/Firefly.css';

const slides = [
  {
    img: '/images/bg_1.jpg',
    tag: 'Welcome to Pacific',
    heading: 'Discover Your Favorite Place with Us',
    sub: 'Travel to any corner of the world, without going around in circles',
  },
  {
    img: '/images/bg_2.jpg',
    tag: 'Explore the World',
    heading: 'Adventure Awaits Around Every Corner',
    sub: 'From mountain peaks to tropical shores — your journey starts here',
  },
  {
    img: '/images/bg_3.jpg',
    tag: 'Handpicked Tours',
    heading: 'Unforgettable Experiences, Every Trip',
    sub: 'Expert-curated tours designed to create memories that last a lifetime',
  },
  {
    img: '/images/bg_4.jpg',
    tag: 'Best Price Guarantee',
    heading: 'Travel More, Spend Less with Pacific',
    sub: 'Premium experiences at prices that let you explore without limits',
  },
];

function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState(null);
  const [animKey, setAnimKey] = useState(0);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    setPrev(current);
    setCurrent(idx);
    setAnimKey(k => k + 1);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timerRef.current);
  }, [current]);

  const slide = slides[current];

  return (
    <section className="relative overflow-hidden" style={{ minHeight: '100vh' }}>
      {/* Fireflies */}
      {[...Array(15)].map((_, i) => <div key={i} className="firefly" />)}
      {/* Slides — crossfade */}
      {slides.map((s, i) => (
        <div
          key={i}
          className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
          style={{
            backgroundImage: `url('${s.img}')`,
            opacity: i === current ? 1 : 0,
            zIndex: i === current ? 1 : 0,
          }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20 z-10" />

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-500 via-yellow-400 to-orange-500 z-30" />

      {/* Content */}
      <div className="container-grid relative z-20 w-full flex flex-col lg:flex-row items-center justify-between gap-8" style={{ minHeight: '100vh' }}>
        <div className="max-w-2xl text-white" key={animKey}>
          <span className="hero-line-1 inline-block text-orange-400 font-semibold tracking-widest uppercase text-sm border border-orange-400/40 px-3 py-1 rounded-full mb-4">
            {slide.tag}
          </span>
          <h1 className="hero-line-2 text-4xl sm:text-5xl md:text-7xl font-bold mt-3 mb-5 leading-tight">
            {slide.heading.split(' ').map((word, i, arr) =>
              i === arr.length - 2
                ? <span key={i} className="text-orange-400">{word} </span>
                : word + ' '
            )}
          </h1>
          <p className="hero-line-3 text-gray-200 text-base md:text-xl mb-8">{slide.sub}</p>
          <div className="hero-line-4 flex items-center gap-5 flex-wrap">
            <a
              href="#tours"
              className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-full font-semibold transition-all hover:shadow-lg hover:shadow-orange-500/40 hover:-translate-y-0.5"
            >
              Explore Tours
            </a>
            <a
              href="https://vimeo.com/45830194"
              target="_blank"
              rel="noreferrer"
              className="play-btn-pulse w-14 h-14 rounded-full border-2 border-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors"
            >
              <i className="fa fa-play text-white ml-1" />
            </a>
            <span className="text-gray-300 text-sm">Watch our story</span>
          </div>
        </div>
        {/* Lottie plane */}
        <div className="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 xl:w-96 flex-shrink-0 hero-line-4 mx-auto lg:mx-0">
          <LottieURL url={LOTTIE_PLANE} className="w-full" />
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { clearInterval(timerRef.current); goTo(i); }}
            className={`transition-all duration-300 rounded-full ${
              i === current
                ? 'w-8 h-2.5 bg-orange-500'
                : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

      {/* Arrow controls */}
      <button
        onClick={() => { clearInterval(timerRef.current); goTo((current - 1 + slides.length) % slides.length); }}
        className="absolute left-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-orange-500 border border-white/20 hover:border-orange-500 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <i className="fa fa-chevron-left text-sm" />
      </button>
      <button
        onClick={() => { clearInterval(timerRef.current); goTo((current + 1) % slides.length); }}
        className="absolute right-5 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-white/10 hover:bg-orange-500 border border-white/20 hover:border-orange-500 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-200"
      >
        <i className="fa fa-chevron-right text-sm" />
      </button>

      {/* Slide counter */}
      {/* <div className="absolute bottom-8 right-8 z-30 text-white/50 text-xs font-semibold tracking-widest">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div> */}
    </section>
  );
}

const trendingDestinations = [
  { name: 'Hyderabad',  img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&q=80', slug: 'hyderabad' },
  { name: 'New Delhi',  img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600&q=80', slug: 'new-delhi' },
  { name: 'Goa',        img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&q=80', slug: 'goa' },
  { name: 'Bengaluru',  img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&q=80', slug: 'bengaluru' },
  { name: 'Mumbai',     img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&q=80', slug: 'mumbai' },
  { name: 'Jaipur',     img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&q=80', slug: 'jaipur' },
  { name: 'Kerala',     img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=600&q=80', slug: 'kerala' },
  { name: 'Ladakh',     img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&q=80', slug: 'ladakh' },
];

function TrendingDestinations() {
  const scrollRef = useRef(null);
  const [canLeft, setCanLeft]   = useState(false);
  const [canRight, setCanRight] = useState(true);

  const CARD_W = 300;

  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanLeft(el.scrollLeft > 0);
    setCanRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * CARD_W, behavior: 'smooth' });
  };

  return (
    <section className="py-16 md:py-20">
      <div className="container-grid">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Trending destinations for Indian travelers</h2>
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link
              to="/destination"
              className="text-xs font-bold tracking-widest uppercase border border-gray-300 hover:border-orange-500 hover:text-orange-500 px-4 py-2 rounded-full transition-colors"
            >
              See More
            </Link>
            <button
              onClick={() => scroll(-1)}
              disabled={!canLeft}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 disabled:opacity-30 transition-colors"
            >
              <i className="fa fa-chevron-left text-xs" />
            </button>
            <button
              onClick={() => scroll(1)}
              disabled={!canRight}
              className="w-9 h-9 rounded-full border border-gray-300 flex items-center justify-center hover:border-orange-500 hover:text-orange-500 disabled:opacity-30 transition-colors"
            >
              <i className="fa fa-chevron-right text-xs" />
            </button>
          </div>
        </div>

        {/* Scrollable row */}
        <div
          ref={scrollRef}
          onScroll={checkScroll}
          className="flex gap-4 overflow-x-auto pb-2"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {trendingDestinations.map((d) => (
            <Link
              key={d.name}
              to={`/city/${d.slug}`}
              className="flex-shrink-0 relative rounded-2xl overflow-hidden group"
              style={{ width: CARD_W, height: 380 }}
            >
              <img
                src={d.img}
                alt={d.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {/* subtle bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              {/* Name pill */}
              <div className="absolute bottom-4 left-4">
                <span className="bg-white text-gray-900 font-bold text-sm px-4 py-2 rounded-full shadow-md">
                  {d.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

const services = [
  { img: '/images/services-1.jpg', icon: 'fa-paper-plane', title: 'Activities', color: 'bg-orange-500/80' },
  { img: '/images/services-2.jpg', icon: 'fa-road', title: 'Travel Arrangements', color: 'bg-blue-500/80' },
  { img: '/images/services-3.jpg', icon: 'fa-user', title: 'Private Guide', color: 'bg-green-500/80' },
  { img: '/images/services-4.jpg', icon: 'fa-map', title: 'Location Manager', color: 'bg-purple-500/80' },
];

const places = [
  { img: '/images/place-1.jpg', name: 'Philippines', tours: '8 Tours', slug: 'philippines' },
  { img: '/images/place-2.jpg', name: 'Canada', tours: '2 Tours', slug: 'canada' },
  { img: '/images/place-3.jpg', name: 'Thailand', tours: '5 Tours', slug: 'thailand' },
  { img: '/images/place-4.jpg', name: 'Australia', tours: '5 Tours', slug: 'australia' },
  { img: '/images/place-5.jpg', name: 'Greece', tours: '7 Tours', slug: 'greece' },
];

const tours = allTours.slice(0, 6);

const testimonials = [
  { img: '/images/person_1.jpg', name: 'Roger Scott', role: 'Marketing Manager', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
  { img: '/images/person_2.jpg', name: 'Anna Smith', role: 'Travel Blogger', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
  { img: '/images/person_3.jpg', name: 'John Doe', role: 'Adventure Seeker', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
];

const stats = [
  { icon: 'fa-globe', value: 120, label: 'Destinations' },
  { icon: 'fa-users', value: 8500, label: 'Happy Travelers' },
  { icon: 'fa-trophy', value: 15, label: 'Awards Won' },
  { icon: 'fa-calendar', value: 10, label: 'Years Experience' },
];

function AnimatedCounter({ target, inView }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(target / 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(start);
    }, 25);
    return () => clearInterval(timer);
  }, [inView, target]);
  return <span>{count.toLocaleString()}+</span>;
}

function AnimSection({ children, className = '', anim = 'animate-fade-up', delay = '', style }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} style={style} className={`anim-hidden ${inView ? `anim-visible ${anim} ${delay}` : ''} ${className}`}>
      {children}
    </div>
  );
}

const LOTTIE_GLOBE   = 'https://assets9.lottiefiles.com/packages/lf20_uu0x8lqv.json';
const LOTTIE_SUCCESS = 'https://assets4.lottiefiles.com/packages/lf20_jbrw3hcz.json';
const LOTTIE_PLANE   = 'https://assets2.lottiefiles.com/packages/lf20_jhu1lqdz.json';

function LottieURL({ url, className = '', loop = true, autoplay = true }) {
  const [data, setData] = useState(null);
  useEffect(() => {
    fetch(url).then(r => r.json()).then(setData).catch(() => {});
  }, [url]);
  if (!data) return null;
  const Player = Lottie?.default ?? Lottie;
  return <Player animationData={data} loop={loop} autoplay={autoplay} className={className} />;
}

export default function Home() {
  const [statsRef, statsInView] = useInView();
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    fetchBlogs('All').then(data => setBlogs(data.slice(0, 3))).catch(() => {});
  }, []);

  return (
    <>
      <HeroSlider />

      {/* Stats Banner */}
      <section className="py-16 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg_2.jpg')" }}>
        <div className="absolute inset-0 bg-black/65" />
        <div ref={statsRef} className="container-grid relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className={`stat-card anim-hidden ${statsInView ? `anim-visible animate-scale-in delay-${(i + 1) * 100}` : ''}`}>
                <i className={`fa ${s.icon} text-orange-400 text-3xl mb-3`} />
                <p className="text-3xl font-bold">
                  <AnimatedCounter target={s.value} inView={statsInView} />
                </p>
                <p className="text-gray-300 text-sm mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trending Destinations */}
      <TrendingDestinations />

      {/* Lottie Globe Feature Strip */}
      <section className="py-10 bg-orange-50">
        <div className="container-grid flex flex-col md:flex-row items-center gap-8">
          <AnimSection anim="animate-fade-left" className="w-48 h-48 flex-shrink-0 mx-auto md:mx-0">
            <LottieURL url={LOTTIE_GLOBE} className="w-full h-full" />
          </AnimSection>
          <AnimSection anim="animate-fade-right">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">Explore the World with Confidence</h3>
            <p className="text-gray-500">We connect travelers to unforgettable destinations across every continent. From tropical beaches to mountain peaks — your next adventure starts here.</p>
          </AnimSection>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24">
        <div className="container-grid">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 order-2 md:order-1 grid grid-cols-2 gap-4">
              {services.map((s, i) => (
                <AnimSection key={s.title} anim="animate-scale-in" delay={`delay-${(i + 1) * 100}`}>
                  <div className="service-card rounded-xl" style={{ backgroundImage: `url('${s.img}')` }}>
                    <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center mb-3`}>
                      <i className={`fa ${s.icon} text-white`} />
                    </div>
                    <h3 className="text-white font-bold text-base">{s.title}</h3>
                    <p className="text-gray-200 text-sm mt-1">Expert-curated experiences tailored just for you.</p>
                  </div>
                </AnimSection>
              ))}
            </div>
            <div className="w-full md:w-1/2 order-1 md:order-2">
              <AnimSection anim="animate-fade-right">
                <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Welcome to Pacific</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 leading-tight">It's time to start your <span className="text-orange-500">adventure</span></h2>
                <p className="text-gray-500 mb-3">A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
                <p className="text-gray-500 mb-6">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
                <div className="flex gap-4 flex-wrap">
                  <a href="/destination" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/30">
                    Search Destination
                  </a>
                  <a href="/about" className="border border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-semibold transition-all">
                    Learn More
                  </a>
                </div>
              </AnimSection>
            </div>
          </div>
        </div>
      </section>

      {/* Select Destination */}
      <section className="py-16 md:py-24 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg_3.jpg')" }}>
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-grid relative z-10">
          <AnimSection anim="animate-fade-up" className="text-center text-white mb-12 px-6">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-sm">Pacific Provide Places</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Select Your Destination</h2>
          </AnimSection>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {places.map((p, i) => (
              <AnimSection key={p.name} anim="animate-scale-in" delay={`delay-${(i + 1) * 100}`}>
                <Link to={`/destination?country=${p.slug}`} className="dest-card block" style={{ backgroundImage: `url('${p.img}')` }}>
                  <div className="dest-text">
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <span className="text-sm text-gray-200">{p.tours}</span>
                  </div>
                </Link>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Destinations */}
      <section id="tours" className="py-16 md:py-24">
        <div className="container-grid">
          <AnimSection anim="animate-fade-up" className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Destination</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Tour Destination</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full" />
          </AnimSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {tours.map((t, i) => (
              <AnimSection key={i} anim="animate-fade-up" delay={`delay-${((i % 3) + 1) * 100}`}>
                <TourCard {...t} />
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Video Banner */}
      <section className="relative hero-bg py-40 flex items-center justify-center" style={{ backgroundImage: "url('/images/bg_4.jpg')" }}>
        {/* <div className="overlay" /> */}
        <AnimSection anim="animate-scale-in" className="relative z-10 text-center text-white">
          <p className="text-orange-400 font-semibold tracking-widest uppercase text-sm mb-3">Watch Our Story</p>
          <h2 className="text-3xl md:text-5xl font-bold mb-8">Experience the World</h2>
          <a href="https://vimeo.com/45830194" target="_blank" rel="noreferrer"
            className="play-btn-pulse inline-flex w-20 h-20 rounded-full border-2 border-white items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors">
            <i className="fa fa-play text-white text-xl ml-1" />
          </a>
        </AnimSection>
      </section>

      {/* About */}
      <section className="py-16 md:py-24">
        <div className="container-grid">
          <div className="flex flex-col md:flex-row rounded-2xl overflow-hidden shadow-2xl">
            <AnimSection anim="animate-fade-left" className="w-full md:w-1/2 h-72 md:h-auto bg-cover bg-center" style={{ backgroundImage: "url('/images/about-1.jpg')" }} />
            <AnimSection anim="animate-fade-right" className="w-full md:w-1/2 bg-white p-8 md:p-12 flex flex-col justify-center">
              <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">About Us</span>
              <h2 className="text-2xl md:text-3xl font-bold mt-2 mb-4 leading-tight">Make Your Tour <span className="text-orange-500">Memorable</span> and Safe With Us</h2>
              <p className="text-gray-500 mb-6">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
              <ul className="space-y-2 mb-6">
                {['Expert local guides', '24/7 customer support', 'Best price guarantee'].map(item => (
                  <li key={item} className="flex items-center gap-2 text-gray-600 text-sm">
                    <i className="fa fa-check-circle text-orange-500" /> {item}
                  </li>
                ))}
              </ul>
              <div className="flex items-center gap-4">
                <a href="/destination" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full font-semibold transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-orange-400/30">
                  Book Your Destination
                </a>
                <LottieURL url={LOTTIE_SUCCESS} loop={false} className="w-14 h-14" />
              </div>
            </AnimSection>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg_1.jpg')" }}>
        <div className="absolute inset-0 bg-black/65" />
        <div className="container-grid relative z-10">
          <AnimSection anim="animate-fade-up" className="text-center text-white mb-12">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-sm">Testimonial</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Tourist Feedback</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full" />
          </AnimSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <AnimSection key={i} anim="animate-fade-up" delay={`delay-${(i + 1) * 100}`}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-white border border-white/10 hover:border-orange-400/40 transition-colors h-full">
                  <i className="fa fa-quote-left text-orange-400 text-2xl mb-3" />
                  <p className="text-gray-200 mb-5 text-sm leading-relaxed">{t.text}</p>
                  <div className="flex text-yellow-400 text-xs mb-4">
                    {[...Array(5)].map((_, j) => <i key={j} className="fa fa-star mr-0.5" />)}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-orange-400" style={{ backgroundImage: `url('${t.img}')` }} />
                    <div>
                      <p className="font-bold text-sm">{t.name}</p>
                      <span className="text-xs text-gray-300">{t.role}</span>
                    </div>
                  </div>
                </div>
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-16 md:py-24">
        <div className="container-grid">
          <AnimSection anim="animate-fade-up" className="text-center mb-12">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Our Blog</span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">Recent Posts</h2>
            <div className="w-16 h-1 bg-orange-500 mx-auto mt-4 rounded-full" />
          </AnimSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {blogs.map((b, i) => (
              <AnimSection key={i} anim="animate-fade-up" delay={`delay-${(i + 1) * 100}`}>
                <BlogCard {...b} />
              </AnimSection>
            ))}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
