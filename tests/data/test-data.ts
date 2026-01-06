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





