import { generateCUID } from "@/utils/cuid";
import { createClient } from "@/utils/supabase/client";
import { Prisma } from "@prisma/client";
import { createAsyncThunk } from "@reduxjs/toolkit";



export const upsertSecret = createAsyncThunk(
  "secrets/create",
  async (message: string, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    if (session.data.session === null) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("Secret")
      .select("userId, id")
      .match({ userId: session.data.session.user.id })
      .single();

    if (error) {
      console.error(error);
    }

    let result;

    if (data === null) {
      result = await supabase.from("Secret").insert({
        id: generateCUID(),
        userId: session.data.session.user.id,
        message: message,
        created_at: new Date(),
        updated_at: new Date(),
      });
    } else {
      result = await supabase
        .from("Secret")
        .update({
          userId: data.userId,
          message: message,
          updated_at: new Date(),
        })
        .eq("id", data.id)
        .select("*");
    }

    if (result.error) {
      console.error(result.error);
      return rejectWithValue(result.error.message);
    }

    return result.data;
  }
);
export const getSecret = createAsyncThunk(
  "secrets/get",
  async (userId: string | null, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const idToUse = userId || session.data.session.user.id;

    const { data, error } = await supabase
      .from("Secret")
      .select("*")
      .match({ userId: idToUse })
      .single();

    if (error) {
      console.log(error);
      return rejectWithValue(error.message);
    }

    console.log(data);

    return data;
  }
);

export const clearSecret = createAsyncThunk(
  "secrets/clear",
  async (_, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("Secret")
      .delete()
      .match({ userId: session.data.session.user.id })
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const getAllSecrets = createAsyncThunk(
  "secrets/getAll",
  async (_, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("Secret")
      .select("*")
      .match({ userId: session.data.session.user.id });

    if (error) {
      return rejectWithValue(error.message);
    }

    return data;
  }
);
