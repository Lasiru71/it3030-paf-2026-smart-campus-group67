// Responsive Navbar — shows different content based on auth state
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, X, ChevronDown, LogOut, User } from "lucide-react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

const guestLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Resources", to: ROUTES.RESOURCES },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Contact", to: ROUTES.CONTACT },
];

const authLinks = [
  { label: "Home", to: ROUTES.HOME },
  { label: "Resources", to: ROUTES.RESOURCES },
  { label: "My Bookings", to: ROUTES.MY_BOOKINGS },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Contact", to: ROUTES.CONTACT },
];

const Navbar = () => {
  const { isAuthenticated, auth, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navLinks = isAuthenticated ? authLinks : guestLinks;

  const handleLogout = () => {
    logoutUser();
    setProfileOpen(false);
    navigate(ROUTES.HOME);
  };

  const displayName = auth?.fullName || auth?.email || "User";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Logo />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right-side actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Bell icon */}
                <button className="relative p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition-colors">
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white" />
                </button>

                {/* User profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
                  >
                    <span className="h-8 w-8 rounded-full bg-blue-700 text-white flex items-center justify-center text-xs font-bold uppercase">
                      {displayName[0]}
                    </span>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{auth?.email}</p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate(ROUTES.LOGIN)}>
                  Login
                </Button>
                <Button onClick={() => navigate(ROUTES.SIGNUP)}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMobileOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-700">
                  <User className="h-4 w-4" />
                  {displayName}
                </div>
                <button
                  onClick={() => { handleLogout(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </>
            ) : (
              <>
                <Button variant="ghost" fullWidth onClick={() => { navigate(ROUTES.LOGIN); setMobileOpen(false); }}>
                  Login
                </Button>
                <Button fullWidth onClick={() => { navigate(ROUTES.SIGNUP); setMobileOpen(false); }}>
                  Get Started
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
