import React from "react";
import "./Sidebar.css";
import SidebarRow from "./SidebarRow";
import { MdHome, MdOutlineHome } from "react-icons/md";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { FaRegCircleUser } from "react-icons/fa6";
import { RiHistoryLine } from "react-icons/ri";
import { useSidebar } from "./SidebarContext";

function Sidebar() {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="sidebar">
      <SidebarRow selected Icon={MdHome} title="Home" />
      <SidebarRow Icon={SiYoutubeshorts} title="Shorts" />
      <SidebarRow Icon={MdOutlineSubscriptions} title="Subscription" />
      <SidebarRow Icon={FaRegCircleUser} title="You" />
      <SidebarRow Icon={RiHistoryLine} title="History" />
    </div>
  );
}

export default Sidebar;
