// src/pages/Week.jsx
import { useMemo } from "react";
import { useTasks } from "../contexts/TasksContext";

function formatDay(date) {
  return date.toISOString().slice(0, 10);
}

export default function WeekPage() {
  const { tasks, toggleComplete } = useTasks();

  // Calculamos los 7 días desde hoy
  const days = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const arr = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      arr.push(d);
    }
    return arr;
  }, []);

  const tasksByDay = (dayIso) =>
    tasks.filter((t) => t.dueDate && t.dueDate.slice(0, 10) === dayIso);

  const progressForScope = (scope) => {
    const scopeTasks = tasks.filter((t) => t.scope === scope);
    if (scopeTasks.length === 0) return 0;
    const done = scopeTasks.filter((t) => t.status === "done").length;
    return Math.round((done / scopeTasks.length) * 100);
  };

  // 🔹 Progreso total de la semana
  const totalProgress = (() => {
    if (tasks.length === 0) return 0;
    const done = tasks.filter((t) => t.status === "done").length;
    return Math.round((done / tasks.length) * 100);
  })();

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* 🔹 Título principal */}
      <h1 className="text-3xl font-semibold mb-2 text-slate-800">Semana</h1>

      {/* 🔹 Barra de progreso general */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-slate-600 font-medium">
            Progreso semanal
          </span>
          <span className="text-sm text-blue-600 font-semibold">
            {totalProgress}%
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all"
            style={{ width: `${totalProgress}%` }}
          />
        </div>
      </div>

      {/* 🔹 Barra de progreso general por categoría */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {["hogar", "trabajo", "personal"].map((scope) => (
          <div
            key={scope}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium capitalize text-slate-700">
                {scope}
              </span>
              <span className="text-sm text-slate-500">
                {progressForScope(scope)}%
              </span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${progressForScope(scope)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Vista semanal */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-4">
        {days.map((d) => {
          const iso = formatDay(d);
          const list = tasksByDay(iso);
          const dayName = d.toLocaleDateString(undefined, {
            weekday: "short",
            day: "numeric",
          });
          const today = new Date().toDateString() === d.toDateString();

          return (
            <div
              key={iso}
              className={`rounded-2xl p-4 border shadow-sm bg-white hover:shadow-md transition-all duration-200 ${
                today ? "border-blue-400 bg-blue-50/50" : "border-slate-200"
              }`}
            >
              <div className="flex justify-between items-center mb-3">
                <span
                  className={`font-semibold text-slate-800 ${
                    today ? "text-blue-600" : ""
                  }`}
                >
                  {dayName}
                </span>
                {today && (
                  <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full">
                    Hoy
                  </span>
                )}
              </div>

              {/* 🔸 Lista de tareas */}
              <div className="flex flex-col gap-2 overflow-y-auto max-h-48 sidebar-scroll">
                {list.map((t) => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                      t.status === "done"
                        ? "bg-green-50 text-green-600 line-through"
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex-1 text-sm font-medium truncate">
                      {t.title}
                      <div className="text-xs text-slate-500 capitalize">
                        {t.scope}
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={t.status === "done"}
                      onChange={() => toggleComplete(t.id)}
                      className="accent-blue-500 w-4 h-4"
                    />
                  </div>
                ))}

                {list.length === 0 && (
                  <div className="text-xs text-slate-400 italic text-center py-3">
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
