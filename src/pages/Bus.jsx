import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { geocodeCity, getRouteInfo, getBusStations } from '../services/busApi';
import CallToAction from '../components/CallToAction';
import {
  BusAlertsTicker,
  TerminalFinder,
  OperatorProfiles,
  CompareTable,
  PriceTrendChart,
  JourneyPlanner,
  TravelTips,
  PopularDestinations,
  NearbyStopsMap,
} from '../components/BusExtras';

// ─── Static reference data ───────────────────────────────────────────────────

const OPERATORS = [
  { name: 'FlixBus',          color: '#00b849', abbr: 'FX' },
  { name: 'National Express', color: '#e84118', abbr: 'NX' },
  { name: 'Megabus',          color: '#0057b8', abbr: 'MB' },
  { name: 'BlaBlaBus',        color: '#00aaff', abbr: 'BB' },
  { name: 'Eurolines',        color: '#f39c12', abbr: 'EL' },
  { name: 'Greyhound',        color: '#2c3e50', abbr: 'GH' },
];

const AMENITY_ICONS = {
  WiFi: 'fa-wifi', AC: 'fa-snowflake-o', Charging: 'fa-bolt',
  Toilet: 'fa-tint', Snacks: 'fa-coffee', USB: 'fa-usb',
};
const ALL_AMENITIES = Object.keys(AMENITY_ICONS);

const BUS_CLASSES = ['Economy', 'Standard', 'Premium'];

const POPULAR_ROUTES = [
  { from: 'London',   to: 'Manchester', img: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&h=400&fit=crop' },
  { from: 'Paris',    to: 'Lyon',       img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&h=400&fit=crop' },
  { from: 'New York', to: 'Boston',     img: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?w=600&h=400&fit=crop' },
  { from: 'Berlin',   to: 'Hamburg',    img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047?w=600&h=400&fit=crop' },
  { from: 'Madrid',   to: 'Barcelona',  img: 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=600&h=400&fit=crop' },
  { from: 'Rome',     to: 'Naples',     img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&h=400&fit=crop' },
];

const STATS = [
  { icon: 'fa-bus',        value: '1,200+', label: 'Daily Routes' },
  { icon: 'fa-map-marker', value: '300+',   label: 'Cities Covered' },
  { icon: 'fa-users',      value: '2M+',    label: 'Happy Passengers' },
  { icon: 'fa-star',       value: '4.7',    label: 'Avg. Rating' },
];

const TESTIMONIALS = [
  { name: 'Emma T.',   avatar: 'https://i.pravatar.cc/80?img=47', rating: 5, route: 'London → Manchester', text: 'Incredibly smooth booking. The bus was on time, spotless, and the WiFi actually worked the whole journey!' },
  { name: 'Carlos M.', avatar: 'https://i.pravatar.cc/80?img=12', rating: 5, route: 'Madrid → Barcelona',  text: 'Best price I found anywhere. Comfortable seats, charging ports at every seat. Will always book through Pacific.' },
  { name: 'Yuki S.',   avatar: 'https://i.pravatar.cc/80?img=32', rating: 4, route: 'Paris → Lyon',        text: 'Great value for money. The 24/7 support team helped me reschedule last minute without any hassle.' },
];

// ─── Dynamic data builder from real route + station ─────────────────────────
// Uses real distanceKm & durationMin from API; index only for schedule spread

function buildBusData({ distanceKm, durationMin, station, index }) {
  const p = station.properties;

  // Real fare: base $0.08/km, class multiplier, min $8
  const classMultiplier = [1, 1.35, 1.75][index % 3];
  const baseFare = Math.max(650, distanceKm * 6.5 * classMultiplier);
  const fare = Math.round(baseFare);
  const oldFare = Math.round(baseFare * 1.22);
  const discount = index % 4 === 0;

  // Real duration with operator variance (±10%)
  const variance = 1 + ((index % 5) - 2) * 0.05;
  const totalMin = Math.round(durationMin * variance);
  const durH = Math.floor(totalMin / 60);
  const durM = totalMin % 60;

  // Spread departures across the day (06:00 – 22:00)
  const depMinutes = 360 + index * Math.floor(960 / Math.max(1, 11));
  const hDep = String(Math.floor(depMinutes / 60) % 24).padStart(2, '0');
  const mDep = String(depMinutes % 60).padStart(2, '0');
  const arrMinutes = depMinutes + totalMin;
  const hArr = String(Math.floor(arrMinutes / 60) % 24).padStart(2, '0');
  const mArr = String(arrMinutes % 60).padStart(2, '0');

  // Real station name & address from Geoapify
  const stationName = p.name || p.address_line1 || 'Bus Terminal';
  const stationCity = p.city || p.county || p.state || '';
  const stationAddr = p.address_line2 || p.formatted?.split(',').slice(0, 2).join(',') || '';

  const op = OPERATORS[index % OPERATORS.length];
  const busClass = BUS_CLASSES[index % 3];
  const seats = Math.max(3, 28 - (index * 3) % 25);
  const rating = parseFloat((3.8 + (index % 12) * 0.1).toFixed(1));
  const reviews = 40 + (index * 31) % 460;
  const amenities = ALL_AMENITIES.filter((_, i) => (index + i) % 2 === 0);

  return {
    op, fare, oldFare, discount,
    durH, durM, hDep, mDep, hArr, mArr,
    stationName, stationCity, stationAddr,
    busClass, seats, rating, reviews, amenities,
    distanceKm,
  };
}

// ─── Small UI helpers ────────────────────────────────────────────────────────

function ClassBadge({ cls }) {
  const map = { Premium: 'bg-amber-50 text-amber-600 border-amber-200', Standard: 'bg-blue-50 text-blue-600 border-blue-200', Economy: 'bg-gray-50 text-gray-500 border-gray-200' };
  return <span className={`text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${map[cls] || map.Economy}`}>{cls}</span>;
}

function SeatsBadge({ seats }) {
  if (seats <= 5)  return <span className="text-[0.65rem] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{seats} left!</span>;
  if (seats <= 12) return <span className="text-[0.65rem] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{seats} seats</span>;
  return <span className="text-[0.65rem] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{seats} seats</span>;
}

function StarRating({ value }) {
  return (
    <span className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => (
        <i key={s} className={`fa fa-star text-[0.55rem] ${s <= Math.round(value) ? 'text-amber-400' : 'text-gray-200'}`} />
      ))}
    </span>
  );
}

function SkeletonRow() {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 animate-pulse flex gap-5">
      <div className="w-14 h-14 bg-gray-200 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-3 bg-gray-100 rounded w-1/2" />
        <div className="flex gap-2"><div className="h-6 w-16 bg-orange-50 rounded-full" /><div className="h-6 w-16 bg-orange-50 rounded-full" /></div>
      </div>
      <div className="w-28 space-y-2 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-full" />
        <div className="h-9 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
}

// ─── BusResultRow ────────────────────────────────────────────────────────────

function BusResultRow({ busData: d, origin, destination, onBook, view }) {
  if (view === 'grid') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="h-1.5 w-full" style={{ background: d.op.color }} />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ background: d.op.color }}>{d.op.abbr}</div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{d.op.name}</p>
                <p className="text-[0.65rem] text-gray-400 truncate max-w-[120px]">{d.stationName}</p>
              </div>
            </div>
            <ClassBadge cls={d.busClass} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{d.hDep}:{d.mDep}</p>
              <p className="text-[0.6rem] text-gray-400 font-medium truncate max-w-[56px]">{origin}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 px-1">
              <div className="w-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-orange-200" />
                <i className="fa fa-bus text-orange-400 text-[0.6rem] flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-orange-200" />
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
              </div>
              <p className="text-[0.6rem] text-gray-400">{d.durH}h {d.durM}m · {d.distanceKm} km</p>
            </div>
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{d.hArr}:{d.mArr}</p>
              <p className="text-[0.6rem] text-gray-400 font-medium truncate max-w-[56px]">{destination}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 mb-3">
            {d.amenities.slice(0, 4).map(a => (
              <span key={a} className="flex items-center gap-1 text-[0.6rem] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
                <i className={`fa ${AMENITY_ICONS[a]} text-orange-400`} />{a}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <StarRating value={d.rating} />
            <span className="text-[0.65rem] text-gray-500">{d.rating} ({d.reviews})</span>
            <span className="ml-auto"><SeatsBadge seats={d.seats} /></span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto">
            <div>
              {d.discount && <p className="text-[0.6rem] text-gray-400 line-through">₹{d.oldFare}</p>}
              <p className="text-xl font-black text-gray-900">₹{d.fare}<span className="text-xs font-normal text-gray-400 ml-1">/person</span></p>
            </div>
            <button onClick={() => onBook({ ...d, origin, destination })}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95">
              <i className="fa fa-ticket" /> Book
            </button>
          </div>
        </div>
      </div>
    );
  }

  // List view
  return (
    <div className="bg-white border border-gray-100 rounded-2xl p-5 hover:shadow-lg hover:border-orange-200 transition-all duration-200 flex flex-col sm:flex-row gap-5">
      <div className="flex-shrink-0 flex sm:flex-col items-center gap-3 sm:gap-2 sm:w-20">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-sm" style={{ background: d.op.color }}>{d.op.abbr}</div>
        <div className="text-center">
          <p className="text-[0.65rem] font-bold text-gray-700 leading-tight">{d.op.name}</p>
          <div className="mt-1"><ClassBadge cls={d.busClass} /></div>
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-3">
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900 leading-none">{d.hDep}:{d.mDep}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[80px]">{origin}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1 px-2">
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full border-2 border-orange-400 flex-shrink-0" />
              <div className="flex-1 h-px bg-gradient-to-r from-orange-300 to-gray-200" />
              <div className="bg-orange-50 border border-orange-200 rounded-full px-2 py-0.5 flex items-center gap-1 flex-shrink-0">
                <i className="fa fa-bus text-orange-500 text-[0.6rem]" />
                <span className="text-[0.6rem] font-bold text-orange-600">{d.durH}h {d.durM}m</span>
              </div>
              <div className="flex-1 h-px bg-gradient-to-r from-gray-200 to-orange-300" />
              <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
            </div>
            <p className="text-[0.6rem] text-gray-400">Direct · {d.distanceKm} km</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900 leading-none">{d.hArr}:{d.mArr}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[80px]">{destination}</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {d.amenities.map(a => (
            <span key={a} className="flex items-center gap-1 text-[0.6rem] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              <i className={`fa ${AMENITY_ICONS[a]} text-orange-400`} />{a}
            </span>
          ))}
          <span className="ml-1 flex items-center gap-1">
            <StarRating value={d.rating} />
            <span className="text-[0.65rem] text-gray-400">{d.rating} ({d.reviews} reviews)</span>
          </span>
        </div>

        <p className="text-[0.65rem] text-gray-400 mt-2">
          <i className="fa fa-map-marker text-orange-400 mr-1" />
          {d.stationName}{d.stationCity ? `, ${d.stationCity}` : ''}
          {d.stationAddr ? ` — ${d.stationAddr}` : ''}
        </p>
      </div>

      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-3 sm:w-36 flex-shrink-0 sm:border-l sm:border-gray-100 sm:pl-5">
        <div className="text-right">
          {d.discount && (
            <div className="flex items-center gap-1 justify-end mb-0.5">
              <span className="text-[0.6rem] text-gray-400 line-through">₹{d.oldFare}</span>
              <span className="text-[0.6rem] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded">SALE</span>
            </div>
          )}
          <p className="text-2xl font-black text-gray-900">₹{d.fare}</p>
          <p className="text-[0.65rem] text-gray-400">per person</p>
          <div className="mt-1"><SeatsBadge seats={d.seats} /></div>
        </div>
        <button onClick={() => onBook({ ...d, origin, destination })}
          className="w-full flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white text-sm font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-orange-500/20 active:scale-95">
          <i className="fa fa-ticket text-xs" /> Book Now
        </button>
      </div>
    </div>
  );
}

// ─── Seat Map ────────────────────────────────────────────────────────────────

function SeatMap({ totalSeats, selected, onToggle }) {
  const rows = Math.ceil(Math.min(totalSeats + 8, 24) / 4);
  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Choose Your Seat</p>
        <div className="flex items-center gap-3 text-[0.6rem] text-gray-400">
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" />Available</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-orange-500 inline-block" />Selected</span>
          <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-300 inline-block" />Taken</span>
        </div>
      </div>
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        <div className="flex justify-center mb-3">
          <div className="bg-gray-300 text-gray-600 text-[0.6rem] font-bold px-6 py-1.5 rounded-full uppercase tracking-widest">Driver</div>
        </div>
        <div className="space-y-1.5">
          {[...Array(rows)].map((_, r) => (
            <div key={r} className="flex items-center gap-1.5 justify-center">
              {[0,1].map(col => {
                const seatNum = r * 4 + col + 1;
                const taken = seatNum % 3 === 0;
                const isSel = selected === seatNum;
                return (
                  <button key={col} disabled={taken} onClick={() => onToggle(isSel ? null : seatNum)}
                    className={`w-8 h-8 rounded-lg text-[0.6rem] font-bold transition-all border ${taken ? 'bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed' : isSel ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500'}`}>
                    {seatNum}
                  </button>
                );
              })}
              <div className="w-5" />
              {[2,3].map(col => {
                const seatNum = r * 4 + col + 1;
                const taken = seatNum % 5 === 0;
                const isSel = selected === seatNum;
                return (
                  <button key={col} disabled={taken} onClick={() => onToggle(isSel ? null : seatNum)}
                    className={`w-8 h-8 rounded-lg text-[0.6rem] font-bold transition-all border ${taken ? 'bg-gray-300 border-gray-300 text-gray-400 cursor-not-allowed' : isSel ? 'bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-500/30' : 'bg-white border-gray-200 text-gray-500 hover:border-orange-400 hover:text-orange-500'}`}>
                    {seatNum}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Booking Modal ───────────────────────────────────────────────────────────

function loadRazorpay() {
  return new Promise(resolve => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const s = document.createElement('script');
    s.id = 'razorpay-script';
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function BookingModal({ data, onClose }) {
  const [step, setStep]             = useState(1);
  const [passengers, setPassengers] = useState(1);
  const [seat, setSeat]             = useState(null);
  const [name, setName]             = useState('');
  const [email, setEmail]           = useState('');
  const [phone, setPhone]           = useState('');
  const [booked, setBooked]         = useState(false);
  const [paying, setPaying]         = useState(false);
  const [payError, setPayError]     = useState('');

  if (!data) return null;

  const total = Math.round(data.fare * passengers + 50);
  const STEPS = ['Trip Details', 'Choose Seat', 'Passenger Info'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

        {booked ? (
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5 border-4 border-green-100">
              <i className="fa fa-check text-green-500 text-3xl" />
            </div>
            <h3 className="text-2xl font-black text-gray-900 mb-1">Payment Successful!</h3>
            <p className="text-gray-400 text-sm mb-5">Confirmation sent to {email}</p>
            <div className="bg-gray-50 rounded-2xl p-5 text-left space-y-2.5 mb-6 border border-gray-100 text-sm">
              {[
                ['Route',      `${data.origin} → ${data.destination}`],
                ['Operator',   data.op.name],
                ['Station',    data.stationName],
                ['Departure',  `${data.hDep}:${data.mDep}`],
                ['Arrival',    `${data.hArr}:${data.mArr}`],
                ['Duration',   `${data.durH}h ${data.durM}m · ${data.distanceKm} km`],
                ['Class',      data.busClass],
                ...(seat ? [['Seat', `#${seat}`]] : []),
                ['Passengers', String(passengers)],
              ].map(([label, val]) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-800">{val}</span>
                </div>
              ))}
              <div className="flex justify-between font-black text-base border-t border-gray-200 pt-2.5 mt-1">
                <span className="text-gray-900">Total Paid</span>
                <span className="text-orange-500">₹{total}</span>
              </div>
            </div>
            <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-2xl transition-all">Done</button>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 px-6 py-5 text-white rounded-t-3xl">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-black text-xl">Book Your Seat</h3>
                  <p className="text-orange-100 text-xs mt-0.5">{data.origin} → {data.destination} · {data.op.name}</p>
                </div>
                <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-all">
                  <i className="fa fa-times" />
                </button>
              </div>
              <div className="flex items-center gap-0">
                {STEPS.map((label, i) => (
                  <div key={i} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center gap-1">
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black border-2 transition-all ${step > i+1 ? 'bg-white border-white text-orange-500' : step === i+1 ? 'bg-white border-white text-orange-500' : 'bg-transparent border-white/40 text-white/60'}`}>
                        {step > i+1 ? <i className="fa fa-check text-[0.6rem]" /> : i+1}
                      </div>
                      <span className={`text-[0.55rem] font-bold uppercase tracking-wider whitespace-nowrap ${step === i+1 ? 'text-white' : 'text-white/50'}`}>{label}</span>
                    </div>
                    {i < STEPS.length-1 && <div className={`flex-1 h-px mx-2 mb-4 transition-all ${step > i+1 ? 'bg-white' : 'bg-white/30'}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-5">
                  <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-black" style={{ background: data.op.color }}>{data.op.abbr}</div>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{data.op.name}</p>
                          <p className="text-[0.65rem] text-gray-500">{data.stationName}{data.stationCity ? `, ${data.stationCity}` : ''}</p>
                        </div>
                      </div>
                      <ClassBadge cls={data.busClass} />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-center">
                        <p className="text-xl font-black text-gray-900">{data.hDep}:{data.mDep}</p>
                        <p className="text-[0.6rem] text-gray-500">{data.origin}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-0.5">
                        <div className="w-full flex items-center gap-1">
                          <div className="flex-1 border-t-2 border-dashed border-orange-300" />
                          <i className="fa fa-bus text-orange-400 text-xs" />
                          <div className="flex-1 border-t-2 border-dashed border-orange-300" />
                        </div>
                        <p className="text-[0.6rem] text-gray-400">{data.durH}h {data.durM}m · {data.distanceKm} km</p>
                      </div>
                      <div className="text-center">
                        <p className="text-xl font-black text-gray-900">{data.hArr}:{data.mArr}</p>
                        <p className="text-[0.6rem] text-gray-500">{data.destination}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Amenities</p>
                    <div className="flex flex-wrap gap-2">
                      {data.amenities.map(a => (
                        <span key={a} className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-100 px-3 py-1.5 rounded-full">
                          <i className={`fa ${AMENITY_ICONS[a]} text-orange-400`} />{a}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Passengers</p>
                    <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-3 border border-gray-100">
                      <button type="button" onClick={() => setPassengers(p => Math.max(1, p-1))} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all shadow-sm"><i className="fa fa-minus text-xs" /></button>
                      <div className="flex-1 text-center">
                        <span className="text-3xl font-black text-gray-900">{passengers}</span>
                        <p className="text-[0.6rem] text-gray-400">passenger{passengers > 1 ? 's' : ''}</p>
                      </div>
                      <button type="button" onClick={() => setPassengers(p => Math.min(data.seats, p+1))} className="w-9 h-9 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all shadow-sm"><i className="fa fa-plus text-xs" /></button>
                    </div>
                    <p className="text-[0.65rem] text-gray-400 mt-1.5 text-center">{data.seats} seats available</p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-400">Estimated total</p>
                      <p className="text-2xl font-black text-gray-900">₹{total}</p>
                    </div>
                    <button onClick={() => setStep(2)} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-2xl transition-all shadow-md shadow-orange-500/20">
                      Next <i className="fa fa-arrow-right text-xs" />
                    </button>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-5">
                  <SeatMap totalSeats={data.seats} selected={seat} onToggle={setSeat} />
                  {seat && (
                    <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5">
                      <i className="fa fa-check-circle text-orange-500" />
                      <span className="text-sm font-semibold text-orange-700">Seat #{seat} selected</span>
                    </div>
                  )}
                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all">Back</button>
                    <button onClick={() => setStep(3)} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-orange-500/20">
                      {seat ? 'Continue' : 'Skip'} <i className="fa fa-arrow-right text-xs ml-1" />
                    </button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <form onSubmit={async e => {
                    e.preventDefault();
                    setPaying(true);
                    setPayError('');
                    try {
                      const loaded = await loadRazorpay();
                      if (!loaded) throw new Error('Razorpay SDK failed to load. Check your connection.');
                      const options = {
                        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                        amount: total * 100,
                        currency: 'INR',
                        name: 'Pacific Travel',
                        description: `Bus: ${data.origin} → ${data.destination}`,
                        image: import.meta.env.VITE_LOGO_URL || '',
                        prefill: { name, email, contact: phone },
                        theme: { color: '#f97316' },
                        handler: () => { setBooked(true); },
                        modal: { ondismiss: () => setPaying(false) },
                      };
                      const rzp = new window.Razorpay(options);
                      rzp.open();
                    } catch (err) {
                      setPayError(err.message || 'Payment failed. Please try again.');
                      setPaying(false);
                    }
                  }} className="space-y-4">
                  {[
                    { label: 'Full Name',     icon: 'fa-user',     value: name,  set: setName,  type: 'text',  placeholder: 'Your full name' },
                    { label: 'Email Address', icon: 'fa-envelope', value: email, set: setEmail, type: 'email', placeholder: 'your@email.com' },
                    { label: 'Phone Number',  icon: 'fa-phone',    value: phone, set: setPhone, type: 'tel',   placeholder: '+1 234 567 8900' },
                  ].map(({ label, icon, value, set, type, placeholder }) => (
                    <div key={label}>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
                      <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-orange-400 focus-within:ring-2 focus-within:ring-orange-500/10 transition-all">
                        <i className={`fa ${icon} text-gray-300 text-sm`} />
                        <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} required className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300" />
                      </div>
                    </div>
                  ))}
                  <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500"><span>Fare × {passengers}</span><span>₹{data.fare * passengers}</span></div>
                    {data.discount && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{data.oldFare - data.fare}</span></div>}
                    <div className="flex justify-between text-gray-500"><span>Service fee</span><span>₹50</span></div>
                    <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-200 pt-2 mt-1">
                      <span>Total</span><span className="text-orange-500">₹{total}</span>
                    </div>
                  </div>
                  {payError && (
                    <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                      <i className="fa fa-exclamation-circle flex-shrink-0" />{payError}
                    </div>
                  )}
                  <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-sm text-orange-800 flex items-center gap-2">
                    <i className="fa fa-lock text-orange-500" />
                    Secured by Razorpay · UPI, Cards, Net Banking & Wallets accepted
                  </div>
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all">Back</button>
                    <button type="submit" disabled={paying}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-orange-500/20 flex items-center justify-center gap-2">
                      {paying ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-lock text-xs" />}
                      {paying ? 'Opening Razorpay…' : `Pay ₹${total}`}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function Bus() {
  const [origin, setOrigin]           = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate]               = useState('');
  const [pax, setPax]                 = useState(1);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [results, setResults]         = useState(null); // { from, to, buses: [{busData, station}] }
  const [booking, setBooking]         = useState(null);
  const [view, setView]               = useState('list');
  const [sortBy, setSortBy]           = useState('price');
  const [filterAmenity, setFilterAmenity] = useState('');
  const [filterClass, setFilterClass]     = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState(200);
  const resultsRef = useRef(null);

  async function handleSearch(e) {
    e?.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);
    try {
      // 1. Geocode both cities
      const [from, to] = await Promise.all([geocodeCity(origin), geocodeCity(destination)]);

      // 2. Get real route distance & duration
      const route = await getRouteInfo(from.lat, from.lon, to.lat, to.lon);
      if (!route.distanceKm) throw new Error('Could not calculate route between these cities.');

      // 3. Get real bus stations near origin
      const stations = await getBusStations(from.lat, from.lon);
      if (!stations.length) throw new Error('No bus stations found near the departure city.');

      // 4. Build one bus listing per station using real route data
      const buses = stations.map((station, index) => ({
        busData: buildBusData({ distanceKm: route.distanceKm, durationMin: route.durationMin, station, index }),
        station,
      }));

      // Set max price filter ceiling based on real data
      const maxFare = Math.max(...buses.map(b => b.busData.fare));
      setFilterMaxPrice(Math.ceil(maxFare / 100) * 100);

      setResults({ from, to, route, buses });
      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const allBuses = results?.buses || [];

  const filtered = allBuses.filter(({ busData: d }) => {
    if (filterAmenity && !d.amenities.includes(filterAmenity)) return false;
    if (filterClass && d.busClass !== filterClass) return false;
    if (d.fare > filterMaxPrice) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const da = a.busData, db = b.busData;
    if (sortBy === 'price')    return da.fare - db.fare;
    if (sortBy === 'duration') return (da.durH * 60 + da.durM) - (db.durH * 60 + db.durM);
    if (sortBy === 'rating')   return db.rating - da.rating;
    if (sortBy === 'departs')  return da.hDep.localeCompare(db.hDep);
    return 0;
  });

  const activeFilters = [filterAmenity, filterClass].filter(Boolean).length;
  const maxFareCeiling = results ? Math.ceil(Math.max(...allBuses.map(b => b.busData.fare)) / 100) * 100 : 10000;

  return (
    <>
      {/* Hero */}
      <BusAlertsTicker />
      <section className="relative flex items-center justify-center bg-cover bg-center overflow-hidden" style={{ backgroundImage: "url('/images/bg_4.jpg')", minHeight: '62vh' }}>
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-orange-950/40" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <i className="fa fa-bus" /> Intercity Bus Booking
          </div>
          <p className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-orange-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-orange-500" />
            <span className="text-white">Bus</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Travel Smarter <span className="text-orange-400">by Bus</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
            Real routes, real distances, real fares — book your seat in seconds.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-3 text-white">
                <i className={`fa ${s.icon} text-orange-400 text-lg mb-1`} />
                <span className="text-xl font-extrabold">{s.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Search form */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 items-end">
            {[
              { label: 'From',  icon: 'fa-map-marker', value: origin,      set: setOrigin,      type: 'text', placeholder: 'Departure city' },
              { label: 'To',    icon: 'fa-map-marker', value: destination, set: setDestination, type: 'text', placeholder: 'Arrival city' },
              { label: 'Date',  icon: 'fa-calendar',   value: date,        set: setDate,        type: 'date', placeholder: '' },
            ].map(({ label, icon, value, set, type, placeholder }) => (
              <div key={label} className="flex flex-col gap-1.5 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-3 group-focus-within:border-orange-400 group-focus-within:ring-2 group-focus-within:ring-orange-500/10 transition-all bg-gray-50/50">
                  <i className={`fa ${icon} text-orange-400 text-sm flex-shrink-0`} />
                  <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder}
                    className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent min-w-0" />
                </div>
              </div>
            ))}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passengers</label>
              <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50/50">
                <button type="button" onClick={() => setPax(p => Math.max(1, p-1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all flex-shrink-0"><i className="fa fa-minus text-[0.6rem]" /></button>
                <span className="flex-1 text-center text-sm font-bold text-gray-900">{pax}</span>
                <button type="button" onClick={() => setPax(p => Math.min(9, p+1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-orange-400 hover:text-orange-500 transition-all flex-shrink-0"><i className="fa fa-plus text-[0.6rem]" /></button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-orange-500/25 active:scale-95 h-[50px]">
              <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`} />
              {loading ? 'Searching…' : 'Search Buses'}
            </button>
          </div>
        </form>
        {error && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-600 rounded-2xl px-5 py-4 text-sm mt-4">
            <i className="fa fa-exclamation-circle text-lg flex-shrink-0" />{error}
          </div>
        )}
      </section>

      {/* Loading skeletons */}
      {loading && (
        <section className="max-w-6xl mx-auto px-6 pb-16">
          <div className="space-y-4">{[...Array(5)].map((_, i) => <SkeletonRow key={i} />)}</div>
        </section>
      )}

      {/* Results */}
      {results && !loading && (
        <section className="max-w-6xl mx-auto px-6 pb-16" ref={resultsRef}>

          {/* Route summary banner */}
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa fa-bus text-orange-500" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-gray-900 text-lg truncate">{results.from.name} → {results.to.name}</p>
                <p className="text-xs text-gray-400">{results.from.country} → {results.to.country}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap text-center">
              <div><p className="text-lg font-black text-orange-500">{results.route.distanceKm} km</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Distance</p></div>
              <div><p className="text-lg font-black text-gray-900">{Math.floor(results.route.durationMin/60)}h {results.route.durationMin%60}m</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Drive Time</p></div>
              <div><p className="text-lg font-black text-gray-900">{sorted.length}</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Services</p></div>
              {date && <div><p className="text-lg font-black text-gray-900">{date}</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Date</p></div>}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filter sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-sliders text-orange-500" />
                    <span className="font-bold text-gray-900 text-sm">Filters</span>
                    {activeFilters > 0 && <span className="w-5 h-5 bg-orange-500 text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">{activeFilters}</span>}
                  </div>
                  {activeFilters > 0 && (
                    <button onClick={() => { setFilterAmenity(''); setFilterClass(''); setFilterMaxPrice(maxFareCeiling); }}
                      className="text-[0.65rem] text-orange-500 font-semibold hover:text-orange-600">Reset</button>
                  )}
                </div>
                <div className="p-5 space-y-6">
                  {/* Max price */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Max Price</p>
                      <span className="text-sm font-black text-orange-500">₹{filterMaxPrice}</span>
                    </div>
                    <input type="range" min={0} max={maxFareCeiling} step={50} value={filterMaxPrice}
                      onChange={e => setFilterMaxPrice(Number(e.target.value))}
                      className="w-full accent-orange-500 cursor-pointer" />
                    <div className="flex justify-between text-[0.6rem] text-gray-400 mt-1"><span>₹0</span><span>₹{maxFareCeiling}</span></div>
                  </div>
                  {/* Bus class */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Bus Class</p>
                    <div className="space-y-2">
                      {['', ...BUS_CLASSES].map(cls => (
                        <button key={cls} onClick={() => setFilterClass(cls)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all border ${filterClass === cls ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-100 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-gray-50'}`}>
                          <span className="font-medium">{cls || 'All Classes'}</span>
                          {filterClass === cls && <i className="fa fa-check text-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Amenities */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Amenities</p>
                    <div className="space-y-2">
                      {ALL_AMENITIES.map(a => (
                        <button key={a} onClick={() => setFilterAmenity(filterAmenity === a ? '' : a)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all border ${filterAmenity === a ? 'bg-orange-500 border-orange-500 text-white' : 'border-gray-100 text-gray-600 hover:border-orange-300 hover:text-orange-500 bg-gray-50'}`}>
                          <i className={`fa ${AMENITY_ICONS[a]} text-xs ${filterAmenity === a ? 'text-white' : 'text-orange-400'}`} />
                          <span className="font-medium">{a}</span>
                          {filterAmenity === a && <i className="fa fa-check text-xs ml-auto" />}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </aside>

            {/* Results list */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <p className="text-sm text-gray-500">{sorted.length} service{sorted.length !== 1 ? 's' : ''} found</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 outline-none focus:border-orange-400 bg-white cursor-pointer">
                    <option value="price">Cheapest First</option>
                    <option value="duration">Fastest First</option>
                    <option value="rating">Best Rated</option>
                    <option value="departs">Earliest Departure</option>
                  </select>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    {[['list','fa-list'],['grid','fa-th-large']].map(([v, icon]) => (
                      <button key={v} onClick={() => setView(v)}
                        className={`px-3 py-2 transition-all ${view === v ? 'bg-orange-500 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}>
                        <i className={`fa ${icon} text-xs`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                  <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center mb-5">
                    <i className="fa fa-bus text-orange-300 text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No buses match your filters</h3>
                  <button onClick={() => { setFilterAmenity(''); setFilterClass(''); setFilterMaxPrice(maxFareCeiling); }}
                    className="mt-3 text-sm text-orange-500 font-semibold hover:underline">Clear all filters</button>
                </div>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
                  {sorted.map(({ busData, station }, i) => (
                    <BusResultRow key={i} busData={busData} origin={origin} destination={destination} onBook={setBooking} view={view} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular routes (shown before search) */}
      {!results && !loading && (
        <>
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Quick Pick</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Popular Routes</h2>
              </div>
              <span className="text-xs text-gray-400 hidden sm:block">Click to auto-fill →</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {POPULAR_ROUTES.map((r, i) => (
                <button key={i} onClick={() => { setOrigin(r.from); setDestination(r.to); }}
                  className="group relative h-48 rounded-3xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 text-left">
                  <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500" style={{ backgroundImage: `url('${r.img}')` }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 p-5 flex flex-col justify-end">
                    <p className="text-white font-extrabold text-lg leading-tight">{r.from} → {r.to}</p>
                    <p className="text-gray-300 text-xs mt-1 flex items-center gap-1">
                      <i className="fa fa-bus text-orange-400" /> Click to search this route
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          <section className="py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <span className="text-orange-500 text-xs font-bold uppercase tracking-widest">Why Book With Us</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">The Pacific Bus Advantage</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: 'fa-tag',        color: 'bg-green-50 text-green-500',   title: 'Best Price Guarantee', desc: 'We compare all operators so you always get the lowest fare.' },
                  { icon: 'fa-shield',     color: 'bg-blue-50 text-blue-500',     title: 'Verified Operators',   desc: 'Every bus company is licensed, insured and safety-checked.' },
                  { icon: 'fa-ban',        color: 'bg-orange-50 text-orange-500', title: 'Free Cancellation',    desc: 'Cancel up to 2 hours before departure with a full refund.' },
                  { icon: 'fa-headphones', color: 'bg-purple-50 text-purple-500', title: '24/7 Support',         desc: 'Our team is available around the clock to help with any issue.' },
                ].map((f, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl ${f.color}`}><i className={`fa ${f.icon}`} /></div>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm mb-1">{f.title}</h4>
                      <p className="text-xs text-gray-400 leading-relaxed">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="py-14 bg-gray-950">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <span className="text-orange-400 text-xs font-bold uppercase tracking-widest">Passenger Reviews</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">What Travellers Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((r, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => <i key={j} className={`fa fa-star text-xs ${j < r.rating ? 'text-yellow-400' : 'text-white/20'}`} />)}
                    </div>
                    <p className="text-[0.65rem] text-orange-400 font-semibold mb-3">{r.route}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border-2 border-orange-500/40" />
                      <div>
                        <div className="text-white font-semibold text-sm">{r.name}</div>
                        <div className="text-gray-500 text-xs">Verified Passenger</div>
                      </div>
                      <div className="ml-auto"><i className="fa fa-quote-right text-orange-500/30 text-3xl" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* ── Bus Extras (always visible) ── */}
      <NearbyStopsMap results={results?.stations ? { stations: results.stations, from: results.from } : null} />
      <JourneyPlanner />
      <PriceTrendChart />
      <CompareTable />
      <OperatorProfiles />
      <TerminalFinder />
      <PopularDestinations onSelect={city => { setDestination(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <TravelTips />
      {/* ── Bus Extra Sections ── */}
      {results && <NearbyStopsMap results={{ stations: results.stations, from: results.from }} />}
      <JourneyPlanner />
      <PriceTrendChart />
      <CompareTable />
      <OperatorProfiles />
      <TerminalFinder />
      <PopularDestinations onSelect={city => { setDestination(city); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
      <TravelTips />

      <CallToAction />
      <BookingModal data={booking} onClose={() => setBooking(null)} />
    </>
  );
}
