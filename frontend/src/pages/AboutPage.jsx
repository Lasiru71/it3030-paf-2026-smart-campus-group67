// AboutPage — placeholder page
import MainLayout from "../components/layout/MainLayout";
import { Info } from "lucide-react";

const AboutPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="h-20 w-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Info className="h-10 w-10 text-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">About CampusReserve</h1>
      <p className="text-slate-500 text-lg max-w-xl mx-auto">
        CampusReserve is a university-grade facility booking platform designed to help students and staff easily manage and reserve campus resources. Built with modern web technologies for speed, security, and ease of use.
      </p>
    </div>
  </MainLayout>
);

export default AboutPage;
