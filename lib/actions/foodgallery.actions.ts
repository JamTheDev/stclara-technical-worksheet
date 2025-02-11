import { generateCUID } from "@/utils/cuid";
import { createProdClient } from "@/utils/supabase/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getFilePath = (id: string, fileName: string) => {
  const ext = fileName.split(".").pop();
  return `foodgallery/${id}.${ext}`;
};

export const createFood = createAsyncThunk(
  "foodgallery/createFood",
  async ({ file, name }: { file: File; name: string }, { rejectWithValue }) => {
    const supabase = await createProdClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const id = generateCUID();
    const filePath = getFilePath(id, file.name);

    const { error: uploadError } = await supabase.storage
      .from("foodgallery")
      .upload(filePath, file);
    if (uploadError) {
      console.error(uploadError);
      return rejectWithValue(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("foodgallery")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const newFood = {
      id,
      attachment: publicUrl,
      name: name,
    };

    const { data, error } = await supabase
      .from("Food")
      .insert(newFood)
      .select("*")
      .single();
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getFood = createAsyncThunk(
  "foodgallery/getFood",
  async (
    {
      id,
      sortByName,
      sortByUploadDate,
    }: {
      id?: string;
      sortByName?: "asc" | "desc";
      sortByUploadDate?: "asc" | "desc";
    },
    { rejectWithValue }
  ) => {
    const supabase = await createProdClient();
    let query = supabase.from("Food").select("*");

    if (id) {
      query = query.eq("id", id);
    }

    if (sortByName) {
      query = query.order("name", { ascending: sortByName === "asc" });
    }

    if (sortByUploadDate) {
      query = query.order("uploadDate", {
        ascending: sortByUploadDate === "asc",
      });
    }

    const { data, error } = id ? await query.single() : await query;
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getAllFoods = createAsyncThunk(
  "foodgallery/getAllFoods",
  async (_, { rejectWithValue }) => {
    const supabase = await createProdClient();
    const { data, error } = await supabase
      .from("Food")
      .select(`*, reviews:Review(*)`)
      .limit(3, { foreignTable: "Review" });
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const updateFood = createAsyncThunk(
  "foodgallery/updateFood",
  async (
    { id, file, name }: { id: string; file?: File; name?: string },
    { rejectWithValue }
  ) => {
    const supabase = await createProdClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    let publicUrl;

    if (file) {
      const filePath = getFilePath(id, file.name);
      const { error: uploadError } = await supabase.storage
        .from("foodgallery")
        .upload(filePath, file, { upsert: true });
      if (uploadError) {
        console.error(uploadError);
        return rejectWithValue(uploadError.message);
      }

      const { data: publicUrlData } = supabase.storage
        .from("foodgallery")
        .getPublicUrl(filePath);
      publicUrl = publicUrlData.publicUrl;
    }

    const { data, error } = await supabase
      .from("Food")
      .update({ attachment: publicUrl, name })
      .eq("id", id)
      .select("*")
      .single();
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const deleteFood = createAsyncThunk(
  "foodgallery/deleteFood",
  async (id: string, { rejectWithValue }) => {
    const supabase = await createProdClient();

    const { data: food, error: fetchError } = await supabase
      .from("Food")
      .select("*")
      .eq("id", id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return rejectWithValue(fetchError.message);
    }

    const urlParts = food.attachment.split("/");
    const filePath = urlParts.slice(-2).join("/");

    const { error: deleteFileError } = await supabase.storage
      .from("foodgallery")
      .remove([filePath]);
    if (deleteFileError) {
      console.error(deleteFileError);
      return rejectWithValue(deleteFileError.message);
    }

    const { data, error } = await supabase
      .from("Food")
      .delete()
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const createFoodReview = createAsyncThunk(
  "foodgallery/createFoodReview",
  async (
    { foodId, content }: { foodId: string; content: string },
    { rejectWithValue }
  ) => {
    const supabase = await createProdClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const review = {
      id: generateCUID(),
      content,
      createdAt: new Date(),
      createdById: session.data.session.user.id,
      foodId,
      pokemonId: null, // for food reviews, we set pokemonId to null
    };

    const { data, error } = await supabase
      .from("Review")
      .insert(review)
      .select("*")
      .single();

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const deleteFoodReview = createAsyncThunk(
  "foodgallery/deleteFoodReview",
  async (id: string, { rejectWithValue }) => {
    const supabase = await createProdClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }
    const userId = session.data.session.user.id;

    const { data, error } = await supabase
      .from("Review")
      .delete()
      .eq("id", id)
      .eq("createdById", userId)
      .select()
      .single();

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getFirstThreeFoodReviews = createAsyncThunk(
  "foodgallery/getFirstThreeFoodReviews",
  async (foodId: string, { rejectWithValue }) => {
    const supabase = await createProdClient();
    const { data, error } = await supabase
      .from("Review")
      .select("*")
      .eq("foodId", foodId)
      .eq("pokemonId", null)
      .order("createdAt", { ascending: false })
      .range(0, 2);

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getFoodReviews = createAsyncThunk(
  "foodgallery/getFoodReviews",
  async (foodId: string, { rejectWithValue }) => {
    const supabase = await createProdClient();
    const { data, error } = await supabase
      .from("Review")
      .select("*")
      .eq("foodId", foodId);

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);
