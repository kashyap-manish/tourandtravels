import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auth
export const loginCustomer = (data) => api.post('/auth/login/customer', data);
export const registerCustomer = (data) => api.post('/auth/register/customer', data);
export const getMe = () => api.get('/auth/me');

// Buses / Tours
export const getBuses = () => api.get('/buses');
export const getBusById = (id) => api.get(`/buses/${id}`);
export const searchBuses = (params) => api.get('/buses/search', { params });
export const getBookedSeats = (busId, date) => api.get(`/buses/${busId}/booked-seats`, { params: { date } });

// Cities
export const getCities = () => api.get('/cities');

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);

// Banners
export const getBanners = () => api.get('/banners');

// FAQs
export const getFaqs = () => api.get('/faqs');

// Policies
export const getPolicies = () => api.get('/policies');

// Pages
export const getPages = () => api.get('/pages');

// Settings
export const getSettings = () => api.get('/settings');

// Reviews
export const getReviews = (busId) => api.get(`/reviews/${busId}`);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

export default api;
