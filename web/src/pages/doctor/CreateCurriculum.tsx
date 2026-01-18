import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  Trash2,
  Save,
  Send,
  Loader2,
  BookOpen,
  Calendar,
  User,
  GripVertical,
  ChevronLeft,
  ChevronRight,
  Stethoscope,
  LogOut,
  X,
} from "lucide-react";
import {
  getSavedTasks,
  createSavedTask,
  getActivePatients,
  createPersonalizedCurriculum,
  publishCurriculum,
  type SavedTask,
  type PersonalizedTaskInput,
  type ActivePatient,
} from "@/lib/api";

const DURATION_OPTIONS = [
  { value: 7, label: "7 Days" },
  { value: 15, label: "15 Days" },
  { value: 30, label: "30 Days" },
];

interface TaskForDay extends PersonalizedTaskInput {
  tempId: string;
  fromLibrary?: boolean;
}

export default function CreateCurriculum() {
  const navigate = useNavigate();
  const { childId } = useParams<{ childId: string }>();

  const [loading, setLoading] = useState(true);
  const [savedTasks, setSavedTasks] = useState<SavedTask[]>([]);
  const [patients, setPatients] = useState<ActivePatient[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);

  // Form state
  const [selectedChildId, setSelectedChildId] = useState<number | null>(
    childId ? parseInt(childId) : null
  );
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [durationDays, setDurationDays] = useState<7 | 15 | 30>(7);
  const [currentDay, setCurrentDay] = useState(1);
  const [tasksByDay, setTasksByDay] = useState<Record<number, TaskForDay[]>>(
    {}
  );

  // New task modal
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskForm, setNewTaskForm] = useState({
    title: "",
    goal: "",
    instructions: "",
    video_url: "",
    saveToLibrary: false,
  });

  // Publish modal
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [publishStartDate, setPublishStartDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [curriculumId, setCurriculumId] = useState<number | null>(null);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("doctorLoggedIn");
    if (!isLoggedIn) {
      navigate("/doctor/login");
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [tasksData, patientsData] = await Promise.all([
        getSavedTasks(),
        getActivePatients(),
      ]);
      console.log("Loaded patients:", patientsData);
      setSavedTasks(tasksData);
      setPatients(patientsData);

      // If childId is provided, auto-select
      if (childId) {
        const patient = patientsData.find(
          (p) => p.child_id === parseInt(childId)
        );
        if (patient) {
          setTitle(`Personalized Curriculum for ${patient.child_name}`);
          setSelectedChildId(patient.child_id);
        }
      }
    } catch (error) {
      console.error("Failed to load data:", error);
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

  const addTaskFromLibrary = (task: SavedTask) => {
    const newTask: TaskForDay = {
      tempId: `${Date.now()}-${Math.random()}`,
      day_number: currentDay,
      title: task.title,
      goal: task.goal,
      instructions: task.instructions,
      video_url: task.video_url,
      order_index: (tasksByDay[currentDay]?.length || 0) + 1,
      saved_task_id: task.id,
      fromLibrary: true,
    };
    setTasksByDay((prev) => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), newTask],
    }));
  };

  const addNewTask = async () => {
    if (!newTaskForm.title || !newTaskForm.goal || !newTaskForm.instructions) {
      alert("Please fill in all required fields");
      return;
    }

    // Optionally save to library
    let savedTaskId: number | null = null;
    if (newTaskForm.saveToLibrary) {
      try {
        const saved = await createSavedTask({
          title: newTaskForm.title,
          goal: newTaskForm.goal,
          instructions: newTaskForm.instructions,
          video_url: newTaskForm.video_url,
        });
        savedTaskId = saved.id;
        setSavedTasks((prev) => [saved, ...prev]);
      } catch (error) {
        console.error("Failed to save to library:", error);
      }
    }

    const newTask: TaskForDay = {
      tempId: `${Date.now()}-${Math.random()}`,
      day_number: currentDay,
      title: newTaskForm.title,
      goal: newTaskForm.goal,
      instructions: newTaskForm.instructions,
      video_url: newTaskForm.video_url,
      order_index: (tasksByDay[currentDay]?.length || 0) + 1,
      saved_task_id: savedTaskId,
      fromLibrary: false,
    };

    setTasksByDay((prev) => ({
      ...prev,
      [currentDay]: [...(prev[currentDay] || []), newTask],
    }));

    setNewTaskForm({
      title: "",
      goal: "",
      instructions: "",
      video_url: "",
      saveToLibrary: false,
    });
    setShowNewTaskModal(false);
  };

  const removeTask = (dayNumber: number, tempId: string) => {
    setTasksByDay((prev) => ({
      ...prev,
      [dayNumber]: prev[dayNumber]?.filter((t) => t.tempId !== tempId) || [],
    }));
  };

  const getAllTasks = (): PersonalizedTaskInput[] => {
    const allTasks: PersonalizedTaskInput[] = [];
    for (let day = 1; day <= durationDays; day++) {
      const dayTasks = tasksByDay[day] || [];
      dayTasks.forEach((task, index) => {
        allTasks.push({
          day_number: day,
          title: task.title,
          goal: task.goal,
          instructions: task.instructions,
          video_url: task.video_url,
          order_index: index + 1,
          saved_task_id: task.saved_task_id,
        });
      });
    }
    return allTasks;
  };

  const handleSaveDraft = async () => {
    if (!selectedChildId) {
      alert("Please select a patient");
      return;
    }
    if (!title) {
      alert("Please enter a curriculum title");
      return;
    }

    setSaving(true);
    try {
      const result = await createPersonalizedCurriculum({
        child_id: selectedChildId,
        title,
        description,
        duration_days: durationDays,
        tasks: getAllTasks(),
        is_draft: true,
      });
      setCurriculumId(result.curriculum_id);
      alert("Draft saved successfully!");
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert(error instanceof Error ? error.message : "Failed to save draft");
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!selectedChildId) {
      alert("Please select a patient");
      return;
    }
    if (!title) {
      alert("Please enter a curriculum title");
      return;
    }

    const tasks = getAllTasks();
    if (tasks.length === 0) {
      alert("Please add at least one task");
      return;
    }

    // First save as draft if not already saved
    let idToPublish = curriculumId;
    if (!idToPublish) {
      setPublishing(true);
      try {
        const result = await createPersonalizedCurriculum({
          child_id: selectedChildId,
          title,
          description,
          duration_days: durationDays,
          tasks,
          is_draft: true,
        });
        idToPublish = result.curriculum_id;
        setCurriculumId(idToPublish);
      } catch (error) {
        console.error("Failed to save curriculum:", error);
        alert(
          error instanceof Error ? error.message : "Failed to save curriculum"
        );
        setPublishing(false);
        return;
      }
    }

    setShowPublishModal(true);
    setPublishing(false);
  };

  const confirmPublish = async () => {
    if (!curriculumId) return;

    setPublishing(true);
    try {
      await publishCurriculum(curriculumId, publishStartDate);
      alert("Curriculum published and assigned successfully!");
      navigate("/doctor/dashboard");
    } catch (error) {
      console.error("Failed to publish:", error);
      alert(
        error instanceof Error ? error.message : "Failed to publish curriculum"
      );
    } finally {
      setPublishing(false);
      setShowPublishModal(false);
    }
  };

  const filteredTasks = savedTasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.goal.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentDayTasks = tasksByDay[currentDay] || [];
  const totalTasks = Object.values(tasksByDay).flat().length;
  const selectedPatient = patients.find((p) => p.child_id === selectedChildId);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-orange-100 sticky top-0 z-40 shadow-sm">
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
                    Create Personalized Curriculum
                  </h1>
                  <p className="text-xs text-gray-500">
                    Build a custom therapy plan
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveDraft}
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 border-2 border-orange-200 text-orange-600 rounded-xl font-medium hover:bg-orange-50 disabled:opacity-50 transition-all"
              >
                {saving ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Draft
              </button>
              <button
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 shadow-lg shadow-orange-500/30 transition-all"
              >
                {publishing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Publish
              </button>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Curriculum Info */}
        <div className="bg-white rounded-2xl border-2 border-orange-100 p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Patient Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <User className="w-4 h-4 inline mr-1" />
                Patient
              </label>
              <select
                value={selectedChildId || ""}
                onChange={(e) =>
                  setSelectedChildId(
                    e.target.value ? parseInt(e.target.value) : null
                  )
                }
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                <option value="">
                  {patients.length === 0
                    ? "No patients available"
                    : "Select patient"}
                </option>
                {patients.map((p) => (
                  <option key={p.child_id} value={p.child_id}>
                    {p.child_name} ({p.age})
                  </option>
                ))}
              </select>
              {patients.length === 0 && (
                <p className="text-xs text-amber-600 mt-1">
                  Accept patients from the dashboard first
                </p>
              )}
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <Calendar className="w-4 h-4 inline mr-1" />
                Duration
              </label>
              <select
                value={durationDays}
                onChange={(e) => {
                  const newDuration = parseInt(e.target.value) as 7 | 15 | 30;
                  setDurationDays(newDuration);
                  if (currentDay > newDuration) {
                    setCurrentDay(newDuration);
                  }
                }}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
              >
                {DURATION_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Curriculum Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                placeholder="e.g., Social Skills Development Plan"
              />
            </div>
          </div>

          {/* Description */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={2}
              className="w-full px-3 py-2 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
              placeholder="Brief description of the curriculum goals..."
            />
          </div>

          {/* Stats */}
          <div className="mt-4 flex items-center gap-6 text-sm text-gray-500">
            <span>
              <strong className="text-gray-900">{totalTasks}</strong> total
              tasks
            </span>
            {selectedPatient && (
              <span>
                Patient: <strong className="text-orange-600">{selectedPatient.child_name}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Task Library Sidebar */}
          <div className="bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-lg">
            <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100">
              <h2 className="font-semibold text-gray-900 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-orange-500" />
                Task Library
              </h2>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-orange-50 border-2 border-transparent rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white focus:border-orange-500 transition-all text-sm"
                />
              </div>

              <button
                onClick={() => setShowNewTaskModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 mb-4 border-2 border-dashed border-orange-300 text-orange-600 rounded-xl font-medium hover:bg-orange-50 transition-all"
              >
                <Plus className="w-4 h-4" />
                Create New Task
              </button>

              <div className="max-h-[400px] overflow-y-auto space-y-2">
                {filteredTasks.length === 0 ? (
                  <p className="text-center text-gray-400 text-sm py-4">
                    No tasks in library
                  </p>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      key={task.id}
                      className="p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors group cursor-pointer"
                      onClick={() => addTaskFromLibrary(task)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm truncate">
                            {task.title}
                          </h4>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                            {task.goal}
                          </p>
                        </div>
                        <Plus className="w-4 h-4 text-orange-500 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Day Builder */}
          <div className="lg:col-span-2 bg-white rounded-2xl border-2 border-orange-100 overflow-hidden shadow-lg">
            {/* Day Navigation */}
            <div className="px-4 py-3 bg-gradient-to-r from-orange-50 to-amber-50 border-b border-orange-100 flex items-center justify-between">
              <button
                onClick={() => setCurrentDay(Math.max(1, currentDay - 1))}
                disabled={currentDay === 1}
                className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>

              <div className="flex items-center gap-2 overflow-x-auto px-4">
                {Array.from({ length: durationDays }, (_, i) => i + 1).map(
                  (day) => (
                    <button
                      key={day}
                      onClick={() => setCurrentDay(day)}
                      className={`min-w-[40px] h-10 rounded-xl font-medium text-sm transition-all ${
                        day === currentDay
                          ? "bg-orange-500 text-white shadow-lg shadow-orange-500/30"
                          : tasksByDay[day]?.length
                          ? "bg-orange-100 text-orange-600"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {day}
                    </button>
                  )
                )}
              </div>

              <button
                onClick={() =>
                  setCurrentDay(Math.min(durationDays, currentDay + 1))
                }
                disabled={currentDay === durationDays}
                className="p-1.5 hover:bg-white rounded-lg disabled:opacity-30 transition-all"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Day Content */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">
                  Day {currentDay} Tasks
                </h3>
                <span className="text-sm text-gray-500">
                  {currentDayTasks.length} task
                  {currentDayTasks.length !== 1 ? "s" : ""}
                </span>
              </div>

              {currentDayTasks.length === 0 ? (
                <div className="text-center py-12 border-2 border-dashed border-gray-200 rounded-xl">
                  <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 mb-3">No tasks for this day</p>
                  <p className="text-sm text-gray-400">
                    Click tasks from the library or create a new one
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {currentDayTasks.map((task, index) => (
                    <div
                      key={task.tempId}
                      className="p-4 bg-orange-50 rounded-xl border-2 border-orange-100 group hover:border-orange-300 transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex items-center gap-2 text-gray-400">
                          <GripVertical className="w-4 h-4" />
                          <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900">
                            {task.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">
                            {task.goal}
                          </p>
                          <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                            {task.instructions}
                          </p>
                          {task.fromLibrary && (
                            <span className="inline-block mt-2 px-2 py-0.5 bg-orange-200 text-orange-700 text-xs rounded-full">
                              From Library
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => removeTask(currentDay, task.tempId)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Create New Task for Day {currentDay}
              </h2>
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={newTaskForm.title}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, title: e.target.value })
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
                  value={newTaskForm.goal}
                  onChange={(e) =>
                    setNewTaskForm({ ...newTaskForm, goal: e.target.value })
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
                  value={newTaskForm.instructions}
                  onChange={(e) =>
                    setNewTaskForm({
                      ...newTaskForm,
                      instructions: e.target.value,
                    })
                  }
                  rows={4}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all resize-none"
                  placeholder="Step-by-step instructions for parents..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Demo Video URL
                </label>
                <input
                  type="url"
                  value={newTaskForm.video_url}
                  onChange={(e) =>
                    setNewTaskForm({
                      ...newTaskForm,
                      video_url: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  placeholder="https://..."
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newTaskForm.saveToLibrary}
                  onChange={(e) =>
                    setNewTaskForm({
                      ...newTaskForm,
                      saveToLibrary: e.target.checked,
                    })
                  }
                  className="w-4 h-4 text-orange-500 border-gray-300 rounded focus:ring-orange-500"
                />
                <span className="text-sm text-gray-700">
                  Also save to my Task Library for future use
                </span>
              </label>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowNewTaskModal(false)}
                  className="flex-1 px-4 py-2.5 border-2 border-gray-200 text-gray-600 rounded-xl font-medium hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={addNewTask}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Task
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Publish Curriculum
              </h2>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-gray-600">
                When should the curriculum start?
              </p>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
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

              <div className="bg-orange-50 rounded-xl p-4 text-sm text-orange-700">
                <strong>Note:</strong> Publishing will assign this curriculum to{" "}
                {selectedPatient?.child_name}. The parent will see tasks
                starting from the selected date.
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
                  onClick={confirmPublish}
                  disabled={publishing}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50 transition-all"
                >
                  {publishing ? (
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
    </div>
  );
}
