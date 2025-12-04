// src/components/layout/BottomNavbar.jsx
import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Home, Server, Info, Users, LogOut } from "lucide-react";
import { supabase } from "../../lib/supabaseClient";
import { useUserRole } from "../../hooks/useUserRole";

export default function BottomNavbar() {
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAdmin } = useUserRole();
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function loadUser() {
      try {
        const { data } = await supabase.auth.getUser();
        const authUser = data?.user;
        if (authUser && mounted) {
          try {
            const { data: profile } = await supabase
              .from("profiles")
              .select("username, role")
              .eq("id", authUser.id)
              .single();

            setUser({
              id: authUser.id,
              email: authUser.email,
              username: profile?.username || authUser.email.split("@")[0],
              role: profile?.role || "observer",
            });
          } catch {
            setUser({ id: authUser.id, email: authUser.email, username: authUser.email.split("@")[0], role: "observer" });
          }
        }
      } catch (err) {
        console.error("Error loading user in bottom nav:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition ${
      isActive
        ? "text-blue-600 bg-blue-50"
        : "text-gray-600 hover:text-gray-800"
    }`;

  return (
    <>
      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-center justify-around py-2 z-40">
        <NavLink to="/home" className={navLinkClass}>
          <Home className="w-6 h-6" />
          <span className="text-xs font-semibold">Home</span>
        </NavLink>

        <NavLink to="/devices" className={navLinkClass}>
          <Server className="w-6 h-6" />
          <span className="text-xs font-semibold">Devices</span>
        </NavLink>

        {/* Show Users link only for admin */}
        {isAdmin && (
          <NavLink to="/users" className={navLinkClass}>
            <Users className="w-6 h-6" />
            <span className="text-xs font-semibold">Users</span>
          </NavLink>
        )}

        <NavLink to="/about" className={navLinkClass}>
          <Info className="w-6 h-6" />
          <span className="text-xs font-semibold">About</span>
        </NavLink>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center justify-center py-2 px-3 rounded-full text-gray-600 hover:text-gray-800 bg-white border border-gray-100"
            aria-label="Account menu"
          >
            {!loading && user ? (
              <div className="w-7 h-7 rounded-full bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </div>
            ) : (
              <div className="w-7 h-7 rounded-full bg-gray-200" />
            )}
          </button>

          {/* Dropdown Menu */}
          {showMenu && (
            <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-200 rounded-lg shadow-lg min-w-[200px]">
              <div className="p-4">
                {user ? (
                  <div className="mb-3">
                    <p className="font-semibold text-gray-800">{user.username}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    <p className="text-xs text-gray-400 mt-1">{user.role === 'admin' ? '👑 Admin' : '👁️ Observer'}</p>
                  </div>
                ) : (
                  <div className="mb-3">
                    <p className="text-sm text-gray-500">Not signed in</p>
                  </div>
                )}

                <div className="pt-2 border-t">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="text-sm font-semibold">Logout</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer untuk bottom nav */}
      <div className="h-20" />
    </>
  );
}