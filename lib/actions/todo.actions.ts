import { generateCUID } from "@/utils/cuid";
import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

// Create a new Todo
export const createTodo = createAsyncThunk(
    "todos/create",
    async (
        {
            title,
            description = null,
            dueDate = null,
        }: { title: string; description?: string | null; dueDate?: Date | null },
        { rejectWithValue }
    ) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const newTodo = {
            id: generateCUID(),
            userId: session.data.session.user.id,
            title,
            description,
            completed: false,
            createdAt: new Date(),
            dueDate,
        };

        const { data, error } = await supabase.from("Todo").insert(newTodo).select("*").single();

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }

        return data;
    }
);

// Get a single Todo by its id
export const getTodo = createAsyncThunk(
    "todos/get",
    async (id: string, { rejectWithValue }) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const { data, error } = await supabase
            .from("Todo")
            .select("*")
            .match({ id, userId: session.data.session.user.id })
            .single();

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }

        return data;
    }
);

// Get all Todos for the logged in user
export const getAllTodos = createAsyncThunk(
    "todos/getAll",
    async (_, { rejectWithValue }) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const { data, error } = await supabase
            .from("Todo")
            .select("*")
            .match({ userId: session.data.session.user.id });

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }

        return data;
    }
);

// Update an existing Todo
export const updateTodo = createAsyncThunk(
    "todos/update",
    async (
        {
            id,
            title,
            description,
            completed,
            dueDate,
        }: { id: string; title: string; description?: string | null; completed: boolean; dueDate?: Date | null },
        { rejectWithValue }
    ) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const updates = {
            title,
            description,
            completed,
            dueDate,
        };

        const { data, error } = await supabase
            .from("Todo")
            .update(updates)
            .eq("id", id)
            .eq("userId", session.data.session.user.id)
            .select("*")
            .single();

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }

        return data;
    }
);

// Delete a Todo
export const deleteTodo = createAsyncThunk(
    "todos/delete",
    async (id: string, { rejectWithValue }) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();

        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const { data, error } = await supabase
            .from("Todo")
            .delete()
            .eq("id", id)
            .eq("userId", session.data.session.user.id)
            .select()
            .single();

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }

        return data;
    }
);