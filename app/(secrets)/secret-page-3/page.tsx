"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  getFriends,
  sendFriendRequest,
  acceptFriendRequest,
  getUsers,
  getFriendRequests,
  getSentFriendRequests,
} from "@/lib/actions/friends.actions";
import { getSecret } from "@/lib/actions/secrets.actions";
import { useAppDispatch, useSecretsSelector } from "@/lib/store";
import { checkUserLoggedIn } from "@/lib/actions/auth.actions";

export default function SecretPage3() {
  const dispatch = useAppDispatch();

  const [selectedFriendId, setSelectedFriendId] = useState("");
  const [friendSecret, setFriendSecret] = useState("");
  const [fetchingSecretId, setFetchingSecretId] = useState<string | null>(null);
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<"friends" | "users" | "requests">(
    "friends"
  );
  const [sentRequests, setSentRequests] = useState<string[]>([]);

  // Loading states.
  const [loadingFriends, setLoadingFriends] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingRequests, setLoadingRequests] = useState(false);
  const [loadingSendFriend, setLoadingSendFriend] = useState<string[]>([]);
  const [loadingAccepting, setLoadingAccepting] = useState<string[]>([]);

  const friends = useSecretsSelector((state) => state.friends);

  // Initial data load.
  useEffect(() => {
    dispatch(checkUserLoggedIn());
    setLoadingUsers(true);
    dispatch(getSentFriendRequests())
      .then((res: any) => {
        if (!res.error) {
          setSentRequests(res.payload.map((req: any) => req.receiverId));
        } else {
          toast.error("Failed to fetch sent requests");
        }
      })
      .finally(() => setLoadingUsers(false));
    setLoadingFriends(true);
    dispatch(getFriends()).finally(() => setLoadingFriends(false));

    setLoadingUsers(true);
    Promise.all([dispatch(getSentFriendRequests()), dispatch(getUsers())])
      .then(([sentRes, usersRes]: any) => {
        if (!sentRes.error) {
          setSentRequests(sentRes.payload.map((req: any) => req.receiverId));
        } else {
          toast.error("Failed to fetch sent requests");
        }
        if (!usersRes.error) {
          setAllUsers(usersRes.payload);
        } else {
          toast.error("Failed to fetch users");
        }
      })
      .finally(() => setLoadingUsers(false));
  }, [dispatch]);

  // Refetch data based on activeTab.
  useEffect(() => {
    if (activeTab === "friends") {
      setLoadingFriends(true);
      dispatch(getFriends()).finally(() => setLoadingFriends(false));
    } else if (activeTab === "requests") {
      setLoadingRequests(true);
      dispatch(getFriendRequests()).finally(() => setLoadingRequests(false));
    } else if (activeTab === "users") {
      setLoadingUsers(true);
      dispatch(getSentFriendRequests())
        .then((res: any) => {
          if (!res.error) {
            setSentRequests(res.payload.map((req: any) => req.receiverId));
          } else {
            toast.error("Failed to fetch sent requests");
          }
        })
        .finally(() => setLoadingUsers(false));
    }
  }, [activeTab, dispatch]);

  // View friend secret.
  const handleViewFriendSecret = async (friendUserId: string) => {
    setFetchingSecretId(friendUserId);
    setSelectedFriendId(friendUserId);
    console.log(friendUserId);
    const res = await dispatch(getSecret(friendUserId));
    if (res.payload.error) {
      toast.error("Failed to fetch friend's secret");
      setFriendSecret("");
    } else {
      setFriendSecret(res.payload.message || "No secret found");
    }
    setFetchingSecretId(null);
  };

  // Send friend request.
  const handleAddFriend = async (userId: string) => {
    setLoadingSendFriend((prev) => [...prev, userId]);
    const res = await dispatch(sendFriendRequest({ receiverUserId: userId }));
    
    setLoadingSendFriend((prev) => prev.filter((id) => id !== userId));
    if (res.payload.error) {
      toast.error("Failed to send friend request");
    } else {
      toast.success("Friend request sent!");
      setSentRequests((prev) => [...prev, userId]);
      dispatch(getFriends());
    }
  };

  // Accept friend request.
  const handleAcceptRequest = async (friendRequestId: string) => {
    setLoadingAccepting((prev) => [...prev, friendRequestId]);
    await dispatch(acceptFriendRequest(friendRequestId));
    setLoadingAccepting((prev) => prev.filter((id) => id !== friendRequestId));
    toast.success("Friend request accepted!");
    dispatch(getFriendRequests());
  };

  return (
    <div className="h-96 min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="flex flex-row gap-8 items-stretch w-full max-w-4xl ">
        {/* Secret Display Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full h-96">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Selected Friend Secret
          </h2>
          <div className="flex flex-col space-y-4 h-full justify-center items-center">
            {selectedFriendId ? (
              <>
                <p className="text-gray-800 text-sm">
                  Friend User ID:{" "}
                  <span className="font-sm text-center">
                    {selectedFriendId}
                  </span>
                </p>
                <p className="text-white bg-blue-500 p-3 rounded-md shadow-lg">
                  Secret:{" "}
                  {fetchingSecretId === selectedFriendId
                    ? "Loading..."
                    : friendSecret || "No secret found"}
                </p>
              </>
            ) : (
              <p className="text-gray-600">No secret selected</p>
            )}
          </div>
        </div>

        {/* Friends, Users & Requests Tabs Card */}
        <div className="bg-white rounded-xl shadow-2xl p-8 w-full h-96">
          {/* Tab Headers */}
          <div className="flex justify-center mb-4">
            <button
              onClick={() => setActiveTab("friends")}
              className={`mx-2 py-2 px-4 rounded-full transition duration-300 ${
                activeTab === "friends"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Your Friends
            </button>
            <button
              onClick={() => setActiveTab("users")}
              className={`mx-2 py-2 px-4 rounded-full transition duration-300 ${
                activeTab === "users"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              All Users
            </button>
            <button
              onClick={() => setActiveTab("requests")}
              className={`mx-2 py-2 px-4 rounded-full transition duration-300 ${
                activeTab === "requests"
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              Received Requests
            </button>
          </div>

          {/* Tab Content */}
          {activeTab === "friends" ? (
            <div className="overflow-auto">
              {loadingFriends ? (
                <p className="text-center">Loading...</p>
              ) : friends.friends.length === 0 ? (
                <p className="text-gray-600 text-center">No friends yet.</p>
              ) : (
                <ul className="space-y-4">
                  {friends.friends.map((friend: any) => {
                    if (friend.status !== "ACCEPTED") return null;
                    return (
                      <li
                        key={friend.id}
                        className="border border-gray-200 rounded-xl p-4 flex flex-col space-y-2"
                      >
                        <p className="text-gray-800">
                          Friend:{" "}
                          <span className="font-medium">
                            {friend.receiver_profile.fullname}
                          </span>
                        </p>
                        <button
                          onClick={() =>
                            handleViewFriendSecret(friend.sender_profile.userId)
                          }
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 rounded-full transition duration-300"
                        >
                          {fetchingSecretId === friend.sender_profile.userId
                            ? "Loading..."
                            : "View Secret"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          ) : activeTab === "users" ? (
            <div className="overflow-auto">
              {loadingUsers ? (
                <p className="text-center">Loading...</p>
              ) : allUsers.length === 0 ? (
                <p className="text-gray-600 text-center">No users found.</p>
              ) : (
                <ul className="space-y-4">
                  {allUsers.map((currentUser: any) => (
                    <li
                      key={currentUser.id}
                      className="border border-gray-200 rounded-xl p-4 flex flex-col space-y-2"
                    >
                      <p className="text-gray-800">
                        User ID:{" "}
                        <span className="font-medium">{currentUser.id}</span>
                      </p>
                      {currentUser.fullname && (
                        <p className="text-gray-700">
                          Username:{" "}
                          <span className="font-medium">
                            {currentUser.fullname}
                          </span>
                        </p>
                      )}
                      {sentRequests.includes(currentUser.id) ||
                      friends.friends.findIndex(
                        (item: any) => item.senderId === currentUser.id
                      ) !== -1 ? (
                        <button
                          disabled
                          className="bg-orange-500 text-white font-semibold py-1 px-3 rounded-full transition duration-300"
                        >
                          Friend Request Sent
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAddFriend(currentUser.id)}
                          disabled={loadingSendFriend.includes(currentUser.id)}
                          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-full transition duration-300"
                        >
                          {loadingSendFriend.includes(currentUser.id)
                            ? "Sending..."
                            : "Add Friend"}
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ) : (
            <div className="overflow-auto">
              {loadingRequests ? (
                <p className="text-center">Loading...</p>
              ) : friends.friends.filter((req: any) => req.status === "PENDING")
                  .length === 0 ? (
                <p className="text-gray-600 text-center">
                  No friend requests received.
                </p>
              ) : (
                <ul className="space-y-4">
                  {friends.friends.map((request: any) => {
                    if (request.status !== "PENDING") return null;
                    return (
                      <li
                        key={request.id}
                        className="border border-gray-200 rounded-xl p-4 flex flex-col space-y-2"
                      >
                        <p className="text-gray-800">
                          Request from:{" "}
                          <span className="font-medium">
                            {request.senderId}
                          </span>
                        </p>
                        <button
                          onClick={() => handleAcceptRequest(request.id)}
                          disabled={loadingAccepting.includes(request.id)}
                          className="bg-indigo-500 hover:bg-indigo-600 text-white font-semibold py-1 px-3 rounded-full transition duration-300"
                        >
                          {loadingAccepting.includes(request.id)
                            ? "Accepting..."
                            : "Accept Request"}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>

      <Link
        href="/"
        className="block text-center mt-4 text-blue-500 hover:underline"
      >
        Back
      </Link>
    </div>
  );
}
