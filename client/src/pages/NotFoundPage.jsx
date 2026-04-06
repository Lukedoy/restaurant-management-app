
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/NotFound.css';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <h1 className="error-code">404</h1>
        <h2 className="error-title">Page Not Found</h2>
        <p className="error-message">
          Sorry, the page you're looking for doesn't exist.
        </p>
        <Link to="/" className="back-home-btn">
          Go Back Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

