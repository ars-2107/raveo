import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from "react-redux";
import axios from 'axios';

import { category, movieType, tvType } from '../../api/apiType';
import { setAuthModalOpen } from "../../redux/features/authModalSlice";
import Hero from "../../components/Hero/Hero"
import PopularReviews from '../../components/Carousels/PopularReviews/PopularReviews';
import ExploreSlider from '../../components/Carousels/ExploreSlider/ExploreSlider';
import apiConfig from '../../api/apiConfig';
import './home.css';

const Home = () => {

  const { user } = useSelector((state) => state.user);

  const [trendingBackdrop, setTrendingBackdrop] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    const trendingUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiConfig.apiKey}`;

    axios.get(trendingUrl)
      .then(response => {
        const trendingMovie = response.data.results[0];
        setTrendingBackdrop(apiConfig.originalImage(trendingMovie.backdrop_path));
      })
      .catch(error => {
        console.error('Error fetching trending movie data:', error);
      });
  }, []);

  return (
    <div className='home-container'>
      {!user &&
        <div className="hero-container" >
          <div className="hero-background">
              <img
                style={{ width: '100%' }}
                alt="backdrop"
                src={ trendingBackdrop }
              />
          </div>
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
              <button className="sign-up-btn" onClick={() => dispatch(setAuthModalOpen(true))}>
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
      <ExploreSlider category={category.movie} type={movieType.top_rated} title="Top Rated in Movies" />
      <ExploreSlider category={category.tv} type={tvType.top_rated} title="Top Rated in TV" />
      
    </div>
  );
};

export default Home;