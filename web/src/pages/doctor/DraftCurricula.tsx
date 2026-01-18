import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FileEdit,
  Send,
  Trash2,
  Loader2,
  FolderOpen,
  Calendar,
  User,
  Stethoscope,
  LogOut,
  X,
  Clock,
} from "lucide-react";
import {
  getDraftCurricula,
  publishCurriculum,
  getCurriculumDetail,
  type DraftCurriculum,
  type CurriculumDetail,
} from "@/lib/api";

export default function DraftCurricula() {
  const navigate = useNavigate();
  const [drafts, setDrafts] = useState<DraftCurriculum[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<number | null>(null);

  // Publish modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [selectedDraft, setSelectedDraft] = useState<DraftCurriculum | null>(null);
  const [publishStartDate, setPublishStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Preview modal
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewData, setPreviewData] = useState<CurriculumDetail | null>(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }
    loadDrafts();
  }, [navigate]);

  const loadDrafts = async () => {
    try {
      setLoading(true);
      const data = await getDraftCurricula();
      setDrafts(data);
    } catch (error) {
      console.error("Failed to load drafts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorToken");
    localStorage.removeItem("doctorRefreshToken");
    localStorage.removeItem("doctorLoggedIn");
    localStorage.removeItem("doctorEmail");
    localStorage.removeItem("doctorName");
    localStorage.removeItem("doctorData");
    navigate("/doctor/login");
  };

  const openPublishModal = (draft: DraftCurriculum) => {
    setSelectedDraft(draft);
    setPublishStartDate(new Date().toISOString().split("T")[0]);
    setShowPublishModal(true);
  };

  const handlePublish = async () => {
    if (!selectedDraft) return;

    setPublishing(selectedDraft.id);
    try {
      await publishCurriculum(selectedDraft.id, publishStartDate);
      alert("Curriculum published and assigned successfully!");
      setShowPublishModal(false);
      loadDrafts();
    } catch (error) {
      console.error("Failed to publish:", error);
      alert(error instanceof Error ? error.message : "Failed to publish curriculum");
    } finally {
      setPublishing(null);
    }
  };

  const openPreview = async (draft: DraftCurriculum) => {
    setLoadingPreview(true);
    setShowPreviewModal(true);
    try {
      const data = await getCurriculumDetail(draft.id);
      setPreviewData(data);
    } catch (error) {
      console.error("Failed to load preview:", error);
      alert("Failed to load curriculum details");
      setShowPreviewModal(false);
    } finally {
      setLoadingPreview(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/doctor/dashboard")}
                className="p-2 hover:bg-orange-50 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30">
                  <Stethoscope className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-gray-900">
                    Draft Curricula
                  </h1>
                  <p className="text-xs text-gray-500">
                    Manage your unpublished curricula
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : drafts.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No draft curricula
            </h3>
            <p className="text-gray-500 mb-6">
              Your saved drafts will appear here
            </p>
            <button
              onClick={() => navigate("/doctor/curriculum/create")}
              className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
            >
              Create New Curriculum
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {drafts.map((draft) => (
              <div
                key={draft.id}
                className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-medium rounded-full">
                        Draft
                      </span>
                      <span className="text-xs text-gray-400">
                        {draft.duration_days} days
                      </span>
                    </div>
                    <h3 className="font-semibold text-gray-900">
                      {draft.title}
                    </h3>
                  </div>
                </div>

                {draft.for_child_name && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <User className="w-4 h-4 text-orange-400" />
                    <span>For: {draft.for_child_name}</span>
                  </div>
                )}

                <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                  {draft.description || "No description"}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-400 mb-4">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{draft.tasks_count} tasks</span>
                  <span className="mx-1">•</span>
                  <span>
                    Created {new Date(draft.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => openPreview(draft)}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 border-2 border-gray-200 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-50 transition-all"
                  >
                    <FileEdit className="w-4 h-4" />
                    Preview
                  </button>
                  <button
                    onClick={() => openPublishModal(draft)}
                    disabled={publishing === draft.id || draft.tasks_count === 0}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 transition-all"
                  >
                    {publishing === draft.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
                    )}
                    Publish
                  </button>
                </div>

                {draft.tasks_count === 0 && (
                  <p className="text-xs text-amber-600 mt-2 text-center">
                    Add tasks before publishing
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Publish Modal */}
      {showPublishModal && selectedDraft && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Publish Curriculum
              </h2>
              <button
                onClick={() => setShowPublishModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-orange-50 rounded-xl p-4">
                <h3 className="font-medium text-gray-900">{selectedDraft.title}</h3>
                <p className="text-sm text-gray-500 mt-1">
                  {selectedDraft.duration_days} days • {selectedDraft.tasks_count} tasks
                </p>
                {selectedDraft.for_child_name && (
                  <p className="text-sm text-orange-600 mt-1">
                    For: {selectedDraft.for_child_name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  Start Date
                </label>
                <input
                  type="date"
                  value={publishStartDate}
                  onChange={(e) => setPublishStartDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                />
              </div>

              <div className="bg-amber-50 rounded-xl p-4 text-sm text-amber-700">
                <strong>Note:</strong> Publishing will assign this curriculum to the
                patient. They will see tasks starting from the selected date.
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPublishModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePublish}
                  disabled={publishing !== null}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  {publishing !== null ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Publish & Assign
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
              <h2 className="text-lg font-semibold text-gray-900">
                Curriculum Preview
              </h2>
              <button
                onClick={() => {
                  setShowPreviewModal(false);
                  setPreviewData(null);
                }}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(80vh-80px)]">
              {loadingPreview ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                </div>
              ) : previewData ? (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {previewData.title}
                    </h3>
                    <p className="text-gray-500 mt-1">{previewData.description}</p>
                    <div className="flex gap-4 mt-3 text-sm text-gray-600">
                      <span>{previewData.duration_days} days</span>
                      <span>{previewData.tasks?.length || 0} tasks</span>
                    </div>
                  </div>

                  {previewData.tasks && previewData.tasks.length > 0 ? (
                    <div className="space-y-4">
                      {Array.from(
                        { length: previewData.duration_days },
                        (_, i) => i + 1
                      ).map((day) => {
                        const dayTasks = previewData.tasks.filter(
                          (t) => t.day_number === day
                        );
                        if (dayTasks.length === 0) return null;
                        return (
                          <div key={day} className="border-2 border-gray-100 rounded-xl p-4">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              Day {day}
                            </h4>
                            <div className="space-y-2">
                              {dayTasks.map((task, idx) => (
                                <div
                                  key={task.id}
                                  className="bg-orange-50 rounded-lg p-3"
                                >
                                  <div className="flex items-start gap-2">
                                    <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                      {idx + 1}
                                    </span>
                                    <div>
                                      <h5 className="font-medium text-gray-900">
                                        {task.title}
                                      </h5>
                                      <p className="text-sm text-gray-600 mt-1">
                                        {task.why_description}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-400">
                      No tasks in this curriculum
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  Failed to load curriculum details
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
