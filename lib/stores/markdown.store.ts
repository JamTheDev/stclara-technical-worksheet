import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  upsertMarkdownNote,
  getMarkdownNote,
  getAllMarkdownNotes,
  deleteMarkdownNote,
} from "../actions/markdown.actions";

export interface MarkdownNote {
  id?: string;
  name: string;
  attachment: string;
  createdAt: string;
}

interface MarkdownState {
  notes: MarkdownNote[];
  currentNote: MarkdownNote | null;
  loading: boolean;
  error: string | null;
}

const initialState: MarkdownState = {
  notes: [],
  currentNote: null,
  loading: false,
  error: null,
};

export const markdownSlice = createSlice({
  name: "markdown",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(upsertMarkdownNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      upsertMarkdownNote.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.notes.push(action.payload[0]);
      }
    );
    builder.addCase(
      upsertMarkdownNote.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to create note.";
      }
    );

    builder.addCase(getMarkdownNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getMarkdownNote.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.currentNote =
          action.payload && action.payload.length > 0
            ? action.payload[0]
            : null;
      }
    );
    builder.addCase(
      getMarkdownNote.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to load note.";
      }
    );

    builder.addCase(getAllMarkdownNotes.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getAllMarkdownNotes.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.notes = action.payload;
      }
    );
    builder.addCase(
      getAllMarkdownNotes.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to load notes.";
      }
    );
    // Delete Markdown Note
    builder.addCase(deleteMarkdownNote.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteMarkdownNote.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        console.log(action.payload);
        if (action.payload) {
          const deletedNote = action.payload;
          state.notes = state.notes.filter(
            (note) => note.id !== deletedNote.id
          );
          if (state.currentNote && state.currentNote.id === deletedNote.id) {
            state.currentNote = null;
          }
        }
      }
    );
    builder.addCase(
      deleteMarkdownNote.rejected,
      (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete note.";
      }
    );
  },
});

const markdownReducer =  markdownSlice.reducer;

export default markdownReducer;
