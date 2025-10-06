import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json()
    
    if (!code) {
      return NextResponse.json({ error: 'Authorization code is required' }, { status: 400 })
    }

    // Use environment variables with fallbacks
    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
    const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET 
    const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI 

    // Client secret is now hardcoded, no need to check

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: SPOTIFY_REDIRECT_URI,
        client_id: SPOTIFY_CLIENT_ID,
        client_secret: SPOTIFY_CLIENT_SECRET
      })
    })

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text()
      console.error('Token exchange failed:', errorData)
      return NextResponse.json({ error: 'Failed to exchange authorization code' }, { status: 400 })
    }

    const tokenData = await tokenResponse.json()
    console.log('Spotify token exchange successful:', tokenData)
    
    // Add expiration timestamp
    const tokenWithExpiry = {
      ...tokenData,
      expires_at: Date.now() + (tokenData.expires_in * 1000)
    }

    return NextResponse.json(tokenWithExpiry)
  } catch (error) {
    console.error('Token exchange error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
