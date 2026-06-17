import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Lock, Mail, ArrowRight, GraduationCap } from 'lucide-react';

interface AdminLoginProps {
  onLoginSuccess: (token: string, user: { email: string; fullName: string; role: string }) => void;
  onBackToOnboarding: () => void;
}

export default function AdminLogin({ onLoginSuccess, onBackToOnboarding }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || 'Authentication failed. Please check credentials.');
      } else {
        onLoginSuccess(result.token, result.user);
      }
    } catch {
      setError('Connection failed. Verify server is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100/50 flex flex-col justify-between py-6 px-4 font-sans select-none"
      id="admin-login-root"
    >
      {/* Header — mirrors the onboarding header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-100">
            EQ
          </div>
          <div>
            <h1 className="text-sm font-black text-gray-800 tracking-wide uppercase">EduQuest</h1>
            <p className="text-[9px] text-gray-400 font-semibold tracking-wider">Enterprise Study Pathway</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onBackToOnboarding}
          className="text-[10px] text-gray-400 hover:text-gray-600 font-bold bg-white hover:bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
        >
          ← Back to Onboarding
        </button>
      </header>

      {/* Login Card */}
      <main className="flex-1 flex items-center justify-center my-4">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="w-full max-w-md bg-white border border-gray-150/70 rounded-3xl shadow-xl shadow-gray-100/60 overflow-hidden"
        >
          {/* Card top bar */}
          <div className="bg-slate-50/50 border-b border-gray-100 px-6 py-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md shadow-indigo-100">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold text-indigo-600 tracking-wider uppercase">
                  Admin Portal
                </p>
                <p className="text-sm font-bold text-gray-800">Administrator Sign In</p>
              </div>
            </div>
          </div>

          {/* Form body */}
          <div className="p-6 md:p-8 space-y-5">
            {/* Illustration row */}
            <div className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <GraduationCap className="w-10 h-10 text-blue-600 shrink-0" />
              <div>
                <p className="text-xs font-bold text-gray-800">EduQuest Admin Console</p>
                <p className="text-[10px] text-gray-500 leading-relaxed">
                  Manage onboarding applications, review submissions, approve employees, and generate reports.
                </p>
              </div>
            </div>

            {/* Error banner */}
            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 text-center"
                id="login-error-message"
              >
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@eduquest.com"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    id="admin-email-input"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="flex flex-col">
                <label className="text-xs font-bold text-gray-700 mb-1">Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-3 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all"
                    id="admin-password-input"
                  />
                </div>
              </div>

              {/* Hint */}
              <p className="text-[10px] text-gray-400 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2">
                Default credentials — <span className="font-bold text-gray-600">admin@eduquest.com</span> / <span className="font-bold text-gray-600">admin123</span>
              </p>

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium text-sm py-3 rounded-xl shadow-md shadow-indigo-100 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                id="btn-admin-login"
              >
                {loading ? 'Verifying Credentials...' : 'Sign In to Admin Portal'}
                {!loading && <ArrowRight className="w-4 h-4" />}
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="text-center text-[10px] text-gray-400 font-semibold uppercase tracking-wider">
        © 2026 EduQuest Learning Platform • Admin Access Only
      </footer>
    </div>
  );
}
