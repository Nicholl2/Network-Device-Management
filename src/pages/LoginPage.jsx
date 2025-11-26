import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Logo from '../assets/Logo.png';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      setSuccess('Login berhasil! Redirecting...');
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      }

      setTimeout(() => {
        window.location.href = '/home';
      }, 1200);
    } catch (err) {
      setError(err.message || 'Login gagal. Periksa email dan password Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f6fafc] flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl max-w-6xl w-full flex overflow-hidden">

        {/* Left Illustration Section */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-300 to-teal-400 relative p-10 flex-col justify-between">

          {/* Logo - Top Left */}
          <div className="flex items-center gap-3 mb-6">
            <img src={Logo} className="w-10 h-10 rounded-lg object-contain" />
            <h1 className="text-xl font-bold text-gray-700">Network Device Management</h1>
          </div>

          {/* Illustration */}
          <div className="flex flex-col items-center justify-center flex-1">
            <div className="w-72 h-72 bg-white/40 backdrop-blur-md rounded-full shadow-md flex items-center justify-center">
              <img src={Logo} className="w-40 h-40 object-contain" />
            </div>
            <p className="mt-6 text-lg font-semibold text-gray-700">Manage Your Network Easily</p>
            <p className="text-gray-500 text-sm mt-1">Secure • Simple • Smart</p>
          </div>

          {/* Decorative shapes */}
          <div className="absolute top-16 right-20 w-16 h-16 bg-white/40 rounded-full" />
          <div className="absolute bottom-28 left-14 w-12 h-12 bg-white/40 rounded-full" />
          <div className="absolute bottom-12 right-24 w-8 h-8 bg-white/40 rounded-full" />
        </div>

        {/* Right Login Form */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back 🙂</h1>
            <p className="text-gray-600 text-sm">
              To continue, please login using your email and password.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
              <AlertCircle className="w-5 h-5" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2 text-green-700 text-sm">
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              {success}
            </div>
          )}

          {/* FORM */}
          <div className="space-y-6">

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-400 focus:outline-none"
                  disabled={loading}
                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 accent-teal-500"
                />
                <span className="text-gray-700">Remember Me</span>
              </label>


            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={handleLogin}
                disabled={loading || !email || !password}
                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-50"
              >
                {loading ? 'Loading…' : 'Login Now'}
              </button>

              <button
                onClick={() => (window.location.href = '/register')}
                disabled={loading}
                className="flex-1 bg-white text-gray-700 py-3 rounded-xl font-semibold border border-gray-200 hover:bg-gray-50 transition"
              >
                Create Account
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
