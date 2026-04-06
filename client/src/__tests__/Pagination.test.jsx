// __tests__/Pagination.test.jsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../components/common/Pagination';

describe('Pagination', () => {
  it('does not render when there is only one page', () => {
    const { container } = render(
      <Pagination page={1} pages={1} total={5} onPageChange={() => {}} />
    );
    expect(container.innerHTML).toBe('');
  });

  it('renders correct page info', () => {
    render(
      <Pagination page={2} pages={5} total={100} onPageChange={() => {}} />
    );
    expect(screen.getByText('Showing page 2 of 5 (100 total)')).toBeInTheDocument();
  });

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup();
    const onPageChange = jest.fn();
    render(
      <Pagination page={2} pages={5} total={100} onPageChange={onPageChange} />
    );

    await user.click(screen.getByLabelText('Next page'));
    expect(onPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Prev button on first page', () => {
    render(
      <Pagination page={1} pages={5} total={100} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText('Previous page')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <Pagination page={5} pages={5} total={100} onPageChange={() => {}} />
    );
    expect(screen.getByLabelText('Next page')).toBeDisabled();
  });

  it('highlights current page', () => {
    render(
      <Pagination page={3} pages={5} total={100} onPageChange={() => {}} />
    );
    const currentBtn = screen.getByLabelText('Page 3');
    expect(currentBtn).toHaveClass('active');
    expect(currentBtn).toHaveAttribute('aria-current', 'page');
  });
});
