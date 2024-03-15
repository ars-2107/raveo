import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import './reviews.css'
import apiConfig from '../../api/apiConfig';
import reviewApi from '../../api/modules/reviewApi';

const Reviews = () => {
  const [reviews, setReviews ] = useState([]);
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getAllReviews();
      if (err) console.log(err);
      if (response) {
        setReviews([...response]);
      }
    };
    getReviews();
  }, []);

  function limitText(text, maxLength) {
    if (text && text.length > maxLength) {
      return text.substr(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div className='reviews-page'>
      <div className="heading"><span>&nbsp;</span><h2>Top Reviews</h2></div>
      <div className="review-list">
        {reviews.map((review) => (
          <div key={review._id} className="review">
            <div className="review-media">
              <img src={apiConfig.originalImage(review.mediaPoster)} alt={review.mediaTitle} />
            </div>
            <div className="review-info">
              <div className="review-header">
                <h3 className="title">{review.title}</h3>
                <p className={review.reaction === "Rave" ? "rave" : "rant"}>{review.reaction}</p>
              </div>
              <div className="review-content">
                <p>{expanded ? review.content : limitText(review.content, 500)}</p>
                <span
                  onClick={toggleExpand}
                  className="view-more"
                >
                  {expanded ? "\n\nshow less" : "view more"}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reviews;