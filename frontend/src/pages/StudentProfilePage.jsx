// StudentProfilePage — Premium profile page for students
import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  User, Mail, Phone, Shield, Camera,
  Lock, Eye, EyeOff, CheckCircle, Edit3, Save,
  ArrowLeft, BookOpen, Clock, CalendarDays, Activity
} from "lucide-react";
import { ROUTES } from "../utils/constants";

export default function StudentProfilePage() {
  const { auth, isAdmin, isStaff, isUser, userRole } = useAuth();

  const isStudent = isUser || userRole === "STUDENT";
  const roleLabel = userRole || "STUDENT";

  const [editMode, setEditMode] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [saved, setSaved] = useState(false);

  const [avatarUrl, setAvatarUrl] = useState(() => localStorage.getItem("student_avatar") || null);
  const fileInputRef = useRef(null);

  const displayName = auth?.fullName || auth?.email || (isStudent ? "Student" : "Staff Member");

  const [form, setForm] = useState({
    fullName: auth?.fullName || (isStudent ? "Student Name" : "Staff Name"),
    email: auth?.email || "user@example.com",
    phone: "+94 71 234 5678",
    studentId: isStudent ? "IT20261011" : "ST20261011",
    bio: isStudent
      ? "Computer Science undergraduate passionate about AI and web development."
      : "University staff member dedicated to academic excellence and system optimization.",
  });

  const [passForm, setPassForm] = useState({ current: "", newPass: "", confirm: "" });

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const url = ev.target.result;
      setAvatarUrl(url);
      localStorage.setItem("student_avatar", url);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    setSaved(true);
    setEditMode(false);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <MainLayout>
      <div className="bg-[#f1f5f9] min-h-[calc(100vh-64px)] pb-16 pt-8">
        {/* Content Area */}
        <div className="max-w-6xl mx-auto px-6 lg:px-8">

          <div className="flex items-center gap-3 mb-8">
            <Link to={isAdmin || isStaff ? ROUTES.ADMIN_DASHBOARD : ROUTES.STUDENT_DASHBOARD} className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-slate-200 transition-colors group">
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            </Link>
            <span className="text-slate-300">|</span>
            <h1 className="text-lg font-black text-slate-900">My Profile</h1>
          </div>

          {saved && (
            <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-semibold px-5 py-3 rounded-2xl">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Profile updated successfully!
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-1 space-y-5">

              {/* Profile Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div
                  className="h-28 relative"
                  style={{ background: "linear-gradient(135deg, #1d4ed8 0%, #4f46e5 50%, #7c3aed 100%)" }}
                >
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: "radial-gradient(circle, white 1.5px, transparent 1.5px)", backgroundSize: "18px 18px" }}
                  />
                </div>

                <div className="px-6 pb-6 -mt-12 relative text-left">
                  <div className="relative inline-block mb-4">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt="Profile"
                        className="h-[72px] w-[72px] rounded-2xl object-cover border-4 border-white shadow-xl bg-white"
                      />
                    ) : (
                      <div className="h-[72px] w-[72px] rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center text-3xl font-black uppercase border-4 border-white shadow-xl">
                        {displayName[0]}
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      title="Upload photo"
                      className="absolute -bottom-1.5 -right-1.5 h-7 w-7 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-90 text-white flex items-center justify-center shadow-lg border-2 border-white transition-all"
                    >
                      <Camera className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <h2 className="text-xl font-black text-slate-900 leading-tight">{form.fullName}</h2>
                  <p className="text-slate-400 text-sm mb-3">{form.email}</p>

                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${isAdmin ? "bg-purple-100 text-purple-700 border-purple-200" :
                        isStaff ? "bg-amber-100 text-amber-700 border-amber-200" :
                          "bg-blue-100 text-blue-700 border-blue-200"
                      }`}>
                      <User className="h-3 w-3" /> {roleLabel}
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold">
                      <CheckCircle className="h-3 w-3" /> Active
                    </span>
                  </div>
                </div>
              </div>

              {/* Account Stats */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h3 className="text-sm font-black text-slate-700 mb-4 uppercase tracking-wide">Account Stats</h3>
                <div className="space-y-0.5">
                  {[
                    { icon: BookOpen, label: "Total Bookings", value: "12" },
                    { icon: Clock, label: "Pending", value: "3" },
                    { icon: CalendarDays, label: "Member Since", value: "Jan 2026" },
                    { icon: Activity, label: "Last Active", value: "Just now" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center justify-between py-2.5 border-b border-slate-50 last:border-0">
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <div className="h-7 w-7 rounded-lg bg-slate-100 flex items-center justify-center">
                          <item.icon className="h-3.5 w-3.5 text-slate-400" />
                        </div>
                        {item.label}
                      </div>
                      <span className="font-black text-slate-800 text-sm">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="lg:col-span-2 space-y-5">

              {/* Personal Info */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-black text-slate-900">Personal Information</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Update your profile details</p>
                  </div>
                  {!editMode ? (
                    <button
                      onClick={() => setEditMode(true)}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
                    >
                      <Edit3 className="h-4 w-4" /> Edit
                    </button>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditMode(false)}
                        className="px-4 py-2 text-sm font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSave}
                        className="flex items-center gap-1.5 px-4 py-2 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-colors shadow-md shadow-blue-200"
                      >
                        <Save className="h-4 w-4" /> Save
                      </button>
                    </div>
                  )}
                </div>

                <div className="p-7">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[
                      { id: "fullName", label: "Full Name", icon: User, type: "text", readonly: false },
                      { id: "email", label: "Email", icon: Mail, type: "email", readonly: false },
                      { id: "phone", label: "Phone", icon: Phone, type: "text", readonly: false },
                      { id: "studentId", label: isStudent ? "Student ID" : "Employee ID", icon: Shield, type: "text", readonly: true },
                    ].map((field) => (
                      <div key={field.id}>
                        <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                          {field.label}
                        </label>
                        <div className="relative">
                          <field.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <input
                            type={field.type}
                            value={form[field.id]}
                            onChange={(e) => setForm({ ...form, [field.id]: e.target.value })}
                            disabled={!editMode || field.readonly}
                            className={`w-full pl-10 pr-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 ${editMode && !field.readonly
                                ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                                : "border-slate-100 bg-slate-50 text-slate-600 cursor-default"
                              }`}
                          />
                        </div>
                      </div>
                    ))}

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Bio</label>
                      <textarea
                        rows={3}
                        value={form.bio}
                        onChange={(e) => setForm({ ...form, bio: e.target.value })}
                        disabled={!editMode}
                        className={`w-full px-4 py-3 rounded-xl border text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${editMode
                            ? "border-slate-300 bg-white text-slate-800 shadow-sm"
                            : "border-slate-100 bg-slate-50 text-slate-600 cursor-default"
                          }`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security / Change Password */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-7 py-5 border-b border-slate-100 flex items-center gap-3">
                  <div className="h-9 w-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <Lock className="h-4 w-4 text-red-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900">Change Password</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Keep your account secure</p>
                  </div>
                </div>

                <div className="p-7 space-y-4">
                  {[
                    { id: "current", label: "Current Password" },
                    { id: "newPass", label: "New Password" },
                    { id: "confirm", label: "Confirm Password" },
                  ].map((f) => (
                    <div key={f.id}>
                      <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">
                        {f.label}
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type={showPass ? "text" : "password"}
                          value={passForm[f.id]}
                          onChange={(e) => setPassForm({ ...passForm, [f.id]: e.target.value })}
                          placeholder="••••••••"
                          className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm font-medium bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition"
                        />
                        {f.id === "current" && (
                          <button
                            type="button"
                            onClick={() => setShowPass(!showPass)}
                            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition-colors"
                          >
                            {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}

                  <button
                    className="w-full py-3.5 text-sm font-bold text-white rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-blue-500/20"
                    style={{ background: "linear-gradient(135deg, #2563eb, #4f46e5)" }}
                  >
                    Update Password
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
