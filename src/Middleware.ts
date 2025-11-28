import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // Allow admin routes to pass through - they have their own checks
    if (path.startsWith('/admin')) {
      return NextResponse.next();
    }

    // Protect dashboard routes - require authentication
    if (path.startsWith('/dashboard')) {
      if (!token) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;
        
        // Always allow admin routes
        if (path.startsWith('/admin')) {
          return true;
        }
        
        // Only require auth for dashboard routes
        if (path.startsWith('/dashboard')) {
          return !!token;
        }
        
        return true; // Allow all other routes
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'], // Protect both dashboard and admin
};