// StudentDashboardPage — Premium Redesign 
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CalendarDays, BookOpen, BarChart3, Settings, Shield,
  Trash2, Edit, LogOut, Bell, Search, TrendingUp,
  Activity, Home, ChevronRight, X, CheckCircle, Clock, Edit3,
  MapPin, Plus, ArrowRight, XCircle, Layers, Globe, Zap, AlertCircle,
  Wrench
} from "lucide-react";
import { ROUTES } from "../utils/constants";

// ─── Constants & Styles ───────────────────────────────────────

const navSections = [
  { header: "MAIN", items: [{ icon: Home, label: "Overview" }] },
  {
    header: "BOOKINGS", items: [
      { icon: Plus, label: "New Booking", route: ROUTES.RESOURCES },
      { icon: CheckCircle, label: "My Individual Bookings", route: ROUTES.MY_INDIVIDUAL_HISTORY },
      { icon: CalendarDays, label: "My History", route: ROUTES.MY_BOOKINGS }
    ]
  },
  {
    header: "ACADEMIC", items: [
      { icon: BookOpen, label: "Resources", route: ROUTES.RESOURCES },
      { icon: Zap, label: "Help & Support", route: ROUTES.CONTACT }
    ]
  },
];

const STATUS_STYLE = {
  CONFIRMED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CheckCircle className="h-3.5 w-3.5" />
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    dot: "bg-amber-500",
    icon: <Clock className="h-3.5 w-3.5" />
  },
  CANCELLED: {
    badge: "bg-red-100 text-red-600 border-red-200",
    dot: "bg-red-500",
    icon: <XCircle className="h-3.5 w-3.5" />
  },
  IN_PROGRESS: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    dot: "bg-blue-500",
    icon: <AlertCircle className="h-3.5 w-3.5" />
  },
};

const SAMPLE_BOOKINGS = [
  { id: "BK-2026-001", resource: "Main Auditorium", location: "Block A, Floor 1", date: "2026-04-14", time: "09:00 – 12:00", status: "CONFIRMED", type: "Event Hall" },
  { id: "BK-2026-002", resource: "Creative Lab B", location: "Block C, Floor 2", date: "2026-04-12", time: "14:00 – 16:00", status: "PENDING", type: "Laboratory" },
  { id: "BK-2026-003", resource: "Conference Room 3", location: "Block B, Floor 3", date: "2026-04-10", time: "10:00 – 11:30", status: "CONFIRMED", type: "Meeting Room" },
];

// ─── Main Component ───────────────────────────────────────────

export default function StudentDashboardPage() {
  const { auth, logoutUser, isStaff, isTechnician } = useAuth();
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("Overview");
  const [search, setSearch] = useState("");
  const [bookings] = useState(SAMPLE_BOOKINGS);

  const displayName = auth?.fullName || auth?.email || "Student";
  const avatarSrc = localStorage.getItem("student_avatar");

  // Fetch real bookings if needed (mocked for redesign speed)
  useEffect(() => {
    // axiosInstance.get('/api/bookings/my') ...
  }, []);

  const stats = [
    {
      label: "Total Bookings", value: "12", change: "+2 this week", trend: "+4.2%",
      icon: Layers,
      gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
      glow: "0 8px 30px rgba(59,130,246,0.35)",
    },
    {
      label: "Confirmed", value: "8", change: "Ready to use", trend: "+8.1%",
      icon: CheckCircle,
      gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
      glow: "0 8px 30px rgba(16,185,129,0.35)",
    },
    {
      label: "Pending", value: "3", change: "Awaiting approval", trend: "Stable",
      icon: Clock,
      gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
      glow: "0 8px 30px rgba(139,92,246,0.35)",
    },
    {
      label: "Cancelled", value: "1", change: "No actions needed", trend: "0 issues",
      icon: XCircle,
      gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
      glow: "0 8px 30px rgba(245,158,11,0.35)",
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        className="w-64 shrink-0 flex flex-col h-full border-r border-white/5"
        style={{ background: "linear-gradient(175deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.07]">
          <div 
            onClick={() => navigate("/")}
            className="flex items-center gap-3 cursor-pointer group transition-all"
          >
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-emerald-500/20 transition-all border border-white/5"
              style={{ background: "linear-gradient(135deg,#10b981,#059669)" }}
            >
              <Shield className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight leading-none group-hover:text-emerald-400 transition-colors">CampusReserve</p>
              <p className="text-slate-500 text-[9px] mt-1 font-bold uppercase tracking-[0.18em]">Student Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {/* STAFF QUICK ACCESS */}
          {(isStaff || isTechnician) && (
            <div className="mb-6 px-2">
              <button 
                onClick={() => navigate(ROUTES.STAFF_DASHBOARD)}
                className="w-full flex items-center gap-3 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-2xl shadow-xl shadow-blue-900/40 transition-all hover:scale-105 active:scale-95 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-8 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <Wrench className="h-5 w-5 animate-bounce" />
                <div className="text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-70 leading-none mb-1">Staff Access</p>
                  <p className="text-xs font-black tracking-tight whitespace-nowrap">View Assigned Ticket</p>
                </div>
                <ArrowRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}

          {navSections.map((section) => (
            <div key={section.header} className="mb-3">
              <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{section.header}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  if (item.label === "My History" && (isStaff || isTechnician)) return null;
                  const active = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        setActiveNav(item.label);
                        if (item.route) navigate(item.route);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                        }`}
                      style={active ? { background: "linear-gradient(135deg,#10b981,#059669)" } : {}}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {item.label}
                      {active && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-60" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar footer */}
        <div className="px-4 pb-5 pt-4 border-t border-white/[0.07]">
          <button
            onClick={() => navigate(ROUTES.STUDENT_PROFILE)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all group mb-1"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-emerald-400 shrink-0" />
            ) : (
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                {displayName[0]}
              </span>
            )}
            <div className="min-w-0 text-left">
              <p className="text-white text-xs font-bold truncate">{displayName}</p>
              <p className="text-slate-500 text-[10px]">Student Member</p>
            </div>
            <Edit3 className="h-3.5 w-3.5 text-slate-600 group-hover:text-emerald-400 ml-auto shrink-0 transition-colors" />
          </button>
          <button
            onClick={() => { logoutUser(); navigate(ROUTES.HOME); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold text-red-400 hover:text-white hover:bg-red-600/20 transition-all"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </aside>

      {/* ══════════ MAIN CONTENT ══════════ */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0 shadow-sm">
          <div>
            <h1 className="text-lg font-black text-slate-900 leading-none">{activeNav}</h1>
            <p className="text-xs text-slate-400 mt-0.5 font-medium">Welcome back, {displayName} 👋</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search resources…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 w-52 transition"
              />
            </div>
            <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Body */}
        <main className="flex-1 overflow-y-auto px-8 py-7 bg-slate-50 space-y-7 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* ─ Colorful Stats ─ */}
          <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
            {stats.map((s) => (
              <div
                key={s.label}
                className="relative rounded-2xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-default"
                style={{ background: s.gradient, boxShadow: s.glow }}
              >
                <div className="absolute -top-5 -right-5 h-24 w-24 rounded-full bg-white/10" />
                <div className="absolute -bottom-8 -left-4 h-20 w-20 rounded-full bg-white/5" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-11 w-11 rounded-xl bg-white/25 flex items-center justify-center shadow-md">
                      <s.icon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-[10px] font-bold bg-white/25 text-white px-2.5 py-1 rounded-full flex items-center gap-1">
                      <TrendingUp className="h-2.5 w-2.5" />
                      {s.trend}
                    </span>
                  </div>
                  <p className="text-3xl font-black text-white tracking-tight leading-none mb-1">{s.value}</p>
                  <p className="text-sm font-bold text-white/80">{s.label}</p>
                  <p className="text-xs text-white/55 mt-1">{s.change}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
            {/* Recent Bookings - Clean White Card */}
            <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Recent Bookings</h2>
                  <p className="text-xs text-slate-400 mt-1">Your latest resource reservations</p>
                </div>
                <Link to={ROUTES.MY_BOOKINGS} className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1">
                  View Full History <ArrowRight className="h-3 w-3" />
                </Link>
              </div>

              <div className="p-7 space-y-4">
                {bookings.map((booking) => {
                  const style = STATUS_STYLE[booking.status] || STATUS_STYLE.PENDING;
                  return (
                    <div key={booking.id} className="group bg-slate-50/50 border border-slate-100 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white hover:border-emerald-100 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                          <BookOpen className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-800">{booking.resource}</h3>
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">{booking.type} • {booking.id}</p>
                          <div className="flex items-center gap-4 text-[11px] font-bold text-slate-500">
                            <span className="flex items-center gap-1.5 text-slate-600"><CalendarDays className="h-3 w-3 text-emerald-500" /> {booking.date}</span>
                            <span className="flex items-center gap-1.5 text-slate-600"><Clock className="h-3 w-3 text-emerald-500" /> {booking.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border shadow-sm flex items-center gap-1.5 ${style.badge}`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${style.dot} shadow-sm`} />
                          {booking.status.replace("_", " ")}
                        </span>
                        <button className="p-2 rounded-lg bg-white border border-slate-100 text-slate-400 hover:text-emerald-600 hover:border-emerald-200 transition-colors">
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Side Column: Highlight + Quick Info */}
            <div className="space-y-7 flex flex-col">
              {/* Upcoming Event Hero */}
              <div className="relative rounded-3xl overflow-hidden p-7 text-white shadow-xl group hover:-translate-y-1 transition-all duration-300"
                style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)" }}
              >
                <div className="absolute top-0 right-0 p-16 bg-emerald-500/10 rounded-bl-[100px] blur-2xl group-hover:bg-emerald-500/20 transition-all" />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400/80">Next Reservation</span>
                  </div>

                  <h3 className="text-xl font-black mb-1 group-hover:text-emerald-400 transition-colors">Main Auditorium</h3>
                  <p className="text-slate-400 text-xs font-bold flex items-center gap-1.5 mb-6"><MapPin className="h-3.5 w-3.5" /> Block A, Floor 1</p>

                  <div className="grid grid-cols-2 gap-3 mb-7">
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Date</p>
                      <p className="text-xs font-black">Tomorrow</p>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-2xl p-3 backdrop-blur-sm">
                      <p className="text-[9px] font-bold text-slate-500 uppercase mb-1">Time</p>
                      <p className="text-xs font-black">09:00 AM</p>
                    </div>
                  </div>

                  <button className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-black text-xs shadow-lg shadow-emerald-600/20 transition-all active:scale-95 flex items-center justify-center gap-2">
                    Manage Booking <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex-1">
                <h3 className="text-sm font-black text-slate-900 mb-1">Quick Tools</h3>
                <p className="text-xs text-slate-400 mb-6">Frequently used student services</p>

                <div className="space-y-3">
                  {[
                    { label: "Find Resources", icon: Search, to: ROUTES.RESOURCES, color: "text-blue-600 bg-blue-50" },
                    { label: "My Profile", icon: Shield, to: ROUTES.STUDENT_PROFILE, color: "text-violet-600 bg-violet-50" },
                    { label: "Contact Admin", icon: Globe, to: ROUTES.CONTACT, color: "text-amber-600 bg-amber-50" },
                  ].map((tool, idx) => (
                    <Link key={idx} to={tool.to} className="flex items-center gap-4 p-3.5 rounded-2xl border border-slate-50 hover:border-emerald-100 hover:bg-emerald-50/30 transition-all group">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 ${tool.color} group-hover:scale-110 transition-transform`}>
                        <tool.icon className="h-4.5 w-4.5" />
                      </div>
                      <span className="font-bold text-slate-700 text-sm">{tool.label}</span>
                      <ChevronRight className="h-3.5 w-3.5 text-slate-300 ml-auto group-hover:text-emerald-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
