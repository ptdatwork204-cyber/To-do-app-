import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";


export default function Layout() {
  const navigate = useNavigate();
  const { user } = useAuth();
  console.log(user);
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-4">
        <h1 className="text-xl font-bold mb-6">Todo App</h1>

        <button
          onClick={() => navigate("/todos")}
          className="block w-full text-left p-2 rounded hover:bg-gray-100"
        >
          📝 Todos
        </button>

        <button
          onClick={() => navigate("/settings")}
          className="block w-full text-left p-2 rounded hover:bg-gray-100"
        >
          ⚙️ Settings
        </button>

        {user?.role === "ADMIN" && (
          <button
            onClick={() => navigate("/admin")}
            className="block w-full text-left p-2 rounded hover:bg-gray-100"
          >
          👮 Admin
          </button>
        )}

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