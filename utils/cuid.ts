import * as crypto from "crypto";

const BASE36_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz";

function encodeBase36(value: number): string {
  if (value === 0) {
    return "0";
  }
  let result = "";
  while (value > 0) {
    result = BASE36_CHARS.charAt(value % 36) + result;
    value = Math.floor(value / 36);
  }
  return result.padStart(8, "0");
}

function getMachineFingerprint(): string {
  try {
    const hostname = require("os").hostname();
    const hash = crypto.createHash("md5").update(hostname).digest("hex");
    return hash.substring(0, 4);
  } catch (error) {
    return "0000";
  }
}

function getRandomString(length: number): string {
  let result = "";
  for (let i = 0; i < length; i++) {
    result += BASE36_CHARS.charAt(
      Math.floor(Math.random() * BASE36_CHARS.length)
    );
  }
  return result;
}

export function generateCUID(): string {
  const timestamp = Date.now();

  let counter = 0;
  let lastTimestamp = 0;

  if (timestamp === lastTimestamp) {
    counter++;
  } else {
    lastTimestamp = timestamp;
    counter = 0;
  }

  const timestampBase36 = encodeBase36(timestamp);
  const counterBase36 = encodeBase36(counter);
  const fingerprint = getMachineFingerprint();
  const randomString = getRandomString(4);

  return `c${timestampBase36}${counterBase36}${fingerprint}${randomString}`;
}
