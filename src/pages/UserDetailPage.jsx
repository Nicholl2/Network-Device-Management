import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
 

export default function UserDetailPage() {
  const userId = window.location.pathname.split("/").pop();
  const [user, setUser] = useState(null);

  const loadData = async () => {
    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    const { data: authData } = await supabase.auth.admin.getUserById(userId);

    setUser({
      ...profile,
      email: authData.user.email,
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!user) return <p>Loading…</p>;

  return (
    <div className="p-10">
        <h1 className="text-3xl font-bold mb-3">User Detail</h1>

        <div className="bg-white p-6 rounded-xl shadow max-w-xl">
          <p><strong>Username:</strong> {user.username}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Joined:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    </div>
  );
}
