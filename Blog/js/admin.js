const BACKEND_URL = 'http://localhost:3000';

// Authentication Check
const token = localStorage.getItem('token');
if (!token) {
    alert('Unauthorized access. Please log in as an admin.');
    window.location.href = 'login.html';
}

// Dashboard Elements
const totalBlogs = document.getElementById('totalBlogs');
const totalComments = document.getElementById('totalComments');
const totalLikes = document.getElementById('totalLikes');
const blogsTable = document.getElementById('blogsTable');
const blogForm = document.getElementById('blogForm');
const blogModal = new bootstrap.Modal(document.getElementById('blogModal'));

// Fetch Analytics Overview
async function fetchDashboardStats() {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();

        if (response.ok) {
            totalBlogs.textContent = data.totalBlogs;
            totalComments.textContent = data.totalComments;
            totalLikes.textContent = data.totalLikes;
        } else {
            alert('Failed to load dashboard stats');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Fetch Blogs
async function fetchBlogs() {
    try {
        const response = await fetch(`${BACKEND_URL}/blogs`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const blogs = await response.json();

        blogsTable.innerHTML = blogs.map(blog => `
            <tr>
                <td>${blog.id}</td>
                <td>${blog.title}</td>
                <td>
                    <button class="btn btn-sm btn-warning" onclick="editBlog(${blog.id})">Edit</button>
                    <button class="btn btn-sm btn-danger" onclick="deleteBlog(${blog.id})">Delete</button>
                </td>
            </tr>
        `).join('');
    } catch (error) {
        console.error('Error fetching blogs:', error);
    }
}

// Create or Edit Blog
blogForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const id = document.getElementById('blogId').value;
    const title = document.getElementById('title').value;
    const content = document.getElementById('content').value;

    const method = id ? 'PUT' : 'POST';
    const url = id ? `${BACKEND_URL}/blogs/${id}` : `${BACKEND_URL}/blogs`;

    await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ title, content })
    });

    blogModal.hide();
    fetchBlogs();
});

// Delete Blog
async function deleteBlog(id) {
    await fetch(`${BACKEND_URL}/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    fetchBlogs();
}

//const BACKEND_URL = 'http://localhost:3000';

// Authentication Check
//const token = localStorage.getItem('token');
if (!token) {
    alert('Unauthorized access. Please log in as an admin.');
    window.location.href = 'login.html';
}

// Dashboard Elements
const commentsTable = document.getElementById('commentsTable');

// Fetch Comments
async function fetchComments() {
    try {
        const response = await fetch(`${BACKEND_URL}/admin/comments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const comments = await response.json();

        if (response.ok) {
            commentsTable.innerHTML = comments.map(comment => `
                <tr>
                    <td>${comment.id}</td>
                    <td>${comment.blogTitle}</td>
                    <td>${comment.user}</td>
                    <td>${comment.comment}</td>
                    <td>
                        <button class="btn btn-sm btn-danger" onclick="deleteComment(${comment.id})">Delete</button>
                    </td>
                </tr>
            `).join('');
        } else {
            commentsTable.innerHTML = '<tr><td colspan="5">Failed to load comments.</td></tr>';
        }
    } catch (error) {
        console.error('Error fetching comments:', error);
    }
}

// Delete Comment
async function deleteComment(commentId) {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
        const response = await fetch(`${BACKEND_URL}/admin/comments/${commentId}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });

        const result = await response.json();

        if (response.ok) {
            alert('Comment deleted successfully!');
            fetchComments();
        } else {
            alert(result.message || 'Failed to delete comment.');
        }
    } catch (error) {
        console.error('Error deleting comment:', error);
    }
}

// Initialize Dashboard
fetchComments();

// Initialize Dashboard
fetchDashboardStats();
fetchBlogs();
