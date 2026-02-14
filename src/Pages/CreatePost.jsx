import React, { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("url");
  const [showUploadArea, setShowUploadArea] = useState(true);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
    userId: "",
    userEmail: "",
  });

  const [previewImage, setPreviewImage] = useState("");
  const [imageError, setImageError] = useState(false);

  // Default fallback image
  const fallbackImage = "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500";

  /* AUTO AUTHOR FROM LOGIN DATA */
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
    if (loginData?.username) {
      setFormData((prev) => ({
        ...prev,
        author: loginData.username,
        userId: loginData.id || Date.now(),
        userEmail: loginData.email || "",
      }));
    }
  }, []);

  /*  FETCH POST FOR EDIT */
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/posts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Post not found");
          return res.json();
        })
        .then((data) => {
          // Check if current user owns this post
          const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");
          
          if (data.userId && data.userId !== loginData.id && data.author !== loginData.username) {
            toast.error("You can only edit your own posts!");
            navigate("/dashboard");
            return;
          }

          setFormData({
            title: data.title || "",
            author: data.author || "",
            description: data.description || "",
            image: data.image || "",
            userId: data.userId || loginData.id,
            userEmail: data.userEmail || loginData.email || "",
          });

          setPreviewImage(data.image || "");
          setImageError(false);
          
          if (data.image) {
            setShowUploadArea(false);
          }
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to load post");
          navigate("/dashboard");
        });
    }
  }, [id, navigate]);

  /*  HANDLE INPUT */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      // Reset image error when URL changes
      setImageError(false);
      setPreviewImage(value);
      setShowUploadArea(false);
      
      // Test if image URL is valid
      if (value) {
        const img = new Image();
        img.onload = () => {
          setImageError(false);
        };
        img.onerror = () => {
          setImageError(true);
          toast.warning("Image URL might not be accessible. Using fallback image.");
        };
        img.src = value;
      }
    }
  };

  /* HANDLE IMAGE ERROR */
  const handleImageError = () => {
    setImageError(true);
    setPreviewImage(fallbackImage);
  };

  /*  VALIDATION */
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Post title required ");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description required ");
      return false;
    }

    if (!previewImage) {
      toast.error("Post image required ");
      return false;
    }

    return true;
  };

  /*  SUBMIT (CREATE + UPDATE) */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");

    const postData = {
      title: formData.title,
      author: formData.author || loginData.username,
      description: formData.description,
      image: imageError ? fallbackImage : previewImage,
      userId: loginData.id || Date.now(),
      userEmail: loginData.email || "",
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    };

    try {
      let response;

      if (id) {
        response = await fetch(`http://localhost:3000/posts/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...postData, id }),
        });
      } else {
        const newId = Date.now().toString();
        response = await fetch("http://localhost:3000/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...postData, id: newId }),
        });
      }

      if (!response.ok) throw new Error("Save failed");

      toast.success(id ? "Post Updated ✏️" : "Post Published ");
      navigate("/dashboard");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving post ");
    }
  };

  /*  CLEAR FORM */
  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      image: "",
    }));
    setPreviewImage("");
    setImageError(false);
    setShowUploadArea(true);
    setActiveTab("url");
  };

  /*  FILE SELECT */
  const handleFileSelect = (file) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Only image files allowed ");
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      const base64 = reader.result;

      const img = new Image();
      img.src = base64;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 600;
        
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const compressedBase64 = canvas.toDataURL("image/jpeg", 0.8);

        setPreviewImage(compressedBase64);
        setImageError(false);
        setShowUploadArea(false);
        
        // Also update formData image field
        setFormData((prev) => ({
          ...prev,
          image: compressedBase64,
        }));
      };
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    handleFileSelect(file);
  };

  const handleDragOver = (e) => e.preventDefault();

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    handleFileSelect(file);
  };

  /* REMOVE IMAGE */
  const handleRemoveImage = () => {
    setPreviewImage("");
    setImageError(false);
    setFormData((prev) => ({ ...prev, image: "" }));
    setShowUploadArea(true);
  };

  /* HANDLE TAB CHANGE */
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setImageError(false);
    if (tab === "url") {
      setShowUploadArea(true);
    } else {
      setShowUploadArea(true);
      setFormData((prev) => ({ ...prev, image: "" }));
      setPreviewImage("");
    }
  };

  return (
    <div className="create-post-page">
      <Navbar />

      <div className="create-post-container">
        <header className="form-header">
          <h1>{id ? "Edit Post" : "Create a New Post"}</h1>
          <p>Share your thoughts with the world!</p>
        </header>

        <div className="post-form-card">
          <form onSubmit={handleSubmit}>
            
            {/* TITLE */}
            <div className="form-group">
              <label>Post Title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="Enter Post Title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* AUTHOR - READ ONLY */}
            <div className="form-group">
              <label>Author Name</label>
              <div className="input-wrapper">
                <FaUser className="input-icon" />
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="Author Name"
                  value={formData.author}
                  readOnly
                />
              </div>
            </div>

            {/* DESCRIPTION */}
            <div className="form-group">
              <label>Post Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="Enter Post Description"
                value={formData.description}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Post Image</label>

              <div className="image-source-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
                  onClick={() => handleTabChange("url")}
                >
                  <FaLink style={{ marginRight: '8px' }} />
                  Paste Image URL
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === "upload" ? "active" : ""}`}
                  onClick={() => handleTabChange("upload")}
                >
                  <FaCloudUploadAlt style={{ marginRight: '8px' }} />
                  Upload File
                </button>
              </div>

              {/* URL INPUT */}
              {activeTab === "url" && !previewImage && (
                <div className="input-wrapper">
                  <FaLink className="input-icon" />
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    placeholder="Paste Image URL here... (e.g., https://example.com/image.jpg)"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
              )}

              {/* UPLOAD AREA */}
              {activeTab === "upload" && showUploadArea && !previewImage && (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    id="fileUpload"
                    onChange={handleFileInput}
                  />

                  <div
                    className="image-upload-area"
                    onClick={() =>
                      document.getElementById("fileUpload").click()
                    }
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <FaCloudUploadAlt className="upload-icon" />
                    <p>Drag & Drop Image Here</p>
                    <span className="upload-hint">or Click to Upload</span>
                    <small style={{ display: 'block', marginTop: '10px', color: '#64748b' }}>
                      Max size: 5MB
                    </small>
                  </div>
                </>
              )}

              {/* IMAGE PREVIEW */}
              {previewImage && (
                <div className="image-preview-wrapper">
                  <div className="image-preview-container">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="image-preview"
                      onError={handleImageError}
                      style={{ 
                        maxWidth: '100%', 
                        maxHeight: '300px',
                        objectFit: 'contain'
                      }}
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                      title="Remove image"
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {imageError && (
                    <p style={{ color: '#f59e0b', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                      ⚠️ Using fallback image (original URL could not be loaded)
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="form-actions-row">
              <button type="submit" className="submit-btn">
                <FaRegPaperPlane />
                {id ? " Update Post" : " Publish Post"}
              </button>

              <button
                type="button"
                className="cancel-btn"
                onClick={clearForm}
              >
                Clear Form
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;