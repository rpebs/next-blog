"use client";
import { useState } from "react";

const AdminNavbarNavbar = ({ onSidebarToggle }) => {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <button
          onClick={onSidebarToggle}
          className="text-white lg:hidden"
          aria-controls="sidebar-multi-level-sidebar"
          aria-expanded="false"
        >
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              clipRule="evenodd"
              fillRule="evenodd"
              d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
            ></path>
          </svg>
        </button>
        <h1 className="text-xl font-semibold">My Application</h1>
        <div>
          {/* Add other navbar items here */}
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
