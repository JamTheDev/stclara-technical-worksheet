import { generateCUID } from "@/utils/cuid";
import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const upsertMarkdownNote = createAsyncThunk(
  "markdown/create",
  async (
    {
      id,
      markdownFile,
      name,
      createdAt,
    }: { id?: string; markdownFile: File; name: string; createdAt?: Date },
    { rejectWithValue }
  ) => {
    const supabase = await createClient();
    const dateUploaded = Date.now().toString();
    const { data, error } = await supabase.storage
      .from("markdownNotes")
      .upload(`markdown/${markdownFile.name}_${dateUploaded}`, markdownFile);

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("markdownNotes")
      .getPublicUrl(`markdown/${markdownFile.name}_${dateUploaded}`);

    const { data: noteUploadData, error: noteUploadError } = await supabase
      .from("Note")
      .upsert({
        id: id ?? generateCUID(),
        name: name,
        attachment: publicUrlData.publicUrl,
        createdAt: (createdAt ?? new Date()).toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (noteUploadError) {
      console.error(noteUploadError);
      return rejectWithValue(noteUploadError.message);
    }

    return noteUploadData;
  }
);

export const getMarkdownNote = createAsyncThunk(
  "markdown/get",
  async (id: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("Note")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      return error.message;
    }

    return data;
  }
);

export const getAllMarkdownNotes = createAsyncThunk(
  "markdown/getAll",
  async () => {
    const supabase = await createClient();

    const { data, error } = await supabase.from("Note").select("*");

    if (error) {
      console.error(error);
      return error.message;
    }

    return data;
  }
);

export const deleteMarkdownNote = createAsyncThunk(
  "markdown/delete",
  async (noteId: string) => {
    const supabase = await createClient();

    const { data, error } = await supabase
      .from("Note")
      .delete()
      .eq("id", noteId)
      .select()
      .single();

    if (error) {
      console.error(error);
      return error.message;
    }

    return data;
  }
);
