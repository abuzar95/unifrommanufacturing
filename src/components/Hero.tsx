/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck, Truck, Factory, Compass } from 'lucide-react';
import heroImage from '../assets/images/hero_military_medals_1781530032347.jpg';

interface HeroProps {
  onStartCustomizing: () => void;
  onBrowseCatalog: () => void;
}

export default function Hero({ onStartCustomizing, onBrowseCatalog }: HeroProps) {
  return (
    <div className="relative overflow-hidden bg-slate-950 text-white py-16 lg:py-24">
      {/* Abstract Grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-25" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center">
          
          {/* Landing Copy */}
          <div className="space-y-6 lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3.5 py-1 text-xs font-mono font-semibold text-amber-500 tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>GUJRANWALA TEXTILE EXPORT EXCELLENCE</span>
            </div>

            <h1 className="font-sans text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              World-Class <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-600">Military Ribbons</span> & Honors
            </h1>

            <p className="max-w-2xl text-base text-slate-300 sm:text-lg tracking-wide leading-relaxed">
              Based in Gujranwala, Pakistan—the globally renowned hub for premium industrial uniforms and tactical textiles—we manufacture premium military medals, hand-woven campaign ribbons, and specialized award brackets for military commands, law enforcement, and cadet associations worldwide.
            </p>

            {/* Crucial USP Points */}
            <div className="grid gap-4 sm:grid-cols-3 pt-2">
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Factory className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">100% Customized</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">We weave any stripe configuration or pattern from base yards.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <ShieldCheck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">MIL-SPEC COMPLIANCE</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Strict width, warp, and chemical dye limits for US, EU, AU forces.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <Truck className="h-4.5 w-4.5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-slate-200">Direct Global Hub</h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">Streamlined custom batch freight shipping to USA, Europe, & Australia.</p>
                </div>
              </div>
            </div>

            {/* CTA panel */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button
                id="hero-cta-customize"
                onClick={onStartCustomizing}
                className="group inline-flex items-center gap-2 rounded-lg bg-amber-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-md hover:bg-amber-400 transition-all font-sans cursor-pointer"
              >
                Launch Custom Ribbon Builder
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
              
              <button
                id="hero-cta-catalog"
                onClick={onBrowseCatalog}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900/50 px-6 py-3.5 text-sm font-semibold text-white hover:bg-slate-900 hover:border-slate-600 transition-all font-sans cursor-pointer"
              >
                Browse Standard Products
              </button>
            </div>
          </div>

          {/* Landing Graphic Frame */}
          <div className="relative lg:col-span-5">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-700 opacity-20 blur-lg" />
            <div className="relative overflow-hidden rounded-xl border border-slate-800 bg-slate-900">
              <img
                src={heroImage}
                alt="Finely Plated Military Medals with Striped Ribbon Suspension Weave"
                className="w-full object-cover aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] scale-100 hover:scale-102 transition-transform duration-700"
                referrerPolicy="no-referrer"
                id="hero-graphic-image"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/80 backdrop-blur-xs rounded-lg p-3 border border-slate-800 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-mono tracking-widest text-amber-500 uppercase font-bold">Featured Showcase</p>
                  <p className="text-xs font-semibold text-white mt-0.5">Distinguished Gold Star & Campaign Assemblies</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-900 py-1 px-2 rounded border border-slate-800">Gujranwala Weft</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
