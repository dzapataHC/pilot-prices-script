export interface IHttpClient {
  get<TResponse>(
    path: string,
    params?: Record<string, unknown>,
  ): Promise<TResponse>;
  post<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse>;
  patch<TResponse, TBody = unknown>(
    path: string,
    body: TBody,
  ): Promise<TResponse>;
  delete<TResponse>(path: string): Promise<TResponse>;
}
