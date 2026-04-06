// __tests__/LoadingSpinner.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/common/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders default loading message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders custom message', () => {
    render(<LoadingSpinner message="Please wait..." />);
    expect(screen.getByText('Please wait...')).toBeInTheDocument();
  });

  it('has accessible role', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('applies size class', () => {
    const { container } = render(<LoadingSpinner size="large" />);
    expect(container.firstChild).toHaveClass('large');
  });
});
