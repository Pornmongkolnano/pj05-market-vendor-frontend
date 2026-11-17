export type Spot = {
  _id: string;
  spotNumber: string;
  zone: string;
  spotSize: string;
  locationDescription: string;
  rentalFee: number;
  isActive: boolean;
};

export type Booking = {
  _id: string;
  spot: Spot | null;
  user: { _id: string; name: string; email: string } | null;
  bookingDate: string;
  productType: string;
  createdAt?: string;
};

const feeFormat = new Intl.NumberFormat("th-TH", {
  style: "currency",
  currency: "THB",
  maximumFractionDigits: 2,
});

const dateFormat = new Intl.DateTimeFormat("th-TH", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function formatFee(fee: number) {
  return feeFormat.format(fee);
}

export function formatBookingDate(value: string) {
  return dateFormat.format(new Date(value));
}

export function isObjectId(value: string) {
  return /^[a-f\d]{24}$/i.test(value);
}
