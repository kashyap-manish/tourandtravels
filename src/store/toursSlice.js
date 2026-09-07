import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchDestinations } from '../services/destinationsApi';

export const loadDestinations = createAsyncThunk('tours/loadDestinations', (params) => fetchDestinations(params));

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
          _id: t._id,
          rating: t.rating ?? 4.5,
          reviews: t.reviewCount ?? t.reviews ?? 0,
        }));
      })
      .addCase(loadDestinations.rejected, (state, action) => { state.loading = false; state.error = action.error.message; });
  },
});

export const { setCategory, setSortBy, setPage } = toursSlice.actions;
export default toursSlice.reducer;

