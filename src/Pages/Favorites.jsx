import { useEffect, useState } from "react";
import { FaRegStar } from "react-icons/fa";
import { MdDeleteSweep, MdOpenInNew } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import "./Favorites.css";
import Navbar from "../component/Navbar";
const Favorites = () => {
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const storedFavs =
      JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavs);
  }, []);

  // Remove single favorite
  const removeFavorite = (id) => {
    const updated = favorites.filter(
      (item) => item.id !== id
    );
    setFavorites(updated);
    localStorage.setItem(
      "favorites",
      JSON.stringify(updated)
    );
  };

  // Clear all
  const clearAll = () => {
    setFavorites([]);
    localStorage.removeItem("favorites");
  };

  return (
    <div className="favorites-page-container">
    <Navbar/>

      <main className="favorites-main">
        {/* Hero Section (UNCHANGED) */}
        <div className="favorites-hero">
          <div className="hero-shape"></div>
          <div className="hero-content">
            <h1>Your Reading List</h1>
            <p>
              Enjoy the collection of stories you've
              curated.
            </p>
          </div>
        </div>

        <div className="favorites-content">
          {/* Header */}
          <div className="favorites-header">
            <h2>
              Curated Collection
              <span className="count-badge">
                {favorites.length}
              </span>
            </h2>

            {favorites.length > 0 && (
              <button
                className="clar-all-btn"
                onClick={clearAll}
              >
                <MdDeleteSweep size={20} /> Clear List
              </button>
            )}
          </div>

          {/* EMPTY STATE */}
          {favorites.length === 0 && (
            <div className="fav-empty-state">
              <div className="empty-icon-wrapper">
                <FaRegStar className="empty-icon" />
              </div>
              <h3>Your list is empty</h3>
              <p>
                Discover interesting posts and save them
                to read later
              </p>
              <button
                className="browse-btn"
                onClick={() =>
                  navigate("/dashboard")
                }
              >
                Explore Stories
              </button>
            </div>
          )}

          {/* FAVORITES GRID */}
          {favorites.length > 0 && (
            <div className="favorites-grid">
              {favorites.map((post) => (
                <div
                  className="fav-card"
                  key={post.id}
                >
                  <div className="fav-card-image">
                    <img
                      src={
                        post.image ||
                        "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=500"
                      }
                      alt={post.title}
                    />

                    <div className="fav-card-overlay">
                      <button
                        className="read-btn"
                        onClick={() =>
                          navigate(
                            `/PostDetails/${post.id}`
                          )
                        }
                      >
                        <MdOpenInNew /> Read Article
                      </button>
                    </div>
                  </div>

                  <div className="fav-card-body">
                    <div className="fav-meta">
                      <span className="fav-author">
                        {post.author ||
                          "Anonymous"}
                      </span>
                      <span className="fav-date">
                        {post.date ||
                          new Date(
                            post.createdAt ||
                              Date.now()
                          ).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="fav-title">
                      {post.title}
                    </h3>

                    <p className="fav-excerpt">
                      {post.description ||
                        post.content ||
                        post.excerpt}
                    </p>

                    <button
                      className="remove-fav-btn"
                      onClick={() =>
                        removeFavorite(post.id)
                      }
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;