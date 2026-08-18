import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toggleWishlist as toggleWishlistApi, toggleWishlistHotel } from '../services/api';

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
})();

export const toggleWishlistAsync = createAsyncThunk(
  'wishlist/toggle',
  async (item, { rejectWithValue }) => {
    try {
      if (item.type === 'tour') await toggleWishlistApi(item.id);
      else await toggleWishlistHotel({ id: item.id, title: item.title, img: item.img, price: item.price, location: item.location, stars: item.stars, website: item.website });
      return item;
    } catch (e) {
      return rejectWithValue(e.response?.data?.message || 'Failed to update wishlist');
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: saved, ids: saved.map(i => i.id) },
  reducers: {
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(i => i.id !== action.payload);
      state.ids   = state.ids.filter(i => i !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    clearWishlist: (state) => {
      state.items = [];
      state.ids   = [];
      localStorage.removeItem('wishlist');
    },
  },
  extraReducers: (builder) => {
    builder.addCase(toggleWishlistAsync.fulfilled, (state, action) => {
      const item = action.payload;
      const exists = state.ids.includes(item.id);
      if (exists) {
        state.items = state.items.filter(i => i.id !== item.id);
        state.ids   = state.ids.filter(i => i !== item.id);
      } else {
        state.items.push(item);
        state.ids.push(item.id);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    });
  },
});

export const { removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
