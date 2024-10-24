import { adminSchema } from "@/lib/schema";
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
export interface IAuthState {
  isLoggedIn: boolean;
  user: adminSchema;
}

const initialState: IAuthState = {
  isLoggedIn: false,
  user: {
    name: "",
    email: "",
    password: "",
    profilePhoto: "",
    role: "user",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<adminSchema>) => {
      state.isLoggedIn = true;
      state.user.email = action.payload.email;
      state.user.name = action.payload.name;
      state.user.role = action.payload.role;
      state.user.profilePhoto = action.payload.profilePhoto;
    },
    logoutUser: (state) => {
      state.isLoggedIn = false;
      state.user = initialState.user;
    },
  },
});

export const { loginUser, logoutUser } = authSlice.actions;
export const authReducer = authSlice.reducer;
