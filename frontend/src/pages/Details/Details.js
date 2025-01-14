import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
// import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import moment from "moment/moment";
// import { LoadingButton } from "@mui/lab";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as solidHeart } from '@fortawesome/free-solid-svg-icons';
// import { faHeart as regularHeart} from '@fortawesome/free-regular-svg-icons';

import apiType from "../../api/apiType";
import apiConfig from "../../api/apiConfig";
// import favoriteApi from "../../api/modules/favoriteApi";
import ratingApi from "../../api/modules/ratingApi";
import reviewApi from "../../api/modules/reviewApi";
// import { setAuthModalOpen } from "../../redux/features/authModalSlice";
// import { addFavorite, removeFavorite } from "../../redux/features/userSlice";
import Cast from "../../components/Cast/Cast";
import VideosSection from "../../components/VideoSection/Video";
import MediaRating from "../../components/MediaRating/MediaRating";
import MediaReview from "../../components/MediaReview/MediaReview";
import ExploreSlider from "../../components/Carousels/ExploreSlider/ExploreSlider";
import Loading from "../../components/Loading/Loading";
import ErrorPage from "../Error/Error";
import personDepartment from "../../data/person-department.json"
import "./details.css";
import Img from "../../images/image.png"

const Details = () => {
  const { category, id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState([]);
  // const [onRequest, setOnRequest] = useState(false);
  const [cast, setCast] = useState(null);
  const [video, setVideo] = useState(null);
  const [averageRating, setAverageRating] = useState(null);
  
  const { user } = useSelector((state) => state.user);
  // const { user, listFavorites } = useSelector((state) => state.user);
  // const dispatch = useDispatch();

  useEffect(() => {
    const getDetail = async () => {
      setLoading(true);
      try {
        const response = await apiType.detail(category, id, { params: {} });
        setItem(response);
        window.scrollTo(0, 0);
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };
  
    getDetail();
  }, [category, id]);
  
  useEffect(() => {
    const getReviews = async () => {
      try {
        const { response, err } = await reviewApi.getMediaReviews({ mediaId: id });
        if (response) {
          setReviews(response);
        } else {
          console.error(err);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };
  
    getReviews();
  }, [id]);
  
  useEffect(() => {
    const getMediaRating = async () => {
      try {
        const response = await ratingApi.getMediaRatings({ mediaId: id });
        if (response) {
          const final = response.response;
          const ratings = final.map(item => item.rating);
          const totalRatings = ratings.reduce((acc, rating) => acc + rating, 0);
          const avgRating = totalRatings / ratings.length;
          setAverageRating(isNaN(avgRating) ? 0 : avgRating.toFixed(1));
        } else {
          console.error(response.err);
        }
      } catch (err) {
        console.error("Error fetching ratings:", err);
      }
    };
  
    getMediaRating();
  }, [id]);
  
  // useEffect(() => {
  //   const checkFavorite = async () => {
  //     try {
  //       const { response, err } = await favoriteApi.isFavorite({ mediaId: id });
  //       if (response) {
  //         setIsFavorite(response.isFavorite);
  //       } else {
  //         console.error(err);
  //       }
  //     } catch (error) {
  //       console.error("Error checking favorite status:", error);
  //     }
  //   };
  
  //   checkFavorite();
  // }, [id]);  

  // const onFavoriteClick = async () => {
  //   if (!user) return dispatch(setAuthModalOpen(true));

  //   if (onRequest) return;

  //   if (isFavorite) {
  //     onRemoveFavorite();
  //     return;
  //   }

  //   setOnRequest(true);

  //   const body = {
  //     mediaId: item.id,
  //     mediaTitle: item.title || item.name,
  //     mediaType: category,
  //     mediaPoster: item.poster_path,
  //     mediaRate: item.vote_average
  //   };

  //   const { response, err } = await favoriteApi.add(body);

  //   setOnRequest(false);

  //   if (err) console.error(err);
  //   if (response) {
  //     dispatch(addFavorite(response));
  //     setIsFavorite(true);
  //   }
  // };

  // const onRemoveFavorite = async () => {
  //   if (onRequest) return;
  //   setOnRequest(true);

  //   const favorite = listFavorites.find(e => e.mediaId.toString() === item.id.toString());

  //   const { response, err } = await favoriteApi.remove({ favoriteId: favorite.id });

  //   setOnRequest(false);

  //   if (err)  console.error(err);
  //   if (response) {
  //     dispatch(removeFavorite(favorite));
  //     setIsFavorite(false);
  //   }
  // };

  useEffect(() => {
    const getCredits = async () => {
      try {
        const res = await apiType.credits(category, id);
        setCast(res);
      } catch (error) {
        console.error("Error fetching credits:", error);
      }
    };
    getCredits();
  }, [category, id]);
  
  useEffect(() => {
    const getVideos = async () => {
      try {
        const res = await apiType.getVideos(category, id);
        setVideo(res);
      } catch (error) {
        console.error("Error fetching videos:", error);
      }
    };
    getVideos();
  }, [category, id]);

  const toHoursAndMinutes = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
  };

  const uniqueById = (array) => Array.from(new Map(array?.map((item) => [item.id, item])).values());

  const director = uniqueById(cast?.crew?.filter((person) => person.job === "Director"));

  const writer = uniqueById(cast?.crew?.filter(
    (person) => person.job === "Screenplay" || person.job === "Story" || person.job === "Writer"
  ));

  const creator = uniqueById(cast?.crew?.filter((crewMember) => 
    item?.created_by?.some((creator) => creator.id === crewMember.id)
  ));
  
  return (
    loading ? (
      <div className="person-container">
        <Loading />
      </div>
    ) : item ? (
      <div className="details">
        <div
          className="banner"
          style={{
            backgroundImage: `url(${apiConfig.originalImage(
              item.backdrop_path || item.poster_path
            )})`,
          }}
        ></div>
        
        <div className="details-container">
          <div className="details-poster">
            {item.poster_path || item.backdrop_path ? (
                  <img src={apiConfig.w500Image(item.poster_path || item.backdrop_path)} alt={item.title || item.name} className="poster-img" />
              ) : (
                  <img src={Img} alt={item.title || item.name} className="poster-img" />
              )}
            {/* <LoadingButton
              variant="text"
              sx={{
                width: "max-content",
                "& .MuiButon-starIcon": { marginRight: "0" }
              }}
              size="large"
              startIcon={isFavorite ? <FontAwesomeIcon icon={solidHeart} /> : <FontAwesomeIcon icon={regularHeart} />}
              loadingPosition="start"
              loading={onRequest}
              onClick={onFavoriteClick}
            /> */}
          </div>
          
          {averageRating !== null && (
            <div className="media-average-rating">
              <FontAwesomeIcon className="star" icon={ faStar } style={{ color: '#eed110' }} /><h4>{averageRating} / 10</h4>
            </div>
          )}

          <div className="details-info">
            <h1 className="title">{item.title || item.name}</h1>
            <div className="genres">
              {item.genres &&
                item.genres.slice(0, 5).map((genre, i) => (
                  <span key={i} className="genre">
                    {genre.name}
                  </span>
                ))}
            </div>
            <p className="plot">{item.overview}</p>
            <div className="infos">
              <div className="info">
                <span className="text bold">Status: </span>
                <span className="text">{item.status}</span>
              </div>
              <div className="info">
                <span className="text bold">Release Date: </span>
                <span className="text">
                  {moment(item.release_date || item.first_air_date).format("MMM D, YYYY")}
                </span>
              </div>
              <div className="info">
                <span className="text bold">Runtime: </span>
                <span className="text">
                  {category === "movie"
                  ? toHoursAndMinutes(item.runtime)
                  : `${item.number_of_seasons} seasons, ${item.number_of_episodes} episodes`}
                </span>
              </div>
            </div>

            {director && director?.length > 0 && (
              <div className="infos">
                <span className="text bold">Director: </span>
                <span className="text">
                  {director.map((d, i) => (
                    <span key={i}>
                    <Link to={`/${personDepartment[d.known_for_department] || d.known_for_department?.toLowerCase() || "professional"}/${d.id}`} className="details-link">
                      {d.name}
                    </Link>
                      {director?.length - 1 !== i && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}

            {writer && writer?.length > 0 && (
              <div className="infos">
                <span className="text bold">Writer: </span>
                <span className="text">
                  {writer.map((d, i) => (
                    <span key={i}>
                    <Link to={`/${personDepartment[d.known_for_department] || d.known_for_department?.toLowerCase() || "professional"}/${d.id}`} className="details-link">
                      {d.name}
                    </Link>
                      {writer?.length - 1 !== i && ", "}
                    </span>
                  ))}
                </span>
              </div>
            )}

          {creator && creator.length > 0 && (
            <div className="infos">
              <span className="text bold">Creator: </span>
              <span className="text">
                {creator.map((d, i) => (
                  <span key={i}>
                    <Link
                      to={`/${personDepartment[d.known_for_department] || d.known_for_department?.toLowerCase() || "professional"}/${d.id}`}
                      className="details-link"
                    >
                      {d.name}
                    </Link>
                    {creator.length - 1 !== i && ", "}
                  </span>
                ))}
              </span>
            </div>
          )}
          </div>
        </div>
        <Cast id={item.id}/>
        <VideosSection data={video} />
        {user && (
        <MediaRating media={item} mediaId={item.id} mediaType={category} />
        )}
        <MediaReview reviews={reviews || []} media={item} mediaType={category} id="review" />
        <ExploreSlider category={category} type='similar' id={item.id} title={`More like ${item.title || item.name}`}/>
      </div>
    ) : (
      <ErrorPage />
    )
  );
};

export default Details;