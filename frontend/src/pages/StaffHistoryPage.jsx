// StaffHistoryPage — Full ticket history for staff/technician
import React, { useState, useEffect } from "react";
import {
    Activity, CheckCircle, Clock, Search,
    AlertCircle, Calendar, Tag,
    Wrench, XCircle, FileText, ChevronDown, ChevronUp,
    History, ArrowLeft, Shield
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const STATUS_CONFIG = {
    RESOLVED: {
        label: "Resolved",
        bg: "bg-emerald-50",
        text: "text-emerald-700",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        icon: <CheckCircle className="h-4 w-4" />,
    },
    CLOSED: {
        label: "Closed",
        bg: "bg-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        dot: "bg-slate-400",
        icon: <XCircle className="h-4 w-4" />,
    },
    REJECTED: {
        label: "Rejected",
        bg: "bg-red-50",
        text: "text-red-600",
        border: "border-red-200",
        dot: "bg-red-500",
        icon: <XCircle className="h-4 w-4" />,
    },
    OPEN: {
        label: "Open",
        bg: "bg-blue-50",
        text: "text-blue-600",
        border: "border-blue-200",
        dot: "bg-blue-500",
        icon: <AlertCircle className="h-4 w-4" />,
    },
    IN_PROGRESS: {
        label: "In Progress",
        bg: "bg-amber-50",
        text: "text-amber-600",
        border: "border-amber-200",
        dot: "bg-amber-500",
        icon: <Clock className="h-4 w-4" />,
    },
    ONGOING: {
        label: "Ongoing",
        bg: "bg-emerald-50",
        text: "text-emerald-600",
        border: "border-emerald-200",
        dot: "bg-emerald-500",
        icon: <CheckCircle className="h-4 w-4" />,
    },
};

const FILTER_TABS = ["All", "RESOLVED", "CLOSED", "REJECTED"];

const StaffHistoryPage = () => {
    const { auth } = useAuth();
    const navigate = useNavigate();

    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [activeFilter, setActiveFilter] = useState("All");
    const [expandedId, setExpandedId] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const res = await axiosInstance.get(`/api/incidents/technician/${auth.id}`);
                const sorted = [...res.data].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setIncidents(sorted);
            } catch (err) {
                console.error("Failed to load history", err);
            } finally {
                setLoading(false);
            }
        };
        if (auth?.id) fetchHistory();
    }, [auth?.id]);

    const filtered = incidents.filter((inc) => {
        const matchesSearch =
            inc.resource?.toLowerCase().includes(search.toLowerCase()) ||
            inc.category?.toLowerCase().includes(search.toLowerCase()) ||
            inc.id?.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === "All" || inc.status === activeFilter;
        return matchesSearch && matchesFilter;
    });

    const stats = {
        total: incidents.length,
        resolved: incidents.filter((i) => i.status === "RESOLVED").length,
        closed: incidents.filter((i) => i.status === "CLOSED").length,
        rejected: incidents.filter((i) => i.status === "REJECTED").length,
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Loading History...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 font-sans">

            {/* Sticky Header */}
            <div className="bg-white border-b border-slate-100 shadow-sm sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(ROUTES.STAFF_DASHBOARD)}
                            className="h-10 w-10 rounded-2xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all"
                        >
                            <ArrowLeft className="h-4 w-4" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2">
                                <History className="h-5 w-5 text-blue-600" />
                                <h1 className="text-xl font-black text-slate-900 tracking-tight">My History</h1>
                            </div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                {auth?.fullName || auth?.email} · All Assigned Tickets
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Staff Console</span>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {[
                        { label: "Total Assigned", value: stats.total, color: "from-blue-600 to-indigo-600", icon: <Wrench className="h-5 w-5 text-white" /> },
                        { label: "Resolved",       value: stats.resolved, color: "from-emerald-500 to-green-600", icon: <CheckCircle className="h-5 w-5 text-white" /> },
                        { label: "Closed",         value: stats.closed,   color: "from-slate-600 to-slate-700",   icon: <XCircle className="h-5 w-5 text-white" /> },
                        { label: "Rejected",       value: stats.rejected, color: "from-red-500 to-rose-600",      icon: <AlertCircle className="h-5 w-5 text-white" /> },
                    ].map((s) => (
                        <div key={s.label} className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-100 border border-slate-100 relative overflow-hidden group hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                            <div className={`absolute -top-4 -right-4 h-16 w-16 rounded-full bg-gradient-to-br ${s.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                            <div className={`h-10 w-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-3 shadow-lg`}>
                                {s.icon}
                            </div>
                            <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                        </div>
                    ))}
                </div>

                {/* Search + Filter Bar */}
                <div className="bg-white rounded-[2rem] p-6 shadow-lg shadow-slate-100 border border-slate-100">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by resource, category, or ID..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-50 focus:border-blue-200 transition-all placeholder:text-slate-300"
                            />
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {FILTER_TABS.map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveFilter(tab)}
                                    className={`px-4 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                                        activeFilter === tab
                                            ? "bg-slate-900 text-white border-slate-900 shadow-lg"
                                            : "bg-white text-slate-500 border-slate-100 hover:border-slate-300"
                                    }`}
                                >
                                    {tab}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Ticket List */}
                {filtered.length === 0 ? (
                    <div className="bg-white rounded-[2.5rem] border border-dashed border-slate-200 p-20 text-center">
                        <History className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-xl font-black text-slate-300 uppercase tracking-widest mb-2">No History Found</h3>
                        <p className="text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                            {search ? "Try adjusting your search term" : "No tickets match the selected filter"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((ticket) => {
                            const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.OPEN;
                            const isExpanded = expandedId === (ticket.id || ticket._id);
                            const ticketId = ticket.id || ticket._id;

                            return (
                                <div key={ticketId} className="bg-white rounded-[2rem] border border-slate-100 shadow-lg shadow-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300">

                                    {/* Row Header */}
                                    <div
                                        className="p-6 flex items-center justify-between cursor-pointer group"
                                        onClick={() => setExpandedId(isExpanded ? null : ticketId)}
                                    >
                                        <div className="flex items-center gap-5">
                                            <div className={`h-12 w-12 rounded-2xl ${cfg.bg} border ${cfg.border} flex items-center justify-center shrink-0`}>
                                                <span className={cfg.text}>{cfg.icon}</span>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-3 mb-1 flex-wrap">
                                                    <h3 className="font-black text-slate-900 uppercase text-sm tracking-tight">
                                                        {ticket.resource}
                                                    </h3>
                                                    <span className={`px-3 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
                                                        {cfg.label}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                    <span className="flex items-center gap-1.5"><Tag className="h-3 w-3" /> {ticket.category}</span>
                                                    <span className="flex items-center gap-1.5">
                                                        <Calendar className="h-3 w-3" />
                                                        {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "—"}
                                                    </span>
                                                    <span className="opacity-50">#{ticketId.slice(-6)}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <span className={`h-2 w-2 rounded-full ${cfg.dot}`}></span>
                                            <div className="h-8 w-8 rounded-xl bg-slate-50 group-hover:bg-slate-100 flex items-center justify-center transition-colors">
                                                {isExpanded
                                                    ? <ChevronUp className="h-4 w-4 text-slate-400" />
                                                    : <ChevronDown className="h-4 w-4 text-slate-400" />
                                                }
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Detail */}
                                    {isExpanded && (
                                        <div className="border-t border-slate-50 px-6 pb-6 pt-5 space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                                                <div className="sm:col-span-2 bg-slate-50 rounded-2xl p-5 border border-slate-100">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                        <FileText className="h-3 w-3" /> Description
                                                    </p>
                                                    <p className="text-sm font-bold text-slate-700 leading-relaxed italic">
                                                        "{ticket.description || "No description provided."}"
                                                    </p>
                                                </div>

                                                <div className="bg-white border border-slate-100 rounded-2xl p-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requester</p>
                                                    <p className="font-black text-slate-800 text-sm">{ticket.studentName || ticket.studentId || "—"}</p>
                                                </div>

                                                <div className="bg-white border border-slate-100 rounded-2xl p-4">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                                                    <p className="font-black text-slate-800 text-sm uppercase">{ticket.priority || "—"}</p>
                                                </div>

                                                {ticket.resolutionNotes && (
                                                    <div className="sm:col-span-2 bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                                                        <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                            <CheckCircle className="h-3 w-3" /> Resolution Notes
                                                        </p>
                                                        <p className="text-sm font-bold text-emerald-900 leading-relaxed italic">
                                                            "{ticket.resolutionNotes}"
                                                        </p>
                                                    </div>
                                                )}

                                                {ticket.comments?.length > 0 && (
                                                    <div className="sm:col-span-2 bg-blue-50 border border-blue-100 rounded-2xl p-4">
                                                        <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">
                                                            💬 {ticket.comments.length} Comment{ticket.comments.length > 1 ? "s" : ""} on this ticket
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StaffHistoryPage;
