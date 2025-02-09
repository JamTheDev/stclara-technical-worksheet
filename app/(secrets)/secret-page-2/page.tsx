"use client"

import { useState } from "react";
import { useSecretsDispatch } from "@/lib/store";
import Link from "next/link";
import { upsertSecret } from "@/lib/actions/secrets.actions";
import { toast } from "sonner";

export default function SecretPage2() {
    const dispatch = useSecretsDispatch();
    const [newSecret, setNewSecret] = useState("");

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        await dispatch(upsertSecret(newSecret));
        toast.success("Secret updated!");
        
        setNewSecret("");
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col items-center justify-center p-6">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md">
                <h1 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">
                    Update Your Secret
                </h1>
                <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                    <input
                        type="text"
                        value={newSecret}
                        onChange={(e) => setNewSecret(e.target.value)}
                        placeholder="Enter new secret"
                        className="border border-gray-300 rounded-full p-3 text-gray-800 focus:outline-none focus:border-blue-500"
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition duration-300"
                    >
                        Update Secret
                    </button>
                </form>
                <Link href="/" className="block text-center mt-6 text-blue-500 hover:underline">
                    Back
                </Link>
            </div>
        </div>
    );
}