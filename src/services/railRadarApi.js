const API_KEY = import.meta.env.VITE_RAILRADAR_KEY || 'rg_2829c394fda246d5ab50a111d296a347';
const BASE_URL = 'https://api.railradar.in/v1';

// In-memory cache to prevent hitting the 10 req/min rate limit
const cache = new Map();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.ts > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCache(key, data) {
  cache.set(key, { data, ts: Date.now() });
}

async function request(endpoint) {
  const cacheKey = endpoint;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `${BASE_URL}${endpoint}`;
  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errData = await res.json().catch(() => ({}));
    const msg = errData?.error?.message || `RailRadar API error: ${res.status} ${res.statusText}`;
    throw new Error(msg);
  }

  const json = await res.json();
  if (json.success === false) {
    throw new Error(json.error?.message || 'RailRadar request failed');
  }

  setCache(cacheKey, json.data);
  return json.data;
}

// ─── Common Station Code Mappings for Fast Instant Resolution ─────────────────
export const CITY_STATION_MAP = {
  delhi: { code: 'NDLS', name: 'New Delhi' },
  'new delhi': { code: 'NDLS', name: 'New Delhi' },
  mumbai: { code: 'MMCT', name: 'Mumbai Central' },
  bombay: { code: 'CSMT', name: 'Chhatrapati Shivaji Maharaj Terminus' },
  kolkata: { code: 'HWH', name: 'Howrah Jn' },
  howrah: { code: 'HWH', name: 'Howrah Jn' },
  bangalore: { code: 'SBC', name: 'KSR Bengaluru' },
  bengaluru: { code: 'SBC', name: 'KSR Bengaluru' },
  chennai: { code: 'MAS', name: 'Chennai Central' },
  madras: { code: 'MAS', name: 'Chennai Central' },
  hyderabad: { code: 'HYB', name: 'Hyderabad Deccan' },
  secunderabad: { code: 'SC', name: 'Secunderabad Jn' },
  jaipur: { code: 'JP', name: 'Jaipur Jn' },
  ahmedabad: { code: 'ADI', name: 'Ahmedabad Jn' },
  pune: { code: 'PUNE', name: 'Pune Jn' },
  varanasi: { code: 'BSB', name: 'Varanasi Jn' },
  lucknow: { code: 'LKO', name: 'Lucknow Charbagh' },
  patna: { code: 'PNBE', name: 'Patna Jn' },
  goa: { code: 'MAO', name: 'Madgaon (Goa)' },
  madgaon: { code: 'MAO', name: 'Madgaon (Goa)' },
  chandigarh: { code: 'CDG', name: 'Chandigarh' },
  amritsar: { code: 'ASR', name: 'Amritsar Jn' },
  bhopal: { code: 'BPL', name: 'Bhopal Jn' },
  agra: { code: 'AGC', name: 'Agra Cantt' },
  surat: { code: 'ST', name: 'Surat' },
  nagpur: { code: 'NGP', name: 'Nagpur Jn' },
  kochi: { code: 'ERS', name: 'Ernakulam Jn' },
  cochin: { code: 'ERS', name: 'Ernakulam Jn' },
  trivandrum: { code: 'TVC', name: 'Thiruvananthapuram Central' },
  thiruvananthapuram: { code: 'TVC', name: 'Thiruvananthapuram Central' },
  guwahati: { code: 'GHY', name: 'Guwahati' },
  bhubaneswar: { code: 'BBS', name: 'Bhubaneswar' },
  ranchi: { code: 'RNC', name: 'Ranchi Jn' },
  indore: { code: 'INDB', name: 'Indore Jn' },
};

/**
 * Autocomplete search for stations
 * Endpoint: GET /v1/lookup/search/stations?q={query}&limit=10
 */
export async function searchStations(query) {
  if (!query || query.trim().length < 2) return [];
  const q = query.trim().toLowerCase();

  try {
    const data = await request(`/lookup/search/stations?q=${encodeURIComponent(q)}&limit=10`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('RailRadar station search warning:', err.message);
    // Fallback search in local city map
    return Object.entries(CITY_STATION_MAP)
      .filter(([city, item]) => city.includes(q) || item.code.toLowerCase().includes(q) || item.name.toLowerCase().includes(q))
      .map(([_, item]) => ({ code: item.code, name: item.name, city: item.name }));
  }
}

/**
 * Autocomplete search for trains by number or name
 * Endpoint: GET /v1/lookup/search/trains?q={query}&limit=10
 */
export async function searchTrains(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const data = await request(`/lookup/search/trains?q=${encodeURIComponent(query.trim())}&limit=10`);
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.warn('RailRadar train search warning:', err.message);
    return [];
  }
}

/**
 * Resolve user input (which can be a station code like "NDLS" or a city name like "Delhi") to station object
 */
export async function resolveStation(input) {
  if (!input || !input.trim()) return null;
  const raw = input.trim();
  const lower = raw.toLowerCase();

  // If already matches our local map
  if (CITY_STATION_MAP[lower]) {
    return CITY_STATION_MAP[lower];
  }

  // If uppercase code like "NDLS" or 2-5 letter code
  if (/^[A-Za-z]{2,5}$/.test(raw)) {
    return { code: raw.toUpperCase(), name: raw.toUpperCase() };
  }

  // Otherwise search stations via API
  const results = await searchStations(raw);
  if (results.length > 0) {
    return { code: results[0].code, name: results[0].name };
  }

  return { code: raw.slice(0, 4).toUpperCase(), name: raw };
}

/**
 * Trains between two stations
 * Endpoint: GET /v1/trains/between/{fromCode}/{toCode}
 */
export async function getTrainsBetweenStations(fromCode, toCode) {
  if (!fromCode || !toCode) throw new Error('Source and destination station codes are required.');
  const from = fromCode.toUpperCase();
  const to = toCode.toUpperCase();
  return request(`/trains/between/${from}/${to}`);
}

/**
 * Get train timetable & details
 * Endpoint: GET /v1/trains/{trainNumber}
 */
export async function getTrainDetails(trainNumber) {
  if (!trainNumber) throw new Error('Train number is required.');
  return request(`/trains/${encodeURIComponent(trainNumber)}`);
}

/**
 * Get live running status of train
 * Endpoint: GET /v1/trains/{trainNumber}/live
 */
export async function getLiveTrainStatus(trainNumber) {
  if (!trainNumber) throw new Error('Train number is required.');
  return request(`/trains/${encodeURIComponent(trainNumber)}/live`);
}

/**
 * Check PNR status
 * Endpoint: GET /v1/pnr/{pnr}
 */
export async function getPnrStatus(pnr) {
  if (!pnr || !/^\d{10}$/.test(pnr)) {
    throw new Error('Please enter a valid 10-digit PNR number.');
  }
  return request(`/pnr/${pnr}`);
}
