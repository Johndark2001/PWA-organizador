// src/pages/Today.jsx
import { useEffect, useState } from "react";
import { useTasks } from "../contexts/TasksContext";
import Pomodoro from "../components/Pomodoro";
import { Plus, CheckCircle2, Circle } from "lucide-react";
import TagSelector from "../components/TagSelector";
import ProgressBar from "../components/ProgressBar"; // 🟢 nuevo import

function TaskForm({ onCreate, show, onClose }) {
  const [title, setTitle] = useState("");
  const [scope, setScope] = useState("personal");
  const [priority, setPriority] = useState("media");
  const [dueDate, setDueDate] = useState("");
  const [tags, setTags] = useState([]);

  const submit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    onCreate({ title, scope, priority, dueDate: dueDate || null, tags });
    setTitle("");
    setDueDate("");
    setTags([]);
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <form
        onSubmit={submit}
        className="bg-white w-full max-w-md p-6 rounded-2xl shadow-xl space-y-3"
      >
        <h2 className="text-lg font-semibold text-gray-700">Nueva tarea</h2>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex gap-2">
          <select
            value={scope}
            onChange={(e) => setScope(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="personal">Personal</option>
            <option value="trabajo">Trabajo</option>
            <option value="hogar">Hogar</option>
          </select>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="flex-1 p-2 border rounded"
          >
            <option value="alta">Alta</option>
            <option value="media">Media</option>
            <option value="baja">Baja</option>
          </select>
        </div>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded"
        />

        {/* 🏷️ Selector de etiquetas */}
        <TagSelector tags={tags} onChange={setTags} />

        <div className="flex justify-end gap-2 mt-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded border text-gray-600 hover:bg-gray-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Agregar
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TodayPage() {
  const { tasks, createTask, toggleComplete, tasksForToday, metrics, addFocusedMinutes } =
    useTasks();
  const [focusList, setFocusList] = useState([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (focusList.length === 0) {
      const suggested = tasks
        .filter((t) => t.status !== "done")
        .slice(0, 3)
        .map((t) => t.id);
      setFocusList(suggested);
    }
  }, [tasks]);

  const todayTasks = tasksForToday();

  const toggleFocus = (id) => {
    setFocusList((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 5) return prev;
      return [...prev, id];
    });
  };

  const handleWorkComplete = (minutes) => {
    addFocusedMinutes(minutes);
  };

  // 🟢 Calcular progreso
  const completedCount = todayTasks.filter((t) => t.status === "done").length;
  const totalCount = todayTasks.length;

  return (
    <div className="p-6 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
      {/* SECCIÓN PRINCIPAL */}
      <div className="lg:col-span-2 space-y-6">
        <h1 className="text-3xl font-semibold text-gray-800 mb-4">Hoy</h1>

        {/* 🟢 Barra de progreso diaria */}
        <ProgressBar completed={completedCount} total={totalCount} />

        {/* Foco sugerido */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Enfoque del día
          </h2>
          <div className="space-y-2">
            {focusList.map((id) => {
              const t = tasks.find((x) => x.id === id);
              if (!t) return null;
              return (
                <div
                  key={id}
                  className={`flex justify-between items-center p-3 rounded-xl shadow-sm bg-white hover:shadow-md transition-all border-l-4 ${
                    t.priority === "alta"
                      ? "border-red-500"
                      : t.priority === "media"
                      ? "border-yellow-500"
                      : "border-green-500"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleComplete(id)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      {t.status === "done" ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <Circle size={20} />
                      )}
                    </button>
                    <div>
                      <div
                        className={`font-medium ${
                          t.status === "done"
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {t.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t.scope} • {t.priority}
                        {t.dueDate ? ` • vence ${t.dueDate}` : ""}
                        {t.tags?.length > 0 && (
                          <span className="ml-2 text-blue-500">
                            {t.tags.map((tag) => `#${tag}`).join(" ")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleFocus(id)}
                    className="text-xs text-gray-500 hover:text-gray-700"
                  >
                    Quitar
                  </button>
                </div>
              );
            })}
            {focusList.length === 0 && (
              <p className="text-gray-500 text-sm">
                No hay tareas en enfoque. Selecciona algunas para enfocarte.
              </p>
            )}
          </div>
        </section>

        {/* Todas las tareas */}
        <section>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Todas las tareas de hoy
          </h2>
          <div className="space-y-2">
            {todayTasks.map((t) => (
              <div
                key={t.id}
                className={`flex justify-between items-center p-3 rounded-xl shadow-sm bg-white hover:shadow-md transition-all border-l-4 ${
                  t.priority === "alta"
                    ? "border-red-500"
                    : t.priority === "media"
                    ? "border-yellow-500"
                    : "border-green-500"
                }`}
              >
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleComplete(t.id)}
                    className="text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    {t.status === "done" ? (
                      <CheckCircle2 size={20} />
                    ) : (
                      <Circle size={20} />
                    )}
                  </button>
                  <div>
                    <div
                      className={`font-medium ${
                        t.status === "done"
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {t.title}
                    </div>
                    <div className="text-xs text-gray-500">
                      {t.scope} • {t.priority}
                      {t.dueDate ? ` • vence ${t.dueDate}` : ""}
                      {t.tags?.length > 0 && (
                        <span className="ml-2 text-blue-500">
                          {t.tags.map((tag) => `#${tag}`).join(" ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => toggleFocus(t.id)}
                  className="text-xs text-gray-500 hover:text-gray-700"
                >
                  Foco
                </button>
              </div>
            ))}
            {todayTasks.length === 0 && (
              <div className="text-gray-500 text-sm">
                No hay tareas programadas para hoy.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* PANEL DERECHO */}
      <aside className="space-y-4">
        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-semibold text-gray-700 mb-2">Pomodoro</h3>
          <Pomodoro
            onWorkComplete={handleWorkComplete}
            workMinutes={25}
            breakMinutes={5}
          />
        </div>

        <div className="bg-white p-4 rounded-2xl shadow-md">
          <h3 className="font-semibold text-gray-700 mb-2">Métricas</h3>
          <div className="text-sm text-gray-700">
            Minutos enfocados hoy:{" "}
            <strong>{metrics?.focusedMinutesToday ?? 0}</strong>
          </div>
          <div className="text-sm text-gray-700">
            Racha (días): <strong>{metrics?.streakDays ?? 0}</strong>
          </div>
          <div className="text-xs text-gray-500 mt-2">
            Última actividad: {metrics?.lastActiveDate ?? "—"}
          </div>
        </div>
      </aside>

      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg"
      >
        <Plus size={24} />
      </button>

      {/* MODAL CREAR TAREA */}
      <TaskForm show={showForm} onClose={() => setShowForm(false)} onCreate={createTask} />
    </div>
  );
}

