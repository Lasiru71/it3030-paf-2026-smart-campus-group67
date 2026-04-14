import { useState } from "react";
import MainLayout from "../components/layout/MainLayout";
import { 
  Search, 
  MapPin, 
  Users, 
  Filter, 
  Clock, 
  ChevronRight,
  Info
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Button from "../components/common/Button";

const resources = [
  {
    id: 1,
    name: "Grand Auditorium",
    category: "L Halls",
    capacity: 450,
    location: "Block A, Level 2",
    status: "Available",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 2,
    name: "Advanced Robotics Lab",
    category: "Labs",
    capacity: 25,
    location: "Engineering Wing",
    status: "Booked",
    image: "https://images.unsplash.com/photo-1581092334651-ddf26d9a1930?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 3,
    name: "Student Lounge B",
    category: "Common",
    capacity: 60,
    location: "Student Hub",
    status: "Available",
    image: "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 4,
    name: "Conference Room 104",
    category: "Meeting",
    capacity: 12,
    location: "Commerce Building",
    status: "Maintenance",
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 5,
    name: "Organic Chem Lab",
    category: "Labs",
    capacity: 30,
    location: "Science Block S3",
    status: "Available",
    image: "https://images.unsplash.com/photo-1532187863486-abf9d39d998e?auto=format&fit=crop&q=80&w=800"
  },
  {
    id: 6,
    name: "Mini Theater 2",
    category: "L Halls",
    capacity: 120,
    location: "Arts Pavilion",
    status: "Available",
    image: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800"
  }
];

const categories = ["All", "L Halls", "Labs", "Meeting", "Common"];

const ResourcesPage = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const filteredResources = resources.filter(res => {
    const matchesCategory = activeCategory === "All" || res.category === activeCategory;
    const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase()) || 
                          res.location.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <MainLayout>
      {/* Search Hero Section - Vibrant Blue Theme */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-950 text-white py-24 md:py-32 overflow-hidden">
        {/* Atmospheric decorations */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-sky-400 blur-[100px] animate-pulse" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-blue-500 blur-[100px] opacity-30" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Find the <span className="text-sky-300">Perfect Space</span>
          </h1>
          <p className="text-blue-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Browse through our wide variety of campus lecture halls, high-tech labs, and study spaces. 
            Real-time availability at your fingertips.
          </p>

          <div className="max-w-2xl mx-auto relative group">
            <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-blue-200 group-focus-within:text-white transition-colors" />
            </div>
            <input 
              type="text" 
              className="w-full bg-white/10 border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:bg-white/20 transition-all shadow-2xl backdrop-blur-sm"
              placeholder="Search by name or location (e.g. Block A, Robotics Lab...)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur border-b border-slate-200 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <Filter className="h-4 w-4 text-slate-400 mr-2 flex-shrink-0" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  activeCategory === cat 
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200" 
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="text-sm text-slate-500">
            Showing <span className="font-bold text-slate-800">{filteredResources.length}</span> resources
          </div>
        </div>
      </section>

      {/* Resource Grid */}
      <section className="py-16 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {filteredResources.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredResources.map((res) => (
                <div key={res.id} className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all group">
                  {/* Card Image */}
                  <div className="h-56 relative overflow-hidden">
                    <img 
                      src={res.image} 
                      alt={res.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    />
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm text-white ${
                        res.status === 'Available' ? 'bg-emerald-500' : 
                        res.status === 'Booked' ? 'bg-amber-500' : 'bg-red-500'
                      }`}>
                        {res.status}
                      </span>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <Button fullWidth size="sm" className="bg-white text-slate-900 hover:bg-slate-100">
                        View Details
                      </Button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">{res.category}</span>
                      <div className="flex items-center text-slate-500 text-xs font-medium">
                        <Users className="h-3 w-3 mr-1" />
                        Cap: {res.capacity}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2 truncate group-hover:text-blue-600 transition-colors">
                      {res.name}
                    </h3>
                    <div className="flex items-center text-slate-500 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1.5 text-slate-400" />
                      {res.location}
                    </div>
                    
                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <div className="flex items-center text-xs text-slate-400">
                        <Clock className="h-3 w-3 mr-1" />
                        Next: Tomorrow 09:00
                      </div>
                      <button 
                        onClick={() => navigate(`/booking/${res.id}`, { state: { resource: res } })}
                        className="text-blue-600 hover:text-blue-700 text-sm font-bold flex items-center gap-1"
                      >
                        Book Now
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
              <div className="h-16 w-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Info className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">No resources found</h3>
              <p className="text-slate-500">Try adjusting your search or category filters.</p>
              <button 
                onClick={() => { setSearch(""); setActiveCategory("All"); }}
                className="mt-6 text-blue-600 font-bold hover:underline"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-blue-50 p-10 md:p-16 rounded-[3rem] border border-blue-100">
            <h2 className="text-3xl font-bold text-slate-900 mb-6 font-primary">
              Not finding what you need?
            </h2>
            <p className="text-slate-500 text-lg mb-10 max-w-xl mx-auto">
              Our campus catalog expands every week. If you need a specific resource or help with your search, contact us.
            </p>
            <Button variant="primary" className="px-10 py-4 shadow-xl shadow-blue-100">
              Contact Support Team
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default ResourcesPage;

