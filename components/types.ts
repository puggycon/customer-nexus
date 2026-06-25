export type Visit = {
  id: string;
  visitDate: string;
  product: string;
  price: number;
  durationDays: number;
  memo: string;
  pharmacist: string;
};

export type Customer = {
  id: string;
  name: string;
  mobile: string;
  tags: string[];
  lastVisit: string;
  lastVisitPharmacist: string;
  visits: Visit[];
};
