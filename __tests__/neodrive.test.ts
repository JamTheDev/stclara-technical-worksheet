import reducer from "../lib/stores/attachment.store";
import {
  createAttachment,
  getAttachment,
  getAllAttachments,
  updateAttachment,
  deleteAttachment,
} from "../lib/actions/attachment.actions";
import { makeAttachmentStore, makeAuthStore } from "@/lib/store";
import { loginUser } from "@/lib/actions/auth.actions";
import { credentialsUserA } from "@/utils/_config";

describe("Attachment Store reducer", () => {
  const initialState = {
    attachments: [],
    selectedAttachment: null,
    loading: false,
    error: null,
  } as any;

  const sampleAttachment = {
    attachments: [],
    id: "1",
    url: "http://example.com",
    createdAt: new Date(),
    createdById: "user1",
  };

  it("handles createAttachment.pending", () => {
    const action = { type: createAttachment.pending.toString() };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("handles createAttachment.fulfilled", () => {
    const action = {
      type: createAttachment.fulfilled.toString(),
      payload: sampleAttachment,
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.attachments).toContainEqual(sampleAttachment);
  });

  it("handles createAttachment.rejected", () => {
    const action = {
      type: createAttachment.rejected.toString(),
      payload: "Error creating attachment",
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error creating attachment");
  });

  it("handles getAttachment.pending", () => {
    const action = { type: getAttachment.pending.toString() };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("handles getAttachment.fulfilled", () => {
    const action = {
      type: getAttachment.fulfilled.toString(),
      payload: sampleAttachment,
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.selectedAttachment).toEqual(sampleAttachment);
  });

  it("handles getAttachment.rejected", () => {
    const action = {
      type: getAttachment.rejected.toString(),
      payload: "Error fetching attachment",
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error fetching attachment");
  });

  it("handles getAllAttachments.pending", () => {
    const action = { type: getAllAttachments.pending.toString() };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  it("handles getAllAttachments.fulfilled", () => {
    const attachments = [sampleAttachment];
    const action = {
      type: getAllAttachments.fulfilled.toString(),
      payload: attachments,
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.attachments).toEqual(attachments);
  });

  it("handles getAllAttachments.rejected", () => {
    const action = {
      type: getAllAttachments.rejected.toString(),
      payload: "Error fetching attachments",
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error fetching attachments");
  });

  it("handles updateAttachment.fulfilled", () => {
    const updatedAttachment = {
      ...sampleAttachment,
      url: "http://updated.com",
    };
    const prevState: any = {
      ...initialState,
      attachments: [sampleAttachment],
      loading: true,
    };
    const action = {
      type: updateAttachment.fulfilled.toString(),
      payload: updatedAttachment,
    };
    const state = reducer(prevState, action);
    expect(state.loading).toBe(false);
    expect(state.attachments[0]).toEqual(updatedAttachment);
  });

  it("handles updateAttachment.rejected", () => {
    const action = {
      type: updateAttachment.rejected.toString(),
      payload: "Error updating attachment",
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error updating attachment");
  });

  // Delete Attachment tests
  it("handles deleteAttachment.fulfilled", () => {
    const prevState: any = {
      ...initialState,
      attachments: [sampleAttachment],
      loading: true,
    };
    const action = {
      type: deleteAttachment.fulfilled.toString(),
      payload: sampleAttachment,
    };
    const state = reducer(prevState, action);
    expect(state.loading).toBe(false);
    expect(state.attachments).not.toContainEqual(sampleAttachment);
  });

  it("handles deleteAttachment.rejected", () => {
    const action = {
      type: deleteAttachment.rejected.toString(),
      payload: "Error deleting attachment",
    };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
    expect(state.error).toBe("Error deleting attachment");
  });
});

describe("Attachment Store actions", () => {
  const attachmentStore = makeAttachmentStore();
  const authStore = makeAuthStore();
  const sampleAttachment = {
    attachments: [],
    id: "1",
    url: "http://example.com",
    createdAt: new Date(),
    createdById: "user1",
  };

  let file: File;

  it("creates test file", async () => {
    const fileRequest = await fetch(
      "https://t4.ftcdn.net/jpg/00/53/45/31/360_F_53453175_hVgYVz0WmvOXPd9CNzaUcwcibiGao3CL.jpg"
    );
    const blob = await fileRequest.blob();
    file = new File([blob], "jamier_test.jpg");
  });

  it("should not let unauthenticated user create attachment", async () => {
    const action = await attachmentStore.dispatch(createAttachment({ file }));
    expect(action.payload).toEqual("User is not logged in");
  });

  it("creates a attachment", async () => {
    await authStore.dispatch(
      loginUser({
        email: credentialsUserA.email,
        password: credentialsUserA.password,
      })
    );
    const action = await attachmentStore.dispatch(createAttachment({ file }));
    expect(action.payload).toEqual(sampleAttachment);
  });
});
