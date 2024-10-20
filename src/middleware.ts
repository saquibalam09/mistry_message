import { NextResponse } from "next/server";
import { NextRequest } from "next/server";

export { default } from "next-auth/middleware";
import { getToken } from "next-auth/jwt";
// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request });
  const url = request.nextUrl;

  // Allow unauthenticated users to access sign-in, sign-up, and verify pages
  //   if (!token) {
  //     if (
  //       url.pathname.startsWith("/sign-in") ||
  //       url.pathname.startsWith("/sign-up") ||
  //       url.pathname.startsWith("/verify")
  //     ) {
  //       return NextResponse.next(); // Let the request pass through
  //     } else {
  //       return NextResponse.redirect(new URL("/home", request.url)); // Redirect to home if unauthenticated
  //     }
  //   }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (
    token &&
    (url.pathname.startsWith("/sign-in") ||
      url.pathname.startsWith("/sign-un") ||
      url.pathname.startsWith("/verify") ||
      url.pathname.startsWith("/"))
  ) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  //   return NextResponse.redirect(new URL("/home", request.url));
  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/sign-in", "/", "/sign-up", "/dashboard/:path*"],
};
