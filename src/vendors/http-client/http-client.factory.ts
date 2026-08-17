import {envs} from '../../config/envs';
import type {IHttpClient} from '../http-client/types/http-client';
import {createLogger} from '../logger';
import {AxiosHttpClient} from './axios.http-client';
import {ThrottledHttpClient} from './throttled.http-client';

// Only place either concrete client is constructed: AxiosHttpClient does the
// actual HTTP transport, wrapped in ThrottledHttpClient for rate
// limiting/concurrency + retry. Callers only ever see the IHttpClient port.
export function createHttpClient(token: string): IHttpClient {
  const logger = createLogger();

  const client = new AxiosHttpClient({
    baseUrl: envs.DITAT_BASE,
    token,
    logger,
  });

  return new ThrottledHttpClient({
    client,
    rateLimit: 190,
    concurrency: 5,
    logger,
  });
}
