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

    useEffect(() => {
        fetchIncidents();
    }, []);

    const fetchIncidents = async () => {
        try {
            const res = await axiosInstance.get("/api/incidents/technician/" + auth.id);
            setIncidents(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Failed to fetch assignments", err);
            setLoading(false);
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
        try {
            if (Array.isArray(ts)) {
                const [year, month, day, hour, minute] = ts;
                return new Date(year, month - 1, day, hour, minute).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            }
            const date = new Date(ts);
            if (isNaN(date.getTime())) return "---";
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } catch (e) {
            return "---";
        }
    };

    const handleUpdateStatus = async (id, status) => {
        try {
            const res = await axiosInstance.patch(`/api/incidents/${id}/status`, null, { 
                params: { status } 
            });
            const updated = res.data;
            setIncidents(prev => prev.map(t => (t.id === id || t._id === id) ? updated : t));
            if (selectedTicket && (selectedTicket.id === id || selectedTicket._id === id)) setSelectedTicket(updated);
        } catch (err) {
            console.error("Status update failed", err);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim() || !selectedTicket) return;

        setIsCommenting(true);
        try {
            const comment = {
                authorId: auth.id,
                authorName: auth.fullName || auth.email,
                text: newComment,
                timestamp: new Date().toISOString()
            };
            const ticketId = selectedTicket.id || selectedTicket._id;
            const res = await axiosInstance.post(`/api/incidents/${ticketId}/comments`, comment);
            const updated = res.data;
            setSelectedTicket(updated);
            setIncidents(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? updated : t));
            setNewComment("");
        } catch (err) {
            console.error("Failed to add comment", err);
        } finally {
            setIsCommenting(false);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!editText.trim() || !selectedTicket) return;
        try {
            const ticketId = selectedTicket.id || selectedTicket._id;
            const res = await axiosInstance.patch(`/api/incidents/${ticketId}/comments/${commentId}`, editText, {
                params: { userId: auth.id },
                headers: { "Content-Type": "text/plain" }
            });
            const updated = res.data;
            setSelectedTicket({...updated}); // Force new object reference
            setIncidents(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? updated : t));
            setEditingCommentId(null);
            setEditText("");
        } catch (err) {
            console.error("Failed to update comment", err);
            const msg = err.response?.data?.message || err.message || "Failed to update comment. The 15-minute window may have expired.";
            alert(msg);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!selectedTicket || !window.confirm("Delete this comment permanently?")) return;
        try {
            const ticketId = selectedTicket.id || selectedTicket._id;
            const res = await axiosInstance.delete(`/api/incidents/${ticketId}/comments/${commentId}`, {
                params: { userId: auth.id, isAdmin: auth.role === "ADMIN" }
            });
            const updated = res.data;
            setSelectedTicket({...updated}); // Force new object reference
            setIncidents(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? updated : t));
        } catch (err) {
            console.error("Failed to delete comment", err);
            const msg = err.response?.data?.message || err.message || "Failed to delete comment.";
            alert(msg);
        }
    };

    const handleResolve = async () => {
        if (!resolutionNotes.trim() || !selectedTicket) return;
        setSaving(true);
        try {
            const ticketId = selectedTicket.id || selectedTicket._id;
            const res = await axiosInstance.patch(`/api/incidents/${ticketId}/resolve`, null, {
                params: { notes: resolutionNotes }
            });
            const updated = res.data;
            setIncidents(prev => prev.map(t => (t.id === ticketId || t._id === ticketId) ? updated : t));
            setSelectedTicket(updated);
            setShowResolveModal(false);
            setResolutionNotes("");
        } catch (err) {
            console.error("Resolution failed", err);
        } finally {
            setSaving(false);
        }
    };



    const getStatusStyles = (status) => {
        switch (status) {
            case "OPEN": return "bg-blue-50 text-blue-600 border-blue-100";
            case "IN_PROGRESS": return "bg-amber-50 text-amber-600 border-amber-100";
            case "ONGOING": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "RESOLVED": return "bg-emerald-50 text-emerald-600 border-emerald-100";
            case "CLOSED": return "bg-slate-100 text-slate-500 border-slate-200";
            case "REJECTED": return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-slate-50 text-slate-500 border-slate-100";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Activity className="h-10 w-10 text-blue-600 animate-spin" />
                    <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Accessing Console...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans">
            <div className="flex-1 flex flex-col max-w-[1600px] mx-auto w-full p-6 sm:p-10 gap-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Staff <span className="text-blue-600">Console</span></h1>
                        <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1 italic">Authorized Personal Only</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                    <div className="xl:col-span-1 flex flex-col gap-6">
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/50 border border-slate-100 flex-1">
                            <h2 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-8 flex items-center gap-2">
                                <Activity className="h-4 w-4 text-blue-500" /> My Assignments
                            </h2>
                            <div className="space-y-4">
                                {incidents.map(ticket => (
                                    <div 
                                        key={ticket.id}
                                        onClick={() => setSelectedTicket(ticket)}
                                        className={`group p-6 rounded-3xl border-2 transition-all cursor-pointer ${
                                            selectedTicket?.id === ticket.id 
                                            ? "bg-slate-900 border-slate-900 text-white shadow-2xl shadow-slate-900/20" 
                                            : "bg-white border-slate-50 hover:border-blue-100 hover:bg-blue-50 text-slate-900"
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <p className={`text-[9px] font-black uppercase tracking-widest ${selectedTicket?.id === ticket.id ? "text-slate-400" : "text-slate-400"}`}>
                                                #{ticket.id.slice(-6)}
                                            </p>
                                            <span className={`px-2.5 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest border ${
                                                selectedTicket?.id === ticket.id ? "bg-white/10 border-white/20 text-white" : getStatusStyles(ticket.status)
                                            }`}>
                                                {ticket.status.replace("_", " ")}
                                            </span>
                                        </div>
                                        <h3 className="font-black text-sm truncate uppercase mb-1">{ticket.resource}</h3>
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-3 w-3 opacity-50" />
                                            <p className={`text-[10px] font-bold ${selectedTicket?.id === ticket.id ? "text-slate-300" : "text-slate-500"}`}>{ticket.category}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="xl:col-span-2 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {selectedTicket ? (
                            <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden flex flex-col min-h-[750px]">
                                <div className="p-10 pb-0 flex justify-between items-start border-b border-slate-50 mb-8">
                                    <div className="pb-8">
                                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2 uppercase">{selectedTicket.resource}</h2>
                                        <div className="flex flex-wrap items-center gap-4">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Ticket ID: {selectedTicket.id}</p>
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(selectedTicket.status)}`}>
                                                {selectedTicket.status.replace("_", " ")}
                                            </span>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Priority: {selectedTicket.priority}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        {selectedTicket.status === "OPEN" && (
                                            <button 
                                                onClick={() => handleUpdateStatus(selectedTicket.id, "IN_PROGRESS")}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                            >
                                                Start Assignment
                                            </button>
                                        )}
                                        {selectedTicket.status === "IN_PROGRESS" && (
                                            <button 
                                                onClick={() => handleUpdateStatus(selectedTicket.id, "ONGOING")}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                            >
                                                Mark Ongoing
                                            </button>
                                        )}
                                        {selectedTicket.status === "ONGOING" && (
                                            <button 
                                                onClick={() => setShowResolveModal(true)}
                                                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl transition-all active:scale-95"
                                            >
                                                Resolve Case
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
                                    <div className="p-10 space-y-10 border-r border-slate-50">
                                        <div className="space-y-6">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                <AlertCircle className="h-4 w-4 text-blue-500" /> Case Details
                                            </h3>
                                            <div className="bg-slate-50 rounded-[2rem] p-8 border border-slate-100 italic text-slate-600 font-bold text-sm leading-relaxed shadow-inner">
                                                "{selectedTicket.description}"
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Requester</p>
                                                    <p className="text-[11px] font-mono font-black text-slate-800 whitespace-nowrap overflow-x-auto custom-scrollbar-thin">{selectedTicket.studentName || selectedTicket.studentId}</p>
                                                </div>
                                                <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Tracking ID</p>
                                                    <p className="text-[11px] font-mono font-black text-slate-800 whitespace-nowrap overflow-x-auto custom-scrollbar-thin">{selectedTicket.id}</p>
                                                </div>
                                                <div className="bg-white border border-slate-100 p-4 rounded-2xl">
                                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date Logged</p>
                                                    <p className="font-black text-slate-800">{new Date(selectedTicket.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {selectedTicket.imageUrls?.length > 0 && (
                                            <div className="text-left mt-8">
                                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4">Evidence Gallery</label>
                                                <div className="flex flex-wrap gap-4">
                                                    {selectedTicket.imageUrls.map((url, i) => (
                                                        <div key={i} className="group relative">
                                                            <img 
                                                                src={encodeURI(url.startsWith('http') ? url : `${BASE_URL}${url}`)} 
                                                                alt="Evidence" 
                                                                className="h-32 w-32 object-cover rounded-[1.5rem] border border-slate-200 shadow-lg transition-all group-hover:scale-105 group-hover:ring-8 group-hover:ring-blue-50 cursor-zoom-in" 
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {selectedTicket.status === "RESOLVED" && (
                                            <div className="bg-emerald-50 rounded-[2rem] p-8 border border-emerald-100">
                                                <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-4 flex items-center gap-2">
                                                    <CheckCircle className="h-4 w-4" /> Resolution Actions
                                                </p>
                                                <p className="text-emerald-900 font-bold text-sm italic italic leading-relaxed">
                                                    "{selectedTicket.resolutionNotes}"
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col bg-slate-50/50 p-10 h-full">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-xs font-black text-slate-900 uppercase tracking-widest flex items-center gap-2">
                                                <MessageSquare className="h-4 w-4 text-blue-500" /> Interaction Logs
                                            </h3>
                                        </div>

                                        <div className="flex-1 space-y-6 overflow-y-auto custom-scrollbar pr-3 mb-10">
                                            {selectedTicket.comments?.length > 0 ? selectedTicket.comments.map((c, i) => {
                                               const isStudent = c.authorId === selectedTicket.studentId;
                                               const commentId = c.id || c._id;
                                               return (
                                                  <div key={commentId || i} className={`flex flex-col ${isStudent ? "items-start text-left" : "items-end text-right"} group relative border-b border-slate-200/40 last:border-0 pb-6`}>
                                                     <p className="mb-2 text-[8px] font-black uppercase tracking-widest text-slate-400">
                                                         {c.authorName} • {isStudent ? "STUDENT" : "STAFF"} • {formatTimestamp(c.timestamp)}
                                                     </p>
                                                     
                                                     <div className={`flex items-start gap-4 ${isStudent ? "flex-row" : "flex-row-reverse"} max-w-[100%]`}>
                                                        <div className={`max-w-[85%] text-[11px] font-bold leading-relaxed antialiased ${isStudent ? "text-slate-800" : "text-slate-600"}`}>
                                                           {editingCommentId === commentId ? (
                                                              <div className="flex flex-col gap-3 min-w-[240px] mt-2 bg-white p-4 rounded-2xl shadow-xl border border-slate-100">
                                                                 <textarea 
                                                                    value={editText}
                                                                    onChange={(e) => setEditText(e.target.value)}
                                                                    className="w-full border border-slate-200 rounded-xl p-3 focus:outline-none min-h-[80px] text-xs bg-slate-50 text-slate-900"
                                                                 />
                                                                 <div className="flex justify-end gap-2 mt-1">
                                                                    <button onClick={() => setEditingCommentId(null)} className="px-4 py-2 text-[10px] uppercase font-black rounded-xl bg-slate-100 text-slate-400 hover:bg-slate-200 transition-all">Cancel</button>
                                                                    <button onClick={() => handleUpdateComment(commentId)} className="px-6 py-2 text-[10px] uppercase font-black rounded-xl bg-slate-900 text-white hover:bg-black shadow-lg transition-all">Save</button>
                                                                 </div>
                                                              </div>
                                                           ) : (
                                                              <div className="relative py-1">
                                                                 {c.text}
                                                              </div>
                                                           )}
                                                        </div>

                                                        {editingCommentId !== commentId && (c.authorId === auth.id || auth.role === "ADMIN") && (
                                                           <div className={`flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity pt-0.5 shrink-0`}>
                                                              {c.authorId === auth.id && isWithinEditWindow(c.timestamp) && (
                                                                 <button 
                                                                    onClick={() => { setEditingCommentId(commentId); setEditText(c.text); }}
                                                                    className="h-8 w-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-blue-600 hover:border-blue-100 hover:shadow-lg transition-all"
                                                                    title="Edit Comment"
                                                                 >
                                                                    < Pencil className="h-3.5 w-3.5" />
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
                                               <div className="flex-1 flex flex-col items-center justify-center text-center opacity-30 mt-20">
                                                  <MessageCircle className="h-12 w-12 text-slate-200 mb-4" />
                                                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">No messages yet</p>
                                               </div>
                                            )}
                                        </div>

                                        {selectedTicket.status !== "CLOSED" && selectedTicket.status !== "REJECTED" && (
                                          <form onSubmit={handleAddComment} className="relative mt-auto">
                                            <input 
                                              type="text" 
                                              value={newComment}
                                              onChange={(e) => setNewComment(e.target.value)}
                                              placeholder="Reply to message..."
                                              className="w-full bg-white border border-slate-200 rounded-3xl pl-6 pr-14 py-4 text-xs font-bold shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-50 transition-all"
                                            />
                                            <button 
                                              type="submit" 
                                              disabled={isCommenting || !newComment.trim()} 
                                              className="absolute right-2 top-2 h-10 w-10 bg-slate-900 rounded-[1.25rem] text-white flex items-center justify-center hover:bg-black transition-all disabled:opacity-50"
                                            >
                                              <Send className="h-4 w-4" />
                                            </button>
                                          </form>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full bg-white rounded-[2.5rem] border border-slate-100 flex flex-col items-center justify-center p-20 text-center opacity-30 min-h-[750px]">
                                <Wrench className="h-20 w-20 text-slate-200 mb-6" />
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-[0.2em] mb-2">No Case Selected</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest">Select a ticket from the left panel to begin work protocol.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {showResolveModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 animate-in fade-in duration-300 font-sans">
                   <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" onClick={() => setShowResolveModal(false)} />
                   <div className="relative w-full max-w-lg bg-white rounded-[3rem] p-12 shadow-2xl space-y-10 border border-white/20">
                      <div className="text-center">
                         <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-4 uppercase">Resolve Protocol</h2>
                         <p className="text-[10px] text-slate-500 font-black tracking-widest uppercase mb-2 px-4">Authorized Resolution Action</p>
                      </div>
                      <div className="space-y-6">
                         <textarea 
                            value={resolutionNotes}
                            onChange={(e) => setResolutionNotes(e.target.value)}
                            placeholder="Document fix actions..."
                            className="w-full bg-slate-50 border border-slate-100 rounded-[2rem] p-8 text-sm font-bold text-slate-800 min-h-[180px] focus:outline-none focus:ring-4 focus:ring-emerald-50 transition-all resize-none shadow-inner"
                         />
                         <div className="flex gap-4">
                            <button onClick={() => setShowResolveModal(false)} className="flex-1 h-14 bg-slate-100 text-slate-400 rounded-2xl text-[10px] font-black uppercase tracking-widest">Cancel</button>
                            <button onClick={handleResolve} disabled={!resolutionNotes.trim() || saving} className="flex-[2] h-14 bg-emerald-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:bg-emerald-600 transition-all">
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
