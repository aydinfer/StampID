import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, Mask, Rect, G } from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  useSharedValue,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface StampMaskProps {
  size?: number;
  color?: string;
  backgroundColor?: string;
  animated?: boolean;
}

const AnimatedView = Animated.createAnimatedComponent(View);

/**
 * Stamp-shaped mask with classic perforated edges
 * Creates a postage stamp silhouette effect for camera overlay
 */
export function StampMask({
  size = 260,
  color = 'rgba(255, 255, 255, 0.9)',
  backgroundColor = 'rgba(0, 0, 0, 0.6)',
  animated = true,
}: StampMaskProps) {
  const opacity = useSharedValue(1);
  const scale = useSharedValue(1);

  useEffect(() => {
    if (animated) {
      // Subtle breathing animation
      opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );

      scale.value = withRepeat(
        withSequence(
          withTiming(1.02, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
    }
  }, [animated]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  // Generate perforated stamp border path
  const generateStampPath = (width: number, height: number): string => {
    const scallops = 12; // Number of scallops per side
    const scallopDepth = 8; // How deep the curves go
    const cornerRadius = 4;
    const margin = scallopDepth;

    const innerWidth = width - margin * 2;
    const innerHeight = height - margin * 2;
    const scallopWidthH = innerWidth / scallops;
    const scallopWidthV = innerHeight / scallops;

    let path = '';

    // Start at top-left after corner
    path += `M ${margin + cornerRadius} ${margin}`;

    // Top edge (scallops going right)
    for (let i = 0; i < scallops; i++) {
      const x = margin + scallopWidthH * i;
      const nextX = margin + scallopWidthH * (i + 1);
      const midX = (x + nextX) / 2;
      path += ` Q ${midX} ${margin - scallopDepth} ${nextX} ${margin}`;
    }

    // Top-right corner
    path += ` Q ${width - margin} ${margin} ${width - margin} ${margin + cornerRadius}`;

    // Right edge (scallops going down)
    for (let i = 0; i < scallops; i++) {
      const y = margin + scallopWidthV * i;
      const nextY = margin + scallopWidthV * (i + 1);
      const midY = (y + nextY) / 2;
      path += ` Q ${width - margin + scallopDepth} ${midY} ${width - margin} ${nextY}`;
    }

    // Bottom-right corner
    path += ` Q ${width - margin} ${height - margin} ${width - margin - cornerRadius} ${height - margin}`;

    // Bottom edge (scallops going left)
    for (let i = scallops; i > 0; i--) {
      const x = margin + scallopWidthH * i;
      const prevX = margin + scallopWidthH * (i - 1);
      const midX = (x + prevX) / 2;
      path += ` Q ${midX} ${height - margin + scallopDepth} ${prevX} ${height - margin}`;
    }

    // Bottom-left corner
    path += ` Q ${margin} ${height - margin} ${margin} ${height - margin - cornerRadius}`;

    // Left edge (scallops going up)
    for (let i = scallops; i > 0; i--) {
      const y = margin + scallopWidthV * i;
      const prevY = margin + scallopWidthV * (i - 1);
      const midY = (y + prevY) / 2;
      path += ` Q ${margin - scallopDepth} ${midY} ${margin} ${prevY}`;
    }

    // Close to top-left corner
    path += ` Q ${margin} ${margin} ${margin + cornerRadius} ${margin}`;
    path += ' Z';

    return path;
  };

  const stampPath = generateStampPath(size, size);

  return (
    <AnimatedView style={[styles.container, { width: size, height: size }, animated && animatedStyle]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <Mask id="stampMask">
            <Rect x="0" y="0" width={size} height={size} fill="white" />
            <Path d={stampPath} fill="black" />
          </Mask>
        </Defs>

        {/* Background with mask (darkens outside stamp area) */}
        <Rect
          x="0"
          y="0"
          width={size}
          height={size}
          fill={backgroundColor}
          mask="url(#stampMask)"
        />

        {/* Stamp border outline */}
        <Path
          d={stampPath}
          stroke={color}
          strokeWidth={2.5}
          fill="none"
        />
      </Svg>
    </AnimatedView>
  );
}

/**
 * Corner markers for additional visual guidance
 */
export function StampCorners({ size = 260, color = 'white' }: { size?: number; color?: string }) {
  const cornerSize = 20;
  const margin = 8;

  return (
    <View style={[styles.cornersContainer, { width: size, height: size }]}>
      {/* Top Left */}
      <View
        style={[
          styles.corner,
          styles.cornerTopLeft,
          { borderColor: color, top: margin, left: margin },
        ]}
      />
      {/* Top Right */}
      <View
        style={[
          styles.corner,
          styles.cornerTopRight,
          { borderColor: color, top: margin, right: margin },
        ]}
      />
      {/* Bottom Left */}
      <View
        style={[
          styles.corner,
          styles.cornerBottomLeft,
          { borderColor: color, bottom: margin, left: margin },
        ]}
      />
      {/* Bottom Right */}
      <View
        style={[
          styles.corner,
          styles.cornerBottomRight,
          { borderColor: color, bottom: margin, right: margin },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornersContainer: {
    position: 'absolute',
  },
  corner: {
    position: 'absolute',
    width: 24,
    height: 24,
  },
  cornerTopLeft: {
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderTopLeftRadius: 8,
  },
  cornerTopRight: {
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderTopRightRadius: 8,
  },
  cornerBottomLeft: {
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderBottomLeftRadius: 8,
  },
  cornerBottomRight: {
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderBottomRightRadius: 8,
  },
});

export default StampMask;
