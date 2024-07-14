import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest) {

  const securityData = await request.json();

  console.log("Billing Data: ", securityData);

  const cookieStore = cookies();
  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ message: "No sessionid or csrftoken present." }, { status: 500 });
  }

  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/security/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN.value,
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`
      },
      body: JSON.stringify(securityData)
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Security Put Bad request error: ", errorData);

      return NextResponse.json(errorData, { status: 400 });
    }

    const successData = await response.json();

    return NextResponse.json(successData, { status: 200 });

  } catch (err: any) {

    console.log("Server error Security PUT: ", err);

    return NextResponse.json({ message: "Internal server error occured." }, { status: 500 })
  }
}

