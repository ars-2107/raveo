import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash } from '@fortawesome/free-solid-svg-icons';
import apiConfig from "../../api/apiConfig"
import reviewApi from "../../api/modules/reviewApi";
import "./reviewlist.css"

const ReviewItem = ({ review,  onUpdated, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(""); 
  const [editedReaction, setEditedReaction] = useState("");
  const [editedContent, setEditedContent] = useState(""); 

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const toggleEditing = () => {
    setIsEditing(!isEditing);
    setEditedReaction(review.reaction);
    setEditedTitle(review.title);
    setEditedContent(review.content);
  };

  const onUpdate = async () => {
    const updatedReview = { ...review, reaction: editedReaction, title: editedTitle, content: editedContent };

    const { response, err } = await reviewApi.update({
      reviewId: review.id,
      reaction: editedReaction,
      title: editedTitle,
      content: editedContent,
    });

    if (err) {
      console.log(err);
    } else if (response) {
      onUpdated(updatedReview)
      setExpanded(true);
      toggleEditing();
    }
  };

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);
    const { response, err } = await reviewApi.remove({ reviewId: review.id });
    setOnRequest(false);

    if (err) console.log(err);
    if (response) {
      onRemoved(review.id);
    }
  };

  function limitText(text, maxLength) {
    if (text && text.length > maxLength) {
      return text.substr(0, maxLength) + "...";
    }
    return text;
  }

  return (
    <div className="review-item-container">
      <div className="review-item-poster">
        <Link
          to={`/${review.mediaType}/${review.mediaId}`}
          style={{ color: "unset", textDecoration: "none" }}
        >
          <img className="poster-image" src={apiConfig.originalImage(review.mediaPoster)} alt={review.mediaTitle}/> 
        </Link>
      </div>

      <div className="review-item-info" sx={{
        width: { xs: "100%", md: "80%" },
        padding: { xs: 0, md: "0 2rem" }
      }}>
        <div className="info" spacing={1}>
          <Link
            to={`/${review.mediaType}/${review.mediaId}`}
            style={{ color: "unset", textDecoration: "none" }}
          >
            <h4 className="title">{review.mediaTitle}</h4>
          </Link>
          <p className="date">
            {moment(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </p>
          {isEditing ? (
            <div>
              <div className="radio-group">
                <input
                  type="radio"
                  name="editedReaction"
                  id="editedRave"
                  value="Rave"
                  checked={editedReaction === "Rave"}
                  onChange={() => setEditedReaction("Rave")}
                />
                <label htmlFor="editedRave">Rave</label>
                <input
                  type="radio"
                  name="editedReaction"
                  id="editedRant"
                  value="Rant"
                  checked={editedReaction === "Rant"}
                  onChange={() => setEditedReaction("Rant")}
                />
                <label htmlFor="editedRant">Rant</label>
              </div> 
              <input
                  type="text"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  maxLength={100}
                  placeholder="Edit your review title here..."
                  className="media-review-text-field"
                />
              <textarea
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                rows={8}
                cols={180}
                placeholder="Edit your review here..."
                className="media-review-text-field"
              />
              <button onClick={onUpdate} className="media-review-input-button">
                Save
              </button>
              <button onClick={toggleEditing} className="media-review-input-button">
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className={review.reaction === "Rave" ? "rave" : "rant"}>{review.reaction}</p>
              <h4 className="review-title">{review.title}</h4>
              <p className="review-content">{expanded ? review.content : limitText(review.content, 500)}
              {review.content.length > 500 && (
              <span
                onClick={toggleExpand}
                className="view-more"
              >
                {expanded ? "\n\nshow less" : "view more"}
              </span>
              )}
            </p>
          </>
          )}
        </div>
      </div>
      {!isEditing && (
        <button
          onClick={toggleEditing}
          disabled={onRequest}
          className="edit"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
      )}
      <button
          onClick={onRemove}
          disabled={onRequest}
          className="review-list-delete"
        >
          <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [reviewcount, setReviewCount] = useState(0);

  const dispatch = useDispatch();

  const skip = 6;

  useEffect(() => {
    const getReviews = async () => {
      const { response, err } = await reviewApi.getList();

      if (err) console.log(err);
      if (response) {
        setReviewCount(response.length);
        setReviews([...response]);
        setFilteredReviews([...response].splice(0, skip));
      }
    };

    getReviews();
  }, [dispatch]);

  const onLoadMore = () => {
  const nextPageReviews = [...reviews].splice(page * skip, skip);
  setFilteredReviews([...filteredReviews, ...nextPageReviews]);
  setPage(page + 1);
};

  const onUpdated = (updatedReview) => {
    const updatedReviews = reviews.map((r) =>
      r.id === updatedReview.id ? updatedReview : r
    );
    setReviews(updatedReviews);
    const updatedFilteredReviews = filteredReviews.map((r) =>
      r.id === updatedReview.id ? updatedReview : r
    );
    setFilteredReviews(updatedFilteredReviews);
  };

  const onRemoved = (id) => {
    const newReviews = [...reviews].filter(e => e.id !== id);
    setReviews(newReviews);
    setFilteredReviews([...newReviews].splice(0, page * skip));
    setReviewCount(reviewcount - 1);
  };

  return (
    <div className="review-list-container">
      <h4 className="header"> Reviews - {reviewcount}</h4>
        <div className="review-list-items">
          {filteredReviews.map((item) => (
            <div className="review-list-item" key={item.id}>
              <ReviewItem review={item} onUpdated={onUpdated} onRemoved={onRemoved} />
            </div>
          ))}
          {filteredReviews.length < reviews.length && (
          <div className="review-list-loading">
            <button
              onClick={onLoadMore}
              className="loading-button"
            >
              Load More{" "}
            </button>
          </div>
          )}
        </div>
    </div>
  );
};

export default ReviewList;