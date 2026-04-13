import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faTrash, faSync, faCircle,
  faMobileAlt, faBan, faCheckCircle, faStethoscope,
  faDownload, faFilter, faUser, faBirthdayCake, 
  faVenusMars, faIdCard, faMapMarkerAlt, faPhoneAlt,
  faHeartbeat, faSyringe, faShieldAlt
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/users";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      // Filter to show only app-registered users (those with civilStatus field)
      const appUsers = res.data.filter(user => user.civilStatus || user.barangay);
      setResidents(appUsers);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`${API_URL}/${id}`, { status: newStatus });
      fetchResidents();
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this digital account?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchResidents();
      } catch (err) { console.error(err); }
    }
  };

  const filtered = residents.filter(r => {
    const searchStr = (r.name + (r.username || "") + (r.email || "")).toLowerCase();
    const matchesSearch = searchStr.includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const headerActions = (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button className="button button--secondary" onClick={fetchResidents} disabled={loading}>
        <FontAwesomeIcon icon={faSync} spin={loading} />
        Sync Accounts
      </button>
      <button className="button button--secondary">
        <FontAwesomeIcon icon={faDownload} />
        Export CSV
      </button>
    </div>
  );

  return (
    <Layout 
      title="App Registrations" 
      subtitle={`Manage ${residents.length} community patient accounts`}
      actions={headerActions}
    >
      <section style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <div className="report-card" style={{ padding: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.875rem', backgroundColor: '#F8FAFC' }}
              placeholder="Search by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
          </div>
        </div>
      </section>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', 
        gap: '1.5rem',
        paddingBottom: '2rem'
      }} className="animate-fade-in">
        {filtered.length > 0 ? filtered.map((r) => (
          <div key={r._id} className="report-card hover-reveal" style={{ 
            padding: '0', 
            borderRadius: '24px', 
            overflow: 'hidden',
            border: '1px solid #E2E8F0',
            transition: 'all 0.3s ease'
          }}>
            {/* Header / Status Banner */}
            <div style={{ 
              height: '80px', 
              background: 'linear-gradient(135deg, #4169E1, #1E40AF)',
              position: 'relative',
              padding: '1rem 1.5rem'
            }}>
              <span style={{ 
                background: 'rgba(255,255,255,0.2)', 
                color: 'white', 
                padding: '4px 12px', 
                borderRadius: '99px', 
                fontSize: '0.65rem', 
                fontWeight: 800,
                backdropFilter: 'blur(4px)'
              }}>
                {r.status || 'App Registered'}
              </span>
              <div style={{ position: 'absolute', right: '1.5rem', bottom: '-20px' }}>
                <div style={{ 
                  width: '64px', 
                  height: '64px', 
                  borderRadius: '18px', 
                  background: 'white', 
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                  padding: '4px'
                }}>
                  {r.profileImage ? (
                    <img src={r.profileImage} alt={r.name} style={{ width: '100%', height: '100%', borderRadius: '14px', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ 
                      width: '100%', height: '100%', borderRadius: '14px', 
                      background: '#F1F5F9', color: '#4169E1', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '1.5rem', fontWeight: 800
                    }}>
                      {r.name ? r.name.charAt(0) : 'U'}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '2rem 1.5rem 1.5rem' }}>
              <div style={{ marginBottom: '1.25rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>{r.name || 'N/A'}</h3>
                <p style={{ margin: 0, fontSize: '0.8125rem', color: '#4169E1', fontWeight: 800 }}>{r.email || 'N/A'}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#94A3B8', width: '16px' }}><FontAwesomeIcon icon={faPhoneAlt} /></div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Phone Number</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>{r.phone || 'N/A'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#94A3B8', width: '16px' }}><FontAwesomeIcon icon={faBirthdayCake} /></div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Birthdate</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>
                      {r.birthdate ? new Date(r.birthdate).toLocaleDateString() : 'N/A'}
                    </span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#94A3B8', width: '16px' }}><FontAwesomeIcon icon={faVenusMars} /></div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Gender</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>{r.gender || 'Not set'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ color: '#94A3B8', width: '16px' }}><FontAwesomeIcon icon={faMapMarkerAlt} /></div>
                  <div>
                    <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Address</span>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>{r.barangay || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Health Info Badges */}
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ 
                  background: '#F1F5F9', padding: '6px 12px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#475569'
                }}>
                  <FontAwesomeIcon icon={faHeartbeat} style={{ color: '#EF4444' }} /> {r.bloodType || 'B.Type: --'}
                </div>
                <div style={{ 
                  background: '#F1F5F9', padding: '6px 12px', borderRadius: '10px', 
                  display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', fontWeight: 800, color: '#475569'
                }}>
                  <FontAwesomeIcon icon={faSyringe} style={{ color: '#8B5CF6' }} /> {r.vaccinationStatus || 'Unvaccinated'}
                </div>
              </div>

              <div style={{ 
                borderTop: '1px solid #F1F5F9', 
                paddingTop: '1rem', 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button className="icon-button" title="Sync Health Records" style={{ background: '#E8EFFF', color: '#4169E1' }}>
                    <FontAwesomeIcon icon={faSync} size="sm" />
                  </button>
                  <button className="icon-button" title="Medical History" style={{ background: '#F1F5F9' }}>
                    <FontAwesomeIcon icon={faStethoscope} size="sm" />
                  </button>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                   {r.status !== 'Suspended' ? (
                      <button className="button button--secondary" onClick={() => updateStatus(r._id, 'Suspended')} style={{ height: '32px', fontSize: '0.7rem', color: '#EF4444' }}>
                        <FontAwesomeIcon icon={faBan} /> Suspend
                      </button>
                    ) : (
                      <button className="button button--secondary" onClick={() => updateStatus(r._id, 'Active')} style={{ height: '32px', fontSize: '0.7rem', color: '#10B981' }}>
                        <FontAwesomeIcon icon={faCheckCircle} /> Activate
                      </button>
                    )}
                    <button className="icon-button" onClick={() => handleDelete(r._id)} style={{ background: '#FEF2F2', color: '#EF4444' }}>
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ color: '#94A3B8' }}>
              <FontAwesomeIcon icon={faMobileAlt} size="3x" style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
              <p style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', margin: '0 0 4px 0' }}>No app registrations found</p>
              <p style={{ fontSize: '0.875rem' }}>Registered accounts will appear here</p>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
