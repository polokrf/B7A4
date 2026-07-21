import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successRes } from '../../utils/clientResponse';
import { paymentService } from './payment.service';

const createPayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.body;
    const userId = req.user!.id;

    const result = await paymentService.createPaymentDB(bookingId, userId);

    successRes(res, {
      success: true,
      status: 201,
      message: 'Checkout session created successfully',
      data: result,
    });
  },
);

const paymentConfirm = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId, transactionId } = req.body;
    const userId = req.user?.id!;

    const result = await paymentService.PaymentConfirm(
      { bookingId, transactionId },
      userId,
    );

    successRes(res, {
      success: true,
      status: 200,
      message: 'Payment confirmed successfully',
      data: result,
    });
  },
);


const getAllPayments = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user!;

    const result = await paymentService.getAllPaymentsFromDB(
      user.id,
      user.role,
    );

    successRes(res, {
      success: true,
      status: 200,
      message: 'Payment history retrieved successfully',
      data: result,
    });
  },
);

const getSinglePayment = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params!;
    const user = req.user!;

    const result = await paymentService.getSinglePaymentFromDB(
      id as string,
      user.id,
      user.role,
    );

    successRes(res, {
      success: true,
      status: 200,
      message: 'Payment details retrieved successfully',
      data: result,
    });
  },
);

export const paymentController = {
  createPayment,
  paymentConfirm,
  getAllPayments,
  getSinglePayment
};
