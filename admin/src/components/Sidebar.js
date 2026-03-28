import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faCalendarAlt, 
  faUsers, 
  faClipboardCheck, 
  faBullhorn, 
  faChartBar, 
  faFileMedical,
  faSignOutAlt,
  faUserFriends,
  faHospitalUser
} from "@fortawesome/free-solid-svg-icons";

function Sidebar() {
  const navItems = [
    { path: "/", icon: faHome, label: "Dashboard" },
    { path: "/patients", icon: faHospitalUser, label: "Patients" },
    { path: "/appointments", icon: faCalendarAlt, label: "Schedules" },
    { path: "/records", icon: faFileMedical, label: "Medical Records" },
    { path: "/residents", icon: faUserFriends, label: "Residents" },
    { path: "/announcements", icon: faBullhorn, label: "Community Hub" },
    { path: "/attendance", icon: faClipboardCheck, label: "Attendance" },
    { path: "/reports", icon: faChartBar, label: "Reports" },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="sidebar__brand-icon-wrapper">
          <img src="/chems-logo.png" alt="Logo" style={{ width: '28px', height: '28px' }} />
        </div>
        <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>CHESMS</span>
      </div>

      <nav className="sidebar__nav">
        {navItems.map((item) => (
          <NavLink key={item.path} to={item.path} className={({ isActive }) => `sidebar__link ${isActive ? "active" : ""}`}>
            <FontAwesomeIcon icon={item.icon} style={{ width: '18px' }} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
