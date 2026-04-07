// HomePage — assembles the hero, categories, and features sections
import MainLayout from "../components/layout/MainLayout";
import HeroSection from "../components/home/HeroSection";
import ResourceCategories from "../components/home/ResourceCategories";
import FeaturesSection from "../components/home/FeaturesSection";

const HomePage = () => {
  return (
    <MainLayout>
      <HeroSection />
      <ResourceCategories />
      <FeaturesSection />

      {/* CTA Banner */}
      <section className="bg-blue-700 py-16 text-center text-white">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl font-bold mb-4">Ready to Make a Booking?</h2>
          <p className="text-blue-100 mb-8 text-lg">
            Join thousands of students and staff using CampusReserve every day.
          </p>
          <a
            href="/signup"
            className="inline-block bg-white text-blue-700 font-semibold px-8 py-3 rounded-lg shadow hover:bg-slate-100 transition-colors"
          >
            Create a Free Account
          </a>
        </div>
      </section>
    </MainLayout>
  );
};

export default HomePage;
