import React from 'react';
import '../styles/ErrorMessage.css';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="error-message-box">
      <span className="error-icon">⚠️</span>
      <p>{message}</p>
    </div>
  );
};

export default ErrorMessage;
