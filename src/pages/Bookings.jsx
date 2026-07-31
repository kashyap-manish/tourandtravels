import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../services/api';

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const PAYMENT_STYLES = {
  unpaid:   'bg-gray-50 text-gray-500 border-gray-200',
  paid:     'bg-blue-50 text-blue-600 border-blue-200',
  refunded: 'bg-purple-50 text-purple-600 border-purple-200',
};

export default function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    getMyBookings()
      .then(res => setBookings(res.data))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async (id) => {
    if (!confirm('Cancel this booking?')) return;
    setCancelling(id);
    try {
      const res = await cancelBooking(id);
      setBookings(prev => prev.map(b => b._id === id ? res.data : b));
      if (selected?._id === id) setSelected(res.data);
    } finally {
      setCancelling(null);
    }
  };

  return (
    <>
      <section
        className="relative flex items-end justify-center bg-cover bg-center"
        style={{ backgroundImage: "url('/images/bg_1.jpg')", minHeight: '40vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
        <div className="relative z-10 text-center text-white pb-14 px-4">
          <p className="text-sm mb-3 flex items-center justify-center gap-2 text-gray-300">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span>My Bookings</span>
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">My Bookings</h1>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400">
            <i className="fa fa-spinner fa-spin text-3xl" />
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20">
            <i className="fa fa-calendar-times-o text-5xl text-gray-200 mb-4" />
            <p className="text-gray-500 font-medium mb-4">No bookings yet.</p>
            <Link to="/destination" className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2.5 rounded-xl transition-colors">
              Explore Tours
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(b => (
              <div key={b._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row">
                  {/* Tour image */}
                  {b.tour?.img && (
                    <img
                      src={b.tour.img} alt={b.tour.title}
                      className="w-full sm:w-40 h-36 sm:h-auto object-cover shrink-0"
                    />
                  )}
                  <div className="flex-1 p-5 flex flex-col justify-between gap-3">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <h3 className="font-bold text-gray-900 text-base">{b.tour?.title || 'Tour'}</h3>
                        <p className="text-xs text-gray-400 mt-0.5">
                          Booked on {new Date(b.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status]}`}>
                          {b.status}
                        </span>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${PAYMENT_STYLES[b.paymentStatus]}`}>
                          {b.paymentStatus}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Travel Date</p>
                        <p className="font-semibold text-gray-800">
                          {new Date(b.travelDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Persons</p>
                        <p className="font-semibold text-gray-800">{b.persons}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Total Price</p>
                        <p className="font-semibold text-orange-500">{b.totalPrice}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400 mb-0.5">Duration</p>
                        <p className="font-semibold text-gray-800">{b.tour?.days || '—'} days</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => setSelected(b)}
                        className="text-xs font-semibold px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        View Details
                      </button>
                      {b.status !== 'cancelled' && (
                        <button
                          onClick={() => handleCancel(b._id)}
                          disabled={cancelling === b._id}
                          className="text-xs font-semibold px-4 py-2 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60"
                        >
                          {cancelling === b._id ? <i className="fa fa-spinner fa-spin" /> : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-7 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700">
              <i className="fa fa-times text-lg" />
            </button>
            <h2 className="text-lg font-bold text-gray-900 mb-1">{selected.tour?.title}</h2>
            <p className="text-xs text-gray-400 mb-5">Booking ID: {selected._id}</p>

            <div className="space-y-3 text-sm">
              {[
                ['Name', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Travel Date', new Date(selected.travelDate).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['Persons', selected.persons],
                ['Total Price', selected.totalPrice],
                ['Status', <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>],
                ['Payment', <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${PAYMENT_STYLES[selected.paymentStatus]}`}>{selected.paymentStatus}</span>],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-400 font-medium">{label}</span>
                  <span className="text-gray-800 font-semibold text-right">{val}</span>
                </div>
              ))}
              {selected.specialRequests && (
                <div className="pt-2">
                  <p className="text-gray-400 font-medium mb-1">Special Requests</p>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{selected.specialRequests}</p>
                </div>
              )}
            </div>

            {selected.status !== 'cancelled' && (
              <button
                onClick={() => handleCancel(selected._id)}
                disabled={cancelling === selected._id}
                className="mt-6 w-full bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60"
              >
                {cancelling === selected._id ? <i className="fa fa-spinner fa-spin" /> : 'Cancel Booking'}
              </button>
            )}
          </div>
        </div>
      )}
    </>
  );
}
