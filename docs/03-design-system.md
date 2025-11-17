# Design System

How to customize and use the design system powered by Tailwind CSS + NativeWind.

## Overview

This starter uses **Tailwind CSS** for the design language and **NativeWind** to make it work in React Native.

**Single source of truth**: [tailwind.config.js](../tailwind.config.js)

## How It Works

```
You write:        className="bg-primary-500 p-4 rounded-xl"
                           ↓
NativeWind converts to:   style={{ backgroundColor: '#3b82f6', padding: 16, borderRadius: 12 }}
```

## Color Palette

### Using Colors in Components

**Preferred way** - Use NativeWind classes:
```tsx
<View className="bg-primary-500">
  <Text className="text-white">Hello</Text>
</View>
```

**For native components** - Use color exports:
```tsx
import { colors } from '@/lib/utils/colors';

<Tabs screenOptions={{
  tabBarActiveTintColor: colors.primary[600]
}} />
```

### Available Color Scales

Each color has shades from 50 (lightest) to 950 (darkest):

**Primary** (Blue) - Main brand color
```tsx
className="bg-primary-500"    // #3b82f6
className="bg-primary-600"    // #2563eb
className="bg-primary-700"    // #1d4ed8
```

**Success** (Green) - Positive actions
```tsx
className="bg-success-500"    // #10b981
className="text-success-700"  // #15803d
```

**Warning** (Yellow) - Caution states
```tsx
className="bg-warning-500"    // #f59e0b
className="border-warning-600" // #d97706
```

**Error** (Red) - Errors and destructive actions
```tsx
className="bg-error-500"      // #ef4444
className="text-error-700"    // #b91c1c
```

**Gray** - Neutral colors
```tsx
className="bg-gray-50"        // Very light background
className="text-gray-900"     // Almost black text
```

## Customizing Colors

Edit [tailwind.config.js](../tailwind.config.js):

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',   // Change these to your brand colors
          100: '#e0f2fe',
          // ... rest of scale
        },
      },
    },
  },
}
```

**Important**: After changing colors in tailwind.config.js, also update [lib/utils/colors.ts](../lib/utils/colors.ts) to match.

## Dark Mode

NativeWind supports dark mode with the `dark:` prefix:

```tsx
<View className="bg-white dark:bg-gray-900">
  <Text className="text-gray-900 dark:text-white">
    Adapts to system theme
  </Text>
</View>
```

## Spacing

Tailwind uses a consistent spacing scale (4px increments):

```tsx
// Padding
className="p-4"      // 16px all sides
className="px-6"     // 24px horizontal
className="py-2"     // 8px vertical

// Margin
className="m-4"      // 16px all sides
className="mt-6"     // 24px top
className="mb-8"     // 32px bottom

// Gap (for flex/grid)
className="gap-4"    // 16px gap between children
```

**Scale reference**:
- `1` = 4px
- `2` = 8px
- `3` = 12px
- `4` = 16px
- `6` = 24px
- `8` = 32px
- `12` = 48px
- `16` = 64px

## Typography

### Font Sizes
```tsx
className="text-xs"      // 12px
className="text-sm"      // 14px
className="text-base"    // 16px (default)
className="text-lg"      // 18px
className="text-xl"      // 20px
className="text-2xl"     // 24px
className="text-3xl"     // 30px
```

### Font Weights
```tsx
className="font-normal"  // 400
className="font-medium"  // 500
className="font-semibold" // 600
className="font-bold"    // 700
```

### Text Colors
```tsx
className="text-gray-900"          // Main text
className="text-gray-600"          // Secondary text
className="text-primary-600"       // Brand colored text
className="text-error-600"         // Error text
```

## Border Radius

```tsx
className="rounded"       // 4px
className="rounded-md"    // 6px
className="rounded-lg"    // 8px
className="rounded-xl"    // 12px
className="rounded-2xl"   // 16px
className="rounded-full"  // 9999px (perfect circle)
```

## Shadows

NativeWind doesn't support box-shadow directly. Use the `elevation` utility for Android and `shadow` for iOS:

```tsx
// React Native elevation (Android)
style={{ elevation: 4 }}

// iOS shadow (manual)
style={{
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
}}
```

Or create a reusable component with proper shadows.

## Layout Utilities

### Flexbox
```tsx
className="flex flex-row"           // Row direction
className="flex flex-col"           // Column direction
className="items-center"            // Vertical center
className="justify-center"          // Horizontal center
className="justify-between"         // Space between
className="gap-4"                   // Gap between items
```

### Sizes
```tsx
className="w-full"                  // 100% width
className="h-screen"                // Full screen height
className="w-24"                    // 96px width
className="min-h-screen"            // Minimum full height
```

## Common Patterns

### Card Component
```tsx
<View className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
  <Text className="text-lg font-semibold text-gray-900 dark:text-white">
    Card Title
  </Text>
  <Text className="text-gray-600 dark:text-gray-400 mt-2">
    Card content
  </Text>
</View>
```

### Button
```tsx
<Pressable className="bg-primary-600 px-6 py-3 rounded-lg active:bg-primary-700">
  <Text className="text-white font-semibold text-center">
    Press Me
  </Text>
</Pressable>
```

### Input Field
```tsx
<TextInput
  className="bg-gray-50 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-4 py-3 text-gray-900 dark:text-white"
  placeholderTextColor="#9ca3af"
  placeholder="Enter text"
/>
```

## Creating Custom Utilities

Add custom utilities in tailwind.config.js:

```javascript
module.exports = {
  theme: {
    extend: {
      spacing: {
        '18': '72px',  // Custom spacing value
      },
      fontSize: {
        '4xl': '36px', // Custom font size
      },
    },
  },
}
```

## Best Practices

1. **Use design tokens**: Always use Tailwind classes, never hardcode colors
2. **Be consistent**: Stick to the spacing scale
3. **Dark mode first**: Always add dark mode variants
4. **Semantic naming**: Use success/error/warning for their intended purpose
5. **Test on both platforms**: Some utilities behave differently on iOS vs Android

## Performance Tips

NativeWind processes classes at build time, so there's no runtime performance cost. Use as many utilities as you need without worrying about performance.

## Next Steps

- Read [Components Guide](./04-components.md) to build reusable UI
- Check [Animations](./05-animations.md) for smooth interactions
