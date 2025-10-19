/* Feature flags and helpers for region-aware feature toggling */
type FeatureKey = 'crypto' | 'aiRecommendations' | 'bourseIntegration' | 'startupDiscovery';

export const defaultFlags: Record<FeatureKey, boolean> = {
  crypto: false, // default to disabled for legal/regulatory safety
  aiRecommendations: true,
  bourseIntegration: true,
  startupDiscovery: true,
};

/**
 * Decide whether a feature is enabled given a region code (ISO2) or other context.
 * For now, Tunisia ("TN") disables crypto features regardless of client choice.
 */
export function isFeatureEnabled(key: FeatureKey, region?: string) {
  const r = (region || process.env.NEXT_PUBLIC_REGION || '').toUpperCase();
  if (r === 'TN' && key === 'crypto') return false;
  return defaultFlags[key];
}

export default { defaultFlags, isFeatureEnabled };
