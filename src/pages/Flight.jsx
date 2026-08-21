import { useState, useEffect } from 'react';
import LiveTrackingMap from '../components/LiveTrackingMap';
import { fetchWeather } from '../services/weatherApi';
import { getFlightStatus, getFlightSchedules, getAirlines, getAirports } from '../services/flightApi';

const TABS = [
  { key: 'status',    label: 'Flight Status',  icon: 'fa-plane' },
  { key: 'schedules', label: 'Schedules',       icon: 'fa-list-alt' },
  { key: 'airlines',  label: 'Airlines',        icon: 'fa-building' },
  { key: 'airports',  label: 'Airports',        icon: 'fa-map-marker-alt' },
];

const STATUS_CONFIG = {
  active:    { bg: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-400', pulse: true },
  landed:    { bg: 'bg-sky-500/15 text-sky-400 border-sky-500/30',             dot: 'bg-sky-400',     pulse: false },
  scheduled: { bg: 'bg-amber-500/15 text-amber-400 border-amber-500/30',       dot: 'bg-amber-400',   pulse: false },
  cancelled: { bg: 'bg-red-500/15 text-red-400 border-red-500/30',             dot: 'bg-red-400',     pulse: false },
};

function StatusBadge({ status }) {
  const key = status?.toLowerCase();
  const cfg = STATUS_CONFIG[key] || { bg: 'bg-gray-500/15 text-gray-400 border-gray-500/30', dot: 'bg-gray-400', pulse: false };
  return (
    <span className={`inline-flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${cfg.bg}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot} ${cfg.pulse ? 'animate-pulse' : ''}`} />
      {status || 'Unknown'}
    </span>
  );
}

function InputField({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[0.65rem] font-bold text-slate-400 uppercase tracking-[0.15em]">{label}</label>
      <div className="flex items-center gap-2.5 bg-slate-800/60 border border-slate-700 rounded-lg px-3.5 py-2.5 group-focus-within:border-orange-500 group-focus-within:bg-slate-800 transition-all">
        <i className={`fa ${icon} text-slate-500 group-focus-within:text-orange-400 transition-colors text-xs w-3`} />
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
      <p className={`text-sm font-semibold ${highlight ? 'text-red-400' : 'text-slate-200'}`}>{value || '—'}</p>
    </div>
  );
}

function FlightTicker({ flights }) {
  if (!flights?.length) return null;
  const items = [...flights, ...flights]; // duplicate for seamless loop
  return (
    <div className="relative bg-slate-900 border-b border-slate-800 overflow-hidden h-10 flex items-center">
      <div className="flex items-center gap-3 px-4 bg-slate-900 z-10 border-r border-slate-800 h-full flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-widest">Live Tracking</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-6 animate-[ticker_30s_linear_infinite] whitespace-nowrap">
          {items.map((f, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-slate-300 flex-shrink-0">
              <img src={`https://www.gstatic.com/flights/airline_logos/70px/${f.airline?.iata}.png`}
                onError={e => { e.target.style.display = 'none'; }}
                className="w-5 h-5 rounded object-contain" alt="" />
              <span className="font-bold text-white">{f.flight?.iata}</span>
              <span className="text-slate-500">({f.aircraft?.iata || '—'})</span>
              <span className="text-slate-400">{f.departure?.iata}</span>
              <i className="fa fa-plane text-sky-400 text-[0.6rem]" />
              <span className="text-slate-400">{f.arrival?.iata}</span>
              <span className="w-px h-3 bg-slate-700 mx-1" />
            </span>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes ticker { from { transform: translateX(0); } to { transform: translateX(-50%); } }
      `}</style>
    </div>
  );
}

function DetailModal({ flight: f, onClose }) {
  if (!f) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700/60 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="relative bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/60 rounded-t-2xl px-6 py-5">
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent rounded-t-2xl" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                <i className="fa fa-plane text-orange-400 text-lg" />
              </div>
              <div>
                <p className="text-white font-bold text-xl tracking-wide">{f.flight?.iata || '—'}</p>
                <p className="text-slate-400 text-xs mt-0.5">{f.airline?.name || '—'}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <StatusBadge status={f.flight_status} />
              <button onClick={onClose} className="w-8 h-8 rounded-lg bg-slate-700/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
                <i className="fa fa-times text-sm" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Live Map */}
          <LiveTrackingMap flight={f} />

          {/* Route visual */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 flex items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-4xl font-black text-white tracking-tight">{f.departure?.iata || '—'}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[120px] truncate">{f.departure?.airport || '—'}</p>
              <p className="text-orange-400 font-bold text-lg mt-1">{f.departure?.scheduled?.slice(11, 16) || '—'}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-2">
              <div className="w-full flex items-center gap-1">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-slate-600 to-slate-600" />
                <div className="w-7 h-7 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center">
                  <i className="fa fa-plane text-orange-400 text-xs" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-slate-600 via-slate-600 to-transparent" />
              </div>
              <p className="text-[0.65rem] text-slate-500 font-medium">{f.flight_date || '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-black text-white tracking-tight">{f.arrival?.iata || '—'}</p>
              <p className="text-xs text-slate-400 mt-1 max-w-[120px] truncate">{f.arrival?.airport || '—'}</p>
              <p className="text-orange-400 font-bold text-lg mt-1">{f.arrival?.scheduled?.slice(11, 16) || '—'}</p>
            </div>
          </div>

          {/* Departure */}
          <div>
            <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500 inline-block" />Departure
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoRow label="Terminal" value={f.departure?.terminal} />
              <InfoRow label="Gate" value={f.departure?.gate} />
              <InfoRow label="Scheduled" value={f.departure?.scheduled?.slice(11, 16)} />
              <InfoRow label="Actual" value={f.departure?.actual?.slice(11, 16)} />
              <InfoRow label="Estimated" value={f.departure?.estimated?.slice(11, 16)} />
              <InfoRow label="Delay" value={f.departure?.delay ? `${f.departure.delay} min` : 'None'} highlight={!!f.departure?.delay} />
              <InfoRow label="Timezone" value={f.departure?.timezone} />
            </div>
          </div>

          <div className="h-px bg-slate-700/50" />

          {/* Arrival */}
          <div>
            <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500 inline-block" />Arrival
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoRow label="Terminal" value={f.arrival?.terminal} />
              <InfoRow label="Gate" value={f.arrival?.gate} />
              <InfoRow label="Baggage" value={f.arrival?.baggage} />
              <InfoRow label="Scheduled" value={f.arrival?.scheduled?.slice(11, 16)} />
              <InfoRow label="Actual" value={f.arrival?.actual?.slice(11, 16)} />
              <InfoRow label="Estimated" value={f.arrival?.estimated?.slice(11, 16)} />
              <InfoRow label="Delay" value={f.arrival?.delay ? `${f.arrival.delay} min` : 'None'} highlight={!!f.arrival?.delay} />
              <InfoRow label="Timezone" value={f.arrival?.timezone} />
            </div>
          </div>

          <div className="h-px bg-slate-700/50" />

          {/* Flight & Aircraft */}
          <div>
            <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
              <span className="w-4 h-px bg-orange-500 inline-block" />Flight & Aircraft
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoRow label="Flight IATA" value={f.flight?.iata} />
              <InfoRow label="Flight ICAO" value={f.flight?.icao} />
              <InfoRow label="Aircraft IATA" value={f.aircraft?.iata} />
              <InfoRow label="Registration" value={f.aircraft?.registration} />
              <InfoRow label="Airline IATA" value={f.airline?.iata} />
              <InfoRow label="Airline ICAO" value={f.airline?.icao} />
            </div>
          </div>

          {/* Live */}
          {f.live && (
            <>
              <div className="h-px bg-slate-700/50" />
              <div>
                <p className="text-[0.65rem] font-bold text-slate-500 uppercase tracking-[0.15em] mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />Live Tracking
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <InfoRow label="Altitude" value={f.live?.altitude != null ? `${f.live.altitude} ft` : null} />
                  <InfoRow label="Speed" value={f.live?.speed_horizontal != null ? `${f.live.speed_horizontal} km/h` : null} />
                  <InfoRow label="Latitude" value={f.live?.latitude} />
                  <InfoRow label="Longitude" value={f.live?.longitude} />
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// Country code → flag emoji
function flag(iata) {
  const map = {
    US:'🇺🇸',GB:'🇬🇧',AE:'🇦🇪',IN:'🇮🇳',SG:'🇸🇬',AU:'🇦🇺',DE:'🇩🇪',FR:'🇫🇷',JP:'🇯🇵',CN:'🇨🇳',
    CA:'🇨🇦',BR:'🇧🇷',NL:'🇳🇱',QA:'🇶🇦',TR:'🇹🇷',TH:'🇹🇭',MY:'🇲🇾',KR:'🇰🇷',ZA:'🇿🇦',EG:'🇪🇬',
    MX:'🇲🇽',AR:'🇦🇷',IT:'🇮🇹',ES:'🇪🇸',PT:'🇵🇹',GR:'🇬🇷',PH:'🇵🇭',ID:'🇮🇩',PK:'🇵🇰',NG:'🇳🇬',
    KE:'🇰🇪',NZ:'🇳🇿',CH:'🇨🇭',AT:'🇦🇹',BE:'🇧🇪',SE:'🇸🇪',NO:'🇳🇴',DK:'🇩🇰',FI:'🇫🇮',PL:'🇵🇱',
  };
  return map[iata?.toUpperCase()] || '🌐';
}

// Progress bar: estimate % flown based on scheduled times
function flightProgress(f) {
  const dep = f.departure?.scheduled ? new Date(f.departure.scheduled) : null;
  const arr = f.arrival?.scheduled   ? new Date(f.arrival.scheduled)   : null;
  if (!dep || !arr) return 0;
  const now = Date.now();
  const total = arr - dep;
  if (total <= 0) return 0;
  return Math.min(100, Math.max(0, ((now - dep) / total) * 100));
}

const TABLE_STATUS = {
  active:    { label: 'ON TIME',   cls: 'border-sky-400 text-sky-400' },
  landed:    { label: 'LANDED',    cls: 'border-emerald-400 text-emerald-400' },
  scheduled: { label: 'SCHEDULED', cls: 'border-amber-400 text-amber-400' },
  cancelled: { label: 'CANCELLED', cls: 'border-red-400 text-red-400' },
};

function TableStatusBadge({ status, delay }) {
  if (delay) return <span className="text-[0.65rem] font-bold border border-orange-400 text-orange-400 px-2 py-0.5 rounded">DELAYED</span>;
  const key = status?.toLowerCase();
  const cfg = TABLE_STATUS[key] || { label: status?.toUpperCase() || '—', cls: 'border-slate-500 text-slate-400' };
  return <span className={`text-[0.65rem] font-bold border px-2 py-0.5 rounded ${cfg.cls}`}>{cfg.label}</span>;
}

function FlightTableRow({ f, checked, onCheck, onClick }) {
  const [weather, setWeather] = useState(null);
  const iata = f.departure?.iata;

  useEffect(() => {
    let cancelled = false;
    fetchWeather(iata).then(w => { if (!cancelled) setWeather(w); });
    return () => { cancelled = true; };
  }, [iata]);

  const pct = flightProgress(f);
  const depCountry = f.departure?.timezone?.split('/')[0] === 'America' ? 'US' : f.departure?.iata?.slice(0,2);
  const arrCountry = f.arrival?.timezone?.split('/')[0]  === 'America' ? 'US' : f.arrival?.iata?.slice(0,2);
  const hasDelay = !!(f.departure?.delay || f.arrival?.delay);

  return (
    <tr className="border-b border-slate-800 hover:bg-slate-800/50 cursor-pointer transition-colors group"
      onClick={onClick}>

      {/* Checkbox */}
      <td className="pl-4 pr-2 py-4" onClick={e => e.stopPropagation()}>
        <input type="checkbox" checked={checked} onChange={onCheck}
          className="w-3.5 h-3.5 accent-orange-500 cursor-pointer" />
      </td>

      {/* Flight No */}
      <td className="px-3 py-4 whitespace-nowrap">
        <span className="text-sky-400 font-bold text-sm">#{f.flight?.iata || '—'}</span>
      </td>

      {/* Vendor */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-2.5">
          <img src={`https://www.gstatic.com/flights/airline_logos/70px/${f.airline?.iata}.png`}
            onError={e => { e.target.src = ''; e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }}
            className="w-8 h-8 rounded-full object-contain bg-slate-700 p-0.5" alt="" />
          <span style={{display:'none'}} className="w-8 h-8 rounded-full bg-slate-700 items-center justify-center text-slate-400 text-xs">
            <i className="fa fa-plane" />
          </span>
          <span className="text-slate-200 text-xs font-semibold whitespace-nowrap">{f.airline?.name || '—'}</span>
        </div>
      </td>

      {/* Weather */}
      <td className="px-3 py-4">
        {weather ? (
          <div className="flex items-center gap-1.5 text-xs text-slate-300">
            <span className="text-base">{weather.icon}</span>
            <span className="text-slate-400">{weather.temp}°C</span>
            <span className="text-slate-500 hidden lg:inline">{weather.label}</span>
          </div>
        ) : (
          <span className="text-slate-600 text-xs">—</span>
        )}
      </td>

      {/* Route */}
      <td className="px-3 py-4">
        <div className="flex items-center gap-1.5 text-sm font-bold">
          <span>{flag(depCountry)}</span>
          <span className="text-slate-200">{f.departure?.iata || '—'}</span>
          <i className="fa fa-arrow-right text-slate-500 text-[0.6rem]" />
          <span>{flag(arrCountry)}</span>
          <span className="text-slate-200">{f.arrival?.iata || '—'}</span>
        </div>
      </td>

      {/* Destination / Progress */}
      <td className="px-3 py-4 min-w-[180px]">
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden relative">
            <div className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all"
              style={{ width: `${pct}%` }} />
            {pct > 0 && pct < 100 && (
              <span className="absolute top-1/2 -translate-y-1/2 text-sky-400 text-[0.5rem]"
                style={{ left: `calc(${pct}% - 5px)` }}>➤</span>
            )}
          </div>
        </div>
        <div className="flex justify-between text-[0.6rem] text-slate-500 mt-1">
          <span>{f.departure?.iata}</span>
          <span>{f.arrival?.iata}</span>
        </div>
      </td>

      {/* Status */}
      <td className="px-3 py-4">
        <TableStatusBadge status={f.flight_status} delay={hasDelay} />
      </td>

      {/* Time / Date */}
      <td className="px-3 py-4 text-right">
        <div className="flex flex-col items-end gap-0.5">
          <span className="flex items-center gap-1 text-xs text-slate-300">
            <i className="fa fa-clock-o text-slate-500 text-[0.6rem]" />
            {f.departure?.scheduled?.slice(11,16) || '—'}
          </span>
          <span className="flex items-center gap-1 text-[0.65rem] text-slate-500">
            <i className="fa fa-calendar text-slate-600 text-[0.6rem]" />
            {f.flight_date || '—'}
          </span>
        </div>
      </td>
    </tr>
  );
}

const STATUSES = ['active', 'landed', 'scheduled', 'cancelled'];

function FilterPanel({ filters, onChange, onReset, allFlights }) {
  const airlines = [...new Set(allFlights.map(f => f.airline?.name).filter(Boolean))];
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-xl p-5 mt-2 shadow-2xl shadow-black/40">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-bold text-slate-300 uppercase tracking-widest">Filter Flights</span>
        <button onClick={onReset} className="text-[0.65rem] text-orange-400 hover:text-orange-300 font-semibold">Reset All</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Status */}
        <div>
          <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Status</p>
          <div className="flex flex-wrap gap-1.5">
            {STATUSES.map(s => (
              <button key={s} onClick={() => onChange('status', filters.status === s ? '' : s)}
                className={`text-[0.65rem] font-bold px-2.5 py-1 rounded border transition-all ${
                  filters.status === s
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : 'border-slate-600 text-slate-400 hover:border-slate-500 hover:text-slate-300'
                }`}>
                {s.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Airline */}
        <div>
          <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Airline</p>
          <select value={filters.airline} onChange={e => onChange('airline', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition-colors">
            <option value="">All Airlines</option>
            {airlines.map(a => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>

        {/* Departure IATA */}
        <div>
          <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Departure</p>
          <input value={filters.dep} onChange={e => onChange('dep', e.target.value.toUpperCase())}
            placeholder="e.g. LHR"
            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition-colors placeholder-slate-600" />
        </div>

        {/* Arrival IATA */}
        <div>
          <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Arrival</p>
          <input value={filters.arr} onChange={e => onChange('arr', e.target.value.toUpperCase())}
            placeholder="e.g. JFK"
            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition-colors placeholder-slate-600" />
        </div>

        {/* Delay only */}
        <div className="flex items-center gap-2 sm:col-span-2">
          <button onClick={() => onChange('delayOnly', !filters.delayOnly)}
            className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ${
              filters.delayOnly ? 'bg-orange-500' : 'bg-slate-700'
            }`}>
            <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${
              filters.delayOnly ? 'left-4' : 'left-0.5'
            }`} />
          </button>
          <span className="text-xs text-slate-400">Delayed flights only</span>
        </div>

        {/* Date */}
        <div className="sm:col-span-2">
          <p className="text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest mb-2">Flight Date</p>
          <input type="date" value={filters.date} onChange={e => onChange('date', e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-3 py-2 outline-none focus:border-orange-500 transition-colors" />
        </div>
      </div>
    </div>
  );
}

export default function Flight() {
  const [tab, setTab] = useState('status');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState(null);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [checkedRows, setCheckedRows] = useState([]);
  const [tableSearch, setTableSearch] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [filters, setFilters] = useState({ status: '', airline: '', dep: '', arr: '', date: '', delayOnly: false });
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 8;

  function updateFilter(key, val) { setFilters(prev => ({ ...prev, [key]: val })); setPage(0); }
  function resetFilters() { setFilters({ status: '', airline: '', dep: '', arr: '', date: '', delayOnly: false }); setPage(0); }
  const activeFilterCount = Object.entries(filters).filter(([k, v]) => v !== '' && v !== false).length;

  const [flightIata, setFlightIata] = useState('');
  const [depIata, setDepIata] = useState('');
  const [arrIata, setArrIata] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [airlineName, setAirlineName] = useState('');
  const [airportName, setAirportName] = useState('');

  async function handleSearch(e) {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);
    setCheckedRows([]);
    setPage(0);
    setTableSearch('');
    try {
      let res;
      if (tab === 'status') res = await getFlightStatus(flightIata);
      else if (tab === 'schedules') {
        res = await getFlightSchedules(depIata);
        if (res.data?.data) {
          let filtered = res.data.data;
          if (arrIata) filtered = filtered.filter(f => f.arrival?.iata?.toLowerCase() === arrIata.toLowerCase());
          if (flightDate) filtered = filtered.filter(f => f.flight_date === flightDate);
          res = { data: { ...res.data, data: filtered } };
        }
      } else if (tab === 'airlines') res = await getAirlines(airlineName);
      else res = await getAirports(airportName);
      setResults(res.data);
    } catch {
      setError('Failed to fetch data. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  }

  function switchTab(key) { setTab(key); setResults(null); setError(''); setCheckedRows([]); setPage(0); resetFilters(); }

  const isFlightTab = tab === 'status' || tab === 'schedules';
  const allFlights = isFlightTab ? (results?.data || []) : [];
  const filtered = allFlights.filter(f => {
    if (tableSearch) {
      const q = tableSearch.toLowerCase();
      const match = f.flight?.iata?.toLowerCase().includes(q) ||
        f.airline?.name?.toLowerCase().includes(q) ||
        f.departure?.iata?.toLowerCase().includes(q) ||
        f.arrival?.iata?.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.status && f.flight_status?.toLowerCase() !== filters.status) return false;
    if (filters.airline && f.airline?.name !== filters.airline) return false;
    if (filters.dep && !f.departure?.iata?.toUpperCase().startsWith(filters.dep)) return false;
    if (filters.arr && !f.arrival?.iata?.toUpperCase().startsWith(filters.arr)) return false;
    if (filters.date && f.flight_date !== filters.date) return false;
    if (filters.delayOnly && !f.departure?.delay && !f.arrival?.delay) return false;
    return true;
  });
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const pageFlights = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const allChecked = pageFlights.length > 0 && pageFlights.every((_, i) => checkedRows.includes(page * PAGE_SIZE + i));

  function toggleAll() {
    const idxs = pageFlights.map((_, i) => page * PAGE_SIZE + i);
    setCheckedRows(prev => allChecked ? prev.filter(x => !idxs.includes(x)) : [...new Set([...prev, ...idxs])]);
  }

  return (
    <>
      <div className="relative h-[60vh] overflow-hidden flex items-center justify-center">
        <video
          src="/images/a flying plane on the runway.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">Flight Search</h1>
          <p className="text-slate-300 mt-3 text-sm uppercase tracking-[0.2em]">Home / Flight Search</p>
        </div>
      </div>

      <section className="bg-slate-950 min-h-screen py-12 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Tab bar */}
          <div className="flex flex-wrap gap-1 bg-slate-900 border border-slate-800 rounded-xl p-1 mb-8">
            {TABS.map(t => (
              <button key={t.key} onClick={() => switchTab(t.key)}
                className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200
                  ${tab === t.key
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'}`}>
                <i className={`fa ${t.icon} text-[0.7rem]`} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Search panel */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8 shadow-xl shadow-black/30">
            <div className="flex items-center gap-2 mb-5">
              <div className="w-1 h-5 bg-orange-500 rounded-full" />
              <h2 className="text-sm font-bold text-slate-200 uppercase tracking-widest">
                {TABS.find(t => t.key === tab)?.label}
              </h2>
            </div>

            <form onSubmit={handleSearch} className="flex flex-col gap-5">
              {tab === 'status' && (
                <InputField label="Flight IATA Code (e.g. AA101)" icon="fa-plane">
                  <input value={flightIata} onChange={e => setFlightIata(e.target.value)}
                    placeholder="Enter flight code" required
                    className="w-full outline-none text-sm text-slate-200 placeholder-slate-600 bg-transparent" />
                </InputField>
              )}
              {tab === 'schedules' && (
                <div className="grid sm:grid-cols-3 gap-4">
                  <InputField label="Departure IATA (required)" icon="fa-plane">
                    <input value={depIata} onChange={e => setDepIata(e.target.value)}
                      placeholder="e.g. LHR" required
                      className="w-full outline-none text-sm text-slate-200 placeholder-slate-600 bg-transparent" />
                  </InputField>
                  <InputField label="Arrival IATA (optional)" icon="fa-plane">
                    <input value={arrIata} onChange={e => setArrIata(e.target.value)}
                      placeholder="e.g. LAX"
                      className="w-full outline-none text-sm text-slate-200 placeholder-slate-600 bg-transparent" />
                  </InputField>
                  <InputField label="Flight Date" icon="fa-calendar">
                    <input type="date" value={flightDate} onChange={e => setFlightDate(e.target.value)}
                      className="w-full outline-none text-sm text-slate-300 bg-transparent" />
                  </InputField>
                </div>
              )}
              {tab === 'airlines' && (
                <InputField label="Airline IATA Code or Name" icon="fa-building">
                  <input value={airlineName} onChange={e => setAirlineName(e.target.value)}
                    placeholder="e.g. EK, Emirates" required
                    className="w-full outline-none text-sm text-slate-200 placeholder-slate-600 bg-transparent" />
                </InputField>
              )}
              {tab === 'airports' && (
                <InputField label="Airport IATA Code or Name" icon="fa-map-marker">
                  <input value={airportName} onChange={e => setAirportName(e.target.value)}
                    placeholder="e.g. DEL, JFK" required
                    className="w-full outline-none text-sm text-slate-200 placeholder-slate-600 bg-transparent" />
                </InputField>
              )}
              <button type="submit" disabled={loading}
                className="self-start flex items-center gap-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-xs font-bold uppercase tracking-widest px-7 py-3 rounded-lg transition-all shadow-lg shadow-orange-500/25 active:scale-95">
                <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-search'} text-xs`} />
                {loading ? 'Searching...' : 'Search'}
              </button>
            </form>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl px-5 py-4 text-sm mb-6">
              <i className="fa fa-exclamation-triangle" />{error}
            </div>
          )}

          {/* ── Flight Table ── */}
          {results && isFlightTab && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl shadow-black/30">

              {/* Table toolbar */}
              <div className="flex items-center justify-between gap-4 px-5 py-4 border-b border-slate-800">
                <div className="flex items-center gap-4">
                  <h3 className="text-white font-bold text-lg">Flights</h3>
                  <div className="flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-lg px-3 py-1.5">
                    <i className="fa fa-search text-slate-500 text-xs" />
                    <input value={tableSearch} onChange={e => { setTableSearch(e.target.value); setPage(0); }}
                      placeholder="Search by Flight no."
                      className="bg-transparent outline-none text-xs text-slate-300 placeholder-slate-600 w-40" />
                  </div>
                  <button onClick={() => setShowFilter(f => !f)}
                    className={`relative w-8 h-8 border rounded-lg flex items-center justify-center transition-colors ${
                      showFilter || activeFilterCount > 0
                        ? 'bg-orange-500/20 border-orange-500 text-orange-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}>
                    <i className="fa fa-filter text-xs" />
                    {activeFilterCount > 0 && (
                      <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-orange-500 text-white text-[0.55rem] font-bold rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    <span className="text-white font-semibold">{page * PAGE_SIZE + 1} to {Math.min((page + 1) * PAGE_SIZE, filtered.length)}</span>
                    {' '}Items of{' '}
                    <span className="text-white font-semibold">{filtered.length}</span>
                  </span>
                  {filtered.length > PAGE_SIZE && (
                    <button onClick={() => setPage(0)} className="text-xs text-sky-400 hover:text-sky-300 font-semibold">
                      {page > 0 ? 'View Less' : ''}
                    </button>
                  )}
                  <div className="flex gap-1">
                    <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
                      className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                      <i className="fa fa-chevron-left text-xs" />
                    </button>
                    <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                      className="w-8 h-8 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 hover:text-white disabled:opacity-30 transition-colors">
                      <i className="fa fa-chevron-right text-xs" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Filter panel */}
              {showFilter && (
                <div className="px-5 pb-4">
                  <FilterPanel filters={filters} onChange={updateFilter} onReset={resetFilters} allFlights={allFlights} />
                </div>
              )}

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="pl-4 pr-2 py-3">
                        <input type="checkbox" checked={allChecked} onChange={toggleAll}
                          className="w-3.5 h-3.5 accent-orange-500 cursor-pointer" />
                      </th>
                      {['FLIGHTS NO.','VENDOR','WEATHER','ROUTE','DESTINATION','STATUS','TIME'].map(h => (
                        <th key={h} className="px-3 py-3 text-left">
                          <span className="flex items-center gap-1 text-[0.6rem] font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                            {h} {h !== 'TIME' && <i className="fa fa-sort text-slate-600" />}
                          </span>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {pageFlights.map((f, i) => (
                      <FlightTableRow key={i} f={f}
                        checked={checkedRows.includes(page * PAGE_SIZE + i)}
                        onCheck={() => {
                          const idx = page * PAGE_SIZE + i;
                          setCheckedRows(prev => prev.includes(idx) ? prev.filter(x => x !== idx) : [...prev, idx]);
                        }}
                        onClick={() => setSelectedFlight(f)} />
                    ))}
                  </tbody>
                </table>
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-16 text-slate-600">
                  <i className="fa fa-search text-4xl mb-3 block" />
                  <p className="text-sm">No results found.</p>
                </div>
              )}
            </div>
          )}

          {/* Airlines / Airports plain list */}
          {results && !isFlightTab && (
            <div className="space-y-3">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">
                {results.data?.length || 0} Result{results.data?.length !== 1 ? 's' : ''} Found
              </p>
              {tab === 'airlines' && results.data?.map((a, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 hover:border-orange-500/30 rounded-xl p-5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
                      <i className="fa fa-building text-orange-400" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      <InfoRow label="Airline" value={a.airline_name} />
                      <InfoRow label="IATA / ICAO" value={`${a.iata_code || '—'} / ${a.icao_code || '—'}`} />
                      <InfoRow label="Country" value={a.country_name} />
                      <InfoRow label="Status" value={a.fleet_average_age ? 'Active' : 'Unknown'} />
                    </div>
                  </div>
                </div>
              ))}
              {tab === 'airports' && results.data?.map((a, i) => (
                <div key={i} className="bg-slate-800/40 border border-slate-700/50 hover:border-orange-500/30 rounded-xl p-5 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-orange-500/15 border border-orange-500/25 flex items-center justify-center flex-shrink-0">
                      <i className="fa fa-map-marker text-orange-400" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                      <InfoRow label="Airport" value={a.airport_name} />
                      <InfoRow label="IATA / ICAO" value={`${a.iata_code || '—'} / ${a.icao_code || '—'}`} />
                      <InfoRow label="City / Country" value={`${a.city_iata_code || '—'} / ${a.country_name || '—'}`} />
                      <InfoRow label="Timezone" value={a.timezone} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Ticker */}
      {allFlights.length > 0 && (
        <div className="fixed top-0 left-0 right-0 z-40">
          <FlightTicker flights={allFlights} />
        </div>
      )}

      <DetailModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
    </>
  );
}

