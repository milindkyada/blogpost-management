import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../component/Navbar";
import { FaArrowLeft, FaCalendarAlt, FaClock } from "react-icons/fa";
import { toast } from "react-toastify";
import "./PageDetails.css";

const PostDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  // Calculate reading time
  const calculateReadTime = (text = "") => {
    const words = text.split(" ").length;
    const minutes = Math.ceil(words / 200); // 200 words per minute
    return `${minutes} min read`;
  };

  //  Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:3000/posts/${id}`);

        if (!response.ok) {
          throw new Error("Post not found");
        }

        const data = await response.json();
        setPost(data);
      } catch (error) {
        console.error(error);
        toast.error("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id]);

  //  Loading State
  if (loading) {
    return (
      <div className="loading-state">
        <Navbar />
        <p>Loading post...</p>
      </div>
    );
  }

  // Not Found
  if (!post) {
    return (
      <div className="no-posts">
        <Navbar />
        <p>Post not found</p>
      </div>
    );
  }

  return (
    <div className="post-details-page">
      <Navbar />

      <main className="post-details-container">
        <button className="back-btn" onClick={handleBackToDashboard}>
          <FaArrowLeft /> Back to Feed
        </button>

        <article className="full-post">
          <header className="post-header">
            <div className="post-category">{post.category || "Journal"}</div>

            <h1 className="post-full-title">{post.title}</h1>

            <div className="post-author-meta">
              <div className="author-info">
                <div className="author-avatar">
                  {post.author?.charAt(0)?.toUpperCase() || "A"}
                </div>

                <div>
                  <span className="author-name">
                    {post.author || "Anonymous"}
                  </span>

                  <div className="post-date-row">
                    <span>
                      <FaCalendarAlt />{" "}
                      {new Date(
                        post.createdAt || Date.now(),
                      ).toLocaleDateString()}
                    </span>

                    <span className="dot"></span>

                    <span>
                      <FaClock /> {calculateReadTime(post.description)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/*  Featured Image */}
          <div className="post-featured-image">
            <img
              src={
                post.image ||
                "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=1200"
              }
              alt={post.title}
            />
          </div>

          {/*  Dynamic Body */}
          <div className="post-body">
            <p>{post.description}</p>
          </div>

          <footer className="post-footer">
            <div className="post-share">
              <span>Share this story:</span>

              <div className="share-buttons">
                <button
                  className="share-button"
                  onClick={() =>
                    window.open(
                      `https://twitter.com/intent/tweet?text=${post.title}`,
                      "_blank",
                    )
                  }
                >
                  Twitter
                </button>

                <button
                  className="share-button"
                  onClick={() =>
                    window.open(
                      `https://www.linkedin.com/sharing/share-offsite/?url=${window.location.href}`,
                      "_blank",
                    )
                  }
                >
                  LinkedIn
                </button>

                <button
                  className="share-button"
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    toast.success("Link copied!");
                  }}
                >
                  Link
                </button>
              </div>
            </div>
          </footer>
        </article>
      </main>
    </div>
  );
};

export default PostDetails;
