import React, { useCallback, useEffect, useRef, useState } from "react";
import axios from "axios";
import Video from "./Video";
import "./RecommendedVideos.css";

const PROXY_URL = "https://youtubeproxy-jtzad2sm3q-uc.a.run.app";
const MAX_VIDEOS = 100;

function formatViewCount(views) {
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

function RecommendedVideos({ isSidebarExpanded, isOverlayMode }) {
  const [videos, setVideos] = useState([]);
  const [channelMap, setChannelMap] = useState({});
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef(null);

  const fetchVideosAndChannels = useCallback(
    async (pageToken = "") => {
      if (loading || !hasMore) return;
      setLoading(true);

      try {
        const videoResponse = await axios.get(PROXY_URL, {
          params: {
            endpoint: "videos",
            part: "snippet,statistics,contentDetails",
            chart: "mostPopular",
            regionCode: "US",
            maxResults: 12,
            pageToken,
          },
        });

        const videoItems = videoResponse.data.items;
        setVideos((prev) => {
          const existingIds = new Set(prev.map((v) => v.id.videoId || v.id));
          const newVideos = videoItems.filter(
            (v) => !existingIds.has(v.id.videoId || v.id)
          );

          const combined = [...prev, ...newVideos];
          return combined.slice(-MAX_VIDEOS);
        });

        if (videoResponse.data.nextPageToken) {
          setNextPageToken(videoResponse.data.nextPageToken);
          setHasMore(true);
        } else {
          setNextPageToken(null);
          setHasMore(false);
        }

        const channelIds = videoItems.map((v) => v.snippet.channelId).join(",");

        if (channelIds) {
          const channelResponse = await axios.get(PROXY_URL, {
            params: {
              endpoint: "channels",
              part: "snippet",
              id: channelIds,
            },
          });

          const map = {};
          channelResponse.data.items.forEach((channel) => {
            map[channel.id] = channel.snippet.thumbnails.high.url;
          });

          setChannelMap((prev) => ({ ...prev, ...map }));
        }
      } catch (error) {
        if (error.response) {
          console.error(
            "YouTube API error:",
            error.response.data.error.message,
            "Details:",
            error.response.data.error.errors
          );
        } else {
          console.error("Error fetching YouTube data", error);
        }
      } finally {
        setLoading(false);
      }
    },
    [loading, hasMore]
  );

  useEffect(() => {
    fetchVideosAndChannels();
  }, []);

  useEffect(() => {
    if (!loaderRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && nextPageToken && !loading) {
          fetchVideosAndChannels(nextPageToken);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [nextPageToken, loading, hasMore, fetchVideosAndChannels]);

  return (
    <div className="recommended-videos">
      <div
        className={`recommended-videos__videos ${
          !isOverlayMode && isSidebarExpanded
            ? "recommended-videos__videos--expanded"
            : ""
        }`}
      >
        {videos.map((video) => (
          <Video
            key={`video-${video.id.videoId || video.id}`}
            videoId={video.id.videoId || video.id}
            title={video.snippet.title}
            thumbnails={video.snippet.thumbnails}
            duration={video.contentDetails?.duration}
            channel={video.snippet.channelTitle}
            channelId={video.snippet.channelId}
            views={formatViewCount(video.statistics?.viewCount || 0)}
            date={formatDate(video.snippet.publishedAt)}
            channelProfilePicture={
              channelMap[video.snippet.channelId] ||
              "https://www.pngmart.com/files/23/Profile-PNG-Photo.png"
            }
            isVerified={true}
          />
        ))}
      </div>

      {hasMore && (
        <div ref={loaderRef} className="loading">
          {loading}
        </div>
      )}
      {!hasMore && <p className="end-message">No more videos to load.</p>}
    </div>
  );
}

export default RecommendedVideos;
