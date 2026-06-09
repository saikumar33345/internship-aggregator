import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const FLOATING_TAGS = [
  "Python", "React", "FastAPI", "Node.js", "Machine Learning",
  "UI/UX", "DevOps", "Data Science", "Backend", "Frontend",
  "AWS", "Docker", "Golang", "Rust", "TypeScript"
];

const Home = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-black grid-bg overflow-hidden">
      {/* Gradient orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed top-1/4 right-1/4 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="fixed bottom-1/4 left-1/3 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Hero */}
      <div className="relative max-w-6xl mx-auto px-6 pt-40 pb-20 text-center">

        {/* Badge */}
        <div className={`inline-flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-xs font-medium px-4 py-2 rounded-full mb-8 transition-all duration-700 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
          Auto-updated every 6 hours · Live job data
        </div>

        {/* Heading */}
        <h1 className={`text-6xl md:text-7xl font-black tracking-tight mb-6 transition-all duration-700 delay-100 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <span className="text-white">Find Your</span>
          <br />
          <span className="gradient-text">Dream Internship</span>
        </h1>

        {/* Subheading */}
        <p className={`text-gray-400 text-xl max-w-2xl mx-auto mb-10 leading-relaxed transition-all duration-700 delay-200 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          Aggregated from top job boards across the web.
          Filtered, tracked, and delivered to your inbox automatically.
        </p>

        {/* CTA Buttons */}
        <div className={`flex gap-4 justify-center mb-20 transition-all duration-700 delay-300 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <Link
            to="/register"
            className="bg-white text-black font-semibold px-8 py-3.5 rounded-xl hover:bg-gray-100 transition-all shadow-lg shadow-white/10"
          >
            Get Started Free →
          </Link>
          <Link
            to="/jobs"
            className="bg-white/5 border border-white/10 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/10 transition-all"
          >
            Browse Jobs
          </Link>
        </div>

        {/* Floating tags */}
        <div className={`flex flex-wrap gap-2 justify-center max-w-2xl mx-auto mb-20 transition-all duration-700 delay-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
          {FLOATING_TAGS.map((tag, i) => (
            <span
              key={i}
              className="bg-white/5 border border-white/10 text-gray-400 text-xs px-3 py-1.5 rounded-full hover:border-indigo-500/50 hover:text-white transition-all cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-3 gap-4 max-w-2xl mx-auto transition-all duration-700 delay-500 ${mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {[
            { number: "500+", label: "Live Internships", icon: "💼" },
            { number: "6 hrs", label: "Refresh Rate", icon: "⚡" },
            { number: "Free", label: "Always", icon: "✨" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white/5 border border-white/10 rounded-2xl p-5 card-hover"
            >
              <div className="text-2xl mb-2">{stat.icon}</div>
              <div className="text-2xl font-black text-white mb-1">{stat.number}</div>
              <div className="text-gray-500 text-xs font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;