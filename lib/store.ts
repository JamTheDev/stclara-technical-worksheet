import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./stores/auth.store";
import secretsSlice from "./stores/secrets.store";
import friendsSlice from "./stores/friends.store";
import attachmentSlice from "./stores/attachment.store";
import { pokemonReducer } from "./stores/pokemon.store";
import { foodgalleryReducer } from "./stores/foodgallery.store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authListenerMiddleware } from "./listeners/auth.listener";
import { checkUserLoggedIn } from "./actions/auth.actions";
import { todoReducer } from "./stores/todo.store";
import markdownReducer, { markdownSlice } from "./stores/markdown.store";

export const makeAuthStore = () => {
  return configureStore({
    reducer: {
      auth: authSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(authListenerMiddleware.middleware),
  });
};

export const makeSecretsStore = () => {
  return configureStore({
    reducer: {
      secrets: secretsSlice,
      friends: friendsSlice,
    },
  });
};

export const makeTodolistStore = () => {
  return configureStore({
    reducer: {
      todos: todoReducer,
    },
  });
};

export const makeAttachmentStore = () => {
  return configureStore({
    reducer: {
      attachments: attachmentSlice,
    },
  });
};

export const makeFoodGalleryStore = () => {
  return configureStore({
    reducer: {
      foodgallery: foodgalleryReducer,
    },
  });
};

export const makePokemonStore = () => {
  return configureStore({
    reducer: {
      pokemons: pokemonReducer,
    },
  });
};

export const makeMarkdownStore = () => {
  return configureStore({
    reducer: {
      markdown: markdownReducer,
    },
  });
}

const authStore = makeAuthStore();
const secretsStore = makeSecretsStore();
const todolistStore = makeTodolistStore();
const attachmentStore = makeAttachmentStore();
const foodGalleryStore = makeFoodGalleryStore();
const pokemonStore = makePokemonStore();
const markdownStore = makeMarkdownStore();

authStore.dispatch(checkUserLoggedIn());

export type AuthState = ReturnType<typeof authStore.getState>;
export type SecretsState = ReturnType<typeof secretsStore.getState>;
export type TodolistState = ReturnType<typeof todolistStore.getState>;
export type AttachmentState = ReturnType<typeof attachmentStore.getState>;
export type FoodGalleryState = ReturnType<typeof foodGalleryStore.getState>;
export type PokemonState = ReturnType<typeof pokemonStore.getState>;
export type MarkdownState = ReturnType<typeof markdownStore.getState>;

export type AppDispatch = typeof authStore.dispatch;
export type SecretsDispatch = typeof secretsStore.dispatch;
export type TodolistDispatch = typeof todolistStore.dispatch;
export type AttachmentDispatch = typeof attachmentStore.dispatch;
export type FoodGalleryDispatch = typeof foodGalleryStore.dispatch;
export type PokemonDispatch = typeof pokemonStore.dispatch;
export type MarkdownDispatch = typeof markdownStore.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<AuthState> = useSelector;

export const useSecretsDispatch = () => useDispatch<SecretsDispatch>();
export const useSecretsSelector: TypedUseSelectorHook<SecretsState> =
  useSelector;

export const useTodolistDispatch = () => useDispatch<AppDispatch>();
export const useTodolistSelector: TypedUseSelectorHook<TodolistState> =
  useSelector;

export const useAttachmentDispatch = () => useDispatch<AttachmentDispatch>();
export const useAttachmentSelector: TypedUseSelectorHook<AttachmentState> =
  useSelector;

export const useFoodGalleryDispatch = () => useDispatch<FoodGalleryDispatch>();
export const useFoodGallerySelector: TypedUseSelectorHook<FoodGalleryState> =
  useSelector;

export const usePokemonDispatch = () => useDispatch<PokemonDispatch>();
export const usePokemonSelector: TypedUseSelectorHook<PokemonState> =
  useSelector;

export const useMarkdownDispatch = () => useDispatch<MarkdownDispatch>();
export const useMarkdownSelector: TypedUseSelectorHook<MarkdownState> =
  useSelector;