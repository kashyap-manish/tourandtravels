import { useState } from 'react';
import PageHero from '../components/PageHero';
import { getFlightStatus, getFlightSchedules, getAirlines, getAirports } from '../services/flightApi';

const tabs = [
  { key: 'status', label: 'Flight Status', icon: 'fa-plane' },
  { key: 'schedules', label: 'Schedules', icon: 'fa-calendar' },
  { key: 'airlines', label: 'Airlines', icon: 'fa-building' },
  { key: 'airports', label: 'Airports', icon: 'fa-map-marker' },
];

function Field({ label, icon, children }) {
  return (
    <div className="flex flex-col gap-1.5 group">
      <label className="text-[0.7rem] font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2.5 border-b border-gray-200 pb-1.5 group-focus-within:border-orange-400 transition-colors">
        <i className={`fa ${icon} text-gray-300 group-focus-within:text-orange-400 transition-colors text-sm`} />
        {children}
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const colors = {
    active: 'bg-green-100 text-green-700',
    landed: 'bg-blue-100 text-blue-700',
    scheduled: 'bg-yellow-100 text-yellow-700',
    cancelled: 'bg-red-100 text-red-700',
  };
  const key = status?.toLowerCase();
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full capitalize ${colors[key] || 'bg-gray-100 text-gray-600'}`}>
      {status || 'Unknown'}
    </span>
  );
}

function DetailModal({ flight, onClose }) {
  if (!flight) return null;
  const f = flight;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="bg-orange-500 rounded-t-2xl px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <i className="fa fa-plane text-white" />
            </div>
            <div>
              <p className="text-white font-bold text-lg">{f.flight?.iata || '—'}</p>
              <p className="text-orange-100 text-xs">{f.airline?.name || '—'}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StatusBadge status={f.flight_status} />
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <i className="fa fa-times text-lg" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">

          {/* Route */}
          <div className="flex items-center justify-between gap-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{f.departure?.iata || '—'}</p>
              <p className="text-sm text-gray-500 mt-1">{f.departure?.airport || '—'}</p>
              <p className="text-orange-500 font-semibold mt-1">{f.departure?.scheduled?.slice(11, 16) || '—'}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full flex items-center gap-2">
                <div className="flex-1 h-px bg-gray-200" />
                <i className="fa fa-plane text-orange-400" />
                <div className="flex-1 h-px bg-gray-200" />
              </div>
              <p className="text-xs text-gray-400">{f.flight_date || '—'}</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-800">{f.arrival?.iata || '—'}</p>
              <p className="text-sm text-gray-500 mt-1">{f.arrival?.airport || '—'}</p>
              <p className="text-orange-500 font-semibold mt-1">{f.arrival?.scheduled?.slice(11, 16) || '—'}</p>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Departure Details */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Departure</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Terminal</p><p className="font-semibold text-gray-700">{f.departure?.terminal || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Gate</p><p className="font-semibold text-gray-700">{f.departure?.gate || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Scheduled</p><p className="font-semibold text-gray-700">{f.departure?.scheduled?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Actual</p><p className="font-semibold text-gray-700">{f.departure?.actual?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Estimated</p><p className="font-semibold text-gray-700">{f.departure?.estimated?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Delay</p><p className={`font-semibold ${f.departure?.delay ? 'text-red-500' : 'text-green-600'}`}>{f.departure?.delay ? `${f.departure.delay} min` : 'None'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Timezone</p><p className="font-semibold text-gray-700">{f.departure?.timezone || '—'}</p></div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Arrival Details */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Arrival</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Terminal</p><p className="font-semibold text-gray-700">{f.arrival?.terminal || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Gate</p><p className="font-semibold text-gray-700">{f.arrival?.gate || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Baggage</p><p className="font-semibold text-gray-700">{f.arrival?.baggage || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Scheduled</p><p className="font-semibold text-gray-700">{f.arrival?.scheduled?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Actual</p><p className="font-semibold text-gray-700">{f.arrival?.actual?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Estimated</p><p className="font-semibold text-gray-700">{f.arrival?.estimated?.slice(11, 16) || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Delay</p><p className={`font-semibold ${f.arrival?.delay ? 'text-red-500' : 'text-green-600'}`}>{f.arrival?.delay ? `${f.arrival.delay} min` : 'None'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Timezone</p><p className="font-semibold text-gray-700">{f.arrival?.timezone || '—'}</p></div>
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Flight & Aircraft */}
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Flight & Aircraft</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div><p className="text-gray-400 text-xs mb-0.5">Flight IATA</p><p className="font-semibold text-gray-700">{f.flight?.iata || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Flight ICAO</p><p className="font-semibold text-gray-700">{f.flight?.icao || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Aircraft IATA</p><p className="font-semibold text-gray-700">{f.aircraft?.iata || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Registration</p><p className="font-semibold text-gray-700">{f.aircraft?.registration || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Airline IATA</p><p className="font-semibold text-gray-700">{f.airline?.iata || '—'}</p></div>
              <div><p className="text-gray-400 text-xs mb-0.5">Airline ICAO</p><p className="font-semibold text-gray-700">{f.airline?.icao || '—'}</p></div>
            </div>
          </div>

          {/* Live Data */}
          {f.live && (
            <>
              <div className="h-px bg-gray-100" />
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Live Tracking</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div><p className="text-gray-400 text-xs mb-0.5">Altitude</p><p className="font-semibold text-gray-700">{f.live?.altitude ?? '—'} ft</p></div>
                  <div><p className="text-gray-400 text-xs mb-0.5">Speed</p><p className="font-semibold text-gray-700">{f.live?.speed_horizontal ?? '—'} km/h</p></div>
                  <div><p className="text-gray-400 text-xs mb-0.5">Latitude</p><p className="font-semibold text-gray-700">{f.live?.latitude ?? '—'}</p></div>
                  <div><p className="text-gray-400 text-xs mb-0.5">Longitude</p><p className="font-semibold text-gray-700">{f.live?.longitude ?? '—'}</p></div>
                </div>
              </div>
            </>
          )}
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

  // form states
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
    try {
      let res;
      if (tab === 'status') res = await getFlightStatus(flightIata);
      else if (tab === 'schedules') {
        res = await getFlightSchedules(depIata);
        // client-side filter for arr_iata and date (free plan limitation)
        if (res.data?.data) {
          let filtered = res.data.data;
          if (arrIata) filtered = filtered.filter(f => f.arrival?.iata?.toLowerCase() === arrIata.toLowerCase());
          if (flightDate) filtered = filtered.filter(f => f.flight_date === flightDate);
          res = { data: { ...res.data, data: filtered } };
        }
      }
      else if (tab === 'airlines') res = await getAirlines(airlineName);
      else res = await getAirports(airportName);
      setResults(res.data);
    } catch {
      setError('Failed to fetch data. Please check your input and try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHero title="Flight Search" breadcrumb="Flight Search" bgImage="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&auto=format&fit=crop" />

      <section className="py-16 max-w-5xl mx-auto px-4">

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map(t => (
            <button key={t.key} onClick={() => { setTab(t.key); setResults(null); setError(''); }}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all
                ${tab === t.key ? 'bg-orange-500 text-white shadow-lg shadow-orange-400/30' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              <i className={`fa ${t.icon} text-xs`} />
              {t.label}
            </button>
          ))}
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-2xl shadow-xl shadow-black/10 p-8 mb-8">
          <form onSubmit={handleSearch} className="flex flex-col gap-6">
            {tab === 'status' && (
              <Field label="Flight IATA Code (e.g. AA101)" icon="fa-plane">
                <input value={flightIata} onChange={e => setFlightIata(e.target.value)}
                  placeholder="Enter flight code" required
                  className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
              </Field>
            )}

            {tab === 'schedules' && (
              <div className="grid sm:grid-cols-3 gap-6">
                <Field label="Departure IATA (required, e.g. LHR)" icon="fa-plane">
                  <input value={depIata} onChange={e => setDepIata(e.target.value)}
                    placeholder="DEP" required className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
                </Field>
                <Field label="Arrival IATA (e.g. LAX)" icon="fa-plane">
                  <input value={arrIata} onChange={e => setArrIata(e.target.value)}
                    placeholder="ARR" className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
                </Field>
                <Field label="Flight Date" icon="fa-calendar">
                  <input type="date" value={flightDate} onChange={e => setFlightDate(e.target.value)}
                    className="w-full outline-none text-sm text-gray-600 bg-transparent" />
                </Field>
              </div>
            )}

            {tab === 'airlines' && (
              <Field label="Airline IATA Code or Exact Name" icon="fa-building">
                <input value={airlineName} onChange={e => setAirlineName(e.target.value)}
                  placeholder="IATA code (e.g. EK, AI, 6E) or exact name" required
                  className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
              </Field>
            )}

            {tab === 'airports' && (
              <Field label="Airport Name or IATA Code (e.g. DEL, JFK)" icon="fa-map-marker">
                <input value={airportName} onChange={e => setAirportName(e.target.value)}
                  placeholder="Enter IATA code (e.g. DEL) or exact name" required
                  className="w-full outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent" />
              </Field>
            )}

            <button type="submit" disabled={loading}
              className="self-start flex items-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-semibold px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/30 active:scale-95">
              <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-search'} text-sm`} />
              {loading ? 'Searching...' : 'Search'}
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-5 py-4 text-sm mb-6">
            <i className="fa fa-exclamation-circle mr-2" />{error}
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-4">
            <p className="text-sm text-gray-400 font-medium">{results.data?.length || 0} result(s) found</p>

            {/* Flight Status / Schedules */}
            {(tab === 'status' || tab === 'schedules') && results.data?.map((f, i) => (
              <div key={i} onClick={() => setSelectedFlight(f)}
                className="bg-white rounded-2xl shadow-md shadow-black/5 p-6 border border-gray-100 hover:border-orange-200 hover:shadow-lg cursor-pointer transition-all">
                <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                      <i className="fa fa-plane text-orange-500" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">{f.flight?.iata || '—'}</p>
                      <p className="text-xs text-gray-400">{f.airline?.name || '—'}</p>
                    </div>
                  </div>
                  <StatusBadge status={f.flight_status} />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Departure</p>
                    <p className="font-semibold text-gray-700">{f.departure?.iata || '—'}</p>
                    <p className="text-xs text-gray-400">{f.departure?.airport || '—'}</p>
                    <p className="text-xs text-orange-500 mt-0.5">{f.departure?.scheduled?.slice(11, 16) || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Arrival</p>
                    <p className="font-semibold text-gray-700">{f.arrival?.iata || '—'}</p>
                    <p className="text-xs text-gray-400">{f.arrival?.airport || '—'}</p>
                    <p className="text-xs text-orange-500 mt-0.5">{f.arrival?.scheduled?.slice(11, 16) || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Date</p>
                    <p className="font-semibold text-gray-700">{f.flight_date || '—'}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-0.5">Terminal / Gate</p>
                    <p className="font-semibold text-gray-700">{f.departure?.terminal || '—'} / {f.departure?.gate || '—'}</p>
                  </div>
                </div>
              </div>
            ))}

            {/* Airlines */}
            {tab === 'airlines' && results.data?.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md shadow-black/5 p-6 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-building text-orange-500 text-lg" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm w-full">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Airline</p>
                      <p className="font-semibold text-gray-700">{a.airline_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">IATA / ICAO</p>
                      <p className="font-semibold text-gray-700">{a.iata_code || '—'} / {a.icao_code || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Country</p>
                      <p className="font-semibold text-gray-700">{a.country_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Status</p>
                      <StatusBadge status={a.fleet_average_age ? 'active' : 'unknown'} />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Airports */}
            {tab === 'airports' && results.data?.map((a, i) => (
              <div key={i} className="bg-white rounded-2xl shadow-md shadow-black/5 p-6 border border-gray-100 hover:border-orange-200 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                    <i className="fa fa-map-marker text-orange-500 text-lg" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm w-full">
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Airport</p>
                      <p className="font-semibold text-gray-700">{a.airport_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">IATA / ICAO</p>
                      <p className="font-semibold text-gray-700">{a.iata_code || '—'} / {a.icao_code || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">City / Country</p>
                      <p className="font-semibold text-gray-700">{a.city_iata_code || '—'} / {a.country_name || '—'}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-0.5">Timezone</p>
                      <p className="font-semibold text-gray-700">{a.timezone || '—'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {results.data?.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <i className="fa fa-search text-4xl mb-3 block" />
                <p>No results found. Try a different search.</p>
              </div>
            )}
          </div>
        )}
      </section>

      <DetailModal flight={selectedFlight} onClose={() => setSelectedFlight(null)} />
    </>
  );
}
