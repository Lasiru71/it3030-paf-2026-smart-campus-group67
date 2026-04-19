// Responsive Navbar — shows different content based on auth state and user role
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, Menu, X, ChevronDown, LogOut, User, Shield, Wrench, AlertCircle, Search } from "lucide-react";
import Logo from "../common/Logo";
import Button from "../common/Button";
import NotificationBell from "./NotificationBell";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";

const guestLinks = [
  { label: "Home", to: ROUTES.HOME },
  { 
    label: "Facilities & Resources", 
    subLinks: [
      { label: "All Facilities & Resources", to: ROUTES.RESOURCES },
      { label: "Individual Support", to: ROUTES.INDIVIDUAL_BOOKINGS },
    ]
  },
  { label: "About", to: ROUTES.ABOUT },
  { label: "Contact", to: ROUTES.CONTACT },
];

const roleBadgeStyle = {
  ADMIN: "bg-violet-100 text-violet-700 border border-violet-200",
  TECHNICIAN: "bg-amber-100 text-amber-700 border border-amber-200",
  USER: "bg-blue-100 text-blue-700 border border-blue-200",
};

const roleIcon = {
  ADMIN: <Shield className="h-3 w-3" />,
  TECHNICIAN: <Wrench className="h-3 w-3" />,
  USER: <User className="h-3 w-3" />,
};

const Navbar = () => {
  const { isAuthenticated, auth, logoutUser, userRole, isAdmin, isTechnician } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [mobileResourcesOpen, setMobileResourcesOpen] = useState(false);

  // Build nav links based on role
  const authLinks = [
    { label: "Home", to: ROUTES.HOME },
    { 
      label: "Facilities & Resources", 
      subLinks: [
        { label: "All Facilities & Resources", to: ROUTES.RESOURCES },
        ...(!isAdmin && !isTechnician ? [
          { label: "Individual Support", to: ROUTES.INDIVIDUAL_BOOKINGS },
        ] : []),
      ]
    },
    // Role-specific links
    ...(isTechnician ? [{ label: "Technician Portal", to: ROUTES.TECHNICIAN_DASHBOARD }] : []),
    
    // Add "Make a Ticket" for students
    ...(!isAdmin && !isTechnician ? [
      { label: "Make a Ticket", to: ROUTES.MAKE_TICKET, icon: <AlertCircle className="h-4 w-4" /> },
      { label: "Track Ticket", to: ROUTES.TRACK_TICKET, icon: <Search className="h-4 w-4" /> }
    ] : []),

    { label: "About", to: ROUTES.ABOUT },
    { label: "Contact", to: ROUTES.CONTACT },
  ];

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
              link.subLinks ? (
                <div key={link.label} className="relative group/nav">
                  <button
                    onClick={() => setResourcesOpen(!resourcesOpen)}
                    onMouseEnter={() => setResourcesOpen(true)}
                    className="flex items-center gap-1 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
                  >
                    {link.label}
                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${resourcesOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Desktop Dropdown Content */}
                  {resourcesOpen && (
                    <div 
                      onMouseLeave={() => setResourcesOpen(false)}
                      className="absolute left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                    >
                      {link.subLinks.map((sub) => (
                        <Link
                          key={sub.to}
                          to={sub.to}
                          onClick={() => setResourcesOpen(false)}
                          className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          {sub.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={link.to}
                  to={link.to}
                  className="flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-blue-700 transition-colors"
                >
                  {link.icon}
                  {link.label}
                </Link>
              )
            ))}
          </nav>

          {/* Desktop right-side actions */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {/* Notification Bell */}
                <NotificationBell />

                {/* User profile dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
                  >
                    <span className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white ${isAdmin ? "bg-violet-600" : isTechnician ? "bg-amber-600" : "bg-blue-700"}`}>
                      {displayName[0]}
                    </span>
                    <span className="max-w-[120px] truncate">{displayName}</span>
                    <ChevronDown className="h-4 w-4 text-slate-500" />
                  </button>

                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-slate-100">
                        <p className="text-xs text-slate-500">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-800 truncate">{auth?.email}</p>
                        {/* Role badge */}
                        {userRole && (
                          <span className={`inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${roleBadgeStyle[userRole]}`}>
                            {roleIcon[userRole]}
                            {userRole}
                          </span>
                        )}
                      </div>
                      <Link
                        to={isAdmin ? ROUTES.ADMIN_DASHBOARD : isTechnician ? ROUTES.TECHNICIAN_DASHBOARD : ROUTES.STUDENT_DASHBOARD}
                        onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="h-4 w-4 text-slate-400" />
                        My Dashboard
                      </Link>
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
                <Button className="bg-blue-800 hover:bg-blue-900" onClick={() => navigate(ROUTES.SIGNUP)}>
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
            link.subLinks ? (
              <div key={link.label} className="space-y-1">
                <button
                  onClick={() => setMobileResourcesOpen(!mobileResourcesOpen)}
                  className="w-full flex items-center justify-between text-sm font-medium text-slate-700 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {link.label}
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${mobileResourcesOpen ? "rotate-180" : ""}`} />
                </button>
                {mobileResourcesOpen && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
                    {link.subLinks.map((sub) => (
                      <Link
                        key={sub.to}
                        to={sub.to}
                        onClick={() => { setMobileOpen(false); setMobileResourcesOpen(false); }}
                        className="block text-sm font-medium text-slate-600 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-blue-700 py-2 px-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                {link.icon}
                {link.label}
              </Link>
            )
          ))}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2">
                  <span className={`h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold uppercase text-white ${isAdmin ? "bg-violet-600" : isTechnician ? "bg-amber-600" : "bg-blue-700"}`}>
                    {displayName[0]}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-slate-700">{displayName}</p>
                    {userRole && (
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${roleBadgeStyle[userRole]}`}>
                        {roleIcon[userRole]}
                        {userRole}
                      </span>
                    )}
                  </div>
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
                <Button fullWidth className="bg-blue-800 hover:bg-blue-900" onClick={() => { navigate(ROUTES.SIGNUP); setMobileOpen(false); }}>
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
