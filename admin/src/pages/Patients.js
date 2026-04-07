import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, 
  faDownload, 
  faFilter, 
  faUserInjured, 
  faEdit, 
  faTrash, 
  faTimes,
  faSearch,
  faSync,
  faTint,
  faPhone,
  faMapMarkerAlt,
  faNotesMedical,
  faHeartbeat,
  faInfoCircle,
  faVenusMars,
  faBirthdayCake,
  faIdCard
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/patients";

export default function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  
  const [formData, setFormData] = useState({
    patientId: `PAT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
    name: "",
    birthdate: "",
    age: "",
    gender: "Male",
    civilStatus: "Single",
    address: "",
    contact: "",
    bloodType: "Unknown",
    status: "Active",
    emergencyContactName: "",
    emergencyContactRelation: "",
    emergencyContactPhone: "",
    medicalHistory: ""
  });

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      patientId: `PAT-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`,
      name: "",
      birthdate: "",
      age: "",
      gender: "Male",
      civilStatus: "Single",
      address: "",
      contact: "",
      bloodType: "Unknown",
      status: "Active",
      emergencyContactName: "",
      emergencyContactRelation: "",
      emergencyContactPhone: "",
      medicalHistory: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (patient) => {
    setIsEditing(true);
    setCurrentPatientId(patient._id);
    
    // Format birthdate for input type="date"
    let bDate = "";
    if (patient.birthdate) {
      bDate = new Date(patient.birthdate).toISOString().split('T')[0];
    }

    setFormData({
      patientId: patient.patientId || `PAT-${new Date().getFullYear()}-00000`,
      name: patient.name || "",
      birthdate: bDate,
      age: patient.age || "",
      gender: patient.gender || "Male",
      civilStatus: patient.civilStatus || "Single",
      address: patient.address || "",
      contact: patient.contact || "",
      bloodType: patient.bloodType || "Unknown",
      status: patient.status || "Active",
      emergencyContactName: patient.emergencyContact?.name || "",
      emergencyContactRelation: patient.emergencyContact?.relation || "",
      emergencyContactPhone: patient.emergencyContact?.phone || "",
      medicalHistory: Array.isArray(patient.medicalHistory) ? patient.medicalHistory.join(", ") : (patient.medicalHistory || "")
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Format payload to match backend schema
    const payload = {
      patientId: formData.patientId,
      name: formData.name,
      birthdate: formData.birthdate || null,
      age: formData.age,
      gender: formData.gender,
      civilStatus: formData.civilStatus,
      address: formData.address,
      contact: formData.contact,
      bloodType: formData.bloodType,
      status: formData.status,
      emergencyContact: {
        name: formData.emergencyContactName,
        relation: formData.emergencyContactRelation,
        phone: formData.emergencyContactPhone
      },
      medicalHistory: formData.medicalHistory.split(',').map(item => item.trim()).filter(Boolean)
    };

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentPatientId}`, payload);
      } else {
        await axios.post(`${API_URL}/add`, payload);
      }
      fetchPatients();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving patient:", err);
      alert(err.response?.data?.message || "Failed to save patient record.");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to completely remove this patient record from the database?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPatients();
      } catch (err) {
        console.error("Error deleting patient:", err);
      }
    }
  };

  const filteredPatients = patients.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (p.patientId && p.patientId.toLowerCase().includes(searchTerm.toLowerCase())) ||
                          (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = filterStatus === "All" || p.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Active': return { bg: '#ECFDF5', text: '#10B981', dot: '#10B981' };
      case 'Inactive': return { bg: '#F8FAFC', text: '#64748B', dot: '#94A3B8' };
      case 'Transferred': return { bg: '#EFF6FF', text: '#3B82F6', dot: '#3B82F6' };
      case 'Deceased': return { bg: '#FEF2F2', text: '#EF4444', dot: '#EF4444' };
      default: return { bg: '#ECFDF5', text: '#10B981', dot: '#10B981' };
    }
  };

  const getBloodTypeColor = (type) => {
    if (!type || type === 'Unknown') return '#94A3B8';
    if (type.includes('-')) return '#8B5CF6'; // Rare types
    return '#EF4444'; // Common positive types
  };

  return (
    <Layout 
      title="Patient Records" 
      subtitle={`Comprehensive database of ${patients.length} registered patients`}
      actions={
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="icon-button" onClick={fetchPatients} title="Refresh Records" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
            <FontAwesomeIcon icon={faSync} spin={loading} />
          </button>
          <button className="button button--secondary hide-on-mobile">
            <FontAwesomeIcon icon={faDownload} /> Export Records
          </button>
          <button className="button button--primary" onClick={openAddModal} style={{ borderRadius: '12px' }}>
            <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> Register Patient
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
              placeholder="Search by patient name, ID, or address..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="hide-on-mobile" style={{ display: 'flex', gap: '8px' }}>
            {['All', 'Active', 'Inactive', 'Transferred', 'Deceased'].map(filter => (
               <button 
                key={filter} 
                onClick={() => setFilterStatus(filter)}
                className={`button ${filterStatus === filter ? 'button--primary' : 'button--secondary'}`} 
                style={{ height: '44px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}
               >
                {filter}
               </button>
            ))}
          </div>
        </div>
      </section>

      {/* PATIENT CARDS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '10rem 0' }}>
          <FontAwesomeIcon icon={faSync} spin size="3x" style={{ color: '#E2E8F0' }} />
        </div>
      ) : filteredPatients.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '8rem 0', background: 'white', borderRadius: '24px', border: '1px dashed #CBD5E1' }}>
          <FontAwesomeIcon icon={faUserInjured} size="4x" style={{ color: '#E2E8F0', marginBottom: '1.5rem' }} />
          <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 800, color: '#475569' }}>No patient records found</h3>
          <p style={{ margin: 0, color: '#94A3B8', fontWeight: 500 }}>Try adjusting your search filters or register a new patient.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '1.5rem', paddingBottom: '3rem' }}>
          {filteredPatients.map(patient => {
            const statusStyle = getStatusColor(patient.status);
            
            return (
              <div key={patient._id} className="report-card animate-fade-in hover-reveal" style={{ 
                padding: '0', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', overflow: 'hidden'
              }}>
                <div style={{ height: '6px', background: statusStyle.dot }}></div>
                
                <div style={{ padding: '1.5rem' }}>
                  {/* Header Area */}
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '1.5rem' }}>
                    <div style={{ 
                      width: '60px', height: '60px', borderRadius: '18px', 
                      background: patient.gender === 'Female' ? '#FDF2F8' : (patient.gender === 'Male' ? '#EFF6FF' : '#F8FAFC'), 
                      color: patient.gender === 'Female' ? '#EC4899' : (patient.gender === 'Male' ? '#3B82F6' : '#64748B'), 
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', flexShrink: 0
                    }}>
                      <FontAwesomeIcon icon={faUserInjured} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <h3 style={{ margin: '0 0 2px 0', fontSize: '1.125rem', fontWeight: 900, color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {patient.name}
                        </h3>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => openEditModal(patient)} className="icon-button" style={{ width: '30px', height: '30px', background: '#F1F5F9', color: '#4169E1' }}><FontAwesomeIcon icon={faEdit} size="xs" /></button>
                          <button onClick={() => handleDelete(patient._id)} className="icon-button" style={{ width: '30px', height: '30px', background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} size="xs" /></button>
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p style={{ margin: 0, fontSize: '0.75rem', fontWeight: 800, color: '#4169E1' }}>{patient.patientId || `PAT-${patient._id.substring(18)}`}</p>
                        <span style={{ fontSize: '0.65rem', fontWeight: 800, color: statusStyle.text, background: statusStyle.bg, padding: '2px 8px', borderRadius: '999px', textTransform: 'uppercase' }}>
                          {patient.status || 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Core Metrics Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#F8FAFC', padding: '10px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><FontAwesomeIcon icon={faBirthdayCake} /> AGE</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{patient.age ? `${patient.age} yrs` : 'N/A'}</span>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#F8FAFC', padding: '10px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><FontAwesomeIcon icon={faVenusMars} /> GENDER</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{patient.gender || 'N/A'}</span>
                     </div>
                     <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#F8FAFC', padding: '10px', borderRadius: '12px' }}>
                        <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'flex', alignItems: 'center', gap: '4px' }}><FontAwesomeIcon icon={faTint} style={{ color: getBloodTypeColor(patient.bloodType) }} /> BLOOD</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{patient.bloodType || 'Unknown'}</span>
                     </div>
                  </div>

                  {/* Info List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ width: '14px', marginTop: '3px', color: '#94A3B8' }} /> 
                      <span style={{ flex: 1, lineHeight: 1.4 }}>{patient.address || 'No address provided'}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                      <FontAwesomeIcon icon={faPhone} style={{ width: '14px', color: '#94A3B8' }} /> 
                      <span>{patient.contact || 'No contact provided'}</span>
                    </div>
                    {patient.medicalHistory && patient.medicalHistory.length > 0 && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.8rem', fontWeight: 600, color: '#475569' }}>
                        <FontAwesomeIcon icon={faNotesMedical} style={{ width: '14px', marginTop: '3px', color: '#EF4444' }} /> 
                        <span style={{ flex: 1, lineHeight: 1.4, color: '#EF4444' }}>
                          Risk Factors: {patient.medicalHistory.join(', ')}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Emergency Contact */}
                  {(patient.emergencyContact?.name || patient.emergencyContact?.phone) && (
                    <div style={{ marginTop: '1.25rem', paddingTop: '1.25rem', borderTop: '1px dashed #E2E8F0' }}>
                      <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8', marginBottom: '6px', letterSpacing: '0.05em' }}>EMERGENCY CONTACT</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>{patient.emergencyContact.name}</div>
                          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: '#64748B' }}>{patient.emergencyContact.relation || 'Relation not specified'}</div>
                        </div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#4169E1' }}>
                          <FontAwesomeIcon icon={faPhone} size="sm" style={{ marginRight: '6px' }} />
                          {patient.emergencyContact.phone}
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* REGISTRATION / EDIT MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5000, padding: '1rem' }}>
          <div className="report-card animate-scale-in" style={{ width: '100%', maxWidth: '700px', padding: '0', borderRadius: '28px', overflow: 'hidden', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ background: 'linear-gradient(135deg, #4169E1, #1E40AF)', padding: '2rem', color: 'white', position: 'relative', flexShrink: 0 }}>
               <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>{isEditing ? 'Update Patient File' : 'Register New Patient'}</h2>
               <p style={{ margin: '4px 0 0', fontSize: '0.85rem', opacity: 0.8, fontWeight: 600 }}>Comprehensive electronic health record registration</p>
               <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            
            <div style={{ padding: '2rem', overflowY: 'auto' }}>
              <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                
                {/* SECTION: BASIC INFO */}
                <div style={{ gridColumn: '1 / -1' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faIdCard} /> DEMOGRAPHICS
                  </h4>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>SYSTEM ID (AUTO)</label>
                  <input readOnly value={formData.patientId} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', background: '#F8FAFC', outline: 'none', fontWeight: 800, color: '#4169E1' }} />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>LEGAL FULL NAME *</label>
                  <input required name="name" value={formData.name} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="e.g. Juan Dela Cruz" />
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>BIRTHDATE</label>
                  <input type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>AGE *</label>
                    <input required type="number" name="age" value={formData.age} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="Yrs" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>GENDER</label>
                    <select name="gender" value={formData.gender} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }}>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CIVIL STATUS</label>
                  <select name="civilStatus" value={formData.civilStatus} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }}>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Widowed">Widowed</option>
                    <option value="Separated">Separated</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CONTACT NUMBER *</label>
                  <input required name="contact" value={formData.contact} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="09XX XXX XXXX" />
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>FULL RESIDENTIAL ADDRESS *</label>
                  <input required name="address" value={formData.address} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="Purok, Street, Barangay" />
                </div>

                {/* SECTION: MEDICAL INFO */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faHeartbeat} /> CLINICAL DATA
                  </h4>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>BLOOD TYPE</label>
                  <select name="bloodType" value={formData.bloodType} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }}>
                    <option value="Unknown">Unknown</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CURRENT STATUS</label>
                  <select name="status" value={formData.status} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Transferred">Transferred</option>
                    <option value="Deceased">Deceased</option>
                  </select>
                </div>

                <div style={{ gridColumn: '1 / -1' }}>
                  <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>KNOWN MEDICAL HISTORY / CONDITIONS</label>
                  <input name="medicalHistory" value={formData.medicalHistory} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="E.g. Asthma, Hypertension (comma separated)" />
                </div>

                {/* SECTION: EMERGENCY CONTACT */}
                <div style={{ gridColumn: '1 / -1', marginTop: '1rem' }}>
                  <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #E2E8F0', paddingBottom: '0.5rem' }}>
                    <FontAwesomeIcon icon={faPhone} /> EMERGENCY CONTACT
                  </h4>
                </div>

                <div style={{ gridColumn: '1 / -1', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>FULL NAME</label>
                    <input name="emergencyContactName" value={formData.emergencyContactName} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="Contact Person" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>RELATION</label>
                    <input name="emergencyContactRelation" value={formData.emergencyContactRelation} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="E.g. Spouse" />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.7rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>PHONE</label>
                    <input name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleInputChange} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 600 }} placeholder="Number" />
                  </div>
                </div>

                <div style={{ gridColumn: '1 / -1', marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                  <button type="button" onClick={() => setIsModalOpen(false)} className="button button--secondary" style={{ flex: 1, padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem' }}>Cancel</button>
                  <button type="submit" className="button button--primary" style={{ flex: 2, padding: '1.25rem', borderRadius: '16px', fontSize: '0.9rem' }}>
                    {isEditing ? 'UPDATE PATIENT RECORD' : 'SAVE & REGISTER PATIENT'}
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
