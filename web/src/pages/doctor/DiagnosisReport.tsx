import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileText,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Share2,
  Eye,
  EyeOff,
  ClipboardCheck,
  Send,
} from "lucide-react";
import {
  getPatientDetail,
  createDiagnosisReport,
  getDiagnosisReports,
  toggleReportSharing,
  type PatientDetail,
  type DiagnosisReport as DiagnosisReportType,
} from "@/lib/api";

export default function DiagnosisReport() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();

  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [existingReports, setExistingReports] = useState<DiagnosisReportType[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [hasAutism, setHasAutism] = useState<boolean | null>(null);
  const [spectrumType, setSpectrumType] = useState<
    "none" | "mild" | "moderate" | "severe"
  >("none");
  const [detailedReport, setDetailedReport] = useState("");
  const [nextSteps, setNextSteps] = useState("");
  const [shareWithParent, setShareWithParent] = useState(true);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }

    if (childId) {
      fetchData();
    }
  }, [childId, navigate]);

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const [patientData, reportsData] = await Promise.all([
        getPatientDetail(Number(childId)),
        getDiagnosisReports(Number(childId)).catch(() => []),
      ]);
      setPatient(patientData);
      // Ensure reports is always an array
      setExistingReports(Array.isArray(reportsData) ? reportsData : []);
    } catch (err) {
      setError("Failed to load patient data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasAutism === null) {
      setError("Please select whether the child has autism");
      return;
    }

    if (!detailedReport.trim()) {
      setError("Please provide a detailed report");
      return;
    }

    if (!nextSteps.trim()) {
      setError("Please provide next steps");
      return;
    }

    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      await createDiagnosisReport(Number(childId), {
        has_autism: hasAutism,
        spectrum_type: hasAutism ? spectrumType : "none",
        detailed_report: detailedReport,
        next_steps: nextSteps,
        shared_with_parent: shareWithParent,
      });

      setSuccess("Diagnosis report created successfully!");

      // Reset form
      setHasAutism(null);
      setSpectrumType("none");
      setDetailedReport("");
      setNextSteps("");
      setShareWithParent(true);

      // Refresh reports
      const reports = await getDiagnosisReports(Number(childId));
      setExistingReports(Array.isArray(reports) ? reports : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create report");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleShare = async (reportId: number) => {
    try {
      await toggleReportSharing(reportId);
      const reports = await getDiagnosisReports(Number(childId));
      setExistingReports(Array.isArray(reports) ? reports : []);
    } catch (err) {
      setError("Failed to update sharing status");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Patient not found</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="mt-4 text-orange-600 hover:underline"
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/doctor/patient/${childId}`)}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Diagnosis Report
                </h1>
                <p className="text-sm text-gray-500">
                  {patient.child.full_name}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">
                {existingReports.length} Report
                {existingReports.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create New Report Form */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-xl">
                <ClipboardCheck className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Create Diagnosis Report
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Has Autism */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Does the child have Autism Spectrum Disorder? *
                </label>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setHasAutism(true)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-medium ${
                      hasAutism === true
                        ? "border-red-500 bg-red-50 text-red-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    Yes
                  </button>
                  <button
                    type="button"
                    onClick={() => setHasAutism(false)}
                    className={`flex-1 py-3 px-4 rounded-xl border-2 transition font-medium ${
                      hasAutism === false
                        ? "border-green-500 bg-green-50 text-green-700"
                        : "border-gray-200 hover:border-gray-300 text-gray-700"
                    }`}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Spectrum Type (only if has autism) */}
              {hasAutism && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Spectrum Type *
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    {(["mild", "moderate", "severe"] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setSpectrumType(type)}
                        className={`py-3 px-4 rounded-xl border-2 transition font-medium capitalize ${
                          spectrumType === type
                            ? type === "mild"
                              ? "border-yellow-500 bg-yellow-50 text-yellow-700"
                              : type === "moderate"
                              ? "border-orange-500 bg-orange-50 text-orange-700"
                              : "border-red-500 bg-red-50 text-red-700"
                            : "border-gray-200 hover:border-gray-300 text-gray-700"
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Detailed Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Detailed Report *
                </label>
                <textarea
                  value={detailedReport}
                  onChange={(e) => setDetailedReport(e.target.value)}
                  placeholder="Provide a comprehensive assessment based on M-CHAT results, behavioral observations, and clinical evaluation..."
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Next Steps */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Next Steps / Recommendations *
                </label>
                <textarea
                  value={nextSteps}
                  onChange={(e) => setNextSteps(e.target.value)}
                  placeholder="1. Enroll in speech therapy&#10;2. Start 15-day introductory curriculum&#10;3. Schedule follow-up in 2 weeks..."
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Share with Parent */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShareWithParent(!shareWithParent)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                    shareWithParent ? "bg-purple-600" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                      shareWithParent ? "translate-x-6" : "translate-x-1"
                    }`}
                  />
                </button>
                <label className="text-sm text-gray-700">
                  Share this report with parent immediately
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Report...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Create Diagnosis Report
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Existing Reports */}
          <div className="bg-white rounded-2xl border border-gray-200 p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-orange-100 rounded-xl">
                <FileText className="w-5 h-5 text-orange-600" />
              </div>
              <h2 className="text-lg font-semibold text-gray-900">
                Previous Reports
              </h2>
            </div>

            {existingReports.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <FileText className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No diagnosis reports yet</p>
                <p className="text-sm mt-1">
                  Create the first report using the form
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {existingReports.map((report) => (
                  <div
                    key={report.id}
                    className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition"
                  >
                    {/* Report Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                              report.has_autism
                                ? report.spectrum_type === "mild"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : report.spectrum_type === "moderate"
                                  ? "bg-orange-100 text-orange-700"
                                  : "bg-red-100 text-red-700"
                                : "bg-green-100 text-green-700"
                            }`}
                          >
                            {report.has_autism
                              ? `ASD - ${report.spectrum_type
                                  ?.charAt(0)
                                  .toUpperCase()}${report.spectrum_type?.slice(
                                  1
                                )}`
                              : "No ASD"}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(report.created_at).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                          {" by "}
                          {report.doctor_name}
                        </p>
                      </div>
                      <button
                        onClick={() => handleToggleShare(report.id)}
                        className={`p-2 rounded-lg transition ${
                          report.shared_with_parent
                            ? "bg-green-100 text-green-600 hover:bg-green-200"
                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                        }`}
                        title={
                          report.shared_with_parent
                            ? "Shared with parent"
                            : "Not shared"
                        }
                      >
                        {report.shared_with_parent ? (
                          <Eye className="w-4 h-4" />
                        ) : (
                          <EyeOff className="w-4 h-4" />
                        )}
                      </button>
                    </div>

                    {/* Report Content */}
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Report
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {report.detailed_report}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                          Next Steps
                        </p>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {report.next_steps}
                        </p>
                      </div>
                    </div>

                    {/* Sharing Status */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-2">
                      <Share2 className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-500">
                        {report.shared_with_parent
                          ? "Visible to parent"
                          : "Hidden from parent"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Reference */}
        <div className="mt-6 bg-gradient-to-r from-orange-50 to-amber-50 rounded-2xl border border-orange-100 p-6">
          <h3 className="font-semibold text-gray-900 mb-3">
            Patient Quick Reference
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-gray-500">M-CHAT Score</p>
              <p className="font-medium text-gray-900">
                {patient.mchat_result?.total_score ?? "N/A"}/20
              </p>
            </div>
            <div>
              <p className="text-gray-500">Risk Level</p>
              <p
                className={`font-medium ${
                  patient.mchat_result?.risk_level === "high"
                    ? "text-red-600"
                    : patient.mchat_result?.risk_level === "medium"
                    ? "text-amber-600"
                    : "text-green-600"
                }`}
              >
                {patient.mchat_result?.risk_level?.charAt(0).toUpperCase()}
                {patient.mchat_result?.risk_level?.slice(1) ?? "N/A"}
              </p>
            </div>
            <div>
              <p className="text-gray-500">Age</p>
              <p className="font-medium text-gray-900">
                {patient.child.age_years}y {patient.child.age_months}m
              </p>
            </div>
            <div>
              <p className="text-gray-500">Family History</p>
              <p className="font-medium text-gray-900">
                {patient.medical_history?.family_autism_history ? "Yes" : "No"}
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
