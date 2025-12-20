import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, BookOpen, BarChart3 } from "lucide-react";
import { getActivePatients, type ActivePatient } from "@/lib/api";

export default function ActivePatientsList() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<ActivePatient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchPatients = async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getActivePatients();
      setPatients(data);
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
    navigate(`/doctor/patient/${childId}`);
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
        <button onClick={fetchPatients} className="text-blue-600 text-sm mt-2 hover:underline">
          Retry
        </button>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No active patients yet
      </div>
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
          {/* Status indicator */}
          <div className={`w-3 h-3 rounded-full ${patient.has_curriculum ? "bg-green-500" : "bg-amber-500"}`} />

          {/* Avatar */}
          <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold text-base">
            {patient.child_name.charAt(0)}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <p className="font-medium text-gray-900 text-base truncate">
              {patient.child_name}
            </p>
            <p className="text-sm text-gray-500 mt-0.5">
              Age {patient.age} · {patient.parent_name}
            </p>
          </div>

          {/* Status badge */}
          {patient.has_curriculum ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg bg-green-100 text-green-700">
              <BarChart3 className="w-3.5 h-3.5" />
              Day {patient.curriculum_day}
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-sm font-medium px-2.5 py-1 rounded-lg bg-amber-100 text-amber-700">
              <BookOpen className="w-3.5 h-3.5" />
              Needs Plan
            </span>
          )}
        </div>
      ))}
    </div>
  );
}
