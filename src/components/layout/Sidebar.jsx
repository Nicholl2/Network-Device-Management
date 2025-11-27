import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Home, Users, Server, Info, Zap, Menu, ChevronLeft } from "lucide-react";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);

  const containerClass = `${collapsed ? "w-20" : "w-64"} bg-white border-r h-screen p-4 flex flex-col overflow-y-auto transition-all duration-200`;

  const linkBase = ({ isActive }) =>
    `flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 rounded-xl hover:bg-gray-100 transition ${
      isActive ? "bg-blue-50 text-blue-600 font-semibold" : ""
    }`;

  return (
    <div className={containerClass}>
      <div className="flex items-center justify-between mb-6 px-2">
        <div className="flex items-center gap-3">
          <div className={`text-2xl font-bold text-blue-600 ${collapsed ? 'mx-auto' : ''}`}>
            {collapsed ? 'NDM' : 'Network Device Management'}
          </div>
        </div>

        <button
          onClick={() => setCollapsed((s) => !s)}
          className="p-2 rounded-md hover:bg-gray-100"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <Menu className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      <nav className="space-y-3 flex-1">
        <NavLink to="/home" className={linkBase}>
          <Home className="w-5 h-5" />
          {!collapsed && <span>Home</span>}
        </NavLink>

        <NavLink to="/devices" className={linkBase}>
          <Server className="w-5 h-5" />
          {!collapsed && <span>Network Devices</span>}
        </NavLink>

        <NavLink to="/templates" className={linkBase}>
          <Zap className="w-5 h-5" />
          {!collapsed && <span>Templates</span>}
        </NavLink>

        <NavLink to="/users" className={linkBase}>
          <Users className="w-5 h-5" />
          {!collapsed && <span>Users</span>}
        </NavLink>

        <NavLink to="/about" className={linkBase}>
          <Info className="w-5 h-5" />
          {!collapsed && <span>About</span>}
        </NavLink>
      </nav>
    </div>
  );
}