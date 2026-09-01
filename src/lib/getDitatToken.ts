import {envs} from '../config/envs';

interface OAuthProps {
  access_token: string;
  token_type: string;
  expires_in: number;
}

export async function getDitatToken(): Promise<OAuthProps> {
  const account = envs.DITAT_ACCOUNT;
  const clientID = envs.DITAT_CLIENT_ID;
  const clientSecret = envs.DITAT_CLIENT_SECRET;
  const endpoint = `${envs.DITAT_BASE}/identity-provider/${account}/connect/token`;

  const loginAttempt = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientID,
      client_secret: clientSecret,
    }),
  });

  const token = (await loginAttempt.json()) as OAuthProps;

  return token;
}
