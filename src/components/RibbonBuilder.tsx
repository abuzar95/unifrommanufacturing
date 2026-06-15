/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CustomRibbonOrder, StripeConfig } from '../types';
import { apiSubmitCustomOrder } from '../lib/supabaseClient';
import { Sparkles, Save, ShieldAlert, BookOpen, Send, Plus, Trash2, Globe, CheckCircle } from 'lucide-react';

interface RibbonBuilderProps {
  onInquirySubmitted: () => void;
}

export default function RibbonBuilder({ onInquirySubmitted }: RibbonBuilderProps) {
  // Ribbon design states
  const [baseColor, setBaseColor] = useState('#0f172a'); // default deep navy
  const [borderColor, setBorderColor] = useState('#d97706'); // default brass gold border
  const [stripes, setStripes] = useState<StripeConfig[]>([
    { color: '#b91c1c', width_pct: 15 },
    { color: '#ffffff', width_pct: 10 },
    { color: '#1d4ed8', width_pct: 15 }
  ]);
  const [emblem, setEmblem] = useState<CustomRibbonOrder['emblem']>('star_gold');
  const [mountingType, setMountingType] = useState<CustomRibbonOrder['mounting_type']>('clutch_back');
  const [deviceFinish, setDeviceFinish] = useState<CustomRibbonOrder['device_finish']>('antique_gold');

  // Contact/Inquiry details
  const [buyerName, setBuyerName] = useState('');
  const [buyerEmail, setBuyerEmail] = useState('');
  const [buyerOrg, setBuyerOrg] = useState('');
  const [targetCountry, setTargetCountry] = useState('United States');
  const [estimatedQty, setEstimatedQty] = useState(250);
  const [additionalSpecs, setAdditionalSpecs] = useState('');

  // Status flags
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  // Predefined authentic colors
  const ribbonPalette = [
    { value: '#0f172a', name: 'Navy Blue' },
    { value: '#b91c1c', name: 'Crimson Scarlet' },
    { value: '#15803d', name: 'Forest Green' },
    { value: '#d97706', name: 'Bronze Gold' },
    { value: '#ffffff', name: 'Optic White' },
    { value: '#1e40af', name: 'Royal Blue' },
    { value: '#10b981', name: 'Smaragd Green' },
    { value: '#eab308', name: 'Campaign Yellow' },
    { value: '#8b5cf6', name: 'Purple Heart' },
    { value: '#000000', name: 'Obsidian Black' }
  ];

  // Handler to add vertical stripes
  const handleAddStripe = () => {
    if (stripes.length >= 6) return; // limit cluster
    setStripes([...stripes, { color: '#eab308', width_pct: 10 }]);
  };

  const handleRemoveStripe = (index: number) => {
    setStripes(stripes.filter((_, i) => i !== index));
  };

  const handleUpdateStripeColor = (index: number, color: string) => {
    const updated = [...stripes];
    updated[index].color = color;
    setStripes(updated);
  };

  const handleUpdateStripeWidth = (index: number, width: number) => {
    const updated = [...stripes];
    updated[index].width_pct = Math.min(100, Math.max(5, width));
    setStripes(updated);
  };

  // Emblem representation
  const renderEmblemVisual = () => {
    const colorClass = deviceFinish === 'antique_gold' ? 'text-amber-500' :
                       deviceFinish === 'antique_silver' ? 'text-slate-300' :
                       'text-amber-700';

    switch (emblem) {
      case 'star_gold':
        return <span className={`text-xl drop-shadow-sm font-sans ${colorClass}`}>★</span>;
      case 'star_bronze':
        return <span className={`text-xl drop-shadow-sm font-sans text-amber-800`}>★</span>;
      case 'oak_leaf_bronze':
        return <span className={`text-lg drop-shadow-sm font-sans ${colorClass}`}>♣</span>;
      case 'v_device':
        return <span className={`text-sm font-sans font-extrabold ${colorClass}`}>V</span>;
      case 'arrowhead':
        return <span className={`text-lg drop-shadow-sm font-sans ${colorClass}`}>♦</span>;
      case 'custom_emblem':
        return <span className="text-[10px] font-mono font-bold tracking-tight text-white bg-slate-900/45 px-1 rounded border border-white/20">CUSTOM</span>;
      case 'none':
      default:
        return null;
    }
  };

  // Submit Inquiry
  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerEmail) {
      alert("Please provide a name and contact email for your bespoke quotation.");
      return;
    }

    setIsSubmitting(true);

    const inquiryOrder: CustomRibbonOrder = {
      id: `custom-order-${Date.now()}`,
      buyer_name: buyerName,
      buyer_email: buyerEmail,
      buyer_organization: buyerOrg,
      target_country: targetCountry,
      base_color: baseColor,
      border_color: borderColor,
      stripes: stripes,
      emblem: emblem,
      mounting_type: mountingType,
      device_finish: deviceFinish,
      estimated_qty: estimatedQty,
      additional_specs: additionalSpecs,
      status: 'pending_review',
      created_at: new Date().toISOString()
    };

    await apiSubmitCustomOrder(inquiryOrder);
    setIsSubmitting(false);
    setSuccessMessage(true);
    
    // Clear form
    setBuyerName('');
    setBuyerEmail('');
    setBuyerOrg('');
    setAdditionalSpecs('');

    setTimeout(() => {
      setSuccessMessage(false);
      onInquirySubmitted();
    }, 4500);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8 text-center md:text-left">
        <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900">
          Bespoke Ribbon Customization Studio
        </h2>
        <p className="mt-2 font-sans text-sm text-gray-500 max-w-2xl">
          Use our precision vector ribbon builder to specify complex patterns, vertical stripes, edge piping, and device mounts. Gujranwala custom loom master draftsmen will formulate your weaves perfectly to international defense standards.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-12">
        
        {/* Left Side: Dynamic CSS Visualizer */}
        <div className="lg:col-span-5 space-y-6 flex flex-col justify-between">
          <div className="rounded-xl border border-gray-150 bg-slate-50 p-6 flex flex-col items-center justify-center flex-1 min-h-[320px]">
            <p className="text-[10px] font-mono tracking-widest text-slate-400 font-bold uppercase mb-6 text-center">
              Real-time CAD Ribbon Spec Render
            </p>

            {/* Simulated Live Military Ribbon Bar Block */}
            <div 
              id="live-ribbon-block"
              style={{
                backgroundColor: baseColor,
                borderColor: borderColor,
                borderWidth: '3.5px',
                borderStyle: 'solid'
              }}
              className="relative w-64 h-18 rounded-lg shadow-xl overflow-hidden flex items-center justify-center"
            >
              {/* Stripes Overlay loop */}
              <div className="absolute inset-0 flex justify-evenly pointer-events-none">
                {stripes.map((stripe, idx) => (
                  <div
                    key={idx}
                    style={{
                      backgroundColor: stripe.color,
                      width: `${stripe.width_pct}%`,
                      height: '100%'
                    }}
                    className="h-full opacity-90 border-r border-black/10 last:border-0"
                  />
                ))}
              </div>

              {/* Central device emblem overlay */}
              <div className="relative z-10 flex items-center justify-center h-full w-full">
                {renderEmblemVisual()}
              </div>
            </div>

            {/* Backplate Mounting attachment wireframe */}
            <div className="mt-8 text-center space-y-1.5 max-w-md">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-slate-200 text-slate-700 px-2.5 py-1 rounded">
                Attachment Profile: {mountingType.replace('_', ' ')}
              </span>
              <p className="text-[11px] text-gray-400">
                Woven from high-tension premium polyester yarn filament. Border strike completed using solid brass metallic threading warp.
              </p>
            </div>
          </div>

          {/* Pakistan Global Export trust banner */}
          <div className="rounded-xl border border-amber-100 bg-amber-50/50 p-4 space-y-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-800 font-mono uppercase">
              <Globe className="h-4 w-4 text-amber-600 shrink-0" />
              <span>Gujranwala Strategic Logistics</span>
            </span>
            <p className="text-xs text-amber-900 leading-normal font-sans">
              Our factory can fulfill government tenders, veterans association remembrance orders, and police service commands. We support rapid air shipment to USA (4-6 days dispatch), Europe (5-7 days), and Australia (6-8 days) with professional documentation.
            </p>
          </div>
        </div>

        {/* Right Side: Configuration CAD parameters & Form Submission */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmitInquiry} className="space-y-6">
            
            {/* Configuration cards */}
            <div className="rounded-xl border border-gray-150 bg-white p-6 space-y-5">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                1. Textile & Ribbon Geometry
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Base color picker */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Base Fabric Yarn:</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {ribbonPalette.map((col) => (
                      <button
                        type="button"
                        key={col.value}
                        id={`palette-base-${col.value.substring(1)}`}
                        onClick={() => setBaseColor(col.value)}
                        style={{ backgroundColor: col.value }}
                        className={`h-7 rounded-md transition-all relative ${
                          baseColor === col.value ? 'ring-2 ring-amber-500 scale-105' : 'opacity-85 hover:opacity-100'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>

                {/* Border color selector */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">Edge Border Threading:</label>
                  <div className="grid grid-cols-5 gap-1.5">
                    {ribbonPalette.map((col) => (
                      <button
                        type="button"
                        key={col.value}
                        id={`palette-border-${col.value.substring(1)}`}
                        onClick={() => setBorderColor(col.value)}
                        style={{ backgroundColor: col.value }}
                        className={`h-7 rounded-md transition-all relative ${
                          borderColor === col.value ? 'ring-2 ring-amber-500 scale-105' : 'opacity-85 hover:opacity-100'
                        }`}
                        title={col.name}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Stripe Manager panel */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Vertical Weft Stripes ({stripes.length}/6):</label>
                  <button
                    type="button"
                    id="add-stripe-btn"
                    onClick={handleAddStripe}
                    disabled={stripes.length >= 6}
                    className="flex items-center gap-1.5 text-[11px] font-bold text-amber-600 bg-amber-50 hover:bg-amber-100 disabled:opacity-40 disabled:hover:bg-amber-50 rounded-lg px-2.5 py-1.5 border border-amber-200 transition-colors cursor-pointer"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Stripe</span>
                  </button>
                </div>

                <div className="grid gap-2">
                  {stripes.map((stripe, idx) => (
                    <div key={idx} className="flex flex-wrap items-center gap-2 bg-slate-50 p-2 rounded-lg border border-gray-150">
                      <span className="font-mono text-xs text-gray-400 font-bold">Stripe #{idx + 1}</span>
                      
                      {/* Select mini color bar */}
                      <div className="flex gap-1">
                        {['#b91c1c', '#ffffff', '#eab308', '#0f172a', '#15803d'].map((c) => (
                          <button
                            type="button"
                            key={c}
                            onClick={() => handleUpdateStripeColor(idx, c)}
                            style={{ backgroundColor: c }}
                            className={`h-[18px] w-[18px] rounded-full border transition-transform ${
                              stripe.color === c ? 'scale-110 ring-1 ring-amber-500' : 'hover:scale-95'
                            }`}
                          />
                        ))}
                      </div>

                      {/* Custom color hex input */}
                      <input
                        type="color"
                        value={stripe.color}
                        onChange={(e) => handleUpdateStripeColor(idx, e.target.value)}
                        className="h-6 w-8 p-0 cursor-pointer border-0 rounded"
                        title="Fine tune color"
                      />

                      {/* Width adjustments */}
                      <div className="flex items-center gap-1.5 grow sm:max-w-28 pl-2">
                        <input
                          type="range"
                          value={stripe.width_pct}
                          onChange={(e) => handleUpdateStripeWidth(idx, parseInt(e.target.value))}
                          min="5"
                          max="40"
                          title="Stripe relative thickness"
                          className="w-full"
                        />
                        <span className="font-mono text-[10px] text-gray-500 font-bold shrink-0">{stripe.width_pct}%</span>
                      </div>

                      {/* Delete button */}
                      <button
                        type="button"
                        id={`delete-stripe-${idx}`}
                        className="text-gray-400 hover:text-red-600 ml-auto shrink-0 cursor-pointer"
                        onClick={() => handleRemoveStripe(idx)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bronze/Gold device attributes and backing bracket configuration */}
            <div className="rounded-xl border border-gray-150 bg-white p-6 space-y-4">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                2. Hardwares, Pins & Devices
              </h3>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* Emblem device selection */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider mb-2">Central Device Attachment:</label>
                  <select
                    id="emb-device-select"
                    value={emblem}
                    onChange={(e: any) => setEmblem(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs rounded-lg py-2 px-3 focus:outline-hidden focus:border-amber-500 font-sans"
                  >
                    <option value="none">No Emblem (Base Ribbon)</option>
                    <option value="star_gold">Gold Citation Star (★)</option>
                    <option value="star_bronze">Bronze Star Attachment (★)</option>
                    <option value="oak_leaf_bronze">Oak Leaf Cluster (♣)</option>
                    <option value="v_device">V Combat Citation Device (V)</option>
                    <option value="arrowhead">Arrowhead Citation (♦)</option>
                    <option value="custom_emblem">Custom Mold/Device required</option>
                  </select>
                </div>

                {/* Device hardware plating finish */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider mb-2">Device Hardware Finish:</label>
                  <select
                    id="finish-select"
                    value={deviceFinish}
                    onChange={(e: any) => setDeviceFinish(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs rounded-lg py-2 px-3 focus:outline-hidden focus:border-amber-500 font-sans"
                  >
                    <option value="antique_gold">Antique Gold Plated</option>
                    <option value="antique_silver">Antiqued Sterling Silver</option>
                    <option value="polished_bronze">Polished Heavy Bronze</option>
                    <option value="custom_finish">Other Specialized Dye plating</option>
                  </select>
                </div>

                {/* Ribbon rear mount type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wider mb-2">Rear Mount Backplate:</label>
                  <select
                    id="mount-select"
                    value={mountingType}
                    onChange={(e: any) => setMountingType(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs rounded-lg py-2 px-3 focus:outline-hidden focus:border-amber-500 font-sans"
                  >
                    <option value="clutch_back">Double Clutch pins (Standard)</option>
                    <option value="pin_back">Safety Safety Pin-Back Catch</option>
                    <option value="slide_on">Slide-On Mount Bar rack block</option>
                    <option value="magnetic">Heavy-duty Double Magnetic Plate</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Custom Quote Request Form */}
            <div className="rounded-xl border border-gray-150 bg-white p-6 space-y-4">
              <h3 className="font-sans text-sm font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-gray-100">
                3. Business & Global Shipment Details
              </h3>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Contact Full Name:</label>
                  <input
                    type="text"
                    id="custom-buyer-name"
                    required
                    value={buyerName}
                    onChange={(e) => setBuyerName(e.target.value)}
                    placeholder="e.g., Major Robert Harrison"
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Military / Institutional Email ID:</label>
                  <input
                    type="email"
                    id="custom-buyer-email"
                    required
                    value={buyerEmail}
                    onChange={(e) => setBuyerEmail(e.target.value)}
                    placeholder="e.g., rharrison@cadets.mil.au"
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Organization / Legion Battalion:</label>
                  <input
                    type="text"
                    id="custom-buyer-org"
                    value={buyerOrg}
                    onChange={(e) => setBuyerOrg(e.target.value)}
                    placeholder="e.g., Australian Sea Cadet Corps"
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Target Shipping Country:</label>
                  <select
                    id="custom-buyer-country"
                    value={targetCountry}
                    onChange={(e) => setTargetCountry(e.target.value)}
                    className="w-full bg-white border border-gray-200 text-xs rounded-lg py-2 px-3 focus:outline-hidden focus:border-amber-500 font-sans"
                  >
                    <option value="United States">United States (Direct Courier)</option>
                    <option value="Australia">Australia & NZ (Air Freight)</option>
                    <option value="United Kingdom">United Kingdom (Direct Sea-Cargo/Air)</option>
                    <option value="Germany">Germany & Western Europe</option>
                    <option value="Canada">Canada / North America</option>
                    <option value="Pakistan">Pakistan (Domestic Dispatch)</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Estimated Manufacture Quantity:</label>
                  <input
                    type="number"
                    id="custom-batch-qty"
                    min="50"
                    value={estimatedQty}
                    onChange={(e) => setEstimatedQty(Math.max(10, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-sans font-mono"
                  />
                  <span className="text-[10px] text-gray-400 italic">Wholesale custom weave setup is free for orders over 150 items.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 tracking-wide mb-1.5">Specialized Weaving Guidelines / Custom Medals:</label>
                  <textarea
                    id="custom-additional-specs"
                    value={additionalSpecs}
                    onChange={(e) => setAdditionalSpecs(e.target.value)}
                    placeholder="Stripe order notes, specific brass weight, customized medallion center insignias required..."
                    rows={3}
                    className="w-full bg-white border border-gray-200 rounded-lg py-2 px-3 text-xs font-sans placeholder-gray-400 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
              </div>
            </div>

            {/* Success and submitting states */}
            {successMessage && (
              <div id="inquiry-success-alert" className="p-4 rounded-xl bg-green-50 border border-green-200 text-green-800 flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
                <div>
                  <h4 className="text-xs font-bold font-sans">Bespoke Inquiry Registered Successfully</h4>
                  <p className="text-[11px] mt-0.5 font-sans">Your CAD configurations have been saved. Our Gujranwala design unit will map your specs into a production blueprint and contact you shortly.</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              id="submit-inquiry-btn"
              disabled={isSubmitting}
              className="w-full bg-amber-600 text-white hover:bg-amber-500 px-6 py-4 rounded-xl text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors disabled:opacity-45"
            >
              <Send className="h-4 w-4" />
              <span>{isSubmitting ? "Generating Blueprint Logs..." : "Submit Bespoke Manufacturing Blueprint"}</span>
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
