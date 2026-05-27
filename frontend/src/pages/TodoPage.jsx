import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function TodoPage() {
  const navigate = useNavigate();
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const { user,  token } = useAuth(); 
  const [repeatType, setRepeatType] = useState("NONE");
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");

  const API = "http://localhost:8080/api/todos";

  // auth header
  const getAuthHeader = () => ({
    Authorization: `Bearer ${token}`,
  });

  // fetch todos
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

  // add todo
  const addTodo = async () => {
    if (!title.trim()) return;

    try {
      await axios.post(
        API,
        { title, priority, dueDate, repeatType },
        { headers: getAuthHeader() }
      );

      setTitle("");
      setPriority("MEDIUM");
      setDueDate("");
      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to add todo");
    }
  };

  // delete
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

  // toggle
  const toggleTodo = async (id, completed) => {
    try {
      await axios.put(
        `${API}/${id}`,
        { completed: !completed },
        { headers: getAuthHeader() }
      );

      fetchTodos();
    } catch (err) {
      console.error(err);
      alert("Failed to update todo");
    }
  };

    

  // load todos + auth check
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    fetchTodos();
  }, [token]);

    

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-xl mt-10 bg-white shadow-lg rounded-xl p-6">

        <h1 className="text-2xl font-bold text-center">Todo App</h1>

        {/* REAL USER DATA FROM BACKEND */}
        <p className="text-center text-gray-600 mb-4">
          Welcome, {user?.displayName || user?.email}
        </p>

        

        {/* add todo */}
      <div className="space-y-3 mb-6">

        <input
          className="w-full border rounded-lg px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task"
        />

        <div className="flex gap-2 flex-wrap">
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>

          <select
            value={repeatType}
            onChange={(e) => setRepeatType(e.target.value)}
            className="border rounded-lg px-3 py-2"
          >
            <option value="NONE">No Repeat</option>
            <option value="DAILY">Daily</option>
            <option value="WEEKLY">Weekly</option>
            <option value="MONTHLY">Monthly</option>
          </select>
          
          <input
            type="datetime-local"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="flex-1 border rounded-lg px-3 py-2"
          />

          <button
            onClick={addTodo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            Add
          </button>

        </div>
      </div>
                
        {/* list */}
        <ul className="space-y-2">
          {todos.map((t) => (
            <li
              key={t.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggleTodo(t.id, t.completed)}
                />

                <div>
                  <p className={t.completed ? "line-through text-gray-400" : ""}>
                    {t.title}
                  </p>

                  <div className="flex gap-3 text-sm text-gray-500">
                    <span>Priority: {t.priority}</span>

                    <span>
                      Due: {t.dueDate
                        ? new Date(t.dueDate).toLocaleString()
                        : "No due date"}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => deleteTodo(t.id)}
                className="text-red-500"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        

      </div>
    </div>
  );
    
}

export default TodoPage;