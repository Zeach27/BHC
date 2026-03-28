import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCheckCircle, faSearch, faPlus, faUser, faCalendarDay, 
  faQrcode, faCamera, faTimes, faUserCheck, faIdCard,
  faMapMarkerAlt, faHistory, faSync, faVideo, faExchangeAlt
} from "@fortawesome/free-solid-svg-icons";
import { Html5Qrcode } from "html5-qrcode";

export default function Attendance() {
  const [attendance, setAttendance] = useState([]);
  const [patients, setPatients] = useState([]);
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [scannedPatient, setScannedPatient] = useState(null);
  const [loading, setLoading] = useState(false);
  const [scannerInstance, setScannerInstance] = useState(null);
  
  const [formData, setFormData] = useState({
    patient: "",
    event: "",
    remarks: ""
  });

  useEffect(() => {
    fetchAttendance();
    fetchInitialData();
  }, []);

  // Professional Scanner Lifecycle
  useEffect(() => {
    if (isScannerOpen && !scannerInstance) {
      const html5QrCode = new Html5Qrcode("reader");
      setScannerInstance(html5QrCode);
      
      const qrConfig = { fps: 15, qrbox: { width: 200, height: 200 } };
      
      html5QrCode.start(
        { facingMode: "environment" }, 
        qrConfig,
        onScanSuccess
      ).catch(err => console.error("Scanner start error:", err));
    }

    return () => {
      if (scannerInstance && !isScannerOpen) {
        scannerInstance.stop().then(() => {
            scannerInstance.clear();
            setScannerInstance(null);
        }).catch(err => console.log("Stop error", err));
      }
    };
  }, [isScannerOpen]);

  const onScanSuccess = async (decodedText) => {
    try {
      setLoading(true);
      // Visual feedback: Stop scanner temporarily on success
      if (scannerInstance) scannerInstance.pause();
      
      const res = await axios.get(`http://localhost:5000/api/patients`);
      const patient = res.data.find(p => p._id === decodedText || p._id.slice(-6).toUpperCase() === decodedText.toUpperCase());
      
      if (patient) {
        setScannedPatient(patient);
        setFormData(prev => ({ ...prev, patient: patient._id }));
      } else {
        alert("Verification Failed: Unknown Patient ID");
        if (scannerInstance) scannerInstance.resume();
      }
    } catch (err) { 
        console.error(err); 
        if (scannerInstance) scannerInstance.resume();
    } finally { setLoading(false); }
  };

  const fetchAttendance = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/attendance");
      setAttendance(res.data);
    } catch (err) { console.error(err); }
  };

  const fetchInitialData = async () => {
    try {
      const [pRes, eRes] = await Promise.all([
        axios.get("http://localhost:5000/api/patients"),
        axios.get("http://localhost:5000/api/events")
      ]);
      setPatients(pRes.data);
      setEvents(eRes.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/attendance/mark", formData);
      fetchAttendance();
      setIsModalOpen(false);
      setIsScannerOpen(false);
      setScannedPatient(null);
      setFormData({ patient: "", event: "", remarks: "" });
    } catch (err) { console.error(err); }
  };

  const filtered = attendance.filter(a => 
    a.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.event?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Attendance Station" subtitle="Next-gen clinical verification hub"
      actions={
        <div style={{ display: 'flex', gap: '8px' }}>
            <button className="button button--secondary" onClick={() => setIsScannerOpen(true)} style={{ background: '#0F172A', color: 'white', border: 'none' }}>
                <FontAwesomeIcon icon={faQrcode} /> START SCANNER
            </button>
            <button className="button button--primary" onClick={() => { setScannedPatient(null); setIsModalOpen(true); }}>
                <FontAwesomeIcon icon={faPlus} /> MANUAL ENTRY
            </button>
        </div>
      }
    >
      
      {/* PROFESSIONAL SCANNER ENGINE UI */}
      {isScannerOpen && (
          <div className="animate-fade-in" style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '1.5rem', alignItems: 'stretch' }}>
                  
                  {/* High-End Scanner Console */}
                  <div style={{ background: '#0F172A', borderRadius: '24px', padding: '1.25rem', position: 'relative', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.3)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', color: 'white' }}>
                          <span style={{ fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.1em', color: '#4169E1' }}>
                              <FontAwesomeIcon icon={faVideo} className="status-pulse" style={{ marginRight: '8px' }} /> 
                              ENGINE: ACTIVE
                          </span>
                          <button onClick={() => { setIsScannerOpen(false); setScannedPatient(null); }} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer', width: '24px', height: '24px', borderRadius: '50%' }}><FontAwesomeIcon icon={faTimes} size="xs" /></button>
                      </div>

                      {/* Scanner Frame */}
                      <div style={{ position: 'relative', width: '100%', height: '220px', borderRadius: '16px', overflow: 'hidden', border: '2px solid #334155' }}>
                          <div id="reader" style={{ width: '100%', height: '100%' }}></div>
                          
                          {/* Animated Scanning Laser */}
                          {!scannedPatient && (
                              <div style={{ 
                                  position: 'absolute', top: 0, left: 0, width: '100%', height: '2px', 
                                  background: 'linear-gradient(to right, transparent, #4169E1, transparent)',
                                  boxShadow: '0 0 15px #4169E1',
                                  zIndex: 10,
                                  animation: 'scan-move 2s infinite ease-in-out'
                              }}></div>
                          )}

                          {/* Viewfinder Corners */}
                          <div style={{ position: 'absolute', top: '20px', left: '20px', width: '20px', height: '20px', borderTop: '3px solid #4169E1', borderLeft: '3px solid #4169E1', zIndex: 11 }}></div>
                          <div style={{ position: 'absolute', top: '20px', right: '20px', width: '20px', height: '20px', borderTop: '3px solid #4169E1', borderRight: '3px solid #4169E1', zIndex: 11 }}></div>
                          <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '20px', height: '20px', borderBottom: '3px solid #4169E1', borderLeft: '3px solid #4169E1', zIndex: 11 }}></div>
                          <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '20px', height: '20px', borderBottom: '3px solid #4169E1', borderRight: '3px solid #4169E1', zIndex: 11 }}></div>
                      </div>

                      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                          <button className="icon-button" style={{ color: 'white', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }} title="Switch Camera">
                              <FontAwesomeIcon icon={faExchangeAlt} />
                          </button>
                          <p style={{ fontSize: '0.6rem', color: '#64748B', marginTop: '0.75rem', fontWeight: 700 }}>VERIFYING DIGITAL CREDENTIALS...</p>
                      </div>
                  </div>

                  {/* Recognition Panel */}
                  <div style={{ flex: 1 }}>
                      {scannedPatient ? (
                          <div className="report-card animate-fade-in" style={{ height: '100%', border: '2px solid #10B981', padding: '1.5rem', display: 'flex', flexDirection: 'column', background: 'white' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#10B981', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', boxShadow: '0 4px 10px rgba(16, 185, 129, 0.3)' }}>
                                          <FontAwesomeIcon icon={faUserCheck} />
                                      </div>
                                      <div>
                                          <h4 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 900, color: '#0F172A' }}>{scannedPatient.name}</h4>
                                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#10B981' }}>IDENTITY VERIFIED</span>
                                      </div>
                                  </div>
                                  <button className="icon-button" onClick={() => { setScannedPatient(null); if(scannerInstance) scannerInstance.resume(); }} style={{ background: '#F1F5F9' }}><FontAwesomeIcon icon={faSync} /></button>
                              </div>

                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                  <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block' }}>DEMOGRAPHICS</span>
                                      <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{scannedPatient.age}Y • {scannedPatient.gender}</span>
                                  </div>
                                  <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block' }}>SYSTEM ID</span>
                                      <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{scannedPatient._id.slice(-8).toUpperCase()}</span>
                                  </div>
                                  <div style={{ padding: '0.75rem', background: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                                      <span style={{ fontSize: '0.6rem', fontWeight: 800, color: '#94A3B8', display: 'block' }}>CONTACT</span>
                                      <span style={{ fontWeight: 800, fontSize: '0.8125rem' }}>{scannedPatient.contact}</span>
                                  </div>
                              </div>

                              <form onSubmit={handleSubmit} style={{ marginTop: 'auto', display: 'flex', gap: '10px' }}>
                                  <select required style={{ flex: 1, padding: '0.75rem', borderRadius: '12px', border: '1px solid #BAE6FD', outline: 'none', fontWeight: 800, fontSize: '0.8125rem', background: '#F0F9FF' }} onChange={e => setFormData({...formData, event: e.target.value})}>
                                      <option value="">Select Event Target...</option>
                                      {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                                  </select>
                                  <button type="submit" className="button button--primary" style={{ padding: '0 2rem', background: '#10B981', border: 'none', fontWeight: 900 }}>CONFIRM</button>
                              </form>
                          </div>
                      ) : (
                          <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px dashed #CBD5E1', borderRadius: '24px', background: '#F8FAFC' }}>
                              <div style={{ textAlign: 'center', color: '#94A3B8' }}>
                                  <FontAwesomeIcon icon={faIdCard} size="3x" style={{ marginBottom: '1rem', opacity: 0.2 }} />
                                  <p style={{ fontWeight: 800, fontSize: '0.875rem' }}>AWAITING SCAN...</p>
                                  <p style={{ fontSize: '0.75rem', maxWidth: '200px' }}>Place the digital QR code within the scanner viewport.</p>
                              </div>
                          </div>
                      )}
                  </div>
              </div>
          </div>
      )}

      {/* COMPACT LOG VIEW */}
      <section className="animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 900, letterSpacing: '0.02em', color: '#0F172A' }}>
                <FontAwesomeIcon icon={faHistory} style={{ color: '#4169E1', marginRight: '8px' }} /> 
                REAL-TIME PARTICIPATION LOG
            </h3>
            <div style={{ position: 'relative' }}>
                <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', fontSize: '0.75rem' }} />
                <input style={{ padding: '0.5rem 1rem 0.5rem 2.25rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.75rem', width: '280px', fontWeight: 600 }} placeholder="Filter by Name or Event Title..." onChange={e => setSearchTerm(e.target.value)} />
            </div>
        </div>
        
        <div className="table-wrapper">
            <table className="data-table">
            <thead>
                <tr>
                <th>IDENTIFIED RESIDENT</th>
                <th>CLINICAL EVENT / ACTION</th>
                <th>TIMESTAMP</th>
                <th>STATUS</th>
                </tr>
            </thead>
            <tbody>
                {filtered.map(a => (
                <tr key={a._id}>
                    <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#475569' }}><FontAwesomeIcon icon={faUser} size="xs" /></div>
                            <div>
                                <div style={{ fontWeight: 800, color: '#1E293B' }}>{a.patient?.name}</div>
                                <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 800 }}>ID: {a.patient?._id?.slice(-8).toUpperCase()}</div>
                            </div>
                        </div>
                    </td>
                    <td><div style={{ fontWeight: 700, color: '#4169E1', fontSize: '0.8125rem' }}>{a.event?.title}</div></td>
                    <td>
                        <div style={{ fontSize: '0.8125rem', fontWeight: 800 }}>{new Date(a.date).toLocaleDateString()}</div>
                        <div style={{ fontSize: '0.65rem', color: '#94A3B8', fontWeight: 700 }}>{new Date(a.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </td>
                    <td><span className="tag" style={{ background: '#DCFCE7', color: '#10B981', border: '1px solid #10B981', fontWeight: 900 }}>VERIFIED PRESENT</span></td>
                </tr>
                ))}
            </tbody>
            </table>
        </div>
      </section>

      {/* MANUAL ENTRY MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(15, 23, 42, 0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 3000, backdropFilter: 'blur(10px)' }}>
          <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', padding: '2.5rem', borderRadius: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900 }}>Manual Registration</h2>
                <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', background: '#F1F5F9', color: '#64748B', width: '36px', height: '36px', borderRadius: '50%', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Resident Name & System ID</label>
                <select 
                  required 
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', background: 'white', fontWeight: 800, fontSize: '0.875rem' }}
                  onChange={e => setFormData({...formData, patient: e.target.value})}
                >
                  <option value="">Select Resident...</option>
                  {patients.map(p => <option key={p._id} value={p._id}>{p.name} ({p._id.slice(-8).toUpperCase()})</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '0.65rem', fontWeight: 900, color: '#94A3B8', display: 'block', marginBottom: '8px', textTransform: 'uppercase' }}>Clinical Health Event</label>
                <select 
                  required 
                  style={{ width: '100%', padding: '0.875rem', borderRadius: '14px', border: '1px solid #E2E8F0', outline: 'none', background: 'white', fontWeight: 800, fontSize: '0.875rem' }}
                  onChange={e => setFormData({...formData, event: e.target.value})}
                >
                  <option value="">Choose Health Event...</option>
                  {events.map(e => <option key={e._id} value={e._id}>{e.title}</option>)}
                </select>
              </div>
              <textarea placeholder="Clinical remarks or observations..." style={{ width: '100%', padding: '1rem', borderRadius: '16px', border: '1px solid #E2E8F0', minHeight: '100px', outline: 'none', fontSize: '0.875rem', lineHeight: 1.6 }} onChange={e => setFormData({...formData, remarks: e.target.value})} />
              <button type="submit" className="button button--primary" style={{ width: '100%', padding: '1.125rem', borderRadius: '16px', fontWeight: 900, fontSize: '1rem', boxShadow: '0 10px 15px -3px rgba(65, 105, 225, 0.3)' }}>
                  RECORD ATTENDANCE
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Animation CSS */}
      <style>{`
        @keyframes scan-move {
            0% { top: 10%; }
            50% { top: 90%; }
            100% { top: 10%; }
        }
      `}</style>
    </Layout>
  );
}
