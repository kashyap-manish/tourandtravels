import axios from 'axios';

const BASE_URL = '/aviationstack';
const ACCESS_KEY = import.meta.env.VITE_API_KEY;

const flightApi = axios.create({ baseURL: BASE_URL });

// Flight Status
export const getFlightStatus = (flightIata) =>
  flightApi.get('/flights', { params: { access_key: ACCESS_KEY, flight_iata: flightIata } });

// Flight Schedules (free plan only supports dep_iata filter)
export const getFlightSchedules = (depIata) =>
  flightApi.get('/flights', { params: { access_key: ACCESS_KEY, dep_iata: depIata } });

// Airline Information
export const getAirlines = (search) => {
  const isIata = search.length <= 3;
  const params = isIata
    ? { access_key: ACCESS_KEY, iata_code: search.toUpperCase() }
    : { access_key: ACCESS_KEY, airline_name: search };
  return flightApi.get('/airlines', { params });
};

// Airport Information
export const getAirports = (search) => {
  const isIata = search.length <= 3;
  const params = isIata
    ? { access_key: ACCESS_KEY, iata_code: search.toUpperCase() }
    : { access_key: ACCESS_KEY, airport_name: search };
  return flightApi.get('/airports', { params });
};
