// src/services/api.js
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Auth API (Admin only)
export const authAPI = {
  async register(userData) {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async login(credentials) {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    
    // Store token and username
    localStorage.setItem('token', data.token);
    localStorage.setItem('adminUsername', data.user?.username || 'Admin');
    return data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminUsername');
  },

  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

// Posts API
export const postsAPI = {
  async getAll() {
    const res = await fetch(`${API_URL}/posts`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getOne(id) {
    const res = await fetch(`${API_URL}/posts/${id}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async create(postData) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async createWithImage(formData) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/posts`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async update(id, postData) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(postData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async updateWithImage(id, formData) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
        // Don't set Content-Type for FormData - browser will set it with boundary
      },
      body: formData
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async delete(id) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async likePost(postId) {
    const res = await fetch(`${API_URL}/posts/${postId}/like`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async unlikePost(postId) {
    const res = await fetch(`${API_URL}/posts/${postId}/unlike`, {
      method: 'POST'
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
};

// Contact API
export const contactAPI = {
  async submit(contactData) {
    const res = await fetch(`${API_URL}/contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contactData)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async getAll() {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/contacts`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async markAsRead(id) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/contacts/${id}/read`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  },

  async delete(id) {
    const token = authAPI.getToken();
    const res = await fetch(`${API_URL}/contacts/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message);
    return data;
  }
};