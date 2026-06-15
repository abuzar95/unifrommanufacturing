/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Product, CustomRibbonOrder, StandardOrder, ProductCategory } from '../types';
import { 
  apiGetProducts, apiSaveProduct, apiDeleteProduct, 
  apiGetCustomOrders, apiUpdateCustomOrderStatus,
  apiGetStandardOrders, apiUpdateStandardOrderStatus,
  isSupabaseConfigured, SUPABASE_SQL_SCHEMA 
} from '../lib/supabaseClient';
import { 
  Database, Plus, Trash2, FileJson, Check, ClipboardCopy, 
  CheckCircle, Globe, ShoppingBag, ShieldAlert, BadgeInfo, Eye 
} from 'lucide-react';

interface AdminPanelProps {
  products: Product[];
  refreshProducts: () => void;
  currency: 'USD' | 'EUR' | 'AUD';
}

export default function AdminPanel({ products, refreshProducts, currency }: AdminPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<'products' | 'custom_orders' | 'std_orders' | 'supabase'>('custom_orders');
  
  // Storage states for inquiries
  const [customOrders, setCustomOrders] = useState<CustomRibbonOrder[]>([]);
  const [standardOrders, setStandardOrders] = useState<StandardOrder[]>([]);
  
  // Clipboard copied indicator
  const [copiedSql, setCopiedSql] = useState(false);

  // New product inputs form
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('ribbon');
  const [newProdSKU, setNewProdSKU] = useState('');
  const [newProdPriceUSD, setNewProdPriceUSD] = useState(15.00);
  const [newProdPriceEUR, setNewProdPriceEUR] = useState(13.80);
  const [newProdPriceAUD, setNewProdPriceAUD] = useState(22.00);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdMOQ, setNewProdMOQ] = useState(50);
  const [newProdLeadTime, setNewProdLeadTime] = useState(10);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    loadOrdersAndInquiries();
  }, []);

  const loadOrdersAndInquiries = async () => {
    const customList = await apiGetCustomOrders();
    const stdList = await apiGetStandardOrders();
    setCustomOrders(customList);
    setStandardOrders(stdList);
  };

  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdSKU) {
      alert("Please fill in the Product Name and SKU code.");
      return;
    }

    setIsAddingProduct(true);

    const generatedProduct: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName,
      category: newProdCategory,
      description: newProdDesc || "Premium bespoke Gujranwala handiwork award.",
      sku: newProdSKU.toUpperCase(),
      price_usd: newProdPriceUSD,
      price_eur: newProdPriceEUR,
      price_aud: newProdPriceAUD,
      image_url: newProdCategory === 'medal' ? 'bespoke_medal_craft' : 'ribbon_collection',
      is_customizable: true,
      features: ['NATO certified material filament weave', 'Rust resisting dual plates', 'Sealed finish backing'],
      min_order_qty: newProdMOQ,
      lead_time_days: newProdLeadTime
    };

    await apiSaveProduct(generatedProduct);
    setIsAddingProduct(false);
    setShowForm(false);
    
    // reset inputs
    setNewProdName('');
    setNewProdSKU('');
    setNewProdDesc('');
    
    refreshProducts();
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm("Are you certain you wish to delete this product from the e-commerce inventory?")) {
      await apiDeleteProduct(id);
      refreshProducts();
    }
  };

  const handleUpdateCustomStatus = async (orderId: string, status: CustomRibbonOrder['status']) => {
    await apiUpdateCustomOrderStatus(orderId, status);
    loadOrdersAndInquiries();
  };

  const handleUpdateStdStatus = async (orderId: string, status: StandardOrder['status']) => {
    await apiUpdateStandardOrderStatus(orderId, status);
    loadOrdersAndInquiries();
  };

  const handleCopySql = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const isConnected = isSupabaseConfigured();

  // Helper inside loop to display mini visual vector of custom stripe configurations
  const renderStripeDesignRow = (order: CustomRibbonOrder) => {
    return (
      <div 
        style={{
          backgroundColor: order.base_color,
          borderColor: order.border_color,
          borderWidth: '2px',
          borderStyle: 'solid'
        }}
        className="relative w-28 h-6 rounded-md overflow-hidden flex items-center justify-center shadow-xs shrink-0 self-center"
      >
        <div className="absolute inset-0 flex justify-evenly pointer-events-none">
          {order.stripes && order.stripes.map((stripe, index) => (
            <div
              key={index}
              style={{
                backgroundColor: stripe.color,
                width: `${stripe.width_pct}%`,
                height: '100%'
              }}
              className="h-full opacity-90 border-r border-black/10 last:border-0"
            />
          ))}
        </div>
        <span className="relative z-10 text-[9px] text-white bg-black/40 px-1 rounded uppercase font-bold transform scale-80 font-sans tracking-widest text-center">
          {order.emblem !== 'none' ? order.emblem.replace('_', ' ') : 'No Emblem'}
        </span>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner Control */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-gray-100">
        <div>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-slate-900">
            Staff Administrative Dashboard
          </h2>
          <p className="text-xs text-gray-500 mt-1 font-sans">
            Manage catalog specifications, audit wholesale order proforma drafts, and review CAD ribbon weaving blueprints.
          </p>
        </div>

        {/* Database Quick Health state */}
        <div className="flex items-center gap-2">
          {isConnected ? (
            <div className="flex items-center gap-1.5 bg-green-50 text-green-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-200">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
              <span>Supabase Direct Connect Live</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-lg border border-amber-200">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <span>Offline Preview Mode Active</span>
            </div>
          )}
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex border-b border-gray-200 gap-1 overflow-x-auto pb-0.5 whitespace-nowrap">
        <button
          id="admin-subtab-custom"
          onClick={() => setActiveSubTab('custom_orders')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg border-t-2 border-x transition-all select-none ${
            activeSubTab === 'custom_orders'
              ? 'border-slate-900 bg-white text-slate-950 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Custom Weave Blueprints ({customOrders.length})
        </button>

        <button
          id="admin-subtab-std"
          onClick={() => setActiveSubTab('std_orders')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg border-t-2 border-x transition-all select-none ${
            activeSubTab === 'std_orders'
              ? 'border-slate-900 bg-white text-slate-950 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Wholesale Order Drafts ({standardOrders.length})
        </button>

        <button
          id="admin-subtab-products"
          onClick={() => setActiveSubTab('products')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg border-t-2 border-x transition-all select-none ${
            activeSubTab === 'products'
              ? 'border-slate-900 bg-white text-slate-950 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Products Stock Control ({products.length})
        </button>

        <button
          id="admin-subtab-supabase"
          onClick={() => setActiveSubTab('supabase')}
          className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider rounded-t-lg border-t-2 border-x transition-all select-none ${
            activeSubTab === 'supabase'
              ? 'border-slate-950 bg-white text-slate-950 font-black'
              : 'border-transparent text-gray-400 hover:text-gray-700'
          }`}
        >
          Database Hub Connection
        </button>
      </div>

      {/* SUBTAB CONTENT 1: CUSTOM WEAVING BLUEPRINTS */}
      {activeSubTab === 'custom_orders' && (
        <div className="space-y-4">
          {customOrders.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No bespoke CAD configurations are registered in public log files.
            </p>
          ) : (
            <div className="grid gap-4">
              {customOrders.map((order) => (
                <div 
                  key={order.id} 
                  id={`custom-blueprint-${order.id}`}
                  className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs flex flex-col md:flex-row justify-between gap-6"
                >
                  <div className="space-y-3 flex-1">
                    {/* Header */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-gray-400 uppercase tracking-widest bg-slate-100 py-1 px-2 rounded">
                        CAD-ID: {order.id}
                      </span>
                      <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 border ${
                        order.status === 'pending_review' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        order.status === 'design_approved' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        'bg-green-50 text-green-700 border-green-200'
                      }`}>
                        {order.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Designer Specifications Row */}
                    <div className="grid gap-2 sm:grid-cols-2 text-xs leading-relaxed">
                      <div>
                        <p className="text-gray-500 font-medium">Buyer Details:</p>
                        <strong className="text-slate-900 block">{order.buyer_name}</strong>
                        <span className="text-gray-500">{order.buyer_email}</span>
                      </div>
                      
                      <div>
                        <p className="text-gray-500 font-medium">Command Unit & Target Market:</p>
                        <strong className="text-slate-900 block">{order.buyer_organization || "Private Buyer"}</strong>
                        <span className="text-gray-500 flex items-center gap-1">
                          <Globe className="h-3 w-3 text-amber-600" />
                          <span>{order.target_country}</span>
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-600 bg-slate-50 p-2.5 rounded-lg border border-gray-100 font-sans italic">
                      "Specs: {order.additional_specs || "None given."}"
                    </p>

                    <div className="text-[11px] font-medium text-gray-500 flex flex-wrap gap-x-4 gap-y-1">
                      <span>Mount: <strong>{order.mounting_type.replace('_', ' ')}</strong></span>
                      <span>Finish plating: <strong>{order.device_finish.replace('_', ' ')}</strong></span>
                      <span>Target Batch Estimate: <strong className="font-mono bg-amber-50 text-amber-800 border border-amber-200 px-1 rounded py-0.5">{order.estimated_qty} pcs</strong></span>
                    </div>
                  </div>

                  {/* Render design alongside actions */}
                  <div className="flex flex-col justify-between items-end gap-4 min-w-[150px]">
                    {renderStripeDesignRow(order)}

                    <div className="space-y-1.5 w-full text-right">
                      <label className="block text-[10px] font-bold uppercase text-gray-400">Change Blueprint Log State:</label>
                      <select
                        id={`status-select-custom-${order.id}`}
                        value={order.status}
                        onChange={(e: any) => handleUpdateCustomStatus(order.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg p-1.5 bg-slate-50 w-full md:w-auto font-sans focus:outline-hidden"
                      >
                        <option value="pending_review">Pending Review</option>
                        <option value="design_approved">Design Approved</option>
                        <option value="production_quote_sent">Production Quote Sent</option>
                        <option value="manufacturing">Active Manufacturing</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB CONTENT 2: STANDARD ORDERS / CART INVOICES */}
      {activeSubTab === 'std_orders' && (
        <div className="space-y-4">
          {standardOrders.length === 0 ? (
            <p className="text-center py-12 text-sm text-gray-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
              No standard catalog order logs have been parsed from client standard shopping checks.
            </p>
          ) : (
            <div className="grid gap-4">
              {standardOrders.map((order) => (
                <div 
                  key={order.id} 
                  id={`std-order-${order.id}`}
                  className="bg-white border border-gray-150 rounded-xl p-5 shadow-xs space-y-4"
                >
                  <div className="flex justify-between items-center flex-wrap gap-2 borer-b border-gray-50 pb-2">
                    <div>
                      <span className="font-mono text-xs font-bold text-gray-400 bg-slate-100 py-1 px-2 rounded mr-2">ORDER-ID: {order.id}</span>
                      <strong className="text-xs font-sans text-slate-800">{new Date(order.created_at).toLocaleDateString()}</strong>
                    </div>

                    <span className={`text-[10px] font-bold uppercase rounded-full px-2.5 py-0.5 border ${
                      order.status === 'pending_invoice' ? 'bg-amber-100 text-amber-800 border-amber-200' :
                      order.status === 'manufactured' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 text-xs leading-relaxed">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Buyer:</p>
                      <strong>{order.buyer_name}</strong>
                      <p className="text-gray-500">{order.buyer_email}</p>
                      <p className="text-gray-500">{order.buyer_organization || "General Organization"}</p>
                    </div>

                    <div>
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Carrier Market Destination:</p>
                      <p className="flex items-center gap-1 mt-0.5">
                        <Globe className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                        <span>{order.target_country}</span>
                      </p>
                      {order.special_instructions && (
                        <p className="text-[10px] text-amber-800 italic mt-1 bg-amber-50/50 p-1 rounded">Inst: "{order.special_instructions}"</p>
                      )}
                    </div>

                    <div className="space-y-1">
                      <p className="text-gray-400 font-semibold uppercase text-[10px]">Item Stack Listing:</p>
                      <div className="space-y-1">
                        {order.cart_items && order.cart_items.map((cart, idx) => (
                          <div key={idx} className="flex justify-between text-slate-700">
                            <span>{cart.product_name} <strong>x{cart.qty}</strong></span>
                            <span className="font-mono">{order.currency === 'EUR' ? '€' : order.currency === 'AUD' ? 'A$' : '$'}{cart.subtotal.toFixed(2)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between border-t border-dashed border-gray-200 pt-1 font-bold text-slate-900">
                          <span>Quote Sum Amount:</span>
                          <span className="font-mono">{order.currency === 'EUR' ? '€' : order.currency === 'AUD' ? 'A$' : '$'}{order.total_amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Move state controller */}
                  <div className="flex justify-end gap-1.5 pt-2 border-t border-gray-50">
                    <label className="text-[10px] font-bold uppercase text-gray-400 shrink-0 self-center">Set Order State:</label>
                    <select
                      id={`status-select-std-${order.id}`}
                      value={order.status}
                      onChange={(e: any) => handleUpdateStdStatus(order.id, e.target.value)}
                      className="text-xs border border-gray-200 rounded-lg p-1.5 bg-slate-50 font-sans focus:outline-hidden"
                    >
                      <option value="pending_invoice">Pending Invoice Proforma</option>
                      <option value="payment_confirmed">Payment Confirmed</option>
                      <option value="manufactured">Ready at Gujranwala Facility</option>
                      <option value="dispatched">Dispatched to International Port</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUBTAB CONTENT 3: PRODUCTS STOCK INVENTORY CONTROLLER */}
      {activeSubTab === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-widest font-bold">
              Active Stock listing ({products.length} Items)
            </h3>

            <button
              id="admin-form-toggle"
              onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-slate-950 hover:bg-slate-850 py-2 px-3.5 rounded-lg border border-slate-900 shadow-sm transition-all cursor-pointer"
            >
              <Plus className="h-4 w-4" />
              <span>{showForm ? "Close Form" : "Add New Award Catalog Detail"}</span>
            </button>
          </div>

          {/* Form Create Product */}
          {showForm && (
            <form onSubmit={handleCreateProductSubmit} className="bg-slate-50 border border-gray-150 rounded-xl p-6 grid gap-4">
              <h4 className="font-sans text-sm font-bold text-slate-900 leading-none">Add New Military Award Product</h4>
              
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Award Name:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Legion Honor Gold Medal"
                    value={newProdName}
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Unique SKU Code:</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. MED-LHG"
                    value={newProdSKU}
                    onChange={(e) => setNewProdSKU(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Category:</label>
                  <select
                    value={newProdCategory}
                    onChange={(e: any) => setNewProdCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden"
                  >
                    <option value="ribbon">Campaign Ribbon</option>
                    <option value="medal">Medals & Insignias</option>
                    <option value="mounting">Mounting Brackets</option>
                    <option value="accessory">Attachments & Pins</option>
                  </select>
                </div>
              </div>

              {/* Pricing metrics */}
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Price USD ($):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPriceUSD}
                    onChange={(e) => setNewProdPriceUSD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Price EUR (€):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPriceEUR}
                    onChange={(e) => setNewProdPriceEUR(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Price AUD (A$):</label>
                  <input
                    type="number"
                    step="0.01"
                    value={newProdPriceAUD}
                    onChange={(e) => setNewProdPriceAUD(parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden font-mono"
                  />
                </div>
              </div>

              {/* Logistics values */}
              <div className="grid gap-4 sm:grid-cols-3 text-xs">
                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Wholesale Min MOQ:</label>
                  <input
                    type="number"
                    value={newProdMOQ}
                    onChange={(e) => setNewProdMOQ(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Production Lead Time (Days):</label>
                  <input
                    type="number"
                    value={newProdLeadTime}
                    onChange={(e) => setNewProdLeadTime(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden font-mono"
                  />
                </div>

                <div>
                  <label className="block text-gray-600 mb-1 font-semibold">Category description:</label>
                  <input
                    type="text"
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    placeholder="Short summary of fabric weave/plating standards..."
                    className="w-full bg-white border border-gray-200 rounded-lg p-2 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  id="admin-form-submit-btn"
                  disabled={isAddingProduct}
                  className="bg-slate-950 hover:bg-slate-850 px-4 py-2 rounded-lg text-white font-bold ml-auto text-xs py-2.5 cursor-pointer disabled:opacity-40"
                >
                  {isAddingProduct ? "Publishing SKU..." : "Publish Product Stock Info"}
                </button>
              </div>
            </form>
          )}

          {/* Table display */}
          <div className="overflow-x-auto rounded-xl border border-gray-150 bg-white">
            <table className="w-full border-collapse text-left text-xs text-slate-800">
              <thead>
                <tr className="bg-slate-50 border-b border-gray-150 text-slate-400 font-bold uppercase tracking-wider font-mono">
                  <th className="p-4">SKU / ID</th>
                  <th className="p-4">Award Title</th>
                  <th className="p-4">Wholesale price USD/EUR/AUD</th>
                  <th className="p-4">Min order volume</th>
                  <th className="p-4">Lead Time</th>
                  <th className="p-4 text-right">Stock Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 font-sans">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/50">
                    <td className="p-4 font-mono font-bold text-amber-700">{p.sku}</td>
                    <td className="p-4 font-semibold text-slate-900">{p.name} <span className="text-[10px] text-gray-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase font-bold ml-1.5">{p.category}</span></td>
                    <td className="p-4 font-mono">
                      ${p.price_usd.toFixed(2)} / €{p.price_eur.toFixed(2)} / A${p.price_aud.toFixed(2)}
                    </td>
                    <td className="p-4 font-mono font-medium">{p.min_order_qty} pcs</td>
                    <td className="p-4 font-mono font-medium">{p.lead_time_days} days production</td>
                    <td className="p-4 text-right">
                      <button
                        id={`delete-product-row-${p.id}`}
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 px-2 hover:bg-red-50 text-red-600 rounded border border-transparent hover:border-red-100 transition-colors inline-flex cursor-pointer text-[11px] font-bold"
                        title="Delete SKU"
                      >
                        <Trash2 className="h-4 w-4 shrink-0 mr-1" /> Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB CONTENT 4: SUPABASE DATABASE HUB CONNECTION GUIDE */}
      {activeSubTab === 'supabase' && (
        <div className="gap-6 grid md:grid-cols-12">
          
          <div className="md:col-span-4 space-y-4">
            <div className="bg-white border border-gray-150 rounded-xl p-5 space-y-3 shadow-xs">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase bg-blue-50 text-blue-800 border border-blue-200 py-0.5 px-2 rounded-full font-bold">
                Integration Protocol
              </span>

              <h4 className="font-sans text-sm font-bold text-slate-900">Configure Supabase Secrets</h4>
              <p className="text-xs text-gray-600 leading-normal">
                To connect this premium awards store with a real Supabase PostgreSQL backend, populate the environment variables below in your workspace environment configuration panel:
              </p>

              <div className="bg-slate-50 border border-gray-200 rounded p-3 text-[11px] font-mono text-slate-700 space-y-1.5">
                <div>
                  <span className="text-gray-400"># URL Endpoint:</span>
                  <p className="text-slate-800 break-all font-bold">VITE_SUPABASE_URL</p>
                </div>
                <div>
                  <span className="text-gray-400"># Public Anon Key:</span>
                  <p className="text-slate-800 break-all font-bold">VITE_SUPABASE_ANON_KEY</p>
                </div>
              </div>

              <div className="flex items-start gap-2 bg-amber-50 rounded p-2.5 text-[10px] text-amber-805 border border-amber-100">
                <BadgeInfo className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                <span>If keys are missing, the applet bypasses the server and writes directly to local browser session logs to simplify client evaluation tests!</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-8 space-y-3">
            <div className="bg-slate-950 text-white rounded-xl p-5 space-y-4 shadow-lg flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Database className="h-5 w-5 text-amber-500 animate-pulse" />
                  <h4 className="font-sans text-xs font-bold uppercase tracking-wider text-slate-100">Recommended PostgreSQL SQL Schema (Run in Supabase Editor)</h4>
                </div>
                
                <button
                  id="copy-sql-btn"
                  onClick={handleCopySql}
                  className="text-xs bg-slate-900 hover:bg-slate-800 text-amber-400 py-1.5 px-3 rounded-lg flex items-center gap-1.5 transition-colors font-sans border border-slate-800 cursor-pointer font-bold uppercase tracking-wider text-[10px]"
                >
                  {copiedSql ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-green-500" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <ClipboardCopy className="h-3.5 w-3.5 text-amber-500 hover:scale-103" />
                      <span>Copy SQL Schema</span>
                    </>
                  )}
                </button>
              </div>

              {/* Schema text */}
              <div className="overflow-x-auto max-h-[300px] border border-slate-800 rounded bg-slate-900 p-3 font-mono text-[10px] text-slate-400 leading-normal select-all">
                <pre>{SUPABASE_SQL_SCHEMA}</pre>
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
