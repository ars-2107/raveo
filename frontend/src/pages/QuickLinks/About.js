import React from 'react';
import { Link } from 'react-router-dom';
import './quicklinks.css';

const AboutPage = () => {
  return (
    <div className="about">
      <div className="about-content">
        <h4>What is Raveo?</h4>
        <p>
          Raveo is your ultimate movie-centric social platform dedicated to sparking meaningful film discussions and enhancing your movie discovery journey.
          Think of it as your personal movie diary, a place where you can share your thoughts, rate films, and connect with fellow cinephiles from around the world.
          Raveo is here to bring the magic of movies to life!
        </p>
      </div>
      <div className="about-content">
        <h4>Discover and Connect.</h4>
        <p>
          Use Raveo to keep track of the films you've watched or create a movie-watching diary to record your cinematic experiences.
          Share your candid opinions, insightful reviews, and star ratings with the Raveo community.
          Follow your friends and fellow film enthusiasts to explore their movie tastes and recommendations.
          Stay up-to-date with the latest discussions, trends, and movie-related news in the Raveo community.
        </p>
      </div>
      <div className="about-content">
        <h4>Why Choose Raveo?</h4>
        <p>
          Raveo offers a user-friendly web app along with mobile apps for iOS and Android, ensuring you can access your movie haven anytime, anywhere.
          Our dedicated community of movie enthusiasts fuels the excitement and passion that movies inspire.
          Join us, and together we'll create a space where film lovers can unite, explore, and celebrate the art of cinema.
        </p>
      </div>
      <div className="about-content">
        <h4>Why Critics Matter?</h4>
        <p>
          At Raveo, we recognize the vital role that critics play in the world of cinema.
          They are the discerning eyes that often unearth hidden cinematic gems and elevate them to their rightful status.
          Take, for instance, the enduring classic, "The Shawshank Redemption." Despite its initial disappointing box office returns, 
          critics championed its brilliance, ultimately leading to its recognition as one of the greatest films of all time.
        </p>
      </div>
      <div className="about-content">
        <h4>Unleash Your Inner Critic.</h4>
        <p>
          Rate and review movies to express your genuine feelings and insights.
          Tag films to organize them by genre, mood, or any other category you prefer.
          Create curated lists and collections on topics that pique your interest, sharing your movie expertise with others.
        </p>
      </div>
      <div className="image">
        <Link to={`/movie/278`}>
          <img src="https://i.imgur.com/MyaxO8x.jpeg" alt="about" />
        </Link>
      </div>
    </div>
  );
};

export default AboutPage;