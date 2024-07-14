import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function PUT(request: NextRequest) {

  const billingData = await request.json();

  console.log("Billing Data: ", billingData);

  const cookieStore = cookies();
  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ message: "No sessionid or csrftoken present." }, { status: 500 });
  }

  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/billing/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': CSRF_TOKEN.value,
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`
      },
      body: JSON.stringify(billingData)
    })

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Billing Put Bad request error: ", errorData);

      return NextResponse.json(errorData, { status: 400 });
    }

    const successData = await response.json();

    return NextResponse.json(successData, { status: 200 });

  } catch (err: any) {

    console.log("Server error Billing PUT: ", err);

    return NextResponse.json({ message: "Internal server error occured." }, { status: 500 })
  }
}
