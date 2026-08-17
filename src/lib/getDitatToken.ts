import {envs} from '../config/envs';

export async function getDitatToken(): Promise<string> {
  const account = envs.DITAT_ACCOUNT;
  const username = envs.DITAT_USERNAME;
  const pass = envs.DITAT_PASSWORD;

  const basicAuth = Buffer.from(`${username}:${pass}`, 'utf-8').toString(
    'base64',
  );

  const loginAttempt = await fetch(`${envs.DITAT_BASE}/api/tms/auth/login`, {
    method: 'POST',
    headers: {
      'Ditat-Application-Role': 'Login to TMS',
      'Ditat-Account-Id': account,
      Authorization: `Basic ${basicAuth}`,
    },
  });

  const token = await loginAttempt.text();

  return token;
}
