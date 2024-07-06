import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check authentication status
export async function middleware(request: NextRequest) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/check-auth`;

  // Retrieve the session ID from the cookies
  const cookieStore = cookies();
  const sessionId = cookieStore.get('sessionid');

  // If there is no session ID, redirect to the root page
  if (!sessionId) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Fetch the authentication status from Django API
  const response = await fetch(apiEndpoint, {
    headers: {
      'Content-Type': 'application/json',
      'Cookie': `sessionid=${sessionId}`
    }
  });

  if (response.status === 200) {
    const data = await response.json();
    if (data.isAuthenticated) {
      return NextResponse.next();
    }
  }

  // If not authenticated, redirect to the root page
  return NextResponse.redirect('/');
}

// Configure the middleware to match specific paths
export const config = {
  matcher: ['/dashboard/:path*'],
};


