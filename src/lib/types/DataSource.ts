export interface DataSource<T> {
  read(): AsyncIterable<T>;
  readAll(): Promise<Record<string, string>[]>;
}
