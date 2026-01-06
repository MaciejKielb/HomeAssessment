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




