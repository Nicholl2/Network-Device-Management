import { NavLink } from "react-router-dom";
import { Home, Users, Server, Info } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="w-64 bg-white border-r h-screen p-6 flex flex-col">
      <h1 className="text-2xl font-bold mb-8 text-blue-600">
        Network Device Management
      </h1>

      <nav className="space-y-3 flex-1">

        <NavLink
          to="/home"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition ${
              isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`
          }
        >
          <Home /> Home
        </NavLink>

        <NavLink
          to="/devices"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition ${
              isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`
          }
        >
          <Server /> Network Devices
        </NavLink>

        <NavLink
          to="/users"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition ${
              isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`
          }
        >
          <Users /> Users
        </NavLink>

        <NavLink
          to="/about"
          className={({ isActive }) =>
            `flex items-center gap-3 p-3 rounded-xl hover:bg-gray-100 transition ${
              isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
            }`
          }
        >
          <Info /> About
        </NavLink>

      </nav>
    </div>
  );
}