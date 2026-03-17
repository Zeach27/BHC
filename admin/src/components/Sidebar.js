import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faCalendar, 
  faUsers, 
  faCheckCircle, 
  faBullhorn, 
  faChartBar,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";

const navItems = [
  { to: "/", label: "Dashboard", icon: faHome },
  { to: "/events", label: "Events", icon: faCalendar },
  { to: "/residents", label: "Residents", icon: faUsers },
  { to: "/attendance", label: "Attendance", icon: faCheckCircle },
  { to: "/announcements", label: "Announcements", icon: faBullhorn },
  { to: "/reports", label: "Reports", icon: faChartBar },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon-wrapper">
          <img 
            src="/chems-logo.png" 
            alt="CHEMS Logo" 
            className="sidebar__brand-icon"
          />
        </div>
        <span className="sidebar__brand-text">CHEMS</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `sidebar__link${isActive ? " active" : ""}`
            }
          >
            <FontAwesomeIcon icon={item.icon} className="sidebar__link-icon" />
            <span className="sidebar__link-text">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <button className="sidebar__logout" type="button">
          <FontAwesomeIcon icon={faSignOutAlt} /> Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
