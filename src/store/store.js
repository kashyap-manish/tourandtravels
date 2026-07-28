import { configureStore } from '@reduxjs/toolkit';
import toursReducer from './toursSlice';
import wishlistReducer from './wishlistSlice';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    wishlist: wishlistReducer,
  },
});
