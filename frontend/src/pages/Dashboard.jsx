import { useState, useEffect } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, Cell, PieChart, Pie, Legend
} from "recharts";
import API from "../api/axios";

const GRADIENT_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f43f5e"
];

const PIE_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f59e0b"
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 14px",
      }}>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700, marginBottom: 4 }}>{label}</p>
        <p style={{ color: "#6366f1", fontSize: 12 }}>{payload[0].value} jobs</p>
      </div>
    );
  }
  return null;
};

const CustomPieTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 12,
        padding: "10px 14px",
      }}>
        <p style={{ color: "#fff", fontSize: 13, fontWeight: 700 }}>{payload[0].name}</p>
        <p style={{ color: payload[0].fill, fontSize: 12 }}>{payload[0].value} jobs</p>
      </div>
    );
  }
  return null;
};

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 card-hover">
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-4`}
      style={{ background: `${color}20`, border: `1px solid ${color}30` }}>
      {icon}
    </div>
    <div className="text-3xl font-black text-white mb-1">{value}</div>
    <div className="text-gray-500 text-sm">{label}</div>
  </div>
);

const Dashboard = () => {
  const [summary, setSummary] = useState(null);
  const [topCompanies, setTopCompanies] = useState([]);
  const [topLocations, setTopLocations] = useState([]);
  const [jobsByType, setJobsByType] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Analytics — InternHub";
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [summaryRes, companiesRes, locationsRes, jobsTypeRes] = await Promise.all([
        API.get("/analytics/summary"),
        API.get("/analytics/top-companies"),
        API.get("/analytics/jobs-by-location"),
        API.get("/analytics/jobs-by-type"),
      ]);
      setSummary(summaryRes.data);
      setTopCompanies(companiesRes.data);
      setTopLocations(locationsRes.data);
      setJobsByType(jobsTypeRes.data.map(j => ({
        ...j,
        job_type: j.job_type === "full_time" ? "Full Time" :
          j.job_type === "part_time" ? "Part Time" :
          j.job_type === "contract" ? "Contract" :
          j.job_type === "internship" ? "Internship" : j.job_type
      })));
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid-bg pt-20 flex items-center justify-center">
        <div className="text-gray-500 text-sm">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-0 right-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black text-white mb-1">Analytics</h1>
          <p className="text-gray-500 text-sm">Live insights from your internship database</p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Total Jobs" value={summary?.total_jobs || 0} icon="💼" color="#6366f1" />
          <StatCard label="Total Users" value={summary?.total_users || 0} icon="👥" color="#a855f7" />
          <StatCard label="Companies" value={topCompanies.length} icon="🏢" color="#ec4899" />
          <StatCard label="Locations" value={topLocations.length} icon="📍" color="#f59e0b" />
        </div>

        {/* Top Companies + Top Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

          {/* Top Companies */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-6 bg-indigo-500 rounded-full" />
              <h2 className="text-white font-bold text-base">Top Hiring Companies</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topCompanies} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis
                  type="number"
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="company"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={20}>
                  {topCompanies.map((_, index) => (
                    <Cell
                      key={index}
                      fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Locations */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-2 h-6 bg-purple-500 rounded-full" />
              <h2 className="text-white font-bold text-base">Top Locations</h2>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topLocations} layout="vertical" margin={{ left: 10, right: 20 }}>
                <XAxis
                  type="number"
                  tick={{ fill: "#4b5563", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  type="category"
                  dataKey="location"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<CustomBarTooltip />} cursor={{ fill: "rgba(255,255,255,0.02)" }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} maxBarSize={20}>
                  {topLocations.map((_, index) => (
                    <Cell
                      key={index}
                      fill={GRADIENT_COLORS[index % GRADIENT_COLORS.length]}
                      fillOpacity={0.9}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Jobs by Type — Pie Chart */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-2 h-6 bg-pink-500 rounded-full" />
            <h2 className="text-white font-bold text-base">Jobs by Type</h2>
          </div>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={jobsByType}
                  dataKey="count"
                  nameKey="job_type"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  innerRadius={50}
                  paddingAngle={4}
                >
                  {jobsByType.map((_, index) => (
                    <Cell
                      key={index}
                      fill={PIE_COLORS[index % PIE_COLORS.length]}
                      stroke="transparent"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend
                  formatter={(value) => (
                    <span style={{ color: "#9ca3af", fontSize: 12 }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;