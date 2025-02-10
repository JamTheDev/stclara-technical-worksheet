import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createPokemon,
  getPokemon,
  getAllPokemons,
  updatePokemon,
  deletePokemon,
  createPokemonReview,
} from "../actions/pokemon.actions";

interface Pokemon {
  id: string;
  attachment: string;
}

interface PokemonGalleryState {
  pokemons: Pokemon[];
  currentPokemon: Pokemon | null;
  loading: boolean;
  error: string | null;
}

const initialState: PokemonGalleryState = {
  pokemons: [],
  currentPokemon: null,
  loading: false,
  error: null,
};

const pokemonSlice = createSlice({
  name: "pokemon",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Create Pokemon
    builder.addCase(createPokemon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createPokemon.fulfilled,
      (state, action: PayloadAction<Pokemon>) => {
        state.loading = false;
        state.pokemons.push(action.payload);
      }
    );
    builder.addCase(createPokemon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get Pokemon
    builder.addCase(getPokemon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getPokemon.fulfilled,
      (state, action: PayloadAction<Pokemon>) => {
        state.loading = false;
        state.currentPokemon = action.payload;
      }
    );
    builder.addCase(getPokemon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All Pokemons
    builder.addCase(getAllPokemons.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getAllPokemons.fulfilled,
      (state, action: PayloadAction<Pokemon[]>) => {
        state.loading = false;
        state.pokemons = action.payload;
      }
    );
    builder.addCase(getAllPokemons.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Pokemon
    builder.addCase(updatePokemon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updatePokemon.fulfilled,
      (state, action: PayloadAction<Pokemon>) => {
        state.loading = false;
        state.pokemons = state.pokemons.map((pokemon) =>
          pokemon.id === action.payload.id ? action.payload : pokemon
        );
        if (
          state.currentPokemon &&
          state.currentPokemon.id === action.payload.id
        ) {
          state.currentPokemon = action.payload;
        }
      }
    );
    builder.addCase(updatePokemon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Pokemon
    builder.addCase(deletePokemon.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deletePokemon.fulfilled,
      (state, action: PayloadAction<Pokemon>) => {
        state.loading = false;
        state.pokemons = state.pokemons.filter(
          (pokemon) => pokemon.id !== action.payload.id
        );
        if (
          state.currentPokemon &&
          state.currentPokemon.id === action.payload.id
        ) {
          state.currentPokemon = null;
        }
      }
    );
    builder.addCase(deletePokemon.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Pokemon Review
    builder.addCase(createPokemonReview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createPokemonReview.fulfilled, (state) => {
      state.loading = false;
      // Update reviews if needed
    });
    builder.addCase(createPokemonReview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const pokemonReducer = pokemonSlice.reducer;
