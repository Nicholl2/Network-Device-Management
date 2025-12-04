import React, { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
 
import { Plus, Trash2, Edit, Copy } from "lucide-react";

export default function TemplatePage() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
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
    show_manufacturer: true,
    require_manufacturer: false,
    show_model: true,
    require_model: false,
    show_assigned_to: true,
    require_assigned_to: false,
  });

  const fieldsList = [
    { key: "device_name", label: "Device Name" },
    { key: "ip_address", label: "IP Address" },
    { key: "mac_address", label: "MAC Address" },
    { key: "device_type", label: "Device Type" },
    { key: "status", label: "Status" },
    { key: "manufacturer", label: "Manufacturer" },
    { key: "model", label: "Model" },
    { key: "assigned_to", label: "User (Assigned To)" },
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("device_templates")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setTemplates(data || []);
    } catch (error) {
      console.error("Error loading templates:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveTemplate = async () => {
    if (!formData.name.trim()) {
      alert("Nama template harus diisi!");
      return;
    }

    try {
      const { data: userData } = await supabase.auth.getUser();

      if (editingId) {
        const { error } = await supabase
          .from("device_templates")
          .update(formData)
          .eq("id", editingId);

        if (error) throw error;
        setEditingId(null);
      } else {
        const { error } = await supabase.from("device_templates").insert([
          {
            ...formData,
            created_by: userData.user.id,
          },
        ]);

        if (error) throw error;
      }

      resetForm();
      loadTemplates();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleDeleteTemplate = async (id) => {
    if (!confirm("Yakin ingin menghapus template ini?")) return;

    try {
      const { error } = await supabase
        .from("device_templates")
        .delete()
        .eq("id", id);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const handleEditTemplate = (template) => {
    setFormData(template);
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDuplicateTemplate = async (template) => {
    try {
      const { data: userData } = await supabase.auth.getUser();
      const newTemplate = { ...template };
      delete newTemplate.id;
      delete newTemplate.created_at;
      delete newTemplate.updated_at;

      newTemplate.name = `${template.name} (Copy)`;
      newTemplate.created_by = userData.user.id;

      const { error } = await supabase
        .from("device_templates")
        .insert([newTemplate]);

      if (error) throw error;
      loadTemplates();
    } catch (error) {
      alert("Error: " + error.message);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
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
      show_manufacturer: true,
      require_manufacturer: false,
      show_model: true,
      require_model: false,
      show_assigned_to: true,
      require_assigned_to: false,
    });
  };

  return (
    <div className="p-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Device Templates</h1>
            <p className="text-gray-600 mt-2">Kelola template pengisian device Anda</p>
          </div>
          <button
            onClick={() => {
              setEditingId(null);
              resetForm();
              setShowForm(true);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <Plus className="w-5 h-5" />
            New Template
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-xl shadow mb-8">
            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Template" : "Create New Template"}
            </h2>

            {/* Template Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 pb-8 border-b">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="e.g., Standard Device, Simple Device"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Deskripsi template"
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Fields Configuration */}
            <div className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-6">
                Field Configuration
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {fieldsList.map((field) => {
                  const showKey = `show_${field.key}`;
                  const requireKey = `require_${field.key}`;

                  return (
                    <div
                      key={field.key}
                      className="border rounded-lg p-4 hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <label className="font-semibold text-gray-700">
                          {field.label}
                        </label>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[showKey] || false}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [showKey]: e.target.checked,
                                [requireKey]: e.target.checked
                                  ? formData[requireKey]
                                  : false,
                              })
                            }
                            className="w-4 h-4 accent-blue-600"
                          />
                          <span className="text-sm text-gray-600">Show</span>
                        </label>

                        <label className="flex items-center gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={formData[requireKey] || false}
                            disabled={!formData[showKey]}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                [requireKey]: e.target.checked,
                              })
                            }
                            className="w-4 h-4 accent-red-600 disabled:opacity-50"
                          />
                          <span className="text-sm text-gray-600">Required</span>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button
                onClick={handleSaveTemplate}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition"
              >
                {editingId ? "Update Template" : "Create Template"}
              </button>
              <button
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold px-6 py-3 rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <p className="text-gray-500">Loading...</p>
          ) : templates.length === 0 ? (
            <p className="text-gray-500 col-span-full text-center py-8">
              Belum ada template. Buat template baru untuk memulai.
            </p>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-xl shadow hover:shadow-lg transition p-6"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {template.name}
                </h3>
                {template.description && (
                  <p className="text-gray-600 text-sm mb-4">
                    {template.description}
                  </p>
                )}

                {/* Field Summary */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-xs text-gray-600 font-semibold mb-2">
                    Fields: {" "}
                    {fieldsList.filter((f) => formData[`show_${f.key}`]).length}/
                    {fieldsList.length}
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {fieldsList
                      .filter((f) => template[`show_${f.key}`])
                      .map((f) => (
                        <span
                          key={f.key}
                          className={`text-xs px-2 py-1 rounded-full ${
                            template[`require_${f.key}`]
                              ? "bg-red-100 text-red-700"
                              : "bg-blue-100 text-blue-700"
                          }`}
                        >
                          {f.label}
                          {template[`require_${f.key}`] ? "*" : ""}
                        </span>
                      ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEditTemplate(template)}
                    className="flex-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDuplicateTemplate(template)}
                    className="flex-1 bg-gray-50 hover:bg-gray-100 text-gray-600 font-semibold py-2 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Copy className="w-4 h-4" />
                    Copy
                  </button>
                  <button
                    onClick={() => handleDeleteTemplate(template.id)}
                    className="bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-2 px-4 rounded-lg transition flex items-center justify-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
    </div>
  );
}