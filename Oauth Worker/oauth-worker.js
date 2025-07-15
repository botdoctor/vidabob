addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  const url = new URL(request.url);

  // Handle CORS for development
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  }

  try {
    switch (url.pathname) {
      case '/auth/google':
        return handleGoogleAuth();
      case '/auth/callback':
        return handleCallback(url);
      default:
        return new Response('Not found', { status: 404 });
    }
  } catch (error) {
    console.error('OAuth Worker Error:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

function handleGoogleAuth() {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    scope: 'openid email profile',
    access_type: 'offline',
    prompt: 'consent'
  });

  const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  
  return Response.redirect(googleAuthUrl, 302);
}

async function handleCallback(url) {
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error) {
    return new Response(`OAuth Error: ${error}`, { status: 400 });
  }

  if (!code) {
    return new Response('Authorization code not provided', { status: 400 });
  }

  try {
    // Exchange code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token');
    }

    const tokenData = await tokenResponse.json();

    // Get user info from Google
    const userResponse = await fetch('https://openidconnect.googleapis.com/v1/userinfo', {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userResponse.ok) {
      throw new Error('Failed to fetch user info');
    }

    const user = await userResponse.json();

    // Send user data to backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/auth/callback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oauthId: user.sub,
        email: user.email,
        firstName: user.given_name,
        lastName: user.family_name,
      }),
    });

    if (!backendResponse.ok) {
      throw new Error('Backend authentication failed');
    }

    const backendData = await backendResponse.json();

    // Redirect to frontend with success
    const frontendUrl = `${FRONTEND_URL}/auth/success`;
    return Response.redirect(frontendUrl, 302);

  } catch (error) {
    console.error('OAuth callback error:', error);
    const frontendUrl = `${FRONTEND_URL}/auth/error?message=${encodeURIComponent(error.message)}`;
    return Response.redirect(frontendUrl, 302);
  }
}

// Environment variables (set in wrangler.toml)
const CLIENT_ID = typeof GOOGLE_CLIENT_ID !== 'undefined' ? GOOGLE_CLIENT_ID : 'your-google-client-id';
const CLIENT_SECRET = typeof GOOGLE_CLIENT_SECRET !== 'undefined' ? GOOGLE_CLIENT_SECRET : 'your-google-client-secret';
const REDIRECT_URI = typeof OAUTH_REDIRECT_URI !== 'undefined' ? OAUTH_REDIRECT_URI : 'http://localhost:8787/auth/callback';
const BACKEND_URL = typeof BACKEND_API_URL !== 'undefined' ? BACKEND_API_URL : 'http://localhost:5000';
const FRONTEND_URL = typeof FRONTEND_APP_URL !== 'undefined' ? FRONTEND_APP_URL : 'http://localhost:3000';