import React from "react";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faHome, 
  faCalendarAlt, 
  faClipboardCheck, 
  faBullhorn, 
  faChartBar, 
  faFileMedical,
  faUserFriends,
  faHospitalUser,
  faUserTie,
  faSignOutAlt,
  faMapMarkedAlt,
  faMobileAlt
} from "@fortawesome/free-solid-svg-icons";

function Sidebar({ isOpen }) {
  const navItems = [
    { path: "/", icon: faHome, label: "Home" },
    { path: "/patients", icon: faHospitalUser, label: "Patients" },
    { path: "/appointments", icon: faCalendarAlt, label: "Schedule" },
    { path: "/census", icon: faMapMarkedAlt, label: "Community Census" },
    { path: "/residents", icon: faMobileAlt, label: "App Registrations" },
    { path: "/records", icon: faFileMedical, label: "Medical History" },
    { path: "/staff", icon: faUserTie, label: "Staff Management" },
    { path: "/announcements", icon: faBullhorn, label: "News & Alerts" },
    { path: "/attendance", icon: faClipboardCheck, label: "Attendance" },
    { path: "/reports", icon: faChartBar, label: "Clinic Reports" },
  ];

  const adminName = localStorage.getItem("adminName") || "Super Administrator";
  const adminId = localStorage.getItem("adminId") || "BHW-SYSTEM-SA";

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("adminId");
      localStorage.removeItem("adminName");
      window.location.href = "/login";
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
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
