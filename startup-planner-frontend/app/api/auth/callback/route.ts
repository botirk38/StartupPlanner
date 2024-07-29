import { NextRequest, NextResponse } from "next/server";

// Function to parse cookies
function parseCookies(cookieString: string | null): { [key: string]: string } {
  const cookies: { [key: string]: string } = {};
  if (cookieString) {
    cookieString.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      const name = parts[0].trim();
      const value = parts.slice(1).join('=').trim(); // Handle values that may contain '='
      cookies[name] = decodeURIComponent(value);
    });
  }
  return cookies;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const firstTimeLogin = searchParams.get('first_time_login') === 'true';

    let response: NextResponse;

    if (firstTimeLogin) {
      response = NextResponse.redirect(new URL('/business/create', request.url));
    } else {
      response = NextResponse.redirect(new URL('/dashboard', request.url));
    }

    // Get the cookies from the original request
    const requestCookies = request.headers.get('cookie');

    // Set the cookies in the new response
    if (requestCookies) {
      response.headers.set('Cookie', requestCookies);
    }

    // Log the cookies for debugging
    console.log("Request cookies:", requestCookies);
    console.log("Response cookies:", response.headers.get('Cookie'));

    // Parse cookies for logging
    const parsedCookies = parseCookies(requestCookies);
    console.log("Parsed cookies:", parsedCookies);

    return response;
  } catch (error: any) {
    console.log("Error: ", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

