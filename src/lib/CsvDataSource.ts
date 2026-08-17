import {createReadStream} from 'node:fs';

import csvParser from 'csv-parser';

import {DataSource} from './types/DataSource';

export interface CsvDataSourceOptions {
  filePath: string;
  delimiter?: string;
  encoding?: BufferEncoding;
}

export class CsvDataSource implements DataSource<Record<string, string>> {
  constructor(private readonly options: CsvDataSourceOptions) {}

  async *read(): AsyncIterable<Record<string, string>> {
    const {filePath, delimiter = ',', encoding = 'utf8'} = this.options;

    const fileStream = createReadStream(filePath, {encoding});
    const parser = csvParser({separator: delimiter});

    fileStream.on('error', error => parser.destroy(error));
    fileStream.pipe(parser);

    for await (const row of parser) {
      yield row as Record<string, string>;
    }
  }
  async readAll(): Promise<Record<string, string>[]> {
    const rows: Record<string, string>[] = [];

    for await (const row of this.read()) {
      rows.push(row);
    }

    return rows;
  }
}
