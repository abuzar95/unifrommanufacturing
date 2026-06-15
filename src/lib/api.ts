/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Data API layer — currently uses localStorage.
 * Will be wired to a local PostgreSQL backend via REST API later.
 */

import { Product, CustomRibbonOrder, StandardOrder } from '../types';

const STORAGE_KEYS = {
  products: 'military_awards_products',
  customOrders: 'custom_ribbon_orders',
  standardOrders: 'military_standard_orders',
} as const;

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
    image_url: 'bespoke_medal_craft',
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
  },
];

const MOCK_CUSTOM_ORDERS: CustomRibbonOrder[] = [
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
      { color: '#1d4ed8', width_pct: 35 },
    ],
    emblem: 'star_gold',
    mounting_type: 'clutch_back',
    device_finish: 'antique_gold',
    estimated_qty: 350,
    additional_specs: 'Need high-density premium rayon weaves. Must withstand rigorous marine dress guidelines. Please provide mock visual proof within 48 hours.',
    status: 'pending_review',
    created_at: new Date(Date.now() - 36 * 3600000).toISOString(),
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
      { color: '#b91c1c', width_pct: 20 },
    ],
    emblem: 'oak_leaf_bronze',
    mounting_type: 'pin_back',
    device_finish: 'polished_bronze',
    estimated_qty: 1200,
    additional_specs: 'Custom bulk remembrance medallions. Engraving required: "For Service to His Majesty with outstanding Honor" on reverse face. Shipping to Cardiff target warehouse.',
    status: 'design_approved',
    created_at: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
];

const MOCK_STANDARD_ORDERS: StandardOrder[] = [
  {
    id: 'mock-std-order-1',
    buyer_name: 'Lieutenant Keith Miller',
    buyer_email: 'kmiller@navy.defence.gov.au',
    buyer_organization: 'Regional Defense Cadet Force',
    target_country: 'Australia',
    cart_items: [
      { product_id: 'prod-medal-distinguished', product_name: 'Distinguished Service Gold Star Medal', qty: 25, subtotal: 3125.00 },
      { product_id: 'prod-mount-brass-3', product_name: 'Precision Brass Triple Ribbon Bar Mount', qty: 50, subtotal: 900.00 },
    ],
    total_amount: 4025.00,
    currency: 'AUD',
    special_instructions: 'Export dispatch to Brisbane Base. Please wrap each set in protective felt sleeve overlays to prevent transit scratching during packing.',
    status: 'pending_invoice',
    created_at: new Date(Date.now() - 18 * 3600000).toISOString(),
  },
];

export const apiGetProducts = async (): Promise<Product[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.products);
  if (stored) {
    return JSON.parse(stored);
  }
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(SEED_PRODUCTS));
  return SEED_PRODUCTS;
};

export const apiSaveProduct = async (product: Product): Promise<boolean> => {
  const items = await apiGetProducts();
  const existingIndex = items.findIndex((i) => i.id === product.id);
  if (existingIndex >= 0) {
    items[existingIndex] = product;
  } else {
    items.unshift(product);
  }
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(items));
  return true;
};

export const apiDeleteProduct = async (productId: string): Promise<boolean> => {
  const items = await apiGetProducts();
  const updated = items.filter((i) => i.id !== productId);
  localStorage.setItem(STORAGE_KEYS.products, JSON.stringify(updated));
  return true;
};

export const apiGetCustomOrders = async (): Promise<CustomRibbonOrder[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.customOrders);
  return stored ? JSON.parse(stored) : MOCK_CUSTOM_ORDERS;
};

export const apiSubmitCustomOrder = async (order: CustomRibbonOrder): Promise<boolean> => {
  const items = await apiGetCustomOrders();
  items.unshift(order);
  localStorage.setItem(STORAGE_KEYS.customOrders, JSON.stringify(items));
  return true;
};

export const apiUpdateCustomOrderStatus = async (
  orderId: string,
  status: CustomRibbonOrder['status'],
): Promise<boolean> => {
  const items = await apiGetCustomOrders();
  const existing = items.find((i) => i.id === orderId);
  if (existing) {
    existing.status = status;
    localStorage.setItem(STORAGE_KEYS.customOrders, JSON.stringify(items));
    return true;
  }
  return false;
};

export const apiGetStandardOrders = async (): Promise<StandardOrder[]> => {
  const stored = localStorage.getItem(STORAGE_KEYS.standardOrders);
  return stored ? JSON.parse(stored) : MOCK_STANDARD_ORDERS;
};

export const apiSubmitStandardOrder = async (order: StandardOrder): Promise<boolean> => {
  const items = await apiGetStandardOrders();
  items.unshift(order);
  localStorage.setItem(STORAGE_KEYS.standardOrders, JSON.stringify(items));
  return true;
};

export const apiUpdateStandardOrderStatus = async (
  orderId: string,
  status: StandardOrder['status'],
): Promise<boolean> => {
  const items = await apiGetStandardOrders();
  const existing = items.find((i) => i.id === orderId);
  if (existing) {
    existing.status = status;
    localStorage.setItem(STORAGE_KEYS.standardOrders, JSON.stringify(items));
    return true;
  }
  return false;
};
