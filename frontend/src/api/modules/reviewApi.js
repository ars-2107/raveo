import privateClient from "../client/privateClient";

const reviewEndpoints = {
  list: "reviews",
  add: "reviews",
  remove: ({ reviewId }) => `reviews/${reviewId}`,
  update: ({ reviewId }) => `reviews/${reviewId}`,
  getMediaReviews: ({ mediaId }) => `reviews/${mediaId}`,
  getAllReviews: "reviews/all"
};

const reviewApi = {
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    mediaBackdrop,
    title,
    reaction,
    content
  }) => {
    try {
      const response = await privateClient.post(
        reviewEndpoints.add,
        {
          mediaId,
          mediaType,
          mediaTitle,
          mediaPoster,
          mediaBackdrop,
          title,
          reaction,
          content
        }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ reviewId }) => {
    try {
      const response = await privateClient.delete(reviewEndpoints.remove({ reviewId }));

      return { response };
    } catch (err) { return { err }; }
  },
  update: async ({ reviewId, title, reaction, content }) => {
    try {
      const response = await privateClient.put(
        reviewEndpoints.update({ reviewId }),
        {
          title,
          reaction,
          content
        }
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getList: async () => {
    try {
      const response = await privateClient.get(reviewEndpoints.list);
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getMediaReviews: async ({ mediaId }) => {
    try {
      const response = await privateClient.get(reviewEndpoints.getMediaReviews({ mediaId }));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getAllReviews: async () => {
    try {
      const response = await privateClient.get(reviewEndpoints.getAllReviews);
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default reviewApi;