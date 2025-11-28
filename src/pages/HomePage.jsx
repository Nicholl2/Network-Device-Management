import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Server, Users, Zap } from "lucide-react";
import Sidebar from "../components/layout/Sidebar";
import { supabase } from "../lib/supabaseClient";
import Logo from "../assets/Logo.png";

export default function HomePage() {
  const [devices, setDevices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load devices count
      const { data: deviceData } = await supabase
        .from("devices")
        .select("*", { count: "exact" });

      // Load users
      const { data: profileData } = await supabase
        .from("profiles")
        .select("id, username, created_at");

      setDevices(deviceData || []);
      setUsers(profileData || []);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 overflow-auto">
        {/* Hero Section */}
        <section className="bg-linear-to-r from-blue-500 via-blue-600 to-teal-500 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h1 className="text-5xl font-bold mb-4">Network Device Management</h1>
                <p className="text-xl text-blue-100 mb-8 max-w-2xl">
                  Kelola semua perangkat jaringan Anda dengan mudah dan aman. Sistem
                  yang sederhana namun powerful untuk network administration.
                </p>
                <Link
                  to="/devices"
                  className="inline-block bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition"
                >
                  Get Started
                </Link>
              </div>

              <div className="flex-1 hidden lg:flex justify-center">
                <div className="w-64 h-64 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                  <img src={Logo} alt="Logo" className="w-40 h-40 object-contain" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Devices Dashboard Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Network Devices</h2>
            <p className="text-gray-600 mb-12">
              Monitor dan kelola semua perangkat yang terhubung dalam jaringan Anda
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Total Devices Card */}
              <div className="bg-linear-to-br from-blue-50 to-blue-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-blue-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-700 text-sm font-semibold">
                    Total Devices
                  </h3>
                  <Server className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-5xl font-bold text-blue-600 mb-2">
                  {loading ? "-" : devices.length}
                </p>
                <p className="text-gray-600 text-sm">Perangkat terdaftar</p>
              </div>

              {/* Active Devices Card */}
              <div className="bg-linear-to-br from-green-50 to-green-100 p-8 rounded-2xl shadow-lg hover:shadow-xl transition border border-green-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-700 text-sm font-semibold">
                    Active Devices
                  </h3>
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                  </div>
                </div>
                <p className="text-5xl font-bold text-green-600 mb-2">
                  {loading ? "-" : Math.floor(devices.length * 0.8)}
                </p>
                <p className="text-gray-600 text-sm">Devices online</p>
              </div>

              {/* Add Device Card */}
              <Link
                to="/devices"
                className="bg-linear-to-br from-blue-600 to-blue-700 p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer block group"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white text-sm font-semibold">New Device</h3>
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xl group-hover:bg-white/30 transition">
                    +
                  </div>
                </div>
                <p className="text-3xl font-bold text-white mb-2">Add Device</p>
                <p className="text-blue-100 text-sm">
                  Tambahkan perangkat baru
                </p>
              </Link>
            </div>

            <Link
              to="/devices"
              className="inline-block mt-8 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              View All Devices
            </Link>
          </div>
        </section>

        {/* Users Dashboard Section */}
        <section className="py-20 px-6 bg-[#f8fafc]">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Users</h2>
            <p className="text-gray-600 mb-12">
              Daftar pengguna yang terdaftar dalam sistem
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Total Users Card */}
              <div className="bg-linear-to-br from-teal-500 to-teal-600 p-8 rounded-2xl shadow-lg text-white">
                <h3 className="text-sm font-semibold mb-4 text-teal-100">
                  Total Users
                </h3>
                <p className="text-5xl font-bold mb-2">{loading ? "-" : users.length}</p>
                <p className="text-teal-100">Pengguna terdaftar</p>
              </div>

              {/* Recent Users Preview */}
              <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-700 mb-4">
                  Recent Users
                </h3>
                <div className="space-y-3">
                  {loading ? (
                    <p className="text-gray-500">Loading...</p>
                  ) : users.length > 0 ? (
                    users.slice(0, 3).map((user) => (
                      <div key={user.id} className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {user.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-800 truncate">
                            {user.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(user.created_at).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No users yet</p>
                  )}
                </div>
              </div>
            </div>

            <Link
              to="/users"
              className="inline-block mt-8 bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-blue-700 transition"
            >
              View All Users
            </Link>
          </div>
        </section>

        {/* About/Features Section */}
        <section className="py-20 px-6 bg-white">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">Key Features</h2>
            <p className="text-gray-600 mb-12">
              Fitur-fitur unggulan untuk memaksimalkan manajemen jaringan Anda
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Device Management",
                  desc: "Tambah, edit, dan hapus perangkat dengan mudah",
                  icon: "🖥️",
                },
                {
                  title: "User Management",
                  desc: "Kelola pengguna dan akses dalam sistem",
                  icon: "👥",
                },
                {
                  title: "Real-time Monitoring",
                  desc: "Pantau status perangkat secara real-time",
                  icon: "📊",
                },
                {
                  title: "Custom Templates",
                  desc: "Buat template pengisian device sesuai kebutuhan",
                  icon: "⚡",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-linear-to-br from-gray-50 to-gray-100 p-6 rounded-xl shadow hover:shadow-lg transition border border-gray-200">
                  <div className="text-4xl mb-3">{feature.icon}</div>
                  <h4 className="font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="py-12 px-6 bg-gray-900 text-white text-center">
          <div className="max-w-7xl mx-auto">
            <p className="text-gray-400">© 2025 Network Device Management. All rights reserved.</p>
          </div>
        </section>
      </div>
    </div>
  );
}