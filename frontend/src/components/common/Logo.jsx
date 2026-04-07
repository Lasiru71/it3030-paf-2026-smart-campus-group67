// Site logo/brand component
import { BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { APP_NAME, ROUTES } from "../../utils/constants";

const Logo = ({ className = "" }) => {
  return (
    <Link
      to={ROUTES.HOME}
      className={`flex items-center gap-2 text-blue-700 font-bold text-xl tracking-tight hover:opacity-90 transition-opacity ${className}`}
    >
      <BookOpen className="h-7 w-7" strokeWidth={2.5} />
      <span>{APP_NAME}</span>
    </Link>
  );
};

export default Logo;
