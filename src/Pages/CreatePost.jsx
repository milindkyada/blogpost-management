import React, { useState, useEffect } from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../component/Navbar";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import "./CreatePost.css";

const CreatePost = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("url");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    description: "",
    image: "",
  });

  const [previewImage, setPreviewImage] = useState("");

  /* ✅ AUTO AUTHOR */
  useEffect(() => {
    const loginData = JSON.parse(localStorage.getItem("loginData") || "{}");

    if (loginData?.username) {
  setFormData((prev) => ({
    ...prev,
    author: loginData.username,
  }));
    }
  }, []);



  /* ✅ FETCH POST FOR EDIT */
  useEffect(() => {
    if (id) {
      fetch(`http://localhost:3000/posts/${id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Post not found");
          return res.json();
        })
        .then((data) => {
          setFormData({
            title: data.title || "",
            author: data.author || "",
            description: data.description || "",
            image: data.image || "",
          });

          setPreviewImage(data.image || "");
        })
        .catch((error) => {
          console.error(error);
          toast.error("Failed to load post");
        });
    }
  }, [id]);

  /* ✅ HANDLE INPUT */
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "image") {
      setPreviewImage(value);
    }
  };

  /* ✅ VALIDATION */
  const validateForm = () => {
    if (!formData.title.trim()) {
      toast.error("Post title required 🚨");
      return false;
    }

    if (!formData.description.trim()) {
      toast.error("Description required 🚨");
      return false;
    }

    if (!previewImage) {
      toast.error("Post image required 🚨");
      return false;
    }

    return true;
  };

  /* ✅ SUBMIT (CREATE + UPDATE) */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const postData = {
      title: formData.title,
      author: formData.author,
      description: formData.description,
      image: previewImage,
      createdAt: new Date().toISOString(),
    };

    try {
      let response;

      if (id) {
        response = await fetch(
          `http://localhost:3000/posts/${id}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          }
        );
      } else {
        response = await fetch(
          "http://localhost:3000/posts",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(postData),
          }
        );
      }

      if (!response.ok) throw new Error("Save failed");

      toast.success(id ? "Post Updated ✏" : "Post Published 🚀");

      navigate("/dashboard");
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Error saving post 🚨");
    }
  };

  /* ✅ CLEAR FORM */
  const clearForm = () => {
    setFormData((prev) => ({
      ...prev,
      title: "",
      description: "",
      image: "",
    }));
    setPreviewImage("");
  };

  /* ✅ FILE SELECT */
const handleFileSelect = (file) => {
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    toast.error("Only image files allowed 🚨");
    return;
  }

  const reader = new FileReader();

  reader.onloadend = () => {
    const base64 = reader.result;

    // ⚡ compress by resizing image
    const img = new Image();
    img.src = base64;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      const MAX_WIDTH = 600;
      const scaleSize = MAX_WIDTH / img.width;

      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);

      setPreviewImage(compressedBase64);
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
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* AUTHOR */}
            <div className="form-group">
              <label>Author Name</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="author"
                  className="form-control"
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
                value={formData.description}
                onChange={handleChange}
              ></textarea>
            </div>

            {/* IMAGE */}
            <div className="form-group">
              <label>Post Image</label>

              <div className="image-source-tabs">
                <button
                  type="button"
                  className={`tab-btn ${activeTab === "url" ? "active" : ""}`}
                  onClick={() => setActiveTab("url")}
                >
                  Paste Image URL
                </button>

                <button
                  type="button"
                  className={`tab-btn ${activeTab === "upload" ? "active" : ""}`}
                  onClick={() => setActiveTab("upload")}
                >
                  Upload File
                </button>
              </div>

              {activeTab === "url" && (
                <div className="input-wrapper">
                  <FaLink className="input-icon" />
                  <input
                    type="text"
                    name="image"
                    className="form-control"
                    value={formData.image}
                    onChange={handleChange}
                  />
                </div>
              )}

              {activeTab === "upload" && (
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
                  </div>
                </>
              )}

              {previewImage && (
                <div className="image-preview-container">
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="image-preview"
                  />
                  <button
                    type="button"
                    className="remove-image-btn"
                    onClick={() => setPreviewImage("")}
                  >
                    <FaTimes />
                  </button>
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