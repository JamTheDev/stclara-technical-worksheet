import { generateCUID } from "@/utils/cuid";
import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Helper: Construct file path from id and original file extension
const getFilePath = (id: string, fileName: string) => {
  const ext = fileName.split(".").pop();
  return `attachments/${id}.${ext}`;
};

// Create and upload a new Attachment (image)
export const createAttachment = createAsyncThunk(
  "attachments/create",
  async ({ file }: { file: File }, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const id = generateCUID();
    const filePath = getFilePath(id, file.name);

    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file);
    if (uploadError) {
      console.error(uploadError);
      return rejectWithValue(uploadError.message);
    }
    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const newAttachment = {
      id,
      url: publicUrl,
      name: file.name,
      createdAt: new Date(),
      createdById: session.data.session.user.id,
    };

    const { data, error } = await supabase
      .from("Attachment")
      .insert(newAttachment)
      .select("*")
      .single();
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }

    return data;
  }
);

export const getAttachment = createAsyncThunk(
  "attachments/get",
  async (id: string, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("Attachment")
      .select("*")
      .match({ id, createdById: session.data.session.user.id })
      .single();
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getAllAttachments = createAsyncThunk(
  "attachments/getAll",
  async (
    params: {
      search?: string;
      sortDateAsc: boolean;
      sortByName: boolean;
    } = {
        sortDateAsc: false,
        sortByName: false,
    },
    { rejectWithValue }
  ) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    let query = supabase
      .from("Attachment")
      .select("*")
      .match({ createdById: session.data.session.user.id });

    if (params.search) {
      query = query.ilike("name", `%${params.search}%`);
    }

    query = query
      .order("name", { ascending: params.sortByName })
      .order("createdAt", { ascending: params.sortDateAsc });

    const { data, error } = await query;
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const updateAttachment = createAsyncThunk(
  "attachments/update",
  async ({ id, file }: { id: string; file: File }, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const filePath = getFilePath(id, file.name);
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, file, { upsert: true });
    if (uploadError) {
      console.error(uploadError);
      return rejectWithValue(uploadError.message);
    }

    const { data: publicUrlData } = supabase.storage
      .from("images")
      .getPublicUrl(filePath);
    const publicUrl = publicUrlData.publicUrl;

    const { data, error } = await supabase
      .from("Attachment")
      .update({ url: publicUrl })
      .eq("id", id)
      .eq("createdById", session.data.session.user.id)
      .select("*")
      .single();
      
    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const deleteAttachment = createAsyncThunk(
  "attachments/delete",
  async (id: string, { rejectWithValue }) => {
    const supabase = await createClient();
    const session = await supabase.auth.getSession();
    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data: attachment, error: fetchError } = await supabase
      .from("Attachment")
      .select("*")
      .eq("id", id)
      .eq("createdById", session.data.session.user.id)
      .single();

    if (fetchError) {
      console.error(fetchError);
      return rejectWithValue(fetchError.message);
    }

    const urlParts = attachment.url.split("/");
    const filePath = urlParts.slice(-2).join("/");

    const { error: deleteFileError } = await supabase.storage
      .from("images")
      .remove([filePath]);
    if (deleteFileError) {
      console.error(deleteFileError);
      return rejectWithValue(deleteFileError.message);
    }

    const { data, error } = await supabase
      .from("Attachment")
      .delete()
      .eq("id", id)
      .select()
      .single();

    console.log(data);

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);
