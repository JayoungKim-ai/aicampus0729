import { useState, useEffect } from "react";
import TodoItem from "../components/TodoItem";

function TodoList() {
  const STORAGE_KEY = "todos";

  // 할 일 목록 -------------------
  const [todos, setTodos] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    } else {
      return [];
    }
  });

  // 할 일 입력 제어 컴포넌트 -------------------
  const [todoInput, setTodoInput] = useState("");

  // 필터 상태: "all" | "active" | "completed" -------------------
  const [filter, setFilter] = useState("all");

  // 할 일 완료 토글 함수 ----------------------
  function toggleTodo(id) {
    const updatetedTodos = todos.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t,
    );
    setTodos(updatetedTodos);
  }

  // 할 일 삭제 함수 ---------------------
  function todoDelete(id) {
    const updatedTodos = todos.filter((t) => t.id != id);
    setTodos(updatedTodos);
  }

  // 할 일 추가 함수 --------------------------
  function addTodo() {
    if (!todoInput.trim()) return;
    const newTodo = { id: Date.now(), text: todoInput, completed: false }; // 새로운 할일
    setTodos([...todos, newTodo]); // 새로운 할 일을 배열에 추가
    setTodoInput("");
  }

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  // 화면에 보여줄 목록 (원본은 그대로, 화면만 걸러냄) --------------------------
  const visibleTodos = todos.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "active") return !t.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center py-20">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-md border border-gray-200">
        {/* 헤더 */}
        <h1 className="text-3xl font-bold text-center mb-6">📝 투두리스트</h1>

        {/* 입력창 & 버튼 */}
        <div className="flex gap-2 mb-6">
          <input
            type="text"
            placeholder="할 일을 입력하세요"
            className="flex-1 border border-gray-300 rounded px-4 py-3 outline-none"
            value={todoInput}
            onChange={(e) => {
              setTodoInput(e.target.value);
            }}
            onKeyUp={(e) => {
              if (e.key === "Enter") addTodo();
            }}
          />
          <button
            onClick={addTodo}
            className="bg-purple-500 text-white font-bold px-6 py-3 rounded"
          >
            추가
          </button>
        </div>
        <div>
          <button
            className="bg-gray-100"
            onClick={() => setFilter("completed")}
          >
            완료된것만보기
          </button>

          <button className="bg-blue-100" onClick={() => setFilter("active")}>
            미완료만보기
          </button>
          <button className="bg-red-100" onClick={() => setFilter("all")}>
            전체보기
          </button>
        </div>
        {/* 할 일 목록 */}
        <ul className="max-h-[400px] overflow-y-auto pr-2">
          {visibleTodos.map((t) => (
            <TodoItem
              key={t.id}
              todo={t}
              toggleTodo={toggleTodo}
              todoDelete={todoDelete}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

export default TodoList;
