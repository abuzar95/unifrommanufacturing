/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Factory, ShieldCheck, HelpCircle, Flame, Target, Compass, Award } from 'lucide-react';
import bespokeImg from '../assets/images/bespoke_medal_craft_1781530075456.jpg';

export default function HowWeManufacture() {
  const steps = [
    {
      icon: <Factory className="h-6 w-6 text-amber-500" />,
      title: "1. Raw Warp Formulation",
      desc: "Our computerized Jacquard looms in Gujranwala are fitted with high-density warp beams. We feed high-tenacity yarn (tested for fade resistance and high weather tolerance) and map custom stripe alignments down to 0.1mm margins."
    },
    {
      icon: <Flame className="h-6 w-6 text-amber-500" />,
      title: "2. Precision Die Casting",
      desc: "Medallion shapes are sculpted in high-relief steel molds, then cast in heavy zinc or brass alloy. Dual plating applies layers of sterling silver, genuine 24k gold, or hand-brushed antique bronze patinas."
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-amber-500" />,
      title: "3. Compliance Auditing",
      desc: "Each production batch is measured against specifications (e.g., US army MIL-DTL, UK Royal Navy standards, European safety limits) to audit weight, stitching, alignment, and pin tension before final assembly."
    },
    {
      icon: <Target className="h-6 w-6 text-amber-500" />,
      title: "4. Global Air Dispatch",
      desc: "Orders are vacuum-packaged, padded individually in felt, and cleared for rapid cargo flight dispatch from Islamabad/Lahore International directly to our target warehouses in USA, Cardiff, and Brisbane."
    }
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      
      {/* Brand Identity Grid */}
      <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
        
        {/* Copy narration */}
        <div className="space-y-6 lg:col-span-7">
          <div className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase bg-amber-50 text-amber-800 border border-amber-200 py-1 px-3 rounded-full font-bold tracking-wider font-bold">
            <span>Our Gujranwala Facility Heritage</span>
          </div>
          
          <h2 className="font-sans text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Gujranwala Weaving Craftsmanship: <br />
            <span className="text-amber-600">Precision Meets Honor</span>
          </h2>
          
          <p className="text-sm font-sans text-gray-600 leading-relaxed font-sans">
            Gujranwala, Pakistan, holds an elite global legacy for premium engineering, metal works, and specialized industrial textiles—expertise rooted in custom fabrication, computerized jacquard weaving, and durable color-fast chemistry.
          </p>
          <p className="text-sm font-sans text-gray-600 leading-relaxed font-sans">
            Our company harnesses this incredible district craftsmanship to produce award ribbons that mirror the courage of those who wear them. Because we handle everything in-house—from selecting synthetic polymer yarns to forging heavy metal clasps—<strong>we can manufacture any custom ribbon design in the world</strong>, regardless of rarity or complexity.
          </p>

          <div className="border-t border-gray-100 pt-6 grid grid-cols-2 gap-4">
            <div>
              <span className="font-mono text-xl font-black text-slate-950">100%</span>
              <p className="text-xs text-gray-500 font-medium font-sans">MIL-SPEC Weaving Compliance to USA & European Allies</p>
            </div>
            <div>
              <span className="font-mono text-xl font-black text-slate-950">Over 40 countries</span>
              <p className="text-xs text-gray-500 font-medium font-sans">Trust our Gujranwala foundry with medals and legion decorations</p>
            </div>
          </div>
        </div>

        {/* Photography Grid */}
        <div className="relative lg:col-span-5">
          <div className="overflow-hidden rounded-xl bg-slate-900 border border-gray-250 shadow-lg">
            <img 
              src={bespokeImg} 
              alt="Artisan at Gujranwala facility performing engraving details to custom military medal backs" 
              className="w-full object-cover aspect-4/3 scale-100 hover:scale-[1.01] transition-transform duration-500"
              referrerPolicy="no-referrer"
              id="craftsmanship-details-image"
            />
          </div>
          <div className="absolute -bottom-4 -left-4 bg-slate-950 text-white rounded-lg p-3.5 border border-slate-800 shadow-lg hidden sm:block max-w-[260px]">
            <p className="text-[10px] font-mono uppercase text-amber-500 font-bold">Guaranteed Integrity</p>
            <p className="text-[11px] text-slate-300 mt-1 font-sans">Each custom medal suspension ribbon is tested against standard weather moisture levels to confirm durability.</p>
          </div>
        </div>

      </div>

      {/* Production Stepper */}
      <div className="space-y-8">
        <div className="text-center">
          <h3 className="font-sans text-2xl font-bold tracking-tight text-slate-900">How We Fulfill Global Orders</h3>
          <p className="text-sm text-gray-500 max-w-lg mx-auto mt-1">From initial CAD vector specs to direct handoff to international couriers.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((st, idx) => (
            <div key={idx} className="bg-white border border-gray-100 rounded-xl p-5 shadow-xs space-y-3 flex flex-col justify-between">
              <div>
                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-amber-50 text-amber-600 mb-3 border border-amber-100">
                  {st.icon}
                </div>
                <h4 className="font-sans text-sm font-bold text-slate-900">{st.title}</h4>
                <p className="font-sans text-xs text-gray-500 mt-1.5 leading-relaxed">{st.desc}</p>
              </div>
              <span className="text-[10px] font-mono text-slate-300 self-end font-bold uppercase select-none">Stage {idx + 1}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
