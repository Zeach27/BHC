import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";
import Calendar from "../components/Calendar";
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUsers, 
  faCalendarAlt, 
  faBullhorn, 
  faPlus, 
  faArrowUp,
  faArrowDown,
  faMapMarkerAlt, 
  faCalendarDay, 
  faSync, 
  faClock, 
  faFileMedical, 
  faNotesMedical, 
  faChartBar, 
  faChartLine,
  faUserTie,
  faCheckCircle
} from "@fortawesome/free-solid-svg-icons";

// Standardized Sparkline - Added minWidth and fixed height to avoid ResponsiveContainer warnings
const Sparkline = ({ data, color }) => {
  const chartData = (data || [0,0,0,0,0]).map((val) => ({ value: val }));
  return (
    <div style={{ width: 60, height: 24, minWidth: 60, minHeight: 24 }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData}>
          <Area type="monotone" dataKey="value" stroke={color} fill={color} fillOpacity={0.15} strokeWidth={1.5} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

const DigitalClock = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'white', padding: '6px 12px', borderRadius: '8px', border: '1px solid #E2E8F0', boxShadow: 'var(--shadow-sm)' }}>
      <FontAwesomeIcon icon={faClock} style={{ color: '#4169E1', fontSize: '0.8rem' }} />
      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1E293B' }}>
        {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </span>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [adminName] = useState(localStorage.getItem("adminName") || "Administrator");
  const [chartView, setChartView] = useState('Daily');
  const [screenWidth, setScreenWidth] = useState(typeof window !== "undefined" ? window.innerWidth : 1280);
  const isTablet = screenWidth <= 1024;
  const isMobile = screenWidth <= 640;
  
  const [stats, setStats] = useState([
    { label: "Visits", value: "0", icon: faFileMedical, color: "card--blue", path: "/records", history: [5, 8, 12, 7, 10, 15, 12] },
    { label: "Programs", value: "0", icon: faCalendarAlt, color: "card--purple", path: "/events", history: [2, 3, 4, 3, 5, 4, 4] },
    { label: "App Users", value: "0", icon: faUsers, color: "card--orange", path: "/residents", history: [140, 142, 145, 148, 150, 153, 156] },
    { label: "BHW Staff", value: "0", icon: faUserTie, color: "card--emerald", path: "/staff", history: [2, 3, 3, 4, 4, 5, 4] },
    { label: "Alerts", value: "0", icon: faBullhorn, color: "card--red", path: "/announcements", history: [2, 1, 3, 2, 4, 5, 5] },
  ]);

  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [morbidity, setMorbidity] = useState([]);
  const [purokData, setPurokData] = useState([]);
  const [demographicData, setDemographicData] = useState([]);
  const [programData, setProgramBreakdown] = useState([]);
  const [dailyTrend, setDailyTrend] = useState([]);
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [yearlyTrend, setYearlyTrend] = useState([]);
  const [rawEvents, setRawEvents] = useState([]);
  const [rawSchedules, setRawSchedules] = useState([]);
  const [rawAppointments, setRawAppointments] = useState([]);

  const hasValue = (arr, key) => Array.isArray(arr) && arr.some((item) => Number(item?.[key]) > 0);

  const dailyFallback = [
    { date: "Mon", visits: 2 }, { date: "Tue", visits: 3 }, { date: "Wed", visits: 4 },
    { date: "Thu", visits: 3 }, { date: "Fri", visits: 5 }, { date: "Sat", visits: 4 }, { date: "Sun", visits: 3 }
  ];

  const monthlyFallback = [
    { month: "Jan", visits: 12 }, { month: "Feb", visits: 16 }, { month: "Mar", visits: 14 },
    { month: "Apr", visits: 18 }, { month: "May", visits: 21 }, { month: "Jun", visits: 19 },
    { month: "Jul", visits: 22 }, { month: "Aug", visits: 24 }, { month: "Sep", visits: 20 },
    { month: "Oct", visits: 25 }, { month: "Nov", visits: 23 }, { month: "Dec", visits: 26 }
  ];

  const yearlyFallback = [
    { year: (new Date().getFullYear() - 4).toString(), visits: 95 },
    { year: (new Date().getFullYear() - 3).toString(), visits: 122 },
    { year: (new Date().getFullYear() - 2).toString(), visits: 145 },
    { year: (new Date().getFullYear() - 1).toString(), visits: 171 },
    { year: new Date().getFullYear().toString(), visits: 186 }
  ];

  const simplifyDiagnosisLabel = (label = "") => {
    const text = String(label).toLowerCase();
    if (text.includes("hypertension") || text.includes("high blood")) return "High Blood Pressure";
    if (text.includes("diabetes") || text.includes("blood sugar")) return "High Blood Sugar";
    if (text.includes("respiratory") || text.includes("asthma") || text.includes("cough")) return "Breathing Problem";
    if (text.includes("fever") || text.includes("flu") || text.includes("cold")) return "Fever / Flu";
    if (text.includes("pregnan") || text.includes("prenatal")) return "Pregnancy Care";
    if (text.includes("immun") || text.includes("vaccine")) return "Vaccination";
    if (text.includes("consult") || text.includes("check") || text.includes("follow")) return "General Checkup";
    return label;
  };

  const getTrend = (history = []) => {
    if (!Array.isArray(history) || history.length < 2) return { up: true, text: "0%" };
    const prev = Number(history[history.length - 2]) || 0;
    const curr = Number(history[history.length - 1]) || 0;
    if (prev === 0) return { up: curr >= prev, text: `${curr > 0 ? 100 : 0}%` };
    const pct = Math.round(((curr - prev) / prev) * 100);
    return { up: pct >= 0, text: `${Math.abs(pct)}%` };
  };

  const formatTimeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => {
    const onResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const fetchDashboardData = useCallback(async () => {
    setLoading(true);
    const apiBase = "http://localhost:5000/api";
    try {
      const endpoints = [
        `${apiBase}/records`,
        `${apiBase}/events`,
        `${apiBase}/patients`,
        `${apiBase}/announcements`,
        `${apiBase}/schedules`,
        `${apiBase}/users`,
        `${apiBase}/residents`,
        `${apiBase}/appointments`
      ];

      // Promise.allSettled ensures that one failing endpoint (like /api/users 404) 
      // doesn't break the entire dashboard data loading.
      const results = await Promise.allSettled(endpoints.map(url => axios.get(url)));
      
      const [recRes, evtRes, patRes, annRes, schRes, userRes, resRes, apptRes] = results.map(r => 
        r.status === 'fulfilled' ? r.value.data : []
      );

      // Log errors for debugging
      results.forEach((r, i) => {
        if (r.status === 'rejected') {
          console.warn(`Dashboard Fetch Warning: Failed to load ${endpoints[i]} - ${r.reason.message}`);
        }
      });

      const records = recRes || [];
      const events = evtRes || [];
      const patients = patRes || [];
      const residents = resRes || [];
      const schedules = schRes || [];
      const announcements = annRes || [];
      const appointments = apptRes || [];

      setRawEvents(events);
      setRawSchedules(schedules);
      setRawAppointments(appointments);

      // 1. Purok Density
      const pMap = {};
      residents.forEach(r => { const p = `Purok ${r.purok || '?'}`; pMap[p] = (pMap[p] || 0) + 1; });
      setPurokData(Object.entries(pMap).map(([name, value]) => ({ name, value })).sort((a,b) => b.value - a.value).slice(0, 5));

      // 2. Patient Profiles
      const ageGroups = { 'Pediatric': 0, 'Teen': 0, 'Adult': 0, 'Senior': 0 };
      patients.forEach(p => {
        const a = p.age || 0;
        if (a <= 12) ageGroups['Pediatric']++;
        else if (a <= 19) ageGroups['Teen']++;
        else if (a <= 59) ageGroups['Adult']++;
        else ageGroups['Senior']++;
      });
      setDemographicData(Object.entries(ageGroups).map(([name, value]) => ({ name, value })));

      // 3. Morbidity (Top Health Concerns)
      const sMap = {};
      records.forEach(r => { const d = r.diagnosis || "Checkup"; sMap[d] = (sMap[d] || 0) + 1; });
      setMorbidity(Object.entries(sMap).map(([name, count]) => ({ name: simplifyDiagnosisLabel(name), count })).sort((a,b) => b.count - a.count).slice(0, 5));

      // 4. Program Share
      const totalCount = records.length || 1;
      const preCount = schedules.filter(s => s.scheduleType === 'Prenatal' && s.status === 'Completed').length;
      const vacCount = schedules.filter(s => (s.scheduleType === 'Immunization' || s.service?.toLowerCase().includes('vaccine')) && s.status === 'Completed').length;
      setProgramBreakdown([
        { name: 'Prenatal', value: Math.round((preCount/totalCount)*100), color: '#EC4899' },
        { name: 'Vaccine', value: Math.round((vacCount/totalCount)*100), color: '#8B5CF6' },
        { name: 'General', value: Math.max(0, 100 - (Math.round((preCount/totalCount)*100) + Math.round((vacCount/totalCount)*100))), color: '#4169E1' }
      ]);

      // 5. Stats Cards
      const todayStart = new Date();
      todayStart.setHours(0,0,0,0);
      
      setStats(prev => [
        { ...prev[0], value: records.length.toString() },
        { ...prev[1], value: events.filter(e => new Date(e.date) >= todayStart).length.toString() },
        { ...prev[2], value: residents.length.toString() },
        { ...prev[3], value: (userRes || []).length.toString() },
        { ...prev[4], value: announcements.length.toString() },
      ]);

      // 6. Trends
      const now = new Date();
      const last7 = [...Array(7)].map((_, i) => {
        const d = new Date(); d.setDate(d.getDate() - (6 - i));
        return { date: d.toLocaleDateString('en-US', { weekday: 'short' }), visits: 0, ts: d.setHours(0,0,0,0) };
      });
      records.forEach(r => {
        const d = new Date(r.createdAt || r.date || now).setHours(0,0,0,0);
        const m = last7.find(x => x.ts === d); if(m) m.visits++;
      });
      setDailyTrend(last7);

      const last12 = [...Array(12)].map((_, i) => {
        const d = new Date(); d.setMonth(d.getMonth() - (11 - i));
        return { month: d.toLocaleString('en-US', { month: 'short' }), visits: 0, key: `${d.getFullYear()}-${d.getMonth()}` };
      });
      records.forEach(r => {
        const d = new Date(r.createdAt || r.date || now);
        const m = last12.find(x => x.key === `${d.getFullYear()}-${d.getMonth()}`); if(m) m.visits++;
      });
      setMonthlyTrend(last12);

      const last5 = [...Array(5)].map((_, i) => ({ year: (now.getFullYear() - (4 - i)).toString(), visits: 0 }));
      records.forEach(r => {
        const y = new Date(r.createdAt || r.date || now).getFullYear().toString();
        const m = last5.find(x => x.year === y); if(m) m.visits++;
      });
      setYearlyTrend(last5);

      // 7. Upcoming Programs (Using todayStart for accurate inclusion)
      const upcomingFromEvents = events
        .filter(e => new Date(e.date) >= todayStart)
        .slice(0, 3)
        .map(e => ({
          title: e.title,
          date: new Date(e.date).toLocaleDateString(),
          location: e.location || "Center",
          type: "Event"
        }));

      const upcomingFromSchedules = schedules
        .filter(s => new Date(s.date || s.scheduleDate) >= todayStart)
        .slice(0, 3)
        .map(s => ({
          title: s.title || s.service || "Clinic Schedule",
          date: new Date(s.date || s.scheduleDate).toLocaleDateString(),
          location: s.location || "Health Center",
          type: "Schedule"
        }));

      const upcomingFromAppointments = appointments
        .filter(a => new Date(a.date || a.appointmentDate || a.scheduleDate) >= todayStart)
        .slice(0, 3)
        .map(a => ({
          title: a.title || a.patientName || a.patient?.name || "Patient Appointment",
          date: new Date(a.date || a.appointmentDate || a.scheduleDate).toLocaleDateString(),
          location: a.location || "Consultation Room",
          type: "Appointment"
        }));

      const mergedUpcoming = [...upcomingFromEvents, ...upcomingFromAppointments, ...upcomingFromSchedules]
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .slice(0, 5);

      setUpcomingEvents(mergedUpcoming);

      // 8. Activity Log
      const activityData = [
        ...records.map(r => ({ user: r.patient?.name || "Patient", action: "Completed Checkup", event: simplifyDiagnosisLabel(r.diagnosis || "Consultation"), ts: new Date(r.createdAt || r.date), type: 'record' })),
        ...announcements.map(a => ({ user: "Admin", action: "Posted Announcement", event: a.title, ts: new Date(a.createdAt || now), type: 'alert' })),
        ...appointments.slice(0, 5).map(a => ({ user: a.patientName || a.patient?.name || "Patient", action: "Booked Appointment", event: a.service || a.title || "Clinic Visit", ts: new Date(a.createdAt || a.date || a.appointmentDate || now), type: 'appointment' })),
        ...schedules.slice(0, 5).map(s => ({ user: "Health Staff", action: "Scheduled Service", event: s.service || s.title || "Clinic Schedule", ts: new Date(s.createdAt || s.date || s.scheduleDate || now), type: 'schedule' }))
      ].sort((a,b) => b.ts - a.ts).slice(0, 8);
      
      setRecentActivity(activityData.map(a => ({ ...a, time: formatTimeAgo(a.ts) })));

    } catch (err) {
      console.error("DASHBOARD_FATAL_ERROR:", err.message);
      setDailyTrend(dailyFallback);
      setMonthlyTrend(monthlyFallback);
      setYearlyTrend(yearlyFallback);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchDashboardData(); }, [fetchDashboardData]);

  const activeTrendDataRaw = chartView === 'Daily' ? dailyTrend : (chartView === 'Monthly' ? monthlyTrend : yearlyTrend);
  const activeTrendData = hasValue(activeTrendDataRaw, 'visits')
    ? activeTrendDataRaw
    : (chartView === 'Daily' ? dailyFallback : chartView === 'Monthly' ? monthlyFallback : yearlyFallback);
  
  const morbidityData = morbidity.length > 0 ? morbidity : [{ name: 'No Data', count: 0 }];
  const profileData = demographicData.length > 0 ? demographicData : [
    { name: 'Pediatric', value: 0 }, { name: 'Teen', value: 0 }, { name: 'Adult', value: 0 }, { name: 'Senior', value: 0 }
  ];
  const densityData = purokData.length > 0 ? purokData : [{ name: 'No Data', value: 0 }];
  const programShareData = hasValue(programData, 'value') ? programData : [
    { name: 'Prenatal', value: 34, color: '#EC4899' },
    { name: 'Vaccine', value: 33, color: '#8B5CF6' },
    { name: 'General', value: 33, color: '#4169E1' }
  ];

  const statGradients = {
    "card--blue": "linear-gradient(135deg, #3B82F6, #2563EB)",
    "card--purple": "linear-gradient(135deg, #8B5CF6, #A855F7)",
    "card--orange": "linear-gradient(135deg, #F59E0B, #F97316)",
    "card--emerald": "linear-gradient(135deg, #10B981, #059669)",
    "card--red": "linear-gradient(135deg, #EF4444, #DC2626)"
  };

  const ui = {
    shell: { maxWidth: '1400px', margin: '0 auto', width: '100%' },
    dashboardGrid: {
      display: 'grid',
      gridTemplateColumns: screenWidth < 1100 ? '1fr' : 'minmax(0, 1fr) 340px',
      gap: isMobile ? '1rem' : '1.5rem',
      alignItems: 'start'
    },
    statsRow: {
      display: 'grid',
      gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : isTablet ? 'repeat(3, 1fr)' : 'repeat(5, 1fr)',
      gap: isMobile ? '0.65rem' : '1rem',
      marginBottom: isMobile ? '1rem' : '1.5rem'
    },
    statCard: {
      padding: isMobile ? '0.75rem' : '1rem',
      borderRadius: isMobile ? '12px' : '16px',
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: isMobile ? '100px' : '120px',
      cursor: 'pointer'
    },
    reportCard: {
      background: 'white',
      padding: isMobile ? '1rem' : '1.25rem',
      borderRadius: '20px',
      border: '1px solid #E2E8F0',
      boxShadow: 'var(--shadow-sm)',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: isMobile ? '200px' : '260px',
      maxWidth: '100%',
      overflow: 'hidden'
    },
    analyticalGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, minmax(0, 1fr))',
      gap: isMobile ? '0.75rem' : '1rem',
      marginTop: isMobile ? '0.75rem' : '1rem'
    },
    chartBox: {
      height: isMobile ? '140px' : '180px',
      width: '100%',
      minWidth: 0,
      marginTop: 'auto'
    },
    viewPill: (active) => ({
      padding: isMobile ? '3px 7px' : '4px 10px',
      borderRadius: '6px',
      border: 'none',
      fontSize: isMobile ? '0.6rem' : '0.65rem',
      fontWeight: 800,
      cursor: 'pointer',
      background: active ? 'white' : 'transparent',
      color: active ? '#4169E1' : '#64748B',
      boxShadow: active ? '0 2px 4px rgba(0,0,0,0.05)' : 'none'
    })
  };

  return (
    <Layout
      title={
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: isMobile ? '1.1rem' : '1.25rem', fontWeight: 900, color: '#0F172A' }}>Welcome, {adminName.split(' ')[0]}</span>
            <span style={{ fontSize: isMobile ? '1rem' : '1.1rem' }}>👋</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.65rem' : '0.75rem', color: '#10B981', fontWeight: 700 }}>
            <FontAwesomeIcon icon={faCheckCircle} />
            <span>Health System Authorized & Active</span>
          </div>
        </div>
      }
      subtitle={<div style={{ marginTop: '8px' }}><DigitalClock /></div>}
      actions={
        <div style={{ display: 'flex', gap: '8px', width: isMobile ? '100%' : 'auto' }}>
          <button className="button button--secondary" onClick={fetchDashboardData} disabled={loading} style={{ flex: isMobile ? 1 : 'none', height: '38px', borderRadius: '10px', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faSync} spin={loading} /> Sync
          </button>
          <button className="button button--primary" onClick={() => navigate('/patients')} style={{ flex: isMobile ? 1 : 'none', height: '38px', borderRadius: '10px', fontSize: '0.8rem' }}>
            <FontAwesomeIcon icon={faPlus} /> Admission
          </button>
        </div>
      }
    >
      <div style={ui.shell}>
        {/* 1. TOP STATS */}
        <section className="animate-fade-in" style={ui.statsRow}>
          {stats.map((s, i) => (
            <div key={i} onClick={() => navigate(s.path)} style={{ 
              ...ui.statCard, 
              background: statGradients[s.color] || statGradients['card--blue'],
              gridColumn: (isMobile && i === stats.length - 1) ? 'span 2' : 'span 1'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                <div style={{ background: 'rgba(255,255,255,0.2)', padding: isMobile ? '6px' : '8px', borderRadius: '8px', fontSize: isMobile ? '0.75rem' : '0.9rem' }}><FontAwesomeIcon icon={s.icon} /></div>
                {!isMobile && <Sparkline data={s.history} color="white" />}
              </div>
              <div>
                <p style={{ margin: 0, fontSize: isMobile ? '0.55rem' : '0.65rem', fontWeight: 800, textTransform: 'uppercase', opacity: 0.8 }}>{s.label}</p>
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '8px' }}>
                  <h2 style={{ margin: 0, fontSize: isMobile ? '1.25rem' : '1.5rem', fontWeight: 900 }}>{loading ? "..." : s.value}</h2>
                  <span style={{ fontSize: isMobile ? '0.55rem' : '0.6rem', fontWeight: 800, background: 'rgba(255,255,255,0.25)', borderRadius: '999px', padding: '2px 7px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <FontAwesomeIcon icon={getTrend(s.history).up ? faArrowUp : faArrowDown} />
                    {getTrend(s.history).text}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </section>

        <div style={ui.dashboardGrid}>
          <div className="animate-fade-in">
            {/* Main Utilization Chart */}
            <div style={{ ...ui.reportCard, height: 'auto', minHeight: isMobile ? '300px' : '380px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: isMobile ? '30px' : '36px', height: isMobile ? '30px' : '36px', borderRadius: '8px', background: '#EEF2FF', color: '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><FontAwesomeIcon icon={faChartLine} /></div>
                  <div><h3 style={{ margin: 0, fontSize: isMobile ? '0.85rem' : '0.95rem', fontWeight: 900 }}>Utilization</h3></div>
                </div>
                <div style={{ display: 'flex', gap: '4px', background: '#F1F5F9', padding: '3px', borderRadius: '8px' }}>
                  {['Daily', 'Monthly', 'Yearly'].map(view => (
                    <button key={view} onClick={() => setChartView(view)} style={ui.viewPill(chartView === view)}>{view.toUpperCase()}</button>
                  ))}
                </div>
              </div>
              <div style={{ height: isMobile ? 200 : 280, minWidth: 0 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={activeTrendData} margin={{left: isMobile ? -35 : -25, right: 10}}>
                    <defs><linearGradient id="colorV" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#4169E1" stopOpacity={0.2}/><stop offset="95%" stopColor="#4169E1" stopOpacity={0}/></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                    <XAxis dataKey={chartView === 'Daily' ? 'date' : (chartView === 'Monthly' ? 'month' : 'year')} axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 8 : 9, fontWeight: 700, fill: '#94A3B8'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 8 : 9, fill: '#94A3B8'}} allowDecimals={false} />
                    <Tooltip contentStyle={{borderRadius: '10px', border: 'none', boxShadow: 'var(--shadow-lg)', fontSize: '11px'}} />
                    <Area type="monotone" dataKey="visits" stroke="#4169E1" strokeWidth={2.5} fill="url(#colorV)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div style={ui.analyticalGrid}>
              <div style={ui.reportCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FontAwesomeIcon icon={faChartBar} style={{ color: '#EF4444' }} /><span style={{ fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.8rem' }}>Top Health Concerns</span></div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Using simpler wording from recent consultations.</p>
                <div style={ui.chartBox}>
                  {hasValue(morbidityData, 'count') ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={morbidityData} layout="vertical" margin={{left: isMobile ? -30 : -25, right: 15}}>
                        <XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 7 : 8, fontWeight: 700}} width={isMobile ? 65 : 75} />
                        <Tooltip /><Bar dataKey="count" fill="#EF4444" radius={[0, 4, 4, 0]} barSize={isMobile ? 8 : 10} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700 }}>No morbidity data available yet.</div>
                  )}
                </div>
              </div>
              <div style={ui.reportCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FontAwesomeIcon icon={faNotesMedical} style={{ color: '#4169E1' }} /><span style={{ fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.8rem' }}>Program Share</span></div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Service distribution across major health programs.</p>
                <div style={{ ...ui.chartBox, display: 'flex', alignItems: 'center', flexDirection: 'row', gap: isMobile ? '0.5rem' : 0 }}>
                  <div style={{ width: isMobile ? '45%' : '50%', height: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={programShareData} innerRadius={isMobile ? 24 : 30} outerRadius={isMobile ? 40 : 50} paddingAngle={5} dataKey="value" isAnimationActive={false}>{programShareData.map((e, i) => <Cell key={i} fill={e.color} stroke="none" />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
                  </div>
                  <div style={{ width: isMobile ? '55%' : '50%', paddingLeft: isMobile ? '2px' : '5px' }}>{programShareData.map((p, i) => <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: isMobile ? '0.58rem' : '0.64rem', fontWeight: 800, marginBottom: '4px' }}><span style={{ width: '6px', height: '6px', borderRadius: '1px', background: p.color }}></span><span>{p.name}: {p.value}%</span></div>)}</div>
                </div>
              </div>
              <div style={ui.reportCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FontAwesomeIcon icon={faUsers} style={{ color: '#0EA5E9' }} /><span style={{ fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.8rem' }}>Patient Profiles</span></div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Population mix by age group.</p>
                <div style={ui.chartBox}>{hasValue(profileData, 'value') ? <ResponsiveContainer width="100%" height="100%"><BarChart data={profileData}><XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 7 : 8, fontWeight: 700}} /><YAxis hide /><Tooltip /><Bar dataKey="value" fill="#0EA5E9" radius={[3, 3, 0, 0]} barSize={isMobile ? 14 : 18} isAnimationActive={false} /></BarChart></ResponsiveContainer> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700 }}>No profile data available yet.</div>}</div>
              </div>
              <div style={ui.reportCard}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FontAwesomeIcon icon={faMapMarkerAlt} style={{ color: '#8B5CF6' }} /><span style={{ fontWeight: 800, fontSize: isMobile ? '0.75rem' : '0.8rem' }}>Purok Density</span></div>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Resident count per purok for area planning.</p>
                <div style={ui.chartBox}>{hasValue(densityData, 'value') ? <ResponsiveContainer width="100%" height="100%"><BarChart data={densityData} layout="vertical" margin={{left: isMobile ? -30 : -25, right: 15}}><XAxis type="number" hide /><YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fontSize: isMobile ? 7 : 8, fontWeight: 700}} width={isMobile ? 65 : 75} /><Tooltip /><Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} barSize={isMobile ? 8 : 10} isAnimationActive={false} /></BarChart></ResponsiveContainer> : <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8', fontSize: '0.72rem', fontWeight: 700 }}>No purok data available yet.</div>}</div>
              </div>
            </div>
          </div>

          <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.25rem' }}>
            <div style={{ ...ui.reportCard, background: 'linear-gradient(135deg, #1E293B, #0F172A)', border: 'none', color: 'white', minHeight: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 900, margin: 0 }}>Hub</h3>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>Quick access to common actions.</p>
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 800, color: '#93C5FD', background: 'rgba(255,255,255,0.08)', padding: '4px 8px', borderRadius: '999px' }}>Quick Tools</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '8px' }}>
                <button className="button" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '8px' : '12px', fontSize: isMobile ? '0.65rem' : '0.72rem', borderRadius: '12px', minHeight: isMobile ? '60px' : '74px' }} onClick={() => navigate('/census')}><FontAwesomeIcon icon={faUsers} style={{ color: '#638EF1', marginBottom: '4px' }} /><br/>Census</button>
                <button className="button" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '8px' : '12px', fontSize: isMobile ? '0.65rem' : '0.72rem', borderRadius: '12px', minHeight: isMobile ? '60px' : '74px' }} onClick={() => navigate('/announcements')}><FontAwesomeIcon icon={faBullhorn} style={{ color: '#F87171', marginBottom: '4px' }} /><br/>Alerts</button>
                <button className="button" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '8px' : '12px', fontSize: isMobile ? '0.65rem' : '0.72rem', borderRadius: '12px', minHeight: isMobile ? '60px' : '74px' }} onClick={() => navigate('/records')}><FontAwesomeIcon icon={faFileMedical} style={{ color: '#FBBF24', marginBottom: '4px' }} /><br/>Records</button>
                <button className="button" style={{ background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: isMobile ? '8px' : '12px', fontSize: isMobile ? '0.65rem' : '0.72rem', borderRadius: '12px', minHeight: isMobile ? '60px' : '74px' }} onClick={() => navigate('/events')}><FontAwesomeIcon icon={faCalendarAlt} style={{ color: '#34D399', marginBottom: '4px' }} /><br/>Programs</button>
              </div>
            </div>
            <Calendar events={rawEvents} schedules={rawSchedules} appointments={rawAppointments} />
            <div style={{ ...ui.reportCard, minHeight: 'auto' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.25rem' }}>Upcoming Programs</h3>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Coming next in the schedule.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {upcomingEvents.map((e, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F1F5F9', color: e.type === 'Appointment' ? '#2563EB' : e.type === 'Schedule' ? '#8B5CF6' : '#EF4444', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem' }}><FontAwesomeIcon icon={faCalendarDay} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}><p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.title}</p><p style={{ margin: 0, fontSize: '0.6rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.type} • {e.date}</p></div>
                  </div>
                ))}
                {upcomingEvents.length === 0 && <div style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700 }}>No upcoming items.</div>}
              </div>
            </div>
            <div style={{ ...ui.reportCard, minHeight: 'auto' }}>
              <h3 style={{ fontSize: '0.85rem', fontWeight: 900, marginBottom: '0.25rem' }}>Activity Log</h3>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Recent updates and actions.</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {recentActivity.map((a, i) => (
                  <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: '#F1F5F9', color: a.type === 'alert' ? '#EF4444' : a.type === 'appointment' ? '#2563EB' : a.type === 'schedule' ? '#8B5CF6' : '#4169E1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '0.7rem' }}><FontAwesomeIcon icon={a.type === 'alert' ? faBullhorn : a.type === 'appointment' || a.type === 'schedule' ? faCalendarDay : faFileMedical} /></div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.7rem', fontWeight: 800, color: '#1E293B', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.user} • {a.action}</p>
                      <p style={{ margin: 0, fontSize: '0.6rem', color: '#64748B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{a.event} • {a.time}</p>
                    </div>
                  </div>
                ))}
                {recentActivity.length === 0 && <div style={{ color: '#94A3B8', fontSize: '0.7rem', fontWeight: 700 }}>No recent updates.</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Dashboard;
