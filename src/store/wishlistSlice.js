import { createSlice } from '@reduxjs/toolkit';

const saved = (() => {
  try { return JSON.parse(localStorage.getItem('wishlist')) || []; } catch { return []; }
})();

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: { items: saved, ids: saved.map(i => i.id) },
  reducers: {
    toggleWishlist: (state, action) => {
      const item = action.payload; // { id, type, title/name, img/photo, price, location, ... }
      const exists = state.ids.includes(item.id);
      if (exists) {
        state.items = state.items.filter(i => i.id !== item.id);
        state.ids   = state.ids.filter(i => i !== item.id);
      } else {
        state.items.push(item);
        state.ids.push(item.id);
      }
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
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
});

export const { toggleWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;

