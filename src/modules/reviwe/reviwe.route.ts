import express from 'express';

import auth from '../../Middlewear/jwtAuth';
import { reviewController } from './reviwe.controller';

const router = express.Router();


router.post('/', auth('CUSTOMER'), reviewController.createReview);

// Public Routes
router.get('/', reviewController.getAllReviews);
router.get('/:id', reviewController.getSingleReview);

export const reviewRouter = router;
export default router;
