import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import Loading from "../../components/Loading/Loading";
import Img from '../../images/image.png';
import apiConfig from '../../api/apiConfig';
import apiType from '../../api/apiType';
import ErrorPage from '../Error/Error';
import personDepartment from "../../data/person-department.json";
import './person.css';

const Person = () => {
  const { category, id } = useParams();
  const [person, setPerson] = useState(null);
  const [personCredits, setPersonCredits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showFullBiography, setShowFullBiography] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      setLoading(true);
      try {
        const personResponse = await apiType.person(id, { params: {} });
        if (personResponse && ((personDepartment[personResponse.known_for_department] || personResponse.known_for_department?.toLowerCase() || "professional") === category)) {
          setPerson(personResponse);
          setShowFullBiography(personResponse.biography?.length <= 1200);
          window.scrollTo(0, 0);
          const creditResponse = await apiType.personCredits(id, { params: {} });
          const credits = [...creditResponse.cast, ...creditResponse.crew].sort((a, b) => {
            const dateA = a.media_type === 'movie' ? a.release_date : a.first_air_date;
            const dateB = b.media_type === 'movie' ? b.release_date : b.first_air_date;

            if (dateA > dateB) return -1;
            if (dateA < dateB) return 1;
            return 0;
          });
          setPersonCredits(credits);
        } else {
          setPerson(null);
        }
      } catch (error) {
        console.error("Error fetching person data:", error);
        setPerson(null);
      }
      setLoading(false);
    };
    fetchPerson();
  }, [id, category]);

  function limitText(text, maxLength) {
    if (showFullBiography || text?.length <= maxLength) {
      return text;
    }
    return text?.substr(0, maxLength) + "...";
  }

  function formatFullDate(date) {
    return date ? moment(date).format('D MMMM YYYY') : 'Unknown';
  }

  function getAge(birthdate) {
    return birthdate ? moment().year() - moment(birthdate).year() : 'Unknown';
  }

  function getYear(cast) {
    const { media_type, release_date, first_air_date } = cast;
    const currentDate = moment();
  
    if (media_type === 'movie' && release_date) {
      const releaseMoment = moment(release_date);
      if (releaseMoment.isBefore(currentDate)) {
        return releaseMoment.year();
      }
    } else if (media_type === 'tv' && first_air_date) {
      const startMoment = moment(first_air_date);
      if (startMoment.isBefore(currentDate)) {
        const startYear = startMoment.year();
        return `${startYear}`;
      }
    }
  
    return 'Unannounced';
  }

  return (
    loading ? ( 
      <div className="person-container">
        <Loading />
      </div>
    ) : person ? (
      <div className="person-container">
        <div className="g-profile">
          <div className="overview">
            <img src={person?.profile_path ? apiConfig.w500Image(person.profile_path) : Img} alt="Profile" className="profile-image" />
            <div className="person-info">
              <h2>{person.name || "Unknown"}</h2>
              <p className={`biography ${showFullBiography ? 'expanded' : ''}`}>
                {limitText(person.biography || "Biography not available", 1200)}
              </p>
              {person.biography?.length > 1200 && (
                <span className="read-more" onClick={() => setShowFullBiography(!showFullBiography)}>
                  {showFullBiography ? (
                    <>
                      <FontAwesomeIcon icon={faChevronUp} /> Show less
                    </>
                  ) : (
                    <>
                      Read more <FontAwesomeIcon icon={faChevronDown} />
                    </>
                  )}
                </span>
              )}
            </div>
          </div>
  
          <ul className="other-info">
            <li className="info-item">
              <div className="text bold">Known For:</div> 
              <div className="text">{person.known_for_department || "Unknown"}</div>
            </li>
            <li className="info-item">
              <div className="text bold">Birthdate:</div> 
              <div className="text">
                {formatFullDate(person.birthday)} {person.birthday && ` (age ${getAge(person.birthday)})`}
              </div>
            </li>
            <li className="info-item">
              <div className="text bold">Place of Birth:</div> 
              <div className="text">{person.place_of_birth || "Unknown"}</div>
            </li>
          </ul>
        </div>
  
        <ul className="timeline">
          <h2>Works:</h2>
          {personCredits.length > 0 ? (
            personCredits.map((cast) => {
              const role = cast.job || cast.character || 'Unknown';
              const releaseYear = getYear(cast);
              return (
                <li key={cast.id}>
                  <a href={`/${cast.media_type}/${cast.id}`} className="credited-movie">
                    <div className="photo">
                      <img src={cast?.poster_path ? apiConfig.w500Image(cast.poster_path) : Img} alt={cast.title || "Untitled"} />
                    </div>
                    <h5 className="role">
                      <span>&nbsp;In </span> {cast.title || cast.name || "Untitled"} <span>&nbsp;as {role}</span>
                    </h5>
                    <div className="year">{releaseYear}</div>
                  </a>
                </li>
              );
            })
          ) : (
            <li className="no-credits">No works yet</li>
          )}
        </ul>
      </div>
    ) : (
      <ErrorPage />
    )
  );
}

export default Person;