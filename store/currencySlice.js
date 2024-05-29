// store/currencySlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: '', // Initial state for currency value
};

const currencySlice = createSlice({
  name: 'currency',
  initialState,
  reducers: {
    // Action to update currency
    updateCurrency: (state, action) => {
      state.value = action.payload;
    },
  },
});

export const { updateCurrency } = currencySlice.actions;

export default currencySlice.reducer;
 