import { BookingStatus, PaymentStatus } from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { ICreateReviewPayload } from './reviwe.interface';

const userBasicSelect = {
  id: true,
  name: true,
  email: true,
};

const createReviewInDB = async (
  payload: ICreateReviewPayload,
  customerId: string,
) => {
  const { bookingId, rating, comment } = payload;


  if (!bookingId || rating === undefined || rating === null) {
    throw new Error('bookingId and rating are required');
  }

  if (typeof rating !== 'number' || rating < 1 || rating > 5) {
    throw new Error('Rating must be a number between 1 and 5');
  }

  
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  if (!booking) {
    const error: any = new Error('Booking not found');
    error.statusCode = 404;
    throw error;
  }


  if (booking.customerId !== customerId) {
    const error: any = new Error(
      'Forbidden: You can only review your own bookings',
    );
    error.statusCode = 403;
    throw error;
  }

  
  if (booking.paymentStatus !== PaymentStatus.COMPLETED ) {
    throw new Error('You can only leave a review for completed bookings');
  }

 
  const existingReview = await prisma.review.findUnique({
    where: { bookingId },
  });

  if (existingReview) {
    throw new Error('A review has already been submitted for this booking');
  }

  const technicianId = booking.technicianId;

 
  const createdReview = await prisma.$transaction(async tx => {
    // Create the review
    const newReview = await tx.review.create({
      data: {
        bookingId,
        customerId,
        technicianId,
        rating,
        comment: comment || null,
      },
    });

    
    const reviewStats = await tx.review.aggregate({
      where: { technicianId },
      _avg: {
        rating: true,
      },
      _count: {
        id: true,
      },
    });

    const averageRating = reviewStats._avg.rating || 0;
    const completedJobs = reviewStats._count.id;

    
    await tx.technicianProfile.updateMany({
      where: { userId: technicianId },
      data: {
        averageRating: parseFloat(averageRating.toFixed(2)),
        completedJobs,
      },
    });

    return newReview;
  });

 
  const result = await prisma.review.findUnique({
    where: { id: createdReview.id },
    include: {
      booking: true,
      customer: {
        select: userBasicSelect,
      },
      technician: {
        select: userBasicSelect,
      },
    },
  });

  return result;
};

const getAllReviewsFromDB = async () => {
  const reviews = await prisma.review.findMany({
    include: {
      booking: true,
      customer: {
        select: userBasicSelect,
      },
      technician: {
        select: userBasicSelect,
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return reviews;
};

const getSingleReviewFromDB = async (reviewId: string) => {
  const review = await prisma.review.findUnique({
    where: { id: reviewId },
    include: {
      booking: true,
      customer: {
        select: userBasicSelect,
      },
      technician: {
        select: userBasicSelect,
      },
    },
  });

  if (!review) {
    const error: any = new Error('Review not found');
    error.statusCode = 404;
    throw error;
  }

  return review;
};

export const reviewService = {
  createReviewInDB,
  getAllReviewsFromDB,
  getSingleReviewFromDB,
};
