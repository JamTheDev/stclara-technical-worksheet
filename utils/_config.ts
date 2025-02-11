import { generateCUID } from "@/utils/cuid";

const credentialsUserA = {
  email: `usera@test.com`,
  password: "T3stP@ssw0rd",
  name: `TestUser1_${generateCUID()}`,
};

const credentialsUserB = {
  email: `userb@test.com`,
  password: "T3stP@ssw0rd",
  name: `TestUser2_${generateCUID()}`,
};

export { credentialsUserA, credentialsUserB };
