import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

const formatDescription = (html) => {
  if (!html) return null;

  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    document.title = "Job Details — InternHub";

    fetchJob();
    checkSaved();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await API.get(`/jobs/${id}`);
      setJob(response.data);
    } catch (err) {
      console.error("Failed to fetch job", err);
    } finally {
      setLoading(false);
    }
  };

  const checkSaved = async () => {
    try {
      const response = await API.get("/saved-jobs/");
      const savedIds = response.data.map((j) => j.id);
      setSaved(savedIds.includes(Number(id)));
    } catch (err) {
      console.error("Failed to check saved jobs", err);
    }
  };

  const toggleSave = async () => {
    try {
      if (saved) {
        await API.delete(`/saved-jobs/${id}`);
        setSaved(false);
      } else {
        await API.post(`/saved-jobs/${id}`);
        setSaved(true);
      }
    } catch (err) {
      console.error("Failed to toggle save", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black grid-bg pt-20 flex items-center justify-center">
        <div className="text-gray-500 text-sm">
          Loading job details...
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-black grid-bg pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>

          <h2 className="text-white font-bold text-xl mb-2">
            Job not found
          </h2>

          <button
            onClick={() => navigate("/jobs")}
            className="text-indigo-400 text-sm hover:underline"
          >
            ← Back to jobs
          </button>
        </div>
      </div>
    );
  }

  const description = formatDescription(job.description);

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Back Button */}
        <button
          onClick={() => navigate("/jobs")}
          className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-2 transition-all"
        >
          ← Back to jobs
        </button>

        {/* Job Header */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start justify-between gap-4 mb-6">
            <div className="flex-1">
              <h1 className="text-2xl font-black text-white mb-2">
                {job.title}
              </h1>

              <p className="text-indigo-400 font-semibold text-lg mb-4">
                {job.company}
              </p>

              <div className="flex flex-wrap gap-2">
                {job.location && (
                  <span className="bg-white/5 border border-white/10 text-gray-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    📍 {job.location}
                  </span>
                )}

                {job.job_type && (
                  <span className="bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    {job.job_type.replace("_", " ")}
                  </span>
                )}

                {job.salary && (
                  <span className="bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    💰 {job.salary}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {job.source_url && (
              <a
                href={job.source_url}
                target="_blank"
                rel="noreferrer"
                className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all text-sm"
              >
                Apply Now →
              </a>
            )}

            <button
              onClick={toggleSave}
              className={`px-6 py-3 rounded-xl font-semibold text-sm border transition-all ${
                saved
                  ? "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10 hover:text-white"
              }`}
            >
              {saved ? "❤️ Saved" : "🤍 Save Job"}
            </button>
          </div>
        </div>

        {/* Job Description */}
        {description ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-white font-bold text-lg mb-6">
              📋 Job Description
            </h2>

            <div className="text-gray-400 text-sm leading-relaxed whitespace-pre-wrap">
              {description}
            </div>
          </div>
        ) : (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
            <p className="text-gray-600 text-sm">
              No description available. Click Apply to see full details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetail;