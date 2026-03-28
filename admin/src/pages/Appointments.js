import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, faCalendarCheck, faUser, faSyringe, 
  faStethoscope, faShieldVirus, faCheckCircle, faTimes, 
  faHistory, faInfoCircle, faMapMarkerAlt, faPhone,
  faSearch, faUserCircle, faExclamationCircle, faMagic,
  faChevronRight, faChartLine, faClipboardList, faClock
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/schedules";

export default function Appointments() {
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('history'); // 'history' or 'plan'
  
  const [formData, setFormData] = useState({
    patient: "", scheduleType: "Prenatal", service: "", doseNumber: 1, date: new Date().toISOString().split('T')[0], notes: ""
  });

  useEffect(() => {
    fetchSchedules();
    fetchPatients();
  }, []);

  const fetchSchedules = async () => {
    try {
      const res = await axios.get(API_URL);
      setSchedules(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchPatients = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data);
    } catch (err) { console.error(err); }
  };

  const handlePatientClick = async (patient) => {
    if (!patient?._id) return;
    try {
      const res = await axios.get(`${API_URL}/patient/${patient._id}`);
      setPatientHistory(res.data);
      setSelectedPatient(patient);
      setFormData({ ...formData, patient: patient._id, doseNumber: res.data.length + 1 });
    } catch (err) { console.error(err); }
  };

  const startProtocol = async (type) => {
    if (!selectedPatient) return;
    let plan = [];
    const today = new Date();

    if (type === 'Rabies') {
        plan = [
            { service: "Anti-Rabies Dose 1", days: 0 },
            { service: "Anti-Rabies Dose 2", days: 3 },
            { service: "Anti-Rabies Dose 3", days: 7 },
            { service: "Anti-Rabies Dose 4", days: 14 },
        ];
    } else if (type === 'Prenatal') {
        plan = [
            { service: "1st Trimester Check-up", days: 0 },
            { service: "2nd Trimester Check-up", days: 60 },
            { service: "3rd Trimester Check-up", days: 150 },
            { service: "Final Term Assessment", days: 210 },
        ];
    }

    try {
        for (let item of plan) {
            const scheduledDate = new Date();
            scheduledDate.setDate(today.getDate() + item.days);
            await axios.post(API_URL, {
                patient: selectedPatient._id,
                scheduleType: type === 'Prenatal' ? 'Prenatal' : 'Special Case',
                service: item.service,
                doseNumber: plan.indexOf(item) + 1,
                date: scheduledDate.toISOString().split('T')[0],
                status: "Pending"
            });
        }
        handlePatientClick(selectedPatient);
        fetchSchedules();
    } catch (err) { console.error(err); }
  };

  const getTypeStyles = (type) => {
    switch(type) {
      case 'Prenatal': return { color: '#8B5CF6', bg: '#F5F3FF', icon: faStethoscope };
      case 'Immunization': return { color: '#10B981', bg: '#ECFDF5', icon: faSyringe };
      case 'Special Case': return { color: '#F59E0B', bg: '#FFFBEB', icon: faShieldVirus };
      default: return { color: '#6366F1', bg: '#EEF2FF', icon: faCalendarCheck };
    }
  };

  const getStatusBadge = (item) => {
      const isOverdue = new Date(item.date) < new Date() && item.status === 'Pending';
      if (isOverdue) return <span className="tag status-pulse" style={{ background: '#FEE2E2', color: '#EF4444', fontWeight: 800 }}>OVERDUE</span>;
      if (item.status === 'Completed') return <span className="tag" style={{ background: '#DCFCE7', color: '#10B981', fontWeight: 800 }}>COMPLETED</span>;
      return <span className="tag" style={{ background: '#E0F2FE', color: '#4169E1', fontWeight: 800 }}>UPCOMING</span>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      fetchSchedules();
      if (selectedPatient) handlePatientClick(selectedPatient);
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'Completed' ? 'Pending' : 'Completed';
    try {
      await axios.patch(`${API_URL}/${id}/status`, { status: newStatus });
      fetchSchedules();
      if (selectedPatient) handlePatientClick(selectedPatient);
    } catch (err) { console.error(err); }
  };

  const uniquePatientSchedules = Object.values(
    schedules.reduce((acc, curr) => {
      const patientId = curr.patient?._id;
      if (!patientId) return acc;
      if (!acc[patientId] || (acc[patientId].status === 'Completed' && curr.status === 'Pending')) {
        acc[patientId] = curr;
      }
      return acc;
    }, {})
  ).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Calculate completion percentage for care plan
  const calculateProgress = () => {
      if (patientHistory.length === 0) return 0;
      const completed = patientHistory.filter(h => h.status === 'Completed').length;
      return Math.round((completed / patientHistory.length) * 100);
  };

  return (
    <Layout title="Clinical Care Scheduler" subtitle="High-performance health management and protocol tracking"
      actions={<button className="button button--primary" onClick={() => { setSelectedPatient(null); setIsModalOpen(true); }} style={{ borderRadius: '12px', padding: '0.75rem 1.5rem' }}><FontAwesomeIcon icon={faPlus} /> New Clinical Entry</button>}
    >
      
      {/* SEARCH SECTION */}
      <section className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
        <div className="glass-effect" style={{ padding: '1.25rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '1rem', boxShadow: 'var(--shadow)' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1.25rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.9375rem', transition: 'all 0.2s' }} 
                placeholder="Search patient to access master care record..." 
                className="top-nav__search-input"
                onChange={(e) => {
                    const query = e.target.value.toLowerCase();
                    if (query.length > 1) {
                        const found = patients.find(p => p.name.toLowerCase().includes(query));
                        if (found) handlePatientClick(found);
                    }
                }}
            />
          </div>
        </div>
      </section>

      {/* PATIENT TABLE */}
      <div className="table-wrapper animate-fade-in" style={{ borderRadius: '16px', boxShadow: 'var(--shadow-lg)' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ padding: '1.25rem' }}>Clinical Patient Profile</th>
              <th>Current Care Plan</th>
              <th>Latest Task</th>
              <th>Dose</th>
              <th>Target Date</th>
              <th>Clinical Status</th>
            </tr>
          </thead>
          <tbody>
            {uniquePatientSchedules.map((item) => {
              const styles = getTypeStyles(item.scheduleType);
              return (
                <tr key={item._id} onClick={() => handlePatientClick(item.patient)} className="clickable-row" style={{ cursor: 'pointer', transition: 'all 0.2s' }}>
                  <td style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', color: '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)' }}>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                          <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.9375rem' }}>{item.patient?.name}</div>
                          <div style={{ fontSize: '0.6875rem', color: '#4169E1', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '2px' }}>Manage Care Record <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: '0.5rem' }} /></div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 12px', borderRadius: '10px', background: styles.bg, color: styles.color, fontSize: '0.75rem', fontWeight: 800 }}>
                      <FontAwesomeIcon icon={styles.icon} /> {item.scheduleType.toUpperCase()}
                    </div>
                  </td>
                  <td><span style={{ fontWeight: 700, color: '#334155' }}>{item.service}</span></td>
                  <td><span style={{ fontWeight: 800, background: '#F1F5F9', padding: '2px 8px', borderRadius: '6px' }}>#{item.doseNumber}</span></td>
                  <td><div style={{ fontWeight: 800, color: '#0F172A' }}>{new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</div></td>
                  <td>{getStatusBadge(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MASTER PATIENT MODAL */}
      {selectedPatient && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(12px)' }}>
          <div className="report-card animate-fade-in" style={{ width: '95%', maxWidth: '1100px', height: '85vh', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', border: 'none', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', borderRadius: '24px' }}>
            
            {/* Dark Professional Header */}
            <div style={{ background: '#0F172A', padding: '2rem 2.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                    <div style={{ position: 'relative' }}>
                        <FontAwesomeIcon icon={faUserCircle} size="4x" style={{ color: '#4169E1' }} />
                        <div style={{ position: 'absolute', bottom: 0, right: 0, width: '16px', height: '16px', background: '#10B981', borderRadius: '50%', border: '3px solid #0F172A' }}></div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.875rem', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>{selectedPatient.name}</h2>
                        <div style={{ display: 'flex', gap: '20px', marginTop: '8px', fontSize: '0.8125rem', opacity: 0.6, fontWeight: 600 }}>
                            <span>{selectedPatient.age} YRS • {selectedPatient.gender.toUpperCase()}</span>
                            <span>ID: {selectedPatient._id.slice(-8).toUpperCase()}</span>
                            <span><FontAwesomeIcon icon={faPhone} style={{ marginRight: '6px' }} /> {selectedPatient.contact}</span>
                        </div>
                    </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.6875rem', fontWeight: 800, color: '#4169E1', marginBottom: '4px', textTransform: 'uppercase' }}>Care Plan Progress</div>
                    <div style={{ width: '200px', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{ width: `${calculateProgress()}%`, height: '100%', background: '#4169E1', transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)' }}></div>
                    </div>
                    <div style={{ fontSize: '0.75rem', marginTop: '4px', fontWeight: 700 }}>{calculateProgress()}% Complete</div>
                </div>
                <button onClick={() => setSelectedPatient(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'rgba(255,255,255,0.05)', color: 'white', cursor: 'pointer', width: '40px', height: '40px', borderRadius: '12px', transition: 'all 0.2s' }} className="hover-scale"><FontAwesomeIcon icon={faTimes} size="lg" /></button>
            </div>

            {/* Content Tabs */}
            <div style={{ background: 'white', borderBottom: '1px solid #F1F5F9', padding: '0 2.5rem', display: 'flex', gap: '2rem' }}>
                <button className={`tab-button ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>
                    <FontAwesomeIcon icon={faClipboardList} style={{ marginRight: '8px' }} /> CARE HISTORY
                </button>
                <button className={`tab-button ${activeTab === 'plan' ? 'active' : ''}`} onClick={() => setActiveTab('plan')}>
                    <FontAwesomeIcon icon={faMagic} style={{ marginRight: '8px' }} /> ACTION CENTER
                </button>
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', background: '#F8FAFC' }}>
                
                {activeTab === 'history' ? (
                    <div style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {patientHistory.map((item) => (
                                <div key={item._id} className="report-card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderLeft: `4px solid ${item.status === 'Completed' ? '#10B981' : '#4169E1'}`, padding: '1.5rem', position: 'relative' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                        <div>
                                            <span style={{ fontSize: '0.625rem', fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase' }}>{new Date(item.date).toLocaleDateString()}</span>
                                            <h4 style={{ margin: '4px 0 0 0', fontSize: '1rem', fontWeight: 800, color: '#0F172A' }}>{item.service}</h4>
                                        </div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 800, background: '#F1F5F9', padding: '4px 8px', borderRadius: '6px' }}>DOSE #{item.doseNumber}</div>
                                    </div>
                                    <p style={{ fontSize: '0.8125rem', color: '#64748B', margin: 0, minHeight: '40px' }}>{item.notes || "Standard clinical procedure followed."}</p>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                                        <button 
                                            onClick={() => toggleStatus(item._id, item.status)}
                                            style={{ padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', border: 'none', background: item.status === 'Completed' ? '#DCFCE7' : '#E0F2FE', color: item.status === 'Completed' ? '#10B981' : '#4169E1', transition: 'all 0.2s' }}
                                        >
                                            <FontAwesomeIcon icon={item.status === 'Completed' ? faCheckCircle : faClock} style={{ marginRight: '6px' }} />
                                            MARK {item.status === 'Completed' ? 'PENDING' : 'COMPLETED'}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {patientHistory.length === 0 && (
                            <div style={{ textAlign: 'center', padding: '5rem' }}>
                                <FontAwesomeIcon icon={faHistory} size="4x" style={{ color: '#E2E8F0', marginBottom: '1.5rem' }} />
                                <h3 style={{ color: '#94A3B8' }}>No clinical history available for this patient.</h3>
                            </div>
                        )}
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem', padding: '2.5rem', overflowY: 'auto' }}>
                        {/* Smart Protocols */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0F172A' }}>Clinical Protocols</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#4169E1' }}><FontAwesomeIcon icon={faMagic} /> Anti-Rabies Protocol</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.5rem' }}>Generates a 4-dose post-exposure schedule (Days 0, 3, 7, 14).</p>
                                    <button className="button button--primary" onClick={() => startProtocol('Rabies')} style={{ width: '100%', borderRadius: '12px' }}>Initialize Plan</button>
                                </div>
                                <div style={{ background: 'white', padding: '1.5rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
                                    <h4 style={{ margin: '0 0 8px 0', color: '#8B5CF6' }}><FontAwesomeIcon icon={faStethoscope} /> Prenatal Care Plan</h4>
                                    <p style={{ fontSize: '0.75rem', color: '#64748B', marginBottom: '1.5rem' }}>Sets 4 critical milestones throughout the term of pregnancy.</p>
                                    <button className="button button--primary" onClick={() => startProtocol('Prenatal')} style={{ width: '100%', borderRadius: '12px', background: '#8B5CF6' }}>Initialize Plan</button>
                                </div>
                            </div>
                        </div>

                        {/* Manual Form */}
                        <div>
                            <h3 style={{ fontSize: '1.125rem', fontWeight: 800, marginBottom: '1.5rem', color: '#0F172A' }}>Manual Clinical Entry</h3>
                            <div style={{ background: 'white', padding: '2rem', borderRadius: '20px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-lg)' }}>
                                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>SERVICE NAME</label>
                                        <input placeholder="e.g. Flu Vaccine" required style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} onChange={(e)=>setFormData({...formData, service: e.target.value})} />
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '1rem' }}>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>TARGET DATE</label>
                                            <input type="date" required style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} onChange={(e)=>setFormData({...formData, date: e.target.value})} />
                                        </div>
                                        <div>
                                            <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>DOSE #</label>
                                            <input type="number" value={formData.doseNumber} style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} onChange={(e)=>setFormData({...formData, doseNumber: e.target.value})} />
                                        </div>
                                    </div>
                                    <button type="submit" className="button button--primary" style={{ width: '100%', padding: '1rem', borderRadius: '14px', fontWeight: 800 }}>CONFIRM SCHEDULE</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
