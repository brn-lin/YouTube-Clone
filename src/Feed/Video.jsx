import React, { useState, useEffect } from "react";
import "./Video.css";
import { IoMdCheckmarkCircle } from "react-icons/io";

function formatDuration(iso) {
  if (!iso) return "";

  const regex = /PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/;
  const [, h, m, s] = iso.match(regex) || [];

  const hours = parseInt(h || 0, 10);
  const minutes = parseInt(m || 0, 10);
  const seconds = parseInt(s || 0, 10);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, "0")}:${String(
      seconds
    ).padStart(2, "0")}`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

function Video({
  videoId,
  thumbnails,
  duration,
  title,
  channel,
  channelId,
  views,
  date,
  channelProfilePicture,
  isVerified,
}) {
  const formattedDuration = formatDuration(duration);

  const [hover, setHover] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  // State-based thumbnail URL
  const [thumbnailUrl, setThumbnailUrl] = useState(
    thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url
  );

  // Check if maxresthumbnail exists, upgrade if available
  useEffect(() => {
    const maxResUrl = `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`;
    const img = new Image();
    img.src = maxResUrl;
    img.onload = () => {
      if (img.width > 120) {
        setThumbnailUrl(maxResUrl);
      }
    };
    img.onerror = () => {};
  }, [videoId]);

  const thumbnailFallback = () => {
    return (
      thumbnails.high?.url ||
      thumbnails.medium?.url ||
      thumbnails.default?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    );
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleMouseEnter = () => {
    setHover(true);
  };

  const handleMouseLeave = () => {
    setHover(false);
    setIframeKey((prev) => prev + 1); // refresh iframe src
  };

  const goToChannel = (e) => {
    e.stopPropagation(); // prevent parent <a> click
    e.preventDefault(); // prevent default anchor behavior
    window.location.assign(`https://www.youtube.com/channel/${channelId}`);
  };

  return (
    <div className="video">
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
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = thumbnailFallback();
              }}
              style={{ display: hover ? "none" : "block" }}
            />

            {hover && (
              <iframe
                key={iframeKey}
                className="video__player"
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="autoplay"
                allowFullScreen
              ></iframe>
            )}

            {!hover && formattedDuration && (
              <div className="video__duration">{formattedDuration}</div>
            )}
          </div>

          <div className="video__info">
            <div className="video__channel">
              <img
                className="video__avatar"
                onClick={goToChannel}
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
              <span className="video__channel-name-wrapper">
                <p className="video__channel-name" onClick={goToChannel}>
                  {channel}
                </p>
                <p className="video__verification-badge">
                  {isVerified && <IoMdCheckmarkCircle />}
                </p>
              </span>
              <p className="video__stats">
                {views} views &bull; {date}
              </p>
            </div>
          </div>
        </div>
      </a>
    </div>
  );
}

export default Video;
