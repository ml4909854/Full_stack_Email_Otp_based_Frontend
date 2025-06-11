import React, { useState } from 'react';
import axios from 'axios';
import './CreateBlog.css';
import Spinner from '../Spinner/Spinner'; // Optional: if you use a Spinner

const CreateBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    if (formData.title.length < 5 || formData.content.length < 20) {
      setError('Title must be at least 10 characters and content at least 200.');
      setLoading(false);
      return;
    }
     const accessToken = localStorage.getItem("accessToken")
    try {
      const response = await axios.post(`${backendUrl}/blog/create`, formData ,{
        headers:{
            authorization:`Bearer ${accessToken}`
        }
      });

      if (response.status === 201) {
        setSuccessMsg('Blog created successfully!');
        alert("Blog created successfully!")
        setFormData({ title: '', content: '' }); // Clear form
      } else {
        setError('Something went wrong while creating the blog.');
      }
    } catch (err) {
      setError('Failed to create blog. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-blog-container">
      <form className="create-blog-form" onSubmit={handleSubmit}>
        <h2>Create Blog</h2>

        {error && <p className="error">{error}</p>}
        {successMsg && <p className="success">{successMsg}</p>}

        <label htmlFor="title">Title</label>
        <input
          type="text"
          name="title"
          placeholder="Write title"
          value={formData.title}
          onChange={handleChange}
          minLength={10}
          required
        />

        <label htmlFor="content">Content</label>
        <textarea
          name="content"
          placeholder="Write blog content..."
          value={formData.content}
          onChange={handleChange}
          minLength={20}
          required
        ></textarea>

        <button type="submit" disabled={loading}>
          {loading ? 'Creating...' : 'Create Blog'}
        </button>
      </form>
    </div>
  );
};

export default CreateBlog;
