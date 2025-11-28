import React, { useState } from 'react';
import { Menu, X, Plus, Search, Edit, Trash2, LogOut, Home, Server, Users, Info, ChevronLeft, Zap } from 'lucide-react';

export default function MobileDeviceManagement() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('home');
  const [showForm, setShowForm] = useState(false);
  const [devices, setDevices] = useState([
    { id: 1, name: 'Router Main', ip: '192.168.1.1', type: 'Router', status: 'stock' },
    { id: 2, name: 'Switch Floor 1', ip: '192.168.1.5', type: 'Switch', status: 'dipakai' },
    { id: 3, name: 'AP Office', ip: '192.168.1.10', type: 'Access Point', status: 'stock' },
  ]);
  const [search, setSearch] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    ip: '',
    type: '',
    status: 'stock'
  });

  const handleAddDevice = () => {
    if (formData.name && formData.ip && formData.type) {
      setDevices([...devices, {
        id: Date.now(),
        ...formData
      }]);
      setFormData({ name: '', ip: '', type: '', status: 'stock' });
      setShowForm(false);
    }
  };

  const handleDeleteDevice = (id) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  const filteredDevices = devices.filter(d =>
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.ip.includes(search)
  );

  const closeSidebar = () => setSidebarOpen(false);
  const navigateTo = (page) => {
    setCurrentPage(page);
    closeSidebar();
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-hidden">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40 shadow-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">N</div>
            <h1 className="text-lg font-bold text-gray-800">NDM</h1>
          </div>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar - Mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black/50">
          <div className="bg-white w-64 h-screen shadow-lg overflow-y-auto">
            {/* User Section */}
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-gray-800 truncate">Admin</p>
                  <p className="text-xs text-gray-500 truncate">admin@example.com</p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="p-4 space-y-2">
              <button
                onClick={() => navigateTo('home')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'home'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => navigateTo('devices')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'devices'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Server className="w-5 h-5" />
                <span>Devices</span>
              </button>

              <button
                onClick={() => navigateTo('users')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'users'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Users className="w-5 h-5" />
                <span>Users</span>
              </button>

              <button
                onClick={() => navigateTo('templates')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'templates'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Zap className="w-5 h-5" />
                <span>Templates</span>
              </button>

              <button
                onClick={() => navigateTo('about')}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  currentPage === 'about'
                    ? 'bg-blue-50 text-blue-600 font-semibold'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Info className="w-5 h-5" />
                <span>About</span>
              </button>
            </nav>

            {/* Logout */}
            <div className="p-4 border-t">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 font-semibold transition">
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pb-20">
        {/* Home Page */}
        {currentPage === 'home' && (
          <div className="p-4 space-y-4">
            {/* Hero Card */}
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl p-6 shadow-md">
              <h2 className="text-2xl font-bold mb-2">Welcome Back! 👋</h2>
              <p className="text-blue-100 text-sm">Manage your network devices easily</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-xs">Total Devices</p>
                <p className="text-3xl font-bold text-blue-600">{devices.length}</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <p className="text-gray-600 text-xs">Active</p>
                <p className="text-3xl font-bold text-green-600">
                  {devices.filter(d => d.status === 'dipakai').length}
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800 text-sm">Quick Actions</h3>
              <button
                onClick={() => { navigateTo('devices'); setShowForm(true); }}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md"
              >
                <Plus className="w-5 h-5" />
                Add New Device
              </button>
            </div>

            {/* Recent Devices */}
            <div>
              <h3 className="font-semibold text-gray-800 text-sm mb-3">Recent Devices</h3>
              <div className="space-y-2">
                {devices.slice(0, 3).map(device => (
                  <div key={device.id} className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-800 text-sm">{device.name}</p>
                        <p className="text-xs text-gray-500">{device.ip}</p>
                        <p className="text-xs text-gray-600 mt-1">{device.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        device.status === 'stock'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Devices Page */}
        {currentPage === 'devices' && (
          <div className="p-4 space-y-4">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
              <button
                onClick={() => setShowForm(true)}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg shadow-md"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            {showForm && (
              <div className="bg-white p-4 rounded-lg shadow-md space-y-3">
                <h3 className="font-bold text-gray-800">Add Device</h3>
                <input
                  type="text"
                  placeholder="Device Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="IP Address"
                  value={formData.ip}
                  onChange={(e) => setFormData({ ...formData, ip: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Select Type</option>
                  <option value="Router">Router</option>
                  <option value="Switch">Switch</option>
                  <option value="Access Point">Access Point</option>
                  <option value="Printer">Printer</option>
                </select>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border rounded-lg p-2 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="stock">Stock</option>
                  <option value="dipakai">Dipakai</option>
                  <option value="rusak">Rusak</option>
                </select>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddDevice}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold text-sm"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg font-semibold text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Device List */}
            <div className="space-y-2">
              {filteredDevices.length === 0 ? (
                <p className="text-center text-gray-500 py-8">No devices found</p>
              ) : (
                filteredDevices.map(device => (
                  <div key={device.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{device.name}</p>
                        <p className="text-xs text-gray-500">{device.ip}</p>
                        <p className="text-xs text-gray-600 mt-1">{device.type}</p>
                      </div>
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        device.status === 'stock'
                          ? 'bg-green-100 text-green-800'
                          : device.status === 'dipakai'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {device.status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <button className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-600 py-2 rounded-lg text-sm font-semibold">
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDevice(device.id)}
                        className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2 rounded-lg text-sm font-semibold"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Users Page */}
        {currentPage === 'users' && (
          <div className="p-4 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <p className="text-gray-600 text-sm">Total Users</p>
              <p className="text-4xl font-bold text-blue-600">8</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold text-gray-800">Users List</h3>
              {[
                { name: 'Admin', email: 'admin@example.com' },
                { name: 'John Doe', email: 'john@example.com' },
                { name: 'Jane Smith', email: 'jane@example.com' },
              ].map((user, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Templates Page */}
        {currentPage === 'templates' && (
          <div className="p-4 space-y-4">
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md">
              <Plus className="w-5 h-5" />
              Create Template
            </button>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Available Templates</h3>
              {[
                { name: 'Default Template', fields: 5 },
                { name: 'Standard Device', fields: 8 },
                { name: 'Simple Device', fields: 3 },
              ].map((template, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="font-semibold text-gray-800 mb-1">{template.name}</p>
                  <p className="text-xs text-gray-600 mb-3">{template.fields} Fields</p>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-blue-50 text-blue-600 py-2 rounded text-sm font-semibold">Edit</button>
                    <button className="flex-1 bg-red-50 text-red-600 py-2 rounded text-sm font-semibold">Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* About Page */}
        {currentPage === 'about' && (
          <div className="p-4 space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌐</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Network Device Management</h2>
              <p className="text-gray-600 text-sm mb-4">Platform untuk manajemen perangkat jaringan Anda dengan mudah dan aman.</p>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-800">Fitur Utama</h3>
              {[
                '🖥️ Device Management',
                '👥 User Management',
                '📊 Real-time Monitoring',
                '⚡ Custom Templates',
              ].map((feature, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <p className="text-gray-800 font-semibold">{feature}</p>
                </div>
              ))}
            </div>

            <div className="bg-blue-600 text-white p-4 rounded-lg text-center">
              <p className="text-sm">© 2025 Network Device Management</p>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="flex justify-around">
          <button
            onClick={() => navigateTo('home')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
              currentPage === 'home'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>
          <button
            onClick={() => navigateTo('devices')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
              currentPage === 'devices'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Server className="w-5 h-5" />
            <span>Devices</span>
          </button>
          <button
            onClick={() => navigateTo('users')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
              currentPage === 'users'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Users className="w-5 h-5" />
            <span>Users</span>
          </button>
          <button
            onClick={() => navigateTo('about')}
            className={`flex-1 py-3 flex flex-col items-center gap-1 text-xs font-semibold transition ${
              currentPage === 'about'
                ? 'text-blue-600 bg-blue-50'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Info className="w-5 h-5" />
            <span>About</span>
          </button>
        </div>
      </nav>
    </div>
  );
}