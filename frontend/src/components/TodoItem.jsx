import React from "react";
import { Trash2 } from "lucide-react";

function TodoItem({ todo, toggleTodo, todoDelete }) {
  return (
    <li className="flex items-center justify-between py-3 border-b border-gray-200">
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          className="w-5 h-5"
          defaultChecked={todo.completed}
          onChange={() => {
            toggleTodo(todo.id);
          }}
        />
        <span
          className={`text-lg ${todo.completed && "text-gray-400 line-through"}`}
        >
          {todo.text}
        </span>
      </label>
      <button className="text-red-500 hover:text-red-600 p-1">
        <Trash2
          size={20}
          onClick={() => {
            todoDelete(todo.id);
          }}
        />
      </button>
    </li>
  );
}

export default TodoItem;
