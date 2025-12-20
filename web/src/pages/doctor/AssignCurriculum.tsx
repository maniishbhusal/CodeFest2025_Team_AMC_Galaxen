import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Check,
  Clock,
  RefreshCw,
  User,
  AlertCircle,
} from "lucide-react";
import {
  getCurricula,
  getPatientDetail,
  assignCurriculum,
  type Curriculum,
  type PatientDetail,
} from "@/lib/api";

export default function AssignCurriculumPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [curricula, setCurricula] = useState<Curriculum[]>([]);
  const [selectedCurriculum, setSelectedCurriculum] = useState<number | null>(null);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  });
  const [loading, setLoading] = useState(true);
  const [assigning, setAssigning] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }

    if (childId) {
      fetchData(parseInt(childId));
    }
  }, [childId, navigate]);

  const fetchData = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const [patientData, curriculaData] = await Promise.all([
        getPatientDetail(id),
        getCurricula(),
      ]);
      setPatient(patientData);
      // Filter out 'general' type curricula - only show assessment and specialized
      setCurricula(curriculaData.filter((c: Curriculum) => c.type !== 'general'));
    } catch (err) {
      console.error(err);
      setError("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async () => {
    if (!childId || !selectedCurriculum || !startDate) return;

    setAssigning(true);
    setError("");
    try {
      await assignCurriculum(parseInt(childId), selectedCurriculum, startDate);
      navigate(`/doctor/patient/${childId}/progress`);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to assign curriculum");
    } finally {
      setAssigning(false);
    }
  };

  const getSelectedCurriculum = () => {
    return curricula.find((c) => c.id === selectedCurriculum);
  };

  const calculateEndDate = () => {
    const curriculum = getSelectedCurriculum();
    if (!curriculum || !startDate) return null;
    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + curriculum.duration_days - 1);
    return end.toISOString().split("T")[0];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">Patient not found</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="mt-4 text-blue-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 h-16">
            <button
              onClick={() => navigate(`/doctor/patient/${childId}`)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Assign Curriculum
              </h1>
              <p className="text-sm text-gray-500">
                For {patient.child.full_name}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-lg">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Patient Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xl font-medium">
              {patient.child.full_name.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {patient.child.full_name}
              </h2>
              <p className="text-gray-500">
                {patient.child.age_years}y {patient.child.age_months}m •{" "}
                {patient.child.gender}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                <User className="w-3 h-3 inline mr-1" />
                Parent: {patient.parent.full_name}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Curriculum Selection */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Select Curriculum
            </h3>

            {curricula.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
                <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No curricula available</p>
                <p className="text-sm text-gray-400 mt-1">
                  Create curricula in the admin panel first
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {curricula.map((curriculum) => (
                  <div
                    key={curriculum.id}
                    onClick={() => setSelectedCurriculum(curriculum.id)}
                    className={`bg-white rounded-xl border-2 p-4 cursor-pointer transition ${
                      selectedCurriculum === curriculum.id
                        ? "border-blue-500 bg-blue-50/50"
                        : "border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                          selectedCurriculum === curriculum.id
                            ? "bg-blue-500 text-white"
                            : "bg-gray-100 text-gray-500"
                        }`}
                      >
                        {selectedCurriculum === curriculum.id ? (
                          <Check className="w-5 h-5" />
                        ) : (
                          <BookOpen className="w-5 h-5" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-gray-900">
                            {curriculum.title}
                          </h4>
                          <span
                            className={`px-2 py-0.5 text-xs rounded-full ${
                              curriculum.type === "general"
                                ? "bg-green-100 text-green-700"
                                : "bg-purple-100 text-purple-700"
                            }`}
                          >
                            {curriculum.type}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                          {curriculum.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {curriculum.duration_days} days
                          </span>
                          {curriculum.spectrum_type && (
                            <span>Spectrum: {curriculum.spectrum_type}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Assignment Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Assignment Details
            </h3>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {selectedCurriculum && (
                <>
                  <div className="pt-4 border-t border-gray-100">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Summary
                    </h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Curriculum</span>
                        <span className="font-medium text-gray-900">
                          {getSelectedCurriculum()?.title}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Duration</span>
                        <span className="font-medium text-gray-900">
                          {getSelectedCurriculum()?.duration_days} days
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Start Date</span>
                        <span className="font-medium text-gray-900">
                          {new Date(startDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">End Date</span>
                        <span className="font-medium text-gray-900">
                          {calculateEndDate() &&
                            new Date(calculateEndDate()!).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleAssign}
                    disabled={assigning}
                    className="w-full py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {assigning ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      <>
                        <Check className="w-4 h-4" />
                        Assign Curriculum
                      </>
                    )}
                  </button>
                </>
              )}

              {!selectedCurriculum && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400">
                    Select a curriculum to continue
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
