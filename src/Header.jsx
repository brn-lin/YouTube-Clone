import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Header.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { MdClear, MdKeyboardVoice } from "react-icons/md";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import axios from "axios";

function Header({ onToggleSidebar, isSidebarExpanded }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSettingsTooltipVisible, setIsSettingsTooltipVisible] =
    useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [originalText, setOriginalText] = useState("");

  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);
  const userTypingRef = useRef(false);

  const categories = [
    "All",
    "Gaming",
    "Music",
    "Movies",
    "Cars",
    "Houses",
    "Trailers",
    "Mansions",
    "Trails",
    "Tourist attractiveness",
    "Luxury vehicles",
    "Outdoors",
    "Soccer",
    "4K resolution",
    "Basketball",
    "Supercar",
    "Sci-fi films",
    "Model trains",
    "Anime",
    "Nature documentaries",
    "Zoos",
    "Playlists",
    "Comic books",
    "Original video animation",
  ];

  // 🧠 Fetch suggestions (YouTube's unofficial endpoint)
  const fetchSuggestions = async (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const currentQuery = query; // capture for comparison
    try {
      const res = await axios.get(
        "https://us-central1-yt-clone-7d295.cloudfunctions.net/youtubeProxy",
        {
          params: {
            endpoint: "suggestqueries.google.com/complete/search",
            client: "firefox",
            ds: "yt",
            q: query,
          },
        }
      );

      // ignore results if user cleared or changed the query
      if (currentQuery !== searchText.trim()) return;

      setSuggestions(res.data[1] || []);
    } catch (err) {
      console.error("❌ Suggestion fetch error:", err);
    }
  };

  // Debounce suggestion fetching
  useEffect(() => {
    if (!userTypingRef.current) return; // Ignore programmatic changes

    if (debounceRef.current) clearTimeout(debounceRef.current);

    const trimmed = searchText.trim();
    if (!trimmed) {
      setSuggestions([]);
      setShowSuggestions(false); // extra safety
      return;
    }

    debounceRef.current = setTimeout(() => {
      fetchSuggestions(searchText);
    }, 200);

    return () => {
      userTypingRef.current = false;
    };
  }, [searchText]);

  // 🖱️ Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
        setSelectedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const query = params.get("search_query");

    if (query) {
      setSearchText(query);
    }
  }, [location.search]);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth);
  };

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = 300;

    scrollRef.current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });

    checkScroll();
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchText.trim()) {
      setShowSuggestions(false);
      navigate(
        `/results?search_query=${searchText.trim().replace(/\s+/g, "+")}`
      );
    }
  };

  // ✅ Handle selecting a suggestion
  const handleSelectSuggestion = (suggestion) => {
    setSearchText(suggestion);
    setShowSuggestions(false);
    navigate(`/results?search_query=${suggestion.trim().replace(/\s+/g, "+")}`);
  };

  return (
    <div className="header">
      <div className="header__top">
        <div className="header__left">
          <button className="header__collapse-button" onClick={onToggleSidebar}>
            <RxHamburgerMenu className="header__collapse-icon" />
          </button>
          <img
            className="header__logo"
            src="https://logos-world.net/wp-content/uploads/2020/06/YouTube-Logo.png"
            alt="YouTube Logo"
            onClick={() => navigate("/")}
          />
        </div>

        <div className="header__middle">
          <form
            className="header__input"
            onSubmit={handleSearch}
            ref={wrapperRef}
          >
            <input
              className="header__search-input"
              placeholder="Search"
              type="text"
              value={searchText}
              onChange={(e) => {
                const value = e.target.value;
                userTypingRef.current = true;
                setSearchText(value);
                setSelectedIndex(-1);
                setOriginalText(value);

                if (value.trim() === "") {
                  // Close dropdown immediately when input is cleared
                  setShowSuggestions(false);
                  setSuggestions([]);
                  return;
                }

                // Otherwise, open dropdown and prepare to fetch
                setShowSuggestions(true);
              }}
              onFocus={() => {
                setSelectedIndex(-1);

                const trimmed = searchText.trim();
                if (!trimmed) return;

                // Clear old suggestions immediately
                setSuggestions([]);
                setShowSuggestions(true);

                if (debounceRef.current) clearTimeout(debounceRef.current);
                debounceRef.current = setTimeout(() => {
                  fetchSuggestions(trimmed);
                  setShowSuggestions(true);
                }, 10);
              }}
              onKeyDown={(e) => {
                if (showSuggestions && suggestions.length > 0) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault();
                    setSelectedIndex((prev) => {
                      const newIndex =
                        prev < suggestions.length - 1 ? prev + 1 : 0;
                      userTypingRef.current = false; //  don't let typing affect search suggestion
                      setSearchText(suggestions[newIndex]); // Show selected suggestion
                      return newIndex;
                    });
                  } else if (e.key === "ArrowUp") {
                    e.preventDefault();
                    setSelectedIndex((prev) => {
                      let newIndex;
                      if (prev === -1) {
                        // 👇 Jump to the last suggestion when nothing is selected
                        newIndex = suggestions.length - 1;
                      } else {
                        // 👇 Otherwise go up normally
                        newIndex = prev > 0 ? prev - 1 : -1;
                      }

                      userTypingRef.current = false; //  don't let typing affect search suggestion

                      if (newIndex === -1) {
                        setSearchText(
                          prev === -1 ? originalText : suggestions[prev]
                        );
                      } else {
                        setSearchText(suggestions[newIndex]);
                      }

                      return newIndex;
                    });
                  } else if (e.key === "Enter") {
                    e.preventDefault();
                    if (
                      selectedIndex >= 0 &&
                      selectedIndex < suggestions.length
                    ) {
                      handleSelectSuggestion(suggestions[selectedIndex]);
                    } else {
                      handleSearch(e);
                    }
                  } else if (e.key === "Escape") {
                    setShowSuggestions(false);
                    setSelectedIndex(-1);
                  }
                } else if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch(e);
                }
              }}
            />
            {searchText && (
              <button
                type="button"
                className="header__search-input-clear-button"
                onClick={() => {
                  setSearchText("");
                  setShowSuggestions(false); // Hide search suggestion dropdown
                  setSuggestions([]); //  Clear any cached suggestions
                  setSelectedIndex(-1); // Reset keyboard navigation
                  setOriginalText("");
                }}
              >
                <MdClear />
              </button>
            )}
            <button type="submit" className="header__search-button">
              <CiSearch className="header__search-button-icon" />
            </button>

            {/* 🧠 Suggestion dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <ul className="header__search-suggestions-dropdown">
                {suggestions.map((s, i) => (
                  <li
                    key={s}
                    className={`header__search-suggestion-item ${
                      i === selectedIndex ? "active" : ""
                    }`}
                    onMouseDown={() => handleSelectSuggestion(s)}
                  >
                    <CiSearch className="header__search-suggestion-icon" />
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </form>

          <div className="tooltip-container">
            <button className="header__voice-search-button">
              <MdKeyboardVoice className="header__voice-search-button-icon" />
              <span className="voice-search-button__tooltip-text">
                Search with your voice
              </span>
            </button>
          </div>
        </div>

        <div className="header__right">
          <div
            className="tooltip-container"
            onMouseEnter={() => setIsSettingsTooltipVisible(true)}
            onMouseLeave={() => setIsSettingsTooltipVisible(false)}
          >
            <button
              className="header__settings-button"
              onClick={() => setIsSettingsTooltipVisible(false)}
            >
              <IoEllipsisVerticalSharp />
            </button>
            {isSettingsTooltipVisible && (
              <span className="settings__tooltip-text">Settings</span>
            )}
          </div>

          <button className="header__user-sign-in-button">
            <RxAvatar className="header__avatar-icon" />
            <p className="header__user-sign-in-button-text">Sign in</p>
          </button>
        </div>
      </div>

      <div
        className={`header__bottom-wrapper ${
          isSidebarExpanded ? "header__bottom-wrapper--shifted" : ""
        }`}
      >
        {canScrollLeft && (
          <div className="scroll-button__tooltip-container">
            <button
              className="header__scroll-button header__scroll-button--left"
              onClick={() => scroll("left")}
            >
              <IoIosArrowBack />
              <span className="previous-scroll-button__tooltip-text">
                Previous
              </span>
            </button>
          </div>
        )}

        <div className="header__bottom" ref={scrollRef} onScroll={checkScroll}>
          {categories.map((category) => (
            <button
              key={category}
              className={`header__category-tab ${
                selectedCategory === category
                  ? "header__category-tab--selected"
                  : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {canScrollRight && (
          <div className="scroll-button__tooltip-container">
            <button
              className="header__scroll-button header__scroll-button--right"
              onClick={() => scroll("right")}
            >
              <IoIosArrowForward />
              <span className="next-scroll-button__tooltip-text">Next</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
