// ContactPage — placeholder page
import MainLayout from "../components/layout/MainLayout";
import { Mail } from "lucide-react";

const ContactPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="h-20 w-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Mail className="h-10 w-10 text-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Contact Us</h1>
      <p className="text-slate-500 text-lg max-w-lg mx-auto mb-8">
        Have a question or need help with your booking? Reach out to the CampusReserve support team.
      </p>
      <div className="flex flex-col items-center gap-2 text-slate-600 text-sm">
        <p>📧 support@campusreserve.edu</p>
        <p>📞 +94 11 234 5678</p>
        <p>🕐 Mon–Fri, 8am–5pm</p>
      </div>
    </div>
  </MainLayout>
);

export default ContactPage;
