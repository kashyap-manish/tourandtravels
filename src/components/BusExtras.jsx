import { useState, useEffect, useRef } from 'react';

const GEO_KEY = import.meta.env.VITE_GEOAPIFY_KEY;

// ─── 1. Live Bus Alerts Ticker ───────────────────────────────────────────────

const ALERTS = [
  { type: 'delay',  route: 'Delhi → Agra',        msg: 'Delayed 25 min due to traffic',   color: 'text-amber-400' },
  { type: 'cancel', route: 'Mumbai → Pune',        msg: 'Service cancelled — heavy rain',  color: 'text-red-400' },
  { type: 'ontime', route: 'Bangalore → Chennai',  msg: 'Departing on time',               color: 'text-emerald-400' },
  { type: 'delay',  route: 'Hyderabad → Vijayawada', msg: 'Delayed 15 min',               color: 'text-amber-400' },
  { type: 'ontime', route: 'Kolkata → Bhubaneswar', msg: 'All services running normally', color: 'text-emerald-400' },
  { type: 'cancel', route: 'Jaipur → Jodhpur',    msg: 'Cancelled — road maintenance',    color: 'text-red-400' },
  { type: 'ontime', route: 'Ahmedabad → Surat',   msg: 'On schedule',                     color: 'text-emerald-400' },
  { type: 'delay',  route: 'Lucknow → Varanasi',  msg: 'Delayed 40 min',                  color: 'text-amber-400' },
];

const ALERT_ICONS = { delay: 'fa-clock-o', cancel: 'fa-times-circle', ontime: 'fa-check-circle' };

export function BusAlertsTicker() {
  const items = [...ALERTS, ...ALERTS];
  return (
    <div className="bg-gray-950 border-b border-white/10 overflow-hidden h-10 flex items-center">
      <div className="flex items-center gap-3 px-4 bg-gray-950 z-10 border-r border-white/10 h-full flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">Live Alerts</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'busTicker 40s linear infinite' }}>
          {items.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-gray-300 flex-shrink-0">
              <i className={`fa ${ALERT_ICONS[a.type]} ${a.color} text-xs`} />
              <span className="font-semibold text-white">{a.route}</span>
              <span className="text-gray-500">—</span>
              <span className={a.color}>{a.msg}</span>
              <span className="w-px h-3 bg-white/10 mx-2" />
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes busTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

// ─── 2. Terminal Finder Map ──────────────────────────────────────────────────

export function TerminalFinder() {
  const [city, setCity] = useState('');
  const [loading, setLoading] = useState(false);
  const [terminals, setTerminals] = useState([]);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);

  async function search(e) {
    e.preventDefault();
    if (!city.trim()) return;
    setLoading(true); setError(''); setTerminals([]); setSelected(null);
    try {
      const geoRes = await fetch(`https://api.geoapify.com/v1/geocode/search?text=${encodeURIComponent(city)}&type=city&limit=1&apiKey=${GEO_KEY}`);
      const geoData = await geoRes.json();
      const f = geoData.features?.[0];
      if (!f) throw new Error('City not found');
      const { lat, lon } = f.properties;
      const placeRes = await fetch(`https://api.geoapify.com/v2/places?categories=public_transport.bus&filter=circle:${lon},${lat},15000&limit=15&apiKey=${GEO_KEY}`);
      const placeData = await placeRes.json();
      if (!placeData.features?.length) throw new Error('No terminals found near this city');
      setTerminals(placeData.features);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Terminal Finder</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Find Bus Terminals Near You</h2>
          <p className="text-gray-400 text-sm mt-2">Search any city to discover nearby bus stops and terminals</p>
        </div>

        <form onSubmit={search} className="flex gap-3 max-w-xl mx-auto mb-10">
          <div className="flex-1 flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-3 bg-white focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
            <i className="fa fa-map-marker text-orange-400" />
            <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city name…"
              className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300" />
          </div>
          <button type="submit" disabled={loading}
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-lg shadow-orange-500/25">
            <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`} />
            {loading ? 'Searching…' : 'Find'}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm max-w-xl mx-auto mb-6">
            <i className="fa fa-exclamation-circle" />{error}
          </div>
        )}

        {terminals.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Map embed */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-gray-200 shadow-sm" style={{ height: 420 }}>
              {selected ? (
                <iframe
                  title="terminal-map"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=420&center=lonlat:${selected.geometry.coordinates[0]},${selected.geometry.coordinates[1]}&zoom=15&marker=lonlat:${selected.geometry.coordinates[0]},${selected.geometry.coordinates[1]};color:%23f97316;size:large&apiKey=${GEO_KEY}`}
                />
              ) : (
                <iframe
                  title="terminal-map"
                  width="100%" height="100%"
                  style={{ border: 0 }}
                  src={`https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=800&height=420&center=lonlat:${terminals[0].geometry.coordinates[0]},${terminals[0].geometry.coordinates[1]}&zoom=13&${terminals.map(t => `marker=lonlat:${t.geometry.coordinates[0]},${t.geometry.coordinates[1]};color:%23f97316;size:small`).join('&')}&apiKey=${GEO_KEY}`}
                />
              )}
            </div>

            {/* Terminal list */}
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {terminals.map((t, i) => {
                const p = t.properties;
                const isSel = selected === t;
                return (
                  <button key={i} onClick={() => setSelected(isSel ? null : t)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${isSel ? 'bg-orange-50 border-orange-300 shadow-md' : 'bg-white border-gray-100 hover:border-orange-200 hover:shadow-sm'}`}>
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${isSel ? 'bg-orange-500' : 'bg-orange-50'}`}>
                        <i className={`fa fa-bus text-xs ${isSel ? 'text-white' : 'text-orange-500'}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{p.name || 'Bus Stop'}</p>
                        <p className="text-xs text-gray-400 truncate mt-0.5">{p.address_line2 || p.formatted?.split(',').slice(0,2).join(',') || '—'}</p>
                        {p.distance && <p className="text-[0.6rem] text-orange-500 font-semibold mt-1">{(p.distance / 1000).toFixed(1)} km away</p>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 3. Operator Profiles ────────────────────────────────────────────────────

const OPERATOR_PROFILES = [
  { name: 'FlixBus',          color: '#00b849', abbr: 'FX', founded: 2011, fleet: 400,  routes: 2500, rating: 4.3, countries: 35, specialty: 'Eco-friendly long-distance', amenities: ['WiFi', 'AC', 'Charging', 'Toilet'] },
  { name: 'National Express', color: '#e84118', abbr: 'NX', founded: 1972, fleet: 600,  routes: 900,  rating: 4.1, countries: 4,  specialty: 'UK intercity network',       amenities: ['WiFi', 'AC', 'Toilet', 'Snacks'] },
  { name: 'Megabus',          color: '#0057b8', abbr: 'MB', founded: 2003, fleet: 350,  routes: 700,  rating: 3.9, countries: 8,  specialty: 'Budget city-to-city',        amenities: ['WiFi', 'AC', 'USB'] },
  { name: 'BlaBlaBus',        color: '#00aaff', abbr: 'BB', founded: 2018, fleet: 200,  routes: 500,  rating: 4.2, countries: 12, specialty: 'Carpooling & bus hybrid',    amenities: ['WiFi', 'AC', 'Charging'] },
  { name: 'Eurolines',        color: '#f39c12', abbr: 'EL', founded: 1985, fleet: 500,  routes: 1200, rating: 4.0, countries: 25, specialty: 'Pan-European network',       amenities: ['WiFi', 'AC', 'Toilet', 'Snacks'] },
  { name: 'Greyhound',        color: '#2c3e50', abbr: 'GH', founded: 1914, fleet: 1700, routes: 3800, rating: 3.8, countries: 3,  specialty: 'North American icon',        amenities: ['WiFi', 'AC', 'Toilet'] },
];

const AMENITY_ICONS_MAP = { WiFi: 'fa-wifi', AC: 'fa-snowflake-o', Charging: 'fa-bolt', Toilet: 'fa-tint', Snacks: 'fa-coffee', USB: 'fa-usb' };

export function OperatorProfiles() {
  const [active, setActive] = useState(null);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Our Partners</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Bus Operator Profiles</h2>
          <p className="text-gray-400 text-sm mt-2">Click any operator to learn more about their fleet and services</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {OPERATOR_PROFILES.map((op, i) => {
            const isActive = active === i;
            return (
              <div key={i} onClick={() => setActive(isActive ? null : i)}
                className={`bg-white border rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${isActive ? 'border-orange-300 shadow-xl shadow-orange-500/10 -translate-y-1' : 'border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-0.5'}`}>
                {/* Color bar */}
                <div className="h-1.5" style={{ background: op.color }} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-base flex-shrink-0" style={{ background: op.color }}>{op.abbr}</div>
                    <div>
                      <p className="font-extrabold text-gray-900">{op.name}</p>
                      <p className="text-xs text-gray-400">Est. {op.founded}</p>
                    </div>
                    <div className="ml-auto flex items-center gap-1">
                      <i className="fa fa-star text-amber-400 text-xs" />
                      <span className="text-sm font-bold text-gray-700">{op.rating}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    {[
                      { label: 'Fleet', value: op.fleet.toLocaleString() },
                      { label: 'Routes', value: op.routes.toLocaleString() },
                      { label: 'Countries', value: op.countries },
                    ].map(s => (
                      <div key={s.label} className="bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                        <p className="text-base font-black text-gray-900">{s.value}</p>
                        <p className="text-[0.6rem] text-gray-400 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {isActive && (
                    <div className="space-y-3 border-t border-gray-100 pt-4 mt-2">
                      <p className="text-xs text-gray-500 leading-relaxed"><i className="fa fa-info-circle text-orange-400 mr-1" />{op.specialty}</p>
                      <div>
                        <p className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-widest mb-2">Onboard Amenities</p>
                        <div className="flex flex-wrap gap-1.5">
                          {op.amenities.map(a => (
                            <span key={a} className="flex items-center gap-1 text-[0.65rem] text-gray-600 bg-orange-50 border border-orange-100 px-2.5 py-1 rounded-full">
                              <i className={`fa ${AMENITY_ICONS_MAP[a]} text-orange-400`} />{a}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
                        <div className="h-1.5 rounded-full transition-all duration-500" style={{ width: `${op.rating / 5 * 100}%`, background: op.color }} />
                      </div>
                      <p className="text-[0.6rem] text-gray-400 text-right">{op.rating}/5.0 passenger rating</p>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <span className="text-xs text-gray-400">{isActive ? 'Click to collapse' : 'Click to expand'}</span>
                    <i className={`fa fa-chevron-${isActive ? 'up' : 'down'} text-xs text-gray-400 transition-transform`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 4. Amenity Comparison Table ─────────────────────────────────────────────

const COMPARE_OPERATORS = [
  { name: 'FlixBus',    abbr: 'FX', color: '#00b849', wifi: true,  ac: true,  charging: true,  toilet: true,  snacks: false, usb: true,  legroom: 'Standard', cancellation: 'Free 30min', price: '₹850' },
  { name: 'Nat. Exp.',  abbr: 'NX', color: '#e84118', wifi: true,  ac: true,  charging: false, toilet: true,  snacks: true,  usb: false, legroom: 'Spacious',  cancellation: 'Free 1hr',   price: '₹920' },
  { name: 'Megabus',    abbr: 'MB', color: '#0057b8', wifi: true,  ac: true,  charging: false, toilet: false, snacks: false, usb: true,  legroom: 'Compact',   cancellation: 'Non-refund', price: '₹620' },
  { name: 'BlaBlaBus',  abbr: 'BB', color: '#00aaff', wifi: true,  ac: true,  charging: true,  toilet: false, snacks: false, usb: true,  legroom: 'Standard',  cancellation: 'Free 2hr',   price: '₹780' },
  { name: 'Eurolines',  abbr: 'EL', color: '#f39c12', wifi: true,  ac: true,  charging: true,  toilet: true,  snacks: true,  usb: false, legroom: 'Spacious',  cancellation: 'Free 1hr',   price: '₹1,100' },
];

const COMPARE_ROWS = [
  { label: 'WiFi',         key: 'wifi',         type: 'bool' },
  { label: 'AC',           key: 'ac',           type: 'bool' },
  { label: 'Charging',     key: 'charging',     type: 'bool' },
  { label: 'Toilet',       key: 'toilet',       type: 'bool' },
  { label: 'Snacks',       key: 'snacks',       type: 'bool' },
  { label: 'USB Port',     key: 'usb',          type: 'bool' },
  { label: 'Legroom',      key: 'legroom',      type: 'text' },
  { label: 'Cancellation', key: 'cancellation', type: 'text' },
  { label: 'Avg. Fare',    key: 'price',        type: 'text' },
];

export function CompareTable() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Side by Side</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Compare Bus Operators</h2>
          <p className="text-gray-400 text-sm mt-2">See exactly what each operator offers before you book</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-36">Feature</th>
                  {COMPARE_OPERATORS.map(op => (
                    <th key={op.abbr} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1.5">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black" style={{ background: op.color }}>{op.abbr}</div>
                        <span className="text-xs font-bold text-gray-700 whitespace-nowrap">{op.name}</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((row, ri) => (
                  <tr key={row.key} className={`border-b border-gray-50 ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600">{row.label}</td>
                    {COMPARE_OPERATORS.map(op => (
                      <td key={op.abbr} className="px-4 py-3.5 text-center">
                        {row.type === 'bool' ? (
                          op[row.key]
                            ? <i className="fa fa-check-circle text-emerald-500 text-base" />
                            : <i className="fa fa-times-circle text-gray-200 text-base" />
                        ) : (
                          <span className={`text-xs font-semibold ${row.key === 'price' ? 'text-orange-500 font-black' : 'text-gray-600'}`}>{op[row.key]}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. Price Trend Chart ────────────────────────────────────────────────────

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const ROUTE_TRENDS = {
  'Delhi → Agra':         [420, 380, 350, 390, 580, 720, 650],
  'Mumbai → Pune':        [310, 290, 280, 300, 490, 610, 540],
  'Bangalore → Chennai':  [680, 640, 610, 660, 890, 1050, 980],
  'Hyderabad → Vijayawada': [520, 490, 470, 510, 740, 880, 810],
  'Kolkata → Bhubaneswar': [590, 560, 530, 570, 810, 960, 890],
};

export function PriceTrendChart() {
  const [route, setRoute] = useState('Delhi → Agra');
  const prices = ROUTE_TRENDS[route];
  const max = Math.max(...prices);
  const min = Math.min(...prices);
  const cheapestDay = DAYS[prices.indexOf(min)];
  const priciest = DAYS[prices.indexOf(max)];

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Fare Intelligence</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Price Trends by Day</h2>
          <p className="text-gray-400 text-sm mt-2">Find the cheapest day to travel on popular routes</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          {/* Route selector */}
          <div className="flex flex-wrap gap-2 mb-8">
            {Object.keys(ROUTE_TRENDS).map(r => (
              <button key={r} onClick={() => setRoute(r)}
                className={`text-xs font-semibold px-4 py-2 rounded-full border transition-all ${route === r ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/20' : 'border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500'}`}>
                {r}
              </button>
            ))}
          </div>

          {/* Chart */}
          <div className="flex items-end gap-3 h-48 mb-4">
            {prices.map((price, i) => {
              const pct = ((price - min) / (max - min || 1)) * 100;
              const height = 20 + pct * 0.75;
              const isCheapest = price === min;
              const isPriciest = price === max;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="relative flex flex-col items-center justify-end w-full" style={{ height: 160 }}>
                    {/* Tooltip */}
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[0.6rem] font-bold px-2 py-1 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      ₹{price}
                    </div>
                    <div
                      className={`w-full rounded-t-xl transition-all duration-500 ${isCheapest ? 'bg-emerald-400' : isPriciest ? 'bg-red-400' : 'bg-orange-400 group-hover:bg-orange-500'}`}
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <span className={`text-xs font-bold ${isCheapest ? 'text-emerald-500' : isPriciest ? 'text-red-500' : 'text-gray-500'}`}>{DAYS[i]}</span>
                  <span className="text-[0.6rem] text-gray-400">₹{price}</span>
                </div>
              );
            })}
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded bg-emerald-400 inline-block" />
              Cheapest: <span className="font-bold text-emerald-600">{cheapestDay} (₹{min})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span className="w-3 h-3 rounded bg-red-400 inline-block" />
              Priciest: <span className="font-bold text-red-500">{priciest} (₹{max})</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 ml-auto">
              <i className="fa fa-lightbulb-o text-orange-400" />
              <span>Book on <strong className="text-gray-700">{cheapestDay}</strong> to save ₹{max - min}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 6. Journey Planner (multi-stop) ────────────────────────────────────────

export function JourneyPlanner() {
  const [stops, setStops] = useState(['', '', '']);
  const [date, setDate] = useState('');
  const [planned, setPlanned] = useState(false);

  function addStop() { if (stops.length < 6) setStops([...stops, '']); }
  function removeStop(i) { if (stops.length > 2) setStops(stops.filter((_, idx) => idx !== i)); }
  function updateStop(i, val) { const s = [...stops]; s[i] = val; setStops(s); }

  const legs = planned ? stops.slice(0, -1).map((from, i) => ({
    from, to: stops[i + 1],
    departs: `${String(8 + i * 2).padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`,
    arrives: `${String(9 + i * 2 + 1).padStart(2, '0')}:${i % 2 === 0 ? '45' : '15'}`,
    fare: 350 + i * 180,
    operator: ['FlixBus', 'Megabus', 'Eurolines', 'BlaBlaBus'][i % 4],
    color: ['#00b849', '#0057b8', '#f39c12', '#00aaff'][i % 4],
  })) : [];

  const totalFare = legs.reduce((s, l) => s + l.fare, 0);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Multi-Stop</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Journey Planner</h2>
          <p className="text-gray-400 text-sm mt-2">Plan a multi-city bus journey with layovers</p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
          <div className="space-y-3 mb-5">
            {stops.map((stop, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-black ${i === 0 ? 'bg-orange-500' : i === stops.length - 1 ? 'bg-gray-400' : 'bg-orange-300'}`}>{i + 1}</div>
                  {i < stops.length - 1 && <div className="w-px h-4 bg-orange-200 mt-1" />}
                </div>
                <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-orange-400 transition-all bg-gray-50/50">
                  <i className={`fa fa-map-marker text-sm ${i === 0 ? 'text-orange-500' : i === stops.length - 1 ? 'text-gray-400' : 'text-orange-300'}`} />
                  <input value={stop} onChange={e => updateStop(i, e.target.value)}
                    placeholder={i === 0 ? 'Departure city' : i === stops.length - 1 ? 'Final destination' : `Stop ${i}`}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
                </div>
                {i > 1 && i < stops.length - 1 && (
                  <button onClick={() => removeStop(i)} className="w-8 h-8 rounded-xl border border-gray-200 flex items-center justify-center text-gray-400 hover:border-red-300 hover:text-red-400 transition-all flex-shrink-0">
                    <i className="fa fa-times text-xs" />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 mb-6">
            <button onClick={addStop} disabled={stops.length >= 6}
              className="flex items-center gap-2 text-sm text-orange-500 font-semibold border border-orange-200 hover:bg-orange-50 px-4 py-2 rounded-xl transition-all disabled:opacity-40">
              <i className="fa fa-plus text-xs" /> Add Stop
            </button>
            <div className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 bg-gray-50/50 focus-within:border-orange-400 transition-all">
              <i className="fa fa-calendar text-orange-400 text-sm" />
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="outline-none text-sm text-gray-600 bg-transparent" />
            </div>
            <button onClick={() => setPlanned(stops.filter(Boolean).length >= 2)}
              className="ml-auto flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20">
              <i className="fa fa-route text-xs" /> Plan Journey
            </button>
          </div>

          {planned && legs.length > 0 && (
            <div className="border-t border-gray-100 pt-5 space-y-3">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Your Itinerary</p>
              {legs.map((leg, i) => (
                <div key={i} className="flex items-center gap-4 bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ background: leg.color }}>
                    {leg.operator.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{leg.from || '?'} → {leg.to || '?'}</p>
                    <p className="text-xs text-gray-400">{leg.operator} · {leg.departs} – {leg.arrives}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-black text-orange-500">₹{leg.fare}</p>
                    <p className="text-[0.6rem] text-gray-400">Leg {i + 1}</p>
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-5 py-3 mt-2">
                <span className="text-sm font-bold text-gray-700">{legs.length} legs · {stops.filter(Boolean).length} cities</span>
                <span className="text-lg font-black text-orange-500">Total ₹{totalFare}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// ─── 7. Travel Tips ──────────────────────────────────────────────────────────

const TIPS = [
  { icon: 'fa-suitcase',     color: 'bg-blue-50 text-blue-500',    title: 'Luggage Rules',       tips: ['1 cabin bag (max 7kg) free', 'Hold luggage up to 20kg allowed', 'Oversized items need prior booking', 'Label all bags with your name & phone'] },
  { icon: 'fa-clock-o',      color: 'bg-orange-50 text-orange-500', title: 'Boarding Tips',       tips: ['Arrive 15 min before departure', 'Have e-ticket ready on phone', 'Check platform number on app', 'Boarding closes 5 min before departure'] },
  { icon: 'fa-cutlery',      color: 'bg-green-50 text-green-500',   title: 'Food & Comfort',      tips: ['Bring snacks for long journeys', 'Water bottle recommended', 'Most buses have AC — bring a light jacket', 'Neck pillow helps on overnight trips'] },
  { icon: 'fa-shield',       color: 'bg-purple-50 text-purple-500', title: 'Safety & Security',   tips: ['Keep valuables in front bag', 'Never leave bags unattended', 'Note emergency exit locations', 'Save operator helpline in your phone'] },
  { icon: 'fa-mobile',       color: 'bg-pink-50 text-pink-500',     title: 'Tech & Connectivity', tips: ['Download offline maps before travel', 'Charge devices before boarding', 'Screenshot your ticket as backup', 'Enable location sharing with family'] },
  { icon: 'fa-leaf',         color: 'bg-teal-50 text-teal-500',     title: 'Eco Travel',          tips: ['Bus emits 3x less CO₂ than flying', 'Avoid single-use plastics onboard', 'Choose direct routes when possible', 'Offset remaining carbon via our app'] },
];

export function TravelTips() {
  const [open, setOpen] = useState(null);

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Pro Tips</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Bus Travel Tips</h2>
          <p className="text-gray-400 text-sm mt-2">Everything you need to know for a smooth journey</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TIPS.map((tip, i) => {
            const isOpen = open === i;
            return (
              <div key={i} onClick={() => setOpen(isOpen ? null : i)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${isOpen ? 'border-orange-200 shadow-lg shadow-orange-500/10' : 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                    <i className={`fa ${tip.icon} text-base`} />
                  </div>
                  <p className="font-bold text-gray-900">{tip.title}</p>
                  <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} text-xs text-gray-400 ml-auto transition-transform`} />
                </div>
                {isOpen && (
                  <ul className="space-y-2 mt-3 border-t border-gray-100 pt-3">
                    {tip.tips.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <i className="fa fa-check text-orange-400 text-xs mt-1 flex-shrink-0" />
                        {t}
                      </li>
                    ))}
                  </ul>
                )}
                {!isOpen && (
                  <p className="text-xs text-gray-400">{tip.tips.length} tips — click to expand</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── 8. Popular Destinations Grid ────────────────────────────────────────────

const DESTINATIONS = [
  { city: 'Agra',       country: 'India',  img: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600&h=400&fit=crop', tag: 'Heritage',  fare: '₹420',  duration: '3h' },
  { city: 'Pune',       country: 'India',  img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', tag: 'City',      fare: '₹310',  duration: '3.5h' },
  { city: 'Jaipur',     country: 'India',  img: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=600&h=400&fit=crop', tag: 'Royal',     fare: '₹580',  duration: '5h' },
  { city: 'Goa',        country: 'India',  img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', tag: 'Beach',     fare: '₹750',  duration: '8h' },
  { city: 'Mysore',     country: 'India',  img: 'https://images.unsplash.com/photo-1600100397608-4b9a3e5e5e5e?w=600&h=400&fit=crop', tag: 'Culture',   fare: '₹390',  duration: '3h' },
  { city: 'Varanasi',   country: 'India',  img: 'https://images.unsplash.com/photo-1561361058-c24e01238a46?w=600&h=400&fit=crop', tag: 'Spiritual',  fare: '₹620',  duration: '6h' },
  { city: 'Manali',     country: 'India',  img: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&h=400&fit=crop', tag: 'Mountains', fare: '₹890',  duration: '14h' },
  { city: 'Pondicherry',country: 'India',  img: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=600&h=400&fit=crop', tag: 'Coastal',   fare: '₹480',  duration: '4h' },
];

const TAG_COLORS = { Heritage: 'bg-amber-500', City: 'bg-blue-500', Royal: 'bg-purple-500', Beach: 'bg-cyan-500', Culture: 'bg-green-500', Spiritual: 'bg-orange-500', Mountains: 'bg-slate-500', Coastal: 'bg-teal-500' };

export function PopularDestinations({ onSelect }) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Explore India</span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Popular Bus Destinations</h2>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Click to search route →</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {DESTINATIONS.map((d, i) => (
            <button key={i} onClick={() => onSelect && onSelect(d.city)}
              className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left aspect-[4/3]">
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: `url('${d.img}')` }} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-3 left-3">
                <span className={`text-[0.6rem] font-bold text-white px-2 py-0.5 rounded-full ${TAG_COLORS[d.tag] || 'bg-orange-500'}`}>{d.tag}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-white font-extrabold text-sm leading-tight">{d.city}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-gray-300 text-[0.6rem] flex items-center gap-1">
                    <i className="fa fa-clock-o text-orange-400" />{d.duration}
                  </span>
                  <span className="text-orange-400 font-black text-xs">{d.fare}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 9. Nearby Stops Map ─────────────────────────────────────────────────────

export function NearbyStopsMap({ results }) {
  if (!results?.stations?.length || !results?.from) return null;
  const { lat: fromLat, lon: fromLon } = results.from;
  const markers = results.stations
    .slice(0, 10)
    .map(s => `marker=lonlat:${s.geometry.coordinates[0]},${s.geometry.coordinates[1]};color:%23f97316;size:small`)
    .join('&');
  const mapUrl = `https://maps.geoapify.com/v1/staticmap?style=osm-bright&width=1200&height=400&center=lonlat:${fromLon},${fromLat}&zoom=13&${markers}&apiKey=${GEO_KEY}`;

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-8">
          <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Live Map</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Bus Stops Near {results.from.name}</h2>
          <p className="text-gray-400 text-sm mt-2">{results.stations.length} stops found within 15 km</p>
        </div>
        <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
          <img src={mapUrl} alt="Bus stops map" className="w-full object-cover" style={{ height: 400 }} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {results.stations.slice(0, 10).map((s, i) => {
            const p = s.properties;
            return (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-bus text-white text-[0.55rem]" />
                  </div>
                  <p className="text-xs font-bold text-gray-900 truncate">{p.name || 'Bus Stop'}</p>
                </div>
                <p className="text-[0.6rem] text-gray-400 truncate">{p.city || p.county || '—'}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
