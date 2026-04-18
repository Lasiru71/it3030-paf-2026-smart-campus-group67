import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { bookingService } from "../services/bookingService";
import { resourceService } from "../services/resourceService";
import { ROUTES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";
import { useEffect } from "react";

const BookingPage = () => {
  const { resourceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [error, setError] = useState("");
  const [resource, setResource] = useState(location.state?.resource || null);
  const [formData, setFormData] = useState({
    members: 1,
    bookingDate: "",
    bookingTime: "",
    durationHours: 1,
    durationMinutes: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [liveTime, setLiveTime] = useState(new Date());

  useEffect(() => {
    if (!resource && resourceId) {
      const fetchResource = async () => {
        try {
          const data = await resourceService.getResourceById(resourceId);
          setResource(data);
        } catch (err) {
          console.error("Error fetching resource:", err);
          setError("Failed to load resource details.");
        }
      };
      fetchResource();
    }
  }, [resource, resourceId]);

  const [resourceBookings, setResourceBookings] = useState([]);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const allBookings = await bookingService.getAllBookings();
        setResourceBookings(allBookings);
      } catch (err) {
        console.error("Failed to fetch bookings for checking panel", err);
      }
    };
    fetchBookings();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Validate members against available spaces
    if (resource && resource.availableSpaces !== undefined && formData.members > resource.availableSpaces) {
      setError("invalid: cannot exceed available seats");
      setIsSubmitting(false);
      return;
    }

    if (formData.durationHours >= 10) {
      setError("invalid: duration hours must be less than 10");
      setIsSubmitting(false);
      return;
    }

    if (formData.durationMinutes > 59) {
      setError("invalid: duration minutes cannot be greater than 59");
      setIsSubmitting(false);
      return;
    }

    const today = new Date();
    // Use local date instead of UTC to avoid timezone mismatches
    const todayStr = today.getFullYear() + '-' + 
                    String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                    String(today.getDate()).padStart(2, '0');
    
    if (formData.bookingDate < todayStr) {
      setError("invalid: booking date cannot be in the past");
      setIsSubmitting(false);
      return;
    }

    if (formData.bookingDate === todayStr) {
      const currentTimeInMins = today.getHours() * 60 + today.getMinutes();
      const [bHours, bMins] = formData.bookingTime.split(':').map(Number);
      const bookingTimeInMins = bHours * 60 + bMins;
      
      if (bookingTimeInMins < currentTimeInMins + 20) {
        setError("invalid: booking time must be at least 20 minutes after from current time");
        setIsSubmitting(false);
        return;
      }
    }
    
    try {
      const payload = {
        resourceId,
        resourceName: resource.name,
        userEmail: auth?.email || "anonymous@campus.edu",
        ...formData
      };
      
      await bookingService.createBooking(payload);
      setSuccess(true);
      
      // Auto redirect after 3 seconds
      setTimeout(() => {
        navigate(ROUTES.MY_BOOKINGS);
      }, 3000);
      
    } catch (err) {
      const backendError = err.response?.data?.message || "Failed to create booking. Please try again.";
      // Show the actual error message from the backend instead of a generic label
      setError(backendError);
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <MainLayout>
        <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 border-t border-slate-200">
          <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 text-center animate-in fade-in zoom-in duration-500">
            <div className="h-24 w-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12" />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4 tracking-tight">Booking Confirmed!</h2>
            <p className="text-slate-500 mb-8">
              You have successfully booked <span className="font-bold text-slate-800">{resource.name}</span>. 
              Redirecting to your bookings...
            </p>
            <Button fullWidth variant="primary" onClick={() => navigate(ROUTES.MY_BOOKINGS)}>
              View My Bookings Now
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Dynamic Header */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50 to-violet-50 text-black py-16 px-4 relative overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-10 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl translate-y-1/3"></div>
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
          <div>
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center text-blue-800 hover:text-black transition-colors mb-6 text-sm font-medium group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Resources
            </button>
            <div className="flex items-center gap-3 mb-3">
              <span className="px-3 py-1 bg-white/60 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider text-blue-900">
                {resource.category}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-black">
              Book {resource ? resource.name : `Resource #${resourceId}`}
            </h1>
            <p className="text-blue-900 text-lg flex items-center font-medium">
              <Clock className="w-5 h-5 mr-2 opacity-70" />
              Fill out the details to secure your reservation
            </p>
          </div>

          {/* Live Clock Badge */}
          <div className="flex flex-col items-end mb-4">
            <div className="bg-white/50 backdrop-blur-2xl border border-white/80 rounded-[2.5rem] px-8 py-6 shadow-2xl flex items-center gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
              <div className="h-16 w-16 bg-blue-600 rounded-[1.25rem] flex items-center justify-center shadow-2xl shadow-blue-500/40 transform hover:rotate-12 transition-transform">
                <Clock className="h-8 w-8 text-white animate-pulse" />
              </div>
              <div className="text-right whitespace-nowrap">
                <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-900/70 mb-1.5">Current System Time</p>
                <p className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                  {liveTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true })}
                </p>
                <div className="flex items-center justify-end gap-2 px-3 py-1 bg-blue-100/50 rounded-full w-fit ml-auto">
                  <Calendar className="h-4 w-4 text-blue-800" />
                  <p className="text-xs font-black text-blue-900 uppercase tracking-widest">
                    {liveTime.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Form Section */}
      <section className="py-12 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-[2rem] shadow-lg border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 to-indigo-400"></div>
            
            <form onSubmit={handleSubmit} className="p-8 md:p-12">
              
              {error && (
                <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center animate-in fade-in slide-in-from-top-4">
                  <span className="font-medium text-black">{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                
                {/* Number of Members */}
                <div className="group">
                  <label className="block text-sm font-extrabold text-black mb-2 uppercase tracking-wide flex justify-between">
                    <span>Number of Members</span>
                    {resource && resource.availableSpaces !== undefined && (
                      <span className="text-emerald-600 font-black">
                        Available: {resource.availableSpaces} seats
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Users className="h-5 w-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="number"
                      name="members"
                      min="1"
                      max={resource ? resource.availableSpaces : 999}
                      required
                      value={formData.members}
                      onChange={handleChange}
                      style={{ color: "black" }}
                      className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400"
                      placeholder="e.g. 5"
                    />
                  </div>
                  <p className="mt-2 text-xs font-medium text-slate-600">Maximum capacity limit applies based on the resource.</p>
                </div>

                {/* Duration */}
                <div className="group">
                  <label className="block text-sm font-extrabold text-black mb-2 uppercase tracking-wide">
                    Duration (Hours & Minutes)
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Clock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                      </div>
                      <input
                        type="number"
                        name="durationHours"
                        min="0"
                        max="9"
                        required
                        value={formData.durationHours}
                        onChange={handleChange}
                        style={{ color: "black" }}
                        className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400"
                        placeholder="Hrs"
                      />
                    </div>
                    <span className="font-bold text-slate-400">hrs</span>

                    <div className="relative flex-1">
                      <input
                        type="number"
                        name="durationMinutes"
                        min="0"
                        max="59"
                        required
                        value={formData.durationMinutes}
                        onChange={handleChange}
                        style={{ color: "black" }}
                        className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 px-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400 text-center"
                        placeholder="Mins"
                      />
                    </div>
                    <span className="font-bold text-slate-400">min</span>
                  </div>
                   <p className="mt-2 text-xs font-medium text-slate-600">Max duration: 9h & 59m.</p>
                </div>

                {/* Date */}
                <div className="group">
                  <label className="block text-sm font-extrabold text-black mb-2 uppercase tracking-wide">
                    Booking Date
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Calendar className="h-5 w-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="date"
                      name="bookingDate"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.bookingDate}
                      onChange={handleChange}
                      style={{ color: "black" }}
                      className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400"
                    />
                  </div>
                </div>

                {/* Checking Panel */}
                <div className="md:col-span-2 rounded-[1.5rem] p-5 mt-2 mb-2 relative overflow-hidden bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900 shadow-xl group">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full blur-[60px] opacity-20 -translate-y-1/2 translate-x-1/3"></div>
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500 rounded-full blur-[60px] opacity-20 translate-y-1/2 -translate-x-1/3"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xs font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-indigo-100 mb-4 uppercase tracking-[0.1em] flex items-center gap-2">
                      <div className="bg-blue-500/20 p-1.5 rounded-lg backdrop-blur-md border border-blue-400/30">
                        <CheckCircle className="h-4 w-4 text-blue-300" />
                      </div>
                      Availability Checking Panel
                    </h3>
                    
                    <div className="space-y-3">
                      {(() => {
                        const today = new Date();
                        const todayStr = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');
                        const displayDate = formData.bookingDate || todayStr;
                        
                        const formatAMPM = (timeStr) => {
                          if (!timeStr) return '';
                          const [h, m] = timeStr.split(':');
                          let hours = parseInt(h, 10);
                          const ampm = hours >= 12 ? 'PM' : 'AM';
                          hours = hours % 12;
                          hours = hours ? hours : 12; 
                          return `${hours}:${m} ${ampm}`;
                        };
                        
                        const calculateEndTime = (timeStr, durationHours, durationMinutes) => {
                          if (!timeStr) return '';
                          const [h, m] = timeStr.split(':').map(Number);
                          let endMinutes = m + (durationMinutes || 0);
                          let extraHours = Math.floor(endMinutes / 60);
                          endMinutes = endMinutes % 60;
                          let endHours = h + (durationHours || 0) + extraHours;
                          if (endHours >= 24) endHours = endHours % 24;
                          const formattedH = endHours.toString().padStart(2, '0');
                          const formattedM = endMinutes.toString().padStart(2, '0');
                          return `${formattedH}:${formattedM}`;
                        };
                        
                        const approvedBookingsForDate = resourceBookings.filter(b => 
                          b.resourceId === resourceId && 
                          b.status === 'APPROVED' && 
                          b.bookingDate === displayDate
                        ).sort((a, b) => a.bookingTime.localeCompare(b.bookingTime));

                        if (approvedBookingsForDate.length > 0) {
                          return approvedBookingsForDate.map((b) => (
                            <div key={b.id} className="relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between bg-white/10 backdrop-blur-xl p-3.5 rounded-xl border border-white/10 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/20 hover:border-white/30 group/item">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-teal-500 rounded-l-xl"></div>
                              <div className="flex items-center gap-3 mb-2 sm:mb-0 ml-2">
                                <span className="relative flex h-2.5 w-2.5">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
                                </span>
                                <span className="font-bold text-blue-50 text-xs tracking-wide">Approved</span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
                                <span className="bg-slate-800/50 text-slate-200 border border-slate-700/50 px-3 py-1 rounded-lg shadow-inner">{b.members} Members</span>
                                <span className="text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.3)] px-3 py-1 rounded-lg flex items-center gap-1.5 group-hover/item:shadow-[0_0_15px_rgba(79,70,229,0.6)] transition-all">
                                  <Clock className="h-3 w-3 text-blue-100" />
                                  {formatAMPM(b.bookingTime)} - {formatAMPM(calculateEndTime(b.bookingTime, b.durationHours, b.durationMinutes))}
                                </span>
                              </div>
                            </div>
                          ));
                        } else {
                          return (
                            <div className="text-center py-5 bg-white/5 backdrop-blur-md rounded-xl border border-dashed border-white/20 transition-all hover:bg-white/10 flex flex-col sm:flex-row items-center justify-center gap-4">
                              <div className="h-10 w-10 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle className="h-5 w-5 text-emerald-400 opacity-80" />
                              </div>
                              <div className="text-left">
                                <p className="text-sm font-bold text-emerald-100 tracking-wide m-0">No approved bookings for {displayDate}.</p>
                                <p className="text-xs font-medium text-emerald-200/60 mt-0.5 m-0">The resource is fully available.</p>
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>

                {/* Time */}
                <div className="group">
                  <label className="block text-sm font-extrabold text-black mb-2 uppercase tracking-wide">
                    Booking Time
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-600 transition-colors" />
                    </div>
                    <input
                      type="time"
                      name="bookingTime"
                      required
                      value={formData.bookingTime}
                      onChange={handleChange}
                      style={{ color: "black" }}
                      className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* Action Area */}
              <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-end gap-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => navigate(-1)}
                  className="w-full sm:w-auto font-bold text-black border border-slate-300 hover:bg-slate-100 py-3 px-6"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto bg-blue-100 hover:bg-blue-200 text-black font-extrabold px-10 py-4 text-base shadow-md border border-blue-300 relative overflow-hidden group"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2 text-black">
                       <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    <span className="relative z-10 flex items-center text-black">
                      Confirm Reservation Check
                    </span>
                  )}
                </Button>
              </div>

            </form>
          </div>
        </div>
      </section>

    </MainLayout>
  );
};

export default BookingPage;
