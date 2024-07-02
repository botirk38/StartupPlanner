
import { NextResponse } from 'next/server';

export async function GET() {

  const canvaAuthUrl = `https://www.canva.com/api/oauth/authorize?response_type=code&client_id=${process.env.CANVA_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.CANVA_REDIRECT_URI)}&scope=asset:read asset:write design:content:read design:content:write design:meta:read profile:read &code_challenge=${codeChallenge}&code_challenge_method=S256&state=${state}`;

  return NextResponse.redirect(canvaAuthUrl);
}

