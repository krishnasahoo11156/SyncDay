import { encryptToken, decryptToken } from "../crypto/tokens";

const GOOGLE_AUTH_ENDPOINT = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";

export interface GoogleTokens {
  accessToken: string;
  refreshToken?: string;
  idToken?: string;
  expiresIn: number;
}

/**
 * Generates the Google OAuth consent redirect URL
 */
export function getGoogleAuthUrl(state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.GOOGLE_CLIENT_ID!,
    redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    response_type: "code",
    scope: "https://www.googleapis.com/auth/calendar.app.created openid email",
    access_type: "offline",
    prompt: "consent", // Force consent so we always get a refresh token on reconnect
    state: state,
  });

  return `${GOOGLE_AUTH_ENDPOINT}?${params.toString()}`;
}

/**
 * Exchanges the Google authorization code for Access & Refresh tokens
 */
export async function exchangeAuthCode(code: string): Promise<GoogleTokens> {
  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      code: code,
      grant_type: "authorization_code",
      redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Failed to exchange auth code.");
  }

  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token, // Only present on first consent or forced prompt
    idToken: data.id_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Refreshes an expired Access Token using a saved Google refresh token
 */
export async function refreshAccessToken(encryptedRefreshToken: string): Promise<{ accessToken: string; expiresIn: number }> {
  const refreshToken = decryptToken(encryptedRefreshToken);

  const res = await fetch(GOOGLE_TOKEN_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error_description || data.error || "Failed to refresh Google access token.");
  }

  return {
    accessToken: data.access_token,
    expiresIn: data.expires_in,
  };
}

/**
 * Revokes an active Google refresh token to cancel application access
 */
export async function revokeGoogleToken(encryptedRefreshToken: string): Promise<void> {
  const refreshToken = decryptToken(encryptedRefreshToken);
  const revokeUrl = `https://oauth2.googleapis.com/revoke?token=${encodeURIComponent(refreshToken)}`;

  const res = await fetch(revokeUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error_description || "Failed to revoke Google access token.");
  }
}
