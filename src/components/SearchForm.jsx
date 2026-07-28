import { useState } from 'react';

const prices = ['Any Budget', '$100', '$10,000', '$50,000', '$100,000', '$200,000', '$300,000', '$500,000', '$1,000,000'];

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

export default function SearchForm() {
  const [tab, setTab] = useState('tour');

  return (
    <div className="bg-white rounded-2xl shadow-2xl shadow-black/15 overflow-hidden">

      {/* Tabs */}
      <div className="flex border-b border-gray-100">
        {tabs.map(t => (
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

      {/* Form */}
      <form className="grid grid-cols-1 md:grid-cols-5 divide-y md:divide-y-0 md:divide-x divide-gray-100">
        <Field label="Destination" icon="fa-map-marker">
          <input
            type="text"
            placeholder="Where to go?"
            className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent"
          />
        </Field>

        <Field label="Check-in" icon="fa-calendar-o">
          <input
            type="date"
            className="w-full outline-none text-sm text-gray-600 bg-transparent"
          />
        </Field>

        <Field label="Check-out" icon="fa-calendar-check-o">
          <input
            type="date"
            className="w-full outline-none text-sm text-gray-600 bg-transparent"
          />
        </Field>

        <Field label="Budget" icon="fa-dollar">
          <select className="w-full outline-none text-sm text-gray-600 bg-transparent cursor-pointer">
            {prices.map(p => <option key={p}>{p}</option>)}
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
