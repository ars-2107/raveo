import responseHandler from "../handlers/response.handler.js";
import ratingModel from "../models/rating.model.js";

const create = async (req, res) => {
  try {
    const { mediaId, mediaType } = req.params;

    const rating = new ratingModel({
      user: req.user.id,
      mediaId,
      mediaType,
      ...req.body
    });

    await rating.save();

    responseHandler.created(res, {
      ...rating._doc,
      id: rating.id,
      user: req.user
    });
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const remove = async (req, res) => {
  try {
    const { ratingId } = req.params;

    const rating = await ratingModel.findOne({
      _id: ratingId,
      user: req.user.id
    });

    if (!rating) return responseHandler.notfound(res);

    await rating.remove();

    responseHandler.ok(res);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const update = async (req, res) => {
  try {
    const { ratingId } = req.params;
    const { user, body } = req;

    const rating = await ratingModel.findOne({ _id: ratingId, user: user.id });

    if (!rating) {
      return responseHandler.notfound(res);
    }

    rating.set(body);
    await rating.save();

    responseHandler.ok(res, rating);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const getRating = async (req, res) => {
  try {
    const { mediaId } = req.params;
    const ratings = await ratingModel.find({
      user: req.user.id,
      mediaId
    });

    responseHandler.ok(res, ratings);
  } catch (error) {
    console.error(error);
    responseHandler.error(res);
  }
};

const getMediaRatings = async (req, res) => {
  try {
    const { mediaId } = req.params;

    const ratings = await ratingModel
      .find({ mediaId })

    responseHandler.ok(res, ratings);
  } catch (error) {
    responseHandler.error(res);
  }
};

export default { create, remove, update, getRating, getMediaRatings };
