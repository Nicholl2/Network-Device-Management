import React from "react";
import Sidebar from "../components/layout/Sidebar";
import Logo from "../assets/Logo.png";

export default function AboutPage() {
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <Sidebar />

      <div className="flex-1 p-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">About Us</h1>
            <p className="text-gray-600">
              Pelajari lebih lanjut tentang Network Device Management
            </p>
          </div>

          {/* About Section */}
          <div className="bg-white rounded-2xl shadow-lg p-12 mb-8">
            <div className="flex flex-col md:flex-row items-center gap-12">
              {/* Logo */}
              <div className="flex-1 flex justify-center">
                <img
                  src={Logo}
                  alt="NDM Logo"
                  className="w-48 h-48 rounded-2xl shadow-lg object-contain"
                />
              </div>

              {/* Content */}
              <div className="flex-1">
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Network Device Management
                </h2>
                <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                  Network Device Management adalah platform yang dirancang
                  untuk memudahkan administrasi dan monitoring perangkat jaringan
                  Anda. Dengan interface yang user-friendly dan fitur-fitur
                  powerful, kelola semua perangkat dalam jaringan dengan lebih
                  efisien dan terstruktur.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Manajemen perangkat terpusat
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Monitoring status real-time
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">
                      Manajemen user terintegrasi
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-700">Secure & Reliable</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Section */}
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6">
              Fitur Utama
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Device Management",
                  desc: "Tambah, edit, dan hapus perangkat dengan mudah",
                },
                {
                  title: "User Management",
                  desc: "Kelola pengguna dan akses dalam sistem",
                },
                {
                  title: "Real-time Monitoring",
                  desc: "Pantau status perangkat secara real-time",
                },
                {
                  title: "Secure Authentication",
                  desc: "Sistem keamanan dengan enkripsi password",
                },
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow">
                  <h4 className="font-bold text-gray-800 mb-2">
                    {feature.title}
                  </h4>
                  <p className="text-gray-600 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Info Section */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl shadow-lg p-12 text-center">
            <h3 className="text-2xl font-bold mb-4">Siap Memulai?</h3>
            <p className="text-blue-100 mb-6">
              Mulai kelola perangkat jaringan Anda sekarang dengan Network Device
              Management
            </p>
            <button className="bg-white text-blue-600 font-semibold px-8 py-3 rounded-xl hover:bg-gray-100 transition">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}