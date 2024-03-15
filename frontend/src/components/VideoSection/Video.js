import React, { useState } from "react";

import "./video.css";

import VideoPopup from "./VideoPopup";
import { PlayIcon } from "./PlayButton";

const VideosSection = ({ data }) => {
    const [show, setShow] = useState(false);
    const [videoId, setVideoId] = useState(null);
    const reversedData = data?.results?.slice().reverse()  || [];

    function limitText(text, maxLength) {
      if (text && text.length > maxLength) {
          return text.substr(0, maxLength) + "...";
        }
        return text;
      }

    return (
        <div className="videosSection">
                <div className="sectionHeading">Official Videos</div>
                    <div className="videos">
                        {reversedData.map((video) => (
                            <div
                                key={video.id}
                                className="video"
                                onClick={() => {
                                    setVideoId(video.key);
                                    setShow(true);
                                }}
                            >
                                <div className="video-thumbnail">
                                    <img
                                        src={`https://img.youtube.com/vi/${video.key}/mqdefault.jpg`}
                                        alt="thumbnail"
                                    />
                                    <PlayIcon />
                                </div>
                                <div className="video-title">{limitText(video.name, 60)}</div>
                            </div>
                        ))}
                    </div>
            <VideoPopup
                show={show}
                setShow={setShow}
                videoId={videoId}
                setVideoId={setVideoId}
            />
        </div>
    );
};

export default VideosSection;