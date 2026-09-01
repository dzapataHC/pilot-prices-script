import {envs} from '../config/envs';
import {CsvDataSource} from '../lib/CsvDataSource';
import {createLogger} from '../vendors/logger';
import {createCsv} from './createCsv';

export interface PriceRow {
  store: string;
  price: string;
}

const STAGE = 'Data Extraction';

export async function extractData(source: CsvDataSource): Promise<PriceRow[]> {
  const data: PriceRow[] = [];
  const logger = createLogger();

  for await (const row of source.read()) {
    const descriptors = Object.getOwnPropertyDescriptors(row) as {
      [key: string]: {value: string};
    };

    const storeId = descriptors[envs.STORE_ID];
    const retailPrice = descriptors[envs.PRICE];
    const effectiveDate = descriptors[envs.EFFECTIVE_DATE];
    const value = {
      store: storeId?.value,
      price: retailPrice?.value,
      date: effectiveDate?.value,
    };

    if (!value) continue;

    const {date} = value;

    if (new Date().getDay() !== 0) {
      if (new Date(date!).getDate() === new Date().getDate()) {
        throw new Error('Target date is actual date.');
      }
    }

    const {store, price} = value;

    if (!store || !price) {
      logger.warn('[!] Skipping row with missing store or price', {
        stage: STAGE,
      });
      continue;
    }

    if (Number(store) === 1474) continue;

    data.push({
      store: store.trim(),
      price: price.trim(),
    });
  }
  await createCsv(data);

  return data;
}
