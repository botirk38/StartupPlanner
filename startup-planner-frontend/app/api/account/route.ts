import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function PUT(request: NextRequest) {
  const accountData = await request.formData();
  const cookieStore = cookies();
  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  console.log("Session ID:", SESSION_ID);
  console.log("CSRF token:", CSRF_TOKEN);

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ message: "Not authorized to access this endpoint." }, { status: 401 });
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/account/`, {
      method: 'PUT',
      headers: {
        'X-CSRFToken': CSRF_TOKEN.value,
        'Referer': 'http://127.0.0.1:8000',
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`,

      },
      body: accountData
    });

    console.log("Backend Response Status:", response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log("Backend Error Data:", errorData);
      return NextResponse.json({ message: errorData }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (err) {
    console.log("Server error in Account PUT: ", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

