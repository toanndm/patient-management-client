// Sidebar.js
import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUser,
  faChevronLeft,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  return (
    <div
      className={`relative ${
        isOpen ? "w-48" : "w-16"
      } h-screen bg-gray-800 text-white transition-width duration-300`}
    >
      <div className="flex flex-col justify-between w-full">
        <div>
          <button
            className="p-4 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <FontAwesomeIcon icon={isOpen ? faChevronLeft : faChevronRight} />
          </button>
          <nav className="mt-4">
            <ul>
              <li
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer ${
                  location.pathname === "/" ? "bg-gray-600" : ""
                }`}
              >
                <Link to="/" className="flex items-center w-full">
                  <FontAwesomeIcon icon={faHome} className="mr-4" />
                  {isOpen && <span>Home</span>}
                </Link>
              </li>
              <li
                className={`flex items-center p-4 hover:bg-gray-700 cursor-pointer ${
                  location.pathname === "/patient" ? "bg-gray-600" : ""
                }`}
              >
                <Link to="/patient" className="flex items-center w-full">
                  <FontAwesomeIcon icon={faUser} className="mr-4" />
                  {isOpen && <span>Patient</span>}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
