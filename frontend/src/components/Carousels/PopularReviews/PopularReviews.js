import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import './popularreviews.css'
import apiConfig from '../../../api/apiConfig';
import reviewApi from '../../../api/modules/reviewApi';

const PopularReviews = ({ movies }) => {
  const [reviews, setReviews ] = useState([]);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getAllReviews();
      if (err) console.log(err);
      if (response) {
        setReviews([...response]);
      }
    };
    getReviews();
  }, [dispatch]);

  const PrevButton = ( props ) => {
    const { onClick } = props;
    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
    setHovered(true);
    };

    const handleMouseLeave = () => {
    setHovered(false);
    };

    // return currentSlide === 0 ? null : <button
    return <button
    className='prev-button'
    onClick={ onClick }
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{
      position: 'absolute',
      top: '50%',
      left: '17%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      background: '#eed110',
      boxShadow: '0 8px 15px black',
      width: '40px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #eed110',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 300ms',
      backgroundColor: hovered ? '#eed110' : 'transparent',
      color: hovered ? '#151515' : '#eed110',
      backdropFilter: 'blur(1px)'
    }}>
    <FontAwesomeIcon icon={ faChevronLeft } />
    </button>
  };

  const NextButton = ( props ) => {
    const { onClick } = props;

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
    setHovered(true);
    };

    const handleMouseLeave = () => {
    setHovered(false);
    };

    // return currentSlide >= movies.length - settings.slidesToShow ? null : <button
    return <button
    className='next-button'
    onClick={ onClick }
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
    style={{
      position: 'absolute',
      top: '50%',
      right: '17%',
      transform: 'translateY(-50%)',
      zIndex: 1,
      background: '#eed110',
      boxShadow: '0 8px 15px black',
      width: '40px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      border: '2px solid #eed110',
      borderRadius: '15px',
      cursor: 'pointer',
      transition: 'all 300ms',
      backgroundColor: hovered ? '#eed110' : 'transparent',
      color: hovered ? '#151515' : '#eed110',
      backdropFilter: 'blur(1px)'
    }}>
    <FontAwesomeIcon icon={ faChevronRight } />
    </button>
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    initialSlide: 0,
    prevArrow: <PrevButton />,
    nextArrow: <NextButton />,
  };

  return (
    <div className='popular-reviews'>
      <div className="content-container">
        <div className='content-header'>
          <h2><span>&nbsp;</span>Popular Reviews</h2>
          <a href='#'>View All</a>
        </div>
        <Slider {...settings}>
          {reviews.map((review) => (
            <div key={review.id} className="review-banner">
              <img src={apiConfig.originalImage(review.mediaBackdrop)} alt={review.mediaTitle} className="backdrop-image" />
              <div className="review-container">
                <Link to={`/${review.mediaType}/${review.mediaId}`}>
                  <div className="poster">
                    <img
                      className="featured-image"
                      src={apiConfig.originalImage(review.mediaPoster)}
                      alt={review.mediaTitle}
                    />
                  </div>
                </Link>
                <div className="review-info">
                  <div className="movie-info">
                    <Link
                      to={`/${review.mediaType}/${review.mediaId}`}
                      style={{ color: "unset", textDecoration: "none" }}
                    >
                      <h2 className="title">{review.mediaTitle}</h2> 
                    </Link>
                  </div>
                  <h4>@{review.user?.username || "anonymous"}</h4>
                  <p className="review">
                    {review.content.length > 200
                      ? review.content.substring(0, 200) + "..."
                      : review.content}
                  </p>
                  {review.content.length > 200 && (
                    <Link to={`/${review.mediaType}/${review.mediaId}`} style={{ textDecoration: "none" }}>
                      More Reviews
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularReviews;
