// Stamp Catalog Types and Value Calculation
// Hybrid approach: AI estimates + user corrections + verified catalog matches

// Philatelic condition grades (industry standard)
export type PhilatelicGrade =
  | 'superb'      // Perfect centering, fresh gum, no faults
  | 'extremely_fine' // Well centered, fresh appearance
  | 'very_fine'   // Reasonably centered, fresh
  | 'fine'        // Perfs clear of design, minor faults ok
  | 'very_good'   // Perfs may touch design
  | 'good'        // Perfs cut into design
  | 'fair'        // Heavy cancels, thin spots
  | 'poor';       // Major defects

// Simplified condition for user-facing UI
export type SimpleCondition = 'mint' | 'excellent' | 'good' | 'fair' | 'poor';

// Rarity tiers
export type RarityTier = 'common' | 'uncommon' | 'rare' | 'very_rare' | 'legendary';

// Value confidence levels
export type ValueConfidence = 'ai_estimate' | 'user_verified' | 'catalog_match' | 'auction_data';

// Condition multipliers for value calculation
export const CONDITION_MULTIPLIERS: Record<SimpleCondition, number> = {
  mint: 1.0,
  excellent: 0.75,
  good: 0.5,
  fair: 0.25,
  poor: 0.1,
};

// Rarity multipliers for value calculation
export const RARITY_MULTIPLIERS: Record<RarityTier, number> = {
  common: 1.0,
  uncommon: 1.5,
  rare: 3.0,
  very_rare: 7.0,
  legendary: 20.0,
};

// Map legacy condition to simple condition
export function mapToSimpleCondition(condition: string | null): SimpleCondition {
  if (!condition) return 'good';

  const mapping: Record<string, SimpleCondition> = {
    'mint': 'mint',
    'mint_hinged': 'excellent',
    'used': 'good',
    'damaged': 'poor',
    // Philatelic grades
    'superb': 'mint',
    'extremely_fine': 'mint',
    'very_fine': 'excellent',
    'fine': 'good',
    'very_good': 'fair',
    'good': 'fair',
    'fair': 'poor',
    'poor': 'poor',
  };

  return mapping[condition.toLowerCase()] || 'good';
}

// Catalog entry for known stamps
export interface CatalogEntry {
  id: string;
  scott_number: string | null;
  michel_number: string | null;
  name: string;
  country: string;
  year_issued: number;
  base_value_usd: number;
  rarity: RarityTier;
  image_url: string | null;
  description: string | null;
  verified: boolean;
  source: 'manual' | 'user_submission' | 'auction_data';
  created_at: string;
  updated_at: string;
}

// Value calculation result
export interface ValueEstimate {
  low: number;
  high: number;
  average: number;
  currency: string;
  confidence: ValueConfidence;
  condition_factor: number;
  rarity_factor: number;
  catalog_match: boolean;
}

// Calculate stamp value based on condition and rarity
export function calculateStampValue(params: {
  baseValueLow: number | null;
  baseValueHigh: number | null;
  condition: string | null;
  rarity: RarityTier | null;
  catalogMatch?: CatalogEntry | null;
}): ValueEstimate {
  const { baseValueLow, baseValueHigh, condition, rarity, catalogMatch } = params;

  // Use catalog base value if available
  let baseLow = baseValueLow || 0;
  let baseHigh = baseValueHigh || baseLow * 1.5;

  if (catalogMatch) {
    baseLow = catalogMatch.base_value_usd * 0.8;
    baseHigh = catalogMatch.base_value_usd * 1.2;
  }

  // Apply condition multiplier
  const simpleCondition = mapToSimpleCondition(condition);
  const conditionFactor = CONDITION_MULTIPLIERS[simpleCondition];

  // Apply rarity multiplier
  const rarityTier = rarity || 'common';
  const rarityFactor = RARITY_MULTIPLIERS[rarityTier];

  // Calculate final values
  const low = Math.round(baseLow * conditionFactor * rarityFactor * 100) / 100;
  const high = Math.round(baseHigh * conditionFactor * rarityFactor * 100) / 100;

  // Determine confidence level
  let confidence: ValueConfidence = 'ai_estimate';
  if (catalogMatch) {
    confidence = catalogMatch.source === 'auction_data' ? 'auction_data' : 'catalog_match';
  }

  return {
    low,
    high,
    average: (low + high) / 2,
    currency: 'USD',
    confidence,
    condition_factor: conditionFactor,
    rarity_factor: rarityFactor,
    catalog_match: !!catalogMatch,
  };
}

// Get display label for condition
export function getConditionLabel(condition: SimpleCondition): string {
  const labels: Record<SimpleCondition, string> = {
    mint: 'Mint',
    excellent: 'Excellent',
    good: 'Good',
    fair: 'Fair',
    poor: 'Poor',
  };
  return labels[condition];
}

// Get display label for rarity
export function getRarityLabel(rarity: RarityTier): string {
  const labels: Record<RarityTier, string> = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    very_rare: 'Very Rare',
    legendary: 'Legendary',
  };
  return labels[rarity];
}

// Get color class for rarity (for styling)
export function getRarityColorClass(rarity: RarityTier): string {
  const colors: Record<RarityTier, string> = {
    common: 'bg-gray-100 text-gray-700',
    uncommon: 'bg-green-100 text-green-700',
    rare: 'bg-blue-100 text-blue-700',
    very_rare: 'bg-purple-100 text-purple-700',
    legendary: 'bg-amber-100 text-amber-700',
  };
  return colors[rarity];
}

// Get color class for condition
export function getConditionColorClass(condition: SimpleCondition): string {
  const colors: Record<SimpleCondition, string> = {
    mint: 'bg-emerald-100 text-emerald-700',
    excellent: 'bg-green-100 text-green-700',
    good: 'bg-blue-100 text-blue-700',
    fair: 'bg-amber-100 text-amber-700',
    poor: 'bg-red-100 text-red-700',
  };
  return colors[condition];
}

// Get confidence display info
export function getConfidenceInfo(confidence: ValueConfidence): { label: string; colorClass: string } {
  const info: Record<ValueConfidence, { label: string; colorClass: string }> = {
    ai_estimate: { label: 'AI Estimate', colorClass: 'bg-gray-100 text-gray-600' },
    user_verified: { label: 'User Verified', colorClass: 'bg-blue-100 text-blue-700' },
    catalog_match: { label: 'Catalog Match', colorClass: 'bg-green-100 text-green-700' },
    auction_data: { label: 'Market Price', colorClass: 'bg-emerald-100 text-emerald-700' },
  };
  return info[confidence];
}
