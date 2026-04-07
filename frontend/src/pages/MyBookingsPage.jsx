// MyBookingsPage — placeholder page
import MainLayout from "../components/layout/MainLayout";
import { CalendarDays } from "lucide-react";

const MyBookingsPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="h-20 w-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <CalendarDays className="h-10 w-10 text-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">My Bookings</h1>
      <p className="text-slate-500 text-lg max-w-lg mx-auto">
        Your booking history and upcoming reservations will appear here once you start booking resources.
      </p>
    </div>
  </MainLayout>
);

export default MyBookingsPage;
