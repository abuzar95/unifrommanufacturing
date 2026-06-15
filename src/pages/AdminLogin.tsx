/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { Award, Lock, LogIn, AlertCircle } from 'lucide-react';

export default function AdminLogin() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const success = login(username, password);
    setIsLoading(false);

    if (success) {
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-14 w-14 items-center justify-center rounded-xl bg-slate-800 text-amber-500 mb-4">
            <Award className="h-7 w-7" />
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Staff Admin Portal
          </h1>
          <p className="text-sm text-slate-400 mt-2">
            Uniform Textile Industry — Management Access
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-2 text-slate-800 border-b border-gray-100 pb-4">
            <Lock className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-bold uppercase tracking-wider">Sign In</span>
          </div>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-700 text-xs p-3 rounded-lg border border-red-100">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label htmlFor="admin-username" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Username
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Enter username"
              />
            </div>

            <div>
              <label htmlFor="admin-password" className="block text-xs font-semibold text-gray-600 mb-1.5">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                placeholder="Enter password"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-lg text-sm font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? 'Signing in...' : 'Sign In to Dashboard'}
          </button>

          <p className="text-center text-[11px] text-gray-400">
            <a href="/" className="text-amber-600 hover:underline">
              ← Back to storefront
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
