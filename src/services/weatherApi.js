const KEY = import.meta.env.VITE_WEATHER_KEY;

// Same coords map as LiveTrackingMap — top airports
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
  LHR:[51.477,-0.4613],LGW:[51.1537,-0.1821],MAN:[53.3537,-2.275],
  CDG:[49.0097,2.5479],ORY:[48.7233,2.3794],AMS:[52.3086,4.7639],
  FRA:[50.0379,8.5622],MUC:[48.3538,11.7861],ZRH:[47.4647,8.5492],
  VIE:[48.1103,16.5697],BRU:[50.9014,4.4844],MAD:[40.4936,-3.5668],
  BCN:[41.2971,2.0785],FCO:[41.8003,12.2389],MXP:[45.6306,8.7281],
  ATH:[37.9364,23.9445],IST:[41.2753,28.7519],SAW:[40.8985,29.3092],
  DXB:[25.2532,55.3657],AUH:[24.433,54.6511],DOH:[25.2609,51.6138],
  KWI:[29.2267,47.9689],BAH:[26.2708,50.6336],RUH:[24.9576,46.6988],
  BOM:[19.0896,72.8656],DEL:[28.5562,77.1],MAA:[12.9941,80.1709],
  BLR:[13.1986,77.7066],HYD:[17.2403,78.4294],CCU:[22.6547,88.4467],
  SIN:[1.3644,103.9915],KUL:[2.7456,101.7099],BKK:[13.6811,100.7472],
  CGK:[-6.1256,106.6559],MNL:[14.5086,121.0194],HKG:[22.308,113.9185],
  PEK:[40.0799,116.6031],PVG:[31.1443,121.8083],CAN:[23.3924,113.2988],
  NRT:[35.7647,140.3864],HND:[35.5494,139.7798],ICN:[37.4602,126.4407],
  SYD:[-33.9399,151.1753],MEL:[-37.669,144.841],BNE:[-27.3842,153.1175],
  PER:[-31.9403,115.9669],AKL:[-37.0082,174.7917],GRU:[-23.4356,-46.4731],
  GIG:[-22.8099,-43.2505],EZE:[-34.8222,-58.5358],SCL:[-33.393,-70.7858],
  BOG:[4.7016,-74.1469],LIM:[-12.0219,-77.1143],MEX:[19.4363,-99.0721],
  CUN:[21.0365,-86.8771],YYZ:[43.6777,-79.6248],YVR:[49.1967,-123.1815],
  NBO:[-1.3192,36.9275],JNB:[-26.1392,28.246],CPT:[-33.9715,18.6021],
  CAI:[30.1219,31.4056],ADD:[8.9779,38.7993],
};

const WEATHER_ICONS = {
  '01d':'☀️','01n':'🌙','02d':'⛅','02n':'⛅',
  '03d':'☁️','03n':'☁️','04d':'☁️','04n':'☁️',
  '09d':'🌧️','09n':'🌧️','10d':'🌦️','10n':'🌧️',
  '11d':'🌩️','11n':'🌩️','13d':'❄️','13n':'❄️',
  '50d':'🌫️','50n':'🌫️',
};

// In-memory cache: iata → { icon, label, temp, ts }
const cache = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 min

// Fallback: estimate weather from airport latitude
const FALLBACK = [
  { icon: '☀️', label: 'Sunny',        temp: 32 },
  { icon: '⛅', label: 'Partly Cloudy', temp: 24 },
  { icon: '☁️', label: 'Cloudy',        temp: 18 },
  { icon: '🌧️', label: 'Rain',          temp: 12 },
  { icon: '❄️', label: 'Cold',          temp: 2  },
  { icon: '🌩️', label: 'Stormy',        temp: 15 },
  { icon: '💨', label: 'Windy',         temp: 20 },
];
function fallbackWeather(iata) {
  const coords = AIRPORT_COORDS[iata?.toUpperCase()];
  if (!coords) return FALLBACK[0];
  const lat = coords[0];
  // rough climate by latitude band
  if (lat > 60)  return FALLBACK[4]; // arctic
  if (lat > 45)  return FALLBACK[2]; // temperate
  if (lat > 30)  return FALLBACK[1]; // mild
  if (lat > 10)  return FALLBACK[0]; // tropical/warm
  if (lat > -10) return FALLBACK[0]; // equatorial
  return FALLBACK[1];                // southern hemisphere
}

export async function fetchWeather(iata) {
  if (!iata) return null;
  const key = iata.toUpperCase();

  if (cache[key] && Date.now() - cache[key].ts < CACHE_TTL) return cache[key];

  const coords = AIRPORT_COORDS[key];
  if (!coords) return null;

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&units=metric&appid=${KEY}`
    );
    if (!res.ok) return fallbackWeather(key); // key not active yet → use fallback
    const d = await res.json();
    const result = {
      icon:  WEATHER_ICONS[d.weather?.[0]?.icon] || '🌡️',
      label: d.weather?.[0]?.main || '',
      temp:  Math.round(d.main?.temp ?? 0),
      ts:    Date.now(),
    };
    cache[key] = result;
    return result;
  } catch {
    return fallbackWeather(key);
  }
}

