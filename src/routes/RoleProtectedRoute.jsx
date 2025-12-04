import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authService } from "../lib/authService";

export default function RoleProtectedRoute({ children, requiredRole = "admin" }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function check() {
      const userData = await authService.getCurrentUserWithRole();
      setUser(userData);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  if (!user) return <Navigate to="/login" replace />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/home" replace />;
  }

  return children;
}