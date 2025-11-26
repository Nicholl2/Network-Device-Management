import React, { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import Logo from '../assets/Logo.png';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async () => {
  setLoading(true);
  setError('');
  setSuccess('');

  try {
    // 1. CEK JIKA USERNAME SUDAH ADA
    const { data: existingUser } = await supabase
      .from('profiles')
      .select('*')
      .eq('username', username)
      .single();

    if (existingUser) {
      throw new Error("Username sudah digunakan.");
    }

    // 2. DAFTARKAN USER KE AUTH
    const { data: authData, error: signupError } = await supabase.auth.signUp({
      email,
      password
    });

    if (signupError) throw signupError;

    const userId = authData.user.id;

    // 3. SIMPAN USERNAME KE TABEL PROFILES
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          username: username
        }
      ]);

    if (profileError) throw profileError;

    setSuccess('Account created successfully! Redirecting...');
    setTimeout(() => (window.location.href = '/login'), 1200);

  } catch (err) {
    setError(err.message);
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

        {/* Form Section */}
        <div className="w-full lg:w-1/2 p-12 flex flex-col justify-center">

          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Create Account 😹</h1>
            <p className="text-gray-600 text-sm">Fill the form to register your account.</p>
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

          <div className="space-y-6">

            {/* Username */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="NikolasAD"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-gray-700 text-sm mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
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
                  className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  disabled={loading}
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

            {/* Button */}
            <button
              onClick={handleRegister}
              disabled={loading || !email || !password || !username}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? 'Loading…' : 'Register'}
            </button>

            <p className="text-sm text-gray-600 text-center mt-2">
              Already have an account?{' '}
              <a href="/login" className="text-blue-500 hover:text-blue-600">Login here</a>
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}
