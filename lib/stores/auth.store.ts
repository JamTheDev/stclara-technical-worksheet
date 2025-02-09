import { createSlice } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";
import {
  checkUserLoggedIn,
  loginUser,
  logoutUser,
  registerUser,
} from "../actions/auth.actions";
import { Status } from "@/types/status.types";

export type AuthStoreType = {
  user: User | undefined;
  isAuthenticated: boolean;
  checkingAuthStatus: Status;
  status: Status;
};

const initialState = {
  user: undefined,
  isAuthenticated: false,
  checkingAuthStatus: "idle",
  status: "idle",
} as AuthStoreType;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(checkUserLoggedIn.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated =
          action.payload.user != undefined || action.payload.user != null;
        state.status = "success";
        state.checkingAuthStatus = "success";
      })
      .addCase(checkUserLoggedIn.pending, (state, action) => {
        state.checkingAuthStatus = "loading";
      })
      .addCase(checkUserLoggedIn.rejected, (state, action) => {
        state.checkingAuthStatus = "error";
      })
      .addCase(registerUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user!;
        state.isAuthenticated = true;
        state.status = "success";
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.status = "error";
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.user = action.payload.data.user;
        state.isAuthenticated = true;
        state.status = "success";
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.status = "error";
      })
      .addCase(loginUser.pending, (state, action) => {
        state.status = "loading";
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        console.log("Logged out");
        state.user = undefined;
        state.isAuthenticated = false;
        state.checkingAuthStatus = "success";
      }).addDefaultCase((state, action) => {
        state.status = "idle";
        state.checkingAuthStatus = "idle";
      });
  },
});

export default authSlice.reducer;
