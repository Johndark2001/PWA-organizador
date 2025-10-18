// src/components/Navbar.jsx
import { NavLink, useNavigate } from "react-router-dom";
import { useSession } from "../contexts/SessionContext";
import {
  Sun,
  CalendarDays,
  LayoutDashboard,
  Timer,
  Brain,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const { user, signOut, isAuthenticated } = useSession();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate("/");
  };

  const menu = [
    { to: "/today", label: "Hoy", icon: <Sun size={18} /> },
    { to: "/week", label: "Semana", icon: <CalendarDays size={18} /> },
    { to: "/kanban", label: "Kanban", icon: <LayoutDashboard size={18} /> },
    { to: "/pomodoro", label: "Pomodoro", icon: <Timer size={18} /> },
    { to: "/eisenhower", label: "Eisenhower", icon: <Brain size={18} /> },
  ];

  if (!isAuthenticated) return null;

  return (
    <aside className="w-64 bg-blue-600 text-white flex flex-col">
      {/* Encabezado */}
      <div className="p-5 border-b border-blue-500 flex items-center gap-3">
        <img
          src={user?.picture}
          alt="avatar"
          className="w-10 h-10 rounded-full border-2 border-white"
        />
        <div>
          <p className="font-semibold leading-tight">{user?.name}</p>
          <p className="text-xs text-blue-100">Conectado</p>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3 sidebar-scroll space-y-1">
        {menu.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-500 text-white shadow-sm"
                  : "text-blue-100 hover:bg-blue-500/40 hover:text-white"
              }`
            }
          >
            {item.icon}
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Botón salir */}
      <div className="p-4 border-t border-blue-500">
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 text-blue-100 hover:text-white transition-colors"
        >
          <LogOut size={18} />
          <span>Salir</span>
        </button>
      </div>
    </aside>
  );
}
