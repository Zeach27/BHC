import React from "react";
import Layout from "../components/Layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faCalendarAlt, 
  faUserFriends, 
  faBullhorn,
  faPlus,
  faChartLine,
  faArrowUp,
  faMapMarkerAlt,
  faCalendarDay,
  faUser
} from "@fortawesome/free-solid-svg-icons";

function Dashboard() {
  const stats = [
    { label: "Attendance", value: "12", icon: faUsers, color: "card--blue", trend: "+4%", trendUp: true },
    { label: "Active Events", value: "4", icon: faCalendarAlt, color: "card--purple", trend: "Steady", trendUp: null },
    { label: "Total Residents", value: "156", icon: faUserFriends, color: "card--orange", trend: "+2.5%", trendUp: true },
    { label: "Announcements", value: "5", icon: faBullhorn, color: "card--red", trend: "-12%", trendUp: false },
  ];

  const upcomingEvents = [
    {
      title: "Dental Cleaning Campaign",
      date: "Dec 10, 2025",
      location: "Riverside Center",
      month: "DEC",
      day: "10"
    },
    {
      title: "Health & Wellness Seminar",
      date: "Dec 15, 2025",
      location: "Main Hall",
      month: "DEC",
      day: "15"
    },
  ];

  const recentActivity = [
    { user: "Jessa Mae", action: "Checked in", event: "Dental Clean", time: "2 mins ago" },
    { user: "Admin", action: "Posted update", event: "Vaccination Drive", time: "1 hour ago" },
    { user: "Reyan Ryn", action: "Checked in", event: "Vaccination Drive", time: "3 hours ago" },
  ];

  return (
    <Layout
      title="Dashboard Overview"
      subtitle="Comprehensive insights and management for CHEMS operations"
    >
      <section className="cards animate-fade-in">
        {stats.map((stat, index) => (
          <div key={index} className={`card ${stat.color}`}>
            <div className="card__icon">
              <FontAwesomeIcon icon={stat.icon} />
            </div>
            <div className="card__content">
              <p className="card__label">{stat.label}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: '8px' }}>
                <p className="card__value">{stat.value}</p>
                {stat.trend && (
                  <span style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: 700, 
                    color: stat.trendUp === true ? '#10B981' : stat.trendUp === false ? '#EF4444' : '#6B7280',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    {stat.trendUp === true && <FontAwesomeIcon icon={faArrowUp} style={{ fontSize: '0.5rem' }} />}
                    {stat.trend}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </section>

      <div className="dashboard-grid">
        <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="section__title">
            <span>Upcoming Events</span>
            <button className="button button--secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}>View Schedule</button>
          </div>
          <div className="report-card" style={{ padding: '0.5rem' }}>
            {upcomingEvents.map((event, idx) => (
              <div key={idx} className="upcoming__item" style={{ borderBottom: idx !== upcomingEvents.length - 1 ? '1px solid #F3F4F6' : 'none', borderRadius: 0 }}>
                <div className="upcoming__icon" style={{ width: '48px', height: '48px', flexShrink: 0 }}>
                  <span className="upcoming__date-month" style={{ fontSize: '0.625rem' }}>{event.month}</span>
                  <span className="upcoming__date-day" style={{ fontSize: '1.125rem' }}>{event.day}</span>
                </div>
                <div style={{ flex: 1 }}>
                  <p className="upcoming__title" style={{ fontSize: '0.875rem', fontWeight: 700, margin: '0 0 4px 0' }}>{event.title}</p>
                  <div className="upcoming__meta" style={{ fontSize: '0.75rem', color: '#6B7280', display: 'flex', gap: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FontAwesomeIcon icon={faCalendarDay} style={{ fontSize: '0.6875rem' }} />
                      {event.date}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FontAwesomeIcon icon={faMapMarkerAlt} style={{ fontSize: '0.6875rem' }} />
                      {event.location}
                    </span>
                  </div>
                </div>
                <button className="button button--secondary" style={{ padding: '0.5rem 1rem' }}>Details</button>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1.5rem' }}>
            <div className="report-card" style={{ background: 'linear-gradient(135deg, #4169E1, #3154B3)', color: 'white', border: 'none' }}>
              <h3 style={{ fontSize: '0.875rem', margin: '0 0 0.5rem 0', opacity: 0.9 }}>Quick Actions</h3>
              <p style={{ fontSize: '0.75rem', margin: '0 0 1.25rem 0', opacity: 0.8 }}>Efficiently manage your community operations</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button className="button" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', justifyContent: 'flex-start', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <FontAwesomeIcon icon={faPlus} />
                  New Health Mission
                </button>
                <button className="button" style={{ background: 'rgba(255, 255, 255, 0.1)', color: 'white', justifyContent: 'flex-start', border: '1px solid rgba(255, 255, 255, 0.2)' }}>
                  <FontAwesomeIcon icon={faBullhorn} />
                  Post Announcement
                </button>
              </div>
            </div>
            
            <div className="report-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#E8EFFF', color: '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FontAwesomeIcon icon={faChartLine} style={{ fontSize: '0.875rem' }} />
                </div>
                <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>System Health</span>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '4px' }}>
                  <span style={{ color: '#6B7280' }}>Database Sync</span>
                  <span style={{ fontWeight: 700, color: '#10B981' }}>100%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                  <div style={{ width: '100%', height: '100%', background: '#10B981', borderRadius: '3px' }}></div>
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.6875rem', marginBottom: '4px' }}>
                  <span style={{ color: '#6B7280' }}>Storage Capacity</span>
                  <span style={{ fontWeight: 700, color: '#4169E1' }}>42%</span>
                </div>
                <div style={{ width: '100%', height: '6px', background: '#F3F4F6', borderRadius: '3px' }}>
                  <div style={{ width: '42%', height: '100%', background: '#4169E1', borderRadius: '3px' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <div className="section__title">Recent Activity</div>
          <div className="report-card">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {recentActivity.map((act, i) => (
                <div key={i} style={{ display: 'flex', gap: '12px' }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: i === 0 ? '#E0F2FE' : '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', color: i === 0 ? '#0284C7' : '#6B7280' }}>
                      <FontAwesomeIcon icon={faUser} style={{ fontSize: '0.75rem' }} />
                    </div>
                    {i !== recentActivity.length - 1 && (
                      <div style={{ position: 'absolute', top: '32px', left: '50%', width: '1px', height: '1.25rem', background: '#E5E7EB', transform: 'translateX(-50%)' }}></div>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: '0.8125rem', margin: 0, lineHeight: 1.4 }}>
                      <span style={{ fontWeight: 700 }}>{act.user}</span> {act.action.toLowerCase()} for <span style={{ fontWeight: 600, color: '#4169E1' }}>{act.event}</span>
                    </p>
                    <p style={{ fontSize: '0.6875rem', color: '#9CA3AF', margin: '2px 0 0 0' }}>{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="button button--secondary" style={{ width: '100%', marginTop: '1.5rem', padding: '0.625rem' }}>
              View Activity Log
            </button>
          </div>

          <div className="report-card" style={{ marginTop: '1.5rem', border: '1px dashed #D1D5DB', background: '#F9FAFB' }}>
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'white', border: '1px solid #E5E7EB', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem auto', color: '#9CA3AF' }}>
                <FontAwesomeIcon icon={faChartLine} />
              </div>
              <h4 style={{ fontSize: '0.8125rem', margin: '0 0 0.25rem 0' }}>Monthly Report Ready</h4>
              <p style={{ fontSize: '0.6875rem', color: '#6B7280', margin: '0 0 1rem 0' }}>The November health missions summary is now available.</p>
              <button className="button button--primary" style={{ width: '100%' }}>Download PDF</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
