import { ReviewController } from "../controllers/review.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import { validatePostReview } from "../validation/review.validation";
import { Router } from "express";

export class ReviewRouter{
  private router: Router;
  private reviewController: ReviewController;

  constructor() {
    this.reviewController = new ReviewController();
    this.router = Router();
    this.initializeRouters();
  }

  private initializeRouters(): void {
    this.router.get(
      '/property/:propertyId',
      this.reviewController.getReviewsByPropertyId
    );

    this.router.use(verifyToken);
    this.router.post(
      '/',
      validatePostReview,
      this.reviewController.postReview
    );
  }

  getRouter(): Router {
    return this.router;
  }
}