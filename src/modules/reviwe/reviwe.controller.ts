import { NextFunction, Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { successRes } from '../../utils/clientResponse';
import { reviewService } from './reviwe.service';

const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user!.id;
    const result = await reviewService.createReviewInDB(req.body, userId);

    successRes(res, {
      success: true,
      status: 201,
      message: 'Review created successfully',
      data: result,
    });
  },
);

const getAllReviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await reviewService.getAllReviewsFromDB();

    successRes(res, {
      success: true,
      status: 200,
      message: 'Reviews retrieved successfully',
      data: result,
    });
  },
);

const getSingleReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const result = await reviewService.getSingleReviewFromDB(id);

    successRes(res, {
      success: true,
      status: 200,
      message: 'Review retrieved successfully',
      data: result,
    });
  },
);

export const reviewController = {
  createReview,
  getAllReviews,
  getSingleReview,
};
