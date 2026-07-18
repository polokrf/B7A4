import { BookingStatus } from "../../../generated/prisma/enums";

export interface IBooking {
  serviceId: string;
  bookingDate: Date;
  timeSlot: string;
}

export interface IBookingUp {
  status:BookingStatus;
}