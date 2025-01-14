import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import apiConfig from "../../api/apiConfig";
import apiType from "../../api/apiType";
import Img from '../../images/image.png'

import personDepartment from "../../data/person-department.json"

import "./cast.css"

const Cast = (props) => {
  const { category } = useParams();
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    const getCredits = async () => {
      const res = await apiType.credits(category, props.id);
      setCasts(res.cast.slice(0, 30));
    };
    getCredits();
  }, [category, props.id]);

  return (
    <div className="castSection">
      <div className="sectionHeading">Top Cast</div>
        <div className="listItems">
          {casts.map((cast) => {
            let imgUrl = cast.profile_path
                ? apiConfig.w185Image(cast.profile_path)
                : Img;
            return (
                <div key={cast.id} className="listItem">
                  <Link to={`/${personDepartment[cast.known_for_department] || cast.known_for_department?.toLowerCase() || "professional"}/${cast.id}`} alt='movie-img'>
                    <div className="profileImg">
                      <img src={imgUrl} alt={cast.name} />
                    </div>
                    <div className="name">{cast.name}</div>
                    {(cast?.character || (Array.isArray(cast?.roles) && cast.roles.length > 0)) && (
                      <div className="character">
                        {cast.character || cast.roles[0]?.character}
                      </div>
                    )}
                    {cast.total_episode_count > 1 && <div className="character">
                        {cast.total_episode_count} episodes
                    </div>}
                  </Link>
                </div>
              );
          })}
        </div>
    </div>
);
};

export default Cast;