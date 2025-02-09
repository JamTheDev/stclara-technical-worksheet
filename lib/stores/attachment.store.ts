import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  createAttachment,
  getAttachment,
  getAllAttachments,
  updateAttachment,
  deleteAttachment,
} from "../actions/attachment.actions";

export interface Attachment {
  id: string;
  url: string;
  createdAt: Date;
  createdById: string;
}

interface AttachmentState {
  attachments: Attachment[];
  selectedAttachment: Attachment | null;
  loading: boolean;
  error: string | null;
}

const initialState: AttachmentState = {
  attachments: [],
  selectedAttachment: null,
  loading: false,
  error: null,
};

const attachmentSlice = createSlice({
  name: "attachment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(createAttachment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createAttachment.fulfilled,
      (state, action: PayloadAction<Attachment>) => {
        state.loading = false;
        state.attachments.push(action.payload);
      }
    );
    builder.addCase(createAttachment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get single Attachment
    builder.addCase(getAttachment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getAttachment.fulfilled,
      (state, action: PayloadAction<Attachment>) => {
        state.loading = false;
        state.selectedAttachment = action.payload;
      }
    );
    builder.addCase(getAttachment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Get All Attachments
    builder.addCase(getAllAttachments.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      getAllAttachments.fulfilled,
      (state, action: PayloadAction<Attachment[]>) => {
        state.loading = false;
        state.attachments = action.payload;
      }
    );
    builder.addCase(getAllAttachments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update Attachment
    builder.addCase(updateAttachment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateAttachment.fulfilled,
      (state, action: PayloadAction<Attachment>) => {
        state.loading = false;
        const index = state.attachments.findIndex(
          (att) => att.id === action.payload.id
        );
        if (index !== -1) {
          state.attachments[index] = action.payload;
        }
      }
    );
    builder.addCase(updateAttachment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete Attachment
    builder.addCase(deleteAttachment.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteAttachment.fulfilled,
      (state, action: PayloadAction<Attachment>) => {
        state.loading = false;
        state.attachments = state.attachments.filter(
          (att) => att.id !== action.payload.id
        );
      }
    );
    builder.addCase(deleteAttachment.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default attachmentSlice.reducer;
