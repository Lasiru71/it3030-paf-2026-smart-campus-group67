// Full-page loading spinner
const Loader = ({ message = "Loading…" }) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm z-50">
      <div className="h-12 w-12 rounded-full border-4 border-blue-700 border-t-transparent animate-spin mb-4" />
      <p className="text-slate-600 text-sm font-medium">{message}</p>
    </div>
  );
};

export default Loader;
