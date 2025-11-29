# Components Guide

How to build reusable UI components with NativeWind and best practices.

## Component Philosophy

**Keep components:**

- Small and focused (one responsibility)
- Reusable across screens
- Well-typed with TypeScript
- Styled with NativeWind classes

## Directory Structure

```
components/
├── ui/              # Basic UI elements (Button, Input, Card)
├── common/          # Common patterns (Loading, EmptyState, ErrorBoundary)
└── features/        # Feature-specific components
```

## Creating a Button Component

### Basic Button

```tsx
// components/ui/Button.tsx
import { Pressable, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg items-center justify-center';

  const variantStyles = {
    primary: 'bg-primary-600 active:bg-primary-700',
    secondary: 'bg-gray-600 active:bg-gray-700',
    outline: 'border-2 border-primary-600 active:bg-primary-50',
  };

  const textStyles = {
    primary: 'text-white font-semibold',
    secondary: 'text-white font-semibold',
    outline: 'text-primary-600 font-semibold',
  };

  return (
    <Pressable
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? 'opacity-50' : ''}`}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563eb' : '#fff'} />
      ) : (
        <Text className={textStyles[variant]}>{title}</Text>
      )}
    </Pressable>
  );
}
```

### Usage

```tsx
import { Button } from '@/components/ui/Button';

<Button title="Sign In" onPress={handleSignIn} />
<Button title="Cancel" variant="outline" onPress={handleCancel} />
<Button title="Saving..." variant="primary" loading />
```

## Card Component

```tsx
// components/ui/Card.tsx
import { View, ViewProps } from 'react-native';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated';
}

export function Card({ children, variant = 'default', ...props }: CardProps) {
  const baseStyles = 'bg-white dark:bg-gray-800 rounded-xl p-4';

  const variantStyles = {
    default: 'border border-gray-200 dark:border-gray-700',
    elevated: '', // Add shadow in style prop for iOS/Android
  };

  return (
    <View className={`${baseStyles} ${variantStyles[variant]}`} {...props}>
      {children}
    </View>
  );
}
```

## Input Component

```tsx
// components/ui/Input.tsx
import { TextInput, Text, View, TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</Text>
      )}
      <TextInput
        className={`
          bg-gray-50 dark:bg-gray-800
          border rounded-lg px-4 py-3
          text-gray-900 dark:text-white
          ${error ? 'border-error-500' : isFocused ? 'border-primary-500' : 'border-gray-300 dark:border-gray-700'}
        `}
        placeholderTextColor="#9ca3af"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text className="text-error-600 text-sm mt-1">{error}</Text>}
    </View>
  );
}
```

## Loading Component

```tsx
// components/common/Loading.tsx
import { View, ActivityIndicator, Text } from 'react-native';

interface LoadingProps {
  message?: string;
}

export function Loading({ message = 'Loading...' }: LoadingProps) {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <ActivityIndicator size="large" color="#2563eb" />
      <Text className="text-gray-600 dark:text-gray-400 mt-4">{message}</Text>
    </View>
  );
}
```

## Empty State Component

```tsx
// components/common/EmptyState.tsx
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center p-6">
      <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{title}</Text>
      <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">{description}</Text>
      {actionLabel && onAction && <Button title={actionLabel} onPress={onAction} />}
    </View>
  );
}
```

## Error Boundary

```tsx
// components/common/ErrorBoundary.tsx
import React from 'react';
import { View, Text } from 'react-native';
import { Button } from '@/components/ui/Button';

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="flex-1 items-center justify-center p-6 bg-white dark:bg-gray-900">
          <Text className="text-2xl font-bold text-error-600 mb-2">Oops! Something went wrong</Text>
          <Text className="text-gray-600 dark:text-gray-400 text-center mb-6">
            We're sorry for the inconvenience. Please try again.
          </Text>
          <Button title="Reload App" onPress={() => this.setState({ hasError: false })} />
        </View>
      );
    }

    return this.props.children;
  }
}
```

## List Item Component

```tsx
// components/ui/ListItem.tsx
import { Pressable, Text, View } from 'react-native';

interface ListItemProps {
  title: string;
  subtitle?: string;
  onPress?: () => void;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export function ListItem({ title, subtitle, onPress, leftIcon, rightIcon }: ListItemProps) {
  return (
    <Pressable
      className="flex-row items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 active:bg-gray-50 dark:active:bg-gray-700"
      onPress={onPress}
    >
      {leftIcon && <View className="mr-3">{leftIcon}</View>}

      <View className="flex-1">
        <Text className="text-base font-medium text-gray-900 dark:text-white">{title}</Text>
        {subtitle && (
          <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">{subtitle}</Text>
        )}
      </View>

      {rightIcon && <View className="ml-3">{rightIcon}</View>}
    </Pressable>
  );
}
```

## Avatar Component

```tsx
// components/ui/Avatar.tsx
import { View, Image, Text } from 'react-native';

interface AvatarProps {
  imageUrl?: string;
  name: string;
  size?: 'small' | 'medium' | 'large';
}

export function Avatar({ imageUrl, name, size = 'medium' }: AvatarProps) {
  const sizes = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-xl',
  };

  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  if (imageUrl) {
    return <Image source={{ uri: imageUrl }} className={`${sizes[size]} rounded-full`} />;
  }

  return (
    <View className={`${sizes[size]} rounded-full bg-primary-500 items-center justify-center`}>
      <Text className="text-white font-bold">{initials}</Text>
    </View>
  );
}
```

## Best Practices

### 1. Type Everything

```tsx
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
}

// ❌ Bad
function Button(props: any) {}
```

### 2. Use Composition

```tsx
// ✅ Good - Composable
<Card>
  <Text>Title</Text>
  <Text>Description</Text>
</Card>

// ❌ Bad - Too many props
<Card title="Title" description="Description" />
```

### 3. Variants Over Props

```tsx
// ✅ Good
<Button variant="primary" />
<Button variant="outline" />

// ❌ Bad
<Button isPrimary />
<Button isOutline />
```

### 4. Forward Props

```tsx
// ✅ Good - Accepts all TextInput props
interface InputProps extends TextInputProps {
  label?: string;
}

export function Input({ label, ...props }: InputProps) {
  return <TextInput {...props} />;
}
```

### 5. Conditional Styling

```tsx
// ✅ Good - Template literals
className={`base-styles ${isActive ? 'active-styles' : 'inactive-styles'}`}

// ❌ Bad - Ternary hell
className={isActive ? 'base-styles active-styles' : 'base-styles inactive-styles'}
```

## Component Organization

```tsx
// Standard component structure:

// 1. Imports
import { View, Text } from 'react-native';
import { useState } from 'react';

// 2. Types
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // 4. Hooks
  const [state, setState] = useState(false);

  // 5. Handlers
  const handlePress = () => {
    setState(true);
  };

  // 6. Render
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}
```

## Testing Components

```tsx
// MyComponent.test.tsx
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from './Button';

describe('Button', () => {
  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button title="Press me" onPress={onPress} />);

    fireEvent.press(getByText('Press me'));
    expect(onPress).toHaveBeenCalled();
  });
});
```

## Next Steps

- Read [Animations](./05-animations.md) to add smooth interactions
- Check [Design System](./03-design-system.md) for styling patterns
