# YouTube Clone

A YouTube clone built with React and a Vercel serverless backend proxy, featuring responsive video feeds, infinite scrolling, search autocomplete with live suggestions, a dynamic sidebar, and interactive video previews. Powered by the YouTube Data API v3 on the backend.

## Live Demo

[Click here for a Demo](https://youtube-clone-blue-gamma.vercel.app)

## Screenshots

### Homepage

![Homepage](images/YouTube-Clone-Homepage.png)

<br>

### Search results page

![Search results page](images/YouTube-Clone-Search-Results-Page.png)

## Features

- Home feed displaying trending/popular videos via YouTube Data API
- Infinite scroll with token-based pagination using nextPageToken
- Videos with view counts, publish dates, and channel avatars
- Video preview on hover (embedded autoplay iframe)
- Max-resolution thumbnail upgrade with fallback chain
- Search bar with debounced autocomplete suggestions via Google Suggest endpoint (Google Suggest API)
- Keyboard navigation support for search suggestions (↑ ↓ Enter Escape)
- Responsive category tab bar with scroll buttons
- Search results page with view counts, publish dates, channel avatars, and video descriptions.
- Expandable and collapsible sidebar with an overlay mode on smaller screens
- Animated sidebar slide-in using Framer Motion and scroll lock when in overlay mode
- Serverless API proxy (Vercel function) to handle CORS and protect API key

## Tech Stack

### Frontend

- React
- Vite
- React Router
- Framer Motion
- react-icons

### Backend

- Vercel Serverless Function (backend API proxy)

### API

- YouTube Data API v3 (search, channels, & videos)
- Google Suggest API (search suggestions & autocomplete)

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/brn-lin/YouTube-Clone.git
cd YouTube-Clone
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then fill in the required values:

```env
YOUTUBE_API_KEY=your_youtube_api_key
```

You can obtain a YouTube Data API v3 key from the Google Cloud Console.

### 4. Start the server

```bash
npm run dev
```

### 5. Open the application

http://localhost:5173
