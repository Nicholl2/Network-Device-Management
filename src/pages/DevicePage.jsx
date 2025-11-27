import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Sidebar from "../components/layout/Sidebar";
import { Plus, Search, Trash2, Edit } from "lucide-react";

export default function DevicePage() {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    mac_address: "",
    device_type: "",
    status: "offline",
  });
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadDevices();
  }, []);

  const loadDevices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDevices(data || []);
    } catch (error) {
      console.error("Error loading devices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDevice = async () => {
    if (!formData.name || !formData.ip_address) {
      alert("Nama dan IP Address harus diisi!");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (editingId) {
        // Update
        const { error } = await supabase
          .from("devices")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        // Insert
        const { error } = await supabase.from("devices").insert([
          {
            ...formData,
            created_by: userData.user.id,
          },
        ]);

        if (error) throw error;
      }

      setFormData({
        name: "",
        ip_address: "",
        mac_address: "",
        device_type: "",
        status: "offline",
      });
      setShowForm(false);
      loadDevices();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!confirm("Yakin ingin menghapus device ini?")) return;

    try {
      const { error } = await supabase.from("devices").delete().eq("id", id);

      if (error) throw error;
      loadDevices();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEditDevice = (device) => {
    setFormData(device);
    setEditingId(device.id);
    setShowForm(true);
  };

  const filteredDevices = devices.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.ip_address.includes(search)
  );

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Network Devices</h1>
            <p className="text-gray-600 mt-2">Kelola semua perangkat jaringan Anda</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              setFormData({
                name: "",
                ip_address: "",
                mac_address: "",
                device_type: "",
                status: "offline",
              });
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            Add Device
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Total Devices</p>
            <p className="text-4xl font-bold text-blue-600">{devices.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Online</p>
            <p className="text-4xl font-bold text-green-600">
              {devices.filter((d) => d.status === "online").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Offline</p>
            <p className="text-4xl font-bold text-red-600">
              {devices.filter((d) => d.status === "offline").length}
            </p>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? "Edit Device" : "Add New Device"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Device Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="IP Address"
                value={formData.ip_address}
                onChange={(e) =>
                  setFormData({ ...formData, ip_address: e.target.value })
                }
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <input
                type="text"
                placeholder="MAC Address"
                value={formData.mac_address}
                onChange={(e) =>
                  setFormData({ ...formData, mac_address: e.target.value })
                }
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <select
                value={formData.device_type}
                onChange={(e) =>
                  setFormData({ ...formData, device_type: e.target.value })
                }
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select Type</option>
                <option value="router">Router</option>
                <option value="switch">Switch</option>
                <option value="printer">Printer</option>
                <option value="computer">Computer</option>
                <option value="server">Server</option>
                <option value="other">Other</option>
              </select>
              <select
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
                className="border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="flex gap-4 mt-4">
              <button
                onClick={handleAddDevice}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg transition"
              >
                {editingId ? "Update" : "Save"} Device
              </button>
              <button
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
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
            placeholder="Cari device..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">IP Address</th>
                <th className="p-4 text-left font-semibold">Type</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">
                    No devices found
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 border-t">
                    <td className="p-4 font-medium">{device.name}</td>
                    <td className="p-4">{device.ip_address}</td>
                    <td className="p-4 capitalize">{device.device_type || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          device.status === "online"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="p-4 flex gap-2">
                      <button
                        onClick={() => handleEditDevice(device)}
                        className="text-blue-600 hover:text-blue-800 transition"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="text-red-600 hover:text-red-800 transition"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}