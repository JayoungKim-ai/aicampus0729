import React from "react";
import HealthChk from "./HealthChk";
import { Link, NavLink } from "react-router-dom";

function Header() {
  const ACTIVE_CLASS =
    "px-4 py-2 rounded-lg text-body font-semibold text-primary-700 bg-primary-50";

  const INACTIVE_CLASS =
    "px-4 py-2 rounded-lg text-body font-medium text-gray-500 hover:text-primary-700 hover:bg-primary-50 transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-primary-100 backdrop-blur-xl bg-white/85">
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        {/* 로고 */}
        <a href="#" className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-primary-500 rounded-lg flex items-center justify-center text-white font-extrabold text-sm">
            T
          </div>
          <span className="font-bold text-xl text-gray-900 tracking-tight">
            TeamFlow
          </span>
        </a>
        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center gap-1">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }
          >
            팀 소개
          </NavLink>
          <NavLink
            to="/counter"
            className={({ isActive }) =>
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }
          >
            카운터
          </NavLink>
          <NavLink
            to="/todolist"
            className={({ isActive }) =>
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }
          >
            투두리스트
          </NavLink>
          <NavLink
            to="/festivals"
            className={({ isActive }) =>
              isActive ? ACTIVE_CLASS : INACTIVE_CLASS
            }
          >
            축제찾기
          </NavLink>
        </nav>{" "}
        <HealthChk />
      </div>
    </header>
  );
}

export default Header;
