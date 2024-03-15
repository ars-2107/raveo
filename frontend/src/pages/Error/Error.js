import React from "react";
import { Link } from "react-router-dom";
import "./error.css";

const ErrorPage = () => {
  return (
    <>
      <div className="error">
        <div className="error-body container">
          <h1 className="error-title">404</h1>
          <p className="error-description">Something went wrong!</p>
          <Link to="/">Go to HomePage</Link>
        </div>
      </div>
    </>
  );
};

export default ErrorPage;