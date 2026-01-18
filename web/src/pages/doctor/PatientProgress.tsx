import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  Calendar,
  Check,
  CheckCircle,
  Clock,
  HelpCircle,
  Play,
  RefreshCw,
  TrendingUp,
  X,
  AlertCircle,
  ClipboardList,
  Plus,
  Sparkles,
} from "lucide-react";
import {
  getPatientProgress,
  getPatientDetail,
  type PatientProgress,
  type PatientDetail,
  type ProgressEntry,
} from "@/lib/api";

export default function PatientProgressPage() {
  const { childId } = useParams<{ childId: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<PatientDetail | null>(null);
  const [progress, setProgress] = useState<PatientProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);

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
      const [patientData, progressData] = await Promise.all([
        getPatientDetail(id),
        getPatientProgress(id),
      ]);
      setPatient(patientData);
      setProgress(progressData);
    } catch (err) {
      console.error(err);
      if (err instanceof Error && err.message.includes("No curriculum")) {
        setError("No curriculum assigned yet");
      } else {
        setError("Failed to load progress data");
      }
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: ProgressEntry["status"]) => {
    switch (status) {
      case "done_without_help":
        return "bg-green-500";
      case "done_with_help":
        return "bg-amber-500";
      case "not_done":
        return "bg-red-400";
      default:
        return "bg-gray-200";
    }
  };

  const getStatusIcon = (status: ProgressEntry["status"]) => {
    switch (status) {
      case "done_without_help":
        return <Check className="w-3 h-3 text-white" />;
      case "done_with_help":
        return <HelpCircle className="w-3 h-3 text-white" />;
      case "not_done":
        return <X className="w-3 h-3 text-white" />;
      default:
        return null;
    }
  };

  // Group progress entries by day
  const getProgressByDay = () => {
    if (!progress) return {};
    const byDay: Record<number, ProgressEntry[]> = {};
    progress.progress.forEach((entry) => {
      if (!byDay[entry.day_number]) {
        byDay[entry.day_number] = [];
      }
      byDay[entry.day_number].push(entry);
    });
    return byDay;
  };

  // Get unique tasks across all days
  const getUniqueTasks = () => {
    if (!progress) return [];
    const tasks = new Map<number, { id: number; title: string }>();
    progress.progress.forEach((entry) => {
      if (!tasks.has(entry.task.id)) {
        tasks.set(entry.task.id, {
          id: entry.task.id,
          title: entry.task.title,
        });
      }
    });
    return Array.from(tasks.values());
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading progress data...</p>
        </div>
      </div>
    );
  }

  if (error === "No curriculum assigned yet") {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 h-16">
              <button
                onClick={() => navigate(`/doctor/patient/${childId}`)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">
                Patient Progress
              </h1>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
            <ClipboardList className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Curriculum Assigned
            </h2>
            <p className="text-gray-500 mb-6">
              Assign a curriculum to this patient to start tracking their
              progress.
            </p>
            <button
              onClick={() => navigate(`/doctor/patient/${childId}/assign`)}
              className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition"
            >
              Assign Curriculum
            </button>
          </div>
        </main>
      </div>
    );
  }

  if (!patient || !progress) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <p className="text-gray-600">{error || "Data not found"}</p>
          <button
            onClick={() => navigate("/doctor/dashboard")}
            className="mt-4 text-orange-600 hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const progressByDay = getProgressByDay();
  const uniqueTasks = getUniqueTasks();
  const daysWithProgress = Object.keys(progressByDay)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(`/doctor/patient/${childId}`)}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">
                  Progress: {patient.child.full_name}
                </h1>
                <p className="text-sm text-gray-500">
                  {progress.curriculum.title} • Day{" "}
                  {progress.curriculum.current_day}/
                  {progress.curriculum.duration_days}
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate(`/doctor/patient/${childId}/diagnosis`)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition"
            >
              <ClipboardList className="w-4 h-4" />
              Diagnosis Report
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.curriculum.current_day}
                </p>
                <p className="text-sm text-gray-500">Current Day</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.stats.tasks_done}
                </p>
                <p className="text-sm text-gray-500">Tasks Completed</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.stats.completion_rate}%
                </p>
                <p className="text-sm text-gray-500">Completion Rate</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {progress.stats.tasks_done_without_help}
                </p>
                <p className="text-sm text-gray-500">Independent</p>
              </div>
            </div>
          </div>
        </div>

        {/* Assessment Complete CTA */}
        {progress.curriculum.status === "completed" && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 mb-8 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2"></div>
            <div className="relative flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-1">
                    Assessment Complete!
                  </h3>
                  <p className="text-orange-100 max-w-md">
                    {patient.child.full_name} has completed the assessment
                    curriculum. You can now create a personalized therapy plan
                    based on their progress.
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(`/doctor/curriculum/create/${childId}`)
                }
                className="flex items-center gap-2 px-6 py-3 bg-white text-orange-600 rounded-xl font-semibold hover:bg-orange-50 transition-all shadow-lg"
              >
                <Plus className="w-5 h-5" />
                Create Personalized Curriculum
              </button>
            </div>
          </div>
        )}

        {/* Progress Table - Only show for personalized curricula, not for assessment */}
        {progress.curriculum.type !== 'assessment' ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Progress Table
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Daily task completion status
              </p>
            </div>

            {progress.progress.length === 0 ? (
              <div className="p-12 text-center">
                <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No progress submitted yet</p>
                <p className="text-sm text-gray-400 mt-1">
                  Parent will submit progress through the mobile app
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 sticky left-0 bg-gray-50 min-w-[200px]">
                        Task
                      </th>
                      {daysWithProgress.map((day) => (
                        <th
                          key={day}
                          className="text-center py-3 px-2 text-sm font-medium text-gray-600 min-w-[60px]"
                        >
                          Day {day}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uniqueTasks.map((task) => (
                      <tr key={task.id} className="border-t border-gray-100">
                        <td className="py-3 px-4 text-sm text-gray-900 sticky left-0 bg-white">
                          {task.title}
                        </td>
                        {daysWithProgress.map((day) => {
                          const entry = progressByDay[day]?.find(
                            (e) => e.task.id === task.id
                          );
                          return (
                            <td key={day} className="py-3 px-2 text-center">
                              {entry ? (
                                <div className="flex flex-col items-center gap-1">
                                  <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center ${getStatusColor(
                                      entry.status
                                    )}`}
                                  >
                                    {getStatusIcon(entry.status)}
                                  </div>
                                  {entry.video_url && (
                                    <button
                                      onClick={() =>
                                        setPlayingVideo(entry.video_url!)
                                      }
                                      className="text-xs text-orange-600 hover:underline flex items-center gap-0.5"
                                    >
                                      <Play className="w-3 h-3" />
                                      Video
                                    </button>
                                  )}
                                </div>
                              ) : (
                                <div className="w-7 h-7 rounded-full bg-gray-100 mx-auto" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Legend */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">Done without help</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-amber-500 flex items-center justify-center">
                    <HelpCircle className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">Done with help</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 rounded-full bg-red-400 flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-gray-600">Not done</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6 mb-8">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ClipboardList className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  3-Day Pre-Assessment
                </h3>
                <p className="text-blue-700 text-sm">
                  This is the initial 3-day assessment phase. The detailed progress data will be shown as a static summary on the patient's detail page once the assessment is complete. You can then create a personalized therapy curriculum based on the results.
                </p>
              </div>
            </div>
          </div>
        )}

      </main>

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
              <h3 className="text-white font-medium">Progress Video</h3>
              <button
                onClick={() => setPlayingVideo(null)}
                className="text-gray-400 hover:text-white transition"
              >
                <X className="w-5 h-5" />
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
