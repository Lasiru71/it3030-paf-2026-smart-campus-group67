import { useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import MainLayout from "../components/layout/MainLayout";
import Button from "../components/common/Button";
import { Calendar, Clock, Users, ArrowLeft, CheckCircle } from "lucide-react";
import { bookingService } from "../services/bookingService";
import { ROUTES } from "../utils/constants";
import { useAuth } from "../context/AuthContext";

const BookingPage = () => {
  const { resourceId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { auth } = useAuth();
  const resource = location.state?.resource || { name: `Resource #${resourceId}`, location: "Campus", category: "Facility" };

  const [formData, setFormData] = useState({
    members: 1,
    bookingDate: "",
    bookingTime: "",
    durationHours: 1,
    durationMinutes: 0,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    
    // Validate members against available spaces
    if (resource.availableSpaces !== undefined && formData.members > resource.availableSpaces) {
      setError(`Cannot book more than ${resource.availableSpaces} available seats.`);
      setIsSubmitting(false);
      return;
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
      setError("Failed to create booking. Please try again.");
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
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-2 text-black">Book {resource.name}</h1>
            <p className="text-blue-900 text-lg flex items-center font-medium">
              <Clock className="w-5 h-5 mr-2 opacity-70" />
              Fill out the details to secure your reservation
            </p>
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
                    {resource.availableSpaces !== undefined && (
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
                      max={resource.availableSpaces || 999}
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
                        max="12"
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
                   <p className="mt-2 text-xs font-medium text-slate-600">Bookings can be made up to 12 hours max.</p>
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
                      value={formData.bookingDate}
                      onChange={handleChange}
                      style={{ color: "black" }}
                      className="w-full bg-slate-50 border border-slate-300 text-black text-base font-medium rounded-2xl py-4 pl-12 pr-4 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:bg-white transition-all shadow-sm hover:border-slate-400"
                    />
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
