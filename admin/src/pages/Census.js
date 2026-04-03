import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMapMarkedAlt, faSearch, faHouseUser, faDownload, faEdit, faTrash, faTimes,
  faUsers, faMapMarkerAlt, faFilter, faPlus
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/residents";

export default function Census() {
  const [censusData, setCensusData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [purokFilter, setPurokFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", purok: "", householdNo: "", address: ""
  });

  useEffect(() => {
    fetchCensus();
  }, []);

  const fetchCensus = async () => {
    try {
      const res = await axios.get(API_URL);
      setCensusData(res.data);
    } catch (err) { console.error(err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentId}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      fetchCensus();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this record from the census?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchCensus();
      } catch (err) { console.error(err); }
    }
  };

  const uniquePuroks = ["All", ...new Set(censusData.map(r => r.purok).filter(p => p))];
  const totalHouseholds = new Set(censusData.map(r => r.householdNo).filter(h => h)).size;

  const filtered = censusData.filter(r => {
    const matchesSearch = r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         r.householdNo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPurok = purokFilter === "All" || r.purok === purokFilter;
    return matchesSearch && matchesPurok;
  });

  const stats = [
    { label: "Total Population", value: censusData.length, icon: faUsers, color: "#4169E1" },
    { label: "Total Households", value: totalHouseholds, icon: faHouseUser, color: "#10B981" },
    { label: "Puroks Mapped", value: uniquePuroks.length - 1, icon: faMapMarkedAlt, color: "#F59E0B" }
  ];

  const headerActions = (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button className="button button--secondary">
        <FontAwesomeIcon icon={faDownload} /> Export Census
      </button>
      <button className="button button--primary" onClick={() => { setIsEditing(false); setFormData({fullName:"", purok:"", householdNo:"", address:""}); setIsModalOpen(true); }}>
        <FontAwesomeIcon icon={faPlus} /> Add Resident
      </button>
    </div>
  );

  return (
    <Layout 
      title="Community Census" 
      subtitle="Geographical mapping of barangay households and residents"
      actions={headerActions}
    >
      <style>{`
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; margin-bottom: 2rem; }
        .stat-card { background: white; padding: 1.5rem; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; align-items: center; gap: 1rem; }
        .stat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; color: white; font-size: 1.25rem; }
        .search-section { background: white; padding: 1rem; border-radius: 16px; border: 1px solid #E2E8F0; display: flex; gap: 1rem; margin-bottom: 1.5rem; }
        .search-input-wrapper { position: relative; flex: 1; }
        .purok-badge { background: #F1F5F9; color: #475569; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; }
        .household-badge { background: #E8EFFF; color: #4169E1; padding: 4px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 800; }
      `}</style>

      <div className="stats-grid">
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ backgroundColor: stat.color }}>
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="stat-info">
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748B', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</p>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>{stat.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <section className="search-section">
        <div className="search-input-wrapper">
          <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
          <input 
            style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', outline: 'none' }}
            placeholder="Search by name or household ID..." 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
          />
        </div>
        <select 
          style={{ padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #F1F5F9', background: '#F8FAFC', fontWeight: 700, fontSize: '0.8rem' }}
          value={purokFilter} 
          onChange={(e) => setPurokFilter(e.target.value)}
        >
          {uniquePuroks.map(p => <option key={p} value={p}>{p === "All" ? "All Puroks" : `Purok ${p}`}</option>)}
        </select>
      </section>

      <div className="report-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ paddingLeft: '1.5rem' }}>Resident Name</th>
              <th>Purok / Zone</th>
              <th>Household No.</th>
              <th>Address Details</th>
              <th style={{ textAlign: 'right', paddingRight: '1.5rem' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id}>
                <td style={{ paddingLeft: '1.5rem', fontWeight: 800, color: '#0F172A' }}>{r.fullName}</td>
                <td><span className="purok-badge">PUROK {r.purok}</span></td>
                <td><span className="household-badge">HH #{r.householdNo}</span></td>
                <td style={{ fontSize: '0.8rem', color: '#64748B' }}>{r.address}</td>
                <td style={{ textAlign: 'right', paddingRight: '1.5rem' }}>
                  <button className="icon-button" onClick={() => { setIsEditing(true); setCurrentId(r._id); setFormData({fullName:r.fullName, purok:r.purok, householdNo:r.householdNo, address:r.address}); setIsModalOpen(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                  <button className="icon-button" style={{ color: '#EF4444' }} onClick={() => handleDelete(r._id)}><FontAwesomeIcon icon={faTrash} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="report-card animate-fade-in" style={{ width: '95%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, marginBottom: '1.5rem' }}>{isEditing ? 'Edit Census Record' : 'Add to Community Census'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="Full Name" value={formData.fullName} onChange={e=>setFormData({...formData, fullName:e.target.value})} required className="search-input" style={{ paddingLeft: '1rem' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input placeholder="Purok (e.g. 1)" value={formData.purok} onChange={e=>setFormData({...formData, purok:e.target.value})} required className="search-input" style={{ paddingLeft: '1rem' }} />
                <input placeholder="Household #" value={formData.householdNo} onChange={e=>setFormData({...formData, householdNo:e.target.value})} required className="search-input" style={{ paddingLeft: '1rem' }} />
              </div>
              <textarea placeholder="Specific Address" value={formData.address} onChange={e=>setFormData({...formData, address:e.target.value})} className="search-input" style={{ paddingLeft: '1rem', minHeight: '80px' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={()=>setIsModalOpen(false)} className="button button--secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="button button--primary" style={{ flex: 1 }}>Save Record</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
