// Resource categories grid section on the homepage
import { useNavigate } from "react-router-dom";
import { Building2, Tv2, FlaskConical, Laptop, Music, Dumbbell } from "lucide-react";
import { ROUTES } from "../../utils/constants";

const categories = [
  {
    icon: Building2,
    title: "Lecture Halls",
    desc: "Book large auditoriums and lecture theatres for classes and events.",
    color: "bg-blue-50 text-blue-700",
  },
  {
    icon: Laptop,
    title: "Computer Labs",
    desc: "Reserve computing facilities equipped with the latest hardware.",
    color: "bg-sky-50 text-sky-700",
  },
  {
    icon: FlaskConical,
    title: "Science Labs",
    desc: "Access chemistry, biology, and physics laboratories for research.",
    color: "bg-emerald-50 text-emerald-700",
  },
  {
    icon: Tv2,
    title: "AV Equipment",
    desc: "Borrow projectors, cameras, microphones, and presentation tools.",
    color: "bg-violet-50 text-violet-700",
  },
  {
    icon: Music,
    title: "Music Rooms",
    desc: "Practice in soundproofed music studios and performance spaces.",
    color: "bg-rose-50 text-rose-700",
  },
  {
    icon: Dumbbell,
    title: "Sports Facilities",
    desc: "Reserve courts, gyms, and outdoor sports grounds.",
    color: "bg-amber-50 text-amber-700",
  },
];

const ResourceCategories = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Explore Resource Categories
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            From high-tech labs to sports facilities — everything you need, bookable in minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              onClick={() => navigate(ROUTES.RESOURCES)}
              className="group bg-white rounded-2xl p-6 shadow-sm border border-slate-200 cursor-pointer hover:shadow-md hover:border-blue-300 hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="text-slate-900 font-semibold text-lg mb-1 group-hover:text-blue-700 transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourceCategories;
