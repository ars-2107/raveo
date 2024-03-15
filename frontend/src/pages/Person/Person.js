import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import moment from 'moment';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

import Img from '../../images/image.png';
import apiConfig from '../../api/apiConfig';
import apiType from '../../api/apiType';
import './person.css';

const Person = () => {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [personCredits, setPersonCredits] = useState([]);
  const [showFullBiography, setShowFullBiography] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      const response = await apiType.person(id, { params: {} });
      setPerson(response);
      if (response.biography && response.biography.length <= 1800) {
        setShowFullBiography(true);
      }
      window.scrollTo(0, 0);
    };
    fetchPerson();
  }, [id]);

  useEffect(() => {
    const fetchPersonCredits = async () => {
      const res = await apiType.personCredits(id, { params: {} });
      const credits = res.cast.sort((a, b) => {
        if (a.release_date > b.release_date) return -1;
        if (a.release_date < b.release_date) return 1;
        return 0;
      })
      setPersonCredits(credits)
    };
    fetchPersonCredits();
  }, [id]);

  function limitText(text, maxLength) {
    if (showFullBiography || text.length <= maxLength) {
      return text;
    }
    return text.substr(0, maxLength) + "...";
  }

  function formatFullDate(date) {
    if (date !== null) {
      return moment(date).format('D MMMM YYYY');
    }
    return '';
  }

  function getAge(birthdate) {
    return moment().year() - moment(birthdate).year();
  }

  function getYear(date) {
    if (date === null || date === '') {
      return null;
    }
    return moment(date).year();
  }

  return (
    <div className="person-container">
      {person && (
        <>
          <div className="m-profile">
            <div className="overview">
              <img src={person?.profile_path ? apiConfig.originalImage(person.profile_path) : Img} alt="Profile" className="profile-image" />
              <div className="person-info">
                <h2>{person.name}</h2>
                {person.biography && (
                  <p className={`biography ${showFullBiography ? 'expanded' : ''}`}>
                    {limitText(person.biography, 1800)}
                  </p>
                )}
                {person.biography.length > 1800 && (
                  <span className="read-more" onClick={() => setShowFullBiography(!showFullBiography)}>
                    {showFullBiography ? (
                      <>
                        Show less <FontAwesomeIcon icon={faChevronUp} />
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
              <li className="info-item"><div className="text bold">Known For:</div> <div className="text">{person.known_for_department}</div></li>
              <li className="info-item"><div className="text bold">Birthdate:</div> <div className="text">{formatFullDate(person.birthday)} (age {getAge(person.birthday)})</div></li>
              <li className="info-item"><div className="text bold">Place of Birth:</div> <div className="text">{person.place_of_birth}</div></li>
            </ul>
          </div>
        </>
      )}

      <ul className="timeline">
        <h2>Credits:</h2>
        {personCredits.map((cast, i) => {
          let role = cast.job || cast.character || '?';
          let releaseYear = getYear(cast.release_date);
          return (
            <li key={cast.id}>
              <a href={`/movie/${cast.id}`} className="credited-movie">
                <div className="photo">
                  <img src={cast?.poster_path ? apiConfig.originalImage(cast.poster_path) : Img} alt={cast.title} />
                </div>
                <div className="year">{releaseYear || '-'}</div>
                <h5 className="role"><span>&nbsp;In </span> {cast.title} <span>&nbsp;as {role}</span></h5>
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Person;
