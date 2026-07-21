export interface IPayment {
  bookingId:string;
  transactionId:string;
}

export const userBasicSelect = {
  id: true,
  name: true,
  email: true,
};