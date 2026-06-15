import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black grid-bg flex items-center justify-center text-center px-4">
      <div>
        <div className="text-8xl font-black text-white/10 mb-4">404</div>
        <h1 className="text-3xl font-black text-white mb-3">Page not found</h1>
        <p className="text-gray-500 text-sm mb-8">
          The page you're looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="bg-white text-black font-semibold px-6 py-3 rounded-xl hover:bg-gray-100 transition-all"
        >
          Go home →
        </Link>
      </div>
    </div>
  );
};

export default NotFound;