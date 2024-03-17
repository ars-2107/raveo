import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import moment from "moment"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare,faTrash, faCircleNotch } from '@fortawesome/free-solid-svg-icons';
import reviewApi from "../../api/modules/reviewApi";
import UserAvatar from "../Users/UserAvatar";
import "./mediareview.css"

const ReviewItem = ({ review,  onUpdated, onRemoved }) => {
  const { user } = useSelector((state) => state.user);
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
      onUpdated(updatedReview);
      setExpanded(true);
      toggleEditing();
    }
  };

  const onRemove = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const { response, err } = await reviewApi.remove({ reviewId: review.id });

    if (err) console.log(err);
    if (response) onRemoved(review.id);
  };
  
  function limitText(text, maxLength) {
    if (text && text.length > maxLength) {
        return text.substr(0, maxLength) + "...";
      }
      return text;
    }

  return (
    <div className="media-review-item">
      <div className="user">
        <div className="avatar">
          <UserAvatar text={review.user?.displayName}></UserAvatar>
        </div>
        <div>
          <h6 className="name">{review.user?.displayName} <span className="username">@{review.user?.username || "anonymous"}</span></h6>
          <p className="date">
            {moment(review.createdAt).format("DD-MM-YYYY HH:mm:ss")}
          </p>
        </div>
      </div>
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
      <div>
        <p className={review.reaction === "Rave" ? "rave" : "rant"}>{review.reaction}</p>
        <h4 className="title">{review.title}</h4>
        <p className="content">
        {expanded ? review.content : limitText(review.content, 500)}
          {review.content.length > 500 && (
            <span
              onClick={toggleExpand}
              className="view-more"
            >
              {expanded ? "\n\nshow less" : "view more"}
            </span>
          )}
        </p>
      </div>
      )}
      {user && user.id === review.user.id && !isEditing && (
        <>
        <button
          onClick={toggleEditing}
          disabled={onRequest}
          className="edit"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          onClick={onRemove}
          disabled={onRequest}
          className="delete"
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
        </>
      )}
    </div>
  );
};

const MediaReview = ({ reviews, media, mediaType }) => {
  const { user } = useSelector((state) => state.user);
  const [listReviews, setListReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [onRequest, setOnRequest] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [reaction, setReaction] = useState("");
  const [reviewCount, setReviewCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState(0);
  const characterLimit = 5000;


  const skip = 4;

  useEffect(() => {
    setListReviews([...reviews]);
    setFilteredReviews([...reviews].splice(0, skip));
    setReviewCount(reviews.length);
  }, [reviews]);

  const onAddReview = async () => {
    if (onRequest) return;
    setOnRequest(true);
    setLoading(true);

    const body = {
      title,
      reaction,
      content,
      mediaId: media.id,
      mediaType,
      mediaTitle: media.title || media.name,
      mediaPoster: media.poster_path,
      mediaBackdrop: media.backdrop_path
    };

    const { response, err } = await reviewApi.add(body);

    setOnRequest(false);
    setLoading(false);

    if (err) console.log(err);
    if (response) {
      setFilteredReviews([...filteredReviews, response]);
      setReviewCount(reviewCount + 1);
      setTitle("");
      setContent("");
      setReaction("");
      setCharCount(0);
    }
  };

  const onLoadMore = () => {
    setFilteredReviews([...filteredReviews, ...[...listReviews].splice(page * skip, skip)]);
    setPage(page + 1);
  };

  const onUpdated = (updatedReview) => {
    const updatedReviews = listReviews.map((r) =>
      r.id === updatedReview.id ? updatedReview : r
    );
    setListReviews(updatedReviews);
    const updatedFilteredReviews = filteredReviews.map((r) =>
      r.id === updatedReview.id ? updatedReview : r
    );
    setFilteredReviews(updatedFilteredReviews);
  };

  const onRemoved = (id) => {
    if (listReviews.findIndex(e => e.id === id) !== -1) {
      const newListReviews = [...listReviews].filter(e => e.id !== id);
      setListReviews(newListReviews);
      setFilteredReviews([...newListReviews].splice(0, page * skip));
    } else {
      setFilteredReviews([...filteredReviews].filter(e => e.id !== id));
    }

    setReviewCount(reviewCount - 1);
  };

  const onReset = () => {
    setContent("");
    setCharCount(0);
  };

  return (
      <div className="media-review-container">
      <h4 className="media-review-heading">Reviews - {reviewCount}</h4>
      <div className="media-review-content">
        {filteredReviews.length === 0 ? (
          <p>No review yet.</p>
        ) : (
          filteredReviews.map((item) => (
            item.user ? (
              <ReviewItem
                key={item.id}
                review={item}
                onRemoved={onRemoved}
                onUpdated={onUpdated}
                currentUser={user}
              />
            ) : null
          ))
        )}
        {filteredReviews.length < listReviews.length && (
          <button
            onClick={onLoadMore}
            className="media-review-loading"
          >
            Load More{" "}
            {loading && (
              <FontAwesomeIcon icon={faCircleNotch} spin />
            )}
          </button>
        )}
      </div>
      {user && (
        <div className="media-review-input-container">
          <div className="media-review-user">
            <div className="media-review-avatar">
            <UserAvatar className="media-review-user-avatar" text={user.displayName}></UserAvatar>
            </div>
            <div className="media-review-input">
              <h6 className="media-review-name" style={{ fontWeight: "700" }}>{user.displayName}</h6>
              <div className="radio-group">
                <input
                  type="radio"
                  name="reaction"
                  id="rave"
                  value="rave"
                  checked={reaction === "Rave"}
                  onChange={() => setReaction("Rave")}
                />
                <label htmlFor="rave">Rave</label>
                <input
                  type="radio"
                  name="reaction"
                  id="rant"
                  value="rant"
                  checked={reaction === "Rant"}
                  onChange={() => setReaction("Rant")}
                />
                <label htmlFor="rant">Rant</label>
              </div>
              <div className="char-count">{charCount}/{characterLimit}</div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                placeholder="Short Review Title"
                className="media-review-text-field"
              />
              <textarea
                value={content}
                onChange={(e) => {
                  const input = e.target.value;
                  if (input.length <= characterLimit) {
                    setContent(input);
                    setCharCount(input.length);
                  }
                }}
                rows={8}
                cols={180}
                placeholder="Write your review here..."
                className="media-review-text-field"
              />
              <button
                onClick={onAddReview}
                disabled={onRequest}
                className="media-review-input-button"
              >
                Submit
              </button>
              <button
                onClick={onReset}
                className="media-review-input-button"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaReview;
