import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import ReactDOM from "react-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faChevronDown,
  faCircleExclamation,
  faCalendarAlt,
  faTimes,
  faSignOutAlt,
  faUser, 
  faKey,
  faCheckDouble,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faShieldAlt,
  faHistory,
  faCamera,
  faBars,
  faSearch,
  faUserPlus,
  faClipboardCheck,
  faInfoCircle,
  faClock,
  faCircle
  } from "@fortawesome/free-solid-svg-icons";

function TopNavbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const adminId = localStorage.getItem("adminId") || "BHW-SYSTEM-SA";
  const adminName = localStorage.getItem("adminName") || "Super Administrator";

  useEffect(() => {
    const savedReadIds = JSON.parse(localStorage.getItem("readNotificationIds") || "[]");
    setReadIds(savedReadIds);

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const apiBase = "http://localhost:5000/api";
      const [annRes, evtRes, resRes, recRes] = await Promise.all([
        axios.get(`${apiBase}/announcements`),
        axios.get(`${apiBase}/events`),
        axios.get(`${apiBase}/residents`),
        axios.get(`${apiBase}/records`)
      ]);

      const now = new Date();
      const todayStr = now.toDateString();
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

      const alerts = annRes.data.filter(a => a.priority === 'High').map(a => ({
          id: `ann-${a._id}`,
          title: "System Alert",
          message: a.title,
          description: a.content,
          time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          fullDate: new Date(a.createdAt).toLocaleString(),
          type: 'alert',
          ts: new Date(a.createdAt),
          author: a.author
      }));

      const events = evtRes.data.filter(e => new Date(e.date).toDateString() === todayStr).map(e => ({
          id: `evt-${e._id}`,
          title: "Scheduled Today",
          message: e.title,
          description: e.description || "No description provided.",
          time: e.startTime || "All Day",
          fullDate: new Date(e.date).toLocaleDateString(),
          type: 'event',
          ts: new Date(e.date),
          location: e.location
      }));

      const newResidents = resRes.data.filter(r => new Date(r.createdAt) > yesterday).map(r => ({
          id: `res-${r._id}`,
          title: "New Resident",
          message: `${r.fullName} joined`,
          description: `A new resident from Purok ${r.purok} has registered an account. Household No: ${r.householdNo}`,
          time: "Recent",
          fullDate: new Date(r.createdAt).toLocaleString(),
          type: 'resident',
          ts: new Date(r.createdAt),
          purok: r.purok
      }));

      const newRecords = recRes.data.slice(0, 5).map(r => ({
          id: `rec-${r._id}`,
          title: "Checkup Logged",
          message: `For ${r.patient?.name || 'Patient'}`,
          description: `Diagnosis: ${r.diagnosis}. Attending Physician: ${r.physician || 'Staff'}.`,
          time: "Recently",
          fullDate: new Date(r.createdAt || r.date).toLocaleString(),
          type: 'record',
          ts: new Date(r.createdAt || r.date)
      }));

      const allNotifs = [...alerts, ...events, ...newResidents, ...newRecords]
        .sort((a, b) => b.ts - a.ts)
        .slice(0, 15);

      setNotifications(allNotifs);
    } catch (err) { 
      console.error("Notification Error:", err); 
    }
  };

  const handleLogout = () => {
      if (window.confirm("Are you sure you want to logout?")) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("adminId");
          localStorage.removeItem("adminName");
          window.location.href = "/login";
      }
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem("readNotificationIds", JSON.stringify(newReadIds));
    }
  };

  const clearNotifications = () => {
      const allIds = notifications.map(n => n.id);
      const newReadIds = Array.from(new Set([...readIds, ...allIds]));
      setReadIds(newReadIds);
      localStorage.setItem("readNotificationIds", JSON.stringify(newReadIds));
  };

  const handleNotifClick = (notif) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
    setIsModalOpen(true);
    setShowNotifications(false);
  };

  const getNotifIcon = (type) => {
    switch(type) {
      case 'alert': return faCircleExclamation;
      case 'event': return faCalendarAlt;
      case 'resident': return faUserPlus;
      case 'record': return faClipboardCheck;
      default: return faBell;
    }
  };

  const getNotifColors = (type) => {
    switch(type) {
      case 'alert': return { bg: '#FEF2F2', text: '#EF4444' };
      case 'event': return { bg: '#F5F3FF', text: '#8B5CF6' };
      case 'resident': return { bg: '#ECFDF5', text: '#10B981' };
      case 'record': return { bg: '#EFF6FF', text: '#3B82F6' };
      default: return { bg: '#F8FAFC', text: '#64748B' };
    }
  };

  const unreadCount = notifications.filter(n => !readIds.includes(n.id)).length;

  const NotificationModal = () => {
    if (!isModalOpen || !selectedNotif) return null;

    const modalContent = (
      <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: '1rem' }}>
        <div className="report-card animate-scale-in" style={{ width: '100%', maxWidth: '500px', padding: '0', borderRadius: '28px', overflow: 'hidden', background: 'white' }}>
          <div style={{ 
            background: getNotifColors(selectedNotif.type).bg, 
            padding: '2.5rem 2rem', 
            color: getNotifColors(selectedNotif.type).text,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'white', border: 'none', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><FontAwesomeIcon icon={faTimes} /></button>
            
            <div style={{ 
              width: '70px', height: '70px', borderRadius: '24px', background: 'white', 
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              marginBottom: '1rem', boxShadow: '0 8px 15px rgba(0,0,0,0.05)'
            }}>
              <FontAwesomeIcon icon={getNotifIcon(selectedNotif.type)} />
            </div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900 }}>{selectedNotif.title}</h2>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, marginTop: '4px', opacity: 0.8 }}>{selectedNotif.fullDate}</span>
          </div>
          
          <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>INFORMATION</label>
              <p style={{ margin: 0, fontSize: '1rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.6 }}>{selectedNotif.description || selectedNotif.message}</p>
            </div>

            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <FontAwesomeIcon icon={faClock} style={{ color: '#CBD5E1', width: '16px' }} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>Logged at {selectedNotif.time}</span>
              </div>

              {selectedNotif.location && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#CBD5E1', width: '16px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>{selectedNotif.location}</span>
                </div>
              )}

              {selectedNotif.author && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <FontAwesomeIcon icon={faUser} style={{ color: '#CBD5E1', width: '16px' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569' }}>By {selectedNotif.author}</span>
                </div>
              )}
            </div>

            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ 
                width: '100%', padding: '1rem', borderRadius: '16px', border: 'none',
                background: '#1E293B', color: 'white', fontWeight: 800, cursor: 'pointer',
                marginTop: '1.5rem', transition: 'all 0.2s'
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );

    return ReactDOM.createPortal(modalContent, document.body);
  };

  return (
    <nav className="top-nav">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="icon-button mobile-only" onClick={onMenuClick} style={{ width: '40px', height: '40px', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <FontAwesomeIcon icon={faBars} />
        </button>
        <div className="top-nav__search hide-on-mobile">
          <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input placeholder="Search records, events..." />
        </div>
      </div>

      <div className="top-nav__actions">
        {/* NOTIFICATION HUB */}
        <div style={{ position: 'relative' }}>
            <button 
                className="icon-button" 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', 
                    background: showNotifications ? '#4169E1' : '#F8FAFC', 
                    color: showNotifications ? 'white' : '#64748B',
                    fontSize: '1.1rem', border: '1px solid #E2E8F0'
                }}
            >
              <FontAwesomeIcon icon={faBell} />
              {unreadCount > 0 && (
                <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '18px', height: '18px', background: '#EF4444', color: 'white', fontSize: '0.6rem', fontWeight: 900, borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
                <div className="notification-dropdown animate-fade-in" style={{ 
                  position: 'absolute', top: '120%', right: '0',
                  width: '380px', borderRadius: '24px', padding: '0', overflow: 'hidden', border: 'none', 
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
                  zIndex: 1001, background: 'white'
                }}>
                    <div className="dropdown-header" style={{ padding: '1.25rem 1.5rem', background: '#FFFFFF', borderBottom: '1px solid #F1F5F9' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontSize: '1rem', fontWeight: 900, color: '#0F172A' }}>Activity Hub</span>
                          {unreadCount > 0 && <span style={{ background: '#4169E1', color: 'white', fontSize: '0.65rem', fontWeight: 900, padding: '2px 8px', borderRadius: '999px' }}>{unreadCount} NEW</span>}
                        </div>
                        <button onClick={clearNotifications} style={{ fontSize: '0.75rem', fontWeight: 700, color: '#4169E1', background: 'none', border: 'none', cursor: 'pointer' }}>
                            Mark all read
                        </button>
                    </div>
                    <div className="notification-list" style={{ maxHeight: '420px', overflowY: 'auto', padding: '0.5rem' }}>
                        {notifications.length > 0 ? notifications.map(n => {
                            const colors = getNotifColors(n.type);
                            const isRead = readIds.includes(n.id);
                            return (
                              <div 
                                key={n.id} 
                                className="notification-item" 
                                onClick={() => handleNotifClick(n)}
                                style={{ 
                                  padding: '1.25rem 1rem', borderRadius: '16px', margin: '4px', display: 'flex', gap: '12px', transition: 'all 0.2s', cursor: 'pointer',
                                  background: isRead ? 'transparent' : 'rgba(65, 105, 225, 0.08)',
                                  border: isRead ? '1px solid transparent' : '1px solid rgba(65, 105, 225, 0.15)'
                                }}
                              >
                                  <div style={{ 
                                    width: '42px', height: '42px', borderRadius: '12px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem',
                                    background: colors.bg, color: colors.text,
                                    position: 'relative'
                                  }}>
                                      <FontAwesomeIcon icon={getNotifIcon(n.type)} />
                                      {!isRead && (
                                        <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '8px', height: '8px', background: '#4169E1', borderRadius: '50%', border: '2px solid white' }}></span>
                                      )}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2px' }}>
                                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            <span style={{ fontSize: '0.85rem', fontWeight: isRead ? 700 : 900, color: isRead ? '#475569' : '#0F172A', display: 'block' }}>{n.title}</span>
                                            {!isRead && <span style={{ background: '#4169E1', color: 'white', fontSize: '0.5rem', fontWeight: 900, padding: '1px 4px', borderRadius: '4px' }}>NEW</span>}
                                          </div>
                                          <span style={{ fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8' }}>{n.time}</span>
                                      </div>
                                      <p style={{ margin: 0, fontSize: '0.8rem', color: isRead ? '#94A3B8' : '#64748B', lineHeight: 1.4, fontWeight: isRead ? 500 : 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{n.message}</p>
                                  </div>
                              </div>
                            );
                        }) : (
                          <div style={{ padding: '3rem 1rem', textAlign: 'center' }}>
                            <p style={{ margin: 0, fontSize: '0.875rem', fontWeight: 700, color: '#94A3B8' }}>No recent activity</p>
                          </div>
                        )}
                    </div>
                    <div style={{ padding: '1rem', textAlign: 'center', background: '#F8FAFC', borderTop: '1px solid #F1F5F9' }}>
                      <button 
                        onClick={(e) => { 
                          e.stopPropagation();
                          setShowNotifications(false);
                          navigate('/notifications'); 
                        }}
                        style={{ background: 'none', border: 'none', fontSize: '0.8rem', fontWeight: 800, color: '#4169E1', cursor: 'pointer' }}
                      >
                        Show all notifications
                      </button>
                    </div>
                </div>
            )}
        </div>
        
        {/* PROFILE */}
        <div style={{ position: 'relative' }}>
            <div className="user-profile" onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}>
                <div className="user-profile__avatar">{adminName.substring(0, 2).toUpperCase()}</div>
                <div className="user-profile__info hide-on-mobile">
                    <p className="admin-name">{adminName}</p>
                    <p className="admin-id">{adminId}</p>
                </div>
                <FontAwesomeIcon icon={faChevronDown} className={`chevron ${showProfileMenu ? 'open' : ''}`} />
            </div>

            {showProfileMenu && (
                <div className="profile-dropdown animate-fade-in" style={{ zIndex: 1001 }}>
                    <Link to="/profile" onClick={() => setShowProfileMenu(false)} className="dropdown-link">
                        <FontAwesomeIcon icon={faUser} />
                        <span>My Profile</span>
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-link logout">
                        <FontAwesomeIcon icon={faSignOutAlt} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </div>
      </div>

      <NotificationModal />
    </nav>
  );
}

export default TopNavbar;
