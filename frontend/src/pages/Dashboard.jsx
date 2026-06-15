import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import API from "../api/axios";


const COLORS = ["#6366f1", "#8b5cf6", "#a855f7", "#ec4899", "#f59e0b"];

const StatCard = ({ label, value, icon }) => (
  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center card-hover">
    <div className="text-3xl mb-2">{icon}</div>
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
  useEffect(() => { document.title = "Analytics — InternHub"; }, []);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const [
        summaryRes,
        companiesRes,
        locationsRes,
        jobsTypeRes,
      ] = await Promise.all([
        API.get("/analytics/summary"),
        API.get("/analytics/top-companies"),
        API.get("/analytics/jobs-by-location"),
        API.get("/analytics/jobs-by-type"),
      ]);

      setSummary(summaryRes.data);
      setTopCompanies(Array.isArray(companiesRes.data) ? companiesRes.data : []);
      setTopLocations(Array.isArray(locationsRes.data) ? locationsRes.data : []);
      setJobsByType(Array.isArray(jobsTypeRes.data) ? jobsTypeRes.data : []);
    } catch (err) {
      console.error("Failed to fetch analytics", err);
    } finally {
      setLoading(false);
    }
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-900 border border-white/10 rounded-xl px-4 py-2">
          <p className="text-white text-sm font-semibold">{label}</p>
          <p className="text-indigo-400 text-sm">
            {payload[0].value} jobs
          </p>
        </div>
      );
    }

    return null;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid-bg pt-20 flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 left-1/3 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-white mb-1">
            Analytics
          </h1>
          <p className="text-gray-500 text-sm">
            Live insights
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <StatCard
            label="Total Jobs"
            value={summary?.total_jobs || 0}
            icon="💼"
          />

          <StatCard
            label="Total Users"
            value={summary?.total_users || 0}
            icon="👥"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top Companies */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6">
              🏢 Top Hiring Companies
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topCompanies} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="company"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />

                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {topCompanies.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Top Locations */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6">
              📍 Top Locations
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topLocations} layout="vertical">
                <XAxis
                  type="number"
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  type="category"
                  dataKey="location"
                  tick={{ fill: "#9ca3af", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={100}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />

                <Bar dataKey="count" radius={[0, 8, 8, 0]}>
                  {topLocations.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Jobs By Type */}
          <div className="md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h2 className="text-white font-bold text-lg mb-6">
              📊 Jobs by Type
            </h2>

            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={jobsByType}>
                <XAxis
                  dataKey="job_type"
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(val) =>
                    val === "full_time"
                      ? "Full Time"
                      : val === "part_time"
                      ? "Part Time"
                      : val === "contract"
                      ? "Contract"
                      : val === "internship"
                      ? "Internship"
                      : val
                  }
                />

                <YAxis
                  tick={{ fill: "#6b7280", fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{ fill: "rgba(255,255,255,0.03)" }}
                />

                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                  {jobsByType.map((_, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;