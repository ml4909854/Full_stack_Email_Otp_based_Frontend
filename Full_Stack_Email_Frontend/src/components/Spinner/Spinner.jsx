import React, { useEffect, useState } from 'react';
import './spinner.css';

const Spinner = ({ delay = 300 }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [delay]);

  return show ? (
    <div className="spinner-overlay">
      <div className="spinner"></div>
    </div>
  ) : null;
};

export default Spinner;
