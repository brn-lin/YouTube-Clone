import cors from "cors";
import axios from "axios";

const allowedOrigins = [
  "http://localhost:5173",
  "https://youtube-clone-blue-gamma.vercel.app/",
];

const corsHandler = cors({
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
});

export default async function handler(req, res) {
  corsHandler(req, res, async () => {
    try {
      const { endpoint, ...queryParams } = req.query;

      if (!endpoint) {
        return res.status(400).json({ error: "Missing endpoint parameter" });
      }

      let response;

      // Handle Suggest Queries separately
      if (endpoint === "suggestqueries.google.com/complete/search") {
        try {
          const suggestResponse = await axios.get(`https://${endpoint}`, {
            params: queryParams,
            headers: {
              "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0 Safari/537.36",
            },
            responseType: "text", // Treat response as text
          });

          // Log the raw response for debugging
          console.log("Raw suggest response:", suggestResponse.data);

          // Try parsing JSON (remove possible JSONP prefix)
          let data;
          try {
            const cleaned = suggestResponse.data.replace(/^\)\]\}'/, "");
            data = JSON.parse(cleaned);
          } catch (parseErr) {
            console.error("Failed to parse suggestions:", parseErr);
            return res
              .status(500)
              .json({ error: "Invalid suggestion response" });
          }

          return res.json(data);
        } catch (err) {
          console.error(
            "Suggest request failed:",
            err.message,
            err.response?.data,
          );

          return res.status(500).json({ error: "Failed to fetch suggestions" });
        }
      }

      console.log("KEY EXISTS:", !!process.env.YOUTUBE_API_KEY);

      // YouTube Data API
      const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

      if (!YOUTUBE_API_KEY) {
        return res.status(500).json({ error: "Missing YouTube API key" });
      }

      response = await axios.get(
        `https://www.googleapis.com/youtube/v3/${endpoint}`,
        {
          params: {
            ...queryParams,
            key: YOUTUBE_API_KEY,
          },
        },
      );

      return res.json(response.data);
    } catch (error) {
      console.error(
        "YouTube API error:",
        error.response?.data || error.message,
      );
      return res
        .status(500)
        .json({ error: "Failed to fetch from YouTube API" });
    }
  });
}
