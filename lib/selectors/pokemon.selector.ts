import { createSelector } from "reselect";
import { PokemonState } from "../store";

const selectPokemonState = (state: PokemonState) => state.pokemons || {};

export const selectPokemonData = createSelector(
  [selectPokemonState],
  (pokemonState) => pokemonState
);
