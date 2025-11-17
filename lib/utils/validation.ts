/**
 * Validation Utilities
 *
 * Comprehensive validation functions for forms and user input
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Email validation with comprehensive regex
 */
export function validateEmail(email: string): ValidationResult {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

/**
 * Password validation with security requirements
 */
export function validatePassword(password: string): ValidationResult {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters' };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  // Check for at least one lowercase letter
  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  // Check for at least one number
  if (!/\d/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  return { isValid: true };
}

/**
 * Simple password validation (for less strict requirements)
 */
export function validatePasswordSimple(password: string, minLength: number = 6): ValidationResult {
  if (!password || password.trim() === '') {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < minLength) {
    return { isValid: false, error: `Password must be at least ${minLength} characters` };
  }

  return { isValid: true };
}

/**
 * Password confirmation validation
 */
export function validatePasswordMatch(password: string, confirmPassword: string): ValidationResult {
  if (!confirmPassword || confirmPassword.trim() === '') {
    return { isValid: false, error: 'Please confirm your password' };
  }

  if (password !== confirmPassword) {
    return { isValid: false, error: 'Passwords do not match' };
  }

  return { isValid: true };
}

/**
 * Name validation
 */
export function validateName(name: string, fieldName: string = 'Name'): ValidationResult {
  if (!name || name.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (name.trim().length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }

  if (name.trim().length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }

  return { isValid: true };
}

/**
 * Phone number validation (basic)
 */
export function validatePhone(phone: string): ValidationResult {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Phone number is required' };
  }

  // Remove all non-digit characters
  const digitsOnly = phone.replace(/\D/g, '');

  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

/**
 * Username validation
 */
export function validateUsername(username: string): ValidationResult {
  if (!username || username.trim() === '') {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must be less than 20 characters' };
  }

  // Only allow alphanumeric, underscore, and hyphen
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  return { isValid: true };
}

/**
 * URL validation
 */
export function validateURL(url: string): ValidationResult {
  if (!url || url.trim() === '') {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
}

/**
 * Required field validation
 */
export function validateRequired(value: string, fieldName: string = 'This field'): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
}

/**
 * Minimum length validation
 */
export function validateMinLength(value: string, minLength: number, fieldName: string = 'This field'): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters` };
  }

  return { isValid: true };
}

/**
 * Maximum length validation
 */
export function validateMaxLength(value: string, maxLength: number, fieldName: string = 'This field'): ValidationResult {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must be less than ${maxLength} characters` };
  }

  return { isValid: true };
}

/**
 * Numeric validation
 */
export function validateNumeric(value: string, fieldName: string = 'This field'): ValidationResult {
  if (!value || value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!/^\d+$/.test(value)) {
    return { isValid: false, error: `${fieldName} must be a number` };
  }

  return { isValid: true };
}

/**
 * Age validation
 */
export function validateAge(age: number | string, minAge: number = 13): ValidationResult {
  const ageNum = typeof age === 'string' ? parseInt(age, 10) : age;

  if (isNaN(ageNum)) {
    return { isValid: false, error: 'Please enter a valid age' };
  }

  if (ageNum < minAge) {
    return { isValid: false, error: `You must be at least ${minAge} years old` };
  }

  if (ageNum > 120) {
    return { isValid: false, error: 'Please enter a valid age' };
  }

  return { isValid: true };
}

/**
 * Credit card validation (Luhn algorithm)
 */
export function validateCreditCard(cardNumber: string): ValidationResult {
  if (!cardNumber || cardNumber.trim() === '') {
    return { isValid: false, error: 'Card number is required' };
  }

  // Remove spaces and dashes
  const cleaned = cardNumber.replace(/[\s-]/g, '');

  // Check if it contains only digits
  if (!/^\d+$/.test(cleaned)) {
    return { isValid: false, error: 'Card number must contain only digits' };
  }

  // Check length (most cards are 13-19 digits)
  if (cleaned.length < 13 || cleaned.length > 19) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Please enter a valid card number' };
  }

  return { isValid: true };
}

/**
 * Date validation
 */
export function validateDate(date: string): ValidationResult {
  if (!date || date.trim() === '') {
    return { isValid: false, error: 'Date is required' };
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    return { isValid: false, error: 'Please enter a valid date' };
  }

  return { isValid: true };
}

/**
 * Postal code validation (US)
 */
export function validatePostalCodeUS(postalCode: string): ValidationResult {
  if (!postalCode || postalCode.trim() === '') {
    return { isValid: false, error: 'Postal code is required' };
  }

  // US zip code: 5 digits or 5+4 format
  if (!/^\d{5}(-\d{4})?$/.test(postalCode)) {
    return { isValid: false, error: 'Please enter a valid US postal code' };
  }

  return { isValid: true };
}
