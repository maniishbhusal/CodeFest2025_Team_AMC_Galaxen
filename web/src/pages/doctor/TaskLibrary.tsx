import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Edit2,
  Trash2,
  BookOpen,
  Video,
  X,
  Save,
  Loader2,
  FolderOpen,
  Stethoscope,
  LogOut,
} from "lucide-react";
import {
  getSavedTasks,
  createSavedTask,
  updateSavedTask,
  deleteSavedTask,
  type SavedTask,
  type CreateSavedTaskData,
} from "@/lib/api";

const CATEGORIES = [
  "All",
  "Social Skills",
  "Communication",
  "Motor Skills",
  "Cognitive",
  "Self-Help",
  "Play Skills",
  "Behavior",
];

export default function TaskLibrary() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<SavedTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<SavedTask | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);

  const [formData, setFormData] = useState<CreateSavedTaskData>({
    title: "",
    goal: "",
    instructions: "",
    video_url: "",
    category: "",
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }
    loadTasks();
  }, [navigate]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await getSavedTasks();
      setTasks(data);
    } catch (error) {
      console.error("Failed to load tasks:", error);
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

  const openCreateModal = () => {
    setEditingTask(null);
    setFormData({
      title: "",
      goal: "",
      instructions: "",
      video_url: "",
      category: "",
    });
    setShowModal(true);
  };

  const openEditModal = (task: SavedTask) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      goal: task.goal,
      instructions: task.instructions,
      video_url: task.video_url || "",
      category: task.category || "",
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingTask) {
        await updateSavedTask(editingTask.id, formData);
      } else {
        await createSavedTask(formData);
      }
      setShowModal(false);
      loadTasks();
    } catch (error) {
      console.error("Failed to save task:", error);
      alert(error instanceof Error ? error.message : "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;
    setDeleting(taskId);
    try {
      await deleteSavedTask(taskId);
      loadTasks();
    } catch (error) {
      console.error("Failed to delete task:", error);
      alert("Failed to delete task");
    } finally {
      setDeleting(null);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.goal.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "All" || task.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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
                    Task Library
                  </h1>
                  <p className="text-xs text-gray-500">
                    Manage your reusable tasks
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
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border-2 border-orange-100 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
            />
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30 transition-all transform hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {CATEGORIES.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                selectedCategory === category
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                  : "bg-white border-2 border-orange-100 text-gray-600 hover:border-orange-300"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Tasks Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center py-20">
            <FolderOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {tasks.length === 0
                ? "No tasks yet"
                : "No tasks match your search"}
            </h3>
            <p className="text-gray-500 mb-6">
              {tasks.length === 0
                ? "Create your first reusable task to get started"
                : "Try adjusting your search or filter"}
            </p>
            {tasks.length === 0 && (
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
              >
                <Plus className="w-5 h-5" />
                Create Your First Task
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-xl border-2 border-orange-100 p-5 hover:shadow-xl hover:border-orange-300 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600 transition-colors">
                      {task.title}
                    </h3>
                    {task.category && (
                      <span className="inline-block mt-1 px-2 py-0.5 bg-orange-100 text-orange-600 text-xs rounded-full">
                        {task.category}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => openEditModal(task)}
                      className="p-1.5 hover:bg-orange-50 rounded-lg text-gray-400 hover:text-orange-600 transition-all"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      disabled={deleting === task.id}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 transition-all disabled:opacity-50"
                    >
                      {deleting === task.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-2 mb-3">
                  <BookOpen className="w-4 h-4 text-orange-400 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {task.goal}
                  </p>
                </div>

                <p className="text-sm text-gray-500 line-clamp-3 mb-3">
                  {task.instructions}
                </p>

                {task.video_url && (
                  <div className="flex items-center gap-1.5 text-xs text-orange-600">
                    <Video className="w-3.5 h-3.5" />
                    <span>Has demo video</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingTask ? "Edit Task" : "Create New Task"}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="e.g., Morning Eye Contact Exercise"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Goal *
                </label>
                <textarea
                  required
                  value={formData.goal}
                  onChange={(e) =>
                    setFormData({ ...formData, goal: e.target.value })
                  }
                  rows={2}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="What does this task aim to achieve?"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions *
                </label>
                <textarea
                  required
                  value={formData.instructions}
                  onChange={(e) =>
                    setFormData({ ...formData, instructions: e.target.value })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="Step-by-step instructions for parents..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                >
                  <option value="">Select a category</option>
                  {CATEGORIES.filter((c) => c !== "All").map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo Video URL
                </label>
                <input
                  type="url"
                  value={formData.video_url}
                  onChange={(e) =>
                    setFormData({ ...formData, video_url: e.target.value })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      {editingTask ? "Update" : "Create"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
