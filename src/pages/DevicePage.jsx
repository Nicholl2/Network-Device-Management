import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import Sidebar from "../components/layout/Sidebar";
import { Plus, Search, Trash2, Edit, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function DevicePage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  const defaultTemplate = {
    name: "Default",
    show_device_name: true,
    require_device_name: true,
    show_ip_address: true,
    require_ip_address: true,
    show_mac_address: true,
    require_mac_address: true,
    show_device_type: true,
    require_device_type: true,
    show_status: true,
    require_status: true,
    show_manufacturer: false,
    require_manufacturer: false,
    show_model: false,
    require_model: false,
    show_assigned_to: false,
    require_assigned_to: false,
  };

  const [formData, setFormData] = useState({
    name: "",
    ip_address: "",
    mac_address: "",
    device_type: "",
    status: "stock",
    manufacturer: "",
    model: "",
    assigned_to: "",
  });

  const deviceTypes = [
    "Router",
    "Switch",
    "Access Point (AP)",
    "Printer",
    "Computer",
    "Server",
    "Other",
  ];
  const statusOptions = ["stock", "dipakai", "rusak"];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load devices
      const { data: deviceData, error: deviceError } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (deviceError) throw deviceError;

      // Load templates
      const { data: templateData } = await supabase
        .from("device_templates")
        .select("*")
        .order("created_at", { ascending: false });

      // Load users
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username");

      setDevices(deviceData || []);
      setTemplates(templateData || []);
      setUsers(profileData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartAddDevice = () => {
    setShowTemplateSelection(true);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setShowTemplateSelection(false);
    setShowForm(true);
    setEditingId(null);
    resetFormData();
  };

  const handleAddDevice = async () => {
    const template = selectedTemplate || defaultTemplate;

    // Validate required fields
    const requiredFields = [];
    if (template.require_device_name && !formData.name.trim())
      requiredFields.push("Device Name");
    if (template.require_ip_address && !formData.ip_address.trim())
      requiredFields.push("IP Address");
    if (template.require_mac_address && !formData.mac_address.trim())
      requiredFields.push("MAC Address");
    if (template.require_device_type && !formData.device_type)
      requiredFields.push("Device Type");
    if (template.require_status && !formData.status)
      requiredFields.push("Status");
    if (template.require_manufacturer && !formData.manufacturer.trim())
      requiredFields.push("Manufacturer");
    if (template.require_model && !formData.model.trim())
      requiredFields.push("Model");
    if (template.require_assigned_to && !formData.assigned_to)
      requiredFields.push("Assigned User");

    if (requiredFields.length > 0) {
      alert(`Harap isi: ${requiredFields.join(", ")}`);
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      const devicePayload = {
        name: formData.name,
        ip_address: formData.ip_address || null,
        mac_address: formData.mac_address || null,
        device_type: formData.device_type || null,
        status: formData.status || "stock",
        manufacturer: formData.manufacturer || null,
        model: formData.model || null,
        assigned_to: formData.assigned_to || null,
        created_by: userData.user.id,
        template_id: selectedTemplate?.id || null,
      };

      if (editingId) {
        const { error } = await supabase
          .from("devices")
          .update(devicePayload)
          .eq("id", editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("devices").insert([devicePayload]);

        if (error) throw error;
      }

      resetFormData();
      setShowForm(false);
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDeleteDevice = async (id) => {
    if (!confirm("Yakin ingin menghapus device ini?")) return;

    try {
      const { error } = await supabase.from("devices").delete().eq("id", id);

      if (error) throw error;
      loadData();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEditDevice = (device) => {
    setFormData({
      name: device.name || "",
      ip_address: device.ip_address || "",
      mac_address: device.mac_address || "",
      device_type: device.device_type || "",
      status: device.status || "stock",
      manufacturer: device.manufacturer || "",
      model: device.model || "",
      assigned_to: device.assigned_to || "",
    });
    setSelectedTemplate(null);
    setEditingId(device.id);
    setShowForm(true);
  };

  const resetFormData = () => {
    setFormData({
      name: "",
      ip_address: "",
      mac_address: "",
      device_type: "",
      status: "stock",
      manufacturer: "",
      model: "",
      assigned_to: "",
    });
  };

  const filteredDevices = devices.filter(
    (d) =>
      d.name.toLowerCase().includes(search.toLowerCase()) ||
      d.ip_address.includes(search)
  );

  const template = selectedTemplate || defaultTemplate;

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
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/templates")}
              className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Zap className="w-5 h-5" />
              Templates
            </button>
            <button
              onClick={handleStartAddDevice}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
            >
              <Plus className="w-5 h-5" />
              Add Device
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-4xl font-bold text-blue-600">{devices.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Stock</p>
            <p className="text-4xl font-bold text-green-600">
              {devices.filter((d) => d.status === "stock").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Dipakai</p>
            <p className="text-4xl font-bold text-orange-600">
              {devices.filter((d) => d.status === "dipakai").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow">
            <p className="text-gray-600 text-sm">Rusak</p>
            <p className="text-4xl font-bold text-red-600">
              {devices.filter((d) => d.status === "rusak").length}
            </p>
          </div>
        </div>

        {/* Template Selection Modal */}
        {showTemplateSelection && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-3xl w-full max-h-96 overflow-auto">
              <div className="p-6 border-b sticky top-0 bg-white">
                <h2 className="text-2xl font-bold text-gray-800">
                  Choose Template
                </h2>
                <p className="text-gray-600">
                  Pilih template untuk menentukan field mana yang akan ditampilkan
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6">
                {/* Default Template */}
                <button
                  onClick={() => handleSelectTemplate(null)}
                  className="p-4 border-2 border-gray-200 hover:border-blue-500 rounded-lg text-left transition hover:bg-blue-50"
                >
                  <h3 className="font-bold text-lg text-gray-800 mb-2">
                    📋 Default Template
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    Semua field standar dengan Device Name, IP Address, MAC
                    Address, Type, dan Status
                  </p>
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                    5 Fields
                  </span>
                </button>

                {/* Custom Templates */}
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="p-4 border-2 border-gray-200 hover:border-purple-500 rounded-lg text-left transition hover:bg-purple-50"
                  >
                    <h3 className="font-bold text-lg text-gray-800 mb-2">
                      {template.name}
                    </h3>
                    {template.description && (
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                    )}
                    <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                      Custom Template
                    </span>
                  </button>
                ))}
              </div>

              <div className="p-4 border-t bg-gray-50 flex justify-end">
                <button
                  onClick={() => setShowTemplateSelection(false)}
                  className="px-6 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        {showForm && (
          <div className="bg-white p-6 rounded-xl shadow mb-8">
            <h2 className="text-xl font-bold mb-6">
              {editingId ? "Edit Device" : `Add Device (${template.name})`}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {template.show_device_name && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Device Name {template.require_device_name && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Router Main Office"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {template.show_ip_address && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    IP Address {template.require_ip_address && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 192.168.1.1"
                    value={formData.ip_address}
                    onChange={(e) =>
                      setFormData({ ...formData, ip_address: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {template.show_mac_address && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    MAC Address {template.require_mac_address && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., 00:1A:2B:3C:4D:5E"
                    value={formData.mac_address}
                    onChange={(e) =>
                      setFormData({ ...formData, mac_address: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {template.show_device_type && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Device Type {template.require_device_type && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={formData.device_type}
                    onChange={(e) =>
                      setFormData({ ...formData, device_type: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">Select Type</option>
                    {deviceTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {template.show_status && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Status {template.require_status && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    {statusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() +
                          status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {template.show_manufacturer && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Manufacturer {template.require_manufacturer && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Cisco, TP-Link"
                    value={formData.manufacturer}
                    onChange={(e) =>
                      setFormData({ ...formData, manufacturer: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {template.show_model && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Model {template.require_model && <span className="text-red-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., WR940N"
                    value={formData.model}
                    onChange={(e) =>
                      setFormData({ ...formData, model: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                </div>
              )}

              {template.show_assigned_to && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">
                    Assigned To {template.require_assigned_to && <span className="text-red-500">*</span>}
                  </label>
                  <select
                    value={formData.assigned_to}
                    onChange={(e) =>
                      setFormData({ ...formData, assigned_to: e.target.value })
                    }
                    className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  >
                    <option value="">-- No Assignment --</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.username}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-4">
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
                  resetFormData();
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
        <div className="bg-white rounded-xl shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-4 text-left font-semibold">Name</th>
                <th className="p-4 text-left font-semibold">IP Address</th>
                <th className="p-4 text-left font-semibold">Type</th>
                <th className="p-4 text-left font-semibold">Manufacturer</th>
                <th className="p-4 text-left font-semibold">Status</th>
                <th className="p-4 text-left font-semibold">Assigned To</th>
                <th className="p-4 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : filteredDevices.length === 0 ? (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-500">
                    No devices found
                  </td>
                </tr>
              ) : (
                filteredDevices.map((device) => (
                  <tr key={device.id} className="hover:bg-gray-50 border-t">
                    <td className="p-4 font-medium">{device.name}</td>
                    <td className="p-4 text-sm">{device.ip_address || "-"}</td>
                    <td className="p-4 text-sm">{device.device_type || "-"}</td>
                    <td className="p-4 text-sm">{device.manufacturer || "-"}</td>
                    <td className="p-4">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          device.status === "stock"
                            ? "bg-green-100 text-green-800"
                            : device.status === "dipakai"
                            ? "bg-orange-100 text-orange-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {device.status}
                      </span>
                    </td>
                    <td className="p-4 text-sm">
                      {device.assigned_to
                        ? users.find((u) => u.id === device.assigned_to)
                            ?.username || "-"
                        : "-"}
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