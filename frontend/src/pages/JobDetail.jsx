import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import DOMPurify from "dompurify";

const getDaysAgo = (date) => {
  if (!date) return "Recently";

  const days = Math.floor(
    (Date.now() - new Date(date)) /
      (1000 * 60 * 60 * 24)
  );

  if (days <= 0) return "Today";
  if (days === 1) return "1 day ago";

  return `${days} days ago`;
};

const JobDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [expanded,setExpanded]=useState(false);

  useEffect(() => {
    document.title = "Job Details — InternHub";

    fetchJob();
    checkSaved();
  }, [id]);

  const fetchJob = async () => {
    try {
      const response = await API.get(`/jobs/${id}`);
      setJob(response.data);

      console.log("JOB DESCRIPTION:", response.data.description);
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

  const description = DOMPurify.sanitize(
  job.description || ""
);

const shortDescription =
  description.length > 2000
    ? description.slice(0, 2000) + "..."
    : description;

  return (
    <div className="min-h-screen bg-black grid-bg pt-20">
      <div className="fixed top-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 py-10">
        <button
          onClick={() => navigate("/jobs")}
          className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-2 transition-all"
        >
          ← Back to jobs
        </button>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
          <div className="flex items-start gap-4 mb-6">
  <div className="w-14 h-14 rounded-xl bg-indigo-500/20 border border-indigo-500/20 flex items-center justify-center text-white text-xl font-bold shrink-0">
    {job.company?.charAt(0)?.toUpperCase() || "J"}
  </div>

  <div className="flex-1">
    <h1 className="text-3xl font-black text-white mb-2">
      {job.title}
    </h1>

    <p className="text-indigo-400 font-semibold text-lg mb-2">
      {job.company}
    </p>

    <p className="text-gray-500 text-sm mb-4">
      Posted {getDaysAgo(job.created_at)}
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

        {description ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
            <h2 className="text-white font-bold text-lg mb-6">
              📋 Job Description
            </h2>

            <>
  <div
    className="
      prose
      prose-invert
      max-w-none
      prose-headings:text-white
      prose-p:text-gray-300
      prose-li:text-gray-300
      prose-strong:text-white
      prose-a:text-indigo-400
    "
    dangerouslySetInnerHTML={{
      __html: expanded
        ? description
        : shortDescription,
    }}
  />

  {description.length > 2000 && (
    <button
      onClick={() => setExpanded(!expanded)}
      className="
        mt-6
        px-4
        py-2
        rounded-lg
        bg-indigo-500/10
        border
        border-indigo-500/20
        text-indigo-400
        hover:bg-indigo-500/20
        transition-all
      "
    >
      {expanded
        ? "Show Less"
        : "Show More"}
    </button>
  )}
</>
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