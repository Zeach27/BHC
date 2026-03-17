import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const EVENTS = [
  {
    id: 1,
    title: "Vaccination Drive",
    description: "m,dfna,sfn,asfas nas nm",
    date: "2025-12-07",
    startTime: "08:00",
    endTime: "17:30",
    location: "Barangay Hall",
    capacityTotal: 100,
    capacityTaken: 100,
    category: "General",
    status: "Past",
  },
  {
    id: 2,
    title: "Vaccination",
    description: "sadascascasfasfasfasfasdfas",
    date: "2025-12-07",
    startTime: "08:00",
    endTime: "15:00",
    location: "Barangay Hall",
    capacityTotal: 100,
    capacityTaken: 100,
    category: "General",
    status: "Past",
  },
  {
    id: 3,
    title: "Vaccination day",
    description: "dasdasfsa fsafasafs",
    date: "2025-12-07",
    startTime: "09:00",
    endTime: "16:00",
    location: "Barangay Hall",
    capacityTotal: 100,
    capacityTaken: 100,
    category: "General",
    status: "Past",
  },
  {
    id: 4,
    title: "Dental Clean",
    description: "Clean",
    date: "2025-12-10",
    startTime: "02:30",
    endTime: "03:00",
    location: "Riverside",
    capacityTotal: 100,
    capacityTaken: 25,
    category: "General",
    status: "Today",
  },
];

function formatTimeRange(start, end) {
  return `${start} - ${end}`;
}

export default function Events() {
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All Dates");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const dates = useMemo(() => {
    const uniq = [...new Set(EVENTS.map((evt) => evt.date))];
    return uniq.sort();
  }, []);

  const filtered = useMemo(() => {
    return EVENTS.filter((evt) => {
      const matchesSearch =
        evt.title.toLowerCase().includes(search.toLowerCase()) ||
        evt.description.toLowerCase().includes(search.toLowerCase());

      const matchesDate =
        dateFilter === "All Dates" || evt.date === dateFilter;
      const matchesStatus =
        statusFilter === "All Status" || evt.status === statusFilter;

      return matchesSearch && matchesDate && matchesStatus;
    });
  }, [search, dateFilter, statusFilter]);

  const clearFilters = () => {
    setSearch("");
    setDateFilter("All Dates");
    setStatusFilter("All Status");
  };

  return (
    <Layout title="Events" subtitle="Events management and scheduling">
      <PageHeader
        title="Events Management"
        badge={`${EVENTS.length} Events`}
        primaryAction={{ label: "+ Add Event", onClick: () => {} }}
      />

      <section className="filters">
        <div className="filters__row">
          <input
            className="filters__search"
            placeholder="Search events..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="filters__select"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option>All Dates</option>
            {dates.map((date) => (
              <option key={date} value={date}>
                {date}
              </option>
            ))}
          </select>
          <select
            className="filters__select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option>All Status</option>
            <option>Past</option>
            <option>Today</option>
            <option>Upcoming</option>
          </select>
          <button
            type="button"
            className="button button--secondary"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        </div>
      </section>

      <section className="table-section">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th />
                <th>EVENT DETAILS</th>
                <th>SCHEDULE</th>
                <th>CAPACITY</th>
                <th>CATEGORY</th>
                <th>STATUS</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((evt) => (
                <tr key={evt.id}>
                  <td>
                    <input type="checkbox" aria-label="select event" />
                  </td>
                  <td>
                    <div className="event-cell">
                      <div className="event-cell__icon" aria-hidden="true">
                        📅
                      </div>
                      <div className="event-cell__detail">
                        <div className="event-cell__title">{evt.title}</div>
                        <div className="event-cell__desc">{evt.description}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div className="event-schedule">
                      <div className="event-schedule__date">{evt.date}</div>
                      <div className="event-schedule__time">
                        {formatTimeRange(evt.startTime, evt.endTime)}
                      </div>
                      <div className="event-schedule__location">{evt.location}</div>
                    </div>
                  </td>
                  <td>
                    <div className="capacity">
                      <div className="capacity__label">
                        {evt.capacityTotal} slots
                      </div>
                      <div className="capacity__bar">
                        <div
                          className="capacity__fill"
                          style={{
                            width: `${Math.round(
                              (evt.capacityTaken / evt.capacityTotal) * 100
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="tag">{evt.category}</span>
                  </td>
                  <td>
                    <span className={`tag tag--status tag--${evt.status.toLowerCase()}`}>
                      {evt.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label="Delete event"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
