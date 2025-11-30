import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
 
import { Search } from "lucide-react";

export default function UserPage() {
  const [users, setUsers] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    setLoading(true);

    // 1. Ambil dari profiles (username)
    const { data: profileData } = await supabase
      .from("profiles")
      .select("id, username, created_at");

    setProfiles(profileData || []);

    // 2. Ambil daftar email dari auth.users (via Admin API)
    const { data: authData } = await supabase.auth.admin.listUsers();

    // gabungkan berdasarkan user.id
    const merged = profileData.map((p) => {
      const auth = authData.users.find((u) => u.id === p.id);
      return {
        id: p.id,
        username: p.username,
        email: auth?.email,
        created_at: p.created_at,
      };
    });

    setUsers(merged);
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="p-10">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">Users</h1>
        <p className="text-gray-600 mb-8">List of all registered users.</p>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-xl shadow mb-6 w-72">
          <h2 className="text-gray-500 text-sm">Total Users</h2>
          <p className="text-4xl font-bold">{users.length}</p>
        </div>

        {/* Search */}
        <div className="relative max-w-md mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search username..."
            className="pl-10 pr-4 py-2 w-full border rounded-xl"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-4">Username</th>
                <th className="p-4">Email</th>
                <th className="p-4">Joined</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4">Loading…</td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => (window.location.href = `/users/${u.id}`)}
                  >
                    <td className="p-4 font-medium">{u.username}</td>
                    <td className="p-4">{u.email}</td>
                    <td className="p-4">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </div>
  );
}
