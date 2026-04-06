import React from 'react';
import '../../styles/Common.css';

const LoadingSpinner = ({ message = 'Loading...', size = 'medium' }) => {
  return (
    <div className={`loading-spinner-container ${size}`} role="status" aria-live="polite">
      <div className="spinner">
        <div className="spinner-ring"></div>
      </div>
      <p className="spinner-message">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
