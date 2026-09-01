import 'dayjs/locale/en';

import dayjs from 'dayjs';

import {createNegativeInt} from '../vendors/create-negative-number/createNegativeNumber';
import {dateToISO} from './dateToISO';
import {PayloadFormat} from './payloadFormatter.util';

interface Price {
  store: string;
  price: string;
}

export function normalizeStoreId(id: number): string {
  return String(id).padStart(3, '0');
}

const tomorrow = dayjs().add(1, 'd');
const formattedTomorrow = tomorrow.format().slice(0, 10);
const sufix = 'T00:00:00.000Z';

const priceActiveDate = `${formattedTomorrow}${sufix}`;

export function buildPayload(prices: Price[]): PayloadFormat {
  const listKey = createNegativeInt();
  const index = createNegativeInt();

  const body = {
    fuelProviderFuelPriceListKey: listKey,
    fuelProviderFuelPriceListId: '',
    createdBy: 0,
    createdOn: dateToISO(new Date()),
    description: `${tomorrow.format('MM/DD/YYYY')} Pricing`,
    priceActiveDate,
    providerType: 2,
    rowVersion: '',
    updatedOn: dateToISO(new Date()),
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
