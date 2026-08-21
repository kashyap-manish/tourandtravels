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

const SAFE_ID = /^[a-zA-Z0-9_-]{1,64}$/;
const safeId = (id) => {
  const str = String(id ?? '');
  if (!str || !SAFE_ID.test(str)) throw new Error(`Invalid ID: ${id}`);
  return encodeURIComponent(str);
};

// Auth
export const loginCustomer = (data) => api.post('/auth/login/customer', data);
export const registerCustomer = (data) => api.post('/auth/register/customer', data);
export const verifyEmail = (data) => api.post('/auth/verify-email', data);
export const resendOtp = (data) => api.post('/auth/resend-otp', data);
export const getMe = () => api.get('/auth/me');

// Tours
export const getTours = (params) => api.get('/tours', { params });
export const getTourById = (id) => api.get(`/tours/${safeId(id)}`);

// Bookings
export const createBooking = (data) => api.post('/bookings', data);
export const getMyBookings = () => api.get('/bookings');
export const getBookingById = (id) => api.get(`/bookings/${safeId(id)}`);
export const cancelBooking = (id) => api.put(`/bookings/${safeId(id)}/cancel`);

// Reviews
export const getReviews = (tourId) => api.get(`/reviews/${safeId(tourId)}`);
export const addReview = (tourId, data) => api.post(`/reviews/${safeId(tourId)}`, data);

// Wishlist
export const getWishlist = () => api.get('/wishlist');
export const toggleWishlist = (tourId) => api.post(`/wishlist/toggle/${safeId(tourId)}`);
export const toggleWishlistHotel = (data) => api.post('/wishlist/toggle-hotel', data);

// Contact
export const sendContact = (data) => api.post('/contact', data);

// Profile
export const getProfile = () => api.get('/profile');
export const updateProfile = (data) => api.put('/profile', data);

// Admin
export const adminGetBookings = (params) => api.get('/admin/bookings', { params });
export const adminUpdateBookingStatus = (id, status) => api.put(`/admin/bookings/${safeId(id)}/status`, { status });

// Payment
export const createPaymentOrder = (amount) => api.post('/payment/order', { amount });
export const verifyPayment = (data) => api.post('/payment/verify', data);

// Newsletter
export const subscribeNewsletter = (email) => api.post('/newsletter', { email });

export default api;

