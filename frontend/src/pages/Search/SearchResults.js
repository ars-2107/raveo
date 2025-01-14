import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component"
import { useSearchParams } from "../../hooks/useSearchParams";
import apiConfig from "../../api/apiConfig";
import personDepartment from "../../data/person-department.json"
import Loading from "../../components/Loading/Loading";
import Img from "../../images/image.png"

import "./searchresults.css"

const SearchResults = () => {
  
  const searchParams = useSearchParams();
  const keyword = searchParams.get("q");
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState();
  const [loading, setLoading] = useState(true);

  const LoadMore = () => {
    setPage(page + 1);
  };

  const searchKeywordforUser = useCallback(
    (newKeyword, newPage) => {
      if (newKeyword.trim() === "") return;
      fetch(
        `${apiConfig.baseUrl}/search/multi?api_key=${apiConfig.apiKey}&query=${newKeyword}&page=${newPage}`
      )
        .then((res) => res.json())
        .then((data) => {
          setTotalPage(data.total_pages);
          setLoading(false);
          if (newPage === 1) {
            setResults(data.results);
          } else {
            setResults((prevResults) => [...prevResults, ...data.results]);
          }
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    },
    []
  );
  
  useEffect(() => {
    setLoading(true);
    searchKeywordforUser(keyword, page);
  }, [page, keyword, searchKeywordforUser]);

  if (!loading && results?.length === 0) {
    return (
      <div className="non-results">
        <h1>No Results!</h1>
      </div>
    );
  }

  function limitText(text, maxLength) {
    if (text && text?.length > maxLength) {
      return text?.substr(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div className="results-container">
      <div className="results">
        <h1 className="results-title">Results for {`"${keyword}"`}</h1>
        <InfiniteScroll
          className="content"
          dataLength={results?.length || []}
          next={LoadMore}
          hasMore={page <= totalPage}
          loader={<Loading />}
        >
          <div className="grid-layout grid-gap-20px-20px">
            {results.map((result) => {

              return (
                <Link
                  className="results-link"
                  key={result.id}
                  to={`/${result.media_type === "person" ? personDepartment[result.known_for_department] || result.known_for_department?.toLowerCase() || "professional" : result.media_type}/${result.id}`}
                >
                  <div className="results-media">
                    <img
                      src={
                        result.poster_path
                          ? apiConfig.w185Image(result.poster_path)
                          : result.profile_path
                          ? apiConfig.w185Image(result.profile_path)
                          : Img
                      }
                      alt={result.title || result.name}
                      className="image"
                    />
                    <div className="title">{limitText(result.title || result.name, 30)}</div>
                    {/* <div className="rating"><FontAwesomeIcon icon={ faStar } /> 8</div> */}
                  </div>
                </Link>
              );
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default SearchResults;