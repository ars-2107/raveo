import express from "express";
import userRoute from "./user.route.js";
import reviewRoute from "./review.route.js";
import ratingRoute from "./rating.route.js";

const router = express.Router();

router.use("/user", userRoute);
router.use("/reviews", reviewRoute);
router.use("/ratings", ratingRoute);

export default router;