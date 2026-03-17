import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Events from "./pages/Events";
import Residents from "./pages/Residents";
import Attendance from "./pages/Attendance";
import Announcements from "./pages/Announcements";
import Reports from "./pages/Reports";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/events" element={<Events />} />
        <Route path="/residents" element={<Residents />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/announcements" element={<Announcements />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/appointments" element={<Appointments />} />
      </Routes>
    </Router>
  );
}

export default App;