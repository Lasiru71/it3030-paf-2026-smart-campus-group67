import { useState, useEffect, useRef } from "react";
import { Bell, CheckCheck, Trash2, Calendar, Ticket, Info, X } from "lucide-react";
import * as notificationService from "../../services/notificationService";

const NotificationBell = () => {
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        try {
            const { data } = await notificationService.getNotifications();
            setNotifications(data);
            const count = data.filter(n => !n.read).length;
            setUnreadCount(count);
        } catch (err) {
            console.error("Failed to fetch notifications", err);
        }
    };

    useEffect(() => {
        const load = async () => {
            await fetchNotifications();
        };
        load();
        
        // Polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
            setUnreadCount(Math.max(0, unreadCount - 1));
        } catch (err) {
            console.error("Failed to mark as read", err);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read", err);
        }
    };

    const handleDelete = async (e, id) => {
        e.stopPropagation();
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter(n => n.id !== id));
            // Recalculate unread count if necessary
        } catch (err) {
            console.error("Failed to delete notification", err);
        }
    };

    const getRelativeTime = (dateString) => {
        const now = new Date();
        const past = new Date(dateString);
        const diffMs = now - past;
        const diffMins = Math.round(diffMs / 60000);
        const diffHrs = Math.round(diffMins / 60);
        const diffDays = Math.round(diffHrs / 24);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHrs < 24) return `${diffHrs}h ago`;
        return `${diffDays}d ago`;
    };

    const getTypeIcon = (type) => {
        switch (type) {
            case "BOOKING": return <Calendar className="h-4 w-4 text-blue-500" />;
            case "TICKET": return <Ticket className="h-4 w-4 text-amber-500" />;
            default: return <Info className="h-4 w-4 text-slate-500" />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Bell Icon */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-xl hover:bg-slate-100/80 transition-all duration-300 group active:scale-95"
            >
                <Bell className={`h-6 w-6 transition-colors duration-300 ${isOpen ? "text-blue-700" : "text-slate-500 group-hover:text-blue-600"}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-600 text-[10px] font-bold text-white items-center justify-center">
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    </span>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-white/50 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 origin-top-right">
                    {/* Header */}
                    <div className="px-6 py-5 border-b border-slate-100/50 flex items-center justify-between bg-white/50">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Notifications</h3>
                            <p className="text-xs text-slate-500 font-medium">You have {unreadCount} unread alerts</p>
                        </div>
                        {unreadCount > 0 && (
                            <button 
                                onClick={handleMarkAllAsRead}
                                className="flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900 transition-colors bg-blue-50 px-3 py-1.5 rounded-full"
                            >
                                <CheckCheck className="h-3.5 w-3.5" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Scrollable List */}
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {notifications.length > 0 ? (
                            <div className="divide-y divide-slate-100/50">
                                {notifications.map((n) => (
                                    <div 
                                        key={n.id}
                                        onClick={() => !n.read && handleMarkAsRead(n.id)}
                                        className={`px-6 py-4 flex gap-4 hover:bg-slate-50/80 transition-colors cursor-pointer group relative ${!n.read ? "bg-blue-50/30" : ""}`}
                                    >
                                        <div className={`mt-1 h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center transition-colors ${!n.read ? "bg-white shadow-sm" : "bg-slate-100"}`}>
                                            {getTypeIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between gap-2 mb-1">
                                                <p className={`text-sm font-bold truncate ${!n.read ? "text-slate-900" : "text-slate-600"}`}>
                                                    {n.title}
                                                </p>
                                                <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">
                                                    {getRelativeTime(n.createdAt)}
                                                </span>
                                            </div>
                                            <p className={`text-xs leading-relaxed line-clamp-2 ${!n.read ? "text-slate-700 font-medium" : "text-slate-500"}`}>
                                                {n.message}
                                            </p>
                                        </div>
                                        {!n.read && (
                                            <div className="absolute left-2 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"></div>
                                        )}
                                        <button 
                                            onClick={(e) => handleDelete(e, n.id)}
                                            className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-red-500 transition-all rounded-lg hover:bg-red-50"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="py-12 px-6 text-center">
                                <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Bell className="h-8 w-8 text-slate-300" />
                                </div>
                                <h4 className="text-slate-900 font-bold mb-1">All caught up!</h4>
                                <p className="text-slate-500 text-xs">No new notifications at the moment.</p>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100/50 text-center">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Powered by CampusReserve</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationBell;
