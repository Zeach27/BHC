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
  faSearch
} from "@fortawesome/free-solid-svg-icons";

function Patients() {
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "Male",
    address: "",
    contact: ""
  });

  const API_URL = "http://localhost:5000/api/patients";

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const res = await axios.get(API_URL);
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({ name: "", age: "", gender: "Male", address: "", contact: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (patient) => {
    setIsEditing(true);
    setCurrentPatientId(patient._id);
    setFormData({
      name: patient.name,
      age: patient.age,
      gender: patient.gender,
      address: patient.address,
      contact: patient.contact
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentPatientId}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      fetchPatients();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving patient:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient record?")) {
      try {
        await axios.delete(`${API_URL}/${id}`);
        fetchPatients();
      } catch (err) {
        console.error("Error deleting patient:", err);
      }
    }
  };

  const filteredPatients = patients.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.contact.includes(searchTerm)
  );

  const headerActions = (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button className="button button--secondary">
        <FontAwesomeIcon icon={faDownload} />
        Export CSV
      </button>
      <button className="button button--primary" onClick={openAddModal} style={{ boxShadow: '0 4px 6px -1px rgba(65, 105, 225, 0.2)' }}>
        <FontAwesomeIcon icon={faPlus} />
        Register Patient
      </button>
    </div>
  );

  return (
    <Layout 
      title="Patients Directory" 
      subtitle={`Manage and track ${patients.length} patient records`}
      actions={headerActions}
    >
      {/* Search Section */}
      <section style={{ marginBottom: '2rem' }} className="animate-fade-in">
        <div className="report-card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '0.875rem', backgroundColor: '#F8FAFC' }}
              placeholder="Search by name, address, or contact..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="button button--secondary">
            <FontAwesomeIcon icon={faFilter} />
            Filters
          </button>
        </div>
      </section>

      {/* Table Section */}
      <div className="table-wrapper animate-fade-in" style={{ animationDelay: '0.1s', overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th style={{ width: '25%' }}>Patient Details</th>
              <th>Age/Gender</th>
              <th>Full Address</th>
              <th>Contact Details</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? filteredPatients.map((p) => (
              <tr key={p._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ 
                      width: '40px', 
                      height: '40px', 
                      borderRadius: '12px', 
                      backgroundColor: '#E8EFFF', 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      color: '#4169E1',
                      fontWeight: 800,
                      fontSize: '0.875rem'
                    }}>
                      {p.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9375rem' }}>{p.name}</div>
                      <div style={{ fontSize: '0.6875rem', color: '#64748B', fontWeight: 600 }}>ID: {p._id.slice(-6).toUpperCase()}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#475569' }}>{p.age} years old</span>
                    <span style={{ fontSize: '0.6875rem', color: '#94A3B8', fontWeight: 600, textTransform: 'uppercase' }}>{p.gender}</span>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', color: '#475569', maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {p.address}
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: '#475569' }}>
                    {p.contact}
                  </div>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-button" onClick={() => openEditModal(p)} title="Edit" style={{ backgroundColor: '#F1F5F9' }}>
                      <FontAwesomeIcon icon={faEdit} style={{ fontSize: '0.8125rem' }} />
                    </button>
                    <button className="icon-button" onClick={() => handleDelete(p._id)} title="Delete" style={{ backgroundColor: '#FEF2F2', color: '#EF4444' }}>
                      <FontAwesomeIcon icon={faTrash} style={{ fontSize: '0.8125rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '5rem 0' }}>
                  <div style={{ color: '#94A3B8' }}>
                    <FontAwesomeIcon icon={faUserInjured} size="3x" style={{ marginBottom: '1.5rem', opacity: 0.1 }} />
                    <p style={{ fontSize: '1rem', fontWeight: 700, color: '#475569', margin: '0 0 4px 0' }}>No patient records found</p>
                    <p style={{ fontSize: '0.875rem' }}>Try refining your search or register a new patient</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Register/Edit Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 3000

        }}>
          <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', border: 'none', background: 'none', cursor: 'pointer', color: '#94A3B8' }}
            >
              <FontAwesomeIcon icon={faTimes} size="lg" />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {isEditing ? "Edit Patient Record" : "Register New Patient"}
            </h2>
            <p style={{ fontSize: '0.875rem', color: '#64748B', marginBottom: '1.5rem' }}>
              Fill in the details below to {isEditing ? "update the" : "create a new"} record.
            </p>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>FULL NAME</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                  placeholder="e.g. Juan Dela Cruz"
                />
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>AGE</label>
                  <input 
                    name="age"
                    type="number"
                    value={formData.age}
                    onChange={handleInputChange}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                    placeholder="Years"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>GENDER</label>
                  <select 
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', background: 'white' }}
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>CONTACT NUMBER</label>
                <input 
                  name="contact"
                  value={formData.contact}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none' }}
                  placeholder="e.g. 09123456789"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', display: 'block', marginBottom: '4px' }}>FULL ADDRESS</label>
                <textarea 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                  style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', minHeight: '80px', fontFamily: 'inherit' }}
                  placeholder="Street, Barangay, City"
                />
              </div>

              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="button button--secondary" 
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="button button--primary" 
                  style={{ flex: 1 }}
                >
                  {isEditing ? "Update Patient" : "Register Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}

export default Patients;
