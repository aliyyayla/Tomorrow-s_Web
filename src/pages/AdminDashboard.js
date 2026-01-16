// src/pages/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI, postsAPI, contactAPI } from '../services/api';
import '../styles/Admin.css';

function AdminDashboard() {
  const [posts, setPosts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('posts'); // 'posts' or 'contacts'
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication
    if (!authAPI.isAuthenticated()) {
      navigate('/admin/login');
      return;
    }

    // Get admin username from localStorage or use default
    const adminUsername = localStorage.getItem('adminUsername') || 'Admin';
    setUser({ username: adminUsername });
    loadPosts();
    loadContacts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const loadPosts = async () => {
    try {
      const data = await postsAPI.getAll();
      setPosts(data);
    } catch (err) {
      console.error('Failed to load posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const data = await contactAPI.getAll();
      setContacts(data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postsAPI.delete(id);
        setPosts(posts.filter(post => post._id !== id));
      } catch (err) {
        alert('Failed to delete post');
      }
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact submission?')) {
      try {
        await contactAPI.delete(id);
        setContacts(contacts.filter(contact => contact._id !== id));
      } catch (err) {
        alert('Failed to delete contact');
      }
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactAPI.markAsRead(id);
      setContacts(contacts.map(contact => 
        contact._id === id ? { ...contact, read: true } : contact
      ));
    } catch (err) {
      alert('Failed to mark as read');
    }
  };

  const handleLogout = () => {
    authAPI.logout();
    navigate('/admin/login');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="admin-loading">Loading...</div>;
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>Dashboard</h1>
          <div className="admin-header-actions">
            <span className="admin-user-info">👋 {user?.username}</span>
            <Link to="/admin/posts/new" className="btn-primary">
              + New Post
            </Link>
            <button onClick={handleLogout} className="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="admin-stats">
          <div className="stat-card">
            <h3>{posts.length}</h3>
            <p>Total Posts</p>
          </div>
          <div className="stat-card">
            <h3>{posts.filter(p => new Date(p.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length}</h3>
            <p>Posts This Week</p>
          </div>
          <div className="stat-card">
            <h3>{contacts.length}</h3>
            <p>Total Contacts</p>
          </div>
          <div className="stat-card">
            <h3>{contacts.filter(c => !c.read).length}</h3>
            <p>Unread Messages</p>
          </div>
        </div>

        <div className="dashboard-tabs">
          <button 
            className={`tab-button ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button 
            className={`tab-button ${activeTab === 'contacts' ? 'active' : ''}`}
            onClick={() => setActiveTab('contacts')}
          >
            Contact Messages {contacts.filter(c => !c.read).length > 0 && (
              <span className="badge">{contacts.filter(c => !c.read).length}</span>
            )}
          </button>
        </div>

        {activeTab === 'posts' && (
          <div className="posts-section">
            <h2>All Posts</h2>
            {posts.length === 0 ? (
              <div className="no-posts">
                <p>No posts yet. Create your first one!</p>
                <Link to="/admin/posts/new" className="btn-primary">
                  Create Post
                </Link>
              </div>
            ) : (
              <div className="posts-table">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Date</th>
                      <th>Author</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {posts.map(post => (
                      <tr key={post._id}>
                        <td>
                          <strong>{post.title}</strong>
                          <br />
                          <span className="post-excerpt">{post.excerpt.substring(0, 60)}...</span>
                        </td>
                        <td>
                          <span className="category-badge">{post.category}</span>
                        </td>
                        <td>{formatDate(post.createdAt)}</td>
                        <td>{post.author?.username}</td>
                        <td>
                          <div className="action-buttons">
                            <Link to={`/admin/posts/edit/${post._id}`} className="btn-edit">
                              Edit
                            </Link>
                            <button onClick={() => handleDelete(post._id)} className="btn-delete">
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div className="contacts-section">
            <h2>Contact Messages</h2>
            {contacts.length === 0 ? (
              <div className="no-posts">
                <p>No contact messages yet.</p>
              </div>
            ) : (
              <div className="contacts-list">
                {contacts.map(contact => (
                  <div 
                    key={contact._id} 
                    className={`contact-item ${!contact.read ? 'unread' : ''}`}
                  >
                    <div className="contact-header">
                      <div className="contact-info">
                        <strong>{contact.name}</strong>
                        <span className="contact-email">{contact.email}</span>
                        <span className="contact-date">{formatDate(contact.createdAt)}</span>
                        {!contact.read && <span className="unread-badge">New</span>}
                      </div>
                      <div className="contact-actions">
                        {!contact.read && (
                          <button 
                            onClick={() => handleMarkAsRead(contact._id)} 
                            className="btn-mark-read"
                          >
                            Mark as Read
                          </button>
                        )}
                        <button 
                          onClick={() => handleDeleteContact(contact._id)} 
                          className="btn-delete"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="contact-message">
                      <p>{contact.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;