// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SessionProvider, useSession } from "./contexts/SessionContext";
import { TasksProvider } from "./contexts/TasksContext";
import Navbar from "./components/Navbar";
import LoginPage from "./pages/Login";
import TodayPage from "./pages/Today";
import WeekPage from "./pages/Week";
import KanbanPage from "./pages/Kanban";
import PomodoroPage from "./pages/Pomodoro";
import EisenhowerPage from "./pages/Eisenhower";

function AppRoutes() {
  const { isAuthenticated } = useSession();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/*" element={<LoginPage />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <Navbar />
      <main className="flex-1 flex flex-col">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-700">Organizador</h1>
          <div className="text-sm text-gray-500">Sincronizado con Google ✅</div>
        </header>

        {/* Contenido dinámico */}
        <div className="flex-1 overflow-y-auto p-6">
          <Routes>
            <Route path="/" element={<Navigate to="/today" replace />} />
            <Route path="/today" element={<TodayPage />} />
            <Route path="/week" element={<WeekPage />} />
            <Route path="/kanban" element={<KanbanPage />} />
            <Route path="/pomodoro" element={<PomodoroPage />} />
            <Route path="/eisenhower" element={<EisenhowerPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <SessionProvider>
      <TasksProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </TasksProvider>
    </SessionProvider>
  );
}
