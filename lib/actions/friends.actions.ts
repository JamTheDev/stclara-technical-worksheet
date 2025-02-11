import { createAsyncThunk } from "@reduxjs/toolkit";
import { createProdClient } from "@/utils/supabase/client";
import { generateCUID } from "@/utils/cuid";

async function getClient() {
  if (process.env.NODE_ENV === "test") {
    const mod = await import("@/utils/supabase/testing");
    return mod.default;
  } else {
    const mod = await import("@/utils/supabase/client");
    return mod.createProdClient();
  }
}

export async function getProfileId(
  supabase: any,
  userId: string,
  rejectWithValue: any
): Promise<string | undefined> {
  const { data: profileData, error: profileError } = await supabase
    .from("Profile")
    .select("id")
    .eq("userId", userId)
    .single();

  if (profileError || !profileData) {
    rejectWithValue("Profile not found");
    return;
  }
  return profileData.id;
}

export const getFriends = createAsyncThunk(
  "friends/get",
  async (_, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const profileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!profileId) return;

    // Query for accepted friend requests where the profile is sender or receiver.
    const { data, error } = await supabase
      .from("FriendRequest")
      .select(
        `
        *,
        sender_profile:Profile!senderId (
          fullname,
          userId
        ),
        receiver_profile:Profile!receiverId (
          fullname,
          userId
        )
      `
      )
      .or(`receiverId.eq.${profileId}`)
      .eq("status", "ACCEPTED");

    if (error) {
      console.error(error);
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getSentFriendRequests = createAsyncThunk(
  "friends/getSentRequests",
  async (_, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const profileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!profileId) return;

    // Query for friend requests where the profile is the sender.
    const { data, error } = await supabase
      .from("FriendRequest")
      .select("*")
      .eq("senderId", profileId)
      .eq("status", "PENDING");

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getFriendRequests = createAsyncThunk(
  "friends/getRequests",
  async (_, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const profileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!profileId) return;

    // Query for friend requests where the profile is the receiver.
    const { data, error } = await supabase
      .from("FriendRequest")
      .select("*")
      .eq("receiverId", profileId)
      .eq("status", "PENDING");

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getReceivedFriendRequests = createAsyncThunk(
  "friends/getReceivedRequests",
  async (_, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const profileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!profileId) return;

    // Query for friend requests where the profile is the receiver.
    const { data, error } = await supabase
      .from("FriendRequest")
      .select("*")
      .eq("receiverId", profileId)
      .eq("status", "PENDING");

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const sendFriendRequest = createAsyncThunk(
  "friends/sendRequest",
  async (
    {
      receiverProfileId,
      receiverUserId,
    }: { receiverProfileId?: string; receiverUserId?: string },
    { rejectWithValue }
  ) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const senderProfileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!senderProfileId) return;

    if (receiverUserId) {
      receiverProfileId = await getProfileId(
        supabase,
        receiverUserId,
        rejectWithValue
      );
    }

    const { data, error } = await supabase
      .from("FriendRequest")
      .insert({
        id: generateCUID(),
        senderId: senderProfileId,
        receiverId: receiverProfileId,
      })
      .select("*")
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptRequest",
  async (friendRequestId: string, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("FriendRequest")
      .update({ status: "ACCEPTED" })
      .eq("id", friendRequestId)
      .select("*")
      .single();

    const sentRequest = await supabase
      .from("FriendRequest")
      .insert({
        id: generateCUID(),
        senderId: data.receiverId,
        receiverId: data.senderId,
        status: "ACCEPTED",
      })
      .select("*")
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);
export const removeFriend = createAsyncThunk(
  "friends/remove",
  async (friendRequestId: string, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const { data, error } = await supabase
      .from("FriendRequest")
      .delete()
      .eq("id", friendRequestId)
      .select("*")
      .single();

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);

export const getUsers = createAsyncThunk(
  "users/getUsers",
  async (_, { rejectWithValue }) => {
    const supabase = await getClient();
    const session = await supabase.auth.getSession();

    if (!session.data.session) {
      return rejectWithValue("User is not logged in");
    }

    const currentProfileId = await getProfileId(
      supabase,
      session.data.session.user.id,
      rejectWithValue
    );
    if (!currentProfileId) return;

    const { data, error } = await supabase
      .from("Profile")
      .select("*")
      .neq("id", currentProfileId);

    if (error) {
      return rejectWithValue(error.message);
    }
    return data;
  }
);
