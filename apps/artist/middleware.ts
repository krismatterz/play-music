import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

// Define routes that require authentication
const protectedRoutes = createRouteMatcher([
  "/dashboard(.*)",
  "/upload(.*)",
  "/settings(.*)",
]);

// Define auth-related routes that should never be protected
const authRoutes = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default clerkMiddleware(async (auth, request) => {
  const { userId } = await auth();
  const { nextUrl } = request;

  // Protect routes that require authentication
  if (protectedRoutes(request)) {
    if (!userId) {
      // Redirect to sign-in page if user is not authenticated
      const signInUrl = new URL("/sign-in", nextUrl.origin);
      signInUrl.searchParams.set("redirect_url", nextUrl.pathname);
      return Response.redirect(signInUrl);
    }
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
