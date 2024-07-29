import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {

  const competitorId = params.id;

  const cookieStore = cookies();



  const SESSION_ID = cookieStore.get('sessionid');
  const CSRF_TOKEN = cookieStore.get('csrftoken');

  if (!SESSION_ID || !CSRF_TOKEN) {
    return NextResponse.json({ "message": "Not authorized to access this endpoint." }, { status: 401 })
  }

  try {


    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/competitors/${competitorId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': `${CSRF_TOKEN.value}`,
        'Cookie': `sessionid=${SESSION_ID.value}; csrftoken=${CSRF_TOKEN.value}`

      },
    })

    if (!response.ok) {
      const errorData = await response.json();

      return NextResponse.json(errorData, { status: response.status })


    }


    return NextResponse.json("Competitor deleted Successfully.", { status: 200 })

  } catch (err: any) {

    console.log("Competitor Delete Server Error: ", err.message);

    return NextResponse.json({ "message": "Internal server error occured." }, { status: 500 })


  }






}
