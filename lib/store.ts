import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./stores/auth.store";
import secretsSlice from "./stores/secrets.store";
import friendsSlice from "./stores/friends.store";
import attachmentSlice from "./stores/attachment.store";
import { foodgalleryReducer } from "./stores/foodgallery.store";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authListenerMiddleware } from "./listeners/auth.listener";
import { checkUserLoggedIn } from "./actions/auth.actions";
import { todoReducer } from "./stores/todo.store";

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

const authStore = makeAuthStore();
const secretsStore = makeSecretsStore();
const todolistStore = makeTodolistStore();
const attachmentStore = makeAttachmentStore();
const foodGalleryStore = makeFoodGalleryStore();

authStore.dispatch(checkUserLoggedIn());

export type AuthState = ReturnType<typeof authStore.getState>;
export type SecretsState = ReturnType<typeof secretsStore.getState>;
export type TodolistState = ReturnType<typeof todolistStore.getState>;
export type AttachmentState = ReturnType<typeof attachmentStore.getState>;
export type FoodGalleryState = ReturnType<typeof foodGalleryStore.getState>;

export type AppDispatch = typeof authStore.dispatch;
export type SecretsDispatch = typeof secretsStore.dispatch;
export type TodolistDispatch = typeof todolistStore.dispatch;
export type AttachmentDispatch = typeof attachmentStore.dispatch;
export type FoodGalleryDispatch = typeof foodGalleryStore.dispatch;

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
