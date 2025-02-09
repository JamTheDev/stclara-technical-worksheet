// auth.listener.ts
import { createListenerMiddleware } from "@reduxjs/toolkit";
import { checkUserLoggedIn } from "../actions/auth.actions";

const authListenerMiddleware = createListenerMiddleware();

authListenerMiddleware.startListening({
  type: "@@INIT",
  effect: async (action, listenerApi) => {
    listenerApi.dispatch(checkUserLoggedIn());
  },
});

export { authListenerMiddleware };
