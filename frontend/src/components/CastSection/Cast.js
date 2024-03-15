import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

import apiConfig from "../../api/apiConfig";
import apiType from "../../api/apiType";
import Img from '../../images/image.png'

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
                  <Link to={`/person/${cast.id}`} alt='movie-img'>
                    <div className="profileImg">
                      <img src={imgUrl} alt={cast.name} />
                    </div>
                    <div className="name">{cast.name}</div>
                    <div className="character">
                        {cast.character}
                    </div>
                  </Link>
                </div>
              );
          })}
        </div>
    </div>
);
};

export default Cast;