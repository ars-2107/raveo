import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Select from "react-select";
import InfiniteScroll from "react-infinite-scroll-component";

import { apiFetch } from "../../api/apiFetch";
import useFetch from "../../hooks/useFetch";
import Loading from "../../components/Loading/Loading"
import Img from "../../images/image.png";
import "./explore.css";
import apiConfig from "../../api/apiConfig";
import apiType from "../../api/apiType";


let filters = {};

const sortbyData = [
    { value: "popularity.desc", label: "Popularity" },
    { value: "primary_release_date.desc", label: "Latest" },
    { value: "vote_average.desc", label: "Top Rated" },
];

const Explore = ({ mediaType }) => {
    const [data, setData] = useState(null);
    const [pageNum, setPageNum] = useState(1);
    const [loading, setLoading] = useState(false);
    const [genre, setGenre] = useState(null);
    const [sortby, setSortby] = useState(null);

    const { data: genresData } = useFetch(`genre/${mediaType}/list?api_key=${apiConfig.apiKey}`);

    let url;
    if (mediaType === "all") {
      url = `trending/movie/week?api_key=${apiConfig.apiKey}`;
    } else {
      url = `discover/${mediaType}?api_key=${apiConfig.apiKey}`;
    }

    const fetchInitialData = () => {
        setLoading(true);
        apiFetch(url, filters).then((res) => {
            setData(res);
            setPageNum((prev) => prev + 1);
            setLoading(false);
        });
    };

    const fetchNextPageData = () => {
        apiFetch(
            `discover/${mediaType}?page=${pageNum}&api_key=${apiConfig.apiKey}`,
            filters
        ).then((res) => {
            if (data?.results) {
                setData({
                    ...data,
                    results: [...data?.results, ...res.results],
                });
            } else {
                setData(res);
            }
            setPageNum((prev) => prev + 1);
        });
    };

    useEffect(() => {
        filters = {};
        setData(null);
        setPageNum(1);
        setSortby(null);
        setGenre(null);
        fetchInitialData();
    }, [mediaType]);

    const onChange = (selectedItems, action) => {
        if (action.name === "sortby") {
            setSortby(selectedItems);
            filters['vote_count.gte'] = 300;
            if (action.action !== "clear") {
                filters.sort_by = selectedItems.value;
            } else {
                delete filters.sort_by;
            }
        }

        if (action.name === "genres") {
            setGenre(selectedItems);
            if (action.action !== "clear") {
                let genreId = selectedItems.map((g) => g.id);
                genreId = JSON.stringify(genreId).slice(1, -1);
                filters.with_genres = genreId;
            } else {
                delete filters.with_genres;
            }
        }

        setPageNum(1);
        fetchInitialData();
    };

    function limitText(text, maxLength) {
      if (text && text.length > maxLength) {
        return text.substr(0, maxLength) + "...";
      }
      return text;
    }

    return (
        <div className="explore-container">
                <div className="pageHeader">
                    <div className="pageTitle">
                      <span>&nbsp;</span><h2>
                      {mediaType === "all"
                      ? "Explore"
                      : mediaType === "tv"
                      ? "Explore TV Shows"
                      : "Explore Movies"}
                      </h2>
                    </div>
                    {mediaType !== "all" && ( // Render filters and sort only if mediaType is not "all"
                      <div className="filters">
                        <Select
                          isMulti
                          name="genres"
                          value={genre}
                          closeMenuOnSelect={false}
                          options={genresData?.genres}
                          getOptionLabel={(option) => option.name}
                          getOptionValue={(option) => option.id}
                          onChange={onChange}
                          placeholder="Select genres"
                          className="react-select-container genresDD"
                          classNamePrefix="react-select"
                        />
                        <Select
                          name="sortby"
                          value={sortby}
                          options={sortbyData}
                          onChange={onChange}
                          isClearable={true}
                          placeholder="Sort by"
                          className="react-select-container sortbyDD"
                          classNamePrefix="react-select"
                        />
                      </div>
                    )}
                  </div>
                {loading && <Loading initial={true} />}
                {!loading && (
                    <>
                        {data?.results?.length > 0 ? (
                            <InfiniteScroll
                                className="content"
                                dataLength={data?.results?.length || []}
                                next={fetchNextPageData}
                                hasMore={pageNum <= data?.total_pages}
                                loader={<Loading />}
                            >
                              <div className="explore-grid">
                                {data?.results?.map((item, index) => {
                                  if (item.media_type === "person");
                                  return (
                                    <Link
                                      className="movies-link"
                                      key={item.id}
                                      to={`/${mediaType}/${item.id}`}
                                    >
                                      <div key={item.id} className="movie-item">
                                        <div className="poster-container">
                                          {item.poster_path || item.backdrop_path ? (
                                              <img src={apiConfig.originalImage(item.poster_path || item.backdrop_path)} alt={item.title || item.name} className="poster-img"/>
                                          ) : (
                                              <img src={Img} alt={item.title || item.name} className="poster-img"/>
                                          )}
                                        </div>
                                        <h3>{limitText(item.title || item.name, 16)}</h3>
                                        {/* <p>Rating: {item.vote_average}</p> */}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </InfiniteScroll>
                        ) : (
                            <span className="resultNotFound">
                                Sorry, Results not found!
                            </span>
                        )}
                    </>
                )}
        </div>
    );
};

export default Explore;