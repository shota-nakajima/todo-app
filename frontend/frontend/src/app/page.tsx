"use client";

import { useState, useEffect } from "react";
import TodoItem from "../components/TodoItem";
import TodoForm from "../components/TodoForm";
import { getTodos, createTodo, updateTodo, deleteTodo } from "../services/api";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const data = await getTodos();
      setTodos(data);
      setError(null);
    } catch (err) {
      setError("タスクの読み込み中にエラーが発生しました");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (newTodo) => {
    try {
      const addedTodo = await createTodo(newTodo);
      setTodos([addedTodo, ...todos]);
    } catch (err) {
      setError("タスクの追加中にエラーが発生しました");
      console.error(err);
    }
  };

  const handleToggleTodo = async (todo) => {
    try {
      const updatedTodo = await updateTodo(todo.id, {
        ...todo,
        completed: !todo.completed,
      });
      setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    } catch (err) {
      setError("タスクの更新中にエラーが発生しました");
      console.error(err);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await deleteTodo(id);
      setTodos(todos.filter((t) => t.id !== id));
    } catch (err) {
      setError("タスクの削除中にエラーが発生しました");
      console.error(err);
    }
  };

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todoアプリ</h1>
      <TodoForm onAdd={handleAddTodo} />

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="text-center">読み込み中...</div>
      ) : (
        <div className="border rounded">
          {todos.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              タスクがありません
            </div>
          ) : (
            todos.map((todo) => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggleTodo}
                onDelete={handleDeleteTodo}
              />
            ))
          )}
        </div>
      )}
    </main>
  );
}
