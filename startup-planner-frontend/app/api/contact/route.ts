import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const data = await req.json();

  const response = await fetch('https://your-django-backend.com/api/contact', {
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
}

