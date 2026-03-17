import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav style={{ padding: "10px", background: "#1976d2", color: "white" }}>
      <Link to="/" style={{ margin: "10px", color: "white" }}>Dashboard</Link>
      <Link to="/patients" style={{ margin: "10px", color: "white" }}>Patients</Link>
      <Link to="/appointments" style={{ margin: "10px", color: "white" }}>Appointments</Link>
    </nav>
  );
}

export default Navbar;