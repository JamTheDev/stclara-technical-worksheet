import {
  checkUserLoggedIn,
  loginUser,
  registerUser,
  logoutUser,
} from "@/lib/actions/auth.actions";
import { makeAuthStore, useAppDispatch } from "@/lib/store";
import authSlice, { AuthStoreType } from "@/lib/stores/auth.store";
import { generateCUID } from "@/utils/cuid";
import { User } from "@supabase/supabase-js";
import { credentialsUserA, credentialsUserB } from "../utils/_config";


describe("(Auth) State Mutation Testing", () => {
  const initialState: AuthStoreType = {
    user: undefined,
    isAuthenticated: false,
    checkingAuthStatus: "idle",
    status: "idle",
  };

  it("should return the initial state", () => {
    expect(authSlice(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should update the state with user details for checkUserLoggedIn.fulfilled action", () => {
    const user = { id: "123", name: "Test User" };
    const action = {
      type: checkUserLoggedIn.fulfilled.type,
      payload: { user },
    };
    const state = authSlice(initialState, action);
    expect(state.user).toEqual(user);
  });

  it("should not mutate state for unknown action types", () => {
    const action = { type: "non/existent" };
    const state = authSlice(initialState, action);
    expect(state).toEqual(initialState);
  });

  it("should set status to 'loading' when loginUser.pending action is dispatched", () => {
    const action = { type: loginUser.pending.type };
    const state = authSlice(initialState, action);
    expect(state.status).toEqual("loading");
  });

  it("should set error state on loginUser.rejected action without authenticating the user", () => {
    const error = { message: "Invalid credentials" };
    const action = { type: loginUser.rejected.type, error };
    const state = authSlice(initialState, action);
    expect(state.user).toBeUndefined();
    expect(state.isAuthenticated).toBe(false);
    expect(state.status).toEqual("error");
  });
});

describe("(Auth) Action Testing", () => {
  const mockStore = makeAuthStore();

  it("should register User A & B", async () => {
    const resultUserA = await mockStore.dispatch(registerUser(credentialsUserA));
    const resultUserB = await mockStore.dispatch(registerUser(credentialsUserB));
    expect(resultUserA).toHaveProperty("meta.arg.email");
    expect(resultUserB).toHaveProperty("meta.arg.email");
  });

  it("should not register a user with an invalid email format", async () => {
    const user = {
      email: "invalid_email",
      password: "password",
      name: "Test User Invalid Email",
    };
    const result = await mockStore.dispatch(registerUser(user));
    expect(result).toHaveProperty("error");
  });

  it("should not register a user with an inadequately short password", async () => {
    const cuid = generateCUID();
    const user = {
      email: `${cuid}@test.com`,
      password: "123", // Assuming password policy requires longer password
      name: `Test User_${cuid}`,
    };
    const result = await mockStore.dispatch(registerUser(user));
    expect(result).toHaveProperty("error");
  });

  it("should not log in a user when password is missing", async () => {
    const credentials = {
      email: credentialsUserA.email,
      password: "",
    };
    const result = await mockStore.dispatch(loginUser(credentials));
    expect(result).toHaveProperty("error");
  });

  it("should not log in a user with invalid credentials", async () => {
    const credentials = {
      email: credentialsUserB.email,
      password: "wrongpassword",
    };
    const result = await mockStore.dispatch(loginUser(credentials));
    expect(result).toHaveProperty("error");
  });

  // no log-out because login states are not saved in tests.
});
