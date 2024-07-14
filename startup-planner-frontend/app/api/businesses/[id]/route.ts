import { cookies } from "next/headers";
import { NextResponse, NextRequest } from "next/server";



export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  const cookieStore = cookies();


  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  const id = params.id;


  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ "message": "Not authorized to access this endpoint." }, { status: 401 })
  }
  try {
    const data = await request.json();

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/`, {
      method: 'PUT',
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

    console.log("Business PUT Server Error: ", err);

    return NextResponse.json({ "message": "Internal server error occured." }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

  const cookieStore = cookies();

  const id = params.id;

  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ "message": "Not authorized to access this endpoint." }, { status: 401 })
  }
  try {

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/businesses/${id}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': `${CSRF_TOKEN.value}`,
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`
      },

    })

    if (!response.ok) {

      return NextResponse.json("Failed to delete business.", { status: response.status });
    }


    return NextResponse.json("Successfully deleted business.", { status: 200 });


  } catch (err: any) {

    console.log("Business DELETE Server Error: ", err);

    return NextResponse.json({ "message": "Internal server error occured." }, { status: 500 })
  }
}


