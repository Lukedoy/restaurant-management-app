// __tests__/ErrorBoundary.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/common/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Test error');
};

describe('ErrorBoundary', () => {
  // Suppress console.error for intentional errors in test
  const originalError = console.error;
  beforeAll(() => {
    console.error = jest.fn();
  });
  afterAll(() => {
    console.error = originalError;
  });

  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Child content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Child content')).toBeInTheDocument();
  });

  it('renders error UI when a child throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Refresh Page')).toBeInTheDocument();
  });
});
