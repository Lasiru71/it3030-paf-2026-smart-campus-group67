import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { facilityService } from "../services/facilityService";
import { bookingService } from "../services/bookingService";
import MainLayout from "../components/layout/MainLayout";
import { renderLocation } from "../utils/formatters";
import {
  MapPin,
  Users,
  ChevronRight,
  ChevronLeft,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wifi,
  Monitor,
  Mic,
  Wind,
  Projector,
  DoorOpen,
  ShieldCheck,
  Info,
  Calendar,
  Star,
  Zap,
  Building2,
  Tag,
  ArrowLeft,
  BookOpen,
  Sparkles,
} from "lucide-react";

/* ─── Helper: derive amenities from category ─── */
const getAmenities = (category) => {
  const base = [
    { icon: Wifi, label: "Wi-Fi", available: true },
    { icon: Wind, label: "Air Conditioning", available: true },
  ];

  switch (category) {
    case "L Halls":
      return [
        ...base,
        { icon: Projector, label: "Projector & Screen", available: true },
        { icon: Mic, label: "Sound System / Mic", available: true },
        { icon: Monitor, label: "Smartboard", available: true },
        { icon: DoorOpen, label: "Emergency Exits", available: true },
        { icon: Users, label: "Tiered Seating", available: true },
        { icon: Zap, label: "Power Outlets (Per Row)", available: true },
      ];
    case "Labs":
      return [
        ...base,
        { icon: Monitor, label: "Desktop Computers", available: true },
        { icon: Projector, label: "Overhead Projector", available: true },
        { icon: ShieldCheck, label: "Safety Equipment", available: true },
        { icon: Zap, label: "Power Stations", available: true },
        { icon: DoorOpen, label: "Emergency Exits", available: true },
        { icon: BookOpen, label: "Lab Manuals", available: true },
      ];
    case "Meeting":
      return [
        ...base,
        { icon: Monitor, label: "Display Screen", available: true },
        { icon: Mic, label: "Conference Mic", available: true },
        { icon: Projector, label: "Projector", available: true },
        { icon: DoorOpen, label: "Soundproof Doors", available: true },
      ];
    case "Common":
      return [
        ...base,
        { icon: Zap, label: "Charging Points", available: true },
        { icon: DoorOpen, label: "Open Access", available: true },
        { icon: Monitor, label: "Info Screens", available: false },
      ];
    case "Study Area":
      return [
        ...base,
        { icon: Zap, label: "Charging Points", available: true },
        { icon: Users, label: "Quiet Environment", available: true },
        { icon: Wind, label: "Air Purifiers", available: true },
      ];
    case "Sports Facility":
      return [
        { icon: Wind, label: "Ventilation", available: true },
        { icon: Users, label: "Changing Rooms", available: true },
        { icon: ShieldCheck, label: "Safety Equipment", available: true },
      ];
    default:
      return base;
  }
};

/* ─── Helper: usage guidelines ─── */
const getRules = (category) => {
  const common = [
    "Report any damages or equipment issues immediately to the admin.",
    "Maintain cleanliness — dispose of waste in designated bins.",
    "All users must vacate the facility 5 minutes before the end of their booking slot.",
  ];
  switch (category) {
    case "L Halls":
      return [
        "No food or beverages allowed inside the hall.",
        "Technical support must be requested at least 24 hours in advance.",
        "Maximum audio volume must not exceed recommended decibel levels.",
        ...common,
      ];
    case "Labs":
      return [
        "Wear appropriate safety gear at all times (lab coats, safety glasses).",
        "No unauthorized software installations on lab computers.",
        "All experiments must be supervised by a lab instructor.",
        ...common,
      ];
    case "Meeting":
      return [
        "Meetings should start and end within the booked time slot.",
        "External visitors require a visitor pass from security.",
        ...common,
      ];
    case "Study Area":
      return [
        "Strict silence must be maintained at all times.",
        "Reserving seats for others is not permitted.",
        "Personal belongings should not be left unattended.",
        ...common,
      ];
    case "Sports Facility":
      return [
        "Appropriate sports attire and non-marking shoes are mandatory.",
        "Users are responsible for returning any borrowed equipment.",
        "Health and safety regulations strictly apply and must be followed.",
        ...common,
      ];
    default:
      return [
        "Respect the space and other users at all times.",
        ...common,
      ];
  }
};

/* ─── Fake time-slot availability (per day) ─── */
// Removed generateSlots in favor of dynamic calculation


/* ─── Mapping: labels to icons for dynamic amenities ─── */
const amenityIconMap = {
  "Wi-Fi": Wifi,
  "Air Conditioning": Wind,
  "AC": Wind,
  "Projector": Projector,
  "Projector & Screen": Projector,
  "Sound System": Mic,
  "Mic": Mic,
  "Sound System / Mic": Mic,
  "Smartboard": Monitor,
  "Desktop Computers": Monitor,
  "Info Screens": Monitor,
  "Display Screen": Monitor,
  "Emergency Exits": DoorOpen,
  "Soundproof Doors": DoorOpen,
  "Open Access": DoorOpen,
  "Safety Equipment": ShieldCheck,
  "Charging Points": Zap,
  "Power Stations": Zap,
  "Power Outlets": Zap,
  "Power Outlets (Per Row)": Zap,
  "Tiered Seating": Users,
  "Lab Manuals": BookOpen,
};

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ Component ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
const FacilityDetailPage = () => {
  const { resourceId } = useParams();
  const navigate = useNavigate();
  const locationState = useLocation();
  const [resource, setResource] = useState(locationState.state?.resource || null);
  const [loading, setLoading] = useState(!resource);
  const [bookings, setBookings] = useState([]);
  const [slots, setSlots] = useState([]);
  const [activeDay, setActiveDay] = useState(0); // 0 = today

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        if (!resource) {
          const data = await facilityService.getById(resourceId);
          setResource(data);
        }
        const allBookings = await bookingService.getAllBookings();
        setBookings(allBookings || []);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };
    fetch();
    window.scrollTo(0, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resourceId]);

  useEffect(() => {
    if (!resource) return;
    
    const computedSlots = [];
    const starts = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + activeDay);
    const pad = (n) => String(n).padStart(2, '0');
    const targetDateString = `${targetDate.getFullYear()}-${pad(targetDate.getMonth()+1)}-${pad(targetDate.getDate())}`;

    const dateBookings = bookings.filter(b => 
      b.resourceId === resource.id && 
      b.bookingDate === targetDateString &&
      (b.status === "APPROVED" || b.status === "PENDING" || b.status === "CONFIRMED")
    );

    starts.forEach((s) => {
      const startHr = parseInt(s.split(":")[0]);
      const endHrStr = String(startHr + 1).padStart(2, "0");
      
      let isBooked = false;
      dateBookings.forEach(b => {
        const bStartHr = parseInt(b.bookingTime.split(":")[0]);
        const duration = b.durationHours || 1; 
        const bEndHr = bStartHr + duration;
        
        if (startHr >= bStartHr && startHr < bEndHr) {
           isBooked = true; 
        }
      });

      computedSlots.push({ start: s, end: `${endHrStr}:00`, booked: isBooked });
    });
    setSlots(computedSlots);
  }, [activeDay, bookings, resource]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="animate-spin rounded-full h-14 w-14 border-[3px] border-blue-600 border-t-transparent mb-5" />
          <p className="text-slate-500 font-semibold animate-pulse">Loading facility details…</p>
        </div>
      </MainLayout>
    );
  }

  if (!resource) {
    return (
      <MainLayout>
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
          <div className="h-20 w-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
            <Info className="h-10 w-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Resource Not Found</h2>
          <p className="text-slate-500 mb-8">Sorry, we couldn't find the facility you're looking for.</p>
          <button
            onClick={() => navigate("/resources")}
            className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition-all"
          >
            Back to All Resources
          </button>
        </div>
      </MainLayout>
    );
  }

  // Handle Dynamic Amenities with Fallback
  const amenities = (resource.amenities && resource.amenities.length > 0)
    ? resource.amenities.map(label => ({
        label,
        icon: amenityIconMap[label] || Sparkles,
        available: true
      }))
    : getAmenities(resource.category);

  // Handle Dynamic Rules with Fallback
  const rules = (resource.rules && resource.rules.length > 0)
    ? resource.rules
    : getRules(resource.category);
  const occupancyPercent = resource.capacity > 0
    ? Math.round(((resource.capacity - resource.availableSpaces) / resource.capacity) * 100)
    : 0;
  
  const isDistributed = resource.location?.startsWith("DISTRIBUTED:");
  let distributionData = null;
  if (isDistributed) {
    try {
      distributionData = JSON.parse(resource.location.replace("DISTRIBUTED:", ""));
    } catch (e) {
      console.error("Failed to parse distribution data", e);
    }
  }

  const dayLabels = ["Today", "Tomorrow"];
  for (let i = 2; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dayLabels.push(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
  }

  const statusColor =
    resource.status === "Available"
      ? "bg-emerald-500"
      : resource.status === "Maintenance"
      ? "bg-amber-500"
      : "bg-red-500";

  return (
    <MainLayout>
      {/* ── Hero Image Banner ── */}
      <section className="relative h-[420px] md:h-[480px] overflow-hidden">
        {resource.image ? (
          <img
            src={resource.image}
            alt={resource.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-800 via-indigo-900 to-slate-900 flex items-center justify-center">
            <Building2 className="h-32 w-32 text-white/10" />
          </div>
        )}
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Back button */}
        <button
          onClick={() => navigate("/resources")}
          className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-white/15 backdrop-blur-md text-white px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-white/25 transition-all border border-white/10"
        >
          <ArrowLeft className="h-4 w-4" />
          All Resources
        </button>

        {/* Status badge */}
        <span className={`absolute top-6 right-6 z-20 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider text-white shadow-lg ${statusColor}`}>
          {resource.status}
        </span>

        {/* Hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10 p-8 md:p-12">
          <div className="max-w-7xl mx-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs font-bold text-white/90 uppercase tracking-widest mb-4 border border-white/10">
              <Tag className="h-3 w-3" />
              {resource.category}
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-3">
              {resource.name}
            </h1>
            <div className="flex flex-wrap items-center gap-6 text-white/80 text-sm font-medium">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {isDistributed ? "Distributed across Campus" : resource.location}
              </span>
              <span className="flex items-center gap-2">
                {["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? (
                  <>
                    <Zap className="h-4 w-4" />
                    Quantity: {resource.capacity} units
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    Capacity: {resource.capacity} seats
                  </>
                )}
              </span>
              <span className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                {["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? `Available: ${resource.availableSpaces} units` : `Available: ${resource.availableSpaces} seats`}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Floating Stats Bar ── */}
      <section className="relative z-20 -mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { 
                label: ["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? "Total Quantity" : "Total Capacity", 
                value: ["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? `${resource.capacity} Units` : `${resource.capacity} Seats`, 
                icon: ["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? Zap : Users, 
                gradient: "from-blue-500 to-blue-700" 
              },
              { 
                label: ["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? "Available Units" : "Available Seats", 
                value: resource.availableSpaces, 
                icon: CheckCircle2, 
                gradient: "from-emerald-500 to-emerald-700" 
              },
              { label: "Occupancy", value: `${occupancyPercent}%`, icon: Zap, gradient: "from-violet-500 to-violet-700" },
              { label: "Status", value: resource.status, icon: AlertCircle, gradient: resource.status === "Available" ? "from-emerald-500 to-emerald-700" : "from-red-500 to-red-700" },
            ].map((stat, i) => (
              <div
                key={i}
                className={`bg-gradient-to-br ${stat.gradient} p-5 rounded-2xl shadow-xl flex items-center gap-4 hover:scale-[1.03] transition-transform duration-300`}
              >
                <div className="h-11 w-11 bg-white/15 rounded-xl flex items-center justify-center backdrop-blur">
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-white/70 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-xl font-black text-white">{stat.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="py-12 md:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

            {/* LEFT COLUMN (2/3) */}
            <div className="lg:col-span-2 space-y-10">

              {/* ── Description Card ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-3">
                  <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Info className="h-5 w-5 text-blue-600" />
                  </div>
                  About This Facility
                </h2>
                {resource.description ? (
                  <p className="text-slate-600 leading-relaxed text-[15px] whitespace-pre-line">
                    {resource.description}
                  </p>
                ) : (
                  <p className="text-slate-600 leading-relaxed text-[15px]">
                    <span className="font-bold text-slate-800">{resource.name}</span> is a
                    {resource.category === "L Halls" && " state-of-the-art lecture hall designed for large-scale academic sessions, guest lectures, and university events. Equipped with modern audio-visual systems and tiered seating for optimum visibility."}
                    {resource.category === "Labs" && " high-tech laboratory environment built for hands-on practical sessions, research activities, and collaborative experiments. Features industry-grade equipment and safety infrastructure."}
                    {resource.category === "Meeting" && " professional meeting room ideal for faculty discussions, departmental meetings, and small-group workshops. Offers a quiet, soundproof environment with modern conferencing tools."}
                    {resource.category === "Common" && " shared campus space perfect for student collaboration, informal study sessions, and leisure activities. An open-access zone designed to foster community engagement."}
                    {resource.category === "Study Area" && " dedicated quiet zone engineered for focused student learning and academic reading. Features individual study pods and collaborative seating arrangements."}
                    {resource.category === "Sports Facility" && " dynamic athletic facility intended for physical education, university sports teams, and recreational student activities. Subject to health and safety regulations."}
                    {!["L Halls", "Labs", "Meeting", "Common", "Study Area", "Sports Facility"].includes(resource.category) && ` campus resource categorized under ${resource.category}. Available for booking and general university use. Contact administration for specific usage guidelines.`}
                  </p>
                )}
                <p className="text-slate-500 mt-4 text-sm">
                  {isDistributed ? (
                    "This resource is distributed across multiple locations on campus to ensure maximum accessibility for students and staff."
                  ) : (
                    <>Located at <span className="font-semibold text-slate-700">{renderLocation(resource.location)}</span>, this facility is easily accessible and well-maintained by our campus infrastructure team.</>
                  )}
                </p>
              </div>

              {/* ── Location Distribution (Only for Distributed) ── */}
              {isDistributed && distributionData && (
                <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 overflow-hidden">
                  <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                    <div className="h-9 w-9 bg-blue-50 rounded-xl flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-blue-600" />
                    </div>
                    Location Distribution
                  </h2>
                  <div className="overflow-x-auto rounded-2xl border border-slate-100">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50 border-b border-slate-100">
                        <tr>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Building / Block</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor / Level</th>
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Qty</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {distributionData.locations.map((loc, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <Building2 className="h-4 w-4 text-slate-400" />
                                <span className="text-sm font-bold text-slate-700">{loc.block}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm font-semibold text-slate-500">{loc.level}</td>
                            <td className="px-6 py-4 text-right">
                              <span className="inline-flex px-3 py-1 bg-blue-50 text-blue-600 rounded-lg text-xs font-black">
                                {loc.quantity}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Amenities & Features ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="h-9 w-9 bg-violet-50 rounded-xl flex items-center justify-center">
                    <Star className="h-5 w-5 text-violet-600" />
                  </div>
                  Amenities & Features
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {amenities.map((a, i) => (
                    <div
                      key={i}
                      className={`group flex flex-col items-center text-center p-5 rounded-2xl border transition-all duration-300 hover:scale-[1.04] hover:shadow-md ${
                        a.available
                          ? "bg-slate-50 border-slate-100 hover:border-blue-200 hover:bg-blue-50/50"
                          : "bg-slate-50/50 border-dashed border-slate-200 opacity-50"
                      }`}
                    >
                      <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-3 transition-colors ${
                        a.available ? "bg-blue-100 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-slate-200 text-slate-400"
                      }`}>
                        <a.icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{a.label}</span>
                      {!a.available && <span className="text-[10px] text-red-400 font-semibold mt-1">Unavailable</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Availability Calendar ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-emerald-600" />
                  </div>
                  Availability Schedule
                </h2>

                {/* Day picker */}
                <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
                  {dayLabels.map((day, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveDay(i)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        activeDay === i
                          ? "bg-blue-600 text-white shadow-lg shadow-blue-200"
                          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {day}
                    </button>
                  ))}
                </div>

                {/* Time slots grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {slots.map((slot, i) => (
                    <div
                      key={i}
                      className={`relative p-4 rounded-2xl border text-center transition-all duration-200 ${
                        slot.booked
                          ? "bg-red-50/70 border-red-100 cursor-not-allowed"
                          : "bg-emerald-50/50 border-emerald-100 hover:border-emerald-300 hover:shadow-md cursor-pointer hover:scale-[1.03]"
                      }`}
                    >
                      <div className={`absolute top-2 right-2 h-2 w-2 rounded-full ${slot.booked ? "bg-red-400" : "bg-emerald-400 animate-pulse"}`} />
                      <Clock className={`h-4 w-4 mx-auto mb-2 ${slot.booked ? "text-red-400" : "text-emerald-500"}`} />
                      <p className={`text-xs font-black ${slot.booked ? "text-red-600" : "text-emerald-700"}`}>
                        {slot.start} – {slot.end}
                      </p>
                      <p className={`text-[10px] font-bold mt-1 ${slot.booked ? "text-red-400" : "text-emerald-500"}`}>
                        {slot.booked ? "Booked" : "Available"}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-6 mt-6 pt-4 border-t border-slate-100">
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="h-3 w-3 rounded-full bg-emerald-400" /> Available
                  </span>
                  <span className="flex items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="h-3 w-3 rounded-full bg-red-400" /> Booked
                  </span>
                </div>
              </div>

              {/* ── Rules & Policies ── */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
                <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
                  <div className="h-9 w-9 bg-amber-50 rounded-xl flex items-center justify-center">
                    <ShieldCheck className="h-5 w-5 text-amber-600" />
                  </div>
                  Rules & Policies
                </h2>
                <div className="space-y-3">
                  {rules.map((rule, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 hover:bg-amber-50/40 transition-colors">
                      <div className="mt-0.5 h-6 w-6 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0">
                        {i + 1}
                      </div>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">{rule}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* RIGHT COLUMN (1/3) — Sticky sidebar */}
            <div className="space-y-8">
              <div className="sticky top-24 space-y-8">

                {/* ── Quick Booking Card ── */}
                <div className="bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100">
                  <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 text-white">
                    <h3 className="text-lg font-black mb-1">Book This Space</h3>
                    <p className="text-blue-100 text-sm">Reserve your slot instantly</p>
                  </div>
                  <div className="p-6 space-y-5">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
                      <Users className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Now</p>
                        <p className="text-lg font-black text-slate-800">
                          {resource.availableSpaces} 
                          <span className="text-sm font-semibold text-slate-500">
                            {["Equipment", "Electronics", "Audio/Visual", "Furniture"].includes(resource.category) ? ` / ${resource.capacity} units` : ` / ${resource.capacity} seats`}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Capacity bar */}
                    <div>
                      <div className="flex justify-between text-xs font-bold text-slate-500 mb-2">
                        <span>Occupancy</span>
                        <span>{occupancyPercent}%</span>
                      </div>
                      <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${
                            occupancyPercent > 80 ? "bg-red-500" : occupancyPercent > 50 ? "bg-amber-500" : "bg-emerald-500"
                          }`}
                          style={{ width: `${occupancyPercent}%` }}
                        />
                      </div>
                    </div>

                    {resource.availableSpaces > 0 ? (
                      <button
                        onClick={() => navigate(`/booking/${resource.id}`, { state: { resource } })}
                        className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black rounded-2xl shadow-xl shadow-blue-500/20 hover:shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-sm flex items-center justify-center gap-2"
                      >
                        Book Now
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <div className="w-full py-4 bg-red-50 text-red-600 font-black rounded-2xl text-sm text-center border border-red-100 uppercase tracking-widest">
                        {resource.status === 'Maintenance' ? 'Under Maintenance' : 
                         resource.status === 'Booked' ? 'Currently Fully Booked' : 
                         resource.status === 'Out of Service' ? 'Out of Service' : 
                         'Currently Unavailable'}
                      </div>
                    )}
                  </div>
                </div>

                {/* ── Location Card ── */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-black text-slate-800 mb-4 flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-blue-600" />
                    Location Details
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-xl border border-blue-100/50">
                      <Building2 className="h-5 w-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Building / Block</p>
                        <p className="text-sm font-bold text-slate-800">{resource.location?.split(",")[0] || "—"}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-violet-50/50 rounded-xl border border-violet-100/50">
                      <DoorOpen className="h-5 w-5 text-violet-600 flex-shrink-0" />
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Floor / Level</p>
                        <p className="text-sm font-bold text-slate-800">
                          {isDistributed ? "See Distribution Table" : (resource.location?.split(",").slice(1).map(l => l.trim()).join(", ") || "—")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ── Quick Info Card ── */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 text-white">
                  <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-sky-400" />
                    Quick Info
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-slate-400">Category</span>
                      <span className="font-bold">{resource.category}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-slate-400">Operating Hours</span>
                      <span className="font-bold">8:00 AM – 6:00 PM</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/10">
                      <span className="text-slate-400">Maintenance</span>
                      <span className="font-bold text-emerald-400">Up to date</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-slate-400">Support</span>
                      <span className="font-bold text-sky-400">On-call</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-12 md:p-16 rounded-[3rem] shadow-2xl shadow-blue-800/20 relative overflow-hidden">
            <div className="absolute -top-20 -right-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-64 w-64 bg-white/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
                Need a Different Space?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto leading-relaxed">
                Browse through our complete catalog of lecture halls, labs, meeting rooms, and more.
              </p>
              <button
                onClick={() => navigate("/resources")}
                className="inline-flex items-center gap-2 bg-white text-blue-700 font-black px-8 py-4 rounded-2xl shadow-xl hover:bg-slate-50 hover:scale-[1.03] active:scale-95 transition-all"
              >
                <ChevronLeft className="h-5 w-5" />
                Explore All Resources
              </button>
            </div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default FacilityDetailPage;
