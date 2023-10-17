import React, { useState, useEffect } from 'react';

const Notification = ({ message, type, onClose }) => {
  const notificationStyle = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    zIndex: 9999,
  };

  const getTypeStyle = () => {
    switch (type) {
      case 'success':
        return { backgroundColor: 'green' };
      case 'info':
        return { backgroundColor: 'blue' };
      case 'warning':
        return { backgroundColor: 'orange' };
      case 'error':
        return { backgroundColor: 'red' };
      default:
        return {};
    }
  };

  useEffect(() => {
    // Automatically close the notification after 3 seconds (adjust as needed)
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => {
      clearTimeout(timer);
    };
  }, [onClose]);

  return (
    <div style={{ ...notificationStyle, ...getTypeStyle() }}>
      <div className='mr-4'>
      {message}</div>
      <button
        onClick={onClose}
        style={{
          position: 'absolute',
          top: '0px',
          right: '-5px',
          background: 'none',
          border: 'none',
        }}>
        &#x2716;
      </button>
    </div>
  );
};

export default Notification;