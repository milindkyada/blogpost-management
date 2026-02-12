import React from "react";
import {
  FaCloudUploadAlt,
  FaHeading,
  FaLink,
  FaRegPaperPlane,
  FaTimes,
} from "react-icons/fa";
import Navbar from "../Component/Navbar";
import "./CreatePost.css";

const CreatePost = () => {
  return (
    <div className="create-post-page">
      <Navbar />
      <div className="create-post-container">
        <header className="form-header">
          <h1>Create a New Post</h1>
          <p>Share your thoughts with the world!</p>
        </header>
        <div className="post-form-card">
          <form action="">
            <div className="form-group">
              <label>Post Title</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="title"
                  className="form-control"
                  placeholder="enter a catchy title...."
                />
              </div>
            </div>
            <div className="form-group">
              <label> Author Name</label>
              <div className="input-wrapper">
                <FaHeading className="input-icon" />
                <input
                  type="text"
                  name="author"
                  className="form-control"
                  placeholder="enter a Author Name...."
                />
              </div>
            </div>
            <div className="form-group">
              <label> Post Description</label>
              <textarea
                name="description"
                className="form-control"
                placeholder="what's on your mind? write your story"
              ></textarea>
            </div>
            <div className="form-group">
              <label> Post Image</label>
              <div className="image-source-tabs">
                <button type="button" className="tab-btn active">
                  Paste Image URL
                </button>
                <button type="button" className="tab-btn">
                  Upload File
                </button>
              </div>
              <div className="input-wrapper">
                <FaLink className="input-icon" />
                <input
                  type="text"
                  name="imageURL"
                  className="form-control"
                  placeholder="Paste Image URL here"
                />
              </div>
              <div className="image-upload-area">
                <FaCloudUploadAlt className="upload-icon" />
                <p>Click to upload image or drag and drop</p>
              </div>
              <div className="image-preview-container">
                <img
                  src="https://picsum.photos/400"
                  alt="Preview"
                  className="image-preview"
                />
                <button type="button" className="remove-image-btn">
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="form-actions-row">
              <button type="submit" className="submit-btn">
                <FaRegPaperPlane /> Publish Post
              </button>
              <button type="button" className="cancel-btn">
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
