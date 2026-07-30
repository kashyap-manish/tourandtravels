import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
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

// Tours
export const getTours = (params) => api.get('/tours', { params });
export const getTourById = (id) => api.get(`/tours/${id}`);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${id}`);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`);

// Reviews
export const getReviews = (tourId) => api.get(`/reviews/${tourId}`);
export const addReview = (tourId, data) => api.post(`/reviews/${tourId}`, data);

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const toggleWishlist = (tourId) => api.post(`/wishlist/toggle/${tourId}`);

// Contact
export const sendContact = (data) => api.post('/contact', data);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

export default api;
