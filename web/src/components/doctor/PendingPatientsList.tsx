import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Users,
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Clock,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { getPendingPatients, type PendingPatient } from "@/lib/api";

interface Props {
  onPatientClick?: (childId: number) => void;
}

export default function PendingPatientsList({ onPatientClick }: Props) {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<PendingPatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getPendingPatients();
      // Sort by risk level (high first) then by date
      const sorted = data.sort((a, b) => {
        const riskOrder: Record<string, number> = { high: 0, medium: 1, low: 2 };
        const aRisk = a.mchat_risk || "low";
        const bRisk = b.mchat_risk || "low";
        if (riskOrder[aRisk] !== riskOrder[bRisk]) {
          return riskOrder[aRisk] - riskOrder[bRisk];
        }
        return new Date(b.submitted_at).getTime() - new Date(a.submitted_at).getTime();
      });
      setPatients(sorted);
    } catch (err) {
      setError("Failed to load pending patients");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handlePatientClick = (childId: number) => {
    if (onPatientClick) {
      onPatientClick(childId);
    } else {
      navigate(`/doctor/patient/${childId}`);
    }
  };

  const getRiskBadge = (riskLevel?: "low" | "medium" | "high" | null) => {
    switch (riskLevel) {
      case "high":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
            <AlertTriangle className="w-3 h-3" />
            High Risk
          </span>
        );
      case "medium":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
            <AlertCircle className="w-3 h-3" />
            Medium Risk
          </span>
        );
      case "low":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3" />
            Low Risk
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600">
            <Clock className="w-3 h-3" />
            No M-CHAT
          </span>
        );
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
          <span className="ml-2 text-gray-600">Loading pending patients...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-3" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={fetchPatients}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Pending Reviews</h2>
              <p className="text-sm text-gray-500">{patients.length} patients waiting</p>
            </div>
          </div>
          <button
            onClick={fetchPatients}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition"
            title="Refresh"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {patients.length === 0 ? (
        <div className="p-8 text-center">
          <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <p className="text-gray-600 font-medium">All caught up!</p>
          <p className="text-sm text-gray-400 mt-1">No pending patients to review</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-100">
          {patients.map((patient) => (
            <div
              key={patient.assessment_id}
              onClick={() => handlePatientClick(patient.child_id)}
              className={`p-4 hover:bg-gray-50 cursor-pointer transition ${
                patient.mchat_risk === "high" ? "bg-red-50/30" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Avatar */}
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-medium ${
                    patient.mchat_risk === "high"
                      ? "bg-gradient-to-br from-red-500 to-red-600"
                      : patient.mchat_risk === "medium"
                      ? "bg-gradient-to-br from-amber-500 to-orange-500"
                      : "bg-gradient-to-br from-green-500 to-emerald-500"
                  }`}
                >
                  {patient.child_name.charAt(0)}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900 truncate">
                      {patient.child_name}
                    </p>
                    {patient.mchat_risk === "high" && (
                      <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>Age: {patient.age}</span>
                    <span className="text-gray-300">|</span>
                    <span>Parent: {patient.parent_name}</span>
                    {patient.mchat_score !== null && (
                      <>
                        <span className="text-gray-300">|</span>
                        <span>Score: {patient.mchat_score}/20</span>
                      </>
                    )}
                  </div>
                </div>

                {/* Risk Badge & Time */}
                <div className="flex flex-col items-end gap-2">
                  {getRiskBadge(patient.mchat_risk)}
                  <span className="text-xs text-gray-400">
                    {formatDate(patient.submitted_at)}
                  </span>
                </div>

                {/* Arrow */}
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
