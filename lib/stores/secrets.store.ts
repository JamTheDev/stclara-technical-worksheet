import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "@/types/status.types";
import {
  upsertSecret,
  getSecret,
  clearSecret,
} from "../actions/secrets.actions";

export type SecretStoreType = {
  secret: string;
  status: Status;
};

const initialState: SecretStoreType = {
  secret: "",
  status: "idle",
};

const secretsSlice = createSlice({
  name: "secrets",
  initialState,
  reducers: {
    setSecret(state, action: PayloadAction<string>) {
      state.secret = action.payload;
      state.status = "success";
    },
    clearLocalSecret(state) {
      state.secret = "";
      state.status = "success";
    },
    setStatus(state, action: PayloadAction<Status>) {
      state.status = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(upsertSecret.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      upsertSecret.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.status = "success";
        const secretData = Array.isArray(action.payload)
          ? action.payload[0]
          : action.payload;
        if (secretData && secretData.message) {
          state.secret = secretData.message;
        }
      }
    );
    builder.addCase(upsertSecret.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(getSecret.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      getSecret.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.status = "success";
        const secretData = Array.isArray(action.payload)
          ? action.payload[0]
          : action.payload;
        if (secretData && secretData.message) {
          state.secret = secretData.message;
        }
      }
    );
    builder.addCase(getSecret.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(clearSecret.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(clearSecret.fulfilled, (state) => {
      state.status = "success";
      state.secret = "";
    });
    builder.addCase(clearSecret.rejected, (state) => {
      state.status = "error";
    });
  },
});

export default secretsSlice.reducer;
