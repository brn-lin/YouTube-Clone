import React from "react";
import RecommendedVideos from "./RecommendedVideos";

function HomePage({ isSidebarExpanded, isOverlayMode }) {
  return (
    <RecommendedVideos
      isSidebarExpanded={!isOverlayMode && isSidebarExpanded}
      isOverlayMode={isOverlayMode}
    />
  );
}

export default HomePage;
