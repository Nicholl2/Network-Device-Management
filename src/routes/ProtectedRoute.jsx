// src/routes/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    async function check() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
    }
    check();
  }, []);

  if (loading) return <div>Loading...</div>;

  // ❌ kalau belum login → lempar ke login
  if (!session) return <Navigate to="/login" replace />;

  // ✔️ kalau sudah login → tampilkan halaman
  return children;
}
