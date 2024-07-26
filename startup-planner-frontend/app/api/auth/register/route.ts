import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const responseData = await response.json();

      // Create a new response
      const newResponse = NextResponse.json(
        responseData,
        { status: response.status }
      );

      // Get the cookies from the original response
      const setCookieHeader = response.headers.get('Set-Cookie');

      if (setCookieHeader) {
        newResponse.headers.set('Set-Cookie', setCookieHeader);
      }

      return newResponse;
    } else {
      const error = await response.json();
      return NextResponse.json(error, { status: response.status });
    }


  } catch (err: any) {
    console.log("Server error: ", err);

    return NextResponse.json({ message: "Server error" }, { status: 500 });

  }
}



