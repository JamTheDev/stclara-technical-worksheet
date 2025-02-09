import { createAsyncThunk } from "@reduxjs/toolkit";
import { createClient } from "@/utils/supabase/client";
import { LoginCredential } from "@/types/auth.types";

export const loginUser = createAsyncThunk(
  "auth/login",
  async ({ email, password }: LoginCredential, { rejectWithValue }) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return rejectWithValue(error.message);

    return { data };
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (credentials: any, { rejectWithValue }) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
    });

    if (error) return rejectWithValue(error.message);

    const loginResult = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });

    if (loginResult.error) return rejectWithValue(loginResult.error.message);

    const profileResult = await supabase.from("Profile").upsert({
      userId: data?.user?.id,
      fullname: credentials.name,
    });

    if (profileResult.error)
      return rejectWithValue(profileResult.error.message);

    return { data };
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();

    if (error) return rejectWithValue(error.message);

    localStorage.removeItem("persist:root");

    return {};
  }
);

export const checkUserLoggedIn = createAsyncThunk(
  "auth/checkLoggedIn",
  async (_, { rejectWithValue }) => {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.getSession();

    if (error) return rejectWithValue(error.message);
    if (data.session) {
      console.log(data.session.user ? "user logged in" : "no");
      return { user: data.session.user };
    }

    return rejectWithValue("User not logged in");
  }
);
