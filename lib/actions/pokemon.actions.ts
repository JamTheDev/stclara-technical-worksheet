import { generateCUID } from "@/utils/cuid";
import { createClient } from "@/utils/supabase/client";
import { createAsyncThunk } from "@reduxjs/toolkit";

const getFilePath = (id: string, fileName: string) => {
    const ext = fileName.split(".").pop();
    return `pokemongallery/${id}.${ext}`;
};

export const createPokemon = createAsyncThunk(
    "pokemon/createPokemon",
    async ({ file, name }: { file: File; name: string }, { rejectWithValue }) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const id = generateCUID();
        const filePath = getFilePath(id, file.name);

        const { error: uploadError } = await supabase.storage
            .from("pokemongallery")
            .upload(filePath, file);
        if (uploadError) {
            console.error(uploadError);
            return rejectWithValue(uploadError.message);
        }

        const { data: publicUrlData } = supabase.storage
            .from("pokemongallery")
            .getPublicUrl(filePath);
        const publicUrl = publicUrlData.publicUrl;

        const newPokemon = {
            id,
            attachment: publicUrl,
            name,
        };

        const { data, error } = await supabase
            .from("Pokemon")
            .insert(newPokemon)
            .select("*")
            .single();
        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
        return data;
    }
);

export const getPokemon = createAsyncThunk(
    "pokemon/getPokemon",
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
        const supabase = await createClient();
        let query = supabase.from("Pokemon").select("*");

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

export const getAllPokemons = createAsyncThunk(
    "pokemon/getAllPokemons",
    async (_, { rejectWithValue }) => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("Pokemon")
            .select(`*, reviews:Review(*)`)
            .limit(3, { foreignTable: "Review" });
        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
        return data;
    }
);

export const updatePokemon = createAsyncThunk(
    "pokemon/updatePokemon",
    async (
        { id, file, name }: { id: string; file?: File; name?: string },
        { rejectWithValue }
    ) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        let publicUrl;

        if (file) {
            const filePath = getFilePath(id, file.name);
            const { error: uploadError } = await supabase.storage
                .from("pokemongallery")
                .upload(filePath, file, { upsert: true });
            if (uploadError) {
                console.error(uploadError);
                return rejectWithValue(uploadError.message);
            }

            const { data: publicUrlData } = supabase.storage
                .from("pokemongallery")
                .getPublicUrl(filePath);
            publicUrl = publicUrlData.publicUrl;
        }

        const { data, error } = await supabase
            .from("Pokemon")
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

export const deletePokemon = createAsyncThunk(
    "pokemon/deletePokemon",
    async (id: string, { rejectWithValue }) => {
        const supabase = await createClient();

        const { data: pokemon, error: fetchError } = await supabase
            .from("Pokemon")
            .select("*")
            .eq("id", id)
            .single();

        if (fetchError) {
            console.error(fetchError);
            return rejectWithValue(fetchError.message);
        }

        const urlParts = pokemon.attachment.split("/");
        const filePath = urlParts.slice(-2).join("/");

        const { error: deleteFileError } = await supabase.storage
            .from("pokemongallery")
            .remove([filePath]);
        if (deleteFileError) {
            console.error(deleteFileError);
            return rejectWithValue(deleteFileError.message);
        }

        const { data, error } = await supabase
            .from("Pokemon")
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

export const createPokemonReview = createAsyncThunk(
    "pokemon/createPokemonReview",
    async (
        { pokemonId, content }: { pokemonId: string; content: string },
        { rejectWithValue }
    ) => {
        const supabase = await createClient();
        const session = await supabase.auth.getSession();
        if (!session.data.session) {
            return rejectWithValue("User is not logged in");
        }

        const review = {
            id: generateCUID(),
            content,
            createdAt: new Date(),
            createdById: session.data.session.user.id,
            pokemonId,
            foodId: null,
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

export const deletePokemonReview = createAsyncThunk(
    "pokemon/deletePokemonReview",
    async (id: string, { rejectWithValue }) => {
        const supabase = await createClient();
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

export const getFirstThreePokemonReviews = createAsyncThunk(
    "pokemon/getFirstThreePokemonReviews",
    async (pokemonId: string, { rejectWithValue }) => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("Review")
            .select("*")
            .eq("pokemonId", pokemonId)
            .eq("foodId", null)
            .order("createdAt", { ascending: false })
            .range(0, 2);
        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
        return data;
    }
);

export const getPokemonReviews = createAsyncThunk(
    "pokemon/getPokemonReviews",
    async (pokemonId: string, { rejectWithValue }) => {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("Review")
            .select("*")
            .eq("pokemonId", pokemonId);

        if (error) {
            console.error(error);
            return rejectWithValue(error.message);
        }
        return data;
    }
);