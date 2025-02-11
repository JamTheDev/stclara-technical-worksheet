import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/lib/actions/auth.actions";
import {
  acceptFriendRequest,
  getFriendRequests,
  sendFriendRequest,
} from "@/lib/actions/friends.actions";
import { getSecret, upsertSecret } from "@/lib/actions/secrets.actions";
import { makeAuthStore, makeSecretsStore } from "@/lib/store";
import { generateCUID } from "@/utils/cuid";

describe("(Secrets) Action Testing", () => {
  const secretStore = makeSecretsStore();
  const authStore = makeAuthStore();

  let userAId: string;
  let userBId: string;

  const credentialsUserA = {
    email: `${generateCUID()}@test.com`,
    password: "T3stP@ssw0rd",
    name: "Test User 1",
  };

  const credentialsUserB = {
    email: `${generateCUID()}@test.com`,
    password: "T3stP@ssw0rd2",
    name: "Test User 2",
  };

  it("should create two new accounts", async () => {
    const userA: any = await authStore.dispatch(registerUser(credentialsUserA));
    const userB: any = await authStore.dispatch(registerUser(credentialsUserB));

    expect(userA.payload).toHaveProperty(
      "data.session.user.email",
      credentialsUserA.email
    );
    expect(userB.payload).toHaveProperty(
      "data.session.user.email",
      credentialsUserB.email
    );

    userAId = userA.payload.data.session.user.id;
    userBId = userB.payload.data.session.user.id;
  });

  it("should add a new secret for both users", async () => {
    await authStore.dispatch(loginUser(credentialsUserA));
    const secretA = await secretStore.dispatch(
      upsertSecret("This is a secret message")
    );

    expect(secretA.meta.requestStatus).toEqual("fulfilled");
    expect(secretA.meta.arg).toEqual("This is a secret message");

    // Log in as UserB and add a secret
    await authStore.dispatch(loginUser(credentialsUserB));
    const secretB = await secretStore.dispatch(
      upsertSecret("This is a secret message for user B")
    );

    expect(secretB.meta.requestStatus).toEqual("fulfilled");
    expect(secretB.meta.arg).toEqual("This is a secret message for user B");
  });

  it("should not allow UserA to view UserB's secret without being friends", async () => {
    await authStore.dispatch(loginUser(credentialsUserA));
    const secretForUserB = await secretStore.dispatch(getSecret(userBId));

    expect(secretForUserB.meta.requestStatus).toEqual("rejected");
  });

  it("should send a friend request from UserA to UserB", async () => {
    await authStore.dispatch(loginUser(credentialsUserA));
    const friendRequestResponse = await secretStore.dispatch(
      sendFriendRequest({ receiverUserId: userBId })
    );

    expect(friendRequestResponse.meta.requestStatus).toEqual("fulfilled");
  });

  it("should accept the friend request on UserB side", async () => {
    await authStore.dispatch(loginUser(credentialsUserB));
    const friendRequests = await secretStore.dispatch(getFriendRequests());

    expect(friendRequests.meta.requestStatus).toEqual("fulfilled");
    expect(friendRequests.payload).toHaveLength(1);

    const acceptResponse = await secretStore.dispatch(
      acceptFriendRequest(friendRequests.payload[0].id)
    );

    expect(acceptResponse.meta.requestStatus).toEqual("fulfilled");
  });

  it("should allow UserA to view UserB's secret", async () => {
    await authStore.dispatch(loginUser(credentialsUserA));
    const secretForUserB = await secretStore.dispatch(getSecret(userBId));
    console.log(secretForUserB.payload);
    expect(secretForUserB.meta.requestStatus).toEqual("fulfilled");
    expect(secretForUserB.payload.message).toEqual(
      "This is a secret message for user B"
    );
  });

  it("should allow UserB to view UserA's secret", async () => {
    await authStore.dispatch(loginUser(credentialsUserB));
    const secretForUserA = await secretStore.dispatch(getSecret(userAId));

    expect(secretForUserA.meta.requestStatus).toEqual("fulfilled");
    expect(secretForUserA.payload.message).toEqual("This is a secret message");
  });

  it("should not add a new secret for an unauthenticated user", async () => {
    await authStore.dispatch(logoutUser());
    const secret = await secretStore.dispatch(
      upsertSecret("This secret should not be accepted")
    );

    expect(secret.meta.requestStatus).toEqual("rejected");
  });
});
