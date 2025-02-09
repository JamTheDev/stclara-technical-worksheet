"use client";

import { getAllTodos, createTodo, updateTodo, deleteTodo } from "@/lib/actions/todo.actions";
import { TodolistDispatch, TodolistState } from "@/lib/store";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";


const TodoPage: React.FC = () => {
    const dispatch = useDispatch<TodolistDispatch>();
    const { todos, isLoading, error } = useSelector(
        (state: TodolistState) => state.todos
    );
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    useEffect(() => {
        dispatch(getAllTodos());
    }, [dispatch]);

    const handleAddTodo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;
        await dispatch(createTodo({ title, description: description || null }));
        setTitle("");
        setDescription("");
    };

    const handleToggleComplete = async (id: string, completed: boolean) => {
        const todo = todos.find((t) => t.id === id);
        if (todo) {
            await dispatch(
                updateTodo({
                    id,
                    title: todo.title,
                    description: todo.description,
                    completed: !completed,
                    dueDate: todo.dueDate,
                })
            );
        }
    };

    const handleDelete = async (id: string) => {
        await dispatch(deleteTodo(id));
        dispatch(getAllTodos());
    };

    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-3xl mx-auto bg-white shadow rounded-lg p-6">
          <h1 className="text-3xl font-bold mb-6 text-center text-black">
            Todo List
          </h1>
          <form onSubmit={handleAddTodo} className="mb-8 space-y-4">
            <div>
              <input
                type="text"
                placeholder="Todo Title"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <textarea
                placeholder="Description (optional)"
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition duration-200"
            >
              Add Todo
            </button>
          </form>

          {isLoading && (
            <div className="text-center text-black">Loading todos...</div>
          )}
          {error && (
            <div className="text-center text-red-500 mb-4">{error}</div>
          )}

          <ul className="space-y-4">
            {todos.map((todo) => (
              <li
                key={todo.id}
                className={`flex items-center justify-between p-4 border rounded-md ${
                  todo.completed ? "bg-green-100" : "bg-gray-50"
                }`}
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() =>
                      handleToggleComplete(todo.id, todo.completed)
                    }
                    className="w-5 h-5"
                  />
                  <div>
                    <h2
                      className={`text-xl font-semibold ${
                        todo.completed
                          ? "line-through text-gray-500"
                          : "text-gray-800"
                      }`}
                    >
                      {todo.title}
                    </h2>
                    {todo.description && (
                      <p
                        className={`${
                          todo.completed
                            ? "line-through text-gray-500"
                            : "text-gray-600"
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="text-red-500 hover:text-red-600 transition duration-200"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
};

export default TodoPage;