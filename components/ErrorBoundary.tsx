/**
 * Error Boundary Component
 *
 * Catches JavaScript errors anywhere in the component tree and displays a fallback UI.
 * Based on React Error Boundaries: https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */

import React, { Component, ReactNode } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: (error: Error, errorInfo: React.ErrorInfo, retry: () => void) => ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

/**
 * Error Boundary Component
 *
 * @example
 * ```tsx
 * <ErrorBoundary>
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 *
 * @example Custom fallback
 * ```tsx
 * <ErrorBoundary
 *   fallback={(error, errorInfo, retry) => (
 *     <CustomErrorScreen error={error} onRetry={retry} />
 *   )}
 *   onError={(error, errorInfo) => {
 *     // Log to error reporting service
 *     console.error('Error caught:', error, errorInfo);
 *   }}
 * >
 *   <YourApp />
 * </ErrorBoundary>
 * ```
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console in development
    if (__DEV__) {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }

    // Update state with error info
    this.setState({
      error,
      errorInfo,
    });

    // Call optional error handler
    this.props.onError?.(error, errorInfo);
  }

  retry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback(this.state.error!, this.state.errorInfo!, this.retry);
      }

      // Default fallback UI
      return (
        <SafeAreaView className="flex-1 bg-gray-900">
          <View className="flex-1 justify-center items-center px-6">
            {/* Error Icon */}
            <View className="w-20 h-20 bg-red-500/20 rounded-full items-center justify-center mb-6">
              <Text className="text-red-500 text-4xl">⚠️</Text>
            </View>

            {/* Error Title */}
            <Text className="text-white text-2xl font-bold mb-2 text-center">
              Something went wrong
            </Text>

            {/* Error Message */}
            <Text className="text-gray-400 text-base text-center mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </Text>

            {/* Retry Button */}
            <Pressable
              onPress={this.retry}
              className="bg-primary-500 px-8 py-4 rounded-xl active:bg-primary-600 mb-4"
            >
              <Text className="text-white text-base font-semibold">Try Again</Text>
            </Pressable>

            {/* Dev Error Details */}
            {__DEV__ && this.state.error && (
              <ScrollView className="w-full mt-6 max-h-64 bg-gray-800 rounded-lg p-4">
                <Text className="text-red-400 text-xs font-mono mb-2">Error Stack:</Text>
                <Text className="text-gray-300 text-xs font-mono">{this.state.error.stack}</Text>
                {this.state.errorInfo && (
                  <>
                    <Text className="text-red-400 text-xs font-mono mt-4 mb-2">
                      Component Stack:
                    </Text>
                    <Text className="text-gray-300 text-xs font-mono">
                      {this.state.errorInfo.componentStack}
                    </Text>
                  </>
                )}
              </ScrollView>
            )}
          </View>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

/**
 * Functional component wrapper for easier use
 */
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name || 'Component'})`;

  return WrappedComponent;
}
