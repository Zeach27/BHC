import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const EVENTS = [
  { id: "e1", name: "Dental Clean", date: "2025-12-10" },
  { id: "e2", name: "Vaccination Drive", date: "2025-12-07" },
  { id: "e3", name: "Community Health Talk", date: "2025-12-08" },
];

const ATTENDANCE_RECORDS = [
  {
    id: 12,
    fullName: "jessa mae",
    event: "Dental Clean",
    checkIn: "2025-12-10 01:15:11",
  },
  {
    id: 11,
    fullName: "Reyan Ryn P. Olivar",
    event: "Vaccination Drive",
    checkIn: "2025-12-07 09:22:04",
  },
];

export default function Attendance() {
  const [selectedEvent, setSelectedEvent] = useState(EVENTS[0].id);
  const [selectedDate, setSelectedDate] = useState("2025-12-10");
  const [scanning, setScanning] = useState(false);
  const [lastScan, setLastScan] = useState(null);

  const eventsById = useMemo(
    () => EVENTS.reduce((acc, ev) => ({ ...acc, [ev.id]: ev }), {}),
    []
  );

  const filteredRecords = useMemo(() => {
    const eventName = eventsById[selectedEvent]?.name;
    return ATTENDANCE_RECORDS.filter(
      (record) =>
        (!eventName || record.event === eventName) &&
        (!selectedDate || record.checkIn.startsWith(selectedDate))
    );
  }, [selectedEvent, selectedDate, eventsById]);

  const handleScanStart = () => {
    setScanning(true);
    setLastScan({
      id: "N/A",
      fullName: "N/A",
      email: "N/A",
      phone: "N/A",
      scanTime: "N/A",
    });
  };

  const handleScanStop = () => {
    setScanning(false);
  };

  return (
    <Layout title="" subtitle="">
      <PageHeader
        title="Event Attendance Management"
        primaryAction={{ label: "", onClick: () => {} }}
      />

      <div className="attendance-grid">
        <div className="attendance-card">
          <div className="attendance-card__section">
            <h3 className="attendance-card__title">Select Event</h3>
            <select
              className="filters__select"
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              {EVENTS.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name}
                </option>
              ))}
            </select>
          </div>

          <div className="attendance-card__section">
            <div className="scanner-header">
              <h3 className="attendance-card__title">QR Code Scanner</h3>
              <span className="scanner-status">
                {scanning ? "Scanning" : "Ready"}
              </span>
            </div>
            <div className="scanner-box">
              <div className="scanner-placeholder">
                <div className="scanner-placeholder__icon">📷</div>
                <div className="scanner-placeholder__text">
                  Position QR Code within frame
                </div>
                <div className="scanner-placeholder__sub">
                  Camera will activate when scanning starts
                </div>
              </div>
            </div>

            <div className="scanner-actions">
              <button
                className="button button--primary"
                type="button"
                onClick={handleScanStart}
              >
                Start Scanning
              </button>
              <button
                className="button button--secondary"
                type="button"
                onClick={handleScanStop}
              >
                Stop Scanning
              </button>
            </div>
            <div className="attendance-note">
              Select an event above and click “Start Scanning” to begin
            </div>
          </div>

          <div className="attendance-card__section attendance-card__section--info">
            <h3 className="attendance-card__title">Last Scan Info</h3>
            <div className="info-grid">
              <div className="info-row">
                <span className="info-label">ID No:</span>
                <span className="info-value">{lastScan?.id ?? "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Full Name:</span>
                <span className="info-value">{lastScan?.fullName ?? "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Email:</span>
                <span className="info-value">{lastScan?.email ?? "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Phone No:</span>
                <span className="info-value">{lastScan?.phone ?? "N/A"}</span>
              </div>
              <div className="info-row">
                <span className="info-label">Scan Time:</span>
                <span className="info-value">{lastScan?.scanTime ?? "N/A"}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="attendance-card attendance-card--records">
          <div className="attendance-records__header">
            <h3 className="attendance-card__title">Attendance Records</h3>
            <div className="attendance-records__count">
              {filteredRecords.length} records
            </div>
          </div>

          <div className="attendance-records__filters">
            <div className="filters__row">
              <label className="filters__label">Filter by Date</label>
              <input
                className="filters__date"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
              />
              <button
                className="button button--primary"
                type="button"
                onClick={() => setSelectedDate("")}
              >
                Filter
              </button>
            </div>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID NO</th>
                  <th>FULL NAME</th>
                  <th>EVENT ATTENDED</th>
                  <th>CHECK-IN TIME</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id}>
                    <td>{record.id}</td>
                    <td>{record.fullName}</td>
                    <td>
                      <span className="tag tag--today">{record.event}</span>
                    </td>
                    <td>
                      <span className="tag tag--today">{record.checkIn}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
