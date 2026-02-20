import { useEffect, useState } from "react";
import { FaPlus, FaStar } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Navbar from "../component/Navbar";
import "./Dashboard.css";

const Dashboard = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/posts");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();

    const storedFavs =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs.map((item) => item.id));
  }, []);

  const toggleFavorite = (post) => {
    let storedFavs =
      JSON.parse(localStorage.getItem("favorites")) || [];

    const exists = storedFavs.find(
      (item) => item.id === post.id
    );

    if (exists) {
      storedFavs = storedFavs.filter(
        (item) => item.id !== post.id
      );
      toast.info("Removed from favorites");
    } else {
      storedFavs.push(post);
      toast.success("Added to favorites");
    }

    localStorage.setItem(
      "favorites",
      JSON.stringify(storedFavs)
    );

    setFavorites(storedFavs.map((item) => item.id));
  };

  const handleLogout = () => {
    localStorage.removeItem("loginData");
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleCreatePost = () => {
    navigate("/create-post");
  };

  const handleDeletePost = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:3000/posts/${id}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error(`Status: ${response.status}`);
      }

      setPosts((prevPosts) =>
        prevPosts.filter((post) => post.id !== id)
      );

      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("Failed to delete post");
    }
  };

  const loginData =
    JSON.parse(localStorage.getItem("loginData")) || {};
  const currentUser = loginData?.username || "User";

  const totalPosts = posts.length;
  const userPosts = posts.filter(
    (post) =>
      post.author?.toLowerCase() ===
      currentUser.toLowerCase()
  ).length;
  const communityPosts = totalPosts - userPosts;

  return (
    <div className="dashboard-page">
      <Navbar onLogout={handleLogout} />

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h1>
            Welcome to Your Dashboard, {currentUser}!
          </h1>
          <p>
            Manage your posts, track engagement, and
            connect with your audience.
          </p>
        </div>

        {/* Stats */}
        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">
              {totalPosts}
            </span>
          </div>

          <div className="dash-card">
            <h3>Your Stories</h3>
            <span className="dash-number">
              {userPosts}
            </span>
          </div>

          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">
              {communityPosts}
            </span>
          </div>
        </div>

        {/* Posts */}
        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">
              Recent Feed
            </h2>
            <button
              className="create-shortcut-btn"
              onClick={handleCreatePost}
            >
              <FaPlus /> New Post
            </button>
          </div>

          <div className="posts-grid">
            {loading ? (
              <div className="loading-state">
                Loading posts...
              </div>
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <div
                  className="post-card"
                  key={post.id}
                >
                  <div className="post-image-container">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"
                      }
                      alt={post.title}
                      className="post-card-image"
                    />

                    {/* Favorite Button */}
                    <button
                      className={`favorite-btn ${
                        favorites.includes(post.id)
                          ? "active"
                          : ""
                      }`}
                      onClick={() =>
                        toggleFavorite(post)
                      }
                    >
                      <FaStar size={20} />
                    </button>

                    {/* Edit & Delete */}
                    <div className="post-actions">
                      <button
                        className="action-btn edit-btn"
                        onClick={() =>
                          navigate(
                            `/create-post/${post.id}`
                          )
                        }
                      >
                        <MdEdit size={20} />
                      </button>

                      <button
                        className="action-btn delete-btn"
                        onClick={() =>
                          handleDeletePost(post.id)
                        }
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="post-card-content">
                    <h3 className="post-card-title">
                      {post.title}
                    </h3>

                    <p className="post-card-description">
                      {post.description ||
                        post.content ||
                        post.excerpt}
                    </p>

                    <button
                      className="read-more-btn"
                      onClick={() =>
                        navigate(
                          `/PostDetails/${post.id}`
                        )
                      }
                    >
                      Read More
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-posts">
                <p>
                  No posts yet. Be the first to create
                  a post!
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;