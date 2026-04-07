import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, faSearch, faFileMedical, faUserMd, faWeight, faThermometerHalf,
  faHeartbeat, faRulerVertical, faNotesMedical, faHistory, faTimes, faEdit, faTrash,
  faUserInjured, faStethoscope, faPills, faFolderOpen, faSync
} from "@fortawesome/free-solid-svg-icons";

export default function Records() {
  const [records, setRecords] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patient: "", diagnosis: "", treatment: "", physician: "", 
    vitals: { weight: "", height: "", bloodPressure: "", temperature: "" },
    notes: "", date: new Date().toISOString().split('T')[0]
  });

  const API_URL = "http://localhost:5000/api/records";

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [recRes, patRes] = await Promise.all([
        axios.get(API_URL),
        axios.get("http://localhost:5000/api/patients")
      ]);
      setRecords(recRes.data);
      setPatients(patRes.data);
    } catch (err) { 
        console.error("Error fetching medical data:", err); 
    } finally {
        setLoading(false);
    }
  };

  const handlePatientClick = (patient) => {
    if (!patient || !patient._id) return;
    
    const history = records.filter(r => r.patient?._id === patient._id).sort((a,b) => new Date(b.date) - new Date(a.date));
    setPatientHistory(history);
    setSelectedPatient(patient);
  };

  const handleEdit = (record) => {
      setCurrentId(record._id);
      setIsEditing(true);
      setFormData({
          patient: record.patient?._id || "",
          diagnosis: record.diagnosis || "",
          treatment: record.treatment || "",
          physician: record.physician || "",
          vitals: {
              weight: record.vitals?.weight || "",
              height: record.vitals?.height || "",
              bloodPressure: record.vitals?.bloodPressure || "",
              temperature: record.vitals?.temperature || ""
          },
          notes: record.notes || "",
          date: new Date(record.date).toISOString().split('T')[0]
      });
      setIsModalOpen(true);
  };

  const resetForm = () => {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({
        patient: selectedPatient ? selectedPatient._id : "", 
        diagnosis: "", treatment: "", physician: "", 
        vitals: { weight: "", height: "", bloodPressure: "", temperature: "" },
        notes: "", date: new Date().toISOString().split('T')[0]
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
      
      await fetchData();
      setIsModalOpen(false);
      
      if (selectedPatient) {
          const updatedRecords = await axios.get(API_URL);
          const history = updatedRecords.data.filter(r => r.patient?._id === selectedPatient._id).sort((a,b) => new Date(b.date) - new Date(a.date));
          setPatientHistory(history);
      }
      
      resetForm();
    } catch (err) { console.error("Error saving record:", err); }
  };

  const handleDelete = async (id) => {
      if (window.confirm("Permanently delete this medical record?")) {
          try {
              await axios.delete(`${API_URL}/${id}`);
              await fetchData();
              
              if (selectedPatient) {
                  const updatedRecords = await axios.get(API_URL);
                  const history = updatedRecords.data.filter(r => r.patient?._id === selectedPatient._id).sort((a,b) => new Date(b.date) - new Date(a.date));
                  setPatientHistory(history);
                  if (history.length === 0) setSelectedPatient(null);
              }
          } catch (err) { console.error("Error deleting record:", err); }
      }
  };

  const uniquePatientsMap = records.reduce((acc, curr) => {
      const pId = curr.patient?._id;
      if (!pId) return acc;
      if (!acc[pId] || new Date(acc[pId].date) < new Date(curr.date)) {
          acc[pId] = curr;
      }
      return acc;
  }, {});
  
  const uniquePatientRecords = Object.values(uniquePatientsMap).sort((a,b) => new Date(b.date) - new Date(a.date));

  const filtered = uniquePatientRecords.filter(r => 
    r.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Electronic Health Records" subtitle="Clinical database and patient medical history management"
      actions={
          <div style={{ display: 'flex', gap: '10px' }}>
              <button className="icon-button" onClick={fetchData} title="Sync Database" style={{ background: 'white', border: '1px solid #E2E8F0' }}>
                  <FontAwesomeIcon icon={faSync} spin={loading} />
              </button>
              <button className="button button--primary" onClick={() => { setSelectedPatient(null); resetForm(); setIsModalOpen(true); }}>
                  <FontAwesomeIcon icon={faFileMedical} style={{ marginRight: '8px' }} /> New Clinical Record
              </button>
          </div>
      }
    >
      
      {/* CLINICAL DASHBOARD STATS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="report-card" style={{ background: '#0F172A', color: 'white', border: 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 800, opacity: 0.6, letterSpacing: '0.05em' }}>TOTAL CLINICAL FILES</span>
                  <FontAwesomeIcon icon={faFolderOpen} style={{ color: '#4169E1' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '8px' }}>{records.length} <span style={{ fontSize: '0.75rem', fontWeight: 500, opacity: 0.6 }}>Files</span></div>
          </div>
          <div className="report-card" style={{ borderLeft: '4px solid #10B981', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em' }}>REGISTERED PATIENTS</span>
                  <FontAwesomeIcon icon={faUserInjured} style={{ color: '#10B981' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '8px', color: '#0F172A' }}>{patients.length}</div>
          </div>
          <div className="report-card" style={{ borderLeft: '4px solid #F59E0B', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em' }}>RECENT ACTIVITY</span>
                  <FontAwesomeIcon icon={faNotesMedical} style={{ color: '#F59E0B' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '8px', color: '#0F172A' }}>{records.filter(r => new Date(r.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}</div>
              <div style={{ fontSize: '0.65rem', color: '#64748B', fontWeight: 700 }}>Past 7 Days</div>
          </div>
          <div className="report-card" style={{ borderLeft: '4px solid #8B5CF6', background: 'white' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', letterSpacing: '0.05em' }}>ACTIVE PROVIDERS</span>
                  <FontAwesomeIcon icon={faUserMd} style={{ color: '#8B5CF6' }} />
              </div>
              <div style={{ fontSize: '1.75rem', fontWeight: 900, marginTop: '8px', color: '#0F172A' }}>
                  {new Set(records.map(r => r.physician).filter(p => p)).size}
              </div>
          </div>
      </div>

      {/* SEARCH BAR */}
      <section className="animate-fade-in" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', background: 'white', padding: '8px', borderRadius: '16px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
            <div style={{ position: 'relative', flex: 1 }}>
                <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                <input 
                    style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '12px', border: 'none', background: '#F8FAFC', outline: 'none', fontSize: '0.9375rem', fontWeight: 500 }} 
                    placeholder="Search medical records by patient name or diagnosis..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button onClick={() => setSearchTerm("")} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                )}
            </div>
        </div>
      </section>

      {/* COMPACT DIRECTORY LIST */}
      {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem' }}>
              <FontAwesomeIcon icon={faSync} spin size="3x" style={{ color: '#E2E8F0' }} />
              <p style={{ marginTop: '1rem', color: '#94A3B8', fontWeight: 700 }}>Retrieving Clinical Data...</p>
          </div>
      ) : (
          <div className="table-wrapper animate-fade-in" style={{ borderRadius: '16px', boxShadow: 'var(--shadow-md)' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th style={{ padding: '1rem 1.25rem' }}>Patient Directory</th>
                  <th>Age</th>
                  <th>Latest Diagnosis</th>
                  <th>Primary Treatment</th>
                  <th>Attending Provider</th>
                  <th>Last Visit</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(r => (
                  <tr key={r._id} 
                      onClick={() => handlePatientClick(r.patient)} 
                      className="clickable-row"
                      style={{ cursor: 'pointer', transition: 'all 0.2s ease' }}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: 'linear-gradient(135deg, #EEF2FF 0%, #E0E7FF 100%)', color: '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <FontAwesomeIcon icon={faFolderOpen} size="lg" />
                        </div>
                        <div>
                            <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '1rem' }}>{r.patient?.name || "Unknown"}</div>
                            <div style={{ fontSize: '0.65rem', color: '#4169E1', fontWeight: 800, letterSpacing: '0.05em', marginTop: '2px' }}>VIEW FILE →</div>
                        </div>
                      </div>
                    </td>
                    <td><div style={{ fontWeight: 700, color: '#475569' }}>{r.patient?.age ? `${r.patient.age}y` : '--'}</div></td>
                    <td>
                      <span style={{ fontWeight: 800, color: '#EF4444', background: '#FEF2F2', padding: '4px 10px', borderRadius: '8px', fontSize: '0.75rem' }}>
                          <FontAwesomeIcon icon={faStethoscope} style={{ marginRight: '6px' }} />
                          {r.diagnosis}
                      </span>
                    </td>
                    <td><span style={{ fontWeight: 700, color: '#475569' }}>{r.treatment || "Monitoring"}</span></td>
                    <td>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <FontAwesomeIcon icon={faUserMd} style={{ color: '#94A3B8' }} /> {r.physician}
                      </div>
                    </td>
                    <td><div style={{ fontWeight: 800 }}>{new Date(r.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
      )}

      {/* MASTER PATIENT CLINICAL FILE MODAL */}
      {selectedPatient && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000 }}>
          <div className="report-card animate-fade-in" style={{ width: '95%', maxWidth: '1200px', height: '85vh', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', borderRadius: '24px' }}>
            
            {/* Header */}
            <div style={{ background: '#0F172A', padding: '2rem 2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: '#4169E1' }}>
                        <FontAwesomeIcon icon={faNotesMedical} />
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 900, margin: 0, letterSpacing: '-0.02em' }}>{selectedPatient.name}</h2>
                        <div style={{ display: 'flex', gap: '15px', marginTop: '6px', fontSize: '0.8125rem', opacity: 0.7, fontWeight: 600 }}>
                            <span>{selectedPatient.age} YRS • {(selectedPatient.gender || 'Unknown').toUpperCase()}</span>
                            <span>|</span>
                            <span>ID: {selectedPatient._id.slice(-8).toUpperCase()}</span>
                        </div>
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <button className="button button--primary" onClick={() => { resetForm(); setIsModalOpen(true); }} style={{ background: '#4169E1' }}>
                        <FontAwesomeIcon icon={faPlus} style={{ marginRight: '8px' }} /> APPEND RECORD
                    </button>
                    <button onClick={() => setSelectedPatient(null)} style={{ border: 'none', background: 'rgba(255,255,255,0.1)', color: 'white', cursor: 'pointer', width: '44px', height: '44px', borderRadius: '12px', transition: 'all 0.2s' }}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
                </div>
            </div>

            <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', background: '#F8FAFC' }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 900, color: '#1E293B', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <FontAwesomeIcon icon={faHistory} className="text-primary" /> COMPREHENSIVE MEDICAL HISTORY
                </h3>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {patientHistory.map((rec) => (
                        <div key={rec._id} className="report-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: '5px solid #10B981', padding: '1.5rem', position: 'relative', background: 'white', boxShadow: 'var(--shadow-sm)', borderRadius: '16px' }}>
                            
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>DATE OF ENCOUNTER</span>
                                    <h4 style={{ margin: '2px 0 0 0', fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>{new Date(rec.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h4>
                                </div>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button onClick={() => handleEdit(rec)} className="icon-button" style={{ background: '#F1F5F9', color: '#4169E1' }}><FontAwesomeIcon icon={faEdit} size="sm" /></button>
                                    <button onClick={() => handleDelete(rec._id)} className="icon-button" style={{ background: '#FEF2F2', color: '#EF4444' }}><FontAwesomeIcon icon={faTrash} size="sm" /></button>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
                                <div style={{ background: '#F8FAFC', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>CLINICAL DIAGNOSIS</div>
                                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#EF4444' }}><FontAwesomeIcon icon={faStethoscope} style={{ marginRight: '6px' }} /> {rec.diagnosis}</div>
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>TREATMENT PLAN / RX</div>
                                        <div style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#1E293B' }}><FontAwesomeIcon icon={faPills} style={{ marginRight: '6px', color: '#8B5CF6' }} /> {rec.treatment || 'No treatment specified'}</div>
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginBottom: '4px' }}>ATTENDING PHYSICIAN</div>
                                        <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#475569' }}><FontAwesomeIcon icon={faUserMd} style={{ marginRight: '6px' }} /> Dr. {rec.physician}</div>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', alignContent: 'start' }}>
                                    <div style={{ background: '#FEF2F2', padding: '1rem', borderRadius: '12px', border: '1px solid #FCA5A5' }}>
                                        <FontAwesomeIcon icon={faHeartbeat} style={{ color: '#EF4444', marginBottom: '8px' }} />
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#EF4444' }}>BLOOD PRESSURE</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#991B1B' }}>{rec.vitals?.bloodPressure || '--/--'}</div>
                                    </div>
                                    <div style={{ background: '#FFF7ED', padding: '1rem', borderRadius: '12px', border: '1px solid #FCD34D' }}>
                                        <FontAwesomeIcon icon={faThermometerHalf} style={{ color: '#F59E0B', marginBottom: '8px' }} />
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#F59E0B' }}>TEMPERATURE</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#92400E' }}>{rec.vitals?.temperature || '--'}°C</div>
                                    </div>
                                    <div style={{ background: '#F0FDF4', padding: '1rem', borderRadius: '12px', border: '1px solid #86EFAC' }}>
                                        <FontAwesomeIcon icon={faWeight} style={{ color: '#10B981', marginBottom: '8px' }} />
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#10B981' }}>WEIGHT</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#065F46' }}>{rec.vitals?.weight || '--'}</div>
                                    </div>
                                    <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '12px', border: '1px solid #93C5FD' }}>
                                        <FontAwesomeIcon icon={faRulerVertical} style={{ color: '#3B82F6', marginBottom: '8px' }} />
                                        <div style={{ fontSize: '0.6rem', fontWeight: 800, color: '#3B82F6' }}>HEIGHT</div>
                                        <div style={{ fontSize: '1.125rem', fontWeight: 900, color: '#1E40AF' }}>{rec.vitals?.height || '--'}</div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', marginTop: '0.5rem' }}>
                                <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#64748B', marginBottom: '6px' }}>CLINICAL NOTES & OBSERVATIONS</div>
                                <p style={{ fontSize: '0.9375rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                                    {rec.notes || "No additional notes provided for this encounter."}
                                </p>
                            </div>

                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE/EDIT RECORD MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 4000 }}>
          <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '650px', padding: '2.5rem', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.3)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>{isEditing ? 'Modify Clinical Entry' : 'New Medical Record'}</h2>
                <button onClick={() => setIsModalOpen(false)} className="icon-button" style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', border: '1px solid #E2E8F0' }}>
                  <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px', letterSpacing: '0.05em' }}>PATIENT IDENTIFICATION</label>
                  <select required value={formData.patient} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #CBD5E1', outline: 'none', background: 'white', fontWeight: 800, fontSize: '0.9375rem' }} onChange={e => setFormData({...formData, patient: e.target.value})}>
                    <option value="">Search Patient Directory...</option>
                    {patients.map(p => <option key={p._id} value={p._id}>{p.name} (ID: {p._id.slice(-6).toUpperCase()})</option>)}
                  </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                  <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CLINICAL DIAGNOSIS</label>
                      <input placeholder="e.g. Acute Bronchitis" value={formData.diagnosis} required style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 700 }} onChange={e => setFormData({...formData, diagnosis: e.target.value})} />
                  </div>
                  <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>ATTENDING PHYSICIAN / NURSE</label>
                      <input placeholder="e.g. Dr. Santos" value={formData.physician} required style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 700 }} onChange={e => setFormData({...formData, physician: e.target.value})} />
                  </div>
              </div>

              <div>
                  <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>PRESCRIBED TREATMENT</label>
                  <input placeholder="Medications, procedures, or instructions..." value={formData.treatment} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 500 }} onChange={e => setFormData({...formData, treatment: e.target.value})} />
              </div>

              <div style={{ border: '1px solid #E2E8F0', borderRadius: '16px', padding: '1.5rem', position: 'relative' }}>
                  <div style={{ position: 'absolute', top: '-10px', left: '15px', background: 'white', padding: '0 10px', fontSize: '0.65rem', fontWeight: 900, color: '#4169E1', letterSpacing: '0.05em' }}>PATIENT VITALS</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                    <div>
                        <label style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>BP (mmHg)</label>
                        <input placeholder="120/80" value={formData.vitals.bloodPressure} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #FCA5A5', outline: 'none', fontWeight: 800, color: '#EF4444', background: '#FEF2F2' }} onChange={e => setFormData({...formData, vitals: {...formData.vitals, bloodPressure: e.target.value}})} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>TEMP (°C)</label>
                        <input placeholder="36.5" value={formData.vitals.temperature} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #FCD34D', outline: 'none', fontWeight: 800, color: '#F59E0B', background: '#FFF7ED' }} onChange={e => setFormData({...formData, vitals: {...formData.vitals, temperature: e.target.value}})} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>WEIGHT (kg)</label>
                        <input placeholder="65" value={formData.vitals.weight} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #86EFAC', outline: 'none', fontWeight: 800, color: '#10B981', background: '#F0FDF4' }} onChange={e => setFormData({...formData, vitals: {...formData.vitals, weight: e.target.value}})} />
                    </div>
                    <div>
                        <label style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block', marginBottom: '4px' }}>HEIGHT (cm)</label>
                        <input placeholder="170" value={formData.vitals.height} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #93C5FD', outline: 'none', fontWeight: 800, color: '#3B82F6', background: '#EFF6FF' }} onChange={e => setFormData({...formData, vitals: {...formData.vitals, height: e.target.value}})} />
                    </div>
                  </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.25rem' }}>
                  <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>CLINICAL NOTES</label>
                      <textarea placeholder="Extensive observations..." value={formData.notes} style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', minHeight: '100px', outline: 'none', fontSize: '0.875rem' }} onChange={e => setFormData({...formData, notes: e.target.value})} />
                  </div>
                  <div>
                      <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#64748B', display: 'block', marginBottom: '8px' }}>DATE OF ENCOUNTER</label>
                      <input type="date" value={formData.date} required style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 700 }} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="button button--secondary" style={{ flex: 1 }}>CANCEL</button>
                <button type="submit" className="button button--primary" style={{ flex: 2, background: '#4169E1', boxShadow: '0 10px 15px -3px rgba(65, 105, 225, 0.3)' }}>
                  {isEditing ? 'UPDATE RECORD' : 'SAVE CLINICAL ENTRY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
