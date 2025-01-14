import { createSlice } from "@reduxjs/toolkit";

export const authModalSlice = createSlice({
  name: "AuthModal",
  initialState: {
    authModalOpen: false,
    authState: "signin",
  },
  reducers: {
    setAuthModalOpen: (state, action) => {
      state.authModalOpen = action.payload;
    },
    setAuthState: (state, action) => {
      state.authState = action.payload;
    },
  },
});

export const { setAuthModalOpen, setAuthState } = authModalSlice.actions;

export default authModalSlice.reducer;