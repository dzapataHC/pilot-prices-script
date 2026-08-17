import fs from 'fs';
import {join} from 'path';

import {CsvDataSource} from '../lib/CsvDataSource';
import {getDitatToken} from '../lib/getDitatToken';
import {SftpClient} from '../lib/SftpClient';
import {extractData} from '../utils/extractData.util';
import {PayloadFormat} from '../utils/payloadFormatter.util';
import {buildPayload} from '../utils/payloadParser.util';
import {createHttpClient} from '../vendors/http-client/http-client.factory';
import {createLogger} from '../vendors/logger';
import {Application} from './app.types';

const FILENAME = 'pq222100US.csv';
const TARGET_LOCATION = join(__dirname, '../../files', FILENAME);

export class App implements Application {
  constructor(
    private _logger = createLogger(),
    private _client = new SftpClient(),
  ) {}

  async connect(): Promise<void> {
    try {
      this._logger.info('[+] Connecting to the SFTP server...');
      await this._client.connect();
      this._logger.info('[+] Downloading file...');

      const file = await this._client.read(`/${FILENAME}`);
      if (!file) throw new Error(`File not found: ${FILENAME}`);

      this._logger.info(`[+] File found ${FILENAME}\n`);

      await this.saveFile();
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      this._logger.error('[+] Script Failed:', {message});
    }
  }

  async saveFile(): Promise<void> {
    try {
      await this._client.saveFile(FILENAME, TARGET_LOCATION);
      this._logger.info(`[+] File saved to: ${TARGET_LOCATION}\n`);
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);

      this._logger.error('[!] Script failed:', {
        message: msg,
      });
    }
  }

  async transformFile(): Promise<PayloadFormat | undefined> {
    try {
      this._logger.info('[+] Transforming CSV...');

      const source = new CsvDataSource({filePath: TARGET_LOCATION});
      const data = await extractData(source);

      this._logger.info(`[+] Extracted ${data.length} records\n`);

      const body = buildPayload(data);

      return body;
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this._logger.error('Script failed', {message});
    }
  }

  async uploadFile(): Promise<void> {
    try {
      this._logger.info('Uploading File');
      const body = await this.transformFile();
      const token = await getDitatToken();
      const http = createHttpClient(token);

      const res = await http.post(
        '/api/tms/data/fuel-provider-fuel-price-list',
        body,
      );
      const result = JSON.stringify(res, null, 2);

      fs.writeFile(
        join(__dirname, '../../result.log'),
        result,
        'utf-8',
        err => {
          if (err) throw new Error('Err');
        },
      );
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this._logger.error('Script failed', {message});
      await this.disconnect();
      process.exit(1);
    }
  }

  async disconnect(): Promise<void> {
    await this._client.disconnect();
  }

  async run(): Promise<void> {
    this._logger.info('[+] Initiating Script\n');
    await this.connect();
    await this.saveFile();
    await this.uploadFile();
    await this.disconnect();
  }
}
