"use client";

import { createBrowserClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";

export function createProdClient() {
  // Create a supabase client on the browser with project's credentials
  return (process.env.NODE_ENV === "test" ? createClient : createBrowserClient)(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
