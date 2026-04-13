import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserTie, faPlus, faEdit, faTrash, faSearch, faTimes, 
  faUserShield, faUserMd, faPhone, faEnvelope, faSync,
  faCalendarAlt, faIdBadge, faVenusMars, faMapMarkerAlt,
  faStethoscope, faCircle, faClock, faBriefcase
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/users";

export default function Staff() {
  const [users, setUsers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterRole, setFilterRole] = useState("All");

  const [formData, setFormData] = useState({
    name: "", 
    username: "", 
    password: "", 
    role: "Employee", 
    phone: "", 
    email: "",
    staffId: `STF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
    birthdate: "",
    gender: "Male",
    address: "",
    specialization: "",
    assignedPurok: "",
    shift: "Full Time",
    status: "Active"
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching staff:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setCurrentId(user._id);
    setIsEditing(true);
    setFormData({
      name: user.name,
      username: user.username,
      password: "",
      role: user.role,
      phone: user.phone || "",
      email: user.email || "",
      staffId: user.staffId || `STF-${new Date().getFullYear()}-000`,
      birthdate: user.birthdate ? new Date(user.birthdate).toISOString().split('T')[0] : "",
      gender: user.gender || "Male",
      address: user.address || "",
      specialization: user.specialization || "",
      assignedPurok: user.assignedPurok || "",
      shift: user.shift || "Full Time",
      status: user.status || "Active"
    });
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "", 
      username: "", 
      password: "", 
      role: "Employee", 
      phone: "", 
      email: "",
      staffId: `STF-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      birthdate: "",
      gender: "Male",
      address: "",
      specialization: "",
      assignedPurok: "",
      shift: "Full Time",
      status: "Active"
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      fetchUsers();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Error saving staff:", err);
      alert(err.response?.data?.message || "Error saving staff");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this staff member?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchUsers();
      } catch (err) {
        console.error("Error deleting staff:", err);
      }
    }
  };

  const getRoleIcon = (role) => {
    switch(role) {
      case 'Admin': return faUserShield;
      case 'Midwife': return faUserMd;
      default: return faUserTie;
    }
  };

  const staffUsers = users.filter(u => ['Admin', 'Midwife', 'Employee'].includes(u.role) && !u.barangay && !u.civilStatus);

  const filtered = staffUsers.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.staffId && u.staffId.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRole = filterRole === "All" || u.role === filterRole;
    
    return matchesSearch && matchesRole;
  });

  return (
    <Layout 
      title="Staff & Medical Personnel" 
      subtitle={`Overseeing ${staffUsers.length} health center employees and practitioners`}
      actions={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="icon-button" onClick={fetchUsers} title="Refresh List" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
            <FontAwesomeIcon icon={faSync} spin={loading} />
          </button>
          <button className="button button--primary" onClick={() => { resetForm(); setIsModalOpen(true); }} style={{ borderRadius: '12px' }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Register Personnel
          </button>
        </div>
      }
    >
      {/* SEARCH & FILTERS */}
      <section className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', background: 'white', padding: '12px', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
              style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3.25rem', borderRadius: '14px', border: 'none', background: '#F8FAFC', outline: 'none', fontSize: '0.9375rem', fontWeight: 600 }} 
              placeholder="Search by name, ID, or clinical role..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hide-on-mobile" style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Admin', 'Midwife', 'Employee'].map(filter => (
               <button 
                key={filter} 
                onClick={() => setFilterRole(filter)}
                className={`button ${filterRole === filter ? 'button--primary' : 'button--secondary'}`} 
                style={{ height: '44px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}
               >
                {filter}
               </button>
            ))}
          </div>
        </div>
      </section>

      {/* STAFF CARDS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <FontAwesomeIcon icon={faSync} spin size="3x" style={{ color: '#E2E8F0' }} />
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem', paddingBottom: '3rem' }}>
          {filtered.map(user => (
            <div key={user._id} className="report-card animate-fade-in hover-reveal" style={{ 
              padding: '0', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', overflow: 'hidden'
            }}>
              {/* Card Header Status */}
              <div style={{ height: '6px', background: user.status === 'Active' ? '#10B981' : (user.status === 'On Leave' ? '#F59E0B' : '#64748B') }}></div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem' }}>
                  <div style={{ 
                    width: '64px', height: '64px', borderRadius: '18px', 
                    background: user.role === 'Admin' ? '#FEF2F2' : (user.role === 'Midwife' ? '#F5F3FF' : '#EFF6FF'), 
                    color: user.role === 'Admin' ? '#EF4444' : (user.role === 'Midwife' ? '#8B5CF6' : '#3B82F6'), 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
                  }}>
                    <FontAwesomeIcon icon={getRoleIcon(user.role)} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: '0 0 2px 0', fontSize: '1.125rem', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user.name}</h3>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => handleEdit(user)} className="icon-button" style={{ width: '30px', height: '30px', background: '#F1F5F9', color: '#4169E1' }}><FontAwesomeIcon icon={faEdit} size="xs" /></button>
                        <button onClick={() => handleDelete(user._id)} className="icon-button" style={{ width: '30px', height: '30px', background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} size="xs" /></button>
                      </div>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#4169E1' }}>{user.staffId || 'ID PENDING'}</p>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                      <FontAwesomeIcon icon={faCircle} style={{ fontSize: '0.4rem', color: user.status === 'Active' ? '#10B981' : '#F59E0B' }} />
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>{user.status || 'Active'}</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><FontAwesomeIcon icon={faStethoscope} size="xs" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>SPECIALTY</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{user.specialization || 'General'}</span>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><FontAwesomeIcon icon={faMapMarkerAlt} size="xs" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>ASSIGNMENT</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{user.assignedPurok || 'Full Station'}</span>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><FontAwesomeIcon icon={faClock} size="xs" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>SHIFT</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{user.shift || 'Full Time'}</span>
                      </div>
                   </div>
                   <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}><FontAwesomeIcon icon={faVenusMars} size="xs" /></div>
                      <div>
                        <span style={{ display: 'block', fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8' }}>GENDER</span>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569' }}>{user.gender || 'Not Set'}</span>
                      </div>
                   </div>
                </div>

                <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    <FontAwesomeIcon icon={faPhone} style={{ width: '14px', color: '#4169E1' }} /> {user.phone || 'No Phone Registered'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    <FontAwesomeIcon icon={faEnvelope} style={{ width: '14px', color: '#4169E1' }} /> {user.email || 'No Email Registered'}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                    <FontAwesomeIcon icon={faCalendarAlt} style={{ width: '14px', color: '#4169E1' }} /> Joined {new Date(user.hiredDate || user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MODAL - ENHANCED PERSONNEL REGISTRATION */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
          <div className="report-card animate-scale-in" style={{ width: '100%', maxWidth: '650px', padding: '0', borderRadius: '28px', overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ background: 'linear-gradient(135deg, #4169E1, #1E40AF)', padding: '2rem', color: 'white', position: 'relative' }}>
               <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{isEditing ? 'Update Personnel File' : 'Register New Personnel'}</h2>
               <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>Fill in the professional details for this staff member</p>
               <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            
            <form onSubmit={handleSubmit} style={{ padding: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>LEGAL FULL NAME</label>
                <input required value={formData.name} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Maria Clara De la Cruz" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>STAFF ID NUMBER</label>
                <input readOnly value={formData.staffId} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none', fontWeight: 700, color: '#4169E1' }} />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>PROFESSIONAL ROLE</label>
                <select value={formData.role} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600, cursor: 'pointer' }} onChange={e => setFormData({...formData, role: e.target.value})}>
                  <option value="Employee">Employee (Staff)</option>
                  <option value="Midwife">Midwife (Clinical)</option>
                  <option value="Admin">System Administrator</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>USERNAME</label>
                <input required value={formData.username} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, username: e.target.value})} disabled={isEditing} placeholder="portal_username" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>SPECIALIZATION</label>
                <input value={formData.specialization} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, specialization: e.target.value})} placeholder="e.g. Maternal Health" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>ASSIGNED PUROK</label>
                <input value={formData.assignedPurok} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, assignedPurok: e.target.value})} placeholder="e.g. Purok 1, 2" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>SHIFT</label>
                <select value={formData.shift} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, shift: e.target.value})}>
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Full Time">Full Time</option>
                </select>
              </div>

              {!isEditing && (
                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>PORTAL PASSWORD</label>
                  <input type="password" required value={formData.password} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none' }} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Minimum 8 characters" />
                </div>
              )}

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CONTACT PHONE</label>
                <input value={formData.phone} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+63 9XX XXX XXXX" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>EMAIL ADDRESS</label>
                <input type="email" value={formData.email} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="staff@chesms.gov.ph" />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>BIRTHDATE</label>
                <input type="date" value={formData.birthdate} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, birthdate: e.target.value})} />
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>GENDER</label>
                <select value={formData.gender} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>STATUS</label>
                <select value={formData.status} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="Active">Active</option>
                  <option value="On Leave">On Leave</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>RESIDENTIAL ADDRESS</label>
                <input value={formData.address} style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} onChange={e => setFormData({...formData, address: e.target.value})} placeholder="Purok, Street, Barangay, City" />
              </div>

              <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                <button type="submit" className="button button--primary" style={{ width: '100%', padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem' }}>
                  {isEditing ? 'COMMIT FILE UPDATES' : 'FINALIZE REGISTRATION'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
