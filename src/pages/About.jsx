import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import RevealText, { RevealFilters } from '../components/RevealText';

const stats = [
  { value: '12+', label: 'Years Experience' },
  { value: '98%', label: 'Happy Clients' },
  { value: '340+', label: 'Tours Completed' },
  { value: '50+', label: 'Destinations' },
];

const services = [
  { img: '/images/services-1.jpg', icon: 'fa-paper-plane', title: 'Activities', desc: 'Curated local experiences and adventures tailored to every traveler.', to: '/experience/adventure' },
  { img: '/images/services-2.jpg', icon: 'fa-road', title: 'Travel Arrangements', desc: 'Seamless logistics from flights to transfers, all handled for you.', to: '/destination' },
  { img: '/images/services-3.jpg', icon: 'fa-user', title: 'Private Guide', desc: 'Expert local guides who bring destinations to life with insider knowledge.', to: '/contact' },
  { img: '/images/services-4.jpg', icon: 'fa-map', title: 'Location Manager', desc: 'On-ground support ensuring every detail of your journey runs smoothly.', to: '/destination' },
  { img: '/images/hotel-resto-1.jpg', icon: 'fa-building', title: 'Hotel Booking', desc: 'Handpicked hotels for every budget — from luxury resorts to cozy boutique stays.', to: '/hotel' },
  { img: '/images/bg_3.jpg', icon: 'fa-plane', title: 'Flight Booking', desc: 'Best fares on domestic and international flights, booked hassle-free.', to: '/flight' },
];

const team = [
  { img: '/images/person_1.jpg', name: 'Roger Scott', role: 'Founder & CEO' },
  { img: '/images/person_2.jpg', name: 'Anna Smith', role: 'Head of Operations' },
  { img: '/images/person_3.jpg', name: 'John Doe', role: 'Lead Travel Guide' },
  { img: '/images/person_4.jpg', name: 'Maria Cruz', role: 'Customer Experience' },
];

const testimonials = [
  { img: '/images/person_1.jpg', name: 'Roger Scott', role: 'Marketing Manager', rating: 5, text: 'Pacific made our honeymoon absolutely unforgettable. Every detail was perfectly arranged and the team was incredibly responsive throughout.' },
  { img: '/images/person_2.jpg', name: 'Anna Smith', role: 'Travel Blogger', rating: 5, text: 'As someone who travels constantly, I can say Pacific stands out. Their local knowledge and attention to detail is second to none.' },
  { img: '/images/person_3.jpg', name: 'John Doe', role: 'Adventure Seeker', rating: 4, text: 'Booked a 10-day Philippines tour and it exceeded every expectation. The private guide was phenomenal and truly made the trip.' },
];

export default function About() {
  return (
    <>
      {/* SVG filter defs — injected once */}
      <RevealFilters />

      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_1.jpg')", minHeight: '52vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">About Us</span>
          </p>
          <RevealText text="About Us" filterId={1} as="h1" className="text-5xl md:text-6xl font-extrabold tracking-tight text-white" />
          <RevealText text="Crafting extraordinary journeys since 2026" filterId={0} className="mt-3 text-gray-300 text-lg max-w-xl mx-auto" />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-orange-500">
        <div className="container-grid grid grid-cols-2 md:grid-cols-4 divide-x divide-orange-400">
          {stats.map(s => (
            <div key={s.label} className="py-6 md:py-8 text-center text-white">
              <RevealText text={s.value} filterId={2} as="p" className="text-2xl md:text-3xl font-extrabold" />
              <RevealText text={s.label} filterId={0} as="p" className="text-xs md:text-sm font-medium text-orange-100 mt-1" />
            </div>
          ))}
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 md:py-24">
        <div className="container-grid">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            {/* Images collage */}
            <div className="relative h-72 sm:h-96 md:h-[480px]">
              <div className="absolute top-0 left-0 w-3/4 h-3/4 rounded-2xl bg-cover bg-center shadow-xl" style={{ backgroundImage: "url('/images/about.jpg')" }} />
              <div className="absolute bottom-0 right-0 w-2/3 h-2/3 rounded-2xl bg-cover bg-center shadow-xl border-4 border-white" style={{ backgroundImage: "url('/images/about-1.jpg')" }} />
              <div className="absolute bottom-8 left-4 bg-white rounded-xl shadow-lg px-5 py-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <i className="fa fa-trophy text-white text-sm" />
                </div>
                <div>
                  <p className="font-bold text-gray-800 text-sm">Award Winning</p>
                  <p className="text-xs text-gray-500">Best Travel Agency 2023</p>
                </div>
              </div>
            </div>

            {/* Text */}
            <div>
              <RevealText text="Our Story" filterId={5} as="span" className="text-orange-500 font-semibold tracking-widest uppercase text-xs" />
              <RevealText text="We Turn Your Travel Dreams Into Reality" filterId={3} as="h2" className="text-3xl md:text-4xl font-extrabold mt-3 mb-6 leading-tight text-gray-900" />
              <RevealText
                text="Founded in 2026, Pacific Travel Agency was born from a passion for authentic exploration. We believe travel should be more than just sightseeing — it should be transformative, personal, and deeply memorable."
                filterId={0}
                className="text-gray-500 leading-relaxed mb-4"
              />
              <RevealText
                text="Our team of seasoned travel experts and local guides work tirelessly to craft journeys that go beyond the ordinary, connecting you with the heart and soul of every destination."
                filterId={6}
                className="text-gray-500 leading-relaxed mb-8"
              />
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/destination" className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-7 py-3 rounded-full font-semibold transition-colors shadow-lg shadow-orange-500/30">
                  <i className="fa fa-compass text-sm" /> Explore Destinations
                </Link>
                <Link to="/contact" className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 hover:border-orange-400 text-gray-700 hover:text-orange-500 px-7 py-3 rounded-full font-semibold transition-colors">
                  <i className="fa fa-phone text-sm" /> Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 md:py-24 bg-gray-50">
        <div className="container-grid">
          <div className="text-center mb-10 md:mb-14">
            <RevealText text="What We Offer" filterId={5} as="span" className="text-orange-500 font-semibold tracking-widest uppercase text-xs" />
            <RevealText text="Our Services" filterId={4} as="h2" className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {services.map((s, i) => (
              <Link
                key={s.title}
                to={s.to}
                className="group relative rounded-2xl overflow-hidden bg-cover bg-center h-72 shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                style={{ backgroundImage: `url('${s.img}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent group-hover:from-orange-900/90 group-hover:via-black/50 transition-all duration-500" />
                <div className="absolute inset-0 p-6 flex flex-col justify-end">
                  <div className="w-11 h-11 rounded-xl bg-orange-500 group-hover:bg-white flex items-center justify-center mb-3 shadow-lg transition-colors duration-300">
                    <i className={`fa ${s.icon} text-white group-hover:text-orange-500 transition-colors duration-300`} />
                  </div>
                  <RevealText text={s.title} filterId={i % 7} as="h3" className="text-white font-bold text-base" />
                  <p className="text-gray-300 text-xs mt-1.5 leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">{s.desc}</p>
                  <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-orange-400 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                    Explore <i className="fa fa-arrow-right text-[10px]" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Video Banner */}
      <section
        className="relative py-28 md:py-40 flex items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_4.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/55" />
        <div className="relative z-10 text-center text-white px-4">
          <RevealText text="Watch Our Story" filterId={5} as="p" className="text-orange-400 font-semibold tracking-widest uppercase text-xs mb-4" />
          <RevealText text="See The World Through Our Eyes" filterId={3} as="h2" className="text-3xl md:text-4xl font-extrabold mb-8" />
          <a
            href="https://vimeo.com/45830194"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center w-20 h-20 rounded-full border-2 border-white hover:bg-orange-500 hover:border-orange-500 transition-all duration-300 group"
          >
            <i className="fa fa-play text-white text-xl ml-1 group-hover:scale-110 transition-transform" />
          </a>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 md:py-24">
        <div className="container-grid">
          <div className="text-center mb-10 md:mb-14">
            <RevealText text="The People Behind Pacific" filterId={5} as="span" className="text-orange-500 font-semibold tracking-widest uppercase text-xs" />
            <RevealText text="Meet Our Team" filterId={1} as="h2" className="text-3xl md:text-4xl font-extrabold mt-3 text-gray-900" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {team.map((m, i) => (
              <div key={i} className="group text-center">
                <div className="relative mx-auto w-40 h-40 rounded-2xl overflow-hidden mb-4 shadow-md group-hover:shadow-xl transition-shadow">
                  <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${m.img}')` }} />
                  <div className="absolute inset-0 bg-orange-500/0 group-hover:bg-orange-500/10 transition-colors duration-300" />
                </div>
                <RevealText text={m.name} filterId={2} as="h3" className="font-bold text-gray-900 text-base" />
                <RevealText text={m.role} filterId={0} as="p" className="text-orange-500 text-sm font-medium mt-0.5" />
                <div className="flex justify-center gap-3 mt-3">
                  {['fa-facebook', 'fa-twitter', 'fa-instagram'].map(icon => (
                    <a key={icon} href="#" className="w-7 h-7 rounded-full bg-gray-100 hover:bg-orange-500 flex items-center justify-center transition-colors group/icon">
                      <i className={`fa ${icon} text-xs text-gray-500 group-hover/icon:text-white`} />
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24 bg-gray-950 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="relative z-10 container-grid">
          <div className="text-center mb-10 md:mb-14">
            <RevealText text="Testimonials" filterId={5} as="span" className="text-orange-400 font-semibold tracking-widest uppercase text-xs" />
            <RevealText text="What Our Travelers Say" filterId={6} as="h2" className="text-3xl md:text-4xl font-extrabold mt-3 text-white" />
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-orange-500/40 transition-colors">
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, j) => (
                    <i key={j} className={`fa fa-star text-sm ${j < t.rating ? 'text-yellow-400' : 'text-gray-600'}`} />
                  ))}
                </div>
                <RevealText text={`"${t.text}"`} filterId={i % 7} className="text-gray-300 text-sm leading-relaxed mb-6" />
                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-11 h-11 rounded-full bg-cover bg-center flex-shrink-0 ring-2 ring-orange-500/40" style={{ backgroundImage: `url('${t.img}')` }} />
                  <div>
                    <RevealText text={t.name} filterId={1} as="p" className="font-bold text-white text-sm" />
                    <RevealText text={t.role} filterId={0} as="span" className="text-xs text-gray-400" />
                  </div>
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

