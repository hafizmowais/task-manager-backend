/**
 * Main e2e test suite
 * 
 * This file serves as the entry point for all e2e tests.
 * Individual test suites are split into separate files:
 * - users.e2e-spec.ts: User API tests
 * - tasks.e2e-spec.ts: Task API tests
 * 
 * Run all e2e tests with: npm run test:e2e
 */

// Import test suites to ensure they are registered
import './users.e2e-spec';
import './tasks.e2e-spec';

