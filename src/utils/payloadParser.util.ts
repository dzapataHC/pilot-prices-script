import {createNegativeInt} from '../vendors/create-negative-number/createNegativeNumber';
import {PayloadFormat} from './payloadFormatter.util';

interface Price {
  store: string;
  price: string;
}

function getFormattedDate(): string {
  const d = new Date();
  const date = String(d.getDate() + 1).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const formatted = `${month}/${date}/${year}`;

  return formatted;
}

function normalizeStoreId(id: number): string {
  return String(id).padStart(3, '0');
}

const today = new Date();

const priceActiveDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate() + 1).padStart(2, '0')}T00:00:00`;

export function buildPayload(prices: Price[]): PayloadFormat {
  const listKey = createNegativeInt();
  const index = createNegativeInt();

  const body = {
    fuelProviderFuelPriceListKey: listKey,
    fuelProviderFuelPriceListId: '',
    createdBy: 646,
    createdOn: new Date().toISOString(),
    description: `${getFormattedDate()} Pricing`,
    priceActiveDate,
    providerType: 2,
    rowVersion: '',
    updatedOn: new Date().toISOString(),
  };

  const lines = prices.map((price, _i) => ({
    fuelProviderFuelPriceListLineKey: index - _i,
    fuelProviderFuelPriceListKey: 0,
    fuelStoreId: `Pilot-${normalizeStoreId(Number(price.store))}`,
    pricePerGallon: Number(price.price),
    vendorFuelStoreId: normalizeStoreId(Number(price.store)),
  }));

  return {
    ...body,
    rnpFuelProviderFuelPriceListLines: lines,
  };
}
