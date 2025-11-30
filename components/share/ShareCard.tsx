import React, { forwardRef } from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import type { Stamp } from '@/lib/supabase/types';
import { RarityBadge } from '@/components/stamps/RarityBadge';
import { ConditionBadge } from '@/components/stamps/ConditionBadge';
import type { RarityTier } from '@/lib/stamps/catalog';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 48;

export type ShareCardStyle = 'default' | 'rare_find' | 'collection_highlight' | 'just_found';

interface ShareCardProps {
  stamp: Stamp;
  style?: ShareCardStyle;
  showBranding?: boolean;
}

// Share card component that can be captured as image
export const ShareCard = forwardRef<View, ShareCardProps>(
  ({ stamp, style = 'default', showBranding = true }, ref) => {
    const avgValue = ((stamp.estimated_value_low || 0) + (stamp.estimated_value_high || 0)) / 2;

    // Style configurations
    const styleConfig = getStyleConfig(style);

    return (
      <View
        ref={ref}
        style={{ width: CARD_WIDTH }}
        className={`rounded-3xl overflow-hidden ${styleConfig.bgClass}`}
      >
        {/* Header Badge */}
        {style !== 'default' && (
          <View className={`px-4 py-3 ${styleConfig.headerBgClass}`}>
            <Text className={`text-center font-bold text-sm ${styleConfig.headerTextClass}`}>
              {styleConfig.headerText}
            </Text>
          </View>
        )}

        {/* Stamp Image */}
        <View className="aspect-square bg-cream-100">
          {stamp.image_url ? (
            <Image
              source={{ uri: stamp.image_url }}
              className="w-full h-full"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-full items-center justify-center">
              <Text className="text-ink-muted text-lg">No Image</Text>
            </View>
          )}
        </View>

        {/* Info Section */}
        <View className="p-5 bg-white">
          {/* Name & Value */}
          <View className="flex-row items-start justify-between mb-3">
            <View className="flex-1 mr-3">
              <Text className="text-xl font-bold text-ink" numberOfLines={2}>
                {stamp.name || 'Unknown Stamp'}
              </Text>
              <Text className="text-ink-muted mt-1">
                {stamp.country || 'Unknown'} {stamp.year_issued ? `• ${stamp.year_issued}` : ''}
              </Text>
            </View>

            {avgValue > 0 && (
              <View className="bg-forest-900 rounded-xl px-4 py-2">
                <Text className="text-white font-bold text-lg">
                  ${avgValue.toFixed(2)}
                </Text>
              </View>
            )}
          </View>

          {/* Badges */}
          <View className="flex-row items-center gap-2 mb-3">
            {stamp.condition && (
              <ConditionBadge condition={stamp.condition} size="md" />
            )}
            {stamp.rarity && (
              <RarityBadge rarity={stamp.rarity as RarityTier} size="md" />
            )}
            {stamp.catalog_number && (
              <View className="bg-ink-muted/10 rounded-full px-2 py-1">
                <Text className="text-ink-muted text-xs font-medium">
                  #{stamp.catalog_number}
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          {stamp.description && (
            <Text className="text-ink-light text-sm" numberOfLines={2}>
              {stamp.description}
            </Text>
          )}

          {/* Branding Footer */}
          {showBranding && (
            <View className="flex-row items-center justify-center mt-4 pt-4 border-t border-ink-muted/10">
              <View className="w-6 h-6 bg-forest-900 rounded items-center justify-center mr-2">
                <Text className="text-white text-xs font-bold">S</Text>
              </View>
              <Text className="text-ink-muted text-xs">StampID</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);

ShareCard.displayName = 'ShareCard';

// Style configurations for different card styles
function getStyleConfig(style: ShareCardStyle) {
  const configs: Record<ShareCardStyle, {
    bgClass: string;
    headerBgClass: string;
    headerTextClass: string;
    headerText: string;
  }> = {
    default: {
      bgClass: 'bg-white',
      headerBgClass: '',
      headerTextClass: '',
      headerText: '',
    },
    rare_find: {
      bgClass: 'bg-amber-50',
      headerBgClass: 'bg-amber-500',
      headerTextClass: 'text-white',
      headerText: 'RARE FIND',
    },
    collection_highlight: {
      bgClass: 'bg-forest-50',
      headerBgClass: 'bg-forest-900',
      headerTextClass: 'text-white',
      headerText: 'COLLECTION HIGHLIGHT',
    },
    just_found: {
      bgClass: 'bg-blue-50',
      headerBgClass: 'bg-blue-500',
      headerTextClass: 'text-white',
      headerText: 'JUST FOUND',
    },
  };

  return configs[style];
}

// Collection summary share card
interface CollectionShareCardProps {
  stampCount: number;
  totalValue: number;
  topStamps: Stamp[];
  showBranding?: boolean;
}

export const CollectionShareCard = forwardRef<View, CollectionShareCardProps>(
  ({ stampCount, totalValue, topStamps, showBranding = true }, ref) => {
    return (
      <View
        ref={ref}
        style={{ width: CARD_WIDTH }}
        className="rounded-3xl overflow-hidden bg-forest-900"
      >
        {/* Header */}
        <View className="px-5 pt-6 pb-4">
          <Text className="text-white/60 text-sm font-medium">MY COLLECTION</Text>
          <Text className="text-white text-3xl font-bold mt-1">
            ${totalValue.toLocaleString()}
          </Text>
          <Text className="text-white/80 mt-1">
            {stampCount} stamp{stampCount !== 1 ? 's' : ''}
          </Text>
        </View>

        {/* Top Stamps Preview */}
        {topStamps.length > 0 && (
          <View className="flex-row px-5 py-4 gap-2">
            {topStamps.slice(0, 4).map((stamp) => (
              <View
                key={stamp.id}
                className="flex-1 aspect-square rounded-xl overflow-hidden bg-white/10"
              >
                {stamp.image_url ? (
                  <Image
                    source={{ uri: stamp.thumbnail_url || stamp.image_url }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="w-full h-full items-center justify-center">
                    <Text className="text-white/40 text-xs">IMG</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}

        {/* Branding Footer */}
        {showBranding && (
          <View className="flex-row items-center justify-center py-4 border-t border-white/10">
            <View className="w-6 h-6 bg-white rounded items-center justify-center mr-2">
              <Text className="text-forest-900 text-xs font-bold">S</Text>
            </View>
            <Text className="text-white/60 text-xs">Built with StampID</Text>
          </View>
        )}
      </View>
    );
  }
);

CollectionShareCard.displayName = 'CollectionShareCard';
