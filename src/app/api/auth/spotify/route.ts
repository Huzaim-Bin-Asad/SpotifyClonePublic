import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Using environment variables with fallbacks
  const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID
  const SPOTIFY_REDIRECT_URI = process.env.NEXT_PUBLIC_SPOTIFY_REDIRECT_URI
 
  const scopes = [
    'user-read-private',
    'user-read-email',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-top-read',
    'user-read-recently-played'
  ].join(' ')

  const params = new URLSearchParams({
    client_id: SPOTIFY_CLIENT_ID!,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI!,
    scope: scopes,
  })

  const authUrl = `https://accounts.spotify.com/authorize?${params.toString()}`
  
  // Debug logging
  console.log('Generated auth URL:', authUrl)
  console.log('Client ID:', SPOTIFY_CLIENT_ID)
  console.log('Redirect URI:', SPOTIFY_REDIRECT_URI)
  console.log('Scopes:', scopes)
  

  return NextResponse.json({ authUrl })
}
