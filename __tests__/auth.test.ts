import {
  checkUserLoggedIn,
  loginUser,
  registerUser,
  logoutUser,
} from "@/lib/actions/auth.actions";
import authSlice, { AuthStoreType } from "@/lib/stores/auth.store";
import { generateCUID } from "@/utils/cuid";
type AuthState = {
  user: any;
  isAuthenticated: boolean;
  checkingAuthStatus: "idle" | string;
  status: "idle" | string;
};

describe("Auth Redux Store", () => {
  const initialState: AuthStoreType = {
    user: undefined,
    isAuthenticated: false,
    checkingAuthStatus: "idle",
    status: "idle",
  };

  it("should return the initial state", () => {
    expect(authSlice(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle checkUserLoggedIn.fulfilled", () => {
    const user = { id: "123", name: "Test User" };
    const action = {
      type: checkUserLoggedIn.fulfilled.type,
      payload: { user },
    };
    const state = authSlice(initialState, action);
    expect(state.user).toEqual(user);
  });

  it("should not change state for unknown actions", () => {
    const action = { type: "non/existent" };
    const state = authSlice(initialState, action);
    expect(state).toEqual(initialState);
  });

  it("should update auth status to loading when login is pending", () => {
    const action = { type: loginUser.pending.type };
    const state = authSlice(initialState, action);
    expect(state.status).toEqual("loading");
  });

  it("should log in the user with valid credentials", () => {
    const user = { id: generateCUID(), fullname: "Test User", email: "valid@email.com" };
    const action = { type: loginUser.fulfilled.type, payload: { data: user } };
    const state = authSlice(initialState, action);
    expect(state.user).toEqual(user);
    expect(state.isAuthenticated).toBe(true);
    expect(state.status).toEqual("idle");
  });

  it("should not log in the user with invalid credentials", () => {
    const error = { message: "Invalid credentials" };
    const action = { type: loginUser.rejected.type, error };
    const state = authSlice(initialState, action);
    expect(state.user).toBeUndefined();
    expect(state.isAuthenticated).toBe(false);
    expect(state.status).toEqual("error");
  });
});
