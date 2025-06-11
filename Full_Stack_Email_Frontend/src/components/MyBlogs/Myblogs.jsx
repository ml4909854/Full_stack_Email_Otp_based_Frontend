import React, { useEffect, useState } from "react";
import "./Myblogs.css";
import axios from "axios";

const Myblogs = () => {
  const [myBlogs, setMyBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const accessToken = localStorage.getItem("accessToken");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchMyBlogs();
  }, [accessToken, userId]);

  const fetchMyBlogs = async () => {
    try {
      const response = await axios.get(`${backendUrl}/blog/myblogs`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const sorted = response.data.Blog.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setMyBlogs(sorted);
    } catch (err) {
      console.error("Error fetching user's blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Edit Blog
  const handleEdit = async (id, oldTitle, oldContent) => {
    const newTitle = prompt("Edit title", oldTitle);
    const newContent = prompt("Edit content", oldContent);

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

      if (response.status === 200) {
        alert("Blog updated successfully.");
        fetchMyBlogs();
      }
    } catch (error) {
      console.error("Error editing blog:", error.message);
      alert("Failed to update blog.");
    }
  };

  // 🗑️ Delete Blog
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this blog?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${backendUrl}/blog/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.status === 200) {
        alert("Blog deleted successfully.");
        fetchMyBlogs();
      }
    } catch (error) {
      console.error("Error deleting blog:", error.message);
      alert("Failed to delete blog.");
    }
  };

  if (loading) return <div className="myblogs-loading">Loading your blogs...</div>;

  return (
    <div className="myblogs-container">
      <h2>My Blogs</h2>
      {myBlogs.length === 0 ? (
        <p>You have not created any blogs yet.</p>
      ) : (
        <div className="myblog-list">
          {myBlogs.map((blog) => (
            <div className="myblog-card" key={blog._id}>
              <h3>{blog.title}</h3>
              <p>{blog.content.slice(0, 150)}...</p>
              <span>By: {blog.author?.username || "You"}</span>
              <p className="myblog-date">
                Created: {new Date(blog.createdAt).toLocaleString()}
              </p>
              <div className="myblog-actions">
                <button onClick={() => handleEdit(blog._id, blog.title, blog.content)}>✏️ Edit</button>
                <button onClick={() => handleDelete(blog._id)}>🗑️ Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Myblogs;
