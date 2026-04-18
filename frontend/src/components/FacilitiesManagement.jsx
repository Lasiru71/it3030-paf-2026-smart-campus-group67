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
  ChevronLeft,
  Image as ImageIcon,
  UploadCloud,
  Copy,
  Info,
  Sparkles,
  ShieldCheck,
  Zap
} from "lucide-react";
import { renderLocation } from "../utils/formatters";
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

export default function FacilitiesManagement() {
  // Views: "dashboard" | "manage"
  const [view, setView] = useState("dashboard");
  const [activeTab, setActiveTab] = useState("Facilities"); // "Facilities" | "Resources"
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
    level: [],
    capacity: "",
    status: "Active",
    startTime: "08:00 AM",
    endTime: "06:00 PM",
    image: "",
    isDistributed: false,
    locationBatches: [{ block: "Main Building", level: "Level 1", quantity: "" }],
    description: "",
    amenities: [],
    rules: []
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
    const isDist = facility.location?.startsWith("DISTRIBUTED:");
    let batches = [{ block: "Main Building", level: "Level 1", quantity: "" }];
    let block = "Main Building";
    let level = [];

    if (isDist) {
      try {
        const data = JSON.parse(facility.location.replace("DISTRIBUTED:", ""));
        batches = data.locations || batches;
      } catch (e) {
        console.error("Failed to parse distributed location", e);
      }
    } else {
      block = facility.location?.split(',')[0] || "Main Building";
      level = facility.location?.split(',').slice(1).map(l => l.trim()) || [];
    }

    setFormData({
      ...facility,
      block,
      level,
      isDistributed: isDist,
      locationBatches: batches,
      status: facility.status === "Available" ? "Active" : (facility.status === "Maintenance" ? "Maintenance" : "Out of Service"),
      startTime: facility.startTime || "08:00 AM",
      endTime: facility.endTime || "06:00 PM",
      image: facility.image || "",
      description: facility.description || "",
      amenities: facility.amenities || [],
      rules: facility.rules || []
    });
    setView("manage");
  };

  const handleDuplicate = (facility) => {
    const isDist = facility.location?.startsWith("DISTRIBUTED:");
    let batches = [{ block: "Main Building", level: "Level 1", quantity: "" }];
    let block = "Main Building";
    let level = [];

    if (isDist) {
      try {
        const data = JSON.parse(facility.location.replace("DISTRIBUTED:", ""));
        batches = data.locations || batches;
      } catch (e) {
        console.error("Failed to parse distributed location", e);
      }
    } else {
      block = facility.location?.split(',')[0] || "Main Building";
      level = facility.location?.split(',').slice(1).map(l => l.trim()) || [];
    }

    setFormData({
      ...facility,
      id: null, // Set ID to null for new record
      block,
      level,
      isDistributed: isDist,
      locationBatches: batches,
      status: "Active", // Reset status to active for the new copy
      startTime: facility.startTime || "08:00 AM",
      endTime: facility.endTime || "06:00 PM",
      image: facility.image || "",
      description: facility.description || "",
      amenities: facility.amenities || [],
      rules: facility.rules || []
    });
    setView("manage");
  };

  const handleAddNew = () => {
    setFormData({ 
      id: null, 
      name: "", 
      category: activeTab === "Facilities" ? "L Halls" : "Equipment", 
      block: "Main Building", 
      level: [], 
      capacity: "", 
      status: "Active", 
      startTime: "08:00 AM", 
      endTime: "06:00 PM",
      image: "",
      isDistributed: false,
      locationBatches: [{ block: "Main Building", level: "Level 1", quantity: "" }],
      description: "",
      amenities: [],
      rules: []
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

    let locationStr = "";
    let totalCapacity = parseInt(formData.capacity) || 0;

    if (formData.isDistributed) {
      locationStr = `DISTRIBUTED:${JSON.stringify({ locations: formData.locationBatches.filter(b => b.quantity > 0) })}`;
      totalCapacity = formData.locationBatches.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0);
    } else {
      locationStr = formData.level.length > 0 ? `${formData.block}, ${formData.level.join(', ')}` : formData.block;
    }

    const updatedFacility = {
      ...formData,
      location: locationStr,
      capacity: totalCapacity,
      availableSpaces: totalCapacity,
      status: formData.status === "Active" ? "Available" : (formData.status === "Maintenance" ? "Maintenance" : "Booked")
    };

    const performSave = async () => {
      try {
        await facilityService.save(updatedFacility);
        const freshData = await facilityService.getAll();
        setFacilities(freshData);
        setView("dashboard");
      } catch {
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
      } catch {
        alert("Failed to delete facility.");
      }
    }
  };

  const handleImagePaste = (e) => {
    const items = (e.clipboardData || window.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file' && item.type.includes('image/')) {
        const file = item.getAsFile();
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData(prev => ({ ...prev, image: event.target.result }));
        };
        reader.readAsDataURL(file);
        break; // Only take the first image
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

                {/* Grid row 1: Category and Capacity */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
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
                      <div className="flex items-center justify-between ml-1 mb-1">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest">
                          {activeTab === "Facilities" ? "Capacity / Seats" : "Quantity / Units"} <span className="text-red-500">*</span>
                        </label>
                        {activeTab === "Resources" && (
                          <button 
                            onClick={() => setFormData({...formData, isDistributed: !formData.isDistributed})}
                            className={`text-[10px] font-black px-2 py-0.5 rounded-md transition-all ${formData.isDistributed ? 'bg-indigo-600 text-white shadow-sm' : 'bg-slate-100 text-slate-400 hover:text-slate-600'}`}
                          >
                            {formData.isDistributed ? 'DISTRIBUTED ACTIVE' : 'ENABLE DISTRIBUTION'}
                          </button>
                        )}
                      </div>
                      <input 
                        type="number" 
                        value={formData.isDistributed ? formData.locationBatches.reduce((sum, b) => sum + (parseInt(b.quantity) || 0), 0) : formData.capacity}
                        onChange={(e) => !formData.isDistributed && setFormData({...formData, capacity: e.target.value})}
                        disabled={formData.isDistributed}
                        className={`w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all ${formData.isDistributed ? 'opacity-50 cursor-not-allowed bg-slate-100 text-indigo-600' : ''}`}
                        placeholder={activeTab === "Facilities" ? "Enter capacity" : "Enter quantity"} 
                      />
                    </div>
                </div>

                {/* Grid row 2: Location (Block & Level) */}
                <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">{formData.isDistributed ? 'Location Detail' : ''}</label>
                        {formData.isDistributed && (
                          <button 
                            onClick={() => setFormData({
                              ...formData, 
                              locationBatches: [...formData.locationBatches, { block: "Main Building", level: "Level 1", quantity: "" }]
                            })}
                            className="text-[10px] font-black text-white bg-blue-600 px-3 py-1 rounded-full hover:bg-blue-700 shadow-sm flex items-center gap-1 transition-all"
                          >
                            <Plus className="h-3 w-3" /> ADD BATCH
                          </button>
                        )}
                    </div>
                    
                    {formData.isDistributed ? (
                      <div className="space-y-4">
                        {formData.locationBatches.map((batch, index) => (
                          <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-slate-50 rounded-2xl border border-slate-100 relative group animate-in slide-in-from-left-2 duration-300">
                             <div className="relative">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Block</p>
                               <select 
                                 value={batch.block}
                                 onChange={(e) => {
                                   const newBatches = [...formData.locationBatches];
                                   newBatches[index].block = e.target.value;
                                   setFormData({...formData, locationBatches: newBatches});
                                 }}
                                 className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10"
                               >
                                 <option>Main Building</option>
                                 <option>G Block</option>
                                 <option>F Block</option>
                                 <option>Engineering Block</option>
                                 <option>Business Block</option>
                                 <option>Arts Pavillion</option>
                                 <option>Science Block</option>
                                 <option>Student Hub</option>
                               </select>
                               <ChevronDown className="absolute right-3 bottom-3 h-3 w-3 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Level</p>
                               <select 
                                 value={batch.level}
                                 onChange={(e) => {
                                   const newBatches = [...formData.locationBatches];
                                   newBatches[index].level = e.target.value;
                                   setFormData({...formData, locationBatches: newBatches});
                                 }}
                                 className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/10"
                               >
                                 {[...Array(10)].map((_, i) => (
                                   <option key={i+1} value={`Level ${i+1}`}>Level {i+1}</option>
                                 ))}
                                 <option value="Basement">Basement</option>
                               </select>
                               <ChevronDown className="absolute right-3 bottom-3 h-3 w-3 text-slate-400 pointer-events-none" />
                             </div>
                             <div className="relative">
                               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Quantity</p>
                               <input 
                                 type="number" 
                                 value={batch.quantity}
                                 onChange={(e) => {
                                   const newBatches = [...formData.locationBatches];
                                   newBatches[index].quantity = e.target.value;
                                   setFormData({...formData, locationBatches: newBatches});
                                 }}
                                 className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-blue-500/10"
                                 placeholder="Qty" 
                               />
                             </div>
                             <div className="flex items-end justify-center pb-1">
                                <button 
                                  onClick={() => {
                                    if (formData.locationBatches.length > 1) {
                                      setFormData({
                                        ...formData, 
                                        locationBatches: formData.locationBatches.filter((_, i) => i !== index)
                                      });
                                    } else {
                                      alert("At least one location is required in distributed mode.");
                                    }
                                  }}
                                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="relative">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Location Detail / Block <span className="text-red-500">*</span></p>
                          <select 
                            value={formData.block}
                            onChange={(e) => setFormData({...formData, block: e.target.value})}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                          >
                            <option value="">Select Block</option>
                            <option>Main Building</option>
                            <option>G Block</option>
                            <option>F Block</option>
                            <option>Engineering Block</option>
                            <option>Business Block</option>
                            <option>Arts Pavillion</option>
                            <option>Science Block</option>
                            <option>Student Hub</option>
                          </select>
                          <ChevronDown className="absolute right-5 bottom-4 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                        <div className="relative">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 ml-1">Level / Floor <span className="text-red-500">*</span></p>
                          <select 
                            value={formData.level[0] || ""}
                            onChange={(e) => setFormData({...formData, level: [e.target.value]})}
                            className="w-full px-5 py-3.5 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                          >
                            <option value="">Select Level</option>
                            {[...Array(10)].map((_, i) => (
                              <option key={i+1} value={`Level ${i+1}`}>Level {i+1}</option>
                            ))}
                            <option value="Basement">Basement</option>
                          </select>
                          <ChevronDown className="absolute right-5 bottom-4 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                      </div>
                    )}
                </div>

                {/* Grid row 3: Availability Time (Start & End) */}
                <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest ml-1">Availability Hours <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
                        <input 
                          type="text" 
                          value={formData.startTime}
                          onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                          className="flex-1 px-4 py-2.5 bg-transparent border-none text-sm font-semibold outline-none text-slate-600"
                          placeholder="From (08:00 AM)" 
                        />
                        <div className="p-2.5">
                           <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                      <div className="flex items-center gap-2 bg-slate-50 rounded-2xl p-1 border border-transparent focus-within:border-blue-200 focus-within:bg-white transition-all shadow-inner">
                        <input 
                          type="text" 
                          value={formData.endTime}
                          onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                          className="flex-1 px-4 py-2.5 bg-transparent border-none text-sm font-semibold outline-none text-slate-600"
                          placeholder="To (06:00 PM)" 
                        />
                        <div className="p-2.5">
                           <Clock className="h-4 w-4 text-slate-400" />
                        </div>
                      </div>
                    </div>
                </div>

                {/* Image Upload/Paste Section */}
                <div className="space-y-4 pt-8 border-t border-slate-100">
                  <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-blue-500" />
                    Resource Image
                  </label>
                  <p className="text-xs text-slate-500 mb-2">Click below and press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-600 font-mono text-[10px]">Ctrl+V</kbd> (or <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded-md text-slate-600 font-mono text-[10px]">Cmd+V</kbd>) to paste an image.</p>
                  
                  <div 
                    tabIndex={0}
                    onPaste={handleImagePaste}
                    className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all ${
                      formData.image ? 'border-blue-300 bg-blue-50/30' : 'border-slate-300 bg-slate-50 hover:bg-slate-100'
                    } focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
                  >
                    {formData.image ? (
                      <div className="relative w-full max-w-sm">
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          className="w-full h-auto max-h-48 object-contain rounded-xl shadow-md border border-slate-200 bg-white"
                        />
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setFormData({...formData, image: ""}) }}
                          className="absolute -top-3 -right-3 bg-red-500 text-white p-1.5 rounded-full shadow-lg hover:bg-red-600 transition-colors z-10"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="text-center group pointer-events-none">
                        <div className="h-14 w-14 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4 text-blue-500 group-hover:scale-110 transition-transform border border-slate-100">
                          <UploadCloud className="h-6 w-6" />
                        </div>
                        <p className="text-sm font-bold text-slate-700">Paste Image Here</p>
                        <p className="text-xs text-slate-500 mt-1">Focus this box and paste</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Dynamic Details: Description, Amenities, Rules */}
                <div className="space-y-8 pt-8 border-t border-slate-100">
                  {/* Description */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      About This {activeTab.slice(0, -1)}
                    </label>
                    <textarea 
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full px-5 py-4 bg-slate-50 border-none rounded-2xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 focus:bg-white shadow-inner transition-all min-h-[120px]"
                      placeholder={`Enter a detailed description of the ${activeTab.slice(0, -1).toLowerCase()}...`}
                    />
                  </div>

                  {/* Amenities */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-violet-500" />
                      Amenities & Features
                    </label>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {formData.amenities.map((amenity, idx) => (
                        <span key={idx} className="px-3 py-1.5 bg-violet-50 text-violet-600 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 border border-violet-100 animate-in zoom-in-50 duration-200">
                          {amenity}
                          <button onClick={() => setFormData({...formData, amenities: formData.amenities.filter((_, i) => i !== idx)})} className="hover:text-red-500">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        id="amenityInput"
                        className="flex-1 px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        placeholder="Add an amenity (e.g. Wi-Fi, Projector)..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !formData.amenities.includes(val)) {
                              setFormData({...formData, amenities: [...formData.amenities, val]});
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const input = document.getElementById('amenityInput');
                          const val = input.value.trim();
                          if (val && !formData.amenities.includes(val)) {
                            setFormData({...formData, amenities: [...formData.amenities, val]});
                            input.value = '';
                          }
                        }}
                        className="px-4 bg-violet-600 text-white rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-200"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-800 flex items-center gap-2">
                      <ShieldCheck className="h-4 w-4 text-amber-500" />
                      Usage Rules & Policies
                    </label>
                    <div className="space-y-2 mb-3">
                      {formData.rules.map((rule, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-amber-50/30 rounded-xl border border-amber-100/50 group animate-in slide-in-from-left-2 duration-200">
                          <div className="h-5 w-5 bg-amber-100 text-amber-600 rounded flex items-center justify-center text-[10px] font-black">{idx+1}</div>
                          <span className="flex-1 text-xs font-semibold text-slate-600">{rule}</span>
                          <button onClick={() => setFormData({...formData, rules: formData.rules.filter((_, i) => i !== idx)})} className="text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        id="ruleInput"
                        className="flex-1 px-5 py-3 bg-slate-50 border-none rounded-xl text-sm font-semibold text-slate-700 focus:ring-2 focus:ring-blue-500/20 shadow-inner"
                        placeholder="Add a rule (e.g. No food allowed)..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.target.value.trim();
                            if (val && !formData.rules.includes(val)) {
                              setFormData({...formData, rules: [...formData.rules, val]});
                              e.target.value = '';
                            }
                          }
                        }}
                      />
                      <button 
                        onClick={() => {
                          const input = document.getElementById('ruleInput');
                          const val = input.value.trim();
                          if (val && !formData.rules.includes(val)) {
                            setFormData({...formData, rules: [...formData.rules, val]});
                            input.value = '';
                          }
                        }}
                        className="px-4 bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors shadow-lg shadow-amber-200"
                      >
                        <Plus className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Status Selection (Horizontal Group) */}
                <div className="space-y-4 pt-8 border-t border-slate-100">
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
                 <div key={f.id} className="group bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-400 overflow-hidden relative">
                   <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-400" />
                   
                   <div className="p-5 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex gap-4 items-center flex-1">
                          {/* Image Container - properly sized and styled */}
                          <div className="h-24 w-28 sm:h-28 sm:w-32 flex-shrink-0 flex items-center justify-center bg-slate-100 rounded-2xl group-hover:bg-slate-200 transition-colors overflow-hidden relative shadow-sm">
                            {f.image ? (
                              <img src={f.image} alt={f.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                            ) : (
                               <Building2 className="h-10 w-10 text-slate-300 group-hover:text-blue-500 transition-colors" />
                            )}
                          </div>
                          
                          {/* Title and Category */}
                          <div className="flex-1 min-w-0 pr-2">
                            <h4 className="text-lg font-black text-slate-800 leading-tight group-hover:text-blue-600 transition-colors truncate" title={f.name}>
                              {f.name}
                            </h4>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5">{f.category}</p>
                          </div>
                        </div>
                        
                        {/* ID / Small icon indicator top right */}
                        <div className="h-8 w-8 bg-slate-50 flex items-center justify-center rounded-xl text-slate-400 shrink-0">
                           <LayoutGrid className="h-4 w-4" />
                        </div>
                      </div>
                      
                      {/* Details row: Quantity/Capacity & Status */}
                      <div className="flex items-center justify-between mt-3 mb-4 pt-4 border-t border-slate-50 border-dashed">
                        <div className="flex items-center gap-2 text-slate-600">
                          {activeTab === "Facilities" ? (
                             <><Users className="h-4 w-4 opacity-50" /> <span className="text-sm font-bold">Capacity: {f.capacity}</span></>
                          ) : (
                             <><Database className="h-4 w-4 opacity-50" /> <span className="text-sm font-bold">Quantity: {f.capacity}</span></>
                          )}
                        </div>
                        <div className={`px-3 py-1.5 rounded-full border text-[9px] font-black flex items-center gap-1.5 ${statusStyles[f.status]}`}>
                          {statusIcons[f.status]} {f.status.toUpperCase()}
                        </div>
                      </div>

                      {/* Location & Actions */}
                      <div className="pt-2 flex items-center justify-between">
                         <div className="flex items-center gap-2 text-slate-500">
                           <MapPin className="h-4 w-4 opacity-50 text-blue-500" />
                           <span className="text-xs font-bold">{renderLocation(f.location)}</span>
                         </div>
                         <div className="flex gap-1.5">
                            <button onClick={() => handleEdit(f)} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all" title="Edit">
                              <Edit className="h-4 w-4"/>
                            </button>
                            <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all" title="Delete">
                              <Trash2 className="h-4 w-4"/>
                            </button>
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
                         <td className="px-8 py-5 text-xs font-bold text-slate-500">{renderLocation(f.location)}</td>
                        <td className="px-8 py-5 text-center">
                           <span className={`inline-flex px-4 py-1.5 rounded-full border text-[10px] font-black ${statusStyles[f.status]}`}>
                             {f.status.toUpperCase()}
                           </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                         <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => handleDuplicate(f)} className="p-2 text-slate-400 hover:text-emerald-600 transition-all" title="Duplicate"><Copy className="h-4 w-4"/></button>
                             <button onClick={() => handleEdit(f)} className="p-2 text-slate-400 hover:text-blue-600 transition-all" title="Edit"><Edit className="h-4 w-4"/></button>
                             <button onClick={() => handleDelete(f.id)} className="p-2 text-slate-400 hover:text-red-500 transition-all" title="Delete"><Trash2 className="h-4 w-4"/></button>
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
