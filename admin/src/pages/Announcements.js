import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const ANNOUNCEMENTS = [
  {
    id: 1,
    title: "General Wellness Announcement",
    content:
      "Stay Healthy, Stay Informed! Regular check-ups, a balanced diet, and daily movement can make a big difference. Visit our health center for free screening services.",
    posted: "2025-12-10 07:54:34",
  },
  {
    id: 2,
    title: "Free Comprehensive Health Check-Up",
    content:
      "Take advantage of our complimentary check-up service, designed to provide an initial assessment of your overall health. Our medical team will be available every Friday.",
    posted: "2025-12-10 07:49:17",
  },
  {
    id: 3,
    title: "sadasdasd",
    content: "sdasdasdsd",
    posted: "2025-12-10 07:42:38",
  },
  {
    id: 4,
    title: "Clean Up Drive",
    content: "asdasfasfasfasafs",
    posted: "2025-12-06 22:57:59",
  },
  {
    id: 5,
    title: "Survey of Household",
    content: "kasdmkalsfmkasfmcfcakcla",
    posted: "2025-12-06 22:54:32",
  },
];

export default function Announcements() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return ANNOUNCEMENTS;
    const lower = search.trim().toLowerCase();
    return ANNOUNCEMENTS.filter((announcement) => {
      return (
        announcement.title.toLowerCase().includes(lower) ||
        announcement.content.toLowerCase().includes(lower)
      );
    });
  }, [search]);

  return (
    <Layout title="Announcements" subtitle="Post and manage announcements">
      <PageHeader
        title="Announcements"
        primaryAction={{ label: "Add Announcement", onClick: () => {} }}
      />

      <section className="filters">
        <div className="filters__row">
          <input
            className="filters__search"
            placeholder="Search announcements..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button
            type="button"
            className="button button--secondary"
            onClick={() => setSearch("")}
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
                <th>Title</th>
                <th>Content</th>
                <th>Posted</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td className="content-cell">{item.content}</td>
                  <td>{item.posted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
