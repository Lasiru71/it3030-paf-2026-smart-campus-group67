// AdminDashboardPage — vibrant colorful stat cards on clean white background
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  Users, BookOpen, BarChart3, Settings, Shield,
  Trash2, Edit, LogOut, Bell, Search, TrendingUp, Filter,
  Activity, Home, ChevronRight, X, CheckCircle, Clock, Edit3,
  Globe, Lock, Palette, Server, Mail, Smartphone, Moon, Sun, Database, RefreshCw, Save, Download,
  FileText, Plus, Minus
} from "lucide-react";
import { ROUTES } from "../utils/constants";
import { bookingService } from "../services/bookingService";
import { resourceService } from "../services/resourceService";
import axiosInstance from "../services/axiosInstance";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const stats = [
  {
    label: "Total Users", value: "1,284", change: "+12 this week", trend: "+4.2%",
    icon: Users,
    gradient: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
    glow: "0 8px 30px rgba(59,130,246,0.35)",
  },
  {
    label: "Active Bookings", value: "347", change: "+28 today", trend: "+8.1%",
    icon: BookOpen,
    gradient: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    glow: "0 8px 30px rgba(16,185,129,0.35)",
  },
  {
    label: "System Health", value: "99.8%", change: "Uptime", trend: "Stable",
    icon: Activity,
    gradient: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
    glow: "0 8px 30px rgba(139,92,246,0.35)",
  },
  {
    label: "Pending Reviews", value: "14", change: "Needs action", trend: "-3 resolved",
    icon: Settings,
    gradient: "linear-gradient(135deg, #f59e0b 0%, #ea580c 100%)",
    glow: "0 8px 30px rgba(245,158,11,0.35)",
  },
];

const mockUsers = [
  { id: 1, name: "Hasindu Chanuka", email: "hasindu@gmail.com", role: "USER", status: "Active", joined: "Jan 2026" },
  { id: 2, name: "Lasiru Perera", email: "lasiru@gmail.com", role: "ADMIN", status: "Active", joined: "Feb 2026" },
  { id: 3, name: "Kasun Madusanka", email: "kasun@gmail.com", role: "TECHNICIAN", status: "Active", joined: "Mar 2026" },
  { id: 4, name: "Amali Silva", email: "amali@gmail.com", role: "USER", status: "Inactive", joined: "Apr 2026" },
  { id: 5, name: "Nadee Fernando", email: "nadee@gmail.com", role: "USER", status: "Active", joined: "Apr 2026" },
];

const roleStyle = {
  ADMIN: "bg-violet-100 text-violet-700 border border-violet-200",
  TECHNICIAN: "bg-amber-100  text-amber-700  border border-amber-200",
  USER: "bg-sky-100    text-sky-700    border border-sky-200",
};
const avatarGradient = {
  ADMIN: "from-violet-500 to-purple-700",
  TECHNICIAN: "from-amber-400 to-orange-500",
  USER: "from-sky-400 to-blue-600",
};

const navSections = [
  { header: "MAIN", items: [{ icon: Home, label: "Overview" }] },
  { header: "DIRECTORY", items: [{ icon: Users, label: "Users" }] },
  { header: "ACADEMIC", items: [
      { icon: BookOpen, label: "Bookings" },
      { icon: Database, label: "Space Management" }
    ] 
  },
  { header: "BUSINESS", items: [{ icon: FileText, label: "Reports" }] },
  {
    header: "ADMIN", items: [
      { icon: BarChart3, label: "Analytics" },
      { icon: Settings, label: "Settings" },
    ]
  },
];

// ─── Toggle Switch ───────────────────────────────────────────
function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${checked ? "bg-blue-600" : "bg-slate-200"
        }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-200 ${checked ? "translate-x-6" : "translate-x-1"
          }`}
      />
    </button>
  );
}

// ─── Settings Panel ──────────────────────────────────────────
function SettingsPanel({ displayName }) {
  const [notifs, setNotifs] = useState({ email: true, sms: false, push: true, booking: true, security: true });
  const [security, setSecurity] = useState({ twoFa: false, sessionTimeout: "30", loginAlerts: true });
  const [general, setGeneral] = useState({ siteName: "CampusReserve", email: "admin@campusreserve.edu", phone: "+94 11 234 5678" });
  const [appearance, setAppearance] = useState({
    theme: localStorage.getItem("admin_theme") || "light",
    language: "English",
    timezone: "Asia/Colombo"
  });
  const [saved, setSaved] = useState(false);

  // Apply dark mode globally
  useEffect(() => {
    if (appearance.theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("admin_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("admin_theme", "light");
    }
  }, [appearance.theme]);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  const Field = ({ label, value, onChange, type = "text" }) => (
    <div>
      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition shadow-sm"
      />
    </div>
  );

  const Row = ({ label, sub, icon, iconBg, control }) => (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <div className="flex items-center gap-3 pr-4">
        <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
        <div>
          <p className="text-sm font-bold text-slate-800">{label}</p>
          {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
        </div>
      </div>
      {control}
    </div>
  );

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50">
      {/* ── Colorful Hero Banner ── */}
      <div className="relative overflow-hidden px-8 py-6"
        style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "20px 20px" }} />
        <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-blue-200 text-[10px] font-bold uppercase tracking-widest mb-1">Admin Console</p>
            <h2 className="text-2xl font-black text-white">System Settings</h2>
            <p className="text-blue-200 text-sm mt-1">Manage platform preferences, security and notifications</p>
          </div>
          <div className="flex gap-3">
            {[
              { label: "Platform", value: "Online", dot: "bg-emerald-400" },
              { label: "Database", value: "Connected", dot: "bg-emerald-400" },
              { label: "Version", value: "v2.4.1", dot: "bg-blue-300" },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl px-4 py-2.5 text-center shadow-lg">
                <div className="flex items-center justify-center gap-1.5 mb-0.5">
                  <div className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  <span className="text-white text-xs font-bold">{s.value}</span>
                </div>
                <p className="text-blue-300 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="px-8 py-6 space-y-5">
        {saved && (
          <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-3 rounded-2xl shadow-sm">
            <CheckCircle className="h-4 w-4 shrink-0" /> Settings saved successfully!
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          {/* General */}
          <div className="bg-white rounded-2xl border-l-4 border-blue-500 border-t border-r border-b border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-blue-50/40">
              <div className="h-9 w-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">General</h3>
                <p className="text-xs text-slate-400">Platform-wide settings</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-4">
              <Field label="Platform Name" value={general.siteName} onChange={(v) => setGeneral({ ...general, siteName: v })} />
              <Field label="Admin Email" value={general.email} onChange={(v) => setGeneral({ ...general, email: v })} type="email" />
              <Field label="Support Phone" value={general.phone} onChange={(v) => setGeneral({ ...general, phone: v })} />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-2xl border-l-4 border-violet-500 border-t border-r border-b border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-violet-50/40">
              <div className="h-9 w-9 rounded-xl bg-violet-100 flex items-center justify-center shrink-0">
                <Bell className="h-4 w-4 text-violet-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Notifications</h3>
                <p className="text-xs text-slate-400">Control alert channels</p>
              </div>
            </div>
            <div className="px-6 py-2">
              <Row label="Email Notifications" sub="Send updates via email" iconBg="bg-blue-50" icon={<Mail className="h-3.5 w-3.5 text-blue-500" />} control={<Toggle checked={notifs.email} onChange={(v) => setNotifs({ ...notifs, email: v })} />} />
              <Row label="SMS Alerts" sub="Receive SMS for key events" iconBg="bg-emerald-50" icon={<Smartphone className="h-3.5 w-3.5 text-emerald-500" />} control={<Toggle checked={notifs.sms} onChange={(v) => setNotifs({ ...notifs, sms: v })} />} />
              <Row label="Push Notifications" sub="Browser push alerts" iconBg="bg-amber-50" icon={<Bell className="h-3.5 w-3.5 text-amber-500" />} control={<Toggle checked={notifs.push} onChange={(v) => setNotifs({ ...notifs, push: v })} />} />
              <Row label="Booking Updates" sub="Notify on booking changes" iconBg="bg-violet-50" icon={<BookOpen className="h-3.5 w-3.5 text-violet-500" />} control={<Toggle checked={notifs.booking} onChange={(v) => setNotifs({ ...notifs, booking: v })} />} />
              <Row label="Security Alerts" sub="Suspicious login warnings" iconBg="bg-red-50" icon={<Shield className="h-3.5 w-3.5 text-red-500" />} control={<Toggle checked={notifs.security} onChange={(v) => setNotifs({ ...notifs, security: v })} />} />
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-2xl border-l-4 border-red-500 border-t border-r border-b border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-red-50/40">
              <div className="h-9 w-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0">
                <Lock className="h-4 w-4 text-red-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Security</h3>
                <p className="text-xs text-slate-400">Account protection options</p>
              </div>
            </div>
            <div className="px-6 py-2">
              <Row label="Two-Factor Auth (2FA)" sub="Require OTP on login" iconBg="bg-slate-100" icon={<Shield className="h-3.5 w-3.5 text-slate-500" />} control={<Toggle checked={security.twoFa} onChange={(v) => setSecurity({ ...security, twoFa: v })} />} />
              <Row label="Login Activity Alerts" sub="Email on new sign-in" iconBg="bg-slate-100" icon={<Bell className="h-3.5 w-3.5 text-slate-500" />} control={<Toggle checked={security.loginAlerts} onChange={(v) => setSecurity({ ...security, loginAlerts: v })} />} />
            </div>
            <div className="px-6 pb-5">
              <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Session Timeout</label>
              <select
                value={security.sessionTimeout}
                onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition cursor-pointer"
              >
                {["15", "30", "60", "120"].map((v) => <option key={v} value={v}>{v} minutes</option>)}
              </select>
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-2xl border-l-4 border-pink-500 border-t border-r border-b border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3 bg-pink-50/40">
              <div className="h-9 w-9 rounded-xl bg-pink-100 flex items-center justify-center shrink-0">
                <Palette className="h-4 w-4 text-pink-600" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900">Appearance</h3>
                <p className="text-xs text-slate-400">UI language & display preferences</p>
              </div>
            </div>
            <div className="px-6 py-5 space-y-5">
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Theme</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { val: "light", icon: <Sun className="h-4 w-4" />, label: "Light Mode", desc: "Clean, bright layout" },
                    { val: "dark", icon: <Moon className="h-4 w-4" />, label: "Dark Mode", desc: "Easy on the eyes" },
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setAppearance({ ...appearance, theme: t.val })}
                      className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${appearance.theme === t.val
                        ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100 border-blue-500"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                    >
                      <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${appearance.theme === t.val ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500"}`}>
                        {t.icon}
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${appearance.theme === t.val ? "text-blue-700" : "text-slate-700"}`}>{t.label}</p>
                        <p className="text-[10px] text-slate-400">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Language</label>
                <select
                  value={appearance.language}
                  onChange={(e) => setAppearance({ ...appearance, language: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition cursor-pointer"
                >
                  {["English", "Sinhala", "Tamil"].map((l) => <option key={l}>{l}</option>)}
                </select>
              </div>
              <Field label="Timezone" value={appearance.timezone} onChange={(v) => setAppearance({ ...appearance, timezone: v })} />
            </div>
          </div>
        </div>

        {/* System Info */}
        <div className="rounded-2xl overflow-hidden border border-slate-100 shadow-md hover:shadow-lg transition-shadow">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3"
            style={{ background: "linear-gradient(90deg,#0f172a,#1e293b)" }}
          >
            <div className="h-9 w-9 rounded-xl bg-white/10 flex items-center justify-center shadow-inner">
              <Server className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">System Information</h3>
              <p className="text-xs text-slate-400">Live platform status</p>
            </div>
          </div>
          <div className="bg-white px-6 py-5 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Version", value: "v2.4.1", icon: <RefreshCw className="h-4 w-4 text-blue-600" />, bg: "bg-blue-50", badge: "text-blue-700 bg-blue-100 border border-blue-200" },
              { label: "Database", value: "MongoDB", icon: <Database className="h-4 w-4 text-emerald-600" />, bg: "bg-emerald-50", badge: "text-emerald-700 bg-emerald-100 border border-emerald-200" },
              { label: "Storage", value: "14.2 / 50 GB", icon: <Server className="h-4 w-4 text-violet-600" />, bg: "bg-violet-50", badge: "text-violet-700 bg-violet-100 border border-violet-200" },
              { label: "Active Logins", value: "23 sessions", icon: <Users className="h-4 w-4 text-amber-600" />, bg: "bg-amber-50", badge: "text-amber-700 bg-amber-100 border border-amber-200" },
            ].map((info) => (
              <div key={info.label} className="flex items-center gap-3 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${info.bg}`}>
                  {info.icon}
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">{info.label}</p>
                  <p className={`text-xs font-black px-2 py-0.5 rounded-md inline-block shadow-sm ${info.badge}`}>{info.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end pb-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-8 py-3.5 text-sm font-bold text-white rounded-2xl hover:opacity-90 active:scale-95 transition-all"
            style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)", boxShadow: "0 8px 24px rgba(37,99,235,0.35)" }}
          >
            <Save className="h-4 w-4" /> Save All Settings
          </button>
        </div>
      </div>
    </main>
  );
}

// ─── Add User Modal ──────────────────────────────────────────
function AddUserModal({ onClose, onAdd }) {
  const [formData, setFormData] = useState({ name: "", email: "", role: "USER", password: "User@123" });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Email Validation
    if (!formData.email.endsWith("@gmail.com")) {
      alert("Only @gmail.com emails are allowed.");
      return;
    }

    // Password Validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(formData.password)) {
      alert("Password must be at least 6 characters, and include uppercase, lowercase, and a number.");
      return;
    }

    onAdd({
      fullName: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl border border-slate-100 overflow-hidden transform scale-100 animate-in zoom-in-95 duration-200">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-lg font-black text-slate-900">Add New User</h3>
            <p className="text-xs text-slate-500 mt-0.5">Register a new platform account</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-xl hover:bg-slate-200 text-slate-400 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Full Name</label>
            <input required type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Email Address</label>
            <input required type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">Role</label>
            <select value={formData.role} onChange={(e) => setFormData({ ...formData, role: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
              <option value="USER">User (Student/Staff)</option>
              <option value="TECHNICIAN">Technician</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-slate-50 mt-6 md:mt-8">
            <button type="button" onClick={onClose} className="px-5 py-2.5 text-xs font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition">Cancel</button>
            <button type="submit" className="flex items-center gap-2 px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all" style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}>
              <Users className="h-3.5 w-3.5" /> Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Bookings Panel ──────────────────────────────────────────
function BookingsPanel() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    bookingService.getAllBookings()
      .then(res => {
        setBookings(res);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch bookings", err);
        setLoading(false);
      });
  }, []);

  const handleStatusChange = (id, newStatus) => {
    bookingService.updateBookingStatus(id, newStatus)
      .then(updatedBooking => {
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: updatedBooking.status } : b));
      })
      .catch(err => console.error("Update failed", err));
  };

  const handleApproveClick = (bookingId) => {
    setApprovingId(bookingId);
    setNewSpaces("");
  };



  const getStatusColor = (status) => {
    if (status === "APPROVED") return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (status === "REJECTED") return "bg-red-100 text-red-700 border-red-200";
    return "bg-amber-100 text-amber-700 border-amber-200";
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Academic Bookings</h2>
          <p className="text-sm text-slate-500">Manage facility and resource reservations</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-500 font-medium">Loading bookings...</div>
        ) : bookings.length === 0 ? (
          <div className="p-10 text-center text-slate-500 font-medium">No bookings found.</div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Resource</th>
                <th className="p-4">Requested By</th>
                <th className="p-4">Date & Time</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map(booking => (
                <tr key={booking.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <p className="font-bold text-sm text-slate-800">{booking.resourceName}</p>
                    <p className="text-xs text-slate-500">{booking.members} members</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700">{booking.userEmail}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-sm font-semibold text-slate-700">{booking.bookingDate}</p>
                    <p className="text-xs text-slate-500">{booking.bookingTime}</p>
                  </td>
                  <td className="p-4 text-sm font-semibold text-slate-700">
                    {booking.durationHours}h {booking.durationMinutes > 0 ? `${booking.durationMinutes}m` : ""}
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${getStatusColor(booking.status)}`}>
                      {booking.status || "PENDING"}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    {(booking.status === "PENDING" || !booking.status) && (
                        <div className="flex justify-end items-center gap-2">
                          <button 
                            onClick={() => handleStatusChange(booking.id, "APPROVED")} 
                            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl shadow-sm transition-all shadow-emerald-200"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => handleStatusChange(booking.id, "REJECTED")} 
                            className="px-4 py-2 bg-slate-100 hover:bg-red-50 hover:text-red-600 text-slate-600 text-xs font-bold rounded-xl transition-all"
                          >
                            Reject
                          </button>
                        </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

// ─── Space Management Panel ──────────────────────────────────
function SpaceManagementPanel() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = () => {
    setLoading(true);
    resourceService.getAllResources()
      .then(data => {
        setResources(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch resources", err);
        setLoading(false);
      });
  };

  const handleStatusChange = (id, newStatus) => {
    resourceService.updateResourceStatus(id, newStatus)
      .then(() => {
        setResources(prev => prev.map(r => {
          if (r.id === id) {
            const updated = { ...r, status: newStatus };
            if (newStatus === "Maintenance" || newStatus === "Booked") {
              updated.availableSpaces = 0;
            }
            return updated;
          }
          return r;
        }));
      })
      .catch(err => console.error("Status update failed", err));
  };

  const getStatusStyle = (status) => {
    if (status === "Available") return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (status === "Maintenance") return "bg-amber-50 text-amber-700 border-amber-200";
    if (status === "Booked") return "bg-red-50 text-red-700 border-red-200";
    return "bg-slate-50 text-slate-700 border-slate-200";
  };

  const handleUpdate = (id, currentVal) => {
    setUpdatingId(id);
    setEditValue(currentVal.toString());
  };

  const saveUpdate = (id) => {
    if (isNaN(editValue) || editValue === "") {
      alert("Please enter a valid number.");
      return;
    }

    resourceService.updateAvailableSpaces(id, parseInt(editValue))
      .then(() => {
        setResources(prev => prev.map(r => r.id === id ? { ...r, availableSpaces: parseInt(editValue) } : r));
        setUpdatingId(null);
      })
      .catch(err => {
        console.error("Update failed", err);
        alert("Error updating spaces.");
      });
  };

  const quickAdjust = (res, delta) => {
    const newValue = Math.max(0, Math.min(res.capacity, res.availableSpaces + delta));
    if (newValue === res.availableSpaces) return;

    resourceService.updateAvailableSpaces(res.id, newValue)
      .then(() => {
        setResources(prev => prev.map(r => r.id === res.id ? { ...r, availableSpaces: newValue } : r));
      })
      .catch(err => console.error("Quick adjust failed", err));
  };

  return (
    <main className="flex-1 overflow-y-auto bg-slate-50 p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Space Management</h2>
          <p className="text-sm text-slate-500">Manually control facility availability and seat counts</p>
        </div>
        <button 
          onClick={fetchResources}
          className="p-2.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <RefreshCw className="h-4 w-4" />
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-20 text-center">
            <RefreshCw className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
            <p className="text-slate-500 font-medium">Loading facilities...</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] uppercase tracking-widest text-slate-400 font-extrabold">
                <th className="px-8 py-5">Resource</th>
                <th className="px-8 py-5">Category</th>
                <th className="px-8 py-5">Total Capacity</th>
                <th className="px-8 py-5">Available Seats</th>
                <th className="px-8 py-5">Current Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {resources.map((res) => (
                <tr key={res.id} className="hover:bg-slate-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl overflow-hidden shadow-sm">
                        <img src={res.image} alt="" className="h-full w-full object-cover" />
                      </div>
                      <p className="font-bold text-slate-800 text-sm">{res.name}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-2.5 py-1 rounded-md bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider border border-blue-100">
                      {res.category}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-2 text-slate-500">
                      <Users className="h-3.5 w-3.5" />
                      <span className="text-sm font-semibold">{res.capacity}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    {updatingId === res.id ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="number"
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          className="w-20 px-3 py-1.5 text-xs font-bold border-2 border-blue-500 rounded-lg outline-none"
                        />
                        <button 
                          onClick={() => saveUpdate(res.id)}
                          className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          <Save className="h-3.5 w-3.5" />
                        </button>
                        <button 
                          onClick={() => setUpdatingId(null)}
                          className="p-1.5 bg-slate-100 text-slate-400 rounded-lg hover:text-slate-600 transition"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => quickAdjust(res, -1)}
                          disabled={res.availableSpaces === 0}
                          className="p-1 px-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-red-50 hover:text-red-500 disabled:opacity-30 transition-colors"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        
                        <div className="flex flex-col items-center">
                          <span className={`text-sm font-black min-w-[2ch] text-center ${res.availableSpaces === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                            {res.availableSpaces}
                          </span>
                        </div>

                        <button 
                          onClick={() => quickAdjust(res, 1)}
                          disabled={res.availableSpaces >= res.capacity}
                          className="p-1 px-1.5 bg-slate-100 text-slate-500 rounded-lg hover:bg-emerald-50 hover:text-emerald-500 disabled:opacity-30 transition-colors"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                        
                        <div className="h-1.5 w-16 bg-slate-100 rounded-full overflow-hidden hidden xl:block ml-2">
                          <div 
                            className={`h-full transition-all duration-500 ${res.availableSpaces === 0 ? 'bg-red-400' : 'bg-emerald-400'}`}
                            style={{ width: `${(res.availableSpaces / res.capacity) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      value={res.status} 
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider border outline-none cursor-pointer transition-all ${getStatusStyle(res.status)}`}
                    >
                      <option value="Available">Available</option>
                      <option value="Maintenance">Maintenance</option>
                      <option value="Booked">Booked</option>
                    </select>
                  </td>
                  <td className="px-8 py-5 text-right">
                    {updatingId !== res.id && (
                      <button 
                        onClick={() => handleUpdate(res.id, res.availableSpaces)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

export default function AdminDashboardPage() {
  const { auth, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState(mockUsers);
  const [toast, setToast] = useState(null);
  const [activeNav, setActiveNav] = useState("Users");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [roleFilter, setRoleFilter] = useState("All");
  const [hoveredRole, setHoveredRole] = useState(null);

  // Derive dynamic stats from users array (real or mock fallback)
  const adminCount = users.filter((u) => u.role === "ADMIN").length;
  const techCount = users.filter((u) => u.role === "TECHNICIAN").length;
  const standardCount = users.filter((u) => u.role === "USER" || u.role === "STUDENT").length;
  const totalUsers = users.length || 1;

  const adminPct = `${Math.round((adminCount / totalUsers) * 100)}%`;
  const techPct = `${Math.round((techCount / totalUsers) * 100)}%`;
  const userPct = `${Math.round((standardCount / totalUsers) * 100)}%`;

  // Provide realistic top card metrics based on user table size
  stats[0].value = users.length.toString();

  useEffect(() => {
    axiosInstance.get("/api/users")
      .then(res => {
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map(u => ({
            id: u.id,
            name: u.fullName || u.email.split("@")[0],
            email: u.email,
            role: u.role || "USER",
            status: u.status || "Active",
            joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"
          }));
          setUsers(mapped);
        }
      })
      .catch(err => console.warn("Using mock users. Backend fetch failed:", err.message));
  }, []);

  const generateUserTablePDF = () => {
    const doc = new jsPDF();

    // Colorful header background
    doc.setFillColor(37, 99, 235); // Blue gradient base
    doc.rect(0, 0, 210, 40, "F");

    // Title
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CampusReserve User Analytics", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });

    // Summary stats
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("System Overview", 14, 55);

    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Accounts: ${totalUsers}`, 14, 65);
    doc.text(`Administrators: ${adminCount}`, 14, 72);
    doc.text(`Technicians: ${techCount}`, 14, 79);
    doc.text(`Standard Users: ${standardCount}`, 14, 86);

    // Users Table
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Registered Accounts Directory", 14, 105);

    const tableColumn = ["#", "Name", "Email", "Role", "Joined Date", "Status"];
    const tableRows = [];

    users.forEach((u, i) => {
      tableRows.push([
        i + 1,
        u.name,
        u.email,
        u.role,
        u.joined,
        u.status
      ]);
    });

    autoTable(doc, {
      startY: 110,
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { top: 10 }
    });

    doc.save("CampusReserve_User_Report.pdf");

    setToast("Report downloaded successfully! 📊");
    setTimeout(() => setToast(null), 3000);
  };

  const generateSystemPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CampusReserve System Overview", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Platform Statistics", 14, 55);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Total Users: ${totalUsers}`, 14, 65);
    doc.text(`Administrators: ${adminCount}`, 14, 72);
    doc.text(`Technicians: ${techCount}`, 14, 79);
    doc.text(`Standard Users: ${standardCount}`, 14, 86);
    doc.text("System Health: 99.8% Uptime", 14, 93);
    doc.text("Active Bookings: 347", 14, 100);
    autoTable(doc, {
      startY: 115,
      head: [["Component", "Status", "Details"]],
      body: [
        ["Platform Version", "v2.4.1", "Latest stable"],
        ["Database", "MongoDB", "Connected"],
        ["Storage", "14.2 / 50 GB", "28.4% used"],
        ["Active Sessions", "23", "Real-time"],
        ["Server CPU", "32%", "Normal"],
        ["Memory Usage", "2.4 GB", "45% capacity"],
      ],
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    doc.save("CampusReserve_System_Overview.pdf");
    setToast("System overview report downloaded! 📊");
    setTimeout(() => setToast(null), 3000);
  };

  const generateBookingPDF = () => {
    const doc = new jsPDF();
    doc.setFillColor(37, 99, 235);
    doc.rect(0, 0, 210, 40, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.text("CampusReserve Booking Report", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on ${new Date().toLocaleString()}`, 105, 30, { align: "center" });
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Booking Overview", 14, 55);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Active Bookings: 347", 14, 65);
    doc.text("Pending Approvals: 14", 14, 72);
    doc.text("Completed This Month: 289", 14, 79);
    autoTable(doc, {
      startY: 95,
      head: [["#", "Facility", "Booked By", "Date", "Time", "Status"]],
      body: [
        ["1", "Auditorium A", "Hasindu C.", "2026-04-12", "09:00-11:00", "Approved"],
        ["2", "Lab Room 3", "Kasun M.", "2026-04-12", "14:00-16:00", "Pending"],
        ["3", "Conference Hall", "Amali S.", "2026-04-13", "10:00-12:00", "Approved"],
        ["4", "Sports Complex", "Nadee F.", "2026-04-13", "15:00-17:00", "Pending"],
        ["5", "Library Room 2", "Lasiru P.", "2026-04-14", "08:00-10:00", "Approved"],
      ],
      theme: "grid",
      headStyles: { fillColor: [79, 70, 229], textColor: [255, 255, 255], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [248, 250, 252] },
    });
    doc.save("CampusReserve_Booking_Report.pdf");
    setToast("Booking report downloaded! 📊");
    setTimeout(() => setToast(null), 3000);
  };

  const displayName = auth?.fullName || auth?.email || "Admin";
  const avatarSrc = localStorage.getItem("admin_avatar");

  const handleDelete = (id) => {
    axiosInstance.delete(`/api/users/${id}`)
      .then(() => {
        setUsers((prev) => prev.filter((u) => u.id !== id));
        setToast("User removed successfully.");
      })
      .catch(err => {
        console.error("Delete failed:", err);
        const isMock = typeof id === 'number' || id.length < 5;
        setToast(isMock ? "Mock user removed locally." : "Error: Could not delete user from system.");
        // Fallback for mock data
        if (isMock) {
          setUsers((prev) => prev.filter((u) => u.id !== id));
        }
      });
    setTimeout(() => setToast(null), 3000);
  };

  const handleToggleStatus = (id) => {
    axiosInstance.patch(`/api/users/${id}/status`)
      .then(res => {
        setUsers(prev => prev.map(u => u.id === id ? { ...u, status: res.data.status } : u));
        setToast(`User ${res.data.status === "Active" ? "activated" : "deactivated"} successfully.`);
      })
      .catch(err => {
        console.error("Status toggle failed:", err);
        setToast("Error updating status. Persistent ID required.");
        // Fallback for mock data
        if (typeof id === 'number') {
          setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u));
        }
      });
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = users.filter(
    (u) =>
      (u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())) &&
      (roleFilter === "All" || u.role === roleFilter)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* ══════════ SIDEBAR ══════════ */}
      <aside
        className="w-64 shrink-0 flex flex-col h-full border-r border-white/5"
        style={{ background: "linear-gradient(175deg, #0f172a 0%, #1e293b 60%, #0f172a 100%)" }}
      >
        {/* Brand */}
        <div className="px-6 pt-7 pb-5 border-b border-white/[0.07]">
          <div className="flex items-center gap-3">
            <div
              className="h-10 w-10 rounded-2xl flex items-center justify-center shadow-xl"
              style={{ background: "linear-gradient(135deg,#38bdf8,#2563eb)" }}
            >
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-white font-black text-sm tracking-tight leading-none">CampusReserve</p>
              <p className="text-slate-500 text-[9px] mt-1 font-bold uppercase tracking-[0.18em]">Admin Console</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.header} className="mb-3">
              <p className="px-4 mb-1.5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">{section.header}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = activeNav === item.label;
                  return (
                    <button
                      key={item.label}
                      onClick={() => setActiveNav(item.label)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "text-white shadow-lg" : "text-slate-400 hover:text-white hover:bg-white/[0.07]"
                        }`}
                      style={active ? { background: "linear-gradient(135deg,#2563eb,#4f46e5)" } : {}}
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
            onClick={() => navigate(ROUTES.ADMIN_PROFILE)}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.07] transition-all group mb-1"
          >
            {avatarSrc ? (
              <img src={avatarSrc} alt="" className="h-8 w-8 rounded-full object-cover border-2 border-violet-400 shrink-0" />
            ) : (
              <span className="h-8 w-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 text-white flex items-center justify-center text-xs font-black uppercase shrink-0">
                {displayName[0]}
              </span>
            )}
            <div className="min-w-0 text-left">
              <p className="text-white text-xs font-bold truncate">{displayName}</p>
              <p className="text-slate-500 text-[10px]">Administrator</p>
            </div>
            <Edit3 className="h-3.5 w-3.5 text-slate-600 group-hover:text-blue-400 ml-auto shrink-0 transition-colors" />
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
                placeholder="Search users…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-52 transition"
              />
            </div>
            <button className="relative p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors text-slate-500">
              <Bell className="h-4 w-4" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
          </div>
        </header>

        {/* Body — conditionally render panels */}
        {activeNav === "Settings" && <SettingsPanel displayName={displayName} />}
        {activeNav === "Bookings" && <BookingsPanel />}
        {activeNav === "Space Management" && <SpaceManagementPanel />}

        {(activeNav === "Overview" || activeNav === "Users" || activeNav === "Analytics" || activeNav === "Reports") && (
          <main className={`flex-1 overflow-y-auto px-8 py-7 bg-slate-50 ${(activeNav === "Overview" || activeNav === "Analytics" || activeNav === "Reports") ? "space-y-7" : ""} animate-in fade-in slide-in-from-bottom-2 duration-500`}>

            {/* ─ Colorful Stats ─ */}
            {activeNav === "Overview" && (
              <div className="grid grid-cols-2 xl:grid-cols-4 gap-5">
                {stats.map((s) => (
                  <div
                    key={s.label}
                    className="relative rounded-2xl p-5 overflow-hidden hover:scale-[1.02] transition-transform duration-200 cursor-default"
                    style={{ background: s.gradient, boxShadow: s.glow }}
                  >
                    {/* Decorative circles */}
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
            )}

            {/* ─ User Growth Trend + Enrollment Distribution ─ */}
            {activeNav === "Overview" && (
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-7">
                {/* User Growth Trend (Line Chart) */}
                <div className="lg:col-span-3 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="px-7 py-6 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-lg font-black text-slate-900">User Growth Trend</h2>
                    <select className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none cursor-pointer">
                      <option>Last 30 Days</option>
                      <option>Last 7 Days</option>
                      <option>Last 90 Days</option>
                    </select>
                  </div>
                  <div className="p-7">
                    <svg viewBox="0 0 500 200" className="w-full h-[220px]">
                      {[0, 1, 2, 3, 4].map((i) => (
                        <g key={i}>
                          <line x1="40" y1={20 + i * 40} x2="480" y2={20 + i * 40} stroke="#e2e8f0" strokeWidth="0.5" strokeDasharray="4 4" />
                          <text x="30" y={24 + i * 40} textAnchor="end" fill="#94a3b8" fontSize="10">{16 - i * 4}</text>
                        </g>
                      ))}
                      <text x="60" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">Mar</text>
                      <text x="270" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">Mid</text>
                      <text x="460" y="195" textAnchor="middle" fill="#94a3b8" fontSize="10">Apr</text>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#10b981" stopOpacity="0.02" />
                        </linearGradient>
                      </defs>
                      <path d="M60,150 L120,140 L180,125 L240,115 L300,85 L360,65 L420,55 L460,35 L460,175 L60,175 Z" fill="url(#areaGrad)" />
                      <polyline fill="none" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" points="60,150 120,140 180,125 240,115 300,85 360,65 420,55 460,35" />
                      {[[60, 150], [120, 140], [180, 125], [240, 115], [300, 85], [360, 65], [420, 55], [460, 35]].map(([cx, cy], i) => (
                        <circle key={i} cx={cx} cy={cy} r="3.5" fill="#10b981" stroke="white" strokeWidth="2" />
                      ))}
                    </svg>
                  </div>
                </div>

                {/* Enrollment Distribution (Donut Chart) */}
                <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                  <div className="px-7 py-6 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-900">Enrollment Distribution</h2>
                  </div>
                  <div className="p-7 flex flex-col items-center justify-center">
                    <svg viewBox="0 0 200 200" className="w-44 h-44">
                      <circle cx="100" cy="100" r="70" fill="none" stroke="#e2e8f0" strokeWidth="20" />
                      {/* Students */}
                      <circle
                        cx="100" cy="100" r="70" fill="none" stroke="#10b981" strokeWidth="20"
                        strokeDasharray={`${(standardCount / totalUsers) * 439.82} ${439.82}`}
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300 hover:stroke-[25px]"
                        onMouseEnter={() => setHoveredRole({ label: "Students", count: standardCount })}
                        onMouseLeave={() => setHoveredRole(null)}
                      />
                      {/* Technicians */}
                      <circle
                        cx="100" cy="100" r="70" fill="none" stroke="#6366f1" strokeWidth="20"
                        strokeDasharray={`${(techCount / totalUsers) * 439.82} ${439.82}`}
                        strokeDashoffset={`${-(standardCount / totalUsers) * 439.82}`}
                        transform="rotate(-90 100 100)"
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300 hover:stroke-[25px]"
                        onMouseEnter={() => setHoveredRole({ label: "Technicians", count: techCount })}
                        onMouseLeave={() => setHoveredRole(null)}
                      />
                      {/* Admins */}
                      <circle
                        cx="100" cy="100" r="70" fill="none" stroke="#1e1b4b" strokeWidth="20"
                        strokeDasharray={`${(adminCount / totalUsers) * 439.82} ${439.82}`}
                        strokeDashoffset={`${-((standardCount + techCount) / totalUsers) * 439.82}`}
                        transform="rotate(-90 100 100)"
                        strokeLinecap="round"
                        className="cursor-pointer transition-all duration-300 hover:stroke-[25px]"
                        onMouseEnter={() => setHoveredRole({ label: "Admins", count: adminCount })}
                        onMouseLeave={() => setHoveredRole(null)}
                      />
                      <text x="100" y="95" textAnchor="middle" fill="#1e293b" fontSize="28" fontWeight="800" className="transition-all duration-300">
                        {hoveredRole ? hoveredRole.count : totalUsers}
                      </text>
                      <text x="100" y="115" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="600" className="transition-all duration-300 tracking-wider">
                        {hoveredRole ? hoveredRole.label.toUpperCase() : "TOTAL"}
                      </text>
                    </svg>
                    <div className="flex items-center justify-center gap-5 mt-6">
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-emerald-500" /><span className="text-xs font-bold text-slate-600">Students</span></div>
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-indigo-500" /><span className="text-xs font-bold text-slate-600">Technicians</span></div>
                      <div className="flex items-center gap-2"><div className="h-3 w-3 rounded-full bg-indigo-950" /><span className="text-xs font-bold text-slate-600">Admins</span></div>
                    </div>
                  </div>
                </div>
              </div>
            )}



            {/* ─ System Analytics Tab ─ */}
            {activeNav === "Analytics" && (
              <div className="space-y-7">
                {/* Header */}
                <div>
                  <h2 className="text-xl font-black text-slate-900">System Insights</h2>
                  <p className="text-sm text-slate-500 mt-1">Deep-dive into performance and platform telemetry.</p>
                </div>

                {/* Top Metrics Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {[
                    { label: "Server CPU", value: "32%", stat: "Normal", color: "bg-blue-500", ring: "ring-blue-500/20" },
                    { label: "Memory Usage", value: "2.4 GB", stat: "45% cap", color: "bg-emerald-500", ring: "ring-emerald-500/20" },
                    { label: "Network I/O", value: "148 MB/s", stat: "Peak", color: "bg-violet-500", ring: "ring-violet-500/20" }
                  ].map((m, i) => (
                    <div key={i} className={`p-6 rounded-3xl bg-white border border-slate-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-all`}>
                      <div className={`absolute top-0 right-0 p-8 rounded-bl-full bg-slate-50 ring-4 ${m.ring} transition-transform group-hover:scale-110`} />
                      <p className="text-xs font-bold text-slate-400 mb-2 tracking-wider uppercase relative z-10">{m.label}</p>
                      <p className="text-3xl font-black text-slate-800 relative z-10">{m.value}</p>
                      <div className="flex items-center gap-2 mt-4 relative z-10">
                        <div className={`h-2 w-2 rounded-full ${m.color} animate-pulse`} />
                        <span className="text-xs font-bold text-slate-500">{m.stat}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Bottom Split */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-7">
                  {/* Traffic Sources */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-1 p-7 flex flex-col">
                    <h3 className="text-sm font-black text-slate-900 mb-6 uppercase tracking-wider">Device Traffic</h3>
                    <div className="flex-1 flex flex-col justify-center gap-6">
                      {[
                        { icon: Smartphone, label: "Mobile Apps", pct: 65, color: "from-blue-500 to-indigo-600" },
                        { icon: Globe, label: "Web Desktop", pct: 28, color: "from-emerald-400 to-teal-500" },
                        { icon: Server, label: "API Consumers", pct: 7, color: "from-amber-400 to-orange-500" }
                      ].map((t, idx) => (
                        <div key={idx}>
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2 text-slate-700">
                              <t.icon className="h-4 w-4" />
                              <span className="text-xs font-bold">{t.label}</span>
                            </div>
                            <span className="text-xs font-black">{t.pct}%</span>
                          </div>
                          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full bg-gradient-to-r ${t.color} rounded-full`} style={{ width: `${t.pct}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Logs */}
                  <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden lg:col-span-2">
                    <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Recent Telemetry</h3>
                      <button className="text-xs font-bold text-blue-600 hover:text-blue-700">View All</button>
                    </div>
                    <div className="px-7 py-4">
                      {[
                        { time: "2m ago", evt: "Database Sync Check", stat: "Success", sc: "text-emerald-600 bg-emerald-50" },
                        { time: "14m ago", evt: "Failed Login Attempt (IP: 192.168.1.5)", stat: "Warn", sc: "text-amber-600 bg-amber-50" },
                        { time: "1h ago", evt: "Weekly Backup Generated", stat: "Success", sc: "text-emerald-600 bg-emerald-50" },
                        { time: "3h ago", evt: "High CPU Spike (Node 2)", stat: "Resolved", sc: "text-blue-600 bg-blue-50" }
                      ].map((log, n) => (
                        <div key={n} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 group">
                          <div className="flex items-center gap-4">
                            <span className="text-xs font-bold text-slate-400 w-16">{log.time}</span>
                            <span className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">{log.evt}</span>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${log.sc}`}>{log.stat}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─ Reports Tab ─ */}
            {activeNav === "Reports" && (
              <div className="space-y-7">
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-1">Report Center</h3>
                  <p className="text-xs text-slate-500 mb-6">Generate professional PDF reports for your specific modules.</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* System Overview */}
                    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300">
                      <div>
                        <div className="h-12 w-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                          <FileText className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-slate-800">System Overview</h4>
                          <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 text-[10px] font-black uppercase tracking-wider">Growth</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-8 leading-relaxed">A comprehensive document containing platform health, user growth trends, and overall performance metrics.</p>
                      </div>
                      <button
                        onClick={generateSystemPDF}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-md group-hover:shadow-lg"
                      >
                        <Download className="h-4 w-4" /> Generate Report
                      </button>
                    </div>

                    {/* User Directory */}
                    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-500/10 hover:-translate-y-1 transition-all duration-300">
                      <div>
                        <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-slate-800">User Directory</h4>
                          <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-wider">Access</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-8 leading-relaxed">Detailed records of all registered accounts, roles, access levels, and registration timestamps across the system.</p>
                      </div>
                      <button
                        onClick={generateUserTablePDF}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-md group-hover:shadow-lg"
                      >
                        <Download className="h-4 w-4" /> Generate Report
                      </button>
                    </div>

                    {/* Booking Report */}
                    <div className="group bg-white rounded-3xl border border-slate-100 shadow-sm p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-violet-500/10 hover:-translate-y-1 transition-all duration-300">
                      <div>
                        <div className="h-12 w-12 bg-violet-50 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                          <BookOpen className="h-6 w-6 text-violet-600" />
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-lg font-bold text-slate-800">Booking Analytics</h4>
                          <span className="px-2 py-0.5 rounded-md bg-violet-100 text-violet-700 text-[10px] font-black uppercase tracking-wider">Academic</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-8 leading-relaxed">Complete transaction history for all reservations, including student details, resource allocation, and status logs.</p>
                      </div>
                      <button
                        onClick={generateBookingPDF}
                        className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-800 text-white text-sm font-bold rounded-xl hover:bg-slate-900 active:scale-95 transition-all shadow-md group-hover:shadow-lg"
                      >
                        <Download className="h-4 w-4" /> Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ─ User Table ─ */}
            {activeNav === "Users" && (
              <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden min-h-[600px]">
                {/* Table header */}
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">User Directory</h2>
                  </div>
                  <div className="flex items-center gap-4 flex-1 max-w-4xl justify-end">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-slate-400" />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="text-xs font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition cursor-pointer"
                      >
                        <option value="All">All Roles</option>
                        <option value="ADMIN">Administrators</option>
                        <option value="USER">Users</option>
                        <option value="TECHNICIAN">Technicians</option>
                      </select>
                    </div>
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 text-sm border border-slate-200 rounded-xl bg-slate-50 text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                      />
                    </div>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="flex items-center gap-2 text-sm font-bold text-white px-5 py-2.5 rounded-xl shadow-lg hover:opacity-90 active:scale-95 transition-all whitespace-nowrap"
                      style={{ background: "linear-gradient(135deg,#2563eb,#4f46e5)" }}
                    >
                      <Users className="h-4 w-4" /> Add New User
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {["Name", "Email", "Role", "Status", "Actions"].map((h) => (
                          <th key={h} className="text-left px-7 py-4 text-[11px] font-extrabold text-slate-400 uppercase tracking-widest">
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((user, i) => (
                        <tr
                          key={user.id}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <td className="px-7 py-5">
                            <span className="font-bold text-blue-600 hover:underline cursor-pointer transition-all">{user.name}</span>
                          </td>
                          <td className="px-7 py-5 text-slate-500 font-medium">{user.email}</td>
                          <td className="px-7 py-5">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm ${roleStyle[user.role] || roleStyle.USER}`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-2">
                              <div className={`h-1.5 w-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-300'}`} />
                              <span className="text-sm font-bold text-slate-700">{user.status}</span>
                            </div>
                          </td>
                          <td className="px-7 py-5">
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleToggleStatus(user.id)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.status === "Active"
                                  ? "bg-slate-100 text-slate-700 hover:bg-slate-200"
                                  : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                  }`}
                              >
                                {user.status === "Active" ? (
                                  <><RefreshCw className="h-3.5 w-3.5" /> Deactivate</>
                                ) : (
                                  <><CheckCircle className="h-3.5 w-3.5" /> Activate</>
                                )}
                              </button>
                              <button
                                onClick={() => handleDelete(user.id)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors"
                              >
                                <Trash2 className="h-3.5 w-3.5" /> Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}

                      {filtered.length === 0 && (
                        <tr>
                          <td colSpan={5} className="text-center py-12 text-slate-400">
                            <Users className="h-8 w-8 mx-auto mb-2 opacity-20" />
                            <p className="font-semibold text-sm">No users match your search</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </main>
        )}
      </div>

      {/* Add User Modal */}
      {
        isAddModalOpen && (
          <AddUserModal
            onClose={() => setIsAddModalOpen(false)}
            onAdd={(data) => {
              axiosInstance.post("/api/auth/signup", data)
                .then(res => {
                  // After signup, we might need to fetch the full list again to get the ID, 
                  // or the backend might return the user in the data field of ApiResponse.
                  setToast("User created successfully in database.");
                  // Refresh users list to get the real ID and status
                  axiosInstance.get("/api/users").then(res2 => {
                    const mapped = res2.data.map(u => ({
                      id: u.id,
                      name: u.fullName || u.email.split("@")[0],
                      email: u.email,
                      role: u.role || "USER",
                      status: u.status || "Active",
                      joined: u.createdAt ? new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "Recently"
                    }));
                    setUsers(mapped);
                  });
                })
                .catch(err => {
                  console.error("Add user failed:", err);
                  setToast("Failed to create user: " + (err.response?.data?.message || err.message));
                });
              setTimeout(() => setToast(null), 3000);
            }}
          />
        )
      }

      {/* Toast */}
      {
        toast && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-900 text-white text-sm font-semibold px-5 py-3.5 rounded-2xl shadow-2xl border border-white/10">
            <CheckCircle className="h-4 w-4 text-emerald-400 shrink-0" />
            {toast}
            <button onClick={() => setToast(null)} className="ml-2 text-slate-500 hover:text-white transition-colors">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        )
      }
    </div >
  );
}
