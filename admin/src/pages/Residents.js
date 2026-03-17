import React, { useMemo, useState } from "react";
import Layout from "../components/Layout";
import PageHeader from "../components/PageHeader";

const RESIDENTS = [
  {
    id: 12,
    username: "jessa",
    fullName: "jessa mae",
    email: "jessa@gmail.com",
    phone: "09295398202",
    address: "mapantad",
    joined: "2025-12-10 08:02:19",
  },
  {
    id: 11,
    username: "kaka",
    fullName: "Olivar Reyan Ryn",
    email: "reyanolivar19@gmail.com",
    phone: "09652292402",
    address: "mati city",
    joined: "2025-12-10 07:08:52",
  },
  {
    id: 10,
    username: "reyans",
    fullName: "Reyan Ryn P. Olivar",
    email: "reyanolivar19@gmail.com",
    phone: "09652292402",
    address: "Dahican",
    joined: "2025-12-09 20:07:10",
  },
  {
    id: 9,
    username: "irene",
    fullName: "irene rollorata",
    email: "irene@gmail.com",
    phone: "09532136293",
    address: "Mati",
    joined: "2025-12-09 16:47:36",
  },
  {
    id: 8,
    username: "ars",
    fullName: "ars rollorata",
    email: "ars@gmail.com",
    phone: "09354490650",
    address: "Riverside",
    joined: "2025-12-09 13:42:13",
  },
  {
    id: 7,
    username: "maxine",
    fullName: "Maxine Manlangit",
    email: "maxinemanlangit@gmail.com",
    phone: "09652292402",
    address: "Mati City Davao Oreintal",
    joined: "2025-12-08 13:16:02",
  },
  {
    id: 6,
    username: "aime",
    fullName: "Aime Joyce Sarita",
    email: "aime@gmail.com",
    phone: "09652292402",
    address: "Mati City Davao Oreintal",
    joined: "2025-12-06 22:56:48",
  },
  {
    id: 5,
    username: "arlene",
    fullName: "Arlene Rollorata",
    email: "arlen@gmail.com",
    phone: "09652292402",
    address: "Mati City Davao Oreintal",
    joined: "2025-12-06 17:22:36",
  },
  {
    id: 2,
    username: "reyan",
    fullName: "Reyan Ryn P. Olivar",
    email: "reyan@gmail.com",
    phone: "09652292402",
    address: "Mati City Davao Oreintal",
    joined: "2025-12-06 15:43:10",
  },
];

export default function Residents() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return RESIDENTS;

    const lower = search.trim().toLowerCase();
    return RESIDENTS.filter((resident) => {
      return (
        resident.username.toLowerCase().includes(lower) ||
        resident.fullName.toLowerCase().includes(lower) ||
        resident.email.toLowerCase().includes(lower)
      );
    });
  }, [search]);

  return (
    <Layout title="Residents" subtitle="Resident management and directory">
      <PageHeader
        title="Residents Management"
        badge={`${RESIDENTS.length} Residents`}
      />
      <section className="filters">
        <div className="filters__row">
          <input
            className="filters__search"
            placeholder="Search residents..."
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
                <th>ID</th>
                <th>Username</th>
                <th>Full Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Address</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((resident) => (
                <tr key={resident.id}>
                  <td>{resident.id}</td>
                  <td>{resident.username}</td>
                  <td>{resident.fullName}</td>
                  <td>{resident.email}</td>
                  <td>{resident.phone}</td>
                  <td>{resident.address}</td>
                  <td>{resident.joined}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </Layout>
  );
}
