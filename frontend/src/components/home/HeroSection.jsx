// Hero section on the homepage
import { useNavigate } from "react-router-dom";
import { ArrowRight, CalendarCheck } from "lucide-react";
import Button from "../../components/common/Button";
import { useAuth } from "../../context/AuthContext";
import { ROUTES } from "../../utils/constants";
import React from 'react';

const HeroSection = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  return (
    <section className="relative bg-gradient-to-br from-blue-700 via-blue-800 to-slate-900 text-white overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-sky-400/10 blur-2xl" />
      <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-blue-300/10 blur-2xl" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-36 text-center">
        <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 text-sm text-sky-200 mb-6 backdrop-blur">
          <CalendarCheck className="h-4 w-4" />
          University Resource Booking Platform
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight">
          Book University Spaces{" "}
          <span className="text-sky-300">and Resources</span> with Ease
        </h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-10 leading-relaxed">
          Reserve lecture halls, equipment, and campus facilities through one simple platform. Available 24/7, hassle-free.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            variant="secondary"
            className="text-base px-7 py-3 border-white/40 text-white hover:bg-white/10"
            onClick={() => navigate(isAuthenticated ? ROUTES.RESOURCES : ROUTES.SIGNUP)}
          >
            {isAuthenticated ? "Explore Resources" : "Get Started"}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          {!isAuthenticated && (
            <Button
              variant="secondary"
              className="text-base px-7 py-3 border-white/40 text-white hover:bg-white/10"
              onClick={() => navigate(ROUTES.LOGIN)}
            >
              Sign In
            </Button>
          )}
        </div>
        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-6 max-w-lg mx-auto">
          {[
            { label: "Lecture Halls", value: "50+" },
            { label: "Resources", value: "200+" },
            { label: "Daily Bookings", value: "1,000+" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-bold text-white">{stat.value}</p>
              <p className="text-xs text-blue-200 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
