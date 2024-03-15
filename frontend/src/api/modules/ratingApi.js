import privateClient from "../client/privateClient";

const ratingEndpoints = {
  add: "ratings",
  remove: ({ ratingId }) => `ratings/${ratingId}`,
  update: ({ ratingId }) => `ratings/${ratingId}`,
  getMediaRatings: ({ mediaId }) => `ratings/${mediaId}`,
  getRating: ({ mediaId }) => `ratings/user/${mediaId}`,
};

const ratingApi = {
  add: async ({
    mediaId,
    mediaType,
    mediaTitle,
    mediaPoster,
    mediaBackdrop,
    rating
  }) => {
    try {
      const response = await privateClient.post(
        ratingEndpoints.add,
        {
          mediaId,
          mediaType,
          mediaTitle,
          mediaPoster,
          mediaBackdrop,
          rating
        }
      );

      return { response };
    } catch (err) { return { err }; }
  },
  remove: async ({ ratingId }) => {
    try {
      const response = await privateClient.delete(ratingEndpoints.remove({ ratingId }));

      return { response };
    } catch (err) { return { err }; }
  },
  update: async ({ ratingId, rating }) => {
    try {
      const response = await privateClient.put(
        ratingEndpoints.update({ ratingId }),
        { rating }
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getRating: async ( mediaId ) => {
    const id = mediaId.mediaId
    try {
      const response = await privateClient.get(ratingEndpoints.getRating({ mediaId: id }));
      return { response };
    } catch (err) {
      return { err };
    }
  },
  getMediaRatings: async ({ mediaId }) => {
    try {
      const response = await privateClient.get(ratingEndpoints.getMediaRatings({ mediaId }));
      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default ratingApi;