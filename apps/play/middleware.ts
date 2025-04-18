import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  // If we're on the artist domain, let the artist app handle it
  if (hostname.startsWith("artist.")) {
    return NextResponse.next();
  }

  // For the main app, ensure we're on play-music.app in production
  if (hostname !== "play-music.app" && process.env.NODE_ENV === "production") {
    const url = request.nextUrl.clone();
    url.hostname = "play-music.app";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
  ],
};
