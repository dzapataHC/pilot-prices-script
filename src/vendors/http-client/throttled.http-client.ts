import Bottleneck from 'bottleneck';
import pRetry, {AbortError} from 'p-retry';

import {ILogger} from '../logger/logger.types';
import {ApiError} from './api.error';
import {IHttpClient} from './types/http-client';

export interface ThrottledHttpClientOptions {
  client: IHttpClient;
  rateLimit: number;
  concurrency: number;
  logger: ILogger;
}

// Retry policy: 3 total attempts (2 retries) with p-retry's exponential
// backoff (default factor 2, starting at 1s), made explicit rather than
// relying on the library default of 10 retries -- reasonable for a batch
// migration tool where a handful of quick retries is enough to ride out a
// blip, and more than that just delays surfacing a real failure to the
// per-row report.
const RETRY_ATTEMPTS = 3;

// Decorator: wraps any IHttpClient with rate limiting/concurrency (bottleneck)
// and retry-on-transient-failure (p-retry). Kept separate from
// AxiosHttpClient so the HTTP transport and the throttling/retry policy each
// stay a single responsibility.
export class ThrottledHttpClient implements IHttpClient {
  private readonly client: IHttpClient;
  private readonly limiter: Bottleneck;
  private readonly logger: ILogger;

  constructor({
    client,
    rateLimit,
    concurrency,
    logger,
  }: ThrottledHttpClientOptions) {
    this.client = client;
    this.logger = logger.child({component: 'ThrottledHttpClient'});

    // ASSUMPTION: `RATE_LIMIT` (env var, default 200) is requests *per
    // minute* -- the env schema documents no unit. 200 req/sec would be an
    // unusually high ceiling for this kind of TMS integration, so
    // requests-per-minute is the more defensible reading, but this needs
    // confirming against Ditat's actual published/observed rate limit and
    // correcting here (only this one derivation) once known.
    const minTime = (60 * 1000) / rateLimit;

    this.limiter = new Bottleneck({maxConcurrent: concurrency, minTime});
  }

  async get<TResponse>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<TResponse> {
    return this.runWithRetry(path, () =>
      this.client.get<TResponse>(path, params),
    );
  }

  async post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    return this.runWithRetry(path, () =>
      this.client.post<TResponse, TBody>(path, body),
    );
  }

  async patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    return this.runWithRetry(path, () =>
      this.client.patch<TResponse, TBody>(path, body),
    );
  }

  async delete<TResponse>(path: string): Promise<TResponse> {
    return this.runWithRetry(path, () => this.client.delete<TResponse>(path));
  }

  // Shared by all four verbs: schedules the operation through the bottleneck
  // limiter and retries it on transient failure, aborting immediately on a
  // non-retryable 4xx. Each public method only supplies its own underlying
  // call -- the throttle/retry/logging policy itself lives in exactly one
  // place.
  private async runWithRetry<TResponse>(
    path: string,
    operation: () => Promise<TResponse>,
  ): Promise<TResponse> {
    return this.limiter.schedule(() =>
      pRetry(
        async () => {
          try {
            return await operation();
          } catch (err) {
            if (err instanceof ApiError && !this.isRetryable(err)) {
              throw new AbortError(err);
            }

            throw err;
          }
        },
        {
          retries: RETRY_ATTEMPTS - 1,
          onFailedAttempt: context => {
            this.logger.warn('HTTP request failed, retrying', {
              path,
              attemptNumber: context.attemptNumber,
              retriesLeft: context.retriesLeft,
            });
          },
        },
      ),
    );
  }

  // Network failures (no response, status undefined) and 5xx/429 responses
  // are transient -- worth retrying. Any other 4xx means the request itself
  // is malformed/rejected and will fail identically every time, so retrying
  // wastes calls and time.
  private isRetryable(error: ApiError): boolean {
    return (
      error.status === undefined || error.status >= 500 || error.status === 429
    );
  }
}
