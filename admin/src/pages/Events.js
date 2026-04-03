import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPlus, faSearch, faTrashAlt, faEdit, faDownload
} from "@fortawesome/free-solid-svg-icons";

const API_URL = "http://localhost:5000/api/events";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEventId, setCurrentEventId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    capacityTotal: 0,
    category: "Medical",
    status: "Upcoming"
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await axios.get(API_URL);
      setEvents(res.data);
    } catch (err) {
      console.error("Error fetching events:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setFormData({
      title: "", description: "", date: "", startTime: "", 
      endTime: "", location: "", capacityTotal: 0, 
      category: "Medical", status: "Upcoming"
    });
    setIsModalOpen(true);
  };

  const openEditModal = (event) => {
    setIsEditing(true);
    setCurrentEventId(event._id);
    setFormData({ ...event });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${currentEventId}`, formData);
      } else {
        await axios.post(`${API_URL}/add`, formData);
      }
      fetchEvents();
      setIsModalOpen(false);
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this event?")) {
      await axios.delete(`${API_URL}/${id}`);
      fetchEvents();
    }
  };

  const filteredEvents = events.filter(e => 
    e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout 
      title="Event Management" 
      subtitle={`Organizing ${events.length} community health programs`}
      actions={
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="button button--secondary"><FontAwesomeIcon icon={faDownload} /> Export</button>
          <button className="button button--primary" onClick={openAddModal}><FontAwesomeIcon icon={faPlus} /> Create Event</button>
        </div>
      }
    >
      <section className="animate-fade-in" style={{ marginBottom: '2rem' }}>
        <div className="report-card" style={{ padding: '1rem', display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
            <input
              style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.75rem', borderRadius: '12px', border: '1px solid #E2E8F0', outline: 'none' }}
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className="table-wrapper animate-fade-in" style={{ overflowX: 'auto' }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Event Details</th>
              <th>Schedule</th>
              <th>Location</th>
              <th>Capacity</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEvents.map(evt => (
              <tr key={evt._id}>
                <td>
                  <div style={{ fontWeight: 800, color: '#1E293B' }}>{evt.title}</div>
                  <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{evt.category}</div>
                </td>
                <td>
                  <div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{evt.date}</div>
                  <div style={{ fontSize: '0.6875rem', color: '#94A3B8' }}>{evt.startTime} - {evt.endTime}</div>
                </td>
                <td><div style={{ fontSize: '0.8125rem' }}>{evt.location}</div></td>
                <td><div style={{ fontSize: '0.8125rem', fontWeight: 700 }}>{evt.capacityTaken}/{evt.capacityTotal}</div></td>
                <td><span className={`tag tag--${evt.status.toLowerCase()}`}>{evt.status}</span></td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-button" onClick={() => openEditModal(evt)}><FontAwesomeIcon icon={faEdit} /></button>
                    <button className="icon-button text-danger" onClick={() => handleDelete(evt._id)}><FontAwesomeIcon icon={faTrashAlt} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
          backgroundColor: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', 
          justifyContent: 'center', zIndex: 1000
        }}>
          <div className="report-card animate-fade-in" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>{isEditing ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input name="title" value={formData.title} onChange={handleInputChange} placeholder="Event Title" required className="input-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <textarea name="description" value={formData.description} onChange={handleInputChange} placeholder="Description" className="input-field" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0', minHeight: '80px' }} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="date" type="date" value={formData.date} onChange={handleInputChange} required style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <select name="category" value={formData.category} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
                  <option value="Medical">Medical</option>
                  <option value="Dental">Dental</option>
                  <option value="Seminar">Seminar</option>
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input name="startTime" type="time" value={formData.startTime} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
                <input name="endTime" type="time" value={formData.endTime} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              </div>
              <input name="location" value={formData.location} onChange={handleInputChange} placeholder="Location" style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: '1px solid #E2E8F0' }} />
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="button button--secondary" style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="button button--primary" style={{ flex: 1 }}>Save Event</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
