export interface FilterPurchase {
  productId: string;
  userId: string;
  pharmacyId: string | null;
  dateBuyStart: string;
  dateBuyEnd: string;
  state: string;
  countryId: string;
}
