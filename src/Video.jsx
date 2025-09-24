import React, { useState } from "react";
import "./Video.css";
import { IoMdCheckmarkCircle } from "react-icons/io";

function Video({
  videoId,
  title,
  channel,
  views,
  date,
  channelProfilePicture,
  isVerified,
}) {
  const [hover, setHover] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const thumbnailUrl = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
    setIframeKey((prev) => prev + 1); // refresh iframe src
  };

  return (
    <a href={videoUrl} rel="noopener noreferrer" className="video-link">
      <div
        className="video"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <div className="video__player-container">
          <img
            className="video__thumbnail"
            src={thumbnailUrl}
            alt={title}
            style={{ display: hover ? "none" : "block" }}
          />

          {hover && (
            <iframe
              key={iframeKey}
              className="video__player"
              src={embedUrl}
              title={title}
              frameBorder="0"
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            ></iframe>
          )}
        </div>

        <div className="video__info">
          <div className="video__channel">
            <img
              className="video__avatar"
              src={channelProfilePicture}
              alt="channel avatar"
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";
              }}
            />
          </div>
          <div className="video__text">
            <h4>{title}</h4>
            <p className="video__channel-name">
              <span className="video__channel-name-wrapper">
                {channel}
                {isVerified && <IoMdCheckmarkCircle />}
              </span>
            </p>
            <p>
              {views} &bull; {date}
            </p>
          </div>
        </div>
      </div>
    </a>
  );
}

export default Video;
