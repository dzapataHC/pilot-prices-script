export interface PayloadFormat {
  fuelProviderFuelPriceListKey: number; // RANDOM NEGATIVE
  fuelProviderFuelPriceListId: string;
  createdBy: number;
  createdOn: string; // ISO STRING
  description: string;
  priceActiveDate: string; // ISO STRING
  providerType: number;
  rowVersion: string;
  updatedOn: string;
  rnpFuelProviderFuelPriceListLines: PriceList[];
}

export interface PriceList {
  fuelProviderFuelPriceListLineKey: number; // RANDOM NEGATIVE
  fuelProviderFuelPriceListKey: number;
  fuelStoreId: string;
  pricePerGallon: number;
  vendorFuelStoreId: string;
}
