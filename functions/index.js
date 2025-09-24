require("dotenv").config();
const cors = require("cors");
const functions = require("firebase-functions");
const axios = require("axios");

const allowedOrigins = [
  "http://localhost:5173",
  "https://yt-clone-7d295.web.app",
];

const corsHandler = cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true); // allow
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

exports.youtubeProxy = functions.https.onRequest((req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { endpoint, ...queryParams } = req.query;

      if (!endpoint) {
        return res.status(400).json({ error: "Missing endpoint parameter" });
      }

      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

      if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: "Missing YouTube API key" });
      }

      const response = await axios.get(
        `https://www.googleapis.com/youtube/v3/${endpoint}`,
        {
          params: {
            ...queryParams,
            key: YOUTUBE_API_KEY,
          },
        }
      );

      res.json(response.data);
    } catch (error) {
      console.error(
        "YouTube API error:",
        error.response?.data || error.message
      );
      res.status(500).json({ error: "Failed to fetch from YouTube API" });
    }
  });
});
