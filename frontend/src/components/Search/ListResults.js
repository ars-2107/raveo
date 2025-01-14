import React from "react";
import { Link, useNavigate } from "react-router-dom";

import apiConfig from "../../api/apiConfig";
import Img from "../../images/image.png";
import personDepartment from "../../data/person-department.json"
import "./listresults.css";

const ResultItem = ({ item }) => {
  const imgUrl = item.poster_path
    ? apiConfig.w185Image(item.poster_path)
    : item.profile_path
    ? apiConfig.w185Image(item.profile_path)
    : Img;

  function limitText(text, maxLength) {
    if (text && text.length > maxLength) {
      return text.substr(0, maxLength) + "...";
    }
    return text;
  }

  const releaseYear = item.release_date
    ? new Date(item.release_date).getFullYear()
    : "-";

  return (
    <Link to={`/${item.media_type === "person" ? personDepartment[item.known_for_department] || item.known_for_department?.toLowerCase() || "professional" : item.media_type}/${item.id}`} className="result-item">
      <div className="result-item-img">
        <img
          src={imgUrl}
          alt={item.title || item.name}
          
        />
      </div>
      <div className="result-info">
        <h2>{item.name || item.title}</h2>
        <p>{releaseYear}</p>
        <p>{limitText(item.overview, 50)}</p>
      </div>
    </Link>
  );
};

const ListResults = ({ results, keyWord }) => {
  const navigate = useNavigate();

  const handleAllResultsClick = () => {
    navigate(`/results?q=${keyWord}`);
  };

  return (
    <div className="list-results">
        <>
          {results.map((result) => (
            <ResultItem key={result.id} item={result} />
          ))}

          <div className="all-results-button-container">
            <button
              className="all-results-button"
              onClick={handleAllResultsClick}
            >
              All results
            </button>
          </div>
        </>
    </div>
  );
};

export default ListResults;
