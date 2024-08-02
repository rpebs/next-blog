import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const secret = process.env.AUTH_SECRET; // Ensure this is set in your .env file

export async function middleware(req) {
  console.log("Request URL:", req.url);
  
  const token = await getToken({ req, secret });
  console.log("Token:", token); // Debugging line

  // Define protected paths
  const protectedPaths = ['/admin'];
  const isProtectedPath = protectedPaths.some((path) => req.nextUrl.pathname.startsWith(path));

  console.log("Is protected path:", isProtectedPath);

  // Allow requests if the path is public or if token exists (authenticated)
  if (!isProtectedPath || token) {
    console.log("Next response: continue");
    return NextResponse.next();
  }

  // Redirect to login page if not authenticated
  const loginUrl = new URL('/login', req.url);
  console.log("Redirecting to login:", loginUrl);
  return NextResponse.redirect(loginUrl);
}

// Apply the middleware to all routes that start with '/admin'
export const config = {
  matcher: ['/admin/:path*'],
};
