import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getTodos = async () => {
  const response = await apiClient.get("/todos/");
  return response.data;
};

export const createTodo = async (todo) => {
  const response = await apiClient.post("/todos/", todo);
  return response.data;
};

export const updateTodo = async (id, todo) => {
  const response = await apiClient.put(`/todos/${id}/`, todo);
  return response.data;
};

export const deleteTodo = async (id) => {
  await apiClient.delete(`/todos/${id}/`);
  return id;
};
