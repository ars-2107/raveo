import express from "express";
import { body } from "express-validator";
import reviewController from "../controllers/review.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  tokenMiddleware.auth,
  reviewController.getReviews
);

router.get(
  "/all",
  reviewController.getAllReviews
);

router.get(
  "/:mediaId",
  reviewController.getMediaReviews
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("title")
    .exists().withMessage("title is required")
    .isLength({ min: 1 }).withMessage("title can not be empty"),
  body("reaction")
    .exists().withMessage("reaction is required")
    .custom(type => ["Rave", "Rant"].includes(type)).withMessage("reaction invalid"),
  body("content")
    .exists().withMessage("content is required")
    .isLength({ min: 1 }).withMessage("content can not be empty"),
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  body("mediaBackdrop")
    .exists().withMessage("mediaBackdrop is required"),
  requestHandler.validate,
  reviewController.create
);

router.delete(
  "/:reviewId",
  tokenMiddleware.auth,
  reviewController.remove
);

router.put(
  "/:reviewId",
  tokenMiddleware.auth,
  reviewController.update
);

export default router;