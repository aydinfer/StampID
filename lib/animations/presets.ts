/**
 * Animation Presets using React Native Reanimated
 *
 * Based on official Reanimated documentation:
 * https://docs.swmansion.com/react-native-reanimated/
 */

import { withTiming, withSpring, withDelay, Easing } from 'react-native-reanimated';
import type { WithTimingConfig, WithSpringConfig } from 'react-native-reanimated';

/**
 * Timing configurations for consistent animations
 */
export const timingConfig = {
  fast: { duration: 200, easing: Easing.out(Easing.cubic) } as WithTimingConfig,
  normal: { duration: 300, easing: Easing.out(Easing.cubic) } as WithTimingConfig,
  slow: { duration: 500, easing: Easing.out(Easing.cubic) } as WithTimingConfig,
  smooth: { duration: 400, easing: Easing.bezier(0.25, 0.1, 0.25, 1) } as WithTimingConfig,
};

/**
 * Spring configurations for physics-based animations
 */
export const springConfig = {
  gentle: { damping: 20, stiffness: 90 } as WithSpringConfig,
  normal: { damping: 15, stiffness: 150 } as WithSpringConfig,
  bouncy: { damping: 10, stiffness: 200 } as WithSpringConfig,
  snappy: { damping: 25, stiffness: 300 } as WithSpringConfig,
};

/**
 * Fade in animation preset
 */
export const fadeIn = (duration: number = 300, delay: number = 0) => {
  'worklet';
  return withDelay(
    delay,
    withTiming(1, { duration, easing: Easing.out(Easing.ease) })
  );
};

/**
 * Fade out animation preset
 */
export const fadeOut = (duration: number = 300, delay: number = 0) => {
  'worklet';
  return withDelay(
    delay,
    withTiming(0, { duration, easing: Easing.in(Easing.ease) })
  );
};

/**
 * Slide in from right animation
 */
export const slideInRight = (distance: number = 300, duration: number = 300) => {
  'worklet';
  return withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
};

/**
 * Slide in from left animation
 */
export const slideInLeft = (distance: number = 300, duration: number = 300) => {
  'worklet';
  return withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
};

/**
 * Slide in from bottom animation
 */
export const slideInBottom = (distance: number = 300, duration: number = 300) => {
  'worklet';
  return withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
};

/**
 * Slide in from top animation
 */
export const slideInTop = (distance: number = 300, duration: number = 300) => {
  'worklet';
  return withTiming(0, { duration, easing: Easing.out(Easing.cubic) });
};

/**
 * Scale in animation preset
 */
export const scaleIn = (duration: number = 300, delay: number = 0) => {
  'worklet';
  return withDelay(
    delay,
    withSpring(1, springConfig.gentle)
  );
};

/**
 * Scale out animation preset
 */
export const scaleOut = (duration: number = 300, delay: number = 0) => {
  'worklet';
  return withDelay(
    delay,
    withTiming(0, { duration, easing: Easing.in(Easing.ease) })
  );
};

/**
 * Bounce animation preset
 */
export const bounce = () => {
  'worklet';
  return withSpring(1, springConfig.bouncy);
};

/**
 * Shake animation sequence (use with sequence from reanimated)
 */
export const shakeValues = [-10, 10, -10, 10, -5, 5, 0];

/**
 * Pulse animation (scale up and down)
 */
export const pulse = (scale: number = 1.1, duration: number = 600) => {
  'worklet';
  return withTiming(scale, {
    duration: duration / 2,
    easing: Easing.inOut(Easing.ease),
  });
};

/**
 * Rotate animation (360 degrees)
 */
export const rotate360 = (duration: number = 1000) => {
  'worklet';
  return withTiming(360, {
    duration,
    easing: Easing.linear,
  });
};

/**
 * Elastic entrance animation
 */
export const elasticIn = () => {
  'worklet';
  return withSpring(0, {
    damping: 8,
    stiffness: 100,
    mass: 0.5,
  });
};

/**
 * Smooth entrance animation
 */
export const smoothEnter = (delay: number = 0) => {
  'worklet';
  return withDelay(delay, withTiming(0, timingConfig.smooth));
};

/**
 * Quick exit animation
 */
export const quickExit = () => {
  'worklet';
  return withTiming(0, timingConfig.fast);
};

/**
 * Stagger delay calculator for list animations
 */
export const staggerDelay = (index: number, baseDelay: number = 50) => {
  return index * baseDelay;
};

/**
 * Common animation durations (in milliseconds)
 */
export const durations = {
  instant: 0,
  fast: 200,
  normal: 300,
  slow: 500,
  verySlow: 800,
};

/**
 * Common easing functions
 */
export const easings = {
  linear: Easing.linear,
  easeIn: Easing.in(Easing.ease),
  easeOut: Easing.out(Easing.ease),
  easeInOut: Easing.inOut(Easing.ease),
  cubic: Easing.bezier(0.4, 0.0, 0.2, 1),
  sharp: Easing.bezier(0.4, 0.0, 0.6, 1),
  standard: Easing.bezier(0.4, 0.0, 0.2, 1),
  emphasized: Easing.bezier(0.0, 0.0, 0.2, 1),
};
