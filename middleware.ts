import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "./utils/supabase/server";
import { NextResponse } from "next/server";

export async function middleware(request: NextRequest) {
  const supabase = await createClient();
  const session = await supabase.auth.getSession();
  if (!session.data.session && request.nextUrl.pathname !== "/") {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
