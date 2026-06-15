/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import AdminLogin from './AdminLogin';
import AdminPanel from '../components/AdminPanel';
import { Product } from '../types';
import { apiGetProducts } from '../lib/api';
import { Award, LogOut } from 'lucide-react';

function ProtectedAdmin() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currency] = useState<'USD' | 'EUR' | 'AUD'>('USD');

  useEffect(() => {
    if (!isAuthenticated) return;
    loadProducts();
  }, [isAuthenticated]);

  const loadProducts = async () => {
    setIsLoading(true);
    const items = await apiGetProducts();
    setProducts(items);
    setIsLoading(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <header className="sticky top-0 z-40 bg-slate-900 border-b border-slate-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 sm:h-16 items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-lg bg-slate-800 text-amber-500">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-sm sm:text-base font-bold text-white tracking-tight">
                  Admin Dashboard
                </h1>
                <p className="text-[10px] text-slate-400 hidden sm:block">
                  Uniform Textile Industry
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href="/"
                className="text-xs text-slate-400 hover:text-white transition-colors hidden sm:inline"
              >
                View Storefront
              </a>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-2 rounded-lg transition-colors"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span className="hidden xs:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {isLoading ? (
          <div className="text-center py-24">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-amber-500 mx-auto" />
            <p className="text-xs font-mono text-gray-500 mt-3 uppercase tracking-wider">
              Loading dashboard...
            </p>
          </div>
        ) : (
          <AdminPanel
            products={products}
            refreshProducts={loadProducts}
            currency={currency}
          />
        )}
      </main>
    </div>
  );
}

export default function AdminRoutes() {
  return (
    <Routes>
      <Route path="login" element={<AdminLogin />} />
      <Route path="/" element={<ProtectedAdmin />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
