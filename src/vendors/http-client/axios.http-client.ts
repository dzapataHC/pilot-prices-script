import axios, {type AxiosInstance} from 'axios';

import type {ILogger} from '../logger';
import {ApiError} from './api.error';
import type {IHttpClient} from './types/http-client';

export interface AxiosHttpClientOptions {
  baseUrl: string;
  token: string;
  logger: ILogger;
}

// Thin wrapper around a single axios instance. Ditat auth uses its own
// `Ditat-Token` scheme (not Bearer) -- confirmed against the sibling
// `ditat-call-example` project's `DitatClient`. Every failure (non-2xx
// response or network-level failure with no response at all) is normalized
// into an ApiError here so no raw AxiosError ever escapes this class.
export class AxiosHttpClient implements IHttpClient {
  private readonly instance: AxiosInstance;
  private readonly logger: ILogger;

  constructor({baseUrl, token, logger}: AxiosHttpClientOptions) {
    this.instance = axios.create({
      baseURL: baseUrl,
      headers: {
        Authorization: `Ditat-Token ${token}`,
        'Content-Type': 'application/json',
      },
    });
    this.logger = logger.child({component: 'AxiosHttpClient'});
  }

  async get<TResponse>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<TResponse> {
    return this.execute('GET', path, () =>
      this.instance.get<TResponse>(path, {params}),
    );
  }

  async post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    return this.execute('POST', path, () =>
      this.instance.post<TResponse>(path, body),
    );
  }

  async patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse> {
    return this.execute('PATCH', path, () =>
      this.instance.patch<TResponse>(path, body),
    );
  }

  async delete<TResponse>(path: string): Promise<TResponse> {
    return this.execute('DELETE', path, () =>
      this.instance.delete<TResponse>(path),
    );
  }

  // Shared by all four verbs: runs the underlying axios call and normalizes
  // any failure into an ApiError with the same status/responseBody/context
  // shape, so no raw AxiosError ever escapes this class.
  private async execute<TResponse>(
    method: string,
    path: string,
    operation: () => Promise<{data: TResponse}>,
  ): Promise<TResponse> {
    try {
      const response = await operation();
      return response.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        this.logger.error(`HTTP ${method} failed`, {
          path,
          status: err.response?.status,
        });
        throw new ApiError({
          message: `${method} ${path} failed: ${err.message}`,
          status: err.response?.status,
          responseBody: err.response?.data,
          context: {path},
        });
      }

      const message = err instanceof Error ? err.message : 'Unknown HTTP error';
      this.logger.error(`HTTP ${method} failed`, {path, message});
      throw new ApiError({
        message: `${method} ${path} failed: ${message}`,
        context: {path},
      });
    }
  }
}
