import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import { category, movieType, tvType } from '../../api/apiType';
import { setAuthModalOpen, setAuthState } from "../../redux/features/authModalSlice";
import Hero from "../../components/Hero/Hero"
import PopularReviews from '../../components/Carousels/PopularReviews/PopularReviews';
import ExploreSlider from '../../components/Carousels/ExploreSlider/ExploreSlider';
import apiConfig from '../../api/apiConfig';
import './home.css';
import { Link } from 'react-router-dom';

const Home = () => {

  const { user } = useSelector((state) => state.user);

  const [trendingBackdrop, setTrendingBackdrop] = useState('');
  const [trendingTitle, setTrendingTitle] = useState('');
  const [trendingId, setTrendingId] = useState('');
  const [trendingCategory, setTrendingCategory] = useState('');
  const [backdropLoaded, setBackdropLoaded] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiConfig.apiKey}`;

    axios.get(trendingUrl)
      .then(response => {
        const trendingMovie = response.data.results[0];
        const releaseDate = trendingMovie.release_date || trendingMovie.first_air_date;
        const releaseYear = releaseDate ? releaseDate.split('-')[0] : 'Upcoming';
        setTrendingBackdrop(apiConfig.originalImage(trendingMovie.backdrop_path));
        setTrendingTitle((trendingMovie.title || trendingMovie.name) + ' (' + (releaseYear) + ')');
        setTrendingId(trendingMovie.id);
        setTrendingCategory(trendingMovie.media_type);

        const backdropImg = new Image();
        backdropImg.src = trendingBackdrop;
        backdropImg.onload = () => {
          setTrendingBackdrop(trendingBackdrop);
          setBackdropLoaded(true);
        };
      })
      .catch(error => {
        console.error('Error fetching trending movie data:', error);
      });
  }, [trendingBackdrop, trendingTitle, trendingId, trendingCategory]);

  return (
    <div className='home-container'>
      {!user &&
        <div className="hero-container" >
          <div className="hero-background">
              {backdropLoaded && <img
                style={{ width: '100%' }}
                alt="backdrop"
                src={ trendingBackdrop }
              />}
          </div>
          <Link to={`/${trendingCategory}/${trendingId}`}><div className="hero-movie-title">{trendingTitle}</div></Link>
          <div className="hero-content">
            <div className="hero-title">
              <h1>
                Discover your new favourites.
                <br />
                Track, Rate, and Curate.
                <br />
                Share your experience.
              </h1>
            </div>
            <div className="hero-button">
              <button className="sign-up-btn" onClick={() => { dispatch(setAuthState('signup')); dispatch(setAuthModalOpen(true));}}>
                Get Started
              </button>
            </div>
            <div className="hero-subtitle">
              <p>Join a like-minded community.</p>
            </div>
          </div>
        </div>
      }
      {user && <Hero />}

      <PopularReviews />

      <ExploreSlider category={category.all} type={"trending"} title="Trending"/>
      <ExploreSlider category={category.movie} type={movieType.popular} title="Recommended" />
      <ExploreSlider category={category.movie} type={movieType.top_rated} title="Top Rated Films" />
      <ExploreSlider category={category.tv} type={tvType.top_rated} title="Top Rated Shows" />
      
    </div>
  );
};

export default Home;