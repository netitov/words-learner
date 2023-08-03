import { configureStore, createSlice } from '@reduxjs/toolkit';

// Изначальное состояние
const initialState = {
  isLoggedIn: false,
  userData: {
    email: '',
    login: '',
  },
};

// Создаем slice (кусок) состояния с помощью createSlice
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.isLoggedIn = true;
      state.userData = action.payload.userData;
    },
    logout(state) {
      state.isLoggedIn = false;
      state.userData = {};
    },
  },
});

// Экспортируем экшены из slice
export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
