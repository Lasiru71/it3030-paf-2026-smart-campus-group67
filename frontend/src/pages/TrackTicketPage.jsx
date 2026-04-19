import React, { useState, useEffect } from "react";
import { 
    Search, AlertCircle, Clock, Wrench, CheckCircle, 
    ArrowRight, Shield, Calendar, MapPin, Tag, X,
    MessageSquare, Send, User, MessageCircle, Pencil, Trash2
} from "lucide-react";
import axiosInstance from "../services/axiosInstance";
import { useAuth } from "../context/AuthContext";

const TrackTicketPage = () => {
    const { auth, isTechnician } = useAuth();
    const [ticketId, setTicketId] = useState("");
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newComment, setNewComment] = useState("");
    const [sending, setSending] = useState(false);
    const [isCommenting, setIsCommenting] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editText, setEditText] = useState("");

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        if (!ticketId.trim()) return;

        setLoading(true);
        setError("");
        setTicket(null);

        try {
            const res = await axiosInstance.get(`/api/incidents/${ticketId}`);
            setTicket(res.data);
        } catch (err) {
            console.error("Search failed", err);
            setError(err.response?.status === 404 ? "Ticket not found. Please check the ID." : "An error occurred while fetching the ticket.");
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !ticket) return;

        setSending(true);
        try {
            const comment = {
                authorId: auth?.id || "anonymous",
                authorName: auth?.fullName || auth?.email || "Student",
                text: newComment,
                timestamp: new Date().toISOString()
            };
            const tid = ticket.id || ticket._id;
            const res = await axiosInstance.post(`/api/incidents/${tid}/comments`, comment);
            setTicket(res.data);
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setSending(false);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editText.trim() || !ticket) return;
        try {
            const tid = ticket.id || ticket._id;
            const res = await axiosInstance.patch(`/api/incidents/${tid}/comments/${commentId}`, editText, {
                params: { userId: auth?.id || "anonymous" },
                headers: { "Content-Type": "text/plain" }
            });
            const updated = res.data;
            setTicket({...updated}); // Force new object reference
            setEditingCommentId(null);
            setEditText("");
        } catch (err) {
            console.error("Failed to update comment", err);
            const msg = err.response?.data?.message || err.message || "Failed to update comment. The 15-minute window may have expired.";
            alert(msg);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!ticket || !window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            const tid = ticket.id || ticket._id;
            const res = await axiosInstance.delete(`/api/incidents/${tid}/comments/${commentId}`, {
                params: { userId: auth?.id || "anonymous", isAdmin: auth?.role === "ADMIN" }
            });
            const updated = res.data;
            setTicket({...updated}); // Force new object reference
        } catch (err) {
            console.error("Failed to delete comment", err);
            const msg = err.response?.data?.message || err.message || "Failed to delete comment.";
            alert(msg);
        }
    };

    const isWithinEditWindow = (timestamp) => {
        if (!timestamp) return true;
        try {
            const postedTime = new Date(timestamp).getTime();
            const now = new Date().getTime();
            return (now - postedTime) < 15 * 60 * 1000;
        } catch (e) {
            return true;
        }
    };

    const formatTimestamp = (ts) => {
        if (!ts) return "---";
        if (Array.isArray(ts)) {
            const [year, month, day, hour, minute] = ts;
            return new Date(year, month - 1, day, hour, minute).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const steps = [
        { label: "Submitted", status: "OPEN", icon: AlertCircle },
        { label: "Assigned", status: "IN_PROGRESS", icon: Wrench },
        { label: "Ongoing", status: "ONGOING", icon: Clock },
        { label: "Resolved", status: "RESOLVED", icon: CheckCircle },
        { label: "Completed", status: "CLOSED", icon: Shield },
    ];

    const getStatusIndex = (status) => {
        if (status === "REJECTED") return -1;
        return steps.findIndex(s => s.status === status);
    };

    const currentStepIdx = ticket ? getStatusIndex(ticket.status) : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center py-20 px-4 sm:px-6 lg:px-8 font-sans">
            <div className="max-w-3xl w-full text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
                <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-3xl shadow-xl shadow-blue-200 mb-6">
                    <Search className="h-8 w-8 text-white" />
                </div>
                <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight mb-4">
                    Track your <span className="text-blue-600">Ticket</span>
                </h1>
                <p className="text-lg text-slate-500 font-medium max-w-xl mx-auto">
                    {isTechnician 
                      ? "As a staff member, your assigned cases are waiting in your dedicated console."
                      : "Enter your unique ticket ID below to see the real-time status and progress of your maintenance request."
                    }
                </p>
            </div>

            {isTechnician ? (
               <div className="max-w-2xl w-full mb-12 animate-in fade-in duration-700">
                  <div className="bg-white rounded-[2.5rem] p-10 shadow-2xl border border-slate-100 text-center relative overflow-hidden group">
                     <div className="h-20 w-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600 border border-blue-100 shadow-inner">
                        <Shield className="h-10 w-10" />
                     </div>
                     <h2 className="text-2xl font-black text-slate-900 mb-4 tracking-tight uppercase">Staff Identified</h2>
                     <button className="inline-flex items-center gap-3 bg-slate-900 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] shadow-xl hover:scale-105 transition-all">
                        Enter Staff Dashboard <ArrowRight className="h-4 w-4" />
                     </button>
                  </div>
               </div>
            ) : (
                <div className="max-w-2xl w-full mb-12 animate-in fade-in duration-700">
                    <form onSubmit={handleSearch} className="group relative">
                        <div className="absolute inset-0 bg-blue-600 rounded-[2rem] blur-2xl opacity-10" />
                        <div className="relative flex items-center bg-white rounded-[2rem] p-2 shadow-2xl border border-slate-100 ring-4 ring-transparent group-focus-within:ring-blue-50 transition-all">
                            <div className="pl-6 pr-3 text-slate-400">
                                <Tag className="h-6 w-6" />
                            </div>
                            <input
                                type="text"
                                value={ticketId}
                                onChange={(e) => setTicketId(e.target.value)}
                                placeholder="Paste your Ticket ID here..."
                                className="flex-1 bg-transparent border-none text-lg font-bold text-slate-800 focus:outline-none placeholder:text-slate-300 py-4"
                            />
                            <button
                                type="submit"
                                disabled={loading || !ticketId.trim()}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-[1.5rem] font-black uppercase text-sm tracking-widest shadow-xl active:scale-95 disabled:opacity-50 transition-all flex items-center gap-2"
                            >
                                {loading ? "Searching..." : "Track"}
                            </button>
                        </div>
                    </form>
                    {error && <p className="mt-4 text-center text-red-500 font-bold">{error}</p>}
                </div>
            )}

            {ticket && (
                <div className="max-w-5xl w-full space-y-8 animate-in fade-in duration-500 pb-20">
                    <div className="bg-white rounded-[2.5rem] p-8 sm:p-12 shadow-2xl border border-slate-100 relative">
                        {ticket.status === "REJECTED" ? (
                            <div className="text-center py-6 text-left">
                                <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6"><X className="h-10 w-10 text-red-600" /></div>
                                <h2 className="text-2xl font-black text-red-600 mb-2 uppercase tracking-widest">Ticket Rejected</h2>
                                <div className="mt-8 bg-red-50 border border-red-100 p-6 rounded-3xl text-left">
                                    <p className="text-red-700 font-bold italic">"{ticket.rejectionReason || "No specific reason provided."}"</p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-left">
                                <div className="flex justify-between items-center mb-12">
                                    <h2 className="text-2xl font-black text-slate-900">Current Status</h2>
                                    <span className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest border border-blue-100 bg-blue-50 text-blue-600 shadow-sm`}>
                                        {ticket.status.replace("_", " ")}
                                    </span>
                                </div>
                                <div className="relative flex flex-col sm:flex-row justify-between items-start sm:items-center gap-8 sm:gap-2 px-4 pb-4">
                                    <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 hidden sm:block rounded-full" />
                                    <div className="absolute top-1/2 left-0 h-1 bg-blue-600 -translate-y-1/2 hidden sm:block rounded-full transition-all duration-1000" style={{ width: `${(currentStepIdx / (steps.length - 1)) * 100}%` }} />
                                    {steps.map((step, idx) => {
                                        const isCompleted = idx <= currentStepIdx;
                                        const isActive = idx === currentStepIdx;
                                        return (
                                            <div key={idx} className="relative z-10 flex sm:flex-col items-center gap-4 sm:gap-3">
                                                <div className={`h-14 w-14 rounded-2xl flex items-center justify-center transition-all shadow-xl ${isCompleted ? "bg-blue-600 text-white scale-110" : "bg-white text-slate-300 border-2 border-slate-100"} ${isActive ? "ring-8 ring-blue-50" : ""}`}>
                                                    <step.icon className="h-6 w-6" />
                                                </div>
                                                <div className="text-left sm:text-center">
                                                    <p className={`text-[10px] sm:text-xs font-black uppercase tracking-widest ${isCompleted ? "text-blue-600" : "text-slate-400"}`}>{step.label}</p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left">
                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 min-h-full">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2"><AlertCircle className="h-4 w-4 text-blue-500" /> Case Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 text-left">
                                    <div className="space-y-4">
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Location</p><p className="font-black text-slate-800 uppercase">{ticket.resource}</p></div>
                                        <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Category</p><p className="font-bold text-slate-700">{ticket.category}</p></div>
                                    </div>
                                    <div className="space-y-4">
                                         <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Priority</p><span className={`inline-block px-2.5 py-1 rounded-lg text-[9px] font-black uppercase ${ticket.priority === 'URGENT' ? 'bg-red-50 text-red-500 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'}`}>{ticket.priority}</span></div>
                                         <div><p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Reported On</p><p className="font-bold text-slate-700">{new Date(ticket.createdAt).toLocaleDateString(undefined, { dateStyle: 'long' })}</p></div>
                                    </div>
                                </div>
                                <div className="space-y-4 pb-8 border-b border-slate-50 mb-8">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Initial Report</p>
                                    <div className="text-sm text-slate-600 leading-relaxed font-medium bg-slate-50 p-6 rounded-[2rem] italic border border-slate-100 flex items-start gap-4">
                                        <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-sm shrink-0"><MessageCircle className="h-5 w-5 text-blue-400" /></div>
                                        "{ticket.description}"
                                    </div>
                                </div>
                                {ticket.status === "RESOLVED" || ticket.status === "CLOSED" ? (
                                    <div>
                                        <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Final Resolution</p>
                                        <div className="bg-emerald-50 rounded-[2rem] p-6 border border-emerald-100 text-emerald-900 font-bold text-sm italic shadow-sm">"{ticket.resolutionNotes || "Address successfully."}"</div>
                                    </div>
                                ) : (
                                    <div className="bg-blue-50/50 rounded-[2.5rem] p-8 border border-blue-100 text-center">
                                        <Clock className="h-10 w-10 text-blue-300 mx-auto mb-4" />
                                        <h4 className="text-lg font-black text-blue-900 leading-none mb-2">Staff is Working</h4>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-6 flex flex-col">
                            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl border border-slate-100 flex flex-col h-full min-h-[500px]">
                                <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-2"><MessageSquare className="h-4 w-4 text-blue-500" /> Conversation</h3>
                                <div className="flex-1 space-y-6 overflow-y-auto pr-2 mb-6 custom-scrollbar text-left">
                                    {ticket.comments && ticket.comments.length > 0 ? ticket.comments.map((comment, i) => {
                                        const isStudent = comment.authorId === ticket.studentId;
                                        const commentId = comment.id || comment._id;
                                        return (
                                            <div key={commentId || i} className={`flex flex-col ${isStudent ? "items-end text-right" : "items-start text-left"} group relative border-b border-slate-100 last:border-0 pb-4`}>
                                                <p className="mb-1 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                    {comment.authorName} • {isStudent ? "STUDENT" : "STAFF"} • {formatTimestamp(comment.timestamp)}
                                                </p>
                                                
                                                <div className={`flex items-start gap-4 ${isStudent ? "flex-row-reverse" : "flex-row"} max-w-[100%]`}>
                                                    <div className={`max-w-[85%] text-[11px] font-bold leading-relaxed antialiased ${isStudent ? "text-slate-800" : "text-slate-600"}`}>
                                                        {editingCommentId === commentId ? (
                                                            <div className="flex flex-col gap-3 min-w-[240px] mt-2 bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                                                                <textarea 
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none min-h-[80px] text-xs bg-slate-50 text-slate-900"
                                                                />
                                                                <div className="flex justify-end gap-2 mt-1">
                                                                    <button onClick={() => setEditingCommentId(null)} className="px-4 py-2 text-[10px] uppercase font-black rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
                                                                    <button onClick={() => handleUpdateComment(commentId)} className="px-6 py-2 text-[10px] uppercase font-black rounded-lg bg-slate-900 text-white hover:bg-black shadow-lg transition-all">Save</button>
                                                                </div>
                                                            </div>
                                                        ) : (
                                                            <div className="relative py-1">
                                                                {comment.text}
                                                            </div>
                                                        )}
                                                    </div>

                                                    {editingCommentId !== commentId && (comment.authorId === (auth?.id || "anonymous") || auth?.role === "ADMIN") && (
                                                        <div className={`flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5 shrink-0`}>
                                                            {comment.authorId === (auth?.id || "anonymous") && isWithinEditWindow(comment.timestamp) && (
                                                                <button 
                                                                    onClick={() => { setEditingCommentId(commentId); setEditText(comment.text); }} 
                                                                    className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg transition-all"
                                                                    title="Edit Comment"
                                                                >
                                                                    <Pencil className="h-3.5 w-3.5" />
                                                                </button>
                                                            )}
                                                            <button 
                                                                onClick={() => handleDeleteComment(commentId)} 
                                                                className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-red-600 hover:border-red-100 hover:shadow-lg transition-all"
                                                                title="Delete Comment"
                                                            >
                                                                <Trash2 className="h-3.5 w-3.5" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }) : (
                                        <div className="flex-1 flex flex-col items-center justify-center text-center py-10 opacity-30">
                                            <MessageCircle className="h-12 w-12 text-slate-300 mb-2" />
                                            <p className="text-[10px] font-black uppercase tracking-widest">No history yet</p>
                                        </div>
                                    )}
                                </div>
                                <form onSubmit={handleAddComment} className="mt-auto relative">
                                    <input type="text" value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Type a message..." className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all shadow-inner" />
                                    <button type="submit" disabled={sending || !newComment.trim()} className="absolute right-2 top-2 h-9 w-9 bg-blue-600 rounded-xl text-white flex items-center justify-center hover:bg-blue-700 active:scale-90 transition-all shadow-lg disabled:opacity-50"><Send className="h-4 w-4" /></button>
                                </form>
                            </div>
                            <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl text-white flex items-center gap-4 relative overflow-hidden text-left mt-6">
                                <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center shrink-0"><User className="h-6 w-6 text-blue-400" /></div>
                                <div><p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Assigned Support</p><p className="font-black text-sm">{ticket.technicianName || "Pending Assignee"}</p></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrackTicketPage;
