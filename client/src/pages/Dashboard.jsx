import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";
import "./Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const token = localStorage.getItem("access_token");
  const userString = localStorage.getItem("user");
  let user = null;
  if (userString) {
    try {
      user = JSON.parse(userString);
    } catch (e) {
      console.error(e);
    }
  }

  useEffect(() => {
    if (!token) {
      alert("Please login to access the dashboard");
      navigate("/login");
      return;
    }

    const fetchUserBlogs = async () => {
      try {
        const res = await axios.get("http://localhost:3000/blog");
        const allBlogs = res.data.data || [];
        // Filter blogs belonging to logged in user
        const myBlogs = allBlogs.filter(blog => blog.author?._id === user?._id);
        setBlogs(myBlogs);
      } catch (err) {
        setError("Failed to fetch dashboard data. Make sure server is running.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBlogs();
  }, [token, navigate, user?._id]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the blog: "${title}"?`)) {
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/blog/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      showToast("Blog deleted successfully", "success");
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete blog", "error");
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  const getFallbackImage = (imgUrl) => {
    return imgUrl && imgUrl.trim() !== "" ? imgUrl : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1>Creator Dashboard</h1>
          <p className="subtitle" style={{ textAlign: "left", marginBottom: 0 }}>
            Manage and edit your published articles
          </p>
        </div>
        <Link to="/create-blog" className="btn btn-primary">
          ✍️ Create New Post
        </Link>
      </div>

      {loading ? (
        <div className="status-container">
          <div className="spinner"></div>
          <p>Loading your dashboard...</p>
        </div>
      ) : error ? (
        <div className="status-container">
          <div className="error-badge">{error}</div>
        </div>
      ) : blogs.length === 0 ? (
        <div className="empty-dashboard glass-panel">
          <h3>You haven't written any blogs yet!</h3>
          <p>Share your voice and publish your first article today.</p>
          <Link to="/create-blog" className="btn btn-primary" style={{ marginTop: "20px" }}>
            Create Your First Blog
          </Link>
        </div>
      ) : (
        <div className="dashboard-grid">
          {blogs.map((blog) => (
            <div key={blog._id} className="dashboard-card glass-panel">
              <div className="dash-img-wrap">
                <img src={getFallbackImage(blog.image)} alt={blog.title} />
              </div>
              
              <div className="dash-info">
                <span className="dash-date">📅 {formatDate(blog.createdAt)}</span>
                <h3 className="dash-title">{blog.title}</h3>
                <p className="dash-excerpt">
                  {blog.content.length > 100
                    ? blog.content.substring(0, 100) + "..."
                    : blog.content}
                </p>
              </div>

              <div className="dash-actions">
                <Link to={`/edit-blog/${blog._id}`} className="btn-dash edit">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(blog._id, blog.title)}
                  className="btn-dash delete"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;