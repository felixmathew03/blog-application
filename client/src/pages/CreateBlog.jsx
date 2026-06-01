import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { showToast } from "../components/Toast";

function CreateBlog() {
  const navigate = useNavigate();
  
  const [blog, setBlog] = useState({
    title: "",
    content: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      showToast("Please login to access this page", "error");
      navigate("/login");
    }
  }, [navigate]);

  const handleChange = (e) => {
    setError("");
    setBlog({
      ...blog,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setError("");
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError("Image size should be less than 10MB");
        return;
      }

      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const submitBlog = async (e) => {
    e.preventDefault();
    
    if (!blog.title.trim()) {
      setError("Title is required");
      return;
    }
    if (!blog.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");

      // Prepare Multipart FormData
      const formData = new FormData();
      formData.append("title", blog.title);
      formData.append("content", blog.content);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post(
        "http://localhost:3000/blog/create",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      showToast("Blog Created Successfully", "success");
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to create blog"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-card">
        <h2>Create New Blog</h2>
        <p className="subtitle">Share your ideas and stories with the world</p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={submitBlog}>
          <input
            type="text"
            name="title"
            placeholder="Blog Title"
            value={blog.title}
            onChange={handleChange}
            required
          />

          {imagePreview ? (
            <div className="image-preview-container">
              <img src={imagePreview} alt="Selected preview" />
              <button
                type="button"
                className="btn remove-image-btn"
                onClick={removeImage}
              >
                Remove Image
              </button>
            </div>
          ) : (
            <div className="file-input-wrapper">
              <label className="file-input-label">
                <span>📷 Choose Cover Image (Max 10MB)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
              </label>
            </div>
          )}

          <textarea
            rows="8"
            name="content"
            placeholder="Write your blog post content here..."
            value={blog.content}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Publishing..." : "Publish Blog"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBlog;