import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import apiConfig from '../../api/apiConfig';
import "./hero.css";

const Hero = () => {
  const [banner, setBanner] = useState();

  useEffect(() => {
    function getBanner() {
      fetch(`${apiConfig.baseUrl}/trending/movie/week?api_key=${apiConfig.apiKey}`)
        .then((res) => res.json())
        .then((data) => {
          const random = Math.floor(Math.random() * (19 - 0 + 1));

          setBanner(data.results[random]);
        })
        .catch((err) => console.error(err));
    }

    getBanner();
  }, []);

  function limitText(text, maxLength) {
    if (text && text?.length > maxLength) {
      return text?.substr(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div
      className="hero-banner"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${banner?.backdrop_path})`,
      }}
    >
      <div className="banner-content">
        <div className="banner-info">
          <div className="banner-background">
            <h4 className="banner-info-title">{banner?.title}</h4>
            {banner?.overview && (
              <p className="banner-info-overview">{limitText(banner?.overview, 300)}</p>
            )}
            <div className="view-info">
              <Link to={`/movie/${banner?.id}`}>
                <button className="banner-button">View Info</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;