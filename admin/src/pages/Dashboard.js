import React from "react";
import Layout from "../components/Layout";

function Dashboard() {
  const stats = {
    todaysAttendance: 1,
    totalEvents: 4,
    totalResidents: 9,
    totalAnnouncements: 5,
  };

  const upcomingEvents = [
    {
      title: "Dental Clean",
      date: "2025-12-10",
      location: "Riverside",
    },
  ];

  return (
    <Layout
      title="Dashboard Overview"
      subtitle="Real-time insights and quick actions for event management"
    >
      <section className="cards">
        <div className="card card--red">
          <div className="card__icon" aria-hidden="true">
            👥
          </div>
          <div className="card__content">
            <p className="card__label">Today's Attendance</p>
            <p className="card__value">{stats.todaysAttendance}</p>
          </div>
        </div>

        <div className="card card--blue">
          <div className="card__icon" aria-hidden="true">
            📅
          </div>
          <div className="card__content">
            <p className="card__label">Total Events</p>
            <p className="card__value">{stats.totalEvents}</p>
          </div>
        </div>

        <div className="card card--orange">
          <div className="card__icon" aria-hidden="true">
            👤
          </div>
          <div className="card__content">
            <p className="card__label">Total Residents</p>
            <p className="card__value">{stats.totalResidents}</p>
          </div>
        </div>

        <div className="card card--purple">
          <div className="card__icon" aria-hidden="true">
            📢
          </div>
          <div className="card__content">
            <p className="card__label">Total Announcements</p>
            <p className="card__value">{stats.totalAnnouncements}</p>
          </div>
        </div>
      </section>

      <section className="quick-actions">
        <button className="button button--primary" type="button">
          + Add Event
        </button>
        <button className="button button--success" type="button">
          📣 Post Announcement
        </button>
      </section>

      <section className="upcoming">
        <h2 className="section__title">Upcoming Events</h2>
        <div className="upcoming__list">
          {upcomingEvents.map((event) => (
            <div key={event.title} className="upcoming__item">
              <div className="upcoming__icon" aria-hidden="true">
                📅
              </div>
              <div>
                <p className="upcoming__title">{event.title}</p>
                <p className="upcoming__meta">
                  {event.date} at {event.location}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="reports">
        <h2 className="section__title">Quick Reports Overview</h2>
        <div className="reports__grid">
          <div className="report-card">
            <div className="report-card__label">Total Attendance</div>
            <div className="report-card__value">{stats.todaysAttendance}</div>
          </div>
          <div className="report-card report-card--right">
            <div className="report-card__label">Today's Attendance</div>
            <div className="report-card__value">{stats.todaysAttendance}</div>
          </div>
        </div>
        <button className="button button--secondary" type="button">
          View Full Reports
        </button>
      </section>
    </Layout>
  );
}

export default Dashboard;
