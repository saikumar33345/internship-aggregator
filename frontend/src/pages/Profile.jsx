import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [savedJobs, setSavedJobs] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [newAlert, setNewAlert] = useState({
    keywords: "",
    location: "",
    min_salary: "",
  });
  const [fetching, setFetching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [fetchStatus,setFetchStatus]=useState("");

  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Profile — InternHub";
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);

    try {
      const [userRes, savedRes, alertsRes] = await Promise.all([
        API.get("/auth/me"),
        API.get("/saved-jobs/"),
        API.get("/alerts/"),
      ]);

      setUser(userRes.data);
      setSavedJobs(savedRes.data);
      setAlerts(alertsRes.data);
    } catch (err) {
      console.error("Failed to fetch profile data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsave = async (jobId) => {
    try {
      await API.delete(`/saved-jobs/${jobId}`);

      setSavedJobs((prev) =>
        prev.filter((job) => job.id !== jobId)
      );
    } catch (err) {
      console.error("Failed to unsave job", err);
    }
  };

  const handleDeleteAlert = async (alertId) => {
    try {
      await API.delete(`/alerts/${alertId}`);

      setAlerts((prev) =>
        prev.filter((a) => a.id !== alertId)
      );
    } catch (err) {
      console.error("Failed to delete alert", err);
    }
  };

  const handleCreateAlert = async (e) => {
    e.preventDefault();

    try {
      const response = await API.post("/alerts/", newAlert);

      setAlerts((prev) => [...prev, response.data]);

      setNewAlert({
        keywords: "",
        location: "",
        min_salary: "",
      });
    } catch (err) {
      console.error("Failed to create alert", err);
    }
  };

  const handleFetchJobs = async () => {
  setFetching(true);
  setFetchStatus("");
  try {
    const response = await API.post("/jobs/fetch", {}, { timeout: 180000 });
    setFetchStatus(response.data.message);
  } catch (err) {
    setFetchStatus(" Fetch failed. Try again.");
    console.error("Failed to fetch jobs", err);
  } finally {
    setFetching(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid-bg pt-20 flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          Loading profile...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-6 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-indigo-500/20 border border-indigo-500/30 rounded-xl flex items-center justify-center text-indigo-400 font-black text-lg">
                {user?.email?.[0]?.toUpperCase()}
              </div>

              <div>
                <h1 className="text-white font-bold text-lg">
                  {user?.email}
                </h1>

                <p className="text-gray-600 text-xs">
                  InternHub Member
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleFetchJobs}
            disabled={fetching}
            className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {fetching ? "Fetching..." : "⚡ Refresh Jobs"}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {savedJobs.length}
            </div>

            <div className="text-gray-500 text-sm">
              Saved Jobs
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
            <div className="text-3xl font-black text-white mb-1">
              {alerts.length}
            </div>

            <div className="text-gray-500 text-sm">
              Active Alerts
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-white font-bold text-xl mb-4">
            ❤️ Saved Jobs
          </h2>

          {savedJobs.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-600 text-sm">
                No saved jobs yet. Browse jobs and hit the heart
                button.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {savedJobs.map((job) => (
                <div
                  key={job.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-start justify-between card-hover"
                >
                  <div className="flex-1">
                    <h3 className="text-white font-semibold mb-1">
                      {job.title}
                    </h3>

                    <p className="text-gray-500 text-sm mb-2">
                      {job.company}
                    </p>

                    <div className="flex gap-2 flex-wrap">
                      {job.location && (
                        <span className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                      )}

                      {job.salary && (
                        <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full">
                          💰 {job.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4 shrink-0">
                    {job.source_url && (
                      <a
                        href={job.source_url}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-white text-black text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-all"
                      >
                        Apply →
                      </a>
                    )}

                    <button
                      onClick={() => handleUnsave(job.id)}
                      className="text-gray-600 hover:text-red-400 transition-all text-lg"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-white font-bold text-xl mb-4">
            🔔 Job Alerts
          </h2>

          <form
            onSubmit={handleCreateAlert}
            className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-4"
          >
            <p className="text-gray-400 text-sm mb-4">
              Get emailed when new matching jobs are found
            </p>

            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                placeholder="Keywords (e.g. python, react)"
                value={newAlert.keywords}
                onChange={(e) =>
                  setNewAlert({
                    ...newAlert,
                    keywords: e.target.value,
                  })
                }
                className="flex-1 min-w-[150px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              <input
                type="text"
                placeholder="Location"
                value={newAlert.location}
                onChange={(e) =>
                  setNewAlert({
                    ...newAlert,
                    location: e.target.value,
                  })
                }
                className="w-36 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />

              <button
                type="submit"
                className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-all"
              >
                + Add Alert
              </button>
            </div>
          </form>

          {alerts.length === 0 ? (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
              <p className="text-gray-600 text-sm">
                No alerts set. Create one above to get notified.
              </p>
            </div>
          ) : (
            <div className="grid gap-3">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between"
                >
                  <div className="flex gap-3 flex-wrap">
                    {alert.keywords && (
                      <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs px-3 py-1 rounded-full">
                        🔍 {alert.keywords}
                      </span>
                    )}

                    {alert.location && (
                      <span className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1 rounded-full">
                        📍 {alert.location}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() =>
                      handleDeleteAlert(alert.id)
                    }
                    className="text-gray-600 hover:text-red-400 transition-all text-lg ml-4"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;