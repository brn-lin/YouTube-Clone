import { useEffect, useRef, useState } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Header";
import Sidebar from "./Sidebar";
import SidebarExpanded from "./SidebarExpanded";
import { RxHamburgerMenu } from "react-icons/rx";
import { motion, AnimatePresence } from "framer-motion";
import HomePage from "./HomePage";
import SearchResultsPage from "./SearchResultsPage";

function App() {
  const BREAKPOINT = 1312;

  const [userExpanded, setUserExpanded] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(() =>
    window.innerWidth > BREAKPOINT ? false : false
  );
  const [isOverlayMode, setIsOverlayMode] = useState(
    window.innerWidth <= BREAKPOINT
  );

  const prevWidthRef = useRef(window.innerWidth);

  const toggleSidebar = () => {
    setIsSidebarExpanded((prev) => {
      const newVal = !prev;

      if (window.innerWidth > BREAKPOINT) {
        setUserExpanded(newVal);
      }

      return newVal;
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const currentWidth = window.innerWidth;
      const prevWidth = prevWidthRef.current;

      setIsOverlayMode(currentWidth <= BREAKPOINT);

      if (prevWidth > BREAKPOINT && currentWidth <= BREAKPOINT) {
        setIsSidebarExpanded(false);
      }

      if (prevWidth <= BREAKPOINT && currentWidth > BREAKPOINT) {
        setIsSidebarExpanded(userExpanded);
      }

      prevWidthRef.current = currentWidth;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [userExpanded]);

  useEffect(() => {
    const body = document.body;

    if (isOverlayMode && isSidebarExpanded) {
      // freeze scroll
      const scrollY = window.scrollY || window.pageYOffset;
      body.style.position = "fixed";
      body.style.top = `-${scrollY}px`;
      body.style.left = "0";
      body.style.right = "0";
      body.style.width = "100%";
      body.dataset.scrollY = String(scrollY);
    } else {
      // restore scroll
      const stored = body.dataset.scrollY;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      delete body.dataset.scrollY;
      if (stored) {
        const restoreY = parseInt(stored, 10) || 0;
        window.scrollTo(0, restoreY);
      }
    }

    return () => {
      // cleanup
      const stored = body.dataset.scrollY;
      body.style.position = "";
      body.style.top = "";
      body.style.left = "";
      body.style.right = "";
      body.style.width = "";
      delete body.dataset.scrollY;
      if (stored) {
        const restoreY = parseInt(stored, 10) || 0;
        window.scrollTo(0, restoreY);
      }
    };
  }, [isOverlayMode, isSidebarExpanded]);

  return (
    <div className="app">
      <Header
        onToggleSidebar={toggleSidebar}
        isSidebarExpanded={isSidebarExpanded}
        isOverlayMode={isOverlayMode}
      />
      <div className="app__page">
        {isOverlayMode ? (
          <>
            {/* Show overlay mode above collapsed sidebar so grid doesn't move */}
            {isOverlayMode && <Sidebar />}

            {/* Expanded = show overlay sidebar */}
            <AnimatePresence>
              {isSidebarExpanded && (
                <>
                  <div className="overlay" onClick={toggleSidebar}></div>
                  <motion.div
                    className="overlay-sidebar"
                    initial={{ x: -240 }} // start off-screen
                    animate={{ x: 0 }} // slide in
                    exit={{ x: -240 }} // slide out
                    transition={{ duration: 0.2, ease: "easeInOut" }}
                  >
                    {/* Mini header inside the overlay sidebar */}
                    <div className="overlay-sidebar__header">
                      <button
                        className="overlay-sidebar__collapse-button"
                        onClick={toggleSidebar}
                      >
                        <RxHamburgerMenu className="overlay-sidebar__collapse-icon" />
                      </button>
                      <img
                        className="overlay-sidebar__logo"
                        src="https://logos-world.net/wp-content/uploads/2020/06/YouTube-Logo.png"
                        alt="YouTube"
                      />
                    </div>

                    {/* The full sidebar content */}
                    <SidebarExpanded />
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </>
        ) : isSidebarExpanded ? (
          <SidebarExpanded />
        ) : (
          <Sidebar />
        )}
        <Routes>
          <Route
            path="/"
            element={
              <HomePage
                isSidebarExpanded={!isOverlayMode && isSidebarExpanded}
                isOverlayMode={isOverlayMode}
              />
            }
          />
          <Route path="/results" element={<SearchResultsPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
