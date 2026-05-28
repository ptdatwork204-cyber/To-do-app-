import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

function TodoPage() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { darkMode } = useTheme();

  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [repeatType, setRepeatType] = useState("NONE");
  const [category, setCategory] = useState("Personal");

  const API = "http://localhost:8080/api/todos";

  const getAuthHeader = () => ({
    Authorization: `Bearer ${token}`,
  });

  const fetchTodos = async () => {
    try {
      const res = await axios.get(API, {
        headers: getAuthHeader(),
      });

      setTodos(res.data);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch todos");
    }
  };

  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        API,
        {
          title,
          priority,
          dueDate,
          repeatType,
          category,
        },
        {
          headers: getAuthHeader(),
        }
      );

      setTitle("");
      setPriority("MEDIUM");
      setDueDate("");
      setRepeatType("NONE");
      setCategory("Personal");

      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to add todo");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: getAuthHeader(),
      });

      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to delete todo");
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { completed: !completed },
        {
          headers: getAuthHeader(),
        }
      );

      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to update todo");
    }
  };

  const updatePriority = async (id, newPriority) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { priority: newPriority },
        {
          headers: getAuthHeader(),
        }
      );

      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to update priority");
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTodos();
  }, [token]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex justify-center">
      <div className="w-full max-w-2xl mt-10 bg-white dark:bg-gray-800 shadow-lg rounded-xl p-6">

        <h1 className="text-3xl font-bold text-center mb-2 dark:text-white">
          Todo App
        </h1>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          Welcome, {user?.displayName || user?.email}
        </p>

        <div className="space-y-3 mb-8">

          <input
            className="w-full border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter task"
          />

          <div className="flex gap-2 flex-wrap">

            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="LOW">LOW</option>
              <option value="MEDIUM">MEDIUM</option>
              <option value="HIGH">HIGH</option>
            </select>

            <select
              value={repeatType}
              onChange={(e) => setRepeatType(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="NONE">No Repeat</option>
              <option value="DAILY">Daily</option>
              <option value="WEEKLY">Weekly</option>
              <option value="MONTHLY">Monthly</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            >
              <option value="Work">Work</option>
              <option value="Study">Study</option>
              <option value="Personal">Personal</option>
            </select>

            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 border rounded-lg px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            />

            <button
              onClick={addTodo}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add
            </button>

          </div>
        </div>

        <ul className="space-y-3">

          {todos.map((t) => {

            const isOverdue =
              t.dueDate &&
              new Date(t.dueDate) < new Date() &&
              !t.completed;

            const category = (t.category || "").trim();

            return (
              <li
                key={t.id}
                className="flex items-center justify-between border p-4 rounded-xl bg-white dark:bg-gray-700 dark:border-gray-600"
              >

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={t.completed}
                    onChange={() =>
                      toggleTodo(t.id, t.completed)
                    }
                    className="mt-1"
                  />

                  <div>

                    <p
                      className={
                        t.completed
                          ? "line-through text-gray-400 font-medium dark:text-gray-500"
                          : "font-medium dark:text-white"
                      }
                    >
                      {t.title}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2 text-sm">

                      <span
                        className={
                          isOverdue
                            ? "text-red-600 font-semibold"
                            : t.completed
                            ? "text-green-600 font-semibold"
                            : "text-yellow-600 font-semibold"
                        }
                      >
                        {isOverdue
                          ? "OVERDUE"
                          : t.completed
                          ? "Completed"
                          : "Pending"}
                      </span>

                      <select
                        value={t.priority}
                        onChange={(e) => updatePriority(t.id, e.target.value)}
                        className={
                          t.priority === "HIGH"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs border-none cursor-pointer"
                            : t.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200 px-2 py-1 rounded-full text-xs border-none cursor-pointer"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs border-none cursor-pointer"
                        }
                      >
                        <option value="LOW">LOW</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="HIGH">HIGH</option>
                      </select>

                      <span
                        className={
                          category === "Work"
                            ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200 px-2 py-1 rounded-full text-xs"
                            : category === "Study"
                            ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded-full text-xs"
                            : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full text-xs"
                        }
                      >
                        {category || "No Category"}
                      </span>

                      {t.repeatType !== "NONE" && (
                        <span className="bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200 px-2 py-1 rounded-full text-xs">
                          {t.repeatType}
                        </span>
                      )}

                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      Due:{" "}
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleString()
                        : "No due date"}
                    </p>

                  </div>
                </div>

                <button
                  onClick={() => deleteTodo(t.id)}
                  className="text-red-500 hover:text-red-700 font-medium"
                >
                  Delete
                </button>

              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default TodoPage;