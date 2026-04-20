<<<<<<< Updated upstream
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { 
  Wrench, CheckCircle, Clock, AlertCircle, ChevronDown, 
  MessageSquare, User, Calendar, Shield, MapPin, Tag,
  Send, ExternalLink, X, Image as ImageIcon, Search,
  Bell, LayoutDashboard, History, Settings, LogOut, TrendingUp, Filter,
  Activity, ArrowRight
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";
import axiosInstance from "../services/axiosInstance";

const StaffDashboardPage = () => {
  const { auth, logoutUser } = useAuth();
  const navigate = useNavigate();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [showResolveModal, setShowResolveModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
=======
import React, { useState, useEffect } from "react";
import { 
    Search, Filter, Clock, MoreVertical, CheckCircle, 
    MessageSquare, Send, User, ChevronRight, AlertCircle,
    Activity, Shield, Mail, Calendar, MapPin, Tag, Wrench, X, Pencil, Trash2, MessageCircle,
    History
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const StaffDashboardPage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [newComment, setNewComment] = useState("");
    const [isCommenting, setIsCommenting] = useState(false);
    const [resolutionNotes, setResolutionNotes] = useState("");
    const [showResolveModal, setShowResolveModal] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");
>>>>>>> Stashed changes

  const displayName = auth?.fullName || auth?.email || "Staff Member";
  const staffId = auth?.id;

  useEffect(() => {
    if (staffId) {
      fetchTickets();
    }
  }, [staffId]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      // Backend uses /technician/ endpoint, but we present as Staff in UI
      const res = await axiosInstance.get(`/api/incidents/technician/${staffId}`);
      setTickets(res.data);
    } catch (err) {
      console.error("Failed to fetch staff assignments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !selectedTicket) return;

    try {
      const comment = {
        authorId: auth.id,
        authorName: auth.fullName || auth.email,
        text: newComment,
        timestamp: new Date().toISOString()
      };
      const res = await axiosInstance.post(`/api/incidents/${selectedTicket.id}/comments`, comment);
      setSelectedTicket(res.data);
      setTickets(tickets.map(t => t.id === res.data.id ? res.data : t));
      setNewComment("");
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

  const handleResolve = async () => {
    if (!resolutionNotes.trim() || !selectedTicket) return;
    setSaving(true);
    try {
      const res = await axiosInstance.patch(`/api/incidents/${selectedTicket.id}/resolve`, null, {
        params: { notes: resolutionNotes }
      });
      setSelectedTicket(res.data);
      setTickets(tickets.map(t => t.id === res.data.id ? res.data : t));
      setShowResolveModal(false);
      setResolutionNotes("");
    } catch (err) {
      console.error("Failed to resolve incident", err);
    } finally {
      setSaving(false);
    }
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedTicket) return;
    try {
      const res = await axiosInstance.patch(`/api/incidents/${selectedTicket.id}/status`, null, {
        params: { status }
      });
      setSelectedTicket(res.data);
      setTickets(tickets.map(t => t.id === res.data.id ? res.data : t));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const statusStyle = {
    OPEN: "bg-blue-50 text-blue-600 border-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-600 border-amber-100",
    ONGOING: "bg-purple-50 text-purple-600 border-purple-100",
    RESOLVED: "bg-emerald-50 text-emerald-600 border-emerald-100",
    CLOSED: "bg-slate-50 text-slate-600 border-slate-100",
    REJECTED: "bg-red-50 text-red-600 border-red-100",
  };

  const activeTickets = tickets.filter(t => t.status !== "CLOSED" && t.status !== "REJECTED");
  const filteredTickets = activeTickets.filter(t => 
    t.resource?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    t.id?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statsCards = [
    { label: "My Assignments", value: tickets.length, trend: "+4.2%", icon: LayoutDashboard, gradient: "from-blue-500 to-blue-700", glow: "shadow-blue-200" },
    { label: "Resolved Work", value: tickets.filter(t => t.status === "RESOLVED").length, trend: "+8.1%", icon: CheckCircle, gradient: "from-emerald-400 to-emerald-600", glow: "shadow-emerald-200" },
    { label: "Submitted Tasks", value: tickets.filter(t => t.status === "OPEN").length, trend: "Stable", icon: Clock, gradient: "from-purple-500 to-purple-700", glow: "shadow-purple-200" },
    { label: "Urgent Priority", value: tickets.filter(t => t.priority === "URGENT").length, trend: "0 issues", icon: AlertCircle, gradient: "from-orange-400 to-orange-600", glow: "shadow-orange-200" },
  ];

  const priorityTicket = [...activeTickets].sort((a, b) => (a.priority === "URGENT" ? -1 : 1))[0];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-[0.2em] text-[10px]">Accessing Staff Mainframe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden font-sans">
      {/* ─── Premium Sidebar ────────────────────────────────────────── */}
      <aside className="w-72 bg-[#0a192f] text-white flex flex-col shrink-0 relative z-50 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2" />

        <div className="p-8 relative">
          <div className="flex items-center gap-3 mb-10">
            <div className="h-10 w-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-tight leading-none">CampusReserve</h2>
              <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mt-1.5 opacity-70">Staff Console</p>
            </div>
          </div>

          <nav className="space-y-1">
            <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4 ml-2">Main Menu</p>
            {[
              { label: "Overview", icon: LayoutDashboard, active: true },
              { label: "View Assigned Tickets", icon: Filter },
              { label: "Incident History", icon: History },
              { label: "System Status", icon: Activity },
            ].map((item, idx) => (
              <button
                key={idx}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all group ${
                  item.active ? "bg-blue-600 text-white shadow-xl shadow-blue-900/20" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span className="text-xs font-black uppercase tracking-widest">{item.label}</span>
                {item.active && <ChevronDown className="h-3 w-3 ml-auto opacity-50" />}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="bg-white/5 rounded-2xl p-4 flex items-center gap-3 mb-4">
             <div className="h-10 w-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 border border-white/10">
                <User className="h-5 w-5" />
             </div>
             <div className="overflow-hidden">
                <p className="text-[10px] font-black text-white truncate">{displayName}</p>
                <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-0.5">Staff Account</p>
             </div>
          </div>
          {priorityTicket && (
            <button 
              onClick={() => setSelectedTicket(priorityTicket)}
              className="w-full mb-4 group relative flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-blue-900/20 transition-all hover:scale-105 active:scale-95"
            >
              <Wrench className="h-4 w-4 animate-wrench-spin" />
              View Assigned Ticket
              <div className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full border-2 border-[#0a192f] -translate-y-1/2 translate-x-1/2" />
            </button>
          )}

          <button 
            onClick={() => { logoutUser(); navigate(ROUTES.LOGIN); }}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors group"
          >
            <LogOut className="h-4 w-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>
          </button>
        </div>
      </aside>

      {/* ─── Main Content area ────────────────────────────────────────── */}
      <main className="flex-1 overflow-y-auto flex flex-col relative custom-scrollbar">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-10 flex items-center justify-between sticky top-0 z-40">
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Welcome back, {displayName.split(" ")[0]} 👋</p>
          </div>

          <div className="flex items-center gap-6">
             <div className="relative group w-80">
                <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Filter by location, category..."
                  className="w-full h-11 bg-slate-50 border border-slate-200 rounded-xl pl-11 pr-4 text-xs font-bold text-slate-800 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all shadow-inner"
                />
             </div>
             <button className="h-10 w-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all relative group shadow-sm">
                <Bell className="h-4 w-4" />
                <div className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full border-2 border-white ring-2 ring-transparent group-hover:ring-red-100 transition-all" />
             </button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* ────── NEW HERO ACTION SECTION ────── */}
          {priorityTicket && (
            <section className="animate-in fade-in slide-in-from-top-4 duration-700">
               <div className="bg-white rounded-[3rem] p-4 shadow-2xl shadow-blue-100/50 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-600 opacity-[0.02] -skew-x-12 translate-x-1/4" />
                  
                  <div className="flex items-center gap-8 pl-10">
                     <div className="h-24 w-24 bg-blue-600 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-blue-200 ring-8 ring-blue-50 relative">
                        <Wrench className="h-10 w-10 text-white animate-bounce" />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 rounded-full border-4 border-white animate-pulse" />
                     </div>
                     <div className="text-left">
                        <div className="flex items-center gap-2 mb-2">
                           <span className="px-2.5 py-1 bg-red-50 text-red-500 text-[9px] font-black uppercase tracking-widest rounded-lg border border-red-100">Action Required</span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ongoing Task</span>
                        </div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-none mb-3">Active Incident Protocol</h2>
                        <p className="text-slate-500 font-bold flex items-center gap-2 text-sm uppercase tracking-wide italic">
                           <MapPin className="h-4 w-4 text-blue-500" /> {priorityTicket.resource} • {priorityTicket.category}
                        </p>
                     </div>
                  </div>

                  <div className="pr-10">
                     <button 
                        onClick={() => setSelectedTicket(priorityTicket)}
                        className="group relative flex items-center gap-6 bg-blue-600 hover:bg-blue-700 text-white px-12 py-7 rounded-[2.5rem] font-black uppercase text-sm tracking-[0.2em] shadow-2xl shadow-blue-300 transition-all hover:scale-105 active:scale-95"
                     >
                        View the Assigned Ticket
                        <ArrowRight className="h-5 w-5 group-hover:translate-x-3 transition-transform" />
                        <div className="absolute inset-x-0 bottom-0 h-1.5 bg-white/20 rounded-b-[2.5rem] w-full" />
                     </button>
                  </div>
               </div>
            </section>
          )}

          {/* Stats Cards Section */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {statsCards.map((card, idx) => (
                <div key={idx} className={`relative overflow-hidden rounded-[2rem] p-8 text-white shadow-xl ${card.glow} bg-gradient-to-br ${card.gradient} transition-transform hover:scale-105 duration-300 group`}>
                   <div className="absolute -right-4 -top-4 h-24 w-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all" />
                   <div className="flex items-center justify-between mb-8">
                      <div className="h-12 w-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg">
                        <card.icon className="h-6 w-6" />
                      </div>
                      <div className="px-2 py-1 bg-white/10 backdrop-blur-md rounded-lg text-[10px] font-black flex items-center gap-1 border border-white/10">
                         <TrendingUp className="h-3 w-3" /> {card.trend}
                      </div>
                   </div>
                   <h3 className="text-4xl font-black tracking-tight mb-1">{card.value}</h3>
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-80">{card.label}</p>
                </div>
             ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
             {/* Assignments Table */}
             <section className="lg:col-span-2 space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-lg font-black text-slate-800 flex items-center gap-2">
                      <Filter className="h-5 w-5 text-blue-600" /> Recent Assignments
                   </h3>
                   <button className="text-[10px] font-black text-blue-600 uppercase tracking-widest hover:underline">View All Filtered →</button>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                   <table className="w-full text-left border-collapse">
                      <thead>
                         <tr className="bg-slate-50 border-b border-slate-100 text-[10px] font-black uppercase text-slate-400 tracking-widest">
                            <th className="px-8 py-5">Issue Identity</th>
                            <th className="px-8 py-5">Category</th>
                            <th className="px-8 py-5">Priority</th>
                            <th className="px-8 py-5">Status</th>
                            <th className="px-8 py-5 text-right">Actions</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {filteredTickets.length > 0 ? filteredTickets.map((t) => (
                            <tr key={t.id} className="group hover:bg-slate-50/50 transition-all cursor-pointer" onClick={() => setSelectedTicket(t)}>
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-3">
                                     <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                                        <Wrench className="h-5 w-5" />
                                     </div>
                                     <div className="overflow-hidden">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">{t.id.slice(0, 8)}...</p>
                                        <p className="font-bold text-slate-800 uppercase truncate max-w-[150px]">{t.resource}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <p className="text-xs font-bold text-slate-600">{t.category}</p>
                               </td>
                               <td className="px-8 py-6">
                                  <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                     t.priority === 'URGENT' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500'
                                  }`}>
                                     {t.priority}
                                  </span>
                               </td>
                               <td className="px-8 py-6">
                                  <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusStyle[t.status]}`}>
                                     {t.status.replace("_", " ")}
                                  </span>
                               </td>
                               <td className="px-8 py-6 text-right">
                                  <button 
                                    onClick={(e) => { e.stopPropagation(); setSelectedTicket(t); }}
                                    className="px-4 py-2 bg-blue-600 text-[10px] font-black uppercase text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all tracking-widest whitespace-nowrap"
                                  >
                                     View Ticket
                                  </button>
                               </td>
                            </tr>
                         )) : (
                            <tr>
                               <td colSpan="5" className="px-8 py-20 text-center">
                                  <div className="flex flex-col items-center opacity-30">
                                     <History className="h-12 w-12 mb-3" />
                                     <p className="text-[10px] font-black uppercase tracking-widest">No active assignments found</p>
                                  </div>
                               </td>
                            </tr>
                         )}
                      </tbody>
                   </table>
                </div>
             </section>

             {/* Side Widgets */}
             <section className="space-y-10">
                {/* Information Card */}
                <div className="bg-[#1e293b] rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl">
                   <div className="absolute -top-10 -right-10 h-40 w-40 bg-blue-600/20 rounded-full blur-[50px]" />
                   <div className="flex items-center justify-between mb-8">
                      <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Operational Memo</h4>
                      <Clock className="h-4 w-4 opacity-50" />
                   </div>
                   
                   <p className="text-sm text-slate-300 font-bold italic leading-relaxed mb-10">
                      "Ensure all resolution notes are detailed enough for administrative review before marking as done."
                   </p>

                   <div className="bg-white/5 rounded-3xl p-6 border border-white/10 flex items-center gap-4">
                      <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center">
                         <Shield className="h-6 w-6 text-blue-400" />
                      </div>
                      <div>
                         <p className="text-[10px] font-black uppercase tracking-widest mb-0.5">Safety Index</p>
                         <p className="text-sm font-black text-emerald-400 tracking-tight leading-none">A+ (Secure)</p>
                      </div>
                   </div>
                </div>

                {/* Quick Info Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-200 flex items-center gap-6 shadow-sm">
                   <div className="h-14 w-14 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-300">
                      <Settings className="h-6 w-6" />
                   </div>
                   <div>
                      <h4 className="text-sm font-black text-slate-800 mb-1 tracking-tight">System Updates</h4>
                      <p className="text-xs font-medium text-slate-400">Firmware v24.0.5 verified</p>
                   </div>
                </div>
             </section>
          </div>
        </div>
      </main>

      {/* ─── Detail View Sidebar Model ────────────────────────────────────────── */}
      {selectedTicket && (
        <div className="fixed inset-0 z-[100] flex items-center justify-end animate-in fade-in duration-300 overflow-hidden outline-none" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedTicket(null)} />
          <div className="relative w-full max-w-4xl h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-500 ease-out animate-in slide-in-from-right overflow-hidden">
            {/* Modal Header */}
            <div className="px-12 py-10 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10 text-left">
              <div className="flex items-center gap-6">
                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center shadow-lg ${statusStyle[selectedTicket.status]}`}>
                  <Wrench className="h-7 w-7" />
                </div>
                <div>
                  <h2 className="text-3xl font-black text-slate-900 leading-none">Handle Incident</h2>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 leading-none">ID: {selectedTicket.id}</p>
                </div>
              </div>
              <button onClick={() => setSelectedTicket(null)} className="h-12 w-12 rounded-full hover:bg-red-50 hover:text-red-500 text-slate-400 transition-all flex items-center justify-center bg-slate-50 border border-slate-100 active:scale-90">
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-12 space-y-12 custom-scrollbar pb-40 text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Information Side */}
                <div className="space-y-10">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <MapPin className="h-3 w-3" /> Location Ref.
                         </p>
                         <p className="font-black text-slate-800 uppercase text-sm">{selectedTicket.resource}</p>
                      </div>
                      <div className="p-6 bg-slate-50 rounded-3xl border border-slate-100">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                           <Shield className="h-3 w-3" /> Priority Level
                         </p>
                         <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${
                           selectedTicket.priority === "URGENT" ? "bg-red-50 text-red-500 border border-red-100" : "bg-blue-50 text-blue-600 border border-blue-100"
                         }`}>
                           {selectedTicket.priority}
                         </span>
                      </div>
                   </div>

                   <div className="space-y-4">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Incident Report</p>
                      <div className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 text-slate-700 text-sm font-bold italic leading-relaxed relative">
                         <div className="absolute top-0 right-0 p-3 opacity-10">
                            <ImageIcon className="h-10 w-10" />
                         </div>
                         "{selectedTicket.description}"
                      </div>
                   </div>

                   {selectedTicket.imageUrls?.length > 0 && (
                      <div className="space-y-6">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Evidence Gallery</p>
                         <div className="grid grid-cols-3 gap-4">
                            {selectedTicket.imageUrls.map((url, i) => (
                               <a key={i} href={`${axiosInstance.defaults.baseURL}${url}`} target="_blank" rel="noreferrer" className="aspect-square rounded-2xl overflow-hidden border-2 border-slate-100 group">
                                  <img src={`${axiosInstance.defaults.baseURL}${url}`} alt="Attachment" className="w-full h-full object-cover group-hover:scale-110 transition-transform" />
                               </a>
                            ))}
                         </div>
                      </div>
                   )}

                   {selectedTicket.status === "OPEN" && (
                      <div className="pt-8">
                         <button 
                            onClick={() => handleStatusUpdate("IN_PROGRESS")}
                            className="w-full h-16 bg-blue-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
                         >
                            Accept & Assign Task
                         </button>
                      </div>
                   )}

                   {selectedTicket.status === "IN_PROGRESS" && (
                      <div className="pt-8">
                         <button 
                            onClick={() => handleStatusUpdate("ONGOING")}
                            className="w-full h-16 bg-purple-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-purple-200 hover:bg-purple-700 active:scale-[0.98] transition-all"
                         >
                            Start Ongoing Work
                         </button>
                      </div>
                   )}

                   {selectedTicket.status === "ONGOING" && (
                      <div className="pt-8">
                         <button 
                            onClick={() => setShowResolveModal(true)}
                            className="w-full h-16 bg-emerald-600 text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-200 hover:bg-emerald-700 active:scale-[0.98] transition-all"
                         >
                            Resolve Ticket - Done
                         </button>
                      </div>
                   )}

                   {(selectedTicket.status === "RESOLVED" || selectedTicket.status === "CLOSED") && (
                      <div className="p-8 bg-emerald-50 rounded-[2.5rem] border border-emerald-100">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                           <CheckCircle className="h-4 w-4" /> Final Resolution Action
                         </p>
                         <p className="text-emerald-900 font-bold text-sm italic leading-relaxed">
                           "{selectedTicket.resolutionNotes}"
                         </p>
                      </div>
                   )}
                </div>

                {/* Communication Side */}
                <div className="flex flex-col bg-slate-50 rounded-[3rem] border border-slate-100 p-10 h-full max-h-[600px] shadow-inner relative">
                    <div className="flex items-center justify-between mb-8">
                       <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                          <MessageSquare className="h-4 w-4 text-blue-500" /> Interaction Logs
                       </h3>
                       <div className="px-2.5 py-1 bg-white rounded-full border border-slate-100 text-[8px] font-black text-slate-400 uppercase tracking-widest">
                          Secured Channel
                       </div>
                    </div>

                    <div className="flex-1 space-y-8 overflow-y-auto custom-scrollbar pr-3 mb-10">
                       {selectedTicket.comments?.length > 0 ? selectedTicket.comments.map((c, i) => (
                          <div key={i} className={`flex flex-col ${c.authorId === auth.id ? "items-end text-right" : "items-start text-left"}`}>
                             <div className={`max-w-[85%] p-5 rounded-[2rem] text-[11px] font-bold leading-relaxed shadow-sm ${
                               c.authorId === auth.id ? "bg-blue-600 text-white rounded-tr-none shadow-blue-100" : "bg-white text-slate-800 rounded-tl-none border border-slate-100"
                             }`}>
                                {c.text}
                             </div>
                             <p className={`mt-2 px-3 text-[8px] font-black uppercase tracking-widest ${c.authorId === auth.id ? "text-blue-400" : "text-slate-400"}`}>
                                {c.authorName} • {
                                  c.authorId === selectedTicket.studentId ? "STUDENT" : 
                                  c.authorId === selectedTicket.technicianId ? "STAFF" : "ADMIN"
                                } • {new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                             </p>
                          </div>
                       )) : (
                          <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-20">
                             <div className="h-16 w-16 bg-slate-200/50 rounded-full flex items-center justify-center mb-4">
                               <MessageSquare className="h-8 w-8 text-slate-400" />
                             </div>
                             <p className="text-[10px] font-black uppercase tracking-widest">Empty Thread</p>
                          </div>
                       )}
                    </div>

                    <form onSubmit={handleAddComment} className="relative mt-auto">
                       <div className="absolute inset-0 bg-blue-600 rounded-3xl blur-2xl opacity-5" />
                       <input 
                         type="text" 
                         value={newComment}
                         onChange={(e) => setNewComment(e.target.value)}
                         placeholder="Send message to student..."
                         className="w-full bg-white border border-slate-200 rounded-[2rem] pl-6 pr-14 py-5 text-xs font-bold shadow-2xl shadow-slate-200/50 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all placeholder:text-slate-300"
                       />
                       <button type="submit" disabled={!newComment.trim()} className="absolute right-2.5 top-2.5 h-12 w-12 bg-slate-900 rounded-3xl text-white flex items-center justify-center hover:bg-black active:scale-90 transition-all shadow-lg disabled:opacity-50">
                         <Send className="h-5 w-5" />
                       </button>
                    </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─── Global Resolution Modal Overlay ────────────────────────────────────────── */}
      {showResolveModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowResolveModal(false)} />
           <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 animate-in zoom-in-95 duration-300 border border-white/20">
              <div className="text-center">
                 <div className="h-20 w-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-8 text-emerald-600 border-2 border-emerald-100 shadow-xl shadow-emerald-100/30">
                    <CheckCircle className="h-10 w-10" />
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 tracking-tight">Resolve Protocol</h2>
                 <p className="text-sm text-slate-500 font-bold mt-4 px-4 leading-relaxed">Confirm the fix for this incident. This will notify the student and mark the case as resolved.</p>
              </div>

              <div className="space-y-6">
                 <textarea 
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    placeholder="Document your fix actions here..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-sm font-bold text-slate-800 placeholder:text-slate-300 min-h-[180px] focus:outline-none focus:ring-4 focus:ring-emerald-50 focus:border-emerald-300 transition-all resize-none shadow-inner"
                 />
                 <div className="flex gap-4">
                    <button onClick={() => setShowResolveModal(false)} className="flex-1 h-14 bg-slate-50 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-100 transition-all">Cancel</button>
                    <button 
                       onClick={handleResolve} 
                       disabled={!resolutionNotes.trim() || saving}
                       className="flex-[2] h-14 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-200 hover:bg-emerald-600 active:scale-[0.98] transition-all disabled:opacity-50"
                    >
                       {saving ? "Finalizing..." : "Confirm Resolution"}
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboardPage;
