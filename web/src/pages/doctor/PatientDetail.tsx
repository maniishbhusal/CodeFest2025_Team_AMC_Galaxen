import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Phone,
  Mail,
  Calendar,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Heart,
  GraduationCap,
  Stethoscope,
  Video,
  Clock,
  FileText,
  UserCheck,
  RefreshCw,
  Play,
  BookOpen,
  BarChart3,
  ClipboardList,
} from "lucide-react";
import { getPatientDetail, acceptPatient, type PatientDetail } from "@/lib/api";

export default function PatientDetailPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [accepting, setAccepting] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }

    if (childId) {
      fetchPatientDetail(parseInt(childId));
    }
  }, [childId, navigate]);

  const fetchPatientDetail = async (id: number) => {
    setLoading(true);
    setError("");
    try {
      const data = await getPatientDetail(id);
      setPatient(data);
    } catch (err) {
      setError("Failed to load patient details");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptPatient = async () => {
    if (!childId) return;
    setAccepting(true);
    try {
      await acceptPatient(parseInt(childId));
      setShowAcceptModal(false);
      // Refresh patient data
      await fetchPatientDetail(parseInt(childId));
    } catch (err) {
      console.error(err);
      alert("Failed to accept patient");
    } finally {
      setAccepting(false);
    }
  };

  const openAcceptModal = () => {
    setShowAcceptModal(true);
  };

  const closeAcceptModal = () => {
    if (!accepting) {
      setShowAcceptModal(false);
    }
  };

  const getRiskBadge = (riskLevel?: "low" | "medium" | "high") => {
    switch (riskLevel) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-red-100 text-red-700">
            <AlertTriangle className="w-4 h-4" />
            High Risk
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-amber-100 text-amber-700">
            <AlertCircle className="w-4 h-4" />
            Medium Risk
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-4 h-4" />
            Low Risk
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="text-gray-600">Loading patient details...</span>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">{error || "Patient not found"}</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/doctor/dashboard")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Patient Details
                </h1>
                <p className="text-sm text-gray-500">
                  Assessment ID: #{patient.id}
                </p>
              </div>
            </div>

            {patient.status === "pending" && (
              <button
                onClick={openAcceptModal}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
              >
                <UserCheck className="w-4 h-4" />
                Accept Patient
              </button>
            )}

            {(patient.status === "accepted" || patient.status === "completed") && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate(`/doctor/patient/${childId}/assign`)}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  <BookOpen className="w-4 h-4" />
                  Assign Curriculum
                </button>
                <button
                  onClick={() => navigate(`/doctor/patient/${childId}/progress`)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition"
                >
                  <BarChart3 className="w-4 h-4" />
                  View Progress
                </button>
                <button
                  onClick={() => navigate(`/doctor/patient/${childId}/diagnosis`)}
                  className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
                >
                  <FileText className="w-4 h-4" />
                  Diagnosis Report
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Child Info Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
              {patient.child.full_name.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold text-gray-900">
                  {patient.child.full_name}
                </h2>
                {getRiskBadge(patient.mchat_result?.risk_level)}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>
                    Age: {patient.child.age_years}y {patient.child.age_months}m
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="w-4 h-4 text-gray-400" />
                  <span className="capitalize">{patient.child.gender}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span>DOB: {new Date(patient.child.date_of_birth).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <span>
                    Submitted: {new Date(patient.submitted_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* M-CHAT Results */}
            {patient.mchat_result && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-purple-100 rounded-xl">
                    <FileText className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    M-CHAT Screening Results
                  </h3>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-3xl font-bold text-gray-900">
                      {patient.mchat_result.total_score}
                    </p>
                    <p className="text-sm text-gray-500">Total Score (out of 20)</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="flex justify-center mb-1">
                      {getRiskBadge(patient.mchat_result.risk_level)}
                    </div>
                    <p className="text-sm text-gray-500 mt-2">Risk Level</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-lg font-medium text-gray-700">
                      {new Date(patient.mchat_result.created_at).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-500">Completed On</p>
                  </div>
                </div>

                {patient.mchat_result.risk_level === "high" && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-red-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-red-800">High Risk Detected</p>
                        <p className="text-sm text-red-600 mt-1">
                          This child has scored in the high-risk range. Immediate professional
                          evaluation is recommended.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Medical History (A1-A4) */}
            {patient.medical_history && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-red-100 rounded-xl">
                    <Stethoscope className="w-5 h-5 text-red-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Medical History Background
                  </h3>
                  {patient.medical_history.requires_specialist && (
                    <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                      Requires Specialist
                    </span>
                  )}
                </div>

                <div className="space-y-4">
                  <div className={`p-4 rounded-xl ${patient.medical_history.pregnancy_infection ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {patient.medical_history.pregnancy_infection ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="font-medium text-gray-800">
                        A1: Pregnancy Infection
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {patient.medical_history.pregnancy_infection
                        ? patient.medical_history.pregnancy_infection_desc || "Yes - Details not provided"
                        : "No serious infection during pregnancy"}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${patient.medical_history.birth_complications ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {patient.medical_history.birth_complications ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="font-medium text-gray-800">
                        A2: Birth Complications
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {patient.medical_history.birth_complications
                        ? patient.medical_history.birth_complications_desc || "Yes - Details not provided"
                        : "No complications during birth"}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${patient.medical_history.brain_injury_first_year ? "bg-red-50 border border-red-100" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {patient.medical_history.brain_injury_first_year ? (
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="font-medium text-gray-800">
                        A3: Brain Injury (First Year)
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {patient.medical_history.brain_injury_first_year
                        ? patient.medical_history.brain_injury_desc || "Yes - Details not provided"
                        : "No brain injury during first year"}
                    </p>
                  </div>

                  <div className={`p-4 rounded-xl ${patient.medical_history.family_autism_history ? "bg-amber-50 border border-amber-100" : "bg-gray-50"}`}>
                    <div className="flex items-center gap-2 mb-1">
                      {patient.medical_history.family_autism_history ? (
                        <AlertCircle className="w-4 h-4 text-amber-500" />
                      ) : (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      )}
                      <span className="font-medium text-gray-800">
                        A4: Family Autism History
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 ml-6">
                      {patient.medical_history.family_autism_history
                        ? "Yes - Family history of autism or developmental delay"
                        : "No family history of autism"}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Pre-Assessment Task Results - Hardcoded for Hackathon */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-100 rounded-xl">
                  <ClipboardList className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  15-Day Pre-Assessment Results
                </h3>
                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                  Completed
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Day</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Task</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Category</th>
                      <th className="text-center py-3 px-4 font-medium text-gray-600">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-600">Observation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {/* Day 1 Tasks */}
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">1</td>
                      <td className="py-3 px-4 text-gray-700">Morning Face Time</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">Social Engagement</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Child made eye contact for 2 seconds, smiled back</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">1</td>
                      <td className="py-3 px-4 text-gray-700">Point to Treat</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Joint Attention</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"><AlertCircle className="w-3 h-3" />With Help</span></td>
                      <td className="py-3 px-4 text-gray-600">Needed physical prompt to follow point</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">1</td>
                      <td className="py-3 px-4 text-gray-700">Choice Making</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Communication</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Reached for preferred toy independently</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">1</td>
                      <td className="py-3 px-4 text-gray-700">Car Fun</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Play Skills</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"><AlertTriangle className="w-3 h-3" />Not Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Only spun wheels, no functional play</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">1</td>
                      <td className="py-3 px-4 text-gray-700">In/Out Game</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">Cognitive</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"><AlertCircle className="w-3 h-3" />With Help</span></td>
                      <td className="py-3 px-4 text-gray-600">Imitated action after demonstration</td>
                    </tr>
                    {/* Day 2 Tasks */}
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="py-3 px-4 font-medium text-gray-900">2</td>
                      <td className="py-3 px-4 text-gray-700">Mirror Play</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">Social Engagement</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Smiled at reflection, touched mirror</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="py-3 px-4 font-medium text-gray-900">2</td>
                      <td className="py-3 px-4 text-gray-700">Surprise Bag</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Joint Attention</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Watched bag intently, reached for item</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="py-3 px-4 font-medium text-gray-900">2</td>
                      <td className="py-3 px-4 text-gray-700">Animal Sounds</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Communication</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"><AlertCircle className="w-3 h-3" />With Help</span></td>
                      <td className="py-3 px-4 text-gray-600">Made sound attempt after 3 demonstrations</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="py-3 px-4 font-medium text-gray-900">2</td>
                      <td className="py-3 px-4 text-gray-700">Block Stacking</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Play Skills</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Stacked 2 blocks, knocked down with joy</td>
                    </tr>
                    <tr className="hover:bg-gray-50 bg-gray-25">
                      <td className="py-3 px-4 font-medium text-gray-900">2</td>
                      <td className="py-3 px-4 text-gray-700">Big & Small</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">Cognitive</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"><AlertTriangle className="w-3 h-3" />Not Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Did not differentiate between sizes</td>
                    </tr>
                    {/* Day 3 Tasks */}
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">3</td>
                      <td className="py-3 px-4 text-gray-700">Tickle Countdown</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded-full">Social Engagement</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Showed anticipation, laughed during tickle</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">3</td>
                      <td className="py-3 px-4 text-gray-700">Window Watching</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Joint Attention</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"><AlertCircle className="w-3 h-3" />With Help</span></td>
                      <td className="py-3 px-4 text-gray-600">Looked where pointed after verbal cue</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">3</td>
                      <td className="py-3 px-4 text-gray-700">Gesture for 'More'</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">Communication</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full"><AlertTriangle className="w-3 h-3" />Not Done</span></td>
                      <td className="py-3 px-4 text-gray-600">No gesture imitation observed</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">3</td>
                      <td className="py-3 px-4 text-gray-700">Simple Puzzle</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full">Play Skills</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-full"><AlertCircle className="w-3 h-3" />With Help</span></td>
                      <td className="py-3 px-4 text-gray-600">Needed hand-over-hand guidance</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">3</td>
                      <td className="py-3 px-4 text-gray-700">Follow Simple Command</td>
                      <td className="py-3 px-4"><span className="px-2 py-1 bg-teal-100 text-teal-700 text-xs rounded-full">Cognitive</span></td>
                      <td className="py-3 px-4 text-center"><span className="inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full"><CheckCircle className="w-3 h-3" />Done</span></td>
                      <td className="py-3 px-4 text-gray-600">Followed "come here" with gesture</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Stats */}
              <div className="mt-6 pt-4 border-t border-gray-100">
                <div className="grid grid-cols-4 gap-4 text-center">
                  <div className="bg-green-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-green-700">6</p>
                    <p className="text-xs text-green-600">Done Independently</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-amber-700">5</p>
                    <p className="text-xs text-amber-600">Done with Help</p>
                  </div>
                  <div className="bg-red-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-red-700">4</p>
                    <p className="text-xs text-red-600">Not Done</p>
                  </div>
                  <div className="bg-blue-50 rounded-xl p-3">
                    <p className="text-2xl font-bold text-blue-700">73%</p>
                    <p className="text-xs text-blue-600">Completion Rate</p>
                  </div>
                </div>
              </div>

              {/* Observations Summary */}
              <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Key Observations</p>
                    <ul className="text-sm text-amber-700 mt-2 space-y-1">
                      <li>• <strong>Joint Attention:</strong> Requires physical/verbal prompts to follow points</li>
                      <li>• <strong>Play Skills:</strong> Limited functional play, prefers repetitive actions (spinning wheels)</li>
                      <li>• <strong>Communication:</strong> Gesture imitation is weak, needs more practice</li>
                      <li>• <strong>Social:</strong> Good eye contact and social smiling observed</li>
                      <li>• <strong>Cognitive:</strong> Following simple commands but size concepts unclear</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Assessment Videos */}
            {patient.videos && patient.videos.length > 0 && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-xl">
                    <Video className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Assessment Videos ({patient.videos.length})
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patient.videos.map((video) => (
                    <div
                      key={video.id}
                      className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                          <Play className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 capitalize">
                            {video.video_type} Video
                          </p>
                          {video.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {video.description}
                            </p>
                          )}
                          <p className="text-xs text-gray-400 mt-2">
                            {new Date(video.uploaded_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      {video.video_url && (
                        <button
                          onClick={() => setPlayingVideo(video.video_url)}
                          className="mt-3 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700"
                        >
                          <Play className="w-4 h-4" />
                          Watch Video
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Parent Info */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-xl">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Parent/Guardian
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Full Name</p>
                  <p className="font-medium text-gray-900">
                    {patient.parent.full_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <a
                    href={`mailto:${patient.parent.email}`}
                    className="text-blue-600 hover:underline"
                  >
                    {patient.parent.email}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <a
                    href={`tel:${patient.parent.phone}`}
                    className="text-blue-600 hover:underline"
                  >
                    {patient.parent.phone}
                  </a>
                </div>
              </div>
            </div>

            {/* Education Info */}
            {patient.education && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-amber-100 rounded-xl">
                    <GraduationCap className="w-5 h-5 text-amber-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Education</h3>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">School Status</p>
                    <p className="font-medium text-gray-900">
                      {patient.education.is_in_school ? "Currently in School" : "Not in School"}
                    </p>
                  </div>
                  {patient.education.school_name && (
                    <div>
                      <p className="text-sm text-gray-500">School Name</p>
                      <p className="font-medium text-gray-900">
                        {patient.education.school_name}
                      </p>
                    </div>
                  )}
                  {patient.education.grade_class && (
                    <div>
                      <p className="text-sm text-gray-500">Grade/Class</p>
                      <p className="font-medium text-gray-900">
                        {patient.education.grade_class}
                      </p>
                    </div>
                  )}
                  {patient.education.school_type && (
                    <div>
                      <p className="text-sm text-gray-500">School Type</p>
                      <p className="font-medium text-gray-900 capitalize">
                        {patient.education.school_type.replace("_", " ")}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Health Info */}
            {patient.health && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-pink-100 rounded-xl">
                    <Heart className="w-5 h-5 text-pink-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Health</h3>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    {patient.health.height && (
                      <div>
                        <p className="text-sm text-gray-500">Height</p>
                        <p className="font-medium text-gray-900">
                          {patient.health.height}
                        </p>
                      </div>
                    )}
                    {patient.health.weight && (
                      <div>
                        <p className="text-sm text-gray-500">Weight</p>
                        <p className="font-medium text-gray-900">
                          {patient.health.weight}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Vaccinations</p>
                    <p className="font-medium text-gray-900 capitalize">
                      {patient.health.has_vaccinations.replace("_", " ")}
                    </p>
                  </div>
                  {patient.health.medical_conditions && (
                    <div>
                      <p className="text-sm text-gray-500">Medical Conditions</p>
                      <p className="font-medium text-gray-900">
                        {patient.health.medical_conditions}
                      </p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-500">Taking Medication</p>
                    <p className="font-medium text-gray-900">
                      {patient.health.taking_medication ? "Yes" : "No"}
                    </p>
                  </div>
                  {patient.health.medication_list && (
                    <div>
                      <p className="text-sm text-gray-500">Medications</p>
                      <p className="font-medium text-gray-900">
                        {patient.health.medication_list}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Accept Patient Confirmation Modal */}
      {showAcceptModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full mx-4 overflow-hidden">
            <div className="p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <UserCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Accept Patient
                  </h3>
                  <p className="text-sm text-gray-500">
                    Confirm your decision
                  </p>
                </div>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to accept <strong>{patient.child.full_name}</strong> as your patient?
                You will be responsible for their assessment review and therapy curriculum assignment.
              </p>

              {patient.mchat_result?.risk_level === "high" && (
                <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700 text-sm">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">High Risk Patient</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">
                    This patient has a high M-CHAT risk score. Priority attention is recommended.
                  </p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={closeAcceptModal}
                  disabled={accepting}
                  className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcceptPatient}
                  disabled={accepting}
                  className="flex-1 px-4 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {accepting ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Accepting...
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-4 h-4" />
                      Accept Patient
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Video Player Modal */}
      {playingVideo && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
          onClick={() => setPlayingVideo(null)}
        >
          <div
            className="bg-black rounded-2xl overflow-hidden max-w-4xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 bg-gray-900">
              <h3 className="text-white font-medium">Video Player</h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <span className="text-2xl">&times;</span>
              </button>
            </div>
            <div className="aspect-video bg-black">
              <video
                src={playingVideo}
                controls
                autoPlay
                className="w-full h-full"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
