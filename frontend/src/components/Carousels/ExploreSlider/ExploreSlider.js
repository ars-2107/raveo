import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

import apiType, { category } from '../../../api/apiType';
import apiConfig from '../../../api/apiConfig';
import './exploreslider.css';
import Img from '../../../images/image.png'

const ExploreSlider = (props) => {
    const [movies, setMovies] = useState([]);


    useEffect(() => {
        const getList = async () => {
            const params = {};
            let response = null;
            let mediaType = null;
    
            if (props.type === "trending") {
                const response = await apiType.getTrendingList(props.category, "week");
                setMovies(response.results);
            } else if (props.type !== 'similar') {
                switch (props.category) {
                    case category.movie:
                        if (props.category !== 'all') {
                          mediaType = 'movie';
                        }
                        response = await apiType.getMoviesList(props.type, { params });
                        setMovies(response.results);
                        break;
                    default:
                        if (props.category !== 'all') {
                          mediaType = 'tv';
                        }
                        response = await apiType.getTvList(props.type, { params });
                        setMovies(response.results);
                        break;
                }
            } else {
                response = await apiType.similar(props.category, props.id);
                setMovies(response.results);
            }
        }
        getList();
    }, [props.category, props.id, props.type]);

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
          top: '45%',
          left: '20px',
          transform: 'translateY(-55%)',
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
          top: '45%',
          right: '20px',
          transform: 'translateY(-55%)',
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
        slidesToShow: 5,
        slidesToScroll: 5,
        initialSlide: 0,
        prevArrow: <PrevButton />,
        nextArrow: <NextButton />,
        responsive: [
          {
            breakpoint: 1024,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
            },
          },
          {
            breakpoint: 600,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
            },
          },
        ],
      };

      function limitText(text, maxLength) {
        if (text && text.length > maxLength) {
          return text.substr(0, maxLength) + "...";
        }
        return text;
      }

    return (
        <div className='explore-movies'>
            <div className='content-container'>
                <div className='content-header'>
                    <h2><span>&nbsp;</span> {props.title} </h2>
                    <Link to={`/explore/${props.category}`} className="view-all">
                      View All
                    </Link>
                </div>
                <div className='featured-movies'>
                    <Slider {...settings}>
                        {movies.map((movie) => (
                            <div key={movie.id} className="slider">
                                <Link to={`/${props.category === 'all' ? movie.media_type : props.category}/${movie.id}`} alt='movie-img'>
                                {movie.poster_path ? (
                                    <img src={apiConfig.originalImage(movie.poster_path)} alt={movie.title || movie.name} className="image"/>
                                ) : (
                                    <img src={Img} alt={movie.title || movie.name} className="image"/>
                                )}
                                <div className="title">{limitText(movie.title || movie.name, 40)}</div>
                                {/* <div className="rating"><FontAwesomeIcon icon={ faStar } /> 8</div> */}
                                </Link>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

ExploreSlider.propTypes = {
    category: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
}

export default ExploreSlider;