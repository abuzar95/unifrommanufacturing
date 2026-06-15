/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, ProductCategory } from '../types';
import { Search, ShoppingCart, Percent, Clock, AlertCircle, Sparkles, Filter, ChevronRight, Check } from 'lucide-react';

// Import our premium generated photography
import heroMedalsImg from '../assets/images/hero_military_medals_1781530032347.jpg';
import ribbonCollectionImg from '../assets/images/ribbon_collection_1781530052193.jpg';
import bespokeMedalImg from '../assets/images/bespoke_medal_craft_1781530075456.jpg';

interface ProductCatalogProps {
  products: Product[];
  currency: 'USD' | 'EUR' | 'AUD';
  onAddToCart: (product: Product, qty: number) => void;
}

export default function ProductCatalog({ products, currency, onAddToCart }: ProductCatalogProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>('all');
  
  // States for detailed zoom modal
  const [selectedProductDetail, setSelectedProductDetail] = useState<Product | null>(null);
  const [detailQty, setDetailQty] = useState<number>(0);
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Helper to resolve product images seamlessly
  const resolveProductImage = (imgKey: string) => {
    if (imgKey === 'bespoke_medal_craft') return bespokeMedalImg;
    if (imgKey === 'ribbon_collection') return ribbonCollectionImg;
    if (imgKey === 'hero_military_medals') return heroMedalsImg;
    
    // Fallbacks
    if (imgKey.startsWith('http')) return imgKey;
    return `https://picsum.photos/seed/${imgKey}/800/600`;
  };

  // Pricing conversion
  const getProductPrice = (p: Product) => {
    if (currency === 'EUR') return { price: p.price_eur, symbol: '€' };
    if (currency === 'AUD') return { price: p.price_aud, symbol: 'A$' };
    return { price: p.price_usd, symbol: '$' };
  };

  // Wholesale pricing engine
  const calculateWholesaleDiscount = (qty: number) => {
    if (qty >= 1000) return { pct: 35, tier: "Government Contract Tier" };
    if (qty >= 200) return { pct: 20, tier: "Wholesale Guild Tier" };
    if (qty >= 50) return { pct: 10, tier: "Commander Order Tier" };
    return { pct: 0, tier: "Base Standard Pricing" };
  };

  const getWholesaleDescription = (minQty: number) => {
    return `Bulk orders of 50+ qualify for discounts up to 35% with specialized air dispatch.`;
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.sku.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoriesList = [
    { id: 'all', label: 'All Catalog' },
    { id: 'ribbon', label: 'Campaign Ribbons' },
    { id: 'medal', label: 'Medals & Awards' },
    { id: 'mounting', label: 'Mounting Brackets' },
    { id: 'accessory', label: 'Lapel Pins & Attachments' }
  ];

  const handleOpenDetail = (p: Product) => {
    setSelectedProductDetail(p);
    setDetailQty(p.min_order_qty);
  };

  const handleAddToCartWithQty = (p: Product, qty: number) => {
    onAddToCart(p, qty);
    setJustAddedId(p.id);
    setTimeout(() => {
      setJustAddedId(null);
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mb-8 sm:mb-10 text-center sm:text-left">
        <h2 className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          World-Class Standards Catalog
        </h2>
        <p className="mt-2 font-sans text-sm text-gray-500 max-w-xl">
          Browse our standard inventories manufactured to exact specifications. Ready for global dispatch. Any order can be fully customized at our Gujranwala looms.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-4">
        {/* Category Filters Bar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-xl border border-gray-150 bg-white p-5">
            <h3 className="flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-wider text-slate-800 mb-4 pb-3 border-b border-gray-100">
              <Filter className="h-4 w-4 text-amber-600" />
              <span>Award Categories</span>
            </h3>

            <div className="flex gap-2 overflow-x-auto pb-2 lg:grid lg:grid-cols-1 lg:gap-1 lg:overflow-visible lg:pb-0 -mx-1 px-1">
              {categoriesList.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-filter-${cat.id}`}
                  onClick={() => setSelectedCategory(cat.id as any)}
                  className={`flex shrink-0 lg:w-full items-center justify-between px-3 py-2.5 text-xs rounded-lg font-medium transition-all whitespace-nowrap ${
                    selectedCategory === cat.id
                      ? 'bg-slate-900 text-white font-semibold'
                      : 'text-gray-600 hover:bg-slate-50 hover:text-slate-950'
                  }`}
                >
                  <span>{cat.label}</span>
                  <ChevronRight className={`h-3 w-3 ${selectedCategory === cat.id ? 'text-amber-400' : 'text-gray-400'}`} />
                </button>
              ))}
            </div>

            {/* Gujranwala USP Badge inside Sidebar */}
            <div className="mt-8 rounded-lg bg-slate-950 text-white p-4 uppercase font-mono tracking-wider">
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-[10px]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>DIRECT FROM MILL</span>
              </div>
              <h4 className="text-[12px] font-bold text-slate-100 mt-1">GUJRANWALA WEAVING PRECISION</h4>
              <p className="text-[10px] text-slate-400 normal-case mt-1.5 font-sans leading-relaxed text-xs">
                Premium warp-density ribbon production allows us to custom weave any NATO, Allied, Commonwealth, or custom nation ribbon color scheme.
              </p>
            </div>
          </div>
        </div>

        {/* Catalog Search & Grid Panel */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Search Box Input */}
          <div className="relative">
            <Search className="absolute top-3.5 left-4 h-5 w-5 text-gray-400 pointers-events-none" />
            <input
              type="text"
              id="catalog-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by campaign name, country design, medal finish, or SKU code..."
              className="w-full bg-white border border-gray-200 rounded-xl py-3 pl-11 pr-4 text-sm font-sans placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-amber-500 focus:border-amber-500 transition-shadow"
            />
          </div>

          {/* Grid of Standard Products */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-gray-50/50 rounded-2xl border border-dashed border-gray-200">
              <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-500 font-sans">No matching items found. Looking for specialized ribbons? Check out our Ribbon Builder!</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => {
                const { price, symbol } = getProductPrice(product);
                return (
                  <div
                    key={product.id}
                    id={`product-card-${product.id}`}
                    className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-gray-150 bg-white shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div>
                      {/* Product Photography Cover */}
                      <div className="relative aspect-4/3 overflow-hidden bg-gray-50 border-b border-gray-100">
                        <img
                          src={resolveProductImage(product.image_url)}
                          alt={product.name}
                          className="h-full w-full object-cover group-hover:scale-104 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        {product.is_customizable && (
                          <span className="absolute top-3 left-3 bg-slate-900/90 backdrop-blur-xs text-[10px] font-semibold text-amber-400 border border-slate-700 uppercase px-2.5 py-0.5 rounded-full font-sans tracking-wide">
                            Customizable Striping
                          </span>
                        )}
                        <span className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-xs text-[10px] font-bold text-slate-800 uppercase px-2.5 py-0.5 rounded-md border border-gray-100 font-mono">
                          MIN QTY: {product.min_order_qty}
                        </span>
                      </div>

                      {/* Content Card */}
                      <div className="p-4 space-y-1.5">
                        <span className="font-mono text-[9px] text-amber-700 font-bold uppercase tracking-widest">{product.category} • SKU {product.sku}</span>
                        <h4 className="font-sans text-sm font-bold text-slate-900 line-clamp-1">{product.name}</h4>
                        <p className="font-sans text-xs text-gray-500 line-clamp-2 h-8 leading-normal">{product.description}</p>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="p-4 pt-0 border-t border-gray-50 mt-3 flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-mono font-medium text-gray-400 leading-none">WHOLESALE BASE</p>
                        <p className="text-sm font-mono font-bold text-slate-950 mt-1">
                          {symbol}{price.toFixed(2)} <span className="text-[10px] font-sans text-gray-500 font-normal">/pc</span>
                        </p>
                      </div>

                      <div className="flex gap-1.5">
                        <button
                          id={`product-card-detail-btn-${product.id}`}
                          onClick={() => handleOpenDetail(product)}
                          className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-gray-50 hover:bg-gray-100 rounded-md border border-gray-200 transition-colors cursor-pointer"
                        >
                          Specs & Quote
                        </button>
                        <button
                          id={`product-card-add-btn-${product.id}`}
                          onClick={() => handleAddToCartWithQty(product, product.min_order_qty)}
                          className={`p-1.5 rounded-md border transition-all cursor-pointer ${
                            justAddedId === product.id
                              ? 'bg-green-600 text-white border-green-700'
                              : 'bg-slate-950 border-slate-950 text-white hover:bg-slate-850'
                          }`}
                          title={`Add Min Order Qty (${product.min_order_qty})`}
                        >
                          {justAddedId === product.id ? (
                            <Check className="h-4 w-4" />
                          ) : (
                            <ShoppingCart className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Product Zoom Display & Wholesale Calculator Modal */}
      {selectedProductDetail && (() => {
        const p = selectedProductDetail;
        const { price, symbol } = getProductPrice(p);
        const { pct, tier } = calculateWholesaleDiscount(detailQty);
        const originalTotal = price * detailQty;
        const discountedPrice = price * (1 - pct / 100);
        const finalTotal = discountedPrice * detailQty;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs">
            <div 
              id="product-detail-modal"
              className="relative w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-100 max-h-[90vh] overflow-y-auto"
            >
              <button
                id="close-detail-modal"
                onClick={() => setSelectedProductDetail(null)}
                className="absolute top-4 right-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-gray-500 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                title="Close"
              >
                ✕
              </button>

              <div className="grid gap-6 md:grid-cols-12 p-6">
                {/* Visual Shot Photo Banner zoom */}
                <div className="md:col-span-6 space-y-3">
                  <div className="overflow-hidden rounded-xl bg-gray-50 border border-gray-150 aspect-4/3">
                    <img
                      src={resolveProductImage(p.image_url)}
                      alt={p.name}
                      className="h-full w-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="rounded-lg bg-amber-50 border border-amber-100 p-3.5 space-y-1 text-[11px] text-amber-900 leading-normal">
                    <span className="flex items-center gap-1 font-bold uppercase tracking-wider font-mono text-[10px] text-amber-800">
                      <Clock className="h-3.5 w-3.5 text-amber-600 shrink-0" />
                      <span>Gujranwala Facility Loom Turnaround</span>
                    </span>
                    <p>Estimated production queue time: <strong className="font-mono">{p.lead_time_days} Days</strong> since invoice approval.</p>
                  </div>
                </div>

                {/* Specific features and Wholesale Matrix */}
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-amber-700 uppercase tracking-widest">{p.category} • SKU {p.sku}</span>
                    <h3 className="font-sans text-xl font-bold text-slate-950 mt-0.5">{p.name}</h3>
                    <p className="font-sans text-xs text-gray-600 mt-2 leading-relaxed">{p.description}</p>
                  </div>

                  {/* High Quality product features checklist */}
                  <div className="space-y-1.5 pt-2">
                    <h5 className="text-[11px] font-bold text-slate-800 uppercase tracking-wider">High-Quality Specifications:</h5>
                    <div className="grid gap-1">
                      {p.features.map((feat, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-gray-600">
                          <Check className="h-4 w-4 text-green-600 shrink-0 mt-0.5" />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Interactive wholesale quote calculator */}
                  <div className="rounded-xl border border-gray-150 bg-slate-50 p-4 space-y-3">
                    <h4 className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800 uppercase tracking-wider leading-none">
                      <Percent className="h-4 w-4 text-amber-600" />
                      <span>Wholesale Quote Calculator (PAK to Global)</span>
                    </h4>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <label className="text-xs text-gray-500 font-medium select-none">Quote Order Qty:</label>
                        <div className="flex items-center gap-1 border border-gray-200 rounded-md bg-white p-0.5">
                          <button
                            id="detail-qty-decrement"
                            onClick={() => setDetailQty(Math.max(p.min_order_qty, detailQty - 25))}
                            className="px-2 py-0.5 bg-gray-50 text-slate-700 rounded text-xs font-bold hover:bg-gray-100 select-none"
                          >
                            -25
                          </button>
                          <input
                            type="number"
                            id="detail-qty-input"
                            value={detailQty}
                            onChange={(e) => setDetailQty(Math.max(p.min_order_qty, parseInt(e.target.value) || p.min_order_qty))}
                            min={p.min_order_qty}
                            className="w-16 text-center font-mono text-xs font-semibold focus:outline-hidden"
                          />
                          <button
                            id="detail-qty-increment"
                            onClick={() => setDetailQty(detailQty + 25)}
                            className="px-2 py-0.5 bg-gray-50 text-slate-700 rounded text-xs font-bold hover:bg-gray-100 select-none"
                          >
                            +25
                          </button>
                        </div>
                      </div>

                      {/* Display calculations */}
                      <div className="space-y-1.5 border-t border-gray-200 pt-2 text-xs">
                        {pct > 0 ? (
                          <div className="flex justify-between items-center text-green-700 font-medium">
                            <span>Bulk discount achieved:</span>
                            <span className="font-mono font-bold">-{pct}% ({tier})</span>
                          </div>
                        ) : (
                          <div className="text-[10px] text-gray-500 italic">
                            {getWholesaleDescription(p.min_order_qty)}
                          </div>
                        )}

                        <div className="flex justify-between font-mono text-gray-500 mt-1">
                          <span>Wholesale unit price:</span>
                          <span className={pct > 0 ? "line-through text-gray-400" : ""}>{symbol}{price.toFixed(2)}</span>
                        </div>

                        {pct > 0 && (
                          <div className="flex justify-between font-mono text-slate-900 font-semibold">
                            <span>Discounted unit price:</span>
                            <span className="text-green-600">{symbol}{discountedPrice.toFixed(2)}</span>
                          </div>
                        )}

                        <div className="flex justify-between font-mono text-slate-900 font-bold border-t border-dashed border-gray-250 pt-1.5 text-sm">
                          <span>Total estimate:</span>
                          <span>{symbol}{finalTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      id="detail-add-cart-btn"
                      onClick={() => {
                        handleAddToCartWithQty(p, detailQty);
                        setSelectedProductDetail(null);
                      }}
                      className="w-full bg-slate-950 text-white rounded-lg py-3 text-xs font-semibold hover:bg-slate-850 shadow-sm transition-colors cursor-pointer"
                    >
                      Add Bulk Group to Quote Form
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
