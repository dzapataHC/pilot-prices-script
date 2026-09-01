import fs from 'fs';
import {join} from 'path';

import {createLogger} from '../vendors/logger';
import {PriceRow} from './extractData.util';
import {normalizeStoreId} from './payloadParser.util';

const STAGE = 'CSV File creation';

export async function createCsv(data: PriceRow[]): Promise<void> {
  const logger = createLogger();

  try {
    const path = join(__dirname, '../../files/output.csv');

    const HEADERS = ['Vendor fuel store Id', 'Price per gallon'];
    const CSV_ROWS = data.map(
      item => `"${normalizeStoreId(Number(item.store))}","${item.price}"`,
    );
    const content = [HEADERS.join(','), ...CSV_ROWS].join('\n');

    await fs.promises.writeFile(path, content, 'utf-8');

    logger.info('CSV File created correctly\n', {
      stage: STAGE,
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);

    logger.error('[!] Script failed', {
      stage: STAGE,
      message: msg,
    });
  }
}
