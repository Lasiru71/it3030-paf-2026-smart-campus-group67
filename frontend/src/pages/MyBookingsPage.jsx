// MyBookingsPage — full booking dashboard for regular users
import { useState, useEffect } from "react";
import MainLayout from "../components/layout/MainLayout";
import { useAuth } from "../context/AuthContext";
import {
  CalendarDays, Clock, MapPin, CheckCircle, XCircle,
  AlertCircle, Plus, Search, Filter
} from "lucide-react";
import { bookingService } from "../services/bookingService";

const STATUS_STYLE = {
  CONFIRMED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    dot: "bg-emerald-500",
  },
  APPROVED: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    dot: "bg-emerald-500",
  },
  PENDING: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: <Clock className="h-3.5 w-3.5" />,
    dot: "bg-amber-500",
  },
  CANCELLED: {
    badge: "bg-red-100 text-red-600 border-red-200",
    icon: <XCircle className="h-3.5 w-3.5" />,
    dot: "bg-red-500",
  },
  IN_PROGRESS: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: <AlertCircle className="h-3.5 w-3.5" />,
    dot: "bg-blue-500",
  },
};

const SAMPLE_BOOKINGS = [
  {
    id: "BK-2026-001",
    resource: "Main Auditorium",
    location: "Block A, Floor 1",
    date: "2026-04-14",
    time: "09:00 – 12:00",
    status: "CONFIRMED",
    type: "Event Hall",
  },
  {
    id: "BK-2026-002",
    resource: "Creative Lab B",
    location: "Block C, Floor 2",
    date: "2026-04-12",
    time: "14:00 – 16:00",
    status: "PENDING",
    type: "Laboratory",
  },
  {
    id: "BK-2026-003",
    resource: "Conference Room 3",
    location: "Block B, Floor 3",
    date: "2026-04-10",
    time: "10:00 – 11:30",
    status: "IN_PROGRESS",
    type: "Meeting Room",
  },
  {
    id: "BK-2026-004",
    resource: "Sports Hall",
    location: "Block D, Ground Floor",
    date: "2026-04-08",
    time: "16:00 – 18:00",
    status: "CANCELLED",
    type: "Sports Facility",
  },
];

const TABS = ["All", "CONFIRMED", "PENDING", "IN_PROGRESS", "CANCELLED"];

const MyBookingsPage = () => {
  const { auth } = useAuth();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageInputs, setMessageInputs] = useState({});

  const displayName = auth?.fullName || auth?.email || "Student";

  useEffect(() => {
    if (auth?.email) {
      bookingService.getAllBookings()
        .then(data => {
          // Filter only the authenticated user's bookings
          const myBookings = data.filter(b => b.userEmail === auth.email);
          
          // Sortings: newest first
          const sortedBookings = myBookings.sort((a, b) => {
            // Combine date and time for a robust comparison
            const dateA = `${a.bookingDate}T${a.bookingTime}`;
            const dateB = `${b.bookingDate}T${b.bookingTime}`;
            return dateB.localeCompare(dateA);
          });
          
          setBookings(sortedBookings);
          
          // Pre-fill message inputs
          const initialInputs = {};
          myBookings.forEach(b => {
            initialInputs[b.id || b._id] = b.message || "";
          });
          setMessageInputs(initialInputs);
          
          setLoading(false);
        })
        .catch(err => {
          console.error("Failed to fetch user bookings", err);
          setLoading(false);
        });
    }
  }, [auth?.email]);

  const handleCancel = async (booking) => {
    // 1. Log the entire object to see structure
    console.log("Full booking object:", booking);
    
    // 2. Extra robust ID detection
    const bookingId = booking.id || booking._id; 
    
    alert(`Action Started: Attempting to cancel booking ${bookingId || "UNKNOWN ID"}`);
    
    if (!bookingId) {
      alert("Error: No ID found on booking object! Check console.");
      return;
    }

    if (window.confirm("Confirm cancellation?")) {
      try {
        console.log(`Sending PATCH request for booking: ${bookingId}`);
        const result = await bookingService.updateBookingStatus(bookingId, "CANCELLED");
        
        console.log("API Result:", result);
        alert(`SUCCESS: Booking ${bookingId} has been cancelled.`);
        
        // Update local state
        setBookings(prev => 
          prev.map(b => (b.id === bookingId || b._id === bookingId) ? { ...b, status: "CANCELLED" } : b)
        );
      } catch (err) {
        console.error("Failed to cancel booking", err);
        const status = err.response?.status;
        const msg = err.response?.data?.message || err.message;
        alert(`FAILED: Status ${status || "Unknown"} - ${msg}`);
      }
    }
  };

  const handleMessageChange = (id, val) => {
    setMessageInputs(prev => ({ ...prev, [id]: val }));
  };

  const handleMessageSubmit = async (booking) => {
    const id = booking.id || booking._id;
    const msg = messageInputs[id];
    try {
      await bookingService.updateBookingMessage(id, msg);
      setBookings(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, message: msg } : b));
      alert("Message updated successfully!");
    } catch (err) {
      console.error("Failed to update message", err);
      alert("Failed to submit message.");
    }
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch =
      b.resourceName?.toLowerCase().includes(search.toLowerCase()) ||
      b.id?.toLowerCase().includes(search.toLowerCase());
    const matchesTab = activeTab === "All" || b.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "CONFIRMED").length,
    pending: bookings.filter((b) => b.status === "PENDING").length,
  };

  return (
    <MainLayout>
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-indigo-900 text-white px-6 py-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white/15 flex items-center justify-center shrink-0">
                <CalendarDays className="h-6 w-6" />
              </div>
              <div>
                <p className="text-blue-200 text-xs font-bold uppercase tracking-widest mb-0.5">
                  Student Portal
                </p>
                <h1 className="text-2xl font-black">My Bookings</h1>
                <p className="text-blue-200 text-sm">{displayName}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 bg-white text-blue-700 hover:bg-blue-50 transition-colors font-bold px-5 py-2.5 rounded-xl text-sm shadow-lg shadow-blue-900/20 self-start sm:self-auto">
              <Plus className="h-4 w-4" />
              New Booking
            </button>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-3 gap-4 mt-8">
            {[
              { label: "Total Bookings", value: stats.total },
              { label: "Confirmed", value: stats.confirmed },
              { label: "Pending", value: stats.pending },
            ].map((s) => (
              <div key={s.label} className="bg-white/10 backdrop-blur rounded-xl p-4 text-center">
                <p className="text-2xl font-black">{s.value}</p>
                <p className="text-blue-200 text-xs font-semibold mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Search + Filter bar */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by resource or booking ID…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm text-slate-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 bg-white hover:bg-slate-50 transition">
            <Filter className="h-4 w-4" />
            Filter
          </button>
        </div>

        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${activeTab === tab
                  ? "bg-blue-700 text-white border-blue-700 shadow-sm shadow-blue-200"
                  : "bg-white text-slate-500 border-slate-200 hover:border-blue-300 hover:text-blue-600"
                }`}
            >
              {tab === "IN_PROGRESS" ? "In Progress" : tab}
            </button>
          ))}
        </div>

        {/* Booking cards */}
        {loading ? (
            <div className="p-20 text-center text-slate-500 font-medium">Loading your bookings...</div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-100 py-16 text-center">
            <CalendarDays className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="font-bold text-slate-500">No bookings found</p>
            <p className="text-sm text-slate-400 mt-1">Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filtered.map((booking) => {
              const style = STATUS_STYLE[booking.status] || STATUS_STYLE.PENDING;
              return (
                <div
                  key={booking.id}
                  className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow p-5 flex flex-col sm:flex-row sm:items-center gap-5"
                >
                  {/* Left: color dot + info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className={`h-11 w-11 rounded-xl flex items-center justify-center shrink-0 bg-blue-50`}>
                      <CalendarDays className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="font-black text-slate-900 text-base">{booking.resourceName}</h3>
                        <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                          {booking.members} members
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mb-2">{booking.id}</p>
                      <div className="flex flex-wrap gap-4 text-sm text-slate-500">
                        <span className="flex items-center gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5 text-slate-400" />
                          {booking.bookingDate}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3.5 w-3.5 text-slate-400" />
                          {booking.bookingTime} ({booking.durationHours}h {booking.durationMinutes}m)
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {booking.location}
                        </span>
                      </div>

                      {/* Message Box Section */}
                      <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <label className="text-[10px] uppercase font-black text-slate-400 mb-1.5 block tracking-wider">
                          Message to Administrator
                        </label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            placeholder="Type a message (e.g. Need projector, special request)..."
                            value={messageInputs[booking.id || booking._id] || ""}
                            onChange={(e) => handleMessageChange(booking.id || booking._id, e.target.value)}
                            className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                          />
                          <button 
                            onClick={() => handleMessageSubmit(booking)}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-[10px] font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Submit
                          </button>
                        </div>
                        {booking.message && (
                          <p className="mt-2 text-[10px] text-blue-600 font-medium italic">
                            Current: "{booking.message}"
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right: status badge + actions */}
                  <div className="flex items-center gap-3 sm:flex-col sm:items-end shrink-0">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${style.badge}`}>
                      {style.icon}
                      {(booking.status || "PENDING").replace("_", " ")}
                    </span>
                    {booking.status !== "CANCELLED" && booking.status !== "IN_PROGRESS" && (
                      <button 
                        onClick={() => handleCancel(booking)}
                        className="mt-2 px-4 py-2 bg-orange-50 text-orange-600 hover:bg-orange-600 hover:text-white border border-orange-200 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all active:scale-95 shadow-sm flex items-center gap-2 group ring-2 ring-orange-400/20"
                      >
                        <XCircle className="h-3.5 w-3.5 group-hover:rotate-90 transition-transform" />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyBookingsPage;
