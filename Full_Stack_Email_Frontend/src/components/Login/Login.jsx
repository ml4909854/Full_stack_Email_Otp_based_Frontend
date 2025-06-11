import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './Login.css';
import Spinner from '../Spinner/Spinner';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', otp: '' });
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setPageLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (pageLoading) {
    return <Spinner />;
  }

  // Handle input changes
  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    try {
      const response = await axios.post(`${backendUrl}/user/verify-otp`, formData);

      if (response.status === 200) {
        const{accessToken , refreshToken , userId} = response.data
         localStorage.setItem("accessToken" , accessToken)
         localStorage.setItem("refreshToken" , refreshToken)
         localStorage.setItem("userId" , userId)
         alert("User logged successfully!")
        navigate('/blog'); // or wherever you want
      } else {
        setError('Invalid OTP or email. Try again.');
      }
    } catch (err) {
      setError('Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Login</h2>

        {error && <p className="error">{error}</p>}

        <input
          type="email"
          name="email"
          placeholder="email address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="otp"
          placeholder="Enter you otp"
          value={formData.otp}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? 'Verifying...' : 'Verify-Otp'}
        </button>
      </form>
    </div>
  );
};

export default Login;
