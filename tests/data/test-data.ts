/**
 * Centralized test data for walk-in bath form tests
 * This file contains all test data to avoid hardcoding values across the project
 */

export const testData = {
  valid: {
    zipCode: '48104',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '5551234567',
  },
  invalid: {
    zipCode: {
      tooShort: '1234', // Less than 5 digits
      tooLong: '123456', // More than 5 digits
    },
    email: {
      missingAt: 'invalid.email.com', // Missing @ symbol
      missingDomain: 'invalid-email@', // Missing domain
      missingTld: 'invalid-email@domain', // Missing TLD
    },
    phone: {
      tooShort: '555123456', // 9 digits (less than 10)
      // Note: Phone input automatically truncates to 10 digits, so "too long" case is not testable
    },
  },
} as const;

export const zipCodeTestCases = [
  {
    zipCode: testData.valid.zipCode,
    description: 'valid (5 digits)',
    shouldProceed: true,
  },
  {
    zipCode: testData.invalid.zipCode.tooShort,
    description: 'too short (4 digits)',
    shouldProceed: false,
  },
  {
    zipCode: testData.invalid.zipCode.tooLong,
    description: 'too long (6 digits)',
    shouldProceed: false,
  },
];

export const emailTestCases = [
  {
    email: testData.valid.email,
    description: 'valid format',
    shouldProceed: true,
  },
  {
    email: testData.invalid.email.missingAt,
    description: 'missing @ symbol',
    shouldProceed: false,
  },
  {
    email: testData.invalid.email.missingDomain,
    description: 'missing domain',
    shouldProceed: false,
  },
  {
    email: testData.invalid.email.missingTld,
    description: 'missing TLD',
    shouldProceed: false,
  },
];

/**
 * Phone validation test cases
 * Note: "too long" case is not testable - phone input automatically truncates to 10 digits
 */
export const phoneTestCases = [
  {
    phone: testData.valid.phone,
    description: 'valid (10 digits)',
    shouldProceed: true,
  },
  {
    phone: testData.invalid.phone.tooShort,
    description: 'too short (9 digits)',
    shouldProceed: false,
  },
];

/**
 * Name validation test cases
 */
export const nameTestCases = [
  {
    name: '', // Empty
    description: 'empty',
    shouldProceed: false,
    errorType: 'required',
  },
  {
    name: 'Joe', // First name only
    description: 'first name only',
    shouldProceed: false,
    errorType: 'fullName', // Form requires both first and last name
  },
  {
    name: 'Joe Doe', // First and last name
    description: 'first and last name',
    shouldProceed: true,
  },
  {
    name: 'Joe Michael Doe', // Full name
    description: 'full name',
    shouldProceed: true,
  },
  {
    name: 'Joe D0e', // Invalid format (number: 0 instead of o - natural typing error)
    description: 'with invalid format (number)',
    shouldProceed: false,
    errorType: 'format',
  },
];


