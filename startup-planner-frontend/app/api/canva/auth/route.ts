
import { NextResponse } from 'next/server';
import { generateCodeVerifier, generateCodeChallenge, generateState } from '@/lib/pkce';

export async function GET() {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = generateCodeChallenge(codeVerifier);
  const state = generateState();

  const cookies = new Headers();
  cookies.append('Set-Cookie', `code_verifier=${codeVerifier}; HttpOnly; Path=/`);
  cookies.append('Set-Cookie', `state=${state}; HttpOnly; Path=/`);

  const canvaAuthUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${process.env.CANVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CANVA_REDIRECT_URI)}&scope=asset:read asset:write design:content:read design:content:write design:meta:read profile:read &code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

  return NextResponse.redirect(canvaAuthUrl, { headers: cookies });
}

