import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  LogOut,
  Bell,
  Search,
} from "lucide-react";
import PendingPatientsList from "@/components/doctor/PendingPatientsList";
import ActivePatientsList from "@/components/doctor/ActivePatientsList";
import { getPendingPatients, getActivePatients } from "@/lib/api";

interface DoctorData {
  id: number;
  email: string;
  full_name: string;
  phone: string;
  role: string;
}

export default function DoctorDashboard() {
  const navigate = useNavigate();
  const [doctorData, setDoctorData] = useState<DoctorData | null>(null);
  const [pendingCount, setPendingCount] = useState<number | null>(null);
  const [activeCount, setActiveCount] = useState<number | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }

    const data = localStorage.getItem("doctorData");
    if (data) {
      setDoctorData(JSON.parse(data));
    }

    // Fetch counts for stats
    getPendingPatients()
      .then((patients) => setPendingCount(patients.length))
      .catch(() => setPendingCount(null));

    getActivePatients()
      .then((patients) => setActiveCount(patients.length))
      .catch(() => setActiveCount(null));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorRefreshToken");
    localStorage.removeItem("doctorLoggedIn");
    localStorage.removeItem("doctorEmail");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorData");
    navigate("/doctor/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">A</span>
              </div>
              <span className="text-lg font-semibold text-gray-900">AutiSahara</span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-sm mx-6">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm bg-gray-100 border-0 rounded-lg focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              <button className="relative p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>

              <div className="flex items-center gap-2">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {doctorData?.full_name || "Doctor"}
                  </p>
                </div>
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                  {doctorData?.full_name?.charAt(0) || "D"}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {/* Welcome */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">
            Welcome, Dr. {doctorData?.full_name?.split(" ")[0] || "Doctor"}
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Here's your patient overview
          </p>
        </div>

        {/* Quick Stats - Only show if we have real data */}
        {(pendingCount !== null || activeCount !== null) && (
          <div className="flex gap-4 mb-6">
            {pendingCount !== null && (
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{pendingCount}</p>
                  <p className="text-sm text-gray-500">Pending</p>
                </div>
              </div>
            )}
            {activeCount !== null && (
              <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-semibold text-gray-900">{activeCount}</p>
                  <p className="text-sm text-gray-500">Active</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Patient Lists - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Reviews */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <h2 className="font-semibold text-gray-900">Pending Reviews</h2>
            </div>
            <div className="px-3 py-2 max-h-[500px] overflow-y-auto">
              <PendingPatientsList />
            </div>
          </div>

          {/* My Patients */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <h2 className="font-semibold text-gray-900">My Patients</h2>
            </div>
            <div className="px-3 py-2 max-h-[500px] overflow-y-auto">
              <ActivePatientsList />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
