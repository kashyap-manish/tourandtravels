import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { createBooking, createPaymentOrder, verifyPayment, getReviews, addReview, getTourById } from '../services/api';
import { useSelector } from 'react-redux';

const TABS = ['Overview', 'Itinerary', 'Includes', 'Reviews'];
const LABELS = {
  fullName: 'Full Name',
  phone: 'Phone',
  email: 'Email',
  travelDate: 'Travel Date',
  persons: 'Persons',
  specialRequests: 'Special Requests',
  optional: '(optional)',
  stepBookingDetails: 'Booking Details',
  stepPayment: 'Payment',
};

const BOOKING_STEPS = [LABELS.stepBookingDetails, LABELS.stepPayment];

export default function TourDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [tour, setTour] = useState(null);
  const [tourLoading, setTourLoading] = useState(true);

  useEffect(() => {
    setTourLoading(true);
    getTourById(slug)
      .then(r => setTour(r.data))
      .catch(() => setTour(null))
      .finally(() => setTourLoading(false));
  }, [slug]);

  const fullStars = Math.floor(tour?.rating ?? 4.5);
  const hasHalf = (tour?.rating ?? 4.5) - fullStars >= 0.5;

  const [tab, setTab] = useState('Overview');
  const [showBooking, setShowBooking] = useState(false);
  const [step, setStep] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '',
    travelDate: '', persons: 1, specialRequests: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (tab !== 'Reviews' || !tour?._id) return;
    setReviewsLoading(true);
    getReviews(tour._id)
      .then(r => setReviews(r.data || []))
      .catch(() => {})
      .finally(() => setReviewsLoading(false));
  }, [tab, tour]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewSubmitting(true);
    setReviewError('');
    try {
      const res = await addReview(tour._id, reviewForm);
      setReviews(prev => [res.data, ...prev]);
      setReviewSuccess(true);
      setReviewForm({ rating: 5, comment: '' });
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (tourLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <i className="fa fa-spinner fa-spin text-orange-500 text-3xl" />
    </div>
  );

  if (!tour) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-xl text-gray-500">Tour not found.</p>
      <button onClick={() => navigate('/destination')} className="bg-orange-500 text-white px-6 py-2 rounded-xl">Back to Destinations</button>
    </div>
  );

  const priceNum = parseInt(tour.price.replace(/[^0-9]/g, ''));
  const totalNum = priceNum * form.persons;
  const total = `₹${totalNum.toLocaleString('en-IN')}`;

  const closeModal = () => { setShowBooking(false); setSuccess(false); setError(''); setStep(1); };

  const loadRazorpayScript = () => new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });

  const handleDetailsSubmit = (e) => {
    e.preventDefault();
    setStep(2);
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      // 1. Create booking with pending status
      const bookingRes = await createBooking({
        tourSlug: tour.slug,
        ...form,
        totalPrice: totalNum,
        paymentMethod: 'razorpay',
      });
      const bookingId = bookingRes.data._id;

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) throw new Error('Razorpay SDK failed to load');

      // 3. Create Razorpay order
      const orderRes = await createPaymentOrder(totalNum);
      const { orderId, amount, currency, keyId } = orderRes.data;

      // 4. Open Razorpay checkout
      const options = {
        key: keyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount,
        currency,
        name: 'Pacific Travel',
        description: tour.title,
        image: import.meta.env.VITE_LOGO_URL || '',
        order_id: orderId,
        prefill: { name: form.name, email: form.email, contact: form.phone },
        theme: { color: '#f97316' },
        handler: async (response) => {
          try {
            await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              bookingId,
            });
            setSuccess(true);
          } catch {
            setError('Payment verification failed. Contact support.');
          }
        },
        modal: { ondismiss: () => setSubmitting(false) },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Hero */}
      <section className="relative flex items-end justify-center bg-cover bg-center" style={{ backgroundImage: `url('${tour.img}')`, minHeight: '60vh' }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/10" />
        <div className="relative z-10 w-full max-w-6xl mx-auto px-6 pb-10">
          <p className="text-sm mb-4 flex items-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <Link to="/destination" className="hover:text-orange-400 transition-colors">Destinations</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">{tour.title}</span>
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full">{tour.category}</span>
                <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5">
                  <i className="fa fa-clock-o text-orange-400" />{tour.days}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">{tour.title}</h1>
              <p className="mt-2 text-gray-300 flex items-center gap-2 text-sm">
                <i className="fa fa-map-marker text-orange-400" />{tour.location}
              </p>
              <div className="flex items-center gap-1 mt-3">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa ${
                    i < fullStars ? 'fa-star text-yellow-400' :
                    i === fullStars && hasHalf ? 'fa-star-half-o text-yellow-400' :
                    'fa-star text-gray-500'
                  } text-sm`} />
                ))}
                <span className="text-gray-300 text-xs ml-1.5">{tour.rating} · {tour.reviews} reviews</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-gray-400 text-xs">Starting from</p>
                <p className="text-3xl font-extrabold text-orange-400">{tour.price}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sticky Tab Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="flex">
            {TABS.map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-5 py-4 text-sm font-semibold border-b-2 transition-colors ${tab === t ? 'border-orange-500 text-orange-500' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
              >
                {t}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setShowBooking(true); setStep(1); }}
            className="hidden md:flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-xl transition-colors"
          >
            <i className="fa fa-calendar-check-o" /> Book Now
          </button>
        </div>
      </div>

      {/* Mobile sticky Book Now bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-100 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs text-gray-400">Starting from</p>
          <p className="text-lg font-extrabold text-orange-500">{tour.price}</p>
        </div>
        <button
          onClick={() => { setShowBooking(true); setStep(1); }}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm"
        >
          <i className="fa fa-calendar-check-o" /> Book Now
        </button>
      </div>

      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10 pb-24 lg:pb-10 grid grid-cols-1 lg:grid-cols-3 gap-10">

        {/* Left Content */}
        <div className="lg:col-span-2">

          {/* Overview Tab */}
          {tab === 'Overview' && (
            <div className="space-y-10">
              {/* Quick Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: 'fa-clock-o', label: 'Duration', val: tour.days },
                  { icon: 'fa-users', label: 'Group Size', val: 'Max 15' },
                  { icon: 'fa-map-marker', label: 'Location', val: tour.location.split(',')[0] },
                  { icon: 'fa-language', label: 'Language', val: 'English, Hindi' },
                ].map(s => (
                  <div key={s.label} className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-center">
                    <i className={`fa ${s.icon} text-orange-500 text-lg mb-2`} />
                    <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5">{s.val}</p>
                  </div>
                ))}
              </div>

              {/* Description */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">About This Tour</h2>
                <p className="text-gray-600 leading-relaxed">{tour.description}</p>
              </div>

              {/* Highlights */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Tour Highlights</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {tour.highlights.map((h, i) => (
                    <div key={i} className="flex items-start gap-3 bg-orange-50 border border-orange-100 rounded-xl p-3.5">
                      <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                        <i className="fa fa-check text-xs" />
                      </span>
                      <span className="text-sm text-gray-700 font-medium">{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">Amenities</h2>
                <div className="flex flex-wrap gap-3">
                  {tour.features.map((f, i) => (
                    <span key={i} className="bg-white border border-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-xl shadow-sm">{f}</span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Itinerary Tab */}
          {tab === 'Itinerary' && (
            <div>
              <h2 className="text-xl font-bold text-gray-900 mb-6">Day-by-Day Itinerary</h2>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-orange-100" />
                <div className="space-y-4">
                  {tour.itinerary.map((item, idx) => (
                    <div key={item.day} className="flex gap-5 relative">
                      <div className="w-10 h-10 shrink-0 bg-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold z-10 shadow-md">
                        {item.day}
                      </div>
                      <div className={`flex-1 rounded-2xl border p-5 ${idx % 2 === 0 ? 'bg-white border-gray-100' : 'bg-gray-50 border-gray-100'}`}>
                        <p className="text-xs font-semibold text-orange-500 uppercase tracking-wide mb-1">Day {item.day}</p>
                        <p className="font-bold text-gray-900 mb-1">{item.title}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Includes Tab */}
          {tab === 'Includes' && (
            <div className="space-y-8">
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Included</h2>
                <div className="space-y-3">
                  {tour.includes.map((inc, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                      <span className="w-7 h-7 rounded-full bg-green-500 text-white flex items-center justify-center shrink-0">
                        <i className="fa fa-check text-xs" />
                      </span>
                      <span className="text-sm font-medium text-gray-700">{inc}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">What's Not Included</h2>
                <div className="space-y-3">
                  {['Personal expenses & shopping', 'Travel insurance', 'Tips & gratuities', 'Meals not mentioned in itinerary'].map((exc, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                      <span className="w-7 h-7 rounded-full bg-red-400 text-white flex items-center justify-center shrink-0">
                        <i className="fa fa-times text-xs" />
                      </span>
                      <span className="text-sm font-medium text-gray-700">{exc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Reviews Tab */}
          {tab === 'Reviews' && (
            <div className="space-y-8">
              {/* Submit Review */}
              <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Write a Review</h2>
                {!user ? (
                  <div className="text-center py-6">
                    <i className="fa fa-lock text-3xl text-gray-300 mb-3" />
                    <p className="text-gray-500 text-sm mb-3">You need to be logged in to write a review.</p>
                    <Link to="/login" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-colors inline-block">Login to Review</Link>
                  </div>
                ) : reviewSuccess ? (
                  <div className="text-center py-6">
                    <i className="fa fa-check-circle text-3xl text-green-500 mb-3" />
                    <p className="text-gray-700 font-semibold">Review submitted successfully!</p>
                    <button onClick={() => setReviewSuccess(false)} className="text-orange-500 text-sm mt-2 hover:underline">Write another</button>
                  </div>
                ) : (
                  <form onSubmit={handleReviewSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-2">Your Rating</label>
                      <div className="flex gap-1">
                        {[1,2,3,4,5].map(star => (
                          <button key={star} type="button" onClick={() => setReviewForm(f => ({ ...f, rating: star }))}>
                            <i className={`fa fa-star text-xl ${star <= reviewForm.rating ? 'text-yellow-400' : 'text-gray-200'} transition-colors`} />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5">Your Comment</label>
                      <textarea
                        required rows={3} value={reviewForm.comment}
                        onChange={e => setReviewForm(f => ({ ...f, comment: e.target.value }))}
                        placeholder="Share your experience..."
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors resize-none"
                      />
                    </div>
                    {reviewError && <p className="text-red-500 text-xs">{reviewError}</p>}
                    <button type="submit" disabled={reviewSubmitting}
                      className="bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors flex items-center gap-2 text-sm">
                      {reviewSubmitting ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-paper-plane" />}
                      Submit Review
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews List */}
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">Guest Reviews</h2>
                {reviewsLoading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse">
                        <div className="flex gap-3 mb-3"><div className="w-10 h-10 rounded-full bg-gray-200" /><div className="flex-1"><div className="h-3 bg-gray-200 rounded w-1/3 mb-2" /><div className="h-2 bg-gray-100 rounded w-1/4" /></div></div>
                        <div className="h-3 bg-gray-100 rounded w-full" />
                      </div>
                    ))}
                  </div>
                ) : reviews.length === 0 ? (
                  <div className="text-center py-12">
                    <i className="fa fa-comment-o text-4xl text-gray-200 mb-3" />
                    <p className="text-gray-400 text-sm">No reviews yet. Be the first to review!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((r, i) => (
                      <div key={r._id || i} className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                            <span className="text-orange-500 font-bold text-sm">{(r.user?.name || 'U')[0].toUpperCase()}</span>
                          </div>
                          <div className="flex-1">
                            <p className="font-semibold text-gray-800 text-sm">{r.user?.name || 'Anonymous'}</p>
                            <div className="flex gap-0.5 mt-0.5">
                              {[1,2,3,4,5].map(s => (
                                <i key={s} className={`fa fa-star text-xs ${s <= r.rating ? 'text-yellow-400' : 'text-gray-200'}`} />
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>
                        <p className="text-sm text-gray-600 leading-relaxed">{r.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Booking Card — desktop only */}
        <div className="hidden lg:block">
          <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 sticky top-24">
            <div className="flex items-end justify-between mb-1">
              <div>
                <p className="text-xs text-gray-400 font-medium">Starting from</p>
                <p className="text-3xl font-extrabold text-orange-500">{tour.price}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fa ${
                    i < fullStars ? 'fa-star text-yellow-400' :
                    i === fullStars && hasHalf ? 'fa-star-half-o text-yellow-400' :
                    'fa-star text-gray-200'
                  } text-xs`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-gray-400 mb-5">{tour.reviews} reviews · {tour.days}</p>

            <div className="space-y-3 mb-5">
              {[
                { icon: 'fa-clock-o', text: tour.days },
                { icon: 'fa-map-marker', text: tour.location },
                { icon: 'fa-users', text: 'Max 15 people' },
                { icon: 'fa-language', text: 'English & Hindi guided' },
              ].map((r, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-gray-600">
                  <i className={`fa ${r.icon} text-orange-400 w-4 text-center`} />
                  {r.text}
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 pt-5 mb-5">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Includes</p>
              <div className="space-y-2">
                {tour.includes.slice(0, 3).map((inc, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs text-gray-600">
                    <i className="fa fa-check text-green-500" />{inc}
                  </div>
                ))}
                {tour.includes.length > 3 && (
                  <button onClick={() => setTab('Includes')} className="text-xs text-orange-500 hover:underline">
                    +{tour.includes.length - 3} more
                  </button>
                )}
              </div>
            </div>

            <button
              onClick={() => { setShowBooking(true); setStep(1); }}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
            >
              <i className="fa fa-calendar-check-o" /> Book This Tour
            </button>
            <Link to="/destination" className="block text-center text-xs text-gray-400 hover:text-orange-500 mt-3 transition-colors">
              ← Back to Destinations
            </Link>
          </div>
        </div>
      </section>

      {/* Booking Modal */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={closeModal}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

            {/* Modal Header */}
            <div className="relative h-32 bg-cover bg-center rounded-t-2xl overflow-hidden" style={{ backgroundImage: `url('${tour.img}')` }}>
              <div className="absolute inset-0 bg-black/50" />
              <button onClick={closeModal} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-colors">
                <i className="fa fa-times" />
              </button>
              <div className="absolute bottom-4 left-5">
                <p className="text-white font-bold text-lg">{tour.title}</p>
                <p className="text-orange-300 text-sm font-semibold">{tour.price}</p>
              </div>
            </div>

            <div className="p-6">
              {success ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="fa fa-check text-green-500 text-2xl" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
                  <p className="text-gray-500 text-sm mb-1">Your booking is confirmed.</p>
                  <p className="text-orange-500 font-bold text-lg mb-6">{total}</p>
                  <div className="flex gap-3">
                    <button onClick={closeModal} className="flex-1 border border-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">Close</button>
                    <button onClick={() => navigate('/bookings')} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2.5 rounded-xl transition-colors text-sm">View Bookings</button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Step indicator */}
                  <div className="flex items-center gap-2 mb-5">
                    {[{ label: LABELS.stepBookingDetails, idx: 1 }, { label: LABELS.stepPayment, idx: 2 }].map(({ label, idx }) => (
                      <div key={idx} className="flex items-center gap-2 flex-1">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          step > idx ? 'bg-green-500 text-white' : step === idx ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'
                        }`}>
                          {step > idx ? <i className="fa fa-check" /> : idx}
                        </div>
                        <span className={`text-xs font-semibold ${step === idx ? 'text-gray-800' : 'text-gray-400'}`}>{label}</span>
                        {idx === 1 && <div className={`flex-1 h-0.5 ${step > 1 ? 'bg-orange-400' : 'bg-gray-100'}`} />}
                      </div>
                    ))}
                  </div>

                  {error && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-4 text-sm">
                      <i className="fa fa-exclamation-circle text-red-500" />{error}
                    </div>
                  )}

                  {/* Step 1: Booking Details */}
                  {step === 1 && (
                    <form onSubmit={handleDetailsSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.fullName}</label>
                          <input required type="text" value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.phone}</label>
                          <input required type="tel" value={form.phone} placeholder="+91 XXXXX XXXXX"
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.email}</label>
                        <input required type="email" value={form.email}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.travelDate}</label>
                          <input required type="date" value={form.travelDate} min={new Date().toISOString().split('T')[0]}
                            onChange={e => setForm({ ...form, travelDate: e.target.value })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors" />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.persons}</label>
                          <input required type="number" min={1} max={15} value={form.persons}
                            onChange={e => setForm({ ...form, persons: Number(e.target.value) })}
                            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1.5">{LABELS.specialRequests} <span className="text-gray-300">{LABELS.optional}</span></label>
                        <textarea rows={2} value={form.specialRequests}
                          onChange={e => setForm({ ...form, specialRequests: e.target.value })}
                          placeholder="Any dietary requirements, accessibility needs..."
                          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400 transition-colors resize-none" />
                      </div>
                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">{tour.price} × {form.persons} person{form.persons > 1 ? 's' : ''}</span>
                          <span className="font-bold text-gray-900">{total}</span>
                        </div>
                      </div>
                      <button type="submit" className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                        Proceed to Payment <i className="fa fa-arrow-right" />
                      </button>
                    </form>
                  )}

                  {/* Step 2: Payment */}
                  {step === 2 && (
                    <form onSubmit={handlePayment} className="space-y-4">
                      <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400">Booking for</p>
                          <p className="font-bold text-gray-800 text-sm">{tour.title}</p>
                          <p className="text-xs text-gray-400">{form.travelDate} · {form.persons} person{form.persons > 1 ? 's' : ''}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-400">Total</p>
                          <p className="text-xl font-extrabold text-orange-500">{total}</p>
                        </div>
                      </div>

                      <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 text-sm text-orange-800">
                        <i className="fa fa-info-circle mr-2" />
                        You will be redirected to Razorpay's secure payment page. Supports UPI, Cards, Net Banking & Wallets.
                      </div>

                      <div className="flex gap-3 pt-1">
                        <button type="button" onClick={() => setStep(1)}
                          className="flex-1 border border-gray-200 text-gray-600 font-semibold py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-sm">
                          <i className="fa fa-arrow-left mr-1" /> Back
                        </button>
                        <button type="submit" disabled={submitting}
                          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-2.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm">
                          {submitting ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-lock" />}
                          Pay {total}
                        </button>
                      </div>
                    </form>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

