import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state');
  console.log("State: ", state);
  const cookie_store = cookies();
  const storedState = cookie_store.get('state')?.value;
  console.log("Stored State:", storedState);
  const codeVerifier = cookie_store.get('code_verifier')?.value;

  if (state !== storedState) {
    return NextResponse.json({ error: 'Invalid state parameter' }, { status: 400 });
  }

  try {
    const tokenResponse = await fetch('https://api.canva.com/rest/v1/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: process.env.CANVA_CLIENT_ID!,
        client_secret: process.env.CANVA_CLIENT_SECRET!,
        code: code!,
        code_verifier: codeVerifier!,
        redirect_uri: process.env.CANVA_REDIRECT_URI!,
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange authorization code for access token');
    }

    const { access_token } = await tokenResponse.json();

    return NextResponse.redirect('/dashboard');
  } catch (error) {
    return NextResponse.json({ error: 'Failed to authenticate with Canva' }, { status: 500 });
  }
}

