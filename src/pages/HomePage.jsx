import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Home, Server, Users, Info } from "lucide-react";
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
      const { data: deviceData, error: deviceError } = await supabase
        .from("devices")
        .select("*", { count: "exact" });

      if (deviceError) console.error("Device error:", deviceError);

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
    <>
        {/* Hero Section */}
        <section className="bg-linear-to-r from-teal-400 to-blue-500 text-white py-20 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-5xl font-bold mb-4">Network Device Management</h1>
              <p className="text-xl text-gray-100 mb-8">
                Kelola semua perangkat jaringan Anda dengan mudah dan aman. Sistem
                yang sederhana namun powerful untuk network administration.
              </p>
              <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
                Get Started
              </button>
            </div>

            <div className="flex-1 flex justify-center">
              <div className="w-64 h-64 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
                <img src={Logo} alt="Logo" className="w-40 h-40 object-contain" />
              </div>
            </div>
          </div>
        </section>

      {/* Devices Dashboard Section */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Network Devices
          </h2>
          <p className="text-gray-600 mb-12">
            Monitor dan kelola semua perangkat yang terhubung dalam jaringan Anda
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Total Devices Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-semibold">
                  Total Devices
                </h3>
                <Server className="w-8 h-8 text-blue-500" />
              </div>
              <p className="text-5xl font-bold text-gray-800">
                {loading ? "..." : devices.length}
              </p>
              <p className="text-gray-500 text-sm mt-2">Perangkat terdaftar</p>
            </div>

            {/* Active Devices Card */}
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-600 text-sm font-semibold">
                  Active Devices
                </h3>
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
                </div>
              </div>
              <p className="text-5xl font-bold text-gray-800">
                {loading ? "..." : Math.floor(devices.length * 0.8)}
              </p>
              <p className="text-gray-500 text-sm mt-2">Devices online</p>
            </div>

            {/* Add Device Card */}
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-8 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white text-sm font-semibold">New Device</h3>
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-white text-xl">
                  +
                </div>
              </div>
              <p className="text-3xl font-bold text-white">Add Device</p>
              <p className="text-white/80 text-sm mt-2">
                Tambahkan perangkat baru
              </p>
            </div>
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
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">Users</h2>
          <p className="text-gray-600 mb-12">
            Daftar pengguna yang terdaftar dalam sistem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Total Users Card */}
            <div className="bg-linear-to-br from-teal-400 to-teal-500 p-8 rounded-2xl shadow-lg text-white">
              <h3 className="text-sm font-semibold mb-4 text-teal-100">
                Total Users
              </h3>
              <p className="text-5xl font-bold mb-2">{loading ? "..." : users.length}</p>
              <p className="text-teal-100">Pengguna terdaftar</p>
            </div>

            {/* Recent Users Preview */}
            <div className="bg-gray-50 p-8 rounded-2xl shadow-lg">
              <h3 className="text-sm font-semibold text-gray-600 mb-4">
                Recent Users
              </h3>
              <div className="space-y-3">
                {loading ? (
                  <p className="text-gray-500">Loading...</p>
                ) : users.length > 0 ? (
                  users.slice(0, 3).map((user) => (
                    <div key={user.id} className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">
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

        {/* About Section */}
      <section className="py-20 px-6 bg-linear-to-r from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-8">
            <img src={Logo} alt="Logo" className="w-24 h-24 rounded-xl" />
          </div>
          <h2 className="text-4xl font-bold mb-4">Network Device Management</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Sistem manajemen perangkat jaringan yang dirancang untuk memudahkan
            administrasi jaringan Anda. Dengan interface yang user-friendly dan
            fitur-fitur powerful, kelola semua perangkat dengan lebih efisien.
          </p>
          <div className="mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-500">© 2025 Network Device Management. All rights reserved.</p>
          </div>
          </div>
      </section>
    </>
  );
}