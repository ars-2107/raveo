import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Tippy from "@tippyjs/react/headless";
import ListResults from '../Search/ListResults';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import apiConfig from '../../api/apiConfig';
import './search.css';

const Search = () => {
  const [keyWord, setKeyWord] = useState("");
  const [result, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onChangeInput = (e) => {
    setKeyWord(e.target.value);
    const value = e.target.value;

    if (!value.trim()) return setResults([]);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        setLoading(true);
        fetch(`${apiConfig.baseUrl}/search/multi?api_key=${apiConfig.apiKey}&query=${value}&a`)
          .then((res) => res.json())
          .then((data) => {
            setResults(data.results);
            setLoading(false);
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    }, 500);
  };

  const onSubmitForm = (e) => {
    e.preventDefault();
    if (keyWord.trim() === "") return;

    navigate(`/results?q=${keyWord}`);
    setKeyWord("");

    window.location.reload();
  };

  useEffect(() => {
    setKeyWord("");
  }, [location]);

  return (
    <div className='search-bar'>
      <Tippy
      interactive
      placement="bottom-start"
      render={(attrs) => (
        <ListResults
          keyWord={keyWord}
          loading={loading}
          results={result}
          {...attrs}
        />
      )}
      visible={result.length > 0 && keyWord.trim().length > 0 }
      >
        <div className="search-input">
          <form id="search" onSubmit={onSubmitForm}>
            <input className="search-text" onChange={onChangeInput} value={keyWord} type="text" placeholder="Search" id="searchText" name="searchKeyword" />
            <FontAwesomeIcon icon={faSearch} className='search-icon'/>
          </form>
        </div>
      </Tippy>
    </div>
  );
};

export default Search;
