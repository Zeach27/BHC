import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faMapMarkerAlt, 
  faShieldAlt, 
  faKey, 
  faCamera,
  faCheckCircle,
  faHistory,
  faChartLine,
  faDesktop,
  faLock,
  faGlobe,
  faFingerprint,
  faCircleCheck,
  faCircleInfo,
  faSync
} from "@fortawesome/free-solid-svg-icons";

function Profile() {
  const [adminName, setAdminName] = useState(localStorage.getItem("adminName") || "Super Administrator");
  const [adminId, setAdminId] = useState(localStorage.getItem("adminId") || "BHW-SYSTEM-SA");
  const [email, setEmail] = useState("admin@chesms.gov.ph");
  const [phone, setPhone] = useState("+63 912 345 6789");
  const [office, setOffice] = useState("Main Health Center - Terminal 1");
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [profileImage, setProfileImage] = useState(localStorage.getItem("profileImage") || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = React.useRef(null);
  const [userId, setUserId] = useState(localStorage.getItem("userId") || "");

  useEffect(() => {
    const resolveUserId = async () => {
      const savedId = localStorage.getItem("userId") || "";
      const objectIdRegex = /^[a-f\d]{24}$/i;

      if (objectIdRegex.test(savedId)) {
        setUserId(savedId);
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/users");
        if (!response.ok) return;

        const users = await response.json();
        const preferredUser =
          users.find((u) => u?.role === "Admin") ||
          users.find((u) => (u?.username || "").toLowerCase() === "admin") ||
          users[0];

        if (preferredUser?._id) {
          setUserId(preferredUser._id);
          localStorage.setItem("userId", preferredUser._id);
          if (preferredUser.profileImage) {
            setProfileImage(preferredUser.profileImage);
            localStorage.setItem("profileImage", preferredUser.profileImage);
          }
        }
      } catch (error) {
        console.error("Failed to resolve user id:", error);
      }
    };

    resolveUserId();
  }, []);

  const handleUpdate = (e) => {
    e.preventDefault();
    localStorage.setItem("adminName", adminName);
    localStorage.setItem("adminId", adminId);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!userId) {
      setUploadError("No valid account found. Please refresh and login again.");
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append("profileImage", file);

    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}/upload-profile-image`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.profileImage);
      localStorage.setItem("profileImage", data.profileImage);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError(error.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <Layout 
      title="Admin Profile" 
      subtitle="Account settings and security"
    >
      <style>{`
        .profile-wrapper { display: flex; flex-direction: column; gap: 1.25rem; max-width: 1100px; margin: 0 auto; }
        
        .profile-compact-header { 
          background: white; 
          border-radius: 20px; 
          padding: 1.5rem 2rem; 
          display: flex; 
          align-items: center; 
          gap: 2rem;
          border: 1px solid #E2E8F0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }

        .avatar-box { position: relative; flex-shrink: 0; }
        .avatar-md { 
          width: 80px; height: 80px; border-radius: 20px; 
          background: #F1F5F9; color: #4169E1; 
          display: flex; align-items: center; justify-content: center; 
          font-size: 2rem; font-weight: 900; 
          border: 2px solid #E2E8F0;
        }
        
        .avatar-edit-sm {
          position: absolute; bottom: -4px; right: -4px; width: 28px; height: 28px;
          border-radius: 8px; background: #4169E1; color: white; border: 2px solid white;
          cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 0.75rem;
        }

        .profile-layout-grid { display: grid; grid-template-columns: 240px 1fr; gap: 1.25rem; }
        
        .profile-nav-stack { display: flex; flex-direction: column; gap: 4px; background: white; padding: 0.75rem; border-radius: 20px; border: 1px solid #E2E8F0; align-self: start; }
        .nav-btn-compact { 
          display: flex; align-items: center; gap: 10px; padding: 0.75rem 1rem; 
          border-radius: 12px; border: none; background: transparent; color: #64748B; 
          font-weight: 700; font-size: 0.85rem; cursor: pointer; transition: 0.2s;
          text-align: left;
        }
        .nav-btn-compact.active { background: #F1F5F9; color: #0F172A; }
        .nav-btn-compact:hover:not(.active) { background: #F8FAFC; color: #4169E1; }

        .profile-main-card { background: white; border-radius: 20px; border: 1px solid #E2E8F0; padding: 1.75rem; min-height: 400px; }
        
        .prog-bar-sm { height: 6px; background: #F1F5F9; border-radius: 3px; overflow: hidden; margin-top: 0.5rem; width: 200px; }
        .prog-fill-sm { height: 100%; background: #4169E1; width: 85%; }

        .compact-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .field-group { display: flex; flex-direction: column; gap: 0.4rem; }
        .field-label { font-size: 0.65rem; font-weight: 800; color: #94A3B8; text-transform: uppercase; letter-spacing: 0.5px; }
        .field-input-box { position: relative; }
        .field-icon-sm { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: #CBD5E1; font-size: 0.85rem; }
        .field-input-compact { 
          width: 100%; padding: 0.65rem 1rem 0.65rem 2.5rem; border-radius: 10px; 
          border: 1px solid #E2E8F0; background: white; font-size: 0.875rem; 
          font-weight: 600; color: #1E293B; transition: 0.2s; 
        }
        .field-input-compact:focus { border-color: #4169E1; outline: none; box-shadow: 0 0 0 3px rgba(65, 105, 225, 0.05); }

        .activity-row-compact { display: flex; gap: 1rem; padding: 0.75rem; border-radius: 12px; border-bottom: 1px solid #F1F5F9; align-items: center; }
        .activity-row-compact:last-child { border-bottom: none; }
        
        .stat-badge-compact { padding: 1rem; border-radius: 16px; background: #F8FAFC; border: 1px solid #F1F5F9; display: flex; flex-direction: column; gap: 4px; }

        @media (max-width: 1024px) {
          .profile-layout-grid { grid-template-columns: 1fr; }
          .profile-nav-stack { flex-direction: row; overflow-x: auto; white-space: nowrap; }
          .profile-compact-header { flex-direction: column; text-align: center; gap: 1rem; }
          .prog-bar-sm { margin: 0.5rem auto 0; }
        }

        @media (max-width: 640px) {
          .compact-form-grid { grid-template-columns: 1fr; }
          .profile-compact-header { padding: 1.5rem; }
          .profile-main-card { padding: 1.25rem; }
        }
      `}</style>

      <div className="animate-fade-in profile-wrapper">
        
        {/* SUCCESS/ERROR MESSAGES */}
        {showSuccess && (
          <div style={{
            background: '#D1FAE5',
            border: '1px solid #6EE7B7',
            color: '#065F46',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Profile updated successfully!</span>
          </div>
        )}
        
        {uploadError && (
          <div style={{
            background: '#FEE2E2',
            border: '1px solid #FECACA',
            color: '#991B1B',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <FontAwesomeIcon icon={faCircleInfo} />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{uploadError}</span>
          </div>
        )}
        
        {isUploading && (
          <div style={{
            background: '#DBEAFE',
            border: '1px solid #93C5FD',
            color: '#1E40AF',
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            animation: 'fadeIn 0.3s ease'
          }}>
            <FontAwesomeIcon icon={faSync} spin />
            <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Uploading image...</span>
          </div>
        )}
        
        {/* COMPACT HEADER */}
        <header className="profile-compact-header">
          <div className="avatar-box">
            <div 
              className="avatar-md" 
              style={{
                backgroundImage: profileImage ? `url(${profileImage})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                color: profileImage ? 'transparent' : '#4169E1'
              }}
            >
              {!profileImage && adminName.substring(0, 2).toUpperCase()}
            </div>
            <button 
              type="button"
              className="avatar-edit-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              style={{ opacity: isUploading ? 0.6 : 1, cursor: isUploading ? 'not-allowed' : 'pointer' }}
            >
              <FontAwesomeIcon icon={faCamera} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageUpload}
              disabled={isUploading}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>{adminName}</h2>
              <span style={{ color: '#4169E1', fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', background: '#EEF2FF', padding: '2px 8px', borderRadius: '6px' }}>Super Admin</span>
            </div>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748B', fontWeight: 600 }}>ID: {adminId} • Primary Access</p>
            <div className="prog-bar-sm"><div className="prog-fill-sm"></div></div>
          </div>
          <div className="hide-mobile">
             <button className="button button--secondary" onClick={() => window.location.reload()} style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}>
                <FontAwesomeIcon icon={faSync} /> Refresh
             </button>
          </div>
        </header>

        <div className="profile-layout-grid">
          
          {/* COMPACT SIDEBAR */}
          <nav className="profile-nav-stack">
            <button className={`nav-btn-compact ${activeTab === 'overview' ? 'active' : ''}`} onClick={() => setActiveTab('overview')}>
              <FontAwesomeIcon icon={faDesktop} /> Overview
            </button>
            <button className={`nav-btn-compact ${activeTab === 'account' ? 'active' : ''}`} onClick={() => setActiveTab('account')}>
              <FontAwesomeIcon icon={faUser} /> Account Info
            </button>
            <button className={`nav-btn-compact ${activeTab === 'security' ? 'active' : ''}`} onClick={() => setActiveTab('security')}>
              <FontAwesomeIcon icon={faLock} /> Security
            </button>
          </nav>

          {/* MAIN CONTENT AREA */}
          <main className="profile-main-card">
            
            {activeTab === 'overview' && (
              <div className="animate-fade-in">
                <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', fontWeight: 800 }}>System Usage Metrics</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                    <div className="stat-badge-compact">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>DATA HANDLED</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#4169E1' }}>1,284</div>
                    </div>
                    <div className="stat-badge-compact">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>SYSTEM UPTIME</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#10B981' }}>99.9%</div>
                    </div>
                    <div className="stat-badge-compact">
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>LAST LOGIN</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#F59E0B' }}>Today</div>
                    </div>
                </div>

                <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Recent Activity Log</h4>
                <div style={{ background: '#F8FAFC', borderRadius: '16px', overflow: 'hidden' }}>
                    {[
                        { action: "Security Audit", time: "10m ago" },
                        { action: "Database Sync", time: "1h ago" },
                        { action: "Health Report Export", time: "Yesterday" }
                    ].map((log, i) => (
                        <div key={i} className="activity-row-compact">
                            <FontAwesomeIcon icon={faCheckCircle} color="#10B981" style={{ fontSize: '0.8rem' }} />
                            <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#1E293B', flex: 1 }}>{log.action}</span>
                            <span style={{ fontSize: '0.7rem', color: '#94A3B8', fontWeight: 700 }}>{log.time.toUpperCase()}</span>
                        </div>
                    ))}
                </div>
              </div>
            )}

            {activeTab === 'account' && (
              <form onSubmit={handleUpdate} className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800 }}>General Information</h4>
                    <button type="submit" className="button button--primary" style={{ padding: '0.5rem 1.25rem', fontSize: '0.8rem' }}>Save Changes</button>
                </div>

                <div className="compact-form-grid">
                    <div className="field-group">
                        <label className="field-label">Full Name</label>
                        <div className="field-input-box">
                            <FontAwesomeIcon icon={faUser} className="field-icon-sm" />
                            <input className="field-input-compact" value={adminName} onChange={(e) => setAdminName(e.target.value)} />
                        </div>
                    </div>
                    <div className="field-group">
                        <label className="field-label">Admin ID</label>
                        <div className="field-input-box">
                            <FontAwesomeIcon icon={faShieldAlt} className="field-icon-sm" />
                            <input className="field-input-compact" value={adminId} onChange={(e) => setAdminId(e.target.value)} />
                        </div>
                    </div>
                </div>

                <div className="field-group">
                    <label className="field-label">Email</label>
                    <div className="field-input-box">
                        <FontAwesomeIcon icon={faEnvelope} className="field-icon-sm" />
                        <input className="field-input-compact" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                </div>

                <div className="compact-form-grid">
                    <div className="field-group">
                        <label className="field-label">Phone</label>
                        <div className="field-input-box">
                            <FontAwesomeIcon icon={faPhone} className="field-icon-sm" />
                            <input className="field-input-compact" value={phone} onChange={(e) => setPhone(e.target.value)} />
                        </div>
                    </div>
                    <div className="field-group">
                        <label className="field-label">Office</label>
                        <div className="field-input-box">
                            <FontAwesomeIcon icon={faMapMarkerAlt} className="field-icon-sm" />
                            <input className="field-input-compact" value={office} onChange={(e) => setOffice(e.target.value)} />
                        </div>
                    </div>
                </div>
              </form>
            )}

            {activeTab === 'security' && (
              <div className="animate-fade-in">
                <h4 style={{ margin: '0 0 1.25rem 0', fontSize: '0.9rem', fontWeight: 800 }}>Account Protection</h4>
                
                <div style={{ padding: '1.25rem', background: '#F8FAFC', borderRadius: '16px', border: '1px solid #F1F5F9', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <FontAwesomeIcon icon={faFingerprint} color="#4169E1" size="lg" />
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800 }}>2FA Authentication</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>Currently enabled for this account</div>
                    </div>
                    <button className="button button--secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>Configure</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <button className="button button--secondary" style={{ justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faKey} color="#4169E1" />
                            <span>Update Password</span>
                        </div>
                        <FontAwesomeIcon icon={faHistory} style={{ opacity: 0.2 }} />
                    </button>
                    <button className="button button--secondary" style={{ justifyContent: 'space-between', padding: '1rem', borderRadius: '12px', fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                            <FontAwesomeIcon icon={faDesktop} color="#10B981" />
                            <span>Active Sessions</span>
                        </div>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#10B981' }}>1 ONLINE</span>
                    </button>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </Layout>
  );
}

export default Profile;
