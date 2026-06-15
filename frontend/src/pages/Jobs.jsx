import { useState, useEffect } from "react";
import API from "../api/axios";

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [skip, setSkip] = useState(0);
  const [savedJobIds, setSavedJobIds] = useState([]);

  const limit = 10;
  useEffect(() => { document.title = "Browse Jobs — InternHub"; }, []);


  const fetchJobs = async () => {
    setLoading(true);

    try {
      const response = await API.get("/jobs/", {
        params: {
          keyword: keyword || undefined,
          location: location || undefined,
          skip,
          limit,
        },
      });

      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.jobs || [];

      setJobs(data);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedIds = async () => {
    try {
      const response = await API.get("/saved-jobs/");
      setSavedJobIds(response.data.map((job) => job.id));
    } catch (err) {
      console.error("Failed to fetch saved jobs", err);
    }
  };

  const toggleSave = async (jobId) => {
    const isSaved = savedJobIds.includes(jobId);

    try {
      if (isSaved) {
        await API.delete(`/saved-jobs/${jobId}`);

        setSavedJobIds((prev) =>
          prev.filter((id) => id !== jobId)
        );
      } else {
        await API.post(`/saved-jobs/${jobId}`);

        setSavedJobIds((prev) => [...prev, jobId]);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchJobs();
      fetchSavedIds();
    }, 300);

    return () => clearTimeout(timer);
  }, [keyword, location, skip]);

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="border-b border-white/10 px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-black text-white mb-1">
            Browse Internships
          </h1>

          <p className="text-gray-500 text-sm mb-6">
            {jobs.length} opportunities · Auto-updated every 6 hours
          </p>

          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="🔍 Search by keyword..."
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value);
                setSkip(0);
              }}
              className="flex-1 min-w-[200px] bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />

            <input
              type="text"
              placeholder="📍 Location..."
              value={location}
              onChange={(e) => {
                setLocation(e.target.value);
                setSkip(0);
              }}
              className="w-44 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />

            <button
              onClick={() => {
                setKeyword("");
                setLocation("");
                setSkip(0);
              }}
              className="bg-white/5 border border-white/10 hover:bg-white/10 text-gray-400 hover:text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {loading ? (
          <div className="grid gap-3">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 rounded-2xl p-6 border border-white/10"
              >
                <div className="h-4 shimmer rounded w-1/3 mb-3"></div>
                <div className="h-3 shimmer rounded w-1/4 mb-4"></div>

                <div className="flex gap-2">
                  <div className="h-6 shimmer rounded-full w-20"></div>
                  <div className="h-6 shimmer rounded-full w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-4xl mb-4">🔍</div>

            <h3 className="text-white font-semibold text-lg mb-2">
              No jobs found
            </h3>

            <p className="text-gray-600 text-sm">
              Try different keywords or clear filters
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            {jobs.map((job, index) => (
              <div
                key={job.id || job._id || index}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 card-hover"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h2 className="text-white font-bold text-lg mb-1">
                      {job.title}
                    </h2>

                    <p className="text-gray-500 text-sm font-medium mb-3">
                      {job.company}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {job.location && (
                        <span className="bg-white/5 border border-white/10 text-gray-400 text-xs font-medium px-3 py-1 rounded-full">
                          📍 {job.location}
                        </span>
                      )}

                      {job.job_type && (
                        <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1 rounded-full">
                          {job.job_type}
                        </span>
                      )}

                      {job.salary && (
                        <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1 rounded-full">
                          💰 {job.salary}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => toggleSave(job.id)}
                      className={`text-xl transition-all hover:scale-110 ${
                        savedJobIds.includes(job.id)
                          ? "text-red-400"
                          : "text-gray-600 hover:text-red-400"
                      }`}
                    >
                      {savedJobIds.includes(job.id) ? "❤️" : "🤍"}
                    </button>

                    {job.source_url && (
                      <a
                        href={job.source_url}
                        target="_blank"
                        rel="noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white text-black text-sm font-semibold px-4 py-2 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        Apply →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && jobs.length > 0 && (
          <div className="flex items-center justify-between mt-8">
            <button
              onClick={() =>
                setSkip((prev) => Math.max(0, prev - limit))
              }
              disabled={skip === 0}
              className="bg-white/5 border border-white/10 text-gray-400 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              ← Previous
            </button>

            <span className="text-gray-600 text-sm">
              Showing {skip + 1}–{skip + jobs.length}
            </span>

            <button
              onClick={() => setSkip((prev) => prev + limit)}
              disabled={jobs.length < limit}
              className="bg-white text-black px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;