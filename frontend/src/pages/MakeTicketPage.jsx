import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { 
  AlertCircle, 
  CheckCircle2, 
  Image as ImageIcon, 
  Upload, 
  X, 
  ChevronRight, 
  MapPin, 
  Tag, 
  FileText, 
  AlertTriangle, 
  Phone
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../utils/constants";
import axiosInstance from "../services/axiosInstance";
import Button from "../components/common/Button";

const categories = [
  "Electrical",
  "Plumbing",
  "IT / Network",
  "Furniture / Equipment",
  "Cleaning",
  "Security / Safety",
  "Other"
];

const priorities = [
  { value: "LOW", label: "Low", color: "bg-blue-100 text-blue-700 border-blue-200" },
  { value: "MEDIUM", label: "Medium", color: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  { value: "HIGH", label: "High", color: "bg-orange-100 text-orange-700 border-orange-200" },
  { value: "URGENT", label: "Urgent", color: "bg-red-100 text-red-700 border-red-200" },
];

const MakeTicketPage = () => {
  const { auth, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    resource: "",
    category: "",
    description: "",
    priority: "MEDIUM",
    contactInfo: auth?.email || "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);

  if (!isAuthenticated) {
    navigate(ROUTES.LOGIN);
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      setError("You can only upload up to 3 images.");
      return;
    }
    
    // Create preview URLs
    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }));
    
    setImages((prev) => [...prev, ...newImages]);
    setError(null);
  };

  const removeImage = (index) => {
    const updatedImages = [...images];
    URL.revokeObjectURL(updatedImages[index].preview);
    updatedImages.splice(index, 1);
    setImages(updatedImages);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category || !formData.resource || !formData.description) {
      setError("Please fill in all required fields.");
      return;
    }

    setLoading(true);
    setError(null);

    const data = new FormData();
    data.append("resource", formData.resource);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("priority", formData.priority);
    data.append("contactInfo", formData.contactInfo);
    data.append("studentId", auth?.id || "anonymous");

    images.forEach((img) => {
      data.append("images", img.file);
    });

    try {
      const response = await axiosInstance.post("/api/incidents", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
      });
      setSuccess(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit ticket. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Ticket Submitted!</h2>
          <p className="text-slate-600 mb-6">
            Thank you for reporting. Your issue has been logged and our team will attend to it shortly.
          </p>
          
          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">Ticket Reference ID</p>
            <p className="text-xl font-mono font-bold text-blue-700 break-all">
              {success.id}
            </p>
          </div>

          <div className="space-y-3">
            <Button fullWidth onClick={() => navigate(ROUTES.TRACK_TICKET)}>
              Track My Ticket
            </Button>
            <Button variant="ghost" fullWidth onClick={() => { setSuccess(null); setFormData({ ...formData, description: "", resource: "" }); setImages([]); }}>
              Report Another Issue
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-4 border border-blue-100">
            <AlertCircle className="h-3 w-3" />
            Maintenance & Support
          </div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Report an <span className="text-blue-700">Incident</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl">
            Help us keep our campus in top shape. Report issues with resources, facilities, or utilities instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
              <div className="p-8 space-y-6">
                
                {error && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 text-sm animate-in slide-in-from-top-2 duration-300">
                    <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Category */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Tag className="h-4 w-4 text-blue-600" />
                      Issue Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50/50"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Resource / Location */}
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-blue-600" />
                      Location / Resource <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="resource"
                      value={formData.resource}
                      onChange={handleChange}
                      placeholder="e.g. Lab 4 AC, Room 202 Table"
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50/50"
                      required
                    />
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <FileText className="h-4 w-4 text-blue-600" />
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50/50 resize-none"
                    required
                  />
                </div>

                {/* Priority Selection */}
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-blue-600" />
                    Priority Level
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {priorities.map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, priority: p.value }))}
                        className={`py-2 px-3 rounded-xl text-sm font-medium border transition-all ${
                          formData.priority === p.value 
                            ? `${p.color} border-current scale-[1.02] shadow-sm` 
                            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                    <Phone className="h-4 w-4 text-blue-600" />
                    Preferred Contact Information
                  </label>
                  <input
                    type="text"
                    name="contactInfo"
                    value={formData.contactInfo}
                    onChange={handleChange}
                    placeholder="Email or Phone Number"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none bg-slate-50/50"
                  />
                </div>

                {/* Image Upload Area */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <ImageIcon className="h-4 w-4 text-blue-600" />
                      Attachments (Optional, Max 3)
                    </label>
                    <span className="text-xs text-slate-400">{images.length}/3 images</span>
                  </div>

                  <div 
                    onClick={() => images.length < 3 && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all ${
                      images.length < 3 
                        ? 'border-slate-200 hover:border-blue-400 hover:bg-blue-50/30 cursor-pointer' 
                        : 'border-slate-100 bg-slate-50 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                      accept="image/*"
                      multiple
                      className="hidden"
                    />
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-3">
                        <Upload className="h-6 w-6 text-slate-400" />
                      </div>
                      <p className="text-sm font-medium text-slate-600">Click to upload or drag and drop</p>
                      <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max. 5MB per file)</p>
                    </div>
                  </div>

                  {/* Previews */}
                  {images.length > 0 && (
                    <div className="grid grid-cols-3 gap-4 animate-in fade-in duration-300">
                      {images.map((img, index) => (
                        <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-slate-200">
                          <img src={img.preview} alt="Upload preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Form Footer */}
              <div className="bg-slate-50/50 p-6 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs text-slate-500">Fields marked with <span className="text-red-500">*</span> are required.</p>
                <div className="flex gap-4">
                  <Button variant="ghost" type="button" onClick={() => navigate(-1)}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={loading}>
                    Submit Ticket
                  </Button>
                </div>
              </div>
            </form>
          </div>

          {/* Sidebar / Info */}
          <div className="space-y-6">
            <div className="bg-blue-700 rounded-3xl p-6 text-white shadow-lg shadow-blue-200/50">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Quick Tips
              </h3>
              <ul className="space-y-4 text-blue-100 text-sm">
                <li className="flex gap-3">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Be specific about the location (e.g., room number, lab desk)</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Attach clear images of the damage for faster assessment.</span>
                </li>
                <li className="flex gap-3">
                  <ChevronRight className="h-4 w-4 flex-shrink-0 mt-0.5" />
                  <span>Check your email for status updates on your ticket.</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xl shadow-slate-200/30">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Urgent Issue?</h3>
              <p className="text-sm text-slate-600 mb-4">
                If there is an immediate danger (fire, major flooding, gas leak), please contact campus security directly.
              </p>
              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-red-700 font-bold flex items-center gap-3">
                <Phone className="h-5 w-5" />
                Emergency: 011-234-5678
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakeTicketPage;
