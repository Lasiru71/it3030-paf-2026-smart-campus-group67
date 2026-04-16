import React, { useState, useEffect } from "react";
import { 
  Building2, 
  MapPin, 
  Users, 
  Search, 
  Plus, 
  MoreVertical, 
  Trash2, 
  Edit, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Monitor, 
  Wifi, 
  Mic, 
  Hammer,
  Filter,
  LayoutGrid,
  List as ListIcon,
  X,
  ChevronDown,
  ChevronRight,
  Database,
  Cpu,
  Layers,
  Bell,
  MoreHorizontal,
  ChevronLeft
} from "lucide-react";
import { facilityService } from "../services/facilityService";

// Mock Data
// Moved initialFacilities to facilityService.js

const statusStyles = {
  Available: "bg-emerald-50 text-emerald-600 border-emerald-100",
  Occupied: "bg-amber-50 text-amber-600 border-amber-100",
  Maintenance: "bg-red-50 text-red-600 border-red-100",
  Other: "bg-slate-50 text-slate-600 border-slate-100",
};

const statusIcons = {
  Available: <CheckCircle2 className="h-3.5 w-3.5" />,
  Occupied: <Clock className="h-3.5 w-3.5" />,
  Maintenance: <AlertCircle className="h-3.5 w-3.5" />,
  Other: <MoreHorizontal className="h-3.5 w-3.5" />,
};

const statusThemes = {
  Available: { color: "emerald", icon: CheckCircle2, dot: "bg-emerald-500" },
  Occupied: { color: "orange", icon: Clock, dot: "bg-orange-400" },
  Maintenance: { color: "red", icon: AlertCircle, dot: "bg-red-500" },
  Other: { color: "slate", icon: MoreHorizontal, dot: "bg-slate-400" },
};

export default function FacilitiesManagement() {
  // Views: "dashboard" | "manage"
  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("Facilities"); // "Facilities" | "Resources"
  const facilitiesCategories = ["L Halls", "Labs", "Meeting", "Common"];
  const resourcesCategories = ["Equipment", "Electronics", "Audio/Visual", "Furniture"];

  const [viewMode, setViewMode] = useState("grid");
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    const fetchFacilities = async () => {
      const data = await facilityService.getAll();
      setFacilities(data);
    };
    fetchFacilities();
  }, []);
  
  // Form State
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "L Halls",
    block: "Main Building",
    level: "Level 1",
    capacity: "",
    status: "Active",
    startTime: "08:00 AM",
    endTime: "06:00 PM"
  });

  const currentItems = facilities.filter(f => {
    const isResourceCategory = resourcesCategories.includes(f.category);
    if (activeTab === "Facilities") return !isResourceCategory;
    return isResourceCategory;
  });

  const stats = [
    { label: `Total ${activeTab}`, value: currentItems.length.toString(), icon: Building2, color: "bg-blue-600" },
    { label: "Available", value: currentItems.filter(f => f.status === "Available").length.toString(), icon: CheckCircle2, color: "bg-emerald-600" },
    { label: "Occupied", value: currentItems.filter(f => f.status === "Booked").length.toString(), icon: AlertCircle, color: "bg-orange-500" },
    { label: "Under Maintenance", value: currentItems.filter(f => f.status === "Maintenance").length.toString(), icon: Hammer, color: "bg-red-500" },
  ];

  const handleEdit = (facility) => {
    // Map existing data to new form structure if needed
    setFormData({
      ...facility,
      block: facility.location?.split(',')[0] || "Block A",
      level: facility.location?.split(',')[1]?.trim() || "Level 1",
      status: facility.status === "Available" ? "Active" : (facility.status === "Maintenance" ? "Maintenance" : "Out of Service"),
      startTime: "08:00 AM",
      endTime: "06:00 PM"
    });
    setView("manage");
  };

  const handleAddNew = () => {
    setFormData({ 
      id: null, 
      name: "", 
      category: activeTab === "Facilities" ? "L Halls" : "Equipment", 
      block: "Main Building", 
      level: "Level 1", 
      capacity: "", 
      status: "Active", 
      startTime: "08:00 AM", 
      endTime: "06:00 PM" 
    });
    setView("manage");
  };

  const handleSave = () => {
    // Basic Validation
    if (!formData.name.trim()) {
      alert("Please enter a facility name.");
      return;
    }
    if (activeTab === "Facilities" && (!formData.capacity || formData.capacity <= 0)) {
      alert("Please enter a valid capacity.");
      return;
    }

    // Unique Name Validation
    const isDuplicate = facilities.some(f => 
      f.name.toLowerCase() === formData.name.toLowerCase() && f.id !== formData.id
    );

    if (isDuplicate) {
      alert("A facility with this name already exists. Please use a unique name.");
      return;
    }

    const updatedFacility = {
      ...formData,
      location: `${formData.block}, ${formData.level}`,
      capacity: activeTab === "Facilities" ? (parseInt(formData.capacity) || 0) : 1,
      availableSpaces: activeTab === "Facilities" ? (parseInt(formData.capacity) || 0) : 1,
      status: formData.status === "Active" ? "Available" : (formData.status === "Maintenance" ? "Maintenance" : "Booked")
    };

    const performSave = async () => {
      try {
        await facilityService.save(updatedFacility);
        const freshData = await facilityService.getAll();
        setFacilities(freshData);
        setView("dashboard");
      } catch (err) {
        alert("Failed to save facility. Please check backend connection.");
      }
    };
    
    performSave();
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this facility? This action cannot be undone.")) {
      try {
        await facilityService.delete(id);
        const freshData = await facilityService.getAll();
        setFacilities(freshData);
      } catch (err) {
        alert("Failed to delete facility.");
      }
    }
  };

  if (view === "manage") {
    return (
      <div className="flex flex-col h-full bg-[#f8fafc] animate-in fade-in slide-in-from-right-4 duration-500">
        {/* Manage View Top Bar */}
        <header className="bg-gradient-to-r from-[#1A365D] to-[#2C5282] px-8 py-4 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setView("dashboard")}
               className="p-2 bg-white/10 rounded-lg text-white hover:bg-white/20 transition-all"
             >
               <ChevronLeft className="h-5 w-5" />
             </button>
             <h1 className="text-white text-xl font-bold tracking-tight">Add / Edit {activeTab.slice(0, -1)}</h1>
          </div>
          <div className="flex items-center gap-6">
            <button className="relative text-white/80 hover:text-white transition-colors">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full border border-[#1A365D]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/10 text-white">
              <span className="text-sm font-semibold">Admin</span>
              <ChevronDown className="h-4 w-4 opacity-60" />
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-10 flex justify-center overflow-y-auto">
           <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden self-start">
              {/* Card Header */}
              <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-800 tracking-tight">Add {activeTab.slice(0, -1)}</h3>
                <button onClick={() => setView("dashboard")} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                  <X className="h-6 w-6 text-slate-400" />
                </button>
              </div>

              <div className="p-10 space-y-8">
                {/* Facility Name (Full Width) */}
                <div className="space-y-2">
                  <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{activeTab.slice(0, -1)} Name <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:bg-white shadow-inner transition-all"
                    placeholder="Enter facility name" 
                  />
                </div>

                {/* Grid row 1: Type and Location Block */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Category <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        >
                          <option value="">Select category</option>
                          {activeTab === "Facilities" ? (
                            <>
                              <option value="L Halls">Lecture Hall</option>
                              <option value="Labs">Laboratory</option>
                              <option value="Meeting">Meeting Room</option>
                              <option value="Common">Common Space</option>
                            </>
                          ) : (
                            <>
                              <option value="Equipment">Equipment</option>
                              <option value="Electronics">Electronics</option>
                              <option value="Audio/Visual">Audio/Visual</option>
                              <option value="Furniture">Furniture</option>
                            </>
                          )}
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Location <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <select 
                          value={formData.block}
                          onChange={(e) => setFormData({...formData, block: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        >
                          <option>Select block</option>
                          <option>Main Building</option>
                          <option>G Block</option>
                          <option>F Block</option>
                          <option>Engineering Block</option>
                          <option>Business Block</option>
                        </select>
                        <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                      </div>
                   </div>
                </div>

                {/* Grid row 2: Capacity and Availability From */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {activeTab === "Facilities" && (
                     <div className="space-y-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Capacity / Seats <span className="text-red-500">*</span></label>
                        <input 
                          type="number" 
                          value={formData.capacity}
                          onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                          className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                          placeholder="Enter capacity" 
                        />
                     </div>
                   )}
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Availability Time <span className="text-red-500">*</span></label>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
                        <input 
                          type="text" 
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          className="flex-1 px-4 py-2.5 bg-transparent border-none text-sm font-semibold outline-none text-slate-600"
                          placeholder="From (e.g., 08:00 AM)" 
                        />
                        <div className="p-2.5">
                           <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Row 3: Split Location Detail and End Time */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-2 relative">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1 invisible capitalize h-0">Location Deep</label>
                      <div className="flex gap-4 pt-1">
                        <select 
                          value={formData.block}
                          onChange={(e) => setFormData({...formData, block: e.target.value})}
                          className="flex-1 px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        >
                          <option>Block</option>
                          <option>Main Building</option>
                          <option>G Block</option>
                          <option>F Block</option>
                          <option>Engineering Block</option>
                          <option>Business Block</option>
                        </select>
                        <select 
                          value={formData.level}
                          onChange={(e) => setFormData({...formData, level: e.target.value})}
                          className="flex-2 px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        >
                          <option>Select level</option>
                          {[...Array(10)].map((_, i) => (
                            <option key={i+1} value={`Level ${i+1}`}>Level {i+1}</option>
                          ))}
                          <option value="Basement">Basement</option>
                        </select>
                      </div>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[11px] font-black text-white h-0 overflow-hidden">End Time</label>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
                        <input 
                          type="text" 
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          className="flex-1 px-4 py-2.5 bg-transparent border-none text-sm font-semibold outline-none text-slate-600"
                          placeholder="To (e.g., 06:00 PM)" 
                        />
                        <div className="p-2.5">
                           <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                   </div>
                </div>

                {/* Status Selection (Horizontal Group) */}
                <div className="space-y-4 pt-4">
                  <label className="text-sm font-bold text-slate-800">Status</label>
                  <div className="flex flex-wrap gap-4">
                     {[
                       { id: 'Active', color: 'text-emerald-600 bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500', icon: <CheckCircle2 className="h-4 w-4" /> },
                       { id: 'Maintenance', color: 'text-orange-600 bg-orange-50 border-orange-100', dot: 'bg-orange-500', icon: <Hammer className="h-4 w-4" /> },
                       { id: 'Out of Service', color: 'text-red-600 bg-red-50 border-red-100', dot: 'bg-red-500', icon: <AlertCircle className="h-4 w-4" /> },
                     ].map((s) => (
                       <button
                         key={s.id}
                         onClick={() => setFormData({...formData, status: s.id})}
                         className={`flex items-center gap-2.5 px-6 py-2.5 rounded-full border text-sm font-bold transition-all ${formData.status === s.id ? `${s.color} shadow-md scale-[1.05]` : 'bg-slate-50 border-slate-100 text-slate-400'}`}
                       >
                          <div className={`h-2.5 w-2.5 rounded-full ${formData.status === s.id ? s.dot : 'bg-slate-300'}`} />
                          {s.id}
                       </button>
                     ))}
                  </div>
                </div>

                {/* Final Actions */}
                <div className="pt-10 flex items-center justify-end gap-6 border-t border-slate-100">
                  <button 
                    onClick={() => setView("dashboard")}
                    className="px-8 py-3.5 text-sm font-bold text-slate-500 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="px-12 py-3.5 text-sm font-bold text-white bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all outline-none"
                  >
                    Save
                  </button>
                </div>
              </div>
           </div>
        </main>
      </div>
    );
  }

  // Dashboard View
  return (
    <main className="flex-1 overflow-y-auto bg-slate-50/50 p-6 lg:p-10 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-800 tracking-tight">Facility & Resource</h2>
          <p className="text-slate-500 font-medium mt-1.5 flex items-center gap-2">
            <Layers className="h-4 w-4 text-blue-500" />
            Centralized campus infrastructure management system
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-white p-1 rounded-xl shadow-sm border border-slate-200">
            <button 
              onClick={() => setActiveTab("Facilities")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "Facilities" ? "shadow-lg bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
            >
              Facilities
            </button>
            <button 
              onClick={() => setActiveTab("Resources")}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === "Resources" ? "shadow-lg bg-slate-900 text-white" : "text-slate-500 hover:text-slate-800"}`}
            >
              Resources
            </button>
          </div>
          <button 
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all text-sm"
          >
            <Plus className="h-4 w-4" /> Add New
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`${stat.color} p-6 rounded-xl shadow-lg flex items-center gap-5 hover:scale-[1.02] transition-transform group relative overflow-hidden`}>
             <div className="h-14 w-14 flex items-center justify-center bg-white/10 rounded-lg border border-white/10 shadow-inner">
                <stat.icon className="h-7 w-7 text-white" />
             </div>
             <div className="flex-1 text-center">
                <p className="text-[10px] font-black text-white/80 uppercase tracking-widest leading-none mb-2">{stat.label}</p>
                <div className="h-[1px] w-full bg-white/20 mb-2" />
                <p className="text-3xl font-black text-white leading-none">{stat.value}</p>
             </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-50 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search facilities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-6 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold focus:ring-2 focus:ring-blue-500/20 shadow-inner"
              />
            </div>
            <button className="h-[52px] w-[52px] bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 hover:text-blue-600 transition-all shadow-inner">
              <Filter className="h-5 w-5" />
            </button>
          </div>
          <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-100 shadow-inner">
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-white text-blue-600 shadow-md" : "text-slate-400"}`}><LayoutGrid className="h-4 w-4"/></button>
            <button onClick={() => setViewMode("list")} className={`p-2 rounded-lg ${viewMode === "list" ? "bg-white text-blue-600 shadow-md" : "text-slate-400"}`}><ListIcon className="h-4 w-4"/></button>
          </div>
        </div>

        <div className="flex-1 p-8">
          {viewMode === "grid" ? (
             <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
               {currentItems.filter(f => f.name.toLowerCase().includes(search.toLowerCase())).map(f => (
                 <div key={f.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-1">
                   <div className="h-2 w-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                   <div className="p-8">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-12 w-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-600 transition-colors">
                          <Building2 className="h-6 w-6" />
                        </div>
                        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black flex items-center gap-2 ${statusStyles[f.status]}`}>
                          {statusIcons[f.status]} {f.status.toUpperCase()}
                        </div>
                      </div>
                      <h4 className="text-xl font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate">{f.name}</h4>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 mb-6">{f.category}</p>
                      
                      <div className="space-y-4 mb-8">
                        <div className="flex items-center gap-3 text-slate-600">
                          <MapPin className="h-4 w-4 opacity-40" /> <span className="text-sm font-semibold">{f.location}</span>
                        </div>
                        {activeTab === "Facilities" && (
                          <div className="flex items-center gap-3 text-slate-600">
                            <Users className="h-4 w-4 opacity-40" /> <span className="text-sm font-semibold">Capacity: {f.capacity}</span>
                          </div>
                        )}
                      </div>

                      <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                         <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">UID: {activeTab === "Facilities" ? "FAC" : "RES"}-0{f.id}</span>
                         <div className="flex gap-2">
                            <button onClick={() => handleEdit(f)} className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit className="h-5 w-5"/></button>
                            <button onClick={() => handleDelete(f.id)} className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"><Trash2 className="h-5 w-5"/></button>
                         </div>
                      </div>
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <div className="overflow-x-auto rounded-3xl border border-slate-100">
               <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.map(f => (
                      <tr key={f.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5"><span className="text-sm font-black text-slate-800">{f.name}</span></td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500">{f.category}</td>
                        <td className="px-8 py-5 text-xs font-bold text-slate-500">{f.location}</td>
                        <td className="px-8 py-5 text-center">
                           <span className={`inline-flex px-4 py-1.5 rounded-full border text-[10px] font-black ${statusStyles[f.status]}`}>
                             {f.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                           <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleEdit(f)} className="p-2 text-slate-400 hover:text-blue-600 transition-all"><Edit className="h-4 w-4"/></button>
                             <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all"><Trash2 className="h-4 w-4"/></button>
                           </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
               </table>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
