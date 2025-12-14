import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [currentPage, setCurrentPage] = useState('main');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [dateTime, setDateTime] = useState({ time: '', date: '' });

  // Check for logged-in user on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      // Fetch user profile
      fetch('http://127.0.0.1:8000/api/profile/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Not authenticated');
          return res.json();
        })
        .then(data => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
        });
    }
  }, []);

  // Update clock
  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const year = now.getFullYear();
      setDateTime({ time: `${hours}:${minutes}:${seconds}`, date: `${day}/${month}/${year}` });
    };
    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleNavigation = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleUserIconClick = () => {
    if (user) {
      handleNavigation('profile');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleLoginSuccess = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    setShowAuthModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
    handleNavigation('main');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0e1a', color: 'white', fontFamily: 'monospace' }}>
      <style>{`
        .border-custom { border-color: #374151; }
        .text-green { color: #00ff41; }
        .btn-green { 
          background-color: #00ff41; 
          color: black; 
          font-weight: bold;
          border: none;
        }
        .btn-green:hover { 
          background-color: #00dd35; 
          color: black;
        }
        .search-input {
          background-color: #151923;
          border: 1px solid #374151;
          color: white;
        }
        .search-input:focus {
          background-color: #151923;
          border-color: #00ff41;
          color: white;
          box-shadow: none;
        }
        .search-input::placeholder { color: #6b7280; }
        .icon-btn {
          background-color: #151923;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
        }
        .icon-btn:hover { background-color: #1f2937; }
        .logo-circle {
          width: 32px;
          height: 32px;
          background-color: #00ff41;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }
        .logo-inner {
          width: 16px;
          height: 16px;
          background-color: white;
          border-radius: 50%;
        }
        .card-custom {
          background-color: #151923;
          border: 1px solid #374151;
          border-radius: 8px;
        }
        .moon-container {
          background-color: black;
          border-radius: 8px;
          aspect-ratio: 1;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .moon-image {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 8px;
        }
        .nav-card {
          background-color: #151923;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 24px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .nav-card:hover {
          border-color: #00ff41;
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 255, 65, 0.2);
        }
        .nav-icon {
          font-size: 3rem;
          display: block;
          margin-bottom: 12px;
        }
        .nav-card h3 {
          color: #00ff41;
          font-size: 1.2rem;
          margin-bottom: 8px;
        }
        .nav-card p {
          color: #9ca3af;
          font-size: 0.9rem;
          margin: 0;
        }
        .apod-image {
          width: 100%;
          height: 400px;
          object-fit: cover;
          border-radius: 8px;
          cursor: pointer;
        }
        .apod-image:hover { opacity: 0.9; }
        .copyright-text {
          color: #9ca3af;
          font-size: 0.75rem;
        }
        .date-text {
          color: #6b7280;
          font-size: 0.875rem;
        }
        .explanation-text {
          color: #d1d5db;
          line-height: 1.6;
          font-size: 0.9rem;
        }
        .asteroid-item {
          background-color: #0a0e1a;
          border: 1px solid #374151;
          border-radius: 6px;
          padding: 12px;
          margin-bottom: 10px;
          transition: all 0.2s;
        }
        .asteroid-item:hover {
          border-color: #00ff41;
          transform: translateX(4px);
        }
        .asteroid-hazardous { border-color: #ef4444; }
        .asteroid-hazardous:hover { border-color: #dc2626; }
        .badge-hazardous {
          background-color: #ef4444;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .badge-safe {
          background-color: #10b981;
          color: white;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
        }
        .stat-label {
          color: #9ca3af;
          font-size: 0.75rem;
        }
        .stat-value {
          color: #d1d5db;
          font-size: 0.9rem;
          font-weight: 600;
        }
        .launch-item {
          background-color: #0a0e1a;
          border: 1px solid #374151;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .launch-item:hover {
          border-color: #00ff41;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 255, 65, 0.1);
        }
        .launch-image {
          width: 100%;
          height: 180px;
          object-fit: cover;
        }
        .rocket-badge {
          background-color: #374151;
          color: #00ff41;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: bold;
          display: inline-block;
        }
        .location-text {
          color: #9ca3af;
          font-size: 0.8rem;
        }
        .date-time {
          color: #d1d5db;
          font-size: 0.85rem;
          font-weight: 600;
        }
        .details-text {
          color: #d1d5db;
          font-size: 0.85rem;
          line-height: 1.5;
        }
        .auth-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          backdrop-filter: blur(4px);
        }
        .auth-modal {
          background-color: #151923;
          border: 1px solid #374151;
          border-radius: 12px;
          padding: 32px;
          max-width: 450px;
          width: 90%;
          position: relative;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        }
        .auth-modal-close {
          position: absolute;
          top: 16px;
          right: 16px;
          background: transparent;
          border: none;
          color: #9ca3af;
          font-size: 2rem;
          cursor: pointer;
          line-height: 1;
          padding: 0;
          width: 32px;
          height: 32px;
        }
        .auth-modal-close:hover { color: #00ff41; }
        .user-avatar {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, #00ff41, #00dd35);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: bold;
          color: black;
        }
        .user-icon-btn {
          background-color: #151923;
          border: none;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          cursor: pointer;
          font-weight: bold;
          font-size: 1.2rem;
        }
        .user-icon-btn.logged-in {
          background: linear-gradient(135deg, #00ff41, #00dd35);
          color: black;
        }
        .user-icon-btn:hover { background-color: #1f2937; }
        .user-icon-btn.logged-in:hover { opacity: 0.9; }
        .profile-avatar-img {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #00ff41;
        }
        .forum-post {
          background-color: #151923;
          border: 1px solid #374151;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 16px;
          transition: all 0.2s;
        }
        .forum-post:hover {
          border-color: #00ff41;
          box-shadow: 0 4px 12px rgba(0, 255, 65, 0.1);
        }
        .forum-author {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }
        .forum-author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
        }
        .forum-author-avatar-fallback {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff41, #00dd35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: black;
        }
        .forum-action-btn {
          background: transparent;
          border: 1px solid #374151;
          color: #9ca3af;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 0.85rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .forum-action-btn:hover {
          border-color: #00ff41;
          color: #00ff41;
        }
        .forum-action-btn.liked {
          border-color: #00ff41;
          color: #00ff41;
        }
        .forum-action-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .comment-item {
          background-color: #0a0e1a;
          border-left: 3px solid #374151;
          padding: 12px;
          margin-bottom: 12px;
          border-radius: 4px;
        }
        .comment-author {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .comment-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          object-fit: cover;
        }
        .comment-avatar-fallback {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: linear-gradient(135deg, #00ff41, #00dd35);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: black;
          font-size: 0.8rem;
        }
      `}</style>

      {/* Header */}
      <header className="border-bottom border-custom">
        <div className="container-fluid py-3">
          <div className="row align-items-center">
            <div className="col-auto">
              <div className="d-flex align-items-center gap-2" onClick={() => handleNavigation('main')} style={{ cursor: 'pointer' }}>
                <div className="logo-circle">
                  <div className="logo-inner"></div>
                </div>
                <span className="fs-4 fw-bold">PULSAR</span>
              </div>
            </div>
            
            <div className="col">
              <div className="mx-auto" style={{ maxWidth: '500px' }}>
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder="Search events, stars, discussions..."
                />
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex align-items-center gap-3">
                <div className="text-end">
                  <div className="fs-5 fw-semibold">{dateTime.time}</div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    {dateTime.date} (Kyiv)
                  </div>
                </div>
                <button 
                  className={`user-icon-btn ${user ? 'logged-in' : ''}`}
                  onClick={handleUserIconClick}
                >
                  {user ? (
                    user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.username} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      user.username.charAt(0).toUpperCase()
                    )
                  ) : (
                    <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
                <button className="icon-btn">
                  <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-4">
        {currentPage === 'main' && <MainPage onNavigate={handleNavigation} />}
        {currentPage === 'apod' && <ApodPage onNavigate={handleNavigation} />}
        {currentPage === 'asteroids' && <AsteroidsPage onNavigate={handleNavigation} />}
        {currentPage === 'launches' && <LaunchesPage onNavigate={handleNavigation} />}
        {currentPage === 'profile' && <UserProfilePage user={user} onNavigate={handleNavigation} onLogout={handleLogout} />}
        {currentPage === 'forum' && <ForumPage user={user} onNavigate={handleNavigation} />}
      </main>

      <AuthModal 
        show={showAuthModal} 
        onClose={() => setShowAuthModal(false)} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}

// Forum Page
function ForumPage({ user, onNavigate }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedPost, setExpandedPost] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch('http://127.0.0.1:8000/api/forum/posts/', {
        headers
      });
      
      if (!response.ok) throw new Error('Failed to fetch posts');
      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    if (!user) {
      alert('Please login to like posts');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/forum/posts/${postId}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to like post', err);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/forum/posts/${postId}/`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (err) {
      console.error('Failed to delete post', err);
    }
  };

  

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-green" onClick={() => onNavigate('main')}>
          ← Back to Main Page
        </button>
        {user && (
          <button className="btn btn-green" onClick={() => setShowCreateModal(true)}>
            ✍️ Create Post
          </button>
        )}
      </div>

      <div className="card-custom p-4 mb-4">
        <div className="d-flex align-items-center gap-2 mb-3">
          <span style={{ fontSize: '1.5rem' }}>💬</span>
          <h2 className="fs-4 fw-bold mb-0">Community Forum</h2>
        </div>
        <p style={{ color: '#9ca3af', fontSize: '0.9rem', marginBottom: 0 }}>
          Discuss space topics, share discoveries, and connect with fellow astronomers
        </p>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-5">
          <p style={{ color: '#9ca3af' }}>No posts yet. Be the first to post!</p>
        </div>
      ) : (
        posts.map(post => (
          <ForumPost
            key={post.id}
            post={post}
            user={user}
            onLike={handleLike}
            onDelete={handleDeletePost}
            isExpanded={expandedPost === post.id}
            onToggleExpand={() => setExpandedPost(expandedPost === post.id ? null : post.id)}
          />
        ))
      )}

      {showCreateModal && (
        <CreatePostModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            fetchPosts();
          }}
        />
      )}
    </>
  );
}

// Forum Post Component
function ForumPost({ post, user, onLike, onDelete, isExpanded, onToggleExpand }) {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showCommentForm, setShowCommentForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const fetchComments = async () => {
    if (loadingComments) return;
    
    setLoadingComments(true);
    try {
      const token = localStorage.getItem('access_token');
      const headers = token ? { 'Authorization': `Bearer ${token}` } : {};
      
      const response = await fetch(`http://127.0.0.1:8000/api/forum/posts/${post.id}/comments/`, {
        headers
      });
      
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (err) {
      console.error('Failed to fetch comments', err);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleToggleExpand = () => {
    if (!isExpanded) {
      fetchComments();
    }
    onToggleExpand();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const isOwnPost = user && user.username === post.author_username;

  return (
    <>
      <div className="forum-post">
        <div className="forum-author">
          {post.author_avatar ? (
            <img src={post.author_avatar} alt={post.author_username} className="forum-author-avatar" />
          ) : (
            <div className="forum-author-avatar-fallback">
              {post.author_username.charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <div className="text-green fw-bold">{post.author_username}</div>
            <div style={{ color: '#6b7280', fontSize: '0.8rem' }}>{formatDate(post.created_at)}</div>
          </div>
        </div>

        <h3 className="fs-5 fw-bold mb-2">{post.title}</h3>
        <p style={{ color: '#d1d5db', lineHeight: '1.6', marginBottom: '16px' }}>{post.content}</p>

        <div className="d-flex gap-2 flex-wrap">
          <button 
            className={`forum-action-btn ${post.is_liked ? 'liked' : ''}`}
            onClick={() => onLike(post.id)}
            disabled={!user}
          >
            ❤️ {post.likes_count}
          </button>
          <button 
            className="forum-action-btn"
            onClick={handleToggleExpand}
          >
            💬 {post.comments_count} {isExpanded ? '▲' : '▼'}
          </button>
          {isOwnPost && (
            <>
              <button 
                className="forum-action-btn"
                onClick={() => setShowEditModal(true)}
              >
                ✏️ Edit
              </button>
              <button 
                className="forum-action-btn"
                onClick={() => onDelete(post.id)}
              >
                🗑️ Delete
              </button>
            </>
          )}
        </div>

        {isExpanded && (
          <div className="mt-4 pt-4 border-top border-custom">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="fs-6 fw-bold mb-0">Comments ({comments.length})</h4>
              {user && (
                <button 
                  className="btn btn-sm btn-green"
                  onClick={() => setShowCommentForm(!showCommentForm)}
                >
                  {showCommentForm ? 'Cancel' : '+ Add Comment'}
                </button>
              )}
            </div>

            {showCommentForm && (
              <CommentForm
                postId={post.id}
                onSuccess={() => {
                  setShowCommentForm(false);
                  fetchComments();
                }}
              />
            )}

            {loadingComments ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-success" role="status" />
              </div>
            ) : comments.length === 0 ? (
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>No comments yet. Be the first!</p>
            ) : (
              comments.map(comment => (
                <CommentItem key={comment.id} comment={comment} user={user} onDelete={fetchComments} />
              ))
            )}
          </div>
        )}
      </div>

      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={() => {
            setShowEditModal(false);
            window.location.reload();
          }}
        />
      )}
    </>
  );
}

// Comment Item Component
function CommentItem({ comment, user, onDelete }) {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now - date;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return 'Just now';
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like comments');
      return;
    }

    try {
      const token = localStorage.getItem('access_token');
      await fetch(`http://127.0.0.1:8000/api/forum/comments/${comment.id}/like/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      onDelete();
    } catch (err) {
      console.error('Failed to like comment', err);
    }
  };

  const isOwnComment = user && user.username === comment.author_username;
  
  return (
    <div className="comment-item">
      <div className="comment-author">
        {comment.author_avatar ? (
          <img src={comment.author_avatar} alt={comment.author_username} className="comment-avatar" />
        ) : (
          <div className="comment-avatar-fallback">
            {comment.author_username.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <span className="text-green fw-bold" style={{ fontSize: '0.9rem' }}>{comment.author_username}</span>
          <span style={{ color: '#6b7280', fontSize: '0.75rem', marginLeft: '8px' }}>{formatDate(comment.created_at)}</span>
        </div>
      </div>
      <p style={{ color: '#d1d5db', fontSize: '0.9rem', marginBottom: '8px' }}>{comment.content}</p>
      <button 
        className={`forum-action-btn ${comment.is_liked ? 'liked' : ''}`}
        onClick={handleLike}
        disabled={!user}
        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
      >
        ❤️ {comment.likes_count}
      </button>
    </div>
  );
}

// Comment Form Component
function CommentForm({ postId, onSuccess }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/forum/posts/${postId}/comments/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content })
      });

      if (response.ok) {
        setContent('');
        onSuccess();
      }
    } catch (err) {
      console.error('Failed to post comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-3">
      <textarea
        className="form-control search-input mb-2"
        rows="3"
        placeholder="Write your comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button type="submit" className="btn btn-green btn-sm" disabled={submitting || !content.trim()}>
        {submitting ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

// Create Post Modal
function CreatePostModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({ title: '', content: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/forum/posts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to create post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <h2 className="text-green fs-4 fw-bold mb-4">Create New Post</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Title</label>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Content</label>
            <textarea
              className="form-control search-input"
              rows="6"
              placeholder="Write your post content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-green w-100" disabled={submitting}>
            {submitting ? 'Creating...' : 'Create Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Edit Post Modal
function EditPostModal({ post, onClose, onSuccess }) {
  const [formData, setFormData] = useState({ title: post.title, content: post.content });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Title and content are required');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`http://127.0.0.1:8000/api/forum/posts/${post.id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        onSuccess();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to update post');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <h2 className="text-green fs-4 fw-bold mb-4">Edit Post</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Title</label>
            <input
              type="text"
              className="form-control search-input"
              placeholder="Enter post title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Content</label>
            <textarea
              className="form-control search-input"
              rows="6"
              placeholder="Write your post content..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-green w-100" disabled={submitting}>
            {submitting ? 'Updating...' : 'Update Post'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Auth Modal Component
function AuthModal({ show, onClose, onLoginSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password2: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8 && 
           /[A-Z]/.test(password) && 
           /[a-z]/.test(password) && 
           /[0-9]/.test(password);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
    setMessage('');
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!isLogin) {
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(formData.email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (!isLogin && !validatePassword(formData.password)) {
      newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, and number';
    }

    if (!isLogin) {
      if (!formData.password2) {
        newErrors.password2 = 'Please confirm your password';
      } else if (formData.password !== formData.password2) {
        newErrors.password2 = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const response = await fetch('http://127.0.0.1:8000/api/login/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            password: formData.password
          })
        });

        const data = await response.json();

        if (response.ok) {
          onLoginSuccess(data.user, data.tokens);
        } else {
          setMessage(data.error || 'Login failed. Please try again.');
        }
      } else {
        const response = await fetch('http://127.0.0.1:8000/api/register/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            username: formData.username,
            email: formData.email,
            password: formData.password,
            password2: formData.password2
          })
        });

        const data = await response.json();

        if (response.ok) {
          setMessage(data.message || 'Registration successful! Please check your email.');
          setFormData({ username: '', email: '', password: '', password2: '' });
          setTimeout(() => setIsLogin(true), 3000);
        } else {
          setMessage(data.error || 'Registration failed. Please try again.');
        }
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = () => {
    setIsLogin(!isLogin);
    setFormData({ username: '', email: '', password: '', password2: '' });
    setErrors({});
    setMessage('');
  };

  if (!show) return null;

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <button className="auth-modal-close" onClick={onClose}>×</button>
        
        <div className="text-center mb-4">
          <div className="logo-circle mx-auto mb-3" style={{ width: '48px', height: '48px' }}>
            <div className="logo-inner" style={{ width: '24px', height: '24px' }}></div>
          </div>
          <h2 className="text-green fs-3 fw-bold mb-2">
            {isLogin ? 'Welcome Back' : 'Join PULSAR'}
          </h2>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
            {isLogin ? 'Login to your account' : 'Create your account'}
          </p>
        </div>

        {message && (
          <div className={`alert ${message.includes('success') || message.includes('check your email') ? 'alert-success' : 'alert-danger'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Username</label>
            <input
              type="text"
              name="username"
              className={`form-control search-input ${errors.username ? 'is-invalid' : ''}`}
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
            {errors.username && <div className="invalid-feedback">{errors.username}</div>}
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ color: '#d1d5db' }}>Email</label>
              <input
                type="email"
                name="email"
                className={`form-control search-input ${errors.email ? 'is-invalid' : ''}`}
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
              />
              {errors.email && <div className="invalid-feedback">{errors.email}</div>}
            </div>
          )}

          <div className="mb-3">
            <label className="form-label" style={{ color: '#d1d5db' }}>Password</label>
            <input
              type="password"
              name="password"
              className={`form-control search-input ${errors.password ? 'is-invalid' : ''}`}
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Enter your password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>

          {!isLogin && (
            <div className="mb-3">
              <label className="form-label" style={{ color: '#d1d5db' }}>Confirm Password</label>
              <input
                type="password"
                name="password2"
                className={`form-control search-input ${errors.password2 ? 'is-invalid' : ''}`}
                value={formData.password2}
                onChange={handleInputChange}
                placeholder="Confirm your password"
              />
              {errors.password2 && <div className="invalid-feedback">{errors.password2}</div>}
            </div>
          )}

          <button 
            type="submit" 
            className="btn btn-green w-100 py-2 mb-3"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2" />
            ) : null}
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        <div className="text-center">
          <button 
            className="btn btn-link text-decoration-none"
            onClick={switchMode}
            style={{ color: '#00ff41' }}
          >
            {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
          </button>
        </div>
      </div>
    </div>
  );
}

// User Profile Page
function UserProfilePage({ user, onNavigate, onLogout }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [localUser, setLocalUser] = useState(user);

  if (!user) {
    return (
      <div className="text-center py-5">
        <h3 className="text-green mb-3">Please log in to view your profile</h3>
        <button className="btn btn-green" onClick={() => onNavigate('main')}>
          Go to Main Page
        </button>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage('File size must be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        setMessage('Please select an image file');
        return;
      }
      setAvatarFile(file);
      setMessage('');
    }
  };

  const handleAvatarUpload = async () => {
    if (!avatarFile) return;

    setUploading(true);
    setMessage('');

    const formData = new FormData();
    formData.append('avatar', avatarFile);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const data = await response.json();
        setLocalUser(data);
        setMessage('Avatar updated successfully!');
        setAvatarFile(null);
        
        // Refresh profile data
        const profileResponse = await fetch('http://127.0.0.1:8000/api/profile/', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setLocalUser(profileData);
        }
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to upload avatar');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch('http://127.0.0.1:8000/api/profile/', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setShowDeleteModal(false);
        onLogout();
        alert('Your account has been deleted successfully.');
      } else {
        const error = await response.json();
        setMessage(error.error || 'Failed to delete account');
      }
    } catch (err) {
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <>
      <button className="btn btn-green mb-4" onClick={() => onNavigate('main')}>
        ← Back to Main Page
      </button>

      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card-custom p-4">
            <div className="text-center mb-4">
              {localUser.avatar_url ? (
                <img src={localUser.avatar_url} alt={localUser.username} className="profile-avatar-img mx-auto mb-3" />
              ) : (
                <div className="user-avatar mx-auto mb-3">
                  {localUser.username.charAt(0).toUpperCase()}
                </div>
              )}
              <h2 className="text-green fs-3 fw-bold mb-2">{localUser.username}</h2>
              <p style={{ color: '#9ca3af' }}>{localUser.email}</p>
              <span className="badge bg-success">Astro Level {localUser.astro_level}</span>
            </div>

            {message && (
              <div className={`alert ${message.includes('success') ? 'alert-success' : 'alert-danger'} mb-3`}>
                {message}
              </div>
            )}

            <div className="border-top border-custom pt-4 mt-4">
              <h3 className="fs-5 fw-bold mb-3">Change Avatar</h3>
              <div className="row g-3 align-items-end">
                <div className="col-md-8">
                  <input 
                    type="file" 
                    className="form-control search-input"
                    accept="image/*"
                    onChange={handleAvatarChange}
                  />
                  <small style={{ color: '#9ca3af' }}>Max file size: 5MB. Supported: JPG, PNG, GIF</small>
                </div>
                <div className="col-md-4">
                  <button 
                    className="btn btn-green w-100"
                    onClick={handleAvatarUpload}
                    disabled={!avatarFile || uploading}
                  >
                    {uploading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" />
                        Uploading...
                      </>
                    ) : (
                      'Upload Avatar'
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="border-top border-custom pt-4 mt-4">
              <h3 className="fs-5 fw-bold mb-3">Account Information</h3>
              
              <div className="row g-3">
                <div className="col-md-6">
                  <div className="p-3" style={{ backgroundColor: '#0a0e1a', borderRadius: '8px' }}>
                    <div className="stat-label">Username</div>
                    <div className="stat-value">{localUser.username}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3" style={{ backgroundColor: '#0a0e1a', borderRadius: '8px' }}>
                    <div className="stat-label">Email</div>
                    <div className="stat-value">{localUser.email}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3" style={{ backgroundColor: '#0a0e1a', borderRadius: '8px' }}>
                    <div className="stat-label">Member Since</div>
                    <div className="stat-value">{formatDate(localUser.date_joined)}</div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="p-3" style={{ backgroundColor: '#0a0e1a', borderRadius: '8px' }}>
                    <div className="stat-label">Role</div>
                    <div className="stat-value text-green">{localUser.role}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-top border-custom pt-4 mt-4 text-center">
              <button 
                className="btn btn-outline-light me-3"
                onClick={onLogout}
              >
                Logout
              </button>
              <button 
                className="btn btn-outline-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="auth-modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="auth-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '400px' }}>
            <button className="auth-modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            
            <div className="text-center mb-4">
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>⚠️</div>
              <h2 className="text-danger fs-4 fw-bold mb-2">Delete Account?</h2>
              <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>
                This action cannot be undone. All your data will be permanently deleted.
              </p>
            </div>

            <div className="d-flex gap-3">
              <button 
                className="btn btn-outline-light flex-fill"
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn btn-danger flex-fill"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Main Page
function MainPage({ onNavigate }) {
  const [moonData, setMoonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch moon data');
        return res.json();
      })
      .then(data => {
        setMoonData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <div className="card-custom p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <span style={{ fontSize: '1.5rem' }}>🌙</span>
              <h2 className="fs-4 fw-bold mb-0">Current Moon Phase</h2>
            </div>
            
            <div className="moon-container p-3">
              {loading ? (
                <div style={{ color: '#9ca3af' }}>Loading moon phase...</div>
              ) : error ? (
                <div className="text-danger">Error: {error}</div>
              ) : moonData ? (
                <img
                  src={moonData.moon_image_url}
                  alt="Current Moon Phase"
                  className="moon-image"
                />
              ) : null}
            </div>

            {moonData && (
              <div className="text-center mt-4">
                {moonData.moon_phase_name && typeof moonData.moon_phase_name === 'string' && (
                  <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    {moonData.moon_phase_name}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="col-lg-6">
          <div className="card-custom p-4">
            <div className="d-flex align-items-center gap-2 mb-4">
              <div className="logo-circle" style={{ width: '24px', height: '24px' }}>
                <div className="logo-inner" style={{ width: '12px', height: '12px' }}></div>
              </div>
              <h2 className="fs-4 fw-bold mb-0">About</h2>
            </div>

            <h1 className="display-5 fw-bold text-green mb-4">
              PULSAR — The Virtual Astrophysics Club
            </h1>

            <p className="mb-4" style={{ color: '#d1d5db', lineHeight: '1.6' }}>
              Explore the universe. Connect with explorers. Learn from the stars.
            </p>

            <div className="mt-5 pt-4 border-top border-custom">
              <p style={{ color: '#9ca3af', fontSize: '0.875rem' }} className="mb-0">
                Made by Klymenko Fedir & Morales Daniel
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="nav-card" onClick={() => onNavigate('apod')}>
            <span className="nav-icon">🌌</span>
            <h3>Astronomy Picture</h3>
            <p>View NASA's daily space image</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="nav-card" onClick={() => onNavigate('asteroids')}>
            <span className="nav-icon">☄️</span>
            <h3>Near Earth Asteroids</h3>
            <p>Track asteroids passing by Earth</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="nav-card" onClick={() => onNavigate('launches')}>
            <span className="nav-icon">🚀</span>
            <h3>Upcoming Launches</h3>
            <p>See scheduled space missions</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="nav-card" onClick={() => onNavigate('forum')}>
            <span className="nav-icon">💬</span>
            <h3>Community Forum</h3>
            <p>Discuss space topics with others</p>
          </div>
        </div>
      </div>
    </>
  );
}

// APOD Page
function ApodPage({ onNavigate }) {
  const [apod, setApod] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/feed/apod/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch APOD');
        return res.json();
      })
      .then(data => {
        setApod(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <button className="btn btn-green mb-4" onClick={() => onNavigate('main')}>
        ← Back to Main Page
      </button>

      <div className="card-custom p-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <span style={{ fontSize: '1.5rem' }}>🌌</span>
          <h2 className="fs-4 fw-bold mb-0">Astronomy Picture of the Day</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : apod ? (
          <>
            <h3 className="text-green fs-5 fw-bold mb-3">{apod.title}</h3>
            
            <div className="mb-3">
              <span className="date-text">{apod.date}</span>
              {apod.copyright && (
                <span className="copyright-text ms-3">© {apod.copyright}</span>
              )}
            </div>

            {apod.media_type === 'image' && (
              <a href={apod.hdurl} target="_blank" rel="noopener noreferrer">
                <img 
                  src={apod.url} 
                  alt={apod.title}
                  className="apod-image mb-3"
                />
              </a>
            )}

            {apod.media_type === 'video' && (
              <div className="ratio ratio-16x9 mb-3">
                <iframe 
                  src={apod.url}
                  title={apod.title}
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                ></iframe>
              </div>
            )}

            <p className="explanation-text mb-0">{apod.explanation}</p>
          </>
        ) : null}
      </div>
    </>
  );
}

// Asteroids Page
function AsteroidsPage({ onNavigate }) {
  const [asteroidsData, setAsteroidsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/feed/asteroids/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch asteroids data');
        return res.json();
      })
      .then(data => {
        setAsteroidsData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatNumber = (num) => {
    return parseFloat(num).toLocaleString('en-US', { maximumFractionDigits: 0 });
  };

  return (
    <>
      <button className="btn btn-green mb-4" onClick={() => onNavigate('main')}>
        ← Back to Main Page
      </button>

      <div className="card-custom p-4">
        <div className="d-flex align-items-center justify-content-between mb-4">
          <div className="d-flex align-items-center gap-2">
            <span style={{ fontSize: '1.5rem' }}>☄️</span>
            <h2 className="fs-4 fw-bold mb-0">Near Earth Asteroids</h2>
          </div>
          {asteroidsData && (
            <span className="text-green fw-bold">
              {asteroidsData.asteroids_count} today
            </span>
          )}
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : asteroidsData ? (
          <>
            <div className="date-text mb-3">Date: {asteroidsData.date}</div>

            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
              {asteroidsData.asteroids.map((asteroid, index) => (
                <div 
                  key={index} 
                  className={`asteroid-item ${asteroid.is_hazardous ? 'asteroid-hazardous' : ''}`}
                >
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <h5 className="text-green mb-0 fs-6">{asteroid.name}</h5>
                    <span className={asteroid.is_hazardous ? 'badge-hazardous' : 'badge-safe'}>
                      {asteroid.is_hazardous ? 'HAZARDOUS' : 'SAFE'}
                    </span>
                  </div>

                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <div className="stat-label">Diameter</div>
                      <div className="stat-value">{asteroid.diameter_meters.toFixed(1)} m</div>
                    </div>
                    <div className="col-6">
                      <div className="stat-label">Velocity</div>
                      <div className="stat-value">{formatNumber(asteroid.velocity_kmh)} km/h</div>
                    </div>
                    <div className="col-12">
                      <div className="stat-label">Miss Distance</div>
                      <div className="stat-value">{formatNumber(asteroid.miss_distance_km)} km</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}

// Launches Page
function LaunchesPage({ onNavigate }) {
  const [launches, setLaunches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/feed/launches/')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch launches data');
        return res.json();
      })
      .then(data => {
        setLaunches(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    }) + ' UTC';
  };

  return (
    <>
      <button className="btn btn-green mb-4" onClick={() => onNavigate('main')}>
        ← Back to Main Page
      </button>

      <div className="card-custom p-4">
        <div className="d-flex align-items-center gap-2 mb-4">
          <span style={{ fontSize: '1.5rem' }}>🚀</span>
          <h2 className="fs-4 fw-bold mb-0">Upcoming Launches</h2>
        </div>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : error ? (
          <div className="alert alert-danger">{error}</div>
        ) : launches.length > 0 ? (
          <div style={{ maxHeight: '700px', overflowY: 'auto' }}>
            {launches.map((launch, index) => (
              <div key={index} className="launch-item">
                {launch.image && (
                  <img 
                    src={launch.image} 
                    alt={launch.mission_name}
                    className="launch-image"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                )}
                
                <div className="p-3">
                  <h5 className="text-green mb-2 fs-6 fw-bold">
                    {launch.mission_name}
                  </h5>

                  <div className="mb-2">
                    <span className="rocket-badge">{launch.rocket}</span>
                  </div>

                  <div className="date-time mb-2">
                    📅 {formatDate(launch.date_utc)} • {formatTime(launch.date_utc)}
                  </div>

                  <div className="location-text mb-2">
                    📍 {launch.location}
                  </div>

                  {launch.details && (
                    <p className="details-text mb-0">
                      {launch.details}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted py-4">
            No upcoming launches found
          </div>
        )}
      </div>
    </>
  );
}

export default App;