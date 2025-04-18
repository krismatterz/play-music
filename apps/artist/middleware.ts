import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/(.*)",
]);

async function handleRequest(request: NextRequest) {
  const hostname = request.headers.get("host") ?? "";

  // In production, ensure we're on artist.play-music.app
  if (
    !hostname.startsWith("artist.") &&
    process.env.NODE_ENV === "production"
  ) {
    const url = request.nextUrl.clone();
    url.hostname = "artist.play-music.app";
    return NextResponse.redirect(url);
  }

  // In development, ensure we're on localhost:3001
  if (
    process.env.NODE_ENV === "development" &&
    !hostname.includes("localhost:3001")
  ) {
    const url = request.nextUrl.clone();
    url.host = "localhost:3001";
    return NextResponse.redirect(url);
  }

  return null;
}

export default clerkMiddleware(async (auth, request) => {
  // First check domain routing
  const routingResponse = await handleRequest(request);
  if (routingResponse) return routingResponse;

  // Then handle authentication
  if (!isPublicRoute(request)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public/).*)",
    "/(api|trpc)(.*)",
  ],
};
