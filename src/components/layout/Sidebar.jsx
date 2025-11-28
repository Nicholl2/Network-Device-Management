import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Server, Info, Users, Menu, ChevronLeft, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadUserProfile();
  }, []);

  const loadUserProfile = async () => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      
      if (authUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", authUser.id)
          .single();

        setUser({
          id: authUser.id,
          email: authUser.email,
          username: profile?.username || "User",
        });
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const linkClass = ({ isActive }) =>
    `flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 rounded-xl transition ${
      isActive ? "bg-blue-50 text-blue-600 font-semibold" : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <div className={`${collapsed ? "w-20" : "w-64"} bg-white border-r h-screen p-4 flex flex-col justify-between overflow-y-auto transition-all duration-200`}>
      {/* Top Section */}
      <div>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                N
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-700">Network Device Management</p>
              </div>
            </div>
          )}

          {collapsed && (
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              N
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? (
              <Menu className="w-5 h-5" />
            ) : (
              <ChevronLeft className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavLink to="/home" className={linkClass}>
            <Home className="w-5 h-5" />
            {!collapsed && <span>Dashboard</span>}
          </NavLink>

          <NavLink to="/devices" className={linkClass}>
            <Server className="w-5 h-5" />
            {!collapsed && <span>Network Devices</span>}
          </NavLink>

          <NavLink to="/users" className={linkClass}>
            <Users className="w-5 h-5" />
            {!collapsed && <span>Users</span>}
          </NavLink>

          <NavLink to="/about" className={linkClass}>
            <Info className="w-5 h-5" />
            {!collapsed && <span>About</span>}
          </NavLink>
        </nav>
      </div>

      {/* Bottom Section - User Profile */}
      <div className="border-t pt-4">
        {!loading && user ? (
          <>
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3 mb-3`}>
              <div className="w-10 h-10 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                {user.username.charAt(0).toUpperCase()}
              </div>
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-gray-800 truncate">
                    {user.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
              )}
            </div>

            <button
              onClick={handleLogout}
              className={`w-full flex items-center ${
                collapsed ? "justify-center" : "gap-3"
              } p-3 rounded-xl text-red-600 hover:bg-red-50 transition font-semibold text-sm`}
            >
              <LogOut className="w-5 h-5" />
              {!collapsed && <span>Logout</span>}
            </button>
          </>
        ) : (
          <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"} p-3`}>
            <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
            {!collapsed && (
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                <div className="h-2 bg-gray-200 rounded animate-pulse w-32" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}