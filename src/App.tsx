/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import ProductCatalog from './components/ProductCatalog';
import RibbonBuilder from './components/RibbonBuilder';
import HowWeManufacture from './components/HowWeManufacture';
import CartModal from './components/CartModal';
import AdminPanel from './components/AdminPanel';
import { Product } from './types';
import { apiGetProducts } from './lib/supabaseClient';
import { ShieldAlert, Globe, Award, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';

export default function App() {
  // Navigation & Cart States
  const [activeTab, setActiveTab] = useState<'catalog' | 'builder' | 'manufacturing' | 'admin'>('catalog');
  const [currency, setCurrency] = useState<'USD' | 'EUR' | 'AUD'>('USD');
  const [cart, setCart] = useState<{ product: Product; qty: number }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Products collection state
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);

  // Load products on start
  useEffect(() => {
    loadProductsList();
  }, []);

  const loadProductsList = async () => {
    setIsLoadingProducts(true);
    const catalogItems = await apiGetProducts();
    setProducts(catalogItems);
    setIsLoadingProducts(false);
  };

  // Cart operations
  const handleAddToCart = (product: Product, qty: number) => {
    setCart((prevCart) => {
      const existingIdx = prevCart.findIndex((item) => item.product.id === product.id);
      if (existingIdx >= 0) {
        const updated = [...prevCart];
        updated[existingIdx].qty += qty;
        return updated;
      }
      return [...prevCart, { product, qty }];
    });
  };

  const handleUpdateCartQty = (productId: string, qty: number) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.product.id === productId ? { ...item, qty } : item
      )
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  // Compute total items in standard cart
  const cartItemsCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between" id="applet-main-container">
      
      {/* Universal header navigation bar */}
      <Header
        currentCurrency={currency}
        setCurrency={setCurrency}
        cartCount={cartItemsCount}
        openCart={() => setIsCartOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Dynamic Workspace Frame */}
      <main className="flex-1">
        
        {/* TAB 1: E-COMMERCE STOCKFRONT */}
        {activeTab === 'catalog' && (
          <div className="space-y-2 animate-in fade-in duration-250">
            <Hero
              onStartCustomizing={() => setActiveTab('builder')}
              onBrowseCatalog={() => {
                const catalogEl = document.getElementById('catalog-search-input');
                if (catalogEl) {
                  catalogEl.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />
            {isLoadingProducts ? (
              <div className="text-center py-24" id="catalog-loading">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-900 border-t-amber-500 mx-auto" />
                <p className="text-xs font-mono text-gray-500 mt-3 uppercase tracking-wider">Synchronizing Uniform Textile Industry Catalog...</p>
              </div>
            ) : (
              <ProductCatalog
                products={products}
                currency={currency}
                onAddToCart={handleAddToCart}
              />
            )}
          </div>
        )}

        {/* TAB 2: INTERACTIVE CUSTOM DESIGNER */}
        {activeTab === 'builder' && (
          <div className="animate-in fade-in duration-250">
            <RibbonBuilder onInquirySubmitted={() => setActiveTab('admin')} />
          </div>
        )}

        {/* TAB 3: BESPOKE HERITAGE & MANUFACTURING PROCESS DETAILS */}
        {activeTab === 'manufacturing' && (
          <div className="animate-in fade-in duration-250">
            <HowWeManufacture />
          </div>
        )}

        {/* TAB 4: MANAGEMENT ACCESS PORTAL */}
        {activeTab === 'admin' && (
          <div className="animate-in fade-in duration-250">
            <AdminPanel
              products={products}
              refreshProducts={loadProductsList}
              currency={currency}
            />
          </div>
        )}

      </main>

      {/* Slide-over Quote request Sidebar drawer */}
      <CartModal
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cart}
        currency={currency}
        updateQty={handleUpdateCartQty}
        removeItem={handleRemoveCartItem}
        clearCart={handleClearCart}
      />

      {/* Footer Area with manufacturing corporate specifications */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12" id="applet-footer">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-12">
            
            {/* Column Brand summary */}
            <div className="md:col-span-12 lg:col-span-5 space-y-4">
              <span className="flex items-center gap-2 text-white">
                <div className="flex h-8 w-8 items-center justify-center rounded bg-slate-800 text-amber-500">
                  <Award className="h-5.5 w-5.5" />
                </div>
                <strong className="text-base font-sans font-bold tracking-tight uppercase">UNIFORM TEXTILE INDUSTRY</strong>
              </span>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                A leading name in Gujranwala, Pakistan for high-quality industrial uniforms, corporate tactical workwear, computerized weaving, custom badges, and specialized textile formulations.
              </p>
              <div className="flex items-center gap-2 text-xs font-mono text-amber-500/90 font-medium bg-amber-500/5 py-1 px-3.5 rounded border border-amber-500/10 inline-flex">
                <Globe className="h-3.5 w-3.5 animate-spin-slow" />
                <span>Cargo Delivery Compliance: USA, Europe, Australia, & Asia</span>
              </div>
            </div>

            {/* Column contact details */}
            <div className="md:col-span-12 lg:col-span-4 space-y-2 text-xs">
              <h4 className="text-slate-100 font-bold uppercase tracking-wider text-[11px]">Factory Headquarters Office</h4>
              <div className="space-y-2 pt-1 text-slate-400 font-sans">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4.5 w-4.5 text-amber-500 shrink-0 mt-0.5" />
                  <span>G.T. Road, Climaxabad, Gujranwala, 52250, Punjab, Pakistan</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>+92-55-3258121 (Corporate Desk) | +92-300-8484123 (Mobile)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-amber-500 shrink-0" />
                  <span>info@uniformtextileindustry.com</span>
                </div>
                <div className="text-[10.5px] text-slate-500 pl-6">
                  Web: <a href="https://uniformtextileindustry.com" target="_blank" rel="noopener noreferrer" className="text-amber-500 hover:underline">uniformtextileindustry.com</a>
                </div>
              </div>
            </div>

            {/* Standards Compliance checklist Column */}
            <div className="md:col-span-12 lg:col-span-3 space-y-2 text-xs">
              <h4 className="text-slate-100 font-bold uppercase tracking-wider text-[11px]">Compliance & Weaving Standards</h4>
              <ul className="space-y-1 pt-1 font-mono text-[10px] text-slate-400">
                <li>• ISO 9001:2015 Quality Certified</li>
                <li>• US MIL-SPEC Premium Weft Yarn</li>
                <li>• Industrial Color Fastness Certified</li>
                <li>• OEKO-TEX Standard 100 Compliant</li>
              </ul>
            </div>

          </div>

          {/* Copyright mark */}
          <div className="border-t border-slate-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500">
            <span className="font-sans text-center sm:text-left">
              © {new Date().getFullYear()} Uniform Textile Industry. All Rights Reserved. Fully integrated with Supabase PostgreSQL client tools.
            </span>
            <div className="flex gap-4 mt-4 sm:mt-0 font-mono">
              <a href="#" className="hover:text-amber-500">Export Terms</a>
              <a href="#" className="hover:text-amber-500">Wholesale MOQ guidelines</a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}
