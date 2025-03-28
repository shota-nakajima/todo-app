import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${apiUrl}/todos/`);
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const response = await axios.post(`${apiUrl}/todos/`, {
        title,
        completed: false,
      });
      setTodos([response.data, ...todos]);
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const todo = todos.find((t) => t.id === id);
      await axios.put(`${apiUrl}/todos/${id}/`, {
        ...todo,
        completed: !completed,
      });
      setTodos(
        todos.map((t) => (t.id === id ? { ...t, completed: !completed } : t))
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/todos/${id}/`);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1>Todoアプリ</h1>

      <form
        onSubmit={addTodo}
        style={{ marginBottom: "20px", display: "flex" }}
      >
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="新しいタスクを入力..."
          style={{
            flex: 1,
            padding: "8px",
            marginRight: "10px",
            borderRadius: "4px",
            border: "1px solid #ddd",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "8px 16px",
            background: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          追加
        </button>
      </form>

      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <div>
          {todos.length === 0 ? (
            <p>タスクがありません</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {todos.map((todo) => (
                <li
                  key={todo.id}
                  style={{
                    padding: "10px",
                    borderBottom: "1px solid #eee",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => toggleTodo(todo.id, todo.completed)}
                      style={{ marginRight: "10px" }}
                    />
                    <span
                      style={{
                        textDecoration: todo.completed
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      background: "#f44336",
                      color: "white",
                      border: "none",
                      padding: "5px 10px",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                  >
                    削除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
