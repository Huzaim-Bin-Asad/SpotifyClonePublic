import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // Using the credentials directly
  const SPOTIFY_CLIENT_ID = 'fe6d3691a9da40da85cfb30b98b85f3d'
  const SPOTIFY_REDIRECT_URI = 'http://127.0.0.1:3000/callback'
 
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
    client_id: SPOTIFY_CLIENT_ID,
    response_type: 'code',
    redirect_uri: SPOTIFY_REDIRECT_URI,
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
