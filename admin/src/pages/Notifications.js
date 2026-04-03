import React, { useState, useEffect } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faBell, 
  faCircleExclamation, 
  faCalendarAlt, 
  faUserPlus, 
  faClipboardCheck,
  faSearch,
  faSync,
  faClock,
  faChevronRight,
  faTimes,
  faMapMarkerAlt,
  faUser,
  faCircle
} from "@fortawesome/free-solid-svg-icons";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterRole] = useState("All");
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    // Load read status
    const savedReadIds = JSON.parse(localStorage.getItem("readNotificationIds") || "[]");
    setReadIds(savedReadIds);

    fetchAllNotifications();
  }, []);

  const fetchAllNotifications = async () => {
    setLoading(true);
    try {
      const apiBase = "http://localhost:5000/api";
      const [annRes, evtRes, resRes, recRes] = await Promise.all([
        axios.get(`${apiBase}/announcements`),
        axios.get(`${apiBase}/events`),
        axios.get(`${apiBase}/residents`),
        axios.get(`${apiBase}/records`)
      ]);

      const alerts = annRes.data.map(a => ({
          id: `ann-${a._id}`,
          title: a.priority === 'High' ? "Urgent System Alert" : "System Announcement",
          message: a.title,
          description: a.content,
          date: new Date(a.createdAt).toLocaleDateString(),
          fullDate: new Date(a.createdAt).toLocaleString(),
          time: new Date(a.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'alert',
          ts: new Date(a.createdAt),
          author: a.author,
          priority: a.priority
      }));

      const events = evtRes.data.map(e => ({
          id: `evt-${e._id}`,
          title: "Scheduled Community Event",
          message: e.title,
          description: e.description || "Community health program scheduled.",
          date: new Date(e.date).toLocaleDateString(),
          fullDate: new Date(e.date).toLocaleDateString(),
          time: e.startTime || "All Day",
          type: 'event',
          ts: new Date(e.date),
          location: e.location
      }));

      const residents = resRes.data.map(r => ({
          id: `res-${r._id}`,
          title: "Resident Registration",
          message: `${r.fullName} joined the platform`,
          description: `A new resident from Purok ${r.purok} has successfully registered. Household No: ${r.householdNo}. Email: ${r.email}`,
          date: new Date(r.createdAt).toLocaleDateString(),
          fullDate: new Date(r.createdAt).toLocaleString(),
          time: new Date(r.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'resident',
          ts: new Date(r.createdAt),
          purok: r.purok
      }));

      const records = recRes.data.map(r => ({
          id: `rec-${r._id}`,
          title: "Clinical Record Logged",
          message: `Checkup completed for ${r.patient?.name || 'Patient'}`,
          description: `Diagnosis: ${r.diagnosis}. Treatment: ${r.treatment || 'Standard care'}. Attending: ${r.physician || 'Health Staff'}.`,
          date: new Date(r.createdAt || r.date).toLocaleDateString(),
          fullDate: new Date(r.createdAt || r.date).toLocaleString(),
          time: new Date(r.createdAt || r.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'record',
          ts: new Date(r.createdAt || r.date)
      }));

      const all = [...alerts, ...events, ...residents, ...records]
        .sort((a, b) => b.ts - a.ts);

      setNotifications(all);
    } catch (err) {
      console.error("Error fetching all notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      const newReadIds = [...readIds, id];
      setReadIds(newReadIds);
      localStorage.setItem("readNotificationIds", JSON.stringify(newReadIds));
    }
  };

  const handleNotifClick = (notif) => {
    markAsRead(notif.id);
    setSelectedNotif(notif);
    setIsModalOpen(true);
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

  const filtered = notifications.filter(n => {
    const matchesSearch = n.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         n.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "All" || n.type === filterType;
    return matchesSearch && matchesFilter;
  });

  return (
    <Layout 
      title="Notification Center" 
      subtitle="Complete history of system alerts and activities"
      actions={
        <button className="icon-button" onClick={fetchAllNotifications} style={{ background: 'white', border: '1px solid #E2E8F0' }}>
          <FontAwesomeIcon icon={faSync} spin={loading} />
        </button>
      }
    >
      <section className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3.25rem', borderRadius: '14px', border: 'none', background: '#F8FAFC', outline: 'none', fontSize: '0.9375rem', fontWeight: 600 }} 
              placeholder="Search notifications..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['All', 'alert', 'event', 'resident', 'record'].map(type => (
               <button 
                key={type} 
                onClick={() => setFilterRole(type)}
                className={`button ${filterType === type ? 'button--primary' : 'button--secondary'}`} 
                style={{ height: '44px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 800, textTransform: 'capitalize' }}
               >
                {type === 'alert' ? 'Alerts' : type === 'event' ? 'Events' : type === 'resident' ? 'Users' : type === 'record' ? 'Records' : 'All'}
               </button>
            ))}
          </div>
        </div>
      </section>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <FontAwesomeIcon icon={faSync} spin size="3x" style={{ color: '#E2E8F0' }} />
        </div>
      ) : (
        <div style={{ background: 'white', borderRadius: '24px', border: '1px solid #E2E8F0', overflow: 'hidden', marginBottom: '3rem' }}>
          {filtered.length > 0 ? filtered.map((n, idx) => {
            const colors = getNotifColors(n.type);
            const isRead = readIds.includes(n.id);
            return (
              <div 
                key={n.id} 
                onClick={() => handleNotifClick(n)}
                className="interactive-item"
                style={{ 
                  padding: '1.5rem 2rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '2rem',
                  borderBottom: idx === filtered.length - 1 ? 'none' : '1px solid #F1F5F9',
                  cursor: 'pointer',
                  background: isRead ? 'transparent' : 'rgba(65, 105, 225, 0.06)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ 
                  width: '54px', height: '54px', borderRadius: '16px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem',
                  background: colors.bg, color: colors.text, position: 'relative'
                }}>
                  <FontAwesomeIcon icon={getNotifIcon(n.type)} />
                  {!isRead && (
                    <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '12px', height: '12px', background: '#4169E1', borderRadius: '50%', border: '2px solid white' }}></span>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', fontWeight: isRead ? 700 : 900, color: isRead ? '#475569' : '#0F172A' }}>{n.title}</h4>
                    {!isRead && <span style={{ background: '#4169E1', color: 'white', fontSize: '0.6rem', fontWeight: 900, padding: '2px 6px', borderRadius: '6px' }}>NEW</span>}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: isRead ? '#94A3B8' : '#64748B', fontWeight: isRead ? 500 : 600 }}>{n.message}</p>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span style={{ display: 'block', fontSize: '0.85rem', fontWeight: 800, color: isRead ? '#94A3B8' : '#1E293B' }}>{n.date}</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94A3B8' }}>{n.time}</span>
                </div>
                <FontAwesomeIcon icon={faChevronRight} style={{ color: isRead ? '#E2E8F0' : '#4169E1', fontSize: '0.9rem' }} />
              </div>
            );
          }) : (
            <div style={{ padding: '5rem 1rem', textAlign: 'center' }}>
              <FontAwesomeIcon icon={faBell} size="3x" style={{ color: '#F1F5F9', marginBottom: '1rem' }} />
              <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#94A3B8' }}>No notifications found</p>
              <p style={{ margin: '4px 0 0', color: '#CBD5E1', fontWeight: 600 }}>Try adjusting your search or filters</p>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {isModalOpen && selectedNotif && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div className="report-card animate-scale-in" style={{ width: '100%', maxWidth: '550px', padding: '0', borderRadius: '28px', overflow: 'hidden', background: 'white' }}>
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
              <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'white', border: 'none', color: '#64748B', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}><FontAwesomeIcon icon={faTimes} /></button>
              
              <div style={{ 
                width: '80px', height: '80px', borderRadius: '28px', background: 'white', 
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
                marginBottom: '1.25rem', boxShadow: '0 10px 20px rgba(0,0,0,0.06)'
              }}>
                <FontAwesomeIcon icon={getNotifIcon(selectedNotif.type)} />
              </div>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{selectedNotif.title}</h2>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, marginTop: '6px', opacity: 0.8 }}>{selectedNotif.fullDate}</span>
            </div>
            
            <div style={{ padding: '2.5rem' }}>
              <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '10px', letterSpacing: '0.05em' }}>DETAILED INFORMATION</label>
                <p style={{ margin: 0, fontSize: '1.1rem', color: '#1E293B', fontWeight: 600, lineHeight: 1.7 }}>{selectedNotif.description || selectedNotif.message}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', background: '#F8FAFC', padding: '1.5rem', borderRadius: '20px', border: '1px solid #F1F5F9' }}>
                <div>
                  <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>TIME LOGGED</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>
                    <FontAwesomeIcon icon={faClock} style={{ color: '#CBD5E1' }} /> {selectedNotif.time}
                  </div>
                </div>
                
                {selectedNotif.location && (
                  <div>
                    <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>LOCATION</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#CBD5E1' }} /> {selectedNotif.location}
                    </div>
                  </div>
                )}

                {selectedNotif.author && (
                  <div>
                    <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>ISSUED BY</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>
                      <FontAwesomeIcon icon={faUser} style={{ color: '#CBD5E1' }} /> {selectedNotif.author}
                    </div>
                  </div>
                )}

                {selectedNotif.purok && (
                  <div>
                    <label style={{ fontSize: '0.6rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>PUROK AREA</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569', fontWeight: 700, fontSize: '0.9rem' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#CBD5E1' }} /> Purok {selectedNotif.purok}
                    </div>
                  </div>
                )}
              </div>

              <button 
                onClick={() => setIsModalOpen(false)}
                style={{ 
                  width: '100%', padding: '1.25rem', borderRadius: '18px', border: 'none',
                  background: '#1E293B', color: 'white', fontWeight: 800, cursor: 'pointer',
                  marginTop: '2rem', transition: 'all 0.2s', boxShadow: '0 4px 12px rgba(30,41,59,0.2)'
                }}
              >
                Close Notification
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
