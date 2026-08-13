import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDestinations } from '../services/destinationsApi';
import { tours as localTours } from '../data/tours';

const ratingMap = Object.fromEntries(localTours.map(t => [t.slug, { rating: t.rating, reviews: t.reviews }]));

export const loadDestinations = createAsyncThunk('tours/loadDestinations', (country) => fetchDestinations(country));

const toursSlice = createSlice({
  name: 'tours',
  initialState: {
    activeCategory: 'All',
    sortBy: 'default',
    currentPage: 1,
    destinations: [],
    loading: false,
    error: null,
  },
  reducers: {
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setPage: (state, action) => { state.currentPage = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDestinations.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadDestinations.fulfilled, (state, action) => {
        state.loading = false;
        state.destinations = action.payload.map(t => ({
          ...t,
          rating:  ratingMap[t.slug]?.rating  ?? t.rating  ?? 4.5,
          reviews: ratingMap[t.slug]?.reviews ?? t.reviews ?? 24,
        }));
      })
      .addCase(loadDestinations.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export const { setCategory, setSortBy, setPage } = toursSlice.actions;
export default toursSlice.reducer;

