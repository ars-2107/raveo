import responseHandler from "../handlers/response.handler.js";
import reviewModel from "../models/review.model.js";

const create = async (req, res) => {
  try {
    const { movieId } = req.params;

    const review = new reviewModel({
      user: req.user.id,
      movieId,
      ...req.body
    });

    await review.save();

    responseHandler.created(res, {
      ...review._doc,
      id: review.id,
      user: req.user
    });
  } catch {
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await reviewModel.findOne({
      _id: reviewId,
      user: req.user.id
    });

    if (!review) return responseHandler.notfound(res);

    await review.remove();

    responseHandler.ok(res);
  } catch {
    responseHandler.error(res);
  }
};

const update = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { user, body } = req;

    const review = await reviewModel.findOne({ _id: reviewId, user: user.id });

    if (!review) {
      return responseHandler.notfound(res);
    }

    review.set(body);
    await review.save();

    responseHandler.ok(res, review);
  } catch {
    responseHandler.error(res);
  }
};

const getAllReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find().populate("user").sort("-createdAt");
    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await reviewModel.find({
      user: req.user.id
    }).sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};

const getMediaReviews = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const reviews = await reviewModel
      .find({ mediaId })
      .populate("user")
      .sort("-createdAt");

    responseHandler.ok(res, reviews);
  } catch {
    responseHandler.error(res);
  }
};


export default { create, remove, update, getAllReviews, getReviews, getMediaReviews };
