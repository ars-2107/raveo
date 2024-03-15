import React from "react";
import { Link } from "react-router-dom";

const Help = () => {
  return (
    <div className="help">
      <div className="help-content">
        <h4>How to Search?</h4>
        <p>
          To search for any movie, TV show, or cast, use the search box.
          Type in a query related to what you're looking for.
          Relevant results will be displayed for you to explore further.
        </p>
      </div>
      <div className="help-content">
        <h4>How to Rate a Movie?</h4>
        <p>
          To rate a movie, visit the movie's details page.
          You'll find an option to rate the movie on a scale of 1 to 10.
          Select your rating, and it will be recorded for that movie.
        </p>
      </div>
      <div className="help-content">
        <h4>How to Review a Movie?</h4>
        <p>
          To review a movie, navigate to the movie's details page.
          Click on the "Write a Review" button.
          Provide a review title, your detailed review, and select whether it's a "Rave" or "Rant" to express your overall sentiment.
          Click "Submit," and your review will be added.
        </p>
      </div>
      <div className="help-content">
        <h4>What is Rave and What is Rant?</h4>
        <p>
          "Rave" and "Rant" are options to express your overall sentiment in your movie reviews.
          If you loved a movie and want to give it a positive review, choose "Rave."
          If you didn't enjoy a movie and want to provide a critical review, choose "Rant."
        </p>
      </div>
      <div className="help-content">
        <h4>How to Update Password?</h4>
        <p>
          To update your password, go to your profile page.
          Click on the "Account Settings" or "Change Password" option.
          Follow the prompts to change your password securely.
        </p>
      </div>
      <div className="image">
        <Link to={`/movie/11`}>
          <img src="https://i.imgur.com/ewJL7Sc.png" alt="help" />
          <h4>May the Force Be with You.</h4>
        </Link>
      </div>
    </div>
  );
};

export default Help;
