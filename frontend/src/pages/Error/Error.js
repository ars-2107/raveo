import React from "react";
import { Link } from "react-router-dom";
import "./error.css";
import Img from '../../images/inception-totem.jpg';

const ErrorPage = () => {
  return (
    <div className="error">
      <div className="error-container">
        <div className="error-background">
          <img
            style={{ width: '100%' }}
            alt="backdrop"
            src={ Img }
            
          />
        </div>
        <div className="error-content-container">
          <div className="error-content">
            <h1 className="error-title">404</h1>
            <p className="error-description">Oops! Maybe it’s just time to wake up and head back to Home.</p>
            <Link to="/">&lt; Back To Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
