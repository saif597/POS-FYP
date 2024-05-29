import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userId: '',
  username: '',
  role: '',
  storeId: '',
  storeName: '', 
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserDetails: (state, action) => {
      const { userId, username, role, storeId, storeName } = action.payload;
      state.userId = userId;
      state.username = username;
      state.role = role;
      state.storeId = storeId; 
      state.storeName = storeName; 
    },
    clearUserDetails: (state) => {
      state.userId = '';
      state.username = '';
      state.role = '';
      state.storeId = ''; 
      state.storeName = ''; 
      
    },
  },
});

export const { setUserDetails, clearUserDetails } = userSlice.actions;
export default userSlice.reducer;
