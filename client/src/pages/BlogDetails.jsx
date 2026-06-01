import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogDetails.css";

function BlogDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBlogDetails = async () => {
      try {
        const res = await axios.get(`http://localhost:3000/blog/${id}`);
        setBlog(res.data.data);
      } catch (err) {
        setError("Failed to fetch blog details. Make sure the article exists.");
      } finally {
        setLoading(false);
      }
    };
    fetchBlogDetails();
  }, [id]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getFallbackImage = (imgUrl) => {
    return imgUrl && imgUrl.trim() !== "" ? imgUrl : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80";
  };

  if (loading) {
    return (
      <div className="status-container" style={{ minHeight: "60vh" }}>
        <div className="spinner"></div>
        <p>Fetching article details...</p>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="status-container" style={{ minHeight: "60vh" }}>
        <div className="error-badge">{error || "Article not found"}</div>
        <Link to="/" className="btn btn-secondary" style={{ marginTop: "25px" }}>Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="details-container">
      <div className="details-card glass-panel">
        <button onClick={() => navigate(-1)} className="back-btn">
          ← Back
        </button>

        <header className="details-header">
          <h1 className="details-title">{blog.title}</h1>
          
          <div className="details-meta">
            <div className="meta-item">
              <span className="meta-icon">✍️</span>
              <div>
                <div className="meta-label">Author</div>
                <div className="meta-value">{blog.author?.name || "Anonymous"}</div>
              </div>
            </div>
            
            <div className="meta-item">
              <span className="meta-icon">📅</span>
              <div>
                <div className="meta-label">Published On</div>
                <div className="meta-value">{formatDate(blog.createdAt)}</div>
              </div>
            </div>

            <div className="meta-item">
              <span className="meta-icon">✉️</span>
              <div>
                <div className="meta-label">Author Contact</div>
                <div className="meta-value">{blog.author?.email || "No email"}</div>
              </div>
            </div>
          </div>
        </header>

        <div className="details-image-wrap">
          <img src={getFallbackImage(blog.image)} alt={blog.title} />
        </div>

        <article className="details-content">
          {blog.content.split("\n").map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </article>
      </div>
    </div>
  );
}

export default BlogDetails;