import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';
import './App.css';

// Import admin components
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PostEditor from './pages/PostEditor';
import ProtectedRoute from './components/ProtectedRoute';

// Import API
import { postsAPI, contactAPI } from './services/api';

// Import images
import techImage from './images/tech.jpg';
import designImage from './images/design.jpg';
import lifestyleImage from './images/lifestyle.jpg';
import businessImage from './images/business.jpg';
import travelImage from './images/travel.jpg';
import foodImage from './images/food.jpg';
import growthImage from './images/growth.jpg';
import lensIcon from './images/lens-icon.png';

// Helper function to get image - uploaded image or category fallback
const getPostImage = (post) => {
  // If post has uploaded image, use it
  if (post.imageUrl) {
    const baseUrl = process.env.REACT_APP_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}${post.imageUrl}`;
  }
  
  // Otherwise use category image
  const categoryMap = {
    'Technology': techImage,
    'Design': designImage,
    'Lifestyle': lifestyleImage,
    'Business': businessImage,
    'Travel': travelImage,
    'Food': foodImage,
    'Personal Growth': growthImage
  };
  return categoryMap[post.category] || techImage;
};

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Reading Progress Bar Component
function ReadingProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateProgress = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setProgress(scrollPercent);
    };

    window.addEventListener('scroll', updateProgress);
    return () => window.removeEventListener('scroll', updateProgress);
  }, []);

  return (
    <div className="reading-progress-bar" style={{ width: `${progress}%` }} />
  );
}

// Navigation Component with Search (SIMPLE - NO LOGIN/SIGNUP)
function Navigation({ posts = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setShowResults(e.target.value.length > 0);
  };

  const handleResultClick = (postId) => {
    navigate(`/article/${postId}`);
    setSearchTerm('');
    setShowResults(false);
    setMobileMenuOpen(false);
  };

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="nav">
      <ReadingProgressBar />
      <div className="nav-container">
        <div className="nav-brand">
          <Link to="/" className="logo" onClick={handleLinkClick}>
            <img src={lensIcon} alt="The Lens" style={{ height: '32px', marginRight: '10px', verticalAlign: 'middle' }} />
            The Lens
          </Link>
          <button 
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={mobileMenuOpen ? 'hamburger open' : 'hamburger'}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </button>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search articles..."
            value={searchTerm}
            onChange={handleSearch}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            onFocus={() => searchTerm.length > 0 && setShowResults(true)}
          />
          <span className="search-icon">🔍</span>
          
          {showResults && filteredPosts.length > 0 && (
            <div className="search-results">
              {filteredPosts.map(post => (
                <div
                  key={post._id || post.id}
                  className="search-result-item"
                  onClick={() => handleResultClick(post._id || post.id)}
                >
                  <div className="search-result-category">{post.category}</div>
                  <div className="search-result-title">{post.title}</div>
                  <div className="search-result-excerpt">{post.excerpt.substring(0, 80)}...</div>
                </div>
              ))}
            </div>
          )}
          
          {showResults && filteredPosts.length === 0 && (
            <div className="search-results">
              <div className="search-no-results">No articles found</div>
            </div>
          )}
        </div>

        <div className={`nav-content ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <ul className="nav-links">
            <li><Link to="/" onClick={handleLinkClick}>Home</Link></li>
            <li><Link to="/articles" onClick={handleLinkClick}>Articles</Link></li>
            <li><Link to="/about" onClick={handleLinkClick}>About</Link></li>
            <li><Link to="/contact" onClick={handleLinkClick}>Contact</Link></li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

// Footer Component
function Footer() {
  return (
    <footer>
      <p>&copy; 2025 The Lens. All rights reserved.</p>
      <p>Exploring perspectives through thoughtful writing</p>
    </footer>
  );
}

// Home Page Component
function HomePage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <section className="hero">
          <h1>Welcome to The Lens</h1>
          <p>Exploring perspectives through thoughtful writing and meaningful stories</p>
        </section>
        <div className="container">
          <p style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#5D4E46' }}>
            Loading articles...
          </p>
        </div>
      </>
    );
  }

  if (posts.length === 0) {
    return (
      <>
        <section className="hero">
          <h1>Welcome to The Lens</h1>
          <p>Exploring perspectives through thoughtful writing and meaningful stories</p>
        </section>
        <div className="container">
          <p style={{ textAlign: 'center', padding: '3rem', fontSize: '1.2rem', color: '#5D4E46' }}>
            No articles yet. Check back soon!
          </p>
        </div>
      </>
    );
  }

  const featuredPost = posts[0];
  const recentPosts = posts.slice(1);

  return (
    <>
      <section className="hero">
        <h1>Welcome to The Lens</h1>
        <p>Exploring perspectives through thoughtful writing and meaningful stories</p>
      </section>

      <div className="container">
        <h2 className="section-title">Featured Article</h2>
        <article className="featured-post">
          <div className="featured-image">
            <img 
              src={getPostImage(featuredPost)} 
              alt={featuredPost.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div className="featured-content">
            <span className="tag">{featuredPost.category}</span>
            <h2>{featuredPost.title}</h2>
            <p>{featuredPost.excerpt}</p>
            <Link to={`/article/${featuredPost._id}`} className="read-more">
              Read Article →
            </Link>
          </div>
        </article>

        {recentPosts.length > 0 && (
          <>
            <h2 className="section-title">Recent Articles</h2>
            <div className="blog-grid">
              {recentPosts.map((post) => (
                <Link to={`/article/${post._id}`} key={post._id} className="blog-card">
                  <div className="card-image">
                    <img 
                      src={getPostImage(post)} 
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <div className="card-content">
                    <span className="tag">{post.category}</span>
                    <h3>{post.title}</h3>
                    <p>{post.excerpt}</p>
                    <div className="card-meta">
                      <span>{post.readTime}</span>
                      <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </>
  );
}

// Articles Page Component
function ArticlesPage() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container">
        <h1 className="page-title">All Articles</h1>
        <p style={{ textAlign: 'center', padding: '3rem' }}>Loading articles...</p>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="container">
        <h1 className="page-title">All Articles</h1>
        <p style={{ textAlign: 'center', padding: '3rem' }}>No articles yet. Check back soon!</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="page-title">All Articles</h1>
      <div className="blog-grid">
        {posts.map((post) => (
          <Link to={`/article/${post._id}`} key={post._id} className="blog-card">
            <div className="card-image">
              <img 
                src={getPostImage(post)} 
                alt={post.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <div className="card-content">
              <span className="tag">{post.category}</span>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="card-meta">
                <span>{post.readTime}</span>
                <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// About Page Component
function AboutPage() {
  return (
    <div className="container">
      <div className="page-content">
        <h1 className="page-title">About The Lens</h1>
        <p className="page-subtitle">
          Exploring the world through different perspectives
        </p>
        <div className="about-content">
          <p>
            Welcome to The Lens, a space where ideas meet curiosity and stories unfold with purpose. 
            This blog is dedicated to exploring diverse perspectives on technology, design, lifestyle, 
            and everything in between.
          </p>
          <p>
            Through thoughtful writing and meaningful conversations, we aim to shed light on the 
            topics that matter, offering fresh insights and inspiring new ways of thinking.
          </p>
          <p>
            Whether you're here to learn something new, find inspiration, or simply enjoy a good read, 
            we're glad you're part of this journey.
          </p>
        </div>
      </div>
    </div>
  );
}

// Contact Page Component
function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await contactAPI.submit(formData);
      setSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      // Clear success message after 5 seconds
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      setError(err.message || 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="page-content">
        <h1 className="page-title">Get In Touch</h1>
        <p className="page-subtitle">
          Have a question or want to collaborate? We'd love to hear from you.
        </p>
        <form className="contact-form" onSubmit={handleSubmit}>
          {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
          {success && <div className="success-message" style={{ color: 'green', marginBottom: '1rem' }}>Thank you for your message! We'll get back to you soon.</div>}
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your.email@example.com" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="message">Message</label>
            <textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="5" 
              placeholder="Tell us what's on your mind..."
              required
            ></textarea>
          </div>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}

// Article Detail Page Component with Simple Like/Unlike (NO LOGIN REQUIRED)
function ArticleDetailPage() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });
  const [submitStatus, setSubmitStatus] = useState('');

  useEffect(() => {
    fetchPost();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${API_URL}/posts/${id}`);
      const data = await response.json();
      setPost(data);
      setLikes(data.likes || 0);
      setComments(data.comments || []);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      if (hasLiked) {
        // Unlike
        const result = await postsAPI.unlikePost(id);
        setLikes(result.likes);
        setHasLiked(false);
      } else {
        // Like
        const result = await postsAPI.likePost(id);
        setLikes(result.likes);
        setHasLiked(true);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    const newComment = {
      name: commentForm.name,
      comment: commentForm.comment,
      createdAt: new Date()
    };
    setComments([...comments, newComment]);
    setCommentForm({ name: '', comment: '' });
    setSubmitStatus('Comment posted successfully!');
    setTimeout(() => setSubmitStatus(''), 3000);
  };

  if (loading) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '3rem' }}>Loading article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container">
        <p style={{ textAlign: 'center', padding: '3rem' }}>Article not found</p>
      </div>
    );
  }

  return (
    <div className="container">
      <article className="article-detail">
        <header className="article-header">
          <span className="tag">{post.category}</span>
          <h1>{post.title}</h1>
          <div className="article-meta">
            <span>By {post.author?.username || 'Admin'}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </header>

        <div className="article-image">
          <img 
            src={getPostImage(post)} 
            alt={post.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }}
          />
        </div>

        <div className="article-content">
          <div dangerouslySetInnerHTML={{ __html: post.content.replace(/\n/g, '<br/>') }} />
        </div>

        <div className="comments-section">
          <div className="comments-header">
            <h2>
              💬 Comments ({comments.length})
            </h2>
            
            {/* Like Button */}
            <button 
              className={`like-button ${hasLiked ? 'liked' : ''}`} 
              onClick={handleLike}
            >
              <span className="heart-icon">{hasLiked ? '❤️' : '🤍'}</span>
              <span className="like-count">{likes} {likes === 1 ? 'Like' : 'Likes'}</span>
            </button>
          </div>

          {/* Comment Form */}
          <form className="comment-form" onSubmit={handleCommentSubmit}>
            <h3>Leave a Comment</h3>
            {submitStatus && <div className="submit-success">{submitStatus}</div>}
            
            <div className="form-group">
              <input
                type="text"
                placeholder="Your Name"
                value={commentForm.name}
                onChange={(e) => setCommentForm({...commentForm, name: e.target.value})}
                required
              />
            </div>
            
            <div className="form-group">
              <textarea
                placeholder="Your thoughts..."
                rows="4"
                value={commentForm.comment}
                onChange={(e) => setCommentForm({...commentForm, comment: e.target.value})}
                required
              />
            </div>
            
            <button type="submit" className="submit-comment-btn">
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div className="comments-list">
            {comments.length === 0 ? (
              <p className="no-comments">No comments yet. Be the first to share your thoughts!</p>
            ) : (
              comments.map((comment, index) => (
                <div key={index} className="comment-item">
                  <div className="comment-header">
                    <strong className="comment-author">{comment.name}</strong>
                    <span className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                  <p className="comment-text">{comment.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

// Main App Component
function App() {
  const [allPosts, setAllPosts] = useState([]);

  useEffect(() => {
    fetchAllPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllPosts = async () => {
    try {
      const response = await fetch(`${API_URL}/posts`);
      const data = await response.json();
      setAllPosts(data);
    } catch (error) {
      console.error('Error fetching posts for search:', error);
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<><Navigation posts={allPosts} /><HomePage /><Footer /></>} />
          <Route path="/articles" element={<><Navigation posts={allPosts} /><ArticlesPage /><Footer /></>} />
          <Route path="/about" element={<><Navigation posts={allPosts} /><AboutPage /><Footer /></>} />
          <Route path="/contact" element={<><Navigation posts={allPosts} /><ContactPage /><Footer /></>} />
          <Route path="/article/:id" element={<><Navigation posts={allPosts} /><ArticleDetailPage /><Footer /></>} />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/posts/new" 
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/posts/edit/:id" 
            element={
              <ProtectedRoute>
                <PostEditor />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;