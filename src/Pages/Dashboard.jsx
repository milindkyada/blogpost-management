import { FaPlus } from "react-icons/fa";
import Navbar from "../component/Navbar";
import { MdDelete, MdEdit } from "react-icons/md";
import "./Dashboard.css"
const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <Navbar />

       <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="welcomme-text">
          <h1>Welcome to your Dashboard</h1>
          <p>Manage your posts, track enagagment , and connect with your audience.</p>
          </div>
        </div>

        <div className="dashboard-stats-overview">
          <div className="dash-card">
            <h3>Total Posts</h3>
            <span className="dash-number">10</span>
          </div>

          <div className="dash-card">
            <h3>Your Stories</h3>
            <span className="dash-number">5</span>
          </div>

          <div className="dash-card">
            <h3>Community Posts</h3>
            <span className="dash-number">10</span>
          </div>
        </div>

        <section className="posts-section">
          <div className="section-header">
            <h2 className="section-title">Recent Feed</h2>
            <button className="create-shortcut-btn">
              <FaPlus />New Post
            </button>
          </div>

          <div className="posts-grid">

            {/*static post card 1 */}
            <div className="post-card">
              <div className="post-image-container">
                <img 
                src="" 
                alt="post" 
                className="post-card-image"
                />

                <div className="post-actions">
                  <button className="action-btn edit-btn" title="Edit Post">
                    <MdEdit size={22} color="#ffffff"/>
                  </button>

                  <button className="action-btn delete-btn" title="Delete Post">
                    <MdDelete size={22} color="#ffffff"/>
                  </button>
                </div>
              </div>

              <div className="post-card-content">
                <div className="post-meta">
                  <span className="post-author">By Admin</span>
                  <span className="post-date">Recent</span>
                </div>

                <h3 className="post-card-title">Sample Post Title</h3>

                <p className="post-card-description">
                  This is a sample static description to maintain the UI design
                </p>

                <button className="read-more-btn">
                  Read More
                </button>
              </div>
            </div>


           {/*static post card 2 */}
            <div className="post-card">
              <div className="post-image-container">
                <img 
                src="" 
                alt="post" 
                className="post-card-image"
                />

                <div className="post-actions">
                  <button className="action-btn edit-btn" title="Edit Post">
                    <MdEdit size={22} color="#ffffff"/>
                  </button>

                  <button className="action-btn delete-btn" title="Delete Post">
                    <MdDelete size={22} color="#ffffff"/>
                  </button>
                </div>
              </div>

              <div className="post-card-content">
                <div className="post-meta">
                  <span className="post-author">By user</span>
                  <span className="post-date">Recent</span>
                </div>

                <h3 className="post-card-title">Another Static post</h3>

                <p className="post-card-description">
                  Static content example to keep the dashboard layout and style
                </p>

                <button className="read-more-btn">
                  Read More
                </button>
              </div>
            </div>

          </div>
        </section>
       </main>
    </div>
  );
};

export default Dashboard;