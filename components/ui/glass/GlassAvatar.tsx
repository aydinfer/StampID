/**
 * GlassAvatar Component
 *
 * Avatar component with glassmorphic design, supports:
 * - Image display
 * - Initials fallback (from name)
 * - Multiple sizes (xs, sm, md, lg, xl)
 * - Status indicator (online, offline, busy, away)
 * - Border variants
 */

import React from 'react';
import { View, Text, Image, ImageSourcePropType } from 'react-native';
import { BlurView } from 'expo-blur';
import { formatInitials } from '@/lib/utils/format';

export interface GlassAvatarProps {
  /** Image source for avatar */
  source?: ImageSourcePropType;
  /** User name (used for initials fallback) */
  name?: string;
  /** Avatar size */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Status indicator */
  status?: 'online' | 'offline' | 'busy' | 'away' | 'none';
  /** Border variant */
  variant?: 'default' | 'premium' | 'minimal';
  /** Custom background color (when no image) */
  backgroundColor?: string;
  /** Custom text color for initials */
  textColor?: string;
}

const sizeConfig = {
  xs: {
    container: 'w-8 h-8',
    text: 'text-xs',
    status: 'w-2 h-2 border',
  },
  sm: {
    container: 'w-10 h-10',
    text: 'text-sm',
    status: 'w-2.5 h-2.5 border',
  },
  md: {
    container: 'w-12 h-12',
    text: 'text-base',
    status: 'w-3 h-3 border-2',
  },
  lg: {
    container: 'w-16 h-16',
    text: 'text-lg',
    status: 'w-3.5 h-3.5 border-2',
  },
  xl: {
    container: 'w-24 h-24',
    text: 'text-2xl',
    status: 'w-4 h-4 border-2',
  },
};

const statusConfig = {
  online: 'bg-green-500',
  offline: 'bg-gray-500',
  busy: 'bg-red-500',
  away: 'bg-yellow-500',
  none: '',
};

const variantConfig = {
  default: 'border-2 border-white/20',
  premium: 'border-2 border-primary-400/50',
  minimal: 'border border-white/10',
};

/**
 * GlassAvatar Component
 *
 * @example Basic with image
 * ```tsx
 * <GlassAvatar
 *   source={{ uri: 'https://example.com/avatar.jpg' }}
 *   name="John Doe"
 *   size="md"
 * />
 * ```
 *
 * @example Initials fallback with status
 * ```tsx
 * <GlassAvatar
 *   name="Jane Smith"
 *   size="lg"
 *   status="online"
 *   variant="premium"
 * />
 * ```
 *
 * @example Custom colors
 * ```tsx
 * <GlassAvatar
 *   name="Mike Johnson"
 *   size="md"
 *   backgroundColor="rgba(59, 130, 246, 0.3)"
 *   textColor="#60A5FA"
 * />
 * ```
 */
export function GlassAvatar({
  source,
  name = '',
  size = 'md',
  status = 'none',
  variant = 'default',
  backgroundColor,
  textColor = '#FFFFFF',
}: GlassAvatarProps) {
  const sizeStyles = sizeConfig[size];
  const statusColor = statusConfig[status];
  const variantStyle = variantConfig[variant];

  // Generate initials from name
  const initials = formatInitials(name);

  // Determine background color
  const bgColor = backgroundColor || 'rgba(255, 255, 255, 0.1)';

  return (
    <View className="relative">
      {/* Avatar Container */}
      <View
        className={`${sizeStyles.container} rounded-full overflow-hidden ${variantStyle}`}
        style={{ backgroundColor: source ? 'transparent' : bgColor }}
      >
        {source ? (
          // Image Avatar
          <Image
            source={source}
            className="w-full h-full"
            resizeMode="cover"
          />
        ) : (
          // Initials Fallback with Blur
          <BlurView
            intensity={20}
            tint="dark"
            className="w-full h-full items-center justify-center"
          >
            <Text
              className={`${sizeStyles.text} font-bold`}
              style={{ color: textColor }}
            >
              {initials}
            </Text>
          </BlurView>
        )}
      </View>

      {/* Status Indicator */}
      {status !== 'none' && (
        <View
          className={`absolute bottom-0 right-0 ${sizeStyles.status} ${statusColor} rounded-full border-gray-900`}
        />
      )}
    </View>
  );
}

/**
 * GlassAvatarGroup Component
 *
 * Displays multiple avatars in an overlapping group
 *
 * @example
 * ```tsx
 * <GlassAvatarGroup max={3} size="sm">
 *   <GlassAvatar name="John Doe" />
 *   <GlassAvatar name="Jane Smith" />
 *   <GlassAvatar name="Mike Johnson" />
 *   <GlassAvatar name="Sarah Williams" />
 * </GlassAvatarGroup>
 * ```
 */
export interface GlassAvatarGroupProps {
  /** Avatar components */
  children: React.ReactElement<GlassAvatarProps>[];
  /** Maximum avatars to show before "+N" */
  max?: number;
  /** Size of avatars */
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  /** Spacing between avatars (negative margin) */
  spacing?: number;
}

export function GlassAvatarGroup({
  children,
  max = 3,
  size = 'md',
  spacing = -8,
}: GlassAvatarGroupProps) {
  const avatars = React.Children.toArray(children) as React.ReactElement<GlassAvatarProps>[];
  const visibleAvatars = avatars.slice(0, max);
  const remaining = Math.max(0, avatars.length - max);

  const sizeStyles = sizeConfig[size];

  return (
    <View className="flex-row items-center">
      {visibleAvatars.map((avatar, index) => (
        <View
          key={index}
          style={{ marginLeft: index === 0 ? 0 : spacing }}
          className="relative"
        >
          {React.cloneElement(avatar, { size, variant: 'default' })}
        </View>
      ))}

      {remaining > 0 && (
        <View
          className={`${sizeStyles.container} rounded-full items-center justify-center border-2 border-white/20`}
          style={{
            marginLeft: spacing,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          }}
        >
          <BlurView
            intensity={20}
            tint="dark"
            className="w-full h-full items-center justify-center"
          >
            <Text className={`${sizeStyles.text} font-bold text-white`}>
              +{remaining}
            </Text>
          </BlurView>
        </View>
      )}
    </View>
  );
}
