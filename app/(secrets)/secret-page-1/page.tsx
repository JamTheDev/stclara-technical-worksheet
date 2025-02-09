"use client";

import { getSecret } from "@/lib/actions/secrets.actions";
import { useSecretsDispatch, useSecretsSelector } from "@/lib/store";
import Link from "next/link";
import { useEffect } from "react";

export default function SecretPage1() {
  const dispatch = useSecretsDispatch();
  const { secret, status } = useSecretsSelector((state) => state.secrets);

  useEffect(() => {
    dispatch(getSecret());
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-4">
          This is your secret...
        </h1>
        {status === "loading" || status == "idle" ? (
          <p className="text-lg text-gray-600 mb-8">Loading...</p>
        ) : (
          <p className="text-lg text-gray-600 mb-8">
            Your secret message: {secret === "" ? "No secret message." : secret}
          </p>
        )}
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
        >
          Back
        </Link>
      </div>
    </div>
  );
}
