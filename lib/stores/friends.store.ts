import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Status } from "@/types/status.types";
import {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  removeFriend,
  getUsers,
  getFriendRequests,
  getReceivedFriendRequests,
} from "../actions/friends.actions";

export type Friend = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string;
};

export type FriendsStoreType = {
  friends: Friend[];
  status: Status;
  userListStatus: Status;
};

const initialState: FriendsStoreType = {
  friends: [],
  status: "idle",
  userListStatus: "idle",
};

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {
    // Optional: add local reducers if needed.
  },
  extraReducers: (builder) => {
    builder.addCase(getFriends.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      getFriends.fulfilled,
      (state, action) => {
        state.status = "success";
        state.friends = action.payload;
      }
    );
    builder.addCase(getFriends.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(sendFriendRequest.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      sendFriendRequest.fulfilled,
      (state, action: PayloadAction<Friend>) => {
        state.status = "success";
        state.friends.push(action.payload);
      }
    );
    builder.addCase(sendFriendRequest.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(acceptFriendRequest.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      acceptFriendRequest.fulfilled,
      (state, action: PayloadAction<Friend>) => {
        state.status = "success";
        const updatedFriend = action.payload;
        const index = state.friends.findIndex(
          (friend) => friend.id === updatedFriend.id
        );
        if (index !== -1) {
          state.friends[index] = updatedFriend;
        }
      }
    );
    builder.addCase(acceptFriendRequest.rejected, (state) => {
      state.status = "error";
    });

    builder.addCase(removeFriend.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      removeFriend.fulfilled,
      (state, action: PayloadAction<Friend>) => {
        state.status = "success";
        const removedFriend = action.payload;
        state.friends = state.friends.filter(
          (friend) => friend.id !== removedFriend.id
        );
      }
    );
    builder.addCase(removeFriend.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(getUsers.pending, (state) => {
      state.userListStatus = "loading";
    });
    builder.addCase(getUsers.fulfilled, (state) => {
      state.userListStatus = "success";
    });
    builder.addCase(getFriendRequests.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(
      getFriendRequests.fulfilled,
      (state, action: PayloadAction<Friend[]>) => {
        state.status = "success";
        state.friends = action.payload;
      }
    );
    builder.addCase(getFriendRequests.rejected, (state) => {
      state.status = "error";
    });
    builder.addCase(getReceivedFriendRequests.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(getReceivedFriendRequests.fulfilled, (state, action) => {
      state.status = "success";
      state.friends = action.payload;
    });
    builder.addCase(getReceivedFriendRequests.rejected, (state) => {
      state.status = "error";
    });
  },
});

export default friendsSlice.reducer;
