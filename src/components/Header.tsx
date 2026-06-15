/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, ShoppingBag, Globe, Menu, X, Award, Settings } from 'lucide-react';

interface HeaderProps {
  currentCurrency: 'USD' | 'EUR' | 'AUD';
  setCurrency: (currency: 'USD' | 'EUR' | 'AUD') => void;
  cartCount: number;
  openCart: () => void;
  activeTab: 'catalog' | 'builder' | 'manufacturing' | 'admin';
  setActiveTab: (tab: 'catalog' | 'builder' | 'manufacturing' | 'admin') => void;
}

export default function Header({
  currentCurrency,
  setCurrency,
  cartCount,
  openCart,
  activeTab,
  setActiveTab
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'catalog', label: 'Premium Catalog' },
    { id: 'builder', label: 'Interactive Ribbon Builder' },
    { id: 'manufacturing', label: 'Bespoke Manufacturing' },
    { id: 'admin', label: 'Admin Control Center' }
  ] as const;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-gray-100 bg-white/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          
          {/* Logo Brand */}
          <div 
            onClick={() => setActiveTab('catalog')} 
            className="flex cursor-pointer items-center gap-3 active:opacity-90"
            id="brand-logo-container"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-slate-900 text-amber-500 shadow-sm">
              <Award className="h-6 w-6 stroke-[1.8]" />
            </div>
            <div>
              <h1 className="font-sans text-lg font-bold tracking-tight text-slate-900 sm:text-xl">
                UNIFORM TEXTILE INDUSTRY
              </h1>
              <p className="font-sans text-[10px] font-bold tracking-widest text-amber-600">
                PREMIUM INDUSTRIAL WEAR & ACCOUTREMENTS
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`px-4 py-2 rounded-md font-sans text-sm font-medium tracking-wide transition-all ${
                  activeTab === item.id
                    ? 'text-slate-950 bg-slate-50 font-semibold'
                    : 'text-gray-500 hover:text-slate-950 hover:bg-gray-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Global Indicators & Currency Selectors */}
          <div className="hidden lg:flex items-center gap-4 text-xs font-medium text-gray-500 border-l border-gray-100 pl-4">
            <span className="flex items-center gap-1 text-slate-700 bg-slate-50 px-2 py-1 rounded border border-slate-100">
              <Globe className="h-3 w-3 text-amber-600 animate-spin-slow" />
              <span>Gujranwala Facility to US / EU / AU</span>
            </span>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-3">
            {/* Currency Selector */}
            <div className="flex items-center rounded-lg border border-gray-200 p-0.5 bg-gray-50">
              {(['USD', 'EUR', 'AUD'] as const).map((curr) => (
                <button
                  key={curr}
                  id={`currency-toggle-${curr.toLowerCase()}`}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 text-xs font-mono font-bold rounded-md transition-all ${
                    currentCurrency === curr
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>

            {/* Shopping Cart button */}
            <button
              id="header-cart-btn"
              onClick={openCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 hover:bg-slate-50 hover:border-gray-300 transition-colors"
              title="View Quote Request"
            >
              <ShoppingBag className="h-5 w-5 text-slate-800" />
              {cartCount > 0 && (
                <span 
                  id="cart-badge-count"
                  className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-600 text-[10px] font-bold text-white shadow-xs animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 text-slate-700 hover:bg-slate-50 md:hidden"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div id="mobile-navigation-drawer" className="border-t border-gray-150 bg-white px-4 py-4 md:hidden shadow-lg animate-in slide-in-from-top duration-200">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-4 py-3 rounded-lg font-sans text-sm font-medium transition-colors ${
                  activeTab === item.id
                    ? 'text-slate-950 bg-slate-50 font-bold'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="mt-3 border-t border-gray-100 pt-3">
              <span className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-amber-50/50 py-2.5 px-3 rounded-lg border border-amber-100">
                <Globe className="h-3.5 w-3.5 text-amber-600" />
                <span>Direct World Export: Gujranwala to America, EU, AUS</span>
              </span>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
