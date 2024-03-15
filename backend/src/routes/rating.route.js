import express from "express";
import { body } from "express-validator";
import ratingController from "../controllers/rating.controller.js";
import tokenMiddleware from "../middlewares/token.middleware.js";
import requestHandler from "../handlers/request.handler.js";

const router = express.Router({ mergeParams: true });

router.get(
  "/user/:mediaId",
  tokenMiddleware.auth,
  ratingController.getRating
);

router.get(
  "/:mediaId",
  ratingController.getMediaRatings
);

router.post(
  "/",
  tokenMiddleware.auth,
  body("mediaId")
    .exists().withMessage("mediaId is required")
    .isLength({ min: 1 }).withMessage("mediaId can not be empty"),
  body("rating")
    .exists().withMessage("rating is required")
    .isLength({ min: 1 }).withMessage("rating can not be empty"),
  body("mediaType")
    .exists().withMessage("mediaType is required")
    .custom(type => ["movie", "tv"].includes(type)).withMessage("mediaType invalid"),
  body("mediaTitle")
    .exists().withMessage("mediaTitle is required"),
  body("mediaPoster")
    .exists().withMessage("mediaPoster is required"),
  requestHandler.validate,
  ratingController.create
);

router.delete(
  "/:ratingId",
  tokenMiddleware.auth,
  ratingController.remove
);

router.put(
  "/:ratingId",
  tokenMiddleware.auth,
  ratingController.update
);

export default router;
