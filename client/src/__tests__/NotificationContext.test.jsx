// __tests__/NotificationContext.test.jsx
import React from 'react';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationProvider, useNotification } from '../context/NotificationContext';

const TestConsumer = () => {
  const { success, error, warning, info, toasts } = useNotification();
  return (
    <div>
      <button onClick={() => success('Success!')}>Show Success</button>
      <button onClick={() => error('Error!')}>Show Error</button>
      <button onClick={() => warning('Warning!')}>Show Warning</button>
      <button onClick={() => info('Info!')}>Show Info</button>
      <div data-testid="toast-count">{toasts.length}</div>
    </div>
  );
};

describe('NotificationContext', () => {
  it('adds a toast when success is called', async () => {
    const user = userEvent.setup();
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );

    await user.click(screen.getByText('Show Success'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');
  });

  it('adds multiple toasts', async () => {
    const user = userEvent.setup();
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );

    await user.click(screen.getByText('Show Success'));
    await user.click(screen.getByText('Show Error'));
    expect(screen.getByTestId('toast-count')).toHaveTextContent('2');
  });

  it('auto-removes toasts after duration', async () => {
    jest.useFakeTimers();
    render(
      <NotificationProvider>
        <TestConsumer />
      </NotificationProvider>
    );

    act(() => {
      screen.getByText('Show Info').click();
    });
    expect(screen.getByTestId('toast-count')).toHaveTextContent('1');

    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(screen.getByTestId('toast-count')).toHaveTextContent('0');

    jest.useRealTimers();
  });
});
