import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUserPlus, faSearch, faTimes, faUserCircle, faPhone, 
  faMapMarkerAlt, faFilter, faDownload, faEdit, faTrash 
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/residents";

export default function Residents() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "", username: "", email: "", phone: "", address: ""
  });

  useEffect(() => {
    fetchResidents();
  }, []);

  const fetchResidents = async () => {
    try {
      const res = await axios.get(API_URL);
      setResidents(res.data);
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
      fetchResidents();
      setIsModalOpen(false);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this resident?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchResidents();
    }
  };

  const filtered = residents.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout title="Residents Directory" subtitle={`Managing ${residents.length} community members`}
      actions={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="button button--secondary"><FontAwesomeIcon icon={faDownload} /> Export</button>
          <button className="button button--primary" onClick={() => { setIsEditing(false); setFormData({fullName:"", username:"", email:"", phone:"", address:""}); setIsModalOpen(true); }}>
            <FontAwesomeIcon icon={faUserPlus} /> Add Resident
          </button>
        </div>
      }
    >
      <section className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div className="report-card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}
              placeholder="Search residents..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
        </div>
      </section>

      <div className="table-wrapper animate-fade-in" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Resident Profile</th>
              <th>Contact</th>
              <th>Address</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', backgroundColor: '#E8EFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4169E1' }}>
                      <FontAwesomeIcon icon={faUserCircle} size="lg" />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800 }}>{r.fullName}</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748B' }}>@{r.username}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.email}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>{r.phone}</div>
                </td>
                <td><div style={{ fontSize: '0.8125rem' }}>{r.address}</div></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-button" onClick={() => { setIsEditing(true); setCurrentId(r._id); setFormData({...r}); setIsModalOpen(true); }}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="icon-button text-danger" onClick={() => handleDelete(r._id)}><FontAwesomeIcon icon={faTrash} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, backdropFilter: 'blur(4px)' }}>
          <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2>{isEditing ? 'Edit Resident' : 'Add New Resident'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
              <input name="fullName" value={formData.fullName} onChange={(e)=>setFormData({...formData, fullName: e.target.value})} placeholder="Full Name" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <input name="username" value={formData.username} onChange={(e)=>setFormData({...formData, username: e.target.value})} placeholder="Username" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <input name="email" type="email" value={formData.email} onChange={(e)=>setFormData({...formData, email: e.target.value})} placeholder="Email Address" required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <input name="phone" value={formData.phone} onChange={(e)=>setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <input name="address" value={formData.address} onChange={(e)=>setFormData({...formData, address: e.target.value})} placeholder="Address" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="button button--secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="button button--primary" style={{ flex: 1 }}>Save Resident</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
