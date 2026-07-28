import { useState } from 'react';
import SearchForm from '../components/SearchForm';
import TourCard from '../components/TourCard';
import BlogCard from '../components/BlogCard';
import CallToAction from '../components/CallToAction';

const services = [
  { img: '/images/services-1.jpg', icon: 'fa-paper-plane', title: 'Activities', color: 'bg-orange-500/80' },
  { img: '/images/services-2.jpg', icon: 'fa-road', title: 'Travel Arrangements', color: 'bg-blue-500/80' },
  { img: '/images/services-3.jpg', icon: 'fa-user', title: 'Private Guide', color: 'bg-green-500/80' },
  { img: '/images/services-4.jpg', icon: 'fa-map', title: 'Location Manager', color: 'bg-purple-500/80' },
];

const places = [
  { img: '/images/place-1.jpg', name: 'Philippines', tours: '8 Tours' },
  { img: '/images/place-2.jpg', name: 'Canada', tours: '2 Tours' },
  { img: '/images/place-3.jpg', name: 'Thailand', tours: '5 Tours' },
  { img: '/images/place-4.jpg', name: 'Australia', tours: '5 Tours' },
  { img: '/images/place-5.jpg', name: 'Greece', tours: '7 Tours' },
];

const tours = [
  { img: '/images/destination-1.jpg', price: '$550/person', days: '8 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '⛰ Near Mountain'] },
  { img: '/images/destination-2.jpg', price: '$550/person', days: '10 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '🏖 Near Beach'] },
  { img: '/images/destination-3.jpg', price: '$550/person', days: '7 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '🏖 Near Beach'] },
  { img: '/images/destination-4.jpg', price: '$550/person', days: '8 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '🏖 Near Beach'] },
  { img: '/images/destination-5.jpg', price: '$550/person', days: '10 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '🏖 Near Beach'] },
  { img: '/images/destination-6.jpg', price: '$550/person', days: '7 Days Tour', title: 'Banaue Rice Terraces', location: 'Banaue, Ifugao, Philippines', features: ['🚿 2', '🛏 3', '🏖 Near Beach'] },
];

const testimonials = [
  { img: '/images/person_1.jpg', name: 'Roger Scott', role: 'Marketing Manager', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
  { img: '/images/person_2.jpg', name: 'Anna Smith', role: 'Travel Blogger', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
  { img: '/images/person_3.jpg', name: 'John Doe', role: 'Adventure Seeker', text: 'Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.' },
];

const blogs = [
  { img: '/images/image_1.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World' },
  { img: '/images/image_2.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World' },
  { img: '/images/image_3.jpg', day: '11', year: '2020', month: 'September', title: 'Most Popular Place In This World' },
];

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <>
      {/* Hero */}
      <section
        className="relative hero-bg flex items-center"
        style={{ backgroundImage: "url('/images/bg_5.jpg')", minHeight: '100vh' }}
      >
        <div className="overlay" />
        <div className="relative z-10 max-w-7xl mx-auto px-4 w-full">
          <div className="max-w-xl text-white">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-sm">Welcome to Pacific</span>
            <h1 className="text-4xl md:text-6xl font-bold mt-3 mb-5 leading-tight">Discover Your Favorite Place with Us</h1>
            <p className="text-gray-200 text-lg">Travel to any corner of the world, without going around in circles</p>
          </div>
          <a href="https://vimeo.com/45830194" target="_blank" rel="noreferrer"
            className="mt-8 w-16 h-16 rounded-full border-2 border-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors">
            <i className="fa fa-play text-white ml-1" />
          </a>
        </div>
      </section>

      {/* Search */}
      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <SearchForm />
      </section>

      {/* Services */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 grid grid-cols-2 gap-4">
              {services.map(s => (
                <div key={s.title} className="service-card rounded-lg" style={{ backgroundImage: `url('${s.img}')` }}>
                  <div className={`w-12 h-12 rounded-full ${s.color} flex items-center justify-center mb-3`}>
                    <i className={`fa ${s.icon} text-white`} />
                  </div>
                  <h3 className="text-white font-bold text-base">{s.title}</h3>
                  <p className="text-gray-200 text-sm mt-1">A small river named Duden flows by their place and supplies it with the necessary</p>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Welcome to Pacific</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">It's time to start your adventure</h2>
              <p className="text-gray-600 mb-3">A small river named Duden flows by their place and supplies it with the necessary regelialia. It is a paradisematic country, in which roasted parts of sentences fly into your mouth.</p>
              <p className="text-gray-600 mb-6">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.</p>
              <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold transition-colors">Search Destination</a>
            </div>
          </div>
        </div>
      </section>

      {/* Select Destination */}
      <section className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg_3.jpg')" }}>
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-10">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-sm">Pacific Provide Places</span>
            <h2 className="text-3xl font-bold mt-2">Select Your Destination</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {places.map(p => (
              <a key={p.name} href="#" className="dest-card" style={{ backgroundImage: `url('${p.img}')` }}>
                <div className="dest-text">
                  <h3 className="font-bold text-lg">{p.name}</h3>
                  <span className="text-sm text-gray-200">{p.tours}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Tour Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Destination</span>
            <h2 className="text-3xl font-bold mt-2">Tour Destination</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tours.map((t, i) => <TourCard key={i} {...t} />)}
          </div>
        </div>
      </section>

      {/* Video Banner */}
      <section
        className="relative hero-bg py-32 flex items-center justify-center"
        style={{ backgroundImage: "url('/images/bg_4.jpg')" }}
      >
        <div className="overlay" />
        <a href="https://vimeo.com/45830194" target="_blank" rel="noreferrer"
          className="relative z-10 w-20 h-20 rounded-full border-2 border-white flex items-center justify-center hover:bg-orange-500 hover:border-orange-500 transition-colors">
          <i className="fa fa-play text-white text-xl ml-1" />
        </a>
      </section>

      {/* About */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-0 rounded-lg overflow-hidden shadow-lg">
            <div className="h-72 md:h-auto bg-cover bg-center" style={{ backgroundImage: "url('/images/about-1.jpg')" }} />
            <div className="bg-white p-10 flex flex-col justify-center">
              <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">About Us</span>
              <h2 className="text-3xl font-bold mt-2 mb-4">Make Your Tour Memorable and Safe With Us</h2>
              <p className="text-gray-600 mb-6">Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts. Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.</p>
              <a href="#" className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded font-semibold transition-colors w-fit">Book Your Destination</a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-cover bg-center relative" style={{ backgroundImage: "url('/images/bg_1.jpg')" }}>
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center text-white mb-10">
            <span className="text-orange-400 font-semibold tracking-widest uppercase text-sm">Testimonial</span>
            <h2 className="text-3xl font-bold mt-2">Tourist Feedback</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-white">
                <div className="flex text-yellow-400 text-sm mb-3">
                  {[...Array(5)].map((_, j) => <i key={j} className="fa fa-star mr-1" />)}
                </div>
                <p className="text-gray-200 mb-4 text-sm">{t.text}</p>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-cover bg-center flex-shrink-0" style={{ backgroundImage: `url('${t.img}')` }} />
                  <div>
                    <p className="font-bold">{t.name}</p>
                    <span className="text-xs text-gray-300">{t.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-orange-500 font-semibold tracking-widest uppercase text-sm">Our Blog</span>
            <h2 className="text-3xl font-bold mt-2">Recent Post</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {blogs.map((b, i) => <BlogCard key={i} {...b} />)}
          </div>
        </div>
      </section>

      <CallToAction />
    </>
  );
}
