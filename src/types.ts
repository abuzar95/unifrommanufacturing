/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ProductCategory = 'ribbon' | 'medal' | 'accessory' | 'mounting';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  sku: string;
  price_usd: number;
  price_eur: number;
  price_aud: number;
  image_url: string;
  is_customizable: boolean;
  features: string[];
  min_order_qty: number; // Since we are Gujranwala manufacturers selling wholesale
  lead_time_days: number; // Production lead time
}

export interface StripeConfig {
  color: string;
  width_pct: number; // Percentage of ribbon width (e.g. 10, 20, 50)
}

export interface CustomRibbonOrder {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_organization: string;
  target_country: string; // USA, Germany, UK, Australia, etc.
  base_color: string;
  border_color: string;
  stripes: StripeConfig[];
  emblem: 'none' | 'star_bronze' | 'star_gold' | 'oak_leaf_bronze' | 'v_device' | 'arrowhead' | 'custom_emblem';
  mounting_type: 'pin_back' | 'clutch_back' | 'slide_on' | 'magnetic';
  device_finish: 'antique_gold' | 'antique_silver' | 'polished_bronze' | 'custom_finish';
  estimated_qty: number;
  additional_specs: string;
  status: 'pending_review' | 'design_approved' | 'production_quote_sent' | 'manufacturing';
  created_at: string;
}

export interface StandardOrder {
  id: string;
  buyer_name: string;
  buyer_email: string;
  buyer_organization: string;
  target_country: string;
  cart_items: {
    product_id: string;
    product_name: string;
    qty: number;
    subtotal: number;
  }[];
  total_amount: number;
  currency: 'USD' | 'EUR' | 'AUD';
  special_instructions?: string;
  status: 'pending_invoice' | 'payment_confirmed' | 'manufactured' | 'dispatched';
  created_at: string;
}
