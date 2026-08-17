import {MigrationError} from './migration.error';

export interface ApiErrorOptions {
  message: string;
  status?: number | undefined;
  responseBody?: unknown;
  context?: Record<string, unknown> | undefined;
}

// Carries the raw status/response body from a failed Ditat API call, not just
// the fact that it failed -- callers (loaders, the retry decorator) need to
// tell a transient network failure (status undefined) apart from a rejected
// request (status + body Ditat actually sent back).
export class ApiError extends MigrationError {
  readonly code = 'API_ERROR';
  readonly status: number | undefined;
  readonly responseBody: unknown;

  constructor({message, status, responseBody, context}: ApiErrorOptions) {
    super(message, context);
    this.status = status;
    this.responseBody = responseBody;
  }
}
