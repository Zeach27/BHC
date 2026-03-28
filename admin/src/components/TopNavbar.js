import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faChevronDown,
  faCircleExclamation,
  faCalendarAlt,
  faTimes,
  faSignOutAlt,
  faUserShield,
  faKey,
  faUserEdit,
  faFingerprint
} from "@fortawesome/free-solid-svg-icons";

function TopNavbar() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [notifications, setNotifications] = useState([]);
  
  // Get Admin Data from Session
  const adminId = localStorage.getItem("adminId") || "BHW-SYSTEM-SA";
  const adminName = localStorage.getItem("adminName") || "Super Administrator";

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const [annRes, evtRes] = await Promise.all([
        axios.get("http://localhost:5000/api/announcements"),
        axios.get("http://localhost:5000/api/events")
      ]);

      const alerts = annRes.data.filter(a => a.priority === 'High').map(a => ({
          id: a._id,
          title: "Urgent Alert",
          message: a.title,
          time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'alert'
      }));

      const events = evtRes.data.filter(e => new Date(e.date).toDateString() === new Date().toDateString()).map(e => ({
          id: e._id,
          title: "Event Today",
          message: e.title,
          time: e.startTime || "All Day",
          type: 'event'
      }));

      setNotifications([...alerts, ...events]);
    } catch (err) { console.error(err); }
  };

  const handleLogout = () => {
      if (window.confirm("Confirm Administrative Sign-out?")) {
          localStorage.removeItem("isAuthenticated");
          localStorage.removeItem("adminId");
          localStorage.removeItem("adminName");
          window.location.href = "/login";
      }
  };

  return (
    <nav className="top-nav" style={{ padding: '0 2rem' }}>
      <div style={{ flex: 1 }}></div>

      <div className="top-nav__actions" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        
        {/* NOTIFICATION HUB */}
        <div style={{ position: 'relative' }}>
            <button 
                className="icon-button" 
                onClick={() => { setShowNotifications(!showNotifications); setShowProfileMenu(false); }}
                style={{ 
                    width: '40px', height: '40px', borderRadius: '12px', 
                    background: showNotifications ? '#4169E1' : '#F8FAFC', 
                    color: showNotifications ? 'white' : '#64748B',
                    fontSize: '1.1rem', border: '1px solid #E2E8F0',
                    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
            >
              <FontAwesomeIcon icon={faBell} className={notifications.length > 0 && !showNotifications ? "status-pulse" : ""} />
              {notifications.length > 0 && <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '10px', height: '10px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>}
            </button>

            {showNotifications && (
                <div className="animate-fade-in" style={{ position: 'absolute', top: '120%', right: 0, width: '320px', background: 'white', borderRadius: '20px', boxShadow: 'var(--shadow-lg)', zIndex: 1000, border: '1px solid #E2E8F0', overflow: 'hidden' }}>
                    <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC' }}>
                        <span style={{ fontWeight: 900, fontSize: '0.8125rem', color: '#0F172A', textTransform: 'uppercase' }}>Recent Feed</span>
                        <div style={{ fontSize: '0.65rem', fontWeight: 900, color: 'white', background: '#EF4444', padding: '2px 8px', borderRadius: '6px' }}>{notifications.length} NEW</div>
                    </div>
                    <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        {notifications.length > 0 ? notifications.map(n => (
                            <div key={n.id} style={{ padding: '1.125rem', borderBottom: '1px solid #F1F5F9', display: 'flex', gap: '14px' }}>
                                <div style={{ width: '34px', height: '34px', borderRadius: '10px', background: n.type === 'alert' ? '#FEF2F2' : '#F0F9FF', color: n.type === 'alert' ? '#EF4444' : '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <FontAwesomeIcon icon={n.type === 'alert' ? faCircleExclamation : faCalendarAlt} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#1E293B' }}>{n.title}</span></div>
                                    <p style={{ margin: '3px 0 0 0', fontSize: '0.7rem', color: '#64748B', lineHeight: 1.4 }}>{n.message}</p>
                                </div>
                            </div>
                        )) : <div style={{ padding: '3rem 1.5rem', textAlign: 'center', color: '#94A3B8' }}><p style={{ fontSize: '0.8125rem', fontWeight: 800 }}>No active notifications.</p></div>}
                    </div>
                </div>
            )}
        </div>
        
        {/* ENHANCED PROFILE SYSTEM */}
        <div style={{ position: 'relative' }}>
            <div 
                className="user-profile" 
                onClick={() => { setShowProfileMenu(!showProfileMenu); setShowNotifications(false); }}
                style={{ 
                    border: '1.5px solid #E2E8F0', padding: '6px 12px', borderRadius: '16px', 
                    cursor: 'pointer', transition: 'all 0.2s', background: showProfileMenu ? '#F8FAFC' : 'white',
                    boxShadow: showProfileMenu ? 'inset 0 2px 4px rgba(0,0,0,0.05)' : 'var(--shadow-sm)'
                }}
            >
                <div className="user-profile__avatar" style={{ background: 'linear-gradient(135deg, #4169E1 0%, #3154B3 100%)' }}>SA</div>
                <div className="user-profile__info">
                    <p style={{ margin: 0, fontSize: '0.8125rem', fontWeight: 800, color: '#0F172A' }}>{adminName}</p>
                    <p style={{ margin: 0, fontSize: '0.625rem', color: '#4169E1', fontWeight: 800, letterSpacing: '0.05em' }}>{adminId}</p>
                </div>
                <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '0.625rem', color: '#94A3B8', transition: 'transform 0.3s', transform: showProfileMenu ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </div>

            {showProfileMenu && (
                <div className="animate-fade-in" style={{ position: 'absolute', top: '120%', right: 0, width: '220px', background: 'white', borderRadius: '16px', boxShadow: 'var(--shadow-lg)', zIndex: 1000, border: '1px solid #E2E8F0', padding: '0.5rem', overflow: 'hidden' }}>
                    <button onClick={() => { setShowProfileModal(true); setShowProfileMenu(false); }} className="sidebar__link" style={{ width: '100%', color: '#475569', border: 'none', background: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                        <FontAwesomeIcon icon={faUserShield} style={{ width: '16px' }} />
                        <span>Security Profile</span>
                    </button>
                    <div style={{ margin: '0.5rem', borderTop: '1px solid #F1F5F9' }}></div>
                    <button onClick={handleLogout} className="sidebar__link" style={{ width: '100%', color: '#EF4444', border: 'none', background: 'none', justifyContent: 'flex-start', padding: '0.75rem 1rem' }}>
                        <FontAwesomeIcon icon={faSignOutAlt} style={{ width: '16px' }} />
                        <span>Sign Out System</span>
                    </button>
                </div>
            )}
        </div>
      </div>

      {/* ADMIN PROFILE MODAL */}
      {showProfileModal && (
          <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000, backdropFilter: 'blur(8px)' }}>
              <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '420px', padding: 0, borderRadius: '24px', overflow: 'hidden', border: 'none' }}>
                  <div style={{ background: '#0F172A', padding: '2.5rem 1.5rem', textAlign: 'center', color: 'white' }}>
                      <button onClick={() => setShowProfileModal(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', width: '32px', height: '32px', borderRadius: '50%' }}><FontAwesomeIcon icon={faTimes} /></button>
                      <div style={{ width: '70px', height: '70px', borderRadius: '20px', background: 'linear-gradient(135deg, #4169E1 0%, #3154B3 100%)', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 900 }}>SA</div>
                      <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{adminName}</h3>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#4169E1', fontWeight: 800, letterSpacing: '0.1em' }}>{adminId}</p>
                  </div>
                  <div style={{ padding: '1.5rem' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Current Terminal Status</span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <div className="status-pulse" style={{ width: '8px', height: '8px', background: '#10B981', borderRadius: '50%' }}></div>
                                  <span style={{ fontWeight: 800, fontSize: '0.875rem', color: '#0F172A' }}>Active Authorization</span>
                              </div>
                          </div>
                          <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                              <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px', textTransform: 'uppercase' }}>Security Level</span>
                              <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                                  <span className="tag" style={{ background: '#4169E1', color: 'white', fontWeight: 800, fontSize: '0.6rem' }}>LEVEL 4 ACCESS</span>
                                  <span className="tag" style={{ background: '#0F172A', color: 'white', fontWeight: 800, fontSize: '0.6rem' }}>ROOT ADMIN</span>
                              </div>
                          </div>
                          <button className="button button--primary" style={{ width: '100%', padding: '0.875rem', borderRadius: '12px' }}>
                              <FontAwesomeIcon icon={faUserEdit} /> UPDATE IDENTITY KEY
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </nav>
  );
}

export default TopNavbar;
