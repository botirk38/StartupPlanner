import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware function to check authentication status
export async function middleware(request: NextRequest) {
  const apiEndpoint = `${process.env.NEXT_PUBLIC_API_URL}/auth/check-auth/`;
  console.log("Endpoint: ", apiEndpoint)

  // Retrieve the session ID from the cookies
  const sessionId = request.cookies.get('sessionid');
  console.log("Session ID: ", sessionId);

  if (!sessionId) {
    console.log("No sessionId");
    return NextResponse.redirect(new URL('/', request.url));
  }

  try {
    const response = await fetch(apiEndpoint, {
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sessionid=${sessionId.value}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.log("Error: ", error);
      return NextResponse.redirect(new URL('/', request.url));

    }

    const data = await response.json();
    if (data.isAuthenticated) {
      return NextResponse.next();
    }

  } catch (err: any) {
    console.log("Error: ", err);
  }

  // If not authenticated, redirect to the root page
  return NextResponse.redirect(new URL('/', request.url));
}

// Configure the middleware to match specific paths
export const config = {
  matcher: ['/dashboard/:path*', '/business/:path*'],
};


