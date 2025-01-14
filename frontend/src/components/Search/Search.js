import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useFloating, useInteractions, useDismiss } from '@floating-ui/react';
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

  const { x, y, reference, floating, strategy, context } = useFloating({
    placement: 'bottom-start',
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useDismiss(context),
  ]);

  const onChangeInput = (e) => {
    const value = e.target.value;
    setKeyWord(value);
  
    if (!value.trim()) {
      setResults([]);
      return;
    }
  
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  
    timeoutRef.current = setTimeout(() => {
      setLoading(true);
      fetch(`${apiConfig.baseUrl}/search/multi?api_key=${apiConfig.apiKey}&query=${value.trim()}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error(err);
        });
    }, 10);
  };  

  const onSubmitForm = (e) => {
    e.preventDefault();

    navigate(`/results?q=${keyWord}`);
    setKeyWord("");
    window.location.reload();
  };

  useEffect(() => {
    setKeyWord("");
  }, [location]);

  return (
    <div className='search-bar'>
      <div className="search-input" ref={reference} {...getReferenceProps()}>
        <form className='search' id="search" onSubmit={onSubmitForm}>
          <input
            className="search-text"
            onChange={onChangeInput}
            value={keyWord}
            type="text"
            placeholder="Search"
            id="searchText"
            name="searchKeyword"
          />
          <FontAwesomeIcon icon={faSearch} className='search-icon' />
        </form>
      </div>

      {result.length > 0 && keyWord.length > 0 && (
        <div className="floating-results-container">
          <div
            ref={floating}
            style={{
              position: strategy,
              top: window.innerWidth < 550 ? (y ?? 0) + 10 : y ?? 0,
              left: x ?? 0,
              zIndex: 1000,
            }}
            className="floating-results"
            {...getFloatingProps()}
          >
            <ListResults keyWord={keyWord} loading={loading} results={result} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
