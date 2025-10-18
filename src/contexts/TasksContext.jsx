/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { useSession } from "./SessionContext";
import { db } from "../db/indexedDB";
import { v4 as uuidv4 } from "uuid";
import { enqueueChange, initSyncListener, syncPendingData } from "../db/syncService";

const TasksContext = createContext();
export function useTasks() { return useContext(TasksContext); }

export function TasksProvider({ children }) {
  const { user } = useSession();
  const [tasks, setTasks] = useState([]);
  const [metrics, setMetrics] = useState({
    focusedMinutesToday: 0,
    streakDays: 0,
    lastActiveDate: null,
  });

  useEffect(() => { initSyncListener(); }, []);

  // 🟢 Cargar tareas y métricas
  useEffect(() => {
    if (!user?.sub) return;
    const load = async () => {
      const userTasks = await db.tasks.where("userSub").equals(user.sub).toArray();
      setTasks(userTasks);
      const today = new Date().toISOString().slice(0, 10);
      const metric = await db.metrics.get({ userSub: user.sub, date: today });
      if (metric) setMetrics(metric);
    };
    load();
  }, [user]);

  // 🟢 Crear tarea
  const createTask = async (task) => {
    if (!user?.sub) return;
    const newTask = {
      id: uuidv4(),
      userSub: user.sub,
      title: task.title || "Tarea sin título",
      scope: task.scope || "personal",
      priority: task.priority || "media",
      dueDate: task.dueDate || null,
      tags: task.tags || [], // 🆕 soporte de etiquetas
      status: "pending",
      synced: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await db.tasks.add(newTask);
    setTasks((prev) => [newTask, ...prev]);
    await enqueueChange("task", newTask, user.sub);
    if (navigator.onLine) syncPendingData();
  };

  // 🟢 Actualizar tarea
  const updateTask = async (id, patch) => {
    const updatedAt = new Date().toISOString();
    await db.tasks.update(id, { ...patch, updatedAt, synced: false });
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...patch, updatedAt } : t))
    );

    const updated = tasks.find((t) => t.id === id);
    if (updated) await enqueueChange("task", { ...updated, ...patch }, user?.sub);
    if (navigator.onLine) syncPendingData();
  };

  // 🟢 Eliminar tarea
  const deleteTask = async (id) => {
    await db.tasks.delete(id);
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await enqueueChange("task", { id, deleted: true }, user?.sub);
    if (navigator.onLine) syncPendingData();
  };

  // 🟢 Alternar completado
  const toggleComplete = async (id) => {
    const t = tasks.find((x) => x.id === id);
    if (!t) return;
    const newStatus = t.status === "done" ? "pending" : "done";
    await updateTask(id, { status: newStatus });
  };

  // 🟢 Filtrar tareas de hoy
  const tasksForToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    return tasks.filter(
      (t) => t.status !== "done" && (!t.dueDate || t.dueDate.slice(0, 10) === today)
    );
  };

  // 🟢 Métricas sincronizables
  const addFocusedMinutes = async (minutes) => {
    if (!user?.sub) return;
    const today = new Date().toISOString().slice(0, 10);
    let current = await db.metrics.get({ userSub: user.sub, date: today });

    if (!current) {
      const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
      const prevMetric = await db.metrics.get({ userSub: user.sub, date: yesterday });
      const streak = prevMetric ? (prevMetric.streakDays || 0) + 1 : 1;

      current = {
        userSub: user.sub,
        date: today,
        focusedMinutesToday: minutes,
        streakDays: streak,
        lastActiveDate: today,
      };
      await db.metrics.put(current);
      setMetrics(current);
      await enqueueChange("metric", current, user.sub);
    } else {
      const updated = {
        ...current,
        focusedMinutesToday: (current.focusedMinutesToday || 0) + minutes,
        lastActiveDate: today,
      };
      await db.metrics.put(updated);
      setMetrics(updated);
      await enqueueChange("metric", updated, user.sub);
    }

    if (navigator.onLine) syncPendingData();
  };

  const value = {
    tasks,
    createTask,
    updateTask,
    deleteTask,
    toggleComplete,
    tasksForToday,
    metrics,
    addFocusedMinutes,
  };

  return <TasksContext.Provider value={value}>{children}</TasksContext.Provider>;
}
