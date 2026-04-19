// Features highlight section on the homepage
import { ShieldCheck, Clock, CalendarDays, Bell } from "lucide-react";

const features = [
  {
    icon: CalendarDays,
    title: "Real-Time Availability",
    desc: "See instant room and equipment availability across the entire campus.",
  },
  {
    icon: Clock,
    title: "Book in Seconds",
    desc: "Our streamlined 3-step booking flow means reservations are completed in under a minute.",
  },
  {
    icon: Bell,
    title: "Smart Reminders",
    desc: "Get notified before your booking starts so you never miss a reservation.",
  },
  {
    icon: ShieldCheck,
    title: "Secure & Reliable",
    desc: "JWT-protected accounts ensure your bookings are private and secure.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Why CampusReserve?
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto text-lg">
            Built specifically for university environments with the features students and staff actually need.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div key={feature.title} className="text-center">
                <div className="mx-auto h-14 w-14 rounded-2xl bg-blue-700 flex items-center justify-center text-white mb-4 shadow-md">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="font-semibold text-slate-800 text-lg mb-2">{feature.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
