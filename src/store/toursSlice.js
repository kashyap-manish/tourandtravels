import { createSlice } from '@reduxjs/toolkit';

const toursSlice = createSlice({
  name: 'tours',
  initialState: {
    activeCategory: 'All',
    sortBy: 'default',
    currentPage: 1,
  },
  reducers: {
    setCategory: (state, action) => {
      state.activeCategory = action.payload;
      state.currentPage = 1;
    },
    setSortBy: (state, action) => { state.sortBy = action.payload; },
    setPage: (state, action) => { state.currentPage = action.payload; },
  },
});

export const { setCategory, setSortBy, setPage } = toursSlice.actions;
export default toursSlice.reducer;
