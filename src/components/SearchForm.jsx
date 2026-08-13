import { useState } from 'react';

const prices = [
  { label: 'Any Budget', max: Infinity },
  { label: 'Under ₹5,000', max: 5000 },
  { label: 'Under ₹10,000', max: 10000 },
  { label: 'Under ₹15,000', max: 15000 },
  { label: 'Under ₹20,000', max: 20000 },
  { label: 'Under ₹50,000', max: 50000 },
];

const tabs = [
  { key: 'tour', label: 'Search Tour', icon: 'fa-paper-plane' },
  { key: 'hotel', label: 'Find Hotel', icon: 'fa-building' },
];

function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 p-5 group">
      <label className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2.5 border-b border-gray-200 pb-1.5 group-focus-within:border-orange-400 transition-colors">
        <i className={`fa ${icon} text-gray-300 group-focus-within:text-orange-400 transition-colors text-sm`} />
        {children}
      </div>
    </div>
  );
}

export default function SearchForm({ onHotelSearch, hotelOnly, tourOnly, onTourSearch }) {
  const [tab, setTab] = useState(hotelOnly ? 'hotel' : 'tour');
  const filteredTabs = hotelOnly ? tabs.filter(t => t.key === 'hotel') : tourOnly ? tabs.filter(t => t.key === 'tour') : tabs;
  const [destination, setDestination] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [budget, setBudget] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (tab === 'hotel' && onHotelSearch && destination.trim()) {
      onHotelSearch(destination.trim());
    }
    if (tab === 'tour' && onTourSearch) {
      onTourSearch({ destination: destination.trim(), checkIn, checkOut, maxBudget: prices[budget].max });
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 overflow-hidden">

      {/* Tabs */}
      {!hotelOnly && !tourOnly && (
        <div className="flex border-b border-gray-100">
          {filteredTabs.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3.5 text-sm font-semibold transition-all duration-200 border-b-2 -mb-px
                ${tab === t.key
                  ? 'border-orange-500 text-orange-500'
                  : 'border-transparent text-gray-400 hover:text-gray-600'
                }`}
            >
              <i className={`fa ${t.icon} text-xs`} />
              {t.label}
            </button>
          ))}
        </div>
      )}

      {/* Form */}
      <form
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 divide-y sm:divide-x sm:divide-y-0 md:divide-x divide-gray-100"
        onSubmit={handleSubmit}
      >
        <Field label="Destination" icon="fa-map-marker">
          <input
            type="text"
            placeholder="Where to go?"
            value={destination}
            onChange={e => setDestination(e.target.value)}
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
          />
        </Field>

        <Field label="Check-in" icon="fa-calendar-o">
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().split('T')[0]}
            onChange={e => setCheckIn(e.target.value)}
            className="w-full outline-none text-sm text-gray-600 bg-transparent"
          />
        </Field>

        <Field label="Check-out" icon="fa-calendar-check-o">
          <input
            type="date"
            value={checkOut}
            min={checkIn || new Date().toISOString().split('T')[0]}
            onChange={e => setCheckOut(e.target.value)}
            className="w-full outline-none text-sm text-gray-600 bg-transparent"
          />
        </Field>

        <Field label="Budget" icon="fa-rupee">
          <select
            value={budget}
            onChange={e => setBudget(Number(e.target.value))}
            className="w-full outline-none text-sm text-gray-600 bg-transparent cursor-pointer"
          >
            {prices.map((p, i) => <option key={p.label} value={i}>{p.label}</option>)}
          </select>
        </Field>

        <div className="p-5 flex items-end">
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-semibold py-3 rounded-xl transition-all duration-200 shadow-lg shadow-orange-500/30"
          >
            <i className="fa fa-search text-sm" />
            Search
          </button>
        </div>
      </form>
    </div>
  );
}

