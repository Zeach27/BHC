import React from "react";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faDownload, 
  faFilter, 
  faChartLine, 
  faUsers, 
  faCalendarCheck, 
  faFileMedical,
  faArrowUp,
  faArrowDown,
  faFilePdf,
  faEye
} from "@fortawesome/free-solid-svg-icons";

const RECENT_REPORTS = [
  { id: "REP-2024-001", name: "Monthly Health Summary", type: "Statistical", date: "2024-03-01", size: "1.2 MB", status: "Ready" },
  { id: "REP-2024-002", name: "Vaccination Drive Audit", type: "Operational", date: "2024-03-15", size: "850 KB", status: "Ready" },
  { id: "REP-2024-003", name: "Resident Demographics", type: "Demographic", date: "2024-03-20", size: "2.4 MB", status: "Generating" },
];

export default function Reports() {
  const reportCards = [
    { label: "Consultations", value: "1,284", change: "+12%", trendUp: true, icon: faFileMedical, color: "card--blue" },
    { label: "Active Patients", value: "942", change: "+2.4%", trendUp: true, icon: faUsers, color: "card--purple" },
    { label: "Event Reach", value: "856", change: "-5%", trendUp: false, icon: faCalendarCheck, color: "card--orange" },
    { label: "Wait Time", value: "18m", change: "-10%", trendUp: true, icon: faChartLine, color: "card--red" },
  ];

  const headerActions = (
    <div style={{ display: 'flex', gap: '0.75rem' }}>
      <button className="button button--secondary">
        <FontAwesomeIcon icon={faFilter} />
        Date Range
      </button>
      <button className="button button--primary" style={{ boxShadow: '0 4px 6px -1px rgba(65, 105, 225, 0.2)' }}>
        <FontAwesomeIcon icon={faDownload} />
        Export Dashboard
      </button>
    </div>
  );

  return (
    <Layout 
      title="Analytics & Reports" 
      subtitle="Data-driven insights for community health management"
      actions={headerActions}
    >
      <section className="cards animate-fade-in">
        {reportCards.map((report, idx) => (
          <div key={idx} className={`card ${report.color}`}>
            <div className="card__icon">
              <FontAwesomeIcon icon={report.icon} />
            </div>
            <div className="card__content">
              <p className="card__label">{report.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '6px' }}>
                <p className="card__value">{report.value}</p>
                <span style={{ 
                  fontSize: '0.6875rem', 
                  fontWeight: 800, 
                  color: report.trendUp ? '#10B981' : '#EF4444',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '2px'
                }}>
                  <FontAwesomeIcon icon={report.trendUp ? faArrowUp : faArrowDown} style={{ fontSize: '0.5rem' }} />
                  {report.change}
                </span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }} className="animate-fade-in">
        <div className="report-card" style={{ height: '360px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800 }}>Consultation Trends</h3>
              <p style={{ margin: '4px 0 0 0', fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Total visits recorded in 2024</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="button button--secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.625rem', fontWeight: 800 }}>MONTHLY</button>
              <button className="button button--secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.625rem', fontWeight: 800, background: '#F1F5F9' }}>WEEKLY</button>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: '12px' }}>
             <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: '100%', gap: '10px', paddingBottom: '10px', borderBottom: '1px solid #F1F5F9' }}>
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                  <div key={i} style={{ 
                    flex: 1, 
                    background: i === 11 ? 'linear-gradient(to top, #4169E1, #638EF1)' : '#F1F5F9', 
                    height: `${h}%`, 
                    borderRadius: '6px 6px 0 0', 
                    transition: 'height 1s cubic-bezier(0.4, 0, 0.2, 1)',
                    position: 'relative'
                  }}>
                    {i === 11 && (
                      <div style={{ position: 'absolute', top: '-24px', left: '50%', transform: 'translateX(-50%)', background: '#1E293B', color: 'white', fontSize: '0.625rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 800 }}>
                        Current
                      </div>
                    )}
                  </div>
                ))}
             </div>
             <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.625rem', color: '#94A3B8', fontWeight: 800, letterSpacing: '0.05em' }}>
                <span>JAN</span><span>FEB</span><span>MAR</span><span>APR</span><span>MAY</span><span>JUN</span><span>JUL</span><span>AUG</span><span>SEP</span><span>OCT</span><span>NOV</span><span>DEC</span>
             </div>
          </div>
        </div>

        <div className="report-card">
          <h3 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: 800 }}>Service Utilization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {[
              { name: "General Checkup", count: 450, percentage: 85, color: "#4169E1" },
              { name: "Dental Cleaning", count: 320, percentage: 65, color: "#8B5CF6" },
              { name: "Vaccination", count: 210, percentage: 45, color: "#10B981" },
              { name: "Pediatrics", count: 180, percentage: 35, color: "#F59E0B" },
            ].map((service, idx) => (
              <div key={idx}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#1E293B' }}>{service.name}</span>
                  <span style={{ color: '#64748B', fontSize: '0.75rem', fontWeight: 700 }}>{service.count}</span>
                </div>
                <div style={{ height: '8px', backgroundColor: '#F1F5F9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: `${service.percentage}%`, height: '100%', backgroundColor: service.color, borderRadius: '4px' }} />
                </div>
              </div>
            ))}
          </div>
          <button className="button button--secondary" style={{ width: '100%', marginTop: '2rem', padding: '0.75rem', fontWeight: 800, fontSize: '0.75rem', borderRadius: '10px' }}>
            View Statistical Data
          </button>
        </div>
      </div>

      <div className="table-wrapper animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9' }}>
           <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 800 }}>Recently Generated Reports</h3>
        </div>
        <table className="data-table">
          <thead>
            <tr>
              <th>Report ID</th>
              <th>Report Name</th>
              <th>Type</th>
              <th>Date Generated</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {RECENT_REPORTS.map((report) => (
              <tr key={report.id}>
                <td style={{ fontWeight: 800, color: '#94A3B8', fontFamily: 'monospace' }}>{report.id}</td>
                <td style={{ fontWeight: 700, color: '#1E293B' }}>{report.name}</td>
                <td><span style={{ fontSize: '0.625rem', fontWeight: 800, padding: '2px 8px', borderRadius: '6px', background: '#F1F5F9', color: '#475569' }}>{report.type.toUpperCase()}</span></td>
                <td style={{ fontSize: '0.8125rem', color: '#64748B', fontWeight: 600 }}>{report.date}</td>
                <td>
                  <span className={`tag ${report.status === 'Ready' ? 'tag--today' : 'tag--upcoming'}`} style={{ fontWeight: 800 }}>
                    {report.status.toUpperCase()}
                  </span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                    <button className="icon-button" title="View PDF" style={{ backgroundColor: '#F1F5F9' }}>
                      <FontAwesomeIcon icon={faEye} style={{ fontSize: '0.8125rem' }} />
                    </button>
                    <button className="icon-button" title="Download" style={{ backgroundColor: '#E8EFFF', color: '#4169E1' }}>
                      <FontAwesomeIcon icon={faDownload} style={{ fontSize: '0.8125rem' }} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}
