import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Loader2 } from "lucide-react";
import { getPendingPatients, type PendingPatient } from "@/lib/api.ts";

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
      const sorted = data.sort((a, b) => {
        const riskOrder: Record<string, number> = {
          high: 0,
          medium: 1,
          low: 2,
        };
        const aRisk = a.mchat_risk || "low";
        const bRisk = b.mchat_risk || "low";
        if (riskOrder[aRisk] !== riskOrder[bRisk]) {
          return riskOrder[aRisk] - riskOrder[bRisk];
        }
        return (
          new Date(b.submitted_at).getTime() -
          new Date(a.submitted_at).getTime()
        );
      });
      setPatients(sorted);
    } catch (err) {
      setError("Failed to load");
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

  const getRiskColor = (risk?: "low" | "medium" | "high" | null) => {
    switch (risk) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-amber-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8 text-gray-500">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">{error}</p>
        <button
          onClick={fetchPatients}
          className="text-orange-600 text-sm mt-2 hover:underline"
        >
          Retry
        </button>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">No pending reviews</div>
    );
  }

  return (
    <div className="divide-y divide-gray-100">
      {patients.map((patient) => (
        <div
          key={patient.assessment_id}
          onClick={() => handlePatientClick(patient.child_id)}
          className="flex items-center gap-4 py-4 px-2 hover:bg-gray-50 cursor-pointer rounded-lg transition"
        >
          {/* Risk indicator dot */}
          <div
            className={`w-3 h-3 rounded-full ${getRiskColor(
              patient.mchat_risk
            )}`}
          />

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold text-base">
            {patient.child_name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-base truncate">
              {patient.child_name}
              {patient.mchat_risk === "high" && (
                <AlertTriangle className="w-4 h-4 text-red-500 inline ml-2" />
              )}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Age {patient.age} · {patient.parent_name}
            </p>
          </div>

          {/* Risk label */}
          <span
            className={`text-sm font-medium px-2.5 py-1 rounded-lg ${
              patient.mchat_risk === "high"
                ? "bg-red-100 text-red-700"
                : patient.mchat_risk === "medium"
                ? "bg-amber-100 text-amber-700"
                : patient.mchat_risk === "low"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {patient.mchat_risk
              ? `${patient.mchat_risk
                  .charAt(0)
                  .toUpperCase()}${patient.mchat_risk.slice(1)}`
              : "N/A"}
          </span>
        </div>
      ))}
    </div>
  );
}
