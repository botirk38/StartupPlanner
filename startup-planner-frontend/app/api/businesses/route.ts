import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server"



export async function POST(request: NextRequest) {
  const cookieStore = cookies();

  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ "message": "Not authorized to access this endpoint." }, { status: 401 })
  }
  try {
    const data = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': `${CSRF_TOKEN.value}`,
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`
      },
      body: JSON.stringify(data)

    })

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(errorData, { status: response.status })
    }

    const successData = await response.json();

    return NextResponse.json(successData, { status: response.status })


  } catch (err: any) {

    console.log("Business Post Server Error: ", err);

    return NextResponse.json({ "message": "Internal server error occured." }, { status: 500 })
  }
}

export async function GET() {

  const cookieStore = cookies();

  const SESSION_ID = cookieStore.get("sessionid");
  const CSRF_TOKEN = cookieStore.get("csrftoken");

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ "message": "Unauthorized access to this endpoint." }, { status: 401 });
  }

  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `sessionid=${SESSION_ID.value}`
      },
    })

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(errorData, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json(data, { status: response.status });

  } catch (err: any) {

    console.log("Business GET Server Error: ", err);

    return NextResponse.json({ "message": "Internal server error occured." })
  }
}
