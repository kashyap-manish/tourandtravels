import { useParams, Link, useNavigate } from 'react-router-dom';
import { tours } from '../data/tours';

export default function TourDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const tour = tours.find(t => t.id === Number(id));

  if (!tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl text-gray-500">Tour not found.</p>
      <button onClick={() => navigate('/destination')} className="bg-orange-500 text-white px-6 py-2 rounded-xl">Back to Destinations</button>
    </div>
  );

  return (
    <>
      {/* Hero */}
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: `url('${tour.img}')`, minHeight: '55vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-16 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <Link to="/destination" className="hover:text-orange-400 transition-colors">Destinations</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">{tour.title}</span>
          </p>
          <h1 className="text-3xl md:text-4xl md:text-5xl font-extrabold tracking-tight">{tour.title}</h1>
          <p className="mt-2 text-gray-300 flex items-center justify-center gap-2">
            <i className="fa fa-map-marker text-orange-400" /> {tour.location}
          </p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14 grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">

        {/* Left: Main Details */}
        <div className="lg:col-span-2 space-y-10">

          {/* Overview */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">Overview</h2>
            <p className="text-gray-600 leading-relaxed">{tour.description}</p>
          </div>

          {/* Highlights */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Highlights</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {tour.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-gray-600 text-sm">
                  <i className="fa fa-check-circle text-orange-500 mt-0.5" /> {h}
                </li>
              ))}
            </ul>
          </div>

          {/* Itinerary */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Itinerary</h2>
            <div className="space-y-3">
              {tour.itinerary.map((item) => (
                <div key={item.day} className="flex gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="w-10 h-10 shrink-0 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {item.day}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{item.title}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-md p-6 sticky top-24">
            <div className="text-3xl font-extrabold text-orange-500 mb-1">{tour.price}</div>
            <div className="flex items-center gap-2 text-sm text-gray-400 mb-5">
              <i className="fa fa-clock-o text-orange-400" /> {tour.days}
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-2 mb-5">
              {tour.features.map((f, i) => (
                <span key={i} className="text-xs bg-gray-50 border border-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{f}</span>
              ))}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-5">
              {[...Array(5)].map((_, i) => (
                <i key={i} className={`fa fa-star text-xs ${i < 4 ? 'text-yellow-400' : 'text-gray-200'}`} />
              ))}
              <span className="text-xs text-gray-400 ml-1">(24 reviews)</span>
            </div>

            {/* What's Included */}
            <div className="mb-6">
              <p className="font-semibold text-gray-800 mb-2">What's Included</p>
              <ul className="space-y-1.5">
                {tour.includes.map((inc, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                    <i className="fa fa-check text-green-500 mt-0.5" /> {inc}
                  </li>
                ))}
              </ul>
            </div>

            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition-colors">
              Book Now
            </button>
            <Link to="/destination" className="block text-center text-sm text-gray-400 hover:text-orange-500 mt-3 transition-colors">
              ← Back to Destinations
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
