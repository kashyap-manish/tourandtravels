import axios from 'axios';

const BASE_URL = '/airlabs';
const API_KEY = '6ac491173d8f2cfd296c232e';

const flightApi = axios.create({ baseURL: BASE_URL });

// Normalize AirLabs flight to match the shape Flight.jsx expects
function normalizeFlights(data = []) {
  return data.map(f => ({
    flight_date: f.dep_time?.slice(0, 10) || null,
    flight_status: f.status === 'en-route' ? 'active' : f.status === 'landed' ? 'landed' : f.status || 'scheduled',
    departure: {
      iata: f.dep_iata,
      icao: f.dep_icao,
      airport: f.dep_name,
      terminal: f.dep_terminal,
      gate: f.dep_gate,
      scheduled: f.dep_time,
      actual: f.dep_actual,
      estimated: f.dep_estimated,
      delay: f.delayed,
      timezone: f.dep_time_utc,
    },
    arrival: {
      iata: f.arr_iata,
      icao: f.arr_icao,
      airport: f.arr_name,
      terminal: f.arr_terminal,
      gate: f.arr_gate,
      baggage: f.arr_baggage,
      scheduled: f.arr_time,
      actual: f.arr_actual,
      estimated: f.arr_estimated,
      delay: f.arr_delayed,
      timezone: f.arr_time_utc,
    },
    airline: { name: f.airline_name, iata: f.airline_iata, icao: f.airline_icao },
    flight: { iata: f.flight_iata, icao: f.flight_icao, number: f.flight_number },
    aircraft: { iata: f.aircraft_icao, registration: f.reg_number },
    live: f.lat ? {
      latitude: f.lat,
      longitude: f.lng,
      altitude: f.alt,
      speed_horizontal: f.speed,
    } : null,
  }));
}

// Flight Status
export const getFlightStatus = async (flightIata) => {
  const res = await flightApi.get('/flight', { params: { api_key: API_KEY, flight_iata: flightIata } });
  return { data: { data: normalizeFlights(res.data.response ? [res.data.response] : []) } };
};

// Flight Schedules
export const getFlightSchedules = async (depIata) => {
  const res = await flightApi.get('/schedules', { params: { api_key: API_KEY, dep_iata: depIata } });
  return { data: { data: normalizeFlights(res.data.response || []) } };
};

// Airline Information
export const getAirlines = async (search) => {
  const isIata = search.length <= 3;
  const params = isIata
    ? { api_key: API_KEY, iata_code: search.toUpperCase() }
    : { api_key: API_KEY, name: search };
  const res = await flightApi.get('/airlines', { params });
  const data = (res.data.response || []).map(a => ({
    airline_name: a.name,
    iata_code: a.iata_code,
    icao_code: a.icao_code,
    country_name: a.country,
    fleet_average_age: a.fleet_average_age || 1,
  }));
  return { data: { data } };
};

// Airport Information
export const getAirports = async (search) => {
  const isIata = search.length <= 3;
  const params = isIata
    ? { api_key: API_KEY, iata_code: search.toUpperCase() }
    : { api_key: API_KEY, name: search };
  const res = await flightApi.get('/airports', { params });
  const data = (res.data.response || []).map(a => ({
    airport_name: a.name,
    iata_code: a.iata_code,
    icao_code: a.icao_code,
    city_iata_code: a.city_code,
    country_name: a.country,
    timezone: a.timezone,
  }));
  return { data: { data } };
};
