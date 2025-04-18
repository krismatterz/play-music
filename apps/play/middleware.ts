import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";
  const isArtistDomain = hostname.startsWith("artist.");

  // If on artist domain, redirect to artist.play-music.app
  if (isArtistDomain) {
    const url = request.nextUrl.clone();
    url.hostname = "artist.play-music.app";
    return NextResponse.redirect(url);
  }

  // If on main domain but not artist domain, ensure it's play-music.app
  if (
    !isArtistDomain &&
    hostname !== "play-music.app" &&
    process.env.NODE_ENV === "production"
  ) {
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
