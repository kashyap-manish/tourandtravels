import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import CallToAction from '../components/CallToAction';
import {
  searchStations,
  resolveStation,
  getTrainsBetweenStations,
  getLiveTrainStatus,
  getPnrStatus,
} from '../services/railRadarApi';

// ─── Static reference data ────────────────────────────────────────────────────

const TRAIN_OPERATORS = [
  { name: 'Indian Railways', color: '#1a56db', abbr: 'IR' },
  { name: 'Rajdhani Exp.',   color: '#e74c3c', abbr: 'RJ' },
  { name: 'Shatabdi Exp.',   color: '#27ae60', abbr: 'SB' },
  { name: 'Vande Bharat',    color: '#8e44ad', abbr: 'VB' },
  { name: 'Duronto Exp.',    color: '#f39c12', abbr: 'DU' },
  { name: 'Garib Rath',      color: '#16a085', abbr: 'GR' },
];

const TRAIN_CLASSES = ['Sleeper', '3AC', '2AC', '1AC', 'Chair Car'];

const CLASS_CONFIG = {
  Sleeper:    { icon: 'fa-bed',         color: 'bg-gray-50 text-gray-500 border-gray-200' },
  '3AC':      { icon: 'fa-snowflake-o', color: 'bg-blue-50 text-blue-600 border-blue-200' },
  '2AC':      { icon: 'fa-snowflake-o', color: 'bg-indigo-50 text-indigo-600 border-indigo-200' },
  '1AC':      { icon: 'fa-star',        color: 'bg-amber-50 text-amber-600 border-amber-200' },
  'Chair Car':{ icon: 'fa-chair',       color: 'bg-green-50 text-green-600 border-green-200' },
};

const AMENITY_ICONS = {
  WiFi: 'fa-wifi', Pantry: 'fa-cutlery', Charging: 'fa-bolt',
  Bedroll: 'fa-bed', AC: 'fa-snowflake-o', Wheelchair: 'fa-wheelchair',
};
const ALL_AMENITIES = Object.keys(AMENITY_ICONS);

const POPULAR_ROUTES = [
  { from: 'New Delhi',  to: 'Mumbai',    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?w=600&h=400&fit=crop', train: 'Rajdhani Express' },
  { from: 'Mumbai',     to: 'Goa',       img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&h=400&fit=crop', train: 'Mandovi Express' },
  { from: 'Bangalore',  to: 'Chennai',   img: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=600&h=400&fit=crop', train: 'Shatabdi Express' },
  { from: 'Hyderabad',  to: 'Jaipur',    img: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=600&h=400&fit=crop', train: 'Duronto Express' },
  { from: 'Kolkata',    to: 'New Delhi', img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&h=400&fit=crop', train: 'Rajdhani Express' },
  { from: 'Chennai',    to: 'Hyderabad', img: 'https://images.unsplash.com/photo-1588416936097-41850ab3d86d?w=600&h=400&fit=crop', train: 'Vande Bharat Exp.' },
];

const STATS = [
  { icon: 'fa-train',      value: '13,000+', label: 'Daily Trains' },
  { icon: 'fa-map-marker', value: '7,000+',  label: 'Stations' },
  { icon: 'fa-users',      value: '23M+',    label: 'Daily Passengers' },
  { icon: 'fa-star',       value: '4.8',     label: 'Avg. Rating' },
];

const TESTIMONIALS = [
  { name: 'Anil K.',   avatar: 'https://i.pravatar.cc/80?img=11', rating: 5, route: 'Delhi → Mumbai', text: 'Rajdhani was incredibly punctual and comfortable. Meals were excellent. Booking on Pacific took under 2 minutes!' },
  { name: 'Priya M.',  avatar: 'https://i.pravatar.cc/80?img=24', rating: 5, route: 'Bangalore → Chennai', text: 'Vande Bharat is an amazing experience. Speed, comfort, and cleanliness — nothing matches it. Great pricing here.' },
  { name: 'Rajan S.',  avatar: 'https://i.pravatar.cc/80?img=33', rating: 4, route: 'Mumbai → Goa', text: 'The scenic Konkan railway through Goa is breathtaking. Booked 2AC through Pacific — seamless experience.' },
];

const TRAIN_TIPS = [
  { icon: 'fa-ticket',      color: 'bg-blue-50 text-blue-500',    title: 'Booking Tips',      tips: ['Book at least 60 days in advance for Rajdhani', 'Use Tatkal quota for last-minute bookings', 'Check PNR status 24 hrs before travel', 'E-tickets are valid — no printout needed'] },
  { icon: 'fa-suitcase',    color: 'bg-orange-50 text-orange-500', title: 'Luggage Rules',     tips: ['Sleeper: 40 kg free luggage', '3AC / 2AC: 50 kg free luggage', '1AC: 70 kg free luggage', 'Keep bags under your berth'] },
  { icon: 'fa-clock-o',     color: 'bg-green-50 text-green-500',   title: 'Station Arrival',   tips: ['Arrive 20–30 min before departure', 'Check coach position chart on platform', 'Keep Aadhaar / ID proof handy', 'Platform number shown 2 hrs before'] },
  { icon: 'fa-cutlery',     color: 'bg-yellow-50 text-yellow-600', title: 'Food & Catering',   tips: ['Pantry car available on most express trains', 'Pre-order meals via e-catering app', 'Carry dry snacks for overnight journeys', 'RO water available at most large stations'] },
  { icon: 'fa-shield',      color: 'bg-purple-50 text-purple-500', title: 'Safety',            tips: ['Lock bags to the hook under berth', 'Avoid sharing personal info with strangers', "Women's security helpline: 182", 'Emergency chain pull is for genuine use only'] },
  { icon: 'fa-leaf',        color: 'bg-teal-50 text-teal-500',     title: 'Eco Travel',        tips: ['Trains emit 75% less CO₂ than flights', 'Use refillable water bottles', 'Avoid plastic waste on board', 'Night trains save hotel costs + flights'] },
];

const COMPARE_CLASSES = [
  { cls: 'Sleeper',    fare: '₹350',  ac: false, meals: false, bedroll: false, privacy: 'Low',    legroom: 'Compact' },
  { cls: 'Chair Car', fare: '₹550',  ac: true,  meals: false, bedroll: false, privacy: 'Medium', legroom: 'Standard' },
  { cls: '3AC',       fare: '₹1,050',ac: true,  meals: false, bedroll: true,  privacy: 'Medium', legroom: 'Standard' },
  { cls: '2AC',       fare: '₹1,500',ac: true,  meals: false, bedroll: true,  privacy: 'High',   legroom: 'Spacious' },
  { cls: '1AC',       fare: '₹2,800',ac: true,  meals: true,  bedroll: true,  privacy: 'Premium',legroom: 'Premium' },
];

const CITY_COORDS = {
  'new delhi': { lat: 28.6139, lon: 77.2090, name: 'New Delhi', country: 'India' },
  'delhi':     { lat: 28.6139, lon: 77.2090, name: 'New Delhi', country: 'India' },
  'mumbai':    { lat: 19.0760, lon: 72.8777, name: 'Mumbai',    country: 'India' },
  'bangalore': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', country: 'India' },
  'bengaluru': { lat: 12.9716, lon: 77.5946, name: 'Bengaluru', country: 'India' },
  'hyderabad': { lat: 17.3850, lon: 78.4867, name: 'Hyderabad', country: 'India' },
  'chennai':   { lat: 13.0827, lon: 80.2707, name: 'Chennai',   country: 'India' },
  'kolkata':   { lat: 22.5726, lon: 88.3639, name: 'Kolkata',   country: 'India' },
  'jaipur':    { lat: 26.9124, lon: 75.7873, name: 'Jaipur',    country: 'India' },
  'goa':       { lat: 15.2993, lon: 74.1240, name: 'Goa',       country: 'India' },
  'agra':      { lat: 27.1767, lon: 78.0081, name: 'Agra',      country: 'India' },
  'varanasi':  { lat: 25.3176, lon: 82.9739, name: 'Varanasi',  country: 'India' },
  'pune':      { lat: 18.5204, lon: 73.8567, name: 'Pune',      country: 'India' },
  'lucknow':   { lat: 26.8467, lon: 80.9462, name: 'Lucknow',   country: 'India' },
  'patna':     { lat: 25.5941, lon: 85.1376, name: 'Patna',     country: 'India' },
  'bhopal':    { lat: 23.2599, lon: 77.4126, name: 'Bhopal',    country: 'India' },
};

function geocodeCity(name) {
  const key = name.trim().toLowerCase();
  const found = CITY_COORDS[key];
  if (found) return Promise.resolve(found);
  return Promise.resolve({ lat: 20 + Math.random() * 10, lon: 75 + Math.random() * 10, name, country: 'India' });
}

function haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const TRAIN_NAMES = [
  'Rajdhani Express', 'Shatabdi Express', 'Vande Bharat Exp.', 'Duronto Express',
  'Garib Rath Exp.', 'Jan Shatabdi Exp.', 'Tejas Express', 'Humsafar Express',
  'Double Decker Exp.', 'Sampark Kranti Exp.', 'Superfast Express', 'Mail Express',
];

const TRAIN_NUMBERS = [
  '12301', '12951', '20501', '12213', '12209', '14673',
  '22119', '12507', '12533', '12659', '12001', '11041',
];

function buildTrainData({ distanceKm, index }) {
  const op = TRAIN_OPERATORS[index % TRAIN_OPERATORS.length];
  const cls = TRAIN_CLASSES[index % TRAIN_CLASSES.length];
  const trainName = TRAIN_NAMES[index % TRAIN_NAMES.length];
  const trainNo = TRAIN_NUMBERS[index % TRAIN_NUMBERS.length];

  const basePerKm = { Sleeper: 0.7, '3AC': 1.8, '2AC': 2.6, '1AC': 4.5, 'Chair Car': 1.2 };
  const base = Math.max(250, distanceKm * (basePerKm[cls] || 1.2));
  const fare = Math.round(base + (index % 5) * 80);
  const oldFare = Math.round(fare * 1.18);
  const discount = index % 3 === 0;

  const speedKmh = 65 + (index % 6) * 7;
  const totalMin = Math.round((distanceKm / speedKmh) * 60);
  const durH = Math.floor(totalMin / 60);
  const durM = totalMin % 60;

  const depMin = 300 + index * Math.floor(1080 / 12);
  const hDep = String(Math.floor(depMin / 60) % 24).padStart(2, '0');
  const mDep = String(depMin % 60).padStart(2, '0');
  const arrMin = depMin + totalMin;
  const hArr = String(Math.floor(arrMin / 60) % 24).padStart(2, '0');
  const mArr = String(arrMin % 60).padStart(2, '0');

  const seats = Math.max(2, 62 - (index * 7) % 58);
  const rating = parseFloat((3.9 + (index % 10) * 0.09).toFixed(1));
  const reviews = 55 + (index * 43) % 890;
  const amenities = ALL_AMENITIES.filter((_, i) => (index + i) % 2 === 0);
  const runsDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].filter((_, i) => (index + i) % 3 !== 2);

  return {
    op, cls, trainName, trainNo, fare, oldFare, discount,
    durH, durM, hDep, mDep, hArr, mArr,
    seats, rating, reviews, amenities, runsDays, distanceKm, speedKmh,
  };
}

function loadRazorpay() {
  return new Promise(resolve => {
    if (window.Razorpay) { resolve(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

function ClassBadge({ cls }) {
  const cfg = CLASS_CONFIG[cls] || CLASS_CONFIG.Sleeper;
  return (
    <span className={`flex items-center gap-1 text-[0.6rem] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${cfg.color}`}>
      <i className={`fa ${cfg.icon} text-[0.55rem]`} />{cls}
    </span>
  );
}

function SeatsBadge({ seats }) {
  if (seats <= 5)  return <span className="text-[0.65rem] font-bold text-red-500 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">{seats} left!</span>;
  if (seats <= 15) return <span className="text-[0.65rem] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">{seats} seats</span>;
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
        <div className="flex gap-2"><div className="h-6 w-16 bg-blue-50 rounded-full" /><div className="h-6 w-16 bg-blue-50 rounded-full" /></div>
      </div>
      <div className="w-28 space-y-2 flex-shrink-0">
        <div className="h-6 bg-gray-200 rounded w-full" />
        <div className="h-9 bg-gray-200 rounded-xl w-full" />
      </div>
    </div>
  );
}

function SeatMap({ totalSeats, selected, onToggle }) {
  const taken = Array.from({ length: Math.max(0, totalSeats - 12) }, (_, i) => i + 1);
  const total = totalSeats + taken.length;
  return (
    <div>
      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Select Berth / Seat</p>
      <div className="grid grid-cols-6 gap-1.5">
        {Array.from({ length: total }, (_, i) => {
          const num = i + 1;
          const isTaken = taken.includes(num);
          const isSel = selected === num;
          return (
            <button key={num} disabled={isTaken} onClick={() => onToggle(isSel ? null : num)}
              className={`h-9 rounded-lg text-xs font-bold border transition-all ${
                isTaken ? 'bg-gray-100 border-gray-100 text-gray-300 cursor-not-allowed' :
                isSel   ? 'bg-blue-500 border-blue-500 text-white shadow-md shadow-blue-500/30' :
                          'bg-white border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-500'
              }`}>
              {num}
            </button>
          );
        })}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[0.6rem] text-gray-400">
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-white border border-gray-200 inline-block" /> Available</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500 inline-block" /> Selected</span>
        <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-100 inline-block" /> Booked</span>
      </div>
    </div>
  );
}

function TrainResultRow({ d, origin, destination, onBook, onTrackLive, view }) {
  if (view === 'grid') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
        <div className="h-1.5 w-full" style={{ background: d.op.color }} />
        <div className="p-5 flex flex-col flex-1">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ background: d.op.color }}>{d.op.abbr}</div>
              <div>
                <p className="font-bold text-gray-900 text-sm leading-tight">{d.trainName}</p>
                <p className="text-[0.65rem] text-gray-400">#{d.trainNo}</p>
              </div>
            </div>
            <ClassBadge cls={d.cls} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <div className="text-center">
              <p className="text-xl font-black text-gray-900">{d.hDep}:{d.mDep}</p>
              <p className="text-[0.6rem] text-gray-400 font-medium truncate max-w-[56px]">{origin}</p>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1 px-1">
              <div className="w-full flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-blue-200" />
                <i className="fa fa-train text-blue-400 text-[0.6rem] flex-shrink-0" />
                <div className="flex-1 border-t-2 border-dashed border-blue-200" />
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
                <i className={`fa ${AMENITY_ICONS[a]} text-blue-400`} />{a}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <StarRating value={d.rating} />
            <span className="text-[0.65rem] text-gray-500">{d.rating} ({d.reviews})</span>
            <span className="ml-auto"><SeatsBadge seats={d.seats} /></span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-gray-100 mt-auto gap-2">
            <div>
              {d.discount && <p className="text-[0.6rem] text-gray-400 line-through">₹{d.oldFare}</p>}
              <p className="text-xl font-black text-blue-500">₹{d.fare}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => onTrackLive(d)} title="Track live running status" className="border border-blue-200 text-blue-600 hover:bg-blue-50 font-bold px-3 py-2 rounded-xl text-xs transition-all flex items-center gap-1">
                <i className="fa fa-map-marker text-blue-500" /> Live
              </button>
              <button onClick={() => onBook(d)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 active:scale-95">
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
      <div className="h-1 w-full" style={{ background: d.op.color }} />
      <div className="p-5 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-3 min-w-[140px]">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white text-xs font-black flex-shrink-0" style={{ background: d.op.color }}>{d.op.abbr}</div>
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">{d.trainName}</p>
            <p className="text-[0.65rem] text-gray-400">#{d.trainNo} · {d.op.name}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-1 min-w-[200px]">
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{d.hDep}:{d.mDep}</p>
            <p className="text-[0.65rem] text-gray-500 font-medium truncate max-w-[80px]">{origin}</p>
          </div>
          <div className="flex-1 flex flex-col items-center gap-1">
            <div className="w-full flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-blue-400 flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-blue-200" />
              <i className="fa fa-train text-blue-400 text-xs flex-shrink-0" />
              <div className="flex-1 border-t-2 border-dashed border-blue-200" />
              <div className="w-2 h-2 rounded-full bg-gray-300 flex-shrink-0" />
            </div>
            <p className="text-[0.6rem] text-gray-400">{d.durH}h {d.durM}m · {d.distanceKm} km</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-black text-gray-900">{d.hArr}:{d.mArr}</p>
            <p className="text-[0.65rem] text-gray-500 font-medium truncate max-w-[80px]">{destination}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 items-center min-w-[140px]">
          <ClassBadge cls={d.cls} />
          <SeatsBadge seats={d.seats} />
          {d.amenities.slice(0, 3).map(a => (
            <span key={a} className="flex items-center gap-1 text-[0.6rem] text-gray-500 bg-gray-50 px-2 py-0.5 rounded-full border border-gray-100">
              <i className={`fa ${AMENITY_ICONS[a]} text-blue-400`} />{a}
            </span>
          ))}
        </div>

        <div className="hidden lg:flex flex-wrap gap-0.5 min-w-[120px]">
          {['M','T','W','T','F','S','S'].map((day, i) => {
            const full = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i];
            const runs = d.runsDays.includes(full);
            return (
              <span key={i} className={`w-6 h-6 rounded-md flex items-center justify-center text-[0.55rem] font-bold ${runs ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-300'}`}>{day}</span>
            );
          })}
        </div>

        <div className="flex items-center gap-3 ml-auto flex-shrink-0">
          <div className="text-right">
            {d.discount && <p className="text-[0.65rem] text-gray-400 line-through">₹{d.oldFare}</p>}
            <p className="text-2xl font-black text-blue-500">₹{d.fare}</p>
            <div className="flex items-center gap-1 justify-end"><StarRating value={d.rating} /><span className="text-[0.6rem] text-gray-400">{d.rating}</span></div>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <button onClick={() => onTrackLive(d)} className="border border-blue-200 hover:border-blue-400 text-blue-600 hover:bg-blue-50 font-bold px-3.5 py-2.5 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5 whitespace-nowrap">
              <i className="fa fa-map-marker text-blue-500 text-xs" /> Live Status
            </button>
            <button onClick={() => onBook(d)} className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-md shadow-blue-500/25 active:scale-95 whitespace-nowrap">
              Book Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ data, origin, destination, pax, onClose }) {
  const [step, setStep]       = useState(1);
  const [name, setName]       = useState('');
  const [email, setEmail]     = useState('');
  const [phone, setPhone]     = useState('');
  const [seat, setSeat]       = useState(null);
  const [paying, setPaying]   = useState(false);
  const [payError, setPayError] = useState('');
  const [booked, setBooked]   = useState(false);

  if (!data) return null;

  const passengers = pax || 1;
  const total = data.fare * passengers + 40;

  if (booked) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm p-10 text-center relative" onClick={e => e.stopPropagation()}>
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <i className="fa fa-check-circle text-blue-500 text-4xl" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-400 text-sm mb-1">{data.trainName} · #{data.trainNo}</p>
          <p className="text-gray-400 text-sm mb-6">{origin} → {destination}</p>
          <div className="bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4 mb-6 text-left space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Departure</span><span className="font-semibold">{data.hDep}:{data.mDep}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Arrival</span><span className="font-semibold">{data.hArr}:{data.mArr}</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Class</span><span className="font-semibold">{data.cls}</span></div>
            {seat && <div className="flex justify-between"><span className="text-gray-400">Seat/Berth</span><span className="font-semibold">#{seat}</span></div>}
            <div className="flex justify-between font-black text-base border-t border-blue-100 pt-2"><span>Total Paid</span><span className="text-blue-500">₹{total}</span></div>
          </div>
          <button onClick={onClose} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-all">Done</button>
        </div>
      </div>
    );
  }

  const STEPS = ['Details', 'Seat', 'Payment'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="relative bg-gradient-to-r from-blue-600 to-blue-500 rounded-t-3xl px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/30 flex items-center justify-center">
                <i className="fa fa-train text-white" />
              </div>
              <div>
                <p className="text-white font-bold">{data.trainName}</p>
                <p className="text-blue-100 text-xs">#{data.trainNo} · {data.cls}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-all">
              <i className="fa fa-times text-sm" />
            </button>
          </div>
          <div className="flex items-center gap-3 mt-4 bg-white/10 rounded-2xl px-4 py-3">
            <span className="text-white font-black text-lg">{data.hDep}:{data.mDep}</span>
            <span className="text-blue-200 text-xs font-medium flex-shrink-0 truncate max-w-[70px]">{origin}</span>
            <div className="flex-1 flex items-center gap-1 px-2">
              <div className="flex-1 border-t border-dashed border-white/40" />
              <i className="fa fa-train text-white text-xs" />
              <div className="flex-1 border-t border-dashed border-white/40" />
            </div>
            <span className="text-blue-200 text-xs font-medium flex-shrink-0 truncate max-w-[70px] text-right">{destination}</span>
            <span className="text-white font-black text-lg">{data.hArr}:{data.mArr}</span>
          </div>
          <div className="flex items-center gap-1 mt-4">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center gap-1 flex-1">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[0.6rem] font-black ${i + 1 <= step ? 'bg-white text-blue-600' : 'bg-white/20 text-white/60'}`}>{i + 1}</div>
                <span className={`text-[0.6rem] font-semibold ${i + 1 <= step ? 'text-white' : 'text-white/50'}`}>{s}</span>
                {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i + 1 < step ? 'bg-white' : 'bg-white/25'}`} />}
              </div>
            ))}
          </div>
        </div>

        <div className="p-6">
          {step === 1 && (
            <div className="space-y-4">
              {[
                { label: 'Full Name',     icon: 'fa-user',     value: name,  set: setName,  type: 'text',  placeholder: 'Your full name' },
                { label: 'Email Address', icon: 'fa-envelope', value: email, set: setEmail, type: 'email', placeholder: 'your@email.com' },
                { label: 'Phone Number',  icon: 'fa-phone',    value: phone, set: setPhone, type: 'tel',   placeholder: '+91 98765 43210' },
              ].map(({ label, icon, value, set, type, placeholder }) => (
                <div key={label}>
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1.5">{label}</label>
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                    <i className={`fa ${icon} text-gray-300 text-sm`} />
                    <input type={type} value={value} onChange={e => set(e.target.value)} placeholder={placeholder} className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300" />
                  </div>
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all">Cancel</button>
                <button onClick={() => setStep(2)} disabled={!name || !email || !phone}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-blue-500/20">
                  Next <i className="fa fa-arrow-right text-xs ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <SeatMap totalSeats={data.seats} selected={seat} onToggle={setSeat} />
              {seat && (
                <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl px-4 py-2.5">
                  <i className="fa fa-check-circle text-blue-500" />
                  <span className="text-sm font-semibold text-blue-700">Berth/Seat #{seat} selected</span>
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all">Back</button>
                <button onClick={() => setStep(3)} className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-blue-500/20">
                  {seat ? 'Continue' : 'Skip'} <i className="fa fa-arrow-right text-xs ml-1" />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={async e => {
              e.preventDefault();
              setPaying(true); setPayError('');
              try {
                const loaded = await loadRazorpay();
                if (!loaded) throw new Error('Razorpay SDK failed to load.');
                const options = {
                  key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                  amount: total * 100,
                  currency: 'INR',
                  name: 'Pacific Travel',
                  description: `Train: ${origin} → ${destination}`,
                  image: import.meta.env.VITE_LOGO_URL || '',
                  prefill: { name, email, contact: phone },
                  theme: { color: '#3b82f6' },
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
              <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 space-y-2 text-sm">
                <div className="flex justify-between text-gray-500"><span>Fare × {passengers}</span><span>₹{data.fare * passengers}</span></div>
                {data.discount && <div className="flex justify-between text-green-600"><span>Discount</span><span>-₹{data.oldFare - data.fare}</span></div>}
                <div className="flex justify-between text-gray-500"><span>Booking fee</span><span>₹40</span></div>
                <div className="flex justify-between font-black text-gray-900 text-base border-t border-gray-200 pt-2 mt-1">
                  <span>Total</span><span className="text-blue-500">₹{total}</span>
                </div>
              </div>
              {payError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm">
                  <i className="fa fa-exclamation-circle flex-shrink-0" />{payError}
                </div>
              )}
              <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-800 flex items-center gap-2">
                <i className="fa fa-lock text-blue-500" />
                Secured by Razorpay · UPI, Cards, Net Banking & Wallets accepted
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-2xl hover:border-gray-300 transition-all">Back</button>
                <button type="submit" disabled={paying}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold py-3 rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2">
                  {paying ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-lock text-xs" />}
                  {paying ? 'Opening Razorpay…' : `Pay ₹${total}`}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

function TrainAlertsTicker() {
  const ALERTS = [
    { type: 'delay',  route: 'Rajdhani 12301',           msg: 'Running 35 min late',          color: 'text-amber-400' },
    { type: 'ontime', route: 'Vande Bharat 20501',        msg: 'Departed on time',              color: 'text-emerald-400' },
    { type: 'cancel', route: 'Duronto 12213',             msg: 'Cancelled — flash floods',     color: 'text-red-400' },
    { type: 'ontime', route: 'Shatabdi 12001',            msg: 'All services on schedule',      color: 'text-emerald-400' },
    { type: 'delay',  route: 'Humsafar 12507',            msg: 'Delayed 20 min',                color: 'text-amber-400' },
    { type: 'ontime', route: 'Jan Shatabdi 14673',        msg: 'Running normally',              color: 'text-emerald-400' },
    { type: 'cancel', route: 'Garib Rath 12209',          msg: 'Cancelled — track maintenance', color: 'text-red-400' },
  ];
  const ICONS = { delay: 'fa-clock-o', cancel: 'fa-times-circle', ontime: 'fa-check-circle' };
  const items = [...ALERTS, ...ALERTS];
  return (
    <div className="bg-gray-950 border-b border-white/10 overflow-hidden h-10 flex items-center">
      <div className="flex items-center gap-3 px-4 bg-gray-950 z-10 border-r border-white/10 h-full flex-shrink-0">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
        <span className="text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">Live Alerts</span>
      </div>
      <div className="overflow-hidden flex-1">
        <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'trainTicker 45s linear infinite' }}>
          {items.map((a, i) => (
            <span key={i} className="inline-flex items-center gap-2 text-xs text-gray-300 flex-shrink-0">
              <i className={`fa ${ICONS[a.type]} ${a.color} text-xs`} />
              <span className="font-semibold text-white">{a.route}</span>
              <span className="text-gray-500">—</span>
              <span className={a.color}>{a.msg}</span>
              <span className="w-px h-3 bg-white/10 mx-2" />
            </span>
          ))}
        </div>
      </div>
      <style>{`@keyframes trainTicker { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
    </div>
  );
}

function ClassComparison() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Side by Side</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Compare Train Classes</h2>
          <p className="text-gray-400 text-sm mt-2">Choose the class that suits your comfort and budget</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="px-5 py-4 text-left text-xs font-bold text-gray-400 uppercase tracking-widest w-36">Feature</th>
                  {COMPARE_CLASSES.map(c => (
                    <th key={c.cls} className="px-4 py-4 text-center">
                      <ClassBadge cls={c.cls} />
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Avg. Fare', key: 'fare', type: 'text' },
                  { label: 'AC',       key: 'ac',     type: 'bool' },
                  { label: 'Meals',    key: 'meals',  type: 'bool' },
                  { label: 'Bedroll',  key: 'bedroll',type: 'bool' },
                  { label: 'Privacy',  key: 'privacy', type: 'text' },
                  { label: 'Legroom',  key: 'legroom', type: 'text' },
                ].map((row, ri) => (
                  <tr key={row.key} className={`border-b border-gray-50 ${ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-5 py-3.5 text-sm font-semibold text-gray-600">{row.label}</td>
                    {COMPARE_CLASSES.map(c => (
                      <td key={c.cls} className="px-4 py-3.5 text-center">
                        {row.type === 'bool'
                          ? c[row.key]
                            ? <i className="fa fa-check-circle text-emerald-500 text-base" />
                            : <i className="fa fa-times-circle text-gray-200 text-base" />
                          : <span className={`text-xs font-semibold ${row.key === 'fare' ? 'text-blue-500 font-black' : 'text-gray-600'}`}>{c[row.key]}</span>
                        }
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

function TrainTipsSection() {
  const [open, setOpen] = useState(null);
  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-10">
          <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Pro Tips</span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Train Travel Tips</h2>
          <p className="text-gray-400 text-sm mt-2">Everything you need for a smooth rail journey</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRAIN_TIPS.map((tip, i) => {
            const isOpen = open === i;
            return (
              <div key={i} onClick={() => setOpen(isOpen ? null : i)}
                className={`bg-white border rounded-2xl p-5 cursor-pointer transition-all duration-300 ${isOpen ? 'border-blue-200 shadow-lg shadow-blue-500/10' : 'border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-0.5'}`}>
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${tip.color}`}>
                    <i className={`fa ${tip.icon} text-base`} />
                  </div>
                  <p className="font-bold text-gray-900">{tip.title}</p>
                  <i className={`fa fa-chevron-${isOpen ? 'up' : 'down'} text-xs text-gray-400 ml-auto`} />
                </div>
                {isOpen && (
                  <ul className="space-y-2 mt-3 border-t border-gray-100 pt-3">
                    {tip.tips.map((t, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm text-gray-600">
                        <i className="fa fa-check text-blue-400 text-xs mt-1 flex-shrink-0" />{t}
                      </li>
                    ))}
                  </ul>
                )}
                {!isOpen && <p className="text-xs text-gray-400">{tip.tips.length} tips — click to expand</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Station Autocomplete Input ────────────────────────────────────────────────

function StationInput({ label, icon, value, onChange, onSelect, placeholder }) {
  const [query, setQuery] = useState(value || '');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleInputChange = async (e) => {
    const text = e.target.value;
    setQuery(text);
    onChange(text);
    if (text.trim().length >= 2) {
      try {
        const list = await searchStations(text);
        setSuggestions(list);
        setIsOpen(list.length > 0);
      } catch {
        setSuggestions([]);
      }
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelect = (item) => {
    const text = `${item.name} (${item.code})`;
    setQuery(text);
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 group relative" ref={wrapperRef}>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</label>
      <div className="flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-3 group-focus-within:border-blue-400 group-focus-within:ring-2 group-focus-within:ring-blue-500/10 transition-all bg-gray-50/50">
        <i className={`fa ${icon} text-blue-400 text-sm flex-shrink-0`} />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => { if (suggestions.length > 0) setIsOpen(true); }}
          placeholder={placeholder}
          className="flex-1 outline-none text-sm text-gray-700 placeholder-gray-300 bg-transparent min-w-0"
        />
        {query && (
          <button
            type="button"
            onClick={() => { setQuery(''); onChange(''); setSuggestions([]); }}
            className="text-gray-300 hover:text-gray-500 text-xs"
          >
            <i className="fa fa-times" />
          </button>
        )}
      </div>

      {isOpen && suggestions.length > 0 && (
        <ul className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 max-h-56 overflow-y-auto divide-y divide-gray-50">
          {suggestions.map((s, idx) => (
            <li
              key={s.code + idx}
              onClick={() => handleSelect(s)}
              className="px-4 py-2.5 hover:bg-blue-50 cursor-pointer flex items-center justify-between text-sm transition-colors"
            >
              <div className="min-w-0 pr-2">
                <p className="font-bold text-gray-900 text-xs truncate">{s.name}</p>
                {s.city && <p className="text-[0.65rem] text-gray-400 truncate">{s.city}</p>}
              </div>
              <span className="bg-blue-100 text-blue-700 font-black text-[0.65rem] px-2 py-0.5 rounded-md flex-shrink-0">
                {s.code}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Live Train Status Modal ──────────────────────────────────────────────────

function LiveTrackingModal({ trainNumber, trainName: initialName, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!trainNumber) return;
    setLoading(true);
    setError('');
    getLiveTrainStatus(trainNumber)
      .then(res => {
        setData(res);
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch live train status.');
      })
      .finally(() => setLoading(false));
  }, [trainNumber]);

  if (!trainNumber) return null;

  const t = data;
  const statusColors = {
    running: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    'not-started': 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    completed: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    delayed: 'bg-red-500/15 text-red-400 border-red-500/30',
  };

  const delayMins = t?.delayMinutes || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto text-white" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="bg-slate-800 border-b border-slate-700 px-6 py-5 flex items-center justify-between rounded-t-3xl">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-400 text-xl">
              <i className="fa fa-train" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-lg text-white">{t?.trainName || initialName || `Train #${trainNumber}`}</h3>
                <span className="bg-blue-500/30 text-blue-300 text-[0.65rem] font-bold px-2 py-0.5 rounded">#{trainNumber}</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Live Running Status powered by RailRadar</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-slate-700/60 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-all">
            <i className="fa fa-times text-sm" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="py-16 text-center text-slate-400 space-y-3">
              <i className="fa fa-spinner fa-spin text-3xl text-blue-400" />
              <p className="text-sm font-semibold">Connecting to RailRadar for live GPS telemetry…</p>
            </div>
          )}

          {error && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 rounded-2xl p-5 text-sm flex items-center gap-3">
              <i className="fa fa-exclamation-circle text-lg flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {t && !loading && (
            <>
              {/* Status Overview Card */}
              <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${statusColors[t.status] || 'bg-slate-700 text-slate-300'}`}>
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      {t.status || 'Active'}
                    </span>
                    {delayMins > 0 ? (
                      <span className="text-xs font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full">
                        {delayMins} min late
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full">
                        On Time
                      </span>
                    )}
                  </div>
                </div>

                {t.nextHalt && (
                  <div>
                    <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Next Halt</span>
                    <p className="text-sm font-bold text-white">{t.nextHalt.stationName} ({t.nextHalt.stationCode})</p>
                    <p className="text-[0.65rem] text-slate-400">{t.nextHalt.distance ? `${t.nextHalt.distance} km remaining` : ''}</p>
                  </div>
                )}

                {t.lastUpdatedAt && (
                  <div className="text-right">
                    <span className="text-[0.6rem] font-bold text-slate-400 uppercase tracking-widest block mb-1">Last Updated</span>
                    <p className="text-xs text-slate-300 font-semibold">
                      {new Date(t.lastUpdatedAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                )}
              </div>

              {/* Route Halt Timeline */}
              {t.route && t.route.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Station Halts ({t.route.filter(h => h.isHalt).length} stops)
                    </span>
                    <span className="text-[0.65rem] text-blue-400 font-semibold">Scheduled vs Actual</span>
                  </div>

                  <div className="bg-slate-800/40 border border-slate-700/60 rounded-2xl p-4 max-h-72 overflow-y-auto space-y-3">
                    {t.route.filter(h => h.isHalt).map((halt, idx) => (
                      <div key={halt.stationCode + idx} className="flex items-center gap-3 text-xs py-1.5 border-b border-slate-700/30 last:border-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-700/50 flex items-center justify-center font-black text-[0.65rem] text-blue-300 flex-shrink-0">
                          {halt.stationCode}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-200 truncate">{halt.stationName}</p>
                          {halt.platform && (
                            <span className="text-[0.6rem] text-slate-400">Platform {halt.platform}</span>
                          )}
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="font-semibold text-slate-300">
                            {halt.scheduledArrival ? halt.scheduledArrival.slice(11, 16) : halt.scheduledDeparture?.slice(11, 16) || '—'}
                          </p>
                          {halt.delayArrival > 0 && (
                            <p className="text-[0.6rem] text-amber-400 font-bold">+{halt.delayArrival}m</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── PNR Status Card ──────────────────────────────────────────────────────────

function PnrStatusChecker() {
  const [pnr, setPnr] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleCheckPnr = async (e) => {
    e.preventDefault();
    if (!pnr || pnr.trim().length !== 10) {
      setError('Please enter a valid 10-digit PNR number.');
      return;
    }
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const data = await getPnrStatus(pnr.trim());
      setResult(data);
    } catch (err) {
      setError(err.message || 'Could not fetch PNR details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 max-w-2xl mx-auto">
      <form onSubmit={handleCheckPnr} className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50/50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
          <i className="fa fa-ticket text-blue-500 text-base" />
          <input
            type="text"
            maxLength={10}
            value={pnr}
            onChange={e => setPnr(e.target.value.replace(/\D/g, ''))}
            placeholder="Enter 10-digit PNR Number"
            className="flex-1 outline-none text-sm font-bold text-gray-800 placeholder-gray-400 bg-transparent tracking-wider"
          />
        </div>
        <button
          type="submit"
          disabled={loading || pnr.length !== 10}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold px-7 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2"
        >
          {loading ? <i className="fa fa-spinner fa-spin" /> : <i className="fa fa-search" />}
          {loading ? 'Checking…' : 'Check PNR'}
        </button>
      </form>

      {error && (
        <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 rounded-2xl p-4 text-xs flex items-center gap-2.5">
          <i className="fa fa-info-circle text-base flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {result && (
        <div className="mt-5 bg-blue-50/60 border border-blue-100 rounded-2xl p-5 space-y-3">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-extrabold text-gray-900 text-base">{result.trainName || 'Express Train'}</p>
              <p className="text-xs text-gray-500">Train #{result.trainNumber || '—'} · PNR: {pnr}</p>
            </div>
            <span className="bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full">
              {result.chartStatus || 'Chart Prepared'}
            </span>
          </div>
          {result.passengers && Array.isArray(result.passengers) && (
            <div className="pt-2 border-t border-blue-100 space-y-1.5">
              {result.passengers.map((p, idx) => (
                <div key={idx} className="flex justify-between text-xs text-gray-700">
                  <span>Passenger {idx + 1}</span>
                  <span className="font-bold">{p.currentStatus || p.bookingStatus || 'CNF'}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function Train() {
  const [activeTab, setActiveTab]     = useState('search'); // 'search' | 'live' | 'pnr'
  const [origin, setOrigin]           = useState('New Delhi (NDLS)');
  const [originCode, setOriginCode]   = useState('NDLS');
  const [destination, setDestination] = useState('Howrah Jn (HWH)');
  const [destCode, setDestCode]       = useState('HWH');
  const [date, setDate]               = useState('');
  const [pax, setPax]                 = useState(1);
  const [travelClass, setTravelClass] = useState('');
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState('');
  const [results, setResults]         = useState(null);
  const [booking, setBooking]         = useState(null);
  const [liveTrackingTrain, setLiveTrackingTrain] = useState(null); // { trainNumber, trainName }
  const [quickTrainNumber, setQuickTrainNumber] = useState('');
  const [view, setView]               = useState('list');
  const [sortBy, setSortBy]           = useState('price');
  const [filterClass, setFilterClass] = useState('');
  const [filterAmenity, setFilterAmenity] = useState('');
  const [filterMaxPrice, setFilterMaxPrice] = useState(5000);
  const resultsRef = useRef(null);

  const swapStations = () => {
    const tempName = origin;
    const tempCode = originCode;
    setOrigin(destination);
    setOriginCode(destCode);
    setDestination(tempName);
    setDestCode(tempCode);
  };

  async function handleSearch(e) {
    e?.preventDefault();
    if (!origin.trim() || !destination.trim()) return;
    setLoading(true);
    setError('');
    setResults(null);

    try {
      // 1. Resolve source and destination station codes
      const [fromStn, toStn] = await Promise.all([
        originCode ? Promise.resolve({ code: originCode, name: origin }) : resolveStation(origin),
        destCode   ? Promise.resolve({ code: destCode, name: destination }) : resolveStation(destination),
      ]);

      if (!fromStn?.code || !toStn?.code) {
        throw new Error('Please select valid departure and destination stations.');
      }

      if (fromStn.code.toUpperCase() === toStn.code.toUpperCase()) {
        throw new Error('Departure and arrival stations cannot be the same.');
      }

      // 2. Fetch trains from RailRadar API
      let railRadarData = null;
      try {
        railRadarData = await getTrainsBetweenStations(fromStn.code, toStn.code);
      } catch (apiErr) {
        console.warn('RailRadar between stations info:', apiErr.message);
      }

      let trains = [];
      let routeDistance = 0;

      if (railRadarData?.trains && railRadarData.trains.length > 0) {
        // Real RailRadar trains
        routeDistance = railRadarData.trains[0]?.distance || 1000;
        trains = railRadarData.trains.map((item, idx) => {
          const t = item.train || {};
          const f = item.from || {};
          const to = item.to || {};
          const distKm = Math.round(item.distance || routeDistance);
          const durMin = item.duration || 600;
          const durH = Math.floor(durMin / 60);
          const durM = durMin % 60;
          const [hDep, mDep] = (f.departure || '12:00').split(':');
          const [hArr, mArr] = (to.arrival || '18:00').split(':');

          const cls = travelClass || TRAIN_CLASSES[idx % TRAIN_CLASSES.length];
          const basePerKm = { Sleeper: 0.7, '3AC': 1.8, '2AC': 2.6, '1AC': 4.5, 'Chair Car': 1.2 };
          const base = Math.max(250, distKm * (basePerKm[cls] || 1.4));
          const fare = Math.round(base + (idx % 3) * 60);
          const oldFare = Math.round(fare * 1.18);
          const discount = idx % 3 === 0;

          const op = TRAIN_OPERATORS.find(o => t.name?.toLowerCase().includes(o.name.toLowerCase().slice(0, 5))) || TRAIN_OPERATORS[idx % TRAIN_OPERATORS.length];
          const runDays = (t.runDays && t.runDays.length > 0)
            ? t.runDays.map(d => d.slice(0, 3).charAt(0).toUpperCase() + d.slice(1, 3))
            : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

          return {
            trainData: {
              op,
              cls,
              trainName: t.name || 'Express Special',
              trainNo: t.number || String(12000 + idx),
              trainType: t.type || 'Superfast',
              fare,
              oldFare,
              discount,
              durH,
              durM,
              hDep: hDep || '12',
              mDep: mDep || '00',
              hArr: hArr || '18',
              mArr: mArr || '00',
              seats: Math.max(4, 58 - (idx * 9) % 50),
              rating: parseFloat((4.1 + (idx % 8) * 0.1).toFixed(1)),
              reviews: 70 + (idx * 51) % 650,
              amenities: ALL_AMENITIES.filter((_, i) => (idx + i) % 2 === 0),
              runsDays: runDays,
              distanceKm: distKm,
              totalHalts: item.totalHaltsBetween || 8,
              isReal: true,
            },
          };
        });
      } else {
        // Fallback calculated route
        const [geoFrom, geoTo] = await Promise.all([geocodeCity(origin), geocodeCity(destination)]);
        routeDistance = haversineKm(geoFrom.lat, geoFrom.lon, geoTo.lat, geoTo.lon);
        if (routeDistance < 5) throw new Error('Please enter two different cities or stations.');

        trains = Array.from({ length: 10 }, (_, index) => ({
          trainData: buildTrainData({ distanceKm: routeDistance, index }),
        }));
      }

      const maxFare = Math.max(...trains.map(t => t.trainData.fare));
      setFilterMaxPrice(Math.ceil(maxFare / 100) * 100);
      setFilterClass(travelClass);
      setResults({
        from: fromStn,
        to: toStn,
        distanceKm: routeDistance,
        trains,
        isRealApi: Boolean(railRadarData?.trains?.length),
      });

      setTimeout(() => resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 150);
    } catch (err) {
      setError(err.message || 'Something went wrong while searching trains. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const allTrains = results?.trains || [];

  const filtered = allTrains.filter(({ trainData: d }) => {
    if (filterClass   && d.cls !== filterClass) return false;
    if (filterAmenity && !d.amenities.includes(filterAmenity)) return false;
    if (d.fare > filterMaxPrice) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const da = a.trainData, db = b.trainData;
    if (sortBy === 'price')    return da.fare - db.fare;
    if (sortBy === 'duration') return (da.durH * 60 + da.durM) - (db.durH * 60 + db.durM);
    if (sortBy === 'rating')   return db.rating - da.rating;
    if (sortBy === 'departs')  return da.hDep.localeCompare(db.hDep);
    return 0;
  });

  const activeFilters = [filterClass, filterAmenity].filter(Boolean).length;
  const maxFareCeiling = results ? Math.ceil(Math.max(...allTrains.map(t => t.trainData.fare)) / 100) * 100 : 5000;

  return (
    <>
      {/* Live alerts ticker */}
      <TrainAlertsTicker />

      {/* Hero */}
      <section
        className="relative flex items-center justify-center bg-cover bg-center overflow-hidden"
        style={{ backgroundImage: "url('/images/bg_5.jpg')", minHeight: '62vh' }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/85 via-black/55 to-blue-950/40" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,.06) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.06) 1px,transparent 1px)', backgroundSize: '48px 48px' }} />
        <div className="relative z-10 text-center text-white px-4 max-w-3xl mx-auto py-12">
          <div className="inline-flex items-center gap-2 bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold px-4 py-1.5 rounded-full mb-5 backdrop-blur-sm">
            <i className="fa fa-bolt text-yellow-400" /> Powered by RailRadar Live API
          </div>
          <p className="text-sm mb-4 flex items-center justify-center gap-2 text-gray-400">
            <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link>
            <i className="fa fa-chevron-right text-xs text-blue-500" />
            <span className="text-white">Train</span>
          </p>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight mb-4">
            Indian Railways <span className="text-blue-400">Live Booking</span>
          </h1>
          <p className="text-gray-300 text-base md:text-lg max-w-xl mx-auto">
            Live train tracking, confirmed seat booking, real timetables & PNR verification.
          </p>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
            {STATS.map((s, i) => (
              <div key={i} className="flex flex-col items-center py-5 px-3 text-white">
                <i className={`fa ${s.icon} text-blue-400 text-lg mb-1`} />
                <span className="text-xl font-extrabold">{s.value}</span>
                <span className="text-[10px] text-gray-400 uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Tabs & Search Container */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        {/* Navigation Tabs */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex bg-gray-100 p-1.5 rounded-2xl border border-gray-200 shadow-inner">
            {[
              { id: 'search', label: 'Book Trains', icon: 'fa-train' },
              { id: 'live',   label: 'Live Train Status', icon: 'fa-map-marker' },
              { id: 'pnr',    label: 'Check PNR Status', icon: 'fa-ticket' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20'
                    : 'text-gray-600 hover:text-blue-600'
                }`}
              >
                <i className={`fa ${tab.icon}`} />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Search & Book Trains */}
        {activeTab === 'search' && (
          <form onSubmit={handleSearch} className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
              {/* Departure Station with Autocomplete */}
              <StationInput
                label="From Station"
                icon="fa-train"
                value={origin}
                onChange={val => { setOrigin(val); setOriginCode(''); }}
                onSelect={stn => { setOrigin(`${stn.name} (${stn.code})`); setOriginCode(stn.code); }}
                placeholder="Station name or code (e.g. NDLS)"
              />

              {/* Destination Station with Autocomplete */}
              <div className="relative">
                <StationInput
                  label="To Station"
                  icon="fa-map-marker"
                  value={destination}
                  onChange={val => { setDestination(val); setDestCode(''); }}
                  onSelect={stn => { setDestination(`${stn.name} (${stn.code})`); setDestCode(stn.code); }}
                  placeholder="Station name or code (e.g. HWH)"
                />
                <button
                  type="button"
                  onClick={swapStations}
                  title="Swap stations"
                  className="hidden lg:flex absolute -left-5 top-9 z-10 w-7 h-7 bg-white border border-gray-200 rounded-full items-center justify-center text-gray-400 hover:text-blue-600 hover:border-blue-400 shadow-sm transition-all"
                >
                  <i className="fa fa-exchange text-xs" />
                </button>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-1.5 group">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Travel Date</label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-3 group-focus-within:border-blue-400 group-focus-within:ring-2 group-focus-within:ring-blue-500/10 transition-all bg-gray-50/50">
                  <i className="fa fa-calendar text-blue-400 text-sm flex-shrink-0" />
                  <input
                    type="date"
                    value={date}
                    onChange={e => setDate(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent min-w-0"
                  />
                </div>
              </div>

              {/* Class selector */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Class</label>
                <div className="flex items-center gap-2.5 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all bg-gray-50/50">
                  <i className="fa fa-ticket text-blue-400 text-sm flex-shrink-0" />
                  <select
                    value={travelClass}
                    onChange={e => setTravelClass(e.target.value)}
                    className="flex-1 outline-none text-sm text-gray-700 bg-transparent cursor-pointer"
                  >
                    <option value="">All Classes</option>
                    {TRAIN_CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Passengers */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Passengers</label>
                <div className="flex items-center gap-2 border border-gray-200 rounded-2xl px-3 py-2.5 bg-gray-50/50">
                  <button type="button" onClick={() => setPax(p => Math.max(1, p - 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all flex-shrink-0"><i className="fa fa-minus text-[0.6rem]" /></button>
                  <span className="flex-1 text-center text-sm font-bold text-gray-900">{pax}</span>
                  <button type="button" onClick={() => setPax(p => Math.min(9, p + 1))} className="w-7 h-7 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:border-blue-400 hover:text-blue-500 transition-all flex-shrink-0"><i className="fa fa-plus text-[0.6rem]" /></button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-lg shadow-blue-500/25 active:scale-95 h-[50px]"
              >
                <i className={`fa ${loading ? 'fa-spinner fa-spin' : 'fa-search'}`} />
                {loading ? 'Searching…' : 'Search Trains'}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Live Train Status Lookup */}
        {activeTab === 'live' && (
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 max-w-2xl mx-auto">
            <h3 className="font-extrabold text-gray-900 text-lg mb-2 text-center">Track Any Train Live</h3>
            <p className="text-xs text-gray-400 text-center mb-6">Enter train number (e.g., 12301, 12302, 12002, 20501) for live GPS status</p>
            <form onSubmit={e => {
              e.preventDefault();
              if (quickTrainNumber.trim()) {
                setLiveTrackingTrain({ trainNumber: quickTrainNumber.trim(), trainName: `Train #${quickTrainNumber.trim()}` });
              }
            }} className="flex gap-3">
              <div className="flex-1 flex items-center gap-3 border border-gray-200 rounded-2xl px-4 py-3 bg-gray-50/50 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
                <i className="fa fa-train text-blue-500" />
                <input
                  type="text"
                  value={quickTrainNumber}
                  onChange={e => setQuickTrainNumber(e.target.value)}
                  placeholder="Enter 5-digit Train Number (e.g. 12302)"
                  className="flex-1 outline-none text-sm font-bold text-gray-800 placeholder-gray-300 bg-transparent"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold px-6 py-3.5 rounded-2xl transition-all shadow-md shadow-blue-500/20 flex items-center gap-2"
              >
                <i className="fa fa-map-marker" /> Track
              </button>
            </form>

            <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
              <span className="text-xs text-gray-400">Popular:</span>
              {['12302 (Rajdhani)', '12002 (Shatabdi)', '20501 (Vande Bharat)', '12274 (Duronto)'].map(item => {
                const no = item.split(' ')[0];
                return (
                  <button
                    key={no}
                    type="button"
                    onClick={() => { setQuickTrainNumber(no); setLiveTrackingTrain({ trainNumber: no, trainName: item }); }}
                    className="text-xs bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold px-3 py-1 rounded-full border border-blue-200 transition-colors"
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: PNR Status Checker */}
        {activeTab === 'pnr' && <PnrStatusChecker />}

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
          <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-6 flex flex-wrap items-center gap-4 shadow-sm">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                <i className="fa fa-train text-blue-500" />
              </div>
              <div className="min-w-0">
                <p className="font-extrabold text-gray-900 text-lg truncate">
                  {results.from.name} ({results.from.code}) → {results.to.name} ({results.to.code})
                </p>
                <p className="text-xs text-gray-400">
                  {results.isRealApi ? 'Verified Live RailRadar Schedule' : 'Calculated Rail Route'} · {results.distanceKm} km
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 flex-wrap text-center">
              <div><p className="text-lg font-black text-blue-500">{results.distanceKm} km</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Distance</p></div>
              <div><p className="text-lg font-black text-gray-900">{sorted.length}</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Trains Found</p></div>
              {date && <div><p className="text-lg font-black text-gray-900">{date}</p><p className="text-[0.65rem] text-gray-400 uppercase tracking-wider">Date</p></div>}
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden sticky top-24">
                <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <i className="fa fa-sliders text-blue-500" />
                    <span className="font-bold text-gray-900 text-sm">Filters</span>
                    {activeFilters > 0 && <span className="w-5 h-5 bg-blue-500 text-white text-[0.6rem] font-bold rounded-full flex items-center justify-center">{activeFilters}</span>}
                  </div>
                  {activeFilters > 0 && (
                    <button onClick={() => { setFilterClass(''); setFilterAmenity(''); setFilterMaxPrice(maxFareCeiling); }}
                      className="text-[0.65rem] text-blue-500 font-semibold hover:text-blue-600">Reset</button>
                  )}
                </div>
                <div className="p-5 space-y-6">
                  {/* Max price */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Max Price</p>
                      <span className="text-sm font-black text-blue-500">₹{filterMaxPrice}</span>
                    </div>
                    <input type="range" min={0} max={maxFareCeiling} step={50} value={filterMaxPrice}
                      onChange={e => setFilterMaxPrice(Number(e.target.value))}
                      className="w-full accent-blue-500 cursor-pointer" />
                    <div className="flex justify-between text-[0.6rem] text-gray-400 mt-1"><span>₹0</span><span>₹{maxFareCeiling}</span></div>
                  </div>
                  {/* Class filter */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Train Class</p>
                    <div className="space-y-2">
                      {['', ...TRAIN_CLASSES].map(cls => (
                        <button key={cls} onClick={() => setFilterClass(cls)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all border ${filterClass === cls ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-100 text-gray-600 hover:border-blue-300 hover:text-blue-500 bg-gray-50'}`}>
                          <span className="font-medium">{cls || 'All Classes'}</span>
                          {filterClass === cls && <i className="fa fa-check text-xs" />}
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Amenities filter */}
                  <div>
                    <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Amenities</p>
                    <div className="space-y-2">
                      {ALL_AMENITIES.map(a => (
                        <button key={a} onClick={() => setFilterAmenity(filterAmenity === a ? '' : a)}
                          className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-all border ${filterAmenity === a ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-100 text-gray-600 hover:border-blue-300 hover:text-blue-500 bg-gray-50'}`}>
                          <i className={`fa ${AMENITY_ICONS[a]} text-xs ${filterAmenity === a ? 'text-white' : 'text-blue-400'}`} />
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
                <p className="text-sm text-gray-500">{sorted.length} train{sorted.length !== 1 ? 's' : ''} found</p>
                <div className="flex items-center gap-2 flex-wrap">
                  <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                    className="border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-gray-600 outline-none focus:border-blue-400 bg-white cursor-pointer">
                    <option value="price">Cheapest First</option>
                    <option value="duration">Fastest First</option>
                    <option value="rating">Best Rated</option>
                    <option value="departs">Earliest Departure</option>
                  </select>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden">
                    {[['list','fa-list'],['grid','fa-th-large']].map(([v, icon]) => (
                      <button key={v} onClick={() => setView(v)}
                        className={`px-3 py-2 transition-all ${view === v ? 'bg-blue-500 text-white' : 'bg-white text-gray-400 hover:text-gray-600'}`}>
                        <i className={`fa ${icon} text-xs`} />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {sorted.length === 0 ? (
                <div className="flex flex-col items-center py-24 text-center">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-5">
                    <i className="fa fa-train text-blue-300 text-3xl" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2">No trains match your filters</h3>
                  <button onClick={() => { setFilterClass(''); setFilterAmenity(''); setFilterMaxPrice(maxFareCeiling); }}
                    className="mt-3 text-sm text-blue-500 font-semibold hover:underline">Clear all filters</button>
                </div>
              ) : (
                <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 gap-4' : 'space-y-4'}>
                  {sorted.map(({ trainData }, i) => (
                    <TrainResultRow
                      key={trainData.trainNo + i}
                      d={trainData}
                      origin={origin}
                      destination={destination}
                      onBook={setBooking}
                      onTrackLive={train => setLiveTrackingTrain({ trainNumber: train.trainNo, trainName: train.trainName })}
                      view={view}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Popular routes — shown before search */}
      {!results && !loading && (
        <>
          <section className="max-w-6xl mx-auto px-6 pb-16">
            <div className="flex items-end justify-between mb-8">
              <div>
                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Quick Pick</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">Popular Rail Routes</h2>
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
                      <i className="fa fa-train text-blue-400" /> {r.train}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Why book with us */}
          <section className="py-14 bg-gray-50">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <span className="text-blue-500 text-xs font-bold uppercase tracking-widest">Why Book With Us</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-1">The Pacific Rail Advantage</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { icon: 'fa-tag',        color: 'bg-green-50 text-green-500',   title: 'Best Fare Guarantee',  desc: 'We compare all available quotas so you always get the lowest price.' },
                  { icon: 'fa-bolt',       color: 'bg-blue-50 text-blue-500',     title: 'Instant Confirmation', desc: 'PNR confirmed instantly. e-ticket delivered to your email and phone.' },
                  { icon: 'fa-ban',        color: 'bg-orange-50 text-orange-500', title: 'Easy Cancellation',    desc: 'Cancel online in one click. Refund processed within 3–5 business days.' },
                  { icon: 'fa-headphones', color: 'bg-purple-50 text-purple-500', title: '24/7 Support',         desc: 'Our rail experts are always on standby to help with any query.' },
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

          {/* Testimonials */}
          <section className="py-14 bg-gray-950">
            <div className="max-w-6xl mx-auto px-6">
              <div className="text-center mb-10">
                <span className="text-blue-400 text-xs font-bold uppercase tracking-widest">Passenger Reviews</span>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mt-1">What Travellers Say</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {TESTIMONIALS.map((r, i) => (
                  <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/10 transition-colors duration-300">
                    <div className="flex items-center gap-0.5 mb-1">
                      {[...Array(5)].map((_, j) => <i key={j} className={`fa fa-star text-xs ${j < r.rating ? 'text-yellow-400' : 'text-white/20'}`} />)}
                    </div>
                    <p className="text-[0.65rem] text-blue-400 font-semibold mb-3">{r.route}</p>
                    <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{r.text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={r.avatar} alt={r.name} className="w-10 h-10 rounded-full object-cover border-2 border-blue-500/40" />
                      <div>
                        <div className="text-white font-semibold text-sm">{r.name}</div>
                        <div className="text-gray-500 text-xs">Verified Passenger</div>
                      </div>
                      <div className="ml-auto"><i className="fa fa-quote-right text-blue-500/30 text-3xl" /></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Always visible sections */}
      <ClassComparison />
      <TrainTipsSection />

      <CallToAction />

      {/* Booking modal */}
      <BookingModal data={booking} origin={origin} destination={destination} pax={pax} onClose={() => setBooking(null)} />

      {/* Live Train Tracking Modal */}
      {liveTrackingTrain && (
        <LiveTrackingModal
          trainNumber={liveTrackingTrain.trainNumber}
          trainName={liveTrackingTrain.trainName}
          onClose={() => setLiveTrackingTrain(null)}
        />
      )}
    </>
  );
}
