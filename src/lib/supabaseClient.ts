/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Product, CustomRibbonOrder, StandardOrder } from '../types';

// Read configuration from Vite env variables
const SUPABASE_URL = ((import.meta as any).env?.VITE_SUPABASE_URL as string) || '';
const SUPABASE_ANON_KEY = ((import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string) || '';

export const isSupabaseConfigured = () => {
  return SUPABASE_URL.trim() !== '' && SUPABASE_ANON_KEY.trim() !== '';
};

// Lazy initialization of Supabase client to avoid crashes
let supabase: any = null;

try {
  if (isSupabaseConfigured()) {
    supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (error) {
  console.warn("Failed to initialize Supabase client:", error);
}

// SQL Schema for users to create tables in Supabase SQL editor
export const SUPABASE_SQL_SCHEMA = `-- COPY AND RUN THIS IN YOUR SUPABASE SQL EDITOR TO CREATE THE REQUISITE TABLES:

-- 1. Create Products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('ribbon', 'medal', 'accessory', 'mounting')),
  description TEXT,
  sku TEXT UNIQUE NOT NULL,
  price_usd NUMERIC NOT NULL,
  price_eur NUMERIC NOT NULL,
  price_aud NUMERIC NOT NULL,
  image_url TEXT,
  is_customizable BOOLEAN DEFAULT false,
  features TEXT[] DEFAULT '{}',
  min_order_qty INTEGER DEFAULT 1,
  lead_time_days INTEGER DEFAULT 10,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. Create Custom Ribbon Orders/Inquiries table
CREATE TABLE IF NOT EXISTS public.custom_ribbon_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_organization TEXT,
  target_country TEXT NOT NULL,
  base_color TEXT NOT NULL,
  border_color TEXT NOT NULL,
  stripes JSONB NOT NULL DEFAULT '[]',
  emblem TEXT NOT NULL,
  mounting_type TEXT NOT NULL,
  device_finish TEXT NOT NULL,
  estimated_qty INTEGER NOT NULL DEFAULT 100,
  additional_specs TEXT,
  status TEXT NOT NULL DEFAULT 'pending_review',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. Create Standard Orders table
CREATE TABLE IF NOT EXISTS public.standard_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  buyer_name TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_organization TEXT,
  target_country TEXT NOT NULL,
  cart_items JSONB NOT NULL DEFAULT '[]',
  total_amount NUMERIC NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('USD', 'EUR', 'AUD')),
  special_instructions TEXT,
  status TEXT NOT NULL DEFAULT 'pending_invoice',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Enable RLS and insert initial policy for simple demo
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON public.products FOR SELECT USING (true);
CREATE POLICY "Allow admin operations" ON public.products FOR ALL USING (true);

ALTER TABLE public.custom_ribbon_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public inserts" ON public.custom_ribbon_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow staff manage" ON public.custom_ribbon_orders FOR ALL USING (true);

ALTER TABLE public.standard_orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public order inserts" ON public.standard_orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow staff order browse" ON public.standard_orders FOR ALL USING (true);
`;

// Initial Product Database covering Medals, Ribbons, Mounts
export const SEED_PRODUCTS: Product[] = [
  {
    id: 'prod-medal-distinguished',
    name: 'Distinguished Service Gold Star Medal',
    category: 'medal',
    description: 'Premier level military reward cast in exquisite 24k gold plating with a master-carved polished finish. Standard ribbon hanger features deep navy and crimson vertical gold-edged stripes.',
    sku: 'MED-DS-GSG',
    price_usd: 85.00,
    price_eur: 78.50,
    price_aud: 125.00,
    image_url: 'bespoke_medal_craft', // Mapping to local generated asset
    is_customizable: true,
    features: ['24k Gold Double plating', 'High density woven suspension loop', 'Authentic heavyweight base alloy (95g)', 'Direct custom reverse side engraving available'],
    min_order_qty: 10,
    lead_time_days: 14,
  },
  {
    id: 'prod-ribbon-combat',
    name: 'Presidential Ribbon of Combat Valor',
    category: 'ribbon',
    description: 'Expertly woven tactical dress ribbon with perfect structural stiffness, featuring a high-contrast pattern of yellow ochre, navy, and bright scarlet stripes.',
    sku: 'RIB-VAL-09A',
    price_usd: 4.50,
    price_eur: 4.15,
    price_aud: 6.80,
    image_url: 'ribbon_collection',
    is_customizable: true,
    features: ['Premium heavy cotton warp / polyester fill', 'Scratchproof and damp-soil-resistant dyes', 'Compatible with standard slide-on and double-clutch mounts', 'Complies fully with US Army military uniform specs'],
    min_order_qty: 100,
    lead_time_days: 7,
  },
  {
    id: 'prod-mount-brass-3',
    name: 'Precision Brass Triple Ribbon Bar Mount',
    category: 'mounting',
    description: 'Sleek rigid suspension slide-mounting rack fabricated of tempered solid brass backing. Accommodates standard size ribbons.',
    sku: 'MNT-R3-BRS',
    price_usd: 12.00,
    price_eur: 11.10,
    price_aud: 18.00,
    image_url: 'hero_military_medals',
    is_customizable: false,
    features: ['High-stress spring copper pin-back clutch claws', 'Fits up to 3 individual ribbons securely', 'Rust-proof microplated coating'],
    min_order_qty: 25,
    lead_time_days: 5,
  },
  {
    id: 'prod-medal-honor',
    name: 'Bespoke Medallion of Outstanding Bravery',
    category: 'medal',
    description: 'Heavyweight antiqued silver award with high-relief sculpted borders representing the premium standards of custom international defense, navy, and cadet awards.',
    sku: 'MED-MOB-SLV',
    price_usd: 75.00,
    price_eur: 69.00,
    price_aud: 112.00,
    image_url: 'hero_military_medals',
    is_customizable: true,
    features: ['Genuine sterling silver antiqued plating', 'Premium heavy suspension ring', '3.8mm thick structural strike depth', 'Comes with customizable certificates & presentation case'],
    min_order_qty: 15,
    lead_time_days: 15,
  },
  {
    id: 'prod-ribbon-joint',
    name: 'Tactical Service Commendation Ribbon',
    category: 'ribbon',
    description: 'Custom weave campaign ribbon with distinctive alternating white, azure blue, and dark green alignment. Ready for oak leaf cluster or custom device attachment.',
    sku: 'RIB-COMM-02',
    price_usd: 4.80,
    price_eur: 4.40,
    price_aud: 7.20,
    image_url: 'ribbon_collection',
    is_customizable: true,
    features: ['Precision computer loom stitched weave', 'Fade-resistant UV-shield material', 'Pre-formed with premium brass backing slide'],
    min_order_qty: 100,
    lead_time_days: 8,
  }
];

// Helper to get products (fetches from Supabase or falls back to local storage / seeds)
export const apiGetProducts = async (): Promise<Product[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (!error && data && data.length > 0) {
        return data as Product[];
      }
      if (error) console.error("Supabase error fetching products:", error);
    } catch (e) {
      console.warn("Supabase database fetch error, using local fallback:", e);
    }
  }

  // Fallback to localStorage or default seed
  const stored = localStorage.getItem('military_awards_products');
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem('military_awards_products', JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
};

// Helper to save a product
export const apiSaveProduct = async (product: Product): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('products').upsert(product);
      if (!error) return true;
      console.error("Supabase write product error:", error);
    } catch (e) {
      console.warn("Supabase backup fail", e);
    }
  }

  // Sync back to local storage fallback
  const items = await apiGetProducts();
  const existingIndex = items.findIndex(i => i.id === product.id);
  if (existingIndex >= 0) {
    items[existingIndex] = product;
  } else {
    items.unshift(product);
  }
  localStorage.setItem('military_awards_products', JSON.stringify(items));
  return true;
};

// Helper to delete a product
export const apiDeleteProduct = async (productId: string): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('products').delete().eq('id', productId);
      if (!error) return true;
      console.error("Supabase delete product error:", error);
    } catch (e) {
      console.warn("Supabase delete product fail", e);
    }
  }

  const items = await apiGetProducts();
  const updated = items.filter(i => i.id !== productId);
  localStorage.setItem('military_awards_products', JSON.stringify(updated));
  return true;
};

// Helper to get custom ribbon orders (submitted inquiries)
export const apiGetCustomOrders = async (): Promise<CustomRibbonOrder[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('custom_ribbon_orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as CustomRibbonOrder[];
      }
      if (error) console.error("Supabase custom orders error:", error);
    } catch (e) {
      console.warn("Supabase custom orders catch:", e);
    }
  }

  const stored = localStorage.getItem('custom_ribbon_orders');
  return stored ? JSON.parse(stored) : [
    {
      id: 'mock-inquiry-1',
      buyer_name: 'Major Daniel Vance',
      buyer_email: 'dvance@state.mil.us',
      buyer_organization: 'US National Guard Cadet Association',
      target_country: 'United States',
      base_color: '#0f172a',
      border_color: '#d97706',
      stripes: [
        { color: '#b91c1c', width_pct: 20 },
        { color: '#ffffff', width_pct: 10 },
        { color: '#1d4ed8', width_pct: 35 }
      ],
      emblem: 'star_gold',
      mounting_type: 'clutch_back',
      device_finish: 'antique_gold',
      estimated_qty: 350,
      additional_specs: 'Need high-density premium rayon weaves. Must withstand rigorous marine dress guidelines. Please provide mock visual proof within 48 hours.',
      status: 'pending_review',
      created_at: new Date(Date.now() - 36 * 3600000).toISOString() // 36 hrs ago
    },
    {
      id: 'mock-inquiry-2',
      buyer_name: 'Adrian Sterling',
      buyer_email: 'a.sterling@royallegion.org.uk',
      buyer_organization: 'Veterans Association & Remembrance Guild',
      target_country: 'United Kingdom',
      base_color: '#1e293b',
      border_color: '#10b981',
      stripes: [
        { color: '#ffffff', width_pct: 40 },
        { color: '#b91c1c', width_pct: 20 }
      ],
      emblem: 'oak_leaf_bronze',
      mounting_type: 'pin_back',
      device_finish: 'polished_bronze',
      estimated_qty: 1200,
      additional_specs: 'Custom bulk remembrance medallions. Engraving required: "For Service to His Majesty with outstanding Honor" on reverse face. Shipping to Cardiff target warehouse.',
      status: 'design_approved',
      created_at: new Date(Date.now() - 120 * 3600000).toISOString() // 5 days ago
    }
  ];
};

// Helper to submit custom ribbon order / manufacturing query
export const apiSubmitCustomOrder = async (order: CustomRibbonOrder): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('custom_ribbon_orders').insert(order);
      if (!error) return true;
      console.error("Supabase custom order submit error:", error);
    } catch (e) {
      console.warn("Supabase backup custom order fail", e);
    }
  }

  const items = await apiGetCustomOrders();
  items.unshift(order);
  localStorage.setItem('custom_ribbon_orders', JSON.stringify(items));
  return true;
};

// Helper to update custom order status
export const apiUpdateCustomOrderStatus = async (orderId: string, status: CustomRibbonOrder['status']): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('custom_ribbon_orders').update({ status }).eq('id', orderId);
      if (!error) return true;
      console.error("Supabase update status error:", error);
    } catch (e) {
      console.warn("Supabase backup update status fail", e);
    }
  }

  const items = await apiGetCustomOrders();
  const existing = items.find(i => i.id === orderId);
  if (existing) {
    existing.status = status;
    localStorage.setItem('custom_ribbon_orders', JSON.stringify(items));
    return true;
  }
  return false;
};

// Helper to get standard orders
export const apiGetStandardOrders = async (): Promise<StandardOrder[]> => {
  if (supabase) {
    try {
      const { data, error } = await supabase.from('standard_orders').select('*').order('created_at', { ascending: false });
      if (!error && data) {
        return data as StandardOrder[];
      }
      if (error) console.error("Supabase standard orders error:", error);
    } catch (e) {
      console.warn("Supabase standard orders catch:", e);
    }
  }

  const stored = localStorage.getItem('military_standard_orders');
  return stored ? JSON.parse(stored) : [
    {
      id: 'mock-std-order-1',
      buyer_name: 'Lieutenant Keith Miller',
      buyer_email: 'kmiller@navy.defence.gov.au',
      buyer_organization: 'Regional Defense Cadet Force',
      target_country: 'Australia',
      cart_items: [
        { product_id: 'prod-medal-distinguished', product_name: 'Distinguished Service Gold Star Medal', qty: 25, subtotal: 3125.00 },
        { product_id: 'prod-mount-brass-3', product_name: 'Precision Brass Triple Ribbon Bar Mount', qty: 50, subtotal: 900.00 }
      ],
      total_amount: 4025.00,
      currency: 'AUD',
      special_instructions: 'Export dispatch to Brisbane Base. Please wrap each set in protective felt sleeve overlays to prevent transit scratching during packing.',
      status: 'pending_invoice',
      created_at: new Date(Date.now() - 18 * 3600000).toISOString()
    }
  ];
};

// Helper to submit standard order
export const apiSubmitStandardOrder = async (order: StandardOrder): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('standard_orders').insert(order);
      if (!error) return true;
      console.error("Supabase standard order submit error:", error);
    } catch (e) {
      console.warn("Supabase standard order submit backup fail", e);
    }
  }

  const items = await apiGetStandardOrders();
  items.unshift(order);
  localStorage.setItem('military_standard_orders', JSON.stringify(items));
  return true;
};

// Helper to update standard order status
export const apiUpdateStandardOrderStatus = async (orderId: string, status: StandardOrder['status']): Promise<boolean> => {
  if (supabase) {
    try {
      const { error } = await supabase.from('standard_orders').update({ status }).eq('id', orderId);
      if (!error) return true;
      console.error("Supabase update std status error:", error);
    } catch (e) {
      console.warn("Supabase update std status fail", e);
    }
  }

  const items = await apiGetStandardOrders();
  const existing = items.find(i => i.id === orderId);
  if (existing) {
    existing.status = status;
    localStorage.setItem('military_standard_orders', JSON.stringify(items));
    return true;
  }
  return false;
};
