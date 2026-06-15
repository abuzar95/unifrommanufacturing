/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product, StandardOrder } from '../types';
import { apiSubmitStandardOrder } from '../lib/supabaseClient';
import { ShoppingBag, Trash2, ShieldCheck, Mail, Send, CheckCircle2, Globe, AlertCircle } from 'lucide-react';

interface CartItem {
  product: Product;
  qty: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: 'USD' | 'EUR' | 'AUD';
  updateQty: (productId: string, qty: number) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cartItems,
  currency,
  updateQty,
  removeItem,
  clearCart
}: CartModalProps) {
  // Contact/Inquiry details
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [targetCountry, setTargetCountry] = useState('United States');
  const [specialInstructions, setSpecialInstructions] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!isOpen) return null;

  // Currency lookup helpers
  const getProductPrice = (p: Product) => {
    if (currency === 'EUR') return { price: p.price_eur, symbol: '€' };
    if (currency === 'AUD') return { price: p.price_aud, symbol: 'A$' };
    return { price: p.price_usd, symbol: '$' };
  };

  // Wholesale pricing tiers
  const calculateWholesaleDiscount = (qty: number) => {
    if (qty >= 1000) return 0.35; // 35% discount
    if (qty >= 200) return 0.20; // 20% discount
    if (qty >= 50) return 0.10; // 10% discount
    return 0.0;
  };

  // Compute overall total
  let overallTotal = 0;
  const computedItems = cartItems.map((item) => {
    const { price, symbol } = getProductPrice(item.product);
    const disc = calculateWholesaleDiscount(item.qty);
    const finalUnitPrice = price * (1 - disc);
    const subtotal = finalUnitPrice * item.qty;
    overallTotal += subtotal;

    return {
      ...item,
      basePrice: price,
      symbol,
      discPercent: Math.round(disc * 100),
      finalUnitPrice,
      subtotal
    };
  });

  const getCurrencySymbol = () => {
    if (currency === 'EUR') return '€';
    if (currency === 'AUD') return 'A$';
    return '$';
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;
    if (!buyerName || !buyerEmail) {
      alert("Please provide your contact name and email to proceed with your proposal invoice draft.");
      return;
    }

    setIsSubmitting(true);

    const stdOrder: StandardOrder = {
      id: `std-order-${Date.now()}`,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_organization: buyerOrg,
      target_country: targetCountry,
      cart_items: computedItems.map(item => ({
        product_id: item.product.id,
        product_name: item.product.name,
        qty: item.qty,
        subtotal: item.subtotal
      })),
      total_amount: overallTotal,
      currency: currency,
      special_instructions: specialInstructions,
      status: 'pending_invoice',
      created_at: new Date().toISOString()
    };

    await apiSubmitStandardOrder(stdOrder);
    setIsSubmitting(false);
    setOrderSuccess(true);
    
    // Clear inputs and cart
    setBuyerName('');
    setBuyerEmail('');
    setBuyerOrg('');
    setSpecialInstructions('');

    setTimeout(() => {
      setOrderSuccess(false);
      clearCart();
      onClose();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs">
      <div 
        id="cart-modal-container"
        className="relative w-full max-w-4xl rounded-2xl bg-white shadow-2xl overflow-hidden border border-gray-150 flex flex-col max-h-[92vh]"
      >
        {/* Header bar */}
        <div className="bg-slate-900 px-6 py-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5.5 w-5.5 text-amber-500" />
            <h3 className="font-sans text-base font-bold text-white uppercase tracking-wider">
              Wholesale Cart Quote Proposal ({cartItems.length} styles)
            </h3>
          </div>
          <button
            id="close-cart-btn"
            onClick={onClose}
            className="text-gray-400 hover:text-white text-lg font-bold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {orderSuccess ? (
          /* Thank You success module */
          <div id="cart-success-module" className="p-8 text-center space-y-4 my-auto">
            <div className="h-14 w-14 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto border border-green-200">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h4 className="font-sans text-xl font-bold text-slate-950">Wholesale Quote Issued</h4>
            <p className="font-sans text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
              Based on your target delivery location, our dispatch desk in Gujranwala, Pakistan will compile shipping freight charges and issue your draft proforma invoice shortly.
            </p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto grid md:grid-cols-12">
            {/* Left Column: Cart items and calculator summary */}
            <div className="md:col-span-7 p-6 border-r border-gray-100 flex flex-col justify-between max-h-[60vh] overflow-y-auto">
              {computedItems.length === 0 ? (
                <div className="text-center py-16 space-y-2">
                  <ShoppingBag className="h-10 w-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-sans text-gray-500">Your wholesale quote sheet is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {computedItems.map((item) => (
                    <div 
                      key={item.product.id} 
                      className="flex gap-3 bg-slate-50 border border-gray-150 p-3 rounded-lg relative hover:border-gray-300 transition-colors"
                      id={`cart-item-${item.product.id}`}
                    >
                      <div className="h-14 w-14 shrink-0 rounded bg-gray-100 overflow-hidden border border-gray-200">
                        {/* Fallback pattern to generic or generated graphics */}
                        <div className="h-full w-full bg-slate-800 text-amber-500 flex items-center justify-center font-mono text-[9px] font-bold">
                          {item.product.sku}
                        </div>
                      </div>

                      <div className="grow space-y-1">
                        <h5 className="font-sans text-xs font-bold text-slate-950 line-clamp-1">{item.product.name}</h5>
                        
                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                          {/* Unit price with potential discount striked out */}
                          <div className="font-mono">
                            <span className="text-gray-400">Base Price:</span>{' '}
                            <span className={item.discPercent > 0 ? 'line-through text-gray-300' : 'text-slate-800 font-bold'}>
                              {item.symbol}{item.basePrice.toFixed(2)}
                            </span>
                            {item.discPercent > 0 && (
                              <span className="text-green-600 font-bold ml-1.5">{item.symbol}{item.finalUnitPrice.toFixed(2)}</span>
                            )}
                          </div>

                          {/* Dynamic discount tag */}
                          {item.discPercent > 0 && (
                            <span className="bg-green-50 text-green-700 text-[9px] font-bold uppercase rounded px-1 border border-green-200 animate-pulse">
                              -{item.discPercent}% wholesale applied
                            </span>
                          )}
                        </div>

                        {/* Adjust quantities */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-1">
                            <button
                              id={`cart-qty-dec-${item.product.id}`}
                              onClick={() => updateQty(item.product.id, Math.max(item.product.min_order_qty, item.qty - 25))}
                              className="px-1.5 py-0.5 bg-white text-slate-700 rounded border border-gray-200 text-[10px] font-bold hover:bg-gray-100 select-none"
                            >
                              -25
                            </button>
                            <span className="font-mono text-xs font-bold text-slate-850 px-2 select-none">{item.qty} units</span>
                            <button
                              id={`cart-qty-inc-${item.product.id}`}
                              onClick={() => updateQty(item.product.id, item.qty + 25)}
                              className="px-1.5 py-0.5 bg-white text-slate-700 rounded border border-gray-200 text-[10px] font-bold hover:bg-gray-100 select-none"
                            >
                              +25
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs font-bold text-slate-900">{item.symbol}{item.subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                            <button
                              id={`cart-item-remove-${item.product.id}`}
                              onClick={() => removeItem(item.product.id)}
                              className="text-gray-400 hover:text-red-500 cursor-pointer"
                              title="Delete Item"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        {/* Minimum Quantity Warning */}
                        {item.qty <= item.product.min_order_qty && (
                          <p className="text-[10px] text-amber-700 flex items-center gap-1 mt-1 font-sans">
                            <AlertCircle className="h-3 w-3 shrink-0" />
                            <span>Enforcing wholesale MOQ constraint: {item.product.min_order_qty} units.</span>
                          </p>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              )}

              {computedItems.length > 0 && (
                <div className="border-t border-gray-150 pt-4 mt-6">
                  <div className="flex justify-between items-center text-sm font-sans font-bold text-slate-950">
                    <span>ESTIMATED QUANTITY SUB-TOTAL:</span>
                    <span className="font-mono font-black text-amber-600 text-base">
                      {getCurrencySymbol()}{overallTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 italic mt-1 font-sans">
                    *Excludes shipping custom duty tariffs, carrier freight insurance, and regional taxations. Exact air rate parsed on invoice drafting.
                  </p>
                </div>
              )}

            </div>

            {/* Right Column: Contact Detail Invoice generator Form */}
            <div className="md:col-span-5 p-6 bg-slate-50 overflow-y-auto max-h-[60vh] md:max-h-full">
              <form onSubmit={handleSubmitOrder} className="space-y-4">
                <div className="space-y-1">
                  <h4 className="font-sans text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Invoice Details
                  </h4>
                  <p className="text-[10px] text-gray-500 leading-normal">
                    Secure direct wholesale invoice coordinates detailing global flight tracking.
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Contact Full Name:</label>
                    <input
                      type="text"
                      required
                      id="cart-buyer-name"
                      placeholder="e.g. Captain Laura Croft"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Officer Email Address:</label>
                    <input
                      type="email"
                      required
                      id="cart-buyer-email"
                      placeholder="e.g. lcroft@defence.gov.uk"
                      value={buyerEmail}
                      onChange={(e) => setBuyerEmail(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Command / Veteran Legion Union:</label>
                    <input
                      type="text"
                      id="cart-buyer-org"
                      placeholder="e.g. British Royal Veterans Legion"
                      value={buyerOrg}
                      onChange={(e) => setBuyerOrg(e.target.value)}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Target Cargo Market:</label>
                    <select
                      id="cart-buyer-country"
                      value={targetCountry}
                      onChange={(e) => setTargetCountry(e.target.value)}
                      className="w-full bg-white border border-gray-200 text-xs rounded-lg p-2 focus:outline-hidden focus:border-amber-500 font-sans"
                    >
                      <option value="United States">United States (Air dispatch)</option>
                      <option value="Australia">Australia & NZ (Ocean-freight compatible)</option>
                      <option value="United Kingdom">United Kingdom (Direct Allied Port)</option>
                      <option value="Germany">European Union (Mainland Transit)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Delivery Packaging requests:</label>
                    <textarea
                      placeholder="Felt pouch dividers, batch wood vaults, target pallet markings, custom packing serial numbers..."
                      value={specialInstructions}
                      id="cart-special-instructions"
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      rows={2.5}
                      className="w-full bg-white border border-gray-200 rounded-lg p-2 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="space-y-2 pt-4">
                  <button
                    type="submit"
                    id="cart-submit-quote-btn"
                    disabled={isSubmitting || cartItems.length === 0}
                    className="w-full bg-amber-600 text-white hover:bg-amber-500 p-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                    <span>{isSubmitting ? "Generating Proforma Data..." : "Submit Draft Order Quote"}</span>
                  </button>

                  <div className="flex items-center gap-1 bg-amber-50/50 rounded p-2 text-[10px] text-amber-805 border border-amber-100 leading-normal">
                    <ShieldCheck className="h-4 w-4 text-amber-600 shrink-0" />
                    <span>No upfront credit charge. This inquiry will be converted directly into a formal catalog quote via Gujranwala dispatch desk.</span>
                  </div>
                </div>

              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
