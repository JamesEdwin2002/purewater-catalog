import React, { useState, useEffect } from 'react';
import {
  Droplets,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  X,
  Copy,
  Check,
  ChevronRight,
  Thermometer,
  Calendar,
  Award,
  Search,
  MessageCircle,
  Phone,
  FileText
} from 'lucide-react';

// ============================================================================
// TYPESCRIPT INTERFACES & TYPES
// ============================================================================
export type ProductCategory =
  | 'Countertop RO'
  | 'Standing / Office'
  | 'Ice & Sparkling'
  | 'Air Purifier'
  | 'Outdoor Filter';

export type VisualVariant = 'villaem' | 'ombak' | 'neo' | 'core' | 'lucy' | 'air' | 'poe';

export type PlanType = 'All-Inclusive Rental' | 'Outright Purchase';

export interface ProductColorOption {
  name: string;
  hex: string;
}

export interface CowayProduct {
  id: string;
  title: string;
  category: ProductCategory | string;
  tankCapacity: string;
  filtration: string;
  badge?: string;
  rentalMonthly: number;
  outrightPrice: number;
  description: string;
  colors?: ProductColorOption[];
  visualVariant?: VisualVariant;
  imageUrl?: string;
}

export interface OfficialPackage {
  id: string;
  title: string;
  subtitle: string;
  badge: string;
  highlight: string;
  imageUrl: string;
}

export interface OfficialPromo {
  id: string;
  title: string;
  tag: string;
  description: string;
  imageUrl: string;
}

export interface OfficialBrochure {
  id: string;
  title: string;
  model: string;
  visualVariant: VisualVariant;
  specs: string[];
}

export interface RoStageInfo {
  stage: number;
  name: string;
  pore: string;
  detail: string;
}

export interface OrderSummaryState {
  text: string;
  total: number;
}

// ============================================================================
// STORAGE ADAPTER PATTERN (localStorage persistence with brandless defaults)
// ============================================================================
const STORAGE_KEY = 'brandless_water_dispenser_catalog_v2';
const WA_DISPLAY = '+62 813 1136 1963';
const WA_CLEAN = '6281311361963';

const buildWhatsAppUrl = (message: string): string => {
  return `https://wa.me/${WA_CLEAN}?text=${encodeURIComponent(message)}`;
};

const DEFAULT_DISPENSERS: CowayProduct[] = [
  {
    id: 'mdl-yonsu',
    title: 'Series Y1 Minimalist RO',
    category: 'Countertop RO',
    tankCapacity: 'Compact Tank • Hot / Cold / Ambient',
    filtration: '6-Stage RO Filtration System (0.0001 μm)',
    badge: 'New Launch',
    rentalMonthly: 390000,
    outrightPrice: 14500000,
    description:
      'Ultra-modern minimalist countertop water purifier engineered for sleek contemporary kitchens with instant precision temperature control and auto-sterilization.',
    colors: [
      { name: 'Porcelain White', hex: '#F8FAFC' },
      { name: 'Pebble Mist', hex: '#CBD5E1' }
    ],
    visualVariant: 'villaem'
  },
  {
    id: 'mdl-slim-stand',
    title: 'Slim Stand Tower RO',
    category: 'Standing / Office',
    tankCapacity: 'Slim Floor-Standing • High-Flow Tank',
    filtration: 'Multi-Stage RO Membrane Filtration',
    badge: 'Space-Saving Tower',
    rentalMonthly: 430000,
    outrightPrice: 15800000,
    description:
      'Narrow-footprint standing water purifier built for modern apartments, studios, and executive pantries requiring continuous chilled and piping-hot purified water.',
    colors: [{ name: 'Glacier White', hex: '#FFFFFF' }],
    visualVariant: 'core'
  },
  {
    id: 'mdl-squarebig',
    title: 'SquareMax High-Output',
    category: 'Standing / Office',
    tankCapacity: 'Large Capacity • Commercial & Family',
    filtration: 'High-Capacity 6-Stage RO System',
    badge: 'Heavy Duty',
    rentalMonthly: 490000,
    outrightPrice: 17900000,
    description:
      'High-output architectural standing dispenser designed for busy households, clinics, and corporate lounges with rapid thermal recovery.',
    colors: [{ name: 'Pure White', hex: '#F8FAFC' }],
    visualVariant: 'core'
  },
  {
    id: 'mdl-squarefit',
    title: 'SquareFit Compact Cube',
    category: 'Countertop RO',
    tankCapacity: 'Compact Cube • Hot / Cold / Ambient',
    filtration: '6-Stage RO Filtration (0.0001 μm)',
    badge: 'Compact Design',
    rentalMonthly: 360000,
    outrightPrice: 13600000,
    description:
      'Geometric space-optimized countertop water purifier that fits cleanly beneath standard kitchen cabinetry while delivering 99.9% pure RO water.',
    colors: [{ name: 'Arctic White', hex: '#FFFFFF' }],
    visualVariant: 'neo'
  },
  {
    id: 'mdl-villaem-3',
    title: 'Villa Series III Digital',
    category: 'Countertop RO',
    tankCapacity: '11.3L Total • 48 Custom Temp Combos',
    filtration: '6-Stage RO Filtration + UV Care Sterilization',
    badge: 'Next-Gen Flagship',
    rentalMonthly: 460000,
    outrightPrice: 16900000,
    description:
      'Third-generation flagship countertop purifier featuring digital touch control, UV nozzle sterilization, and customizable baby-formula temperatures.',
    colors: [
      { name: 'Porcelain White', hex: '#F8FAFC' },
      { name: 'Warm Sand', hex: '#E7E5E4' }
    ],
    visualVariant: 'villaem'
  },
  {
    id: 'mdl-kristal-ice',
    title: 'Crystal Ice & RO Station',
    category: 'Ice & Sparkling',
    tankCapacity: '6.0L Water + 0.75kg Crystal Ice Maker',
    filtration: '6-Stage RO + Dual UV Ice & Tank Sterilization',
    badge: 'Pure Ice Maker',
    rentalMonthly: 550000,
    outrightPrice: 19900000,
    description:
      'Dual-purpose RO water purifier and crystal-clear ice maker crafted from purified water with automatic UV sterilization every cycle.',
    colors: [{ name: 'Platinum Silver', hex: '#E2E8F0' }],
    visualVariant: 'lucy'
  },
  {
    id: 'mdl-neo-plus',
    title: 'Neo Slim CHP-264',
    category: 'Countertop RO',
    tankCapacity: '5.8L Total • Hot / Cold / Ambient',
    filtration: '6-Stage RO Filtration + Eco Night Sensor',
    badge: 'Best Value',
    rentalMonthly: 310000,
    outrightPrice: 11200000,
    description:
      'Slim, energy-saving countertop RO purifier ideal for young families and modern apartments, with continuous-flow lever and child safety lock.',
    colors: [{ name: 'Pure White', hex: '#FFFFFF' }],
    visualVariant: 'neo'
  },
  {
    id: 'mdl-ombak',
    title: 'HydroWave 50-Temp Pro',
    category: 'Countertop RO',
    tankCapacity: '13.5L Total • 50 Temperature Settings',
    filtration: '6-Stage RO + UV Sterilization Faucet',
    badge: 'Chef & Family Favorite',
    rentalMonthly: 470000,
    outrightPrice: 17400000,
    description:
      'Engineered for modern kitchens with 50 precise temperature combinations (40°C–90°C), preset volume dispensing, and a dedicated UV-sterilized faucet.',
    colors: [
      { name: 'Porcelain White', hex: '#F8FAFC' },
      { name: 'Soft Sky Mist', hex: '#BAE6FD' }
    ],
    visualVariant: 'ombak'
  },
  {
    id: 'mdl-core',
    title: 'Core Max 21L Floor Unit',
    category: 'Standing / Office',
    tankCapacity: '21.1L Extra-Large • Hot / Cold / Ambient',
    filtration: '6-Stage High-Volume RO Filtration System',
    badge: '21.1L High Capacity',
    rentalMonthly: 490000,
    outrightPrice: 18200000,
    description:
      'High-capacity floor-standing water purifier with tactile touch panel, generous 21.1-liter reserve tank, and rapid dispensing for large families & offices.',
    colors: [{ name: 'Glacier White', hex: '#FFFFFF' }],
    visualVariant: 'core'
  },
  {
    id: 'mdl-cinnamon',
    title: 'UltraSlim 18cm Ambient',
    category: 'Countertop RO',
    tankCapacity: '5.0L Ambient • One-Touch Smart Tap',
    filtration: '4-Stage Nanotrap / RO Filtration',
    badge: 'Ultra-Slim 18cm',
    rentalMonthly: 250000,
    outrightPrice: 8900000,
    description:
      'Featherweight 18cm-wide ambient water purifier with preset 250ml/500ml/1000ml one-touch dispensing—the most accessible entry into pure filtered water.',
    colors: [{ name: 'Snow White', hex: '#FFFFFF' }],
    visualVariant: 'neo'
  },
  {
    id: 'mdl-villaem-2',
    title: 'Villa Series II Dial RO',
    category: 'Countertop RO',
    tankCapacity: '11.3L Total • 4-Temp Rotary Dial',
    filtration: '6-Stage RO Filtration System (0.0001 μm)',
    badge: 'All-Time Bestseller',
    rentalMonthly: 440000,
    outrightPrice: 16200000,
    description:
      'Signature family water purifier with intuitive temperature dial, mood night-lamp, detachable faucet, and automatic night eco power saving.',
    colors: [
      { name: 'Porcelain White', hex: '#F8FAFC' },
      { name: 'Glacier Silver', hex: '#E2E8F0' }
    ],
    visualVariant: 'villaem'
  },
  {
    id: 'mdl-noble-2',
    title: 'AeroTower 4D Purifier',
    category: 'Air Purifier',
    tankCapacity: 'Coverage up to 66 m² • 4D Tower',
    filtration: '4D Double HEPA Filter + UV-C Sterilization',
    badge: 'Architectural Air',
    rentalMonthly: 480000,
    outrightPrice: 17500000,
    description:
      '360° architectural air purifier with 4D intake, directional airflow control, and 99.999% ultrafine dust & allergen removal.',
    colors: [{ name: 'Pebble Gray / White', hex: '#E2E8F0' }],
    visualVariant: 'air'
  },
  {
    id: 'mdl-next-storm',
    title: 'AeroCirculator Pro 66',
    category: 'Air Purifier',
    tankCapacity: 'Coverage up to 66 m² • Dual Circulation',
    filtration: 'True HEPA H13 + Deodorization Filter',
    badge: 'Enhanced Airflow',
    rentalMonthly: 390000,
    outrightPrice: 13900000,
    description:
      'Upgraded multidirectional air circulator and purifier engineered for living rooms and bedrooms with real-time PM2.5 air quality LED ring.',
    colors: [{ name: 'Pure White', hex: '#FFFFFF' }],
    visualVariant: 'air'
  },
  {
    id: 'mdl-storm',
    title: 'AeroBreeze 3-Way HEPA',
    category: 'Air Purifier',
    tankCapacity: 'Coverage up to 49.5 m² • 3-Way Airflow',
    filtration: '4-Stage True HEPA Filtration System',
    badge: 'Bestselling Air',
    rentalMonthly: 310000,
    outrightPrice: 10800000,
    description:
      'Powerful multidirectional air purifier projecting clean air up to 6 meters forward with Rapid Haze Mode and whisper-quiet sleep operation.',
    colors: [{ name: 'Pure White', hex: '#FFFFFF' }],
    visualVariant: 'air'
  },
  {
    id: 'mdl-poe-23a',
    title: 'Whole-House Outdoor UF',
    category: 'Outdoor Filter',
    tankCapacity: 'Point-of-Entry • 3,300 L/hr Flow',
    filtration: 'UF Hollow Fiber Membrane (0.01 μm) + Auto Backwash',
    badge: 'Whole-Home Protection',
    rentalMonthly: 450000,
    outrightPrice: 16500000,
    description:
      'Stainless-steel outdoor whole-house water filtration system with programmable automatic backwash timer, protecting every tap, shower, and appliance.',
    colors: [{ name: 'Brushed Stainless', hex: '#CBD5E1' }],
    visualVariant: 'poe'
  }
];

const OFFICIAL_PACKAGES: OfficialPackage[] = [
  {
    id: 'pkg-filter',
    title: 'Filter Membership',
    subtitle: 'Genuine RO & HEPA Filter Subscription',
    badge: 'Periodic Care',
    highlight: 'Scheduled replacement every 2–6 months',
    imageUrl: ''
  },
  {
    id: 'pkg-price',
    title: 'Outright Purchase',
    subtitle: 'Direct Cash & 0% Bank Installment',
    badge: 'Direct Ownership',
    highlight: 'Includes 1-Year Free Maintenance & Filters',
    imageUrl: ''
  },
  {
    id: 'pkg-3yr',
    title: 'Package 3 Tahun',
    subtitle: '36-Month All-Inclusive Rental Plan',
    badge: 'Flexible Term',
    highlight: 'Free Installation, Warranty & 2-Month Care',
    imageUrl: ''
  },
  {
    id: 'pkg-5yr',
    title: 'Package 5 Tahun',
    subtitle: '60-Month Most Popular Family Plan',
    badge: 'Best Monthly Value',
    highlight: 'Lowest Monthly Rate + Full 5-Year Coverage',
    imageUrl: ''
  },
  {
    id: 'pkg-6yr',
    title: 'Package 6 Tahun',
    subtitle: '72-Month Extended Protection Plan',
    badge: 'Extended Care',
    highlight: '6 Full Years of Technician Service & Filter Swaps',
    imageUrl: ''
  },
  {
    id: 'pkg-7yr',
    title: 'Package 7 Tahun',
    subtitle: '84-Month Ultra-Low Monthly Plan',
    badge: 'Maximum Savings',
    highlight: 'Lowest Possible Monthly Installment + Free Care',
    imageUrl: ''
  }
];

const OFFICIAL_PROMOS: OfficialPromo[] = [
  {
    id: 'promo-double',
    title: 'Promo Double Savings',
    tag: 'Limited Time Promo',
    description:
      'Enjoy double savings on selected Water & Air Purifier packages with free registration, free delivery, and complimentary periodic maintenance.',
    imageUrl: ''
  },
  {
    id: 'promo-99k',
    title: '99K Special Entry Deal',
    tag: 'Special Offer',
    description:
      'Start pure living at home with our special 99K introductory promo offer—chat directly via WhatsApp to check eligible models.',
    imageUrl: ''
  }
];

const OFFICIAL_BROCHURES: OfficialBrochure[] = [
  {
    id: 'br-yonsu',
    title: 'Series Y1 Spec Sheet',
    model: 'Series Y1 Minimalist RO',
    visualVariant: 'villaem',
    specs: ['Dimensions: 260 x 483 x 500 mm', '6-Stage RO (0.0001 μm)', 'Hot / Cold / Ambient Touch']
  },
  {
    id: 'br-slim',
    title: 'Slim Stand Spec Sheet',
    model: 'Slim Stand Tower RO',
    visualVariant: 'core',
    specs: ['Dimensions: 260 x 440 x 1100 mm', 'Slim Space-Saving Footprint', 'High-Recovery Heating & Cooling']
  },
  {
    id: 'br-v3',
    title: 'Villa Series III Spec Sheet',
    model: 'Villa Series III Digital',
    visualVariant: 'villaem',
    specs: ['Tank Capacity: 11.3 Liters', '48 Custom Temp Combinations', 'UV-C Nozzle Auto-Sterilization']
  },
  {
    id: 'br-kristal',
    title: 'Crystal Ice Spec Sheet',
    model: 'Crystal Ice & RO Station',
    visualVariant: 'lucy',
    specs: ['6.0L Water + 0.75kg Ice Storage', 'Dual UV Ice & Reservoir Care', 'RO Purified Crystal Ice Cubes']
  },
  {
    id: 'br-neo',
    title: 'Neo Slim Spec Sheet',
    model: 'Neo Slim CHP-264',
    visualVariant: 'neo',
    specs: ['Tank Capacity: 5.8 Liters', 'Eco Light-Sensor Night Mode', 'Child Safety Hot Water Lock']
  },
  {
    id: 'br-ombak',
    title: 'HydroWave Spec Sheet',
    model: 'HydroWave 50-Temp Pro',
    visualVariant: 'ombak',
    specs: ['Tank Capacity: 13.5 Liters', '50 Temp Settings (40°C–90°C)', 'Preset Volume Dispensing']
  },
  {
    id: 'br-core',
    title: 'Core Max 21L Spec Sheet',
    model: 'Core Max 21L Floor Unit',
    visualVariant: 'core',
    specs: ['Extra-Large 21.1L Reserve Tank', 'Ideal for Offices & Large Homes', 'One-Touch Continuous Flow']
  },
  {
    id: 'br-poe',
    title: 'Outdoor UF Spec Sheet',
    model: 'Whole-House Outdoor UF',
    visualVariant: 'poe',
    specs: ['Flow Rate: 3,300 Liters / Hour', '0.01 μm Hollow Fiber Membrane', 'Programmable Auto-Backwash']
  }
];

const CatalogStorageAdapter = {
  getProducts(): CowayProduct[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_DISPENSERS));
        return DEFAULT_DISPENSERS;
      }
      const parsed: unknown = JSON.parse(raw);
      return Array.isArray(parsed) && parsed.length > 0
        ? (parsed as CowayProduct[])
        : DEFAULT_DISPENSERS;
    } catch (e) {
      console.error('Storage read error:', e);
      return DEFAULT_DISPENSERS;
    }
  }
};

// Format Indonesian Rupiah cleanly
const formatIDR = (amount: number): string => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
};

// ============================================================================
// CUSTOM SVG DISPENSER & PURIFIER ILLUSTRATIONS (100% Brandless Vector Art)
// ============================================================================
interface CowayDispenserArtworkProps {
  variant?: VisualVariant;
  accent?: string;
}

const CowayDispenserArtwork: React.FC<CowayDispenserArtworkProps> = ({
  variant = 'villaem',
  accent = '#00AFF0'
}) => {
  switch (variant) {
    case 'ombak':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <defs>
            <linearGradient id="ombakBody" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#E0F2FE" />
            </linearGradient>
          </defs>
          <ellipse cx="110" cy="196" rx="58" ry="8" fill="#BAE6FD" opacity="0.6" />
          <rect x="64" y="28" width="92" height="162" rx="18" fill="url(#ombakBody)" stroke="#BAE6FD" strokeWidth="2.5" />
          <rect x="64" y="28" width="92" height="44" rx="16" fill="#0F172A" />
          <circle cx="92" cy="50" r="8" fill={accent} />
          <rect x="110" y="45" width="32" height="10" rx="5" fill="#38BDF8" opacity="0.85" />
          <path d="M98 72 V102 Q98 110 90 110" stroke="#94A3B8" strokeWidth="5" fill="none" strokeLinecap="round" />
          <path d="M88 115 C88 115 83 123 83 126 A5 5 0 0 0 93 126 C93 123 88 115 88 115 Z" fill={accent} />
          <rect x="74" y="148" width="72" height="10" rx="5" fill="#CBD5E1" />
        </svg>
      );
    case 'neo':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="196" rx="48" ry="7" fill="#BAE6FD" opacity="0.6" />
          <rect x="74" y="26" width="72" height="164" rx="16" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
          <rect x="82" y="38" width="56" height="22" rx="8" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1.5" />
          <circle cx="96" cy="49" r="4" fill="#EF4444" />
          <circle cx="110" cy="49" r="4" fill={accent} />
          <circle cx="124" cy="49" r="4" fill="#10B981" />
          <rect x="104" y="76" width="12" height="26" rx="4" fill="#94A3B8" />
          <path d="M110 107 C110 107 105 115 105 118 A5 5 0 0 0 115 118 C115 115 110 107 110 107 Z" fill={accent} />
          <rect x="82" y="146" width="56" height="8" rx="4" fill="#E2E8F0" />
        </svg>
      );
    case 'core':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="202" rx="52" ry="7" fill="#BAE6FD" opacity="0.65" />
          <rect x="72" y="16" width="76" height="182" rx="14" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
          <rect x="72" y="16" width="76" height="36" rx="12" fill="#0284C7" />
          <circle cx="96" cy="34" r="5" fill="#FFFFFF" />
          <circle cx="110" cy="34" r="5" fill="#7DD3FC" />
          <circle cx="124" cy="34" r="5" fill="#FFFFFF" />
          <rect x="84" y="64" width="52" height="54" rx="10" fill="#F0F9FF" stroke="#BAE6FD" strokeWidth="1.5" />
          <rect x="105" y="70" width="10" height="18" rx="3" fill="#64748B" />
          <path d="M110 92 C110 92 106 99 106 102 A4 4 0 0 0 114 102 C114 99 110 92 110 92 Z" fill={accent} />
          <line x1="72" y1="132" x2="148" y2="132" stroke="#E0F2FE" strokeWidth="2" />
        </svg>
      );
    case 'lucy':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="198" rx="54" ry="7" fill="#BAE6FD" opacity="0.6" />
          <rect x="68" y="22" width="84" height="170" rx="18" fill="#F8FAFC" stroke="#93C5FD" strokeWidth="2.5" />
          <rect x="78" y="34" width="64" height="30" rx="9" fill="#0F172A" />
          <polygon points="96,43 102,49 96,55 90,49" fill="#38BDF8" />
          <polygon points="114,43 120,49 114,55 108,49" fill="#BAE6FD" />
          <rect x="88" y="80" width="14" height="22" rx="4" fill="#94A3B8" />
          <rect x="118" y="80" width="14" height="22" rx="4" fill="#64748B" />
          <rect x="78" y="138" width="64" height="10" rx="5" fill="#CBD5E1" />
        </svg>
      );
    case 'air':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="198" rx="52" ry="7" fill="#BAE6FD" opacity="0.6" />
          <rect x="68" y="24" width="84" height="168" rx="22" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
          <circle cx="110" cy="96" r="34" fill="#F0F9FF" stroke={accent} strokeWidth="4" />
          <circle cx="110" cy="96" r="22" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2" />
          <path d="M92 42 H128" stroke="#94A3B8" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );
    case 'poe':
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="200" rx="44" ry="7" fill="#BAE6FD" opacity="0.6" />
          <rect x="82" y="24" width="56" height="168" rx="24" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="2.5" />
          <rect x="88" y="16" width="44" height="16" rx="6" fill="#0284C7" />
          <rect x="92" y="54" width="36" height="14" rx="4" fill="#FFFFFF" />
        </svg>
      );
    case 'villaem':
    default:
      return (
        <svg viewBox="0 0 220 220" className="w-40 h-40 drop-shadow-sm">
          <ellipse cx="110" cy="196" rx="56" ry="8" fill="#BAE6FD" opacity="0.65" />
          <rect x="66" y="28" width="88" height="162" rx="18" fill="#FFFFFF" stroke="#BAE6FD" strokeWidth="2.5" />
          <circle cx="110" cy="54" r="14" fill="#F0F9FF" stroke={accent} strokeWidth="3" />
          <line x1="110" y1="54" x2="118" y2="47" stroke={accent} strokeWidth="2.5" strokeLinecap="round" />
          <rect x="82" y="82" width="56" height="58" rx="10" fill="#F0F9FF" stroke="#E0F2FE" strokeWidth="1.5" />
          <rect x="104" y="84" width="12" height="22" rx="4" fill="#94A3B8" />
          <path d="M110 112 C110 112 105 120 105 123 A5 5 0 0 0 115 123 C115 120 110 112 110 112 Z" fill={accent} />
          <rect x="76" y="144" width="68" height="9" rx="4.5" fill="#CBD5E1" />
        </svg>
      );
  }
};

// Product Visual Container using clean brandless vector artwork
interface CatalogProductMediaProps {
  product?: CowayProduct | null;
  className?: string;
}

const CatalogProductMedia: React.FC<CatalogProductMediaProps> = ({
  product,
  className = 'h-48'
}) => {
  return (
    <div
      className={`${className} w-full bg-gradient-to-b from-[#F0F9FF] to-[#E0F2FE]/60 flex items-center justify-center relative overflow-hidden p-4`}
    >
      <div className="group-hover:scale-105 transition-transform duration-300">
        <CowayDispenserArtwork
          variant={product?.visualVariant}
          accent={
            product?.colors?.[0]?.hex === '#FFFFFF'
              ? '#00AFF0'
              : product?.colors?.[0]?.hex || '#00AFF0'
          }
        />
      </div>
    </div>
  );
};

// ============================================================================
// MAIN APPLICATION COMPONENT
// ============================================================================
export default function App(): React.ReactElement {
  // Catalog state backed by localStorage
  const [products, setProducts] = useState<CowayProduct[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dispenser Configurator Modal state
  const [selectedProduct, setSelectedProduct] = useState<CowayProduct | null>(null);
  const [planType, setPlanType] = useState<PlanType>('All-Inclusive Rental');
  const [tenureOption, setTenureOption] = useState<string>('Package 5 Tahun (60 Mo)');
  const [selectedColorIndex, setSelectedColorIndex] = useState<number>(0);
  const [quantity, setQuantity] = useState<number>(1);
  const [installationCity, setInstallationCity] = useState<string>('Jabodetabek');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerContact, setCustomerContact] = useState<string>('');
  const [orderSummary, setOrderSummary] = useState<OrderSummaryState | null>(null);
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Selected e-Brochure preview modal
  const [activeBrochure, setActiveBrochure] = useState<OfficialBrochure | null>(null);

  // Interactive RO Stage Inspector state
  const [activeRoStage, setActiveRoStage] = useState<number>(1);

  // Load initial catalog from localStorage
  useEffect(() => {
    const loaded = CatalogStorageAdapter.getProducts();
    setProducts(loaded);
  }, []);

  const openDirectWhatsApp = (message: string): void => {
    const url = buildWhatsAppUrl(message);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const categories: string[] = [
    'All',
    'Countertop RO',
    'Standing / Office',
    'Ice & Sparkling',
    'Air Purifier',
    'Outdoor Filter'
  ];

  const filteredProducts = products.filter((item) => {
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    const q = searchQuery.trim().toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tankCapacity.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Open product configurator modal
  const openProductModal = (
    product: CowayProduct,
    initialPlan: PlanType = 'All-Inclusive Rental',
    initialTenure = 'Package 5 Tahun (60 Mo)'
  ): void => {
    setSelectedProduct(product);
    setPlanType(initialPlan);
    setTenureOption(initialTenure);
    setSelectedColorIndex(0);
    setQuantity(1);
    setOrderSummary(null);
    setCopiedSummary(false);
  };

  // Compute dynamic price
  const calculateUnitPrice = (): number => {
    if (!selectedProduct) return 0;
    if (planType === 'Outright Purchase') {
      return Number(selectedProduct.outrightPrice);
    }
    const baseMonthly = Number(selectedProduct.rentalMonthly);
    if (tenureOption.includes('3 Tahun')) return baseMonthly + 60000;
    if (tenureOption.includes('6 Tahun')) return Math.max(220000, baseMonthly - 20000);
    if (tenureOption.includes('7 Tahun')) return Math.max(200000, baseMonthly - 40000);
    return baseMonthly;
  };

  // Generate structured booking summary
  const handleGenerateOrderSummary = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!selectedProduct) return;

    const unitPrice = calculateUnitPrice();
    const total = unitPrice * quantity;
    const colorName =
      selectedProduct.colors?.[selectedColorIndex]?.name || 'Porcelain White';

    const summaryText = [
      `Halo, saya ingin konsultasi / pemesanan unit dispenser & purifier:`,
      `• Model: ${selectedProduct.title}`,
      `• Kategori: ${selectedProduct.category}`,
      `• Spesifikasi: ${selectedProduct.tankCapacity}`,
      `• Filtrasi: ${selectedProduct.filtration}`,
      `• Paket Pilihan: ${planType}${
        planType === 'All-Inclusive Rental'
          ? ` (${tenureOption})`
          : ' (Cash Outright + 1-Yr Free Maintenance)'
      }`,
      `• Warna Unit: ${colorName}`,
      `• Jumlah: ${quantity} unit`,
      `• Estimasi Biaya: ${formatIDR(total)} ${
        planType === 'All-Inclusive Rental' ? '/ bulan' : '(one-time)'
      }`,
      `• Kota Pemasangan: ${installationCity}`,
      customerName ? `• Nama Pemesan: ${customerName}` : null,
      customerContact ? `• No. WhatsApp Pemesan: ${customerContact}` : null
    ]
      .filter((line): line is string => Boolean(line))
      .join('\n');

    setOrderSummary({
      text: summaryText,
      total
    });

    openDirectWhatsApp(summaryText);
  };

  const copySummaryToClipboard = (): void => {
    if (!orderSummary) return;
    navigator.clipboard?.writeText(orderSummary.text);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  // 6-Stage RO Filtration steps
  const roStages: RoStageInfo[] = [
    {
      stage: 1,
      name: 'Plus Sediment Filter',
      pore: '5 Micron',
      detail: 'Removes rust, sand, silt, suspended particles, and pipe sediment.'
    },
    {
      stage: 2,
      name: 'Pre-Carbon Filter',
      pore: 'Activated Granular',
      detail: 'Adsorbs residual chlorine, VOCs, pesticides, and organic impurities.'
    },
    {
      stage: 3,
      name: 'RO Membrane Core',
      pore: '0.0001 Micron',
      detail:
        'Core Reverse Osmosis barrier eliminating heavy metals, bacteria, viruses, and microplastics.'
    },
    {
      stage: 4,
      name: 'Plus Inno-Sense (Post-Carbon)',
      pore: 'Fine Polishing',
      detail: 'Refines water clarity and enhances crisp, fresh natural taste.'
    },
    {
      stage: 5,
      name: 'Antibacterial Filter',
      pore: 'Tank Protection',
      detail: 'Prevents microorganism growth inside the sealed food-grade reservoir.'
    },
    {
      stage: 6,
      name: 'UV Care Sterilization',
      pore: '275nm UV-C LED',
      detail: 'Auto-sterilizes dispensing nozzles and water path every cycle.'
    }
  ];

  const rentalTenures: string[] = [
    'Package 3 Tahun (36 Mo)',
    'Package 5 Tahun (60 Mo)',
    'Package 6 Tahun (72 Mo)',
    'Package 7 Tahun (84 Mo)'
  ];

  const planOptions: PlanType[] = ['All-Inclusive Rental', 'Outright Purchase'];

  return (
    <div className="min-h-screen bg-[#F0F9FF] text-slate-900 font-sans selection:bg-[#00AFF0] selection:text-white">
      {/* =====================================================================
          FROSTED SKY NAVIGATION BAR
         ===================================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/85 border-b border-[#E0F2FE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          {/* Brandless Wordmark & Droplet */}
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#00AFF0] to-[#1DA1F2] flex items-center justify-center shadow-sm shadow-[#00AFF0]/30">
              <Droplets className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight text-slate-900 leading-none">
                PureWater
              </span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-[#0284C7] mt-0.5">
                Digital E-Catalog
              </span>
            </div>
          </a>

          {/* Anchor Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-slate-600">
            <a href="#models" className="hover:text-[#00AFF0] transition-colors">
              Products ({products.length})
            </a>
            <a href="#packages" className="hover:text-[#00AFF0] transition-colors">
              Packages
            </a>
            <a href="#brochures" className="hover:text-[#00AFF0] transition-colors">
              Spec Sheets
            </a>
            <a href="#promos" className="hover:text-[#00AFF0] transition-colors">
              Promo
            </a>
            <a href="#filtration" className="hover:text-[#00AFF0] transition-colors">
              RO Technology
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2.5">
            <a
              href={buildWhatsAppUrl(
                `Halo, saya tertarik konsultasi produk Water & Air Purifier beserta promo terbaru.`
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3.5 py-1.5 rounded-full transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
              <span>WA {WA_DISPLAY}</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-20">
        {/* ===================================================================
            BENTO HERO SECTION
           =================================================================== */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Primary Hero Card */}
          <div className="lg:col-span-7 bg-white border border-[#E0F2FE] rounded-3xl p-7 sm:p-10 shadow-sm flex flex-col justify-between relative overflow-hidden">
            <div className="absolute -right-16 -top-16 w-64 h-64 rounded-full bg-[#00AFF0]/10 blur-2xl pointer-events-none" />
            <div className="space-y-5 relative z-10">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-semibold text-[#0284C7]">
                  <Sparkles className="w-3.5 h-3.5 text-[#00AFF0]" />
                  Water Dispenser &amp; Air Purifier E-Catalog
                </div>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Pure Water &amp; Clean Air,{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00AFF0] to-[#1DA1F2]">
                  Engineered for Home.
                </span>
              </h1>

              <p className="text-slate-600 text-base sm:text-lg max-w-xl leading-relaxed">
                Explore our complete dispenser &amp; purifier lineup—from 6-Stage Reverse Osmosis
                water dispensers and crystal ice makers to HEPA air purifiers—backed by scheduled
                service care every 2 months.
              </p>
            </div>

            <div className="pt-8 flex flex-wrap items-center gap-3 relative z-10">
              <a
                href="#models"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#00AFF0] hover:bg-[#1DA1F2] text-white font-semibold text-sm transition-all shadow-md shadow-[#00AFF0]/25"
              >
                Explore Products ({products.length})
                <ChevronRight className="w-4 h-4" />
              </a>
              <a
                href={buildWhatsAppUrl(
                  `Halo, saya ingin tanya-tanya rekomendasi Water Dispenser & Air Purifier beserta promo aktif.`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-sm transition-all shadow-md shadow-emerald-500/20"
              >
                <MessageCircle className="w-4 h-4" />
                Chat WhatsApp ({WA_DISPLAY})
              </a>
            </div>
          </div>

          {/* Right Bento Feature Stack */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5">
            {/* Card 1: 6-Stage RO */}
            <div className="bg-gradient-to-br from-[#00AFF0] to-[#1DA1F2] text-white rounded-3xl p-6 shadow-md shadow-[#00AFF0]/20 flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <span className="inline-block text-[11px] font-bold uppercase tracking-wider bg-white/20 px-2.5 py-0.5 rounded-full">
                  0.0001 μm Precision
                </span>
                <h2 className="text-xl font-bold">6-Stage RO Filtration</h2>
                <p className="text-sm text-sky-50 leading-snug">
                  Removes 99.9% of heavy metals, bacteria, viruses, and microplastics for crisp,
                  safe drinking water.
                </p>
              </div>
              <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center shrink-0">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Card 2: Multi-Temp & Periodic Service */}
            <div className="grid grid-cols-2 gap-5">
              <div className="bg-white border border-[#E0F2FE] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#00AFF0] flex items-center justify-center mb-3">
                  <Thermometer className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Instant Multi-Temp</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Hot, Cold, Ambient &amp; Baby Formula presets on demand.
                  </p>
                </div>
              </div>

              <div className="bg-white border border-[#E0F2FE] rounded-3xl p-5 shadow-sm flex flex-col justify-between">
                <div className="w-10 h-10 rounded-xl bg-[#F0F9FF] text-[#1DA1F2] flex items-center justify-center mb-3">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Periodic Care</h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Technician sanitization &amp; filter replacement every 2 months.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ===================================================================
            SECTION 1: PRODUCTS CATALOG (15 BRANDLESS DISPENSER & PURIFIER MODELS)
           =================================================================== */}
        <section id="models" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AFF0]">
                Products Lineup
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Water Dispensers &amp; Air Purifiers
              </h2>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search dispenser, ice, air..."
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-white border border-[#E0F2FE] text-xs sm:text-sm text-slate-900 focus:outline-none focus:border-[#00AFF0]"
              />
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                    active
                      ? 'bg-[#00AFF0] text-white shadow-sm shadow-[#00AFF0]/25'
                      : 'bg-white text-slate-600 border border-[#E0F2FE] hover:border-[#00AFF0]/50 hover:text-[#00AFF0]'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Bento Product Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => openProductModal(product)}
                className="group bg-white border border-[#E0F2FE] hover:border-[#00AFF0] rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:shadow-[#00AFF0]/10 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Visual Preview Header */}
                  <div className="relative">
                    <CatalogProductMedia product={product} className="h-52" />
                    <span className="absolute top-4 left-4 text-[11px] font-bold px-3 py-1 rounded-full bg-white/95 text-[#0284C7] border border-[#BAE6FD] shadow-xs">
                      {product.badge || product.category}
                    </span>
                    <span className="absolute top-4 right-4 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#00AFF0]/10 text-[#0284C7]">
                      {product.category}
                    </span>
                  </div>

                  {/* Card Details */}
                  <div className="p-6 space-y-3">
                    <div>
                      <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-[#00AFF0] transition-colors">
                        {product.title}
                      </h3>
                      <p className="text-xs font-medium text-[#0284C7] mt-0.5">
                        {product.tankCapacity}
                      </p>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Pricing Footer */}
                <div className="px-6 pb-6 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-medium text-slate-400">
                      All-Inclusive Rental
                    </div>
                    <div className="text-base font-extrabold text-slate-900">
                      {formatIDR(product.rentalMonthly)}
                      <span className="text-xs font-normal text-slate-500"> / mo</span>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#00AFF0] group-hover:translate-x-0.5 transition-transform">
                    Select Plan
                    <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 2: OFFICIAL PACKAGES (FILTER PACKAGE TO 7 TAHUN)
           =================================================================== */}
        <section id="packages" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AFF0]">
                Flexible Ownership &amp; Care Plans
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Available Service Packages
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 max-w-md">
              Choose between direct cash ownership or 3-, 5-, 6-, and 7-year all-inclusive care
              packages with periodic technician maintenance.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OFFICIAL_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                onClick={() => {
                  const defaultModel = products[0] || DEFAULT_DISPENSERS[0];
                  if (pkg.id === 'pkg-price') {
                    openProductModal(defaultModel, 'Outright Purchase');
                  } else if (pkg.id === 'pkg-3yr') {
                    openProductModal(
                      defaultModel,
                      'All-Inclusive Rental',
                      'Package 3 Tahun (36 Mo)'
                    );
                  } else if (pkg.id === 'pkg-6yr') {
                    openProductModal(
                      defaultModel,
                      'All-Inclusive Rental',
                      'Package 6 Tahun (72 Mo)'
                    );
                  } else if (pkg.id === 'pkg-7yr') {
                    openProductModal(
                      defaultModel,
                      'All-Inclusive Rental',
                      'Package 7 Tahun (84 Mo)'
                    );
                  } else {
                    openProductModal(
                      defaultModel,
                      'All-Inclusive Rental',
                      'Package 5 Tahun (60 Mo)'
                    );
                  }
                }}
                className="group bg-white border border-[#E0F2FE] hover:border-[#00AFF0] rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex items-center gap-4"
              >
                <div className="w-16 h-16 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center shrink-0 text-[#00AFF0] group-hover:scale-105 transition-transform">
                  {pkg.id === 'pkg-price' ? (
                    <Award className="w-7 h-7" />
                  ) : pkg.id === 'pkg-filter' ? (
                    <ShieldCheck className="w-7 h-7" />
                  ) : (
                    <Calendar className="w-7 h-7" />
                  )}
                </div>
                <div className="space-y-1 min-w-0">
                  <span className="inline-block text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F0F9FF] text-[#0284C7]">
                    {pkg.badge}
                  </span>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-[#00AFF0] transition-colors truncate">
                    {pkg.title}
                  </h3>
                  <p className="text-xs text-slate-600 line-clamp-1">{pkg.subtitle}</p>
                  <p className="text-[11px] font-medium text-[#0284C7]">{pkg.highlight}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 3: ACTIVE PROMOS
           =================================================================== */}
        <section id="promos" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AFF0]">
                Special Offers
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Active Promotions
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {OFFICIAL_PROMOS.map((promo, idx) => (
              <div
                key={promo.id}
                className="bg-white border border-[#E0F2FE] rounded-3xl overflow-hidden shadow-sm flex flex-col justify-between"
              >
                <div className="p-6 bg-gradient-to-br from-[#F0F9FF] via-white to-[#E0F2FE]/70 border-b border-[#E0F2FE] flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[#00AFF0] text-white shadow-xs">
                      {promo.tag}
                    </span>
                    <h3 className="text-xl font-extrabold text-slate-900">{promo.title}</h3>
                  </div>
                  <div className="shrink-0 scale-75 origin-right">
                    <CowayDispenserArtwork
                      variant={idx === 0 ? 'villaem' : 'ombak'}
                      accent="#00AFF0"
                    />
                  </div>
                </div>
                <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <p className="text-xs text-slate-600 leading-relaxed">{promo.description}</p>
                  <a
                    href={buildWhatsAppUrl(
                      `Halo, saya ingin klaim *${promo.title}* untuk pemesanan unit dispenser / purifier.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold transition-colors shadow-sm"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Claim via WA
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 4: DIGITAL SPEC SHEETS GALLERY (BRANDLESS VECTOR CARDS)
           =================================================================== */}
        <section id="brochures" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#00AFF0]">
                Specification Sheets
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Product Spec Sheets
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              Tap any spec sheet card to inspect dimensions, filtration details, and technical
              highlights.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-4">
            {OFFICIAL_BROCHURES.map((br) => (
              <button
                key={br.id}
                onClick={() => setActiveBrochure(br)}
                className="group text-left bg-white border border-[#E0F2FE] hover:border-[#00AFF0] rounded-2xl p-3.5 shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="h-36 w-full rounded-xl bg-[#F0F9FF] overflow-hidden flex items-center justify-center mb-3 p-2 relative">
                  <div className="scale-75 group-hover:scale-80 transition-transform">
                    <CowayDispenserArtwork variant={br.visualVariant} accent="#00AFF0" />
                  </div>
                  <span className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-[#0284C7] border border-[#BAE6FD]">
                    <FileText className="w-3.5 h-3.5" />
                  </span>
                </div>
                <div>
                  <div className="text-xs font-extrabold text-slate-900 group-hover:text-[#00AFF0] transition-colors line-clamp-1">
                    {br.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{br.model}</div>
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 5: INTERACTIVE 6-STAGE RO FILTRATION & CARE
           =================================================================== */}
        <section id="filtration" className="scroll-mt-24">
          <div className="bg-white border border-[#E0F2FE] rounded-3xl p-7 sm:p-10 shadow-sm space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#00AFF0]">
                  Water Purification Science
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                  6-Stage Reverse Osmosis &amp; UV Care
                </h2>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-semibold text-[#0284C7]">
                <Award className="w-4 h-4 text-[#00AFF0]" />
                0.0001 μm Certified RO Filtration
              </div>
            </div>

            {/* Interactive Stage Selector */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {roStages.map((item) => {
                const isSelected = activeRoStage === item.stage;
                return (
                  <button
                    key={item.stage}
                    onClick={() => setActiveRoStage(item.stage)}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      isSelected
                        ? 'bg-[#00AFF0] border-[#00AFF0] text-white shadow-md shadow-[#00AFF0]/20'
                        : 'bg-[#F0F9FF]/70 border-[#E0F2FE] text-slate-800 hover:border-[#00AFF0]'
                    }`}
                  >
                    <div
                      className={`text-[11px] font-bold uppercase ${
                        isSelected ? 'text-sky-100' : 'text-[#00AFF0]'
                      }`}
                    >
                      Stage 0{item.stage}
                    </div>
                    <div className="text-xs font-bold mt-1 leading-snug">{item.name}</div>
                  </button>
                );
              })}
            </div>

            {/* Active Stage Detail Box */}
            {roStages
              .filter((s) => s.stage === activeRoStage)
              .map((stage) => (
                <div
                  key={stage.stage}
                  className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#00AFF0] text-white text-xs font-bold">
                        Stage {stage.stage}
                      </span>
                      <h3 className="text-lg font-extrabold text-slate-900">{stage.name}</h3>
                    </div>
                    <p className="text-sm text-slate-600">{stage.detail}</p>
                  </div>
                  <div className="shrink-0 bg-white px-4 py-3 rounded-xl border border-[#BAE6FD] text-right">
                    <div className="text-[11px] font-semibold text-slate-400">Filtration Grade</div>
                    <div className="text-sm font-extrabold text-[#0284C7]">{stage.pore}</div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ===================================================================
            SECTION 6: RENTAL VS OUTRIGHT PURCHASE COMPARISON
           =================================================================== */}
        <section className="scroll-mt-24">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-2 border-[#00AFF0] rounded-3xl p-7 space-y-4 shadow-sm">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00AFF0]/10 text-[#0284C7] text-xs font-bold">
                Most Popular • 3 / 5 / 6 / 7 Tahun Plans
              </div>
              <h3 className="text-xl font-bold text-slate-900">All-Inclusive Rental Plan</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Zero upfront hassle with predictable monthly care starting from{' '}
                <strong className="text-slate-900">Rp 250.000/month</strong>.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00AFF0] shrink-0" />
                  Free professional delivery &amp; kitchen installation
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00AFF0] shrink-0" />
                  Complimentary technician sanitization every 2 months
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#00AFF0] shrink-0" />
                  Free genuine RO filter replacements &amp; full warranty coverage
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl(
                    `Halo, saya ingin info lengkap paket All-Inclusive Rental Dispenser (Free Maintenance & Filter).`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#00AFF0] hover:bg-[#1DA1F2] text-white text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Tanya Paket Rental via WA
                </a>
              </div>
            </div>

            <div className="bg-white border border-[#E0F2FE] rounded-3xl p-7 space-y-4 shadow-sm">
              <h3 className="text-xl font-bold text-slate-900">
                Outright Cash / Installment Purchase
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Own your water purifier immediately from{' '}
                <strong className="text-slate-900">Rp 8.900.000</strong> with complimentary
                first-year care.
              </p>
              <ul className="space-y-2.5 text-sm text-slate-700 pt-2">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                  100% immediate unit ownership with 0% bank installment options
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                  1-Year complimentary maintenance &amp; filter replacements
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#1DA1F2] shrink-0" />
                  Optional annual service membership renewal thereafter
                </li>
              </ul>
              <div className="pt-2">
                <a
                  href={buildWhatsAppUrl(
                    `Halo, saya tertarik informasi pembelian Outright Cash / Cicilan 0% unit dispenser.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] border border-[#BAE6FD] text-[#0284C7] text-xs font-semibold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Tanya Harga Outright via WA
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* =====================================================================
          FLOATING DIRECT WHATSAPP QUICK-CHAT BUTTON (+62 813 1136 1963)
         ===================================================================== */}
      <a
        href={buildWhatsAppUrl(
          `Halo, saya melihat E-Catalog Water Dispenser & Air Purifier dan ingin konsultasi produk.`
        )}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Chat WhatsApp ${WA_DISPLAY}`}
        className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
      >
        <MessageCircle className="w-5 h-5 fill-white/20" />
        <span className="hidden sm:inline">WhatsApp • {WA_DISPLAY}</span>
        <span className="sm:hidden">Chat WA</span>
      </a>

      {/* =====================================================================
          CLEAN FOOTER
         ===================================================================== */}
      <footer className="border-t border-[#E0F2FE] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-bold text-slate-900 text-sm">PureWater</span>
            <span>•</span>
            <span>Water Dispenser &amp; Air Purifier Digital E-Catalog</span>
          </div>

          <a
            href={buildWhatsAppUrl(`Halo, saya ingin konsultasi unit dispenser & purifier.`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-emerald-600 hover:text-emerald-700"
          >
            <Phone className="w-3.5 h-3.5" />
            {WA_DISPLAY}
          </a>
        </div>
      </footer>

      {/* =====================================================================
          DISPENSER CONFIGURATOR MODAL
         ===================================================================== */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-[#E0F2FE] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E0F2FE] flex items-center justify-between z-10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#00AFF0]">
                    {selectedProduct.category}
                  </span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{selectedProduct.title}</h3>
              </div>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Product Hero Preview */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-5">
                <div className="sm:col-span-5 flex justify-center">
                  <CatalogProductMedia product={selectedProduct} className="h-44 rounded-xl" />
                </div>
                <div className="sm:col-span-7 space-y-2">
                  <div className="text-xs font-bold text-[#0284C7]">
                    {selectedProduct.tankCapacity}
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {selectedProduct.description}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1.5">
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-[#BAE6FD]">
                      Free Delivery &amp; Install
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-white text-slate-700 border border-[#BAE6FD]">
                      2-Month Periodic Care
                    </span>
                  </div>
                </div>
              </div>

              {/* Plan Type Toggle */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700">
                  1. Select Ownership / Rental Plan
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {planOptions.map((option) => (
                    <button
                      type="button"
                      key={option}
                      onClick={() => setPlanType(option)}
                      className={`p-3.5 rounded-2xl border text-left transition-all ${
                        planType === option
                          ? 'border-[#00AFF0] bg-[#F0F9FF] ring-2 ring-[#00AFF0]/20'
                          : 'border-slate-200 hover:border-[#BAE6FD]'
                      }`}
                    >
                      <div className="text-sm font-bold text-slate-900">{option}</div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {option === 'All-Inclusive Rental'
                          ? `From ${formatIDR(selectedProduct.rentalMonthly)}/mo • Free Filter & Service`
                          : `${formatIDR(selectedProduct.outrightPrice)} • 1-Yr Free Care`}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rental Tenure Selector */}
              {planType === 'All-Inclusive Rental' && (
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">
                    2. Official Care Package Duration
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {rentalTenures.map((tenure) => (
                      <button
                        type="button"
                        key={tenure}
                        onClick={() => setTenureOption(tenure)}
                        className={`py-2.5 px-3 rounded-xl border text-xs font-semibold transition-all ${
                          tenureOption === tenure
                            ? 'bg-[#00AFF0] text-white border-[#00AFF0]'
                            : 'bg-white text-slate-700 border-slate-200 hover:border-[#00AFF0]'
                        }`}
                      >
                        {tenure}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Unit Finish & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Unit Finish</label>
                  <div className="flex flex-wrap gap-2">
                    {(selectedProduct.colors || [{ name: 'Porcelain White', hex: '#FFFFFF' }]).map(
                      (c, idx) => (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => setSelectedColorIndex(idx)}
                          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-semibold ${
                            selectedColorIndex === idx
                              ? 'border-[#00AFF0] bg-[#F0F9FF] text-slate-900'
                              : 'border-slate-200 text-slate-600'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300"
                            style={{ backgroundColor: c.hex }}
                          />
                          {c.name}
                        </button>
                      )
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-700">Installation Area</label>
                  <select
                    value={installationCity}
                    onChange={(e) => setInstallationCity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-900 focus:outline-none focus:border-[#00AFF0]"
                  >
                    <option value="Jabodetabek">Jabodetabek</option>
                    <option value="Bandung & Jawa Barat">Bandung &amp; Jawa Barat</option>
                    <option value="Surabaya & Jawa Timur">Surabaya &amp; Jawa Timur</option>
                    <option value="Semarang & Yogyakarta">Semarang &amp; Yogyakarta</option>
                    <option value="Medan & Sumatera">Medan &amp; Sumatera</option>
                    <option value="Bali & Makassar">Bali &amp; Makassar</option>
                  </select>
                </div>
              </div>

              {/* Order Summary Output or Booking Form */}
              <div className="border-t border-slate-100 pt-5">
                {orderSummary ? (
                  <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0284C7] uppercase tracking-wider">
                        Booking Summary Generated
                      </span>
                      <button
                        type="button"
                        onClick={copySummaryToClipboard}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#00AFF0] hover:text-[#1DA1F2]"
                      >
                        {copiedSummary ? (
                          <>
                            <Check className="w-4 h-4" /> Copied
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4" /> Copy Details
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="text-xs text-slate-800 whitespace-pre-wrap font-mono bg-white p-3.5 rounded-xl border border-[#E0F2FE]">
                      {orderSummary.text}
                    </pre>
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setOrderSummary(null)}
                        className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700"
                      >
                        Modify Selection
                      </button>
                      <a
                        href={buildWhatsAppUrl(orderSummary.text)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-sm"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Send via WhatsApp ({WA_DISPLAY})
                      </a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleGenerateOrderSummary} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input
                        type="text"
                        placeholder="Your Name (Optional)"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F0F9FF]/60 border border-[#E0F2FE] text-xs text-slate-900 focus:outline-none focus:border-[#00AFF0]"
                      />
                      <input
                        type="text"
                        placeholder="Your WhatsApp No. (Optional)"
                        value={customerContact}
                        onChange={(e) => setCustomerContact(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-[#F0F9FF]/60 border border-[#E0F2FE] text-xs text-slate-900 focus:outline-none focus:border-[#00AFF0]"
                      />
                      <div className="flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F0F9FF]/60 border border-[#E0F2FE]">
                        <span className="text-xs font-semibold text-slate-600">Units</span>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          >
                            -
                          </button>
                          <span className="text-xs font-bold w-4 text-center">{quantity}</span>
                          <button
                            type="button"
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-6 h-6 rounded-lg bg-white border border-slate-200 text-xs font-bold"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <div className="text-xs text-slate-500">Estimated Total</div>
                        <div className="text-xl font-extrabold text-slate-900">
                          {formatIDR(calculateUnitPrice() * quantity)}
                          <span className="text-xs font-normal text-slate-500">
                            {planType === 'All-Inclusive Rental' ? ' / month' : ' one-time'}
                          </span>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs sm:text-sm font-semibold transition-all shadow-md shadow-emerald-500/25 shrink-0"
                      >
                        <MessageCircle className="w-4 h-4" />
                        Order via WhatsApp
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          DIGITAL SPEC SHEET LIGHTBOX MODAL (BRANDLESS VECTOR VIEW)
         ===================================================================== */}
      {activeBrochure && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white border border-[#E0F2FE] rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white/95 backdrop-blur-md px-6 py-4 border-b border-[#E0F2FE] flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#00AFF0]">
                  Technical Specification Sheet
                </span>
                <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                  {activeBrochure.title} — {activeBrochure.model}
                </h3>
              </div>
              <button
                onClick={() => setActiveBrochure(null)}
                className="p-2 rounded-xl bg-[#F0F9FF] hover:bg-[#E0F2FE] text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-[#F0F9FF] border border-[#BAE6FD] rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                <div className="sm:col-span-5 flex justify-center">
                  <CowayDispenserArtwork
                    variant={activeBrochure.visualVariant}
                    accent="#00AFF0"
                  />
                </div>
                <div className="sm:col-span-7 space-y-2.5">
                  <div className="text-sm font-extrabold text-slate-900">
                    {activeBrochure.model}
                  </div>
                  <ul className="space-y-2">
                    {activeBrochure.specs.map((sp) => (
                      <li
                        key={sp}
                        className="flex items-center gap-2 text-xs font-medium text-slate-700 bg-white px-3 py-2 rounded-xl border border-[#E0F2FE]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#00AFF0] shrink-0" />
                        <span>{sp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="text-xs text-slate-600">
                  Need full installation dimensions or promo pricing?
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={buildWhatsAppUrl(
                      `Halo, saya baru melihat spec sheet *${activeBrochure.title}* (${activeBrochure.model}) dan ingin info detail harga & promo.`
                    )}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-xs font-semibold text-white shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    Tanya via WA ({WA_DISPLAY})
                  </a>
                  <button
                    onClick={() => {
                      const matched = products.find((p) =>
                        p.title
                          .toLowerCase()
                          .includes(activeBrochure.model.toLowerCase().split(' ')[0])
                      );
                      setActiveBrochure(null);
                      if (matched) openProductModal(matched);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#00AFF0] hover:bg-[#1DA1F2] text-xs font-semibold text-white"
                  >
                    Configure Model
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}