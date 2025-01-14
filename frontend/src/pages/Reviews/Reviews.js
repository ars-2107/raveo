import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

import './reviews.css'
import apiConfig from '../../api/apiConfig';
import reviewApi from '../../api/modules/reviewApi';

const Reviews = () => {
  const [reviews, setReviews ] = useState([]);
  const [expanded, setExpanded] = useState({});


  const toggleReviewExpand = (reviewId) => {
    setExpanded(prevState => ({
      ...prevState,
      [reviewId]: !prevState[reviewId]
    }));
  };

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getAllReviews();
      if (err) console.error(err);
      if (response) {
        setReviews([...response]);
      }
    };
    getReviews();
  }, []);

  function limitText(text, maxLength) {
    if (text && text?.length > maxLength) {
      return text?.substr(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div className='reviews-page'>
      <div className="heading"><span>&nbsp;</span><h2>Top Reviews</h2></div>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review.id} className="review">
            <div className="review-media">
            <Link to={`/${review.mediaType}/${review.mediaId}`}>
              <img src={apiConfig.w500Image(review.mediaPoster)} alt={review.mediaTitle} />
            </Link>
            </div>
            <div className="review-info">
              <div className="review-header">
                <h3 className="title">{review.title}</h3>
                <p className="username">@{review.user?.username || "anonymous"} on "{review.mediaTitle}"</p>
                <p className={review.reaction === "Rave" ? "rave" : "rant"}>{review.reaction}</p>
              </div>
              <div className="review-content">
                {expanded[review.id] ?
                  <p>{review.content}</p> :
                  <p>{limitText(review.content, 500)}</p>
                }
                {review.content?.length > 500 && (
                  <span
                    onClick={() => toggleReviewExpand(review.id)}
                    className="view-more"
                  >
                    {expanded[review.id] ? "Show less" : "View more"}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;
