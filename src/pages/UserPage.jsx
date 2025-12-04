import React, { useEffect, useState } from "react";
import { authService } from "../lib/authService";
import { useUserRole } from "../hooks/useUserRole";
import { Search, Plus, Trash2, Edit, Shield } from "lucide-react";

export default function UserPage() {
  const { isAdmin } = useUserRole();
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [editingRole, setEditingRole] = useState(null);
  
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    role: "observer",
  });

  const loadUsers = async () => {
    try {
      const users = await authService.getAllUsers();
      setUsers(users);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleAddUser = async () => {
    if (!formData.email.trim() || !formData.username.trim() || !formData.password.trim()) {
      alert("Harap isi semua field!");
      return;
    }

    try {
      const result = await authService.createUserByAdmin(
        formData.email,
        formData.password,
        formData.username,
        formData.role
      );

      if (result.success) {
        alert("User berhasil dibuat!");
        resetForm();
        loadUsers();
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const result = await authService.updateUserRole(userId, newRole);
      if (result.success) {
        setEditingRole(null);
        loadUsers();
        alert("Role berhasil diupdate!");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDeleteUser = async (userId, username) => {
    if (!confirm(`Yakin ingin menghapus user ${username}?`)) return;

    try {
      const result = await authService.deleteUser(userId);
      if (result.success) {
        loadUsers();
        alert("User berhasil dihapus!");
      } else {
        alert("Error: " + result.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      email: "",
      username: "",
      password: "",
      role: "observer",
    });
  };

  const filteredUsers = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      (u.email && u.email.toLowerCase().includes(search.toLowerCase()))
  );

  if (!isAdmin) {
    return (
      <div className="p-10">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <h2 className="text-xl font-bold text-yellow-800 mb-2">Access Denied</h2>
          <p className="text-yellow-700">Hanya admin yang dapat mengakses halaman ini.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Users Management</h1>
          <p className="text-gray-600 mt-2">Kelola pengguna dan role mereka</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
        >
          <Plus className="w-5 h-5" />
          Add User
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Total Users</p>
          <p className="text-4xl font-bold text-blue-600">{users.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Admin</p>
          <p className="text-4xl font-bold text-purple-600">
            {users.filter((u) => u.role === "admin").length}
          </p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow">
          <p className="text-gray-600 text-sm">Observer</p>
          <p className="text-4xl font-bold text-green-600">
            {users.filter((u) => u.role === "observer").length}
          </p>
        </div>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white p-8 rounded-xl shadow mb-8">
          <h2 className="text-2xl font-bold mb-6">Tambah User Baru</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Email *</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="user@example.com"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Username *</label>
              <input
                type="text"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="johndoe"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Password *</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="••••••••"
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Role *</label>
              <select
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
                className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="observer">Observer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleAddUser}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
            >
              Create User
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                resetForm();
              }}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-2 rounded-lg transition"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
        <input
          type="text"
          placeholder="Cari user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left font-semibold">Username</th>
              <th className="p-4 text-left font-semibold">Email</th>
              <th className="p-4 text-left font-semibold">Role</th>
              <th className="p-4 text-left font-semibold">Joined</th>
              <th className="p-4 text-left font-semibold">Actions</th>
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 border-t">
                  <td className="p-4 font-medium">{user.username}</td>
                  <td className="p-4 text-sm">{user.email || "-"}</td>
                  <td className="p-4">
                    {editingRole === user.id ? (
                      <select
                        value={
                          users.find((u) => u.id === user.id)?.role || "observer"
                        }
                        onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="observer">Observer</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold flex w-fit items-center gap-1 ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        <Shield className="w-4 h-4" />
                        {user.role === "admin" ? "👑 Admin" : "👁️ Observer"}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4 flex gap-2">
                    {editingRole === user.id ? (
                      <button
                        onClick={() => setEditingRole(null)}
                        className="text-gray-600 hover:text-gray-800 text-sm font-semibold"
                      >
                        Done
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => setEditingRole(user.id)}
                          className="text-blue-600 hover:text-blue-800 transition"
                          title="Edit role"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteUser(user.id, user.username)
                          }
                          className="text-red-600 hover:text-red-800 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    )}
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