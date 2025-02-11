"use client";

import { createBrowserClient } from "@supabase/ssr";
import testingClient from "./testing";

export function createProdClient() {
  // Create a supabase client on the browser with project's credentials
  return process.env.NODE_ENV === "test" ? testingClient : createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
