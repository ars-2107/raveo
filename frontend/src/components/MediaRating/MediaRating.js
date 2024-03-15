import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import ratingApi from '../../api/modules/ratingApi';
import Rating from '@mui/material/Rating';
import './mediarating.css'

function MediaRating({ media, mediaType }) {
  const [rating, setRating] = useState(null);
  const [userRating, setUserRating] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const mediaId = media.id;

  const toggleEditing = () => {
    setIsEditing(!isEditing);
  };

  const onAddRating = async (e) => {
    e.preventDefault();

    try {
      const response = await ratingApi.add({
        rating: parseFloat(rating),
        mediaId,
        mediaType,
        mediaTitle: media.title || media.name,
        mediaPoster: media.poster_path,
        mediaBackdrop: media.backdrop_path
      });
      if (response.err) {
        console.error(response.err);
      } else {
        setUserRating(parseFloat(rating));
        setRating(rating);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onUpdateRating = async (e) => {
    e.preventDefault();

    try {
      const data = await ratingApi.getRating({ mediaId: mediaId.toString() });
      const ratingId = data.response[0].id;
      const response = await ratingApi.update({
        ratingId,
        rating: parseFloat(rating)
      });
      if (response.err) {
        console.error(response.err);
      } else {
        setRating(rating)
        setUserRating(parseFloat(rating));
        toggleEditing();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const onRemoveRating = async () => {
    try {
      const data = await ratingApi.getRating({ mediaId: mediaId.toString() });
      const ratingId = data.response[0].id;
      const response = await ratingApi.remove({ ratingId });
      if (response.err) {
        console.error(response.err);
      } else {
        setRating(null)
        setUserRating(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const getRating = async () => {
      try {
        const response = await ratingApi.getRating({ mediaId: mediaId.toString() });
        if (response && response.response.length > 0) {
          if (response.response[0].rating !== undefined) {
            setUserRating(response.response[0].rating);
          } else {
            setUserRating(response.response.data);
          }
        } else {
          setUserRating(null);
        }
        if (response.err) {
          console.error(response.err);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getRating();
  }, [mediaId]);

  return (
    <div className='media-rating-container'>
      <h2 className="media-rating-heading">How Would You Rate It?</h2>
      {userRating === null && !isEditing ? (
        <form className="media-rating-form" onSubmit={onAddRating}>
          <Rating
            name="rating"
            className="rating"
            size="large"
            defaultValue={0}
            max={10}
            precision={1.0}
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            icon={<FontAwesomeIcon icon={fasStar} className="star-icon filled-star" />}
            emptyIcon={<FontAwesomeIcon icon={farStar} className="star-icon filled-star" />}
            sx={{ marginRight: '8px' }}
          />
          <button className="media-rating-input-button" type="submit" disabled={rating === null}>
            Submit
          </button>
        </form>
      ) : userRating !== null && !isEditing ? (
        <div className="media-rating">
          <Rating
            name="rating"
            className="rating"
            size="large"
            value={userRating}
            max={10}
            readOnly
            icon={<FontAwesomeIcon icon={fasStar} className="star-icon filled-star" />}
            emptyIcon={<FontAwesomeIcon icon={farStar} className="star-icon filled-star" />}
          />
          <div>
            <button className="media-rating-input-button" onClick={toggleEditing}>
              Edit
            </button>
            <button className="media-rating-input-button" onClick={onRemoveRating}>
              Remove
            </button>
            </div>
        </div>
      ) : (
        <form className="media-rating-form" onSubmit={onUpdateRating}>
          <Rating
            name="rating"
            className="rating"
            size="large"
            defaultValue={0}
            max={10}
            precision={1.0}
            value={rating}
            onChange={(event, newValue) => setRating(newValue)}
            icon={<FontAwesomeIcon icon={fasStar} className="star-icon filled-star" />}
            emptyIcon={<FontAwesomeIcon icon={farStar} className="star-icon filled-star" />}
          />
          <button className="media-rating-input-button" type="submit" disabled={rating === null}>
            Save
          </button>
          <button className="media-rating-input-button" onClick={toggleEditing}>
            Cancel
          </button>
        </form>
      )}
    </div>
  );
}

export default MediaRating;