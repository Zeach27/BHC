import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCalendarCheck, faUser, faSyringe, 
  faStethoscope, faShieldVirus, faTimes, 
  faSearch, faUserCircle,
  faCalendarPlus
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/schedules";

export default function Appointments() {
  const [schedules, setSchedules] = useState([]);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientHistory, setPatientHistory] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    patient: "", scheduleType: "Prenatal", service: "", doseNumber: 1, date: new Date().toISOString().split('T')[0], notes: ""
  });

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await axios.get(API_URL);
      setSchedules(res.data);
    } catch (err) { console.error(err); }
  }, []);

  const fetchPatients = useCallback(async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/patients");
      setPatients(res.data);
    } catch (err) { console.error(err); }
  }, []);

  useEffect(() => {
    fetchSchedules();
    fetchPatients();
  }, [fetchSchedules, fetchPatients]);

  const handlePatientClick = async (patient) => {
    if (!patient?._id) return;
    try {
      const res = await axios.get(`${API_URL}/patient/${patient._id}`);
      setPatientHistory(res.data);
      setSelectedPatient(patient);
      setFormData(f => ({ ...f, patient: patient._id, doseNumber: res.data.length + 1 }));
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
      if (isOverdue) return <span className="tag" style={{ background: '#FEE2E2', color: '#EF4444', fontWeight: 800 }}>LATE</span>;
      if (item.status === 'Completed') return <span className="tag" style={{ background: '#DCFCE7', color: '#10B981', fontWeight: 800 }}>DONE</span>;
      return <span className="tag" style={{ background: '#E0F2FE', color: '#4169E1', fontWeight: 800 }}>UPCOMING</span>;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(API_URL, formData);
      fetchSchedules();
      setIsAddModalOpen(false);
      if (selectedPatient) handlePatientClick(selectedPatient);
      setFormData({
        patient: "", scheduleType: "Prenatal", service: "", doseNumber: 1, date: new Date().toISOString().split('T')[0], notes: ""
      });
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

  return (
    <Layout 
      title="Clinic Schedule" 
      subtitle="Organize patient check-ups and health programs"
      actions={
        <button className="button button--primary" onClick={() => setIsAddModalOpen(true)}>
          <FontAwesomeIcon icon={faCalendarPlus} /> Add Appointment
        </button>
      }
    >
      <style>{`
        .appointments-table-wrapper { overflow-x: auto; -webkit-overflow-scrolling: touch; border-radius: 16px; border: 1px solid #E2E8F0; background: white; }
        .modal-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        @media (max-width: 640px) { .modal-form-grid { grid-template-columns: 1fr; } }
      `}</style>
      
      {/* Search Header */}
      <section className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div className="report-card" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input 
                className="search-input"
                style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }} 
                placeholder="Search patient to see their full schedule..." 
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

      {/* Main Table */}
      <div className="appointments-table-wrapper animate-fade-in">
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ padding: '1.25rem' }}>Patient Name</th>
              <th>Program</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {uniquePatientSchedules.map((item) => {
              const styles = getTypeStyles(item.scheduleType);
              return (
                <tr key={item._id} onClick={() => handlePatientClick(item.patient)} className="clickable-row">
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}>
                        <FontAwesomeIcon icon={faUser} />
                      </div>
                      <div>
                          <div style={{ fontWeight: 800, color: '#0F172A' }}>{item.patient?.name}</div>
                          <div style={{ fontSize: '0.65rem', color: '#4169E1', fontWeight: 800 }}>VIEW ALL VISITS →</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '8px', background: styles.bg, color: styles.color, fontSize: '0.7rem', fontWeight: 800 }}>
                      <FontAwesomeIcon icon={styles.icon} /> {item.scheduleType.toUpperCase()}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700, color: '#334155' }}>{item.service}</td>
                  <td style={{ fontWeight: 800, color: '#0F172A' }}>{new Date(item.date).toLocaleDateString()}</td>
                  <td>{getStatusBadge(item)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* MODAL: ADD APPOINTMENT */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="report-card animate-fade-in" style={{ width: '95%', maxWidth: '550px', padding: '2.5rem', borderRadius: '28px', position: 'relative' }}>
            <button onClick={() => setIsAddModalOpen(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: '#F1F5F9', color: '#64748B', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#0F172A' }}>Schedule New Visit</h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '2rem' }}>Assign a patient to a health program or check-up date.</p>
            
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>SELECT PATIENT</label>
                <select 
                  required 
                  style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 800, outline: 'none' }}
                  value={formData.patient}
                  onChange={e => setFormData({...formData, patient: e.target.value})}
                >
                  <option value="">Search Patient Directory...</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
                </select>
              </div>

              <div className="modal-form-grid">
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>PROGRAM TYPE</label>
                  <select 
                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 800, outline: 'none' }}
                    value={formData.scheduleType}
                    onChange={e => setFormData({...formData, scheduleType: e.target.value})}
                  >
                    <option value="Prenatal">Prenatal Care</option>
                    <option value="Immunization">Immunization</option>
                    <option value="Special Case">Special Case</option>
                    <option value="Routine">Regular Check-up</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>TARGET DATE</label>
                  <input 
                    type="date" 
                    required 
                    style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 800 }}
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '8px' }}>SERVICE OR DOSE NAME</label>
                <input 
                  placeholder="e.g. 1st Month Checkup or Dose #1" 
                  required 
                  style={{ width: '100%', padding: '1rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', fontWeight: 700 }}
                  value={formData.service}
                  onChange={e => setFormData({...formData, service: e.target.value})}
                />
              </div>

              <button type="submit" className="button button--primary" style={{ height: '54px', fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(65, 105, 225, 0.3)' }}>
                  CONFIRM APPOINTMENT
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MASTER PATIENT MODAL (Existing History View) */}
      {selectedPatient && (
        <div className="modal-overlay" style={{ zIndex: 2500 }}>
          <div className="report-card animate-fade-in" style={{ width: '95%', maxWidth: '1000px', height: '80vh', padding: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden', borderRadius: '24px' }}>
            <div style={{ background: '#0F172A', padding: '1.5rem 2rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <FontAwesomeIcon icon={faUserCircle} size="2x" style={{ color: '#4169E1' }} />
                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0 }}>{selectedPatient.name}</h2>
                </div>
                <button onClick={() => setSelectedPatient(null)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} size="lg" /></button>
            </div>
            <div style={{ flex: 1, padding: '2rem', overflowY: 'auto', background: '#F8FAFC' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
                    {patientHistory.map((item) => (
                        <div key={item._id} className="report-card" style={{ borderLeft: `4px solid ${item.status === 'Completed' ? '#10B981' : '#4169E1'}`, background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#94A3B8' }}>{new Date(item.date).toLocaleDateString()}</span>
                                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: item.status === 'Completed' ? '#10B981' : '#4169E1' }}>{item.status.toUpperCase()}</span>
                            </div>
                            <h4 style={{ margin: '0 0 5px 0', fontSize: '1rem' }}>{item.service}</h4>
                            <p style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>{item.scheduleType}</p>
                            <button 
                                onClick={() => toggleStatus(item._id, item.status)}
                                style={{ marginTop: '1rem', width: '100%', padding: '8px', borderRadius: '8px', border: 'none', background: item.status === 'Completed' ? '#F1F5F9' : '#EEF2FF', color: item.status === 'Completed' ? '#64748B' : '#4169E1', fontSize: '0.7rem', fontWeight: 800, cursor: 'pointer' }}
                            >
                                MARK AS {item.status === 'Completed' ? 'PENDING' : 'DONE'}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
