import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {

  try {
    const data = await req.json();


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/contact-us/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return NextResponse.json({ message: 'Message sent successfully' }, { status: 200 });
    } else {
      const error = await response.json();
      return NextResponse.json({ message: error.message || 'Failed to send message' }, { status: response.status });
    }
  } catch (err: any) {
    console.log("Server error: ", err);

    return NextResponse.json({ message: "Server error" }, { status: 500 });

  }
}


