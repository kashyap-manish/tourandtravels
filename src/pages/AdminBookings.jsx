import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { adminGetBookings, adminUpdateBookingStatus } from '../services/api';

const STATUS_STYLES = {
  pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  confirmed: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-600 border-red-200',
};

const TABS = ['all', 'pending', 'confirmed', 'cancelled'];

export default function AdminBookings() {
  const { user } = useSelector(s => s.auth);
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [total, setTotal] = useState(0);
  const [tab, setTab] = useState('all');
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    if (user?.role !== 'admin') { navigate('/'); return; }
  }, [user]);

  useEffect(() => {
    setLoading(true);
    adminGetBookings(tab !== 'all' ? { status: tab } : {})
      .then(res => { setBookings(res.data.bookings); setTotal(res.data.total); })
      .finally(() => setLoading(false));
  }, [tab]);

  const handleStatus = async (id, status) => {
    setUpdating(id + status);
    try {
      const res = await adminUpdateBookingStatus(id, status);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: res.data.status } : b));
      if (selected?._id === id) setSelected(s => ({ ...s, status: res.data.status }));
    } finally {
      setUpdating(null);
    }
  };

  const counts = bookings.reduce((acc, b) => { acc[b.status] = (acc[b.status] || 0) + 1; return acc; }, {});

  return (
    <>
      {/* Header */}
      <div className="bg-gray-950 px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-extrabold text-white">Bookings Management</h1>
          <p className="text-gray-400 text-sm mt-1">Confirm or cancel customer bookings — status emails are sent automatically</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total', val: total, color: 'text-gray-800' },
            { label: 'Pending', val: counts.pending || 0, color: 'text-yellow-600' },
            { label: 'Confirmed', val: counts.confirmed || 0, color: 'text-green-600' },
            { label: 'Cancelled', val: counts.cancelled || 0, color: 'text-red-500' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <p className={`text-3xl font-extrabold ${s.color}`}>{s.val}</p>
              <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold capitalize border transition-colors ${
                tab === t ? 'bg-orange-500 text-white border-orange-500' : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300'
              }`}>
              {t}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center py-20 text-gray-400"><i className="fa fa-spinner fa-spin text-3xl" /></div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No bookings found.</div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Customer', 'Tour', 'Travel Date', 'Persons', 'Amount', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="font-semibold text-gray-800">{b.name}</p>
                        <p className="text-xs text-gray-400">{b.email}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-700 max-w-[140px] truncate">{b.tour?.title || '—'}</p>
                      </td>
                      <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                        {new Date(b.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="px-4 py-3 text-gray-600 text-center">{b.persons}</td>
                      <td className="px-4 py-3 font-semibold text-orange-500 whitespace-nowrap">
                        ₹{Number(b.totalPrice).toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs capitalize text-gray-500">{b.paymentMethod || '—'}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border capitalize ${STATUS_STYLES[b.status]}`}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setSelected(b)}
                            className="text-xs px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100 transition-colors">
                            View
                          </button>
                          {b.status !== 'confirmed' && (
                            <button
                              onClick={() => handleStatus(b._id, 'confirmed')}
                              disabled={!!updating}
                              className="text-xs px-3 py-1.5 rounded-lg bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 transition-colors disabled:opacity-60">
                              {updating === b._id + 'confirmed' ? <i className="fa fa-spinner fa-spin" /> : 'Confirm'}
                            </button>
                          )}
                          {b.status !== 'cancelled' && (
                            <button
                              onClick={() => handleStatus(b._id, 'cancelled')}
                              disabled={!!updating}
                              className="text-xs px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 transition-colors disabled:opacity-60">
                              {updating === b._id + 'cancelled' ? <i className="fa fa-spinner fa-spin" /> : 'Cancel'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

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
                ['Customer', selected.name],
                ['Email', selected.email],
                ['Phone', selected.phone],
                ['Travel Date', new Date(selected.travelDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })],
                ['Persons', selected.persons],
                ['Total Price', `₹${Number(selected.totalPrice).toLocaleString('en-IN')}`],
                ['Payment', selected.paymentMethod || '—'],
                ['Status', <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border capitalize ${STATUS_STYLES[selected.status]}`}>{selected.status}</span>],
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
            <div className="flex gap-3 mt-6">
              {selected.status !== 'confirmed' && (
                <button onClick={() => handleStatus(selected._id, 'confirmed')} disabled={!!updating}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
                  {updating === selected._id + 'confirmed' ? <i className="fa fa-spinner fa-spin" /> : '✓ Confirm'}
                </button>
              )}
              {selected.status !== 'cancelled' && (
                <button onClick={() => handleStatus(selected._id, 'cancelled')} disabled={!!updating}
                  className="flex-1 bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 font-semibold py-2.5 rounded-xl transition-colors disabled:opacity-60 text-sm">
                  {updating === selected._id + 'cancelled' ? <i className="fa fa-spinner fa-spin" /> : '✕ Cancel'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

