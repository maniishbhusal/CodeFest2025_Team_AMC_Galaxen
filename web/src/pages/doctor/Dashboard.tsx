import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  ClipboardList,
  LogOut,
  Bell,
  Search,
  Calendar,
  Clock,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Stethoscope,
} from "lucide-react";
import PendingPatientsList from "@/components/doctor/PendingPatientsList";
import ActivePatientsList from "@/components/doctor/ActivePatientsList";
import {
  getPendingPatients,
  getActivePatients,
  type ActivePatient,
} from "@/lib/api";

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
  const [patientsNeedingReview, setPatientsNeedingReview] = useState<
    ActivePatient[]
  >([]);
  const [patientsWithoutPlan, setPatientsWithoutPlan] = useState<
    ActivePatient[]
  >([]);

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
      .then((patients) => {
        setActiveCount(patients.length);
        // Find patients at review checkpoints (day 15, 30, 45)
        const needReview = patients.filter(
          (p) =>
            p.has_curriculum &&
            p.curriculum_day &&
            (p.curriculum_day === 15 ||
              p.curriculum_day === 30 ||
              p.curriculum_day === 45)
        );
        setPatientsNeedingReview(needReview);
        // Find patients without curriculum
        const noPlan = patients.filter((p) => !p.has_curriculum);
        setPatientsWithoutPlan(noPlan);
      })
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

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform hover:scale-110 transition-transform duration-300">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
                AutiSahara
              </span>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md mx-8">
              <div className="relative w-full group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search patients..."
                  className="w-full pl-10 pr-4 py-2.5 bg-orange-50/50 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-orange-500 transition-all"
                />
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-4">
              <button className="relative p-2 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-xl transition-all transform hover:scale-110">
                <Bell className="w-5 h-5" />
                {(patientsNeedingReview.length > 0 ||
                  patientsWithoutPlan.length > 0) && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></span>
                )}
              </button>

              <div className="h-8 w-px bg-orange-200"></div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-semibold text-gray-900">
                    {doctorData?.full_name || "Doctor"}
                  </p>
                  <p className="text-xs text-orange-600">{doctorData?.email}</p>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-semibold shadow-lg shadow-orange-500/30 transform hover:scale-110 transition-transform">
                  {doctorData?.full_name?.charAt(0) || "D"}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all transform hover:scale-110"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Banner */}
        <div className=" bg-orange-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-xl shadow-orange-500/30">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
          <div className="relative">
            <div className="flex items-center gap-2 text-orange-100 text-sm mb-2">
              <Calendar className="w-4 h-4" />
              {today}
            </div>
            <h1 className="text-2xl font-bold mb-1">
              {getGreeting()}, Dr.{" "}
              {doctorData?.full_name?.split(" ")[0] || "Doctor"}!
            </h1>
            <p className="text-orange-50">
              {pendingCount === 0 && activeCount === 0
                ? "Your dashboard is ready. Start by accepting patients."
                : `You have ${pendingCount || 0} pending reviews and ${
                    activeCount || 0
                  } active patients.`}
            </p>
          </div>
        </div>

        {/* Alerts Section */}
        {(patientsNeedingReview.length > 0 ||
          patientsWithoutPlan.length > 0) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {patientsNeedingReview.length > 0 && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3 hover:shadow-lg hover:border-amber-300 transition-all">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900">
                    Review Checkpoint
                  </h3>
                  <p className="text-sm text-amber-700 mt-0.5">
                    {patientsNeedingReview.length} patient
                    {patientsNeedingReview.length > 1 ? "s" : ""} at Day
                    15/30/45 checkpoint
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/doctor/patient/${patientsNeedingReview[0].child_id}/progress`
                      )
                    }
                    className="text-sm text-amber-700 font-medium mt-2 flex items-center gap-1 hover:text-amber-800 hover:gap-2 transition-all"
                  >
                    Review now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {patientsWithoutPlan.length > 0 && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-xl p-4 flex items-start gap-3 hover:shadow-lg hover:border-orange-300 transition-all">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-orange-900">
                    Curriculum Needed
                  </h3>
                  <p className="text-sm text-orange-700 mt-0.5">
                    {patientsWithoutPlan.length} patient
                    {patientsWithoutPlan.length > 1 ? "s" : ""} waiting for
                    curriculum assignment
                  </p>
                  <button
                    onClick={() =>
                      navigate(
                        `/doctor/patient/${patientsWithoutPlan[0].child_id}/assign`
                      )
                    }
                    className="text-sm text-orange-700 font-medium mt-2 flex items-center gap-1 hover:text-orange-800 hover:gap-2 transition-all"
                  >
                    Assign now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-amber-100 rounded-xl">
                <ClipboardList className="w-5 h-5 text-amber-600" />
              </div>
              {pendingCount !== null && pendingCount > 0 && (
                <span className="text-xs font-medium text-amber-600 bg-amber-100 px-2 py-0.5 rounded-full animate-pulse">
                  Action needed
                </span>
              )}
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              {pendingCount ?? "-"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Pending Reviews</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-orange-100 rounded-xl">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <p className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent">
              {activeCount ?? "-"}
            </p>
            <p className="text-sm text-gray-500 mt-1">Active Patients</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-green-100 rounded-xl">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {activeCount !== null
                ? activeCount - patientsWithoutPlan.length
                : "-"}
            </p>
            <p className="text-sm text-gray-500 mt-1">On Curriculum</p>
          </div>

          <div className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all transform hover:scale-105">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-purple-100 rounded-xl">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {patientsNeedingReview.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Ready for Review</p>
          </div>
        </div>

        {/* Patient Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Reviews */}
          <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-lg hover:shadow-2xl hover:border-orange-300 transition-all">
            <div className="px-6 py-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <ClipboardList className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">
                    Pending Reviews
                  </h2>
                  <p className="text-xs text-gray-600">
                    New patient assessments
                  </p>
                </div>
              </div>
              {pendingCount !== null && pendingCount > 0 && (
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">
                  {pendingCount} waiting
                </span>
              )}
            </div>
            <div className="px-4 py-2 max-h-[420px] overflow-y-auto">
              <PendingPatientsList />
            </div>
          </div>

          {/* My Patients */}
          <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-lg hover:shadow-2xl hover:border-orange-300 transition-all">
            <div className="px-6 py-4 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Users className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h2 className="font-semibold text-gray-900">My Patients</h2>
                  <p className="text-xs text-gray-600">Accepted and active</p>
                </div>
              </div>
              {activeCount !== null && activeCount > 0 && (
                <span className="text-xs font-medium bg-orange-100 text-orange-700 px-2.5 py-1 rounded-full border border-orange-200">
                  {activeCount} total
                </span>
              )}
            </div>
            <div className="px-4 py-2 max-h-[420px] overflow-y-auto">
              <ActivePatientsList />
            </div>
          </div>
        </div>

        {/* Footer Tips */}
        <div className="mt-8 text-center text-sm text-gray-400">
          <p>Tip: Click on a patient to view their full assessment details</p>
        </div>
      </main>
    </div>
  );
}
