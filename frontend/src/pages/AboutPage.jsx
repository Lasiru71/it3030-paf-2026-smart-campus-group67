import MainLayout from "../components/layout/MainLayout";
import { 
  Target, 
  Compass, 
  Zap, 
  Users, 
  Award, 
  CheckCircle,
  ArrowRight
} from "lucide-react";
import Button from "../components/common/Button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../utils/constants";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white overflow-hidden py-20 md:py-32">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-400 rounded-full blur-3xl opacity-20" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-sky-200 text-sm font-medium mb-6 backdrop-blur">
            Our Story & Vision
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 tracking-tight">
            Revolutionizing Campus <br/>
            <span className="text-sky-300">Resource Management</span>
          </h1>
          <p className="text-lg md:text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed mb-10">
            CampusReserve was born out of a simple need: making university life smoother. 
            We provide a centralized, smart platform to manage lecture halls, equipment, 
            and labs effortlessly.
          </p>
          <div className="flex justify-center gap-4">
            <Button 
              variant="secondary"
              className="border-white/40 text-white hover:bg-white/10 px-8 py-3"
              onClick={() => navigate(ROUTES.RESOURCES)}
            >
              Learn More
            </Button>
            <Button 
              variant="secondary" 
              className="border-white/40 text-white hover:bg-white/10 px-8 py-3"
              onClick={() => navigate(ROUTES.CONTACT)}
            >
              Contact Us
            </Button>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -left-4 -top-4 w-24 h-24 bg-blue-100 rounded-full -z-10" />
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-slate-600 text-lg leading-relaxed mb-6">
                To empower the university community by providing seamless access to the 
                tools and spaces they need to excel. We bridge the gap between resource 
                providers and seekers through innovative technology.
              </p>
              <ul className="space-y-4">
                {[
                  "Maximize resource utilization efficiency",
                  "Simplify the booking bureaucracy",
                  "Enable real-time tracking of campus assets"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-slate-700 font-medium">
                    <CheckCircle className="h-5 w-5 text-blue-600" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 p-8 md:p-12 rounded-3xl border border-slate-100 relative shadow-inner">
              <div className="bg-blue-600 h-16 w-16 rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg rotate-3">
                <Target className="h-8 w-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 leading-relaxed">
                We aspire to be the standard-setting platform for every modern educational institution worldwide, 
                fostering a culture of shared resources, collaborative learning, and environmental sustainability 
                through optimized space management.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Pillars */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 sm:text-4xl mb-4">
              Our Core Pillars
            </h2>
            <div className="h-1.5 w-20 bg-blue-600 mx-auto rounded-full" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Compass,
                title: "Reliability",
                color: "bg-blue-600",
                desc: "Every booking is a promise. Our platform ensures that when you reserve a space, it's ready for you."
              },
              {
                icon: Zap,
                title: "Efficiency",
                color: "bg-amber-500",
                desc: "Don't waste time on paperwork. Book anything on campus in under 30 seconds with our optimized UI."
              },
              {
                icon: Users,
                title: "Community",
                color: "bg-emerald-500",
                desc: "Built for students, by students. We understand campus needs and prioritize user experience above all."
              }
            ].map((pillar, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-xl transition-all hover:-translate-y-2">
                <div className={`${pillar.color} h-14 w-14 rounded-xl flex items-center justify-center text-white mb-6 shadow-md`}>
                  <pillar.icon className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{pillar.title}</h3>
                <p className="text-slate-500 leading-relaxed">{pillar.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 bg-blue-700 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-20 opacity-10 pointer-events-none">
          <Award className="h-64 w-64 text-white" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { label: "Bookings", value: "15k+" },
              { label: "Spaces", value: "200+" },
              { label: "Registered Users", value: "8k+" },
              { label: "Partner Depts", value: "45" }
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl md:text-5xl font-black mb-2">{stat.value}</p>
                <p className="text-blue-100 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">
            Ready to optimize your time?
          </h2>
          <p className="text-slate-500 text-lg mb-10 max-w-2xl mx-auto">
            Stop worrying about logistics. Join thousands of other students and staff members 
            making the most out of university resources.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
                className="px-10 py-4 text-base"
                onClick={() => navigate(ROUTES.SIGNUP)}
            >
              Get Started Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
                variant="ghost" 
                className="px-10 py-4 text-base"
                onClick={() => navigate(ROUTES.RESOURCES)}
            >
              View All Resources
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default AboutPage;

