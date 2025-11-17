/**
 * Format Utilities
 *
 * Helper functions for formatting currency, dates, phone numbers, and other data types.
 * All functions handle edge cases and return fallback values for invalid inputs.
 */

/**
 * Currency formatting options
 */
export interface CurrencyFormatOptions {
  locale?: string;
  currency?: string;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
}

/**
 * Date formatting options
 */
export interface DateFormatOptions {
  locale?: string;
  dateStyle?: 'full' | 'long' | 'medium' | 'short';
  timeStyle?: 'full' | 'long' | 'medium' | 'short';
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
}

/**
 * Format a number as currency
 *
 * @example
 * formatCurrency(1234.56) // "$1,234.56"
 * formatCurrency(1234.56, { currency: 'EUR', locale: 'de-DE' }) // "1.234,56 €"
 * formatCurrency(1234, { minimumFractionDigits: 0 }) // "$1,234"
 */
export function formatCurrency(
  amount: number,
  options: CurrencyFormatOptions = {}
): string {
  const {
    locale = 'en-US',
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
  } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(amount);
  } catch (error) {
    // Fallback to simple formatting
    return `$${amount.toFixed(2)}`;
  }
}

/**
 * Format a date or timestamp
 *
 * @example
 * formatDate(new Date()) // "Nov 17, 2025"
 * formatDate(new Date(), { dateStyle: 'full' }) // "Monday, November 17, 2025"
 * formatDate(new Date(), { dateStyle: 'short', timeStyle: 'short' }) // "11/17/25, 2:30 PM"
 * formatDate('2025-11-17') // "Nov 17, 2025"
 */
export function formatDate(
  date: Date | string | number,
  options: DateFormatOptions = {}
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const { locale = 'en-US', ...formatOptions } = options;

    // Default to medium date style if no options provided
    const defaultOptions = Object.keys(formatOptions).length === 0
      ? { dateStyle: 'medium' as const }
      : formatOptions;

    return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 3600000)) // "1 hour ago"
 * formatRelativeTime(new Date(Date.now() + 86400000)) // "in 1 day"
 * formatRelativeTime(new Date(Date.now() - 60000)) // "1 minute ago"
 */
export function formatRelativeTime(
  date: Date | string | number,
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return 'Invalid date';
    }

    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

    const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });

    // Future dates
    if (diffInSeconds < 0) {
      const absDiff = Math.abs(diffInSeconds);
      if (absDiff < 60) return rtf.format(Math.ceil(-diffInSeconds), 'second');
      if (absDiff < 3600) return rtf.format(Math.ceil(-diffInSeconds / 60), 'minute');
      if (absDiff < 86400) return rtf.format(Math.ceil(-diffInSeconds / 3600), 'hour');
      if (absDiff < 2592000) return rtf.format(Math.ceil(-diffInSeconds / 86400), 'day');
      if (absDiff < 31536000) return rtf.format(Math.ceil(-diffInSeconds / 2592000), 'month');
      return rtf.format(Math.ceil(-diffInSeconds / 31536000), 'year');
    }

    // Past dates
    if (diffInSeconds < 60) return rtf.format(-diffInSeconds, 'second');
    if (diffInSeconds < 3600) return rtf.format(-Math.floor(diffInSeconds / 60), 'minute');
    if (diffInSeconds < 86400) return rtf.format(-Math.floor(diffInSeconds / 3600), 'hour');
    if (diffInSeconds < 2592000) return rtf.format(-Math.floor(diffInSeconds / 86400), 'day');
    if (diffInSeconds < 31536000) return rtf.format(-Math.floor(diffInSeconds / 2592000), 'month');
    return rtf.format(-Math.floor(diffInSeconds / 31536000), 'year');
  } catch (error) {
    return 'Invalid date';
  }
}

/**
 * Format a phone number (US format)
 *
 * @example
 * formatPhone('1234567890') // "(123) 456-7890"
 * formatPhone('123-456-7890') // "(123) 456-7890"
 * formatPhone('+11234567890') // "+1 (123) 456-7890"
 */
export function formatPhone(phone: string): string {
  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  // US phone number with country code
  if (digitsOnly.length === 11 && digitsOnly.startsWith('1')) {
    return `+1 (${digitsOnly.slice(1, 4)}) ${digitsOnly.slice(4, 7)}-${digitsOnly.slice(7)}`;
  }

  // US phone number without country code
  if (digitsOnly.length === 10) {
    return `(${digitsOnly.slice(0, 3)}) ${digitsOnly.slice(3, 6)}-${digitsOnly.slice(6)}`;
  }

  // Return original if format is unrecognized
  return phone;
}

/**
 * Format a number with thousand separators
 *
 * @example
 * formatNumber(1234567.89) // "1,234,567.89"
 * formatNumber(1234567, { locale: 'de-DE' }) // "1.234.567"
 * formatNumber(1234.5, { minimumFractionDigits: 2 }) // "1,234.50"
 */
export function formatNumber(
  num: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { locale = 'en-US', ...formatOptions } = options;

  try {
    return new Intl.NumberFormat(locale, formatOptions).format(num);
  } catch (error) {
    return num.toString();
  }
}

/**
 * Format a number as a percentage
 *
 * @example
 * formatPercent(0.1234) // "12.34%"
 * formatPercent(0.5) // "50%"
 * formatPercent(0.1234, { minimumFractionDigits: 0 }) // "12%"
 */
export function formatPercent(
  value: number,
  options: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  } = {}
): string {
  const { locale = 'en-US', minimumFractionDigits = 0, maximumFractionDigits = 2 } = options;

  try {
    return new Intl.NumberFormat(locale, {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits,
    }).format(value);
  } catch (error) {
    return `${(value * 100).toFixed(2)}%`;
  }
}

/**
 * Format file size in human-readable format
 *
 * @example
 * formatFileSize(1024) // "1 KB"
 * formatFileSize(1536) // "1.5 KB"
 * formatFileSize(1048576) // "1 MB"
 * formatFileSize(1073741824) // "1 GB"
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format a duration in milliseconds to human-readable format
 *
 * @example
 * formatDuration(1000) // "1 second"
 * formatDuration(65000) // "1 minute 5 seconds"
 * formatDuration(3665000) // "1 hour 1 minute"
 */
export function formatDuration(milliseconds: number): string {
  const seconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) {
    const remainingHours = hours % 24;
    return remainingHours > 0
      ? `${days} ${days === 1 ? 'day' : 'days'} ${remainingHours} ${remainingHours === 1 ? 'hour' : 'hours'}`
      : `${days} ${days === 1 ? 'day' : 'days'}`;
  }

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0
      ? `${hours} ${hours === 1 ? 'hour' : 'hours'} ${remainingMinutes} ${remainingMinutes === 1 ? 'minute' : 'minutes'}`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  }

  if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return remainingSeconds > 0
      ? `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ${remainingSeconds} ${remainingSeconds === 1 ? 'second' : 'seconds'}`
      : `${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`;
  }

  return `${seconds} ${seconds === 1 ? 'second' : 'seconds'}`;
}

/**
 * Truncate text with ellipsis
 *
 * @example
 * truncate('Hello World', 5) // "Hello..."
 * truncate('Hello', 10) // "Hello"
 * truncate('Hello World', 8, { ellipsis: '…' }) // "Hello Wo…"
 */
export function truncate(
  text: string,
  maxLength: number,
  options: { ellipsis?: string } = {}
): string {
  const { ellipsis = '...' } = options;

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * Capitalize first letter of each word
 *
 * @example
 * capitalize('hello world') // "Hello World"
 * capitalize('HELLO WORLD') // "Hello World"
 */
export function capitalize(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Format initials from a name
 *
 * @example
 * formatInitials('John Doe') // "JD"
 * formatInitials('John Michael Doe', { maxLength: 3 }) // "JMD"
 * formatInitials('john doe') // "JD"
 */
export function formatInitials(
  name: string,
  options: { maxLength?: number } = {}
): string {
  const { maxLength = 2 } = options;

  const words = name.trim().split(/\s+/);
  const initials = words
    .slice(0, maxLength)
    .map((word) => word.charAt(0).toUpperCase())
    .join('');

  return initials;
}

/**
 * Format a credit card number with spaces
 *
 * @example
 * formatCreditCard('1234567890123456') // "1234 5678 9012 3456"
 * formatCreditCard('1234-5678-9012-3456') // "1234 5678 9012 3456"
 */
export function formatCreditCard(cardNumber: string): string {
  // Remove all non-digit characters
  const digitsOnly = cardNumber.replace(/\D/g, '');

  // Add space every 4 digits
  return digitsOnly.replace(/(\d{4})/g, '$1 ').trim();
}

/**
 * Mask sensitive data (e.g., credit card numbers, SSN)
 *
 * @example
 * maskSensitiveData('1234567890123456') // "************3456"
 * maskSensitiveData('1234567890', { visibleChars: 2 }) // "********90"
 * maskSensitiveData('secret', { maskChar: '#' }) // "##cret"
 */
export function maskSensitiveData(
  data: string,
  options: { visibleChars?: number; maskChar?: string } = {}
): string {
  const { visibleChars = 4, maskChar = '*' } = options;

  if (data.length <= visibleChars) {
    return data;
  }

  const masked = maskChar.repeat(data.length - visibleChars);
  const visible = data.slice(-visibleChars);

  return masked + visible;
}
