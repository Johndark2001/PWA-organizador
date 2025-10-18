// src/pages/Kanban.jsx
import { useState, useMemo } from "react";
import { useTasks } from "../contexts/TasksContext";

export default function KanbanPage() {
  const { tasks, moveTaskStatus } = useTasks();
  const [tagFilter, setTagFilter] = useState("");

  // 🟢 Recolectar todas las etiquetas existentes
  const allTags = useMemo(() => {
    const tagSet = new Set();
    tasks.forEach((t) => (t.tags || []).forEach((tg) => tagSet.add(tg)));
    return Array.from(tagSet);
  }, [tasks]);

  const cols = [
    { id: "pending", title: "Pendiente", accent: "border-slate-300" },
    { id: "inprogress", title: "En curso", accent: "border-blue-300" },
    { id: "done", title: "Hecho", accent: "border-green-300" },
  ];

  const onDragStart = (e, id) => e.dataTransfer.setData("text/plain", id);

  const onDrop = (e, status) => {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    moveTaskStatus(id, status);
  };

  const onDragOver = (e) => e.preventDefault();

  // 🧠 Filtrado de tareas según etiqueta seleccionada
  const filteredTasks = useMemo(() => {
    if (!tagFilter) return tasks;
    return tasks.filter((t) => (t.tags || []).includes(tagFilter));
  }, [tasks, tagFilter]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <h1 className="text-3xl font-semibold text-slate-800">Kanban</h1>

        {/* 🔍 Selector de etiquetas */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-slate-600">Filtrar por etiqueta:</label>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
          >
            <option value="">Todas</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-x-auto">
        {cols.map((col) => {
          const tasksInCol = filteredTasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              onDragOver={onDragOver}
              onDrop={(e) => onDrop(e, col.id)}
              className={`rounded-2xl border ${col.accent} bg-white shadow-sm p-4 flex flex-col min-h-[70vh] transition-all hover:shadow-md`}
            >
              {/* Título de columna */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      col.id === "pending"
                        ? "bg-slate-400"
                        : col.id === "inprogress"
                        ? "bg-blue-400"
                        : "bg-green-400"
                    }`}
                  ></span>
                  {col.title}
                </h2>
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                  {tasksInCol.length}
                </span>
              </div>

              {/* Tareas */}
              <div className="flex-1 flex flex-col gap-2 overflow-y-auto sidebar-scroll">
                {tasksInCol.map((t) => (
                  <div
                    key={t.id}
                    draggable
                    onDragStart={(e) => onDragStart(e, t.id)}
                    className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-slate-50 cursor-grab active:cursor-grabbing transition-all"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-slate-800">{t.title}</div>
                        <div className="text-xs text-slate-500 mt-1 capitalize">
                          {t.scope} • prioridad {t.priority}
                        </div>
                        {t.dueDate && (
                          <div className="text-xs text-slate-400 mt-0.5">
                            vence {t.dueDate}
                          </div>
                        )}
                        {t.tags?.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {t.tags.map((tg) => (
                              <span
                                key={tg}
                                className="text-[10px] px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full"
                              >
                                #{tg}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {tasksInCol.length === 0 && (
                  <div className="text-xs text-slate-400 text-center italic py-8">
                    Sin tareas
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
