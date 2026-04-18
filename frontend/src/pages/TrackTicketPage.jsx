import React, { useState } from "react";
import { Search, AlertCircle, Clock, Wrench, CheckCircle, ArrowRight, Shield, Calendar, MapPin, Tag, X } from "lucide-react";
import axiosInstance from "../services/axiosInstance";

const TrackTicketPage = () => {
    const [ticketId, setTicketId] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!ticketId.trim()) return;

        setLoading(true);
        setError("");
        setTicket(null);

        try {
            const res = await axiosInstance.get(`/api/incidents/${ticketId}`);
            setTicket(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Search failed", err);
            setError(err.response?.status === 404 ? "Ticket not found. Please check the ID." : "An error occurred while fetching the ticket.");
            setLoading(false);
        }
    };

    const steps = [
        { label: "Submitted", status: "OPEN", icon: AlertCircle },
        { label: "Assigned", status: "IN_PROGRESS", icon: Wrench },
        { label: "Resolved", status: "RESOLVED", icon: CheckCircle },
        { label: "Completed", status: "CLOSED", icon: Shield },
    ];

    const getStatusIndex = (status) => {
        if (status === "REJECTED") return -1;
        const currentIdx = steps.findIndex(s => s.status === status);
        return currentIdx;
    };

    const currentStepIdx = ticket ? getStatusIndex(ticket.status) : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
            {/* Header section */}
            <div className="max-w-3xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6">
                    <Search className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Track Your <span className="text-blue-600">Ticket</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                    Enter your unique ticket ID below to see the real-time status and progress of your maintenance request.
                </p>
            </div>

            {/* Search Bar section */}
            <div className="max-w-2xl w-full mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
                <form onSubmit={handleSearch} className="group relative">
                    <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-2xl opacity-10 group-focus-within:opacity-20 transition-opacity" />
                    <div className="relative flex items-center bg-white rounded-[2rem] p-2 shadow-2xl shadow-slate-200/50 border border-slate-100 ring-4 ring-transparent group-focus-within:ring-blue-50 transition-all">
                        <div className="pl-6 pr-3 text-slate-400">
                            <Tag className="h-6 w-6" />
                        </div>
                        <input
                            type="text"
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            placeholder="Paste your Ticket ID here (e.g., 69e2a...)"
                            className="flex-1 bg-transparent border-none text-lg font-bold text-slate-800 focus:outline-none focus:ring-0 placeholder:text-slate-300 py-4"
                        />
                        <button
                            type="submit"
                            disabled={loading || !ticketId.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-xl shadow-blue-200 active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                        >
                            {loading ? "Searching..." : (
                                <>
                                    Track <ArrowRight className="h-4 w-4" />
                                </>
                            )}
                        </button>
                    </div>
                </form>
                {error && (
                    <p className="mt-4 text-center text-red-500 font-bold animate-in shake duration-300">
                        {error}
                    </p>
                )}
            </div>

            {/* Result Section */}
            {ticket && (
                <div className="max-w-4xl w-full space-y-8 animate-in fade-in zoom-in-95 duration-500">
                    {/* Status Tracker Card */}
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden relative">
                        {/* Status logic for Rejected */}
                        {ticket.status === "REJECTED" ? (
                            <div className="text-center py-6">
                                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <X className="h-10 w-10 text-red-600" />
                                </div>
                                <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-widest">Ticket Rejected</h2>
                                <p className="text-slate-500 font-medium max-w-md mx-auto">
                                    This request was marked as invalid or not applicable.
                                </p>
                                <div className="mt-8 bg-red-50 border border-red-100 p-6 rounded-3xl text-left">
                                    <p className="text-[10px] font-black text-red-400 uppercase tracking-widest mb-1">Reason for Rejection</p>
                                    <p className="text-red-700 font-bold leading-relaxed italic">
                                        "{ticket.rejectionReason || "No specific reason provided."}"
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl font-black text-slate-900">Current Status</h2>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-600 shadow-sm`}>
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                </div>

                                {/* Progress Stepper */}
                                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-2 px-4">
                                    {/* Line behind steps */}
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden sm:block rounded-full" />
                                    <div 
                                        className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 hidden sm:block rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                        style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }}
                                    />

                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIdx;
                                        const isActive = idx === currentStepIdx;
                                        return (
                                            <div key={idx} className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-3 group">
                                                <div className={`
                                                    h-14 w-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-xl
                                                    ${isCompleted ? "bg-blue-600 text-white scale-110" : "bg-white text-slate-300 border-2 border-slate-100"}
                                                    ${isActive ? "ring-8 ring-blue-50 animate-pulse" : ""}
                                                `}>
                                                    <step.icon className={`h-6 w-6 ${isCompleted ? "animate-in zoom-in-50" : ""}`} />
                                                </div>
                                                <div className="text-left sm:text-center">
                                                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isCompleted ? "text-blue-600" : "text-slate-400"}`}>
                                                        {step.label}
                                                    </p>
                                                    {isCompleted && !isActive && <p className="text-[9px] font-bold text-slate-300 uppercase mt-0.5">Completed</p>}
                                                    {isActive && <p className="text-[9px] font-bold text-blue-400 uppercase mt-0.5 animate-bounce">Ongoing</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Details Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
                        {/* Issue Info */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <AlertCircle className="h-4 w-4 text-blue-500" /> Issue Information
                            </h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Location / Resource</p>
                                    <div className="flex items-center gap-2 text-slate-800 font-bold">
                                        <MapPin className="h-4 w-4 text-slate-400" />
                                        {ticket.resource}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Category</p>
                                        <p className="font-bold text-slate-800">{ticket.category}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Priority</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-lg text-[10px] font-black ${
                                            ticket.priority === 'URGENT' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                            {ticket.priority}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Reported Issue</p>
                                    <p className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-4 rounded-2xl italic border border-slate-100/50">
                                        "{ticket.description}"
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Assignment Info */}
                        <div className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col h-full">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2">
                                <Shield className="h-4 w-4 text-blue-500" /> Support & Resolution
                            </h3>
                            <div className="space-y-6 flex-1">
                                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-4">
                                    <div className="h-12 w-12 rounded-xl bg-white shadow-sm flex items-center justify-center border border-slate-200">
                                        <Wrench className="h-6 w-6 text-slate-400" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Assigned Technician</p>
                                        <p className="font-bold text-slate-800 text-lg">{ticket.technicianName || "Awaiting Assignment"}</p>
                                    </div>
                                </div>

                                {ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? (
                                    <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                        <div className="flex items-center gap-2 text-emerald-700 font-black text-xs uppercase tracking-widest mb-2">
                                            <CheckCircle className="h-4 w-4" /> Issue Resolved
                                        </div>
                                        <p className="text-emerald-900/70 text-sm font-medium">
                                            Our technician has resolved the issue. If you have further concerns, please contact our support office.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100">
                                        <div className="flex items-center gap-2 text-blue-700 font-black text-xs uppercase tracking-widest mb-2">
                                            <Clock className="h-4 w-4" /> Expected Timeline
                                        </div>
                                        <p className="text-blue-900/70 text-sm font-medium">
                                            Most {ticket.category.toLowerCase()} issues are resolved within 24-48 business hours after assignment.
                                        </p>
                                    </div>
                                )}
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-slate-400" />
                                    <span className="text-xs font-bold text-slate-500">Reported on 24th May, 2026</span>
                                </div>
                                <Shield className="h-5 w-5 text-slate-100" />
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackTicketPage;
