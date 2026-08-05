import { useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// ── Airport coordinate lookup (top ~120 airports) ──────────────────────────
const AIRPORT_COORDS = {
  LAX:[33.9425,-118.408],JFK:[40.6413,-73.7781],ORD:[41.9742,-87.9073],
  ATL:[33.6407,-84.4277],DFW:[32.8998,-97.0403],DEN:[39.8561,-104.6737],
  SFO:[37.6213,-122.379],SEA:[47.4502,-122.3088],MIA:[25.7959,-80.287],
  BOS:[42.3656,-71.0096],LAS:[36.084,-115.1537],PHX:[33.4373,-112.0078],
  IAH:[29.9902,-95.3368],MSP:[44.8848,-93.2223],DTW:[42.2124,-83.3534],
  PHL:[39.8744,-75.2424],CLT:[35.214,-80.9431],LGA:[40.7772,-73.8726],
  EWR:[40.6895,-74.1745],BWI:[39.1754,-76.6683],SLC:[40.7884,-111.9778],
  SAN:[32.7338,-117.1933],TPA:[27.9755,-82.5332],PDX:[45.5898,-122.5951],
  STL:[38.7487,-90.37],HNL:[21.3245,-157.9251],AUS:[30.1975,-97.6664],
  MCI:[39.2976,-94.7139],OAK:[37.7213,-122.2208],SMF:[38.6954,-121.5908],
  LHR:[51.477,-0.4613],LGW:[51.1537,-0.1821],MAN:[53.3537,-2.2750],
  CDG:[49.0097,2.5479],ORY:[48.7233,2.3794],AMS:[52.3086,4.7639],
  FRA:[50.0379,8.5622],MUC:[48.3538,11.7861],ZRH:[47.4647,8.5492],
  VIE:[48.1103,16.5697],BRU:[50.9014,4.4844],MAD:[40.4936,-3.5668],
  BCN:[41.2971,2.0785],FCO:[41.8003,12.2389],MXP:[45.6306,8.7281],
  ATH:[37.9364,23.9445],IST:[41.2753,28.7519],SAW:[40.8985,29.3092],
  DXB:[25.2532,55.3657],AUH:[24.4330,54.6511],DOH:[25.2609,51.6138],
  KWI:[29.2267,47.9689],BAH:[26.2708,50.6336],RUH:[24.9576,46.6988],
  BOM:[19.0896,72.8656],DEL:[28.5562,77.1],MAA:[12.9941,80.1709],
  BLR:[13.1986,77.7066],HYD:[17.2403,78.4294],CCU:[22.6547,88.4467],
  SIN:[1.3644,103.9915],KUL:[2.7456,101.7099],BKK:[13.6811,100.7472],
  CGK:[6.1256,106.6559],MNL:[-14.5086,121.0194],HKG:[22.3080,113.9185],
  PEK:[40.0799,116.6031],PVG:[31.1443,121.8083],CAN:[23.3924,113.2988],
  NRT:[35.7647,140.3864],HND:[35.5494,139.7798],ICN:[37.4602,126.4407],
  SYD:[-33.9399,151.1753],MEL:[-37.6690,144.8410],BNE:[-27.3842,153.1175],
  PER:[-31.9403,115.9669],AKL:[-37.0082,174.7917],GRU:[-23.4356,-46.4731],
  GIG:[-22.8099,-43.2505],EZE:[-34.8222,-58.5358],SCL:[-33.3930,-70.7858],
  BOG:[4.7016,-74.1469],LIM:[-12.0219,-77.1143],UIO:[-0.1292,-78.3575],
  MEX:[19.4363,-99.0721],CUN:[21.0365,-86.8771],PTY:[9.0714,-79.3835],
  SJC:[37.3626,-121.9290],SJO:[9.9939,-84.2088],YYZ:[43.6777,-79.6248],
  YVR:[49.1967,-123.1815],YUL:[45.4706,-73.7408],YYC:[51.1315,-114.0106],
  NBO:[-1.3192,36.9275],JNB:[-26.1392,28.246],CPT:[-33.9715,18.6021],
  CAI:[30.1219,31.4056],CMN:[33.3675,-7.5898],ADD:[8.9779,38.7993],
  DUR:[-29.6144,31.1197],
};

function getCoords(iata) { return iata ? AIRPORT_COORDS[iata.toUpperCase()] : null; }

// ── Custom SVG icons ───────────────────────────────────────────────────────
const pinIcon = (color) => L.divIcon({
  className: '',
  html: `<svg width="32" height="40" viewBox="0 0 32 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C9.373 0 4 5.373 4 12c0 9 12 28 12 28S28 21 28 12C28 5.373 22.627 0 16 0z" fill="${color}" opacity="0.9"/>
    <circle cx="16" cy="12" r="6" fill="white" opacity="0.95"/>
    <text x="16" y="16" text-anchor="middle" font-size="8" fill="${color}" font-weight="bold">✈</text>
  </svg>`,
  iconSize: [32, 40], iconAnchor: [16, 40], popupAnchor: [0, -40],
});

const planeIcon = (bearing = 0) => L.divIcon({
  className: '',
  html: `<div style="transform:rotate(${bearing}deg);width:32px;height:32px;display:flex;align-items:center;justify-content:center;">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="16" cy="16" r="15" fill="#1e293b" stroke="#38bdf8" stroke-width="1.5" opacity="0.9"/>
      <text x="16" y="21" text-anchor="middle" font-size="14">✈</text>
    </svg>
  </div>`,
  iconSize: [32, 32], iconAnchor: [16, 16],
});

function bearing(from, to) {
  const [lat1, lon1] = from.map(d => d * Math.PI / 180);
  const [lat2, lon2] = to.map(d => d * Math.PI / 180);
  const dLon = lon2 - lon1;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
}

function interpolate(from, to, t) {
  return [from[0] + (to[0] - from[0]) * t, from[1] + (to[1] - from[1]) * t];
}

export default function LiveTrackingMap({ flight }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const planeMarkerRef = useRef(null);
  const animFrameRef = useRef(null);

  const depCoords = useMemo(() => getCoords(flight?.departure?.iata), [flight]);
  const arrCoords = useMemo(() => getCoords(flight?.arrival?.iata), [flight]);

  // live position overrides dep coords for plane start
  const liveCoords = useMemo(() => {
    const lat = flight?.live?.latitude;
    const lng = flight?.live?.longitude;
    return lat && lng ? [lat, lng] : null;
  }, [flight]);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const center = liveCoords || depCoords || [20, 0];
    const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView(center, 4);

    // Dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
    }).addTo(map);

    L.control.zoom({ position: 'bottomleft' }).addTo(map);

    mapInstanceRef.current = map;
    return () => {
      cancelAnimationFrame(animFrameRef.current);
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !depCoords || !arrCoords) return;

    // Clear old layers except tile
    map.eachLayer(l => { if (!(l instanceof L.TileLayer)) map.removeLayer(l); });
    cancelAnimationFrame(animFrameRef.current);

    // Fit bounds
    const bounds = L.latLngBounds([depCoords, arrCoords]);
    map.fitBounds(bounds, { padding: [60, 60] });

    // Route line
    L.polyline([depCoords, arrCoords], {
      color: '#38bdf8', weight: 1.5, opacity: 0.5, dashArray: '6 6',
    }).addTo(map);

    // Departure pin (orange)
    L.marker(depCoords, { icon: pinIcon('#f97316') })
      .bindTooltip(`<b>${flight.departure?.iata}</b><br/>${flight.departure?.airport || ''}`, { className: 'leaflet-dark-tip' })
      .addTo(map);

    // Arrival pin (sky)
    L.marker(arrCoords, { icon: pinIcon('#38bdf8') })
      .bindTooltip(`<b>${flight.arrival?.iata}</b><br/>${flight.arrival?.airport || ''}`, { className: 'leaflet-dark-tip' })
      .addTo(map);

    // Plane marker — start at live position or dep
    const startPos = liveCoords || depCoords;
    const br = bearing(depCoords, arrCoords);
    const marker = L.marker(startPos, { icon: planeIcon(br) }).addTo(map);
    planeMarkerRef.current = marker;

    // Animate plane along route (if no live data, animate from dep→arr)
    if (!liveCoords) {
      let t = 0;
      const DURATION = 8000;
      let start = null;
      function animate(ts) {
        if (!start) start = ts;
        t = Math.min((ts - start) / DURATION, 1);
        const pos = interpolate(depCoords, arrCoords, t);
        marker.setLatLng(pos);
        if (t < 1) animFrameRef.current = requestAnimationFrame(animate);
      }
      animFrameRef.current = requestAnimationFrame(animate);
    }
  }, [flight, depCoords, arrCoords, liveCoords]);

  if (!depCoords && !arrCoords) return null;

  const f = flight;
  const speed = f?.live?.speed_horizontal;
  const altitude = f?.live?.altitude;

  // ETA estimate
  let eta = null;
  if (f?.arrival?.estimated) {
    const now = new Date();
    const arr = new Date(f.arrival.estimated);
    const diff = Math.max(0, arr - now);
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    if (h > 0 || m > 0) eta = `${h > 0 ? h + ' hr ' : ''}${m} min`;
  }

  return (
    <div className="relative w-full rounded-xl overflow-hidden border border-slate-700/60" style={{ height: 420 }}>
      <div ref={mapRef} className="w-full h-full" />

      {/* Info overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] bg-slate-900/90 backdrop-blur border border-slate-700/60 rounded-xl px-5 py-4 min-w-[320px] max-w-[480px] w-[90%] shadow-2xl">
        <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs mb-3">
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Flight no.</span><span className="text-sky-400 font-bold">: {f?.flight?.iata || '—'}</span></div>
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Airline</span><span className="text-sky-400 font-bold">: {f?.airline?.name || '—'}</span></div>
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Model</span><span className="text-slate-200">: {f?.aircraft?.iata || '—'}</span></div>
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Callsign</span><span className="text-slate-200">: {f?.flight?.icao || '—'}</span></div>
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Velocity</span><span className="text-slate-200">: {speed ? `${speed} km/h` : '—'}</span></div>
          <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">ETA</span><span className="text-slate-200">: {eta || '—'}</span></div>
          {altitude && <div className="flex gap-2"><span className="text-slate-400 font-medium w-16">Altitude</span><span className="text-slate-200">: {altitude} ft</span></div>}
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-[0.65rem] font-bold text-slate-400">{f?.departure?.iata || '—'}</span>
          <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-sky-500 to-sky-400 rounded-full" style={{ width: liveCoords ? '50%' : '0%' }} />
            <div className="absolute top-1/2 -translate-y-1/2 text-sky-400 text-[0.5rem]" style={{ left: liveCoords ? 'calc(50% - 6px)' : '-2px' }}>➤</div>
          </div>
          <span className="text-[0.65rem] font-bold text-slate-400">{f?.arrival?.iata || '—'}</span>
        </div>
      </div>

      {/* Live badge */}
      {liveCoords && (
        <div className="absolute top-3 left-3 z-[1000] flex items-center gap-1.5 bg-slate-900/80 border border-slate-700/60 rounded-full px-3 py-1.5 text-xs font-bold text-white">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          Live Tracking
        </div>
      )}

      {/* Leaflet dark tooltip style */}
      <style>{`
        .leaflet-dark-tip {
          background: #0f172a !important;
          border: 1px solid #334155 !important;
          color: #e2e8f0 !important;
          font-size: 11px !important;
          border-radius: 6px !important;
          padding: 4px 8px !important;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5) !important;
        }
        .leaflet-dark-tip::before { display: none !important; }
        .leaflet-control-zoom a {
          background: #1e293b !important;
          color: #94a3b8 !important;
          border-color: #334155 !important;
        }
        .leaflet-control-zoom a:hover { background: #334155 !important; color: #fff !important; }
      `}</style>
    </div>
  );
}
