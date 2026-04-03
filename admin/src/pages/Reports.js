import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Layout from "../components/Layout";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, AreaChart, Area, Label
} from "recharts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faPrint, faFileCsv, faSync, faUsers, faStethoscope,
  faBaby, faShieldVirus, faSyringe, faChartLine,
  faBirthdayCake, faMapMarkerAlt,
  faNotesMedical, faFileMedicalAlt,
  faHistory, faCheckCircle, faArrowTrendUp, faArrowTrendDown
} from "@fortawesome/free-solid-svg-icons";

const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#06B6D4', '#EF4444'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ 
        background: 'white', 
        padding: '12px 16px', 
        border: '1px solid #E2E8F0', 
        borderRadius: '12px',
        boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
        fontSize: '0.8rem'
      }}>
        <p style={{ margin: '0 0 4px 0', fontWeight: 900, color: '#1E293B' }}>{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ margin: 0, color: entry.color, fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: entry.color }}></span>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Reports() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('year');
  const [rawData, setRawData] = useState({ records: [], patients: [], schedules: [] });

  const [stats, setStats] = useState({
    totalPatients: 0,
    totalVisits: 0,
    visitTrend: 0,
    prenatal: 0,
    rabies: 0,
    immunization: 0,
    monthlyVisits: [],
    topSickness: [],
    ageGroups: [],
    addressData: [],
    programBreakdown: [],
    recentActivity: []
  });

  const processData = useCallback((records, patients, schedules, filterRange) => {
    const now = new Date();
    let filteredRecords = records;
    let filteredSchedules = schedules;
    let prevRecords = [];
    let trafficData = [];

    if (filterRange === 'month') {
      filteredRecords = records.filter(r => {
        const d = new Date(r.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });
      prevRecords = records.filter(r => {
        const d = new Date(r.date);
        const prevMonth = now.getMonth() === 0 ? 11 : now.getMonth() - 1;
        const prevYear = now.getMonth() === 0 ? now.getFullYear() - 1 : now.getFullYear();
        return d.getMonth() === prevMonth && d.getFullYear() === prevYear;
      });
      filteredSchedules = schedules.filter(s => {
        const d = new Date(s.date);
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
      });

      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      for (let i = 1; i <= daysInMonth; i++) {
        const count = filteredRecords.filter(r => new Date(r.date).getDate() === i).length;
        trafficData.push({ name: `Day ${i}`, visits: count });
      }
    } else if (filterRange === 'year') {
      filteredRecords = records.filter(r => new Date(r.date).getFullYear() === now.getFullYear());
      prevRecords = records.filter(r => new Date(r.date).getFullYear() === now.getFullYear() - 1);
      filteredSchedules = schedules.filter(s => new Date(s.date).getFullYear() === now.getFullYear());

      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      trafficData = months.map((m, i) => ({
        name: m,
        visits: filteredRecords.filter(r => new Date(r.date).getMonth() === i).length
      }));
    } else {
      filteredRecords = records;
      filteredSchedules = schedules;
      const years = [...new Set(records.map(r => new Date(r.date).getFullYear()))].sort();
      trafficData = years.map(y => ({
        name: y.toString(),
        visits: records.filter(r => new Date(r.date).getFullYear() === y).length
      }));
    }

    const trend = prevRecords.length === 0 ? 100 : Math.round(((filteredRecords.length - prevRecords.length) / prevRecords.length) * 100);

    const prenatal = filteredSchedules.filter(s => s.scheduleType === 'Prenatal' && s.status === 'Completed').length;
    const rabies = filteredSchedules.filter(s => (s.service?.toLowerCase().includes('rabies')) && s.status === 'Completed').length;
    const immuni = filteredSchedules.filter(s => (s.scheduleType === 'Immunization' || s.service?.toLowerCase().includes('vaccine')) && s.status === 'Completed').length;

    const sicknessMap = {};
    filteredRecords.forEach(r => {
      const d = r.diagnosis || "Checkup";
      sicknessMap[d] = (sicknessMap[d] || 0) + 1;
    });
    const topSickness = Object.entries(sicknessMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count).slice(0, 5);

    const ageGroupsMap = { '0-12': 0, '13-19': 0, '20-59': 0, '60+': 0 };
    patients.forEach(p => {
      if (p.age <= 12) ageGroupsMap['0-12']++;
      else if (p.age <= 19) ageGroupsMap['13-19']++;
      else if (p.age <= 59) ageGroupsMap['20-59']++;
      else ageGroupsMap['60+']++;
    });

    const addressMap = {};
    patients.forEach(p => {
      const addr = p.address || 'Unknown';
      addressMap[addr] = (addressMap[addr] || 0) + 1;
    });

    setStats({
      totalPatients: patients.length,
      totalVisits: filteredRecords.length,
      visitTrend: trend,
      prenatal,
      rabies,
      immunization: immuni,
      monthlyVisits: trafficData,
      topSickness: topSickness,
      ageGroups: Object.entries(ageGroupsMap).map(e => ({ name: e[0], value: e[1] })),
      addressData: Object.entries(addressMap).map(e => ({ name: e[0], count: e[1] })).sort((a,b) => b.count - a.count).slice(0, 5),
      programBreakdown: [
        { name: 'Prenatal', value: prenatal },
        { name: 'Immunization', value: immuni },
        { name: 'Rabies', value: rabies },
        { name: 'General', value: Math.max(0, filteredRecords.length - (prenatal + immuni + rabies)) }
      ].filter(p => p.value > 0),
      recentActivity: filteredRecords.slice(0, 5).map(r => ({
        id: r._id,
        patient: r.patient?.name || "Unknown",
        diagnosis: r.diagnosis,
        date: new Date(r.date).toLocaleDateString()
      }))
    });
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [recRes, patRes, schRes] = await Promise.all([
        axios.get("http://localhost:5000/api/records"),
        axios.get("http://localhost:5000/api/patients"),
        axios.get("http://localhost:5000/api/schedules")
      ]);
      setRawData({ records: recRes.data, patients: patRes.data, schedules: schRes.data });
      processData(recRes.data, patRes.data, schRes.data, filter);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, [filter, processData]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const downloadCSV = () => {
    const csvRows = [
      ["BARANGAY HEALTH CENTER - CLINIC REPORT"],
      ["Generated on", new Date().toLocaleString()],
      ["Report Scope", filter.toUpperCase()],
      [],
      ["SUMMARY METRICS"],
      ["Total Patient Base", stats.totalPatients],
      ["Total Visits in Period", stats.totalVisits],
      ["Growth Trend (%)", stats.visitTrend + "%"],
      ["Prenatal Services", stats.prenatal],
      ["Anti-Rabies Cases", stats.rabies],
      ["Immunizations", stats.immunization],
      [],
      ["TRAFFIC DATA Breakdown"],
      ["Time Period", "Visit Count"],
      ...stats.monthlyVisits.map(v => [v.name, v.visits]),
      [],
      ["MORBIDITY PROFILE (Top Diagnoses)"],
      ["Diagnosis", "Case Count"],
      ...stats.topSickness.map(s => [s.name, s.count]),
      [],
      ["SERVICE CLASSIFICATION"],
      ["Program", "Units Delivered"],
      ...stats.programBreakdown.map(p => [p.name, p.value]),
      [],
      ["GEOGRAPHIC CATCHMENT"],
      ["Address/Area", "Resident Count"],
      ...stats.addressData.map(a => [a.name, a.count])
    ];
    
    const csvContent = "data:text/csv;charset=utf-8," + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `BHC_Report_${filter}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <Layout 
      title="Health Metrics" 
      subtitle="Barangay Health Center Analytics"
      actions={
        <div className="report-actions">
          <div className="filter-group">
            <button className={`filter-btn ${filter === 'month' ? 'active' : ''}`} onClick={() => setFilter('month')}>Month</button>
            <button className={`filter-btn ${filter === 'year' ? 'active' : ''}`} onClick={() => setFilter('year')}>Year</button>
            <button className={`filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
          </div>
          <button className="button button--secondary" onClick={downloadCSV}>
            <FontAwesomeIcon icon={faFileCsv} /> Export
          </button>
          <button className="button button--primary" onClick={() => window.print()}>
            <FontAwesomeIcon icon={faPrint} /> Print
          </button>
        </div>
      }
    >
      <style>{`
        .report-actions { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.25rem; margin-bottom: 1.5rem; }
        .clinical-card { background: white; padding: 1.5rem; border-radius: 24px; border: 1px solid #E2E8F0; position: relative; overflow: hidden; display: flex; flex-direction: column; min-height: 110px; }
        .clinical-card::after { content: ''; position: absolute; left: 0; top: 0; width: 4px; height: 100%; background: var(--border-color, #4169E1); }
        .clinical-card h3 { margin: 4px 0; font-size: 1.85rem; font-weight: 900; color: #0F172A; }
        .clinical-card p { margin: 0; font-size: 0.65rem; font-weight: 800; color: #64748B; text-transform: uppercase; letter-spacing: 0.8px; }
        .trend-badge { font-size: 0.65rem; font-weight: 800; padding: 2px 6px; border-radius: 4px; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px; }
        
        .report-section-grid { display: grid; grid-template-columns: 1fr; gap: 1.5rem; margin-bottom: 1.5rem; }
        @media (min-width: 992px) { .report-section-grid { grid-template-columns: 1.5fr 1.5fr; } }
        
        .report-box { background: white; padding: 1.75rem; border-radius: 24px; border: 1px solid #E2E8F0; display: flex; flex-direction: column; min-width: 0; }
        .box-title { font-size: 0.95rem; font-weight: 900; color: #1E293B; display: flex; align-items: center; gap: 10px; margin-bottom: 1.5rem; }

        .filter-group { display: flex; background: #F1F5F9; border-radius: 12px; padding: 4px; gap: 2px; }
        .filter-btn { border: none; background: transparent; padding: 6px 14px; border-radius: 8px; font-size: 0.75rem; font-weight: 700; color: #64748B; cursor: pointer; transition: 0.2s; }
        .filter-btn.active { background: white; color: #4169E1; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }

        .activity-table { width: 100%; border-collapse: collapse; }
        .activity-table th { text-align: left; padding: 12px; font-size: 0.65rem; color: #64748B; text-transform: uppercase; font-weight: 900; }
        .activity-table td { padding: 12px; font-size: 0.85rem; color: #1E293B; border-bottom: 1px solid #F1F5F9; font-weight: 700; }

        @media print {
          .sidebar, .top-navbar, .button, .filter-group, .report-actions { display: none !important; }
          .main-content { margin: 0 !important; padding: 0 !important; }
          .report-box, .clinical-card { break-inside: avoid; border: 1px solid #ddd !important; }
        }
      `}</style>

      <div className="animate-fade-in">
        
        {/* KPIs */}
        <section className="stats-grid">
          <div className="clinical-card" style={{ '--border-color': '#4169E1' }}>
            <p>Total Patients</p>
            <h3>{stats.totalPatients}</h3>
            <div className="trend-badge" style={{ background: '#EEF2FF', color: '#4169E1' }}><FontAwesomeIcon icon={faUsers} /> Resident Base</div>
          </div>
          <div className="clinical-card" style={{ '--border-color': '#10B981' }}>
            <p>Total Visits</p>
            <h3>{stats.totalVisits}</h3>
            <div className="trend-badge" style={{ background: stats.visitTrend >= 0 ? '#ECFDF5' : '#FEF2F2', color: stats.visitTrend >= 0 ? '#10B981' : '#EF4444' }}>
              <FontAwesomeIcon icon={stats.visitTrend >= 0 ? faArrowTrendUp : faArrowTrendDown} /> {Math.abs(stats.visitTrend)}% vs last period
            </div>
          </div>
          <div className="clinical-card" style={{ '--border-color': '#EC4899' }}>
            <p>Prenatal Care</p>
            <h3>{stats.prenatal}</h3>
            <div className="trend-badge" style={{ background: '#FDF2F8', color: '#EC4899' }}><FontAwesomeIcon icon={faBaby} /> Maternal</div>
          </div>
          <div className="clinical-card" style={{ '--border-color': '#F59E0B' }}>
            <p>Anti-Rabies</p>
            <h3>{stats.rabies}</h3>
            <div className="trend-badge" style={{ background: '#FFFBEB', color: '#F59E0B' }}><FontAwesomeIcon icon={faShieldVirus} /> Control</div>
          </div>
          <div className="clinical-card" style={{ '--border-color': '#8B5CF6' }}>
            <p>Immunizations</p>
            <h3>{stats.immunization}</h3>
            <div className="trend-badge" style={{ background: '#F5F3FF', color: '#8B5CF6' }}><FontAwesomeIcon icon={faSyringe} /> Vaccines</div>
          </div>
        </section>

        {/* Traffic Area Chart */}
        <div className="report-box" style={{ marginBottom: '1.5rem' }}>
          <div className="box-title"><FontAwesomeIcon icon={faChartLine} color="#4F46E5" /> Clinic Workload & Traffic Trend</div>
          <div style={{ width: '100%', height: 350 }}>
            <ResponsiveContainer>
              <AreaChart data={stats.monthlyVisits}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4F46E5" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="name" tick={{fontSize: 11, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fontSize: 11, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" name="Visits" dataKey="visits" fill="url(#areaGrad)" stroke="#4F46E5" strokeWidth={4} animationDuration={1500} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="report-section-grid">
          {/* Morbidity Bar Chart */}
          <div className="report-box">
            <div className="box-title"><FontAwesomeIcon icon={faStethoscope} color="#EF4444" /> Morbidity Profile (Top Diagnoses)</div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={stats.topSickness} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" tick={{fontSize: 11, fontWeight: 800, fill: '#1E293B'}} axisLine={false} tickLine={false} width={100} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="count" name="Cases" radius={[0, 8, 8, 0]} barSize={24} animationDuration={1500}>
                    {stats.topSickness.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Donut Service Chart */}
          <div className="report-box">
            <div className="box-title"><FontAwesomeIcon icon={faNotesMedical} color="#10B981" /> Service Classification</div>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={stats.programBreakdown} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={8} dataKey="value" animationDuration={1500}>
                    {stats.programBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    <Label value={stats.totalVisits} position="center" style={{ fontSize: '1.5rem', fontWeight: 900, fill: '#1E293B' }} />
                    <Label value="Total Units" position="center" dy={20} style={{ fontSize: '0.65rem', fontWeight: 800, fill: '#94A3B8', textTransform: 'uppercase' }} />
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend iconSize={10} iconType="circle" wrapperStyle={{paddingTop: '20px', fontSize: '11px', fontWeight: 800}} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Demographic Bars */}
          <div className="report-box">
            <div className="box-title"><FontAwesomeIcon icon={faBirthdayCake} color="#EC4899" /> Patient Life-Stage Profile</div>
            <div style={{ width: '100%', height: 250 }}>
              <ResponsiveContainer>
                <BarChart data={stats.ageGroups}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis dataKey="name" tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} />
                  <YAxis tick={{fontSize: 10, fontWeight: 700, fill: '#64748B'}} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{fill: '#F8FAFC'}} />
                  <Bar dataKey="value" name="Residents" fill="#EC4899" radius={[6, 6, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Catchment Table */}
          <div className="report-box">
            <div className="box-title"><FontAwesomeIcon icon={faMapMarkerAlt} color="#F59E0B" /> Geographic Catchment Area</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {stats.addressData.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i !== stats.addressData.length - 1 ? '1px solid #F1F5F9' : 'none' }}>
                  <span style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.85rem' }}>{item.name}</span>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontWeight: 900, color: '#10B981', fontSize: '1rem' }}>{item.count}</div>
                    <div style={{ fontSize: '0.6rem', color: '#94A3B8', fontWeight: 800 }}>RESIDENTS</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Clinical Ledger */}
        <div className="report-box">
          <div className="box-title"><FontAwesomeIcon icon={faHistory} color="#4F46E5" /> Recent Clinical Validations</div>
          <div style={{ overflowX: 'auto' }}>
            <table className="activity-table">
              <thead>
                <tr><th>Patient</th><th>Clinical Impression</th><th>Validated Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {stats.recentActivity.map((act, i) => (
                  <tr key={i}>
                    <td>{act.patient}</td>
                    <td>{act.diagnosis}</td>
                    <td>{act.date}</td>
                    <td style={{ color: '#10B981' }}><FontAwesomeIcon icon={faCheckCircle} /> Verified</td>
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
