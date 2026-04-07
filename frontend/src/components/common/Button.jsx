// Reusable Button component with loading state and variants
const Button = ({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  fullWidth = false,
}) => {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg px-5 py-2.5 text-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed";

  const variants = {
    primary:
      "bg-blue-700 hover:bg-blue-800 text-white focus:ring-blue-500 shadow-md hover:shadow-lg",
    secondary:
      "border border-blue-700 text-blue-700 hover:bg-blue-50 focus:ring-blue-400",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-400",
    ghost: "text-slate-700 hover:bg-slate-100 focus:ring-slate-300",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${fullWidth ? "w-full" : ""} ${className}`}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8z"
            />
          </svg>
          Loading…
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
