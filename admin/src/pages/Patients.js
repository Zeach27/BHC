import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Patients() {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/patients") // backend API
      .then((res) => setPatients(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Layout title="Residents" subtitle="All registered residents">
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>Address</th>
              <th>Contact</th>
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr key={p._id}>
                <td>{p.name}</td>
                <td>{p.age}</td>
                <td>{p.gender}</td>
                <td>{p.address}</td>
                <td>{p.contact}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  );
}

export default Patients;