import {
  BookingStatus,
  PaymentMethod,
  PaymentProvider,
  PaymentStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import config from '../../config';
import stripe from '../../lib/stripe';
import { userBasicSelect } from './payment.interface';

interface IPaymentPayload {
  bookingId: string;
  transactionId: string;
}

const createPaymentDB = async (bookingId: string, userId: string) => {
  const booking = await prisma.booking.findUniqueOrThrow({
    where: { id: bookingId },
    include: { customer: true },
  });

  if (booking.customerId !== userId) {
    throw new Error('Forbidden access');
  }

  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error('Booking is not accepted yet');
  }

  if (booking.paymentStatus === PaymentStatus.COMPLETED) {
    throw new Error('Payment already completed');
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    customer_email: booking.customer.email,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `FixItNow Booking #${booking.id}`,
          },
          unit_amount: Math.round(booking.totalAmount * 100),
        },
        quantity: 1,
      },
    ],
    success_url: `${config.client_url}/payment/success?bookingId=${booking.id}`,
    cancel_url: `${config.client_url}/payment/cancel?bookingId=${booking.id}`,
    metadata: {
      bookingId: booking.id,
      customerId: booking.customerId,
    },
  });

  await prisma.payment.upsert({
    where: { bookingId: booking.id },
    update: {
      transactionId: session.id,
      amount: booking.totalAmount,
      status: PaymentStatus.PENDING,
    },
    create: {
      bookingId: booking.id,
      amount: booking.totalAmount,
      transactionId: session.id,
      method: PaymentMethod.CARD,
      provider: PaymentProvider.STRIPE,
      status: PaymentStatus.PENDING,
    },
  });

  return {
    checkoutUrl: session.url,
  };
};

const PaymentConfirm = async (payload: IPaymentPayload, userId: string) => {
  const { bookingId, transactionId } = payload;

 
  if (!bookingId || !transactionId) {
    throw new Error('bookingId and transactionId are required');
  }

  
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    throw new Error('Booking not found');
  }

 
  if (booking.customerId !== userId) {
    throw new Error('Forbidden: You are not allowed to pay for this booking');
  }

  
  if (booking.status !== BookingStatus.ACCEPTED) {
    throw new Error('Cannot pay for a booking that is not accepted');
  }

  
  const payment = await prisma.payment.findUnique({
    where: { bookingId },
  });

  if (!payment) {
    throw new Error('Payment record not found for this booking');
  }

 
  if (payment.status === PaymentStatus.COMPLETED) {
    throw new Error('Payment has already been completed');
  }

  
  if (payment.transactionId !== transactionId) {
    throw new Error('Invalid transaction ID for this payment session');
  }

  
  const updatedPayment = await prisma.$transaction(async tx => {
    const updatedPay = await tx.payment.update({
      where: { bookingId },
      data: {
        status: PaymentStatus.COMPLETED,
        paidAt: new Date(),
      },
    });

    await tx.booking.update({
      where: { id: bookingId },
      data: {
        paymentStatus: PaymentStatus.COMPLETED,
      },
    });

    return updatedPay;
  });

  return updatedPayment;
};






const getAllPaymentsFromDB = async (userId: string, role: string) => {
  let whereConditions: Record<string, any> = {};

  if (role === 'CUSTOMER') {
    whereConditions = {
      booking: {
        customerId: userId,
      },
    };
  } else if (role === 'TECHNICIAN') {
    whereConditions = {
      booking: {
        technicianId: userId,
      },
    };
  } else if (role === 'ADMIN') {
    whereConditions = {};
  } else {
    throw new Error('Forbidden access');
  }

  const payments = await prisma.payment.findMany({
    where: whereConditions,
    include: {
      booking: {
        include: {
          customer: {
            select: userBasicSelect,
          },
          technician: {
            select: userBasicSelect,
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return payments;
};


const getSinglePaymentFromDB = async (paymentId: string, userId: string, role: string) => {
  const payment = await prisma.payment.findUnique({
    where: {
      id: paymentId,
    },
    include: {
      booking: {
        include: {
          service: true,
          customer: {
            select: userBasicSelect,
          },
          technician: {
            select: userBasicSelect,
          },
        },
      },
    },
  });

  if (!payment) {
    const error: any = new Error('Payment not found');
    error.statusCode = 404;
    throw error;
  }

  
  if (role === 'CUSTOMER' && payment.booking.customerId !== userId) {
    const error: any = new Error('Forbidden: You can only view your own payments');
    error.statusCode = 403;
    throw error;
  }

  if (role === 'TECHNICIAN' && payment.booking.technicianId !== userId) {
    const error: any = new Error('Forbidden: You can only view payments for your assigned bookings');
    error.statusCode = 403;
    throw error;
  }

  return payment;
};


export const paymentService = {
  createPaymentDB,
  PaymentConfirm,
  getAllPaymentsFromDB,
  getSinglePaymentFromDB
};
