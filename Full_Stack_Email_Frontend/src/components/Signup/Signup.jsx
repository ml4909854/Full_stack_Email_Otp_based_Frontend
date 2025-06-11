import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Signup.css';
import Spinner from '../Spinner/Spinner';

const Signup = () => {
  const [formData, setFormData] = useState({ username: '', email: '' });
  const [loading, setLoading] = useState(false); // for button loading
  const [pageLoading, setPageLoading] = useState(true); // for initial spinner
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // ⏳ Initial 2-second spinner on page load
  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Spinner />;
  }

  // 🖊️ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🚀 Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL
    console.log(backendUrl)
    
    try {
      const response = await axios.post(`${backendUrl}/user/send-otp`, formData);

      if (response.status === 200) {
        alert("Otp sent successfully! It will valid only for 5 minutes.")
        navigate('/login');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>Signup</h2>

        {error && <p className="error">{error}</p>}

        <label htmlFor="username">Username</label>
        <input
          type="text"
          name="username"
          placeholder="Enter username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="email"
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>
    </div>
  );
};

export default Signup;
