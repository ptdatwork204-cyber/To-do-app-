import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

export default function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">

      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-gray-800 shadow-lg p-4">
        <h1 className="text-xl font-bold mb-6 dark:text-white">Todo App</h1>

        <button
          onClick={() => navigate("/todos")}
          className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white mb-1"
        >
          📝 Todos
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white mb-1"
        >
          ⚙️ Settings
        </button>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
            className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white mb-1"
          >
          👮 Admin
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="block w-full text-left p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-white mb-1"
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>

        <button
          onClick={logout}
          className="mt-6 w-full bg-red-500 text-white p-2 rounded"
        >
          Logout
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <Outlet />
      </div>

    </div>
  );
}