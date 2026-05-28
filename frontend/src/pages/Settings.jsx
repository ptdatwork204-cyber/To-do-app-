import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function Settings() {
  const { user, token, refreshUser } = useAuth();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.displayName || "");
    }
  }, [user]);

  const saveName = async () => {
  try {
    await axios.put(
      "http://localhost:8080/api/user/display-name",
      { displayName: name },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    await refreshUser();

    alert("Updated successfully!");
  } catch (err) {
    console.error(err);
    alert("Failed to update name");
  }
};

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-lg mt-10 bg-white dark:bg-gray-800 p-6 rounded-xl shadow">

        <h1 className="text-2xl font-bold mb-6 dark:text-white">Settings</h1>

        {/* EMAIL (read-only) */}
        <div className="mb-4">
          <label className="text-gray-600 dark:text-gray-300 text-sm">Email</label>
          <div className="border p-2 rounded bg-gray-100 dark:bg-gray-700 dark:text-white dark:border-gray-600">
            {user?.email}
          </div>
        </div>

        {/* DISPLAY NAME */}
        <div className="mb-4">
          <label className="text-gray-600 dark:text-gray-300 text-sm">Display Name</label>
          <input
            className="w-full border p-2 rounded dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* DARK MODE TOGGLE */}
        <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="dark:text-white">Dark Mode</span>
            <button
              onClick={toggleDarkMode}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              {darkMode ? "Disable" : "Enable"}
            </button>
          </div>
        </div>

        {/* SAVE BUTTON */}
        <button
          onClick={saveName}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded w-full"
        >
          {loading ? "Saving..." : "Save Changes"}
        </button>

        {/* BACK BUTTON */}
        <button
          onClick={() => navigate("/todos")}
          className="mt-3 text-gray-600 dark:text-gray-400 w-full"
        >
          ← Back to Todos
        </button>

      </div>
    </div>
  );
}

export default Settings;