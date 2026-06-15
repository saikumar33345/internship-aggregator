const Footer = () => {
  return (
    <footer className="border-t border-white/10 py-8 mt-10">
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
            <span className="text-black font-black text-xs">I</span>
          </div>
          <span className="text-white font-bold text-sm">InternHub</span>
        </div>
        <p className="text-gray-600 text-xs">
          Built with FastAPI + React · Auto-updated every 6 hours
        </p>
        <p className="text-gray-600 text-xs">
          © 2026 InternHub
        </p>
      </div>
    </footer>
  );
};

export default Footer;