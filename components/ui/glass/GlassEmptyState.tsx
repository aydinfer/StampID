/**
 * GlassEmptyState Component
 *
 * Empty state component with glassmorphic design for:
 * - Empty lists
 * - No search results
 * - No data available
 * - Error states
 */

import React from 'react';
import { View, Text } from 'react-native';
import { GlassCard } from './GlassCard';
import { GlassButton } from './GlassButton';

export interface GlassEmptyStateProps {
  /** Icon or emoji to display */
  icon?: string;
  /** Title text */
  title: string;
  /** Description text */
  description?: string;
  /** Action button text */
  actionText?: string;
  /** Action button callback */
  onAction?: () => void;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon component */
  iconComponent?: React.ReactNode;
}

const sizeConfig = {
  sm: {
    container: 'p-6',
    icon: 'text-4xl',
    title: 'text-lg',
    description: 'text-sm',
  },
  md: {
    container: 'p-8',
    icon: 'text-5xl',
    title: 'text-xl',
    description: 'text-base',
  },
  lg: {
    container: 'p-12',
    icon: 'text-6xl',
    title: 'text-2xl',
    description: 'text-lg',
  },
};

/**
 * GlassEmptyState Component
 *
 * @example Basic empty state
 * ```tsx
 * <GlassEmptyState
 *   icon="📭"
 *   title="No messages"
 *   description="You don't have any messages yet"
 * />
 * ```
 *
 * @example With action button
 * ```tsx
 * <GlassEmptyState
 *   icon="🔍"
 *   title="No results found"
 *   description="Try adjusting your search"
 *   actionText="Clear filters"
 *   onAction={() => clearFilters()}
 * />
 * ```
 *
 * @example With custom icon
 * ```tsx
 * <GlassEmptyState
 *   iconComponent={<CustomIcon />}
 *   title="No data"
 *   description="Start by adding some items"
 * />
 * ```
 */
export function GlassEmptyState({
  icon,
  title,
  description,
  actionText,
  onAction,
  size = 'md',
  iconComponent,
}: GlassEmptyStateProps) {
  const sizeStyle = sizeConfig[size];

  return (
    <GlassCard
      variant="default"
      intensity={40}
      className={`items-center ${sizeStyle.container}`}
    >
      {/* Icon */}
      {iconComponent ? (
        <View className="mb-4">{iconComponent}</View>
      ) : icon ? (
        <Text className={`${sizeStyle.icon} mb-4`}>{icon}</Text>
      ) : null}

      {/* Title */}
      <Text
        className={`${sizeStyle.title} font-bold text-white text-center mb-2`}
      >
        {title}
      </Text>

      {/* Description */}
      {description && (
        <Text
          className={`${sizeStyle.description} text-gray-300 text-center mb-6`}
        >
          {description}
        </Text>
      )}

      {/* Action Button */}
      {actionText && onAction && (
        <GlassButton
          title={actionText}
          onPress={onAction}
          variant="primary"
          size="md"
        />
      )}
    </GlassCard>
  );
}

/**
 * Predefined empty state templates
 */

/** Empty state for no items */
export function GlassEmptyStateNoItems({
  itemName = 'items',
  onAdd,
}: {
  itemName?: string;
  onAdd?: () => void;
}) {
  return (
    <GlassEmptyState
      icon="📦"
      title={`No ${itemName}`}
      description={`You haven't added any ${itemName} yet`}
      actionText={`Add ${itemName}`}
      onAction={onAdd}
    />
  );
}

/** Empty state for no search results */
export function GlassEmptyStateNoResults({
  query,
  onClear,
}: {
  query?: string;
  onClear?: () => void;
}) {
  return (
    <GlassEmptyState
      icon="🔍"
      title="No results found"
      description={
        query
          ? `We couldn't find anything matching "${query}"`
          : 'Try adjusting your search or filters'
      }
      actionText="Clear search"
      onAction={onClear}
    />
  );
}

/** Empty state for error */
export function GlassEmptyStateError({
  error,
  onRetry,
}: {
  error?: string;
  onRetry?: () => void;
}) {
  return (
    <GlassEmptyState
      icon="⚠️"
      title="Something went wrong"
      description={error || 'An unexpected error occurred'}
      actionText="Try again"
      onAction={onRetry}
    />
  );
}

/** Empty state for offline */
export function GlassEmptyStateOffline({ onRetry }: { onRetry?: () => void }) {
  return (
    <GlassEmptyState
      icon="📡"
      title="No internet connection"
      description="Please check your connection and try again"
      actionText="Retry"
      onAction={onRetry}
    />
  );
}

/** Empty state for coming soon */
export function GlassEmptyStateComingSoon({ feature }: { feature?: string }) {
  return (
    <GlassEmptyState
      icon="🚀"
      title="Coming Soon"
      description={
        feature
          ? `${feature} will be available soon`
          : 'This feature is under development'
      }
      size="lg"
    />
  );
}
