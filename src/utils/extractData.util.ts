import {CsvDataSource} from '../lib/CsvDataSource';
import {createLogger} from '../vendors/logger';

interface PriceRow {
  store: string;
  price: string;
}

export async function extractData(source: CsvDataSource): Promise<PriceRow[]> {
  const data: PriceRow[] = [];
  const logger = createLogger();

  for await (const row of source.read()) {
    const descriptors = Object.getOwnPropertyDescriptors(row) as {
      [key: string]: {value: string};
    };

    const storeId = descriptors['Store#'];
    const retailPrice = descriptors['CP Price'];
    const effectiveDate = descriptors['Effective Date'];
    const value = {store: storeId?.value, price: retailPrice?.value, date: effectiveDate?.value};

    if (!value) continue;

    const {date} = value;

    if (new Date(date!).getDate() === new Date().getDate()){
      throw new Error('Target date is actual date.')
    }

    const {store, price} = value;

    if (!store || !price) {
      logger.warn('[!] Skipping row with missing store or price');
      continue;
    }

    data.push({
      store: store.trim(),
      price: price.trim(),
    });
  }

  return data;
}
