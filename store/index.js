// store/index.js
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import userReducer from './userSlice'; 
import bluetoothReducer from './bluetoothReducer'; 
import userSlice from './userSlice';
import currencySlice from './currencySlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    bluetooth: bluetoothReducer,
    currency: currencySlice,  
  },
  middleware: (getDefaultMiddleware) => [...getDefaultMiddleware()],
});
