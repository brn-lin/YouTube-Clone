import React from "react";
import "./SidebarRowExpanded.css";

function SidebarRowExpanded({ selected, Icon, title }) {
  return (
    <div className={`sidebar-row-expanded ${selected ? "selected" : ""}`}>
      <Icon className="sidebar-row-expanded__icon" />
      <h2 className="sidebar-row-expanded__title">{title}</h2>
    </div>
  );
}

export default SidebarRowExpanded;
