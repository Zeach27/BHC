import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faSearch, faEdit, faTrash, faTimes, faUsers, faPlus, faSync, 
  faUser, faHome, faHeartbeat, faIdCard, faSave, faEraser, 
  faChevronRight, faChevronLeft, faBaby, faMale, faFemale, faRing, faCross, faWheelchair, faUserShield, faMoneyBillWave, faGlobe, faUserPlus
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/residents";

export default function Census() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formStep, setStep] = useState(1);
  const adminName = localStorage.getItem("adminName") || "Administrator";

  const initialFormState = {
    // 1. MAIN RESIDENT
    firstName: "", middleName: "", lastName: "", suffix: "",
    gender: "", birthdate: "", age: "", nationality: "Filipino",
    civilStatus: "Single", religion: "Roman Catholic", birthplace: "",
    occupation: "", monthlyIncome: "", contactNumber: "",

    // 2. SPOUSE
    spouseFirstName: "", spouseMiddleName: "", spouseLastName: "",
    spouseBirthdate: "", spouseAge: "", spouseNationality: "Filipino",
    spouseReligion: "Roman Catholic", spouseBirthplace: "", 
    spouseOccupation: "", spouseMonthlyIncome: "",

    // 3. ROSTERS
    childrenRoster: [],
    seniorRoster: [],
    pwdRoster: [],

    // 4. HOUSEHOLD
    householdId: "", totalMembersInHousehold: 1, 
    isAnyMemberPWD: false, isAnyMemberSenior: false,

    // 5. ADDRESS
    purok: "", barangay: "Brgy. Sample",
    municipality: "Sample City", province: "Sample Province",
    registeredBy: adminName
  };

  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => { fetchResidents(); }, []);

  const fetchResidents = async () => {
    setLoading(true);
    try {
      const res = await axios.get(API_URL);
      setResidents(res.data || []);
    } catch (err) { console.error(err); }
    setLoading(false);
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const birth = new Date(dob);
    const now = new Date();
    let age = now.getFullYear() - birth.getFullYear();
    const m = now.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
    return age;
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    
    if (name === "birthdate") {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, [name]: value, age }));
    } else if (name === "spouseBirthdate") {
      const age = calculateAge(value);
      setFormData(prev => ({ ...prev, [name]: value, spouseAge: age }));
    } else {
      setFormData(prev => ({ ...prev, [name]: val }));
    }
  };

  // ROSTER LOGIC
  const addChild = () => {
    setFormData(prev => ({
      ...prev,
      childrenRoster: [...(prev.childrenRoster || []), { 
        childFirstName: "", childMiddleName: "", childLastName: "", 
        childBirthdate: "", childAge: "", childGender: "", 
        childBirthplace: "", childReligion: "Roman Catholic", 
        childNationality: "Filipino", childStatus: "Student"
      }]
    }));
  };

  const handleChildChange = (index, field, value) => {
    const updated = [...(formData.childrenRoster || [])];
    updated[index][field] = value;
    if (field === "childBirthdate") {
      updated[index].childAge = calculateAge(value);
    }
    setFormData(prev => ({ ...prev, childrenRoster: updated }));
  };

  const addSenior = () => {
    setFormData(prev => ({
      ...prev,
      seniorRoster: [...(prev.seniorRoster || []), { 
        firstName: "", middleName: "", lastName: "", age: "", 
        birthplace: "", healthStatus: "Healthy", nationality: "Filipino" 
      }]
    }));
  };

  const addPWD = () => {
    setFormData(prev => ({
      ...prev,
      pwdRoster: [...(prev.pwdRoster || []), { 
        firstName: "", middleName: "", lastName: "", age: "", 
        disabilityType: "", nationality: "Filipino" 
      }]
    }));
  };

  const handleRosterChange = (listName, index, field, value) => {
    const updated = [...(formData[listName] || [])];
    updated[index][field] = value;
    setFormData(prev => ({ ...prev, [listName]: updated }));
  };

  const removeItem = (listName, index) => {
    const updated = [...(formData[listName] || [])];
    updated.splice(index, 1);
    setFormData(prev => ({ ...prev, [listName]: updated }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formStep < 3) { setStep(formStep + 1); return; }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, formData);
        alert("Success! Profile updated.");
      } else {
        const response = await axios.post(`${API_URL}/add`, formData);
        console.log("Save Response:", response.data);
        alert("Success! Resident registered.");
      }
      fetchResidents();
      handleCloseModal();
    } catch (err) { 
      console.error("SAVE_ERROR:", err);
      alert("Error saving data: " + (err.response?.data?.message || err.message)); 
    }

  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setFormData(initialFormState);
    setStep(1);
    setCurrentId(null);
  };

  const handleEdit = (r) => {
    setIsEditing(true);
    setCurrentId(r._id);
    setFormData({
      ...initialFormState,
      ...r,
      childrenRoster: r.childrenRoster || [],
      seniorRoster: r.seniorRoster || [],
      pwdRoster: r.pwdRoster || [],
      birthdate: r.birthdate ? new Date(r.birthdate).toISOString().split('T')[0] : "",
      spouseBirthdate: r.spouseBirthdate ? new Date(r.spouseBirthdate).toISOString().split('T')[0] : "",
    });
    setStep(1);
    setIsModalOpen(true);
  };

  const filtered = residents.filter(r => {
    const s = searchTerm.toLowerCase();
    const fullName = `${r.firstName || ''} ${r.lastName || ''} ${r.fullName || ''}`.toLowerCase();
    return fullName.includes(s) || r.residentId?.toLowerCase().includes(s) || r.householdId?.toLowerCase().includes(s);
  });

  const incomeOptions = [
    "No Income", "Below 5,000", "5,000 - 10,000", "10,000 - 15,000", 
    "15,000 - 20,000", "20,000 - 30,000", "30,000 - 50,000", "Above 50,000"
  ];

  return (
    <Layout title="Community Census" subtitle="Expert-level Demographic Intelligence">
      <style>{`
        .sheet { background: white; border-radius: 24px; border: 1px solid #E2E8F0; box-shadow: var(--shadow-sm); overflow: hidden; }
        .nav-tab { flex: 1; padding: 1.5rem; text-align: center; font-size: 0.7rem; font-weight: 900; color: #94A3B8; border-bottom: 4px solid #F1F5F9; cursor: pointer; transition: 0.3s; text-transform: uppercase; }
        .nav-tab.active { color: #4169E1; border-bottom-color: #4169E1; background: #F8FAFC; }
        
        .box-input { display: flex; flex-direction: column; gap: 5px; }
        .box-input label { font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.05em; }
        .box-input input, .box-input select, .box-input textarea { padding: 0.9rem; border-radius: 12px; border: 1px solid #E2E8F0; background: #F8FAFC; font-size: 0.9rem; font-weight: 600; outline: none; transition: 0.2s; }
        .box-input input:focus { border-color: #4169E1; background: white; }

        .form-section { background: #F8FAFC; border: 1px solid #E2E8F0; padding: 2rem; border-radius: 24px; margin-bottom: 1.5rem; }
        .child-record-card { background: white; border: 1px solid #E2E8F0; padding: 1.5rem; border-radius: 18px; margin-bottom: 1rem; border-left: 5px solid #10B981; }
        .roster-grid-compact { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '1rem', marginBottom: '2rem' }}>
          <div className="sheet" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <FontAwesomeIcon icon={faSearch} color="#94A3B8" />
            <input style={{ flex: 1, border: 'none', outline: 'none', fontWeight: 600, fontSize: '1rem', height: '45px' }} placeholder="Search resident by name, ID, or household..." value={searchTerm} onChange={e=>setSearchTerm(e.target.value)} />
          </div>
          <button className="button button--primary" onClick={()=>setIsModalOpen(true)} style={{ borderRadius: '16px', background: '#0F172A', padding: '0 2.5rem', height: '60px', fontWeight: 800 }}>+ NEW REGISTRATION</button>
        </div>

        <div className="sheet">
          <table className="data-table">
            <thead>
              <tr>
                <th style={{ paddingLeft: '2rem' }}>Full Identity</th>
                <th>Resident ID</th>
                <th>Purok</th>
                <th>Status</th>
                <th>Household</th>
                <th style={{ textAlign: 'right', paddingRight: '2rem' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r._id} className="hover-reveal">
                  <td style={{ paddingLeft: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#EEF2FF', color: '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <FontAwesomeIcon icon={r.gender === 'Female' ? faFemale : faMale} />
                      </div>
                      <div style={{ fontWeight: 900, color: '#0F172A' }}>{r.firstName} {r.lastName}</div>
                    </div>
                  </td>
                  <td><span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#4169E1' }}>{r.residentId}</span></td>
                  <td><span style={{ fontWeight: 800 }}>P-{r.purok}</span></td>
                  <td><span className="tag">{r.civilStatus}</span></td>
                  <td><span style={{ fontWeight: 800, color: '#64748B' }}>HH-{r.householdId}</span></td>
                  <td style={{ textAlign: 'right', paddingRight: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                      <button className="icon-button" onClick={()=>handleEdit(r)}><FontAwesomeIcon icon={faEdit} /></button>
                      <button className="icon-button" style={{ color: '#EF4444' }} onClick={async ()=>{ if(window.confirm("Permanently delete?")){ await axios.delete(`${API_URL}/${r._id}`); fetchResidents(); } }}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ background: 'rgba(15, 23, 42, 0.98)', backdropFilter: 'blur(10px)' }}>
          <div className="sheet animate-fade-in" style={{ width: '98%', maxWidth: '1200px', maxHeight: '92vh', overflowY: 'auto' }}>
            
            <div style={{ background: '#0F172A', color: 'white', padding: '2rem 3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><h2 style={{ margin: 0, fontWeight: 900, letterSpacing: '-0.5px' }}>{isEditing ? 'Update Resident Profile' : 'New Census Registration'}</h2><p style={{ margin: 0, opacity: 0.6, fontSize: '0.85rem' }}>Providing high-accuracy family and demographic data.</p></div>
              <button onClick={handleCloseModal} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><FontAwesomeIcon icon={faTimes} size="xl" /></button>
            </div>

            <div style={{ display: 'flex', background: 'white' }}>
              {[ {s:1, l:'Demographics & Family'}, {s:2, l:'Location & Address'}, {s:3, l:'Household Rosters'} ].map(item=>(
                <div key={item.s} className={`nav-tab ${formStep === item.s ? 'active' : ''}`} onClick={()=>formStep > item.s && setStep(item.s)}>{item.l}</div>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ padding: '3.5rem' }}>
              
              {/* STEP 1: DEMOGRAPHICS & FAMILY */}
              {formStep === 1 && (
                <div className="animate-fade-in">
                  <div className="form-section" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.2rem' }}>
                    <div className="box-input"><label>First Name *</label><input required name="firstName" value={formData.firstName} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Middle Name</label><input name="middleName" value={formData.middleName} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Last Name *</label><input required name="lastName" value={formData.lastName} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Nationality</label><input name="nationality" value={formData.nationality} onChange={handleInputChange} /></div>
                    
                    <div className="box-input"><label>Birthday *</label><input required type="date" name="birthdate" value={formData.birthdate} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Age</label><input readOnly value={formData.age} style={{ background: '#F1F5F9' }} /></div>
                    <div className="box-input"><label>Gender *</label><select required name="gender" value={formData.gender} onChange={handleInputChange}><option value="">-- Choose --</option><option>Male</option><option>Female</option></select></div>
                    <div className="box-input"><label>Civil Status *</label><select name="civilStatus" value={formData.civilStatus} onChange={handleInputChange}><option>Single</option><option>Married</option><option>Widowed</option><option>Separated</option></select></div>
                    
                    <div className="box-input"><label>Occupation *</label><input required name="occupation" value={formData.occupation} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Monthly Income *</label><select required name="monthlyIncome" value={formData.monthlyIncome} onChange={handleInputChange}><option value="">-- Select --</option>{incomeOptions.map(o=><option key={o}>{o}</option>)}</select></div>
                    <div className="box-input"><label>Religion</label><input name="religion" value={formData.religion} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Place of Birth</label><input name="birthplace" value={formData.birthplace} onChange={handleInputChange} /></div>
                  </div>

                  {/* SPOUSE SECTION */}
                  {formData.civilStatus === 'Married' && (
                    <div className="form-section" style={{ borderLeftColor: '#3B82F6', background: '#F0F7FF' }}>
                      <h4 style={{ margin: '0 0 1.5rem 0', color: '#1E40AF' }}><FontAwesomeIcon icon={faRing} /> HUSBAND OR WIFE INFORMATION</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        <div className="box-input"><label>Spouse First Name</label><input name="spouseFirstName" value={formData.spouseFirstName} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Spouse Middle Name</label><input name="spouseMiddleName" value={formData.spouseMiddleName} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Spouse Last Name</label><input name="spouseLastName" value={formData.spouseLastName} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Nationality</label><input name="spouseNationality" value={formData.spouseNationality} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Spouse Birthday</label><input type="date" name="spouseBirthdate" value={formData.spouseBirthdate} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Spouse Age</label><input readOnly value={formData.spouseAge} /></div>
                        <div className="box-input"><label>Occupation</label><input name="spouseOccupation" value={formData.spouseOccupation} onChange={handleInputChange} /></div>
                        <div className="box-input"><label>Monthly Income</label><select name="spouseMonthlyIncome" value={formData.spouseMonthlyIncome} onChange={handleInputChange}><option value="">-- Select --</option>{incomeOptions.map(o=><option key={o}>{o}</option>)}</select></div>
                      </div>
                    </div>
                  )}

                  {/* MOVED CHILDREN ROSTER TO STEP 1 */}
                  {formData.civilStatus === 'Married' && (
                    <div className="form-section" style={{ borderLeftColor: '#10B981' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                        <h4 style={{ margin: 0, color: '#059669' }}><FontAwesomeIcon icon={faBaby} /> CHILDREN IDENTITY ROSTER ("ANAK")</h4>
                        <button type="button" onClick={addChild} className="button" style={{ background: '#10B981', color: 'white', fontWeight: 900 }}>+ ADD CHILD</button>
                      </div>
                      {(formData.childrenRoster || []).map((c, idx) => (
                        <div key={idx} className="child-record-card animate-fade-in">
                          <div className="roster-grid-compact" style={{ marginBottom: '1rem' }}>
                            <div className="box-input"><label>First Name</label><input value={c.childFirstName} onChange={e=>handleChildChange(idx, 'childFirstName', e.target.value)} /></div>
                            <div className="box-input"><label>Middle Name</label><input value={c.childMiddleName} onChange={e=>handleChildChange(idx, 'childMiddleName', e.target.value)} /></div>
                            <div className="box-input"><label>Last Name</label><input value={c.childLastName} onChange={e=>handleChildChange(idx, 'childLastName', e.target.value)} /></div>
                            <div className="box-input"><label>Nationality</label><input value={c.childNationality} onChange={e=>handleChildChange(idx, 'childNationality', e.target.value)} /></div>
                          </div>
                          <div className="roster-grid-compact">
                            <div className="box-input"><label>Birthday</label><input type="date" value={c.childBirthdate} onChange={e=>handleChildChange(idx, 'childBirthdate', e.target.value)} /></div>
                            <div className="box-input"><label>Age</label><input readOnly value={c.childAge} style={{ background: '#F8FAFC' }} /></div>
                            <div className="box-input"><label>Birthplace</label><input value={c.childBirthplace} onChange={e=>handleChildChange(idx, 'childBirthplace', e.target.value)} /></div>
                            <div style={{ display: 'flex', gap: '10px', alignItems: 'end' }}>
                              <div className="box-input" style={{ flex: 1 }}><label>Gender</label><select value={c.childGender} onChange={e=>handleChildChange(idx, 'childGender', e.target.value)}><option value="">--</option><option>Male</option><option>Female</option></select></div>
                              <button type="button" onClick={()=>removeItem('childrenRoster', idx)} style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', height: '48px', width: '48px', borderRadius: '12px', cursor: 'pointer' }}><FontAwesomeIcon icon={faTrash} /></button>
                            </div>
                          </div>
                        </div>
                      ))}
                      {formData.childrenRoster.length === 0 && <p style={{ textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 600 }}>No children listed. Click the button above to add family members.</p>}
                    </div>
                  )}
                </div>
              )}

              {/* STEP 2: ADDRESS */}
              {formStep === 2 && (
                <div className="animate-fade-in form-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="box-input"><label>Purok / Sitio / Street *</label><input required name="purok" value={formData.purok} onChange={handleInputChange} /></div>
                  <div className="box-input"><label>Barangay *</label><input required name="barangay" value={formData.barangay} onChange={handleInputChange} /></div>
                  <div className="box-input"><label>Municipality / City *</label><input required name="municipality" value={formData.municipality} onChange={handleInputChange} /></div>
                  <div className="box-input"><label>Province *</label><input required name="province" value={formData.province} onChange={handleInputChange} /></div>
                  <div className="box-input" style={{ gridColumn: 'span 2' }}><label>Contact Number (Mobile)</label><input name="contactNumber" value={formData.contactNumber} onChange={handleInputChange} /></div>
                </div>
              )}

              {/* STEP 3: HOUSEHOLD ROSTERS */}
              {formStep === 3 && (
                <div className="animate-fade-in">
                  <div className="form-section" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div className="box-input"><label>Household ID *</label><input required name="householdId" placeholder="HH-XXXX" value={formData.householdId} onChange={handleInputChange} /></div>
                    <div className="box-input"><label>Total people in this house *</label><input type="number" required name="totalMembersInHousehold" value={formData.totalMembersInHousehold} onChange={handleInputChange} /></div>
                  </div>

                  {/* SENIOR ROSTER */}
                  <div className="form-section" style={{ borderLeftColor: '#F59E0B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: 800 }}>
                        <input type="checkbox" name="isAnyMemberSenior" checked={formData.isAnyMemberSenior} onChange={handleInputChange} />
                        <FontAwesomeIcon icon={faUserShield} color="#D97706" /> Household has Senior Citizens?
                      </label>
                      {formData.isAnyMemberSenior && <button type="button" onClick={addSenior} className="button" style={{ background: '#F59E0B', color: 'white', fontWeight: 800 }}>+ ADD SENIOR</button>}
                    </div>
                    {formData.isAnyMemberSenior && formData.seniorRoster.map((s, idx) => (
                      <div key={idx} className="child-record-card" style={{ borderLeftColor: '#F59E0B' }}>
                        <div className="roster-grid-compact" style={{ marginBottom: '1rem' }}>
                          <div className="box-input"><label>First Name</label><input value={s.firstName} onChange={e=>handleRosterChange('seniorRoster', idx, 'firstName', e.target.value)} /></div>
                          <div className="box-input"><label>Middle Name</label><input value={s.middleName} onChange={e=>handleRosterChange('seniorRoster', idx, 'middleName', e.target.value)} /></div>
                          <div className="box-input"><label>Last Name</label><input value={s.lastName} onChange={e=>handleRosterChange('seniorRoster', idx, 'lastName', e.target.value)} /></div>
                          <div className="box-input"><label>Age</label><input type="number" value={s.age} onChange={e=>handleRosterChange('seniorRoster', idx, 'age', e.target.value)} /></div>
                        </div>
                        <div className="roster-grid-compact">
                          <div className="box-input"><label>Birthplace</label><input value={s.birthplace} onChange={e=>handleRosterChange('seniorRoster', idx, 'birthplace', e.target.value)} /></div>
                          <div className="box-input"><label>Nationality</label><input value={s.nationality} onChange={e=>handleRosterChange('seniorRoster', idx, 'nationality', e.target.value)} /></div>
                          <div className="box-input"><label>Status</label><input value={s.healthStatus} onChange={e=>handleRosterChange('seniorRoster', idx, 'healthStatus', e.target.value)} /></div>
                          <button type="button" onClick={()=>removeItem('seniorRoster', idx)} style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', borderRadius: '12px', height: '48px', cursor: 'pointer' }}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* PWD ROSTER */}
                  <div className="form-section" style={{ borderLeftColor: '#4169E1' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'white', padding: '0.8rem 1.2rem', borderRadius: '12px', border: '1px solid #E2E8F0', cursor: 'pointer', fontWeight: 800 }}>
                        <input type="checkbox" name="isAnyMemberPWD" checked={formData.isAnyMemberPWD} onChange={handleInputChange} />
                        <FontAwesomeIcon icon={faWheelchair} color="#4169E1" /> Household has PWDs?
                      </label>
                      {formData.isAnyMemberPWD && <button type="button" onClick={addPWD} className="button" style={{ background: '#4169E1', color: 'white', fontWeight: 800 }}>+ ADD PWD MEMBER</button>}
                    </div>
                    {formData.isAnyMemberPWD && formData.pwdRoster.map((p, idx) => (
                      <div key={idx} className="child-record-card" style={{ borderLeftColor: '#4169E1' }}>
                        <div className="roster-grid-compact" style={{ marginBottom: '1rem' }}>
                          <div className="box-input"><label>First Name</label><input value={p.firstName} onChange={e=>handleRosterChange('pwdRoster', idx, 'firstName', e.target.value)} /></div>
                          <div className="box-input"><label>Middle Name</label><input value={p.middleName} onChange={e=>handleRosterChange('pwdRoster', idx, 'middleName', e.target.value)} /></div>
                          <div className="box-input"><label>Last Name</label><input value={p.lastName} onChange={e=>handleRosterChange('pwdRoster', idx, 'lastName', e.target.value)} /></div>
                          <div className="box-input"><label>Age</label><input type="number" value={p.age} onChange={e=>handleRosterChange('pwdRoster', idx, 'age', e.target.value)} /></div>
                        </div>
                        <div className="roster-grid-compact" style={{ gridTemplateColumns: '2fr 1fr auto' }}>
                          <div className="box-input"><label>Disability Type</label><input value={p.disabilityType} onChange={e=>handleRosterChange('pwdRoster', idx, 'disabilityType', e.target.value)} /></div>
                          <div className="box-input"><label>Nationality</label><input value={p.nationality} onChange={e=>handleRosterChange('pwdRoster', idx, 'nationality', e.target.value)} /></div>
                          <button type="button" onClick={()=>removeItem('pwdRoster', idx)} style={{ background: '#FEF2F2', color: '#EF4444', border: '1px solid #FEE2E2', borderRadius: '12px', height: '48px', width: '48px', cursor: 'pointer' }}><FontAwesomeIcon icon={faTrash} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FOOTER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem', paddingTop: '3rem', borderTop: '2px solid #F1F5F9' }}>
                <button type="button" className="button button--secondary" onClick={()=>setFormData(initialFormState)} style={{ height: '55px', borderRadius: '16px' }}><FontAwesomeIcon icon={faEraser} /> CLEAR FORM</button>
                <div style={{ display: 'flex', gap: '15px' }}>
                  {formStep > 1 && <button type="button" className="button button--secondary" onClick={()=>setStep(formStep - 1)} style={{ height: '55px', borderRadius: '16px' }}>PREVIOUS</button>}
                  <button type="submit" className="button button--primary" style={{ minWidth: '220px', height: '55px', borderRadius: '16px', background: formStep === 3 ? '#10B981' : '#0F172A' }}>
                    {formStep < 3 ? <>CONTINUE <FontAwesomeIcon icon={faChevronRight} /></> : <>FINALIZE & SAVE</>}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
