import React, { useEffect, useRef, useState } from "react";
import "./Header.css";
import { RxHamburgerMenu } from "react-icons/rx";
import { CiSearch } from "react-icons/ci";
import { MdClear, MdKeyboardVoice } from "react-icons/md";
import { IoEllipsisVerticalSharp } from "react-icons/io5";
import { RxAvatar } from "react-icons/rx";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

function Header({ onToggleSidebar, isSidebarExpanded }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchText, setSearchText] = useState("");
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

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
            alt=""
          />
        </div>
        <div className="header__middle">
          <div className="header__input">
            <input
              className="header__search-input"
              placeholder="Search"
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {searchText && (
              <button
                className="header__search-input-clear-button"
                onClick={() => setSearchText("")}
              >
                <MdClear />
              </button>
            )}
            <button className="header__search-button">
              <CiSearch className="header__search-button-icon" />
            </button>
          </div>
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
          <div className="tooltip-container">
            <IoEllipsisVerticalSharp className="header__settings-icon" />
            <span className="settings__tooltip-text">Settings</span>
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
