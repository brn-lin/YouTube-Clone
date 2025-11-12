import React from "react";
import SidebarRowExpanded from "./SidebarRowExpanded";
import "./SidebarExpanded.css";
import { MdHome, MdOutlineHome } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiHistoryLine } from "react-icons/ri";
import { RxAvatar } from "react-icons/rx";
import { RiShoppingBag4Line } from "react-icons/ri";
import { LiaMusicSolid } from "react-icons/lia";
import { PiFilmSlate } from "react-icons/pi";
import { IoRadio } from "react-icons/io5";
import { SiYoutubegaming } from "react-icons/si";
import { FaRegNewspaper } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";
import { PiGraduationCap } from "react-icons/pi";
import { MdPodcasts } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { TbFlag } from "react-icons/tb";
import { TbHelp } from "react-icons/tb";
import { RiFeedbackLine } from "react-icons/ri";
import { useLocation } from "react-router-dom";

function SidebarExpanded() {
  const location = useLocation();

  // Determine which route we're on
  const isResultsPage = location.pathname.startsWith("/results");
  const isHomePage = location.pathname === "/";

  return (
    <div className="sidebar-expanded">
      <SidebarRowExpanded
        selected={isHomePage && !isResultsPage}
        Icon={MdHome}
        title="Home"
      />
      <SidebarRowExpanded Icon={SiYoutubeshorts} title="Shorts" />
      <SidebarRowExpanded Icon={MdOutlineSubscriptions} title="Subscription" />
      <hr />
      <SidebarRowExpanded Icon={FaRegCircleUser} title="You" />
      <SidebarRowExpanded Icon={RiHistoryLine} title="History" />
      <hr />
      <p className="sidebar-expanded__user-sign-in-prompt">
        Sign in to like videos, comment, and subscribe.
      </p>
      <button className="sidebar-expanded__user-sign-in-button">
        <RxAvatar className="sidebar-expanded__avatar-icon" />
        <p className="sidebar-expanded__user-sign-in-button-text">Sign in</p>
      </button>
      <hr />
      <h3 className="sidebar-expanded__section-header">Explore</h3>
      <SidebarRowExpanded Icon={RiShoppingBag4Line} title="Shopping" />
      <SidebarRowExpanded Icon={LiaMusicSolid} title="Music" />
      <SidebarRowExpanded Icon={PiFilmSlate} title="Movies & TV" />
      <SidebarRowExpanded Icon={IoRadio} title="Live" />
      <SidebarRowExpanded Icon={SiYoutubegaming} title="Gaming" />
      <SidebarRowExpanded Icon={FaRegNewspaper} title="News" />
      <SidebarRowExpanded Icon={GoTrophy} title="Sports" />
      <SidebarRowExpanded Icon={PiGraduationCap} title="Courses" />
      <SidebarRowExpanded Icon={MdPodcasts} title="Podcasts" />
      <hr />
      <SidebarRowExpanded Icon={IoSettingsOutline} title="Settings" />
      <SidebarRowExpanded Icon={TbFlag} title="Report History" />
      <SidebarRowExpanded Icon={TbHelp} title="Help" />
      <SidebarRowExpanded Icon={RiFeedbackLine} title="Send Feedback" />
      <hr />
      <div className="sidebar-expanded__footer">
        <div className="sidebar-expanded__footer-1">
          <a href="https://www.youtube.com/about/">About</a>
          <a href="https://www.youtube.com/about/press/">Press</a>
          <a href="https://www.youtube.com/about/copyright/">Copyright</a>
          <a href="/t/contact_us/">Contact us</a>
          <a href="https://www.youtube.com/creators/">Creators</a>
          <a href="https://www.youtube.com/ads/">Advertise</a>
          <a href="https://developers.google.com/youtube">Developers</a>
        </div>
        <div className="sidebar-expanded__footer-2">
          <a href="/t/terms">Terms</a>
          <a href="/t/privacy">Privacy</a>
          <a href="https://www.youtube.com/about/policies/">Public & Safety</a>
          <a href="https://www.youtube.com/howyoutubeworks?utm_campaign=ytgen&utm_source=ythp&utm_medium=LeftNav&utm_content=txt&u=https%3A%2F%2Fwww.youtube.com%2Fhowyoutubeworks%3Futm_source%3Dythp%26utm_medium%3DLeftNav%26utm_campaign%3Dytgen">
            How Youtube works
          </a>
          <a href="https://www.youtube.com/new">Test new features</a>
          <a href="https://tv.youtube.com/learn/nflsundayticket">
            NFL Sunday Ticket
          </a>
        </div>
        <div className="sidebar-expanded__footer-copyright">
          <div>© 2025 Google LLC</div>
        </div>
      </div>
    </div>
  );
}

export default SidebarExpanded;
