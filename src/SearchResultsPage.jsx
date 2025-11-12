import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import styles from "./SearchResultsPage.module.css";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import he from "he";

const PROXY_URL = "https://youtubeproxy-jtzad2sm3q-uc.a.run.app";
const MAX_RESULTS = 100;

// Helper functions
function formatViewCount(views) {
  if (!views) return "0";
  views = parseInt(views, 10);
  if (views >= 1000000000) {
    const billions = views / 1000000000;
    return billions >= 100
      ? Math.round(billions) + "B"
      : billions.toFixed(1).replace(/\.0$/, "") + "B";
  } else if (views >= 1000000) {
    const millions = views / 1000000;
    return millions >= 100
      ? Math.round(millions) + "M"
      : millions.toFixed(1).replace(/\.0$/, "") + "M";
  } else if (views >= 1000) {
    const thousands = views / 1000;
    return thousands >= 100
      ? Math.round(thousands) + "K"
      : thousands.toFixed(1).replace(/\.0$/, "") + "K";
  }
  return views.toString();
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date() - date) / 1000);

  const intervals = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
  ];

  const interval = intervals.find((i) => Math.floor(seconds / i.seconds) >= 1);
  if (interval) {
    const count = Math.floor(seconds / interval.seconds);
    return `${count} ${interval.label}${count > 1 ? "s" : ""} ago`;
  }
  return "just now";
}

// Component for individual search results
function SearchResultItem({ video }) {
  const [hover, setHover] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);

  const videoId = video.id.videoId;
  const title = he.decode(video.snippet.title);
  const channel = he.decode(video.snippet.channelTitle);
  const channelProfilePicture =
    video.channelProfilePicture ||
    "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";
  const views = video.statistics
    ? formatViewCount(video.statistics.viewCount)
    : "—";
  const date = formatDate(video.snippet.publishedAt);

  // State-based thumbnail URL
  const [thumbnailUrl, setThumbnailUrl] = useState(
    video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default?.url
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
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium?.url ||
      video.snippet.thumbnails.default?.url ||
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
    );
  };

  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0`;
  const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

  const handleMouseEnter = () => setHover(true);
  const handleMouseLeave = () => {
    setHover(false);
    setIframeKey((prev) => prev + 1);
  };

  return (
    <div className={styles["video-card"]}>
      <a href={videoUrl} rel="noopener noreferrer">
        <div className={styles.video}>
          <div
            className={styles["video__player-container"]}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <img
              className={styles.video__thumbnail}
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
                className={styles.video__player}
                src={embedUrl}
                title={title}
                frameBorder="0"
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        </div>

        <div className={styles.video__info}>
          <div className={styles.video__text}>
            <h3 className={styles.video__title}>{title}</h3>
            <p>
              {views} views &bull; {date}
            </p>
            <div
              className={styles.video__channel}
              onClickCapture={(e) => {
                e.stopPropagation(); // prevent parent <a> from firing
                e.preventDefault(); // prevent navigation to video
                window.location.assign(
                  `https://www.youtube.com/channel/${video.snippet.channelId}`
                );
              }}
            >
              <img
                className={styles.video__avatar}
                src={channelProfilePicture}
                alt={channel}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://www.pngmart.com/files/23/Profile-PNG-Photo.png";
                }}
              />
              <span className={styles["video__channel-name-wrapper"]}>
                <p className={styles["video__channel-name"]}>{channel}</p>
                <p className={styles["video__verification-badge"]}>
                  {<IoMdCheckmarkCircle />}
                </p>
              </span>
            </div>
            <p className={styles.video__description}>
              {he.decode(
                video.snippet.description.length > 121
                  ? video.snippet.description.slice(0, 121) + "..."
                  : video.snippet.description
              )}
            </p>
          </div>
        </div>
      </a>
      <div>
        <button className={styles["video-card__more-button"]}>
          <IoEllipsisVerticalSharp />
        </button>
      </div>
    </div>
  );
}

// Component for entire search results page
export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const rawQuery = searchParams.get("search_query") || "";
  const searchQuery = rawQuery.replace(/\+/g, " ");

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchResults = async (isLoadMore = false) => {
    if (!searchQuery) return;

    try {
      if (isLoadMore) {
        setIsFetchingMore(true);
      } else {
        setLoading(true);
        setError(null);
      }

      const searchResponse = await axios.get(`${PROXY_URL}/youtubeProxy`, {
        params: {
          endpoint: "search",
          part: "snippet",
          q: searchQuery,
          maxResults: 20,
          type: "video",
          pageToken: isLoadMore ? nextPageToken : undefined,
        },
      });

      const items = searchResponse.data.items || [];
      const videoIds = items.map((i) => i.id.videoId).filter(Boolean);
      const channelIds = [...new Set(items.map((i) => i.snippet.channelId))];

      // Video stats
      let videoStatsMap = {};
      if (videoIds.length) {
        const videoResponse = await axios.get(`${PROXY_URL}/youtubeProxy`, {
          params: {
            endpoint: "videos",
            part: "statistics",
            id: videoIds.join(","),
          },
        });
        videoResponse.data.items.forEach((v) => {
          videoStatsMap[v.id] = v.statistics;
        });
      }

      // Channel thumbnails
      let channelMap = {};
      if (channelIds.length) {
        const channelResponse = await axios.get(`${PROXY_URL}/youtubeProxy`, {
          params: {
            endpoint: "channels",
            part: "snippet, status",
            id: channelIds.join(","),
          },
        });
        channelResponse.data.items.forEach((c) => {
          channelMap[c.id] = {
            profilePicture:
              c.snippet.thumbnails.maxres?.url ||
              c.snippet.thumbnails.high?.url ||
              c.snippet.thumbnails.medium?.url ||
              c.snippet.thumbnails.default?.url ||
              "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
          };
        });
      }

      // Merge data
      const enrichedResults = items.map((item) => {
        const channelData = channelMap[item.snippet.channelId] || {};
        return {
          ...item,
          statistics: videoStatsMap[item.id.videoId],
          channelProfilePicture:
            channelData.profilePicture ||
            "https://www.pngmart.com/files/23/Profile-PNG-Photo.png",
        };
      });

      // Filter duplicates against existing results when loading more
      if (isLoadMore) {
        setResults((prev) => {
          const existingIds = new Set(prev.map((v) => v.id.videoId));
          const newUnique = enrichedResults.filter(
            (v) => !existingIds.has(v.id.videoId)
          );

          const combined = [...prev, ...newUnique];

          return combined.slice(-MAX_RESULTS);
        });
      } else {
        setResults(enrichedResults);
      }

      setNextPageToken(searchResponse.data.nextPageToken || null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch search results");
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  // Fetch initial results
  useEffect(() => {
    if (!searchQuery) return;
    fetchResults(false);
  }, [searchQuery]);

  // Infinite scroll handler
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 500 &&
        nextPageToken &&
        !isFetchingMore
      ) {
        fetchResults(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [nextPageToken, isFetchingMore]);

  if (loading && !isFetchingMore) return <div></div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!results.length)
    return <div className={styles.noResults}>No results found</div>;

  return (
    <div className={styles["search-results"]}>
      {results.map((video) => (
        <SearchResultItem key={video.id.videoId} video={video} />
      ))}
      <div className={styles["spinner-wrapper"]}>
        {isFetchingMore && <div className={styles.spinner}></div>}
      </div>
    </div>
  );
}
