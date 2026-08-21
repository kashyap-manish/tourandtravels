import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginCustomer, registerCustomer } from '../services/api';

const JWT_PATTERN = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;

const validateToken = (token) =>
  typeof token === 'string' && JWT_PATTERN.test(token) ? token : null;

const sanitizeUser = (u) => {
  if (!u || typeof u !== 'object') return null;
  return {
    _id:   typeof u._id   === 'string' ? u._id   : undefined,
    name:  typeof u.name  === 'string' ? u.name  : '',
    email: typeof u.email === 'string' ? u.email : '',
    role:  typeof u.role  === 'string' ? u.role  : 'customer',
    phone: typeof u.phone === 'string' ? u.phone : '',
    avatar:typeof u.avatar=== 'string' ? u.avatar: '',
  };
};

export const login = createAsyncThunk('auth/login', async (data, { rejectWithValue }) => {
  try {
    const res = await loginCustomer(data);
    const token = validateToken(res.data.token);
    if (!token) return rejectWithValue('Invalid session token received.');
    localStorage.setItem('token', token);
    return { token, user: sanitizeUser(res.data.user) };
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (data, { rejectWithValue }) => {
  try {
    const res = await registerCustomer(data);
    return res.data;
  } catch (e) {
    return rejectWithValue(e.response?.data?.message || 'Registration failed');
  }   
});

const token = validateToken(localStorage.getItem('token'));
if (!token) localStorage.removeItem('token');
let user = null;
try {
  const parsed = JSON.parse(localStorage.getItem('user'));
  user = sanitizeUser(parsed);
  if (!user) localStorage.removeItem('user');
} catch { localStorage.removeItem('user'); }

const authSlice = createSlice({
  name: 'auth',
  initialState: { user, token, loading: false, error: null },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    updateUser(state, action) {
      state.user = action.payload;
    },
    clearError(state) { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.user = action.payload.user;
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      })
      .addCase(login.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(register.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(register.fulfilled, (state) => { state.loading = false; })
      .addCase(register.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { logout, updateUser, clearError } = authSlice.actions;
export default authSlice.reducer;

