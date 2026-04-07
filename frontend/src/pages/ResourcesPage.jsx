// ResourcesPage — placeholder page
import MainLayout from "../components/layout/MainLayout";
import { Search } from "lucide-react";

const ResourcesPage = () => (
  <MainLayout>
    <div className="max-w-7xl mx-auto px-4 py-20 text-center">
      <div className="h-20 w-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
        <Search className="h-10 w-10 text-blue-700" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-4">Browse Resources</h1>
      <p className="text-slate-500 text-lg max-w-lg mx-auto">
        The full resource catalogue is coming soon. You'll be able to filter, search, and book all campus resources here.
      </p>
    </div>
  </MainLayout>
);

export default ResourcesPage;
