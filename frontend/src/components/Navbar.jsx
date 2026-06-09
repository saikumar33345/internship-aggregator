import { Link } from "react-router-dom";

const Navbar = () => {
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-black text-sm">I</span>
          </div>
          <span className="text-white font-bold text-lg tracking-tight">
            InternHub
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <Link
            to="/jobs"
            className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
          >
            Browse Jobs
          </Link>

          {token ? (
            <>
              <Link
                to="/profile"
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              >
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-400 hover:text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:bg-white/5"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-black px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:bg-gray-100"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;