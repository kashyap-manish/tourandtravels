import { configureStore } from '@reduxjs/toolkit';
import toursReducer from './toursSlice';
import wishlistReducer from './wishlistSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    tours: toursReducer,
    wishlist: wishlistReducer,
    auth: authReducer,
  },
});
