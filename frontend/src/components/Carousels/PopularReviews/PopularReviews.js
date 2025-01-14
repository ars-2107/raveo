import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import ContentLoader from 'react-content-loader'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookmark, faChevronLeft, faChevronRight, faEye, faHeart, faStar } from '@fortawesome/free-solid-svg-icons';

import './popularreviews.css'
import apiConfig from '../../../api/apiConfig';
import reviewApi from '../../../api/modules/reviewApi';
import { Rave } from '../../Critics/Rave';

const PopularReviews = ({ movies }) => {
  const [reviews, setReviews] = useState([]);
  const dispatch = useDispatch();
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getAllReviews();
      if (err) console.error(err);
      if (response) {
        setReviews([...response]);
      }
    };
    getReviews();
  }, [dispatch]);

  useEffect(() => {
    if (reviews.length > 0) {
      const loadImages = () => {
        const promises = reviews.map(review => {
          const bannerImg = new Image();
          const featuredImg = new Image();
          bannerImg.src = apiConfig.originalImage(review.mediaBackdrop);
          featuredImg.src = apiConfig.w500Image(review.mediaPoster);
          return Promise.all([
            new Promise(resolve => { bannerImg.onload = resolve; bannerImg.onerror = resolve; }),
            new Promise(resolve => { featuredImg.onload = resolve; featuredImg.onerror = resolve; })
          ]);
        });

        Promise.all(promises).then(() => setImagesLoaded(true));
      };

      loadImages();
    }
  }, [reviews]);

  const PrevButton = (props) => {
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
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        top: '50%',
        left: '8%',
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
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
  };

  const NextButton = (props) => {
    const { onClick } = props;

    const [hovered, setHovered] = useState(false);

    const handleMouseEnter = () => {
      setHovered(true);
    };

    const handleMouseLeave = () => {
      setHovered(false);
    };

    // return currentSlide >= movies?.length - settings.slidesToShow ? null : <button
    return <button
      className='next-button'
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        top: '50%',
        right: '8%',
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
      <FontAwesomeIcon icon={faChevronRight} />
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

  const handleIconClick = (e, icon) => {
    e.preventDefault();
    e.stopPropagation();
    console.log(`${icon} clicked!`);
  };

  const SkeletonLoader = () => (
    <ContentLoader
      speed={2}
      width="95%"
      height={580}
      backgroundColor="#1e1e1e"
      foregroundColor="#2a2a2a"
    >
      <rect x="5%" y="0" rx="10" ry="10" width="100%" height="580" />
    </ContentLoader>
  );

  return (
    <div className='popular-reviews'>
      <div className="content-container">
        <div className='content-header'>
          <h2><span></span>Popular Reviews</h2>
          <Link to={`/reviews`} className='view-all'>View All</Link>
        </div>
        <Slider {...settings}>
          {imagesLoaded ? 
            reviews.map((review) => (
              <div key={review.id} className="review-banner">
                <img src={apiConfig.originalImage(review.mediaBackdrop)} alt={review.mediaTitle} className="backdrop-image" />
                <div className="review-container">
                  <div className="poster-stats-container">
                    <Link to={`/${review.mediaType}/${review.mediaId}`}>
                      <div className="poster">
                        <img
                          className="featured-image"
                          src={apiConfig.w500Image(review.mediaPoster)}
                          alt={review.mediaTitle}
                        />
                        <div className="hover-icons" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                          <button className="icon-button heart-icon" onClick={(e) => handleIconClick(e, 'Heart')}>
                            <FontAwesomeIcon icon={faHeart} />
                          </button>
                          <button className="icon-button view-icon" onClick={(e) => handleIconClick(e, 'Eye')}>
                            <FontAwesomeIcon icon={faEye} />
                          </button>
                          <button className="icon-button bookmark-icon" onClick={(e) => handleIconClick(e, 'Bookmark')}>
                            <FontAwesomeIcon icon={faBookmark} />
                          </button>
                        </div>
                      </div>
                    </Link>
                    <div className="stats">
                      <div className="stat-item">
                        <FontAwesomeIcon className='stat-icon' icon={faStar} color='#eed110' /> {9 || 'N/A'}
                      </div>
                      <div className="stat-item">
                        <Rave />
                      </div>
                      <div className="stat-item">
                        <FontAwesomeIcon className='stat-icon' icon={faHeart} color='#f00' /> {'900K' || 0}
                      </div>
                    </div>
                  </div>
                  <div className="review-info">
                    <div className='rave-rant'>
                      <Rave />
                    </div>
                    <div className="review-title">
                      <h2 className="title">"{review.title}"</h2>
                    </div>
                    <h4>
                      <span className='username'>@{review.user?.username || "anonymous"}</span>
                      &nbsp;on&nbsp;
                      <Link
                        to={`/${review.mediaType}/${review.mediaId}`}
                        style={{ color: "unset", textDecoration: "none" }}
                      >
                        <span className='media-title'>"{review.mediaTitle}"</span>
                      </Link>
                    </h4>
                    <p className="review">
                      {review?.content?.length > 200
                        ? review.content?.substring(0, 200) + "..."
                        : review.content}
                    </p>
                    <Link to={`/${review.mediaType}/${review.mediaId}`} style={{ textDecoration: "none" }}>
                      More Reviews
                    </Link>
                  </div>
                </div>
              </div>
            )) : <SkeletonLoader />
          }
        </Slider>
      </div>
    </div>
  );
};

export default PopularReviews;
