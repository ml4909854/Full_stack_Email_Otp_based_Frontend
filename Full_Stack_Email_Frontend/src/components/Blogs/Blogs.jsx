import React, { useEffect, useState } from "react";
import "./Blogs.css";
import axios from "axios";

const Blogs = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/blog`);
      const blogsData = Array.isArray(response.data.Blog)
        ? response.data.Blog
        : [];
      const sorted = blogsData.sort(
        (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
      );
      setBlogs(sorted);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit Blog
  async function handleEdit(id, oldTitle, oldContent) {
    const newTitle = prompt("Enter your title", oldTitle);
    const newContent = prompt("Edit your content", oldContent);

    if (!newTitle || !newContent) return;

    try {
      const response = await axios.patch(
        `${backendUrl}/blog/update/${id}`,
        { title: newTitle, content: newContent },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(id)
      if (response.status === 200) {
        alert("blod edited successfully");
        fetchBlogs(); // Refresh list
      }
    } catch (error) {
      console.error("Error updating blog:", error.message);
      alert("Failed to update blog.");
    }
  }

  // 🗑️ Delete Blog
  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${backendUrl}/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response)
      if (response.status === 200) {
        alert("Blog deleted successfully!");
        fetchBlogs(); // Refresh list
      }
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      alert("Failed to delete blog.");
    }
  }

  if (loading) return <div className="blog-loading">Loading blogs...</div>;

  return (
    <div className="blogs-container">
      <h2>All Blogs</h2>
      {blogs.length === 0 ? (
        <p>No blogs available.</p>
      ) : (
        <div className="blog-list">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <h3>{blog.title}</h3>
              <p>{blog.content.slice(0, 150)}...</p>
              <p className="blog-author">
                By: {blog.author?.username || "Anonymous"}
              </p>
              <p className="myblog-date">
                Created: {new Date(blog.createdAt).toLocaleString()}
              </p>
              <div className="blog-actions">
                <button
                  onClick={() => handleEdit(blog._id, blog.title, blog.content)}
                >
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(blog._id)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Blogs;
